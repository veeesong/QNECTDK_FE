import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import backIcon from "../assets/icon-back.png";
import mouseImg from "../assets/animals/mouse.png";
import roosterImg from "../assets/animals/rooster.png";
import dragonImg from "../assets/animals/dragon.png";
import sheepImg from "../assets/animals/sheep.png";
import tigerImg from "../assets/animals/tiger.png";
import snakeImg from "../assets/animals/snake.png";
import searchIcon from "../assets/icon-search.png";

const dummyFriends = [
  {
    id: 1,
    name: "이무영",
    img: mouseImg,
    bgColor: "#dde6fb",
    borderColor: "#a8c0f0",
    tags: ["멋쟁이사자처럼", "인하대학교"],
    birthCode: "05",
    school: "인하대학교",
    gender: "남성",
    allTags: ["여행", "음악감상", "맛집투어", "카페알바"],
  },
  {
    id: 2,
    name: "이서현",
    img: roosterImg,
    bgColor: "#fde3e3",
    borderColor: "#f5b8b8",
    tags: ["대외활동", "숙명여자대학교"],
    birthCode: "04",
    school: "숙명여자대학교",
    gender: "여성",
    allTags: ["운동", "영화", "카페투어"],
  },
  {
    id: 3,
    name: "김민혁",
    img: dragonImg,
    bgColor: "#dcf5dc",
    borderColor: "#a8e0a8",
    tags: ["한국외국어대학교"],
    birthCode: "01",
    school: "한국외국어대학교",
    gender: "남성",
    allTags: ["게임", "밴드", "여행", "독서"],
  },
  {
    id: 4,
    name: "강민정",
    img: sheepImg,
    bgColor: "#fde3e3",
    borderColor: "#f5b8b8",
    tags: ["홍익대학교", "밴드부"],
    birthCode: "06",
    school: "홍익대학교",
    gender: "여성",
    allTags: ["음악감상", "밴드", "카페알바"],
  },
  {
    id: 5,
    name: "구서연",
    img: tigerImg,
    bgColor: "#fdf3c7",
    borderColor: "#f0dd8a",
    tags: ["경북대학교"],
    birthCode: "03",
    school: "경북대학교",
    gender: "여성",
    allTags: ["독서", "여행", "요리"],
  },
  {
    id: 6,
    name: "김미지",
    img: snakeImg,
    bgColor: "#dde6fb",
    borderColor: "#a8c0f0",
    tags: ["충북대학교"],
    birthCode: "07",
    school: "충북대학교",
    gender: "여성",
    allTags: ["영화", "음악감상", "반려동물", "게임"],
  },
];

function FriendList() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("내 친구");
  const [sortType, setSortType] = useState("최근 저장 순");
  const [searchText, setSearchText] = useState("");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (id) => {
    if (!selectMode) {
      setSelectMode(true);
      setSelectedIds([id]);
      return;
    }
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleGroupify = () => {
    console.log("그룹화할 친구:", selectedIds);
    setSelectMode(false);
    setSelectedIds([]);
  };

  const filteredFriends = dummyFriends.filter((f) =>
    f.name.includes(searchText),
  );

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
          {dummyFriends.length}
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
            onClick={() => {
              if (t === "그룹") {
                navigate("/group-list");
              } else {
                setTab(t);
              }
            }}
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
              전체 {dummyFriends.length}
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
              onClick={() => console.log("검색 실행:", searchText)}
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
            {filteredFriends.map((friend, idx) => {
              const isSelected = selectedIds.includes(friend.id);
              const topTags = friend.allTags.slice(0, 3);
              return (
                <div key={friend.id}>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                      padding: "16px 0",
                    }}
                  >
                    <div
                      onClick={() => toggleSelect(friend.id)}
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        backgroundColor: friend.bgColor,
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
                          src={friend.img}
                          alt={friend.name}
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
                              backgroundColor: friend.bgColor,
                              border: `1px solid ${friend.borderColor}`,
                              width: "57px",
                              height: "25px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "16px",
                              fontWeight: "bold",
                              borderRadius: "6px",
                              flexShrink: 0,
                              boxSizing: "border-box",
                            }}
                          >
                            {friend.name}
                          </span>

                          {/* 학교/그룹 태그 - 가로 스크롤 */}
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
                            {friend.tags.map((tag) => (
                              <span
                                key={tag}
                                style={{
                                  backgroundColor: friend.bgColor,
                                  border: `1px solid ${friend.borderColor}`,
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
                            navigate("/friend-profile", { state: { friend } })
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
                        {friend.birthCode} | {friend.school} | {friend.gender}
                      </p>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#222",
                          margin: 0,
                          textAlign: "left",
                        }}
                      >
                        {topTags.map((t) => `#${t}`).join(" ")}
                      </p>
                    </div>
                  </div>
                  {idx < filteredFriends.length - 1 && (
                    <div style={{ borderTop: "1px solid #eee" }} />
                  )}
                </div>
              );
            })}
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
