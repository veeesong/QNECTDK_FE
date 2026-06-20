import axiosInstance from "./axiosInstance";

// 캐릭터 규칙 (가이드 문서 기준, CharacterChange.jsx 등에서 참고)
// - 기본 프사 = 생년월일 띠 캐릭터 (자동·무료, 안 사도 기본 적용됨)
// - 적용 = 산 캐릭터를 내 프사로 등록
// - 교체 = 다른 캐릭터를 장착하면 기존 건 자동 해제 (한 번에 하나만 적용 가능)
// - 해제 = 적용 풀면 다시 기본 띠 캐릭터로 복귀
// - 화면 표시: 적용된 CHARACTER가 있으면 그걸, 없으면 띠 캐릭터를 표시
// - imageUrl은 실제 파일이 아니라 식별 키 (예: "/characters/tiger.png") -> 우리는 characterId 기준으로
//   매핑하므로 utils/characterMap.js의 getCharacterImage를 사용하는 게 더 정확함

// 상점 전체 아이템 목록 (이름/이미지키/가격 포함)
export const getShopItems = async () => {
  const response = await axiosInstance.get("/api/shop/items");
  return response.data; // { success, data: [{ itemId, name, type, imageUrl, price }] }
};

// 내가 보유한 아이템 목록 (itemId, isEquipped만 있음 - 이름/이미지는 getShopItems와 매칭 필요)
export const getMyItems = async () => {
  const response = await axiosInstance.get("/api/shop/my-items");
  return response.data; // { success, data: [{ userItemId, itemId, type, isEquipped }] }
};

// 아이템 적용 (캐릭터 변경 등) - userItemId를 경로에 포함, body 없음
// 적용하면 기존에 적용돼있던 다른 아이템은 자동으로 해제됨
export const equipItem = async (userItemId) => {
  const response = await axiosInstance.patch(
    `/api/shop/my-items/${userItemId}/equip`,
  );
  return response.data;
};

// 아이템 해제 - 캐릭터 해제 시 기본 띠 캐릭터로 자동 복귀
export const unequipItem = async (userItemId) => {
  const response = await axiosInstance.patch(
    `/api/shop/my-items/${userItemId}/unequip`,
  );
  return response.data;
};

// 아이템 구매 - 포인트 차감 + 보유 목록에 추가됨
// 에러: INSUFFICIENT_POINT(포인트 부족), RESOURCE_CONFLICT(이미 보유한 아이템 재구매)
export const purchaseItem = async (itemId) => {
  const response = await axiosInstance.post(
    `/api/shop/items/${itemId}/purchase`,
  );
  return response.data;
};
