import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import TopBar from "../components/TopBar";
import mouseImg from "../assets/animals/mouse.png";
import seaImg from "../assets/sea.png";
import mountainImg from "../assets/mountain.png";
import refreshIcon from "../assets/icon-refresh.png";
import { getTodayQuiz, submitTodayAnswer } from "../api/daily";

function Home() {
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null); // { content, optionA, optionB, answered, mySelection }
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const result = await getTodayQuiz();
        setQuiz(result.data);
      } catch (err) {
        console.error("오늘의 퀴즈 조회 실패", err);
        setErrorMessage("퀴즈를 불러오지 못했습니다");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, []);

  const handleSelect = async (selected) => {
    if (quiz?.answered || isSubmitting) return; // 이미 답했으면 다시 제출 안 함

    setIsSubmitting(true);
    try {
      await submitTodayAnswer(selected);
      // 제출 성공하면 화면 상태를 "답변 완료"로 갱신
      setQuiz((prev) => ({ ...prev, answered: true, mySelection: selected }));
    } catch (err) {
      console.error("퀴즈 답변 제출 실패", err);
      setErrorMessage("답변 제출에 실패했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <TopBar />

      {/* 이 사람을 기억하나요 카드 - 친구 인식 퀴즈, 별도 API 그룹이라 더미 유지 */}
      <div
        style={{
          backgroundColor: "#eaf3ff",
          border: "2px solid #cfe2ff",
          borderRadius: "16px",
          padding: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              margin: "0 0 4px",
              textAlign: "left",
            }}
          >
            이 사람을 기억하나요?
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "#666",
              margin: "0 0 12px",
              textAlign: "left",
            }}
          >
            퀴즈로 기억을 테스트해보세요.
          </p>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <span
              style={{
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: "20px",
                padding: "3px 10px",
                fontSize: "12px",
                fontWeight: "bold",
                whiteSpace: "nowrap",
              }}
            >
              이무영
            </span>
            <span
              style={{
                backgroundColor: "#f5f5f5",
                border: "none",
                borderRadius: "20px",
                padding: "3px 8px",
                fontSize: "10px",
                color: "#888",
                whiteSpace: "nowrap",
              }}
            >
              멋쟁이사자처럼
            </span>
            <span
              style={{
                backgroundColor: "#f5f5f5",
                border: "none",
                borderRadius: "20px",
                padding: "3px 8px",
                fontSize: "10px",
                color: "#888",
                whiteSpace: "nowrap",
              }}
            >
              인하대학교
            </span>
          </div>
        </div>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#d6e7fb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <img
            src={mouseImg}
            alt="이무영"
            style={{
              width: "60px",
              height: "60px",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      </div>

      {/* 출석 배너 - 별도 API 그룹(알림/출석), 더미 유지 */}
      <div
        style={{
          backgroundColor: "#e3d7fb",
          border: "2px solid #d4c2f7",
          borderRadius: "30px",
          padding: "14px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "16px",
          color: "#5b3fa0",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        출석 31일 째
        <img
          src={refreshIcon}
          alt="새로고침"
          style={{ width: "18px", height: "18px" }}
        />
      </div>

      {/* 오늘의 퀴즈 - 데일리 그룹 API 연동 */}
      <h3 style={{ margin: "0 0 12px", fontSize: "18px", textAlign: "left" }}>
        오늘의 퀴즈
      </h3>
      <div
        style={{
          backgroundColor: "#fdf3e3",
          border: "2px solid #f5e3bd",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "24px",
        }}
      >
        {isLoading ? (
          <p style={{ textAlign: "center", color: "#aaa", margin: 0 }}>
            불러오는 중...
          </p>
        ) : errorMessage && !quiz ? (
          <p style={{ textAlign: "center", color: "red", margin: 0 }}>
            {errorMessage}
          </p>
        ) : (
          <>
            <p
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "16px",
                margin: "0 0 16px",
              }}
            >
              {quiz.content}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
              }}
            >
              <div
                onClick={() => handleSelect("A")}
                style={{
                  textAlign: "center",
                  cursor: quiz.answered ? "default" : "pointer",
                }}
              >
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "20px",
                    backgroundColor: "#bfe6f5",
                    border:
                      quiz.answered && quiz.mySelection === "A"
                        ? "3px solid var(--color-primary)"
                        : "2px solid #8fd1ec",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity:
                      quiz.answered && quiz.mySelection !== "A" ? 0.5 : 1,
                  }}
                >
                  <img
                    src={seaImg}
                    alt={quiz.optionA}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    marginTop: "8px",
                    fontWeight: "bold",
                  }}
                >
                  {quiz.optionA}
                </p>
              </div>
              <span style={{ fontWeight: "bold", fontSize: "15px" }}>VS</span>
              <div
                onClick={() => handleSelect("B")}
                style={{
                  textAlign: "center",
                  cursor: quiz.answered ? "default" : "pointer",
                }}
              >
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "20px",
                    backgroundColor: "#cdeec2",
                    border:
                      quiz.answered && quiz.mySelection === "B"
                        ? "3px solid var(--color-primary)"
                        : "2px solid #aee29c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity:
                      quiz.answered && quiz.mySelection !== "B" ? 0.5 : 1,
                  }}
                >
                  <img
                    src={mountainImg}
                    alt={quiz.optionB}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    marginTop: "8px",
                    fontWeight: "bold",
                  }}
                >
                  {quiz.optionB}
                </p>
              </div>
            </div>

            {quiz.answered ? (
              <p
                onClick={() => navigate("/vote-result")}
                style={{
                  textAlign: "center",
                  fontSize: "13px",
                  color: "#888",
                  marginTop: "16px",
                  marginBottom: 0,
                  cursor: "pointer",
                }}
              >
                친구 투표 결과 보기 &gt;
              </p>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  fontSize: "13px",
                  color: "#aaa",
                  marginTop: "16px",
                  marginBottom: 0,
                }}
              >
                {isSubmitting ? "제출 중..." : "선택지를 눌러 답해보세요"}
              </p>
            )}
          </>
        )}
      </div>

      {/* 포인트 현황 - 상점/포인트 그룹, 더미 유지 */}
      <h3 style={{ margin: "0 0 12px", fontSize: "18px", textAlign: "left" }}>
        포인트 현황
      </h3>
      <div
        onClick={() => navigate("/point")}
        style={{
          backgroundColor: "#fdf3e3",
          border: "2px solid #f5e3bd",
          borderRadius: "16px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            backgroundColor: "#fbe9b9",
            border: "2px solid #f5d784",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            flexShrink: 0,
          }}
        >
          ⭐
        </div>
        <div style={{ textAlign: "left" }}>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              margin: 0,
              textAlign: "left",
            }}
          >
            1,250P
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "#888",
              margin: 0,
              textAlign: "left",
            }}
          >
            매일 출석해서 포인트를 더 모아보세요!
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

export default Home;
