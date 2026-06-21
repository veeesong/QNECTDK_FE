import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Header from "../components/Header";
import { getShopItems, getMyItems, purchaseItem } from "../api/shop";
import { getCharacterImage, getCharacterName } from "../utils/characterMap";

function BuyCharacter() {
  const navigate = useNavigate();
  const [step, setStep] = useState("list");
  const [selectedChar, setSelectedChar] = useState(null);
  const [shopItems, setShopItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shopRes, myRes] = await Promise.all([
          getShopItems(),
          getMyItems(),
        ]);
        setShopItems(shopRes.data);
        setMyItems(myRes.data);
      } catch (err) {
        console.error("캐릭터 목록 불러오기 실패", err);
        setErrorMessage("데이터를 불러오지 못했습니다");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 내가 보유한 itemId 목록
  const ownedItemIds = myItems.map((item) => item.itemId);

  const handleSelectCharacter = (char) => {
    setSelectedChar(char);
    setStep("confirm");
  };

  const handlePayment = async () => {
    try {
      await purchaseItem(selectedChar.itemId);
      setStep("success");
    } catch (err) {
      const code = err.response?.data?.error?.code;
      if (code === "INSUFFICIENT_POINT") {
        setErrorMessage("포인트가 부족합니다");
      } else if (code === "RESOURCE_CONFLICT") {
        setErrorMessage("이미 보유한 캐릭터입니다");
      } else {
        setErrorMessage("구매에 실패했습니다");
      }
    }
  };

  const handleBack = () => {
    if (step === "confirm" || step === "success") {
      setStep("list");
      setErrorMessage("");
    } else {
      navigate(-1);
    }
  };

  return (
    <PageLayout>
      <Header title="캐릭터 구매" onBack={handleBack} />

      {step === "list" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "8px",
            paddingBottom: "40px",
          }}
        >
          {isLoading ? (
            <p style={{ textAlign: "center", color: "#aaa" }}>불러오는 중...</p>
          ) : errorMessage ? (
            <p style={{ textAlign: "center", color: "red" }}>{errorMessage}</p>
          ) : (
            shopItems.map((item) => {
              const isOwned = ownedItemIds.includes(item.itemId);
              const charImage = getCharacterImage(item.characterId);
              const charName = getCharacterName(item.characterId);

              return (
                <div
                  key={item.itemId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: isOwned ? "#f5f5f5" : "#ffe3d1",
                    border: isOwned ? "2px solid #e0e0e0" : "2px solid #ffccb0",
                    borderRadius: "16px",
                    padding: "16px",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <img
                      src={charImage}
                      alt={charName}
                      style={{
                        width: "44px",
                        height: "44px",
                        objectFit: "contain",
                      }}
                    />
                    <div
                      style={{
                        width: "2px",
                        height: "28px",
                        backgroundColor: isOwned ? "#d9d9d9" : "#ffccb0",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: isOwned ? "#888" : "#333",
                      }}
                    >
                      {charName}
                    </span>
                  </div>

                  <div
                    onClick={() => !isOwned && handleSelectCharacter(item)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      cursor: isOwned ? "default" : "pointer",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        color: isOwned ? "#888" : "#333",
                      }}
                    >
                      {isOwned ? "보유중" : "구매하기"}
                    </span>
                    {!isOwned && (
                      <span
                        style={{
                          backgroundColor: "#ff6b35",
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: "bold",
                          padding: "4px 10px",
                          borderRadius: "20px",
                        }}
                      >
                        {item.price}P
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {step === "confirm" && selectedChar && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "40px",
            flex: 1,
          }}
        >
          <div
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              backgroundColor: "#ffe3d1",
              border: "2px solid #ffccb0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "40px",
            }}
          >
            <img
              src={getCharacterImage(selectedChar.characterId)}
              alt={getCharacterName(selectedChar.characterId)}
              style={{ width: "100px", height: "100px", objectFit: "contain" }}
            />
          </div>

          <div
            style={{
              width: "100%",
              backgroundColor: "#ffe3d1",
              border: "2px solid #ffccb0",
              borderRadius: "16px",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxSizing: "border-box",
              marginBottom: "12px",
            }}
          >
            <span
              style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}
            >
              결제 포인트
            </span>
            <span
              style={{ fontWeight: "bold", fontSize: "18px", color: "#ff6b35" }}
            >
              {selectedChar.price}P
            </span>
          </div>

          {errorMessage && (
            <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>
              {errorMessage}
            </p>
          )}

          <button
            onClick={handlePayment}
            style={{
              width: "100%",
              maxWidth: "200px",
              backgroundColor: "#ff6b35",
              color: "#fff",
              border: "none",
              borderRadius: "24px",
              padding: "12px 0",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            결제하기
          </button>
        </div>
      )}

      {step === "success" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            paddingTop: "100px",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "60px",
            }}
          >
            결제가 완료되었습니다.
          </h2>
          <button
            onClick={() => navigate("/home")}
            style={{
              width: "100%",
              maxWidth: "200px",
              backgroundColor: "#ff6b35",
              color: "#fff",
              border: "none",
              borderRadius: "24px",
              padding: "12px 0",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            홈으로 가기
          </button>
        </div>
      )}
    </PageLayout>
  );
}

export default BuyCharacter;
