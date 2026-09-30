
import { Box, Typography } from "@mui/material";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

type Props = {
  content: string;
  role: "user" | "assistant";
};

const ChatItem = ({ content, role }: Props) => {
  const isUser = role === "user";

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: isUser ? "flex-end" : "flex-start",
        px: { xs: 1, sm: 2, md: 4 },
        py: 1.2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isUser ? "row-reverse" : "row",
          alignItems: "flex-start",
          gap: 1.5,
          maxWidth: { xs: "94%", sm: "85%", md: "78%" },
        }}
      >
        {/* Avatar */}
        <Box
          sx={{
            width: 36,
            height: 36,
            minWidth: 36,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            background: isUser
              ? "linear-gradient(135deg, #2563eb, #3b82f6)"
              : "linear-gradient(135deg, #111827, #374151)",

            color: "#fff",
            fontSize: "14px",
            fontWeight: 700,

            border: "1px solid rgba(255,255,255,0.12)",

            boxShadow: isUser
              ? "0 4px 12px rgba(37,99,235,0.25)"
              : "0 4px 12px rgba(0,0,0,0.25)",
          }}
        >
          {isUser ? "U" : "N"}
        </Box>

        {/* Message Section */}
        <Box
          sx={{
            minWidth: 0,
            maxWidth: "100%",
          }}
        >
          {/* Sender name */}
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: isUser ? "#93c5fd" : "#9ca3af",
              mb: 0.6,
              px: 0.5,
              textAlign: isUser ? "right" : "left",
              letterSpacing: "0.2px",
            }}
          >
            {isUser ? "You" : "NeuraChat"}
          </Typography>

          {/* Message Bubble */}
          <Box
            sx={{
              px: { xs: 1.8, sm: 2.2 },
              py: 1.5,

              borderRadius: isUser
                ? "18px 18px 5px 18px"
                : "18px 18px 18px 5px",

              background: isUser
                ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                : "linear-gradient(135deg, #1f2937, #111827)",

              border: "1px solid rgba(255,255,255,0.08)",

              boxShadow: isUser
                ? "0 5px 18px rgba(37,99,235,0.18)"
                : "0 5px 18px rgba(0,0,0,0.20)",

              color: "#f9fafb",

              overflow: "hidden",
              wordBreak: "break-word",

              transition: "all 0.2s ease",

              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: isUser
                  ? "0 7px 22px rgba(37,99,235,0.25)"
                  : "0 7px 22px rgba(0,0,0,0.28)",
              },
            }}
          >
            {content.split("```").map((part, index) => {
              const isCode = index % 2 === 1;

              if (isCode) {
                const lines = part.split("\n");
                const language = lines[0]?.trim() || "text";
                const code = lines.slice(1).join("\n");

                return (
                  <Box key={index}>
                    {/* Code language */}
                    <Typography
                      sx={{
                        fontSize: "11px",
                        color: "#9ca3af",
                        mb: -0.5,
                        mt: 0.5,
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        fontWeight: 600,
                      }}
                    >
                      {language}
                    </Typography>

                    <SyntaxHighlighter
                      language={language}
                      style={atomOneDark}
                      customStyle={{
                        borderRadius: "10px",
                        padding: "16px",
                        marginTop: "8px",
                        marginBottom: "8px",
                        overflowX: "auto",
                        fontSize: "13px",
                        lineHeight: "1.6",
                      }}
                    >
                      {code}
                    </SyntaxHighlighter>
                  </Box>
                );
              }

              return (
                <Typography
                  key={index}
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    lineHeight: 1.75,
                    fontSize: { xs: "14px", sm: "15px" },
                    fontWeight: 400,
                    letterSpacing: "0.1px",
                    color: "#f3f4f6",
                  }}
                >
                  {part}
                </Typography>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatItem;