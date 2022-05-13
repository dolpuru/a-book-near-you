axios.post("https://www.ypbooks.co.kr/ypbooks_mobile/sub/getBookListMobileAjax.jsp", {
        sortField: "RANK",
        query: "이것이 취업을 위한 코딩 테스트다 with 파이썬",
        collection: "books_kor",
        pageNum: "1",
        c1: "",
        c2: "",
        c3: "",
        booksKorListCount: 10,
        booksForeignListCount: 10,
        bookReviewListCount: 10,
        method: 'getM_Search'
    })
    .then(function (response) {
        console.log('성공', response);
    }).catch(function (error) {
        // 오류발생시 실행
        console.log('에러', error);
    });

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