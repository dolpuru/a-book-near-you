// 해당 코드 지점의 정보를 가져온다.
// axios.get("http://www.kyobobook.co.kr/storen/MainStore.laf?SITE=15&Kc=GNHHNOoffstore&orderClick=rvd").then(function (result) {
//     console.log("통신 결과 : ", result);
// }).catch(function (error) {
//     console.log("에러 발생 : ", error);
// });
// console.log("바로 실행 로그");

//모든 매장 이름, 코드를 가져온다.
// <select id="store">를 찾는다.
// value와 그사이 text를 가져온다.
function GyoboNameCodeParser(gyoboData) {
    var returnGyoboNameCode = new Array();
    var flagStart = '<select id="store">';
    var flagEnd = '</select>';
    var startIndex = gyoboData.indexOf(flagStart, 0);
    var endIndex = gyoboData.indexOf(flagEnd, startIndex + flagStart.length);

    var codeFlag = true;
    var storeCode = '';
    var stroeName = '';
    for (var i = startIndex + flagStart.length + 2; i < 1000000; i++) {

        if (i == endIndex) {
            break
        } else {
            if (codeFlag == false && gyoboData[i] == '"') {
                codeFlag = true;

                for (var j = i + 2; j < 100000; j++) {
                    if (gyoboData[j] == '<') {
                        returnGyoboNameCode.push([storeCode, stroeName])
                        storeCode = ''
                        stroeName = ''

                        break
                    } else stroeName += gyoboData[j]

                }

                continue
            }
            if (gyoboData[i] == '"') {
                codeFlag = false;
                continue
            }
            if (codeFlag == false) {
                storeCode += gyoboData[i];
            }




        }
    }
    console.log('aaaaaaaa', returnGyoboNameCode)
    return returnGyoboNameCode
}

//전화번호찾고 p태그 찾기
//영업시간
//휴점일

// var addr = null; 찾고 
//	lat = "37.5037373";
// longt = "127.0240583";
// stockNm = "교보문고 강남점";
// addr = "서울특별시 서초구 강남대로 465, 교보타워 지하 1~지하 2층"; 

var returnGyoboInfo = new Array();

function GyoboInfoParser(siteUrl, objectParser) {
    var GyoboInfoJson = new Object();
    var flag1 = '전화번호';
    var flag2 = '영업시간';
    var flag3 = '휴점일';
    var flag4 = 'var addr = null;';

    //tel
    var index = objectParser.indexOf(flag1, 0)
    var rightFlag = 0
    var telNumber = ''
    for (var i = index + 2; i < objectParser.length; i++) {
        if (rightFlag == 2) {
            if (objectParser[i] == '<') {
                break
            }
            telNumber += objectParser[i]
        }
        if (objectParser[i] == '>') {
            rightFlag += 1
        }
    }

    //oper
    var index = objectParser.indexOf(flag2, 0)
    var rightFlag = 0
    var oper = ''
    for (var i = index + 2; i < objectParser.length; i++) {
        if (rightFlag == 2) {
            if (objectParser[i] == '<') {
                break
            }
            oper += objectParser[i]
        }
        if (objectParser[i] == '>') {
            rightFlag += 1
        }
    }

    //close
    var index = objectParser.indexOf(flag3, 0)
    var rightFlag = 0
    var close = ''
    for (var i = index + 2; i < objectParser.length; i++) {
        if (rightFlag == 2) {
            if (objectParser[i] == '<') {
                break
            }
            close += objectParser[i]
        }
        if (objectParser[i] == '>') {
            rightFlag += 1
        }
    }

    // lat, longt, stockNm

    var index = objectParser.indexOf(flag4, 0);
    var valueFlag = 0
    var latValue = ''
    var longtValue = ''
    var storeValue = ''
    for (var i = index + 2; i < 1000000; i++) {
        if (valueFlag >= 6) {
            break
        }
        if (objectParser[i] == '"') {
            valueFlag += 1
            continue
        }
        if (valueFlag % 2 == 1) {
            if (valueFlag == 1) {
                latValue += objectParser[i]
                continue
            }
            if (valueFlag == 3) {
                longtValue += objectParser[i]
                continue
            }
            if (valueFlag == 5) {
                storeValue += objectParser[i]
                continue
            }
        }



    }

    GyoboInfoJson.lat = latValue;
    GyoboInfoJson.lon = longtValue;
    GyoboInfoJson.storeName = storeValue;
    GyoboInfoJson.closedDay = close;
    GyoboInfoJson.opertingTime = oper;
    GyoboInfoJson.telNum = telNumber;
    GyoboInfoJson.url = siteUrl;
    GyoboInfoJson.searchResult = [];
    returnGyoboInfo.push(GyoboInfoJson);
}


async function getGyoboInfo(stieCode) {
    // 해당 코드 지점의 정보를 가져온다.

    await axios.get("http://www.kyobobook.co.kr/storen/MainStore.laf?SITE=" + stieCode + "&Kc=GNHHNOoffstore&orderClick=rvd").then(function (result) {
        // console.log("통신 결과 : ", result['data']);
        GyoboInfoParser("http://www.kyobobook.co.kr/storen/MainStore.laf?SITE=" + stieCode + "&Kc=GNHHNOoffstore&orderClick=rvd", result['data']);
    }).catch(function (error) {
        console.log("에러 발생 : ", error);
    });
    console.log("바로 실행 로그");
}

//<span class="author"> => 저자
// <span class="company"> => 출판사
// <span class="stock"> => <strong> =>  재고
// <div class="tit"> => <strong> 제목
// <span class="price_wrap"><span>정가</span> 가격

function getGyoboStockParser(siteIndex, stockHtml) {

    var GyoboStockJson = new Object();
    var flag1 = '<span class="author">';
    var flag2 = '<span class="company">';
    var flag3 = '<span class="stock">';
    var flag4 = '<div class="tit">';
    var flag5 = '<strong>';
    var flag6 = '<span class="price">';

    //저자
    var index = stockHtml.indexOf(flag1, 0)
    var gyoboAuth = ''
    for (var i = index + flag1.length; i < 100000; i++) {
        if (stockHtml[i] == '<') {
            break
        }
        gyoboAuth += stockHtml[i]
    }

    //회사
    var index = stockHtml.indexOf(flag2, 0)
    var gyoboCompany = ''
    for (var i = index + flag2.length; i < 100000; i++) {
        if (stockHtml[i] == '<') {
            break
        }
        gyoboCompany += stockHtml[i]
    }

    //재고
    var index = stockHtml.indexOf(flag3, 0)
    var index = stockHtml.indexOf(flag5, index + 10)
    var gyoboStock = ''
    for (var i = index + flag5.length; i < 100000; i++) {
        if (stockHtml[i] == '<') {
            break
        }
        gyoboStock += stockHtml[i]
    }

    //재고
    var index = stockHtml.indexOf(flag4, 0)
    var index = stockHtml.indexOf(flag5, index + 10)
    var gyoboBookName = ''
    for (var i = index + flag5.length; i < 100000; i++) {
        if (stockHtml[i] == '<') {
            break
        }
        gyoboBookName += stockHtml[i]
    }

    // 가격
    var index = stockHtml.indexOf(flag6, 0)
    var gyoboPrice = ''
    for (var i = index + flag6.length; i < 100000; i++) {
        if (stockHtml[i] == '<') {
            break
        }
        gyoboPrice += stockHtml[i]
    }

    GyoboStockJson.author = gyoboAuth
    GyoboStockJson.title = gyoboBookName
    GyoboStockJson.price = gyoboPrice
    GyoboStockJson.publisher = gyoboCompany
    GyoboStockJson.stock = gyoboStock
    
    returnGyoboInfo[siteIndex]['searchResult'].push(GyoboStockJson)

}

// sitecode 위 axios에서 지점 다 받아오고 , barcode = isbn 넣어서 검색하면 재고 확인 가능.
async function getGyoboStock(siteIndex, siteCode, isbn) {
    await axios.get("https://mobile.kyobobook.co.kr/welcomeStore/storeSearchDetail?siteCode=" + siteCode + "&productType=KOR&barcode=" + isbn).then(function (result) {
        var a = getGyoboStockParser(siteIndex, result['data'])
        console.log(a)
    }).catch(function (error) {
        console.log("에러 발생 : ", error);
    });
    console.log("바로 실행 로그");
}




var getGyoboNameCodes = []
async function getGyoboNames(isbnList) {
    await axios.get("https://mobile.kyobobook.co.kr/welcomeStore/storeSearchList").then(function (result) {
            // console.log("교보 통신결과 ", result['data']);
            getGyoboNameCodes = GyoboNameCodeParser(result['data']);
            console.log('asdasdasdasd', getGyoboNameCodes);
            return getGyoboNameCodes

        })
        .then(() => {
            console.log(getGyoboNameCodes)
            // 'E6' 신논현역 스토어 안됨.
            for (var i = 0; i < getGyoboNameCodes.length; i++) {
                if (getGyoboNameCodes[i][0] == 'E6') {
                    continue
                }
                getGyoboInfo(getGyoboNameCodes[i][0]);


            }

            setTimeout(function () {
                console.log('answer', returnGyoboInfo);
            }, 3000);


        })
        .then(() => {
            setTimeout(function () {
                var siteIndex = 0
            console.log('AAAAAAAAAAAAA', returnGyoboInfo);
            for (var i = 0; i < getGyoboNameCodes.length; i++) {
                if (getGyoboNameCodes[i][0] == 'E6') {
                    continue
                }
                console.log(returnGyoboInfo.length);
                console.log(returnGyoboInfo);
                console.log(getGyoboNameCodes);
                for(var k=0; k< returnGyoboInfo.length; k++){
                    if(returnGyoboInfo[k]['storeName'] == '교보문고 ' + getGyoboNameCodes[i][1]){
                        siteIndex = k
                        console.log('asdAAAAAAAAAAAAasd',siteIndex)
                        break

                    }
                }

                for (var j = 0; j < isbnList.length; j++) {

                    getGyoboStock(siteIndex, getGyoboNameCodes[i][0], isbnList[j])
                }
            }

            console.log(returnGyoboInfo)
            }, 1000);
            

        })
        .catch(function (error) {
            console.log("에러 발생 : ", error);
        });
    console.log("바로 실행 로그");
}
