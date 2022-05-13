//import axios from 'axios'
//import cheerio from 'cheerio'

const axios2 = require("axios");
const cheerio2 = require("cheerio");

axios2.get("http://example.com/")
    .then((response) => {
        const htmlString = response.data;
        const $ = cheerio.load(htmlString);
        const data = $('h1').text();
        console.log(data);
    })