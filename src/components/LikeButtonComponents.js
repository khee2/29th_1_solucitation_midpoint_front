import React from "react";

const LikeButton = ({ liked, toggleLike }) => {
  const buttonStyle = {
    marginLeft: "10px",
    background: "none",
    border: "none",
    padding: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const iconStyle = {
    border: "none",
  };

  const handleClick = (e) => {
    e.stopPropagation();
    toggleLike(e);
  };

  return (
    <button onClick={handleClick} style={buttonStyle}>
      {liked ? (
        <img
          src={`${process.env.PUBLIC_URL}/img/activeLiked.png`}
          alt="Active Liked Icon"
          style={iconStyle}
        />
      ) : (
        <img
          src={`${process.env.PUBLIC_URL}/img/Liked.png`}
          alt="Like Icon"
          style={iconStyle}
        />
      )}
    </button>
  );
};

export default LikeButton;
