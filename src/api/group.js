import axiosInstance from "./axiosInstance";

// 내 그룹 목록
// 응답: [{ groupId, name, hashtags[], memberCount, createdAt }]
export const getGroups = async () => {
  const response = await axiosInstance.get("/api/groups");
  return response.data;
};

// 그룹 이름 검색
export const searchGroups = async (keyword) => {
  const response = await axiosInstance.get("/api/groups/search", {
    params: { keyword },
  });
  return response.data;
};

// 그룹+멤버 한번에 생성
// 요청: { name, hashtags[], friendIds[] } — friendIds 비우면 멤버 없이 그룹만 생성
// 에러: DUPLICATE_GROUP_NAME / NOT_ACCEPTED_FRIEND / INSUFFICIENT_POINT
export const createGroupWithMembers = async ({ name, hashtags, friendIds }) => {
  const response = await axiosInstance.post("/api/groups/with-members", {
    name,
    hashtags,
    friendIds,
  });
  return response.data;
};

// 그룹 수정
// 요청: { name, hashtags[] }
export const updateGroup = async (groupId, { name, hashtags }) => {
  const response = await axiosInstance.put(`/api/groups/${groupId}`, {
    name,
    hashtags,
  });
  return response.data;
};

// 그룹 삭제
export const deleteGroup = async (groupId) => {
  const response = await axiosInstance.delete(`/api/groups/${groupId}`);
  return response.data;
};

// 그룹 멤버 목록 조회
// 응답: { groupId, name, members:[{ memberId, person }] }
// person: { userId, name, characterId, school, gender, birthYear, mbti, interests[], groupTags[] }
export const getGroupMembers = async (groupId) => {
  const response = await axiosInstance.get(`/api/groups/${groupId}/members`);
  return response.data;
};

// 그룹 멤버 추가 — 내 친구만 가능
// 요청: { friendId }
export const addGroupMember = async (groupId, friendId) => {
  const response = await axiosInstance.post(`/api/groups/${groupId}/members`, {
    friendId,
  });
  return response.data;
};

// 그룹 멤버 삭제
export const deleteGroupMember = async (groupId, friendId) => {
  const response = await axiosInstance.delete(
    `/api/groups/${groupId}/members/${friendId}`,
  );
  return response.data;
};
