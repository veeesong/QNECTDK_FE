import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Header from "../components/Header";

function QuizSolve() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { friend } = state || { friend: { name: "친구" } };

  const quizList = [
    {
      type: "multiple",
      question: `${friend.name} 님의 학교는 어디일까요?`,
      options: [
        "동덕여자대학교",
        "덕성여자대학교",
        "성신여자대학교",
        "숙명여자대학교",
      ],
      answer: 0,
    },
    {
      type: "ox",
      question: `${friend.name} 님의 취미는 음악감상입니다.`,
      options: ["O", "X"],
      answer: 0,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const currentQuiz = quizList[currentIndex];

  const handleSelect = (idx) => {
    setSelectedAnswer(idx);
  };

  const handleNext = () => {
    if (currentIndex < quizList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      navigate("/quiz-result", { state: { friend, score: 80 } });
    }
  };

  return (
    <PageLayout>
      <Header title="퀴즈" onBack={() => navigate(-1)} />

      <div
        style={{
          padding: "20px 0",
          display: "flex",
          gap: "5px",
          width: "299px",
          margin: "0 auto",
        }}
      >
        {quizList.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "6px",
              borderRadius: "3px",
              backgroundColor: i <= currentIndex ? "#FF8C69" : "#eee",
            }}
          />
        ))}
      </div>

      <div
        style={{
          padding: "40px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "299px",
            height: "96px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "15px",
            border: "1.5px solid #F4804F",
            background: "#FFF",
            padding: "15px",
            marginBottom: "20px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {currentQuiz.question}
        </div>

        {currentQuiz.type === "multiple" ? (
          <div
            style={{
              width: "100%",
              maxWidth: "300px",
              alignSelf: "flex-start",
            }}
          >
            {currentQuiz.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  style={{
                    padding: "15px 0",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "40px",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        border: "1.5px solid #F4804F",
                        backgroundColor: isSelected ? "#F4804F" : "transparent",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ whiteSpace: "nowrap" }}>{opt}</span>
                  </div>
                  <div
                    style={{
                      marginLeft: "35px",
                      width: "180px",
                      borderBottom: "1px solid #F4804F",
                    }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ display: "flex", gap: "40px" }}>
            {currentQuiz.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor:
                    selectedAnswer === idx ? "#FF8C69" : "#F4804F",
                  color: "#FFF",
                  fontSize: "40px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* 선택 후 노출되는 다음 버튼 */}
        {selectedAnswer !== null && (
          <button
            onClick={handleNext}
            style={{
              marginTop: "40px",
              width: "299px",
              padding: "14px 0",
              borderRadius: "30px",
              border: "none",
              backgroundColor: "#F4804F",
              color: "#FFF",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {currentIndex < quizList.length - 1 ? "다음" : "결과 보기"}
          </button>
        )}
      </div>
    </PageLayout>
  );
}

export default QuizSolve;
