import axiosInstance from "./axiosInstance";

// 내 프로필 조회
// 응답: { success, data: { userId, name, age, zodiac, school, gender("MALE"/"FEMALE"|null),
//                           mbti, drinkLevel, favoriteFood, imageUrl, characterId,
//                           publicCode, profileCompleted } }
// 미작성 상태(profileCompleted: false)면 school/gender/mbti/drinkLevel/favoriteFood/imageUrl이 null
// name/age/zodiac/publicCode는 온보딩 전에도 항상 채워져 있음 (서버 계산값, 프론트 계산 X)
export const getMyProfile = async () => {
  const response = await axiosInstance.get("/api/profiles/me");
  return response.data;
};

// 프로필 작성/수정 - 첫 호출=생성, 이후 호출=수정 (업서트, 같은 API 하나로 처리)
// 요청 body: { school, gender, mbti, drinkLevel, favoriteFood }
// name, age, zodiac은 서버가 회원가입 시 정하는 값이라 여기서 보내지 않음
export const updateMyProfile = async ({
  school,
  gender,
  mbti,
  drinkLevel,
  favoriteFood,
}) => {
  const response = await axiosInstance.put("/api/profiles/me", {
    school,
    gender,
    mbti,
    drinkLevel,
    favoriteFood,
  });
  return response.data;
};

// 사용자가 직접 사진 업로드 (multipart, 키 이름 "image")
// 주의: 프로필을 먼저 작성한 후에만 가능 (PROFILE_NOT_FOUND 날 수 있음)
// 캐릭터(띠/구매) 이미지와는 별개 기능 - 업로드한 사진이 있으면 이게 최우선으로 표시됨
// 응답: { success, data: { imageUrl } }
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axiosInstance.post(
    "/api/profiles/me/image",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};

// 공개코드로 (다른 사람) 프로필 조회 — QR 스캔 후 사용
// 응답 구조는 getMyProfile()과 거의 동일 (age, zodiac 등 계산된 값 포함)
export const getProfileByPublicCode = async (publicCode) => {
  const response = await axiosInstance.get(`/api/profiles/${publicCode}`);
  return response.data;
};

// 내 공유 정보 조회 — QR 코드 생성용
// 응답: { success, data: { publicCode, shareUrl } }  ※ 이름/학교/MBTI는 안 줌!
// 화면에 이름 등을 같이 보여주려면 getMyProfile()도 같이 호출해야 함
export const getMyShareInfo = async () => {
  const response = await axiosInstance.get("/api/profiles/me/share");
  return response.data;
};
