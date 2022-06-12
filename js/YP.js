// 영풍문고 지점별 이름, 코드 확인
function getYPCodeNames(codeNameHTML) {
    var flag1 = '<div class="store-con">';
    var flag2 = 'branchCD=';

    var codeList = [];
    var nameList = [];

    var index = codeNameHTML.indexOf(flag1, 0)
    while (index > 1) {
        index = codeNameHTML.indexOf(flag2, index + 10)
        var tmp = ''
        for (var i = index + flag2.length; i < 100000; i++) {
            if (codeNameHTML[i] == '"') {
                break
            }
            tmp += codeNameHTML[i]
        }
        codeList.push(tmp)

        var tmp = ''
        var check = false
        for (var i = index + flag2.length; i < 100000; i++) {
            if (codeNameHTML[i] == '>') {
                check = true
                continue
            }

            if (codeNameHTML[i] == '<') {
                break
            }
            if (check) {
                tmp += codeNameHTML[i]

            }

        }

        nameList.push(tmp)
    }
    codeList.pop()
    nameList.pop()

    return [nameList, codeList]

}

// 영풍문고 지점명에 대한 위치 확인
async function getLatLonYP(searchKeyWord, ypInfoJson, userLocation, searchRange, pushObject) {
    if (searchKeyWord.length == 0) {
        return NULL;
    } else {
        await $.ajax({
            method: "GET",
            url: "https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result",
            async: false,
            data: {
                "appKey": "l7xx2c101ec10b184ce38225574befab7376",
                "searchKeyword": searchKeyWord,
                "resCoordType": "EPSG3857",
                "reqCoordType": "WGS84GEO",
                "count": 1
            },
            success: function (response) {
                var resultpoisData = response.searchPoiInfo.pois.poi;
                var noorLat = Number(resultpoisData[0].noorLat);
                var noorLon = Number(resultpoisData[0].noorLon);
                var name = resultpoisData[0].name;

                var pointCng = new Tmapv2.Point(noorLon, noorLat);
                var projectionCng = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
                    pointCng);
                var lat = projectionCng._lat;
                var lon = projectionCng._lng;

                ypInfoJson.lat = lat
                ypInfoJson.lon = lon


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
                // 35.155489508012636/*usrLocation[0]*/, 129.05959731396132/*usrLocation[1]*/
                if (getDistanceFromLatLonInKm(lat,lon, userLocation[0],userLocation[1]) <= searchRange){
                    
                pushObject(ypInfoJson)
                }




            },
            error: function (error) {
                console.error("에러 발생 : ", error);
            }
        });
    }
}

// 영풍문고 정보 결과 파서
function parserYPInfo(ypName, url, ypInfoHTML, userLocation, searchRange, pushObject) {
    var ypInfoJson = new Object();
    // 위도, 경도, 점포명, 휴관일, 운영시간, 매장 전화번호, 매장 url
    // 위도 경도 ypName으로 알아내기
    // 점포명 ypName

    INF = 10000
    //영업시간 "영업시간 :"찾고 li찾으면됨
    var index = ypInfoHTML.indexOf("영업시간 :", 0)
    var flag2 = "li>"
    index = ypInfoHTML.indexOf(flag2, index + 10)
    var ypOper = ''
    for (var i = index + flag2.length; i < INF; i++) {
        if (ypInfoHTML[i] == '<') {
            break
        }
        ypOper += ypInfoHTML[i]
    }

    // 휴관일 : 없음 
    // 전화번호 : tel:찾으면됨
    var flag1 = "tel:"
    var index = ypInfoHTML.indexOf(flag1, 0)
    var ypTel = ''
    for (var i = index + flag1.length; i < INF; i++) {
        if (ypInfoHTML[i] == '"') {
            break
        }
        ypTel += ypInfoHTML[i]
    }

    // url => url
    ypInfoJson.storeName = ypName
    ypInfoJson.closedDay = "-"
    ypInfoJson.operatingTime = ypOper
    ypInfoJson.telNum = ypTel
    ypInfoJson.url = url
    ypInfoJson.searchResult = []

    getLatLonYP('영풍문고' + ypName, ypInfoJson, userLocation, searchRange, pushObject);





}

// 영풍문고 정보 확인
async function getYPInfo(ypName, ypCode,userLocation, searchRange, pushObject) {
    url = "https://www.ypbooks.co.kr/m_store_view.yp?branchCD=" + ypCode
    await axios.get(url).then(function (result) {
        parserYPInfo(ypName, url, result['data'], userLocation, searchRange, pushObject)

    }).catch(function (error) {
        console.error("에러 발생 : ", error);
    });
}

// 영풍문고 시작
async function startYPbooks(userLocation, searchRange, makerFunction) {

    var url = "https://www.ypbooks.co.kr/m_store.yp"
    var ypName = '영풍문고';
    var ypImg = './images/youngpung.png';
    
    await axios.get(url).then(async function (result) {
        [nameList, codeList] = getYPCodeNames(result['data']);


        const resultData = []
        const pushObject = (v) => {
            resultData.push(v);
        }
        for (var i = 0; i < nameList.length; i++) {
            await getYPInfo(nameList[i], codeList[i], userLocation, searchRange, pushObject)
        }

        return resultData
    }).then(function (result) {
        console.log('result', result)
        makerFunction(result, ypName, ypImg)

    }).catch(function (error) { // 에러처리
        console.error("에러 발생 : ", error);
    });

}