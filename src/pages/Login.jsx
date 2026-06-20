import PageLayout from "../components/PageLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import logo from "../assets/logo.png";
import { login } from "../api/auth";

function Login() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setErrorMessage("");

    if (!userId || !password) {
      setErrorMessage("아이디와 비밀번호를 입력해주세요");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login({ loginId: userId, password });

      const { accessToken, refreshToken } = result.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      navigate("/home");
    } catch (err) {
      console.error("로그인 실패", err);
      const serverMessage = err?.response?.data?.error?.message;
      setErrorMessage(
        serverMessage || "아이디 또는 비밀번호가 올바르지 않습니다",
      );
    } finally {
      setIsSubmitting(false);
    }
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

      {errorMessage && (
        <p style={{ color: "red", fontSize: "13px", marginTop: "8px" }}>
          {errorMessage}
        </p>
      )}

      <div style={{ marginTop: "24px" }}>
        <Button
          label={isSubmitting ? "로그인 중..." : "로그인"}
          onClick={handleLogin}
          variant="primary"
          size="full"
          disabled={isSubmitting}
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
