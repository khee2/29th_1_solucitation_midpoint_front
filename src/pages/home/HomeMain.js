import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { commonStyles } from "../../styles/styles";
import { Logo } from "../../components/CommonComponents";
import HomePopup from "./HomePopup";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext";

const Home = () => {
  const {
    userInfo,
    setUserInfo,
    friends,
    setFriends,
    selectedPurpose,
    setSelectedPurpose,
    isLoggedIn,
  } = useContext(AppContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupTarget, setPopupTarget] = useState(null); // 팝업이 열린 대상
  const [friendCount, setFriendCount] = useState(friends.length + 1);
  const [searchResults, setSearchResults] = useState({ user: [], friends: {} });
  const [selectedFriend, setSelectedFriend] = useState(null); // 친구 선택 상태 추가
  const [initialAddress, setInitialAddress] = useState(userInfo.address || ""); // 초기 주소 상태 추가
  const [selectedRadius, setSelectedRadius] = useState("1000"); // 반경 추가
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.selectedPurpose) {
      setSelectedPurpose(location.state.selectedPurpose);
    }
    if (location.state && location.state.initialAddress) {
      setInitialAddress(location.state.initialAddress);
      setUserInfo({ ...userInfo, address: location.state.initialAddress });
    }
    if (location.state && location.state.selectedRadius) {
      setSelectedRadius(location.state.selectedRadius); // 반경 설정
    }
  }, [location.state]);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found, setting default profile");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/member/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        const userAddress = response.data.address || "";
        setUserInfo({
          ...userInfo,
          nickname: response.data.nickname || "나",
          profileImage:
            response.data.profileImageUrl || "/img/default-profile.png",
          address: userAddress,
        });
        setInitialAddress(userAddress); // 프로필에서 주소를 가져와 초기 주소 설정
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile();
    } else {
      setUserInfo({
        ...userInfo,
        nickname: "나",
        profileImage: "/img/default-profile.png",
        address: "",
      });
      setInitialAddress(""); // 로그아웃 상태일 때 초기 주소를 빈칸으로 설정
    }
  }, [isLoggedIn]); // 로그인 상태가 변경될 때만 실행

  const handleAddInput = () => {
    setFriendCount(friendCount + 1);
    setFriends([
      ...friends,
      {
        profile: "/img/default-profile.png",
        name: `친구 ${friendCount}`,
        address: "",
      },
    ]);
  };

  const handleDeleteFriend = (index) => {
    // 친구 목록에서 해당 인덱스의 친구를 제거
    const updatedFriends = friends.filter((_, i) => i !== index);
    setFriends(updatedFriends);
  };

  const handlePopupOpen = (target) => {
    setPopupTarget(target);
    setIsPopupOpen(true);
  };

  const handlePopupClose = (address, results, name = "") => {
    if (address) {
      if (popupTarget === "user") {
        setUserInfo({ ...userInfo, address });
        setSearchResults({ ...searchResults, user: results });
      } else {
        const updatedFriends = friends.map((friend, index) => {
          if (index === popupTarget) {
            return { ...friend, address, name: name || friend.name };
          }
          return friend;
        });
        setFriends(updatedFriends);
        setSearchResults({
          ...searchResults,
          friends: { ...searchResults.friends, [popupTarget]: results },
        });
      }
    }
    setIsPopupOpen(false);
  };

  const handlePurposeChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedPurpose(selectedValue);
    if (selectedValue === "/test1") {
      navigate("/test1", {
        state: { initialAddress: userInfo.address, selectedRadius },
      }); // 홈으로 돌아올 때 주소 및 반경 전달
    }
  };

  const geocodeAddress = async (address) => {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
    );
    const { lat, lng } = response.data.results[0].geometry.location;
    return { latitude: lat, longitude: lng };
  };

  const handleFindPlace = async () => {
    // 주소와 목적이 모두 입력되었는지 확인
    if (!userInfo.address || friends.some((friend) => !friend.address)) {
      alert("주소를 입력해 주세요.");
      return;
    }
    if (!selectedPurpose) {
      alert("목적을 선택해주세요.");
      return;
    }

    try {
      const addressInputs = [userInfo, ...friends];
      const geocodedInputs = await Promise.all(
        addressInputs.map(async (input) => {
          if (input.address) {
            const { latitude, longitude } = await geocodeAddress(input.address);
            return { ...input, latitude, longitude };
          } else {
            return input;
          }
        })
      );
      const latitudes = geocodedInputs
        .map((input) => input.latitude)
        .filter(Boolean);
      const longitudes = geocodedInputs
        .map((input) => input.longitude)
        .filter(Boolean);

      const logicResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/logic`,
        {
          latitudes,
          longitudes,
        }
      );

      const isSuccess =
        logicResponse.data.success ||
        (logicResponse.data.latitude && logicResponse.data.longitude);

      if (isSuccess) {
        const latitude = logicResponse.data.latitude.toFixed(6);
        const longitude = logicResponse.data.longitude.toFixed(6);
        const category = selectedPurpose || "restaurant";
        const radius = selectedRadius; // 선택한 반경 사용

        const placesResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/places`,
          {
            params: {
              latitude,
              longitude,
              category,
              radius,
            },
          }
        );

        if (placesResponse.data.length > 0) {
          const places = placesResponse.data.map((place) => ({
            name: place.name,
            address: place.address,
            latitude: place.latitude,
            longitude: place.longitude,
            types: JSON.parse(place.types),
            placeID: place.placeID,
            image: place.photo
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photo}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
              : "/img/default-image.png",
          }));

          navigate("/midpoint", {
            state: {
              places,
              district: logicResponse.data.midpointDistrict,
              midpoint: logicResponse.data,
              isLoggedIn,
              initialAddress: userInfo.address,
            },
          });
        } else {
          navigate("/again", {
            state: {
              midpoint: { latitude, longitude },
              selectedPurpose,
              selectedRadius: radius,
              initialAddress: userInfo.address,
            },
          });
        }
      } else {
        navigate("/again", {
          state: {
            midpoint: { latitude: 0, longitude: 0 },
            selectedPurpose,
            selectedRadius: 1000,
            initialAddress: userInfo.address,
          },
        });
      }
    } catch (error) {
      console.error("Error finding place:", error);
      navigate("/again", {
        state: {
          midpoint: { latitude: 0, longitude: 0 },
          selectedPurpose,
          selectedRadius: 1000,
          initialAddress: userInfo.address,
        },
      });
    }
  };

  const purposes = [
    { label: "목적 추천 TEST", value: "/test1" },
    { label: "맛집", value: "restaurant" },
    { label: "카페", value: "cafe" },
    { label: "산책", value: "walk" },
    { label: "등산", value: "hiking" },
    { label: "공부", value: "study" },
    { label: "문화생활", value: "culture" },
    { label: "핫플", value: "hot-place" },
    { label: "친목", value: "social" },
  ];

  return (
    <div style={commonStyles.container}>
      <Logo />
      <div style={commonStyles.content}>
        <div style={commonStyles.inputContainer}>
          <div style={commonStyles.profileContainer}>
            <img
              src={userInfo.profileImage || "/img/default-profile.png"}
              alt="프로필 이미지"
              style={commonStyles.profileImg}
            />
            <span style={commonStyles.profileName}>
              {isLoggedIn ? userInfo.nickname : "나"}
            </span>
          </div>
          <div style={commonStyles.inputGroup}>
            <input
              type="text"
              placeholder="주소를 입력하세요"
              style={commonStyles.inputField}
              value={userInfo.address || initialAddress || ""}
              onClick={() => handlePopupOpen("user")}
              readOnly
            />
            <button
              type="button"
              style={commonStyles.submitButton}
              onClick={() => {
                if (userInfo.address) {
                  setUserInfo({ ...userInfo, address: "" });
                  setInitialAddress(""); // 초기 주소도 비우기
                } else {
                  handlePopupOpen("user");
                }
              }}
            >
              {userInfo.address ? "삭제" : "검색"}
            </button>
          </div>
        </div>
        {friends.map((friend, index) => (
          <div key={index} style={commonStyles.inputContainer}>
            <div style={commonStyles.profileContainer}>
              <img
                src={friend.profile}
                alt="프로필 이미지"
                style={commonStyles.profileImg}
              />
              <span style={commonStyles.profileName}>{friend.name}</span>
            </div>
            <div style={commonStyles.inputGroup}>
              <input
                type="text"
                placeholder="주소를 입력하세요"
                style={commonStyles.inputField}
                value={friend.address || ""}
                onClick={() => handlePopupOpen(index)}
                readOnly
              />
              <button
                type="button"
                style={commonStyles.submitButton}
                onClick={() => handleDeleteFriend(index)}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
        <div style={commonStyles.addButton} onClick={handleAddInput}></div>
        <div style={commonStyles.destination}>
          <select
            value={selectedPurpose}
            onChange={handlePurposeChange}
            style={commonStyles.selectField}
          >
            <option value="" disabled hidden>
              목적을 선택하세요
            </option>
            {purposes.map((purpose, index) => (
              <option key={index} value={purpose.value}>
                {purpose.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            type="button"
            style={commonStyles.placeButton}
            onClick={handleFindPlace}
          >
            장소 찾기
          </button>
        </div>
      </div>
      {isPopupOpen && (
        <HomePopup
          onClose={handlePopupClose}
          setAddress={(address, name = "") => {
            if (popupTarget === "user") {
              setUserInfo({ ...userInfo, address });
              setInitialAddress(address); // 주소 변경 시 초기 주소도 업데이트
            } else {
              const updatedFriends = friends.map((friend, index) => {
                if (index === popupTarget) {
                  return {
                    ...friend,
                    address,
                    name: name || `친구 ${index + 1}`,
                  };
                }
                return friend;
              });
              setFriends(updatedFriends);
            }
            setIsPopupOpen(false);
          }}
          searchResults={
            popupTarget === "user"
              ? searchResults.user
              : searchResults.friends[popupTarget] || []
          }
          setSearchResults={(results) =>
            setSearchResults((prev) => ({
              ...prev,
              [popupTarget === "user" ? "user" : "friends"]: {
                ...prev.friends,
                [popupTarget]: results,
              },
            }))
          }
          isLoggedIn={isLoggedIn} // 로그인 상태 전달
          setSelectedFriend={setSelectedFriend} // 친구 선택을 위한 함수 전달
        />
      )}
    </div>
  );
};

export default Home;
