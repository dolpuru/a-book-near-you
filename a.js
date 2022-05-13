// // import axios2 from 'axios'
// // import cheerio2 from 'cheerio'

// const axios2 = require("axios");
// const cheerio2 = require("cheerio");

axios.get("http://example.com/")
    .then((response) => {
        const htmlString = response.data;
        const $ = cheerio.load(htmlString);
        const data = $('h1').text();
        console.log(data);
    })       
//  axios

//         .get("https://jsonplaceholder.typicode.com/todos/1")

//         .then(function (result) {

//         console.log("통신 결과 : ", result);

//         console.log("status : ", result.status);

//         console.log("data : ", result.data);

//         })

//         .catch(function (error) {

//         console.log("에러 발생 : ", error);

//         });

//         console.log("바로 실행 로그");