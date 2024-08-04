import React, { useState } from "react";
import axios from "axios";
import { refreshAccessToken } from "../../../components/refreshAccess";
import { myPageStyles } from "../../../styles/myPageStyles";
import styled from "styled-components";

const StyledInput = styled.input`
  flex: 1;
  padding: 10px;
  padding-left: 3px;
  font-size: 1.13rem;
  font-weight: 900;
  border: none;
  outline: none;
  background-color: transparent;
  color: #1b4345;

  ::placeholder {
    letter-spacing: -0.1rem;
    color: #1b4345;
  }

  &::-webkit-input-placeholder {
    color: #1b4345;
    letter-spacing: -0.1rem;
  }
`;

const PasswordConfirmation = ({ onConfirm }) => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/member/verify-pw`,
        { password: confirmPassword },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.status === 200) {
        console.log(response.data);
        onConfirm(response.data.tokenForDelete["X-Delete-Token"]);
        localStorage.setItem(
          "resetPasswordToken",
          response.data.tokenForResetPassword["X-Reset-Password-Token"]
        );
        console.log(localStorage.getItem("resetPasswordToken"));

        // 10분 후 토큰 삭제
        setTimeout(() => {
          localStorage.removeItem("resetPasswordToken");
        }, 600000);
      }
      alert("비밀번호 인증되었습니다");
    } catch (error) {
      if (
        error.response?.status === 401 &&
        error.response?.data?.error === "access_token_expired"
      ) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            throw new Error("No refresh token available.");
          }
          const newAccessToken = await refreshAccessToken(refreshToken);
          const retryResponse = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/member/verify-pw`,
            { password: confirmPassword },
            { headers: { Authorization: `Bearer ${newAccessToken}` } }
          );

          if (retryResponse.status === 200) {
            onConfirm(retryResponse.data.tokenForDelete.X_Delete_Token);
            localStorage.setItem(
              "resetPasswordToken",
              retryResponse.data.tokenForResetPassword.X_Reset_Password_Token
            );

            // 10분 후 토큰 삭제
            setTimeout(() => {
              localStorage.removeItem("resetPasswordToken");
            }, 600000);
          }
        } catch (refreshError) {
          console.error("Failed to refresh access token:", refreshError);
          setErrors({
            confirmPassword:
              "토큰 갱신 중 오류가 발생하였습니다. 다시 시도해 주세요.",
          });
        }
      } else if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          if (data.errors) {
            const newErrors = {};
            data.errors.forEach((err) => {
              newErrors[err.field] = err.message;
            });
            setErrors(newErrors);
          } else if (data.error) {
            setErrors({ confirmPassword: data.message });
          }
        } else if (status === 401) {
          setErrors({ accessToken: "유효하지 않은 Access Token입니다." });
        }
      } else {
        setErrors({ confirmPassword: "비밀번호 확인 중 오류가 발생했습니다." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={myPageStyles.passwordContainer}>
      <h2 style={myPageStyles.passwordTitle}>비밀번호 확인</h2>
      <form onSubmit={handleSubmit}>
        <div style={myPageStyles.passwordInputContainer}>
          <StyledInput
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            disabled={loading}
            placeholder={"기존 비밀번호"}
          />
          {errors.confirmPassword && (
            <span style={{ color: "red", marginLeft: "10px" }}>
              {errors.confirmPassword}
            </span>
          )}
          {errors.accessToken && (
            <span style={{ color: "red", marginLeft: "10px" }}>
              {errors.accessToken}
            </span>
          )}
        </div>
        <button
          type="submit"
          style={myPageStyles.passwordButton}
          disabled={loading}
        >
          {loading ? "확인 중..." : "다음"}
        </button>
      </form>
    </div>
  );
};

export default PasswordConfirmation;
