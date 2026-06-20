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
  const [isLocked, setIsLocked] = useState(false);
  const currentQuiz = quizList[currentIndex];

  const handleSelect = (idx) => {
    if (isLocked) return; // 이미 답을 골랐으면 클릭 무시

    setIsLocked(true); // 클릭 잠금
    setSelectedAnswer(idx); // 선택된 답 표시

    // 정답/오답 확인 로직 (필요시 점수 계산 추가)
    const isCorrect = idx === currentQuiz.answer;

    setTimeout(() => {
      if (currentIndex < quizList.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsLocked(false);
      } else {
        navigate("/quiz-result", { state: { friend, score: 80 } });
      }
    }, 1000); // 1초간 정답 표시를 확인할 시간을 줌
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
            marginBottom: "50px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {currentQuiz.question}
        </div>

        {currentQuiz.type === "multiple" ? (
          <div style={{ width: "100%", maxWidth: "300px" }}>
            {currentQuiz.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  style={{
                    padding: "15px",
                    borderBottom: "1px solid #F4804F",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    backgroundColor: isSelected ? "#FFF5F0" : "transparent",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      border: "1.5px solid #F4804F",
                      backgroundColor: isSelected ? "#F4804F" : "transparent",
                    }}
                  />
                  {opt}
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
      </div>
    </PageLayout>
  );
}

export default QuizSolve;
