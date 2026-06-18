import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import PageLayout from "../components/PageLayout";

function QrScan() {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 220 },
        (decodedText) => {
          if (isRunningRef.current) {
            isRunningRef.current = false;
            html5QrCode.stop().then(() => {
              navigate("/friend-accept", { state: { qrData: decodedText } });
            });
          }
        },
        (errorMessage) => {
          // 인식 실패는 계속 시도하니까 무시
        },
      )
      .then(() => {
        isRunningRef.current = true;
      })
      .catch((err) => {
        console.error("카메라 시작 실패", err);
      });

    return () => {
      if (isRunningRef.current && scannerRef.current) {
        isRunningRef.current = false;
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [navigate]);

  return (
    <PageLayout>
      <p style={{ textAlign: "center", marginTop: "20px", fontSize: "16px" }}>
        QR 코드를 찾는 중입니다.
      </p>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "260px",
            height: "260px",
          }}
        >
          <div
            id="qr-reader"
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              borderRadius: "12px",
            }}
          />

          {[
            {
              top: 0,
              left: 0,
              borderTop: "4px solid black",
              borderLeft: "4px solid black",
              borderRadius: "12px 0 0 0",
            },
            {
              top: 0,
              right: 0,
              borderTop: "4px solid black",
              borderRight: "4px solid black",
              borderRadius: "0 12px 0 0",
            },
            {
              bottom: 0,
              left: 0,
              borderBottom: "4px solid black",
              borderLeft: "4px solid black",
              borderRadius: "0 0 0 12px",
            },
            {
              bottom: 0,
              right: 0,
              borderBottom: "4px solid black",
              borderRight: "4px solid black",
              borderRadius: "0 0 12px 0",
            },
          ].map((style, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: "36px",
                height: "36px",
                pointerEvents: "none",
                ...style,
              }}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

export default QrScan;
