import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Logo } from "../components/CommonComponents";
import SearchComponents from "../components/SearchComponents";
import ReviewCard from "./review/ReviewCard";
import ReviewModal from "./review/ReviewModal";
import WriteModal from "./review/WriteModal";
import EditModal from "./review/EditModal";
import { reviewStyles } from "../styles/reviewStyles";
import { refreshAccessToken } from "../components/refreshAccess";

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        try {
          await refreshAccessToken(refreshToken);
          setIsLoggedIn(true);
          setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
        } catch (error) {
          setIsLoggedIn(false);
          setCurrentUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    };

    checkLoginStatus();
  }, []);

  return { currentUser, isLoggedIn, setIsLoggedIn };
};

const hashtagMap = {
  1: "#식사",
  2: "#카페",
  3: "#공부",
  4: "#문화생활",
  5: "#쇼핑",
  6: "#자연",
  7: "#산책",
  8: "#친목",
  9: "#여럿이",
  10: "#혼자",
};

const ReviewPage = () => {
  const { currentUser, isLoggedIn, setIsLoggedIn } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [writeModalIsOpen, setWriteModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [reviewModalIsOpen, setReviewModalIsOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [clickedTags, setClickedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReviews = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/posts`,
        { headers }
      );

      const fetchedReview = response.data.map((review) => ({
        postId: review.postId,
        firstImageUrl: review.firstImageUrl,
        title: review.title,
        hashtags: review.hashtags.map((tagId) => hashtagMap[tagId]),
        likes: review.likes,
        likeCnt: review.likeCnt,
      }));

      setReviews(fetchedReview);
      setFilteredReviews(fetchedReview);
    } catch (error) {
      console.error("게시글 조회 중 오류가 발생하였습니다.", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleLikeToggle = async (postId, currentLikes, currentLikeCnt) => {
    // UI 즉시 업데이트
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.postId === postId
          ? {
              ...review,
              likes: !currentLikes,
              likeCnt: currentLikes ? currentLikeCnt - 1 : currentLikeCnt + 1,
            }
          : review
      )
    );

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
      }

      const headers = { Authorization: `Bearer ${accessToken}` };
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts/${postId}/likes`,
        {},
        { headers }
      );

      if (response.status === 200) {
        await fetchReviews();
      } else {
        throw new Error("Failed to toggle like");
      }
    } catch (error) {
      console.error("Error toggling like", error);
      alert("좋아요를 변경하는 중 오류가 발생하였습니다.");
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.postId === postId
            ? {
                ...review,
                likes: currentLikes,
                likeCnt: currentLikes ? currentLikeCnt + 1 : currentLikeCnt - 1,
              }
            : review
        )
      );
    }
  };

  const fetchReviewDetails = useCallback(async (postId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/posts/${postId}`,
        { headers }
      );

      const fetchedReviewDetails = {
        postId: postId,
        profileImageUrl: response.data.profileImagerUrl,
        nickname: response.data.nickname,
        title: response.data.title,
        content: response.data.content,
        createDate: response.data.createDate,
        postHashtags: response.data.postHashtags.map(
          (tagId) => hashtagMap[tagId]
        ),
        images: response.data.images,
        likeCnt: response.data.likeCnt,
        likes: response.data.likes,
      };

      setSelectedReview(fetchedReviewDetails);
    } catch (error) {
      console.error("해당 게시글 조회 중 오류가 발생하였습니다.", error);
    }
  }, []);

  const openWriteModal = () => {
    setWriteModalIsOpen(true);
  };

  const closeWriteModal = () => {
    setWriteModalIsOpen(false);
  };

  const openEditModal = (review) => {
    setSelectedReview(review);
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
  };

  const openReviewModal = async (postId) => {
    await fetchReviewDetails(postId);
    setReviewModalIsOpen(true);
  };

  const closeReviewModal = async () => {
    setReviewModalIsOpen(false);
  };

  const handleWriteButtonClick = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!isLoggedIn && refreshToken) {
      try {
        await refreshAccessToken(refreshToken);
        setIsLoggedIn(true);
        openWriteModal();
      } catch (error) {
        alert("로그인 후 사용 가능합니다.");
      }
    } else if (isLoggedIn) {
      openWriteModal();
    } else {
      alert("로그인 후 사용 가능합니다.");
    }
  };

  return (
    <div>
      <Logo bgColor="#F2F2F2" />
      <div id="content" style={{ marginTop: "120px" }}>
        <SearchComponents
          setFilteredReviews={setFilteredReviews}
          setSearchTerm={setSearchTerm}
          clickedTags={clickedTags}
          setClickedTags={setClickedTags}
        />
        <div style={reviewStyles.reviewContainer}>
          {(filteredReviews.length > 0 ? filteredReviews : reviews).map(
            (review) => (
              <ReviewCard
                key={review.postId}
                review={review}
                onReviewClick={openReviewModal}
                onLikeToggle={handleLikeToggle}
              />
            )
          )}
        </div>
      </div>
      <button onClick={handleWriteButtonClick} style={reviewStyles.writeButton}>
        <img
          src="/img/WriteButtonIcon.png"
          alt="write button"
          style={reviewStyles.writeButtonImage}
        />
      </button>
      <WriteModal
        isOpen={writeModalIsOpen}
        closeModal={closeWriteModal}
        currentUser={currentUser}
        setReviews={setReviews}
      />
      {selectedReview && (
        <EditModal
          isOpen={editModalIsOpen}
          closeModal={closeEditModal}
          existingReview={selectedReview}
          currentUser={currentUser}
          setReviews={setReviews}
        />
      )}
      {selectedReview && (
        <ReviewModal
          isOpen={reviewModalIsOpen}
          review={selectedReview}
          closeModal={closeReviewModal}
          openEditModal={openEditModal}
          onLikeToggle={handleLikeToggle}
          fetchReviewDetails={fetchReviewDetails}
          fetchReviews={fetchReviews}
          deleteReview={(review) => {
            setReviews((prevReviews) =>
              prevReviews.filter((r) => r.postId !== review.postId)
            );
          }}
        />
      )}
    </div>
  );
};

export default ReviewPage;
