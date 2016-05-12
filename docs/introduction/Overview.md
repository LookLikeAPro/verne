# Overview

Verne is a REST API connector. The central piece is the connector class. Every REST API interface starts with subclassing either `GenericConnector` or `ReduxConnector`.

### Server

Verne expects a REST conforming API to work. A lot of things are flexible but the default are the following:

| Function      | HTTP Verb | URL  |
| ------------- |-----------|:----- |
| list          | GET       | [api]/ |
| create        | POST      | [api]/ |
| retrieve      | GET       | [api]/[:uniqueIdentifier] |
| update        | PUT       | [api]/[:uniqueIdentifier] |
| destroy       | DETELE    | [api]/[:uniqueIdentifier] |

### Configuration

Every connector needs two properties:

- `endpoint` is the address of the REST API

- `uniqueIdentifier` is the unique key used by the model. Defaults to `id`.

```js
class ModelConnector extends GenericConnector {
  endpoint = "/api/vendors/:slug";
  uniqueIdentifier = "slug";
  ...
}

```

### Actions

Actions are connector methods which can affect change to the server and the connector state. The default actions include `list, create, retrieve, update, destroy`, but more can be added easily.

### State

Each connector maintains its state as a dictionary. In `GenericConnector`, `state` is a connector field. In `ReduxConnector`, the state is stored via Redux.

The state looks like the following:

```js
{
  entities: {
    34: {
      retrievePending: false,
      retrieveFailed: false,
      updatePending: false,
      updateFailed: false,
      destroyPending: false,
      destroyFailed: false,
      createPending: false,
      createFailed: false,
      data: {
        id: 34,
        name: "a thing"
      }
    }
  },
  list: {
    1: {
      pending: false,
      failed: false,
      data: [1,2,3 ...]
    }
  }
}
```
The keys of the entities dictionary and the list is the field designated as `uniqueIdentifier` on the model.
