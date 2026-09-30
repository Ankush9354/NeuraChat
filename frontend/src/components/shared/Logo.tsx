import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";

const Logo = () => {
  return (
    <div
      style={{
        display: "flex",
        marginRight: "auto",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <Link to={"/"}>
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: "#111827",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          N
        </div>
      </Link>

      <Typography
        sx={{
          display: { md: "block", sm: "none", xs: "none" },
          mr: "auto",
          fontWeight: "800",
          textShadow: "2px 2px 20px #000",
        }}
      >
        <span style={{ fontSize: "20px" }}>Neura</span>Chat
      </Typography>
    </div>
  );
};

export default Logo;