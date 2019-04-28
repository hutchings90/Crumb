function Game() {
	this.takeFromStash = this.empty;
	this.clickSpace = this.empty;
	this.players = [ new Human(), new Computer()];
	this.view = document.getElementById('game');
	this.board = document.getElementById('board');
	this.crumbs = document.getElementById('crumbs');
	this.winBackground = document.getElementById('win-background');
	this.humanWinText = document.getElementById('human-win-text');
	this.computerWinText = document.getElementById('computer-win-text');
	this.activePlayer = null;
	this.activeSpace = null;
	this.setEventListeners();
	this.setOnClicks();
	this.start();
}

Game.prototype.start = function() {
	this.winBackground.setAttribute('visibility', 'hidden');
	this.humanWinText.setAttribute('visibility', 'hidden');
	this.computerWinText.setAttribute('visibility', 'hidden');
	var players = this.players;
	while (this.crumbs.lastChild) this.crumbs.removeChild(this.crumbs.lastChild);
	for (var i = players.length - 1; i >= 0; i--) {
		players[i].reset();
	}
	if (Math.floor(Math.random() * players.length)) this.activateHuman();
	else this.activateComputer();
};

Game.prototype.end = function() {
	var me = this;
	setTimeout(function() {
		me.start();
	}, 5000);
	v.clearHexes();
	this.winBackground.setAttribute('visibility', 'visible');
	if (this.activePlayer.name == 'Human') this.humanWinText.setAttribute('visibility', 'visible');
	else this.computerWinText.setAttribute('visibility', 'visible');
};

Game.prototype.activatePlayer = function(i) {
	this.activePlayer = this.players[i];
	var spaces = this.getAvailableStartingSpaces();
	for (var i = spaces.length - 1; i >= 0; i--) {
		this.makeSpaceAvailable(spaces[i]);
	}
};

Game.prototype.activateHuman = function() {
	this.activatePlayer(0);
	if (this.activePlayer.stashCrumbs.length > 0) this.activePlayer.activateStash();
	this.clickSpace = this.clickStartSpace;
	this.takeFromStash = this.playerTakeFromStash;
};

Game.prototype.activateComputer = function() {
	this.activatePlayer(1);
	this.clickSpace = this.clickStartSpace;
	this.takeFromStash = this.playerTakeFromStash;
	this.activePlayer.chooseStart(this.getAvailableStartingSpaces());
};

Game.prototype.getAvailableStartingSpaces = function() {
	var ret = [];
	var color = this.activePlayer.color;
	var groups = this.crumbs.children;
	var spaces = this.board.children;
	for (var i = groups.length - 1; i >= 0; i--) {
		var group = groups[i];
		if (group.children[0].getAttribute('fill') == color) {
			if (group.dataset.type == 'hex') ret.push(spaces[Number(group.dataset.row) + 1].children[group.dataset.col]);
			else ret.push(spaces[0].children[group.dataset.i]);
		}
	}
	return ret;
};

Game.prototype.playerTakeFromStash = function(player) {
	if (player != this.activePlayer) return;
	v.clearAvailablePolygons();
	this.takeFromStash = this.empty;
	this.clickSpace = this.empty;
	this.activeSpace = player.base;
	player.takeFromStash();
	player.deactivateStash();
	this.occupySpace(player.base);
	this.takeFromHandMine(this.activePlayer);
};

Game.prototype.takeFromHandMine = function(player) {
	if (player != this.activePlayer || player.handCountMine < 1) return;
	this.clickSpace = this.moveToSpace;
	v.clearAvailablePolygons();
	player.selectHandMine();
	this.makeNeighborsAvailable();
	if (this.activePlayer.name != 'Human') this.activePlayer.placeCrumb(this.getAvailableNeighbors());
};

Game.prototype.takeFromHandTheirs = function(player) {
	if (player != this.activePlayer || player.handCountTheirs < 1) return;
	this.clickSpace = this.moveToSpace;
	v.clearAvailablePolygons();
	player.selectHandTheirs();
	this.makeNeighborsAvailable();
	if (this.activePlayer.name != 'Human') this.activePlayer.placeCrumb(this.getAvailableNeighbors());
};

Game.prototype.occupySpace = function(e) {
	this.activeSpace = e;
	this.clearSpace(e);
	v.addClassNameSVG(e, 'current');
};

Game.prototype.makeSpaceAvailable = function(e) {
	this.clearSpace(e);
	v.addClassNameSVG(e, 'available');
};

Game.prototype.useSpace = function(e) {
	var neighbors = this.getNeighbors();
	v.clearAvailablePolygons();
	v.addClassNameSVG(e, 'used');
};

Game.prototype.clearSpace = function(e) {
	v.clearHex(e);
};

Game.prototype.makeNeighborsAvailable = function() {
	var neighbors = this.getNeighbors();
	for (var i = neighbors.length - 1; i >= 0; i--) {
		var space = neighbors[i];
		if (!v.hasClassNameSVG(space, 'used')) this.makeSpaceAvailable(space);
	}
};

Game.prototype.getNeighbors = function() {
	var space = this.activeSpace;
	var groups = this.board.children;
	if (space.dataset.type == 'gate') {
		var i = Number(space.dataset.i);
		if (i == 0) return groups[1].children;
		return groups[5].children;
	}
	var player = this.activePlayer;
	var row = Number(space.dataset.row);
	var col = Number(space.dataset.col);
	var left = col - 1;
	var right = col + 1;
	var hexRow = groups[row + 1].children;
	var spaces = [];
	if (left >= 0) spaces.push(hexRow[left]);
	if (right < hexRow.length) spaces.push(hexRow[right]);
	if (row == 0) {
		if (player.name == 'Human') spaces.push(groups[0].children[0]);
	}
	else {
		hexRow = groups[row].children;
		if (row > 2) {
			left = col;
			right = col + 1;
		}
		else {
			left = col - 1;
			right = col;
		}
		if (left >= 0) spaces.push(hexRow[left]);
		if (right < hexRow.length) spaces.push(hexRow[right]);
	}
	if (row == 4) {
		if (player.name == 'Computer') spaces.push(groups[0].children[5]);
	}
	else {
		hexRow = groups[row + 2].children;
		if (row < 2) {
			left = col;
			right = col + 1;
		}
		else {
			left = col - 1;
			right = col;
		}
		if (left >= 0) spaces.push(hexRow[left]);
		if (right < hexRow.length) spaces.push(hexRow[right]);
	}
	return spaces;
};

Game.prototype.clickStartSpace = function(e) {
	var space = e.target;
	if (!v.hasClassNameSVG(space, 'available')) return;
	v.clearAvailablePolygons();
	this.activePlayer.deactivateStash();
	this.takeFromStash = this.empty;
	this.clickSpace = this.empty;
	var groups = this.getGroups(space);
	for (var i = groups.length - 1; i >= 0; i--) {
		var group = groups[i];
		this.activePlayer.putGroupInHand(group);
		group.parentElement.removeChild(group);
	}
	this.occupySpace(space);
	if (this.activePlayer.handCountTheirs < 1) this.takeFromHandMine(this.activePlayer);
	else {
		this.activePlayer.activateHand();
		if (this.activePlayer.name != 'Human') this.activePlayer.chooseHandCrumb();
	}
};

Game.prototype.getGroups = function(space) {
	if (space.dataset.type != 'hex') return [document.querySelector('#crumb-group-' + space.dataset.i + '-' + (space.dataset.i == 0 ? 'green' : 'blue'))];
	var ret = [];
	var greenGroup = document.querySelector('#crumb-group-' + space.dataset.row + '-' + space.dataset.col + '-green');
	var blueGroup = document.querySelector('#crumb-group-' + space.dataset.row + '-' + space.dataset.col + '-blue');
	if (greenGroup) ret.push(greenGroup);
	if (blueGroup) ret.push(blueGroup);
	return ret;
};

Game.prototype.getAvailableNeighbors = function() {
	var ret = [];
	var neighbors = this.getNeighbors();
	for (var i = neighbors.length - 1; i >= 0; i--) {
		var neighbor = neighbors[i];
		if (!v.hasClassNameSVG(neighbor, 'used') && !v.hasClassNameSVG(neighbor, 'current')) ret.push(neighbor);
	}
	return ret;
};

Game.prototype.moveToSpace = function(e) {
	this.clickSpace = this.empty;
	var fromSpace = this.activeSpace;
	var toSpace = e.target;
	var player = this.activePlayer;
	var crumb = this.activePlayer.takeCrumbFromHand();
	this.placeCrumb(e, crumb);
	this.useSpace(fromSpace);
	this.occupySpace(toSpace);
	if (player.baseCrumbs.length == 10) {
		var me = this;
		setTimeout(function() {
			me.end();
		}, 1000);
		player.deactivateHand();
	}
	else if (player.handCrumbs.length > 0) {
		if (player.handCountTheirs == 0) player.selectHandMine();
		else if (player.handCountMine == 0) player.selectHandTheirs();
		var neighbors = this.getAvailableNeighbors();
		if (neighbors.length < 1) {
			var me = this;
			var handCrumbs = player.handCrumbs;
			var e = {
				target: toSpace
			};
			player.deactivateHand();
			setTimeout(function() {
				for (var i = handCrumbs.length - 1; i >= 0; i--) {
					var crumb = handCrumbs.pop();
					me.placeCrumb(e, crumb);
					if (crumb.color == player.color) player.setHandCountMine(player.handCountMine - 1);
					else player.setHandCountTheirs(player.handCountTheirs - 1);
				}
				me.setPlayerSwitchTimer();
			}, 500);
		}
		else {
			this.clickSpace = this.moveToSpace;
			for (var i = neighbors.length - 1; i >= 0; i--) {
				v.addClassNameSVG(neighbors[i], 'available');
			}
			if (player.name != 'Human') player.placeCrumb(this.getAvailableNeighbors());
		}
	}
	else {
		var group = document.getElementById('crumb-group-' + toSpace.dataset.row + '-' + toSpace.dataset.col + '-' + player.color);
		if (group && group.dataset.count > (crumb.color == player.color ? 1 : 0) && this.getAvailableNeighbors().length > 0) {
			var me = this;
			this.clickSpace = this.clickStartSpace;
			setTimeout(function() {
				me.makeSpaceAvailable(toSpace);
				toSpace.onclick({
					target: toSpace,
					isComputer: player.name != 'Human'
				});
			}, 1000);
		}
		else {
			this.setPlayerSwitchTimer();
			player.deactivateHand();
		}
	}
};

Game.prototype.setPlayerSwitchTimer = function() {
	var me = this;
	setTimeout(function() {
		me.switchPlayers();
	}, 1000);
};

Game.prototype.placeCrumb = function(e, crumb) {
	var space = e.target;
	var crumbGroup = null;
	if (space.dataset.type == 'hex') {
		crumbGroup = document.getElementById('crumb-group-' + Number(space.dataset.row) + '-' + Number(space.dataset.col) + '-' + crumb.color);
		if (!crumbGroup) this.crumbs.appendChild(this.makeHexCrumbGroup(space, crumb));
	}
	else if (crumb.color == this.activePlayer.color) this.activePlayer.addBaseCrumb();
	else {
		crumbGroup = document.getElementById('crumb-group-' + Number(space.dataset.i) + '-' + crumb.color);
		if (!crumbGroup) this.crumbs.appendChild(this.makeGateCrumbGroup(space, crumb));
	}
	if (crumbGroup) {
		crumbGroup.dataset.count++;
		crumbGroup.children[1].innerHTML = crumbGroup.dataset.count;
	}
};

Game.prototype.makeHexCrumbGroup = function(space, crumb) {
	var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	var row = Number(space.dataset.row);
	var col = Number(space.dataset.col);
	var point = space.points[0];
	var x = point.x;
	var y = point.y + (30 * (crumb.color == 'blue' ? .5 : 1.5));
	g.appendChild(circle);
	g.appendChild(text);
	g.id = 'crumb-group-' + row + '-' + col + '-' + crumb.color;
	g.dataset.row = row;
	g.dataset.col = col;
	g.dataset.count = 1;
	g.dataset.type = 'hex';
	circle.setAttribute('cx', x);
	circle.setAttribute('cy', y);
	circle.setAttribute('r', 10);
	circle.setAttribute('stroke', 'black');
	circle.setAttribute('stroke-width', 1);
	circle.setAttribute('fill', crumb.color);
	text.setAttribute('x', x - 5);
	text.setAttribute('y', y + 5);
	text.setAttribute('fill', 'white');
	text.setAttribute('stroke-width', '1px');
	text.innerHTML = g.dataset.count;
	return g;
};

Game.prototype.makeGateCrumbGroup = function(space, crumb) {
	var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	var i = Number(space.dataset.i);
	var point = space.points[1];
	var x = point.x;
	var y = point.y + (i == 0 ? 15 : -15);
	g.appendChild(circle);
	g.appendChild(text);
	g.id = 'crumb-group-' + i + '-' + crumb.color;
	g.dataset.i = i;
	g.dataset.count = 1;
	g.dataset.type = 'gate';
	circle.setAttribute('cx', x);
	circle.setAttribute('cy', y);
	circle.setAttribute('r', 10);
	circle.setAttribute('stroke', 'black');
	circle.setAttribute('stroke-width', 1);
	circle.setAttribute('fill', crumb.color);
	text.setAttribute('x', x - 5);
	text.setAttribute('y', y + 5);
	text.setAttribute('fill', 'white');
	text.setAttribute('stroke-width', '1px');
	text.innerHTML = g.dataset.count;
	return g;
};

Game.prototype.switchPlayers = function() {
	v.clearHexes();
	this.activePlayer.deactivateHand();
	if (this.activePlayer.name == 'Human') this.activateComputer();
	else this.activateHuman();
};

Game.prototype.setEventListeners = function() {
	var me = this;
	this.view.addEventListener('takefromstash', function(e) {
		me.takeFromStash(e.detail);
	});
	this.view.addEventListener('takefromhandmine', function(e) {
		me.takeFromHandMine(e.detail);
	});
	this.view.addEventListener('takefromhandtheirs', function(e) {
		me.takeFromHandTheirs(e.detail);
	});
};

Game.prototype.isValidClick = function(e) {
	if (this.activePlayer.name == 'Human') return v.hasClassNameSVG(e.target, 'available');
	return e.isComputer;
};

Game.prototype.setOnClicks = function() {
	var me = this;
	var groups = this.board.children;
	// Gates are in the first group.
	var polygons = groups[0].children;
	for (var i = polygons.length - 1; i >= 0; i--) {
		var polygon = polygons[i];
		polygon.dataset.type = 'gate';
		polygon.dataset['i'] = i;
		polygon.onclick = function(e) {
			if (!me.isValidClick(e)) return;
			if (me.activePlayer.name != 'Human' && !e.isComputer) return;
			me.clickSpace(e);
		};
	}
	for (var i = 5; i > 0; i--) {
		polygons = groups[i].children;
		for (var j = polygons.length - 1; j >= 0; j--) {
			var polygon = polygons[j];
			polygon.dataset.type = 'hex';
			polygon.dataset['row'] = i - 1;
			polygon.dataset['col'] = j;
			polygon.onclick = function(e) {
				if (!me.isValidClick(e)) return;
				me.clickSpace(e);
			};
		}
	}
	this.view.addEventListener('', function(e) {
		;
	});
};

Game.prototype.empty = function() {};