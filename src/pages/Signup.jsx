import PageLayout from "../components/PageLayout";
import { useState } from "react";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";

function Signup() {
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

  const [agreements, setAgreements] = useState({
    privacy: false,
    terms: false,
    marketing: false,
  });

  const allAgreed =
    agreements.privacy && agreements.terms && agreements.marketing;

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleAgreeAll = (checked) => {
    setAgreements({ privacy: checked, terms: checked, marketing: checked });
  };

  const handleSignup = () => {
    console.log("회원가입 시도", form, agreements);
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

      <div style={{ marginTop: "24px" }}>
        <Button
          label="회원가입"
          onClick={handleSignup}
          variant="primary"
          size="full"
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
