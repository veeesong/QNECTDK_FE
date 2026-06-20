import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import Header from "../components/Header";
import travelIcon from "../assets/categories/travel.png";
import exerciseIcon from "../assets/categories/exercise.png";
import musicIcon from "../assets/categories/music.png";
import gameIcon from "../assets/categories/game.png";
import cookingIcon from "../assets/categories/cooking.png";
import photoIcon from "../assets/categories/photo.png";
import artIcon from "../assets/categories/art.png";
import techIcon from "../assets/categories/tech.png";
import fashionIcon from "../assets/categories/fashion.png";
import businessIcon from "../assets/categories/business.png";
import selfDevIcon from "../assets/categories/self-dev.png";
import petIcon from "../assets/categories/pet.png";
import bookIcon from "../assets/categories/book.png";
import movieIcon from "../assets/categories/movie.png";
import {
  getAllInterests,
  getMyInterests,
  updateMyInterests,
} from "../api/interest";

// 카테고리 이름 -> 아이콘 매핑 (InterestSelect.jsx와 동일한 매핑 사용)
const categoryIcons = {
  여행: travelIcon,
  운동: exerciseIcon,
  음악: musicIcon,
  게임: gameIcon,
  요리: cookingIcon,
  자기계발: selfDevIcon,
  반려동물: petIcon,
  독서: bookIcon,
  영화: movieIcon,
  사진: photoIcon,
  예술: artIcon,
  "기술/IT": techIcon,
  패션: fashionIcon,
  비즈니스: businessIcon,
};

function InterestEdit() {
  // 전체 관심사를 카테고리 구분 없이 평평한 배열로 관리: [{ id, name, category }]
  const [allInterests, setAllInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [originalIds, setOriginalIds] = useState(new Set());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allResult, myResult] = await Promise.all([
          getAllInterests(),
          getMyInterests(),
        ]);

        // 카테고리별로 묶여있는 응답을 평평한 배열로 펼침
        const flatList = allResult.data.flatMap((cat) =>
          cat.interests.map((item) => ({
            id: item.id,
            name: item.name,
            category: cat.category,
          })),
        );
        setAllInterests(flatList);

        const myIds = new Set(myResult.data.map((item) => item.id));
        setSelectedIds(myIds);
        setOriginalIds(myIds);
      } catch (err) {
        console.error("관심사 목록 조회 실패", err);
        setErrorMessage("관심사 정보를 불러오지 못했습니다");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleAdd = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const idsAreEqual = (a, b) => {
    if (a.size !== b.size) return false;
    for (const id of a) {
      if (!b.has(id)) return false;
    }
    return true;
  };

  const saveInterests = async () => {
    if (idsAreEqual(selectedIds, originalIds)) return;

    setIsSaving(true);
    try {
      await updateMyInterests(Array.from(selectedIds));
      setOriginalIds(new Set(selectedIds));
    } catch (err) {
      console.error("관심사 저장 실패", err);
      setErrorMessage("저장에 실패했습니다");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = async () => {
    await saveInterests();
    window.history.back();
  };

  const addedInterests = allInterests.filter((item) =>
    selectedIds.has(item.id),
  );

  if (isLoading) {
    return (
      <PageLayout>
        <Header title="프로필" onBack={() => window.history.back()} />
        <p style={{ textAlign: "center", marginTop: "40px" }}>불러오는 중...</p>
      </PageLayout>
    );
  }

  if (errorMessage && allInterests.length === 0) {
    return (
      <PageLayout>
        <Header title="프로필" onBack={() => window.history.back()} />
        <p style={{ textAlign: "center", marginTop: "40px", color: "red" }}>
          {errorMessage}
        </p>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Header title="프로필" onBack={handleBack} />

      <p
        style={{
          fontWeight: "bold",
          textAlign: "center",
          marginTop: "8px",
          marginBottom: "20px",
        }}
      >
        관심사 수정
        {isSaving && (
          <span style={{ fontSize: "12px", color: "#aaa", marginLeft: "8px" }}>
            저장 중...
          </span>
        )}
      </p>

      <p style={{ fontWeight: "bold", fontSize: "15px", marginBottom: "14px" }}>
        추가된 관심사
      </p>
      {addedInterests.length === 0 ? (
        <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "28px" }}>
          아직 추가된 관심사가 없어요
        </p>
      ) : (
        <div
          className="tag-scroll"
          style={{
            display: "flex",
            gap: "20px",
            overflowX: "auto",
            marginBottom: "28px",
            paddingBottom: "4px",
          }}
        >
          {addedInterests.map((item) => (
            <div key={item.id} style={{ textAlign: "center", flexShrink: 0 }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "#fdf3e3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px",
                }}
              >
                {categoryIcons[item.category] ? (
                  <img
                    src={categoryIcons[item.category]}
                    alt={item.name}
                    style={{ width: "26px", height: "26px" }}
                  />
                ) : (
                  <span style={{ fontSize: "10px" }}>{item.name}</span>
                )}
              </div>
              <p style={{ fontSize: "13px" }}>{item.name}</p>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontWeight: "bold", fontSize: "15px", marginBottom: "14px" }}>
        전체 관심사
      </p>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
      >
        {allInterests.map((item) => {
          const isAdded = selectedIds.has(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleAdd(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid #ddd",
                borderRadius: "20px",
                padding: "10px 16px",
                cursor: "pointer",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {categoryIcons[item.category] && (
                  <img
                    src={categoryIcons[item.category]}
                    alt={item.name}
                    style={{ width: "18px", height: "18px" }}
                  />
                )}
                <span style={{ fontSize: "14px" }}>{item.name}</span>
              </div>
              <span
                style={{
                  fontSize: "16px",
                  color: isAdded ? "var(--color-primary)" : "#aaa",
                  fontWeight: "bold",
                }}
              >
                {isAdded ? "✓" : "+"}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ height: "90px", flexShrink: 0 }} />
    </PageLayout>
  );
}

export default InterestEdit;
