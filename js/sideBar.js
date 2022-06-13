// 사이드바 토글
function toggleBar(sideBar, leftToggle, rightToggle) {
    sideBarObj = document.getElementById(sideBar);
    leftToggleObj = document.getElementById(leftToggle);
    rightToggleObj = document.getElementById(rightToggle);
    
    if (sideBarObj.style.display == "block") {
        sideBarObj.style.display = "none";
        leftToggleObj.style.display = "none";
        rightToggleObj.style.display = "block";
        rightToggleObj.style.left = 0;
    } else {
        sideBarObj.style.display = "block";
        leftToggleObj.style.display = "block";
        rightToggleObj.style.display = "none";
        leftToggleObj.style.left = "38.5rem";
    }
}

// 사이드바 전환
function changeSideBar() {
    document.getElementById('sideBar').style.display = "block";
    document.getElementById('routeSideBar').style.display = "none";
    document.getElementById('leftToggle').style.display = "block";

    // 맵 리셋
    resetMap();
}

// 사이드바 검색 반경 설정 출력
function rangeView() {
    var value = document.getElementsByClassName('rangeValue')[0];
    var rangeBar = document.getElementsByClassName('slider')[0];

    value.innerHTML = rangeBar.value;
}

// 사이드바 내부 추천 경로 내용 제거
function removeRecommend() {
    var recommend = document.getElementsByClassName('detailedGuide')[0];
    while (recommend.hasChildNodes()) {
        recommend.removeChild(recommend.firstChild);
    }
}
