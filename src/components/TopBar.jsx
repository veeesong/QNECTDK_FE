import { useNavigate } from "react-router-dom";
import logoSmall from "../assets/logo-small.png";
import bellIcon from "../assets/icon-bell.png";
import scanIcon from "../assets/icon-scan.png";

function TopBar() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 0",
      }}
    >
      <img src={logoSmall} alt="Qnect" style={{ height: "28px" }} />
      <div style={{ display: "flex", gap: "16px" }}>
        <img
          src={bellIcon}
          alt="알림"
          onClick={() => navigate("/notification")}
          style={{ width: "22px", height: "22px", cursor: "pointer" }}
        />
        <img
          src={scanIcon}
          alt="QR 스캔"
          style={{ width: "22px", height: "22px", cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

export default TopBar;
