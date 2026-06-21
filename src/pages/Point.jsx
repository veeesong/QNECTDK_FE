import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Header from "../components/Header";
import { getMyProfile } from "../api/profile";
import { getPointBalance } from "../api/points";
import { getCharacterImage } from "../utils/characterMap";

function PointPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, balanceRes] = await Promise.all([
          getMyProfile(),
          getPointBalance(),
        ]);
        setProfile(profileRes.data);
        setBalance(balanceRes.data.balance);
      } catch (err) {
        console.error("데이터 불러오기 실패", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <PageLayout>
      <Header title="포인트" onBack={() => navigate(-1)} />

      {/* 사용자 프로필 카드 */}
      <div
        style={{
          backgroundColor: "#ffe3d1",
          border: "2px solid #ffccb0",
          borderRadius: "16px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "14px",
          marginTop: "8px",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#FFEEE6",
            border: "2px solid #ffccb0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {!isLoading && profile && (
            <img
              src={getCharacterImage(profile.characterId)}
              alt="Character"
              style={{ width: "60px", height: "60px", objectFit: "contain" }}
            />
          )}
        </div>

        <div style={{ textAlign: "left" }}>
          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "4px",
              color: "#333",
            }}
          >
            {isLoading ? "..." : profile?.name}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            🪙 {isLoading ? "..." : `${balance?.toLocaleString()}P`}
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/buy-character")}
        style={{
          width: "100%",
          backgroundColor: "#ffe3d1",
          border: "2px solid #ffccb0",
          borderRadius: "16px",
          padding: "14px",
          fontSize: "15px",
          fontWeight: "bold",
          color: "#000000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          marginBottom: "24px",
        }}
      >
        캐릭터 구매하러 가기 ＞
      </button>

      <hr
        style={{
          border: "0",
          height: "1px",
          backgroundColor: "#f0f0f0",
          marginBottom: "20px",
        }}
      />

      <h3
        style={{
          textAlign: "left",
          fontSize: "18px",
          margin: "0 0 14px",
          color: "#333",
        }}
      >
        포인트 받으러 가기
      </h3>

      {/* 포인트 받기 섹션 1 */}
      <div
        style={{
          border: "2px solid #cfe2ff",
          backgroundColor: "#f0f7ff",
          borderRadius: "16px",
          padding: "18px",
          textAlign: "left",
          marginBottom: "14px",
        }}
      >
        <p
          style={{
            margin: "0 0 14px",
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#333",
            fontWeight: "500",
          }}
        >
          최근에 새로 추가한 친구의 퀴즈를 풀어
          <br /> 포인트를 모아보세요!
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => navigate("/quiz")}
            style={{
              backgroundColor: "#8cbfff",
              color: "#000000",
              border: "none",
              borderRadius: "20px",
              padding: "6px 14px",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            퀴즈풀러 가기 ＞
          </button>
        </div>
      </div>

      {/* 포인트 받기 섹션 2 */}
      <div
        style={{
          border: "2px solid #e1f0b0",
          backgroundColor: "#f9ffd9",
          borderRadius: "16px",
          padding: "18px",
          textAlign: "left",
        }}
      >
        <p
          style={{
            margin: "0 0 14px",
            fontSize: "14px",
            color: "#000000",
            fontWeight: "500",
            lineHeight: "1.5",
          }}
        >
          지금 바로 오늘의 퀴즈를 풀면
          <br /> 5P를 드립니다!
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => navigate("/home")}
            style={{
              backgroundColor: "#cbe368",
              color: "#444",
              border: "none",
              borderRadius: "20px",
              padding: "6px 14px",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            오늘의 퀴즈 ＞
          </button>
        </div>
      </div>
    </PageLayout>
  );
}

export default PointPage;
