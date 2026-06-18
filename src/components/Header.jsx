import backIcon from "../assets/icon-back.png";

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
            padding: 0,
          }}
        >
          <img
            src={backIcon}
            alt="뒤로가기"
            style={{ width: "20px", height: "20px" }}
          />
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
