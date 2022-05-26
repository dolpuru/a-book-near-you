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


function asyncgetYes24Names() {
    var returnValue = ''
    axios.get("http://www.yes24.com/Mall/UsedStore/Detail/Seomyeon").then((result) => {
        returnValue = parserYes24Name(result['data']);
        // console.log(returnValue)
        return returnValue
    }).catch(function (error) {
        console.log("에러 발생 : ", error); // 에러처리 해주기
    });
    return returnValue
}
