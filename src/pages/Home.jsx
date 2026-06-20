import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import TopBar from "../components/TopBar";
import mouseImg from "../assets/animals/mouse.png";
import seaImg from "../assets/sea.png";
import mountainImg from "../assets/mountain.png";
import refreshIcon from "../assets/icon-refresh.png";

function Home() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <TopBar />

      {/* 이 사람을 기억하나요 카드 */}
      <div
        style={{
          backgroundColor: "#eaf3ff",
          border: "2px solid #cfe2ff",
          borderRadius: "16px",
          padding: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              margin: "0 0 4px",
              textAlign: "left",
            }}
          >
            이 사람을 기억하나요?
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "#666",
              margin: "0 0 12px",
              textAlign: "left",
            }}
          >
            퀴즈로 기억을 테스트해보세요.
          </p>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <span
              style={{
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: "20px",
                padding: "3px 10px",
                fontSize: "12px",
                fontWeight: "bold",
                whiteSpace: "nowrap",
              }}
            >
              이무영
            </span>
            <span
              style={{
                backgroundColor: "#f5f5f5",
                border: "none",
                borderRadius: "20px",
                padding: "3px 8px",
                fontSize: "10px",
                color: "#888",
                whiteSpace: "nowrap",
              }}
            >
              멋쟁이사자처럼
            </span>
            <span
              style={{
                backgroundColor: "#f5f5f5",
                border: "none",
                borderRadius: "20px",
                padding: "3px 8px",
                fontSize: "10px",
                color: "#888",
                whiteSpace: "nowrap",
              }}
            >
              인하대학교
            </span>
          </div>
        </div>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#d6e7fb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <img
            src={mouseImg}
            alt="이무영"
            style={{
              width: "60px",
              height: "60px",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      </div>

      {/* 출석 배너 */}
      <div
        style={{
          backgroundColor: "#e3d7fb",
          border: "2px solid #d4c2f7",
          borderRadius: "30px",
          padding: "14px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "16px",
          color: "#5b3fa0",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        출석 31일 째
        <img
          src={refreshIcon}
          alt="새로고침"
          style={{ width: "18px", height: "18px" }}
        />
      </div>

      {/* 오늘의 퀴즈 */}
      <h3 style={{ margin: "0 0 12px", fontSize: "18px", textAlign: "left" }}>
        오늘의 퀴즈
      </h3>
      <div
        style={{
          backgroundColor: "#fdf3e3",
          border: "2px solid #f5e3bd",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "24px",
        }}
      >
        <p
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "16px",
            margin: "0 0 16px",
          }}
        >
          더 좋아하는 건?
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "20px",
                backgroundColor: "#bfe6f5",
                border: "2px solid #8fd1ec",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={seaImg}
                alt="바다"
                style={{ width: "60px", height: "60px", objectFit: "contain" }}
              />
            </div>
            <p
              style={{ fontSize: "14px", marginTop: "8px", fontWeight: "bold" }}
            >
              바다
            </p>
          </div>
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>VS</span>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "20px",
                backgroundColor: "#cdeec2",
                border: "2px solid #aee29c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={mountainImg}
                alt="산"
                style={{ width: "60px", height: "60px", objectFit: "contain" }}
              />
            </div>
            <p
              style={{ fontSize: "14px", marginTop: "8px", fontWeight: "bold" }}
            >
              산
            </p>
          </div>
        </div>
        <p
          onClick={() => navigate("/vote-result")}
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: "#888",
            marginTop: "16px",
            marginBottom: 0,
            cursor: "pointer",
          }}
        >
          친구 투표 결과 보기 &gt;
        </p>
      </div>

      {/* 포인트 현황 */}
      <h3 style={{ margin: "0 0 12px", fontSize: "18px", textAlign: "left" }}>
        포인트 현황
      </h3>
      <div
        onClick={() => navigate("/point")}
        style={{
          backgroundColor: "#fdf3e3",
          border: "2px solid #f5e3bd",
          borderRadius: "16px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            backgroundColor: "#fbe9b9",
            border: "2px solid #f5d784",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            flexShrink: 0,
          }}
        >
          ⭐
        </div>
        <div style={{ textAlign: "left" }}>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              margin: 0,
              textAlign: "left",
            }}
          >
            1,250P
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "#888",
              margin: 0,
              textAlign: "left",
            }}
          >
            매일 출석해서 포인트를 더 모아보세요!
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

export default Home;
