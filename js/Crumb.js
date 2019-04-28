function Crumb(color) {
	this.view = document.createElement('div');
	this.view.className = 'crumb';
	this.setColor(color);
}

Crumb.prototype.setColor = function(color) {
	this.color = color;
	v.addClassName(this.view, this.color);
};