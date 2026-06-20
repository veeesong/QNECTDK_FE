import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import backIcon from "../assets/icon-back.png";
import searchIcon from "../assets/icon-search.png";

const groupThemes = [
  {
    id: 1,
    name: "24학번 동기",
    count: 18,
    tags: ["동기", "학교", "OT"],
    boxBg: "#F2F8FF",
    profileTagBg: "#C2E5FF",
    border: "#61B8FF",
  },
  {
    id: 2,
    name: "멋쟁이사자처럼",
    count: 23,
    tags: ["동아리", "해커톤"],
    boxBg: "#FFF3E8",
    profileTagBg: "#FFE1C2",
    border: "#FFBC92",
  },
  {
    id: 3,
    name: "912호 룸메",
    count: 4,
    tags: ["기숙사"],
    boxBg: "#F6FFE6",
    profileTagBg: "#EBFFBC",
    border: "#B9EE98",
  },
  {
    id: 4,
    name: "극예술연구회",
    count: 21,
    tags: ["중앙동아리", "연극"],
    boxBg: "#FFFCE9", // 노란색으로 변경
    profileTagBg: "#FFF9BC",
    border: "#FFE44C",
  },
  {
    id: 5,
    name: "연합프로젝트 1조",
    count: 6,
    tags: ["국민대학교", "동덕여자대학교"],
    boxBg: "#F9EEFF",
    profileTagBg: "#D7C9FF",
    border: "#9B69FF",
  },
];

function GroupList() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const filteredGroups = groupThemes.filter((g) => g.name.includes(searchText));

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
        onClick={() => setShowModal(true)}
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
              현재 포인트 : 1250P
            </p>
            <p style={{ fontSize: "13px", marginBottom: "28px" }}>
              10P를 사용하여 그룹을 추가하시겠습니까?
            </p>

            {/* 버튼 영역 */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
              }}
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

      {/* 리스트 목록 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          paddingBottom: "100px",
        }}
      >
        {filteredGroups.map((g) => (
          <div
            key={g.id}
            onClick={() => navigate(`/group-detail/${g.id}`)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px",
              borderRadius: "20px",
              border: `1px solid ${g.border}`,
              backgroundColor: g.boxBg,
              cursor: "pointer",
              width: "327px",
              height: "109px",
              boxSizing: "border-box",
            }}
          >
            {/* 프로필 이미지 */}
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: g.profileTagBg,
                border: `1px solid ${g.border}`,
                marginRight: "16px",
                flexShrink: 0,
              }}
            />

            {/* 텍스트 정보 영역 */}
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
                인원 {g.count}명
              </div>

              {/* 태그 영역 */}
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {g.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: "9px",
                      backgroundColor: g.profileTagBg,
                      border: `0.5px solid ${g.border}`,
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
        ))}
      </div>
    </PageLayout>
  );
}

export default GroupList;
