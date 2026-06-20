import { useNavigate } from "react-router-dom";
import {
  NavContainer,
  NavBtn,
  NavIcon,
  QrBtn,
} from "../styles/styledBottomNav";

function BottomNav() {
  const navigate = useNavigate();

  return (
    <NavContainer>
      <NavBtn onClick={() => navigate("/home")}>
        <NavIcon src="/images/nav-home.svg" alt="홈" />
      </NavBtn>

      <NavBtn onClick={() => navigate("/friend-list")}>
        <NavIcon src="/images/nav-friend.svg" alt="친구" />
      </NavBtn>

      <QrBtn onClick={() => navigate("/qr-code")}>
        <img
          src="/images/nav-qr.svg"
          alt="QR코드"
          style={{ width: "32px", height: "32px" }}
        />
      </QrBtn>

      <NavBtn onClick={() => navigate("/quiz")}>
        <NavIcon src="/images/nav-quiz.svg" alt="퀴즈" />
      </NavBtn>

      <NavBtn onClick={() => navigate("/mypage")}>
        <NavIcon src="/images/nav-profile.svg" alt="프로필" />
      </NavBtn>
    </NavContainer>
  );
}

export default BottomNav;
