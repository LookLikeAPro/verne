import {parseBodyToJson} from "./responseParsers";
import {hashArray} from "./utils";
import {compileUrl, removeUrlParams} from "./urlCompiler";
import autobind from "./utils/autobind";

class ConnectorConfiguration {
	httpClient = fetch;
	parseBody = parseBodyToJson;
	entities = {};
	uniqueIdentifier = "id";
	uniqueDispatchNamespace = "";
	model = "";
	headers = {
		Accept: "application/json",
		"Content-Type": "application/json"
	};
	constructor() {
		if (!self.uniqueDispatchNamespace) {
			self.uniqueDispatchNamespace = self.model;
		}
		autobind(this);
	}
}

// list, create, retrieve, update, destroy

const RESTCONNECTORCONSTANT = "RESTCONNECTORCONSTANT";

export default class Connector extends ConnectorConfiguration {
	state = {
		entities: {},
		createResults: {},
		retrieveResults: {},
		updateResults: {},
		destroyResults: {},
		listResults: {}
	}
	constructor() {
		super();
		const ACTIONPREFIX = RESTCONNECTORCONSTANT+this.uniqueDispatchNamespace;
		this.constants = {
			list: {
				dispatch: ACTIONPREFIX+".LIST.DISPATCH",
				payload: ACTIONPREFIX+".LIST.PAYLOAD",
				fail: ACTIONPREFIX+".LIST.FAIL"
			},
			create: {
				dispatch: ACTIONPREFIX+".CREATE.DISPATCH",
				payload: ACTIONPREFIX+".CREATE.PAYLOAD",
				fail: ACTIONPREFIX+".CREATE.FAIL"
			},
			retrieve: {
				dispatch: ACTIONPREFIX+".RETRIEVE.DISPATCH",
				payload: ACTIONPREFIX+".RETRIEVE.PAYLOAD",
				fail: ACTIONPREFIX+".RETRIEVE.FAIL"
			},
			update: {
				dispatch: ACTIONPREFIX+".UPDATE.DISPATCH",
				payload: ACTIONPREFIX+".UPDATE.PAYLOAD",
				fail: ACTIONPREFIX+".UPDATE.FAIL"
			},
			destroy: {
				dispatch: ACTIONPREFIX+".DESTROY.DISPATCH",
				payload: ACTIONPREFIX+".DESTROY.PAYLOAD",
				fail: ACTIONPREFIX+".DESTROY.FAIL"
			}
		};
	}
	reduce(state = this.state, action) {
		switch (action.type) {
		case this.constants.list.dispatch:
			return this.listDispatch(state, action);
		case this.constants.list.payload:
			return this.listPayload(state, action);
		case this.constants.list.fail:
			return this.listFail(state, action);
		case this.constants.create.dispatch:
			return this.createDispatch(state, action);
		case this.constants.create.payload:
			return this.createPayload(state, action);
		case this.constants.create.fail:
			return this.createFail(state, action);
		case this.constants.retrieve.dispatch:
			return this.retrieveDispatch(state, action);
		case this.constants.retrieve.payload:
			return this.retrievePayload(state, action);
		case this.constants.retrieve.fail:
			return this.retrieveFail(state, action);
		case this.constants.update.dispatch:
			return this.updateDispatch(state, action);
		case this.constants.update.payload:
			return this.updatePayload(state, action);
		case this.constants.update.fail:
			return this.updateFail(state, action);
		case this.constants.destroy.dispatch:
			return this.destroyDispatch(state, action);
		case this.constants.destroy.payload:
			return this.destroyPayload(state, action);
		case this.constants.destroy.fail:
			return this.destroyFail(state, action);
		default:
			return state;
		}
	}
	constructCommonParams(params = {}) {
		return {
			headers: {
				...this.headers,
				...params.headers
			}
		};
	}
	constructListParams(params = {}) {
		const url = compileUrl(this.endpoint, params);
		const filteredParams = removeUrlParams(this.endpoint, this.params);
		return {
			...this.constructCommonParams(),
			url: url,
			params: filteredParams
		};
	}
	list(params = {}) {
		const listRequestParams = this.constructListParams(params);
		return this.httpClient(listRequestParams.url, {
			method: "GET",
			params: listRequestParams.params,
			headers: params.headers
		}).then(this.parseBody);
	}
	selectListDispatch(action) {
		return {
			...action,
			page: action.params.page || 1
		};
	}
	listDispatch(state, action) {
		const processedResults = this.selectListDispatch(action);
		return {
			...state,
			listResults: {
				...state.listResults,
				[processedResults.page]: {
					...(state.listResults[processedResults.page] || {}),
					loading: true
				}
			}
		};
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
	listPayload(state, action) {
		const processedResults = this.selectListPayload(action);
		return {
			...state,
			entities: {
				...state.entities,
				...hashArray(this.uniqueIdentifier, processedResults.results)
			},
			listResults: {
				...state.listResults,
				[processedResults.page]: {
					loading: false,
					error: false,
					data: processedResults.results
				}
			}
		};
	}
	selectListFail(action) {
		return {
			...action,
			page: action.params.page || 1
		};
	}
	listFail(state, action) {
		const processedResults = this.selectListFail(action);
		return {
			...state,
			listResults: {
				...state.listResults,
				[processedResults.page]: {
					...(state.listResults[processedResults.page] || {}),
					loading: false,
					error: false
				}
			}
		};
	}
	constructCreateParams(params = {}) {
		const url = compileUrl(this.endpoint, params);
		const filteredParams = removeUrlParams(this.endpoint, this.params);
		return {
			...this.constructCommonParams(),
			url: url,
			params: filteredParams
		};
	}
	create(params = {}) {
		const listRequestParams = this.constructListParams(params);
		return this.httpClient(listRequestParams.url, {
			method: "POST",
			params: listRequestParams.params,
			headers: params.headers
		}).then(this.parseBody);
	}
	selectCreateDispatch(action) {
		return {
			...action
		};
	}
	createDispatch(state, action) {
		const processedResults = this.selectListDispatch(action);
		return {
			...state,
			createResults: {
				...state.createResults,
				[processedResults.page]: {
					...(state.listResults[processedResults.page] || {}),
					loading: true
				}
			}
		};
	}
	selectCreatePayload(action) {
		return {
			page: action.params.page || 1,
			count: action.data.count,
			next: action.data.next,
			previous: action.data.previous,
			results: action.data.results
		};
	}
	createPayload(state, action) {
		const processedResults = this.selectListPayload(action);
		return {
			...state,
			createResults: {
				...state.createResults,
				[processedResults.page]: {
					loading: false,
					error: false,
					data: processedResults.results
				}
			}
		};
	}
	selectCreateFail(action) {
		return {
			...action,
			page: action.params.page || 1
		};
	}
	createFail(state, action) {
		const processedResults = this.selectListFail(action);
		return {
			...state,
			createResults: {
				...state.createResults,
				[processedResults.page]: {
					...(state.createResults[processedResults.page] || {}),
					loading: false,
					error: false
				}
			}
		};
	}
	constructRetrieveParams(params = {}) {
		const url = compileUrl(this.endpoint, params);
		const filteredParams = removeUrlParams(this.endpoint, this.params);
		return {
			...this.constructCommonParams(),
			url: url,
			params: filteredParams
		};
	}
	retrieve(params = {}) {
		const listRequestParams = this.constructListParams(params);
		return this.httpClient(listRequestParams.url, {
			method: "GET",
			params: listRequestParams.params,
			headers: params.headers
		}).then(this.parseBody);
	}
	selectRetrieveDispatch(action) {
		return {
			...action
		};
	}
	retrieveDispatch(state, action) {
		const processedResults = this.selectListDispatch(action);
		return {
			...state,
			retrieveResults: {
				...state.retrieveResults,
				[processedResults.params[this.uniqueIdentifier]]: {
					...(state.retrieveResults[processedResults.params[this.uniqueIdentifier]] || {}),
					loading: true
				}
			}
		};
	}
	selectRetrievePayload(action) {
		return {
			...action
		};
	}
	retrievePayload(state, action) {
		const processedResults = this.selectRetrievePayload(action);
		return {
			...state,
			retrieveResults: {
				...state.retrieveResults,
				[processedResults.params[this.uniqueIdentifier]]: {
					loading: false,
					error: false,
					data: processedResults.data
				}
			}
		};
	}
	selectRetrieveFail(action) {
		return {
			...action,
			page: action.params.page || 1
		};
	}
	retrieveFail(state, action) {
		const processedResults = this.selectRetrieveFail(action);
		return {
			...state,
			createResults: {
				...state.createResults,
				[processedResults.page]: {
					...(state.createResults[processedResults.page] || {}),
					loading: false,
					error: false
				}
			}
		};
	}
	constructUpdateParams(params = {}) {
		const url = compileUrl(this.endpoint, params);
		const filteredParams = removeUrlParams(this.endpoint, this.params);
		return {
			...this.constructCommonParams(),
			url: url,
			params: filteredParams
		};
	}
	update(params = {}) {
		const listRequestParams = this.constructListParams(params);
		return this.httpClient(listRequestParams.url, {
			method: "POST",
			params: listRequestParams.params,
			headers: params.headers
		}).then(this.parseBody);
	}
	selectUpdateDispatch(action) {
		return {
			...action
		};
	}
	updateDispatch(state, action) {
		const processedResults = this.selectListDispatch(action);
		return {
			...state,
			createResults: {
				...state.createResults,
				[processedResults.page]: {
					...(state.listResults[processedResults.page] || {}),
					loading: true
				}
			}
		};
	}
	selectUpdatePayload(action) {
		return {
			page: action.params.page || 1,
			count: action.data.count,
			next: action.data.next,
			previous: action.data.previous,
			results: action.data.results
		};
	}
	updatePayload(state, action) {
		const processedResults = this.selectListPayload(action);
		return {
			...state,
			createResults: {
				...state.createResults,
				[processedResults.page]: {
					loading: false,
					error: false,
					data: processedResults.results
				}
			}
		};
	}
	selectUpdateFail(action) {
		return {
			...action,
			page: action.params.page || 1
		};
	}
	updateFail(state, action) {
		const processedResults = this.selectListFail(action);
		return {
			...state,
			createResults: {
				...state.createResults,
				[processedResults.page]: {
					...(state.createResults[processedResults.page] || {}),
					loading: false,
					error: false
				}
			}
		};
	}
	constructDestroyParams(params = {}) {
		const url = compileUrl(this.endpoint, params);
		const filteredParams = removeUrlParams(this.endpoint, this.params);
		return {
			...this.constructCommonParams(),
			url: url,
			params: filteredParams
		};
	}
	destroy(params = {}) {
		const listRequestParams = this.constructListParams(params);
		return this.httpClient(listRequestParams.url, {
			method: "POST",
			params: listRequestParams.params,
			headers: params.headers
		}).then(this.parseBody);
	}
	selectDestroyDispatch(action) {
		return {
			...action
		};
	}
	destroyDispatch(state, action) {
		const processedResults = this.selectListDispatch(action);
		return {
			...state,
			createResults: {
				...state.createResults,
				[processedResults.page]: {
					...(state.listResults[processedResults.page] || {}),
					loading: true
				}
			}
		};
	}
	selectDestroyPayload(action) {
		return {
			page: action.params.page || 1,
			count: action.data.count,
			next: action.data.next,
			previous: action.data.previous,
			results: action.data.results
		};
	}
	destroyPayload(state, action) {
		const processedResults = this.selectListPayload(action);
		return {
			...state,
			createResults: {
				...state.createResults,
				[processedResults.page]: {
					loading: false,
					error: false,
					data: processedResults.results
				}
			}
		};
	}
	selectDestroyFail(action) {
		return {
			...action,
			page: action.params.page || 1
		};
	}
	destroyFail(state, action) {
		const processedResults = this.selectListFail(action);
		return {
			...state,
			createResults: {
				...state.createResults,
				[processedResults.page]: {
					...(state.createResults[processedResults.page] || {}),
					loading: false,
					error: false
				}
			}
		};
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
	createReturnedPayload(response, params) {
		this.dispatch({
			type: this.constants.create.payload,
			data: response.responseBody,
			params
		});
	}
	createReturnedFail(response, params) {
		this.dispatch({
			type: this.constants.create.fail,
			error: response.responseBody,
			params
		});
	}
	retrieveReturnedPayload(response, params) {
		this.dispatch({
			type: this.constants.retrieve.payload,
			data: response.responseBody,
			params
		});
	}
	retrieveReturnedFail(response, params) {
		this.dispatch({
			type: this.constants.retrieve.fail,
			error: response.responseBody,
			params
		});
	}
	updateReturnedPayload(response, params) {
		this.dispatch({
			type: this.constants.update.payload,
			data: response.responseBody,
			params
		});
	}
	updateReturnedFail(response, params) {
		this.dispatch({
			type: this.constants.update.fail,
			error: response.responseBody,
			params
		});
	}
	destroyReturnedPayload(response, params) {
		this.dispatch({
			type: this.constants.destroy.payload,
			data: response.responseBody,
			params
		});
	}
	destroyReturnedFail(response, params) {
		this.dispatch({
			type: this.constants.destroy.fail,
			error: response.responseBody,
			params
		});
	}
}
