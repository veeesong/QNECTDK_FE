import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Header from "../components/Header";

function QuizConfirm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { friend } = state || {};

  if (!friend) return null;

  return (
    <PageLayout>
      <Header title="퀴즈" onBack={() => navigate(-1)} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 20px",
        }}
      >
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

        <h3
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            margin: "0 0 16px 0",
            color: "#000",
          }}
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
            color: "#333",
            marginBottom: "40px",
            fontWeight: "500",
          }}
        >
          05년생 | 동덕여자대학교 | 여성
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: "340px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "18px",
              marginBottom: "30px",
              color: "#000",
              fontWeight: "500",
            }}
          >
            퀴즈를 푸시겠습니까?
          </p>

          <div style={{ display: "flex", gap: "10px", width: "100%" }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                flex: 1,
                padding: "14px",
                border: "none",
                borderRadius: "16px",
                backgroundColor: "#888888",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              아니오
            </button>
            <button
              onClick={() => navigate("/quiz-solve", { state: { friend } })}
              style={{
                flex: 1,
                padding: "14px",
                border: "none",
                borderRadius: "16px",
                backgroundColor: "#ff8c69",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              예
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default QuizConfirm;
