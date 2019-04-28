function Player(name, color) {
	this.gameView = document.getElementById('game');
	this.name = name;
	this.stashCrumbs = [];
	this.handCrumbs = [];
	this.handCountMine = 0;
	this.handCountTheirs = 0;
	this.boardCrumbs = [];
	this.baseCrumbs = [];
	this.color = color;
	this.theirColor = color == 'green' ? 'blue' : 'green';
}

Player.prototype.activateStash = function() {
	v.addClassName(this.stash, 'available');
};

Player.prototype.deactivateStash = function() {
	v.removeClassName(this.stash, 'available');
};

Player.prototype.activateHandMine = function() {
	this.deactivateHandMine();
	v.addClassName(this.handCountMineView.parentElement.parentElement, 'available');
};

Player.prototype.selectHandMine = function() {
	this.deactivateHand();
	if (this.handCountTheirs > 0) this.activateHandTheirs();
	if (this.name == 'Human') v.addClassName(this.handCountMineView.parentElement.parentElement, 'selected');
	this.selectedColor = this.color;
};

Player.prototype.deactivateHandMine = function() {
	v.removeClassName(this.handCountMineView.parentElement.parentElement, 'available');
	v.removeClassName(this.handCountMineView.parentElement.parentElement, 'selected');
	this.selectedColor = null;
};

Player.prototype.activateHandTheirs = function() {
	this.deactivateHandTheirs();
	v.addClassName(this.handCountTheirsView.parentElement.parentElement, 'available');
};

Player.prototype.selectHandTheirs = function() {
	this.deactivateHand();
	if (this.handCountMine > 0) this.activateHandMine();
	if (this.name == 'Human') v.addClassName(this.handCountTheirsView.parentElement.parentElement, 'selected');
	this.selectedColor = this.theirColor;
};

Player.prototype.deactivateHandTheirs = function() {
	v.removeClassName(this.handCountTheirsView.parentElement.parentElement, 'available');
	v.removeClassName(this.handCountTheirsView.parentElement.parentElement, 'selected');
	this.selectedColor = null;
};

Player.prototype.activateHand = function() {
	this.activateHandMine();
	this.activateHandTheirs();
};

Player.prototype.deactivateHand = function() {
	this.deactivateHandMine();
	this.deactivateHandTheirs();
};

Player.prototype.takeFromStash = function() {
	var handCountMine = 0;
	this.handCrumbs = this.handCrumbs.concat(this.stashCrumbs.splice(0, 5));
	this.stashCount.innerHTML = this.stashCrumbs.length;
	for (var i = this.handCrumbs.length - 1; i >= 0; i--) {
		var crumb = this.handCrumbs[i];
		if (crumb.color == this.color) handCountMine++;
		else handCountTheirs++;
	}
	this.setHandCountMine(handCountMine);
	this.setHandCountTheirs(0);
};

Player.prototype.setHandCountMine = function(count) {
	this.handCountMine = count;
	this.handCountMineView.innerHTML = count;
};

Player.prototype.setHandCountTheirs = function(count) {
	this.handCountTheirs = count;
	this.handCountTheirsView.innerHTML = count;
};

Player.prototype.dispatchTakeFromStash = function() {
	this.gameView.dispatchEvent(new CustomEvent('takefromstash', { detail: this }));
};

Player.prototype.dispatchTakeFromHandMine = function() {
	this.gameView.dispatchEvent(new CustomEvent('takefromhandmine', { detail: this }));
};

Player.prototype.dispatchTakeFromHandTheirs = function() {
	this.gameView.dispatchEvent(new CustomEvent('takefromhandtheirs', { detail: this }));
};

Player.prototype.takeCrumbFromHand = function() {
	var crumb = this.getCrumb();
	if (this.selectedColor == this.color) this.setHandCountMine(this.handCountMine - 1);
	else this.setHandCountTheirs(this.handCountTheirs - 1);
	return crumb;
};

Player.prototype.getCrumb = function() {
	var color = this.selectedColor;
	var crumbs = this.handCrumbs;
	for (var i = crumbs.length - 1; i >= 0; i--) {
		var crumb = crumbs[i];
		if (crumb.color == color) return crumbs.splice(i, 1)[0];
	}
};

Player.prototype.putGroupInHand = function(group) {
	var count = group.dataset.count;
	if (group.children[0].getAttribute('fill') == this.color) this.putCrumbsInHandMine(count);
	else this.putCrumbsInHandTheirs(count);
};

Player.prototype.putCrumbsInHandMine = function(count) {
	for (var i = count - 1; i >= 0; i--) {
		this.handCrumbs.push(new Crumb(this.color));
	}
	this.setHandCountMine(count);
};

Player.prototype.putCrumbsInHandTheirs = function(count) {
	for (var i = count - 1; i >= 0; i--) {
		this.handCrumbs.push(new Crumb(this.theirColor));
	}
	this.setHandCountTheirs(count);
};

Player.prototype.addBaseCrumb = function() {
	this.baseCrumbs.push(new Crumb(this.color));
	this.baseCountView.innerHTML = this.baseCrumbs.length;
};

Player.prototype.reset = function() {
	this.resetHand();
	this.resetStash();
	this.resetBase();
};

Player.prototype.resetHand = function() {
	this.deactivateHand();
	this.setHandCountTheirs(0);
	this.setHandCountMine(0);
};

Player.prototype.resetStash = function() {
	var color = this.color;
	this.stashCrumbs = [ new Crumb(color), new Crumb(color), new Crumb(color), new Crumb(color), new Crumb(color), new Crumb(color), new Crumb(color), new Crumb(color), new Crumb(color), new Crumb(color) ]
	this.stashCount.innerHTML = this.stashCrumbs.length;
};

Player.prototype.resetBase = function() {
	this.baseCrumbs = [];
	this.baseCountView.innerHTML = 0;
};