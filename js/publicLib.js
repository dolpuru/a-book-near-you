//isbn의 리스트와 userLocation, searchRange, makerFunction을 받아 공공도서관의
//재고 정보 검색을 시작합니다.
async function startPublicLib(isbn, userLocation, searchRange, markerFunction) {
    
    var jsonStore = [];
    var link = 'http://data4library.kr/api/libSrch?authKey=3fd583e1d01ecad03bcfd4a9476a5a7e08b19ed817ef17dbab371f3ad097c73e&pageNo=1&pageSize=1';
    var res = await getPublicLibRequest(link);
    let numFound = parseInt(res.getElementsByTagName('numFound')[0].textContent);
    link = 'http://data4library.kr/api/libSrch?authKey=3fd583e1d01ecad03bcfd4a9476a5a7e08b19ed817ef17dbab371f3ad097c73e&pageNo=1&pageSize=' + numFound;
    var libList = await getPublicLibRequest(link);
    libList = libList.getElementsByTagName('libs')[0].getElementsByTagName('lib');


    for (var i = 0; i < numFound; i++) {
        var lat = parseFloat(libList[i].getElementsByTagName('latitude')[0].textContent);
        var lon = parseFloat(libList[i].getElementsByTagName('longitude')[0].textContent);
        if (getDistanceFromLatLonInKm(userLocation[0], userLocation[1], lat, lon) > searchRange) {
            console.log('out of ',searchRange,'km');
            continue;
        }
        var storeObj = new Object();
        storeObj.searchResult = [];
        var pos = -1;
        for (var j = 0; j < isbn.length; j++) {
            let ln = 'http://data4library.kr/api/bookExist?authKey=3fd583e1d01ecad03bcfd4a9476a5a7e08b19ed817ef17dbab371f3ad097c73e&libCode='
                + libList[i].getElementsByTagName('libCode')[0].textContent + '&isbn13=' + isbn[j];
            var result = await getPublicLibRequest(ln);
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

            var bookInfo = await getPublicLibBookInfo(isbn[j]);
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
            if (pos == -1) {

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
    markerFunction(jsonStore, "공공도서관", "./images/yes24.png");
    //책정보를 가져옵니다.
    function getPublicLibBookInfo(isbn) {
        let url =
            "https://www.nl.go.kr/seoji/SearchApi.do?cert_key=26946e3d5253c3fa71ccf451aeab972c7a303cbdc213c80c7306c9d1374255b9&isbn=" +
            isbn + "&result_style=json&page_no=1&page_size=1";
        return fetch(url).then(res => res.json());
    }
    //도서관 API를 요청하는 함수입니다.
    function getPublicLibRequest(url) {
        return fetch(url).then(res => res.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml")
        );
    }
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        function deg2rad(deg) {
            return deg * (Math.PI / 180)
        }
        var R = 6371; // searchRange of the earth in km
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
}
