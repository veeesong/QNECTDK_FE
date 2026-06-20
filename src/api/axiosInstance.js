import axios from "axios";

const BASE_URL = "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 보낼 때마다 자동으로 토큰을 헤더에 붙여주는 부분
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== 토큰 자동 갱신 (refresh) 로직 =====
// accessToken이 만료되면(보통 401 응답) refreshToken으로 새 토큰을 발급받아 자동 재시도
// 가이드 문서: refresh 호출 시 access·refresh 둘 다 새로 옴 -> 회전(rotation) 방식이라 둘 다 새로 저장해야 함

let isRefreshing = false; // 동시에 여러 요청이 401을 받아도 refresh는 한 번만 시도하기 위한 플래그
let refreshSubscribers = []; // refresh가 끝나길 기다리는 요청들의 콜백 목록

// refresh 완료되면 대기 중이던 요청들에게 새 토큰을 알려줌
const onRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401(인증 만료)이고, 아직 재시도 안 한 요청이고, refresh 요청 자체의 실패는 아닐 때만 처리
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/auth/refresh")
    ) {
      originalRequest._retry = true; // 무한 루프 방지

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        // refreshToken 자체가 없으면 로그인 화면으로 보내는 수밖에 없음
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // 이미 다른 요청이 refresh 중이면, 그 결과를 기다렸다가 새 토큰으로 재시도
        return new Promise((resolve) => {
          refreshSubscribers.push((newAccessToken) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const response = await axios.post(`${BASE_URL}/api/auth/refresh`, {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data.data;

        // 회전 방식: access, refresh 둘 다 새 값으로 교체 저장
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        isRefreshing = false;
        onRefreshed(newAccessToken);

        // 원래 실패했던 요청을 새 토큰으로 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // refresh 자체가 실패하면(refreshToken도 만료 등) 로그인 화면으로
        isRefreshing = false;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
