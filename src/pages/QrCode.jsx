import { QRCodeSVG } from "qrcode.react";
import PageLayout from "../components/PageLayout";
import Header from "../components/Header";
import Button from "../components/Button";
import mouseImg from "../assets/animals/mouse.png";
import shareIcon from "../assets/icon-share.png";

function QrCode() {
  const myLink = "https://forms.gle/ruK1P7kak8ghN";

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
        {/* 주황 상단 바 */}
        <div
          style={{ backgroundColor: "var(--color-primary)", height: "48px" }}
        />

        {/* 카드 내용 */}
        <div style={{ padding: "24px", textAlign: "center" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <QRCodeSVG value={myLink} size={200} />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "white",
                border: "2px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={mouseImg}
                alt="프로필"
                style={{ width: "36px", height: "36px" }}
              />
            </div>
          </div>

          <p
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              margin: "16px 0 4px",
            }}
          >
            강지수
          </p>
          <p style={{ color: "#888", fontSize: "13px", margin: "0 0 20px" }}>
            연세대학교 &nbsp;|&nbsp; ENFP
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
              {myLink}
            </span>

            {/* 구분선 */}
            <div
              style={{
                width: "1px",
                height: "20px",
                backgroundColor: "#ddd",
                margin: "0 12px",
              }}
            />

            {/* 공유 아이콘 */}
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
          onClick={() => {}}
          variant="primary"
          size="full"
        />
      </div>
    </PageLayout>
  );
}

export default QrCode;
