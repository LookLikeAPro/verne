function autobind(self, proto) {
	for (var key of Object.getOwnPropertyNames(proto)) {
		if (key !== "constructor") {
			self[key] = self[key].bind(self);
		}
	}
	var parentProto = Object.getPrototypeOf(proto);
	if (parentProto !== Object.prototype) {
		autobind(self, parentProto);
	}
}

module.exports = function(self) {
	autobind(self, self.constructor.prototype);
};
