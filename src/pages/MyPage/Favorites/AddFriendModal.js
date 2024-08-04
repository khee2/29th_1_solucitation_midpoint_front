import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import axios from "axios";
import { myPageStyles } from "../../../styles/myPageStyles";

Modal.setAppElement("#root");

const GEOCODING_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const AddFriendModal = ({
  isOpen,
  closeModal,
  addFriend,
  editFriend,
  deleteFriend,
  selectedFriend,
  loading,
}) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [originalFriend, setOriginalFriend] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isAddressSelected, setIsAddressSelected] = useState(false); // 주소가 선택되었는지 추적하는 상태 변수

  useEffect(() => {
    if (selectedFriend) {
      setName(selectedFriend.name);
      setAddress(selectedFriend.address || "");
      setSearchInput(selectedFriend.address || "");
      setLatitude(selectedFriend.latitude || "");
      setLongitude(selectedFriend.longitude || "");
      setOriginalFriend(selectedFriend);
      setIsEditing(false);
      setIsAddressSelected(true); // 기존 주소가 있으므로 주소가 선택된 상태로 설정
    } else {
      clearInputs();
      setIsEditing(true);
    }
  }, [selectedFriend]);

  useEffect(() => {
    if (!isOpen) {
      clearInputs();
    }
  }, [isOpen]);

  const fetchCoordinates = useCallback(async (address) => {
    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address,
            key: GEOCODING_API_KEY,
            language: "ko",
          },
        }
      );

      if (response.data.status === "OK") {
        const location = response.data.results[0].geometry.location;
        setLatitude(location.lat);
        setLongitude(location.lng);
      } else {
        throw new Error("주소 검색 오류");
      }
    } catch (error) {
      setLatitude("");
      setLongitude("");
      setErrorMessage("주소 검색 오류: 주소를 다시 확인해주세요.");
      console.error("주소 검색 오류:", error.message);
    }
  }, []);

  const clearInputs = useCallback(() => {
    setName("");
    setAddress("");
    setSearchInput("");
    setLatitude("");
    setLongitude("");
    setErrorMessage("");
    setSuggestions([]);
    setIsAddressSelected(false); // 초기화 시 주소 선택 상태도 초기화
  }, []);

  const handleAddFriend = async () => {
    if (!name) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!searchInput || !isAddressSelected) { // 주소가 선택되지 않았을 때 추가를 막음
      alert("정확한 주소를 입력해주세요.");
      return;
    }

    if (name.length < 1 || name.length > 100) {
      alert("이름은 최소 1글자 이상 최대 100글자 이하로 입력해야 합니다.");
      return;
    }

    if (searchInput.length < 1 || searchInput.length > 255) {
      alert("주소는 최소 1글자 이상 최대 255글자 이하로 입력해야 합니다.");
      return;
    }

    const newFriend = {
      address: searchInput,
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    const accessToken = localStorage.getItem("accessToken");
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/favs/friends/save`,
        newFriend,
        { headers }
      );

      if (response.data.success) {
        addFriend({ ...newFriend, favFriendId: response.data.favFriendId });
        clearInputs();
        closeModal();
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("친구 저장 오류:", error.message);
      setErrorMessage(getErrorMessage(error));
    }
  };

  const handleEditFriend = async () => {
    if (!name) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!searchInput || !isAddressSelected) { // 주소가 선택되지 않았을 때 수정을 막음
      alert("정확한 주소를 입력해주세요.");
      return;
    }

    if (name.length < 1 || name.length > 100) {
      alert("이름은 최소 1글자 이상 최대 100글자 이하로 입력해야 합니다.");
      return;
    }

    if (searchInput.length < 1 || searchInput.length > 255) {
      alert("주소는 최소 1글자 이상 최대 255글자 이하로 입력해야 합니다.");
      return;
    }

    const updatedFriend = {
      favFriendId: selectedFriend.favFriendId,
      name,
      address: searchInput,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    const accessToken = localStorage.getItem("accessToken");
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};
    console.log(updatedFriend);
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/favs/friends/update`,
        updatedFriend,
        { headers }
      );

      if (response.data.success) {
        editFriend({ ...updatedFriend });
        clearInputs();
        closeModal();
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("친구 수정 오류:", error.message);
      setErrorMessage(getErrorMessage(error));
    }
  };

  const handleDeleteFriend = async () => {
    if (window.confirm("삭제하시겠습니까?")) {
      const accessToken = localStorage.getItem("accessToken");
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      if (!selectedFriend || !selectedFriend.favFriendId) {
        setErrorMessage("친구 정보를 찾을 수 없습니다.");
        return;
      }

      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/favs/friends/delete?favFriendId=${selectedFriend.favFriendId}`,
          { headers }
        );

        if (response.data.success) {
          deleteFriend(selectedFriend);
          clearInputs();
          closeModal();
          setIsEditing(false);
        } else {
          setErrorMessage(response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          alert("존재하지 않는 친구입니다.");
        } else {
          console.error("친구 삭제 오류:", error.message);
          setErrorMessage(getErrorMessage(error));
        }
      }
    }
  };

  const getErrorMessage = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        return "인증 오류: 유효한 토큰이 필요합니다.";
      } else if (error.response.status === 400) {
        return error.response.data.message || "잘못된 요청입니다.";
      }
    }
    return "친구 처리 중 오류가 발생했습니다.";
  };

  const enableEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (originalFriend) {
      setName(originalFriend.name);
      setAddress(originalFriend.address || "");
      setLatitude(originalFriend.latitude || "");
      setLongitude(originalFriend.longitude || "");
      setSearchInput(originalFriend.address || "");
    }
    setIsEditing(false);
  };

  const fetchSuggestions = useCallback(async (value) => {
    if (value.trim() !== "") {
      const proxyUrl = "https://api.allorigins.win/get?url=";
      const location = "37.5665,126.9780"; // 서울 위도, 경도
      const radius = 20000; // 반경 20km
      const targetUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&components=country:kr&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&language=ko&location=${location}&radius=${radius}`;

      try {
        const response = await axios.get(
          proxyUrl + encodeURIComponent(targetUrl)
        );
        const data = JSON.parse(response.data.contents);
        const filteredSuggestions = data.predictions.filter((prediction) =>
          prediction.description.includes("서울")
        );
        setSuggestions(filteredSuggestions.slice(0, 4));
      } catch (error) {
        console.error("Error fetching suggestions:", error.message);
      }
    } else {
      setSuggestions([]);
    }
  }, []);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setAddress(value);
    setIsAddressSelected(false); // 주소 입력이 변경되면 선택되지 않은 상태로 설정
    fetchSuggestions(value);
  };

  const handleSuggestionClick = async (suggestion) => {
    const address = suggestion.description;
    setAddress(address);
    setSearchInput(address);
    setSuggestions([]);
    setIsAddressSelected(true); // 주소 선택 상태로 설정
    await fetchCoordinates(address);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        clearInputs();
        closeModal();
      }}
      style={{ overlay: myPageStyles.overlay, content: myPageStyles.modal }}
      contentLabel="친구 추가/편집"
    >
      <img
        src="/img/default-profile.png"
        style={myPageStyles.addImg}
        alt="addProfile"
      />
      <input
        type="text"
        value={name}
        style={{ ...myPageStyles.inputName }}
        onChange={(e) => setName(e.target.value)}
        placeholder="친구 이름"
        disabled={!isEditing || loading}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          placeholder="주소 입력"
          style={{ ...myPageStyles.inputLocate, backgroundColor: "white" }}
          value={searchInput}
          onChange={handleSearchInputChange}
          disabled={!isEditing || loading}
        />
      </div>
      {suggestions.length > 0 && (
        <ul style={myPageStyles.suggestionsList}>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              style={myPageStyles.suggestionItem}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
      <div>
        {selectedFriend ? (
          isEditing ? (
            <>
              <button
                onClick={handleEditFriend}
                style={myPageStyles.favoriteButtonEdit}
                disabled={loading}
              >
                저장
              </button>
              <button
                onClick={handleCancelEdit}
                style={myPageStyles.favoriteButtonQuit}
                disabled={loading}
              >
                취소
              </button>
            </>
          ) : (
            <>
              <button
                onClick={enableEditing}
                style={myPageStyles.favoriteButtonEdit}
                disabled={loading}
              >
                편집
              </button>
              <button
                onClick={handleDeleteFriend}
                style={myPageStyles.favoriteButtonQuit}
                disabled={loading}
              >
                삭제
              </button>
            </>
          )
        ) : (
          <button
            onClick={handleAddFriend}
            style={myPageStyles.addFriendModalButton}
            disabled={loading}
          >
            추가
          </button>
        )}
        <button
          onClick={() => {
            clearInputs();
            closeModal();
          }}
          style={myPageStyles.closeButton}
          disabled={loading}
        >
          X
        </button>
      </div>
    </Modal>
  );
};

export default AddFriendModal;
