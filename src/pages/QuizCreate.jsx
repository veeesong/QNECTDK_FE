import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Header from "../components/Header";
import editIcon from "../assets/icon-edit.png";
import mouseImg from "../assets/animals/mouse.png";

const MOCK_PROFILE = {
  name: "박하은",
  imageUrl: null,
  characterId: null,
};

const getProfileDisplayImage = (profile) => {
  if (!profile) return null;
  if (profile.imageUrl) return profile.imageUrl;
  return mouseImg;
};

const MAX_OPTIONS = 4;

// 문제 하나의 기본 형태
const createEmptyQuestion = () => ({
  id: Date.now() + Math.random(),
  questionText: "",
  type: "multiple", // "multiple" | "ox"
  options: [""], // 객관식일 때만 사용
  selectedAnswer: null, // 정답 표시용 (객관식: 인덱스, OX: "O" | "X")
});

function QuizCreate() {
  const navigate = useNavigate();

  // 연동
  const [profile] = useState(MOCK_PROFILE);

  const [step, setStep] = useState(1); // 1: 프로필 확인, 2: 문제 작성
  const [questions, setQuestions] = useState([createEmptyQuestion()]);

  const updateQuestion = (id, patch) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    );
  };

  const removeQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createEmptyQuestion()]);
  };

  const setQuestionType = (id, type) => {
    updateQuestion(id, {
      type,
      options: type === "multiple" ? [""] : [],
      selectedAnswer: null,
    });
  };

  // O/X 정답 선택
  const selectOxAnswer = (id, value) => {
    updateQuestion(id, { selectedAnswer: value });
  };

  const updateOption = (qid, optIndex, value) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qid) return q;
        const newOptions = [...q.options];
        newOptions[optIndex] = value;
        return { ...q, options: newOptions };
      }),
    );
  };

  const addOption = (qid) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qid) return q;
        if (q.options.length >= MAX_OPTIONS) return q;
        return { ...q, options: [...q.options, ""] };
      }),
    );
  };

  const handleSubmit = () => {
    console.log("작성된 퀴즈:", questions);
    navigate(-1);
  };

  // 1: 본인 프로필 확인
  if (step === 1) {
    return (
      <PageLayout>
        <Header title="퀴즈" onBack={() => navigate(-1)} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "60px 20px",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              backgroundColor: "#fde3e3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <img
              src={getProfileDisplayImage(profile)}
              alt="프로필"
              style={{ width: "80px", height: "80px", objectFit: "contain" }}
            />
          </div>

          <p
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              margin: "0 0 40px",
            }}
          >
            {profile.name}
          </p>

          <button
            onClick={() => setStep(2)}
            style={{
              padding: "14px 50px",
              borderRadius: "30px",
              border: "none",
              backgroundColor: "#FF8C69",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            생성하기
          </button>
        </div>
      </PageLayout>
    );
  }

  // 2: 문제 작성
  return (
    <PageLayout>
      <Header title="퀴즈" onBack={() => setStep(1)} />

      <p
        style={{
          fontWeight: "bold",
          fontSize: "16px",
          margin: "16px 0 12px",
        }}
      >
        퀴즈 목록
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        {questions.map((q) => (
          <div
            key={q.id}
            style={{
              border: "1.5px solid #FF8C69",
              borderRadius: "16px",
              padding: "14px",
            }}
          >
            {/* 질문 입력창 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <input
                value={q.questionText}
                onChange={(e) =>
                  updateQuestion(q.id, { questionText: e.target.value })
                }
                placeholder="질문을 입력하세요"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                  padding: "6px 0",
                }}
              />
              <img
                src={editIcon}
                alt="수정"
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
              />
              <span
                onClick={() => removeQuestion(q.id)}
                style={{
                  fontSize: "16px",
                  color: "#999",
                  cursor: "pointer",
                  fontWeight: "bold",
                  lineHeight: 1,
                }}
              >
                ✕
              </span>
            </div>

            {/* 타입 선택: 객관식 / O,X */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <button
                onClick={() => setQuestionType(q.id, "multiple")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  border: "1px solid #FF8C69",
                  backgroundColor: q.type === "multiple" ? "#FF8C69" : "white",
                  color: q.type === "multiple" ? "#fff" : "#FF8C69",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                선택형
              </button>
              <button
                onClick={() => setQuestionType(q.id, "ox")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  border: "1px solid #FF8C69",
                  backgroundColor: q.type === "ox" ? "#FF8C69" : "white",
                  color: q.type === "ox" ? "#fff" : "#FF8C69",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                O / X
              </button>
            </div>

            {/* 선택형: 선지 입력 + 추가 */}
            {q.type === "multiple" ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {q.options.map((opt, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        border: "1px solid #FF8C69",
                        flexShrink: 0,
                      }}
                    />
                    <input
                      value={opt}
                      onChange={(e) => updateOption(q.id, idx, e.target.value)}
                      placeholder={`선택지 ${idx + 1}`}
                      style={{
                        flex: 1,
                        border: "none",
                        borderBottom: "1px solid #ddd",
                        outline: "none",
                        fontSize: "13px",
                        padding: "4px 0",
                      }}
                    />
                  </div>
                ))}

                {q.options.length < MAX_OPTIONS ? (
                  <p
                    onClick={() => addOption(q.id)}
                    style={{
                      fontSize: "12px",
                      color: "#aaa",
                      cursor: "pointer",
                      margin: "4px 0 0",
                    }}
                  >
                    + 항목 추가하기
                  </p>
                ) : (
                  <p
                    style={{
                      fontSize: "12px",
                      color: "red",
                      textAlign: "center",
                      margin: "4px 0 0",
                    }}
                  >
                    4개가 최대입니다.
                  </p>
                )}
              </div>
            ) : (
              // O/X 타입
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "30px",
                  padding: "10px 0",
                }}
              >
                <div
                  onClick={() => selectOxAnswer(q.id, "O")}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor:
                      q.selectedAnswer === "O" ? "#FF8C69" : "#FFE3D6",
                    color: q.selectedAnswer === "O" ? "#fff" : "#FF8C69",
                    border:
                      q.selectedAnswer === "O" ? "none" : "1.5px solid #FF8C69",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                >
                  O
                </div>
                <div
                  onClick={() => selectOxAnswer(q.id, "X")}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor:
                      q.selectedAnswer === "X" ? "#FF8C69" : "#FFE3D6",
                    color: q.selectedAnswer === "X" ? "#fff" : "#FF8C69",
                    border:
                      q.selectedAnswer === "X" ? "none" : "1.5px solid #FF8C69",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                >
                  X
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addQuestion}
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "14px 0",
          borderRadius: "30px",
          border: "none",
          backgroundColor: "#FF8C69",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        퀴즈 추가하기
      </button>

      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          marginTop: "10px",
          padding: "14px 0",
          borderRadius: "30px",
          border: "1px solid #FF8C69",
          backgroundColor: "white",
          color: "#FF8C69",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        완료
      </button>

      <div style={{ height: "100px", flexShrink: 0 }} />
    </PageLayout>
  );
}

export default QuizCreate;
