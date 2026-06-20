import PageLayout from "../components/PageLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import { signup, checkLoginId } from "../api/auth";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    birth: "",
    userId: "",
    password: "",
    passwordCheck: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  // 아이디 중복확인 결과를 저장 (null: 아직 확인 안 함, true: 사용 가능, false: 중복)
  const [idCheckResult, setIdCheckResult] = useState(null);
  const [idCheckMessage, setIdCheckMessage] = useState("");

  const [agreements, setAgreements] = useState({
    privacy: false,
    terms: false,
    marketing: false,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allAgreed =
    agreements.privacy && agreements.terms && agreements.marketing;

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });

    // 아이디를 다시 수정하면 중복확인 결과는 초기화 (재확인 유도)
    if (field === "userId") {
      setIdCheckResult(null);
      setIdCheckMessage("");
    }
  };

  const handleAgreeAll = (checked) => {
    setAgreements({ privacy: checked, terms: checked, marketing: checked });
  };

  // 생년월일 "03.04.23" 또는 "2003.04.23" 형식을 "2003-04-23"으로 변환
  const formatBirthDate = (birth) => {
    const parts = birth.split(".").map((p) => p.trim());
    if (parts.length !== 3) return birth; // 형식이 다르면 일단 그대로 반환

    let [year, month, day] = parts;
    if (year.length === 2) {
      year = "20" + year; // 두 자리면 2000년대로 가정
    }
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  // 아이디 중복확인 버튼
  const handleCheckId = async () => {
    if (!form.userId) {
      setIdCheckMessage("아이디를 입력해주세요");
      return;
    }
    try {
      const result = await checkLoginId(form.userId);
      const isAvailable = result?.data?.available;
      setIdCheckResult(isAvailable);
      setIdCheckMessage(
        isAvailable
          ? "사용 가능한 아이디입니다"
          : "이미 사용 중인 아이디입니다",
      );
    } catch (err) {
      console.error("아이디 중복확인 실패", err);
      setIdCheckMessage("중복확인 중 오류가 발생했습니다");
    }
  };

  const handleSignup = async () => {
    setErrorMessage("");

    // 기본 검증
    if (
      !form.name ||
      !form.phone ||
      !form.birth ||
      !form.userId ||
      !form.password
    ) {
      setErrorMessage("모든 항목을 입력해주세요");
      return;
    }
    if (form.password !== form.passwordCheck) {
      setErrorMessage("비밀번호가 일치하지 않습니다");
      return;
    }
    if (!agreements.privacy || !agreements.terms) {
      setErrorMessage("필수 약관에 동의해주세요");
      return;
    }
    if (idCheckResult !== true) {
      setErrorMessage("아이디 중복확인을 해주세요");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signup({
        loginId: form.userId,
        phone: form.phone.replace(/-/g, ""), // 하이픈 제거 (백엔드 예시가 01012345678 형태)
        password: form.password,
        name: form.name,
        birthDate: formatBirthDate(form.birth),
      });

      // 회원가입 성공 시 바로 토큰을 주므로 저장해두고 홈으로 이동
      const { accessToken, refreshToken } = result.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      navigate("/home");
    } catch (err) {
      console.error("회원가입 실패", err);
      const serverMessage = err?.response?.data?.error?.message;
      setErrorMessage(serverMessage || "회원가입 중 오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <Header title="회원가입" />

      <Input
        label="이름"
        placeholder="ex. 홍길동"
        value={form.name}
        onChange={handleChange("name")}
      />
      <Input
        label="전화번호"
        placeholder="ex. 010-0000-0000"
        value={form.phone}
        onChange={handleChange("phone")}
      />
      <Input
        label="생년월일"
        placeholder="ex. YY.MM.DD"
        value={form.birth}
        onChange={handleChange("birth")}
      />
      <Input
        label="아이디"
        placeholder="아이디영문,숫자 조합(8~12자)"
        value={form.userId}
        onChange={handleChange("userId")}
        rightElement={
          <button
            onClick={handleCheckId}
            style={{
              backgroundColor: "var(--color-primary)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "6px 10px",
              fontSize: "12px",
            }}
          >
            중복확인
          </button>
        }
      />
      {idCheckMessage && (
        <p
          style={{
            fontSize: "12px",
            color: idCheckResult ? "green" : "red",
            marginTop: "-12px",
            marginBottom: "12px",
          }}
        >
          {idCheckMessage}
        </p>
      )}

      <Input
        label="비밀번호"
        type={showPassword ? "text" : "password"}
        placeholder="비밀번호를 입력해주세요"
        value={form.password}
        onChange={handleChange("password")}
        rightElement={
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer" }}
          >
            👁
          </span>
        }
      />
      <p
        style={{
          fontSize: "12px",
          color: "#888",
          marginTop: "-12px",
          marginBottom: "16px",
        }}
      >
        ✓ 8자 이상 &nbsp; ✓ 영문,숫자 &nbsp; ✓ 특수문자 포함
      </p>

      <Input
        label="비밀번호 확인"
        type={showPasswordCheck ? "text" : "password"}
        placeholder="비밀번호를 다시 입력해주세요"
        value={form.passwordCheck}
        onChange={handleChange("passwordCheck")}
        rightElement={
          <span
            onClick={() => setShowPasswordCheck(!showPasswordCheck)}
            style={{ cursor: "pointer" }}
          >
            👁
          </span>
        }
      />

      <div
        style={{
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          padding: "12px",
          marginTop: "16px",
        }}
      >
        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            checked={allAgreed}
            onChange={(e) => handleAgreeAll(e.target.checked)}
          />
          전체 동의하기
        </label>
      </div>

      <div
        style={{
          marginTop: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <label style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={agreements.privacy}
              onChange={(e) =>
                setAgreements({ ...agreements, privacy: e.target.checked })
              }
            />
            개인정보 수집 및 이용 동의 (필수)
          </span>
          <span>›</span>
        </label>
        <label style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={agreements.terms}
              onChange={(e) =>
                setAgreements({ ...agreements, terms: e.target.checked })
              }
            />
            서비스 이용약관 (필수)
          </span>
          <span>›</span>
        </label>
        <label style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={agreements.marketing}
              onChange={(e) =>
                setAgreements({ ...agreements, marketing: e.target.checked })
              }
            />
            마케팅 수신 동의 (선택)
          </span>
          <span>›</span>
        </label>
      </div>

      {errorMessage && (
        <p style={{ color: "red", fontSize: "13px", marginTop: "12px" }}>
          {errorMessage}
        </p>
      )}

      <div style={{ marginTop: "24px" }}>
        <Button
          label={isSubmitting ? "가입 중..." : "회원가입"}
          onClick={handleSignup}
          variant="primary"
          size="full"
          disabled={isSubmitting}
        />
      </div>

      <p style={{ textAlign: "center", marginTop: "16px" }}>
        이미 계정이 있으신가요?{" "}
        <a href="/login" style={{ color: "var(--color-primary)" }}>
          로그인
        </a>
      </p>
    </PageLayout>
  );
}

export default Signup;
