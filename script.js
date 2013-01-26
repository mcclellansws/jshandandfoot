/*
  TODO: 

  * It is just a start. 
  * No input validation yet (like making sure the Card Count is
    divisible by 5, no negative red 3s, or books)
  * I've only tried it in chrome. Test in more browsers
  * Should allow switching between 4 and 6 players.
  * It needs more color; tooo white
  * Now that it is written, I should rewrite it using OOP (seat, team,
    and round objects?).
  * Figure out how to save scores
*/

var cut22 = [];
var red3s = [];
var cleanBooks = [];
var dirtyBooks = [];
var cardCount = [];

var ROUNDS = 6;
var TEAMS = 3;
var MAX_PLAYERS = ROUNDS;

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Array.prototype.shuffle = function() {
	var len = this.length;
	var i = len;

	while (--i) {
		var j = rand(0,i);
		var t = this[i];
		this[i] = this[j];
		this[j] = t;
	}

	return this;
}

function updateNames() {
	for (var team = 0; team < TEAMS; team++) {
	    $('th.teamName'+team).text(
		document.getElementById('seat'+team).value + "/" + 
		document.getElementById('seat'+(team+TEAMS)).value
	    );
	}
}

function updateTeam(team) {
	var gameTotal = 0;

	for (var round = 0; round < ROUNDS; round++) {
		var ref = "_"+round+"_"+team;
		var roundTotal = 
			(100*cut22[round][team])+
			(-300*red3s[round][team])+
			(500*cleanBooks[round][team])+
			(300*dirtyBooks[round][team])+
			cardCount[round][team];
		$('#roundTotal'+ref).text(roundTotal);
		gameTotal += roundTotal;
		$('#gameTotal'+ref).text(gameTotal);
	}
}

function calc(round, team) {
	var ref = "_"+round+"_"+team;


	cut22[round][team] = 
		(document.getElementById("cut22"+ref+"_0").checked ? 1 : 0) +
		(document.getElementById("cut22"+ref+"_1").checked ? 1 : 0) +
		(document.getElementById("out"+ref).checked ? 1 : 0);


	red3s[round][team] = 
		parseInt(document.getElementById("red3s"+ref).value, 10);
	cleanBooks[round][team] = 
		parseInt(document.getElementById("cleanBooks"+ref).value, 10);
	dirtyBooks[round][team] = 
		parseInt(document.getElementById("dirtyBooks"+ref).value, 10);
	cardCount[round][team] = 
		parseInt(document.getElementById("cardCount"+ref).value, 10);
	updateTeam(team);
}

function wonRound(round, team) {
	var ref = "_"+round+"_"+team;


	var checked = document.getElementById("out"+ref).checked;


	if (checked) {
		for (var i = 0; i < TEAMS; i++) {
			if (team != i) {
				var subref = "_"+round+"_"+i;
				document.getElementById("out"+subref).checked = false;
		calc(round, i);
			}
		}
	}
	calc(round, team);
}

function clearScores() {
	for (var round = 0; round < ROUNDS; round++) {
		cut22[round] = [];
		red3s[round] = [];
		cleanBooks[round] = [];
		dirtyBooks[round] = [];
		cardCount[round] = [];
		for (team = 0; team < TEAMS; team++) {
			var ref = "_"+round+"_"+team;
			cut22[round][team] = 0;
			document.getElementById("cut22"+ref+"_0").checked = 
				document.getElementById("cut22"+ref+"_1").checked = 
				document.getElementById("out"+ref).checked = false;
			document.getElementById("red3s"+ref).value = 
				red3s[round][team] = 0;
			document.getElementById("cleanBooks"+ref).value = 
				cleanBooks[round][team] = 0;
			document.getElementById("dirtyBooks"+ref).value = 
				dirtyBooks[round][team] = 0;
			document.getElementById("cardCount"+ref).value = 
				cardCount[round][team] = 0;
		}
	}
	for (var team = 0; team < TEAMS; team++) {
		updateTeam(team);
	}
}

function clearNames() {
	for (var seat = 0; seat < MAX_PLAYERS; seat++) {
		document.getElementById('seat'+seat).value = 'Player ' + seat
//+ "(t" + (seat % TEAMS) + ")"
	        ;
	}

	updateNames();
}

Array.prototype.rotate = function( n ) {
	this.unshift.apply( this, this.splice( n, this.length ) );
	return this;
}

function getSeats() {
	var names = [];

	// get the names
	for (var seat = 0; seat < MAX_PLAYERS; seat++) {
		names.push(document.getElementById('seat'+seat).value);
	}

	return names;
}

function setSeats(names) {

	// put them back
	for (var seat = 0; seat < MAX_PLAYERS; seat++) {
		document.getElementById('seat'+seat).value = names.shift();
	}
}

function randomStart() {
	var names = getSeats();

	names.rotate(rand(1,names.length));
	setSeats(names);
	updateNames();
	clearScores();
}

function randomSeats() {
	var names = getSeats();

	names.shuffle();
	setSeats(names);
	updateNames();
	clearScores();
}

function init() {
	drawRoundTable();
	clearScores();
	clearNames();
}

function about() {
	prompt("Copyright 2013<br>Steve McClellan<br>All Rights Reserved");
}

function drawRoundTable() {
	for (var round = 0; round < ROUNDS; round++) {
		var str = [];
		var i = 0;
		var team = 0;
		
		str[i++] = '<table>';
		str[i++] = '    <tr>';
		str[i++] = '        <th align="left">Round ' + (round+1) + '</th>';
		for(team = 1; team <= TEAMS; team++)
			str[i++] = '        <th> Team ' + team + '</th>';
		str[i++] = '    </tr>';
		str[i++] = '    <tr>';
		str[i++] = '        <th align="left">Meld: ' + (round*20+50) + '</th>';
		for(team = 0; team < TEAMS; team++)
			str[i++] = '        <th class="teamName' + team + '"></th>';
		str[i++] = '    </tr>';
		str[i++] = '    <tr>';
		str[i++] = '        <td class="colTitles">Cut 22:</td>';
		for(team = 0; team < TEAMS; team++) {
			str[i++] = '        <td>';
			for(player = 0; player < ROUNDS/TEAMS; player++)
				str[i++] = '        <input type="checkbox" id="cut22_'+round+'_'+team+'_'+player+
					'" onChange="calc('+round+', '+team+')">';
			str[i++] = '        </td>';
		}
		str[i++] = '    </tr>';
		str[i++] = '    <tr>';
		str[i++] = '        <td class="colTitles">First Out:</td>';
		for(team = 0; team < TEAMS; team++)
			str[i++] = '        <td><input type="checkbox" id="out_'+round+'_'+team+'" onClick="wonRound('+round+', '+team+')"></td>';
		str[i++] = '   </tr>';
		str[i++] = '   <tr>';
		str[i++] = '        <td class="colTitles">Red 3s:</td>';
		for(team = 0; team < TEAMS; team++)
			str[i++] = '        <td><input type="number" id="red3s_'+round+'_'+team+'" onChange="calc('+round+', '+team+')"></td>';
		str[i++] = '    </tr>';
		str[i++] = '    <tr>';
		str[i++] = '       <td class="colTitles">Clean Books:</td>';
		for(team = 0; team < TEAMS; team++)
			str[i++] = '       <td><input type="number" id="cleanBooks_'+round+'_'+team+'" onChange="calc('+round+', '+team+')"></td>';
		str[i++] = '    </tr>';
		str[i++] = '    <tr>';
		str[i++] = '        <td class="colTitles">Dirty Books:</td>';
		for(team = 0; team < TEAMS; team++)
			str[i++] = '        <td><input type="number" id="dirtyBooks_'+round+'_'+team+'" onChange="calc('+round+', '+team+')"></td>';
		str[i++] = '    </tr>';
		str[i++] = '    <tr>';
		str[i++] = '        <td class="colTitles">Card Count:</td>';
		for(team = 0; team < TEAMS; team++)
			str[i++] = '        <td><input type="number" id="cardCount_'+round+'_'+team+'" onChange="calc('+round+', '+team+')"></td>';
		str[i++] = '    </tr>';
		str[i++] = '    <tr>';
		str[i++] = '        <th class="colTitles">Round Total:</th>';
		for(team = 0; team < TEAMS; team++)
			str[i++] = '        <th id="roundTotal_'+round+'_'+team+'" class="totals"> </th>';
		str[i++] = '    </tr>';
		str[i++] = '    <tr>';
		str[i++] = '        <th class="colTitles">Game Total:</th>';
		for(team = 0; team < TEAMS; team++)
			str[i++] = '        <th id="gameTotal_'+round+'_'+team+'" class="totals"> </th>';
		str[i++] = '    </tr>';
		str[i++] = '</table>';

		$('#roundsArea').append(str.join(''));
	}
}

$(document).ready(function () {
	
	init();
});

