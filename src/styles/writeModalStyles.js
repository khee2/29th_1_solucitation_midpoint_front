import styled from 'styled-components';

export const writeModalStyles = {
  overlay: {
    backgroundColor: 'rgba(1, 1, 1, 0.5)',
    zIndex: 3000,
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '620px',
    height: '600px',
    backgroundColor: '#f2f2ef',
    padding: '50px',
    border: '3px solid #1b4345',
    borderRadius: '10px',
  },
};

export const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  color: #1b4345;
  position: absolute;
  font-size: 30px;
  font-weight: bold;
  top: 30px;
  right: 30px;
  z-index: 1000;
`;

export const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 30px;
  left: 30px;
  z-index: 1000;
`;

export const ProfileImg = styled.img`
  width: 75px;
  height: 75px;
  border-radius: 50%;
  margin-right: 10px;
`;

export const ProfileName = styled.span`
  font-size: 20px;
  font-weight: bold;
`;

export const InputName = styled.input`
  width: 100%;
  padding: 10px;
  border: none;
  outline: none;
  margin-top: 75px;
  margin-bottom: 10px;
  background-color: transparent;
  color: #1b4345;
  font-family: 'Freesentation', sans-serif;
  font-size: 30px;
  font-weight: bold;
  text-decoration: underline;
  &::placeholder {
    color: #1b4345;
    font-family: 'Freesentation', sans-serif;
    font-size: 30px;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  height: 75px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  outline: none;
  background-color: transparent;
  font-family: 'Freesentation', sans-serif;
  font-size: 20px;
  resize: none;
  color: #000;
  &::placeholder {
    color: #1b4345;
    font-family: 'Freesentation', sans-serif;
    font-size: 20px;
  }
`;

export const ImgContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const AddImg = styled.img`
  display: flex;
  width: 200px;
  height: 200px;
  justify-content: center;
  align-items: center;
  background-color: #e0e0e0;
  cursor: pointer;
`;

export const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
  margin-bottom: 20px;
`;

export const TagButton = styled.button`
  padding: 5px 15px;
  border: 2px solid #000000;
  background-color: transparent;
  font-family: 'Freesentation', sans-serif;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  ${({ selected }) =>
    selected &&
    `
    background-color: #000000;
    color: #fff;
    font-size: 15px;
  `}
`;

export const SubmitButton = styled.button`
  color: #ffffff;
  background-color: #1b4345;
  border: noe;
  border-radius: 5px;
  position: absolute;
  font-size: 18px;
  font-family: 'Freesentation', sans-serif;
  padding: 5px 20px;
  bottom: 40px;
  right: 50px;
  cursor: pointer;
`;


export default writeModalStyles;
