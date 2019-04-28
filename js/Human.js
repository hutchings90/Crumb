function Human() {
	var me = this;
	Player.call(this, 'Human', 'blue');
	this.stash = document.getElementById('human-stash');
	this.stashCount = this.stash.children[1].children[0].children[1].children[0];
	this.stash.onclick = function() {
		me.dispatchTakeFromStash();
	}
	this.handCountMineView = document.getElementById('human-hand').children[1].children[0].children[1].children[0];
	this.handCountMineView.parentElement.parentElement.onclick = function() {
		me.dispatchTakeFromHandMine();
	}
	this.handCountTheirsView = document.getElementById('human-hand').children[1].children[1].children[1].children[0];
	this.handCountTheirsView.parentElement.parentElement.onclick = function() {
		me.dispatchTakeFromHandTheirs();
	}
	this.base = document.getElementById('board').children[0].children[5];
	this.baseCountView = document.getElementById('human-base').children[1].children[0].children[1].children[0];
}

Human.prototype = Object.create(Player.prototype);
Human.constructor = Human;