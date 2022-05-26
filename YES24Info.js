// ~~입력받아서 ~~형태를 return 합니다.

// http://www.yes24.com/Mall/UsedStore/Detail/Seomyeon
function getYes24Info(storeName){

    for(var i = 0; i<storeName.length; i++){
    var url = "http://www.yes24.com/Mall/UsedStore/Detail/" + storeName[i][0];
    axios.get(url).then(function (result) {
        console.log("통신 결과 : ", result);
    }).catch(function (error) {
        console.log("에러 발생 : ", error);
    });
    console.log("바로 실행 로그");

}

    // return jsonList
}


