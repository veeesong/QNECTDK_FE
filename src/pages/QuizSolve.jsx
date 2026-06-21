import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Header from "../components/Header";
import { getFriendQuiz, submitQuizAttempt } from "../api/quiz";

function QuizSolve() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { friend } = state || {};

  const [quizId, setQuizId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  // questionId -> 제출용 answer 값 누적
  const [answers, setAnswers] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!friend) return;
    const fetchQuiz = async () => {
      try {
        const res = await getFriendQuiz(friend.userId);
        if (!res.data.solvable) {
          setError(
            "아직 이 친구의 퀴즈를 풀 수 없어요. (프로필을 먼저 완성해주세요)",
          );
          return;
        }
        setQuizId(res.data.quizId);
        setQuestions(res.data.questions || []);
      } catch (err) {
        setError("퀴즈를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [friend]);

  if (!friend) return null;

  if (loading) {
    return (
      <PageLayout>
        <Header title="퀴즈" onBack={() => navigate(-1)} />
        <p style={{ textAlign: "center", marginTop: "60px" }}>불러오는 중...</p>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <Header title="퀴즈" onBack={() => navigate(-1)} />
        <p style={{ textAlign: "center", marginTop: "60px", color: "red" }}>
          {error}
        </p>
      </PageLayout>
    );
  }

  const currentQuiz = questions[currentIndex];
  const isOx = currentQuiz.type === "OX";
  const optionLabels = isOx
    ? ["O", "X"]
    : (currentQuiz.options || []).map((o) => o.content);

  const handleSelect = (idx) => {
    setSelectedAnswer(idx);
  };

  const handleNext = async () => {
    // 현재 문제의 답을 누적 저장
    const answerValue = optionLabels[selectedAnswer];
    const newAnswers = {
      ...answers,
      [currentQuiz.questionId]: answerValue,
    };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      return;
    }

    // 마지막 문제 -> 제출
    setSubmitting(true);
    try {
      const payload = Object.entries(newAnswers).map(
        ([questionId, answer]) => ({
          questionId: Number(questionId),
          answer,
        }),
      );
      const res = await submitQuizAttempt(friend.userId, payload);
      navigate("/quiz-result", {
        state: {
          friend,
          score: res.data.score,
          total: res.data.total,
          // 친구 퀴즈는 "처음 풀 때"만 10P가 적립됨(명세 기준).
          // 이 화면까지 온 것 자체가 미응시 친구라는 뜻이라
          // (Quiz.jsx에서 이미 완료된 친구는 클릭이 막혀있음) 항상 첫 풀기에 해당함.
          earnedPoint: !friend.completed ? 10 : 0,
        },
      });
    } catch (err) {
      setError("답안 제출에 실패했어요. 다시 시도해주세요.");
      setSubmitting(false);
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
        {questions.map((_, i) => (
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
          {currentQuiz.content}
        </div>

        {!isOx ? (
          <div
            style={{
              width: "100%",
              maxWidth: "300px",
              alignSelf: "flex-start",
            }}
          >
            {optionLabels.map((opt, idx) => {
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
            {optionLabels.map((opt, idx) => (
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

        {error && (
          <p style={{ color: "red", fontSize: "13px", marginTop: "16px" }}>
            {error}
          </p>
        )}

        {selectedAnswer !== null && (
          <button
            onClick={handleNext}
            disabled={submitting}
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
              cursor: submitting ? "default" : "pointer",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting
              ? "제출 중..."
              : currentIndex < questions.length - 1
                ? "다음"
                : "결과 보기"}
          </button>
        )}
      </div>
    </PageLayout>
  );
}

export default QuizSolve;
