// 책 제목을 받아 지도 검색
async function getBookTitle() {
    var bookTitle = document.getElementsByClassName('bookSearchBar')[0].value;
    var searchRange = document.getElementsByClassName('slider')[0].value;
    var isbnList = await getIsbnList(bookTitle);

    // document.getElementsByClassName('loadBox')[0].style.display = "block";
    console.log(1);

    // 위치 기반 검색
    searchTmap(isbnList,searchRange);
    document.getElementsByClassName('loadBox')[0].style.display = "block";
    document.getElementsByClassName('loadBox')[0].style.display = "none";
    // 로딩 테스트
    console.log(2);
}

// 책 제목을 기준으로 isbn 리스트 검색
async function getIsbnList(title) {
    var isbnList = [];
    if (title.length == 0)
        return;
    let url =
        "https://www.nl.go.kr/seoji/SearchApi.do?cert_key=26946e3d5253c3fa71ccf451aeab972c7a303cbdc213c80c7306c9d1374255b9&title=" +
        title + "&result_style=json&page_no=1&page_size=10";
    var count = 0;
    var data = await fetch(url).then(res => res.json());
    data = data['docs'];
    for (k in data) {

        if (data[k]['EA_ISBN'].length == 0) {
            continue;
        }
        isbnList.push(data[k]['EA_ISBN']);
        count++;
        if (count == 3)
            break;
    }
    return isbnList;
}

var map;
// 초기 맵 , 현재 위치 설정
async function initTmap() {
    map = new Tmapv2.Map("map_div", {
        center: new Tmapv2.LatLng(33.450701, 126.570667),
        width: "100vw",
        height: "100vh",
        zoomControl: true,
        scrollwheel: true
    });

    // 현재 위치 설정
    initPresent();
}

var userLocation = [];

// 현재 위치 설정
function initPresent() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;

                map.setCenter(new Tmapv2.LatLng(lat, lon));
                map.setZoom(16);
                
                userLocation = [lat, lon];
            });
    }
}

async function setStartName() {
    document.getElementsByClassName('searchDepartBar')[0].value = "";
    initPresent();
    var res = await getBuildingName(userLocation[1], userLocation[0]);
    res = res.addressInfo;
    var buildingName;
    if (res.buildingName.length != 0) {
        buildingName = res.buildingName;
    } else {
        buildingName = res.gu_gun + ' ' + res.roadName + ' ' + res.buildingIndex;
    }
    
    document.getElementsByClassName('searchDepartBar')[0].value = buildingName; //출발지
    marker_s = new Tmapv2.Marker({
        position: new Tmapv2.LatLng(userLocation[0], userLocation[1]),
        icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_s.png",
        iconSize: new Tmapv2.Size(24, 38),
        map: map
    });
}

var circleArr = []

// 위치 기반 책 검색 및 마커 띄우기
async function searchTmap(isbnList, searchRange) {

    // 반경 설정 보이기

    var circle = new Tmapv2.Circle({
				center: new Tmapv2.LatLng(userLocation[0],userLocation[1]), // 중심좌표
				radius: searchRange * 1050, // 원의 반지름. 크기설정
				strokeColor: "black", // 테두리 색상
                fillOpacity : 0.15,//투명도
				fillColor: "white", // 원 내부 색상
				map: map // 지도 객체
			});
    
    circleArr.push(circle);

    if (circleArr.length > 1)
    {
      circleArr[0].setMap(null);
      circleArr = [];
    }

    var markerFunction = function(data, name, img) {
        const test = [
            [data, name, img]
        ]
        console.log('inMarkerFunction,', data)
        var maxLength = 5;

        // 지도 마커 설정

        for (let i = 0; i < test.length; i++) {
            var parent = document.getElementsByClassName('bookSectionSources')[0];

            var bookBox = new Array(test[i][0].length);
            var bookInfo = new Array(test[i][0].length);
            var content = new Array(test[i][0].length);

            var bookStoreInfoHeader = new Array(test[i][0].length);
            var bookStoreInfoName = new Array(test[i][0].length);
            var bookStoreInfoTime = new Array(test[i][0].length);
            var bookStoreInfoType = new Array(test[i][0].length);
            var bookStoreInfoDay = new Array(test[i][0].length);
            var bookStoreInfoNum = new Array(test[i][0].length);
            var bookStoreInfoWrap = new Array(test[i][0].length);

            let marker_lat = new Array(test[i][0].length);
            let marker_lon = new Array(test[i][0].length);

            for (let j = 0; j < test[i][0].length; j++)
            {
                if (test[i][0][j]['searchResult'].length != 0) {
                    content[j] = `<div class = 'infoWindow' style = 'cursor : pointer;'>` +

                        "<div class = 'infoHeader' style=' position: relative; width: 100%; height: 9rem; border-bottom : 0.1px solid darkgrey; no-repeat center; display : flex;'>" +

                        "<p style='overflow: hidden; padding : 1rem; width : 100%;'>" +
                        `<span class='infoTitle' style=' font-size: 1.1rem; font-weight: bold; text-align : left;'>${test[i][0][j]["storeName"]}</span>` +
                        "<br>" +
                        "<br>" +
                        `<span class='infoTitle' style=' font-size: 1.1rem; font-weight: bold; display: inline-block; width : 100%; text-align : right;'>${test[i][0][j]['telNum']}</span>` +
                        "<br>" +
                        "</p>" +
                        "</div>" +

                        "<div class='infoSection' style='width : 100%; padding: 10px; height : auto;'>";

                        //${test[i][0][j]['searchResult'][k]['title']}

                    for (var k = 0; k < test[i][0][j]['searchResult'].length; k++) {
                        if (k == maxLength) break;
                        content[j] += "<p style='overflow: hidden; display : flex; justify-content : space-between; align-items : center;'>" +
                            `<span class='infoTitle' style=' font-size: 1.1rem; font-weight: bold; text-align : left; width : 60%; height : auto; padding-top : 0.2rem;'>${test[i][0][j]['searchResult'][k]['title']}</span>` +
                            "<span style = 'width : 30%; text-align : right;'>" +
                            `<span class='infoTitle' style=' font-size: 1.1rem; font-weight: bold;'>재고 : </span>` +
                            `<span class='infoTitle' style=' font-size: 1.1rem; font-weight: bold; text-align: right;'>${test[i][0][j]['searchResult'][k]['stock']}</span>` +
                            "</span>" +
                            "</p>";
                    }
                    content[j] += "</div>" +
                    "</div>";
                }
                if (test[i][0][j]['searchResult'] == 0) {
                    content[j] = "<div class = 'infoWindow' style = 'cursor : pointer;'>" +

                        "<div class = 'infoHeader' style=' position: relative; width: 100%; height: 9rem; border-bottom : 0.1px solid grey; no-repeat center; display : flex; '>" +

                        "<p style='overflow: hidden; padding : 1rem; width : 100%;'>" +
                        `<span class='infoTitle' style=' font-size: 1.1rem; font-weight: bold; text-align : left;'>${test[i][0][j]["storeName"]}</span>` +
                        "<br>" +
                        "<br>" +
                        `<span class='infoTitle' style=' font-size: 1.1rem; font-weight: bold; display: inline-block; width : 100%; text-align : right;'>${test[i][0][j]['telNum']}</span>` +
                        "<br>" +
                        "</p>" +
                        "</div>" +

                        "<div class='infoSection' style='padding: 10px;'>" +

                        "<p style='overflow: hidden; display : flex; justify-content : space-between; align-items : center;'>" +
                        `<span class='infoTitle' style=' font-size: 1.1rem; font-weight: bold; text-align : left; width : 70%; padding-top : 0.2rem;'>${'-'}</span>` +
                        "<span style = 'width : 30%; text-align : right;'>" +
                        `<span class='infoTitle' style=' font-size: 1.1rem; font-weight: bold;'>재고 : </span>` +
                        `<span class='infoTitle' style=' font-size: 1.1rem; font-weight: bold;'>${'-'}</span>` +
                        "</span>" +
                        "</p>" +
                        "</div>" +
                        "</div>";
                }

                //Popup 객체 생성

                infoWindow = new Array(test[i][0].length);
                infoWindow[j] = new Tmapv2.InfoWindow({
                    position: new Tmapv2.LatLng(test[i][0][j]["lat"], test[i][0][j]["lon"]),
                    content: content[j],
                    border: '0px solid #FF0000',
                    background: false,
                    type: 2,
                    map: map
                });

                // 마커 클릭 이벤트 생성
                document.getElementsByClassName('infoWindow')[j].onclick = function() {
                    var endPos = new Tmapv2.LatLng(marker_lat[j], marker_lon[j]);

                    document.getElementsByClassName('searchArriveBarValue')[0].value = endPos;
                    console.log("endPos", endPos);
                    document.getElementsByClassName('searchArriveBar')[0].value = test[i][1] + " " + test[i][0][j]["storeName"];
                    recommendWayDir();
                };

                map.setCenter(new Tmapv2.LatLng(userLocation[0], userLocation[1]));
                map.setZoom(10);

                // 도서 제공처 내용 출력

                // bookbox
                bookBox[j] = document.createElement('div');

                bookBox[j].setAttribute('class', 'bookSectionSource1');
                bookBox[j].style.padding = "1.5rem";
                bookBox[j].style.cursor = "pointer";

                parent.appendChild(bookBox[j]);


                // bookInfo

                bookInfo[j] = document.createElement('div');
                bookInfo[j].style.display = "flex";
                bookInfo[j].style.flexDirection = "column";
                bookInfo[j].style.alignItems = "left";
                bookBox[j].appendChild(bookInfo[j]);

                // bookbrand

                // bookStoreInfo

                bookStoreInfoHeader[j] = document.createElement('div');
                bookInfo[j].appendChild(bookStoreInfoHeader[j]);

                bookStoreInfoName[j] = document.createElement('a');
                bookStoreInfoName[j].setAttribute('class', 'bookStoreInfoName');
                bookStoreInfoHeader[j].appendChild(bookStoreInfoName[j]);

                bookStoreInfoName[j].innerHTML = `${test[i][0][j]["storeName"]}` + '\n' + '\n';

                bookStoreInfoName[j].style.height = "auto";
                bookStoreInfoName[j].style.width = "auto";
                bookStoreInfoName[j].style.textAlign = "left";
                console.log('testURL!!!!', test[i][0][j]["url"])
                console.log('test!!!', test)
                // $(".bookStoreInfoName").attr("href", `${test[i][0][j]["url"]}`);
                bookStoreInfoName[j].setAttribute("href", `${test[i][0][j]["url"]}`);

                bookStoreInfoType[j] = document.createElement('span');
                bookStoreInfoType[j].setAttribute('class', 'bookStoreInfoType');
                bookStoreInfoHeader[j].appendChild(bookStoreInfoType[j]);

                bookStoreInfoType[j].innerHTML = `${test[i][1]}` + '<p style = "margin-top : 2rem;"> </p>';

                bookStoreInfoType[j].style.height = "auto";
                bookStoreInfoType[j].style.width = "auto";
                bookStoreInfoType[j].style.textAlign = "left";

                bookStoreInfoTime[j] = document.createElement('div');
                bookStoreInfoTime[j].setAttribute('class', 'bookStoreInfoTime');
                bookInfo[j].appendChild(bookStoreInfoTime[j]);

                bookStoreInfoTime[j].innerHTML = `${test[i][0][j]["operatingTime"]}` + '<p style = "margin-top : 0.8rem;"> </p>';

                bookStoreInfoTime[j].style.height = "auto";
                bookStoreInfoTime[j].style.width = "auto";
                bookStoreInfoTime[j].style.textAlign = "left";

                bookStoreInfoDay[j] = document.createElement('div');
                bookStoreInfoDay[j].setAttribute('class', 'bookStoreInfoTime');
                bookInfo[j].appendChild(bookStoreInfoDay[j]);

                bookStoreInfoDay[j].innerHTML = `${test[i][0][j]["closedDay"]}` + '<br><br>';

                bookStoreInfoWrap[j] = document.createElement('div');
                bookStoreInfoWrap[j].setAttribute('class', 'bookStoreInfoWrap');
                bookInfo[j].appendChild(bookStoreInfoWrap[j]);

                bookStoreInfoNum[j] = document.createElement('div');
                bookStoreInfoNum[j].setAttribute('class', 'bookStoreInfoNum');
                bookStoreInfoWrap[j].appendChild(bookStoreInfoNum[j]);

                bookStoreInfoNum[j].innerHTML = `${test[i][0][j]["telNum"]}`;

                bookStoreInfoNum[j].style.height = "auto";
                bookStoreInfoNum[j].style.width = "auto";
                bookStoreInfoNum[j].style.textAlign = "left";

                marker_lat[j] = test[i][0][j]["lat"];
                marker_lon[j] = test[i][0][j]["lon"];

                // 도서 제공처 클릭 이동 함수
                bookBox[j].addEventListener('click', function() {
                    map.setCenter(new Tmapv2.LatLng(marker_lat[j], marker_lon[j]));
                    map.setZoom(19);
                });
            }
        }
    }

    console.log("isbN", isbnList);
    //startYes24(isbnList, userLocation, searchRange, markerFunction);
    //startPublicLib(isbnList, userLocation, searchRange, markerFunction);
    startGyobo(isbnList, userLocation, searchRange, markerFunction);
    // startAladin(isbnList, userLocation, searchRange, markerFunction);
    //startIndependentStore(isbnList, userLocation, searchRange, markerFunction);
    // startYPbooks(userLocation, searchRange, markerFunction);
}
