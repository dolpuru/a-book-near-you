async function aladinStart(isbn, usrLocation, radius, markerFunction) { //isbn is []
    //usrLocation = [lat, lon];
    // <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
    //<script src="https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=l7xx2c101ec10b184ce38225574befab7376"></script>
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
    function insertData(jsonSearch, storeObj) {
        if (jsonStore.length == 0) {
            storeObj.searchResult = [];
            storeObj.searchResult.push(jsonSearch);
            jsonStore.push(storeObj);
            return;
        }

        for (var i = 0; i < jsonStore.length; i++) {
            if (jsonStore[i].storeName == storeObj.storeName) {//겹치는게 있다면
                jsonStore[i].searchResult.push(jsonSearch);
                return;
            }
        }
        //겹치는게 없다면
        storeObj.searchResult = [];
        storeObj.searchResult.push(jsonSearch);
        jsonStore.push(storeObj);
        console.log('jsonStore,', jsonStore)
        return;
    }

    for (var i = 0; i < isbn.length; i++) {
        //console.log(isbn[i]);
        var link = 'http://www.aladin.co.kr/ttb/api/ItemOffStoreList.aspx?ttbkey=ttbgbdngb41452001&itemIdType=ISBN13&ItemId='
            + isbn[i] + '&output=xml';
        var offList = await getRequest2(link);
        //console.log(offList);
        offList = offList.getElementsByTagName('itemOffStoreList')[0];//.getElementsByTagName('offCode');
        var offCodeList = offList.getElementsByTagName('offCode');
        var offName = offList.getElementsByTagName('offName');
        //console.log(offCodeList, offName);
        await getStock(isbn[i], offCodeList, offName, insertData);
    }
    console.log(TEMP = jsonStore);
    markerFunction(jsonStore,"알라딘",'./images/aladin.png');
    return jsonStore;

    async function getStock(isbn, offCodeList, offName, insertData) {
        for (var i = 0; i < offCodeList.length; i++) {
            //map.put(offName[i].textContent, "atspeed");
            //map.get("user_id");
            var pos;
            if (typeof map.get(offName[i].textContent) == "undefined") {//만약 해당 매장의 정보가 없다면   
                console.log("API");
                pos = await getLatLon2("알라딘 " + offName[i].textContent);
                map.put(offName[i].textContent, pos);
            }
            else {//해당 매장 정보가 있다면
                console.log('HashMap get');
                pos = map.get(offName[i].textContent);
            }
            //console.log(pos);
            if (getDistanceFromLatLonInKm(35.155489508012636/*usrLocation[0]*/, 129.05959731396132/*usrLocation[1]*/, pos[0], pos[1]) > radius) {
                console.log('out of', radius, 'km');
                continue;
            }

            var link = 'http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=ttbgbdngb41452001&offCode='
                + offCodeList[i].textContent + '&itemIdType=ISBN13&ItemId=' + isbn + '&output=xml&Version=20131101&OptResult=ebookList,usedList,reviewList';
            data = await getRequest2(link);

            //console.log(data);

            //Store
            var lat = pos[0];
            var lon = pos[1];
            var storeName = data.getElementsByTagName('offName')[0].textContent;
            var closedDay = '-';
            var operatingTime = '-';
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

            //
            insertData(jsonSearch, storeObj);

        }
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

    async function getLatLon2(searchKeyword) {
        res = await getData(searchKeyword);
        //console.log(searchKeyword);
        //console.log(res);
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

    function getRequest2(url) {
        return fetch(url).then(res => res.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/xml"));
    }
}
