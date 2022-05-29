function getYPCodeNames(codeNameHTML) {
    var flag1 = '<div class="store-con">';
    var flag2 = 'branchCD=';

    var codeList = [];
    var NameList = [];

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

        NameList.push(tmp)
    }
    codeList.pop()
    NameList.pop()

    return [NameList, codeList]

}

async function getLatLonYP(searchKeyWord, ypInfoJson, pushObject) {
    //document.write("<script src='https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=l7xx2c101ec10b184ce38225574befab7376'></script>");
    //document.write("<script src='https://code.jquery.com/jquery-3.2.1.min.js'></script>");
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
                "count": 10
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
                pushObject(ypInfoJson)
            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request
                    .responseText + "\n" + "error:" + error);
            }
        });
    }
}




function ypInfoParser(ypName, url, ypInfoHTML, pushObject) {
    var ypInfoJson = new Object();
    // 위도, 경도, 점포명, 휴관일, 운영시간, 매장 전화번호, 매장 url
    // 위도 경도 ypName으로 알아내기
    // 점포명 ypName

    //영업시간 "영업시간 :"찾고 li찾으면됨

    var index = ypInfoHTML.indexOf("영업시간 :", 0)
    var flag2 = "li>"
    index = ypInfoHTML.indexOf(flag2, index + 10)
    var ypOper = ''
    for (var i = index + flag2.length; i < 10000; i++) {
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
    for (var i = index + flag1.length; i < 10000; i++) {
        if (ypInfoHTML[i] == '"') {
            break
        }
        ypTel += ypInfoHTML[i]
    }

    // url => url

    ypInfoJson.storeName = ypName
    ypInfoJson.closeDay = "-"
    ypInfoJson.opertingTime = ypOper
    ypInfoJson.telNum = ypTel
    ypInfoJson.url = url
    ypInfoJson.searchResult = []

    getLatLonYP('영풍문고' + ypName, ypInfoJson, pushObject);





}



async function getYPInfo(ypName, ypCode, pushObject) {
    await axios.get("https://www.ypbooks.co.kr/m_store_view.yp?branchCD=" + ypCode).then(function (result) {
        ypInfoParser(ypName, "https://www.ypbooks.co.kr/m_store_view.yp?branchCD=" + ypCode, result['data'], pushObject)
        // console.log(ypName)
        // console.timeLog()
    }).catch(function (error) {
        console.error("에러 발생 : ", error);
    });
}


async function getYPbooks(tempFunction) {
    await axios.get("https://www.ypbooks.co.kr/m_store.yp").then(async function (result) {
        [NameList, codeList] = getYPCodeNames(result['data']);

        // console.log('tester', codeList)
        const resultData = []
        const pushObject = (v) => {
            resultData.push(v);
        }
        for (var i = 0; i < NameList.length; i++) {
            await getYPInfo(NameList[i], codeList[i], pushObject)
        }

        return resultData
    }).then(function (result) {
        console.log('result', result)
        tempFunction(result, '영풍문고', './images/youngpung.png')

    }).catch(function (error) {
        console.error("에러 발생 : ", error);
    });

}