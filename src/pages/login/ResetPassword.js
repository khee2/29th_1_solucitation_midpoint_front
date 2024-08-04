import { React, useState } from "react";
import { Logo } from "../../components/CommonComponents";
import {
  LoginTitle,
  ResetPasswordForm,
} from "../../components/LoginComponents";
import { commonStyles} from "../../styles/styles";

const inputs = [
  { label: "새 비밀번호", type: "password", id: "password", required: true },
  {
    label: "새 비밀번호 확인",
    type: "password",
    id: "passwordVerification",
    required: true,
  },
];

function ResetPassword() {
  const [values, setValues] = useState({});
  
  return (
    <div>
      <Logo />
      <div style={commonStyles.centerContainer}>
        <LoginTitle text="비밀번호 변경" />
        <ResetPasswordForm
          inputs={inputs}
          values={values}
          setValues={setValues}
          buttonText="변경"
        />
      </div>
    </div>
  );
}

export default ResetPassword;
