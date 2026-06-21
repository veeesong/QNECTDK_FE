import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Header from "../components/Header";
import editIcon from "../assets/icon-edit.png";
import { getMyProfile } from "../api/profile";
import { generateQuizDraft, updateMyQuiz } from "../api/quiz";
import { getCharacterImage } from "../utils/characterMap";

const MAX_OPTIONS = 4;
const MIN_QUESTIONS = 3;
const MAX_QUESTIONS = 5;

// 문제 하나의 기본 형태
const createEmptyQuestion = () => ({
  id: Date.now() + Math.random(),
  questionText: "",
  type: "multiple", // "multiple" | "ox"
  options: [""], // 객관식일 때만 사용
  correctOptionIndex: null, // 객관식 정답 (옵션 인덱스)
  selectedAnswer: null, // OX 정답 ("O" | "X")
});

// AI 초안 응답(questions)을 화면 state 형태로 변환
const draftToState = (draftQuestions) =>
  draftQuestions.map((q) => ({
    id: Date.now() + Math.random(),
    questionText: q.content || "",
    type: q.type === "OX" ? "ox" : "multiple",
    options:
      q.type === "OX" ? [] : (q.options || []).map((o) => o.content || ""),
    correctOptionIndex:
      q.type === "OX" ? null : (q.options || []).findIndex((o) => o.correct),
    selectedAnswer:
      q.type === "OX" ? (q.correctAnswer === "X" ? "X" : "O") : null,
  }));

// 화면 state를 PUT /api/quizzes/me 형태로 변환
const stateToPayload = (questions) =>
  questions.map((q) => {
    if (q.type === "ox") {
      return {
        type: "OX",
        content: q.questionText,
        correctAnswer: q.selectedAnswer === "X" ? "X" : "O",
        required: true,
        options: [
          { content: "O", correct: q.selectedAnswer === "O" },
          { content: "X", correct: q.selectedAnswer === "X" },
        ],
      };
    }
    const correctContent =
      q.correctOptionIndex != null ? q.options[q.correctOptionIndex] : "";
    return {
      type: "MULTIPLE",
      content: q.questionText,
      correctAnswer: correctContent,
      required: true,
      options: q.options.map((opt, idx) => ({
        content: opt,
        correct: idx === q.correctOptionIndex,
      })),
    };
  });

function QuizCreate() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [step, setStep] = useState(1); // 1: 프로필 확인, 2: 문제 작성
  const [questions, setQuestions] = useState([createEmptyQuestion()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        setProfile(res.data);
      } catch (err) {
        setError("프로필을 불러오지 못했어요.");
      }
    };
    fetchProfile();
  }, []);

  const updateQuestion = (id, patch) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    );
  };

  // 최소 3개는 유지해야 해서, 그 이하일 땐 삭제를 막음
  const removeQuestion = (id) => {
    if (questions.length <= MIN_QUESTIONS) {
      setError(`퀴즈는 최소 ${MIN_QUESTIONS}개 있어야 해요.`);
      return;
    }
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // 최대 5개까지만 추가 가능
  const addQuestion = () => {
    if (questions.length >= MAX_QUESTIONS) {
      setError(`퀴즈는 최대 ${MAX_QUESTIONS}개까지 만들 수 있어요.`);
      return;
    }
    setQuestions((prev) => [...prev, createEmptyQuestion()]);
  };

  const setQuestionType = (id, type) => {
    updateQuestion(id, {
      type,
      options: type === "multiple" ? [""] : [],
      correctOptionIndex: null,
      selectedAnswer: null,
    });
  };

  const selectOxAnswer = (id, value) => {
    updateQuestion(id, { selectedAnswer: value });
  };

  // 객관식 정답 선택 (동그라미 클릭)
  const selectCorrectOption = (id, optIndex) => {
    updateQuestion(id, { correctOptionIndex: optIndex });
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

  // AI 문제 초안 생성
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await generateQuizDraft("FIRST_MEET", 3);
      setQuestions(draftToState(res.data.questions));
      setStep(2);
    } catch (err) {
      setError("문제 생성에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 저장
  const handleSubmit = async () => {
    // 백엔드 제약: 문항 3~5개
    if (questions.length < MIN_QUESTIONS || questions.length > MAX_QUESTIONS) {
      setError(`퀴즈는 ${MIN_QUESTIONS}~${MAX_QUESTIONS}개여야 해요.`);
      return;
    }

    const invalid = questions.some((q) => {
      if (!q.questionText.trim()) return true;
      if (q.type === "multiple") {
        return q.correctOptionIndex == null || q.options.some((o) => !o.trim());
      }
      return !q.selectedAnswer;
    });
    if (invalid) {
      setError("모든 질문에 내용과 정답을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await updateMyQuiz(stateToPayload(questions));
      navigate(-1);
    } catch (err) {
      setError("저장에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 1: 본인 프로필 확인
  if (step === 1) {
    if (!profile) {
      return (
        <PageLayout>
          <Header title="퀴즈" onBack={() => navigate(-1)} />
          <p style={{ textAlign: "center", marginTop: "60px" }}>
            불러오는 중...
          </p>
        </PageLayout>
      );
    }

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
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <img
              src={getCharacterImage(profile.characterId)}
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

          {error && (
            <p style={{ color: "red", fontSize: "13px", marginBottom: "16px" }}>
              {error}
            </p>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              padding: "14px 50px",
              borderRadius: "30px",
              border: "none",
              backgroundColor: "#FF8C69",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "생성 중..." : "생성하기"}
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
          margin: "16px 0 4px",
        }}
      >
        퀴즈 목록
      </p>
      <p style={{ fontSize: "12px", color: "#aaa", margin: "0 0 12px" }}>
        {questions.length} / {MAX_QUESTIONS}개 ({MIN_QUESTIONS}개 이상 필요)
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
                marginBottom: "6px",
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

            {/* 선택형: 선지 입력 + 정답 선택 + 추가 */}
            {q.type === "multiple" ? (
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#aaa",
                    margin: "0 0 10px",
                  }}
                >
                  동그라미를 눌러 정답을 표시하세요
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {q.options.map((opt, idx) => {
                    const isCorrect = q.correctOptionIndex === idx;
                    return (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          onClick={() => selectCorrectOption(q.id, idx)}
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            border: "1px solid #FF8C69",
                            backgroundColor: isCorrect
                              ? "#FF8C69"
                              : "transparent",
                            flexShrink: 0,
                            cursor: "pointer",
                          }}
                        />
                        <input
                          value={opt}
                          onChange={(e) =>
                            updateOption(q.id, idx, e.target.value)
                          }
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
                        {isCorrect && (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#D85A30",
                              fontWeight: "bold",
                              flexShrink: 0,
                            }}
                          >
                            정답
                          </span>
                        )}
                      </div>
                    );
                  })}

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
              </div>
            ) : (
              // O/X 타입 - 누른 쪽이 곧 정답
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

      {error && (
        <p
          style={{
            color: "red",
            fontSize: "13px",
            textAlign: "center",
            marginTop: "16px",
          }}
        >
          {error}
        </p>
      )}

      <button
        onClick={addQuestion}
        disabled={questions.length >= MAX_QUESTIONS}
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
          cursor: questions.length >= MAX_QUESTIONS ? "default" : "pointer",
          opacity: questions.length >= MAX_QUESTIONS ? 0.5 : 1,
        }}
      >
        퀴즈 추가하기
      </button>

      <button
        onClick={handleSubmit}
        disabled={loading}
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
          cursor: loading ? "default" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "저장 중..." : "완료"}
      </button>

      <div style={{ height: "100px", flexShrink: 0 }} />
    </PageLayout>
  );
}

export default QuizCreate;
