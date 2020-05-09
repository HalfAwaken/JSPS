function getRealJsonData(baseStr) {
	if(!baseStr || typeof baseStr != 'string') return;
	var jsonData = null;
	try {
		jsonData = JSON.parse(baseStr);
	} catch(err) {
		return null;
	}
	var needReplaceStrs = [];
	loopFindArrOrObj(jsonData, needReplaceStrs);
	needReplaceStrs.forEach(function(replaceInfo) {
		var matchArr = baseStr.match(eval('/"' + replaceInfo.key + '":[0-9]{15,}/'));
		if(matchArr) {
			var str = matchArr[0];
			var replaceStr = str.replace('"' + replaceInfo.key + '":', '"' + replaceInfo.key + '":"');
			replaceStr += '"';
			baseStr = baseStr.replace(str, replaceStr);
		}
	});
	var returnJson = null;
	try {
		returnJson = JSON.parse(baseStr);
	} catch(err) {
		return null;
	}
	return returnJson;
}

/**
 * 遍历对象类型的
 */
function getNeedRpStrByObj(obj, needReplaceStrs) {
	for(var key in obj) {
		var value = obj[key];
		// 大于这个数说明精度会丢失!
		if(typeof value == 'number' && value > 9007199254740992) {
			needReplaceStrs.push({
				key: key
			});
		}
		loopFindArrOrObj(value, needReplaceStrs);
	}
}

/**
 * 判断数据类型
 */
function getNeedRpStrByArr(arr, needReplaceStrs) {
	for(var i = 0; i < arr.length; i++) {
		var value = arr[i];
		loopFindArrOrObj(value, needReplaceStrs);
	}
}
/**
 * 递归遍历
 */
function loopFindArrOrObj(value, needRpStrArr) {
	var valueTypeof = Object.prototype.toString.call(value);
	if(valueTypeof == '[object Object]') {
		needRpStrArr.concat(getNeedRpStrByObj(value, needRpStrArr));
	}
	if(valueTypeof == '[object Array]') {
		needRpStrArr.concat(getNeedRpStrByArr(value, needRpStrArr));
	}
}