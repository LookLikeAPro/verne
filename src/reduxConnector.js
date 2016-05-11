import Connector from "./connector";

export default class ReduxConnector extends Connector {
	fakeBindRedux(dispatch, getState) {
		this.dispatch = dispatch;
		this.getState = getState;
	}
	list(params = {}) {
		return (dispatch, getState) => {
			this.fakeBindRedux(dispatch, getState);
			dispatch({type: this.constants.list.dispatch, params});
			this.makeRequest("list", params).then((response) => {
				if (response.status >= 200 && response.status < 300) {
					this.fakeBindRedux(dispatch, getState);
					this.listReturnedPayload(response, params);
				}
				else {
					this.fakeBindRedux(dispatch, getState);
					this.listReturnedFail(response, params);
				}
			});
		};
	}
	create(params = {}) {
		return (dispatch, getState) => {
			this.fakeBindRedux(dispatch, getState);
			dispatch({type: this.constants.create.dispatch, params});
			this.makeRequest("create", params).then((response) => {
				if (response.status >= 200 && response.status < 300) {
					this.fakeBindRedux(dispatch, getState);
					this.createReturnedPayload(response, params);
				}
				else {
					this.fakeBindRedux(dispatch, getState);
					this.createReturnedFail(response, params);
				}
			});
		};
	}
	retrieve(params = {}) {
		return (dispatch, getState) => {
			this.fakeBindRedux(dispatch, getState);
			dispatch({type: this.constants.retrieve.dispatch, params});
			this.makeRequest("retrieve", params).then((response) => {
				if (response.status >= 200 && response.status < 300) {
					this.fakeBindRedux(dispatch, getState);
					this.retrieveReturnedPayload(response, params);
				}
				else {
					this.fakeBindRedux(dispatch, getState);
					this.retrieveReturnedFail(response, params);
				}
			});
		};
	}
	update(params = {}) {
		return (dispatch, getState) => {
			this.fakeBindRedux(dispatch, getState);
			dispatch({type: this.constants.update.dispatch, params});
			this.makeRequest("update", params).then((response) => {
				if (response.status >= 200 && response.status < 300) {
					this.fakeBindRedux(dispatch, getState);
					this.updateReturnedPayload(response, params);
				}
				else {
					this.fakeBindRedux(dispatch, getState);
					this.updateReturnedFail(response, params);
				}
			});
		};
	}
	destroy(params = {}) {
		return (dispatch, getState) => {
			this.fakeBindRedux(dispatch, getState);
			dispatch({type: this.constants.destroy.dispatch, params});
			this.makeRequest("destroy", params).then(function(response) {
				if (response.status >= 200 && response.status < 300) {
					this.fakeBindRedux(dispatch, getState);
					this.destroyReturnedPayload(response, params);
				}
				else {
					this.fakeBindRedux(dispatch, getState);
					this.destroyReturnedFail(response, params);
				}
			});
		};
	}
}
