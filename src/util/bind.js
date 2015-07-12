module.exports = function(scope) {
	for (var i in scope) {
		if (typeof scope[i] === "function") {
			scope[i] = scope[i].bind(scope);
		}
	}
};