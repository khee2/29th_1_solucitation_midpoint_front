import styled from "styled-components";

export const commonStyles = {
  header: (bgColor = "transparent") => ({
    position: "fixed",
    width: "100%",
    height: "80px", 
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "1rem",
    paddingBottom: "1rem",
    top: 0,
    zIndex: 1000,
    backgroundColor: bgColor,
  }),
  logo_div: {
    marginLeft: "4.5rem",
  },
  logo: {
    fontFamily: "AkiraExpanded",
    fontSize: "2rem",
    color: "#1B4345",
    display: "inline-block",
    verticalAlign: "middle",
    cursor: "pointer",
  },
  move_div: {
    height: "40px",
    float: "right",
    marginTop: "10px",
    marginRight: "4.5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  linkContainer: {
    position: "relative",
    display: "inline-block",
    margin: "0 10px",
    textAlign: "center",
  },
  link: {
    fontSize: "1.5rem",
    color: "#000000",
    height: "20px",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
    paddingLeft: "52px",
    marginBottom: "12px",
    fontWeight: "bold",
    marginRight: "-15px",
  },
  loginTitle: {
    fontSize: "3.4rem",
    textAlign: "center",
    fontWeight: "700",
    marginTop: "7.3rem",
  },
  joinTitle: {
    fontSize: "3.05rem",
    textAlign: "center",
    fontWeight: "700",
    marginTop: "7.15rem",
  },
  centerContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "calc(100vh - 10% - 12.6rem)",
    paddingTop: "6.3rem",
    paddingBottom: "6.3rem",
  },

  nav: {
    display: "flex",
    gap: "2rem",
    marginRight: "3rem",
  },

  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    minHeight: "100vh",
    backgroundColor: "#F2F2EF",
  },
  content: {
    width: "100%",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    borderRadius: "8px",
    marginTop: '60px',  // 헤더와의 간격을 유지하기 위해 여백 추가
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1rem",
    width: "100%",
  },
  profileContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginRight: "1rem",
  },
  profileImg: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
  },
  profileName: {
    fontSize: "1rem",
    fontWeight: "bold",
    textAlign: "center",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  inputField: {
    flex: 1,
    width: "500px",
    padding: "0.8rem",
    fontSize: "1.2rem",
    border: "1px solid #FFF",
    borderRadius: "4px",
    textAlign: "center",
    fontFamily: 'Freesentation, sans-serif',
    fontWeight: '500',
  },
  selectField: {
    flex: 1,
    padding: "0.8rem",
    fontSize: "1.2rem",
    border: "1px solid #FFF",
    borderRadius: "4px",
    textAlign: "center",
    backgroundImage:
      "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 140 140' xmlns='http://www.w3.org/2000/svg'><polyline points='0,0 70,100 140,0' style='fill:none;stroke:black;stroke-width:20'/></svg>\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 15px center",
    backgroundSize: "12px",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    fontFamily: 'Freesentation, sans-serif',
    fontWeight: '500',
  },
  submitButton: {
    padding: "0.8rem 1rem",
    fontSize: "1.2rem",
    backgroundColor: "#1B4345",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontFamily: 'Freesentation, sans-serif',
    fontWeight: '500',
  },
  placeButton: {
    padding: "0.5rem 1rem",
    fontSize: "1.2rem",
    backgroundColor: "#1B4345",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "3rem",
    fontFamily: 'Freesentation, sans-serif',
    fontWeight: '500',
  },
  retryButton: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    backgroundColor: "#1B4345",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  addButton: {
    cursor: "pointer",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    backgroundImage: 'url("/img/plusbutton.png")',
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  destination: {
    display: "flex",
    width: "100%",
    marginTop: "1rem",
  },
  testContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "2rem",
    borderRadius: "8px",
    backgroundColor: "#F2F2EF",
  },
  testTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "1.5rem",
  },
  testOptions: {
    display: "flex",
    justifyContent: "space-around",
    width: "100%",
  },
  option: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
  },
  optionImg: {
    width: "100px",
    height: "100px",
    marginBottom: "0.5rem",
  },
  optionText: {
    fontSize: "1.2rem",
    fontWeight: "600",
  },
  resultContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
  },
  resultOptions: {
    display: "flex",
    justifyContent: "space-around",
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
  },
  resultOption: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "0 1rem",
  },
  resultOptionBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "250px",
    height: "250px",
    border: "none",
    backgroundColor: "#fff",
    borderRadius: "15px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    margin: "0 1rem",
  },
  resultOptionImg: {
    width: "140px",
    height: "auto",
  },
  resultOptionText: {
    marginTop: "1rem",
    fontSize: "1.7rem",
    fontWeight: "600",
  },
  resultButton: {
    marginTop: "4rem",
    padding: "0.5rem 1rem",
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#000",
    backgroundColor: "#F2F2EF",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    textDecoration: "underline",
  },
  popupContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popupBox: {
    position: "relative",
    backgroundColor: "#F2F2EF",
    width: "600px",
    height: "550px",
    border: "1px solid #ccc",
    borderRadius: "0",
    padding: "1rem",
  },
  popupHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "1.5rem",
    paddingRight: "1rem",
    paddingLeft: "1rem",
    width: "75%",
    margin: "0 auto",
  },
  popupInput: {
    flex: 1,
    padding: "0.5rem",
    fontSize: "1.2rem",
    border: "1px solid #fff",
    borderRadius: "4px",
    textAlign: "center",
    fontFamily: 'Freesentation, sans-serif',
    fontWeight: '500',
  },
  popupButton: {
    padding: "0.5rem 1rem",
    fontSize: "1.2rem",
    backgroundColor: "#1B4345",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
    fontFamily: 'Freesentation, sans-serif',
    fontWeight: '500',
  },
  popupCloseButton: {
    fontSize: "1rem",
    backgroundColor: "#F2F2EF",
    color: "#000",
    border: "none",
    cursor: "pointer",
    position: "absolute",
    top: "10px",
    right: "10px",
  },
  popupContent: {
    paddingTop: "0.7rem",
    paddingBottom: "1rem",
    paddingRight: "4.7rem",
    paddingLeft: "4.7rem",
  },
  popupSections: {
    display: "flex",
    justifyContent: "space-between",
  },
  popupSection1: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: "10px",
    alignItems: "center",
    width: "33%",
    height: '140px',
    marginBottom: "0.5rem",
  },
  popupSection2: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: "10px",
    width: "62%",
    height: "15%",
    marginBottom: "0.5rem",
  },
  popupSectionTitle: {
    fontSize: "1rem",
    fontWeight: "700",
    paddingLeft: "1.1rem",
  },
  favoritePlaces: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  favoritePlace: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    margin: "0 0.5rem",
  },
  favoritePlaceImage: {
    width: "23px",
    height: "23px",
  },
  favoriteFriends: {
    display: "flex",
    paddingLeft: "1.2rem",
    overflowX: "auto",  // X축 스크롤 추가
    whiteSpace: "nowrap",  // 한 줄로 표시
  },
  favoriteFriend: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginRight: "1.2rem",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    flexShrink: 0,  // 요소가 줄어들지 않도록 설정
  },  
  favoriteFriendImage: {
    width: "23px",
    height: "23px",
  },
  locationContainer: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    marginBottom: "1rem",
  },
  locationIcon: {
    marginRight: "0.5rem",
  },
  mapContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  currentLocationText: {
    fontSize: "1rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  suggestionsList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    backgroundColor: 'white',
    border: '1px solid #ccc',
    position: 'absolute',
    width: '71%',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
  },
  suggestionItem: {
    padding: '10px',
    cursor: 'pointer',
  },
  
};

export const LoginFormContainer = styled.form`
  width: 44rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 내부 내용물을 왼쪽으로 정렬 */
  background-color: transparent !important;
  margin-top: 2.6rem;
`;

export const LoginInputGroup = styled.div`
  display: flex;
  align-items: center;
  width: 44rem;
  margin-bottom: 3.6rem;
  padding-bottom: 0.5rem;
  border-bottom: 0.3rem solid #1b4345;
  font-size: 1.4rem;
  font-weight: 800;
`;

export const LoginInputLabel = styled.label`
  width: 9.5rem;
  color: #1b4345;
`;

export const LoginInputField = styled.input`
  flex: 1;
  padding: 8px;
  padding-left: 0px;
  border: none;
  font-size: 1.1rem;
  background-color: transparent !important;
  outline: none;
  box-shadow: none;
  color: #1b4345;
  font-weight: 700;

  ::placeholder {
    color: #1b4345;
    font-size: 1.13rem;
    font-weight: 900; 
    letter-spacing: -0.1rem;
  }

  &::-webkit-input-placeholder {
    color: #1b4345;
    font-size: 1.13rem;
    font-weight: 900;
    letter-spacing: -0.1rem;
  }

  &::-moz-placeholder {
    color: #1b4345;
    font-size: 1.13rem;
    font-weight: 900;
    letter-spacing: -0.1rem;
  }

  &:-ms-input-placeholder {
    color: #1b4345;
    font-size: 1.13rem;
    font-weight: 900;
    letter-spacing: -0.1rem;
  }

  &::-ms-input-placeholder {
    color: #1b4345;
    font-size: 1.13rem;
    font-weight: 900;
    letter-spacing: -0.1rem;
  }
`;

export const LoginSubmitButton = styled.button`
  width: 8.95rem;
  height: 2.7rem;
  padding: 1rem;
  margin-top: 0.8rem;
  border: none;
  border-radius: 0.2rem;
  background-color: #1b4345;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LoginText = styled.p`
  font-size: 1.3rem;
  font-weight: 800;
  position: relative;
  display: inline-block;
  padding-bottom: 2px;
  cursor: pointer;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1.5px;
    background-color: #000000;
  }
`;

export const JoinInputGroup = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: -1.5rem;
  margin-bottom: 4.3rem;
  padding-bottom: 0.5rem;
  border-bottom: 0.25rem solid #1b4345;
  font-size: 1.25rem;
  font-weight: 700;
`;

export const JoinInputLabel = styled.label`
  width: 6rem;
  margin-right: 0.5rem;
  color: #1b4345;
`;

export const ProfilePictureLabel = styled.label`
  margin-top: -0.7rem;
  margin-bottom: 1rem;
  color: #1b4345;
  font-size: 1.25rem;
  font-weight: 700;
  align-self: flex-start;
`;

export const DefaultProfileImage = styled.img`
  width: 5rem;
  height: 5rem;
  margin-top: -0.3rem;
  cursor: pointer;
  align-self: flex-start;
`;

export const ProfilePictureInput = styled.input.attrs({
  type: "file",
  id: "profilePicture",
  accept: "image/*",
})`
  display: none;
`;

export const JoinButton = styled.button`
  width: 8.95rem;
  height: 2.7rem;
  padding: 1rem;
  margin-top: 1.6rem;
  border: none;
  border-radius: 0.2rem;
  background-color: #1b4345;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Verification = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 29rem;
  height: 2.5rem;
  margin-top: 3.8rem;
  margin-bottom: 5.1rem;
  padding-bottom: 0.5rem;
  border-bottom: 0.25rem solid #1b4345;
  font-size: 1.25rem;
  font-weight: 700;
  margin-right: 0.8rem;
`;


export const VerificationInput = styled.input`
  width: 65%;
  padding: 10px;
  padding-left: 0px;
  padding-right: 0px;
  border: none;
  font-size: 1.1rem;
  background-color: transparent !important;
  outline: none;
  color: #1b4345;
  font-weight: 700;

  ::placeholder {
    color: #1b4345;
    font-size: 1.2rem;
    font-weight: 700;
    letter-spacing: -0.1rem;
  }

  &::-webkit-input-placeholder {
    color: #1b4345;
    font-size: 1.2rem;
    font-weight: 700;
    letter-spacing: -0.1rem;
  }

  &::-moz-placeholder {
    color: #1b4345;
    font-size: 1.2rem;
    font-weight: 900;
    letter-spacing: -0.1rem;
  }

  &:-ms-input-placeholder {
    color: #1b4345;
    font-size: 1.2rem;
    font-weight: 900;
    letter-spacing: -0.1rem;
  }

  &::-ms-input-placeholder {
    color: #1b4345;
    font-size: 1.2rem;
    font-weight: 900;
    letter-spacing: -0.1rem;
  }
`;

export const VerificationButton = styled.button`
  width: 16%;
  height: 2.7rem;
  padding: 1rem;
  margin-top: 4.1rem;
  margin-right: 0.3rem;
  border: 0.2rem solid #1b4345;
  border-radius: 0.2rem;
  background-color: transparent;
  color: #1b4345;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const StyledSelect = styled.select`
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #fff;
  border-radius: 4px;
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
  background-color: #fff;
  appearance: none;
  webkitappearance: none;
  mozappearance: none;
  textalignlast: center;
`;

export const StyledOption = styled.option`
  padding: 1rem;
`;

export const TestFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: transparent !important;
  margin-top: 4.9rem;
`;

export const ButtonContainer = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 240px;
  height: 240px;
  border: none;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  margin: 0 1rem;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 140px;
    height: auto;
  }

  span {
    margin-top: 0.7rem;
    font-size: 1.5rem;
    font-weight: bold;
    color: #1b4345;
  }
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin-bottom: 3rem;
  position: relative;
`;

export const ProgressBar = styled.div`
  height: 100%;
  background-color: #000; 
  border-radius: 5px;
  position: relative;
  transition: width 0.3s ease;
`;

export const ProgressIndicator = styled.div`
  width: 20px;
  height: 20px;
  background-color: #000; 
  border-radius: 50%;
  position: absolute;
  top: -5px;
  right: 0; 
  transform: translateX(50%);
`;

export const PlaceContainer = styled.div`
  display: flex;
  width: 100%;
`;

export const Left = styled.div`
  flex: 1;
  display: flex;
  justify-content: center; 
  padding: 0.3rem;
  position: relative; 
`;

export const PlacesList = styled.ul`
  list-style: none;
  padding-left: 1.2rem;
  padding-right: 1.5rem;
  max-height: 445px; 
  overflow-y: auto;
  margin-top: -0.7rem;
`;

export const PlaceItem = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.isSelected ? '#000' : '#F2F2EF'};
  border-radius: 8px;
  padding: 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    margin-right: 0.4rem;
  }

  div {
    display: flex;
    flex-direction: column;
    background-color: ${props => props.isSelected ? '#000' : '#F2F2EF'};
    border-radius: 8px;
    padding: 0.3rem;
    flex: 1;

    h3, p {
      color: ${props => props.isSelected ? '#fff' : '#000'};
    }

    h3 {
      font-size: 1rem;
      margin: 0;
      margin-bottom: 0.3rem;
    }

    p {
      font-size: 0.8rem;
      margin: 0;
    }
  }
`;

export const FriendItem = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  padding: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    margin-left: 0.2rem;
    margin-right: 0.4rem;
  }

  div {
    display: flex;
    flex-direction: column;
    background-color: #fff; 
    border-radius: 8px;
    margin-left: 0.8rem;
    padding: 0.3rem;
    flex: 1;

    h3, p {
      color: #000; 
    }

    h3 {
      font-size: 1rem;
      margin: 0;
      margin-bottom: 0.3rem;
    }

    p {
      font-size: 0.8rem;
      margin: 0;
    }
  }
`;

export const WeatherInfoContainer = styled.div`
  position: absolute;
  bottom: 0.8rem;
  right: 3rem;
  display: flex;
  align-items: center;
`;

export const WeatherIcon = styled.img`
  width: 50px; 
  height: 50px;
`;

export const WeatherDetails = styled.div`
  display: flex;
  align-items: center;
  color: #333;
  
  span {
    font-size: 1.2rem;
    font-weight: 600;
    margin-right: 0.5rem;  
  }

  .temperature {
    font-size: 1.2rem;
    font-weight: bold;
    margin-right: 0.5rem;  
`;

export const Right = styled.div`
  flex: 1;
  padding: 0.3rem;
  display: flex;
  flex-direction: column;
  height: 77vh; 
`;

export const MapContainer = styled.div`
  flex: 1; 
  display: flex;
  flex-direction: column;
  height: 100%; 

  h2 {
    margin-bottom: 1rem;
  }

  iframe {
    border: 0;
    width: 100%;
    height: 100%; 
  }
`;

export const WhiteBox = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  width: 100%;
  height: 73vh;
  max-width: 90%;
  position: relative; /* 상대 위치를 추가 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export const ShareButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #fff;
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0rem; 

  span {
    font-weight: 800; 
  }

  img {
    margin-left: 0rem;
  }
`;

export const SaveButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #fff;
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  span {
    font-weight: 800; 
  }

  img {
    margin-left: 0rem;
  }
`;

export const SelectionButton = styled.button`
  background-color: white;
  color: gray;
  border: 1px solid white;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: bold;
`;

export const CancelButton = styled.button`
  background-color: white;
  color: gray;
  border: 1px solid white;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: bold;
`;

export const BottomSection = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.1rem;
  position: absolute;
  bottom: 0.7rem;
  left: 1.2rem;
`;

export const SearchList = styled.ul`
  list-style: none;
  padding: 0;
  max-height: 200px; 
  overflow-y: auto;
`;

export const SearchItem = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  padding: 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    margin-right: 0.4rem;
  }

  div {
    display: flex;
    flex-direction: column;
    background-color: #fff; 
    border-radius: 8px;
    padding: 0.3rem;
    flex: 1;

    h3, p {
      color: #000; 
    }

    h3 {
      font-size: 1rem;
      margin: 0;
      margin-bottom: 0.3rem;
    }

    p {
      font-size: 0.8rem;
      margin: 0;
    }
  }
`;