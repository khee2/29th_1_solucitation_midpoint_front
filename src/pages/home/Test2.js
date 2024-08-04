import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { commonStyles, ButtonContainer, ProgressBarContainer, ProgressBar, ProgressIndicator } from '../../styles/styles';
import { Logo } from '../../components/CommonComponents';

const Test2 = ({ updateAnswers, answers }) => {
  const [activeButton, setActiveButton] = useState(null); 
  const navigate = useNavigate();

  const handleClick = (button) => {
    setActiveButton(button);
    updateAnswers('test2', button);
    setTimeout(() => {
      navigate('/test3');
    }, 200); 
  };

  const handleNextClick = () => {
    navigate('/test3');
  };

  const handlePrevClick = () => {
    navigate('/test1');
  };

  return (
    <div style={commonStyles.container}>
      <Logo />
      <div style={commonStyles.content}>
        <h1 style={{ marginBottom: '4rem', position: 'relative', fontSize: '2.3rem' }}>Q2. 어떤 장소를 선호하시나요?
          <button 
            onClick={handleNextClick} 
            style={{ 
              position: 'absolute',
              top: '150%',
              right: '-204px',
              transform: 'translateY(-50%)',
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              fontSize: '2.2rem', 
              color: 'rgba(0, 0, 0, 0.5)'
            }}
          >
            {'>'}
          </button>
          <button 
            onClick={handlePrevClick} 
            style={{ 
              position: 'absolute',
              top: '150%',
              left: '-204px',
              transform: 'translateY(-50%)',
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              fontSize: '2.2rem', 
              color: 'rgba(0, 0, 0, 0.5)'
            }}
          >
            {'<'}
          </button>
        </h1>
        <ProgressBarContainer>
          <ProgressBar style={{ width: '50%' }}>
            <ProgressIndicator style={{ right: 0 }} />
          </ProgressBar>
        </ProgressBarContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
          <ButtonContainer
            onClick={() => handleClick('city')}
            style={{ backgroundColor: activeButton === 'city' ? '#1B4345' : '#fff' }}
          >
            <img src="/img/city.png" alt="도시" />
            <span style={{ color: activeButton === 'city' ? '#fff' : '#1B4345' }}>도시</span>
          </ButtonContainer>
          <ButtonContainer
            onClick={() => handleClick('nature')}
            style={{ backgroundColor: activeButton === 'nature' ? '#1B4345' : '#fff' }}
          >
            <img src="/img/nature.png" alt="자연" />
            <span style={{ color: activeButton === 'nature' ? '#fff' : '#1B4345' }}>자연</span>
          </ButtonContainer>
        </div>
      </div>
    </div>
  );
};

export default Test2;
