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

const EditModal = ({
  isOpen,
  closeModal,
  existingReview,
  setReviews
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
  const [initialTags, setInitialTags] = useState([]);
  const [initialImages, setInitialImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const fileInputRefs = [useRef(null), useRef(null), useRef(null)];

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
            nickname: data.nickname || '',
            profileImageUrl: data.profileImageUrl || '',
          });
        } catch (error) {
          console.error('프로필 정보를 불러오는 중 에러 발생:', error);
        }
      };

      fetchProfileData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && existingReview) {
      setPlaceName(existingReview.title || '');
      setContent(existingReview.content || '');

      const initialPhotoURLs = [null, null, null];
      if (existingReview.images) {
        for (let i = 0; i < existingReview.images.length && i < 3; i++) {
          initialPhotoURLs[i] = existingReview.images[i];
        }
      }
      setPhotoURLs(initialPhotoURLs);
      setInitialImages(initialPhotoURLs);

      const initialTags = existingReview.postHashtags || [];
      setSelectedTags(initialTags);
      setInitialTags(initialTags);

    } else {
      resetForm();
    }
  }, [isOpen, existingReview]);

  useEffect(() => {
    return () => {
      photoURLs.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [photoURLs]);

  const resetForm = () => {
    setPlaceName('');
    setContent('');
    setSelectedFiles([null, null, null]);
    setPhotoURLs([null, null, null]);
    setSelectedTags([]);
    setInitialTags([]);
    setInitialImages([]);
    setDeletedImages([]);
    setIsImageChanged(false);
  };

  const handleIconClick = (index) => {
    fileInputRefs[index]?.current?.click();
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles[index] = file;
    setSelectedFiles(newSelectedFiles);

    const newPhotoURLs = [...photoURLs];
    if (newPhotoURLs[index] && initialImages.includes(newPhotoURLs[index])) {
      setDeletedImages([...deletedImages, newPhotoURLs[index]]);
    }
    if (newPhotoURLs[index]) {
      URL.revokeObjectURL(newPhotoURLs[index]);
    }
    newPhotoURLs[index] = URL.createObjectURL(file);
    setPhotoURLs(newPhotoURLs);
    setIsImageChanged(true);
  };

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else if (selectedTags.length < 2) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const validateForm = () => {
    if (!placeName.trim()) {
      alert('제목을 입력해 주세요.');
      return false;
    }

    if (placeName.length > 100) {
      alert('제목은 100자 이내로 입력해 주세요.');
      return false;
    }

    if (!content.trim()) {
      alert('내용을 입력해 주세요.');
      return false;
    }

    if (selectedTags.length < 2) {
      alert('태그를 2개 선택해 주세요.');
      return false;
    }

    const validPhotos = selectedFiles.filter((file) => file !== null);
    if (initialImages.filter((url) => url !== null).length - deletedImages.length < 1 && validPhotos.length < 1) {
      alert('최소 한 장의 사진을 업로드해 주세요.');
      return false;
    }

    return true;
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const updatedReview = {
      title: placeName,
      content,
      tags: selectedTags.map(tag => tagIdMap[tag]),
      photos: selectedFiles.filter(file => file !== null),
      deleteImageUrl: deletedImages,
    };

    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${accessToken}` };

      const postDto = {
        title: updatedReview.title,
        content: updatedReview.content,
        postHashtag: updatedReview.tags,
        deleteImageUrl: updatedReview.deleteImageUrl
      };

      const formData = new FormData();
      formData.append('postDto', JSON.stringify(postDto));

      updatedReview.photos.forEach((image) => {
        formData.append('postImages', image);
      });

      // FormData 내용을 확인하는 로그 (이미지 파일 확인)
      for (let pair of formData.entries()) {
        if (pair[0].includes('postImages')) {
          console.log(`${pair[0]}: ${pair[1] instanceof File ? pair[1].name : pair[1]}`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }

      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/posts/${existingReview.postId}`,
        formData,
        { headers }
      );

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.postId === existingReview.postId ? response.data : review
        )
      );
      alert('게시글을 성공적으로 수정하였습니다.');
      window.location.reload(); // 수정 후 페이지 새로 고침
    } catch (error) {
      console.error('Error updating review:', error);
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        switch (status) {
          case 401:
            alert('해당 서비스를 이용하기 위해서는 로그인이 필요합니다.');
            break;
          case 404:
            alert('해당 게시글이 존재하지 않습니다.');
            break;
          case 403:
            alert('해당 게시글을 수정할 권한이 없습니다. 본인이 작성한 글만 수정할 수 있습니다.');
            break;
          case 400:
            if (responseData.errors) {
              const errors = responseData.errors;
              errors.forEach((err) => {
                if (err.field === 'title') {
                  alert('제목을 입력해야 합니다.');
                } else if (err.field === 'content') {
                  alert('내용을 입력해야 합니다.');
                } else if (err.field === 'title' && err.message.includes('100자')) {
                  alert('제목은 최대 100자까지 가능합니다.');
                }
              });
            } else if (responseData.message) {
              if (responseData.message.includes('해시태그')) {
                alert('서로 다른 두 개의 해시태그를 선택해야 합니다.');
              } else if (responseData.message.includes('이미지')) {
                alert('이미지는 최대 3장까지 업로드할 수 있습니다.');
              } else if (responseData.message.includes('최소 1장')) {
                alert('이미지를 최소 1장 이상 업로드해야 합니다.');
              } else {
                alert('잘못된 요청입니다.');
              }
            }
            break;
          case 500:
            alert('게시물 수정 중 오류가 발생했습니다.');
            break;
          default:
            alert(`게시글 수정 과정에서 오류가 발생하였습니다: ${responseData}`);
        }
      } else {
        alert(`게시글 수정 과정에서 오류가 발생하였습니다: ${error.message}`);
      }
    }
  };

  const handleCloseModal = () => {
    resetForm();
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      style={{
        overlay: writeModalStyles.overlay,
        content: writeModalStyles.modal,
      }}
      contentLabel='Edit Review Modal'
    >
      <form onSubmit={handleUpdateReview}>
        <CloseButton onClick={handleCloseModal}>X</CloseButton>
        <ProfileContainer>
          <ProfileImg
            src={profileData.profileImageUrl || '/img/defaultProfile.png'}
            alt='profile'
            onError={(e) => e.target.src = '/img/defaultProfile.png'}
          />
          <ProfileName>{profileData.nickname}</ProfileName>
        </ProfileContainer>
        <InputName
          type='text'
          placeholder='글제목'
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
          maxLength={100}
        />
        <Textarea
          placeholder='내용을 입력하세요'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <ImgContainer>
          {photoURLs.map((url, index) => (
            <span key={index}>
              <AddImg
                src={url || '/img/addPhoto.png'}
                onClick={() => handleIconClick(index)}
                alt={url ? `Image ${index + 1}` : `Upload ${index + 1}`}
              />
              <input
                type='file'
                ref={fileInputRefs[index]}
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
        <SubmitButton type='submit'>수정</SubmitButton>
      </form>
    </Modal>
  );
};

export default EditModal;