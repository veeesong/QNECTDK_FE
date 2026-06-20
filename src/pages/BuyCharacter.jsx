import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Header from "../components/Header";

const characterList = [
  { id: "mouse", name: "Mouse", img: "/images/Mouse.svg", status: "available" },
  { id: "cow", name: "Cow", img: "/images/Cow.svg", status: "available" },
  { id: "tiger", name: "Tiger", img: "/images/Tiger.svg", status: "available" },
  {
    id: "rabbit",
    name: "Rabbit",
    img: "/images/Rabbit.svg",
    status: "available",
  },
  {
    id: "dragon",
    name: "Dragon",
    img: "/images/Dragon.svg",
    status: "completed",
  },
  { id: "snake", name: "Snake", img: "/images/Snake.svg", status: "completed" },
  { id: "horse", name: "Horse", img: "/images/Horse.svg", status: "available" },
  { id: "sheep", name: "Sheep", img: "/images/Sheep.svg", status: "available" },
  {
    id: "monkey",
    name: "Monkey",
    img: "/images/Monkey.svg",
    status: "available",
  },
  {
    id: "chicken",
    name: "Chicken",
    img: "/images/Chicken.svg",
    status: "completed",
  },
  { id: "dog", name: "Dog", img: "/images/Dog.svg", status: "available" },
  { id: "pig", name: "Pig", img: "/images/Pig.svg", status: "available" },
  { id: "koala", name: "Koala", img: "/images/Koala.svg", status: "available" },
  { id: "lion", name: "Lion", img: "/images/Lion.svg", status: "available" },
  {
    id: "redpanda",
    name: "Redpanda",
    img: "/images/Redpanda.svg",
    status: "available",
  },
  {
    id: "raccoon",
    name: "Raccoon",
    img: "/images/Raccoon.svg",
    status: "available",
  },
  {
    id: "dolphin",
    name: "Dolphin",
    img: "/images/Dolphin.svg",
    status: "available",
  },
  { id: "shark", name: "Shark", img: "/images/Shark.svg", status: "available" },
  {
    id: "axolotl",
    name: "Axolotl",
    img: "/images/Axolotl.svg",
    status: "available",
  },
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
      <style>{`
        div {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <Header title="포인트" onBack={handleBack} />

      {
        // 1. 캐릭터 리스트 창 (그냥 페이지 분리 안하고 여기 다 적었엄)
        step === "list" && (
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
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
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
                          whiteSpace: "nowrap",
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
        )
      }

      {
        // 2. 결제 확인 창
        step === "confirm" && selectedChar && (
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
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                }}
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
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: "#ff6b35",
                }}
              >
                200P
              </span>
            </div>

            <div
              style={{
                width: "100%",
                padding: "0 8px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "60px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                }}
              >
                <span style={{ color: "#888", fontWeight: "500" }}>
                  현재 포인트
                </span>
                <span style={{ color: "#333", fontWeight: "bold" }}>
                  1,250P
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                }}
              >
                <span style={{ color: "#888", fontWeight: "500" }}>
                  남는 포인트
                </span>
                <span style={{ color: "#888", fontWeight: "bold" }}>
                  1,050P
                </span>
              </div>
            </div>

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
        )
      }

      {
        // 3. 결제 완료 창
        step === "success" && (
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
                textAlign: "center",
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
        )
      }
    </PageLayout>
  );
}

export default BuyCharacter;
