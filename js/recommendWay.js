var resultdrawArr = [];
var drawInfoArr = [];


function recommendWayCar() {
    // 시작위치 받아오기
    var startPosValue = userLocation;
    var startPos = startPosValue;

    // 도착위치 받아오기
    var endPosValue = document.getElementsByClassName('searchArriveBarValue')[0].value;
    var endPos = endPosValue.split(',');

    // 시작 마커
    marker_s = new Tmapv2.Marker({
        position: new Tmapv2.LatLng(startPos[0], startPos[1]),
        icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_s.png",
        iconSize: new Tmapv2.Size(24, 38),
        map: map
    });

    // 도착 마커
    marker_e = new Tmapv2.Marker({
        position: new Tmapv2.LatLng(endPos[0], endPos[1]),
        icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
        iconSize: new Tmapv2.Size(24, 38),
        map: map
    });

    //시작 ,도착 위치 설정
    var startX = startPos[1];
    var startY = startPos[0];
    var endX = endPos[1];
    var endY = endPos[0];
    // 버튼 클릭돼었는지 판별하도록 출력
    document.getElementsByClassName('carPress')[0].style.background = "#b2b7c2";
    document.getElementsByClassName('walkPress')[0].style.background = "#e0e4ee";

    let allChild = document.getElementsByClassName('detailedGuide')[0].childNodes;
    removeRecommend();

    //기존 맵에 있던 정보들 초기화
    // marker_s.setMap(null);
    // marker_e.setMap(null);
    resetMap();

    var searchOption = $("#selectLevel").val();

    var trafficInfochk = $("#year").val();

    $
        .ajax({
            type: "POST",
            url: "https://apis.openapi.sk.com/tmap/routes?version=1&format=json&callback=result",
            async: false,
            data: {
                "appKey": "l7xx2c101ec10b184ce38225574befab7376",
                "startX": startX,
                "startY": startY,
                "endX": endX,
                "endY": endY,
                "reqCoordType": "WGS84GEO",
                "resCoordType": "EPSG3857",
                "searchOption": searchOption,
                "trafficInfo": trafficInfochk
            },
            success: function (response) {

                var resultData = response.features;
                var directionCarBox = new Array();
                var parentBox = document.getElementsByClassName('detailedGuide')[0];

                pointDirections();

                for (var i in resultData) {
                    if (resultData[i].geometry.type != "LineString") {
                        directionCarBox[i] = document.createElement('div');
                        directionCarBox[i].innerHTML = resultData[i].properties.description;
                        directionCarBox[i].setAttribute('class', 'directionSource1');

                        parentBox.appendChild(directionCarBox[i]);

                    }

                }

                var tDistance = (resultData[0].properties.totalDistance / 1000)
                    .toFixed(1) + "km";
                var tTime = (resultData[0].properties.totalTime / 60)
                    .toFixed(0) + "분";
                var tFare = " 총 요금 : " +
                    resultData[0].properties.totalFare +
                    "원,";
                var taxiFare = " 예상 택시 요금 : " +
                    resultData[0].properties.taxiFare +
                    "원";

                document.getElementsByClassName('distance')[0].innerHTML = tDistance;
                document.getElementsByClassName('leadtime')[0].innerHTML = tTime;

                for (var i in resultData) { //for문 [S]
                    var geometry = resultData[i].geometry;
                    var properties = resultData[i].properties;

                    if (geometry.type == "LineString") {
                        for (var j in geometry.coordinates) {
                            // 경로들의 결과값들을 포인트 객체로 변환
                            var latlng = new Tmapv2.Point(
                                geometry.coordinates[j][0],
                                geometry.coordinates[j][1]);
                            // 포인트 객체를 받아 좌표값으로 변환
                            var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
                                latlng);
                            // 포인트객체의 정보로 좌표값 변환 객체로 저장
                            var convertChange = new Tmapv2.LatLng(
                                convertPoint._lat,
                                convertPoint._lng);
                            // 배열에 담기
                            drawInfoArr
                                .push(convertChange);
                        }
                        drawLineCar(drawInfoArr,
                            "0");
                    }
                }

            },
            error: function (request, status, error) {
                console.log("code:" +
                    request.status + "\n" +
                    "message:" +
                    request.responseText +
                    "\n" + "error:" + error);
                alert("초당 처리 건수를 초과했습니다.");
            }
        });
}

// 도보 경로
function recommendWayDir() {

    // 추천 경로 출력 내용 지우기
    removeRecommend();

    // 사이드바 전환
    document.getElementById('sideBar').style.display = "none";
    document.getElementById('routeSideBar').style.display = "block";
    document.getElementsByClassName('walkPress')[0].style.background = "#b2b7c2";
    document.getElementById('leftToggle').style.display = "none";
    document.getElementById('rightToggle').style.display = "none";
    document.getElementsByClassName('carPress')[0].style.background = "#e0e4ee";


    // 시작위치 받아오기
    var startPosValue = userLocation;
    var startPos = startPosValue;

    // 도착위치 받아오기
    var endPosValue = document.getElementsByClassName('searchArriveBarValue')[0].value;
    var endPos = endPosValue.split(',');

    // 시작 마커
    marker_s = new Tmapv2.Marker({
        position: new Tmapv2.LatLng(startPos[0], startPos[1]),
        icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_s.png",
        iconSize: new Tmapv2.Size(24, 38),
        map: map
    });

    // 도착 마커
    marker_e = new Tmapv2.Marker({
        position: new Tmapv2.LatLng(endPos[0], endPos[1]),
        icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
        iconSize: new Tmapv2.Size(24, 38),
        map: map
    });

    //시작 ,도착 위치 설정
    var startX = startPos[1];
    var startY = startPos[0];
    var endX = endPos[1];
    var endY = endPos[0];
    // 3. 경로탐색 API 사용요청
    $
        .ajax({
            method: "POST",
            url: "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
            async: false,
            data: {
                "appKey": "l7xx2c101ec10b184ce38225574befab7376",
                "startX": startX, //시작위치 설정
                "startY": startY, //시작위치 설정
                "endX": endX, //도착위치 설정
                "endY": endY, //도착위치 설정
                "reqCoordType": "WGS84GEO",
                "resCoordType": "EPSG3857",
                "startName": "출발지",
                "endName": "도착지"
            },
            success: function (response) {

                //resultData 받아오기
                var resultData = response.features;

                // 추천 경로 출력 박스 생성
                var directionWayBox = new Array();
                var parentBox = document.getElementsByClassName('detailedGuide')[0];

                // 추천 경로 사이드바 출발지, 도착지 설정
                pointDirections();

                // 추천 경로 출력
                for (var i in resultData) {
                    if (resultData[i].geometry.type != "LineString") {
                        directionWayBox[i] = document.createElement('div');
                        directionWayBox[i].innerHTML = resultData[i].properties.description;
                        directionWayBox[i].setAttribute('class', 'directionSource1');

                        parentBox.appendChild(directionWayBox[i]);
                    }

                }

                // 거리, 시간 결과 출력
                var tDistance = ((resultData[0].properties.totalDistance) / 1000)
                    .toFixed(1) + "km";
                var tTime = ((resultData[0].properties.totalTime) / 60)
                    .toFixed(0) + "분";

                document.getElementsByClassName('distance')[0].innerHTML = tDistance;
                document.getElementsByClassName('leadtime')[0].innerHTML = tTime;

                //기존 그려진 라인 & 마커가 있다면 초기화
                resetMap();

                for (var i in resultData) { //for문 [S]
                    var geometry = resultData[i].geometry;
                    var properties = resultData[i].properties;
                    var polyline_;

                    if (geometry.type == "LineString") {
                        for (var j in geometry.coordinates) {
                            // 경로들의 결과값(구간)들을 포인트 객체로 변환
                            var latlng = new Tmapv2.Point(
                                geometry.coordinates[j][0],
                                geometry.coordinates[j][1]);
                            // 포인트 객체를 받아 좌표값으로 변환
                            var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
                                latlng);
                            // 포인트객체의 정보로 좌표값 변환 객체로 저장
                            var convertChange = new Tmapv2.LatLng(
                                convertPoint._lat,
                                convertPoint._lng);
                            // 배열에 담기
                            drawInfoArr.push(convertChange);
                        }
                    } else {
                        var markerImg = "";
                        var pType = "";
                        var size;

                        if (properties.pointType == "S") { //출발지 마커
                            markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png";
                            pType = "S";
                            size = new Tmapv2.Size(24, 38);
                        } else if (properties.pointType == "E") { //도착지 마커
                            markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png";
                            pType = "E";
                            size = new Tmapv2.Size(24, 38);
                        } else { //각 포인트 마커
                            pType = "P";
                            size = new Tmapv2.Size(0, 0);
                        }

                        // 경로들의 결과값들을 포인트 객체로 변환
                        var latlon = new Tmapv2.Point(
                            geometry.coordinates[0],
                            geometry.coordinates[1]);

                        // 포인트 객체를 받아 좌표값으로 다시 변환
                        var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
                            latlon);

                        var routeInfoObj = {
                            Image: markerImg,
                            lng: convertPoint._lng,
                            lat: convertPoint._lat,
                            pointType: pType
                        };

                        // Marker 추가
                        marker_p = new Tmapv2.Marker({
                            position: new Tmapv2.LatLng(
                                routeInfoObj.lat,
                                routeInfoObj.lng),
                            icon: routeInfoObj.markerImage,
                            iconSize: size,
                            map: map
                        });
                    }
                } //for문 [E]
                drawLineWalk(drawInfoArr);
            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" +
                    "message:" + request.responseText + "\n" +
                    "error:" + error);
                console.log(request.responseText);
            }
        });
}

// 도보 추천 경로 그리기
function drawLineWalk(arrPoint) {
    var polyline_;

    polyline_ = new Tmapv2.Polyline({
        path: arrPoint,
        strokeColor: "#DD0000",
        strokeWeight: 6,
        map: map
    });
    resultdrawArr.push(polyline_);
}

var checkTraffic = [];

// 자동차 추천 경로 그리기
function drawLineCar(arrPoint, traffic) {
    var polyline_;

    // 교통정보 혼잡도를 체크하여 라인 그리기
    if (checkTraffic.length != 0) {

        var lineColor = "";

        if (traffic != "0") {
            if (traffic.length == 0) { //length가 0인것은 교통정보가 없으므로 검은색으로 표시

                lineColor = "#06050D";
                //라인그리기[S]
                polyline_ = new Tmapv2.Polyline({
                    path: arrPoint,
                    strokeColor: lineColor,
                    strokeWeight: 6,
                    map: map
                });
                resultdrawArr.push(polyline_);
                //라인그리기[E]
            } else {

                if (traffic[0][0] != 0) {
                    var trafficObject = "";
                    var tInfo = [];

                    for (var z = 0; z < traffic.length; z++) {
                        trafficObject = {
                            "startIndex": traffic[z][0],
                            "endIndex": traffic[z][1],
                            "trafficIndex": traffic[z][2],
                        };
                        tInfo.push(trafficObject)
                    }

                    var noInfomationPoint = [];

                    for (var p = 0; p < tInfo[0].startIndex; p++) {
                        noInfomationPoint.push(arrPoint[p]);
                    }

                    //라인그리기[S]
                    polyline_ = new Tmapv2.Polyline({
                        path: noInfomationPoint,
                        strokeColor: "#06050D",
                        strokeWeight: 6,
                        map: map
                    });
                    //라인그리기[E]
                    resultdrawArr.push(polyline_);

                    for (var x = 0; x < tInfo.length; x++) {
                        var sectionPoint = [];

                        for (var y = tInfo[x].startIndex; y <= tInfo[x].endIndex; y++) {
                            sectionPoint.push(arrPoint[y]);
                        }

                        if (tInfo[x].trafficIndex == 0) {
                            lineColor = "#06050D";
                        } else if (tInfo[x].trafficIndex == 1) {
                            lineColor = "#61AB25";
                        } else if (tInfo[x].trafficIndex == 2) {
                            lineColor = "#FFFF00";
                        } else if (tInfo[x].trafficIndex == 3) {
                            lineColor = "#E87506";
                        } else if (tInfo[x].trafficIndex == 4) {
                            lineColor = "#D61125";
                        }

                        //라인그리기[S]
                        polyline_ = new Tmapv2.Polyline({
                            path: sectionPoint,
                            strokeColor: lineColor,
                            strokeWeight: 6,
                            map: map
                        });
                        //라인그리기[E]
                        resultdrawArr.push(polyline_);
                    }
                } else {

                    var trafficObject = "";
                    var tInfo = [];

                    for (var z = 0; z < traffic.length; z++) {
                        trafficObject = {
                            "startIndex": traffic[z][0],
                            "endIndex": traffic[z][1],
                            "trafficIndex": traffic[z][2],
                        };
                        tInfo.push(trafficObject)
                    }

                    for (var x = 0; x < tInfo.length; x++) {
                        var sectionPoint = [];

                        for (var y = tInfo[x].startIndex; y <= tInfo[x].endIndex; y++) {
                            sectionPoint.push(arrPoint[y]);
                        }

                        if (tInfo[x].trafficIndex == 0) {
                            lineColor = "#06050D";
                        } else if (tInfo[x].trafficIndex == 1) {
                            lineColor = "#61AB25";
                        } else if (tInfo[x].trafficIndex == 2) {
                            lineColor = "#FFFF00";
                        } else if (tInfo[x].trafficIndex == 3) {
                            lineColor = "#E87506";
                        } else if (tInfo[x].trafficIndex == 4) {
                            lineColor = "#D61125";
                        }

                        //라인그리기[S]
                        polyline_ = new Tmapv2.Polyline({
                            path: sectionPoint,
                            strokeColor: lineColor,
                            strokeWeight: 6,
                            map: map
                        });
                        //라인그리기[E]
                        resultdrawArr.push(polyline_);
                    }
                }
            }
        } else {

        }
    } else {
        polyline_ = new Tmapv2.Polyline({
            path: arrPoint,
            strokeColor: "#DD0000",
            strokeWeight: 6,
            map: map
        });
        resultdrawArr.push(polyline_);
    }

}

var preMarkerArr = [];

// 추천 경로 출발지 및 도착지 지정
function pointDirections() {
    var departPoint = document.getElementsByClassName('departPoint')[0];
    departPoint.innerHTML = document.getElementsByClassName('searchDepartBar')[0].value;

    var arrivePoint = document.getElementsByClassName('arrivePoint')[0];
    arrivePoint.innerHTML = document.getElementsByClassName('searchArriveBar')[0].value;
}

// 기존 맵에 있는 마커 및 추천 경로 삭제
function resetMap() {

    //기존마커 삭제
    // marker_s.setMap(null);
    // marker_e.setMap(null);

    if (resultMarkerArr.length > 0) {
        for (var i = 0; i < resultMarkerArr.length; i++) {
            resultMarkerArr[i].setMap(null);
        }
    }

    if (resultdrawArr.length > 0) {
        for (var i = 0; i < resultdrawArr.length; i++) {
            resultdrawArr[i].setMap(null);
        }
    }

    // 데이터 초기화
    checkTraffic = [];
    drawInfoArr = [];
    resultMarkerArr = [];
    resultdrawArr = [];
}
