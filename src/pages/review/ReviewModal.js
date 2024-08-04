import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { reviewModalStyles } from "../../styles/reviewModalStyles";
import LikeButton from "../../components/LikeButtonComponents";
import { refreshAccessToken } from "../../components/refreshAccess";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}. ${month}. ${day}. ${hours}:${minutes}`;
};

const ReviewModal = ({
  isOpen,
  review,
  closeModal,
  openEditModal,
  deleteReview,
  onLikeToggle,
  fetchReviewDetails,
  fetchReviews,
}) => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchProfileData = async () => {
        try {
          const accessToken = localStorage.getItem("accessToken");
          if (!accessToken) {
            return;
          }

          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/member/profile`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );

          const data = response.data;
          setProfileData({
            nickname: data.nickname,
            profileImage: data.profileImageUrl,
          });
        } catch (error) {
          setError("프로필 정보를 불러오는 중 에러 발생");
        }
      };

      fetchProfileData();
    }
  }, [isOpen]);

  const handleEditClick = () => {
    openEditModal(review);
    closeModal();
  };

  const handleDeleteClick = async () => {
    if (window.confirm("삭제하시겠습니까?")) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/posts/${review.postId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        deleteReview(review);
        closeModal();
        await fetchReviews(); // 전체 리뷰 목록을 다시 가져오기
      } catch (error) {
        if (
          error.response?.status === 401 &&
          error.response?.data?.error === "access_token_expired"
        ) {
          try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
              throw new Error("No refresh token available.");
            }
            const newAccessToken = await refreshAccessToken(refreshToken);
            const headers = { Authorization: `Bearer ${newAccessToken}` };
            await axios.delete(
              `${process.env.REACT_APP_API_URL}/api/posts/${review.postId}`,
              {
                headers,
              }
            );
            deleteReview(review);
            closeModal();
            await fetchReviews(); // 전체 리뷰 목록을 다시 가져오기
          } catch (refreshError) {
            console.error("Failed to refresh access token:", refreshError);
            setError("토큰 갱신 중 오류가 발생하였습니다. 다시 시도해 주세요.");
          }
        } else {
          if (error.response) {
            switch (error.response.status) {
              case 401:
                setError("로그인이 필요합니다.");
                break;
              case 404:
                setError("해당 게시글이 존재하지 않습니다.");
                break;
              case 403:
                setError(
                  "해당 게시글을 삭제할 권한이 없습니다. 본인이 작성한 글만 삭제할 수 있습니다."
                );
                break;
              case 500:
                setError("게시글 삭제 중 오류가 발생하였습니다.");
                break;
              default:
                setError(`오류가 발생하였습니다: ${error.message}`);
            }
          } else if (error.request) {
            setError("서버와 연결할 수 없습니다.");
          } else {
            setError(`오류가 발생하였습니다: ${error.message}`);
          }
        }
      }
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    await onLikeToggle(review.postId);
    await fetchReviewDetails(review.postId);
  };

  const photos = Array.isArray(review.images) ? review.images : [];
  const isCurrentUser = profileData && profileData.nickname === review.nickname;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={{
        overlay: reviewModalStyles.overlay,
        content: reviewModalStyles.modal,
      }}
      contentLabel="Review Modal"
    >
      <button onClick={closeModal} style={reviewModalStyles.closeButton}>
        X
      </button>
      <div style={reviewModalStyles.profileContainer}>
        <img
          src={review.profileImageUrl}
          alt="profile"
          style={reviewModalStyles.profileImg}
        />
        <div style={reviewModalStyles.profileInfo}>
          <div style={reviewModalStyles.profileName}>{review.nickname}</div>
          <div style={reviewModalStyles.date}>
            {formatDate(review.createDate)}
          </div>
        </div>
      </div>
      <div style={reviewModalStyles.contentContainer}>
        <div style={reviewModalStyles.placeName}>{review.title}</div>
        <p style={reviewModalStyles.content}>{review.content}</p>
        <div style={reviewModalStyles.photosContainer}>
          {photos.map(
            (photo, index) =>
              photo && (
                <img
                  key={index}
                  src={photo}
                  alt={`review ${index + 1}`}
                  style={reviewModalStyles.photo}
                />
              )
          )}
        </div>
      </div>
      <div style={reviewModalStyles.footer}>
        <div style={reviewModalStyles.likeSection}>
          <LikeButton
            liked={review.likes}
            toggleLike={handleLike}
            likeCount={review.likeCnt}
          />
          <span style={reviewModalStyles.like}>
            좋아요 {review.likeCnt.toString()}
          </span>
        </div>
        <div style={reviewModalStyles.tags}>
          {review.postHashtags.map((tag, index) => (
            <span key={index} style={reviewModalStyles.tagButton}>
              {tag}
            </span>
          ))}
        </div>
        {isCurrentUser && (
          <div style={reviewModalStyles.editSection}>
            <button
              onClick={handleEditClick}
              style={reviewModalStyles.editButton}
            >
              <img src="/img/ReviewEditIcon.png" alt="edit" />
            </button>
            <button
              onClick={handleDeleteClick}
              style={reviewModalStyles.delButton}
            >
              <img src="/img/ReviewDelIcon.png" alt="delete" />
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReviewModal;
