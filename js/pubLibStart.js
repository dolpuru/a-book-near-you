async function pubLibStart(isbn, usrLocation, radius,makerFunction) {
    //isbn is []
    var jsonStore = [];
    var link = 'http://data4library.kr/api/libSrch?authKey=3fd583e1d01ecad03bcfd4a9476a5a7e08b19ed817ef17dbab371f3ad097c73e&pageNo=1&pageSize=1';
    var res = await getRequest2(link);
    console.log(res);
    console.log('start');
    let numFound = parseInt(res.getElementsByTagName('numFound')[0].textContent);
    link = 'http://data4library.kr/api/libSrch?authKey=3fd583e1d01ecad03bcfd4a9476a5a7e08b19ed817ef17dbab371f3ad097c73e&pageNo=1&pageSize=' + numFound;
    var libList = await getRequest2(link);
    libList = libList.getElementsByTagName('libs')[0].getElementsByTagName('lib');
    console.log(libList);

    for (var i = 0; i < numFound; i++) {
        var lat = parseFloat(libList[i].getElementsByTagName('latitude')[0].textContent);
        var lon = parseFloat(libList[i].getElementsByTagName('longitude')[0].textContent);
        if (getDistanceFromLatLonInKm(35.155489508012636/*usrLocation[0]*/, 129.05959731396132/*usrLocation[1]*/, lat, lon) > radius) {
            console.log('out of 3km');
            continue;
        }
        var storeObj = new Object();
        storeObj.searchResult = [];
        var pos = -1;
        for (var j = 0; j < isbn.length; j++) {
            let ln = 'http://data4library.kr/api/bookExist?authKey=3fd583e1d01ecad03bcfd4a9476a5a7e08b19ed817ef17dbab371f3ad097c73e&libCode='
                + libList[i].getElementsByTagName('libCode')[0].textContent + '&isbn13=' + isbn[j];
            var result = await getRequest2(ln);
            result = result.getElementsByTagName('result')[0];
            var stock = 0;
            if ((result.getElementsByTagName('hasBook')[0].textContent == "N") || (result.getElementsByTagName('loanAvailable')[0].textContent == "N")) {
                continue;
            } else {
                stock = 1;
            }
            //책이 있다면
            var libName = libList[i].getElementsByTagName('libName')[0].textContent;
            var tel = libList[i].getElementsByTagName('tel')[0].textContent;
            var url = libList[i].getElementsByTagName('homepage')[0].textContent;
            var closed = libList[i].getElementsByTagName("closed")[0];
            if (typeof closed == "undefined") {
                closed = "-";
            }
            else {
                closed = closed.textContent;
            }
            var operatingTime = libList[i].getElementsByTagName("operatingTime")[0];
            if (typeof operatingTime == "undefined") {
                operatingTime = "-";
            }
            else {
                operatingTime = operatingTime.textContent;
            }

            var bookInfo = await getBookInfo(isbn[j]);
            bookInfo = bookInfo['docs'][0];
            var title = bookInfo['TITLE'];
            var price = '-';
            var author = bookInfo['AUTHOR'];
            var publisher = bookInfo['PUBLISHER'];

            var jsonSearch = new Object();
            jsonSearch.title = title;
            jsonSearch.price = price;
            jsonSearch.author = author;
            jsonSearch.publisher = publisher;
            jsonSearch.stock = stock;
            if(pos == -1){

                storeObj.lat = lat;
                storeObj.lon = lon;
                storeObj.storeName = libName;
                storeObj.closedDay = closed;
                storeObj.operatingTime = operatingTime;
                storeObj.url = url;
                storeObj.telNum = tel;
                storeObj.searchResult.push(jsonSearch);
                jsonStore.push(storeObj);
                pos = jsonStore.length - 1;
                continue;
            } else {
                jsonStore[pos].searchResult.push(jsonSearch);
                continue;
            }
        }
    }
    console.log(jsonStore);
    makerFunction(jsonStore,"공공도서관","./images/yes24.png");













































    function getBookInfo(isbn) {
        //console.log(isbn);
        let url =
            "https://www.nl.go.kr/seoji/SearchApi.do?cert_key=26946e3d5253c3fa71ccf451aeab972c7a303cbdc213c80c7306c9d1374255b9&isbn=" +
            isbn + "&result_style=json&page_no=1&page_size=1";
        return fetch(url).then(res => res.json());
    }

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        function deg2rad(deg) {
            return deg * (Math.PI / 180)
        }
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1); // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }


    function getRequest2(url) {
        console.log(url);
        return fetch(url).then(res => res.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/xml"));
    }

    function getRequest(link, value) {
        var httpRequest;
        var result;
        httpRequest = new XMLHttpRequest();
        if (!httpRequest) {
            console.log('XMLHTTP dont make');
            return false;
        }
        httpRequest.onreadystatechange = getContents;

        httpRequest.open('GET', link, value); //false 동기 true 비동기
        httpRequest.send();

        return result;
        function getContents() {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    //여기 var적어야함
                    var data = httpRequest.responseXML;
                    result = data;

                } else {
                    console.log('request problem');
                }
            }
        }
    }
}

