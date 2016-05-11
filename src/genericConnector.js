import Connector from "./connector";

export default class GenericConnector extends Connector {
	dispatch(action) {
		this.state = this.reduce(this.state, action);
	}
	list(params = {}) {
		this.dispatch({type: this.constants.list.dispatch, params});
		return this.makeRequest("list", params).then((response) => {
			if (response.status >= 200 && response.status < 300) {
				this.listReturnedPayload(response, params);
			}
			else {
				this.listReturnedFail(response, params);
			}
		});
	}
	create(params = {}) {
		this.dispatch({type: this.constants.create.dispatch, params});
		return this.makeRequest("create", params).then((response) => {
			if (response.status >= 200 && response.status < 300) {
				this.createReturnedPayload(response, params);
			}
			else {
				this.createReturnedFail(response, params);
			}
		});
	}
	retrieve(params = {}) {
		this.dispatch({type: this.constants.retrieve.dispatch, params});
		return this.makeRequest("retrieve", params).then((response) => {
			if (response.status >= 200 && response.status < 300) {
				this.retrieveReturnedPayload(response, params);
			}
			else {
				this.retrieveReturnedFail(response, params);
			}
		});
	}
	update(params = {}) {
		this.dispatch({type: this.constants.update.dispatch, params});
		return this.makeRequest("update", params).then((response) => {
			if (response.status >= 200 && response.status < 300) {
				this.updateReturnedPayload(response, params);
			}
			else {
				this.updateReturnedFail(response, params);
			}
		});
	}
	destroy(params = {}) {
		this.dispatch({type: this.constants.destroy.dispatch, params});
		return this.makeRequest("destroy", params).then((response) => {
			if (response.status >= 200 && response.status < 300) {
				this.destroyReturnedPayload(response, params);
			}
			else {
				this.destroyReturnedFail(response, params);
			}
		});
	}
}
