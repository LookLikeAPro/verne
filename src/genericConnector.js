import Connector from "./connector";
import {capitalizeFirstLetter} from "./utils/string";

export default class GenericConnector extends Connector {
	constructor() {
		super();
		this.registerAction("list");
		this.registerAction("create");
		this.registerAction("retrieve");
		this.registerAction("update");
		this.registerAction("destroy");
	}
	dispatch(action) {
		this.state = this.reduce(this.state, action);
	}
	getState() {
		return this.state;
	}
	registerAction(actionName) {
		super.registerAction(actionName);
		this[actionName] = (params = {}) => {
			this.dispatch({type: this.constants[actionName].dispatch, params});
			return this.makeRequest(actionName, params).then((response) => {
				this["handle"+capitalizeFirstLetter(actionName)+"Return"]({dispatch: this.dispatch, getState: this.getState, response, params});
			});
		};
	}
}
