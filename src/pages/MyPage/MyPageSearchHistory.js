import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { refreshAccessToken } from "../../components/refreshAccess";
import { myPageStyles } from "../../styles/myPageStyles";

const MyPageSearchHistory = () => {
  const [data, setData] = useState([]);
  const [translatedAddresses, setTranslatedAddresses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}.`;
  };

  const translateAddress = async (address) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: address,
            key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            language: "ko",
          },
        }
      );
      const translatedAddress =
        response.data.results[0]?.formatted_address || address;
      return translatedAddress;
    } catch (error) {
      console.error("Error translating address:", error);
      return address;
    }
  };

  const shareOnKakao = async () => {
    if (!selectedPlaces.length) {
      alert("공유할 장소를 선택해주세요.");
      return;
    }

    try {
      const placeInfoPromises = selectedPlaces.map(async (place) => {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/reviews?placeId=${place.placeId}`
        );
        const googleReviewUrl = response.data.url;
        return `📍상호명: ${place.placeName}\n주소: ${
          translatedAddresses[place.placeId] || place.placeAddress
        }\n리뷰: ${googleReviewUrl}`;
      });

      const placeInfoArray = await Promise.all(placeInfoPromises);
      const placeInfo = placeInfoArray.join("\n\n");

      const message = `추천 장소\n\n${placeInfo}`;

      window.Kakao.Link.sendDefault({
        objectType: "text",
        text: message,
        link: {
          webUrl: window.location.href,
          mobileWebUrl: window.location.href,
        },
        buttonTitle: " ",
      });
    } catch (error) {
      console.error("Error fetching Google review URLs for sharing:", error);
    }
  };

  const handlePlaceClick = (place) => {
    setSelectedPlaces((prevSelectedPlaces) => {
      if (prevSelectedPlaces.includes(place)) {
        return prevSelectedPlaces.filter((selected) => selected !== place);
      } else {
        return [...prevSelectedPlaces, place];
      }
    });
  };

  const handleErrors = useCallback(
    (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError("해당 서비스를 이용하기 위해서는 로그인이 필요합니다.");
            navigate("/login");
            break;
          case 404:
            setError("사용자를 찾을 수 없습니다.");
            break;
          case 500:
            setError("검색 기록 조회 중 오류가 발생하였습니다.");
            break;
          default:
            setError("데이터를 가져오는 중 오류가 발생하였습니다.");
        }
      } else {
        setError("데이터를 가져오는 중 오류가 발생하였습니다.");
      }
    },
    [navigate]
  );

  const fetchData = async (accessToken) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/search-history-v2`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const formattedData = response.data.map((item) => ({
        ...item,
        searchTime: formatDate(item.searchTime),
      }));
      setData(formattedData);

      const translationPromises = {};
      for (const item of response.data) {
        for (const place of item.places) {
          if (!translatedAddresses[place.placeId]) {
            translationPromises[place.placeId] = translateAddress(
              place.placeAddress
            );
          }
        }
      }

      const translations = await Promise.all(
        Object.values(translationPromises)
      );
      const newTranslatedAddresses = Object.keys(translationPromises).reduce(
        (acc, placeId, index) => {
          acc[placeId] = translations[index];
          return acc;
        },
        {}
      );

      setTranslatedAddresses((prev) => ({
        ...prev,
        ...newTranslatedAddresses,
      }));
      setLoading(false);
    } catch (err) {
      if (
        err.response?.status === 401 &&
        err.response?.data?.error === "access_token_expired"
      ) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            throw new Error("No refresh token available.");
          }
          const newAccessToken = await refreshAccessToken(refreshToken);
          localStorage.setItem("accessToken", newAccessToken);
          fetchData(newAccessToken);
        } catch (refreshError) {
          console.error("Failed to refresh access token:", refreshError);
          setError("토큰 갱신 중 오류가 발생하였습니다. 다시 시도해 주세요.");
        }
      } else {
        handleErrors(err);
      }
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("로그인이 필요합니다.");
      navigate("/login");
    } else {
      fetchData(accessToken);
    }
  }, [navigate]);

  if (loading) {
    return <div></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      style={
        data.length === 0
          ? myPageStyles.historyContainerEmpty
          : myPageStyles.historyContainer
      }
    >
      {data.length === 0 ? (
        <div style={myPageStyles.historyNone}>검색한 기록이 없습니다.</div>
      ) : (
        data.map((rec, index) => (
          <div style={myPageStyles.dateSection} key={index}>
            <div style={myPageStyles.dateColumn}>{rec.searchTime}</div>
            <div style={myPageStyles.recommendationContainer}>
              <div style={myPageStyles.neighborhoodTitle}>
                {rec.neighborhood} 장소 추천
              </div>
              <div style={myPageStyles.recommendationList}>
                {rec.places.map((place, idx) => (
                  <div
                    key={idx}
                    style={{
                      ...myPageStyles.recommendationItemContainer,
                      ...(selectedPlaces.includes(place)
                        ? myPageStyles.selectedPlace
                        : {}),
                    }}
                    onClick={() => handlePlaceClick(place)}
                  >
                    <div
                      style={{
                        ...myPageStyles.recommendationItem,
                        ...(idx === rec.places.length - 1
                          ? myPageStyles.recommendationItemLastChild
                          : {}),
                      }}
                    >
                      <img
                        src={place.imageUrl}
                        alt="place"
                        style={myPageStyles.itemImage}
                      />
                      <div style={myPageStyles.itemContent}>
                        <div style={myPageStyles.itemTitle}>
                          {place.placeName}
                        </div>
                        <div
                          style={
                            selectedPlaces.includes(place)
                              ? { ...myPageStyles.itemAddress, color: "white" }
                              : myPageStyles.itemAddress
                          }
                        >
                          {translatedAddresses[place.placeId] ||
                            place.placeAddress}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={myPageStyles.shareColumn}>
              <div style={myPageStyles.shareText}>공유</div>
              <img
                src="../img/katokshare.png"
                style={myPageStyles.shareIcon}
                alt="kakaoshare"
                onClick={shareOnKakao}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyPageSearchHistory;
