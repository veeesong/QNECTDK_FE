import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Header from "../components/Header";
import Button from "../components/Button";
import editIcon from "../assets/icon-edit.png";
import { getMyProfile, updateMyProfile } from "../api/profile";
import { getCharacterImage } from "../utils/characterMap";

// 프로필 이미지 표시 우선순위: 사용자 업로드 사진(imageUrl) > 적용된 캐릭터(characterId) > 기본 띠 캐릭터
// characterId가 null이면 서버가 자동으로 띠 캐릭터를 characterId 자리에 채워서 줄 가능성이 높음 (확인 필요)
// 그래도 혹시 둘 다 없는 경우를 대비해 getCharacterImage가 기본값(쥐)으로 폴백해줌
const getProfileDisplayImage = (profile) => {
  if (profile.imageUrl) return profile.imageUrl;
  return getCharacterImage(profile.characterId);
};

// 백엔드는 gender를 "MALE"/"FEMALE"로 줌 → 화면 표시용 한글 변환
const genderLabel = (gender) => {
  if (gender === "MALE") return "남성";
  if (gender === "FEMALE") return "여성";
  return "";
};

// 수정 화면에서는 한글을 다시 영문으로 (서버로 보낼 때)
const genderToServerValue = (label) => {
  if (label === "남성") return "MALE";
  if (label === "여성") return "FEMALE";
  return label; // 혹시 다른 값이 들어오면 그대로 둠
};

function MyPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingField, setEditingField] = useState(null);

  const tags = ["음악감상", "밴드", "카페알바", "드라이브", "영화관람"];
  const tagColors = ["#FFD7B5", "#FFC9C9", "#D7E8FF", "#D7FFD9", "#F0D7FF"];
  const characterBgColor = "#fde3e3";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await getMyProfile();
        setProfile(result.data);
      } catch (err) {
        console.error("프로필 조회 실패", err);
        setErrorMessage("프로필을 불러오지 못했습니다");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 서버에 수정 가능한 필드: school, gender, mbti, drinkLevel, favoriteFood
  const infoFields = [
    { label: "이름", key: "name", editable: false },
    { label: "학교", key: "school", editable: true },
    { label: "나이", key: "age", editable: false },
    { label: "MBTI", key: "mbti", editable: true },
  ];

  const extraFields = [
    { label: "주량", key: "drinkLevel", editable: true },
    { label: "좋아하는 음식", key: "favoriteFood", editable: true },
  ];

  const handleSave = async (key, value) => {
    setEditingField(null);

    // 값이 안 바뀌었으면 굳이 요청 안 보냄
    if (profile[key] === value) return;

    const updatedProfile = { ...profile, [key]: value };
    setProfile(updatedProfile); // 화면에 먼저 반영 (낙관적 업데이트)

    try {
      await updateMyProfile({
        school: updatedProfile.school,
        gender: updatedProfile.gender,
        mbti: updatedProfile.mbti,
        drinkLevel: updatedProfile.drinkLevel,
        favoriteFood: updatedProfile.favoriteFood,
      });
    } catch (err) {
      console.error("프로필 수정 실패", err);
      setErrorMessage("저장에 실패했습니다. 다시 시도해주세요");
    }
  };

  // 성별 버튼 클릭 시 (텍스트 인풋이 아니라 토글 방식이라 별도 핸들러)
  const handleGenderSelect = async (label) => {
    const newGenderValue = genderToServerValue(label);
    setEditingField(null);

    if (profile.gender === newGenderValue) return;

    const updatedProfile = { ...profile, gender: newGenderValue };
    setProfile(updatedProfile);

    try {
      await updateMyProfile({
        school: updatedProfile.school,
        gender: updatedProfile.gender,
        mbti: updatedProfile.mbti,
        drinkLevel: updatedProfile.drinkLevel,
        favoriteFood: updatedProfile.favoriteFood,
      });
    } catch (err) {
      console.error("프로필 수정 실패", err);
      setErrorMessage("저장에 실패했습니다. 다시 시도해주세요");
    }
  };

  const renderField = (field) => {
    const isEditing = editingField === field.key;
    const value = profile[field.key];

    return (
      <div
        key={field.key}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 0",
        }}
      >
        <span style={{ color: "#888", fontSize: "14px" }}>{field.label}</span>
        {isEditing ? (
          <input
            type="text"
            defaultValue={value}
            autoFocus
            onBlur={(e) => handleSave(field.key, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave(field.key, e.target.value);
            }}
            style={{
              fontSize: "14px",
              border: "1px solid var(--color-primary)",
              borderRadius: "6px",
              padding: "2px 8px",
              width: "140px",
              textAlign: "right",
            }}
          />
        ) : (
          <span
            style={{
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span style={{ color: value ? "#333" : "#bbb" }}>
              {value || "입력해주세요"}
            </span>
            {field.editable && (
              <img
                src={editIcon}
                alt="편집"
                onClick={() => setEditingField(field.key)}
                style={{ width: "12px", height: "12px", cursor: "pointer" }}
              />
            )}
          </span>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <PageLayout>
        <Header title="프로필" onBack={() => window.history.back()} />
        <p style={{ textAlign: "center", marginTop: "40px" }}>불러오는 중...</p>
      </PageLayout>
    );
  }

  if (errorMessage && !profile) {
    return (
      <PageLayout>
        <Header title="프로필" onBack={() => window.history.back()} />
        <p style={{ textAlign: "center", marginTop: "40px", color: "red" }}>
          {errorMessage}
        </p>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Header title="프로필" onBack={() => window.history.back()} />

      {!profile.profileCompleted && (
        <div
          style={{
            backgroundColor: "#fff3cd",
            border: "1px solid #ffe69c",
            borderRadius: "12px",
            padding: "12px 16px",
            marginTop: "16px",
            fontSize: "13px",
            color: "#856404",
            textAlign: "center",
          }}
        >
          아직 프로필을 다 작성하지 않았어요. 학교, MBTI 등을 채워보세요!
        </div>
      )}

      <div
        style={{ textAlign: "center", marginTop: "24px", marginBottom: "20px" }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              backgroundColor: characterBgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={getProfileDisplayImage(profile)}
              alt="캐릭터"
              style={{ width: "85px", height: "85px" }}
            />
          </div>
          <button
            onClick={() => navigate("/character-change")}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "white",
              border: "1px solid #ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <img
              src={editIcon}
              alt="편집"
              style={{ width: "16px", height: "16px" }}
            />
          </button>
        </div>

        <p
          style={{
            fontWeight: "bold",
            fontSize: "20px",
            margin: "16px 0 10px",
          }}
        >
          {profile.name}
        </p>

        {editingField === "gender" ? (
          <div
            style={{
              display: "inline-flex",
              gap: "8px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {["남성", "여성"].map((label) => (
              <button
                key={label}
                onClick={() => handleGenderSelect(label)}
                style={{
                  border: "1px solid black",
                  borderRadius: "20px",
                  padding: "4px 14px",
                  fontSize: "12px",
                  backgroundColor:
                    genderLabel(profile.gender) === label
                      ? "var(--color-primary)"
                      : "white",
                  color:
                    genderLabel(profile.gender) === label ? "white" : "#333",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        ) : (
          <div
            onClick={() => setEditingField("gender")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              width: "227px",
              height: "25px",
              backgroundColor: characterBgColor,
              border: "1px solid black",
              borderRadius: "20px",
              fontSize: "12px",
              color: "#555",
              cursor: "pointer",
            }}
          >
            {profile.age}세 | {profile.school || "학교 미입력"} |{" "}
            {genderLabel(profile.gender) || "성별 미입력"}
            <img
              src={editIcon}
              alt="편집"
              style={{ width: "10px", height: "10px" }}
            />
          </div>
        )}
      </div>

      <div
        className="tag-scroll"
        style={{
          display: "flex",
          gap: "6px",
          alignItems: "center",
          overflowX: "auto",
          minHeight: "32px",
          flexShrink: 0,
          marginBottom: "20px",
          marginTop: "1px",
        }}
      >
        <div
          onClick={() => navigate("/interest-select")}
          style={{
            width: "23px",
            height: "23px",
            borderRadius: "50%",
            border: "1px solid black",
            background: "white",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            cursor: "pointer",
            boxSizing: "border-box",
          }}
        >
          +
        </div>
        {tags.map((tag, i) => (
          <span
            key={tag}
            style={{
              backgroundColor: tagColors[i % tagColors.length],
              border: "1px solid black",
              borderRadius: "20px",
              width: "61px",
              height: "23px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              flexShrink: 0,
              boxSizing: "border-box",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        style={{
          backgroundColor: "#fff7e0",
          border: "1px solid black",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "20px",
        }}
      >
        <p
          style={{
            fontWeight: "bold",
            marginBottom: "12px",
            textAlign: "center",
          }}
        >
          나의 정보
        </p>
        {infoFields.map(renderField)}
        <div style={{ borderTop: "1px solid #eee", margin: "8px 0" }} />
        {extraFields.map(renderField)}
      </div>

      {errorMessage && (
        <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>
          {errorMessage}
        </p>
      )}

      <Button
        label="퀴즈 생성"
        onClick={() => navigate("/quiz-create")}
        variant="primary"
        size="full"
      />
      <div style={{ height: "120px", flexShrink: 0 }} />
    </PageLayout>
  );
}

export default MyPage;
