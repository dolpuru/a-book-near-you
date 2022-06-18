var resultMarkerArr = [];

// 현재 위치 마커 찍기
function presentMarker() {
    // 마커 마우스 커서 설정
    document.getElementsByTagName('body')[0].style.cursor = "url('http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_s.png'), auto";

    // 맵에 마커 생성
    map.addListener(
        "click",
        makeMarker
    );
    return;
}

// 현재 위치를 건물명, 주소지로 변환
async function getBuildingName(lon, lat) {
    return await $.ajax({
        method: "GET",
        url: "https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&format=json&callback=result",
        async: false,
        data: {
            "appKey": "l7xx2c101ec10b184ce38225574befab7376",
            "coordType": "WGS84GEO",
            "addressType": "A10",
            "lon": lon,
            "lat": lat
        },
        error: function(request, status, error) {
            console.log("code:" + request.status + "\n" +
                "message:" + request.responseText + "\n" +
                "error:" + error);
        }
    });
}

// 현재 위치 마커를 맵에 생성
async function makeMarker(evt) {
    var mapLatLng = evt.latLng;

    // 맵에 있는 마커 제거
    removeMarkers();

    var markerPosition = new Tmapv2.LatLng(
        mapLatLng._lat, mapLatLng._lng);
    //마커 올리기
    var marker1 = new Tmapv2.Marker({
        position: markerPosition,
        icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_p.png",
        iconSize: new Tmapv2.Size(24, 38),
        map: map
    });

    preMarkerArr.push(marker1);
    resultMarkerArr.push(marker1);

    var res = await getBuildingName(mapLatLng._lng, mapLatLng._lat);
    res = res.addressInfo;
    var buildingName;
    if (res.buildingName.length != 0) {
        buildingName = res.buildingName;
    } else {
        buildingName = res.gu_gun + ' ' + res.roadName + ' ' + res.buildingIndex;
    }

    document.getElementsByClassName('searchDepartBarValue')[0].value = markerPosition; //위도, 경도값 넣기
    document.getElementsByClassName('searchDepartBar')[0].value = buildingName; //출발지
    userLocation = [mapLatLng._lat, mapLatLng._lng];
    console.log(userLocation);
    document.getElementsByTagName('body')[0].style.cursor = "default"
    clearMarker();
}


// 맵에 있는 현재 위치 마커를 클리어
function clearMarker() {
    map.removeListener("click", makeMarker)
}

// 현재 위치 마커 중복 제거
function removeMarkers() {
    for (var i = 0; i < preMarkerArr.length; i++) {
        preMarkerArr[i].setMap(null);
    }
    preMarkerArr = [];
}
