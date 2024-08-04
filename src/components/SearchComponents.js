import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { searchStyles } from '../styles/searchStyles';

const SearchComponents = ({
  setFilteredReviews,
  setSearchTerm,
  clickedTags,
  setClickedTags,
}) => {
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState(null);

  const tags = [
    { id: 1, name: '식사' },
    { id: 2, name: '카페' },
    { id: 3, name: '공부' },
    { id: 4, name: '문화생활' },
    { id: 5, name: '쇼핑' },
    { id: 6, name: '자연' },
    { id: 7, name: '산책' },
    { id: 8, name: '친목' },
    { id: 9, name: '여럿이' },
    { id: 10, name: '혼자' },
  ];

  const hashtagMap = {
    1: '#식사',
    2: '#카페',
    3: '#공부',
    4: '#문화생활',
    5: '#쇼핑',
    6: '#자연',
    7: '#산책',
    8: '#친목',
    9: '#여럿이',
    10: '#혼자',
  };

  const handleInputChange = (e) => {
    const newText = e.target.value;
    if (newText.length <= 255) {
      setSearchText(newText);
    } else {
      window.alert('검색어는 최대 255자까지 입력할 수 있습니다.');
    }
  };

  const handleTagClick = (tagId) => {
    setClickedTags((prevTags) => {
      if (prevTags.includes(tagId)) {
        const newTags = prevTags.filter((id) => id !== tagId);
        fetchByTags(newTags);
        return newTags;
      } else if (prevTags.length < 2) {
        const newTags = [...prevTags, tagId];
        fetchByTags(newTags);
        return newTags;
      } else {
        window.confirm('태그는 2개까지 선택할 수 있습니다.');
        return prevTags;
      }
    });
  };

  // 모든 게시물 가져오기
  const fetchAllPosts = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/posts`,
        { headers }
      );

      if (response.status === 200) {
        const data = response.data.map((item) => ({
          postId: item.postId,
          firstImageUrl: item.firstImageUrl,
          title: item.title,
          hashtags: item.hashtags.map((tagId) => hashtagMap[tagId]),
          likes: item.likes,
        }));
        setFilteredReviews(data);
        setError(null);
      }
    } catch (error) {
      if (error.response) {
        setError(`게시글 검색 중 오류가 발생하였습니다: ${error.message}`);
      } else if (error.request) {
        setError('서버와 연결할 수 없습니다.');
      } else {
        setError(`오류가 발생하였습니다: ${error.message}`);
      }
    }
  };

  // 검색어로 검색
  const fetchBySearchTerm = async (text) => {
    if (text.length === 0) {
      fetchAllPosts();
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/posts/search/query`,
        {
          params: { query: text },
          headers,
        }
      );

      if (response.status === 200) {
        const data = response.data.map((item) => ({
          postId: item.postId,
          firstImageUrl: item.firstImageUrl,
          title: item.title,
          hashtags: item.hashtags.map((tagId) => hashtagMap[tagId]),
          likes: item.likes,
        }));

        if (data.length === 0) {
          window.alert('해당하는 검색어는 존재하지 않습니다.');
        }

        setFilteredReviews(data);
        setError(null);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('검색어를 입력해주세요.');
        } else if (error.response.status === 500) {
          setError(`게시글 검색 중 오류가 발생하였습니다: ${error.message}`);
        }
      } else if (error.request) {
        setError('서버와 연결할 수 없습니다.');
      } else {
        setError(`오류가 발생하였습니다: ${error.message}`);
      }
    }
  };

  // 태그로 검색
  const fetchByTags = async (tagIds) => {
    if (tagIds.length === 0) {
      fetchAllPosts();
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/posts/search/purpose`,
        {
          params: { purpose: tagIds },
          headers,
          paramsSerializer: (params) => {
            return Object.keys(params)
              .map((key) => {
                return `${encodeURIComponent(key)}=${encodeURIComponent(
                  params[key].join(',')
                )}`;
              })
              .join('&');
          },
        }
      );

      if (response.status === 200) {
        const data = response.data.map((item) => ({
          postId: item.postId,
          firstImageUrl: item.firstImageUrl,
          title: item.title,
          hashtags: item.hashtags.map((tagId) => hashtagMap[tagId]),
          likes: item.likes,
        }));
        setFilteredReviews(data);
        setError(null);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('최소 하나 이상의 해시태그를 선택해야 합니다.');
        } else if (error.response.status === 500) {
          setError(`게시글 검색 중 오류가 발생하였습니다: ${error.message}`);
        }
      } else if (error.request) {
        setError('서버와 연결할 수 없습니다.');
      } else {
        setError(`오류가 발생하였습니다: ${error.message}`);
      }
    }
  };

  const handleSearch = () => {
    if (searchText.trim() === '') {
      fetchAllPosts();
    } else {
      setSearchTerm(searchText);
      fetchBySearchTerm(searchText);
    }
  };

  useEffect(() => {
    if (clickedTags.length === 0) {
      fetchAllPosts();
    }
  }, [clickedTags]);

  return (
    <>
      <style>
        {`
          input::placeholder {
            color: #1B4345;
            font-family: 'Freesentation', sans-serif;
            font-size: 18px;
          }
          input:focus::placeholder {
            opacity: 0;
          }
        `}
      </style>
      <div style={searchStyles.searchContainer}>
        <div style={searchStyles.inputContainer}>
          <input
            type='text'
            style={searchStyles.input}
            placeholder='검색어를 입력하세요'
            value={searchText}
            onChange={handleInputChange}
          />
          <button style={searchStyles.searchButton} onClick={handleSearch}>
            검색
          </button>
        </div>
        <div style={searchStyles.searchTagContainer}>
          <div style={searchStyles.searchTagList}>
            {tags.map((tag) => (
              <div
                key={tag.id}
                style={{
                  ...searchStyles.searchTag,
                  backgroundColor: clickedTags.includes(tag.id)
                    ? '#1B4345'
                    : 'transparent',
                  color: clickedTags.includes(tag.id) ? '#fff' : '#1B4345',
                  borderColor: '#1B4345',
                  cursor: 'pointer',
                }}
                onClick={() => handleTagClick(tag.id)}
              >
                {tag.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchComponents;
