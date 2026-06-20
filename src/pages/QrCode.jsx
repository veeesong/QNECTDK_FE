import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import Header from "../components/Header";
import Button from "../components/Button";
import shareIcon from "../assets/icon-share.png";
import { getMyShareInfo, getMyProfile } from "../api/profile";

function QrCode() {
  const [shareInfo, setShareInfo] = useState(null); // { publicCode, shareUrl }
  const [profile, setProfile] = useState(null); // { name, school, mbti, ... }
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 두 API를 동시에 호출 (QR값/링크는 share에서, 이름/학교/MBTI는 profile에서)
        const [shareResult, profileResult] = await Promise.all([
          getMyShareInfo(),
          getMyProfile(),
        ]);
        setShareInfo(shareResult.data);
        setProfile(profileResult.data);
      } catch (err) {
        console.error("정보 조회 실패", err);
        setErrorMessage("정보를 불러오지 못했습니다");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleShare = () => {
    if (!shareInfo) return;
    console.log("공유하기", shareInfo);
  };

  if (isLoading) {
    return (
      <PageLayout>
        <Header title="QR Code" onBack={() => window.history.back()} />
        <p style={{ textAlign: "center", marginTop: "40px" }}>불러오는 중...</p>
      </PageLayout>
    );
  }

  if (errorMessage || !shareInfo || !profile) {
    return (
      <PageLayout>
        <Header title="QR Code" onBack={() => window.history.back()} />
        <p style={{ textAlign: "center", marginTop: "40px", color: "red" }}>
          {errorMessage || "정보를 불러오지 못했습니다"}
        </p>
      </PageLayout>
    );
  }

  // QR 안에는 publicCode만 담음 (스캔하는 쪽에서 이 코드로 프로필을 조회)
  const qrValue = shareInfo.publicCode;

  return (
    <PageLayout>
      <Header title="QR Code" onBack={() => window.history.back()} />

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: "16px",
          overflow: "hidden",
          marginTop: "8px",
        }}
      >
        <div
          style={{ backgroundColor: "var(--color-primary)", height: "48px" }}
        />

        <div style={{ padding: "24px", textAlign: "center" }}>
          <div style={{ display: "inline-block" }}>
            <QRCodeSVG value={qrValue} size={200} />
          </div>

          <p
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              margin: "16px 0 4px",
            }}
          >
            {profile.name}
          </p>
          <p style={{ color: "#888", fontSize: "13px", margin: "0 0 20px" }}>
            {profile.school} &nbsp;|&nbsp; {profile.mbti}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid var(--color-primary)",
              borderRadius: "30px",
              padding: "10px 16px",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                color: "#555",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
            >
              {shareInfo.shareUrl}
            </span>
            <div
              style={{
                width: "1px",
                height: "20px",
                backgroundColor: "#ddd",
                margin: "0 12px",
              }}
            />
            <img
              src={shareIcon}
              alt="공유"
              style={{ width: "16px", height: "16px" }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Button
          label="공유하기"
          onClick={handleShare}
          variant="primary"
          size="full"
        />
      </div>
    </PageLayout>
  );
}

export default QrCode;
