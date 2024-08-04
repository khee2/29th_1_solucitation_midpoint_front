import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { commonStyles } from '../../styles/styles'; 
import { Logo } from '../../components/CommonComponents';
import { AppContext } from '../../contexts/AppContext';

const Result3 = () => {
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
              backgroundColor: activeButton === 'study' ? '#1B4345' : '#fff',
              color: activeButton === 'study' ? '#fff' : '#1B4345',
              transition: 'background-color 0.3s, color 0.3s'
            }} 
            onClick={() => handleNavigate('study')}
          >
            <img src="/img/study.png" alt="공부" style={commonStyles.resultOptionImg} />
            <span style={{
              ...commonStyles.resultOptionText,
              color: activeButton === 'study' ? '#fff' : '#1B4345'
            }}>공부</span>
          </div>
          <div 
            style={{ 
              ...commonStyles.resultOptionBox, 
              backgroundColor: activeButton === 'culture' ? '#1B4345' : '#fff',
              color: activeButton === 'culture' ? '#fff' : '#1B4345',
              transition: 'background-color 0.3s, color 0.3s'
            }} 
            onClick={() => handleNavigate('culture')}
          >
            <img src="/img/culture.png" alt="문화생활" style={commonStyles.resultOptionImg} />
            <span style={{
              ...commonStyles.resultOptionText,
              color: activeButton === 'culture' ? '#fff' : '#1B4345'
            }}>문화생활</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result3;
