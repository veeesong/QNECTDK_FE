import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Header from "../components/Header";

function QuizResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { friend, score } = state || { friend: {}, score: 0 };

  if (!friend) return null;

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
            backgroundColor: friend.bgColor,
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
        <div
          style={{
            padding: "4px 20px",
            borderRadius: "20px",
            backgroundColor: friend.bgColor,
            border: "1px solid #000",
            fontSize: "14px",
            marginBottom: "24px",
          }}
        >
          05년생 | 동덕여자대학교 | 여성
        </div>

        {/* 완료 안내 텍스트 - 카드 없이 일반 텍스트 */}
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
            marginBottom: "12px",
          }}
        >
          점수: {score}/100
        </div>

        {/* 포인트 알약 박스 */}
        <div
          style={{
            padding: "12px 24px",
            borderRadius: "30px",
            backgroundColor: "#FFF5F0",
            border: "1px solid #FF8C69",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#000",
            marginBottom: "40px",
          }}
        >
          10P 획득 완료
        </div>

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
          }}
        >
          홈으로 가기
        </button>
      </div>
    </PageLayout>
  );
}

export default QuizResult;
