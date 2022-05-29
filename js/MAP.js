async function initTmap() {
    // 1. 지도 띄우기
    map = new Tmapv2.Map("map_div", {
        center: new Tmapv2.LatLng(33.450701, 126.570667), // 반경설정해서 위경도
        width: "100vw",
        height: "100vh",
        zoomControl: true,
        scrollwheel: true
    });

    var makerFunction = function (data, name, img) {
        const test = [
            [data, name, img]
        ]
        // test = [
        //     [returnYes24Info, 'yes24', './yes24.png'],
        //     [returnGyoboInfo, 'gyobo', './kyobo.png'],
        //     [returnYPInfo, 'YP', './example.png']
        // ]
        for (var i = 0; i < test.length; i++) {

            var content = new Array(test[i][0].length);
            for (var j = 0; j < test[i][0].length; j++) // returnYes24Info - >
            {

                if (test[i][0][j]['searchResult'].length != 0) {
                    content[j] = "<div style='position : relative; display: flex; font-size: 1.4rem; box-shadow: 5px 5px 5px #00000040; border-radius: 15px; flex-direction: column; bottom :20rem; right : 15rem; width : 30rem; background-color: white; padding: 10px;'>" +

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
                        `<span class='tit' style=' font-size: 1.6rem; font-weight: bold;'>${test[i][0][j]['searchResult'][0]['title']}</span>` +
                        "<span>" +
                        `<span class='tit' style=' font-size: 1.6rem; font-weight: bold;'>재고 : </span>` +
                        `<span class='tit' style=' font-size: 1.6rem; font-weight: bold;'>${test[i][0][j]['searchResult'][0]['stock']}</span>` +
                        "</span>" +
                        "</p>" +

                        "</div>" +
                        "</div>";
                }

                if (test[i][0][j]['searchResult'] == 0) {
                    content[j] = "<div style='position : relative; display: flex; font-size: 1.4rem; box-shadow: 5px 5px 5px #00000040; border-radius: 15px; flex-direction: column; bottom :20rem; right : 15rem; width : 30rem; background-color: white; padding: 10px;'>" +

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
                    icon: "./ballon.png",
                    zIndex: 0
                });

                map.setCenter(new Tmapv2.LatLng(37.55992471363162, 126.84031158500693));
                map.zoomOut();
                map.zoomOut();

            }
        }

    }

    // 이것이 자바다
    getYes24Names(['9788968481475'], makerFunction)
    getGyobo(['9788968481475'], makerFunction)
    getYPbooks(makerFunction)
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