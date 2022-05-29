function parserYes24Name(nameHtml) {
    var flag = '<li><a href="/Mall/UsedStore/Detail/';
    var index = nameHtml.indexOf(flag, 0)
    var codeNameList = new Array();

    while (index > 0) {
        if (index > 0) {
            var appendPath = '';
            var checkAppendPath = true;
            var appendName = '';
            var checkAppendName = 0;

            for (var i = index + flag.length; i < 10000000; i++) {
                if (checkAppendPath == true) {
                    if (nameHtml[i] == '"') {
                        checkAppendPath = false;
                        continue;
                    }
                    appendPath += nameHtml[i];
                }


                if (checkAppendName >= 2) {
                    if (nameHtml[i] == "<") {
                        break;
                    } else {
                        appendName += nameHtml[i];
                    }
                }

                if (nameHtml[i] == '>') {
                    checkAppendName += 1
                }

            }
            codeNameList.push([appendPath, appendName.trimEnd()]);

        }

        index = nameHtml.indexOf(flag, index + 1)

    }

    return codeNameList;

}

function parserYes24Info(nameHtml) {
    var Yes24InfoList = new Array();
    var flagLocal = '주소 : ';
    var index = nameHtml.indexOf(flagLocal, 0)
    var tmpValue = ''
    for (var i = index + flagLocal.length; i < 10000000; i++) {
            if (nameHtml[i] == '<') {
                break;
            }
            tmpValue += nameHtml[i];
    }
    Yes24InfoList.push(tmpValue);


    var flagNumber = '연락처 : ';
    var index = nameHtml.indexOf(flagNumber, 0)
    var tmpValue = ''
    for (var i = index + flagLocal.length; i < 10000000; i++) {
            if (nameHtml[i] == '<') {
                break;
            }
            tmpValue += nameHtml[i];
    }
    Yes24InfoList.push(tmpValue);

    var flagTime = '영업시간 : ';
    var index = nameHtml.indexOf(flagTime, 0)
    var tmpValue1 = ''
    var tmpValue2 = ''
    var flagIndex = true
    for (var i = index + flagTime.length; i < 10000000; i++) {
        if (nameHtml[i] == '<') {
            break;
        }    
        if (nameHtml[i] == '/'){
                flagIndex = false;
                continue
            }    
        if (flagIndex==true){
                tmpValue1 += nameHtml[i]
            }
        else if (flagIndex==false){
            tmpValue2 += nameHtml[i];
        }
    }
    Yes24InfoList.push(tmpValue1, tmpValue2);

    return Yes24InfoList; // [주소, 연락처, 영업시간, 휴관일]

}



var returnYes24Info = new Array();
function getLatLon(searchKeyWord, data, test, url) {
    var Yes24InfoJson = new Object();
    //document.write("<script src='https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=l7xx2c101ec10b184ce38225574befab7376'></script>");
    //document.write("<script src='https://code.jquery.com/jquery-3.2.1.min.js'></script>");
    if (searchKeyWord.length == 0) {
        return NULL;
    } else {
        $.ajax({
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
                // console.log("lat: ", lat, " lon: ", lon);
                Yes24InfoJson.lat = lat; // data[0] 을 좌표로 변환하는 함수 필요 
                Yes24InfoJson.lon = lon;
                Yes24InfoJson.storeName = test
                Yes24InfoJson.closeDay = data[3];
                Yes24InfoJson.opertingTime = data[2];
                Yes24InfoJson.telNum = data[1];
                Yes24InfoJson.url = url;
                Yes24InfoJson.searchResult = [];
                // console.log("통신 결과 : ", Yes24InfoJson);
                // return Yes24InfoJson;
                returnYes24Info.push(Yes24InfoJson);

                // return [lat, lon];
            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request
                    .responseText + "\n" + "error:" + error);
            }
        });
    }
}



async function getYes24Info(i, storeName){ // 재고를 제외하고 JSON명세에 맞춰서 return 해준다.
    
        var url = "http://www.yes24.com/Mall/UsedStore/Detail/" + storeName[i][0];
        var test = storeName[i][1];
        
        await axios.get(url).then(function (result) { // 결과 발생시에만 push
            var data = parserYes24Info(result['data']);
            getLatLon('Yes24 ' + test, data, test, url);
            
            
            // console.log(storeName[i][1]);
        
            
        }).catch(function (error) {
            console.log("에러 발생 : ", error);
        });
}




// <span class="gd_name"> 제목
// <span class="authPub info_auth"> 저자
// <span class="authPub info_pub"> 출판사
// <em class="yes_b"> 가격
// <em class="txC_blue">를 찾아 매장 갯수를 알아놓는다.
//info_row info_storeLoca를 찾는다. => <strong>찾는다. => 부산 서면점 =>  <span class="bit"> => 재고 갯수
// 이후 '부산 서면점', '서울 강서점'등의 결과가 나온다.
// [{id:부산서면점, 제목: 제목, . . ..}, ] 을 돌면서 추가한다.
function parserYes24Stock(stockHtml) {
    var flag = '<span class="gd_name">'; // 제목
    var flag2 = '<span class="authPub info_auth">'; // 저자
    var flag3 = '<span class="authPub info_pub">'; // 출판사
    var flag4 = '<em class="yes_b">'; // 가격
    var flag5 = '<em class="txC_blue">';
    var flag6 = '<strong>'; //지점
    var flag7 = '<span class="bit">'; // 재고


    var codeNameList = new Array();
    var index = stockHtml.indexOf(flag, 0);

    // 제목 parse
    var gd_name = ''
    for (var i = index + flag.length; i< 1000000; i++){
        if (stockHtml[i] == '>'){
            continue
        }
        else if (stockHtml[i] == '<'){
            index = i
            break
        }
        gd_name += stockHtml[i]
    }


    var info_auth = ''
    var authPubFlag = false
    index = stockHtml.indexOf(flag2, index);
    for (var i = index + flag2.length+30; i< 1000000; i++){
        if (stockHtml[i] == '>'){
            authPubFlag = true
            continue
        }
        if (stockHtml[i] == '<'){
            index = i
            break
        }
        if (authPubFlag==true){
            info_auth += stockHtml[i]    
        }
        
    }


    var info_pub = ''
    var info_pubFlag = false
    index = stockHtml.indexOf(flag3, index);
    for (var i = index + flag3.length+30; i< 1000000; i++){
        if (stockHtml[i] == '>'){
            info_pubFlag = true
            continue
        }
        if (stockHtml[i] == '<'){
            index = i
            break
        }
        if ( info_pubFlag==true){
            info_pub += stockHtml[i]    
        }
        
    }

    var price = ''
    index = stockHtml.indexOf(flag4, index);
    for (var i = index + flag4.length+1; i< 1000000; i++){
        if (stockHtml[i] == '<'){
            index = i
            break
        }
        price += stockHtml[i]            
    }


    var storeCount = 0
    index = stockHtml.indexOf(flag5, index);
    for (var i = index + flag5.length; i< 1000000; i++){
        if (stockHtml[i] == '<'){
            index = i
            break
        }

        storeCount += stockHtml[i]            
    }
    const regex = /[^0-9]/g;
    var storeCountValue = storeCount.replace(regex, "");
    var cnt = Number(storeCountValue)
    // console.log(Number(storeCountValue))

    var flag6 = '<strong>'; //지점
    var flag7 = '<span class="bit">'; // 재고
    var storeStockList = new Array();
    for (var i = 0; i<cnt; i++){

        index = stockHtml.indexOf(flag6, index);
        var tmp_value = ''
        for (var j = index + flag6.length; j< 1000000; j++){
            if (stockHtml[j] == '<'){
                index = j
                break
            }
            tmp_value += stockHtml[j]            
        }

        
        index = stockHtml.indexOf(flag7, index);
        var tmp_value2 = ''
        for (var j = index + flag7.length; j< 1000000; j++){
            if (stockHtml[j] == '<'){
                index = j
                break
            }
            tmp_value2 += stockHtml[j]            
        }
        
        storeStockList.push([tmp_value, tmp_value2])

    }

    // console.log('gd_name', gd_name);
    // console.log('info_auth', info_auth);
    
    // console.log('info_pub', info_pub);
    // console.log('price', price);
    // console.log('storeCount', storeCountValue);
    // console.log('storeStockList', storeStockList);
    
    // console.log('returnYes24Info', returnYes24Info)

    var appendObject = new Object();
        appendObject.title = gd_name
        appendObject.price = price
        appendObject.author = info_auth;
        appendObject.publisher = info_pub;
        
    for (var i = 0; i< storeStockList.length; i++){
        
        for (var j =0; j< returnYes24Info.length; j++){
            if (returnYes24Info[j]['storeName'] == storeStockList[i][0]){
                appendObject.stock = storeStockList[i][1]
                returnYes24Info[j]['searchResult'].push(appendObject)
                break;
            }
        }
    }

    // console.log('answer!!!', returnYes24Info)
    return returnYes24Info;

}




function getYes24Stock(isbn){
    axios.get("http://www.yes24.com/Product/Search?domain=STORE&query=" + isbn).then(function (result) {
        // console.log("STOCK", result['data']);
        parserYes24Stock(result['data']);
    }).catch(function (error) {
        console.log("에러 발생 : ", error);
    });
    
}

//<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
//<script src="https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=l7xx2c101ec10b184ce38225574befab7376"></script>


// var returnInfoData = [];
async function getYes24Names(isbnList){
    const returnValue = await axios.get("http://www.yes24.com/Mall/UsedStore/Detail/Seomyeon").then((result) => {
        var returnData = parserYes24Name(result['data']);
        
        for(var i = 0; i<returnData.length; i++){
            getYes24Info(i, returnData);
        }

        
        for(var i = 0; i<isbnList.length; i++){
             getYes24Stock(isbnList[i]);
        }
        
        console.log('lastanswer', returnYes24Info)
        // 여기에 넣으면ㄷ ㅚㅁ 
// 여기에 넣으면ㄷ ㅚㅁ 
// 여기에 넣으면ㄷ ㅚㅁ 
// 여기에 넣으면ㄷ ㅚㅁ 

        return returnYes24Info
    }).catch(function (error) {
        console.log("에러 발생 : ", error); // 에러처리 해주기
    });
  
};