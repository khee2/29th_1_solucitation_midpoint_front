# 프론트엔드

## 역할분담
#### 🫧 [김소영](https://github.com/soyoung2118)
* UI
  * 페이지 : 메인, 로그인, 카카오로그인, 회원가입, 비밀번호 찾기 및 재설정
  * 공통 컴포넌트 : 헤더
* 기능
  * sns 로그인 페이지, 로그인 유효성 및 중복 검사, 회원가입 유효성 및 중복 검사, 이메일 인증, 비밀번호 재설정

#### 🎀 [이혜지](https://github.com/haejee0514) 
* UI
  * 페이지 : 홈, 장소 추천 페이지, 중간지점 재검색 페이지, 목적 추천 테스트 페이지, 테스트 결과 페이지
* 기능
  * 목적 추천 테스트, 본인과 상대방의 중간지점 계산 및 근처 목적에 맞는 장소 추천, 날씨 정보 제공, 카톡 공유 및 검색 기록 저장, 목적과 반경 재설정 재검색

#### 🐱 [안예빈](https://github.com/YeBin0711)
* UI
  * 페이지 : 게시판, 마이페이지
* 기능
  * 게시글 작성, 수정, 삭 검색으로 출력, 좋아요 구현, 회원 정보 수정, 즐겨 찾기 구현, 검색 기록 출력, 내가 쓴 글 출력
  
## 폴더구조
``` 
│  App.css
│  App.js
│  App.test.js
│  index.css
│  index.js
│  logo.svg
│  reportWebVitals.js
│  Router.js
│  setupTests.js
│  soluxion.txt
│  src.txt
│  
├─assets
│  └─fonts
│          
├─components
│      CommonComponents.js
│      LikeButtonComponents.js
│      LoginComponents.js
│      RedirectIfLoggedIn.js
│      refreshAccess.js
│      SearchComponents.js
│      
├─contexts
│      AppContext.js
│      
├─pages
│  │  MainPage.js
│  │  MyPage.js
│  │  ReviewPage.js
│  │  
│  ├─home
│  │      Again.js
│  │      HomeMain.js
│  │      HomePopup.js
│  │      Midpoint.js
│  │      Result1.js
│  │      Result2.js
│  │      Result3.js
│  │      Result4.js
│  │      Test1.js
│  │      Test2.js
│  │      Test3.js
│  │      
│  ├─login
│  │      DirectLoginPage.js
│  │      FindPassword.js
│  │      Join.js
│  │      LoginPage.js
│  │      ResetPassword.js
│  │      
│  ├─MyPage
│  │  │  MyPageFavorites.js
│  │  │  MyPagePosts.js
│  │  │  MyPageProfile.js
│  │  │  MyPageSearchHistory.js
│  │  │  
│  │  ├─Favorites
│  │  │      AddFriendModal.js
│  │  │      AddLocationModal.js
│  │  │      FavoritesFriends.js
│  │  │      FavoritesLocates.js
│  │  │      
│  │  └─Profile
│  │          PasswordConfirmation.js
│  │          ProfileComponents.js
│  │          
│  └─review
│          EditModal.js
│          ReviewCard.js
│          ReviewModal.js
│          WriteModal.js
│          
└─styles
        global.css
        myPageStyles.js
        reviewModalStyles.js
        reviewStyles.js
        searchStyles.js
        styles.js
        writeModalStyles.js

```
