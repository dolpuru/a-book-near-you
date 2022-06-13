// 교보문고 정보 결과 파서
function parserGyoboInfo(siteUrl, objectParser, userLocation, searchRange, pushObject, siteCode) {
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
			Math.sin(dLon / 2) * Math.sin(dLon / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c; // Distance in km
		return d;
	}

	// 35.155489508012636/*usrLocation[0]*/, 129.05959731396132/*usrLocation[1]*/
	if (getDistanceFromLatLonInKm(latValue, longtValue, userLocation[0], userLocation[1]) <= searchRange) {
		GyoboInfoJson.storeName = storeValue;
		GyoboInfoJson.closedDay = close;
		GyoboInfoJson.operatingTime = oper;
		GyoboInfoJson.telNum = telNumber;
		GyoboInfoJson.url = siteUrl;
		GyoboInfoJson.searchResult = [];
		GyoboInfoJson.key = siteCode;
		pushObject(GyoboInfoJson)
		console.log('url!!!',siteUrl)
	}


	return GyoboInfoJson
}

// 교보문고 정보 확인
async function getGyoboInfo(i, getGyoboNameCodes,  useLocation, searchRange, pushObject) {
	// 해당 코드 지점의 정보를 가져온다.
	siteCode = getGyoboNameCodes[i][0]
	var url = "http://www.kyobobook.co.kr/storen/MainStore.laf?SITE=" + siteCode + "&Kc=GNHHNOoffstore&orderClick=rvd"
	
	await axios.get(url).then(async function (result) {
		console.log('siteCode', siteCode)
		 parserGyoboInfo(url, result['data'], useLocation, searchRange, pushObject, siteCode);
	}).catch(function (error) {
		console.error("에러 발생 : ", error);

	});

}

// 교보문고 재고결과 파서
function parserGyoboStock(siteIndex, stockHtml, pushObject) {
	//<span class="author"> => 저자
	// <span class="company"> => 출판사
	// <span class="stock"> => <strong> =>  재고
	// <div class="tit"> => <strong> 제목
	// <span class="price_wrap"><span>정가</span> 가격
	var INF = 1000000
	var GyoboStockJson = new Object();
	var flag1 = '<span class="author">'; //저자
	var flag2 = '<span class="company">'; // 회사
	var flag3 = '<span class="stock">'; // 재고
	var flag4 = '<div class="tit">'; // 제목
	var flag5 = '<strong>'; // 재고
	var flag6 = '<span class="price">'; // 가격

	//저자
	var index = stockHtml.indexOf(flag1, 0)
	var gyoboAuth = ''
	for (var i = index + flag1.length; i < INF; i++) {
		if (stockHtml[i] == '<') {
			break
		}
		gyoboAuth += stockHtml[i]
	}

	//회사
	var index = stockHtml.indexOf(flag2, 0)
	var gyoboCompany = ''
	for (var i = index + flag2.length; i < INF; i++) {
		if (stockHtml[i] == '<') {
			break
		}
		gyoboCompany += stockHtml[i]
	}

	//재고
	var index = stockHtml.indexOf(flag3, 0)
	var index = stockHtml.indexOf(flag5, index + 10)
	var gyoboStock = ''
	for (var i = index + flag5.length; i < INF; i++) {
		if (stockHtml[i] == '<') {
			break
		}
		gyoboStock += stockHtml[i]
	}

	console.log('교보문고 재고 기록 !!!!!!!!!!!!!!!!!!', gyoboStock)
	//재고
	var index = stockHtml.indexOf(flag4, 0)
	var index = stockHtml.indexOf(flag5, index + 10)
	var gyoboBookName = ''
	for (var i = index + flag5.length; i < INF; i++) {
		if (stockHtml[i] == '<') {
			break
		}
		gyoboBookName += stockHtml[i]
	}

	// 가격
	var index = stockHtml.indexOf(flag6, 0)
	var gyoboPrice = ''
	for (var i = index + flag6.length; i < INF; i++) {
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
	pushObject(siteIndex, GyoboStockJson);

}

// 교보문고 재고 확인
async function getGyoboStock(siteIndex, siteCode, isbn, pushObject) {
	console.log('testeset')
	var url = "https://mobile.kyobobook.co.kr/welcomeStore/storeSearchDetail?siteCode=" + siteCode + "&productType=KOR&barcode=" + isbn
	await axios.get(url).then(function (result) {
		console.log('재고 htmlzhem!!!!!!!!!!!!!11', result['data'])
		return parserGyoboStock(siteIndex, result['data'], pushObject)
	}).catch(function (error) {
		console.error("에러 발생 : ", error);
	});

}

// 교보문고 이름 및 지점 코드 파서
function parserGyoboNameCode(gyoboData) {
	//모든 매장 이름, 코드를 가져온다.
	// <select id="store">를 찾는다.
	// value와 그사이 text를 가져온다.
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
	return returnGyoboNameCode
}

// 교보문고 크롤링 시작
async function startGyobo(isbnList, userLocation, searchRange, makerFunction) {

	var url = 'https://mobile.kyobobook.co.kr/welcomeStore/storeSearchList'
	var gyoboName = '교보문고';
	var gyoboImg = './images/kyobo.png';

	return await axios.get(url).then((result) => {
			return parserGyoboNameCode(result['data']);
		})
		.then(async (getGyoboNameCodes) => {
			const resultData = []
			const pushObject = (v) => {
				resultData.push(v);
			}

			for (var i = 0; i < getGyoboNameCodes.length; i++) { // 'E6' 신논현역 스토어 예외처리
				if (getGyoboNameCodes[i][0] == 'E6') {
					continue
				}
				await getGyoboInfo(i, getGyoboNameCodes, userLocation, searchRange, pushObject);
			}

			console.log('return', resultData)
			return resultData

		})
		.then(async (getData) => {

			const pushObject = (i, v) => {
				getData[i]['searchResult'].push(v);
			}

			var siteIndex = 0


			for (var k = 0; k < getData.length; k++) {

				siteIndex = k
				console.log(isbnList.length)
				for (var j = 0; j < isbnList.length; j++) {

					await getGyoboStock(siteIndex, getData[k]['key'], isbnList[j], pushObject)
					console.log('key!!!!!!!!!!!!!!', getData[k]['key'])
				}

			}

			return getData



		}).then((result) => {
			makerFunction(result, gyoboName, gyoboImg);
			console.log('result!!!', result)
			document.getElementsByClassName('loadBox')[0].style.display = "none";
		})
		.catch(function (error) { // 에러 처리
			console.error("에러 발생 : ", error);
		});
}
