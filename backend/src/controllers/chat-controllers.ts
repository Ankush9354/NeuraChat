import { NextFunction, Request, Response } from "express";

import User from "../models/User.js";

import { configureGemini } from "../config/openai-config.js";

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;

  try {
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    }

    // Get previous chats
    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    }));

    // Add current user message
    chats.push({
      role: "user",
      content: message,
    });

    // Configure Gemini
    const genAI = configureGemini();

    const model = genAI.getGenerativeModel({
      model: "gemini-3.8-flash",
    });

    // Convert previous chats into Gemini format
    const history = chats.slice(0, -1).map((chat) => ({
      role: chat.role === "assistant" ? "model" : "user",
      parts: [{ text: chat.content }],
    }));

    // Start Gemini chat
    const chat = model.startChat({
      history,
    });

    // Retry Gemini request if temporary 503 happens
    let result;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(
          `Sending message to Gemini... Attempt ${attempt}/${maxRetries}`
        );

        result = await chat.sendMessage(message);

        break;
      } catch (error) {
        const status = (error as any)?.status;

        // Gemini is temporarily busy
        if (status === 503 && attempt < maxRetries) {
          const delay = 1000 * attempt;

          console.log(
            `Gemini is busy. Retrying in ${delay / 1000} seconds...`
          );

          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        throw error;
      }
    }

    if (!result) {
      throw new Error("Gemini did not return a response");
    }

    const response = result.response.text();

    // Save user message
    user.chats.push({
      role: "user",
      content: message,
    });

    // Save Gemini response
    user.chats.push({
      role: "assistant",
      content: response,
    });

    await user.save();

    return res.status(200).json({
      chats: user.chats,
    });
  } catch (error) {
    console.error("========== CHAT ERROR ==========");
    console.error(error);
    console.error("================================");

    const status = (error as any)?.status;

    // Gemini temporary overload
    if (status === 503) {
      return res.status(503).json({
        message:
          "Gemini is temporarily busy. Please wait a few seconds and try again.",
      });
    }

    // Gemini quota exceeded
    if (status === 429) {
      return res.status(429).json({
        message:
          "Gemini API quota has been exceeded. Please try again later.",
      });
    }

    return res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // user token check
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }

    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }

    return res.status(200).json({
      message: "OK",
      chats: user.chats,
    });
  } catch (error) {
    console.log(error);

    return res.status(200).json({
      message: "ERROR",
      cause: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // user token check
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }

    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }

    // @ts-ignore
    user.chats = [];

    await user.save();

    return res.status(200).json({
      message: "OK",
    });
  } catch (error) {
    console.log(error);

    return res.status(200).json({
      message: "ERROR",
      cause: error instanceof Error ? error.message : "Unknown error",
    });
  }
};