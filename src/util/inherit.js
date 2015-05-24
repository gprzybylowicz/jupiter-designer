module.exports = function(childClass, baseClass) {
	childClass.prototype = Object.create(baseClass.prototype);
	childClass.prototype.constructor = childClass;
};