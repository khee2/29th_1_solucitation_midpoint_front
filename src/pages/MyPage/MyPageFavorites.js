import React from 'react';
import FavoritesLocate from './Favorites/FavoritesLocates.js';
import FavoritesFriends from './Favorites/FavoritesFriends.js';
import { myPageStyles } from '../../styles/myPageStyles.js';

const MyPageFavorites = () => {
  return (
    <div style={myPageStyles.favoritesContainer}>
      <FavoritesLocate />
      <FavoritesFriends />
    </div>
  );
};

export default MyPageFavorites;
