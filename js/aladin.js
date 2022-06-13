//isbn리스트와 사용자의위치(userLocation)와 검색반경(userLocation)과, makerFunction을 매개변수로 받아
//알라딘 중고서점의 재고 검색을 시작합니다.
async function startAladin(isbn, userLocation, searchRange, markerFunction) { //isbn is []
    //HashMap 자료형 정의
    HashMap = function () {
        this.map = new Array();
    };
    HashMap.prototype = {
        put: function (key, value) {
            this.map[key] = value;
        },
        get: function (key) {
            return this.map[key];
        },
        getAll: function () {
            return this.map;
        },
        clear: function () {
            this.map = new Array();
        },
        getKeys: function () {
            var keys = new Array();
            for (i in this.map) {
                keys.push(i);
            }
            return keys;
        }
    };
    var map = new HashMap();
    var jsonStore = [];

    for (var i = 0; i < isbn.length; i++) {
        var link = 'http://www.aladin.co.kr/ttb/api/ItemOffStoreList.aspx?ttbkey=ttbgbdngb41452001&itemIdType=ISBN13&ItemId=' +
            isbn[i] + '&output=xml';
        var offList = await getAladinRequest(link);
        console.log(offList);
        offList = offList.getElementsByTagName('itemOffStoreList')[0];
        if (typeof offList == "undefined") {
            continue;
        }
        var offCodeList = offList.getElementsByTagName('offCode');
        var offName = offList.getElementsByTagName('offName');
        await getAladinStock(isbn[i], offCodeList, offName, insertAladinData);
    }
    markerFunction(jsonStore, "알라딘", './images/aladin.png');
    return jsonStore;
    //알라딘중고서점의 책재고 정보를 삽입하는 함수입니다.
    function insertAladinData(jsonSearch, storeObj) {
        if (jsonStore.length == 0) {
            storeObj.searchResult = [];
            storeObj.searchResult.push(jsonSearch);
            jsonStore.push(storeObj);
            return;
        }

        for (var i = 0; i < jsonStore.length; i++) {
            if (jsonStore[i].storeName == storeObj.storeName) { //겹치는게 있다면
                jsonStore[i].searchResult.push(jsonSearch);
                return;
            }
        }
        //겹치는게 없다면
        storeObj.searchResult = [];
        storeObj.searchResult.push(jsonSearch);
        jsonStore.push(storeObj);
        return;
    }

    //알라딘 중고서점의 재고를 가져오는 함수입니다.
    async function getAladinStock(isbn, offCodeList, offName, insertAladinData) {
        var storeInfoMap = new HashMap();
        for (var i = 0; i < offCodeList.length; i++) {
            var pos;
            if (typeof map.get(offName[i].textContent) == "undefined") { //만약 해당 매장의 위치정보가 없다면
                console.log("API");
                pos = await getAladinLatLon("알라딘 " + offName[i].textContent);
                map.put(offName[i].textContent, pos);
            } else { //해당 매장의 위치정보가 있다면
                console.log('HashMap get');
                pos = map.get(offName[i].textContent);
            }
            if (getDistanceFromLatLonInKm(userLocation[0], userLocation[1], pos[0], pos[1]) > searchRange) {
                console.log('out of', searchRange, 'km');
                continue;
            }

            var link = 'http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=ttbgbdngb41452001&offCode=' +
                offCodeList[i].textContent + '&itemIdType=ISBN13&ItemId=' + isbn + '&output=xml&Version=20131101&OptResult=ebookList,usedList,reviewList';
            var data = await getAladinRequest(link);
            console.log(data);
            //Store
            var lat = pos[0];
            var lon = pos[1];
            var storeName = data.getElementsByTagName('offName')[0].textContent;
            var closedDay = "휴무 정보가 제공되지 않습니다";
            var operatingTime = "운영 정보가 제공되지 않습니다";
            var telNum = '1544-2514';
            var url = data.getElementsByTagName('offStoreInfo')[0].getElementsByTagName('link')[0].textContent;
            var storeObj = new Object();
            storeObj.lat = lat;
            storeObj.lon = lon;
            storeObj.storeName = storeName;
            storeObj.closedDay = closedDay;
            storeObj.telNum = telNum;
            storeObj.operatingTime = operatingTime;
            storeObj.url = url;
            //storeObj.searchResult = [];
            //

            //jsonSearch
            var title = data.getElementsByTagName('title')[1].textContent;
            var price = data.getElementsByTagName('offStoreInfo')[0].getElementsByTagName('minPrice')[0].textContent;
            var author = data.getElementsByTagName('author')[0].textContent;
            var publisher = data.getElementsByTagName('publisher')[0].textContent;
            var stock = data.getElementsByTagName('stockCount')[0].textContent;

            var jsonSearch = new Object();
            jsonSearch.title = title;
            jsonSearch.price = price;
            jsonSearch.author = author;
            jsonSearch.publisher = publisher;
            jsonSearch.stock = stock;
            /*if(typeof storeInfoMap.get(offName[i].textContent) == "undefined") { //인덱스 정보가 없다면
                console.log("책이 없음");
                storeObj.searchResult = [];
                storeObj.searchResult.push(jsonSearch);
                jsonStore.push(storeObj);
                storeInfoMap.put(offName[i].textContent, jsonStore.length - 1);
            } else {
                console.log("이미 책이있음");
                var index = storeInfoMap.get(offName[i].textContent);
                console.log('index: ',index);
                jsonStore[index].searchResult.push(jsonSearch);
            }*/

            insertAladinData(jsonSearch, storeObj);

        }
    }

    //위도 경도값으로 km 거리를 계산합니다.
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
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }
    //TMAP API를 이용한 위도, 경도를 가져오는 함수입니다.
    async function getAladinLatLon(searchKeyword) {
        res = await getData(searchKeyword);
        var resultpoisData = res.searchPoiInfo.pois.poi;
        var noorLat = Number(resultpoisData[0].noorLat);
        var noorLon = Number(resultpoisData[0].noorLon);

        var pointCng = new Tmapv2.Point(noorLon, noorLat);
        var projectionCng = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(pointCng);

        var lat = projectionCng._lat;
        var lon = projectionCng._lng;
        return [lat, lon];
        async function getData(searchKeyword) {
            res = await $.ajax({
                method: "GET",
                url: "https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result",
                async: false,
                data: {
                    "appKey": "l7xx2c101ec10b184ce38225574befab7376",
                    "searchKeyword": searchKeyword,
                    "resCoordType": "EPSG3857",
                    "reqCoordType": "WGS84GEO",
                    "count": 10
                },
                error: function (request, status, error) {
                    console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
                }
            });
            return res;
        }
    }
    //비동기식 Promise객체를 반환하는 API를 요청하는 함수입니다.
    function getAladinRequest(url) {
        return fetch(url).then(res => res.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/xml"));
    }
}