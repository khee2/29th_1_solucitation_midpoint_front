import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Router from './Router';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);

reportWebVitals();

// Kakao 초기화
const script = document.createElement('script');
script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
script.onload = () => {
  window.Kakao.init('266920c75b2a1dda7ce64de104fafade'); // YOUR_JAVASCRIPT_KEY를 실제 키로 변경
};
document.head.appendChild(script);
