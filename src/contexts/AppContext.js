import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({ name: '본인', profileImage: '/img/default-profile.png', address: '' });
  const [friends, setFriends] = useState([]);
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <AppContext.Provider value={{ userInfo, setUserInfo, friends, setFriends, selectedPurpose, setSelectedPurpose, isLoggedIn }}>
      {children}
    </AppContext.Provider>
  );
};
