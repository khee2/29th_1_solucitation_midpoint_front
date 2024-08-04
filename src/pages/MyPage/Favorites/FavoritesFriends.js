import React, { useEffect, useState } from "react";
import axios from "axios";
import { myPageStyles } from "../../../styles/myPageStyles.js";
import AddFriendModal from "./AddFriendModal.js";
import { refreshAccessToken } from "../../../components/refreshAccess";

const FavoritesFriends = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  const openAddFriendModal = () => {
    setSelectedFriend(null);
    setIsAddFriendModalOpen(true);
  };

  const closeAddFriendModal = () => {
    setIsAddFriendModalOpen(false);
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/favs/friends/list`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.data) {
          setFriends(response.data);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);

  const handleAddFriend = (newFriend) => {
    setFriends((prevFriends) => [...prevFriends, newFriend]);
    setSelectedFriend(newFriend);
  };

  const handleEditFriend = (editedFriend) => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.favFriendId === editedFriend.favFriendId ? editedFriend : friend
      )
    );
    setSelectedFriend(editedFriend);
  };

  const handleDeleteFriend = (friendToDelete) => {
    setFriends((prevFriends) =>
      prevFriends.filter(
        (friend) => friend.favFriendId !== friendToDelete.favFriendId
      )
    );
    setSelectedFriend(null);
    closeAddFriendModal();
  };

  const handleFriendSelect = async (friend) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/favs/friends/details?favFriendId=${friend.favFriendId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.data) {
        setSelectedFriend(response.data);
        setIsAddFriendModalOpen(true);
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
          const retryResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/favs/friends/details?favFriendId=${friend.favFriendId}`,
            {
              headers: { Authorization: `Bearer ${newAccessToken}` },
            }
          );

          if (retryResponse.data) {
            setSelectedFriend(retryResponse.data);
            setIsAddFriendModalOpen(true);
          }
        } catch (refreshError) {
          console.error("Failed to refresh access token:", refreshError);
          alert("토큰 갱신에 실패했습니다. 다시 로그인해 주세요.");
        }
      } else {
        console.error("Error fetching friend details:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={myPageStyles.favoritesFriendsContainer}>
      <h3
        style={{
          padding: "10px",
          textDecoration: "underline",
          textAlign: "center",
        }}
      >
        즐겨찾는 친구
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {friends.map((friend) => (
          <div
            key={friend.favFriendId}
            style={{
              width: "calc(33.33% - 20px)",
              margin: "10px",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => handleFriendSelect(friend)}
          >
            <div>
              <img
                src={"/img/default-profile.png"}
                width="50"
                height="50"
                alt="profile"
              />
            </div>
            <div style={{ margin: "5px" }}>{friend.name}</div>
          </div>
        ))}
        <div
          key="add-friend-button"
          style={{
            width: "calc(33.33% - 20px)",
            margin: "10px",
            textAlign: "center",
          }}
        >
          <button
            onClick={openAddFriendModal}
            style={myPageStyles.addFriendButton}
          >
            <img
              src="/img/PlusFriend.png"
              alt="Add"
              style={{ width: "50px", height: "50px", cursor: "pointer" }}
            />
          </button>
        </div>
      </div>
      <AddFriendModal
        isOpen={isAddFriendModalOpen}
        closeModal={closeAddFriendModal}
        addFriend={handleAddFriend}
        editFriend={handleEditFriend}
        deleteFriend={handleDeleteFriend}
        selectedFriend={selectedFriend}
        loading={loading}
      />
    </div>
  );
};

export default FavoritesFriends;
