import { React } from "react";
import { Logo } from "../../components/CommonComponents";
import { LoginTitle, FindPasswordForm } from "../../components/LoginComponents";
import { commonStyles } from "../../styles/styles";

const inputs = [
  { label: "이름", type: "name", id: "name", required: true },
  { label: "이메일", type: "email", id: "email", required: true },
];

function FindPassword() {
  return (
    <div>
      <Logo />
      <div style={commonStyles.centerContainer}>
        <LoginTitle text="비밀번호 찾기" />
        <FindPasswordForm inputs={inputs} />
      </div>
    </div>
  );
}

export default FindPassword;
