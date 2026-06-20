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
            padding: "8px 20px",
            borderRadius: "20px",
            backgroundColor: friend.bgColor,
            border: "1px solid #000",
            fontSize: "14px",
            marginBottom: "40px",
          }}
        >
          05년생 | 동덕여자대학교 | 여성
        </div>

        {/* 결과 박스 (흰색 카드) */}
        <div
          style={{
            width: "100%",
            maxWidth: "340px",
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            padding: "30px 20px",
            textAlign: "center",
            border: "1px solid #eee",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            marginBottom: "40px",
          }}
        >
          <p
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "24px",
            }}
          >
            퀴즈 완료!
          </p>

          {/* 점수와 포인트 박스 */}
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            <div
              style={{
                flex: 1,
                padding: "15px 10px",
                borderRadius: "16px",
                backgroundColor: "#FFF5F0",
                border: "1px solid #FF8C69",
              }}
            >
              <div style={{ fontSize: "12px", color: "#666" }}>점수</div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#FF8C69",
                }}
              >
                {score}점
              </div>
            </div>
            <div
              style={{
                flex: 1,
                padding: "15px 10px",
                borderRadius: "16px",
                backgroundColor: "#FFF5F0",
                border: "1px solid #FF8C69",
              }}
            >
              <div style={{ fontSize: "12px", color: "#666" }}>획득 포인트</div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#FF8C69",
                }}
              >
                +10P
              </div>
            </div>
          </div>
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
