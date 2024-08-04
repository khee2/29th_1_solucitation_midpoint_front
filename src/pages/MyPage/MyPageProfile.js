import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/global.css";
import { myPageStyles } from "../../styles/myPageStyles";
import { refreshAccessToken } from "../../components/refreshAccess";
import {
  ProfileField,
  ProfilePassword,
  ProfileImage,
} from "./Profile/ProfileComponents";
import PasswordConfirmation from "./Profile/PasswordConfirmation";
import {
  LoginFormContainer,
  LoginInputGroup,
  LoginInputField,
  JoinButton,
} from "../../components/LoginComponents";

const ResetPasswordForm = ({ inputs, values, setValues, buttonText }) => {
  const [errors, setErrors] = useState({});
  const [tokenForResetPassword, setTokenForResetPassword] = useState("");
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  // 입력값 검증 함수
  const validateInputs = (id, value) => {
    const newErrors = { ...errors };
    if (id === "password") {
      if (value.length < 8 || value.length > 16) {
        newErrors.password = "비밀번호는 8자 이상 16자 이하여야 합니다.";
      } else {
        newErrors.password = "";
      }
      if (
        values.passwordVerification &&
        value !== values.passwordVerification
      ) {
        newErrors.passwordVerification = "비밀번호가 일치하지 않습니다.";
      } else {
        newErrors.passwordVerification = "";
      }
    }
    if (id === "passwordVerification") {
      if (value !== values.password) {
        newErrors.passwordVerification = "비밀번호가 일치하지 않습니다.";
      } else {
        newErrors.passwordVerification = "";
      }
    }
    return newErrors;
  };

  // 입력값 변경 처리 함수
  const handleChange = (event) => {
    const { name, value } = event.target;
    const newValues = { ...values, [name]: value };
    const newErrors = validateInputs(name, value);
    setValues(newValues);
    setErrors(newErrors);
  };

  // 비밀번호 재설정 요청 함수
  const resetPassword = async (event) => {
    event.preventDefault();
    const formErrors = {};

    inputs.forEach(({ id }) => {
      const newErrors = validateInputs(id, values[id] || "");
      if (newErrors[id]) {
        formErrors[id] = newErrors[id];
      }
    });

    setErrors(formErrors);

    console.log(accessToken, refreshToken);

    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await fetch(
          "http://3.36.150.194:8080/api/auth/reset-pw",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Reset-Password-Token": `Bearer ${tokenForResetPassword}`,
            },
            body: JSON.stringify({
              newPassword: values.password,
              newPasswordConfirm: values.passwordVerification,
            }),
          }
        );

        if (response.ok) {
          alert("비밀번호 변경 완료되었습니다😊");

          const logoutResponse = await fetch(
            "http://3.36.150.194:8080/api/member/logout",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "logout-token": `Bearer ${refreshToken}`,
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (logoutResponse.ok) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            navigate("/login");
          }
        } else {
          const errorData = await response.json();
          console.log(errorData);
          alert(
            `비밀번호 변경에 실패했습니다: ${
              errorData.message || "문제가 발생했습니다."
            }`
          );
        }
      } catch (error) {
        console.error("비밀번호 변경 요청 중 오류 발생:", error);
        alert(
          "비밀번호 변경 중 오류가 발생했습니다. 나중에 다시 시도해 주세요."
        );
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("resetPasswordToken");
    if (token) {
      try {
        setTokenForResetPassword(token);
      } catch (e) {
        console.error("토큰 파싱 중 오류 발생:", e);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }

    // 10분 후 로컬 스토리지에서 토큰 제거
    const timer = setTimeout(() => {
      localStorage.removeItem("resetPasswordToken");
    }, 10 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <LoginFormContainer onSubmit={resetPassword}>
      {inputs.map(({ label, type, id, required }) => (
        <LoginInputGroup key={id}>
          <LoginInputField
            type={type}
            id={id}
            name={id}
            required={required}
            onChange={handleChange}
            placeholder={label}
            value={values[id] || ""}
          />
          {errors[id] && (
            <p style={{ color: "red", marginBottom: "0rem", fontSize: "1rem" }}>
              {errors[id]}
            </p>
          )}
        </LoginInputGroup>
      ))}
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <JoinButton type="submit">{buttonText}</JoinButton>
      </div>
    </LoginFormContainer>
  );
};

const MyPageProfile = () => {
  const [state, setState] = useState({
    editMode: false,
    passwordEditMode: false,
    passwordConfirmationMode: false,
    deleteConfirmationMode: false,
    nextMode: null,
    errors: {},
    deleteToken: null,
    isLoading: false,
    successMessage: "",
  });
  const [profileData, setProfileData] = useState({
    name: "",
    nickname: "",
    id: "",
    email: "",
    profileImage: "",
    password: "********",
  });

  const [values, setValues] = useState({
    password: "",
    passwordVerification: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isDefaultImage, setIsDefaultImage] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/member/profile`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = response.data;

        const isDefault = data.profileImageUrl.endsWith(
          "profile-images/default_image.png"
        );

        setProfileData({
          name: data.name,
          nickname: data.nickname,
          id: data.loginId,
          email: data.email,
          profileImage: data.profileImageUrl,
          password: profileData.password,
        });
        setIsDefaultImage(isDefault);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            const errorData = error.response.data;
            if (errorData.error === "access_token_expired") {
              try {
                const refreshToken = localStorage.getItem("refreshToken");
                const newAccessToken = await refreshAccessToken(refreshToken);
                const response = await axios.get(
                  `${process.env.REACT_APP_API_URL}/api/member/profile`,
                  {
                    headers: {
                      Authorization: `Bearer ${newAccessToken}`,
                    },
                  }
                );
                const data = response.data;

                const isDefault = data.profileImageUrl.endsWith(
                  "profile-images/default_image.png"
                );

                setProfileData({
                  name: data.name,
                  nickname: data.nickname,
                  id: data.loginId,
                  email: data.email,
                  profileImage: data.profileImageUrl,
                  password: profileData.password,
                });
                setIsDefaultImage(isDefault);
              } catch (refreshError) {
                console.error("Failed to refresh access token:", refreshError);
                alert("토큰 갱신에 실패했습니다. 로그인 페이지로 이동합니다.");
                navigate("/login");
              }
            } else if (errorData.error === "invalid_token") {
              alert(
                "유효하지 않은 Access Token입니다. 로그인 페이지로 이동합니다."
              );
              navigate("/login");
            }
          } else {
            console.error(
              "회원 정보를 불러오는 중 에러 발생:",
              error.response.data
            );
          }
        } else {
          console.error("회원 정보를 불러오는 중 에러 발생:", error.message);
        }
      }
    };

    fetchProfileData();
  }, [navigate, profileData.password]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file === null) {
      setProfileData((prev) => ({
        ...prev,
        profileImage: `${process.env.PUBLIC_URL}/img/default-profile.png`,
      }));
      setPreviewImage(`${process.env.PUBLIC_URL}/img/default-profile.png`);
      setIsDefaultImage(true);
    } else if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      setIsDefaultImage(false);
    }
  };

  const handleSave = async () => {
    if (!profileData.name.trim()) {
      alert("이름을 입력해 주세요.");
      return;
    }

    if (!profileData.nickname.trim()) {
      alert("닉네임을 입력해 주세요.");
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      const useDefaultImage = isDefaultImage;

      const profileUpdateRequestDto = {
        nickname: profileData.nickname,
        name: profileData.name,
        useDefaultImage,
      };

      const formData = new FormData();
      formData.append(
        "profileUpdateRequestDto",
        JSON.stringify(profileUpdateRequestDto)
      );
      if (!useDefaultImage && previewImage) {
        formData.append("profileImage", fileInputRef.current.files[0]);
      }

      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/member/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setState({ ...state, editMode: false, passwordEditMode: false });

      setProfileData((prev) => ({
        ...prev,
        profileImage: previewImage || prev.profileImage,
      }));
      alert("수정 되었습니다");
    } catch (error) {
      if (error.response) {
        console.error("프로필 저장 중 에러 발생:", error.response.data);
      } else {
        console.error("프로필 저장 중 에러 발생:", error.message);
      }
    }
  };

  const handleCancel = () => {
    setState({ ...state, editMode: false, passwordEditMode: false });
    setPreviewImage(null);
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "정말로 탈퇴하시겠습니까? 되돌릴 수 없습니다."
    );
    if (confirmed) {
      setState({
        ...state,
        nextMode: "delete",
        passwordConfirmationMode: true,
      });
    }
  };

  const togglePasswordEditMode = () => {
    setState({
      ...state,
      nextMode: "passwordChange",
      passwordConfirmationMode: true,
    });
  };

  const handlePasswordConfirmation = (deleteToken) => {
    if (state.nextMode === "delete") {
      setState((prevState) => ({
        ...prevState,
        passwordConfirmationMode: false,
        deleteConfirmationMode: true,
        deleteToken,
      }));
    } else if (state.nextMode === "passwordChange") {
      setState((prevState) => ({
        ...prevState,
        passwordConfirmationMode: false,
        passwordEditMode: true,
      }));
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const { deleteToken } = state;
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/member/delete`, {
        headers: {
          "X-Delete-Token": `Bearer ${deleteToken}`,
          Authorization: `Bearer ${accessToken}`,
          "X-Refresh-Token": `Bearer ${refreshToken}`,
        },
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      alert("탈퇴 됐습니다.");
      navigate("/");
    } catch (error) {
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.error === "access_token_expired"
      ) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const newAccessToken = await refreshAccessToken(refreshToken);
          const { deleteToken } = state;
          await axios.delete(
            `${process.env.REACT_APP_API_URL}/api/member/delete`,
            {
              headers: {
                "X-Delete-Token": `Bearer ${deleteToken}`,
                Authorization: `Bearer ${newAccessToken}`,
                "X-Refresh-Token": `Bearer ${refreshToken}`,
              },
            }
          );
          alert("탈퇴 됐습니다.");
          navigate("/");
        } catch (refreshError) {
          alert("토큰 갱신에 실패했습니다. 로그인 페이지로 이동합니다.");
          navigate("/login");
        }
      } else {
        console.error("탈퇴 중 에러 발생:", error);
      }
    }
  };

  if (state.passwordConfirmationMode) {
    return <PasswordConfirmation onConfirm={handlePasswordConfirmation} />;
  }

  if (state.passwordEditMode) {
    return (
      <div style={myPageStyles.passwordContainer}>
        <h2 style={myPageStyles.passwordTitle}>비밀번호 변경</h2>
        <ResetPasswordForm
          inputs={[
            {
              label: "새 비밀번호",
              type: "password",
              id: "password",
              required: true,
            },
            {
              label: "새 비밀번호 확인",
              type: "password",
              id: "passwordVerification",
              required: true,
            },
          ]}
          values={values}
          setValues={setValues}
          buttonText="변경"
        />
      </div>
    );
  }

  if (state.deleteConfirmationMode) {
    return (
      <div style={myPageStyles.deleteConfirmationContainer}>
        <h2 style={myPageStyles.deleteConfirmationTitle}>미드포인트 탈퇴</h2>
        <p style={myPageStyles.deleteConfirmationMessage}>
          정말 탈퇴하시겠습니까? 탈퇴 시 되돌릴 수 없습니다. 신중하게
          결정해주세요.
        </p>
        <button
          onClick={handleDeleteConfirm}
          style={myPageStyles.deleteCheckButton}
        >
          탈퇴
        </button>
        <button
          onClick={() => setState({ ...state, deleteConfirmationMode: false })}
          style={myPageStyles.deleteConfirmationButton}
        >
          취소
        </button>
      </div>
    );
  }

  return (
    <div style={myPageStyles.profileContainer}>
      <ProfileField
        field="name"
        value={profileData.name}
        editMode={state.editMode}
        handleInputChange={handleInputChange}
        placeholder="이름"
      />
      <ProfileField
        field="nickname"
        value={profileData.nickname}
        editMode={state.editMode}
        handleInputChange={handleInputChange}
        placeholder="닉네임"
      />
      <ProfileField
        field="id"
        value={profileData.id}
        editMode={false}
        handleInputChange={() => {}}
        placeholder="아이디"
      />
      <ProfileField
        field="email"
        value={profileData.email}
        editMode={false}
        handleInputChange={handleInputChange}
        placeholder="이메일"
      />
      <ProfilePassword
        password={profileData.password}
        passwordEditMode={state.passwordEditMode}
        editMode={state.editMode}
        togglePasswordEditMode={togglePasswordEditMode}
      />
      <ProfileImage
        profileImage={previewImage || profileData.profileImage}
        editMode={state.editMode}
        handleFileChange={handleFileChange}
        handleImageClick={() => fileInputRef.current?.click()}
        fileInputRef={fileInputRef}
      />
      <div style={myPageStyles.buttonContainer}>
        {state.editMode ? (
          <>
            <button onClick={handleSave} style={myPageStyles.profileButtonEdit}>
              저장
            </button>
            <button
              onClick={handleCancel}
              style={myPageStyles.profileButtonCancel}
            >
              취소
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setState({ ...state, editMode: true })}
              style={myPageStyles.profileButtonEdit}
            >
              편집
            </button>
            <button
              onClick={handleDeleteAccount}
              style={myPageStyles.profileButtonQuit}
            >
              탈퇴
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MyPageProfile;
