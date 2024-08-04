import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import writeModalStyles, {
  CloseButton,
  ProfileContainer,
  ProfileImg,
  ProfileName,
  InputName,
  Textarea,
  ImgContainer,
  AddImg,
  TagContainer,
  TagButton,
  SubmitButton,
} from '../../styles/writeModalStyles';
import { refreshAccessToken } from '../../components/refreshAccess';

Modal.setAppElement('#root');

const predefinedTags = [
  '#식사',
  '#카페',
  '#공부',
  '#문화생활',
  '#쇼핑',
  '#자연',
  '#산책',
  '#친목',
  '#여럿이',
  '#혼자',
];

const tagIdMap = {
  '#식사': 1,
  '#카페': 2,
  '#공부': 3,
  '#문화생활': 4,
  '#쇼핑': 5,
  '#자연': 6,
  '#산책': 7,
  '#친목': 8,
  '#여럿이': 9,
  '#혼자': 10,
};

const WriteModal = ({
  isOpen,
  closeModal,
  currentUser,
  setReviews,
}) => {
  const [placeName, setPlaceName] = useState('');
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([null, null, null]);
  const [photoURLs, setPhotoURLs] = useState([null, null, null]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [profileData, setProfileData] = useState({
    nickname: '',
    profileImageUrl: '',
  });
  const fileInputRefs = useRef([null, null, null]);

  useEffect(() => {
    if (isOpen) {
      const fetchProfileData = async () => {
        try {
          const accessToken = localStorage.getItem('accessToken');
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/member/profile`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = response.data;
          setProfileData({
            nickname: data.nickname,
            profileImageUrl: data.profileImageUrl,
          });
        } catch (error) {
          if (error.response?.status === 401 && error.response?.data?.error === 'access_token_expired') {
            try {
              const refreshToken = localStorage.getItem('refreshToken');
              if (!refreshToken) {
                throw new Error('No refresh token available.');
              }
              const newAccessToken = await refreshAccessToken(refreshToken);
              const retryResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/member/profile`, {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
              });
              const data = retryResponse.data;
              setProfileData({
                nickname: data.nickname,
                profileImageUrl: data.profileImageUrl,
              });
            } catch (refreshError) {
              console.error('Failed to refresh access token:', refreshError);
            }
          } else {
            console.error('프로필 정보를 불러오는 중 에러 발생:', error);
          }
        }
      };

      fetchProfileData();
    } else {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setPlaceName('');
    setContent('');
    setSelectedFiles([null, null, null]);
    setPhotoURLs([null, null, null]);
    setSelectedTags([]);
  };

  useEffect(() => {
    return () => {
      photoURLs.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [photoURLs]);

  const handleIconClick = (index) => {
    fileInputRefs.current[index]?.click();
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles[index] = file;
    setSelectedFiles(newSelectedFiles);

    const newPhotoURLs = [...photoURLs];
    if (newPhotoURLs[index]) {
      URL.revokeObjectURL(newPhotoURLs[index]);
    }
    newPhotoURLs[index] = URL.createObjectURL(file);
    setPhotoURLs(newPhotoURLs);
  };

  const handleTagClick = (tag) => {
    setSelectedTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag);
      } else if (prevTags.length < 2) {
        return [...prevTags, tag];
      } else {
        alert('두 개의 태그만 선택할 수 있습니다.');
        return prevTags;
      }
    });
  };

  const validateForm = () => {
    if (!placeName.trim()) {
      alert('제목을 입력해 주세요.');
      return false;
    }

    if (!content.trim()) {
      alert('내용을 입력해 주세요.');
      return false;
    }

    if (selectedTags.length !== 2) {
      alert('서로 다른 두 개의 해시태그를 선택해야 합니다.');
      return false;
    }

    if (selectedFiles.filter((file) => file !== null).length < 1) {
      alert('최소 한 장의 사진을 업로드해 주세요.');
      return false;
    }

    return true;
  };

  const addReview = async (newReview) => {
    console.log('addReview called', { newReview });
    const formData = new FormData();
    const postDto = {
      title: newReview.title,
      content: newReview.content,
      postHashtag: newReview.tags,
    };
    formData.append('postDto', JSON.stringify(postDto));
    newReview.photos.forEach((photo) => formData.append('postImages', photo));

    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${accessToken}` };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts`,
        formData,
        { headers }
      );

      setReviews((prevReviews) => [...prevReviews, response.data]);
      alert('게시글을 성공적으로 등록하였습니다.');
      window.location.reload(); // 등록 후 페이지 새로 고침
    } catch (error) {
      if (error.response?.status === 401 && error.response?.data?.error === 'access_token_expired') {
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token available.');
          }
          const newAccessToken = await refreshAccessToken(refreshToken);
          const headers = { Authorization: `Bearer ${newAccessToken}` };
          const retryResponse = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/posts`,
            formData,
            { headers }
          );
          setReviews((prevReviews) => [...prevReviews, retryResponse.data]);
          alert('게시글을 성공적으로 등록하였습니다.');
          window.location.reload(); // 등록 후 페이지 새로 고침
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
          alert('토큰 갱신 중 오류가 발생하였습니다. 다시 시도해 주세요.');
        }
      } else {
        console.error('Error adding review:', error);
        if (error.response) {
          const errorMessage = error.response.data.errors
            ? error.response.data.errors
                .map((err) => `${err.field}: ${err.message}`)
                .join(', ')
            : error.response.data;
          alert(`게시글 등록 중 오류가 발생하였습니다: ${errorMessage}`);
        } else {
          alert(`게시글 등록 중 오류가 발생하였습니다: ${error.message}`);
        }
      }
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const tags = selectedTags.map((tag) => tagIdMap[tag]);

    const newReview = {
      title: placeName,
      content,
      photos: selectedFiles.filter((file) => file !== null),
      tags,
      author: currentUser,
    };

    await addReview(newReview);
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={{
        overlay: writeModalStyles.overlay,
        content: writeModalStyles.modal,
      }}
      contentLabel='Write Review Modal'
    >
      <form onSubmit={handleAddReview}>
        <CloseButton onClick={closeModal}>X</CloseButton>
        <ProfileContainer>
          {profileData.profileImageUrl ? (
            <ProfileImg src={profileData.profileImageUrl} alt='profile' />
          ) : (
            <ProfileImg alt='profile' />
          )}
          <ProfileName>{profileData.nickname}</ProfileName>
        </ProfileContainer>
        <InputName
          type='text'
          placeholder='글제목'
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
        />
        <Textarea
          placeholder='내용을 입력하세요'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <ImgContainer>
          {[0, 1, 2].map((index) => (
            <span key={index}>
              <AddImg
                src={photoURLs[index] || `${process.env.PUBLIC_URL}/img/addPhoto.png`}
                onClick={() => handleIconClick(index)}
                alt={`Upload ${index + 1}`}
              />
              <input
                type='file'
                ref={(el) => (fileInputRefs.current[index] = el)}
                onChange={(e) => handleFileChange(index, e)}
                style={{ display: 'none' }}
              />
            </span>
          ))}
        </ImgContainer>
        <div style={{ fontWeight: 'bold' }}>태그 (2개 필수)</div>
        <TagContainer>
          {predefinedTags.map((tag) => (
            <TagButton
              type='button'
              key={tag}
              onClick={() => handleTagClick(tag)}
              selected={selectedTags.includes(tag)}
            >
              {tag}
            </TagButton>
          ))}
        </TagContainer>
        <SubmitButton type='submit'>게시</SubmitButton>
      </form>
    </Modal>
  );
};

export default WriteModal;