import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Header from "../components/Header";
import Button from "../components/Button";
import { getShopItems, getMyItems, equipItem } from "../api/shop";
import { getMyProfile } from "../api/profile";
import { getCharacterImage, getCharacterName } from "../utils/characterMap";

function CharacterChange() {
  const navigate = useNavigate();

  // 띠 기반 기본 캐릭터 정보 (구매 안 해도 항상 적용 가능한 디폴트)
  const [zodiacCharacterId, setZodiacCharacterId] = useState(null);

  // 보유 캐릭터 목록: [{ userItemId, itemId, name, isEquipped }]
  const [myCharacters, setMyCharacters] = useState([]);
  const [selectedUserItemId, setSelectedUserItemId] = useState(null); // null이면 "띠 기본 캐릭터" 선택 상태

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 내 프로필(현재 적용된 characterId, 띠) + 상점 전체 아이템 + 내 보유 아이템 동시 조회
        const [profileResult, shopResult, myItemsResult] = await Promise.all([
          getMyProfile(),
          getShopItems(),
          getMyItems(),
        ]);

        // 프로필에 characterId가 있으면 그게 현재 표시 중인 캐릭터(적용된 것 or 띠 기본)
        setZodiacCharacterId(profileResult.data.characterId);

        const shopItemMap = {};
        shopResult.data.forEach((item) => {
          shopItemMap[item.itemId] = item;
        });

        // 보유 아이템 중 캐릭터(CHARACTER) 타입만 골라서 이름 정보를 합침
        const characters = myItemsResult.data
          .filter((myItem) => myItem.type === "CHARACTER")
          .map((myItem) => {
            const shopInfo = shopItemMap[myItem.itemId] || {};
            return {
              userItemId: myItem.userItemId,
              itemId: myItem.itemId,
              name: shopInfo.name || "이름 없음",
              isEquipped: myItem.isEquipped,
            };
          });

        setMyCharacters(characters);

        // 보유 캐릭터 중 적용된 게 있으면 그걸 기본 선택값으로
        const equippedOne = characters.find((c) => c.isEquipped);
        if (equippedOne) {
          setSelectedUserItemId(equippedOne.userItemId);
        }
        // 적용된 보유 캐릭터가 없으면 selectedUserItemId는 null로 유지 -> "띠 기본 캐릭터"가 선택된 상태
      } catch (err) {
        console.error("캐릭터 정보 조회 실패", err);
        setErrorMessage("캐릭터 정보를 불러오지 못했습니다");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 현재 화면 상단에 크게 보여줄 캐릭터의 characterId
  // 보유 캐릭터 중 하나를 선택했으면 그 캐릭터의 itemId를 characterId처럼 사용
  // (상점 아이템의 itemId 체계와 프로필의 characterId 체계가 같은 17종 기준이라고 가정 - 다르면 별도 매핑 필요)
  const getDisplayCharacterId = () => {
    if (selectedUserItemId === null) {
      return zodiacCharacterId; // 띠 기본 캐릭터
    }
    const selected = myCharacters.find(
      (c) => c.userItemId === selectedUserItemId,
    );
    return selected?.itemId;
  };

  const handleChange = async () => {
    setIsSubmitting(true);
    try {
      if (selectedUserItemId === null) {
        // 띠 기본 캐릭터를 선택한 경우: 현재 적용 중인 보유 캐릭터가 있으면 해제해서 기본으로 복귀
        const currentlyEquipped = myCharacters.find((c) => c.isEquipped);
        if (currentlyEquipped) {
          const { unequipItem } = await import("../api/shop");
          await unequipItem(currentlyEquipped.userItemId);
        }
      } else {
        await equipItem(selectedUserItemId);
      }
      navigate(-1);
    } catch (err) {
      console.error("캐릭터 변경 실패", err);
      setErrorMessage("캐릭터 변경에 실패했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <Header title="프로필" onBack={() => window.history.back()} />
        <p style={{ textAlign: "center", marginTop: "40px" }}>불러오는 중...</p>
      </PageLayout>
    );
  }

  if (errorMessage && myCharacters.length === 0 && !zodiacCharacterId) {
    return (
      <PageLayout>
        <Header title="프로필" onBack={() => window.history.back()} />
        <p style={{ textAlign: "center", marginTop: "40px", color: "red" }}>
          {errorMessage}
        </p>
      </PageLayout>
    );
  }

  const displayCharacterId = getDisplayCharacterId();

  return (
    <PageLayout>
      <Header title="프로필" onBack={() => window.history.back()} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        <div style={{ textAlign: "center" }}>
          {/* 현재 선택된 캐릭터 (띠 기본 또는 보유 캐릭터 중 선택) */}
          <div
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              backgroundColor: "#fde3e3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
            }}
          >
            <img
              src={getCharacterImage(displayCharacterId)}
              alt="현재 캐릭터"
              style={{ width: "90px", height: "90px", objectFit: "contain" }}
            />
          </div>
          <p
            style={{ marginTop: "16px", fontWeight: "bold", fontSize: "16px" }}
          >
            {selectedUserItemId === null ? "기본 띠 캐릭터" : "현재 캐릭터"}
          </p>
        </div>

        <div>
          <div style={{ borderTop: "1px solid #eee", marginBottom: "20px" }} />
          <p
            style={{
              fontWeight: "bold",
              marginBottom: "16px",
              fontSize: "15px",
              textAlign: "center",
            }}
          >
            보유 캐릭터
          </p>

          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {/* 띠 기본 캐릭터도 항상 선택 가능한 옵션으로 표시 */}
            <div
              onClick={() => setSelectedUserItemId(null)}
              style={{
                width: "92px",
                height: "92px",
                borderRadius: "50%",
                backgroundColor: "#fdf3e3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border:
                  selectedUserItemId === null
                    ? "3px solid var(--color-primary)"
                    : "3px solid transparent",
                cursor: "pointer",
              }}
            >
              <img
                src={getCharacterImage(zodiacCharacterId)}
                alt="띠 기본"
                style={{ width: "56px", height: "56px", objectFit: "contain" }}
              />
            </div>

            {myCharacters.map((char, i) => {
              const bgColors = [
                "#fde3d8",
                "#dff0d8",
                "#d6e7fb",
                "#f0d7ff",
                "#ffe9d6",
              ];
              const isSelected = selectedUserItemId === char.userItemId;
              return (
                <div
                  key={char.userItemId}
                  onClick={() => setSelectedUserItemId(char.userItemId)}
                  style={{
                    width: "92px",
                    height: "92px",
                    borderRadius: "50%",
                    backgroundColor: bgColors[i % bgColors.length],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: isSelected
                      ? "3px solid var(--color-primary)"
                      : "3px solid transparent",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={getCharacterImage(char.itemId)}
                    alt={char.name}
                    style={{
                      width: "56px",
                      height: "56px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {myCharacters.length === 0 && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <p
                style={{
                  color: "#888",
                  fontSize: "14px",
                  marginBottom: "16px",
                }}
              >
                아직 구매한 캐릭터가 없어요.
                <br />
                상점에서 구매해보세요!
              </p>
              <Button
                label="상점으로 가기"
                onClick={() => navigate("/buy-character")}
                variant="secondary"
                size="full"
              />
            </div>
          )}
        </div>

        {errorMessage && (
          <p style={{ color: "red", fontSize: "13px", textAlign: "center" }}>
            {errorMessage}
          </p>
        )}

        <Button
          label={isSubmitting ? "변경 중..." : "캐릭터 변경"}
          onClick={handleChange}
          variant="primary"
          size="full"
          disabled={isSubmitting}
        />
      </div>
    </PageLayout>
  );
}

export default CharacterChange;
