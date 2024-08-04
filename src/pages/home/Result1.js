import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { commonStyles } from '../../styles/styles'; 
import { Logo } from '../../components/CommonComponents';
import { AppContext } from '../../contexts/AppContext';

const Result1 = () => {
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
              backgroundColor: activeButton === 'restaurant' ? '#1B4345' : '#fff',
              color: activeButton === 'restaurant' ? '#fff' : '#1B4345',
              transition: 'background-color 0.3s, color 0.3s'
            }} 
            onClick={() => handleNavigate('restaurant')}
          >
            <img src="/img/restaurant.png" alt="맛집" style={commonStyles.resultOptionImg} />
            <span style={{
              ...commonStyles.resultOptionText,
              color: activeButton === 'restaurant' ? '#fff' : '#1B4345'
            }}>맛집</span>
          </div>
          <div 
            style={{ 
              ...commonStyles.resultOptionBox, 
              backgroundColor: activeButton === 'cafe' ? '#1B4345' : '#fff',
              color: activeButton === 'cafe' ? '#fff' : '#1B4345',
              transition: 'background-color 0.3s, color 0.3s'
            }} 
            onClick={() => handleNavigate('cafe')}
          >
            <img src="/img/cafe.png" alt="카페" style={commonStyles.resultOptionImg} />
            <span style={{
              ...commonStyles.resultOptionText,
              color: activeButton === 'cafe' ? '#fff' : '#1B4345'
            }}>카페</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result1;
