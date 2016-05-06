# Usage with app

Integrating Verne with apps is done through the following:

#### Input

Call methods `list, create, retrieve, update, destroy`

#### Output

Subclass delegate methods `listPayload`, `listFail`, `createPayload`, `createFail`, etc to update the application UI.

```javascript
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
```

When the delegate methods are called, the data is updated in `this.state`.

A popular way to hook into updates is to use observation. The following example uses node EventEmitter. However this is not included in Verne by default.

```javascript
import {GenericConnector} from "verne";

class VendorConnector extends GenericConnector {
	...
	listPayload(state, action) {
		const newState = super.listPayload(state, action);
    this.emit("change");
		return newState;
	}
	listFail(state, action) {
		const newState = super.listPayload(state, action);
    this.emit("change");
		return newState;
	}
  addChangeListener(callback) {
    this.on("change", callback);
  },
  removeChangeListener(callback) {
    this.removeListener("change", callback);
  }
}

const vendorConnector = Object.assign(EventEmitter.prototype, new VendorConnector());
```
Connectors set up with EventEmitter can be hooked into easily by UI pieces like so:

```javascript
class PageController extends Controller {
	...
	componentDidMount() {
		vendorConnector.addChangeListener(this._onChange);
	}
	componentWillUnmount() {
		vendorConnector.removeChangeListener(this._onChange);
	}
  onChange() {
    // Notified!
  }
}
```
