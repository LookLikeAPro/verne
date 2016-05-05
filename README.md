# Verne

A highly configurable REST API connector

It helps you write applications that communicate with REST Api with very little code, apply familiar OOP principles instead of managing promises and callbacks, and run in all environments (flux dataflow webapp, MVC webapp, and server).

Verne requires ES6 classes and ES7 field initalizers to run. It is recommended to use Verne in a Webpack/Babel environment.

![](/docs/assets/verne_moon.png)

This project is incomplete! You are welcome to look at the docs and give feedback & suggestions.

## The Gist

Subclass a connector, and configure its endpoint to a REST conforming server.

The standard REST actions: `list, create, retrieve, update, destroy` are now avaliable.

Get notified by delegate methods `listPayload`, `listFail`, `createPayload`, `createFail` to update the application UI.

```
import {GenericConnector} from "verne";

class VendorConnector extends GenericConnector {
	uniqueIdentifier = "slug";
	endpoint = "/api/vendors/:slug";
	listPayload(state, action) {
		const newState = super.listPayload(state, action);
		// Notify app to update UI (show listed items)
		return newState;
	}
	listFail(state, action) {
		const newState = super.listPayload(state, action);
		// Notify app to update UI (show error)
		return newState;
	}
}

const vendorConnector = new VendorConnector();

vendorConnector.list();

```

Or, use Verne for its original purpose, acting alongside Redux.

```
import {combineReducers, createStore} from "redux";
import {ReduxConnector} from "verne";
import thunk from "redux-thunk";

class VendorConnector extends ReduxConnector {
	uniqueIdentifier = "slug";
	endpoint = "/api/vendors/:slug";
}

const vendorConnector = new VendorConnector();

const rootReducer = combineReducers({
	vendors: vendorConnector.reduce
});

const store = createStore(
	rootReducer,
	initialState,
	compose(
		applyMiddleware(thunk)
	)
);

```
