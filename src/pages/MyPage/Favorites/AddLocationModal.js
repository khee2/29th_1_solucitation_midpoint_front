import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { myPageStyles } from "../../../styles/myPageStyles";
import { refreshAccessToken } from "../../../components/refreshAccess";

Modal.setAppElement("#root");

const GEOCODING_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const AddLocationModal = ({
  isOpen,
  closeModal,
  addLocation,
  editLocation,
  deleteLocation,
  selectedLocation,
  loading,
}) => {
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [originalLocation, setOriginalLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [dataExists, setDataExists] = useState(false);
  const [addrType, setAddrType] = useState("");

  useEffect(() => {
    if (selectedLocation) {
      setAddrType(selectedLocation.type);
      fetchLocationDetails(selectedLocation.type);
    } else {
      clearInputs();
      setIsEditing(true);
      setDataExists(false);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (!isOpen) {
      clearInputs();
    }
  }, [isOpen]);

  const fetchLocationDetails = async (addrType) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/favs/places/details`,
        {
          params: { addrType },
          headers,
        }
      );

      if (response.data) {
        setAddress(response.data.addr || "");
        setSearchInput(response.data.addr || "");
        setLatitude(response.data.latitude || "");
        setLongitude(response.data.longitude || "");
        setOriginalLocation(response.data);
        setIsEditing(false);
        setDataExists(true);
      } else {
        setIsEditing(true);
        setDataExists(false);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.error === "access_token_expired"
      ) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            throw new Error("No refresh token available.");
          }
          const newAccessToken = await refreshAccessToken(refreshToken);
          const headers = { Authorization: `Bearer ${newAccessToken}` };
          const retryResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/favs/places/details`,
            {
              params: { addrType },
              headers,
            }
          );

          if (retryResponse.data) {
            setAddress(retryResponse.data.addr || "");
            setSearchInput(retryResponse.data.addr || "");
            setLatitude(retryResponse.data.latitude || "");
            setLongitude(retryResponse.data.longitude || "");
            setOriginalLocation(retryResponse.data);
            setIsEditing(false);
            setDataExists(true);
          } else {
            setIsEditing(true);
            setDataExists(false);
          }
        } catch (refreshError) {
          console.error("Failed to refresh access token:", refreshError);
          alert("토큰 갱신에 실패했습니다. 다시 로그인해 주세요.");
        }
      } else {
        setIsEditing(true);
        setDataExists(false);
      }
    }
  };

  const fetchCoordinates = async (address) => {
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
  };

  const clearInputs = () => {
    setAddress("");
    setSearchInput("");
    setLatitude("");
    setLongitude("");
    setErrorMessage("");
  };

  const handleAddLocation = async () => {
    if (!searchInput) {
      alert("주소를 입력해주세요.");
      return;
    }

    const newLocation = {
      addrType,
      addr: searchInput,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    const accessToken = localStorage.getItem("accessToken");
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/favs/places/save`,
        newLocation,
        { headers }
      );

      if (response.data.success) {
        addLocation({ ...newLocation, favPlaceId: response.data.favPlaceId });
        clearInputs();
        closeModal();
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.error === "access_token_expired"
      ) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const newAccessToken = await refreshAccessToken(refreshToken);
          const headers = { Authorization: `Bearer ${newAccessToken}` };
          const retryResponse = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/favs/places/save`,
            newLocation,
            { headers }
          );

          if (retryResponse.data.success) {
            addLocation({
              ...newLocation,
              favPlaceId: retryResponse.data.favPlaceId,
            });
            clearInputs();
            closeModal();
          } else {
            setErrorMessage(retryResponse.data.message);
          }
        } catch (refreshError) {
          console.error("Failed to refresh access token:", refreshError);
          alert("토큰 갱신에 실패했습니다. 다시 로그인해 주세요.");
        }
      } else {
        console.error("장소 저장 오류:", error.message);
        setErrorMessage(getErrorMessage(error));
      }
    }
  };

  const handleEditLocation = async () => {
    if (!searchInput) {
      alert("주소를 입력해주세요.");
      return;
    }

    const updatedLocation = {
      addrType,
      addr: searchInput,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    const accessToken = localStorage.getItem("accessToken");
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/favs/places/update`,
        updatedLocation,
        { headers }
      );

      if (response.data.success) {
        editLocation(updatedLocation);
        clearInputs();
        closeModal();
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.error === "access_token_expired"
      ) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const newAccessToken = await refreshAccessToken(refreshToken);
          const headers = { Authorization: `Bearer ${newAccessToken}` };
          const retryResponse = await axios.patch(
            `${process.env.REACT_APP_API_URL}/api/favs/places/update`,
            updatedLocation,
            { headers }
          );

          if (retryResponse.data.success) {
            editLocation(updatedLocation);
            clearInputs();
            closeModal();
          } else {
            setErrorMessage(retryResponse.data.message);
          }
        } catch (refreshError) {
          console.error("Failed to refresh access token:", refreshError);
          alert("토큰 갱신에 실패했습니다. 다시 로그인해 주세요.");
        }
      } else {
        console.error("장소 수정 오류:", error.message);
        setErrorMessage(getErrorMessage(error));
      }
    }
  };

  const handleDeleteLocation = async () => {
    if (window.confirm("삭제하시겠습니까?")) {
      const accessToken = localStorage.getItem("accessToken");
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/favs/places/delete`,
          {
            params: { addrType },
            headers,
          }
        );

        if (response.data.success) {
          deleteLocation(selectedLocation);
          clearInputs();
          closeModal();
        } else {
          setErrorMessage(response.data.message);
        }
      } catch (error) {
        if (
          error.response &&
          error.response.status === 401 &&
          error.response.data.error === "access_token_expired"
        ) {
          try {
            const refreshToken = localStorage.getItem("refreshToken");
            const newAccessToken = await refreshAccessToken(refreshToken);
            const headers = { Authorization: `Bearer ${newAccessToken}` };
            const retryResponse = await axios.delete(
              `${process.env.REACT_APP_API_URL}/api/favs/places/delete`,
              {
                params: { addrType },
                headers,
              }
            );

            if (retryResponse.data.success) {
              deleteLocation(selectedLocation);
              clearInputs();
              closeModal();
            } else {
              setErrorMessage(retryResponse.data.message);
            }
          } catch (refreshError) {
            console.error("Failed to refresh access token:", refreshError);
            alert("토큰 갱신에 실패했습니다. 다시 로그인해 주세요.");
          }
        } else if (error.response && error.response.status === 404) {
          setErrorMessage("존재하지 않는 장소입니다.");
        } else {
          console.error("장소 삭제 오류:", error.message);
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
    return "장소 처리 중 오류가 발생했습니다.";
  };

  const enableEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (originalLocation) {
      setAddress(originalLocation.addr || "");
      setLatitude(originalLocation.latitude || "");
      setLongitude(originalLocation.longitude || "");
      setSearchInput(originalLocation.addr || "");
    }
    setIsEditing(false);
  };

  const fetchSuggestions = async (value) => {
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
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setAddress(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = async (suggestion) => {
    const address = suggestion.description;
    setAddress(address);
    setSearchInput(address);
    setSuggestions([]);
    await fetchCoordinates(address);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={{ overlay: myPageStyles.overlay, content: myPageStyles.modal }}
      contentLabel="장소 추가/편집"
    >
      <div style={{ textAlign: "center" }}>
        {selectedLocation && (
          <img
            src={`/img/${selectedLocation.icon}.png`}
            width="35"
            height="35"
            alt={selectedLocation.name}
            style={{ display: "block", margin: "0 auto" }}
          />
        )}
        <h3>{selectedLocation ? selectedLocation.name : "장소 추가"}</h3>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          placeholder="주소 입력"
          style={{ ...myPageStyles.inputLocate, backgroundColor: "white" }}
          value={searchInput}
          onChange={handleSearchInputChange}
          disabled={!isEditing && dataExists}
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
        {dataExists ? (
          isEditing ? (
            <>
              <button
                onClick={handleEditLocation}
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
                onClick={handleDeleteLocation}
                style={myPageStyles.favoriteButtonQuit}
                disabled={loading}
              >
                삭제
              </button>
            </>
          )
        ) : (
          <button
            onClick={handleAddLocation}
            style={myPageStyles.addFriendModalButton}
            disabled={loading}
          >
            추가
          </button>
        )}
        <button
          onClick={closeModal}
          style={myPageStyles.closeButton}
          disabled={loading}
        >
          X
        </button>
      </div>
    </Modal>
  );
};

export default AddLocationModal;
