import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Header from "../components/Header";

// birthYear(4자리) -> "05년생" 형태로 변환
const formatBirthYear = (birthYear) => {
  if (!birthYear) return null;
  return `${String(birthYear).slice(2)}년생`;
};

const formatGender = (gender) => {
  if (gender === "MALE") return "남성";
  if (gender === "FEMALE") return "여성";
  return null;
};

function QuizResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { friend, score, total, earnedPoint } = state || {};

  if (!friend) return null;

  const infoParts = [
    formatBirthYear(friend.birthYear),
    friend.school,
    formatGender(friend.gender),
  ].filter(Boolean);

  return (
    <PageLayout>
      <Header title="퀴즈" onBack={() => navigate("/quiz")} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 20px",
        }}
      >
        {/* 프사 */}
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <img
            src={friend.animalImg}
            alt="profile"
            style={{ width: "80px", height: "80px", objectFit: "contain" }}
          />
        </div>

        {/* 이름 및 정보 */}
        <h3
          style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 16px 0" }}
        >
          {friend.name}
        </h3>
        {infoParts.length > 0 && (
          <div
            style={{
              padding: "4px 20px",
              borderRadius: "20px",
              backgroundColor: "#ffffff",
              border: "1px solid #000",
              fontSize: "14px",
              marginBottom: "24px",
            }}
          >
            {infoParts.join(" | ")}
          </div>
        )}

        {/* 완료 안내 텍스트 */}
        <p
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "20px",
            marginTop: 0,
          }}
        >
          모두 완료했습니다!
        </p>

        {/* 점수 알약 박스 */}
        <div
          style={{
            padding: "12px 24px",
            borderRadius: "30px",
            backgroundColor: "#FFF5F0",
            border: "1px solid #FF8C69",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#000",
            marginBottom: earnedPoint > 0 ? "12px" : "28px",
          }}
        >
          점수: {score}/{total}
        </div>

        {/* 포인트 적립 배지 (친구 퀴즈 첫 풀기일 때만 적립됨) */}
        {earnedPoint > 0 && (
          <div
            style={{
              padding: "8px 18px",
              borderRadius: "30px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #FF8C69",
              fontSize: "13px",
              fontWeight: "bold",
              color: "#FF8C69",
              marginBottom: "28px",
            }}
          >
            {earnedPoint}P 획득 완료
          </div>
        )}

        {/* 홈으로 가기 버튼 */}
        <button
          onClick={() => navigate("/home")}
          style={{
            width: "100%",
            maxWidth: "340px",
            padding: "16px",
            border: "none",
            borderRadius: "16px",
            backgroundColor: "#FF8C69",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "8px",
          }}
        >
          홈으로 가기
        </button>
      </div>
    </PageLayout>
  );
}

export default QuizResult;
