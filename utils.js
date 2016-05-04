function hashArray(field, arr) {
	return arr.reduce(function(memo, extended, key) {
		memo[extended[field]] = extended;
		return memo;
	}, {});
}

export function mergeArray(field, basic, ext) {
	const basicHash = hashArray(field, basic);
	const extHash = hashArray(field, ext);
	var mergedArray = basic;
	for (var key in extHash) {
		if (extHash.hasOwnProperty(key)) {
			if (basicHash.hasOwnProperty(key)) {
				Object.assign(basicHash[key], extHash[key]);
			}
			else {
				mergedArray.push(extHash[key]);
			}
		}
	}
	return mergedArray;
}

export function mergeEntities(field, basic, ext) {
	const basicHash = hashArray(field, basic);
	const extHash = hashArray(field, ext);
	var mergedDict = {
		...basic
	};
	for (var key in extHash) {
		if (extHash.hasOwnProperty(key)) {
			if (basicHash.hasOwnProperty(key)) {
				Object.assign(basicHash[key], extHash[key]);
			}
			else {
				mergedDict[key] = extHash[key];
			}
		}
	}
	return mergedDict;
}
