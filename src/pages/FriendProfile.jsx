import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Header from "../components/Header";
import Button from "../components/Button";
import editIcon from "../assets/icon-edit.png";
import trashIcon from "../assets/icon-trash.png";
import { getFriendMemo, updateFriendMemo } from "../api/friend";
import { getCharacterImage } from "../utils/characterMap";

// 백엔드는 gender를 "MALE"/"FEMALE"로 줌 → 화면 표시용 한글 변환
const genderLabel = (gender) => {
  if (gender === "MALE") return "남성";
  if (gender === "FEMALE") return "여성";
  return "";
};

// birthYear(2005) -> 화면 표시용 "05" 형태로 변환
const birthYearShort = (birthYear) => {
  if (!birthYear) return "";
  return String(birthYear).slice(2, 4);
};

const tagColors = ["#FFD7B5", "#FFC9C9", "#D7E8FF", "#D7FFD9", "#F0D7FF"];

function FriendProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  // FriendList.jsx에서 navigate state로 person 객체 + friendshipId를 넘겨줌
  const friend = location.state?.friend;

  // 메모 API는 friendId(=userId) 기준
  const friendId = friend?.userId;

  const [memo, setMemo] = useState("");
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [isMemoLoading, setIsMemoLoading] = useState(true);

  // 화면 진입 시 기존 메모 불러오기
  useEffect(() => {
    if (!friendId) {
      setIsMemoLoading(false);
      return;
    }

    let isCancelled = false;

    const fetchMemo = async () => {
      try {
        const result = await getFriendMemo(friendId);
        if (!isCancelled) {
          setMemo(result.data?.content || "");
        }
      } catch (err) {
        // 메모가 아직 없는 경우(MEMO_NOT_FOUND 등)도 정상 상황이라 에러 메시지는 띄우지 않음
        console.error("메모 조회 실패", err);
      } finally {
        if (!isCancelled) {
          setIsMemoLoading(false);
        }
      }
    };

    fetchMemo();

    return () => {
      isCancelled = true;
    };
  }, [friendId]);

  // 메모 저장 (입력창 벗어날 때)
  const handleMemoSave = async () => {
    setIsEditingMemo(false);

    if (!friendId) return;

    try {
      await updateFriendMemo(friendId, memo);
    } catch (err) {
      console.error("메모 저장 실패", err);
      // 메모는 부가 기능이라 실패해도 화면을 막지 않고 콘솔에만 기록
    }
  };

  const handleDelete = () => {
    if (window.confirm("친구를 삭제하시겠습니까?")) {
      // TODO: 친구 삭제 API가 별도로 있는지 확인 필요 (백엔드 문서에 명시 안 됨)
      console.log("친구 삭제:", friend?.name);
      navigate(-1);
    }
  };

  // FriendList를 거치지 않고 직접 URL로 들어온 경우 등 friend 정보가 없으면 안내
  if (!friend) {
    return (
      <PageLayout>
        <Header title="친구" onBack={() => window.history.back()} />
        <p style={{ textAlign: "center", marginTop: "40px", color: "#aaa" }}>
          친구 정보를 찾을 수 없습니다
        </p>
      </PageLayout>
    );
  }

  const infoFields = [
    { label: "이름", value: friend.name },
    { label: "학교", value: friend.school || "미입력" },
    {
      label: "출생년도",
      value: friend.birthYear ? `${friend.birthYear}년` : "미입력",
    },
    { label: "MBTI", value: friend.mbti || "미입력" },
  ];

  return (
    <PageLayout>
      <Header
        title="친구"
        onBack={() => window.history.back()}
        rightButton={
          <img
            src={trashIcon}
            alt="삭제"
            onClick={handleDelete}
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
          />
        }
      />

      <div
        style={{ textAlign: "center", marginTop: "24px", marginBottom: "20px" }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            backgroundColor: "#dde6fb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
          }}
        >
          <img
            src={getCharacterImage(friend.characterId)}
            alt={friend.name}
            style={{ width: "85px", height: "85px", objectFit: "contain" }}
          />
        </div>

        <p
          style={{
            fontWeight: "bold",
            fontSize: "20px",
            margin: "16px 0 10px",
          }}
        >
          {friend.name}
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "227px",
            height: "25px",
            backgroundColor: "#dde6fb",
            border: "1px solid black",
            borderRadius: "20px",
            fontSize: "12px",
            color: "#555",
          }}
        >
          {birthYearShort(friend.birthYear)}년생 |{" "}
          {friend.school || "학교 미입력"} | {genderLabel(friend.gender)}
        </div>
      </div>

      {/* 관심사 태그 - + 버튼 없음 */}
      <div
        className="tag-scroll"
        style={{
          display: "flex",
          gap: "6px",
          alignItems: "center",
          overflowX: "auto",
          minHeight: "32px",
          flexShrink: 0,
          marginBottom: "20px",
          marginTop: "1px",
        }}
      >
        {(friend.interests || []).map((tag, i) => (
          <span
            key={tag}
            style={{
              backgroundColor: tagColors[i % tagColors.length],
              border: "1px solid black",
              borderRadius: "20px",
              padding: "0 10px",
              height: "23px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              flexShrink: 0,
              boxSizing: "border-box",
              whiteSpace: "nowrap",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 메모 입력칸 */}
      <div
        style={{
          border: "1px solid black",
          borderRadius: "12px",
          padding: "12px",
          minHeight: "70px",
          marginBottom: "20px",
          position: "relative",
        }}
      >
        {isEditingMemo ? (
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            onBlur={handleMemoSave}
            autoFocus
            placeholder="메모"
            style={{
              width: "100%",
              height: "50px",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: "14px",
              fontFamily: "inherit",
            }}
          />
        ) : (
          <p
            style={{
              fontSize: "14px",
              color: memo ? "#333" : "#aaa",
              margin: 0,
            }}
          >
            {isMemoLoading ? "불러오는 중..." : memo || "메모"}
          </p>
        )}
        <img
          src={editIcon}
          alt="편집"
          onClick={() => setIsEditingMemo(true)}
          style={{
            position: "absolute",
            bottom: "10px",
            right: "12px",
            width: "14px",
            height: "14px",
            cursor: "pointer",
          }}
        />
      </div>

      {/* 친구 정보 카드 */}
      <div
        style={{
          backgroundColor: "#fdeee0",
          border: "1px solid black",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "20px",
        }}
      >
        <p
          style={{
            fontWeight: "bold",
            marginBottom: "12px",
            textAlign: "center",
          }}
        >
          친구 정보
        </p>
        {infoFields.map((field) => (
          <div
            key={field.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
            }}
          >
            <span style={{ color: "#888", fontSize: "14px" }}>
              {field.label}
            </span>
            <span style={{ fontSize: "14px" }}>{field.value}</span>
          </div>
        ))}
      </div>

      {/* 퀴즈 풀기 버튼 - 퀴즈 그룹은 다른 팀원 담당, 경로만 유지 */}
      <Button
        label="퀴즈 풀기"
        onClick={() => navigate("/quiz-solve")}
        variant="primary"
        size="full"
      />

      <div style={{ height: "90px", flexShrink: 0 }} />
    </PageLayout>
  );
}

export default FriendProfile;
