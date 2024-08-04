import { React, useState } from "react";
import { Logo } from "../../components/CommonComponents";
import { LoginTitle, LoginForm } from "../../components/LoginComponents";
import { commonStyles, LoginText } from "../../styles/styles";
import { useNavigate } from "react-router-dom";

const inputs = [
  {
    label: "아이디 또는 이메일",
    type: "text",
    id: "identifier",
    required: true,
  },
  { label: "비밀번호", type: "password", id: "password", required: true },
];

function DirectLoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = (data) => {
    navigate("/home");
  };

  const toFindPassword = () => {
    navigate("/login/findpassword");
  };

  const toJoin = () => {
    navigate("/login/join");
  };

  return (
    <div>
      <Logo />
      <div style={commonStyles.centerContainer}>
        <LoginTitle text="로그인" />
        <LoginForm
          inputs={inputs}
          buttonText="로그인"
          onLoginSuccess={handleLoginSuccess}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "3rem",
          }}
        >
          <LoginText style={{ marginRight: "3rem" }} onClick={toFindPassword}>
            비밀번호 찾기
          </LoginText>
          <LoginText onClick={toJoin}>회원가입</LoginText>
        </div>
      </div>
    </div>
  );
}

export default DirectLoginPage;
