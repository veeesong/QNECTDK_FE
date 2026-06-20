import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Header from "../components/Header";

import dogImg from "../assets/animals/dog.png";
import dragonImg from "../assets/animals/dragon.png";
import horseImg from "../assets/animals/horse.png";
import monkeyImg from "../assets/animals/monkey.png";
import mouseImg from "../assets/animals/mouse.png";
import oxImg from "../assets/animals/ox.png";
import pigImg from "../assets/animals/pig.png";
import rabbitImg from "../assets/animals/rabbit.png";
import roosterImg from "../assets/animals/rooster.png";
import sheepImg from "../assets/animals/sheep.png";
import snakeImg from "../assets/animals/snake.png";
import tigerImg from "../assets/animals/tiger.png";

const characterList = [
  { id: "mouse", name: "Mouse", img: mouseImg, status: "available" },
  { id: "cow", name: "Cow", img: oxImg, status: "available" },
  { id: "tiger", name: "Tiger", img: tigerImg, status: "available" },
  { id: "rabbit", name: "Rabbit", img: rabbitImg, status: "available" },
  { id: "dragon", name: "Dragon", img: dragonImg, status: "completed" },
  { id: "snake", name: "Snake", img: snakeImg, status: "completed" },
  { id: "horse", name: "Horse", img: horseImg, status: "available" },
  { id: "sheep", name: "Sheep", img: sheepImg, status: "available" },
  { id: "monkey", name: "Monkey", img: monkeyImg, status: "available" },
  { id: "rooster", name: "Chicken", img: roosterImg, status: "completed" },
  { id: "dog", name: "Dog", img: dogImg, status: "available" },
  { id: "pig", name: "Pig", img: pigImg, status: "available" },
];

function BuyCharacter() {
  const navigate = useNavigate();
  const [step, setStep] = useState("list");
  const [selectedChar, setSelectedChar] = useState(null);

  const handleSelectCharacter = (char) => {
    setSelectedChar(char);
    setStep("confirm");
  };

  const handlePayment = () => {
    setStep("success");
  };

  const handleBack = () => {
    if (step === "confirm" || step === "success") {
      setStep("list");
    } else {
      navigate(-1);
    }
  };

  return (
    <PageLayout>
      <Header title="포인트" onBack={handleBack} />

      {step === "list" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "8px",
            paddingBottom: "40px",
          }}
        >
          {characterList.map((char) => {
            const isCompleted = char.status === "completed";
            return (
              <div
                key={char.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: isCompleted ? "#f5f5f5" : "#ffe3d1",
                  border: isCompleted
                    ? "2px solid #e0e0e0"
                    : "2px solid #ffccb0",
                  borderRadius: "16px",
                  padding: "16px",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <img
                    src={char.img}
                    alt={char.name}
                    style={{
                      width: "44px",
                      height: "44px",
                      objectFit: "contain",
                    }}
                  />
                  <div
                    style={{
                      width: "2px",
                      height: "28px",
                      backgroundColor: isCompleted ? "#d9d9d9" : "#ffccb0",
                    }}
                  />
                </div>
                <div
                  onClick={() => !isCompleted && handleSelectCharacter(char)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: isCompleted ? "default" : "pointer",
                  }}
                >
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      color: isCompleted ? "#888" : "#333",
                    }}
                  >
                    {isCompleted ? "구매완료" : "구매하기"}
                  </span>
                  {!isCompleted && (
                    <span
                      style={{
                        backgroundColor: "#ff6b35",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "4px 10px",
                        borderRadius: "20px",
                      }}
                    >
                      200P
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {step === "confirm" && selectedChar && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "40px",
            flex: 1,
          }}
        >
          <div
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              backgroundColor: "#ffe3d1",
              border: "2px solid #ffccb0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "40px",
            }}
          >
            <img
              src={selectedChar.img}
              alt={selectedChar.name}
              style={{ width: "100px", height: "100px", objectFit: "contain" }}
            />
          </div>
          <div
            style={{
              width: "100%",
              backgroundColor: "#ffe3d1",
              border: "2px solid #ffccb0",
              borderRadius: "16px",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxSizing: "border-box",
              marginBottom: "20px",
            }}
          >
            <span
              style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}
            >
              결제 포인트
            </span>
            <span
              style={{ fontWeight: "bold", fontSize: "18px", color: "#ff6b35" }}
            >
              200P
            </span>
          </div>
          {/* 하단 버튼 로직 유지 */}
          <button
            onClick={handlePayment}
            style={{
              width: "100%",
              maxWidth: "200px",
              backgroundColor: "#ff6b35",
              color: "#fff",
              border: "none",
              borderRadius: "24px",
              padding: "12px 0",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            결제하기
          </button>
        </div>
      )}

      {step === "success" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            paddingTop: "100px",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "60px",
            }}
          >
            결제가 완료되었습니다.
          </h2>
          <button
            onClick={() => navigate("/home")}
            style={{
              width: "100%",
              maxWidth: "200px",
              backgroundColor: "#ff6b35",
              color: "#fff",
              border: "none",
              borderRadius: "24px",
              padding: "12px 0",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            홈으로 가기
          </button>
        </div>
      )}
    </PageLayout>
  );
}

export default BuyCharacter;
