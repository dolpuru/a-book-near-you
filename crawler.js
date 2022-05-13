axios.get("https://jsonplaceholder.typicode.com/todos/1").then(function (result) {
    console.log("통신 결과 : ", result);
    console.log("status : ", result.status);
    console.log("data : ", result.data['id']);
}).catch(function (error) {
    console.log("에러 발생 : ", error);
});
console.log("바로 실행 로그");