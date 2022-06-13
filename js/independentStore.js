
//주변의 독립서점을 검색합니다.
function startIndependentStore(isbn, userLocation, searchRange, markerFunction) {
    var jsonStore = [];

    //jsonData를 Object객체로 변환합니다.
    var parseData = JSON.parse(JSON.stringify(Params));

    for (var i = 0; i < parseData.length; i++) {
        var lat = parseFloat(parseData[i]['FCLTY_LA']);
        var lon = parseFloat(parseData[i]['FCLTY_LO']);

        if (getDistanceFromLatLonInKm(lat, lon, userLocation[0], userLocation[1]) > searchRange) {
            console.log('Out of 3km');
            continue;
        } else {
            var storeName = parseData[i]['FCLTY_NM'];
            var closedDay = parseData[i]['RSTDE_GUID_CN'];
            if (closedDay == "0") {
                closedDay = "휴무 정보를 제공하지 않습니다.";
            }
            var operatingTime = parseOperatingTime(parseData[i]);
            var telNum = parseData[i]['TEL_NO'];
            if (telNum == "0") {
                telNum = "전화번호 정보를 제공하지 않습니다.";
            }
            var url = "-";
            var obj = new Object();
            obj.lat = lat;
            obj.lon = lon;
            obj.storeName = storeName;
            obj.closedDay = closedDay;
            obj.operatingTime = operatingTime;
            obj.telNum = telNum;
            obj.url = url;
            obj.searchResult = [];
            jsonStore.push(obj);
        }
    }
    markerFunction(jsonStore, "독립서점 및 아동서점", "./images/yes24.png");
    return jsonStore;

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

//운영시간정보를 정제합니다.
function parseOperatingTime(parse) {
    var satOpen = parse['SAT_OPN_BSNS_TIME'];
    var satClosed = parse['SAT_CLOS_TIME'];
    var sunOpen = parse['SUN_OPN_BSNS_TIME'];
    var sunClosed = parse['SUN_CLOS_TIME'];
    var workOpen = parse['WORKDAY_OPN_BSNS_TIME'];
    var workClosed = parse['WORKDAY_CLOS_TIME'];

    var sat = "";
    var sun = "";
    var work = "";
    if (satOpen != "0") {
        if (satOpen.length == 3) {
            satOpen = satOpen.slice(0, 1) + ":" + satOpen.slice(1, 3);
        }
        else {
            satOpen = satOpen.slice(0, 2) + ":" + satOpen.slice(2, 4);
        }
        sat += satOpen + '~';
    }

    if (satClosed != "0") {
        if (satClosed.length == 3) {
            satClosed = satClosed.slice(0, 1) + ":" + satClosed.slice(1, 3);
        }
        else {
            satClosed = satClosed.slice(0, 2) + ":" + satClosed.slice(2, 4);
        }
        if(sat.indexOf('~') == -1){
            sat += '~' + satClosed;
        } else {
            sat += satClosed;
        }
    } else {
        sat += "";
    }

    if (sunOpen != "0") {
        if (sunOpen.length == 3) {
            sunOpen = sunOpen.slice(0, 1) + ":" + sunOpen.slice(1, 3);
        }
        else {
            sunOpen = sunOpen.slice(0, 2) + ":" + sunOpen.slice(2, 4);
        }
        sun += sunOpen + '~';
    }

    if (sunClosed != "0") {
        if (sunClosed.length == 3) {
            sunClosed = sunClosed.slice(0, 1) + ":" + sunClosed.slice(1, 3);
        }
        else {
            sunClosed = sunClosed.slice(0, 2) + ":" + sunClosed.slice(2, 4);
        }
        if(sun.indexOf('~') == -1){
            sun += '~' + sunClosed;
        } else {
            sun+= sunClosed;
        }
    } else {
        sun += "";
    }

    if (workOpen != "0") {
        if (workOpen.length == 3) {
            workOpen = workOpen.slice(0, 1) + ":" + workOpen.slice(1, 3);
        }
        else {
            workOpen = workOpen.slice(0, 2) + ":" + workOpen.slice(2, 4);
        }
        
        work += workOpen + '~';
    }

    if (workClosed != "0") {
        if (workClosed.length == 3) {
            workClosed = workClosed.slice(0, 1) + ":" + workClosed.slice(1, 3);
        }
        else {
            workClosed = workClosed.slice(0, 2) + ":" + workClosed.slice(2, 4);
        }
        if(work.indexOf('~') == -1){
            work += '~' + workClosed;
        } else {
            work+= workClosed;
        }
    } else {
        work += "";
    }
    var result = "평일 : " + work + " 토요일 : " + sat + " 일요일 : " + sun;
    return result;
}