import React, { useEffect, useRef, useState, useContext } from "react";
import {
  commonStyles,
  SearchList,
  SearchItem,
  FriendItem,
} from "../../styles/styles";
import axios from "axios";
import debounce from "lodash.debounce";
import { AppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";

const HomePopup = ({
  onClose,
  setAddress,
  searchResults = [],
  setSearchResults,
  setSelectedFriend,
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [showPlacesList, setShowPlacesList] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [favoriteFriends, setFavoriteFriends] = useState([]);
  const [favoritePlaces, setFavoritePlaces] = useState({
    home: null,
    work: null,
  });
  const { isLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      fetchFavoriteFriends();
      fetchFavoritePlaces();
    }
  }, [isLoggedIn]);

  const fetchFavoriteFriends = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/favs/friends/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFavoriteFriends(response.data);
    } catch (error) {
      console.error("Error fetching favorite friends:", error);
    }
  };

  const fetchFavoritePlaces = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/favs/places/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const places = response.data;
      const homePlace = places.find((place) => place.addrType === "HOME");
      const workPlace = places.find((place) => place.addrType === "WORK");
      setFavoritePlaces({ home: homePlace, work: workPlace });
    } catch (error) {
      console.error("Error fetching favorite places:", error);
    }
  };

  const loadGoogleMaps = () => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places&language=ko`;
      script.async = true;
      script.onload = () => {
        if (mapRef.current && showMap) {
          const mapOptions = {
            center: new window.google.maps.LatLng(37.5665, 126.978),
            zoom: 10,
          };
          const googleMap = new window.google.maps.Map(
            mapRef.current,
            mapOptions
          );
          setMap(googleMap);
        }
      };
      document.head.appendChild(script);
    } else if (mapRef.current && showMap) {
      const mapOptions = {
        center: new window.google.maps.LatLng(37.5665, 126.978),
        zoom: 10,
      };
      const googleMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(googleMap);
    }
  };

  useEffect(() => {
    loadGoogleMaps();
  }, [showMap]);

  const fetchSuggestions = async (value) => {
    if (value.trim() !== "") {
      const proxyUrl = "https://api.allorigins.win/get?url=";
      const location = "37.5665,126.9780"; // 서울 중심부의 위도와 경도
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

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 0);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedFetchSuggestions(value);
  };

  const handleSearchInputFocus = () => {
    setShowPlacesList(true);
    setShowMap(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setSearchInput(suggestion.description);
    setSuggestions([]);
    setShowPlacesList(false);
  };

  const handleSearch = async () => {
    if (!selectedSuggestion && !searchInput) {
      console.error("Selected suggestion or search input not found.");
      return;
    }

    if (selectedSuggestion) {
      const proxyUrl = "https://api.allorigins.win/get?url=";
      const targetUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${selectedSuggestion.place_id}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&language=ko`;
      try {
        const response = await axios.get(
          proxyUrl + encodeURIComponent(targetUrl)
        );
        const data = JSON.parse(response.data.contents);

        const place = {
          name: data.result.name,
          address: data.result.formatted_address,
          imgSrc: data.result.photos
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${data.result.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
            : "/img/default-image.png",
        };

        const updatedResults = [place, ...searchResults];
        setSearchResults(updatedResults);
        setSearchInput("");
        setSelectedSuggestion(null);
        setShowMap(false);
        setShowPlacesList(false);
        onClose(place.address, updatedResults);
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    } else {
      onClose(searchInput, searchResults);
    }
  };

  const handleUseCurrentLocation = () => {
    setShowMap(true);
    setShowPlacesList(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const currentLocation = { lat: latitude, lng: longitude };

          if (map) {
            map.setCenter(currentLocation);
            new window.google.maps.Marker({
              position: currentLocation,
              map: map,
              title: "현재 위치",
            });
          } else {
            const mapOptions = {
              center: currentLocation,
              zoom: 15,
            };
            const googleMap = new window.google.maps.Map(
              mapRef.current,
              mapOptions
            );
            new window.google.maps.Marker({
              position: currentLocation,
              map: googleMap,
              title: "현재 위치",
            });
            setMap(googleMap);
          }

          try {
            const proxyUrl = "https://api.allorigins.win/get?url=";
            const targetUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&language=ko`;
            const response = await axios.get(
              proxyUrl + encodeURIComponent(targetUrl)
            );
            const data = JSON.parse(response.data.contents);

            if (data.results && data.results.length > 0) {
              const currentAddress = data.results[0].formatted_address;
              setSearchInput(currentAddress);
              setSelectedSuggestion({
                description: currentAddress,
                place_id: data.results[0].place_id,
              });
            } else {
              alert("현재 위치의 주소를 찾을 수 없습니다.");
            }
          } catch (error) {
            console.error("Error fetching current location address:", error);
          }
        },
        (error) => {
          console.error("Error getting current position:", error);
          alert("현재 위치를 사용할 수 없습니다.");
        }
      );
    } else {
      alert("현재 위치를 사용할 수 없습니다.");
    }
  };

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
    setAddress(friend.address, friend.name);
    onClose(friend.address, searchResults, friend.name);
  };

  const handleFavoritePlaceClick = (place) => {
    if (place.addr) {
      setSearchInput(place.addr);
    } else {
      alert("즐겨찾는 장소를 등록해주세요.");
      navigate("/MyPage");
    }
  };

  const handleSearchItemClick = (place) => {
    setSearchInput(place.address);
    setShowPlacesList(false);
  };

  return (
    <div style={commonStyles.popupContainer}>
      <div style={commonStyles.popupBox}>
        <div style={commonStyles.popupHeader}>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            style={commonStyles.popupInput}
            value={searchInput}
            onFocus={handleSearchInputFocus}
            onChange={handleSearchInputChange}
          />
          <button onClick={handleSearch} style={commonStyles.popupButton}>
            검색
          </button>
          <button
            onClick={() => onClose()}
            style={commonStyles.popupCloseButton}
          >
            X
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul style={commonStyles.suggestionsList}>
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.place_id}
                style={commonStyles.suggestionItem}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.description}
              </li>
            ))}
          </ul>
        )}
        <div style={commonStyles.popupContent}>
          <div
            style={commonStyles.locationContainer}
            onClick={handleUseCurrentLocation}
          >
            <img
              src="/img/location.png"
              alt="현재 위치 사용"
              style={commonStyles.locationIcon}
            />
            <span
              style={{
                fontSize: "1rem",
                fontFamily: "Freesentation, sans-serif",
                fontWeight: "600",
              }}
            >
              현재 위치 사용
            </span>
          </div>
          {isLoggedIn && (
            <div style={commonStyles.popupSections}>
              <div style={commonStyles.popupSection1}>
                <p style={commonStyles.popupSectionTitle}>즐겨찾는 장소</p>
                <div style={commonStyles.favoritePlaces}>
                  <button
                    style={commonStyles.favoritePlace}
                    onClick={() =>
                      handleFavoritePlaceClick(favoritePlaces.home)
                    }
                  >
                    <img
                      src="/img/home.png"
                      alt="집"
                      style={commonStyles.favoritePlaceImage}
                    />
                    <p
                      style={{
                        fontSize: "1rem",
                        fontFamily: "Freesentation, sans-serif",
                        fontWeight: "500",
                      }}
                    >
                      집
                    </p>
                  </button>
                  <button
                    style={commonStyles.favoritePlace}
                    onClick={() =>
                      handleFavoritePlaceClick(favoritePlaces.work)
                    }
                  >
                    <img
                      src="/img/work.png"
                      alt="직장/학교"
                      style={commonStyles.favoritePlaceImage}
                    />
                    <p
                      style={{
                        fontSize: "1rem",
                        fontFamily: "Freesentation, sans-serif",
                        fontWeight: "500",
                      }}
                    >
                      직장/학교
                    </p>
                  </button>
                </div>
              </div>
              <div
                style={{
                  ...commonStyles.popupSection2,
                  height: "140px", // 높이를 고정
                  width: "280px", // 필요한 너비로 설정
                  border: "none", // 경계선 추가
                  display: "block", // block으로 설정
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  overflowX: "auto", // X축 스크롤 추가
                  overflowY: "hidden", // Y축 스크롤 숨기기
                  whiteSpace: "nowrap", // 한 줄로 표시
                }}
              >
                <p style={commonStyles.popupSectionTitle}>즐겨찾는 친구</p>
                <div style={commonStyles.favoriteFriends}>
                  {favoriteFriends.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      {" "}
                    </div>
                  ) : (
                    favoriteFriends.map((friend) => (
                      <button
                        key={friend.favFriendId}
                        style={commonStyles.favoriteFriend}
                        onClick={() => handleFriendClick(friend)}
                      >
                        <img
                          src="/img/pprofile.png"
                          alt={friend.name}
                          style={commonStyles.favoriteFriendImage}
                        />
                        <p
                          style={{
                            fontSize: "1rem",
                            fontFamily: "Freesentation, sans-serif",
                            fontWeight: "500",
                          }}
                        >
                          {friend.name}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          {showPlacesList && (
            <div style={commonStyles.placesListContainer}>
              <p style={commonStyles.currentLocationText}>검색 목록</p>
              <SearchList>
                {(Array.isArray(searchResults) ? searchResults : []).map(
                  (place, index) => (
                    <SearchItem
                      key={index}
                      onClick={() => handleSearchItemClick(place)}
                    >
                      <img
                        src={place.imgSrc || "/img/default-image.png"}
                        alt={place.name}
                      />
                      <div>
                        <h3>{place.name}</h3>
                        <p>{place.address}</p>
                      </div>
                    </SearchItem>
                  )
                )}
              </SearchList>
            </div>
          )}
          {showMap && (
            <div style={{ width: "100%", marginTop: "1rem" }}>
              <div style={commonStyles.currentLocationText}>현재 위치</div>
              <div
                ref={mapRef}
                style={{ width: "100%", height: "245px", marginTop: "0.5rem" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePopup;
