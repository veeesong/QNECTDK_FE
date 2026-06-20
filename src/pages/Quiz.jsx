import React from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Header from "../components/Header";
import Button from "../components/Button";

import mouseImg from "../assets/animals/mouse.png";
import roosterImg from "../assets/animals/rooster.png";
import dragonImg from "../assets/animals/dragon.png";
import sheepImg from "../assets/animals/sheep.png";
import tigerImg from "../assets/animals/tiger.png";
import pigImg from "../assets/animals/pig.png";
import snakeImg from "../assets/animals/snake.png";

function Quiz() {
  const navigate = useNavigate();

  const friendList = [
    {
      name: "이무영",
      animalImg: mouseImg,
      solved: 0,
      total: 5,
      completed: false,
      bgColor: "#D3DFFF",
    },
    {
      name: "이서현",
      animalImg: roosterImg,
      solved: 5,
      total: 5,
      completed: true,
      bgColor: "#FFDBDB",
    },
    {
      name: "김민혁",
      animalImg: dragonImg,
      solved: 4,
      total: 5,
      completed: true,
      bgColor: "#DEFECD",
    },
    {
      name: "강민정",
      animalImg: sheepImg,
      solved: 3,
      total: 5,
      completed: true,
      bgColor: "#FFDECC",
    },
    {
      name: "구서연",
      animalImg: tigerImg,
      solved: 4,
      total: 5,
      completed: true,
      bgColor: "#FFFAD0",
    },
    {
      name: "김경민",
      animalImg: pigImg,
      solved: 0,
      total: 5,
      completed: false,
      bgColor: "#FFE0F9",
    },
    {
      name: "정다연",
      animalImg: snakeImg,
      solved: 0,
      total: 5,
      completed: false,
      bgColor: "#D3DFFF",
    },
  ];

  return (
    <PageLayout>
      <Header title="퀴즈" onBack={() => navigate(-1)} />

      <div style={{ padding: "0 20px" }}>
        {friendList.map((f, i) => (
          <div
            key={i}
            style={{
              borderBottom: "1px solid #e0e0e0",
              padding: "16px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: f.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <img
                  src={f.animalImg}
                  style={{
                    width: "42px",
                    height: "42px",
                    objectFit: "contain",
                  }}
                  alt={f.name}
                />
              </div>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                  {f.name}
                </div>
                <div style={{ display: "flex", gap: "5px", marginTop: "8px" }}>
                  {[...Array(5)].map((_, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        border: "1px solid #FF8C69",
                        backgroundColor: idx < f.solved ? "#FF8C69" : "#FFFFFF",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Button
              label={f.completed ? "퀴즈 완료" : "퀴즈 풀기"}
              size="small"
              variant={f.completed ? "secondary" : "primary"}
              onClick={() => {
                if (!f.completed) {
                  navigate("/quiz-confirm", { state: { friend: f } });
                }
              }}
            />
          </div>
        ))}
      </div>
    </PageLayout>
  );
}

export default Quiz;
