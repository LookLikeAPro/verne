import {parseBodyToJson} from "./responseParsers";
import {hashArray} from "./utils/entities";
import {compileUrl, removeUrlParams, buildQueryString} from "./urlCompiler";
import autobind from "./utils/autoBind";
import {capitalizeFirstLetter} from "./utils/string";

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
		list: {}
	}
	constants = {};
	constructor() {
		super();
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
	makeRequest(action, params = {}) {
		const requestParams = this["construct"+capitalizeFirstLetter(action)+"Params"](params);
		return this.httpClient(requestParams.url, {
			method: requestParams.method,
			params: requestParams.params,
			headers: params.headers
		}).then(this.parseBody);
	}
	constructListParams(params = {}) {
		const filteredParams = removeUrlParams(this.endpoint, params);
		const urlBase = compileUrl(this.endpoint, params);
		const url = urlBase + "?" + buildQueryString(filteredParams);
		return {
			...this.constructCommonParams(),
			url: url,
			params: filteredParams,
			method: "GET"
		};
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
			list: {
				...state.list,
				[processedResults.page]: {
					...(state.list[processedResults.page] || {}),
					pending: true
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
		const dictionaryOfResults = hashArray(this.uniqueIdentifier, processedResults.results);
		for (var key in dictionaryOfResults) {
			if (dictionaryOfResults.hasOwnProperty(key)) {
				dictionaryOfResults[key] = {
					data: dictionaryOfResults[key]
				};
			}
		}
		return {
			...state,
			entities: {
				...state.entities,
				...dictionaryOfResults
			},
			list: {
				...state.list,
				[processedResults.page]: {
					pending: false,
					failed: false,
					count: processedResults.count,
					data: Object.keys(dictionaryOfResults)
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
			list: {
				...state.list,
				[processedResults.page]: {
					...(state.list[processedResults.page] || {}),
					pending: false,
					failed: true
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
			params: filteredParams,
			method: "POST"
		};
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
			params: filteredParams,
			method: "GET"
		};
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
			entities: {
				...state.entities,
				[processedResults.params[this.uniqueIdentifier]]: {
					...(state.entities[processedResults.params[this.uniqueIdentifier]] || {}),
					retrievePending: true
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
			entities: {
				...state.entities,
				[processedResults.params[this.uniqueIdentifier]]: {
					...(state.entities[processedResults.params[this.uniqueIdentifier]] || {}),
					retrievePending: false,
					retrieveFailed: false,
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
			entities: {
				...state.entities,
				[processedResults.params[this.uniqueIdentifier]]: {
					...(state.entities[processedResults.params[this.uniqueIdentifier]] || {}),
					retrievePending: false,
					retrieveFailed: false
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
			params: filteredParams,
			method: "PUT"
		};
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
			params: filteredParams,
			method: "DELETE"
		};
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
		return action;
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
	registerAction(actionName) {
		const ACTIONPREFIX = RESTCONNECTORCONSTANT+this.uniqueDispatchNamespace;
		this.constants = {
			...this.constants,
			[actionName]: {
				dispatch: ACTIONPREFIX+`.${actionName}.DISPATCH`,
				payload: ACTIONPREFIX+`.${actionName}.PAYLOAD`,
				fail: ACTIONPREFIX+`.${actionName}.FAIL`
			}
		};
		this["handle"+capitalizeFirstLetter(actionName)+"Return"] = function({dispatch, getState, response, params}) {
			if (response.status >= 200 && response.status < 300) {
				dispatch({
					type: this.constants[actionName].payload,
					data: response.responseBody,
					params
				});
			}
			else {
				dispatch({
					type: this.constants[actionName].fail,
					error: response.responseBody,
					params
				});
			}
		};
	}
}
