import axiosInstance from "./axiosInstance";

// 전체 관심사 목록 (카테고리별로 묶여서 옴)
// 응답: { success, data: [{ category, interests: [{ id, name }] }] }
export const getAllInterests = async () => {
  const response = await axiosInstance.get("/api/interests");
  return response.data;
};

// 내가 선택한 관심사 목록
// 응답: { success, data: [{ id, category, name }] }
export const getMyInterests = async () => {
  const response = await axiosInstance.get("/api/interests/me");
  return response.data;
};

// 내 관심사 전체 교체 - 선택된 관심사 id 배열을 통째로 보냄
// 빈 배열을 보내면 전체 해제됨
export const updateMyInterests = async (interestIds) => {
  const response = await axiosInstance.put("/api/interests/me", {
    interestIds,
  });
  return response.data;
};
