import React from "react";
import styled from "styled-components";
import { Logo } from "../components/CommonComponents";
import { commonStyles } from "../styles/styles";
import { useNavigate } from "react-router-dom";

const BackgroundContainer = styled.div`
  background-image: url("img/main_background.png");
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const IntroDiv = styled.div`
  &:hover h1,
  &:hover h5 {
    color: #ec5640;
  }
  cursor: pointer;
`;

const Intro = styled.h1`
  font-family: "AkiraExpanded";
  font-size: 10rem;
  font-weight: 900;
  color: #1b4345;
  margin-bottom: 0.5rem;
  margin-top: 12%;
`;

const SubIntro = styled.h5`
  font-family: "AkiraExpanded";
  font-size: 4rem;
  font-weight: 400;
  color: #1b4345;
  margin-top: 0rem;
`;

const MainPage = () => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/home")
  };

  return (
    <BackgroundContainer>
      <Logo exist={false}/>
      <div style={commonStyles.centerContainer}>
        <IntroDiv onClick={onClick}>
          <Intro>MIDPOINT</Intro>
          <SubIntro>WHERE TO MEET?</SubIntro>
        </IntroDiv>
      </div>
    </BackgroundContainer>
  );
};

export default MainPage;
