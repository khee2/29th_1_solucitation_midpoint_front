import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { commonStyles, ButtonContainer, ProgressBarContainer, ProgressBar, ProgressIndicator } from '../../styles/styles';
import { Logo } from '../../components/CommonComponents';

const Test3 = ({ updateAnswers, answers }) => {
  const [activeButton, setActiveButton] = useState(null); 
  const navigate = useNavigate();

  const handleClick = (button) => {
    setActiveButton(button);
    updateAnswers('test3', button);

    // Test1, Test2, Test3의 답변에 따라 결과 페이지로 이동
    if (answers.test1 === 'yes') {
      if (answers.test2 === 'city') {
        if (button === 'calm') {
          navigate('/result1');
        } else {
          navigate('/result1');
        }
      } else {
        if (button === 'calm') {
          navigate('/result1');
        } else {
          navigate('/result1');
        }
      }
    } else {
      if (answers.test2 === 'city') {
        if (button === 'calm') {
          navigate('/result3');
        } else {
          navigate('/result4');
        }
      } else {
        if (button === 'calm') {
          navigate('/result2');
        } else {
          navigate('/result2');
        }
      }
    }
  };

  const handleNextClick = () => {
    alert('완료되었습니다!');
  };

  const handlePrevClick = () => {
    navigate('/test2');
  };

  return (
    <div style={commonStyles.container}>
      <Logo />
      <div style={commonStyles.content}>
        <h1 style={{ marginBottom: '4rem', position: 'relative', fontSize: '2.3rem' }}>Q3. 어떤 분위기를 선호하시나요?
          <button 
            onClick={handlePrevClick} 
            style={{ 
              position: 'absolute',
              top: '150%',
              left: '-190px',
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
          <span 
            style={{ 
              position: 'absolute',
              top: '150%',
              right: '-195px',
              transform: 'translateY(-50%)',
              fontSize: '1.3rem',
              color: 'rgba(0, 0, 0, 0.5)'
            }}
          >
            완료!
          </span>
        </h1>
        <ProgressBarContainer>
          <ProgressBar style={{ width: '100%' }}>
            <ProgressIndicator style={{ right: 0 }} />
          </ProgressBar>
        </ProgressBarContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
          <ButtonContainer
            onClick={() => handleClick('calm')}
            style={{ backgroundColor: activeButton === 'calm' ? '#1B4345' : '#fff' }}
          >
            <img src="/img/relaxed.png" alt="차분한" />
            <span style={{ color: activeButton === 'calm' ? '#fff' : '#1B4345' }}>차분한</span>
          </ButtonContainer>
          <ButtonContainer
            onClick={() => handleClick('energetic')}
            style={{ backgroundColor: activeButton === 'energetic' ? '#1B4345' : '#fff' }}
          >
            <img src="/img/energetic.png" alt="활발한" />
            <span style={{ color: activeButton === 'energetic' ? '#fff' : '#1B4345' }}>활발한</span>
          </ButtonContainer>
        </div>
      </div>
    </div>
  );
};

export default Test3;