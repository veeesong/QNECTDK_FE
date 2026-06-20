import axiosInstance from "./axiosInstance";

// 내 친구 목록
// 응답: { success, data: [{ friendshipId, savedAt, person: { userId, name, characterId,
//                            school, gender, birthYear, mbti, interests, groupTags } }] }
// sort: "recent" | "name" (생략 가능)
export const getFriends = async (sort) => {
  const response = await axiosInstance.get("/api/friends", {
    params: sort ? { sort } : {},
  });
  return response.data;
};

// 친구 추가 요청 - 상대방의 userId(addresseeId)를 보냄. 즉시 친구가 되는 게 아니라
// status: "PENDING" 상태로 생성됨. 상대방이 accept를 눌러야 진짜 친구가 됨
export const requestFriend = async (addresseeId) => {
  const response = await axiosInstance.post("/api/friends", {
    addresseeId,
  });
  return response.data;
  // { success, data: { friendshipId, requesterId, addresseeId, status, acceptedAt, createdAt } }
};

// 친구 요청 수락 - 백엔드가 알아서 상대에게 알림+리마인드 예약+포인트 처리까지 함
export const acceptFriendRequest = async (friendshipId) => {
  const response = await axiosInstance.patch(
    `/api/friends/${friendshipId}/accept`,
  );
  return response.data;
};

// 친구 요청 거절
export const rejectFriendRequest = async (friendshipId) => {
  const response = await axiosInstance.patch(
    `/api/friends/${friendshipId}/reject`,
  );
  return response.data;
};

// 받은 친구 요청 목록
// 응답: { success, data: [{ friendshipId, status, requestedAt, person: {...} }] }
export const getReceivedRequests = async () => {
  const response = await axiosInstance.get("/api/friends/requests/received");
  return response.data;
};

// 자동완성용 친구 목록 (그룹 만들 때 친구 검색용) - id+이름만, 캐릭터 포함
export const getFriendSummaries = async () => {
  const response = await axiosInstance.get("/api/friends/summaries");
  return response.data;
  // { success, data: [{ friendId, name, characterId }] }
};

// 친구 메모 작성/수정 - 필드명이 memo가 아니라 content
export const updateFriendMemo = async (friendId, content) => {
  const response = await axiosInstance.put("/api/friends/memos", {
    friendId,
    content,
  });
  return response.data;
};

// 친구 메모 조회
// 응답: { success, data: { memoId, friendId, content, updatedAt } }
export const getFriendMemo = async (friendId) => {
  const response = await axiosInstance.get(`/api/friends/memos/${friendId}`);
  return response.data;
};
