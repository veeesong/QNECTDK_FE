import axiosInstance from "./axiosInstance";

// 회원가입
export const signup = async ({ loginId, phone, password, name, birthDate }) => {
  const response = await axiosInstance.post("/api/auth/signup", {
    loginId,
    phone,
    password,
    name,
    birthDate,
  });
  return response.data; // { success, data: { tokenType, accessToken, refreshToken } }
};

// 로그인
export const login = async ({ loginId, password }) => {
  const response = await axiosInstance.post("/api/auth/login", {
    loginId,
    password,
  });
  return response.data;
};

// 아이디 중복확인
// 스웨거에 쿼리 파라미터 이름이 "arg0"으로 표시되는데, 실제 테스트해서 안 되면
// params: { loginId } 를 params: { arg0: loginId } 로 바꿔볼 것
export const checkLoginId = async (loginId) => {
  const response = await axiosInstance.get("/api/auth/check-login-id", {
    params: { loginId },
  });
  return response.data; // { success, data: { available: true/false } }
};

// 로그아웃
export const logout = async () => {
  const response = await axiosInstance.post("/api/auth/logout");
  return response.data;
};
