async function init()
{
  map = new Tmapv2.Map("map_div", {
      center: new Tmapv2.LatLng(33.450701, 126.570667), // 반경설정해서 위경도
      width: "100vw",
      height: "100vh",
      zoomControl: true,
      scrollwheel: true
  });

  if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				function(position) {
					var lat = position.coords.latitude;
					var lon = position.coords.longitude;

					marker = new Tmapv2.Marker({
						position : new Tmapv2.LatLng(lat,lon),
						map : map
					});

					map.setCenter(new Tmapv2.LatLng(lat,lon));
				});
      }

      marker1 = new Tmapv2.Marker(
          {
            icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_a.png",
            iconSize : new Tmapv2.Size(24, 38),
            map : map
          });

      // 2. API 사용요청
      var lon, lat;

      map.addListener(
              "click",
              async function onClick(evt) {
                var mapLatLng = evt.latLng;

                //기존 마커 삭제
                marker1.setMap(null);

                var markerPosition = new Tmapv2.LatLng(
                    mapLatLng._lat, mapLatLng._lng);
                //마커 올리기
                marker1 = new Tmapv2.Marker(
                    {
                      position : markerPosition,
                      icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_p.png",
                      iconSize : new Tmapv2.Size(24, 38),
                      map : map
                    });

                res = await getBuildingName(mapLatLng._lng, mapLatLng._lat);
                res = res.addressInfo;
                var buildingName;
                if(res.buildingName.length != 0) {
                  buildingName = res.buildingName;
                } else {
                  buildingName = res.gu_gun + ' '+ res.roadName + ' '+res.buildingIndex;
                }
                console.log(buildingName);
              });

      function getBuildingName(lon, lat) {
        return $.ajax({
              method : "GET",
              url : "https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&format=json&callback=result",
              async : false,
              data : {
                "appKey" : "l7xx2c101ec10b184ce38225574befab7376",
                "coordType" : "WGS84GEO",
                "addressType" : "A10",
                "lon" : lon,
                "lat" : lat
              },
              error : function(request, status, error) {
                console.log("code:" + request.status + "\n"
                    + "message:" + request.responseText + "\n"
                    + "error:" + error);
              }
            });

      }
}

async function initTmap(IsbnLists, searchRange) {
    // 1. 지도 띄우기


    var makerFunction = function (data, name, img) {
        console.log(tmp = data);
        const test = [
            [data, name, img]
        ]

        var maxLength = 5;
        // test = [
        //     [returnYes24Info, 'yes24', './yes24.png'],
        //     [returnGyoboInfo, 'gyobo', './kyobo.png'],
        //     [returnYPInfo, 'YP', './example.png']
        // ]
        for (let i = 0; i < test.length; i++) {
            var parent = document.getElementsByClassName('bookSectionSources')[0];

            var bookBox = new Array(test[i][0].length);
            var bookBrand = new Array(test[i][0].length);
            var bookInfo = new Array(test[i][0].length);
            var content = new Array(test[i][0].length);

            var bookStoreInfo = new Array(test[i][0].length);
            //var bookStoreClose = new Array(test[i][0].length);
            //var bookStoreName = new Array(test[i][0].length);;
            //var bookStoreTime = new Array(test[i][0].length);

            var bookStoreDetail = new Array(test[i][0].length);
            var bookStoreNum = new Array(test[i][0].length);
            var bookStoreLink = new Array(test[i][0].length);

            let marker_lat = new Array(test[i][0].length);
            let marker_lon = new Array(test[i][0].length);

            console.log('lenlne', test[i][0]);
            console.log('l',test[i][0].length);
            for (let j = 0; j < test[i][0].length; j++) // returnYes24Info - >
            {

               console.log('asdasd', test[i][0][j]['searchResult']) 
                if (test[i][0][j]['searchResult'].length != 0) {
                    content[j] = "<div class = 'result'>" +

                        "<div class = 'header' style=' position: relative; width: 100%; height: 9rem; border-bottom : 0.1px solid grey; no-repeat center; display : flex; justify-content : space-around;'>" +

                        "<p style='margin-bottom: 0.7rem; overflow: hidden;'>" +
                        `<span class='tit' style=' font-size: 1.6rem; font-weight: bold; '>${test[i][1]}</span>` +
                        "<br>" +
                        "<br>" +
                        `<span class='tit' style=' font-size: 1.6rem; font-weight: bold;'>${test[i][0][j]["storeName"]}</span>` +
                        "<br>" +
                        "</p>" +
                        `<img src= ${test[i][2]} style = 'display : flex; width : 9.2rem; height : 6.3rem; margin-top : 10px;'>` +

                        "</div>" +

                        "<div class='info-box' style='padding: 10px; height : auto;'>";


                        for (var k = 0; k < test[i][0][j]['searchResult'].length; k++)
                        {
                          if (k == maxLength) break;
                          content[j] += "<p style='margin-bottom: 0.7rem; overflow: hidden; display : flex; justify-content : space-around;'>" +
                          `<span class='tit' style=' font-size: 1.6rem; font-weight: bold; text-align : left; width : 20rem; height : auto;'>${test[i][0][j]['searchResult'][k]['title']}</span>` +
                          "<span style = 'width : 10rem;'>" +
                          `<span class='tit' style=' font-size: 1.6rem; font-weight: bold;'>재고 : </span>` +
                          `<span class='tit' style=' font-size: 1.6rem; font-weight: bold; text-align: right;'>${test[i][0][j]['searchResult'][k]['stock']}</span>` +
                          "</span>" +
                          "</p>";
                        }

                        content[j] += "<p style='margin-bottom: 0.7rem; overflow: hidden; display : flex; justify-content : space-around;'>" +
                        `<span class='tit' style=' font-size: 1.6rem; font-weight: bold; text-align : center; width : 20rem; height : auto;'>전화번호 : ${test[i][0][j]['telNum']}</span>` +
                        "</span>" +
                        "</p>";
                        "</div>" +
                        "</div>";
                }

                if (test[i][0][j]['searchResult'] == 0) {
                    content[j] = "<div class = 'result'>" +

                        "<div class = 'header' style=' position: relative; width: 100%; height: 9rem; border-bottom : 0.1px solid grey; no-repeat center; display : flex; justify-content : space-around;'>" +

                        "<p style='margin-bottom: 0.7rem; overflow: hidden;'>" +
                        `<span class='tit' style=' font-size: 1.6rem; font-weight: bold; '>${test[i][1]}</span>` +
                        "<br>" +
                        "<br>" +

                        `<span class='tit' style=' font-size: 1.6rem; font-weight: bold;'>${test[i][0][j]["storeName"]}</span>` +
                        "<br>" +
                        "</p>" +
                        `<img src= ${test[i][2]} style = 'display : flex; width : 9.2rem; height : 6.3rem; margin-top : 10px;'>` +

                        "</div>" +

                        "<div class='info-box' style='padding: 10px;'>" +

                        "<p style='margin-bottom: 0.7rem; overflow: hidden; display : flex; justify-content : space-around;'>" +
                        `<span class='tit' style=' font-size: 1.6rem; font-weight: bold;'>${'-'}</span>` +
                        "<span>" +
                        `<span class='tit' style=' font-size: 1.6rem; font-weight: bold;'>재고 : </span>` +
                        `<span class='tit' style=' font-size: 1.6rem; font-weight: bold;'>${'-'}</span>` +
                        "</span>" +
                        "</p>" +

                        "<p style='margin-bottom: 0.7rem; overflow: hidden; display : flex; justify-content : space-around;'>" +
                        `<span class='tit' style=' font-size: 1.6rem; font-weight: bold; text-align : left; width : 20rem; height : auto;'>전화번호 : ${test[i][0][j]['telNum']}</span>` +
                        "</span>" +

                        "</div>" +
                        "</div>";
                }

                //Popup 객체 생성.
                infoWindow = new Array(test[i][0].length);
                infoWindow[j] = new Tmapv2.InfoWindow({
                    position: new Tmapv2.LatLng(test[i][0][j]["lat"], test[i][0][j]["lon"]), //Popup 이 표출될 맵 좌표
                    content: content[j], //Popup 표시될 text
                    border: '0px solid #FF0000',
                    background: false, //Popup의 테두리 border 설정.
                    type: 2, //Popup의 type 설정.
                    map: map //Popup이 표시될 맵 객체
                });
                marker = new Array(test[i][0].length);
                marker[j] = new Tmapv2.Marker({
                    position: new Tmapv2.LatLng(test[i][0][j]["lat"], test[i][0][j]["lon"]),
                    map: map,
                    //icon: "./images./ballon.png",
                    zIndex: 0
                });

                map.setCenter(new Tmapv2.LatLng(37.55992471363162, 126.84031158500693));
                map.zoomOut();
                map.zoomOut();

                // bookbox
                bookBox[j] = document.createElement('div');

                bookBox[j].setAttribute('class','bookSectionSource1');
                bookBox[j].style.padding = "1.5rem";
                bookBox[j].style.cursor = "pointer";

                parent.appendChild(bookBox[j]);


                // bookInfo

                bookInfo[j] = document.createElement('div');
                bookStoreNum[j] = document.createElement('div');
                bookInfo[j].style.display = "flex";
                bookInfo[j].style.justifyContent = "space-around";
                bookInfo[j].style.alignItems = "center";
                bookBox[j].appendChild(bookInfo[j]);

                // bookbrand

                bookBrand[j] = document.createElement('div');
                bookBrand[j].style.backgroundImage =`url(${test[i][2]})`;
                bookBrand[j].style.backgroundSize = "12rem 12rem";
                bookBrand[j].style.height = "12rem";
                bookBrand[j].style.width = "12rem";
                bookBrand[j].style.marginRight = "2rem";
                bookInfo[j].appendChild(bookBrand[j]);

                // bookStoreInfo

                bookStoreInfo[j] = document.createElement('div');
                bookInfo[j].appendChild(bookStoreInfo[j]);

                bookStoreInfo[j].innerHTML = `${test[i][1]}` + '\n' + `${test[i][0][j]["storeName"]}`+'<br><br>' + "영업 시간 : " + `${test[i][0][j]["operatingTime"]}` + '<br><br>' + "휴일 : " + `${test[i][0][j]["closedDay"]}`;

                bookStoreInfo[j].style.height = "auto";
                bookStoreInfo[j].style.width = "20rem";
                bookStoreInfo[j].style.textAlign = "left";

                // bookStoreDetail

                bookStoreDetail[j] = document.createElement('div');
                bookBox[j].appendChild(bookStoreDetail[j]);

                bookStoreDetail[j].style.display = "flex";
                bookStoreDetail[j].style.justifyContent = "space-between";
                bookStoreDetail[j].style.marginTop = "0.5rem";

                // bookStoreNum

                bookStoreNum[j] = document.createElement('div');
                bookStoreDetail[j].appendChild(bookStoreNum[j]);

                bookStoreNum[j].innerHTML = "Tel." + `${test[i][0][j]["telNum"]}`;
                bookStoreNum[j].style.marginLeft = "0.5rem";


                // bookStoreLink

                bookStoreLink[j] = document.createElement('a');
                bookStoreDetail[j].appendChild(bookStoreLink[j]);
                bookStoreLink[j].id = "detail";
                bookStoreLink[j].style.cursor = "pointer";
                //console.log (`${test[i][0][j]["url"]}`);
                bookStoreLink[j].innerHTML = "홈페이지";
                bookStoreLink[j].setAttribute('class', 'button');


                $(".button").attr("href", `${test[i][0][j]["url"]}`)

                marker_lat[j] = test[i][0][j]["lat"];
                marker_lon[j] = test[i][0][j]["lon"];

                bookBox[j].addEventListener('click', function() {


                map.setZoom(16);
                map.panTo(new Tmapv2.LatLng(marker_lat[j], marker_lon[j]))

                console.log(marker_lat[j], marker_lon[j])
                    // console.log(map.getMinZoomLevels());
                    // console.log(map.getMaxZoomLevels());
                    //
                    //
                    // console.log(map.getZoom());
              });
            }
        }
    }

    // 이것이 자바다
    //getYes24Names(['9788968481475', '9788968481123'], makerFunction)
    //aladinStart(['9788968481024', '9788968481475', '9791162243770', '9791162243077', '9791162242780'],0,searchRange,makerFunction);
    //startIndependentStore(0,0,searchRange,makerFunction);
    pubLibStart(['9788968481024', '9788968481475', '9791162243770', '9791162243077', '9791162242780','9788968481123'],0,99999999,makerFunction);
    //getYes24Names(['9788968481475', '9788968481123'], makerFunction);
    //getGyobo(['9788968481475', '9788968481123', '9788968481123'], makerFunction)
    //getYPbooks(makerFunction)
    console.log("isbnlist", IsbnLists);
    console.log("range", searchRange);
}

function toggleBar(id, toggleId, toggleIdTwo) {
    obj = document.getElementById(id);
    toggleObj = document.getElementById(toggleId);
    toggleObjTwo = document.getElementById(toggleIdTwo);

    if (obj.style.display == "block") {
        obj.style.display = "none";
        toggleObj.style.display = "none";
        toggleObjTwo.style.display = "block";
        toggleObjTwo.style.left = 0;
    } else {
        obj.style.display = "block";
        toggleObj.style.display = "block";
        toggleObjTwo.style.display = "none";
        toggleObj.style.left = "38.5rem";
    }
}

function getTitle()
{
  var title = document.getElementsByClassName('bookSearchBar')[0].value;
  var searchRange = document.getElementsByClassName('slider')[0].value;
  //console.log("range", searchRange);

  var IsbnLists = getIsbnList(title);

  initTmap(IsbnLists, searchRange);
}

function getIsbnList(title, pageSize = 10) {

    console.log(title);
    if (title.length == 0)
        return;
    var lists = [];
    var isbn = '';
    var result = '';
    var totalCount = '';
    let url =
        "https://www.nl.go.kr/seoji/SearchApi.do?cert_key=26946e3d5253c3fa71ccf451aeab972c7a303cbdc213c80c7306c9d1374255b9&title=" +
        title + "&result_style=json&page_no=1&page_size=" + pageSize;
    fetch(url)
        .then(res => res.json())
        .then(resJson => {
            totalCount = parseInt(resJson['TOTAL_COUNT']);
            result = resJson['docs'];
            if (pageSize > totalCount)
                pageSize = totalCount;
            if (totalCount > 0) {
                var i = 0;
                var count = 0;
                for (i = 0; i < pageSize; i++) {
                    isbn = result[i]['EA_ISBN'];
                    if (isbn.length == 0) {
                        continue;
                    }
                    lists[count++] = isbn;
                }
            } else {
                console.log("찾는 자료가 없습니다!");
            }
        });
        console.log(lists);
        return lists;
}

// 반경 설정 출력 함수

function rangeView()
{
  var value = document.getElementsByClassName('rangeValue')[0];
  var rangeBar = document.getElementsByClassName('slider')[0];

  value.innerHTML = rangeBar.value;
}

//
