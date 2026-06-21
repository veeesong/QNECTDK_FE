import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import backIcon from "../assets/icon-back.png";
import searchIcon from "../assets/icon-search.png";
import { getFriendSummaries } from "../api/friend";
import { createGroupWithMembers } from "../api/group";
import { getCharacterImage } from "../utils/characterMap";

function GroupCreate() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await getFriendSummaries();
        setFriendList(res.data);
      } catch (err) {
        console.error("친구 목록 불러오기 실패", err);
      }
    };
    fetchFriends();
  }, []);

  const filteredFriends = friendList.filter((f) => f.name.includes(searchText));

  const toggleFriend = (friend) => {
    setSelectedFriends((prev) =>
      prev.find((f) => f.friendId === friend.friendId)
        ? prev.filter((f) => f.friendId !== friend.friendId)
        : [...prev, friend],
    );
  };

  const isSelected = (friendId) =>
    selectedFriends.some((f) => f.friendId === friendId);

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, trimmed]);
    setTagInput("");
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setErrorMessage("그룹 이름을 입력해주세요");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      await createGroupWithMembers({
        name: groupName.trim(),
        hashtags: tags,
        friendIds: selectedFriends.map((f) => f.friendId),
      });
      navigate("/group-list");
    } catch (err) {
      const code = err.response?.data?.error?.code;
      if (code === "DUPLICATE_GROUP_NAME") {
        setErrorMessage("이미 같은 이름의 그룹이 있습니다");
      } else if (code === "INSUFFICIENT_POINT") {
        setErrorMessage("포인트가 부족합니다");
      } else {
        setErrorMessage("그룹 생성에 실패했습니다");
      }
    } finally {
      setIsSubmitting(false);
    }
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

        {/* 드롭다운 */}
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
                key={friend.friendId}
                onClick={() => toggleFriend(friend)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 16px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f5f5f5",
                }}
              >
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
                    src={getCharacterImage(friend.characterId)}
                    alt={friend.name}
                    style={{
                      width: "80%",
                      height: "80%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <span style={{ flex: 1, fontSize: "14px" }}>{friend.name}</span>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "4px",
                    backgroundColor: isSelected(friend.friendId)
                      ? "#333"
                      : "white",
                    border: "1px solid #ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isSelected(friend.friendId) && (
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

        {/* 선택된 친구 칩 */}
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
                key={friend.friendId}
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
                  src={getCharacterImage(friend.characterId)}
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

      {/* 에러 메시지 */}
      {errorMessage && (
        <p
          style={{
            color: "red",
            fontSize: "13px",
            textAlign: "center",
            marginBottom: "12px",
          }}
        >
          {errorMessage}
        </p>
      )}

      {/* 그룹 만들기 버튼 */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={handleCreateGroup}
          disabled={isSubmitting}
          style={{
            backgroundColor: "var(--color-primary)",
            color: "white",
            border: "none",
            borderRadius: "30px",
            padding: "14px 60px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: isSubmitting ? "default" : "pointer",
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? "생성 중..." : "그룹만들기"}
        </button>
      </div>
    </PageLayout>
  );
}

export default GroupCreate;
