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
axios.get("http://one-library.busan.go.kr/busanbooks/?mode=tBookList&page_id=result&mapflag=&manage_code=BJ%2CBG%2CAX%2CBF%2CBV%2CBZ%2CCA%2CJG%2CAP%2CAF%2CKF%2CHN%2CJV%2CHR%2CJJ%2CHQ%2CJN%2CJS%2CJQ%2CKD%2CAC%2CAT%2CAZ%2CBD%2CAL%2CBR%2CGQ%2CBK%2CAN%2CBP%2CGL%2CBH%2CAJ%2CHS%2CHT%2CHU%2CHV%2CJW%2CAV%2CAY%2CHX%2CAB%2CBN%2CAU%2CBE%2CGP%2CBL%2CAD%2CAG%2CBA%2CGB%2CGC%2CGD%2CGE%2CGF%2CGG%2CGH%2CGJ%2CAQ%2CJT%2CGM%2CGN%2CAS%2CAH%2CBT%2CFR%2CJK%2CJL%2CBS%2CAW%2CHY%2CHZ%2CJA%2CJD%2CJE%2CAR%2CBQ%2CBC%2CAE%2CGS%2CGT%2CGU%2CGV%2CGW%2CGX%2CGY%2CGZ%2CHA%2CHB%2CHC%2CHD%2CHE%2CHG%2CHH%2CHJ%2CAA%2CFQ%2CFE%2CFF%2CFG%2CFH%2CFJ%2CFK%2CFL%2CFM%2CFN%2CFP%2CAK%2CFA%2CFB%2CFC%2CFD%2CAM%2CBB%2CFS%2CFT%2CFU%2CFV%2CFW%2CFX%2CFY%2CFZ%2CGA%2CJH&orderby_item=&orderby=&hidden_search_flag=&hidden_search_word=&search_title=%EC%9D%B4%EA%B2%83%EC%9D%B4+%EC%B7%A8%EC%97%85%EC%9D%84+%EC%9C%84%ED%95%9C+%EC%BD%94%EB%94%A9%ED%85%8C%EC%8A%A4%ED%8A%B8%EB%8B%A4&search_author=&search_publisher=&search_keyword=&search_start_date=&search_end_date=&book_type=BOOK").then(function (result) {
    console.log("통신 결과 : ", result);
}).catch(function (error) {
    console.log("에러 발생 : ", error);
});
console.log("바로 실행 로그");


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