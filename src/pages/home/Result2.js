import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { commonStyles } from '../../styles/styles'; 
import { Logo } from '../../components/CommonComponents';
import { AppContext } from '../../contexts/AppContext';

const Result2 = () => {
  const [activeButton, setActiveButton] = useState(null);
  const navigate = useNavigate();
  const { setSelectedPurpose } = useContext(AppContext);

  const handleNavigate = (purpose) => {
    setActiveButton(purpose);
    setSelectedPurpose(purpose);
    setTimeout(() => {
      navigate('/home');
    }, 200);
  };

  return (
    <div style={commonStyles.container}>
      <Logo />
      <div style={commonStyles.resultContainer}>
        <h1 style={{ marginBottom: '4rem' }}>당신을 위한 만남 목적 추천</h1>
        <div style={commonStyles.resultOptions}>
          <div 
            style={{ 
              ...commonStyles.resultOptionBox, 
              backgroundColor: activeButton === 'walk' ? '#1B4345' : '#fff',
              color: activeButton === 'walk' ? '#fff' : '#1B4345',
              transition: 'background-color 0.3s, color 0.3s'
            }} 
            onClick={() => handleNavigate('walk')}
          >
            <img src="/img/walk.png" alt="산책" style={commonStyles.resultOptionImg} />
            <span style={{
              ...commonStyles.resultOptionText,
              color: activeButton === 'walk' ? '#fff' : '#1B4345'
            }}>산책</span>
          </div>
          <div 
            style={{ 
              ...commonStyles.resultOptionBox, 
              backgroundColor: activeButton === 'hiking' ? '#1B4345' : '#fff',
              color: activeButton === 'hiking' ? '#fff' : '#1B4345',
              transition: 'background-color 0.3s, color 0.3s'
            }} 
            onClick={() => handleNavigate('hiking')}
          >
            <img src="/img/hiking.png" alt="등산" style={commonStyles.resultOptionImg} />
            <span style={{
              ...commonStyles.resultOptionText,
              color: activeButton === 'hiking' ? '#fff' : '#1B4345'
            }}>등산</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result2;
