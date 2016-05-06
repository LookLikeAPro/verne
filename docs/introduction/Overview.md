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

```javascript
class ModelConnector extends GenericConnector {
  endpoint = "/api/vendors/:slug";
  uniqueIdentifier = "id";
  ...
}

```

### Actions
