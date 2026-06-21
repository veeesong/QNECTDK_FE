import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import backIcon from "../assets/icon-back.png";
import { getGroupMembers } from "../api/group";
import { getCharacterImage } from "../utils/characterMap";

// 그룹 색상 테마 (groupId % 5 로 순환)
const colorThemes = [
  {
    boxBg: "#F2F8FF",
    profileTagBg: "#C2E5FF",
    border: "#61B8FF",
    tagBg: "#DCEEFF",
  },
  {
    boxBg: "#FFF3E8",
    profileTagBg: "#FFE1C2",
    border: "#FFBC92",
    tagBg: "#FFE8D0",
  },
  {
    boxBg: "#F6FFE6",
    profileTagBg: "#EBFFBC",
    border: "#B9EE98",
    tagBg: "#E0FFB8",
  },
  {
    boxBg: "#FFFCE9",
    profileTagBg: "#FFF9BC",
    border: "#FFE44C",
    tagBg: "#FFF9BC",
  },
  {
    boxBg: "#F9EEFF",
    profileTagBg: "#D7C9FF",
    border: "#9B69FF",
    tagBg: "#D7C9FF",
  },
];

function GroupDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const groupId = parseInt(id);

  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // groupId 기준으로 색상 테마 고정
  const theme = colorThemes[(groupId - 1) % colorThemes.length];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getGroupMembers(groupId);
        setGroupName(res.data.name);
        setMembers(res.data.members);
      } catch (err) {
        console.error("그룹 상세 불러오기 실패", err);
        setError("그룹 정보를 불러오지 못했습니다");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [groupId]);

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
          onClick={() => navigate("/group-list")}
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

      {isLoading ? (
        <p style={{ textAlign: "center", color: "#aaa" }}>불러오는 중...</p>
      ) : error ? (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      ) : (
        <>
          {/* 그룹 이름 태그 */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                backgroundColor: theme.boxBg,
                border: `1px solid ${theme.border}`,
                borderRadius: "20px",
                padding: "6px 16px",
                fontSize: "14px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              {groupName}
            </span>
          </div>

          {/* 멤버 리스트 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              paddingBottom: "100px",
            }}
          >
            {members.length === 0 ? (
              <p style={{ textAlign: "center", color: "#aaa" }}>
                멤버가 없습니다
              </p>
            ) : (
              members.map((m) => {
                const p = m.person;
                // birthYear 뒤 2자리로 변환 (예: 2005 → "05")
                const grade = p.birthYear ? String(p.birthYear).slice(2) : "-";

                return (
                  <div
                    key={m.memberId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "16px",
                      borderRadius: "20px",
                      border: `1px solid ${theme.border}`,
                      backgroundColor: "white",
                      boxSizing: "border-box",
                    }}
                  >
                    {/* 프로필 이미지 */}
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: theme.profileTagBg,
                        border: `1px solid ${theme.border}`,
                        marginRight: "16px",
                        flexShrink: 0,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={getCharacterImage(p.characterId)}
                        alt={p.name}
                        style={{
                          width: "80%",
                          height: "80%",
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    {/* 텍스트 */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      {/* 이름 + groupTags */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "4px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                          {p.name}
                        </span>
                        {p.groupTags?.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: "9px",
                              color: theme.border,
                              fontWeight: "bold",
                              backgroundColor: theme.tagBg,
                              border: `0.5px solid ${theme.border}`,
                              padding: "0px 6px",
                              lineHeight: "1.8",
                              borderRadius: "8px",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* MBTI | 학교 | 학번 */}
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginBottom: "6px",
                          textAlign: "left",
                        }}
                      >
                        {p.mbti ?? "-"} | {p.school ?? "-"} | {grade}
                      </div>

                      {/* 관심사 */}
                      <div
                        style={{
                          display: "flex",
                          gap: "4px",
                          flexWrap: "wrap",
                        }}
                      >
                        {p.interests?.map((t) => (
                          <span
                            key={t}
                            style={{ fontSize: "11px", color: "#777" }}
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
        </>
      )}
    </PageLayout>
  );
}

export default GroupDetail;
