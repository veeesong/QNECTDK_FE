import PageLayout from "../components/PageLayout";
import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import logo from "../assets/logo.png";

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("로그인 시도", userId, password);
  };

  return (
    <PageLayout>
      <div style={{ textAlign: "center", margin: "60px 0" }}>
        <img src={logo} alt="Qnect 로고" width={150} />
      </div>

      <Input
        label="아이디"
        type="text"
        placeholder="아이디를 입력해주세요"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <Input
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력해주세요"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div style={{ marginTop: "24px" }}>
        <Button
          label="로그인"
          onClick={handleLogin}
          variant="primary"
          size="full"
        />
      </div>

      <p style={{ textAlign: "center", marginTop: "16px" }}>
        계정이 없으신가요?{" "}
        <a href="/signup" style={{ color: "var(--color-primary)" }}>
          회원가입
        </a>
      </p>
    </PageLayout>
  );
}

export default Login;
