import axiosInstance from "./axiosInstance";

// 내 그룹 목록
export const getGroups = async () => {
  const response = await axiosInstance.get("/api/groups");
  return response.data; // { success, data: [{ groupId, name, hashtags[], memberCount, createdAt }] }
};

// 그룹 이름 검색
export const searchGroups = async (keyword) => {
  const response = await axiosInstance.get("/api/groups/search", {
    params: { keyword },
  });
  return response.data;
};

// 그룹+멤버 한번에 생성
export const createGroupWithMembers = async ({ name, hashtags, friendIds }) => {
  const response = await axiosInstance.post("/api/groups/with-members", {
    name,
    hashtags,
    friendIds,
  });
  return response.data;
};

// 그룹 수정
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

// 그룹 멤버 목록
export const getGroupMembers = async (groupId) => {
  const response = await axiosInstance.get(`/api/groups/${groupId}/members`);
  return response.data; // { success, data: { groupId, name, members:[{ memberId, person }] } }
};

// 그룹 멤버 추가
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
