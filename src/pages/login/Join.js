import React, { useState } from "react";
import { Logo } from "../../components/CommonComponents";
import { JoinForm, JoinTitle } from "../../components/LoginComponents";

const inputs = [
  { label: "이름", type: "name", id: "name", required: true },
  { label: "닉네임", type: "text", id: "nickname", required: true },
  { label: "아이디", type: "id", id: "id", required: true },
  { label: "이메일", type: "text", id: "email", required: true },
  { label: "비밀번호", type: "password", id: "password", required: true },
  {
    label: "비밀번호 확인",
    type: "password",
    id: "passwordVerification",
    required: true,
  },
];

function Join() {
  const [values, setValues] = useState({});
  const [verificationVisible, setVerificationVisible] = useState(false);

  const handleSubmit = (event, formErrors) => {
    event.preventDefault();
    if (formErrors && Object.keys(formErrors).length === 0) {
      setVerificationVisible(true);
    }
  };

  const handleProfileChange = (event) => {
    console.log(event.target.files[0]);
  };


  return (
    <div>
      <Logo bgColor="#F2F2EF"/>
      <JoinTitle text="회원가입" />
      <JoinForm
        inputs={inputs}
        values={values}
        setValues={setValues}
        onSubmit={handleSubmit}
        onProfile={handleProfileChange}
        showVerification={verificationVisible}
      />
    </div>
  );
}

export default Join;
