function getIsbnList(title, pageSize = 10) {
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
