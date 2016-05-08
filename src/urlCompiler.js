export function compileUrl(url, params) {
	for (var key in params) {
		if (params.hasOwnProperty(key)) {
			const regex = new RegExp(":"+key, "g");
			url = url.replace(regex, params[key]);
		}
	}
	const blankRegex = /(:[a-zA-Z])\w+/g;
	url = url.replace(blankRegex, "");
	return url;
}

export function removeUrlParams(url, params) {
	for (var key in params) {
		if (params.hasOwnProperty(key)) {
			const regex = new RegExp(":"+key, "g");
			const searchResult = url.search(regex);
			if (searchResult === -1) {
			}
			else {
				delete params[key];
			}
		}
	}
	return params;
}

export function buildQueryString(obj, prefix) {
	var str = [];
	for (var p in obj) {
		if (obj.hasOwnProperty(p)) {
			var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
			str.push(typeof v === "object" ?
				buildQueryString(v, k) :
				encodeURIComponent(k) + "=" + encodeURIComponent(v));
		}
	}
	return str.join("&");
}
