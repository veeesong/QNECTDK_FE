import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import backIcon from "../assets/icon-back.png";

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

const groupThemes = [
  {
    id: 1,
    name: "24학번 동기",
    boxBg: "#F2F8FF",
    profileTagBg: "#C2E5FF",
    border: "#61B8FF",
    tagBg: "#DCEEFF",
  },
  {
    id: 2,
    name: "멋쟁이사자처럼",
    boxBg: "#FFF3E8",
    profileTagBg: "#FFE1C2",
    border: "#FFBC92",
    tagBg: "#FFE8D0",
  },
  {
    id: 3,
    name: "912호 룸메",
    boxBg: "#F6FFE6",
    profileTagBg: "#EBFFBC",
    border: "#B9EE98",
    tagBg: "#E0FFB8",
  },
  {
    id: 4,
    name: "극예술연구회",
    boxBg: "#FFFCE9",
    profileTagBg: "#FFF9BC",
    border: "#FFE44C",
    tagBg: "#FFF9BC",
  },
  {
    id: 5,
    name: "연합프로젝트 1조",
    boxBg: "#F9EEFF",
    profileTagBg: "#D7C9FF",
    border: "#9B69FF",
    tagBg: "#D7C9FF",
  },
];

const groupMembers = {
  1: [
    {
      id: 1,
      name: "정다연",
      mbti: "ISTJ",
      school: "동덕여자대학교",
      grade: "05",
      tags: ["여행", "음악감상", "맛집투어"],
      animal: pig,
    },
    {
      id: 2,
      name: "박하은",
      mbti: "ENFP",
      school: "동덕여자대학교",
      grade: "05",
      tags: ["독서", "카페", "영화"],
      animal: rabbit,
    },
    {
      id: 3,
      name: "최비성",
      mbti: "INTJ",
      school: "동덕여자대학교",
      grade: "05",
      tags: ["게임", "운동", "코딩"],
      animal: dragon,
    },
  ],
  2: [
    {
      id: 1,
      name: "정다연",
      mbti: "ISTJ",
      school: "동덕여자대학교",
      grade: "05",
      tags: ["여행", "음악감상", "맛집투어"],
      animal: pig,
    },
    {
      id: 2,
      name: "송윤서",
      mbti: "INFP",
      school: "동덕여자대학교",
      grade: "05",
      tags: ["그림", "음악", "산책"],
      animal: rabbit,
    },
    {
      id: 3,
      name: "권효정",
      mbti: "ESFJ",
      school: "동덕여자대학교",
      grade: "05",
      tags: ["요리", "패션", "여행"],
      animal: dog,
    },
  ],
  3: [
    {
      id: 1,
      name: "이수민",
      mbti: "ENFJ",
      school: "동덕여자대학교",
      grade: "05",
      tags: ["독서", "요가", "카페"],
      animal: sheep,
    },
    {
      id: 2,
      name: "김지유",
      mbti: "ISFP",
      school: "동덕여자대학교",
      grade: "05",
      tags: ["그림", "음악", "영화"],
      animal: monkey,
    },
  ],
  4: [
    {
      id: 1,
      name: "한지원",
      mbti: "ENTP",
      school: "동덕여자대학교",
      grade: "05",
      tags: ["연극", "영화", "독서"],
      animal: tiger,
    },
    {
      id: 2,
      name: "오세린",
      mbti: "INFJ",
      school: "동덕여자대학교",
      grade: "05",
      tags: ["글쓰기", "산책", "카페"],
      animal: horse,
    },
  ],
  5: [
    {
      id: 1,
      name: "강민지",
      mbti: "ESTJ",
      school: "동덕여자대학교",
      grade: "05",
      tags: ["코딩", "운동", "게임"],
      animal: ox,
    },
    {
      id: 2,
      name: "윤채은",
      mbti: "INTP",
      school: "동덕여자대학교",
      grade: "05",
      tags: ["독서", "음악", "카페"],
      animal: snake,
    },
    {
      id: 3,
      name: "임서현",
      mbti: "ENFP",
      school: "동덕여자대학교",
      grade: "05",
      tags: ["여행", "사진", "맛집투어"],
      animal: rooster,
    },
  ],
};

function GroupDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const groupId = parseInt(id);

  const group = groupThemes.find((g) => g.id === groupId);
  const members = groupMembers[groupId] || [];

  if (!group) return <div>그룹을 찾을 수 없습니다.</div>;

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

      {/* 그룹 이름 태그 - 왼쪽 상단 */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            backgroundColor: group.boxBg,
            border: `1px solid ${group.border}`,
            borderRadius: "20px",
            padding: "6px 16px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          {group.name}
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
        {members.map((member) => (
          <div
            key={member.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px",
              borderRadius: "20px",
              border: `1px solid ${group.border}`,
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
                backgroundColor: group.profileTagBg,
                border: `1px solid ${group.border}`,
                marginRight: "16px",
                flexShrink: 0,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={member.animal}
                alt={member.name}
                style={{ width: "80%", height: "80%", objectFit: "contain" }}
              />
            </div>

            {/* 텍스트 정보 */}
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              {/* 이름 + 그룹 태그 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "4px",
                }}
              >
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                  {member.name}
                </span>
                <span
                  style={{
                    fontSize: "9px",
                    color: group.border,
                    fontWeight: "bold",
                    backgroundColor: group.tagBg,
                    border: `0.5px solid ${group.border}`,
                    padding: "0px 6px",
                    lineHeight: "1.8",
                    borderRadius: "8px",
                  }}
                >
                  {group.name}
                </span>
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
                {member.mbti} | {member.school} | {member.grade}
              </div>

              {/* 관심사 태그 */}
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {member.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: "11px",
                      color: "#777",
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

export default GroupDetail;
