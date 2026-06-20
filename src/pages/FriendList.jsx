import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import backIcon from "../assets/icon-back.png";
import searchIcon from "../assets/icon-search.png";
import { getFriends } from "../api/friend";
import { getCharacterImage } from "../utils/characterMap";

// 백엔드는 gender를 "MALE"/"FEMALE"로 줌 → 화면 표시용 한글 변환
const genderLabel = (gender) => {
  if (gender === "MALE") return "남성";
  if (gender === "FEMALE") return "여성";
  return "";
};

// birthYear(2005) -> 화면 표시용 "05" 형태로 변환 (공통 규칙)
const birthYearShort = (birthYear) => {
  if (!birthYear) return "";
  return String(birthYear).slice(2, 4);
};

// 친구 캐릭터 배경색 - 디자인 다양성을 위해 순서대로 돌려씀
const bgColors = ["#dde6fb", "#fde3e3", "#dcf5dc", "#fdf3c7", "#f0d7ff"];
const borderColors = ["#a8c0f0", "#f5b8b8", "#a8e0a8", "#f0dd8a", "#d8b8f5"];

function FriendList() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("내 친구");
  const [sortType, setSortType] = useState("최근 저장 순");
  const [searchText, setSearchText] = useState("");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const [friends, setFriends] = useState([]); // [{ friendshipId, savedAt, person }]
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // sortType -> API sort 파라미터로 변환
        const sortParam = sortType === "이름 순" ? "name" : "recent";
        const result = await getFriends(sortParam);
        setFriends(result.data);
      } catch (err) {
        console.error("친구 목록 조회 실패", err);
        setErrorMessage("친구 목록을 불러오지 못했습니다");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [sortType]);

  const toggleSelect = (friendshipId) => {
    if (!selectMode) {
      setSelectMode(true);
      setSelectedIds([friendshipId]);
      return;
    }
    setSelectedIds((prev) =>
      prev.includes(friendshipId)
        ? prev.filter((x) => x !== friendshipId)
        : [...prev, friendshipId],
    );
  };

  const handleGroupify = () => {
    // 그룹화 기능 자체는 다른 팀원 담당 (POST /api/groups/with-members)
    console.log("그룹화할 friendshipId들:", selectedIds);
    setSelectMode(false);
    setSelectedIds([]);
  };

  const filteredFriends = friends.filter((f) =>
    f.person.name.includes(searchText),
  );

  if (isLoading) {
    return (
      <PageLayout>
        <p style={{ textAlign: "center", marginTop: "40px" }}>불러오는 중...</p>
      </PageLayout>
    );
  }

  if (errorMessage) {
    return (
      <PageLayout>
        <p style={{ textAlign: "center", marginTop: "40px", color: "red" }}>
          {errorMessage}
        </p>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* 헤더 */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 0",
        }}
      >
        <img
          src={backIcon}
          alt="뒤로가기"
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            left: 0,
            width: "20px",
            height: "20px",
            cursor: "pointer",
          }}
        />
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>친구</span>
        <span
          style={{
            position: "absolute",
            right: 0,
            border: "1px solid var(--color-primary)",
            color: "var(--color-primary)",
            borderRadius: "20px",
            padding: "2px 12px",
            fontSize: "13px",
            fontWeight: "bold",
          }}
        >
          {friends.length}
        </span>
      </div>

      {/* 탭 */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #eee",
          marginBottom: "16px",
        }}
      >
        {["내 친구", "그룹"].map((t) => (
          <div
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "10px 0",
              fontWeight: tab === t ? "bold" : "normal",
              color: tab === t ? "var(--color-primary)" : "#888",
              borderBottom:
                tab === t ? "2px solid var(--color-primary)" : "none",
              cursor: "pointer",
            }}
          >
            {t}
          </div>
        ))}
      </div>

      {tab === "내 친구" && (
        <>
          {/* 필터 버튼들 */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <span
              style={{
                backgroundColor: "var(--color-primary)",
                color: "white",
                borderRadius: "20px",
                padding: "6px 14px",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              전체 {friends.length}
            </span>
            {["최근 저장 순", "이름 순"].map((s) => (
              <span
                key={s}
                onClick={() => setSortType(s)}
                style={{
                  border: "1px solid #ddd",
                  backgroundColor: sortType === s ? "#f5f5f5" : "white",
                  color: "#555",
                  borderRadius: "20px",
                  padding: "6px 14px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {s}
              </span>
            ))}
          </div>

          {/* 검색창 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ddd",
              borderRadius: "30px",
              padding: "10px 16px",
              marginBottom: "16px",
            }}
          >
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="친구 이름 검색"
              style={{
                border: "none",
                outline: "none",
                flex: 1,
                fontSize: "14px",
              }}
            />
            <img
              src={searchIcon}
              alt="검색"
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
            />
          </div>

          {/* 새로운 친구 추가하기 */}
          <div
            onClick={() => navigate("/add-friend")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid var(--color-primary)",
              backgroundColor: "#fdf0ea",
              borderRadius: "16px",
              padding: "16px 20px",
              marginBottom: "20px",
              cursor: "pointer",
            }}
          >
            <span style={{ fontWeight: "bold", fontSize: "15px" }}>
              새로운 친구 추가하기
            </span>
            <span
              style={{
                color: "var(--color-primary)",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              +
            </span>
          </div>

          {/* 그룹화하기 액션바 */}
          {selectMode && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "var(--color-primary)",
                borderRadius: "16px",
                padding: "12px 20px",
                marginBottom: "16px",
              }}
            >
              <span style={{ color: "white", fontWeight: "bold" }}>
                그룹화 하기
              </span>
              <span
                onClick={handleGroupify}
                style={{
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                네
              </span>
            </div>
          )}

          {/* 친구 목록 */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {filteredFriends.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "#aaa",
                  marginTop: "40px",
                }}
              >
                {friends.length === 0
                  ? "아직 친구가 없어요"
                  : "검색 결과가 없어요"}
              </p>
            ) : (
              filteredFriends.map((item, idx) => {
                const { friendshipId, person } = item;
                const isSelected = selectedIds.includes(friendshipId);
                const colorIdx = idx % bgColors.length;
                const topInterests = (person.interests || []).slice(0, 3);

                return (
                  <div key={friendshipId}>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start",
                        padding: "16px 0",
                      }}
                    >
                      <div
                        onClick={() => toggleSelect(friendshipId)}
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "50%",
                          backgroundColor: bgColors[colorIdx],
                          border: isSelected
                            ? "3px solid var(--color-primary)"
                            : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          cursor: "pointer",
                        }}
                      >
                        {isSelected ? (
                          <span
                            style={{
                              fontSize: "22px",
                              color: "var(--color-primary)",
                            }}
                          >
                            ✓
                          </span>
                        ) : (
                          <img
                            src={getCharacterImage(person.characterId)}
                            alt={person.name}
                            style={{ width: "40px", height: "40px" }}
                          />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              minWidth: 0,
                              flex: 1,
                              overflow: "hidden",
                            }}
                          >
                            {/* 이름 박스 */}
                            <span
                              style={{
                                backgroundColor: bgColors[colorIdx],
                                border: `1px solid ${borderColors[colorIdx]}`,
                                minWidth: "57px",
                                height: "25px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "0 8px",
                                fontSize: "16px",
                                fontWeight: "bold",
                                borderRadius: "6px",
                                flexShrink: 0,
                                boxSizing: "border-box",
                              }}
                            >
                              {person.name}
                            </span>

                            {/* 그룹 태그(Chip) - 가로 스크롤 */}
                            <div
                              className="tag-scroll"
                              style={{
                                display: "flex",
                                gap: "4px",
                                overflowX: "auto",
                                whiteSpace: "nowrap",
                                flex: 1,
                              }}
                            >
                              {(person.groupTags || []).map((tag) => (
                                <span
                                  key={tag}
                                  style={{
                                    backgroundColor: bgColors[colorIdx],
                                    border: `1px solid ${borderColors[colorIdx]}`,
                                    height: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "0 8px",
                                    fontSize: "7px",
                                    borderRadius: "8px",
                                    flexShrink: 0,
                                    whiteSpace: "nowrap",
                                    boxSizing: "border-box",
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <span
                            onClick={() =>
                              navigate("/friend-profile", {
                                state: { friend: { ...person, friendshipId } },
                              })
                            }
                            style={{
                              fontSize: "12px",
                              color: "#aaa",
                              cursor: "pointer",
                              flexShrink: 0,
                              marginLeft: "8px",
                            }}
                          >
                            더보기 &gt;
                          </span>
                        </div>

                        <p
                          style={{
                            fontSize: "13px",
                            color: "#666",
                            margin: "6px 0 4px",
                            textAlign: "left",
                          }}
                        >
                          {birthYearShort(person.birthYear)} |{" "}
                          {person.school || "학교 미입력"} |{" "}
                          {genderLabel(person.gender)}
                        </p>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "#222",
                            margin: 0,
                            textAlign: "left",
                          }}
                        >
                          {topInterests.map((t) => `#${t}`).join(" ")}
                        </p>
                      </div>
                    </div>
                    {idx < filteredFriends.length - 1 && (
                      <div style={{ borderTop: "1px solid #eee" }} />
                    )}
                  </div>
                );
              })
            )}
          </div>
          <div style={{ height: "120px", flexShrink: 0 }} />
        </>
      )}

      {tab === "그룹" && (
        <p style={{ textAlign: "center", color: "#888", marginTop: "60px" }}>
          그룹이 없습니다.
        </p>
      )}
    </PageLayout>
  );
}

export default FriendList;
