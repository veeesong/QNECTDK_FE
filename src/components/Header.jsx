function Header({ title, onBack, rightButton }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 0",
        marginBottom: "8px",
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: "absolute",
            left: 0,
            border: "none",
            background: "none",
            fontSize: "18px",
          }}
        >
          ←
        </button>
      )}
      <span style={{ fontSize: "18px", fontWeight: "bold" }}>{title}</span>
      {rightButton && (
        <div style={{ position: "absolute", right: 0 }}>{rightButton}</div>
      )}
    </div>
  );
}

export default Header;
