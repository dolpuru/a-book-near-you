//<script type="text/javascript" src="./TEST.json"></script>
function startIndependentStore(isbn, usrLocation, radius,makerFunction) {
    var jsonStore = [];

    var parseData = JSON.parse(JSON.stringify(Params));
    console.log(parseData);
    for (var i = 0; i < parseData.length; i++) {
        var lat = parseFloat(parseData[i]['FCLTY_LA']);
        var lon = parseFloat(parseData[i]['FCLTY_LO']);
        if (getDistanceFromLatLonInKm(lat, lon, 35.155489508012636/*usrLocation[0]*/, 129.05959731396132/*usrLocation[1]*/) > radius) {
            console.log('Out of 3km');
            continue;
        } else {
            var storeName = parseData[i]['FCLTY_NM'];
            var closedDay = parseData[i]['RSTDE_GUID_CN'];
            if (closedDay == "0") {
                closedDay = "-";
            }
            var operatingTime = parseOperatingTime(parseData[i]);
            var telNum = parseData[i]['TEL_NO'];
            console.log(telNum);
            if (telNum == "0") {
                telNum = "-";
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
    //console.log(jsonStore);
    makerFunction(jsonStore,"독립서점 및 아동서점", "./images/yes24.png");
    return jsonStore;
    function parseOperatingTime(parse) {
        var satOpen = parse['SAT_OPN_BSNS_TIME'];
        var satClosed = parse['SAT_CLOS_TIME'];
        var sunOpen = parse['SUN_OPN_BSNS_TIME'];
        var sunClosed = parse['SUN_CLOS_TIME'];
        var workOpen = parse['WORKDAY_OPN_BSNS_TIME'];
        var workClosed = parse['WORKDAY_CLOS_TIME'];

        if (satOpen != "0") {
            if (satOpen.length == 3) {
                satOpen = satOpen.slice(0, 1) + ":" + satOpen.slice(1, 3);
            }
            else {
                satOpen = satOpen.slice(0, 2) + ":" + satOpen.slice(2, 4);
            }
        } else {
            satOpen = '-';
        }

        if (satClosed != "0") {
            if (satClosed.length == 3) {
                satClosed = satClosed.slice(0, 1) + ":" + satClosed.slice(1, 3);
            }
            else {
                satClosed = satClosed.slice(0, 2) + ":" + satClosed.slice(2, 4);
            }
        } else {
            satClosed = '-';
        }

        if (sunOpen != "0") {
            if (sunOpen.length == 3) {
                sunOpen = sunOpen.slice(0, 1) + ":" + sunOpen.slice(1, 3);
            }
            else {
                sunOpen = sunOpen.slice(0, 2) + ":" + sunOpen.slice(2, 4);
            }
        } else {
            sunOpen = '-';
        }

        if (sunClosed != "0") {
            if (sunClosed.length == 3) {
                sunClosed = sunClosed.slice(0, 1) + ":" + sunClosed.slice(1, 3);
            }
            else {
                sunClosed = sunClosed.slice(0, 2) + ":" + sunClosed.slice(2, 4);
            }
        } else {
            sunClosed = '-';
        }

        if (workOpen != "0") {
            if (workOpen.length == 3) {
                workOpen = workOpen.slice(0, 1) + ":" + workOpen.slice(1, 3);
            }
            else {
                workOpen = workOpen.slice(0, 2) + ":" + workOpen.slice(2, 4);
            }
        } else {
            workOpen = '-';
        }

        if (workClosed != "0") {
            if (workClosed.length == 3) {
                workClosed = workClosed.slice(0, 1) + ":" + workClosed.slice(1, 3);
            }
            else {
                workClosed = workClosed.slice(0, 2) + ":" + workClosed.slice(2, 4);
            }
        } else {
            workClosed = '-';
        }
        var result = "평일 : " + workOpen + "~" + workClosed + " 토요일 : " + satOpen + '~' + satClosed + " 일요일 : " + sunOpen + '~' + sunClosed;
        return result;
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
}