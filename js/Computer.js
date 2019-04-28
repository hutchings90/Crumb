function Computer() {
	Player.call(this, 'Computer', 'green');
	this.stash = document.getElementById('computer-stash');
	this.stashCount = this.stash.children[1].children[0].children[1].children[0];
	this.handCountMineView = document.getElementById('computer-hand').children[1].children[0].children[1].children[0];
	this.handCountTheirsView = document.getElementById('computer-hand').children[1].children[1].children[1].children[0];
	this.base = document.getElementById('board').children[0].children[0];
	this.baseCountView = document.getElementById('computer-base').children[1].children[0].children[1].children[0];
}

Computer.prototype = Object.create(Player.prototype);
Computer.constructor = Computer;

Computer.prototype.chooseStart = function(spaces) {
	var func;
	var me = this;
	if (this.stashCrumbs.length > 0) func = function() {
		me.dispatchTakeFromStash();
	};
	else {
		var space = spaces[Math.floor(Math.random() * spaces.length)];
		func = function() {
			space.onclick({
				isComputer: true,
				target: space
			});
		};
	}
	setTimeout(func, 500);
};

Computer.prototype.chooseHandCrumb = function() {
	if (Math.floor(Math.random() * 2)) this.dispatchTakeFromHandMine();
	else this.dispatchTakeFromHandTheirs();
};

Computer.prototype.placeCrumb = function(spaces) {
	var bestRow = 0;
	var bestSpaces = [];
	for (var i = spaces.length - 1; i >= 0; i--) {
		var space = spaces[i];
		if (space.dataset.type == 'gate') {
			bestSpaces = [ space ];
			break;
		}
		var row = Number(space.dataset.row);
		if (row > bestRow) {
			bestRow = row;
			bestSpaces = [ space ];
		}
		else if (row == bestRow) {
			bestSpaces.push(space);
		}
	}
	var chosenSpace = bestSpaces[Math.floor(Math.random() * bestSpaces.length)];
	setTimeout(function() {
		chosenSpace.onclick({
			isComputer: true,
			target: chosenSpace
		});
	}, 500);
};