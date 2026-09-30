

const Footer = () => {
  return (
    <footer>
      <div
        style={{
          width: "100%",
          minHeight: "20vh",
          maxHeight: "30vh",
          marginTop: 60,
        }}
      >
        <p style={{ fontSize: "22px", textAlign: "center", padding: "20px" }}>
         <span style={{ fontWeight: "bold" }}>NeuraChat</span>
          <br />
          <span style={{ fontSize: "16px", opacity: 0.7 }}>
            AI-powered conversations, simplified.
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;