import axios from 'axios'
import cheerio from 'cheerio'
const axios = require("axios");
const cheerio = require("cheerio");

axios.get("http://example.com/")
    .then((response) => {
        const htmlString = response.data;
        const $ = cheerio.load(htmlString);
        const data = $('h1').text();
        console.log(data);
    })