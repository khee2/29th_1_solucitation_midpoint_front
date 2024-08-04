import React, { useState, useRef, useEffect } from "react";
import {
  commonStyles,
  LoginFormContainer,
  LoginInputField,
  LoginInputGroup,
  LoginSubmitButton,
  JoinInputGroup,
  ProfilePictureInput,
  ProfilePictureLabel,
  DefaultProfileImage,
  JoinButton,
  Verification,
  VerificationInput,
  VerificationButton,
} from "../styles/styles";
import { Timer } from "./CommonComponents";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginTitle = ({ text }) => {
  return <h1 style={commonStyles.loginTitle}>{text}</h1>;
};

const JoinTitle = ({ text }) => {
  return <h1 style={commonStyles.joinTitle}>{text}</h1>;
};

// 로그인 폼
const LoginForm = ({ inputs, buttonText, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "http://3.36.150.194:8080/api/auth/login",
        formData
      );
      console.log("Login Successful:", response.data);

      // 응답에서 토큰 추출
      const { accessToken, refreshToken } = response.data;

      // 로컬 스토리지에 토큰 저장
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      navigate("/home");
      window.location.reload();

      onLoginSuccess(response.data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = error.response.data.errors
          .map((err) => err.message)
          .join("\n");
        setError(errorMessages);
      } else {
        console.error("Login Failed:", error);
        setError("로그인 중에 문제가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <LoginFormContainer onSubmit={handleSubmit}>
      {inputs.map(({ label, type, id, required }) => (
        <LoginInputGroup key={id}>
          <LoginInputField
            type={type}
            id={id}
            required={required}
            placeholder={label}
            value={formData[id] || ""}
            onChange={handleChange}
          />
        </LoginInputGroup>
      ))}
      {error && (
        <div style={{ color: "red", marginTop: "-2rem", marginBottom: "2rem" }}>
          {error}
        </div>
      )}
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <LoginSubmitButton type="submit">{buttonText}</LoginSubmitButton>
      </div>
    </LoginFormContainer>
  );
};

// 회원가입 폼
const JoinForm = ({
  inputs,
  values,
  setValues,
  onProfile,
  showVerification,
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [resetTimer, setResetTimer] = useState(false);
  const [verificationVisible, setVerificationVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const idRegex = /^[a-zA-Z0-9]{6,12}$/;

  const handleDefaultProfileClick = () => {
    fileInputRef.current.click();
  };

  const handleProfileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    onProfile(event);
  };

  // 입력 조건
  const validateInputs = (id, value) => {
    const newErrors = { ...errors };
    if (id === "nickname") {
      if (value.length < 2) {
        newErrors.nickname = "두글자 이상의 닉네임을 입력해 주세요.";
      } else {
        newErrors.nickname = "";
      }
    }
    if (id === "id") {
      if (!idRegex.test(value)) {
        newErrors.id = "6-12자 이내 영문/숫자 사용 가능합니다. (특수기호 불가)";
      } else {
        newErrors.id = "";
      }
    }
    if (id === "email") {
      const emailInput = document.getElementById("email").value.trim();
      if (!emailRegex.test(emailInput)) {
        newErrors.email = "올바른 이메일 주소를 입력해 주세요.";
      } else {
        newErrors.email = "";
      }
    }
    if (id === "password") {
      if (value.length < 8 || value.length > 16) {
        newErrors.password = "비밀번호는 8자 이상 16자 이하여야 합니다.";
      } else if (
        !/[a-zA-Z가-힣]/.test(value) ||
        !/\d/.test(value) ||
        !/[!@#$%^&*(),.?":{}|<>]/.test(value)
      ) {
        newErrors.password =
          "비밀번호는 문자(알파벳 또는 한글), 숫자 및 특수 문자를 포함해야 합니다.";
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

  // 회원가입 버튼 함수
  const handleChange = (event) => {
    const { name, value } = event.target;
    const newValues = { ...values, [name]: value };
    const newErrors = validateInputs(name, value);
    setValues(newValues);
    setErrors(newErrors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = {};

    inputs.forEach(({ id }) => {
      const newErrors = validateInputs(id, values[id] || "");
      if (newErrors[id]) {
        formErrors[id] = newErrors[id];
      }
    });

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await axios.post(
          "http://3.36.150.194:8080/api/auth/signup/verify-email",
          { email: values.email }
        );

        if (response.status === 200) {
          alert("인증코드가 이메일로 발송되었습니다.");
          setVerificationVisible(true);
        }
      } catch (error) {
        if (error.response) {
          const errorData = error.response.data;
          if (errorData.result) {
            alert(errorData.result);
          } else if (errorData.error) {
            alert(
              errorData.message ||
                "인증코드 발송에 실패했습니다. 다시 시도해 주세요."
            );
          } else {
            alert("인증코드 발송에 실패했습니다. 나중에 다시 시도해 주세요.");
          }
        } else {
          alert("인증코드 발송에 실패했습니다.");
        }
      }
    }
  };

  const resend = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://3.36.150.194:8080/api/auth/signup/verify-email",
        { email: values.email }
      );

      if (response.status === 200) {
        setResetTimer(true);
        setIsTimerActive(true);
        document.getElementById("verificationCode").value = "";
        setTimeout(() => setResetTimer(false), 1000);
        alert("인증코드가 이메일로 발송되었습니다.");
        setVerificationVisible(true);
      }
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        if (errorData.result) {
          alert(errorData.result);
        } else if (errorData.error) {
          alert(
            errorData.message ||
              "인증코드 발송에 실패했습니다. 다시 시도해 주세요."
          );
        } else {
          alert("인증코드 발송에 실패했습니다. 나중에 다시 시도해 주세요.");
        }
      } else {
        alert("인증코드 발송에 실패했습니다.");
      }
    }
  };

  const verify = async (event) => {
    event.preventDefault();
    const verificationCodeInput = document
      .getElementById("verificationCode")
      .value.trim();

    try {
      const response = await axios.post(
        "http://3.36.150.194:8080/api/auth/signup/verify-code",
        {
          email: values.email,
          code: verificationCodeInput,
        }
      );

      if (response.status === 200) {
        setErrors({ ...errors, verificationCode: "" });
        setIsTimerActive(false);
        setIsVerified(true);
        alert("인증 완료되었습니다😊");
      } else {
        alert("인증코드가 일치하지 않습니다.");
      }
    } catch (error) {
      alert("인증코드가 일치하지 않습니다.");
    }
  };

  // 완료 버튼 함수
  const handleVerificationSubmit = async () => {
    const formData = new FormData();
    formData.append(
      "signupRequestDto",
      JSON.stringify({
        loginId: values.id,
        name: values.name,
        email: values.email,
        nickname: values.nickname,
        password: values.password,
        confirmPassword: values.passwordVerification,
      })
    );
    if (fileInputRef.current.files[0]) {
      formData.append("profileImage", fileInputRef.current.files[0]);
    } else {
      const defaultImageResponse = await fetch("/img/default-profile.png");
      const defaultImageBlob = await defaultImageResponse.blob();
      formData.append("profileImage", defaultImageBlob, "default-profile.png");
    }

    try {
      const response = await axios.post(
        "http://3.36.150.194:8080/api/auth/signup",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        alert(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;

        if (errorData.errors) {
          errorData.errors.forEach((err) => {
            alert(`${err.field} : ${err.message}`);
          });
        } else if (errorData.error) {
          alert(`${errorData.message}`);
        } else if (errorData.result) {
          alert(`${errorData.result}`);
        } else {
          alert(
            "회원가입 요청 처리 중 에러가 발생했습니다. 나중에 다시 시도해 주세요."
          );
        }
      } else {
        alert("회원가입 요청 처리 중 네트워크 에러가 발생했습니다.");
      }
    }
  };

  return (
    <LoginFormContainer onSubmit={handleSubmit} style={{ marginTop: "4.5rem" }}>
      {/* 회원가입 입력 */}
      {inputs.map(({ label, type, id, required }) => (
        <JoinInputGroup key={id}>
          <LoginInputField
            type={type}
            id={id}
            name={id}
            required={required}
            onChange={handleChange}
            placeholder={label}
          />
          {errors[id] && (
            <p style={{ color: "red", marginBottom: "0rem", fontSize: "1rem" }}>
              {errors[id]}
            </p>
          )}
        </JoinInputGroup>
      ))}

      {/* 프로필 사진 첨부 */}
      <ProfilePictureLabel htmlFor="profilePicture">
        프로필 사진 선택
      </ProfilePictureLabel>
      {selectedProfileImage && (
        <DefaultProfileImage
          src={selectedProfileImage}
          style={{
            borderRadius: "50%",
          }}
          onClick={handleDefaultProfileClick}
        />
      )}
      {!selectedProfileImage && (
        <DefaultProfileImage
          src="/img/default-profile.png"
          onClick={handleDefaultProfileClick}
        />
      )}
      <ProfilePictureInput
        id="profilePicture"
        ref={fileInputRef}
        onChange={handleProfileChange}
      />

      {/* 인증 요청 버튼 */}
      {!verificationVisible && (
        <div
          style={{
            width: "44rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <LoginSubmitButton
            type="submit"
            style={{ marginBottom: "3rem", marginTop: "2.5rem" }}
          >
            인증 요청
          </LoginSubmitButton>
        </div>
      )}

      {/* 인증 버튼 클릭 후 보여지는 verification */}
      {verificationVisible && (
        <div>
          <div style={{ display: "flex" }}>
            <Verification>
              <VerificationInput
                type="text"
                id="verificationCode"
                placeholder="인증코드 입력"
                required
                onChange={(e) => setErrors({ ...errors, verificationCode: "" })}
              />
              <Timer isActive={isTimerActive} resetTimer={resetTimer} />
            </Verification>
            <VerificationButton type="submit" onClick={resend}>
              재전송
            </VerificationButton>
            <VerificationButton type="submit" onClick={verify}>
              인증확인
            </VerificationButton>
          </div>
          <div
            style={{
              width: "44rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <JoinButton
              type="button"
              onClick={handleVerificationSubmit}
              style={{ marginTop: "-2rem", marginBottom: "5rem" }}
              disabled={!isVerified}
            >
              완료
            </JoinButton>
          </div>
        </div>
      )}
    </LoginFormContainer>
  );
};

// 비밀번호 찾기 폼
const FindPasswordForm = ({ inputs, onSubmit }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [resetTimer, setResetTimer] = useState(false);
  const [verificationVisible, setVerificationVisible] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const toResetPassword = () => {
    navigate(`/login/resetpassword`);
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    if (id === "email") {
      setEmail(value);
    } else if (id === "name") {
      setName(value);
    } else if (id === "verificationCode") {
      setVerificationCode(value);
    }
  };

  // 인증번호 받기 요청
  const requestVerificationCode = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://3.36.150.194:8080/api/auth/verify-email",
        { email, name }
      );

      alert(response.data.message);
      setHideButton(true);
      setVerificationVisible(true);
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const errorMessages = errorData.errors
            .map((err) => err.message)
            .join("\n");
          alert(errorMessages);
        } else {
          alert(errorData.message);
        }
      } else {
        alert("인증 번호 요청 중에 문제가 발생했습니다. 다시 시도해주세요.");
        console.log(error);
      }
    }
  };

  // 코드 재전송 함수
  const resend = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://3.36.150.194:8080/api/auth/verify-email",
        { name: name, email: email }
      );

      if (response.status === 200) {
        setResetTimer(true);
        setIsTimerActive(true);
        document.getElementById("verificationCode").value = "";
        setTimeout(() => setResetTimer(false), 1000);
        alert("인증코드가 이메일로 발송되었습니다.");
        setVerificationVisible(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorData = error.response.data;
        if (errorData.error === "name_email_mismatch") {
          alert("이름 또는 이메일 정보가 일치하지 않습니다.");
        } else if (errorData.errors) {
          const errorMessages = errorData.errors
            .map((err) => err.message)
            .join("\n");
          alert(errorMessages);
        } else {
          alert("인증코드 발송에 실패했습니다. 다시 시도해 주세요.");
        }
      } else {
        alert("인증코드 발송에 실패했습니다. 나중에 다시 시도해 주세요.");
      }
    }
  };

  // 코드 검증 함수
  const verify = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://3.36.150.194:8080/api/auth/reset-pw/verify-code",
        { email: email, code: verificationCode }
      );

      localStorage.setItem(
        "tokenForResetPassword",
        response.data["X-Reset-Password-Token"]
      );

      console.log(response.data["X-Reset-Password-Token"]);

      setIsTimerActive(false);
      alert("인증 완료되었습니다😊");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorData = error.response.data;

        if (errorData.errors) {
          const errorMessages = errorData.errors
            .map((err) => err.message)
            .join("\n");
          alert(errorMessages);
        } else if (errorData.error === "invalid_code") {
          alert("유효하지 않거나 만료된 인증번호입니다.");
        } else {
          alert(
            errorData.message ||
              "인증코드 발송에 실패했습니다. 다시 시도해 주세요."
          );
        }
      } else {
        alert("인증코드 발송에 실패했습니다. 나중에 다시 시도해 주세요.");
      }
    }
  };

  return (
    <LoginFormContainer onSubmit={onSubmit}>
      {inputs.map(({ label, type, id, required }) => (
        <LoginInputGroup key={id}>
          <LoginInputField
            type={type}
            id={id}
            required={required}
            placeholder={label}
            value={id === "email" ? email : id === "name" ? name : ""}
            onChange={handleInputChange}
          />
        </LoginInputGroup>
      ))}
      {!hideButton && (
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <LoginSubmitButton
            type="submit"
            style={{ width: "9.3rem" }}
            onClick={requestVerificationCode}
          >
            인증번호 받기
          </LoginSubmitButton>
        </div>
      )}
      {verificationVisible && (
        <div>
          <div style={{ display: "flex", marginTop: "-3rem" }}>
            <Verification style={{ borderBottom: "0.3rem solid #1b4345" }}>
              <VerificationInput
                type="text"
                id="verificationCode"
                placeholder="인증코드 입력"
                required
                value={verificationCode}
                onChange={handleInputChange}
              />
              <Timer isActive={isTimerActive} resetTimer={resetTimer} />
            </Verification>
            <VerificationButton type="submit" onClick={resend}>
              재전송
            </VerificationButton>
            <VerificationButton type="submit" onClick={verify}>
              인증확인
            </VerificationButton>
          </div>
          <div
            style={{
              width: "44rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <JoinButton
              type="button"
              onClick={toResetPassword}
              style={{ marginTop: "-0.5rem" }}
            >
              다음
            </JoinButton>
          </div>
        </div>
      )}
    </LoginFormContainer>
  );
};

// 비밀번호 재설정 폼
const ResetPasswordForm = ({ inputs, values, setValues, buttonText }) => {
  const [errors, setErrors] = useState({});
  const [tokenForResetPassword, setTokenForResetPassword] = useState("");
  const navigate = useNavigate();

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
          navigate("/login");
        } else {
          const errorData = await response.json();
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
    const token = localStorage.getItem("tokenForResetPassword");
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
      localStorage.removeItem("tokenForResetPassword");
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

export {
  LoginTitle,
  JoinTitle,
  LoginForm,
  JoinForm,
  FindPasswordForm,
  ResetPasswordForm,
  LoginFormContainer,
  LoginInputGroup,
  LoginInputField,
  JoinButton
};
