// 해당 코드 지점의 정보를 가져온다.
axios.get("http://www.kyobobook.co.kr/storen/MainStore.laf?SITE=15&Kc=GNHHNOoffstore&orderClick=rvd").then(function (result) {
    console.log("통신 결과 : ", result);
}).catch(function (error) {
    console.log("에러 발생 : ", error);
});
console.log("바로 실행 로그");

//모든 매장 이름을 가져온다.
axios.get("https://mobile.kyobobook.co.kr/welcomeStore/storeSearchList").then(function (result) {
    console.log("통신 결과 : ", result);
}).catch(function (error) {
    console.log("에러 발생 : ", error);
});
console.log("바로 실행 로그");



// sitecode 위 axios에서 지점 다 받아오고 , barcode = isbn 넣어서 검색하면 재고 확인 가능.
axios.get("https://mobile.kyobobook.co.kr/welcomeStore/storeSearchDetail?siteCode=15&productType=KOR&barcode=9791162243077").then(function (result) {
    console.log("통신 결과 : ", result);
}).catch(function (error) {
    console.log("에러 발생 : ", error);
});
console.log("바로 실행 로그");
