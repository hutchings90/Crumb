function View() {}

View.prototype.hasClassName = function(e, className) {
	return e.className.includes(className);
};

View.prototype.addClassName = function(e, className) {
	if (this.hasClassName(e, className)) return;
	if (e.className.length > 0) e.className = e.className + ' ';
	e.className = e.className + className;
};

View.prototype.removeClassName = function(e, className) {
	e.className = e.className.replace(new RegExp(className, 'g'), '').replace(/\s+/g, ' ').trim();
};

View.prototype.hasClassNameSVG = function(e, className) {
	return e.className.baseVal.includes(className);
};

View.prototype.addClassNameSVG = function(e, className) {
	if (this.hasClassNameSVG(e, className)) return;
	if (e.className.baseVal.length > 0) e.className.baseVal = e.className.baseVal + ' ';
	e.className.baseVal = e.className.baseVal + className;
};

View.prototype.removeClassNameSVG = function(e, className) {
	e.className.baseVal = e.className.baseVal.replace(new RegExp(className, 'g'), '').replace(/\s+/g, ' ').trim();
};

View.prototype.clearHexes = function(selector) {
	if (selector) {
		var hexes = document.querySelectorAll(selector);
		for (var i = hexes.length - 1; i >= 0; i--) {
			this.clearHex(hexes[i]);
		}
	}
	else {
		this.clearUsedPolygons();
		this.clearCurrentPolygons();
		this.clearAvailablePolygons();
	}
};

View.prototype.clearUsedPolygons = function() {
	this.clearHexes('polygon.used');
};

View.prototype.clearCurrentPolygons = function() {
	this.clearHexes('polygon.current');
};

View.prototype.clearAvailablePolygons = function() {
	this.clearHexes('polygon.available');
};

View.prototype.clearHex = function(e) {
	this.removeClassNameSVG(e, 'used');
	this.removeClassNameSVG(e, 'current');
	this.removeClassNameSVG(e, 'available');
};

const v = View.prototype;