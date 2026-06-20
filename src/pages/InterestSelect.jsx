import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Header from "../components/Header";
import travelIcon from "../assets/categories/travel.png";
import exerciseIcon from "../assets/categories/exercise.png";
import musicIcon from "../assets/categories/music.png";
import gameIcon from "../assets/categories/game.png";
import cookingIcon from "../assets/categories/cooking.png";
import selfDevIcon from "../assets/categories/self-dev.png";
import petIcon from "../assets/categories/pet.png";
import bookIcon from "../assets/categories/book.png";
import movieIcon from "../assets/categories/movie.png";
import {
  getAllInterests,
  getMyInterests,
  updateMyInterests,
} from "../api/interest";

// 카테고리 이름 -> 아이콘 매핑 (백엔드는 아이콘 정보를 안 주므로 프론트에서 직접 매칭)
// 백엔드가 내려주는 category 문자열이 정확히 이 키와 일치해야 아이콘이 표시됨
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
};

function InterestSelect() {
  const navigate = useNavigate();

  // categories: [{ category, interests: [{ id, name }] }]
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [activeCategory, setActiveCategory] = useState(null);
  // 선택된 관심사를 id로 관리 (Set으로 관리하면 추가/삭제가 빠름)
  const [selectedIds, setSelectedIds] = useState(new Set());
  // 화면을 처음 열었을 때 서버에 저장돼 있던 id들 (변경 여부 비교용)
  const [originalIds, setOriginalIds] = useState(new Set());

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allResult, myResult] = await Promise.all([
          getAllInterests(),
          getMyInterests(),
        ]);

        setCategories(allResult.data);

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

  const toggleTag = (id) => {
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

  // id 집합이 같은지 비교 (저장이 필요한지 판단용)
  const idsAreEqual = (a, b) => {
    if (a.size !== b.size) return false;
    for (const id of a) {
      if (!b.has(id)) return false;
    }
    return true;
  };

  // 선택값을 서버에 저장
  const saveInterests = async () => {
    if (idsAreEqual(selectedIds, originalIds)) {
      // 변경 사항 없으면 굳이 요청 안 보냄
      return;
    }

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

  // 태그 화면(상세)에서 카테고리 목록으로 돌아갈 때 저장
  const handleBackFromTags = async () => {
    await saveInterests();
    setActiveCategory(null);
  };

  // 카테고리 목록 화면에서 완전히 나갈 때도 한 번 더 저장 보장
  const handleBackFromCategories = async () => {
    await saveInterests();
    window.history.back();
  };

  if (isLoading) {
    return (
      <PageLayout>
        <Header title="프로필" onBack={() => window.history.back()} />
        <p style={{ textAlign: "center", marginTop: "40px" }}>불러오는 중...</p>
      </PageLayout>
    );
  }

  if (errorMessage && categories.length === 0) {
    return (
      <PageLayout>
        <Header title="프로필" onBack={() => window.history.back()} />
        <p style={{ textAlign: "center", marginTop: "40px", color: "red" }}>
          {errorMessage}
        </p>
      </PageLayout>
    );
  }

  const activeCategoryData = categories.find(
    (c) => c.category === activeCategory,
  );

  return (
    <PageLayout>
      <Header
        title="프로필"
        onBack={activeCategory ? handleBackFromTags : handleBackFromCategories}
      />

      {!activeCategory ? (
        <>
          <p
            style={{
              fontWeight: "bold",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            관심사 선택
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
            }}
          >
            {categories.map((cat) => (
              <div
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                style={{ textAlign: "center", cursor: "pointer" }}
              >
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
                  {categoryIcons[cat.category] ? (
                    <img
                      src={categoryIcons[cat.category]}
                      alt={cat.category}
                      style={{ width: "26px", height: "26px" }}
                    />
                  ) : (
                    <span style={{ fontSize: "11px" }}>{cat.category}</span>
                  )}
                </div>
                <p style={{ fontSize: "13px" }}>{cat.category}</p>
              </div>
            ))}
            <div
              onClick={() => navigate("/interest-edit")}
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  border: "1px solid #ddd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  margin: "0 auto",
                }}
              >
                +
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <p
            style={{
              color: "var(--color-primary)",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            {activeCategory}
            {isSaving && (
              <span
                style={{ fontSize: "12px", color: "#aaa", marginLeft: "8px" }}
              >
                저장 중...
              </span>
            )}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {activeCategoryData?.interests.map((interest) => (
              <span
                key={interest.id}
                onClick={() => toggleTag(interest.id)}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "20px",
                  width: "calc((100% - 24px) / 4)",
                  height: "35px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  backgroundColor: selectedIds.has(interest.id)
                    ? "var(--color-primary)"
                    : "white",
                  color: selectedIds.has(interest.id) ? "white" : "#333",
                }}
              >
                {interest.name}
              </span>
            ))}
          </div>
        </>
      )}
    </PageLayout>
  );
}

export default InterestSelect;
