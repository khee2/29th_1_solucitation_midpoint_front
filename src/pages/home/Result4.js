import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { commonStyles } from '../../styles/styles'; 
import { Logo } from '../../components/CommonComponents';
import { AppContext } from '../../contexts/AppContext';

const Result4 = () => {
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
              backgroundColor: activeButton === 'hot-place' ? '#1B4345' : '#fff',
              color: activeButton === 'hot-place' ? '#fff' : '#1B4345',
              transition: 'background-color 0.3s, color 0.3s'
            }} 
            onClick={() => handleNavigate('hotplace')}
          >
            <img src="/img/hotple.png" alt="핫플" style={commonStyles.resultOptionImg} />
            <span style={{
              ...commonStyles.resultOptionText,
              color: activeButton === 'hot-place' ? '#fff' : '#1B4345'
            }}>핫플</span>
          </div>
          <div 
            style={{ 
              ...commonStyles.resultOptionBox, 
              backgroundColor: activeButton === 'social' ? '#1B4345' : '#fff',
              color: activeButton === 'social' ? '#fff' : '#1B4345',
              transition: 'background-color 0.3s, color 0.3s'
            }} 
            onClick={() => handleNavigate('social')}
          >
            <img src="/img/friend.png" alt="친목" style={commonStyles.resultOptionImg} />
            <span style={{
              ...commonStyles.resultOptionText,
              color: activeButton === 'social' ? '#fff' : '#1B4345'
            }}>친목</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result4;
