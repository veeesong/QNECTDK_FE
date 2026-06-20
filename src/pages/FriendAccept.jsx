import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Button from "../components/Button";
import { getProfileByPublicCode } from "../api/profile";
import {
  getReceivedRequests,
  acceptFriendRequest,
  requestFriend,
} from "../api/friend";
import { getCharacterImage } from "../utils/characterMap";

// 백엔드는 gender를 "MALE"/"FEMALE"로 내려줌 → 화면 표시용 한글로 변환
const genderLabel = (gender) => {
  if (gender === "MALE") return "남성";
  if (gender === "FEMALE") return "여성";
  return "";
};

function FriendAccept() {
  const location = useLocation();
  const navigate = useNavigate();

  const publicCode = location.state?.publicCode;

  const [friend, setFriend] = useState(null);
  // 이 스캔이 "이미 온 요청 수락"인지 "새 요청 보내기"인지 구분
  // pendingFriendshipId가 있으면 → 상대가 이미 나한테 요청을 보낸 상태 → 수락만 하면 됨
  const [pendingFriendshipId, setPendingFriendshipId] = useState(null);

  const [isLoading, setIsLoading] = useState(!!publicCode);
  const [errorMessage, setErrorMessage] = useState(
    publicCode ? "" : "QR 정보를 찾을 수 없습니다",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultStatus, setResultStatus] = useState(null); // "accepted" | "requested" | null

  useEffect(() => {
    if (!publicCode) {
      return;
    }

    let isCancelled = false;

    const fetchData = async () => {
      try {
        // 상대 프로필 조회와, 내가 받은 요청 목록 조회를 동시에 진행
        const [profileResult, receivedResult] = await Promise.all([
          getProfileByPublicCode(publicCode),
          getReceivedRequests(),
        ]);

        if (isCancelled) return;

        const friendData = profileResult.data;
        setFriend(friendData);

        // 받은 요청 중에 지금 스캔한 상대가 보낸 게 있는지 확인
        const matchingRequest = receivedResult.data.find(
          (req) =>
            req.requesterId === friendData.userId && req.status === "PENDING",
        );

        if (matchingRequest) {
          setPendingFriendshipId(matchingRequest.friendshipId);
        }
      } catch (err) {
        console.error("정보 조회 실패", err);
        if (!isCancelled) {
          setErrorMessage("친구 정보를 불러오지 못했습니다");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [publicCode]);

  const handleAction = async () => {
    setIsSubmitting(true);
    try {
      if (pendingFriendshipId) {
        // 상대가 이미 보낸 요청이 있으면 → 수락
        await acceptFriendRequest(pendingFriendshipId);
        setResultStatus("accepted");
      } else {
        // 아직 요청이 없으면 → 새로 보내기
        await requestFriend(friend.userId);
        setResultStatus("requested");
      }
    } catch (err) {
      console.error("친구 처리 실패", err);
      setErrorMessage("처리에 실패했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <p style={{ textAlign: "center", marginTop: "40px" }}>불러오는 중...</p>
      </PageLayout>
    );
  }

  if (errorMessage && !friend) {
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
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
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
          }}
        >
          <img
            src={getCharacterImage(friend.characterId)}
            alt={friend.name}
            style={{ width: "90px", height: "90px", objectFit: "contain" }}
          />
        </div>

        <p
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            margin: "16px 0 12px",
          }}
        >
          {friend.name}
        </p>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "20px",
            padding: "6px 16px",
            fontSize: "13px",
            color: "#555",
            marginBottom: "32px",
          }}
        >
          {friend.age}세 &nbsp;|&nbsp; {friend.school} &nbsp;|&nbsp;{" "}
          {genderLabel(friend.gender)}
        </div>

        <p
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "16px",
            lineHeight: "1.6",
            marginBottom: "24px",
          }}
        >
          {resultStatus === "accepted" && <>친구가 되었습니다!</>}
          {resultStatus === "requested" && (
            <>
              친구 요청을 보냈습니다.
              <br />
              상대방도 QR을 스캔하면 친구가 돼요!
            </>
          )}
          {resultStatus === null && pendingFriendshipId && (
            <>
              {friend.name}님이 QR을 스캔했어요.
              <br />
              친구가 되시겠습니까?
            </>
          )}
          {resultStatus === null && !pendingFriendshipId && (
            <>
              QR을 스캔했습니다.
              <br />
              친구 요청을 보내시겠습니까?
            </>
          )}
        </p>

        {errorMessage && (
          <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>
            {errorMessage}
          </p>
        )}

        <div style={{ width: "200px" }}>
          {resultStatus ? (
            <Button
              label="홈으로"
              onClick={() => navigate("/home")}
              variant="primary"
              size="full"
            />
          ) : (
            <Button
              label={
                isSubmitting
                  ? "처리 중..."
                  : pendingFriendshipId
                    ? "수락하기"
                    : "친구 요청 보내기"
              }
              onClick={handleAction}
              variant="primary"
              size="full"
              disabled={isSubmitting}
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default FriendAccept;
