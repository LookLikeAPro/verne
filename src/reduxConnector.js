import Connector from "./connector";
import {capitalizeFirstLetter} from "./utils/string";

export default class ReduxConnector extends Connector {
	constructor() {
		super();
		this.registerAction("list");
		this.registerAction("create");
		this.registerAction("retrieve");
		this.registerAction("update");
		this.registerAction("destroy");
	}
	registerAction(actionName) {
		super.registerAction(actionName);
		this[actionName] = (params = {}) => {
			return (dispatch, getState) => {
				dispatch({type: this.constants[actionName].dispatch, params});
				this.makeRequest(actionName, params).then((response) => {
					this["handle"+capitalizeFirstLetter(actionName)+"Return"]({dispatch, getState, response, params});
				});
			};
		};
	}
}
