import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import backIcon from "../assets/icon-back.png";
import searchIcon from "../assets/icon-search.png";
import { getGroups } from "../api/group";
import { getPointBalance } from "../api/points";

// 그룹 카드 색상 테마 (순서대로 순환)
const colorThemes = [
  { boxBg: "#F2F8FF", profileTagBg: "#C2E5FF", border: "#61B8FF" },
  { boxBg: "#FFF3E8", profileTagBg: "#FFE1C2", border: "#FFBC92" },
  { boxBg: "#F6FFE6", profileTagBg: "#EBFFBC", border: "#B9EE98" },
  { boxBg: "#FFFCE9", profileTagBg: "#FFF9BC", border: "#FFE44C" },
  { boxBg: "#F9EEFF", profileTagBg: "#D7C9FF", border: "#9B69FF" },
];

function GroupList() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupRes = await getGroups();
        setGroups(groupRes.data);
      } catch (err) {
        console.error("그룹 목록 불러오기 실패", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 모달 열 때만 포인트 조회
  const handleOpenModal = async () => {
    try {
      const balanceRes = await getPointBalance();
      setBalance(balanceRes.data.balance);
    } catch (err) {
      console.error("포인트 조회 실패", err);
    }
    setShowModal(true);
  };

  const filteredGroups = groups.filter((g) => g.name.includes(searchText));

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
          {filteredGroups.length}
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

      {/* 검색창 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #ddd",
          borderRadius: "30px",
          padding: "10px 16px",
          margin: "0 24px 16px",
        }}
      >
        <input
          placeholder="그룹 이름 검색"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ border: "none", outline: "none", flex: 1, fontSize: "14px" }}
        />
        <img src={searchIcon} style={{ width: "18px", cursor: "pointer" }} />
      </div>

      {/* 그룹 추가 버튼 */}
      <div
        onClick={handleOpenModal}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid var(--color-primary)",
          backgroundColor: "#fdf0ea",
          borderRadius: "16px",
          padding: "16px 20px",
          margin: "0 24px 20px",
          cursor: "pointer",
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: "15px" }}>
          새로운 그룹 추가하기
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

      {/* 포인트 차감 모달 */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "var(--color-primary)",
              borderRadius: "24px",
              padding: "32px 24px",
              width: "300px",
              textAlign: "center",
              color: "white",
            }}
          >
            <p
              style={{
                fontSize: "17px",
                fontWeight: "bold",
                lineHeight: "1.6",
                marginBottom: "20px",
              }}
            >
              그룹은 최대 5개까지 무료로
              <br />
              생성 가능하며, 6개부터는
              <br />
              10P가 차감됩니다.
            </p>
            <p
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "12px",
              }}
            >
              현재 포인트 :{" "}
              {balance !== null ? `${balance.toLocaleString()}P` : "..."}
            </p>
            <p style={{ fontSize: "13px", marginBottom: "28px" }}>
              {groups.length >= 5
                ? "10P를 사용하여 그룹을 추가하시겠습니까?"
                : `무료로 그룹을 추가하시겠습니까? (${groups.length}/5)`}
            </p>

            <div
              style={{ display: "flex", gap: "12px", justifyContent: "center" }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: "30px",
                  border: "none",
                  backgroundColor: "white",
                  color: "var(--color-primary)",
                  fontWeight: "bold",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                아니오
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  navigate("/group-create");
                }}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: "30px",
                  border: "2px solid white",
                  backgroundColor: "transparent",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 그룹 리스트 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          paddingBottom: "100px",
        }}
      >
        {isLoading ? (
          <p style={{ color: "#aaa" }}>불러오는 중...</p>
        ) : filteredGroups.length === 0 ? (
          <p style={{ color: "#aaa" }}>그룹이 없습니다</p>
        ) : (
          filteredGroups.map((g, index) => {
            const theme = colorThemes[index % colorThemes.length];
            return (
              <div
                key={g.groupId}
                onClick={() => navigate(`/group-detail/${g.groupId}`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px",
                  borderRadius: "20px",
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.boxBg,
                  cursor: "pointer",
                  width: "327px",
                  height: "109px",
                  boxSizing: "border-box",
                }}
              >
                {/* 프로필 원 */}
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: theme.profileTagBg,
                    border: `1px solid ${theme.border}`,
                    marginRight: "16px",
                    flexShrink: 0,
                  }}
                />

                {/* 텍스트 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    flex: 1,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      marginBottom: "2px",
                    }}
                  >
                    {g.name}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#666",
                      marginBottom: "6px",
                    }}
                  >
                    인원 {g.memberCount}명
                  </div>

                  {/* 해시태그 */}
                  <div
                    style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}
                  >
                    {g.hashtags.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: "9px",
                          backgroundColor: theme.profileTagBg,
                          border: `0.5px solid ${theme.border}`,
                          padding: "0px 6px",
                          lineHeight: "1.8",
                          borderRadius: "8px",
                          color: "#555",
                        }}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </PageLayout>
  );
}

export default GroupList;
