export function parseBodyToJson(response) {
	return response.json().then(function(json) {
		response.responseBody = json;
		return response;
	});
}

export function parseBodyToXML(response) {
	console.error("parseBodyToXML is not implemented");
}
