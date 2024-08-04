import React from "react";
import { reviewStyles } from "../../styles/reviewStyles";
import LikeButton from "../../components/LikeButtonComponents";

const ReviewCard = ({ review, onReviewClick, onLikeToggle }) => {
  const { firstImageUrl, hashtags, title, postId, likes } = review;

  const handleClick = () => {
    onReviewClick(postId);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    onLikeToggle(postId, likes);
  };

  const truncatedTitle = title.length > 20 ? `${title.slice(0, 20)}...` : title;

  return (
    <div style={reviewStyles.card} onClick={handleClick}>
      {firstImageUrl && (
        <div style={reviewStyles.photoContainer}>
          <img src={firstImageUrl} alt={title} style={reviewStyles.photo} />
        </div>
      )}
      <div style={reviewStyles.tagsContainer}>
        <div style={reviewStyles.tags}>
          {hashtags.map((tag, index) => (
            <span key={index} style={reviewStyles.tag}>
              {tag}
            </span>
          ))}
        </div>
        <LikeButton liked={likes} toggleLike={handleLike} />
      </div>
      <div style={reviewStyles.placeName}>{truncatedTitle}</div>
    </div>
  );
};

export default ReviewCard;
