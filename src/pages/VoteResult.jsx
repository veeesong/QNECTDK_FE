import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import Header from "../components/Header";
import defaultFriendImg from "../assets/animals/mouse.png";
import { getDailyStats, getTodayQuiz } from "../api/daily";

function VoteResult() {
  const [quiz, setQuiz] = useState(null); // { content, optionA, optionB }
  const [stats, setStats] = useState(null); // getDailyStats().data
  const [tab, setTab] = useState("A"); // "A" | "B"
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 옵션 라벨(바다/산 같은 실제 텍스트)을 보여주기 위해 오늘의 퀴즈 정보도 같이 받음
        const [quizResult, statsResult] = await Promise.all([
          getTodayQuiz(),
          getDailyStats(),
        ]);

        setQuiz(quizResult.data);
        setStats(statsResult.data);
      } catch (err) {
        console.error("투표 결과 조회 실패", err);
        // 본인이 아직 답변하지 않았으면 403이 날 수 있음
        if (err?.response?.status === 403) {
          setErrorMessage("먼저 오늘의 퀴즈에 답변해주세요");
        } else {
          setErrorMessage("결과를 불러오지 못했습니다");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <PageLayout>
        <Header title="퀴즈" onBack={() => window.history.back()} />
        <p style={{ textAlign: "center", marginTop: "40px" }}>불러오는 중...</p>
      </PageLayout>
    );
  }

  if (errorMessage || !stats || !quiz) {
    return (
      <PageLayout>
        <Header title="퀴즈" onBack={() => window.history.back()} />
        <p style={{ textAlign: "center", marginTop: "40px", color: "red" }}>
          {errorMessage || "결과를 불러오지 못했습니다"}
        </p>
      </PageLayout>
    );
  }

  // 탭에 표시할 라벨 ("바다" / "산" 같은 실제 옵션 텍스트)
  const optionLabels = { A: quiz.optionA, B: quiz.optionB };

  // 현재 탭에서 보여줄 친구 목록 (selections 중 selected가 탭과 일치하는 것만)
  const friendsForTab = stats.friends.selections.filter(
    (s) => s.selected === tab,
  );

  return (
    <PageLayout>
      <Header title="퀴즈" onBack={() => window.history.back()} />

      <p
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "15px",
          margin: "12px 0 4px",
        }}
      >
        {quiz.content}
      </p>
      <p
        style={{
          textAlign: "center",
          fontSize: "12px",
          color: "#888",
          marginBottom: "16px",
        }}
      >
        전체 {optionLabels.A} {stats.overall.percentA}% · {optionLabels.B}{" "}
        {stats.overall.percentB}%
      </p>

      <div style={{ display: "flex", borderBottom: "1px solid #eee" }}>
        {["B", "A"].map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              flex: 1,
              padding: "12px 0",
              border: "none",
              background: "none",
              fontWeight: tab === key ? "bold" : "normal",
              borderBottom:
                tab === key ? "2px solid var(--color-primary)" : "none",
              color: tab === key ? "var(--color-primary)" : "#888",
              cursor: "pointer",
            }}
          >
            {optionLabels[key]}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "16px" }}>
        {friendsForTab.length === 0 ? (
          <p style={{ textAlign: "center", color: "#aaa", marginTop: "40px" }}>
            아직 이 항목을 선택한 친구가 없어요
          </p>
        ) : (
          friendsForTab.map((friend) => (
            <div
              key={friend.userId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 0",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "#f5f5f5",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={defaultFriendImg}
                  alt={friend.name}
                  style={{
                    width: "48px",
                    height: "48px",
                    objectFit: "contain",
                  }}
                />
              </div>
              <span>{friend.name}</span>
            </div>
          ))
        )}
      </div>
    </PageLayout>
  );
}

export default VoteResult;
