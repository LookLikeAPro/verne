import {parseBodyToJson} from "./responseParsers";
import {mergeEntities} from "./utils";
import {compileUrl, removeUrlParams} from "./urlCompiler";

class ConnectorConfiguration {
	httpClient = fetch;
	parseBody = parseBodyToJson;
	entities = {};
	uniqueIdentifier = "id";
	model = "";
}

// list, create, retrieve, update, destroy

const RESTCONNECTORCONSTANT = "RESTCONNECTORCONSTANT";

class Connector extends ConnectorConfiguration {
	constructor() {
		super();
		const ACTIONPREFIX = RESTCONNECTORCONSTANT+this.model;
		this.constants = {
			list: {
				dispatch: ACTIONPREFIX+".LIST.DISPATCH",
				payload: ACTIONPREFIX+".LIST.PAYLOAD",
				fail: ACTIONPREFIX+".LIST.FAIL"
			}
		};
	}
	constructListParams(params = {}) {
		const url = compileUrl(this.endpoint, params);
		const filteredParams = removeUrlParams(this.endpoint, this.params);
		return {
			url: url,
			params: filteredParams
		};
	}
	list(params = {}) {
		const listRequestParams = this.constructListParams(params);
		return this.httpClient(listRequestParams.url, {
			method: "GET",
			params: listRequestParams.params
		}).then(this.parseBody);
	}
	selectListDispatch(action) {
		return action;
	}
	listDispatch(action) {
	}
	selectListPayload(action) {
		return {
			page: action.params.page || 1,
			count: action.data.count,
			next: action.data.next,
			previous: action.data.previous,
			results: action.data.results
		};
	}
	listPayload(action) {
		// this.cache = mergeEntities(this.uniqueIdentifier, this.cache, action.)
		const processedResults = this.selectListPayload(action);
		console.log(processedResults);
	}
	selectListFail(action) {
		return action;
	}
	listFail(action) {
	}
	reduce(state = {}, action) {
		switch (action.type) {
		case this.constants.list.dispatch:
			return this.listDispatch(action);
		case this.constants.list.payload:
			return this.listPayload(action);
		case this.constants.list.fail:
			return this.listFail(action);
		default:
			return state;
		}
	}
}

class GenericConnector extends Connector {
	state = {};
	dispatch(action) {
		this.state = this.reduce(this.state, action);
	}
	list(params = {}) {
		this.dispatch({type: this.constants.list.dispatch, params});
		return super.list(params).then((response) => {
			if (response.status >= 200 && response.status < 300) {
				this.listReturnedPayload(response, params);
			}
			else {
				this.listReturnedFail(response, params);
			}
		});
	}
	listReturnedPayload(response, params) {
		this.dispatch({
			type: this.constants.list.payload,
			data: response.responseBody,
			params
		});
	}
	listReturnedFail(response, params) {
		this.dispatch({
			type: this.constants.list.fail,
			error: response.responseBody,
			params
		});
	}
}

class ReduxConnector extends Connector {
	state = {
	}
	list(params = {}) {
		return (dispatch, getState) => {
			dispatch({type: this.constants.list.dispatch, params});
			super.list(params).then(function(response) {
				if (response.status >= 200 && response.status < 300) {
					this.listReturnedPayload(dispatch, response, params);
				}
				else {
					this.listReturnedFail(dispatch, response, params);
				}
			});
		};
	}
	listReturnedPayload(dispatch, response, params) {
		dispatch({
			type: this.constants.list.payload,
			data: response.responseBody,
			params
		});
	}
	listReturnedFail(dispatch, response, params) {
		dispatch({
			type: this.constants.list.fail,
			error: response.responseBody,
			params
		});
	}
}

class VendorConnector extends GenericConnector {
	endpoint = "/api/vendors/:slug";

}

var v = new VendorConnector();
v.list({});
