// axios.post("https://www.ypbooks.co.kr/ypbooks_mobile/sub/getBookListMobileAjax.jsp", {
//         sortField: "RANK",
//         query: "이것이 취업을 위한 코딩 테스트다 with 파이썬",
//         collection: "books_kor",
//         pageNum: "1",
//         c1: "",
//         c2: "",
//         c3: "",
//         booksKorListCount: 10,
//         booksForeignListCount: 10,
//         bookReviewListCount: 10,
//         method: 'getM_Search'
//     })
//     .then(function (response) {
//         console.log('성공', response);
//     }).catch(function (error) {
//         // 오류발생시 실행
//         console.log('에러', error);
//     });
// async await 함수를 사용할 때, 
// try {
// const data = await axios.post("https://www.ypbooks.co.kr/ypbooks_mobile/sub/getBookListMobileAjax.jsp");
// } catch {
// // 오류 발생시 실행
// }

//https://www.ypbooks.co.kr/ypbooks_mobile/sub/getBookListMobileAjax.jsp



// async await 함수를 사용할 때, 
// try {
// const data = await axios.post("https://www.ypbooks.co.kr/ypbooks_mobile/sub/getBookListMobileAjax.jsp");
// } catch {
// // 오류 발생시 실행
// }

// https://www.ypbooks.co.kr/ypbooks_mobile/sub/getBookListMobileAjax.jsp
// axios.get("https://www.ypbooks.co.kr/ypbooks_mobile/sub/mBranchStockLoc.jsp?bookCd=101042609&bookCost=34000&").then(function (result) {
//     console.log("통신 결과 : ", result['data']);
// }).catch(function (error) {
//     console.log("에러 발생 : ", error);
// });
// console.log("바로 실행 로그");











/* 교보문고

//교보문고 재고 확인 가능
// axios.get("https://mobile.kyobobook.co.kr/welcomeStore/storeSearchList?searchKeyWord=%EC%9D%B4%EA%B2%83%EC%9D%B4%20%EC%B7%A8%EC%97%85%EC%9D%84%20%EC%9C%84%ED%95%9C%20%EC%BD%94%EB%94%A9%ED%85%8C%EC%8A%A4%ED%8A%B8%EB%8B%A4&siteCode=23&orderClick=Oh3").then(function (result) {
//     console.log("통신 결과 : ", result);
// }).catch(function (error) {
//     console.log("에러 발생 : ", error);
// });
// console.log("바로 실행 로그");

//sitecode 위 axios에서 지점 다 받아오고 , barcode = isbn 넣어서 검색하면 재고 확인 가능.
axios.get("https://mobile.kyobobook.co.kr/welcomeStore/storeSearchDetail?siteCode=15&productType=KOR&barcode=9791162243077").then(function (result) {
    console.log("통신 결과 : ", result);
}).catch(function (error) {
    console.log("에러 발생 : ", error);
});
console.log("바로 실행 로그");

// 아래 코드로 영업시간 전화번호 휴무일 확인가능 위치 좌표 가능
axios.get("http://www.kyobobook.co.kr/storen/MainStore.laf?SITE=15&Kc=GNHHNOoffstore&orderClick=rvd").then(function (result) {
    console.log("통신 결과 : ", result);
}).catch(function (error) {
    console.log("에러 발생 : ", error);
});
console.log("바로 실행 로그");
*/



// yes24 책 검색시 나오는 리스트들에 대해 지점별 재고 확인가능
// 지점별 위치는 ? 매장시간은 ? 전화번호는 ?
// axios.get("http://www.yes24.com/Product/Search?domain=STORE&query=%EB%91%90%20%EB%8F%84%EC%8B%9C%20%EC%9D%B4%EC%95%BC%EA%B8%B0").then(function (result) {
//     console.log("통신 결과 : ", result);
// }).catch(function (error) {
//     console.log("에러 발생 : ", error);
// });
// console.log("바로 실행 로그");

// yes24 매점들 불러오는거
// axios.get("http://www.yes24.com/Mall/UsedStore/Detail/Seomyeon").then(function (result) {
//     console.log("통신 결과 : ", result);
// }).catch(function (error) {
//     console.log("에러 발생 : ", error);
// });
// console.log("바로 실행 로그");


// 각 매점들 영어이름 XXXXX에 넣으면됨. 
// axios.get("http://www.yes24.com/Mall/UsedStore/Detail/XXXXXXXX").then(function (result) {
//     console.log("통신 결과 : ", result);
// }).catch(function (error) {
//     console.log("에러 발생 : ", error);
// });
// console.log("바로 실행 로그");