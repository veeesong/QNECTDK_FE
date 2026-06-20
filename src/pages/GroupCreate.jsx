import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import backIcon from "../assets/icon-back.png";
import searchIcon from "../assets/icon-search.png";

import dog from "../assets/animals/dog.png";
import dragon from "../assets/animals/dragon.png";
import horse from "../assets/animals/horse.png";
import monkey from "../assets/animals/monkey.png";
import mouse from "../assets/animals/mouse.png";
import ox from "../assets/animals/ox.png";
import pig from "../assets/animals/pig.png";
import rabbit from "../assets/animals/rabbit.png";
import rooster from "../assets/animals/rooster.png";
import sheep from "../assets/animals/sheep.png";
import snake from "../assets/animals/snake.png";
import tiger from "../assets/animals/tiger.png";

// 현재 내 친구 목록 (실제 데이터로 교체 필요)
const myFriends = [
  { id: 1, name: "정다연", animal: pig },
  { id: 2, name: "박하은", animal: rabbit },
  { id: 3, name: "최비성", animal: dragon },
  { id: 4, name: "송윤서", animal: sheep },
  { id: 5, name: "권효정", animal: dog },
  { id: 6, name: "이수민", animal: monkey },
  { id: 7, name: "김지유", animal: horse },
  { id: 8, name: "한지원", animal: tiger },
  { id: 9, name: "오세린", animal: ox },
  { id: 10, name: "강민지", animal: snake },
];

function GroupCreate() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]); // 추가된 태그 목록

  const filteredFriends = myFriends.filter((f) => f.name.includes(searchText));

  const toggleFriend = (friend) => {
    setSelectedFriends((prev) =>
      prev.find((f) => f.id === friend.id)
        ? prev.filter((f) => f.id !== friend.id)
        : [...prev, friend],
    );
  };

  const isSelected = (id) => selectedFriends.some((f) => f.id === id);

  // 태그 추가
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      // 중복 태그는 추가하지 않고 입력창만 비움
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, trimmed]);
    setTagInput("");
  };

  // 엔터 키 입력 처리
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // form submit 등 기본 동작 방지
      addTag();
    }
  };

  // 태그 삭제
  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

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
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            left: 0,
            width: "20px",
            cursor: "pointer",
          }}
        />
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>그룹</span>
      </div>

      {/* 탭 */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #eee",
          marginBottom: "24px",
        }}
      >
        <div
          onClick={() => navigate("/friend-list")}
          style={{
            flex: 1,
            textAlign: "center",
            padding: "10px 0",
            color: "#888",
            cursor: "pointer",
          }}
        >
          내 친구
        </div>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "10px 0",
            fontWeight: "bold",
            color: "var(--color-primary)",
            borderBottom: "2px solid var(--color-primary)",
            cursor: "pointer",
          }}
        >
          그룹
        </div>
      </div>

      {/* 그룹 이름 */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "10px" }}
        >
          그룹 이름
        </div>
        <input
          placeholder="ex. 교양 영어 5조"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "30px",
            border: "1px solid #FFBC92",
            backgroundColor: "#FFF8F5",
            fontSize: "14px",
            outline: "none",
            boxSizing: "border-box",
            color: "#333",
          }}
        />
      </div>

      {/* 구성원 */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "10px" }}
        >
          구성원
        </div>

        {/* 검색창 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #FFBC92",
            borderRadius: showDropdown ? "16px 16px 0 0" : "30px",
            padding: "10px 16px",
            backgroundColor: "#FFF8F5",
          }}
        >
          <input
            placeholder="친구 이름 검색"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            style={{
              border: "none",
              outline: "none",
              flex: 1,
              fontSize: "14px",
              backgroundColor: "transparent",
              color: "#333",
            }}
          />
          <img src={searchIcon} style={{ width: "18px" }} />
        </div>

        {/* 드롭다운 친구 목록 */}
        {showDropdown && (
          <div
            style={{
              border: "1px solid #FFBC92",
              borderTop: "none",
              borderRadius: "0 0 16px 16px",
              backgroundColor: "white",
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                onClick={() => toggleFriend(friend)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 16px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f5f5f5",
                }}
              >
                {/* 프로필 */}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "#FFE1C2",
                    border: "1px solid #FFBC92",
                    marginRight: "12px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={friend.animal}
                    alt={friend.name}
                    style={{
                      width: "80%",
                      height: "80%",
                      objectFit: "contain",
                    }}
                  />
                </div>

                {/* 이름 */}
                <span style={{ flex: 1, fontSize: "14px" }}>{friend.name}</span>

                {/* 체크박스 */}
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "4px",
                    backgroundColor: isSelected(friend.id) ? "#333" : "white",
                    border: "1px solid #ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isSelected(friend.id) && (
                    <span style={{ color: "white", fontSize: "13px" }}>✓</span>
                  )}
                </div>
              </div>
            ))}
            <div
              style={{ padding: "10px 16px", borderTop: "1px solid #f5f5f5" }}
            >
              <button
                onClick={() => setShowDropdown(false)}
                style={{
                  width: "100%",
                  padding: "10px 0",
                  borderRadius: "30px",
                  border: "none",
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                확인
              </button>
            </div>
          </div>
        )}

        {/* 안내 문구 */}
        <div
          style={{
            fontSize: "12px",
            color: "#aaa",
            marginTop: "8px",
            paddingLeft: "4px",
          }}
        >
          그룹에 추가할 친구를 검색해주세요
        </div>
        {selectedFriends.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "12px",
            }}
          >
            {selectedFriends.map((friend) => (
              <div
                key={friend.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#FFE1C2",
                  border: "1px solid #FFBC92",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  fontSize: "13px",
                }}
              >
                <img
                  src={friend.animal}
                  style={{
                    width: "20px",
                    height: "20px",
                    objectFit: "contain",
                  }}
                />
                <span>{friend.name}</span>
                <span
                  onClick={() => toggleFriend(friend)}
                  style={{
                    cursor: "pointer",
                    color: "#999",
                    fontWeight: "bold",
                  }}
                >
                  ✕
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 태그 추가 */}
      <div style={{ marginBottom: "40px" }}>
        <div
          style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "10px" }}
        >
          태그 추가
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            placeholder="ex. 동기 (입력 후 Enter)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            style={{
              flex: 1,
              minWidth: 0,
              padding: "12px 16px",
              borderRadius: "30px",
              border: "1px solid #FFBC92",
              backgroundColor: "#FFF8F5",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
              color: "#333",
            }}
          />
          <button
            type="button"
            onClick={addTag}
            style={{
              flexShrink: 0,
              padding: "12px 20px",
              borderRadius: "30px",
              border: "none",
              backgroundColor: "var(--color-primary)",
              color: "white",
              fontWeight: "bold",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            확인
          </button>
        </div>

        {/* 추가된 태그 목록 */}
        {tags.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "12px",
            }}
          >
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#FFE1C2",
                  border: "1px solid #FFBC92",
                  borderRadius: "20px",
                  padding: "6px 12px",
                  fontSize: "13px",
                }}
              >
                <span>#{tag}</span>
                <span
                  onClick={() => removeTag(tag)}
                  style={{
                    cursor: "pointer",
                    color: "#999",
                    fontWeight: "bold",
                  }}
                >
                  ✕
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 그룹 만들기 버튼 */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => {
            // 그룹 생성 로직 추가 필요 (groupName, selectedFriends, tags 사용)
            navigate("/group-list");
          }}
          style={{
            backgroundColor: "var(--color-primary)",
            color: "white",
            border: "none",
            borderRadius: "30px",
            padding: "14px 60px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          그룹만들기
        </button>
      </div>
    </PageLayout>
  );
}

export default GroupCreate;
