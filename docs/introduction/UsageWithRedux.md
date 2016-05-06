# Usage with Redux

Verne is originally designed for Redux. Even when used without Redux, Verne internally uses the dispatch-reduce pattern to modify state.

Using it with redux is very simple.

During store setup, add the verne connectors as reducers. Make sure the middleware `redux-thunk` is included.

```javascript
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
That's it!
