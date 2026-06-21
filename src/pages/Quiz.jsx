import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Header from "../components/Header";
import Button from "../components/Button";
import { getFriendsQuizzes } from "../api/quiz"; // TODO: 실제 함수명에 맞게 수정
import { getCharacterImage } from "../utils/characterMap";

function Quiz() {
  const navigate = useNavigate();
  const [friendList, setFriendList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriendsWithQuiz = async () => {
      try {
        // GET /api/quizzes/friends 한 번으로 person + 퀴즈정보가 함께 옴
        const res = await getFriendsQuizzes();

        const results = res.data
          // 활성 퀴즈가 없는 친구(hasQuiz: false)는 목록에서 제외
          .filter((item) => item.hasQuiz)
          .map((item) => ({
            quizId: item.quizId,
            userId: item.person.userId,
            name: item.person.name,
            school: item.person.school,
            gender: item.person.gender,
            birthYear: item.person.birthYear,
            animalImg: getCharacterImage(item.person.characterId),
            total: item.totalQuestions,
            solved: item.attempted ? item.score : 0,
            completed: item.attempted,
          }));

        setFriendList(results);
      } catch (err) {
        setError("친구 목록을 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriendsWithQuiz();
  }, []);

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

  return (
    <PageLayout>
      <Header title="퀴즈" onBack={() => navigate(-1)} />

      <div style={{ padding: "0 20px" }}>
        {friendList.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "60px", color: "#aaa" }}>
            풀 수 있는 퀴즈가 없어요
          </p>
        )}

        {friendList.map((f) => (
          <div
            key={f.userId}
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
                  backgroundColor: "#ffffff",
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
                  {[...Array(f.total)].map((_, idx) => (
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
