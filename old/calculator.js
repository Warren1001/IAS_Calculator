var frames;
var start;
var statischFana = true;
var statischFrost = true;
var statischIAS = true;
var mIAS = 1;
var statischWaffe = true;
var statischZweitwaffe = true;
var fenster = true;
var WSMprimaer;
var WSMsekundaer;
var IASprimaer;
var IASsekundaer;
var EIASprimaer;
var EIASsekundaer;
var SIAS;
var rollback1;
var rollback2;
var rollback3;
var rollback4;
var rollback5;
var rollbackframe;
var tempSkill;
var tempWaffe;
var tempZweitwaffe;
var tempForm;
var tempBarbschwert;
var grenze = 1;
var cap = 1;
var breakpoints = new Array();
var breakpoints1 = new Array();
var breakpoints2 = new Array();
var breakpointsAPS = new Array();
var TabFenster;
var autoWSM = false;

function toggleAutoWSM() { // too lazy to see if javascript has a faster way to do this
	if (autoWSM == true) {
		autoWSM = false;
	} else {
		autoWSM = true;
	}
	berechneWerte();
}

var AMAZON = 0;
var ASSASSIN = 1;
var BARBARIAN = 2;
var DRUID = 3;
var NECROMANCER = 4;
var PALADIN = 5;
var SORCERESS = 6;
var A1_MERC = 7;
var A2_MERC = 8;
var A5_MERC = 9;

var HUMAN = 0;
var WEREBEAR = 1;
var WEREWOLF = 2;

var SKILL_STANDARD = 1;

function berechneFPA(framesPerDirection, acceleration, startingFrame) {
	//var acceleration;
	var animationSpeed = 256;
	if (document.myform.char.value == ASSASSIN && weapons[document.myform.waffe.value][2] == 1) { // & weapon is a claw
		animationSpeed = 208;
	}
	// if skill is an assassin martial arts skill, jab, impale, frenzy, double swing, or double throw and not whirlwind
	if ((skills[document.myform.skill.value][2] == 3 || skills[document.myform.skill.value][2] == 7) && document.myform.skill.value != 19) {
		animationSpeed = 256;
	}
	// if skill is laying traps
	if (skills[document.myform.skill.value][2] == 5) {
		animationSpeed = 128;
	}
	if (document.myform.charform.value == WEREBEAR) {
		if (weapons[document.myform.waffe.value][2] == 3) { // if weapon is a two handed sword that can be one handed by barbarian
			framesPerDirection = weaponTypes[2][document.myform.char.value][0];
		}
		animationSpeed = Math.floor(256 * 10 / Math.floor(256 * framesPerDirection / Math.floor((100 + IASprimaer - parseInt(document.myform.IAS.value) - weapons[document.myform.waffe.value][1]) * animationSpeed / 100)));
		framesPerDirection = 12;
		if (skills[document.myform.skill.value][2] == 6) { // if skill is hunger
			framesPerDirection = 10;
		}
		startingFrame = 0;
	} else if (document.myform.charform.value == WEREWOLF) {
		if (weapons[document.myform.waffe.value][2] == 3) { // if weapon is a two handed sword that can be one handed by barbarian
			framesPerDirection = weaponTypes[2][document.myform.char.value][0];
		}
		animationSpeed = Math.floor(256 * 9 / Math.floor(256 * framesPerDirection / Math.floor((100 + IASprimaer - parseInt(document.myform.IAS.value) - weapons[document.myform.waffe.value][1]) * animationSpeed / 100)));
		framesPerDirection = 13;
		// if skill is fury
		if ((document.myform.skill.value == 29) && (startingFrame == 0)) {
			framesPerDirection = 7;
		}
		if (skills[document.myform.skill.value][2] == 6) { // if skill is hunger or rabies
			framesPerDirection = 10;
		}
		startingFrame = 0;
	}
	FPA = Math.ceil(256 * (framesPerDirection - startingFrame) / Math.floor(animationSpeed * acceleration / 100)) - 1;
	if (document.myform.skill.value == 19) { // if skill is whirlwind
		FPA = Math.floor(256 * framesPerDirection / Math.floor(animationSpeed * acceleration / 100));
	}
	else if (document.myform.skill.value == 26) { // if skill is feral rage
		FPA = Math.ceil(256 * 7 / Math.floor(animationSpeed * acceleration / 100)) + Math.ceil((256 * 13 - Math.floor(animationSpeed * acceleration / 100) * Math.ceil(256 * 7 / Math.floor(animationSpeed * acceleration / 100))) / (2 * Math.floor(animationSpeed * acceleration / 100))) - 1;
	}
	//console.log("")
	return FPA;
}

function berechneWerte() {
	var ergebnis;
	var temp;
	var temp2;
	berechneSIAS();
	berechneEIAS();
	berechneWSM();
	var acceleration = Math.max(Math.min(100 + SIAS + EIASprimaer - WSMprimaer, 175), 15);
	var acceleration2 = Math.max(Math.min(100 + SIAS + EIASsekundaer - WSMsekundaer, 175), 15);
	start = 0;
	// if (amazon or sorceress) and skill is standard, strafe, fend
	if (((document.myform.char.value == 0) || (document.myform.char.value == 6)) && (skills[document.myform.skill.value][2] < 2)) {
		start = startingFrames[weapons[document.myform.waffe.value][2]];
	}
	// if skill is tiger strike, phoenix strike, conc, zerk, bash, stun, feral rage, hunger, rabies, sacrifice, veng, or conversion
	if (((skills[document.myform.skill.value][2] == 0) || (skills[document.myform.skill.value][2] == 6)) && (skills[document.myform.skill.value][4] == 100)) {
		frames = weaponTypes[weapons[document.myform.waffe.value][2]][document.myform.char.value][0];
		if ((weapons[document.myform.waffe.value][2] == 3) && (document.myform.barbschwert.value == 1)) {
			frames = 16;
		}
		ergebnis = berechneFPA(frames, acceleration, start);
	}
	// if skill is standard
	if ((skills[document.myform.skill.value][2] == 1) && (skills[document.myform.skill.value][4] == 100)) {
		frames = weaponTypes[weapons[document.myform.waffe.value][2]][document.myform.char.value][0];
		// if two handed sword is being used one handed
		if ((weapons[document.myform.waffe.value][2] == 3) && (document.myform.barbschwert.value == 1)) {
			frames = 16;
		}
		ergebnis = berechneFPA(frames, acceleration, start);
		if (ergebnis > berechneFPA(frames, 175, start)) {
			grenze = 0;
		}
		if (document.myform.charform.value == 0) {
			temp = ergebnis;
			frames = weaponTypes[weapons[document.myform.waffe.value][2]][document.myform.char.value][1];
			if ((weapons[document.myform.waffe.value][2] == 3) && (document.myform.barbschwert.value == 1)) {
				frames = 16;
			}
			ergebnis = berechneFPA(frames, acceleration, start);
			if (ergebnis > berechneFPA(frames, 175, start)) {
				grenze = 0;
			}
			ergebnis = (ergebnis + temp) / 2;
		}
		// if char is a5 merc
		if (document.myform.char.value == 9) {
			ergebnis = ergebnis / 2;
		}
		if (document.myform.zweitwaffe.value > 0) {
			temp = ergebnis;
			ergebnis = berechneFPA(12, acceleration2, 0);
			if (ergebnis > berechneFPA(12, 175, 0)) {
				grenze = 0;
			}
			ergebnis = (ergebnis + temp) / 2;
		}
		grenze = 1;
	}
	// if skill is throw, dragon tail, dragon talon, laying traps, or smite
	if ((skills[document.myform.skill.value][2] >= 2) && (skills[document.myform.skill.value][2] <= 5) && (skills[document.myform.skill.value][4] == 100)) {
		if (skills[document.myform.skill.value][2] == 2) { // throw
			frames = weaponTypes[9][document.myform.char.value];
		}
		if (skills[document.myform.skill.value][2] == 3) { // dragon tail
			frames = 13;
		}
		if (skills[document.myform.skill.value][2] == 4) { // smite
			frames = 12;
		}
		if (skills[document.myform.skill.value][2] == 5) { // laying traps
			frames = 8;
		}
		ergebnis = berechneFPA(frames, acceleration, start);
	}
	// if skill is impale, jab, fists of fire, claws of thunder, blades of ice, dragon claw, double swing, frenzy, or double throw
	if ((skills[document.myform.skill.value][2] == 7) && (document.myform.skill.value != 19) && (skills[document.myform.skill.value][4] == 100)) {
		frames = sequences[skills[document.myform.skill.value][3]][weapons[document.myform.waffe.value][2]];
		// if skill is fists of fire, claws of thunder, blades of ice, or dragon claw AND is dual wielding
		if ((document.myform.skill.value > 8) && (document.myform.skill.value < 13) && (document.myform.zweitwaffe.value > 0)) {
			frames = 16;
		}
		// if char is a2 merc
		if (document.myform.char.value == 8) {
			frames = 14;
		}
		start = 0;
		ergebnis = berechneFPA(frames, acceleration, start);
		ergebnis++;
		// if skill is jab and char is player
		if ((document.myform.skill.value == 3) && (document.myform.char.value < 7)) {
			ergebnis = parseInt(100 * ergebnis / 3) / 100;
		}
		// if char is a2 merc
		if (document.myform.char.value == 8) {
			ergebnis = ergebnis / 2;
		}
		// if skill is double swing, frenzy, or double throw
		if ((document.myform.skill.value > 15) && (document.myform.skill.value < 19)) {
			ergebnis = ergebnis / 2;
		}
		// if skill is fists of fire, claws of thunder, blades of ice, or dragon claw AND is dual wielding
		if ((document.myform.skill.value > 8) && (document.myform.skill.value < 13) && (document.myform.zweitwaffe.value > 0)) {
			ergebnis = ergebnis / 2;
		}
	}
	// if skill is whirlwind
	if (document.myform.skill.value == 19) {
		frames = weaponTypes[weapons[document.myform.waffe.value][2]][document.myform.char.value][0];
		if (weapons[document.myform.waffe.value][2] == 3) {
			frames = 16;
		}
		acceleration = 100 + parseInt(document.myform.wIAS1.value) - parseInt(weapons[document.myform.waffe.value][1]);
		temp = berechneFPA(frames, acceleration, start);
		ergebnis = wirbelwind(temp);
		if (ergebnis > 4) {
			grenze = 0;
		}
		if (document.myform.waffe.value == 0) {
			ergebnis = 10;
		}
		if (document.myform.zweitwaffe.value > 0) {
			temp2 = ergebnis;
			frames = weaponTypes[weapons[document.myform.zweitwaffe.value][2]][document.myform.char.value][0];
			if (weapons[document.myform.zweitwaffe.value][2] == 3) {
				frames = 16;
			}
			acceleration = 100 + parseInt(document.myform.wIAS2.value) - parseInt(weapons[document.myform.zweitwaffe.value][1]);
			temp = berechneFPA(frames, acceleration, start);
			ergebnis = wirbelwind(temp);
			if (ergebnis > 4) {
				grenze = 0;
			}
			ergebnis = (ergebnis + temp2) / 4;
		}
		grenze = 1;
	}
	// if skill is dragon talon, zeal, or fury
	if (skills[document.myform.skill.value][4] == 0) {
		// if skill is dragon talon
		if (document.myform.skill.value == 14) {
			rollback1 = berechneFPA(4, acceleration, 0);
			rollback1++;
			rollback3 = berechneFPA(13, acceleration, 0);
		}
		// if skill is fury
		if (document.myform.skill.value == 29) {
			frames = weaponTypes[weapons[document.myform.waffe.value][2]][document.myform.char.value][0];
			rollback1 = berechneFPA(frames, acceleration, 0);
			if (rollback1 > berechneFPA(frames, 175, 0)) {
				grenze = 0;
			}
			rollback1++;
			rollback3 = berechneFPA(frames, acceleration, 1);
			if (rollback3 > berechneFPA(frames, 175, 1)) {
				grenze = 0;
			}
			grenze = 1;
		}
		// if skill is zeal
		if (document.myform.skill.value == 24) {
			frames = actionsFrames[weapons[document.myform.waffe.value][2]][document.myform.char.value];
			if ((weapons[document.myform.waffe.value][2] == 3) && (document.myform.barbschwert.value == 1)) {
				frames = 7;
			}
			rollback1 = berechneFPA(frames, acceleration, start);
			if (rollback1 > berechneFPA(frames, 175, start)) {
				grenze = 0;
			}
			rollback1++;
			rollback2 = berechneFPA(frames, acceleration, 0);
			if (rollback2 > berechneFPA(frames, 175, 0)) {
				grenze = 0;
			}
			rollback2++;
			frames = weaponTypes[weapons[document.myform.waffe.value][2]][document.myform.char.value][0];
			if ((weapons[document.myform.waffe.value][2] == 3) && (document.myform.barbschwert.value == 1)) {
				frames = 16;
			}
			rollback3 = berechneFPA(frames, acceleration, 0);
			if (rollback3 > berechneFPA(frames, 175, 0)) {
				grenze = 0;
			}
			grenze = 1;
		}
	}
	// if skill is strafe
	if (skills[document.myform.skill.value][4] == 50) {
		frames = actionsFrames[weapons[document.myform.waffe.value][2]][document.myform.char.value];
		if (acceleration > 149) {
			acceleration = 149;
		}
		rollback1 = berechneFPA(frames, acceleration, start);
		if (rollback1 > berechneFPA(frames, 149, start)) {
			grenze = 0;
		}
		rollback1++;
		rollbackframe = Math.floor(Math.floor((256 * start + Math.floor(256 * acceleration / 100) * rollback1) / 256) * skills[document.myform.skill.value][4] / 100);
		rollback2 = berechneFPA(frames, acceleration, rollbackframe);
		if (rollback2 > berechneFPA(frames, 149, rollbackframe)) {
			grenze = 0;
		}
		rollback2++;
		rollbackframe = Math.floor(Math.floor((256 * rollbackframe + Math.floor(256 * acceleration / 100) * rollback2) / 256) * skills[document.myform.skill.value][4] / 100);
		rollback3 = berechneFPA(frames, acceleration, rollbackframe);
		if (rollback3 > berechneFPA(frames, 149, rollbackframe)) {
			grenze = 0;
		}
		rollback3++;
		rollbackframe = Math.floor(Math.floor((256 * rollbackframe + Math.floor(256 * acceleration / 100) * rollback3) / 256) * skills[document.myform.skill.value][4] / 100);
		rollback4 = berechneFPA(frames, acceleration, rollbackframe);
		if (rollback4 > berechneFPA(frames, 149, rollbackframe)) {
			grenze = 0;
		}
		rollback4++;
		frames = weaponTypes[weapons[document.myform.waffe.value][2]][document.myform.char.value][0];
		rollbackframe = Math.floor(Math.floor((256 * rollbackframe + Math.floor(256 * acceleration / 100) * rollback4) / 256) * skills[document.myform.skill.value][4] / 100);
		rollback5 = berechneFPA(frames, acceleration, rollbackframe);
		if (rollback5 > berechneFPA(frames, 149, rollbackframe)) {
			grenze = 0;
		}
		if ((rollback2 == 5) && (rollback3 == 4)) {
			rollback3 = 5;
			rollback5 = 13;
		}
		grenze = 1;
	}
	// if skill is fend
	if (skills[document.myform.skill.value][4] == 40) {
		frames = actionsFrames[weapons[document.myform.waffe.value][2]][document.myform.char.value];
		rollback1 = berechneFPA(frames, acceleration, start);
		if (rollback1 > berechneFPA(frames, 175, start)) {
			grenze = 0;
		}
		rollback1++;
		rollbackframe = Math.floor(Math.floor((256 * start + Math.floor(256 * acceleration / 100) * rollback1) / 256) * skills[document.myform.skill.value][4] / 100);
		rollback2 = berechneFPA(frames, acceleration, rollbackframe);
		if (rollback2 > berechneFPA(frames, 175, rollbackframe)) {
			grenze = 0;
		}
		rollback2++;
		frames = weaponTypes[weapons[document.myform.waffe.value][2]][document.myform.char.value][0];
		rollbackframe = Math.floor(Math.floor((256 * rollbackframe + Math.floor(256 * acceleration / 100) * rollback2) / 256) * skills[document.myform.skill.value][4] / 100);
		rollback3 = berechneFPA(frames, acceleration, rollbackframe);
		if (rollback3 > berechneFPA(frames, 175, rollbackframe)) {
			grenze = 0;
		}
		grenze = 1;
	}
}

var horizontalPlotLength = 32;
var verticalPlotLength = 25;

function berechneBreakpoints(event) {
	var ergebnis;
	var RBframe;
	var temp;
	var temp1;
	var OIAS = document.myform.IAS.value;
	var WIAS = document.myform.wIAS1.value;
	if (TabFenster != null) TabFenster.close();
	/*if ((document.myform.charform.value > 0) && ((document.myform.waffe.value == 0) || ((document.myform.zweitwaffe.value > 0) && (document.myform.skill.value == 0)))) {
		fenster = true;
	}*/
	cap = 0;
	if (document.myform.charform.value == 0) {
		while (breakpoints.length > 0) {
			breakpoints.length = breakpoints.length - 1;
		}
		while (breakpoints1.length > 0) {
			breakpoints1.length = breakpoints1.length - 1;
		}
		while (breakpoints2.length > 0) {
			breakpoints2.length = breakpoints2.length - 1;
		}
		while (breakpointsAPS.length > 0) {
			breakpointsAPS.length = breakpointsAPS.length - 1;
		}
		temp1 = 0;
		if (((skills[document.myform.skill.value][2] == 0) || (skills[document.myform.skill.value][2] == 2) || (skills[document.myform.skill.value][2] == 3) || (skills[document.myform.skill.value][2] == 4) || (skills[document.myform.skill.value][2] == 5)) && (skills[document.myform.skill.value][4] == 100)) {
			console.log("0 - where: frames=" + frames +",start=" + start + ",SIAS=" + SIAS + ",WSMprimaer=" + WSMprimaer);
			for (i = Math.max(100 + SIAS - WSMprimaer, 15); i <= 175; i++) {
				ergebnis = berechneFPA(frames, i, start);
				if ((temp1 != ergebnis) && (i - 100 - SIAS + WSMprimaer < 120)) {
					//console.log("frames: " + ergebnis);
					breakpoints[breakpoints.length] = [Math.ceil(120 * (i - 100 - SIAS + WSMprimaer) / (120 - (i - 100 - SIAS + WSMprimaer))), ergebnis];
					temp1 = ergebnis;
				}
			}
		}
		// if skill is standard skill && not dual wielding && not a multi hit skill (last part redundant)
		if ((skills[document.myform.skill.value][2] == SKILL_STANDARD) && (document.myform.zweitwaffe.value == 0) && (skills[document.myform.skill.value][4] == 100)) {
			console.log("1");
			for (i = Math.max(100 + SIAS - WSMprimaer, 15); i <= 175; i++) {
				console.log("char.value: " + document.myform.char.value);
				console.log("---- start ----");
				console.log("i: " + i);
				frames = weaponTypes[weapons[document.myform.waffe.value][2]][document.myform.char.value][0];
				console.log("frames1: " + frames);
				if ((weapons[document.myform.waffe.value][2] == 3) && (document.myform.barbschwert.value == 1)) { // if barb is using two handed sword as a one handed sword or a one handed sword
					console.log("1.1");
					frames = 16;
				}
				ergebnis = berechneFPA(frames, i, start);
				console.log("ergebnis1: " + ergebnis);
				frames = weaponTypes[weapons[document.myform.waffe.value][2]][document.myform.char.value][1];
				console.log("frames2: " + frames);
				if ((weapons[document.myform.waffe.value][2] == 3) && (document.myform.barbschwert.value == 1)) { // if barb is using two handed sword as a one handed sword or a one handed sword
					console.log("1.2");
					frames = 16;
				}
				temp = berechneFPA(frames, i, start);
				console.log("temp: " + temp);
				ergebnis = (ergebnis + temp) / 2;
				console.log("ergebnis2: " + ergebnis);
				if (document.myform.char.value == 9) { // if is act 5 merc
					console.log("1.3");
					ergebnis = ergebnis / 2;
				}
				if ((temp1 != ergebnis) && (i - 100 - SIAS + WSMprimaer < 120)) {
					var gearIAS = Math.ceil(120 * (i - 100 - SIAS + WSMprimaer) / (120 - (i - 100 - SIAS + WSMprimaer)));
					console.log("gearIAS: " + gearIAS + " - ergebnis: " + ergebnis);
					breakpoints[breakpoints.length] = [gearIAS, ergebnis];
					temp1 = ergebnis;
				}
				console.log("---- end ----");
			}
		}
		// if skill is standard skill and dual wielding and not a multi hit skill (last part redundant)
		if ((skills[document.myform.skill.value][2] == SKILL_STANDARD) && (document.myform.zweitwaffe.value > 0) && (skills[document.myform.skill.value][4] == 100)) {
			console.log("2");
			for (i = Math.max(100 + SIAS - WSMprimaer, 15); i <= 175; i++) {
				frames = weaponTypes[weapons[document.myform.waffe.value][2]][document.myform.char.value][0];
				if ((weapons[document.myform.waffe.value][2] == 3) && (document.myform.barbschwert.value == 1)) {
					frames = 16;
				}
				ergebnis = berechneFPA(frames, i, 0);
				frames = weaponTypes[weapons[document.myform.waffe.value][2]][document.myform.char.value][1];
				if ((weapons[document.myform.waffe.value][2] == 3) && (document.myform.barbschwert.value == 1)) {
					frames = 16;
				}
				temp = berechneFPA(frames, i, 0);
				ergebnis = (ergebnis + temp) / 2;
				if ((temp1 != ergebnis) && (i - 100 - SIAS + WSMprimaer < 120)) {
					breakpoints1[breakpoints1.length] = [Math.ceil(120 * (i - 100 - SIAS + WSMprimaer) / (120 - (i - 100 - SIAS + WSMprimaer))) - IASprimaer, ergebnis];
					temp1 = ergebnis;
				}
				if ((breakpoints1.length > 1) && (breakpoints1[1][0] < 0) && (breakpoints1[0][0] == 0)) {
					breakpoints1.reverse();
					breakpoints1.length = breakpoints1.length - 1;
					breakpoints1.reverse();
				}
				if ((breakpoints1.length > 0) && (breakpoints1[0][0] < 0)) {
					breakpoints1[0][0] = 0;
				}
			}
			temp1 = 0;
			for (i = Math.max(100 + SIAS - WSMsekundaer, 15); i <= 175; i++) {
				ergebnis = berechneFPA(12, i, 0);
				if ((temp1 != ergebnis) && (i - 100 - SIAS + WSMsekundaer < 120)) {
					breakpoints2[breakpoints2.length] = [Math.ceil(120 * (i - 100 - SIAS + WSMsekundaer) / (120 - (i - 100 - SIAS + WSMsekundaer))) - IASsekundaer, ergebnis];
					temp1 = ergebnis;
				}
				if ((breakpoints2.length > 1) && (breakpoints2[1][0] < 0) && (breakpoints2[0][0] == 0)) {
					breakpoints2.reverse();
					breakpoints2.length = breakpoints2.length - 1;
					breakpoints2.reverse();
				}
				if ((breakpoints2.length > 0) && (breakpoints2[0][0] < 0)) {
					breakpoints2[0][0] = 0;
				}
			}
			var IASmax1 = breakpoints1[breakpoints1.length - 1][0]
			var IASmax2 = breakpoints2[breakpoints2.length - 1][0]
			for (i = 0; i <= Math.max(IASmax1, IASmax2); i++) {
				if ((breakpoints1.length > 1) && (breakpoints1[1][0] == i)) {
					breakpoints1.reverse();
					breakpoints1.length = breakpoints1.length - 1;
					breakpoints1.reverse();
				}
				if ((breakpoints2.length > 1) && (breakpoints2[1][0] == i)) {
					breakpoints2.reverse();
					breakpoints2.length = breakpoints2.length - 1;
					breakpoints2.reverse();
				}
				if ((breakpoints1[0][0] == i) || (breakpoints2[0][0] == i)) {
					breakpoints[breakpoints.length] = [i, (breakpoints1[0][1] + breakpoints2[0][1]) / 2];
				}
			}
		}
		// if skill is a martial arts chargeup skill, jab, impale, frenzy, double swing, or double throw and not whirlwind
		if ((skills[document.myform.skill.value][2] == 7) && (document.myform.skill.value != 19)) {
			console.log("3 - " + frames + " where: SIAS=" + SIAS + ",WSMprimaer=" + WSMprimaer);
			for (i = Math.max(100 + SIAS - WSMprimaer, 15); i <= 175; i++) {
				ergebnis = berechneFPA(frames, i, 0);
				console.log("3.0 - " + ergebnis + " where: i=" + i);
				ergebnis++;
				// if skill is jab and character is player
				if ((document.myform.skill.value == 3) && (document.myform.char.value < 7)) {
					ergebnis = parseInt(100 * ergebnis / 3) / 100;
				}
				// if act 2 merc
				if (document.myform.char.value == 8) {
					ergebnis = ergebnis / 2;
				}
				// if skill is double swong, frenzy, or double throw
				if ((document.myform.skill.value > 15) && (document.myform.skill.value < 19)) {
					ergebnis = ergebnis / 2;
				}
				// if skill is fists of fire, claws of thunder, blades of ice, or draon claw AND is dual wielding
				if ((document.myform.skill.value > 8) && (document.myform.skill.value < 13) && (document.myform.zweitwaffe.value > 0)) {
					ergebnis = ergebnis / 2;
				}
				if ((temp1 != ergebnis) && (i - 100 - SIAS + WSMprimaer < 120)) {
					console.log("3.1 - " + ergebnis);
					breakpoints[breakpoints.length] = [Math.ceil(120 * (i - 100 - SIAS + WSMprimaer) / (120 - (i - 100 - SIAS + WSMprimaer))), ergebnis];
					temp1 = ergebnis;
				}
			}
		}
		if (document.myform.skill.value == 19) { // if skill is whirlwind

			for (i = /*100 + IASprimaer - OIAS - WSMprimaer*/15; i <= 175; i++) {
				var temp = berechneFPA(frames, i, 0);
				ergebnis = wirbelwind(temp);
				if (temp1 != ergebnis) {
					breakpoints[breakpoints.length] = [i - 100 + WSMprimaer, ergebnis];
					temp1 = ergebnis;
					console.log("[" + i + ", " + ergebnis + "],");
				}
			}
		}
		// if skill is dragon talon or zeal
		if (skills[document.myform.skill.value][4] == 0) {
			console.log("4");
			for (i = Math.max(100 + SIAS - WSMprimaer, 15); i <= 175; i++) {
				// if skill is dragon talon
				if (document.myform.skill.value == 14) {
					frames = 4;
				}
				// if skill is zeal
				if (document.myform.skill.value == 24) {
					frames = actionsFrames[weapons[document.myform.waffe.value][2]][document.myform.char.value];
				}
				// if weapon is a two-handed sword that can be one-handed and is being used as a one-handed sword
				if ((weapons[document.myform.waffe.value][2] == 3) && (document.myform.barbschwert.value == 1)) {
					frames = 7;
				}
				rollback1 = berechneFPA(frames, i, start);
				rollback1++;
				rollback2 = berechneFPA(frames, i, 0);
				rollback2++;
				// if skill is dragon talon
				if (document.myform.skill.value == 14) {
					frames = 13;
				}
				// if skill is zeal
				if (document.myform.skill.value == 24) {
					frames = weaponTypes[weapons[document.myform.waffe.value][2]][document.myform.char.value][0];
				}
				// if weapon is a two-handed sword that can be one-handed and is being used as a one-handed sword
				if ((weapons[document.myform.waffe.value][2] == 3) && (document.myform.barbschwert.value == 1)) {
					frames = 16;
				}
				rollback3 = berechneFPA(frames, i, 0);
				ergebnis = rollback1 + rollback2 + rollback3;
				if ((temp1 != ergebnis) && (i - 100 - SIAS + WSMprimaer < 120)) {
					var bp = Math.ceil(120 * (i - 100 - SIAS + WSMprimaer) / (120 - (i - 100 - SIAS + WSMprimaer)));
					if (bp < 0) break;
					breakpoints[breakpoints.length] = [bp, rollback1 + "/" + rollback2 + "/" + rollback2 + "/" + rollback2 + "/" + rollback3];
					breakpointsAPS[breakpointsAPS.length] = parseInt(2500 / ((rollback1 + rollback2 * 3 + rollback3) / 5)) / 100;
					temp1 = ergebnis;
				}
			}
		}
		// if skill is strafe
		if (skills[document.myform.skill.value][4] == 50) {
			console.log("5");
			let temp2 = new Array(5);
			let isOdd = false;
			for (i = Math.max(100 + SIAS - WSMprimaer, 15); i <= 175; i++) {
				frames = actionsFrames[weapons[document.myform.waffe.value][2]][document.myform.char.value];
				rollback1 = berechneFPA(frames, i, start);
				rollback1++;
				RBframe = Math.floor(Math.floor((256 * start + Math.floor(256 * i / 100) * rollback1) / 256) * skills[document.myform.skill.value][4] / 100);
				rollback2 = berechneFPA(frames, i, RBframe);
				rollback2++;
				let RBframe3 = Math.floor(Math.floor((256 * RBframe + Math.floor(256 * i / 100) * rollback2) / 256) * skills[document.myform.skill.value][4] / 100);
				rollback3 = berechneFPA(frames, i, RBframe3);
				rollback3++;
				let RBframe4 = Math.floor(Math.floor((256 * RBframe3 + Math.floor(256 * i / 100) * rollback3) / 256) * skills[document.myform.skill.value][4] / 100);
				rollback4 = berechneFPA(frames, i, RBframe4);
				rollback4++;
				frames = weaponTypes[weapons[document.myform.waffe.value][2]][document.myform.char.value][0];
				RBframe = Math.floor(Math.floor((256 * (isOdd ? RBframe4 : RBframe3) + Math.floor(256 * i / 100) * (isOdd ? rollback4 : rollback3)) / 256) * skills[document.myform.skill.value][4] / 100);
				rollback5 = berechneFPA(frames, i, RBframe);
				//if ((rollback2 == rollback3) || (rollback3 == rollback4)) {
				//	ergebnis = rollback1 + rollback2 + rollback3 + rollback4 + rollback5;
				//}
				//if (temp1 != ergebnis) {
				if (temp2[0] != rollback1 || temp2[1] != rollback2 || temp2[2] != rollback3 || temp2[3] != rollback4 || temp2[4] != rollback5) {
					var bp = Math.ceil(120 * (i - 100 - SIAS + WSMprimaer) / (120 - (i - 100 - SIAS + WSMprimaer)));
					//if (bp < 0) break;
					breakpoints[breakpoints.length] = [bp, rollback1 + "/" + rollback2 + "/" + rollback3 + "/" + rollback4 + "/" + rollback5];
					breakpointsAPS[breakpointsAPS.length] = parseInt(2500 / ((rollback1 + rollback2 + rollback3 * 4 + rollback4 * 3 + rollback5) / 10)) / 100;
					temp1 = ergebnis;
					temp2[0] = rollback1;
					temp2[1] = rollback2;
					temp2[2] = rollback3;
					temp2[3] = rollback4;
					temp2[4] = rollback5;

					if (!isOdd) {
						if (rollback2 == rollback4) {
							if (rollback2 == rollback3) {
								console.log("[" + i + ", \"" + (rollback1 + "/(" + rollback2 + ")/" + rollback5) + "\"],");
							} else {
								console.log("[" + i + ", \"" + (rollback1 + "/(" + rollback2 + "/" + rollback3 + ")/" + rollback5) + "\"],");
							}
						} else {
							console.log("[" + i + ", \"" + (rollback1 + "/" + rollback2 + "/(" + rollback3 + ")/" + rollback5) + "\"],");
						}
					}
					else {
						if (rollback2 == rollback3) {
							console.log("[" + i + ", \"" + (rollback1 + "/(" + rollback2 + ")/" + rollback5) + "\"],");
						} else if (rollback2 == rollback4) {
							console.log("[" + i + ", \"" + (rollback1 + "/" + rollback2 + "/(" + rollback3 + "/" + rollback4 + ")/" + rollback5) + "\"],");
						} else {
							console.log("[" + i + ", \"" + (rollback1 + "/" + rollback2 + "/(" + rollback3 + ")/" + rollback5) + "\"],");
						}
						
					}
				}
			}
		}
		// if skill is fend
		if (skills[document.myform.skill.value][4] == 40) {
			console.log("6, start=" + start);
			for (i = Math.max(100 + SIAS - WSMprimaer, 15); i <= 175; i++) {
				frames = actionsFrames[weapons[document.myform.waffe.value][2]][document.myform.char.value];
				//console.log("--- start i=" + i + " ---")
				rollback1 = berechneFPA(frames, i, start);
				rollback1++;
				//console.log("rollback1=" + rollback1);
				RBframe = Math.floor(Math.floor((256 * start + Math.floor(256 * i / 100) * rollback1) / 256) * skills[document.myform.skill.value][4] / 100);
				rollback2 = berechneFPA(frames, i, RBframe);
				rollback2++;
				frames = weaponTypes[weapons[document.myform.waffe.value][2]][document.myform.char.value][0];
				RBframe = Math.floor(Math.floor((256 * RBframe + Math.floor(256 * i / 100) * rollback2) / 256) * skills[document.myform.skill.value][4] / 100);
				rollback3 = berechneFPA(frames, i, RBframe);
				ergebnis = rollback1 + rollback2 + rollback3;
				if (temp1 != ergebnis) {
					//let a = i - 15;
					//console.log("i=" + i + ",a=" + a);
					//a = a - 85;
					var bp = Math.ceil(120 * (i - 100 - SIAS + WSMprimaer) / (120 - (i - 100 - SIAS + WSMprimaer)));
					//if (bp < 0) break;
					breakpoints[breakpoints.length] = [bp, rollback1 + "/" + rollback2 + "/" + rollback3];
					breakpointsAPS[breakpointsAPS.length] = parseInt(2500 / ((rollback1 + rollback2 + rollback3) / 3)) / 100;
					temp1 = ergebnis;

					console.log("[" + i + ", \"" + (rollback1 + "/(" + rollback2 + ")/" + rollback3) + "\"],");

				}
			}
		}
		TabFenster = window.open("", "Tabelle", "width=420,height=520,screenX=80,screenY=150,dependent=yes,scrollbars=yes,resizable=no")
		SchreibeDaten();
		TabFenster.document.write('</table><br><table align="center" cellpadding="0" cellspacing="0"><tr class="title"><td height="30" width="70" align="center">IAS</td><td width="180" align="center">attack speed [frames]</td><td width="180" align="center">attacks per second</td></tr>');
		var aidel = 0;
		// if char is mercenary
		if (document.myform.char.value > 6) {
			aidel = 2;
		}
		// if char is a2 merc and has skill jab OR char is a5 merc and has skill standard attack
		if (((document.myform.char.value == 8) && (document.myform.skill.value == 3)) || ((document.myform.char.value == 9) && (document.myform.skill.value == 0))) {
			aidel = 1;
		}
		// if skill is not a multi hitting skill (except jab)
		if (skills[document.myform.skill.value][4] == 100) {
			for (i = 0; i < breakpoints.length; i++) {
				TabFenster.document.write('<tr><td height="30" align="center">' + breakpoints[i][0] + '</td><td align="center">' + breakpoints[i][1] + '</td><td align="center">' + parseInt(2500 / (aidel + breakpoints[i][1])) / 100 + '</td></tr>');
			}
		}
		// if skill is a multi hitting skill (except jab)
		if (skills[document.myform.skill.value][4] != 100) {
			for (i = 0; i < breakpoints.length; i++) {
				TabFenster.document.write('<tr><td height="30" align="center">' + breakpoints[i][0] + '</td><td align="center">' + breakpoints[i][1] + '</td><td align="center">' + breakpointsAPS[i] + '</td></tr>');
			}
		}
		TabFenster.document.write('</table><script type="text/javascript">window.setTimeout("stop()", 1000);</script');
		TabFenster.document.write('>');
	}
	// if werebear or werewolf
	if (document.myform.charform.value > 0) {
		while (parseInt(OIAS / 5) != parseFloat(OIAS / 5)) {
			OIAS--;
		}
		while (breakpoints.length > 0) {
			breakpoints.length = breakpoints.length - 1;
		}
		while (breakpoints2.length > 0) {
			breakpoints2.length = breakpoints2.length - 1;
		}
		if ((document.myform.waffe.value == 0) || ((document.myform.zweitwaffe.value > 0) && (document.myform.skill.value == 0))) {
			if ((document.myform.skill.value == 0) && (document.myform.zweitwaffe.value > 0)) {
				alert("There is a bug (likely from Vanilla LOD) where dual wielding in Werebear form can prevent you from attacking. You will have to remove the off-hand weapon.");
			}
			if (document.myform.waffe.value == 0) {
				alert("Please choose a weapon to use.");
			}
		} else {
			frames = weaponTypes[weapons[document.myform.waffe.value][2]][document.myform.char.value][0];
			if (weapons[document.myform.waffe.value][2] == 3) {
				frames = weaponTypes[2][document.myform.char.value][0];
			}
			var AnimSpeed = 256;
			if (weapons[document.myform.waffe.value][2] == 1) {
				AnimSpeed = 208;
			}
			for (i = 0; i <= verticalPlotLength - 1; i++) {
				for (j = 0; j <= horizontalPlotLength - 1; j++) {
					// feral rage
					if (document.myform.skill.value == 26) {
						breakpoints[breakpoints.length] = Math.ceil(256 * 7 / Math.floor(Math.floor(256 * 9 / Math.floor(256 * frames / Math.floor((100 + 5 * i - WSMprimaer) * 256 / 100))) * Math.min(Math.max(100 - WSMprimaer + SIAS + Math.floor(120 * (5 * i + 5 * j) / (120 + (5 * i + 5 * j))), 15), 175) / 100)) + Math.ceil((256 * 13 - Math.floor(Math.floor(256 * 9 / Math.floor(256 * frames / Math.floor((100 + 5 * i - WSMprimaer) * 256 / 100))) * Math.min(Math.max(100 - WSMprimaer + SIAS + Math.floor(120 * (5 * i + 5 * j) / (120 + (5 * i + 5 * j))), 15), 175) / 100) * Math.ceil(256 * 7 / Math.floor(Math.floor(256 * 9 / Math.floor(256 * frames / Math.floor((100 + 5 * i - WSMprimaer) * 256 / 100))) * Math.min(Math.max(100 - WSMprimaer + SIAS + Math.floor(120 * (5 * i + 5 * j) / (120 + (5 * i + 5 * j))), 15), 175) / 100))) / (2 * Math.floor(Math.floor(256 * 9 / Math.floor(256 * frames / Math.floor((100 + 5 * i - WSMprimaer) * 256 / 100))) * Math.min(Math.max(100 - WSMprimaer + SIAS + Math.floor(120 * (5 * i + 5 * j) / (120 + (5 * i + 5 * j))), 15), 175) / 100))) - 1;
						if ((OIAS > 70) && (j == 0)) {
							breakpoints2[breakpoints2.length] = Math.ceil(256 * 7 / Math.floor(Math.floor(256 * 9 / Math.floor(256 * frames / Math.floor((100 + 5 * i - WSMprimaer) * 256 / 100))) * Math.min(Math.max(100 - WSMprimaer + SIAS + Math.floor(120 * (5 * i + parseInt(OIAS)) / (120 + (5 * i + parseInt(OIAS)))), 15), 175) / 100)) + Math.ceil((256 * 13 - Math.floor(Math.floor(256 * 9 / Math.floor(256 * frames / Math.floor((100 + 5 * i - WSMprimaer) * 256 / 100))) * Math.min(Math.max(100 - WSMprimaer + SIAS + Math.floor(120 * (5 * i + parseInt(OIAS)) / (120 + (5 * i + parseInt(OIAS)))), 15), 175) / 100) * Math.ceil(256 * 7 / Math.floor(Math.floor(256 * 9 / Math.floor(256 * frames / Math.floor((100 + 5 * i - WSMprimaer) * 256 / 100))) * Math.min(Math.max(100 - WSMprimaer + SIAS + Math.floor(120 * (5 * i + parseInt(OIAS)) / (120 + (5 * i + parseInt(OIAS)))), 15), 175) / 100))) / (2 * Math.floor(Math.floor(256 * 9 / Math.floor(256 * frames / Math.floor((100 + 5 * i - WSMprimaer) * 256 / 100))) * Math.min(Math.max(100 - WSMprimaer + SIAS + Math.floor(120 * (5 * i + parseInt(OIAS)) / (120 + (5 * i + parseInt(OIAS)))), 15), 175) / 100))) - 1;
						}
					}
					// fury
					if (document.myform.skill.value == 29) {
						temp = (Math.ceil(256 * 7 /Math.floor(Math.floor(256 * 9 /Math.floor(256 * frames /Math.floor((100 + 5 * i - WSMprimaer) * 256 / 100 ) ) ) * Math.min( Math.max(100 - WSMprimaer + SIAS + Math.floor(120 * (5 * i + 5 * j) / (120 +(5 * i + 5 * j))), 15), 175)/100)) * 4 +Math.ceil(256 * 13 /Math.floor(Math.floor(256 * 9 /Math.floor(256 * frames / Math.floor((100 + 5 * i - WSMprimaer)* 256 / 100)))* Math.min(Math.max(100 - WSMprimaer + SIAS + Math.floor(120 * (5 * i + 5 * j)/ (120 + (5 * i + 5 * j))), 15), 175)/ 100)) - 1)/ 5
						if (parseInt(temp) == parseFloat(temp)) {
							temp = temp + ".0";
						}
						breakpoints[breakpoints.length] = temp;
						if ((OIAS > 70) && (j == 0)) {
							temp = (Math.ceil(256 * 7 / Math.floor(Math.floor(256 * 9 / Math.floor(256 * frames / Math.floor((100 + 5 * i - WSMprimaer) * 256 / 100))) * Math.min(Math.max(100 - WSMprimaer + SIAS + Math.floor(120 * (5 * i + parseInt(OIAS)) / (120 + (5 * i + parseInt(OIAS)))), 15), 175) / 100)) * 4 + Math.ceil(256 * 13 / Math.floor(Math.floor(256 * 9 / Math.floor(256 * frames / Math.floor((100 + 5 * i - WSMprimaer) * 256 / 100))) * Math.min(Math.max(100 - WSMprimaer + SIAS + Math.floor(120 * (5 * i + parseInt(OIAS)) / (120 + (5 * i + parseInt(OIAS)))), 15), 175) / 100)) - 1) / 5;
							if (parseInt(temp) == parseFloat(temp)) {
								temp = temp + ".0";
							}
							breakpoints2[breakpoints2.length] = temp;
						}
					}
					// not feral rage or fury, so normal swing, hunger, or rabies
					if ((document.myform.skill.value != 26) && (document.myform.skill.value != 29)) {
						var tempframe = 12;
						var tempframe2 = 10;
						if (document.myform.charform.value == 2) {
							tempframe = 13;
							tempframe2 = 9;
						}
						if (skills[document.myform.skill.value][2] == 6) {
							tempframe = 10;
						}
						breakpoints[breakpoints.length] = Math.ceil(256 * tempframe / Math.floor(Math.floor(256 * tempframe2 / Math.floor(256 * frames / Math.floor((100 + 5 * i - WSMprimaer) * AnimSpeed / 100))) * Math.min(Math.max(100 - WSMprimaer + SIAS + Math.floor(120 * (5 * i + 5 * j) / (120 + (5 * i + 5 * j))), 15), 175) / 100)) - 1;
						if ((OIAS > 70) && (j == 0)) {
							breakpoints2[breakpoints2.length] = Math.ceil(256 * tempframe / Math.floor(Math.floor(256 * tempframe2 / Math.floor(256 * frames / Math.floor((100 + 5 * i - WSMprimaer) * AnimSpeed / 100))) * Math.min(Math.max(100 - WSMprimaer + SIAS + Math.floor(120 * (5 * i + parseInt(OIAS)) / (120 + (5 * i + parseInt(OIAS)))), 15), 175) / 100)) - 1;
						}
					}
				}
			}
			for (k = 0; k <= verticalPlotLength - 1; k++) {
				if ((parseInt(WIAS / 5) != parseFloat(WIAS / 5)) && (document.myform.skill.value == 26)) {
					breakpoints[breakpoints.length] = Math.ceil(256 * 7 / Math.floor(Math.floor(256 * 9 / Math.floor(256 * frames / Math.floor((100 + parseInt(WIAS) - WSMprimaer) * 256 / 100))) * Math.min(Math.max(100 - WSMprimaer + SIAS + Math.floor(120 * (parseInt(WIAS) + 5 * k) / (120 + (parseInt(WIAS) + 5 * k))), 15), 175) / 100)) + Math.ceil((256 * 13 - Math.floor(Math.floor(256 * 9 / Math.floor(256 * frames / Math.floor((100 + parseInt(WIAS) - WSMprimaer) * 256 / 100))) * Math.min(Math.max(100 - WSMprimaer + SIAS + Math.floor(120 * (parseInt(WIAS) + 5 * k) / (120 + (parseInt(WIAS) + 5 * k))), 15), 175) / 100) * Math.ceil(256 * 7 / Math.floor(Math.floor(256 * 9 / Math.floor(256 * frames / Math.floor((100 + parseInt(WIAS) - WSMprimaer) * 256 / 100))) * Math.min(Math.max(100 - WSMprimaer + SIAS + Math.floor(120 * (parseInt(WIAS) + 5 * k) / (120 + (parseInt(WIAS) + 5 * k))), 15), 175) / 100))) / (2 * Math.floor(Math.floor(256 * 9 / Math.floor(256 * frames / Math.floor((100 + parseInt(WIAS) - WSMprimaer) * 256 / 100))) * Math.min(Math.max(100 - WSMprimaer + SIAS + Math.floor(120 * (parseInt(WIAS) + 5 * k) / (120 + (parseInt(WIAS) + 5 * k))), 15), 175) / 100))) - 1;
				}
				if ((parseInt(WIAS / 5) != parseFloat(WIAS / 5)) && (document.myform.skill.value == 29)) {
					temp = (Math.ceil(256 * 7 / Math.floor(Math.floor(256 * 9 / Math.floor(256 * frames / Math.floor((100 + parseInt(WIAS) - WSMprimaer) * 256 / 100))) * Math.min(100 - WSMprimaer + SIAS + Math.floor(120 * (parseInt(WIAS) + 5 * k) / (120 + (parseInt(WIAS) + 5 * k))), 175) / 100)) * 4 + Math.ceil(256 * 13 / Math.floor(Math.floor(256 * 9 / Math.floor(256 * frames / Math.floor((100 + parseInt(WIAS) - WSMprimaer) * 256 / 100))) * Math.min(100 - WSMprimaer + SIAS + Math.floor(120 * (parseInt(WIAS) + 5 * k) / (120 + (parseInt(WIAS) + 5 * k))), 175) / 100)) - 1) / 5;
					if (parseInt(temp) == parseFloat(temp)) {
						temp = temp + ".0";
					}
					breakpoints[breakpoints.length] = temp;
				}
				if ((parseInt(WIAS / 5) != parseFloat(WIAS / 5)) && (document.myform.skill.value != 26) && (document.myform.skill.value != 29)) {
					breakpoints[breakpoints.length] = Math.ceil(256 * tempframe / Math.floor(Math.floor(256 * tempframe2 / Math.floor(256 * frames / Math.floor((100 + parseInt(WIAS) - WSMprimaer) * AnimSpeed / 100))) * Math.min(Math.max(100 - WSMprimaer + SIAS + Math.floor(120 * (parseInt(WIAS) + 5 * k) / (120 + (parseInt(WIAS) + 5 * k))), 15), 175) / 100)) - 1;
				}
			}
			TabFenster = window.open("", "Tabelle", "width=900,height=650,screenX=110,screenY=80,dependent=yes,scrollbars=yes");
			SchreibeDaten();
			TabFenster.document.write('</table><p align="center">Your primary weapon&rsquo;s WIAS is plotted vertically, your equipment&rsquo;s IAS is plotted horizontally.</p>');
			TabFenster.document.write('<table style="border-collapse:collapse" align="center" border="1" cellpadding="0" cellspacing="0"><tr><td style="border-width:1px; border-style:solid; border-color:#FFFFFF" class="wertitle" width="60" align="center">---</td>');
			for (i = 0; i <= horizontalPlotLength - 1; i++) {
				TabFenster.document.write('<td style="border-width:1px; border-style:solid; border-color:#FFFFFF" class="wertitle" width="40" align="center">' + 5 * i + '</td>');
			}
			if (OIAS > 70) {
				TabFenster.document.write('<td style="border-width:1px; border-style:solid; border-color:#FFFFFF" class="wertitle" width="40" align="center">' + OIAS + '</td>');
			}
			TabFenster.document.write('</tr><tr>');
			for (j = 0; j <= verticalPlotLength - 1; j++) {
				TabFenster.document.write('<td style="border-width:1px; border-style:solid; border-color:#FFFFFF" class="wertitle" align="center">' + 5 * j + '</td>');
				for (i = horizontalPlotLength * j; i <= horizontalPlotLength * (j + 1) - 1; i++) {
					if ((OIAS == (i - horizontalPlotLength * j) * 5) && (WIAS == j * 5)) {
						TabFenster.document.write('<td style="border-width:1px; border-style:solid; border-color:#FFFFFF" class="auswahl" align="center"><b>' + breakpoints[i] + '</b></td>');
					} else {
						if ((OIAS == (i - horizontalPlotLength * j) * 5) || (WIAS == j * 5)) {
							TabFenster.document.write('<td style="border-width:1px; border-style:solid; border-color:#FFFFFF" class="iaswahl" align="center">' + breakpoints[i] + '</td>');
						} else {
							TabFenster.document.write('<td style="border-width:1px; border-style:solid; border-color:#FFFFFF" align="center">' + breakpoints[i] + '</td>');
						}
					}
				}
				if (OIAS > 70) {
					TabFenster.document.write('<td style="border-width:1px; border-style:solid; border-color:#FFFFFF" class="iaswahl" align="center">' + breakpoints2[j] + '</td>');
				}
				if (j < verticalPlotLength - 1) {
					TabFenster.document.write('</tr><tr>');
				}
				if ((parseInt(WIAS / 5) != parseFloat(WIAS / 5)) && (WIAS > j * 5) && (WIAS < (j + 1) * 5)) {
					TabFenster.document.write('<td style="border-width:1px; border-style:solid; border-color:#FFFFFF" class="wertitle" align="center">' + WIAS + '</td>');
					for (k = 0; k <= verticalPlotLength - 1; k++) {
						if (OIAS == k * 5) {
							TabFenster.document.write('<td style="border-width:1px; border-style:solid; border-color:#FFFFFF" class="auswahl" align="center"><b>' + breakpoints[breakpoints.length - horizontalPlotLength + k] + '</b></td>');
						} else {
							TabFenster.document.write('<td style="border-width:1px; border-style:solid; border-color:#FFFFFF" class="iaswahl" align="center">' + breakpoints[breakpoints.length - horizontalPlotLength + k] + '</td>');
						}
					}
					TabFenster.document.write('</tr><tr>');
				}
			}
			TabFenster.document.write('</tr></table><script type="text/javascript">window.setTimeout("stop()", 1000);</script');
			TabFenster.document.write('>');
		}
	}
	cap = 1;
	event.preventDefault();
}

function SchreibeDaten() {
	TabFenster.document.write('<html><head><style type="text/css">');
	TabFenster.document.write('body { background-color:#000000; color:#FFFFFF; } .title { background-color:#45070E; color:#FFFFFF; font-weight:bold; } .wertitle { background-color:EBBE00; color:FFFFFF; font-weight:bold; } .auswahl { background-color:#BEBEBE; color:#FFFFFF; } .iaswahl { background-color:#45070E; color:#FFFFFF; }');
	TabFenster.document.write('</style></head><body><br><table align="center" border="0" cellpadding="0" cellspacing="5">');
	TabFenster.document.write('<tr><td class="title" colspan="2" align="center"><b>Data:</b></td></tr><tr><td width="160">Character:</td><td>' + document.myform.char.options[document.myform.char.selectedIndex].text + '</td></tr>');
	if (document.myform.charform.value > 0) {
		TabFenster.document.write('<tr><td>Wereform:</td><td>' + document.myform.charform.options[document.myform.charform.selectedIndex].text + '</td></tr>');
	}
	TabFenster.document.write('<tr><td>Primary Weapon:</td><td>' + document.myform.waffe.options[document.myform.waffe.selectedIndex].text + '</td></tr>');
	if (document.myform.zweitwaffe.value > 0) {
		TabFenster.document.write('<tr><td>Secondary Weapon:</td><td>' + document.myform.zweitwaffe.options[document.myform.zweitwaffe.selectedIndex].text + '</td></tr>');
		TabFenster.document.write('<tr><td>Auto-WSM Bugged:</td><td>' + autoWSM + '</td></tr>');
	}
	TabFenster.document.write('<tr><td>Skill:</td><td>' + document.myform.skill.options[document.myform.skill.selectedIndex].text + '</td></tr>');
	TabFenster.document.write('<tr><td>IAS:</td><td>' + document.myform.IAS.options[document.myform.IAS.selectedIndex].text + '</td></tr>');
	if ((document.myform.waffe.value > 0) && (document.myform.zweitwaffe.value == 0)) {
		TabFenster.document.write('<tr><td>Weapon-IAS:</td><td>' + document.myform.wIAS1.options[document.myform.wIAS1.selectedIndex].text + '</td></tr>');
	}
	if ((document.myform.waffe.value > 0) && (document.myform.zweitwaffe.value > 0)) {
		TabFenster.document.write('<tr><td>Weapon-IAS:</td><td>' + document.myform.wIAS1.options[document.myform.wIAS1.selectedIndex].text + ' / ' + document.myform.wIAS2.options[document.myform.wIAS2.selectedIndex].text + '</td></tr>');
	}
	if (document.myform.fana.selectedIndex > 0) {
		TabFenster.document.write('<tr><td>Fanaticism:</td><td> Level ' + document.myform.fana.options[document.myform.fana.selectedIndex].text + '</td></tr>');
	}
	if (document.myform.frenzy.selectedIndex > 0) {
		TabFenster.document.write('<tr><td>Frenzy:</td><td> Level ' + document.myform.frenzy.options[document.myform.frenzy.selectedIndex].text + '</td></tr>');
	}
	if ((document.myform.charform.value == 2) && (document.myform.wolf.selectedIndex > 0)) {
		TabFenster.document.write('<tr><td>Werewolf:</td><td> Level ' + document.myform.wolf.options[document.myform.wolf.selectedIndex].text + '</td></tr>');
	}
	if (document.myform.tempo.selectedIndex > 0) {
		TabFenster.document.write('<tr><td>Burst of Speed:</td><td> Level ' + document.myform.tempo.options[document.myform.tempo.selectedIndex].text + '</td></tr>');
	}
}

function wirbelwind(temp) {
	//var temp;
	var ergebnis = 4;
	if (temp > 11) {
		ergebnis = 6;
	}
	if (temp > 14) {
		ergebnis = 8;
	}
	if (temp > 17) {
		ergebnis = 10;
	}
	if (temp > 19) {
		ergebnis = 12;
	}
	if (temp > 22) {
		ergebnis = 14;
	}
	if (temp > 25) {
		ergebnis = 16;
	}
	//console.log("temp=" + temp + ",result=" + ergebnis);
	return ergebnis;
}

function berechneWSM() {
	if ((document.myform.char.value != 1) && (document.myform.char.value != 2)) {
		WSMprimaer = weapons[document.myform.waffe.value][1];
	}
	if (((document.myform.char.value == 1) || (document.myform.char.value == 2)) && (document.myform.zweitwaffe.selectedIndex == 0)) {
		WSMprimaer = weapons[document.myform.waffe.value][1];
	}
	if (((document.myform.char.value == 1) || (document.myform.char.value == 2)) && (document.myform.zweitwaffe.value > 0)) {
		if (autoWSM == false) {
			WSMprimaer = parseInt((weapons[document.myform.waffe.value][1] + weapons[document.myform.zweitwaffe.value][1]) / 2);
			WSMsekundaer = parseInt((weapons[document.myform.waffe.value][1] + weapons[document.myform.zweitwaffe.value][1]) / 2) + weapons[document.myform.zweitwaffe.value][1] - weapons[document.myform.waffe.value][1];
		} else {
			WSMprimaer = parseInt((weapons[document.myform.waffe.value][1] + weapons[document.myform.zweitwaffe.value][1]) / 2) + weapons[document.myform.waffe.value][1] - weapons[document.myform.zweitwaffe.value][1];
			WSMsekundaer = parseInt((weapons[document.myform.waffe.value][1] + weapons[document.myform.zweitwaffe.value][1]) / 2);
		}
	}
}

function berechneEIAS() {
	if (document.myform.waffe.value == 0) {
		IASprimaer = parseInt(document.myform.IAS.value);
	}
	if ((document.myform.waffe.value > 0) && (document.myform.zweitwaffe.value == 0)) {
		IASprimaer = parseInt(document.myform.IAS.value) + parseInt(document.myform.wIAS1.value);
	}
	if (document.myform.zweitwaffe.value > 0) {
		IASprimaer = parseInt(document.myform.IAS.value) + parseInt(document.myform.wIAS1.value);
		IASsekundaer = parseInt(document.myform.IAS.value) + parseInt(document.myform.wIAS2.value);
	}
	EIASprimaer = Math.floor(120 * IASprimaer / (120 + IASprimaer));
	EIASsekundaer = Math.floor(120 * IASsekundaer / (120 + IASsekundaer));
}

function berechneSIAS() {
	var fana = parseInt(document.myform.fana.value);
	var frenzy = parseInt(document.myform.frenzy.value);
	var wolf = parseInt(document.myform.wolf.value);
	var tempo = parseInt(document.myform.tempo.value);
	var holyfrost = parseInt(document.myform.holyfrost.value);
	if (document.myform.charform.value != 2) wolf = 0;
	SIAS = fana + frenzy + wolf + tempo - holyfrost;
	if (document.myform.skill.value == 16) {
		SIAS = SIAS + 50;
	}
	if (document.myform.skill.value == 13) {
		SIAS = SIAS - 40;
	}
	if (document.myform.altern.checked == true) {
		SIAS = SIAS - 50;
	}
	if ((skills[document.myform.skill.value][2] == 7) && (document.myform.char.value < 7)) {
		SIAS = SIAS - 30;
	}
}

function neuChar() {
	setzeCharform();
	setzeWaffe();
	setzeBarbschwert();
	setzeZweitwaffe();
	setzeSIAS();
	setzeSkill();
	setzeIAS();
	weaponsInfo();
	berechneWerte();
}

function neuCharform() {
	setzeSkill();
	berechneWerte();
}

function neuWaffe() {
	setzeBarbschwert();
	setzeZweitwaffe();
	setzeSkill();
	weaponsInfo();
	berechneWerte();
}

function neuBarbschwert() {
	setzeZweitwaffe();
	weaponsInfo();
	berechneWerte();
}

function neuZweitwaffe() {
	setzeSkill();
	weaponsInfo();
	berechneWerte();
}

function setzeIASstufen() {
	IASabstufung();
	berechneWerte();
}

function setzeCharform() {
	tempForm = document.myform.charform.value;
	while (document.myform.charform.length > 0) document.myform.charform.options[0] = null;
	if (document.myform.char.value < 7) {
		for (i = 0; i < wereform.length; i++) {
			neuElement = new Option(unescape(wereform[i]), i);
			document.myform.charform.options[document.myform.charform.length] = neuElement;
		}
		if ((document.myform.char.value != 2) && (document.myform.char.value != 3)) document.myform.charform.options[document.myform.charform.length - 1] = null;
	} else {
		neuElement = new Option(wereform[0], 0);
		document.myform.charform.options[document.myform.charform.length] = neuElement;
	}
	for (i = 0; i < document.myform.charform.length; i++) {
		if (document.myform.charform.options[i].value == tempForm) {
			document.myform.charform.selectedIndex = i;
		}
	}
}

function setzeWaffe() {
	tempWaffe = document.myform.waffe.value;
	while (document.myform.waffe.length > 0) document.myform.waffe.options[0] = null;
	for (i = 0; i < weapons.length; i++) {
		if ((weapons[i][3] < 0) || (weapons[i][3] == document.myform.char.value)) {
			if ((document.myform.char.value < 7) || ((document.myform.char.value == 7) && (weapons[i][2] == 7)) || ((document.myform.char.value == 8) && ((weapons[i][4] == 8) || (weapons[i][4] == 2))) || ((document.myform.char.value == 9) && (weapons[i][4] == 9))) {
				neuElement = new Option(unescape(weapons[i][0]), i);
				document.myform.waffe.options[document.myform.waffe.length] = neuElement;
			}
		}
	}
	for (i = 0; i < document.myform.waffe.length; i++) {
		if (document.myform.waffe.options[i].value == tempWaffe) {
			document.myform.waffe.selectedIndex = i;
		}
	}
}

function setzeBarbschwert() {
	tempBarbschwert = document.myform.barbschwert.value;
	while (document.myform.barbschwert.length > 0) document.myform.barbschwert.options[0] = null;
	if ((document.myform.char.value == 2) && (weapons[document.myform.waffe.value][2] == 3)) {
		neuElement = new Option("two-handed", 0);
		document.myform.barbschwert.options[document.myform.barbschwert.length] = neuElement;
		neuElement = new Option("single-handed", 1);
		document.myform.barbschwert.options[document.myform.barbschwert.length] = neuElement;
	} else {
		neuElement = new Option("-", -1);
		document.myform.barbschwert.options[document.myform.barbschwert.length] = neuElement;
	}
	for (i = 0; i < document.myform.barbschwert.length; i++) {
		if (document.myform.barbschwert.options[i].value == tempBarbschwert) {
			document.myform.barbschwert.selectedIndex = i;
		}
	}
}

function setzeZweitwaffe() {
	tempZweitwaffe = document.myform.zweitwaffe.value;
	while (document.myform.zweitwaffe.length > 0) document.myform.zweitwaffe.options[0] = null;
	switch (document.myform.char.value) {
		case "1":
			if (weapons[document.myform.waffe.value][2] == 1) {
				for (i = 0; i < weapons.length; i++) {
					if ((weapons[i][3] == 1) || (weapons[i][2] == 0)) {
						neuElement = new Option(unescape(weapons[i][0]), i);
						document.myform.zweitwaffe.options[document.myform.zweitwaffe.length] = neuElement;
					}
				}
			} else {
				neuElement = new Option("-", "0");
				document.myform.zweitwaffe.options[document.myform.zweitwaffe.length] = neuElement;
			}
			break;
		case "2":
			if (((weapons[document.myform.waffe.value][2] == 2) || (weapons[document.myform.waffe.value][2] == 4)) || ((weapons[document.myform.waffe.value][2] == 3) && (document.myform.barbschwert.value == 1))) {
				for (i = 0; i < weapons.length; i++) {
					if ((weapons[i][2] == 0) || (weapons[i][2] == 3) || (((weapons[i][2] == 2) || (weapons[i][2] == 4)) && (weapons[i][3] == -1))) {
						neuElement = new Option(unescape(weapons[i][0]), i);
						document.myform.zweitwaffe.options[document.myform.zweitwaffe.length] = neuElement;
					}
				}
			} else {
				neuElement = new Option("-", "0");
				document.myform.zweitwaffe.options[document.myform.zweitwaffe.length] = neuElement;
			}
			break;
		default:
			neuElement = new Option("-", "0");
			document.myform.zweitwaffe.options[document.myform.zweitwaffe.length] = neuElement;
			break;
	}
	for (i = 0; i < document.myform.zweitwaffe.length; i++) {
		if (document.myform.zweitwaffe.options[i].value == tempZweitwaffe) {
			document.myform.zweitwaffe.selectedIndex = i;
		}
	}
}

function weaponsInfo() {
	document.myform.infoWaffe1.value = unescape(weaponTypes[weapons[document.myform.waffe.value][2]][10]) + " [" + weapons[document.myform.waffe.value][1] + "]";
	if (document.myform.zweitwaffe.value > 0) {
		document.myform.infoWaffe2.value = unescape(weaponTypes[weapons[document.myform.zweitwaffe.value][2]][10]) + " [" + weapons[document.myform.zweitwaffe.value][1] + "]";
	} else {
		document.myform.infoWaffe2.value = "";
	}
}

function setzeIAS() {
	if (statischIAS == true) {
		statischIAS = false;
		while (document.myform.IAS.length > 0) document.myform.IAS.options[0] = null;
		for (i = 0; i <= 30 * mIAS; i++) {
			if (mIAS == 1) {
				neuElement = new Option(5 * i, 5 * i)
			};
			if (mIAS == 5) {
				neuElement = new Option(i, i)
			};
			document.myform.IAS.options[document.myform.IAS.length] = neuElement;
		}
		while (document.myform.wIAS1.length > 0) document.myform.wIAS1.options[0] = null;
		for (i = 0; i <= 24 * mIAS; i++) {
			if (mIAS == 1) {
				neuElement = new Option(5 * i, 5 * i)
			};
			if (mIAS == 5) {
				neuElement = new Option(i, i)
			};
			document.myform.wIAS1.options[document.myform.wIAS1.length] = neuElement;
		}
		while (document.myform.wIAS2.length > 0) document.myform.wIAS2.options[0] = null;
		for (i = 0; i <= 24 * mIAS; i++) {
			if (mIAS == 1) {
				neuElement = new Option(5 * i, 5 * i)
			};
			if (mIAS == 5) {
				neuElement = new Option(i, i)
			};
			document.myform.wIAS2.options[document.myform.wIAS2.length] = neuElement;
		}
	}
}

function setzeSkill() {
	if (navigator.appName == "Netscape") {
		setzeSkillOptgroup();
	} else {
		setzeSkillOption();
	}
}

function setzeSkillOption() {
	while (document.myform.skill.length > 0) document.myform.skill.options[0] = null;
	switch (document.myform.char.value) {
		case "0":
			neuElement = new Option(skills[0][0], skills[0][1]);
			document.myform.skill.options[document.myform.skill.length] = neuElement;
			if (document.myform.charform.value == 0) {
				if ((weapons[document.myform.waffe.value][4] == 2) || (weapons[document.myform.waffe.value][4] == 3)) {
					neuElement = new Option(skills[1][0], skills[1][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
				if (weapons[document.myform.waffe.value][4] == 1) {
					neuElement = new Option(skills[4][0], skills[4][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
				if ((weapons[document.myform.waffe.value][4] == 2) || (weapons[document.myform.waffe.value][2] == 5)) {
					neuElement = new Option(skills[2][0], skills[2][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
					neuElement = new Option(skills[3][0], skills[3][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
					neuElement = new Option(skills[5][0], skills[5][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
				if (weapons[document.myform.waffe.value][5] == 1) {
					neuElement = new Option(skills[24][0], skills[24][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
			}
			break;
		case "1":
			neuElement = new Option(skills[0][0], skills[0][1]);
			document.myform.skill.options[document.myform.skill.length] = neuElement;
			if (document.myform.charform.value == 0) {
				if ((weapons[document.myform.waffe.value][4] == 2) || (weapons[document.myform.waffe.value][4] == 3)) {
					neuElement = new Option(skills[1][0], skills[1][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
				neuElement = new Option(skills[15][0], skills[15][1]);
				document.myform.skill.options[document.myform.skill.length] = neuElement;
				if (weapons[document.myform.waffe.value][4] != 1) {
					neuElement = new Option(skills[6][0], skills[6][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
					neuElement = new Option(skills[7][0], skills[7][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
					neuElement = new Option(skills[8][0], skills[8][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
				if ((weapons[document.myform.waffe.value][2] == 1) || (weapons[document.myform.waffe.value][2] == 0)) {
					neuElement = new Option(skills[9][0], skills[9][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
					neuElement = new Option(skills[10][0], skills[10][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
					neuElement = new Option(skills[11][0], skills[11][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
				if ((weapons[document.myform.waffe.value][2] == 1) && (weapons[document.myform.zweitwaffe.value][2] == 1)) {
					neuElement = new Option(skills[12][0], skills[12][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
				neuElement = new Option(skills[13][0], skills[13][1]);
				document.myform.skill.options[document.myform.skill.length] = neuElement;
				neuElement = new Option(skills[14][0], skills[14][1]);
				document.myform.skill.options[document.myform.skill.length] = neuElement;
				if (weapons[document.myform.waffe.value][5] == 1) {
					neuElement = new Option(skills[24][0], skills[24][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
				if (weapons[document.myform.waffe.value][2] == 1) {
					neuElement = new Option(skills[19][0], skills[19][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
			}
			break;
		case "2":
			neuElement = new Option(skills[0][0], skills[0][1]);
			document.myform.skill.options[document.myform.skill.length] = neuElement;
			if (document.myform.charform.value == 0) {
				if ((weapons[document.myform.waffe.value][4] == 2) || (weapons[document.myform.waffe.value][4] == 3)) {
					neuElement = new Option(skills[1][0], skills[1][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
				if (document.myform.zweitwaffe.value > 0) {
					neuElement = new Option(skills[16][0], skills[16][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
					neuElement = new Option(skills[17][0], skills[17][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
				if (((weapons[document.myform.waffe.value][4] == 2) || (weapons[document.myform.waffe.value][4] == 3)) && ((weapons[document.myform.zweitwaffe.value][4] == 2) || (weapons[document.myform.zweitwaffe.value][4] == 3))) {
					neuElement = new Option(skills[18][0], skills[18][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
				if (weapons[document.myform.waffe.value][4] != 1) {
					neuElement = new Option(skills[19][0], skills[19][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
					neuElement = new Option(skills[20][0], skills[20][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
					neuElement = new Option(skills[21][0], skills[21][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
					neuElement = new Option(skills[22][0], skills[22][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
					neuElement = new Option(skills[23][0], skills[23][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
				if ((weapons[document.myform.waffe.value][5] == 1) || (weapons[document.myform.zweitwaffe.value][5] == 1)) {
					neuElement = new Option(skills[24][0], skills[24][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
			}
			if (document.myform.charform.value == 2) {
				neuElement = new Option(skills[26][0], skills[26][1]);
				document.myform.skill.options[document.myform.skill.length] = neuElement;
			}
			break;
		case "3":
			neuElement = new Option(skills[0][0], skills[0][1]);
			document.myform.skill.options[document.myform.skill.length] = neuElement;
			if (document.myform.charform.value == 0) {
				if ((weapons[document.myform.waffe.value][4] == 2) || (weapons[document.myform.waffe.value][4] == 3)) {
					neuElement = new Option(skills[1][0], skills[1][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
				if (weapons[document.myform.waffe.value][5] == 1) {
					neuElement = new Option(skills[24][0], skills[24][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
			}
			if (document.myform.charform.value == 1) {
				neuElement = new Option(skills[27][0], skills[27][1]);
				document.myform.skill.options[document.myform.skill.length] = neuElement;
			}
			if (document.myform.charform.value == 2) {
				neuElement = new Option(skills[26][0], skills[26][1]);
				document.myform.skill.options[document.myform.skill.length] = neuElement;
				neuElement = new Option(skills[27][0], skills[27][1]);
				document.myform.skill.options[document.myform.skill.length] = neuElement;
				neuElement = new Option(skills[28][0], skills[28][1]);
				document.myform.skill.options[document.myform.skill.length] = neuElement;
				neuElement = new Option(skills[29][0], skills[29][1]);
				document.myform.skill.options[document.myform.skill.length] = neuElement;
			}
			break;
		case "5":
			neuElement = new Option(skills[0][0], skills[0][1]);
			document.myform.skill.options[document.myform.skill.length] = neuElement;
			if (document.myform.charform.value == 0) {
				if ((weapons[document.myform.waffe.value][4] == 2) || (weapons[document.myform.waffe.value][4] == 3)) {
					neuElement = new Option(skills[1][0], skills[1][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
				if (weapons[document.myform.waffe.value][4] != 1) {
					neuElement = new Option(skills[24][0], skills[24][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
					neuElement = new Option(skills[30][0], skills[30][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
					neuElement = new Option(skills[31][0], skills[31][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
					neuElement = new Option(skills[32][0], skills[32][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
				if ((weapons[document.myform.waffe.value][2] == 0) || (weapons[document.myform.waffe.value][2] == 2) || (weapons[document.myform.waffe.value][2] == 4)) {
					neuElement = new Option(skills[25][0], skills[25][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
			}
			break;
		case "7":
			neuElement = new Option(skills[0][0], skills[0][1]);
			document.myform.skill.options[document.myform.skill.length] = neuElement;
			break;
		case "8":
			neuElement = new Option(skills[3][0], skills[3][1]);
			document.myform.skill.options[document.myform.skill.length] = neuElement;
			neuElement = new Option(skills[0][0], skills[0][1]);
			document.myform.skill.options[document.myform.skill.length] = neuElement;
			break;
		case "9":
			neuElement = new Option(skills[0][0], skills[0][1]);
			document.myform.skill.options[document.myform.skill.length] = neuElement;
			neuElement = new Option(skills[22][0], skills[22][1]);
			document.myform.skill.options[document.myform.skill.length] = neuElement;
			neuElement = new Option(skills[23][0], skills[23][1]);
			document.myform.skill.options[document.myform.skill.length] = neuElement;
			break;
		default:
			neuElement = new Option(skills[0][0], skills[0][1]);
			document.myform.skill.options[document.myform.skill.length] = neuElement;
			if (document.myform.charform.value == 0) {
				if ((weapons[document.myform.waffe.value][4] == 2) || (weapons[document.myform.waffe.value][4] == 3)) {
					neuElement = new Option(skills[1][0], skills[1][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
				if (weapons[document.myform.waffe.value][5] == 1) {
					neuElement = new Option(skills[24][0], skills[24][1]);
					document.myform.skill.options[document.myform.skill.length] = neuElement;
				}
			}
			break;
	}
}

function setzeSkillOptgroup() {
	tempSkill = document.myform.skill.value;
	while (document.getElementsByName("skill")[0].hasChildNodes()) document.getElementsByName("skill")[0].removeChild(document.getElementsByName("skill")[0].firstChild);
	var optgroup1 = document.createElement("optgroup");
	var optgroup2 = document.createElement("optgroup");
	optgroup1.label = "native attacks";
	optgroup2.label = "non-class skills";
	switch (document.myform.char.value) {
		case "0":
			neuElement = new Option(skills[0][0], skills[0][1]);
			optgroup1.appendChild(neuElement);
			if (document.myform.charform.value == 0) {
				if ((weapons[document.myform.waffe.value][4] == 2) || (weapons[document.myform.waffe.value][4] == 3)) {
					neuElement = new Option(skills[1][0], skills[1][1]);
					optgroup1.appendChild(neuElement);
				}
				if (weapons[document.myform.waffe.value][4] == 1) {
					neuElement = new Option(skills[4][0], skills[4][1]);
					optgroup1.appendChild(neuElement);
				}
				if ((weapons[document.myform.waffe.value][4] == 2) || (weapons[document.myform.waffe.value][2] == 5)) {
					neuElement = new Option(skills[2][0], skills[2][1]);
					optgroup1.appendChild(neuElement);
					neuElement = new Option(skills[3][0], skills[3][1]);
					optgroup1.appendChild(neuElement);
					neuElement = new Option(skills[5][0], skills[5][1]);
					optgroup1.appendChild(neuElement);
				}
				document.myform.skill.appendChild(optgroup1);
				if (weapons[document.myform.waffe.value][5] == 1) {
					neuElement = new Option(skills[24][0], skills[24][1]);
					optgroup2.appendChild(neuElement);
					document.myform.skill.appendChild(optgroup2);
				}
			}
			if (document.myform.charform.value > 0) document.myform.skill.appendChild(optgroup1);
			break;
		case "1":
			neuElement = new Option(skills[0][0], skills[0][1]);
			optgroup1.appendChild(neuElement);
			if (document.myform.charform.value == 0) {
				if ((weapons[document.myform.waffe.value][4] == 2) || (weapons[document.myform.waffe.value][4] == 3)) {
					neuElement = new Option(skills[1][0], skills[1][1]);
					optgroup1.appendChild(neuElement);
				}
				neuElement = new Option(skills[15][0], skills[15][1]);
				optgroup1.appendChild(neuElement);
				if (weapons[document.myform.waffe.value][4] != 1) {
					neuElement = new Option(skills[6][0], skills[6][1]);
					optgroup1.appendChild(neuElement);
					neuElement = new Option(skills[7][0], skills[7][1]);
					optgroup1.appendChild(neuElement);
					neuElement = new Option(skills[8][0], skills[8][1]);
					optgroup1.appendChild(neuElement);
				}
				if ((weapons[document.myform.waffe.value][2] == 1) || (weapons[document.myform.waffe.value][2] == 0)) {
					neuElement = new Option(skills[9][0], skills[9][1]);
					optgroup1.appendChild(neuElement);
					neuElement = new Option(skills[10][0], skills[10][1]);
					optgroup1.appendChild(neuElement);
					neuElement = new Option(skills[11][0], skills[11][1]);
					optgroup1.appendChild(neuElement);
				}
				if ((weapons[document.myform.waffe.value][2] == 1) && (weapons[document.myform.zweitwaffe.value][2] == 1)) {
					neuElement = new Option(skills[12][0], skills[12][1]);
					optgroup1.appendChild(neuElement);
				}
				neuElement = new Option(skills[13][0], skills[13][1]);
				optgroup1.appendChild(neuElement);
				neuElement = new Option(skills[14][0], skills[14][1]);
				optgroup1.appendChild(neuElement);
				document.myform.skill.appendChild(optgroup1);
				if (weapons[document.myform.waffe.value][5] == 1) {
					neuElement = new Option(skills[24][0], skills[24][1]);
					optgroup2.appendChild(neuElement);
				}
				if (weapons[document.myform.waffe.value][2] == 1) {
					neuElement = new Option(skills[19][0], skills[19][1]);
					optgroup2.appendChild(neuElement);
				}
				if ((weapons[document.myform.waffe.value][5] == 1) || (weapons[document.myform.waffe.value][2] == 1)) document.myform.skill.appendChild(optgroup2);
			}
			if (document.myform.charform.value > 0) document.myform.skill.appendChild(optgroup1);
			break;
		case "2":
			neuElement = new Option(skills[0][0], skills[0][1]);
			optgroup1.appendChild(neuElement);
			if (document.myform.charform.value == 0) {
				if ((weapons[document.myform.waffe.value][4] == 2) || (weapons[document.myform.waffe.value][4] == 3)) {
					neuElement = new Option(skills[1][0], skills[1][1]);
					optgroup1.appendChild(neuElement);
				}
				if (document.myform.zweitwaffe.value > 0) {
					neuElement = new Option(skills[16][0], skills[16][1]);
					optgroup1.appendChild(neuElement);
					neuElement = new Option(skills[17][0], skills[17][1]);
					optgroup1.appendChild(neuElement);
				}
				if (((weapons[document.myform.waffe.value][4] == 2) || (weapons[document.myform.waffe.value][4] == 3)) && ((weapons[document.myform.zweitwaffe.value][4] == 2) || (weapons[document.myform.zweitwaffe.value][4] == 3))) {
					neuElement = new Option(skills[18][0], skills[18][1]);
					optgroup1.appendChild(neuElement);
				}
				if (weapons[document.myform.waffe.value][4] != 1) {
					neuElement = new Option(skills[19][0], skills[19][1]);
					optgroup1.appendChild(neuElement);
					neuElement = new Option(skills[20][0], skills[20][1]);
					optgroup1.appendChild(neuElement);
					neuElement = new Option(skills[21][0], skills[21][1]);
					optgroup1.appendChild(neuElement);
					neuElement = new Option(skills[22][0], skills[22][1]);
					optgroup1.appendChild(neuElement);
					neuElement = new Option(skills[23][0], skills[23][1]);
					optgroup1.appendChild(neuElement);
				}
				document.myform.skill.appendChild(optgroup1);
				if ((weapons[document.myform.waffe.value][5] == 1) || (weapons[document.myform.zweitwaffe.value][5] == 1)) {
					neuElement = new Option(skills[24][0], skills[24][1]);
					optgroup2.appendChild(neuElement);
					document.myform.skill.appendChild(optgroup2);
				}
			}
			if (document.myform.charform.value == 2) {
				neuElement = new Option(skills[26][0], skills[26][1]);
				optgroup1.appendChild(neuElement);
			}
			if (document.myform.charform.value > 0) document.myform.skill.appendChild(optgroup1);
			break;
		case "3":
			neuElement = new Option(skills[0][0], skills[0][1]);
			optgroup1.appendChild(neuElement);
			if (document.myform.charform.value == 0) {
				if ((weapons[document.myform.waffe.value][4] == 2) || (weapons[document.myform.waffe.value][4] == 3)) {
					neuElement = new Option(skills[1][0], skills[1][1]);
					optgroup1.appendChild(neuElement);
				}
				document.myform.skill.appendChild(optgroup1);
				if (weapons[document.myform.waffe.value][5] == 1) {
					neuElement = new Option(skills[24][0], skills[24][1]);
					optgroup2.appendChild(neuElement);
					document.myform.skill.appendChild(optgroup2);
				}
			}
			if (document.myform.charform.value == 1) {
				neuElement = new Option(skills[27][0], skills[27][1]);
				optgroup1.appendChild(neuElement);
			}
			if (document.myform.charform.value == 2) {
				neuElement = new Option(skills[26][0], skills[26][1]);
				optgroup1.appendChild(neuElement);
				neuElement = new Option(skills[27][0], skills[27][1]);
				optgroup1.appendChild(neuElement);
				neuElement = new Option(skills[28][0], skills[28][1]);
				optgroup1.appendChild(neuElement);
				neuElement = new Option(skills[29][0], skills[29][1]);
				optgroup1.appendChild(neuElement);
			}
			if (document.myform.charform.value > 0) document.myform.skill.appendChild(optgroup1);
			break;
		case "5":
			neuElement = new Option(skills[0][0], skills[0][1]);
			optgroup1.appendChild(neuElement);
			if (document.myform.charform.value == 0) {
				if ((weapons[document.myform.waffe.value][4] == 2) || (weapons[document.myform.waffe.value][4] == 3)) {
					neuElement = new Option(skills[1][0], skills[1][1]);
					optgroup1.appendChild(neuElement);
				}
				if (weapons[document.myform.waffe.value][4] != 1) {
					neuElement = new Option(skills[24][0], skills[24][1]);
					optgroup1.appendChild(neuElement);
					neuElement = new Option(skills[30][0], skills[30][1]);
					optgroup1.appendChild(neuElement);
					neuElement = new Option(skills[31][0], skills[31][1]);
					optgroup1.appendChild(neuElement);
					neuElement = new Option(skills[32][0], skills[32][1]);
					optgroup1.appendChild(neuElement);
				}
				if ((weapons[document.myform.waffe.value][2] == 0) || (weapons[document.myform.waffe.value][2] == 2) || (weapons[document.myform.waffe.value][2] == 4)) {
					neuElement = new Option(skills[25][0], skills[25][1]);
					optgroup1.appendChild(neuElement);
				}
			}
			document.myform.skill.appendChild(optgroup1);
			break;
		case "7":
			neuElement = new Option(skills[0][0], skills[0][1]);
			optgroup1.appendChild(neuElement);
			document.myform.skill.appendChild(optgroup1);
			break;
		case "8":
			neuElement = new Option(skills[3][0], skills[3][1]);
			optgroup1.appendChild(neuElement);
			neuElement = new Option(skills[0][0], skills[0][1]);
			optgroup1.appendChild(neuElement);
			document.myform.skill.appendChild(optgroup1);
			break;
		case "9":
			neuElement = new Option(skills[0][0], skills[0][1]);
			optgroup1.appendChild(neuElement);
			neuElement = new Option(skills[22][0], skills[22][1]);
			optgroup1.appendChild(neuElement);
			neuElement = new Option(skills[23][0], skills[23][1]);
			optgroup1.appendChild(neuElement);
			document.myform.skill.appendChild(optgroup1);
			break;
		default:
			neuElement = new Option(skills[0][0], skills[0][1]);
			optgroup1.appendChild(neuElement);
			if (document.myform.charform.value == 0) {
				if ((weapons[document.myform.waffe.value][4] == 2) || (weapons[document.myform.waffe.value][4] == 3)) {
					neuElement = new Option(skills[1][0], skills[1][1]);
					optgroup1.appendChild(neuElement);
				}
				document.myform.skill.appendChild(optgroup1);
				if (weapons[document.myform.waffe.value][5] == 1) {
					neuElement = new Option(skills[24][0], skills[24][1]);
					optgroup2.appendChild(neuElement);
					document.myform.skill.appendChild(optgroup2);
				}
			}
			if (document.myform.charform.value > 0) document.myform.skill.appendChild(optgroup1);
			break;
	}
	for (i = 0; i < document.myform.skill.length; i++) {
		if ((document.myform.skill.options[i].value == tempSkill) && (document.myform.char.value != 8)) {
			document.myform.skill.selectedIndex = i;
		}
	}
}

function setzeSIAS() {
	if (statischFana == true) {
		statischFana = false;
		while (document.myform.fana.length > 0) document.myform.fana.options[0] = null;
		for (i = 0; i <= 50; i++) {
			neuElement = new Option(i, Math.floor(Math.floor((110 * i) / (6 + i)) * (40 - 10) / 100) + 10);
			document.myform.fana.options[document.myform.fana.length] = neuElement;
			if (i == 0) {
				document.myform.fana.options[document.myform.fana.length - 1].value = 0;
			}
		}
	}
	while (document.myform.frenzy.length > 0) document.myform.frenzy.options[0] = null;
	if (document.myform.char.value == 2) {
		for (i = 0; i <= 50; i++) {
			neuElement = new Option(i, Math.floor(Math.floor((110 * i) / (6 + i)) * (50 - 0) / 100) + 0);
			document.myform.frenzy.options[document.myform.frenzy.length] = neuElement;
			if (i == 0) {
				document.myform.frenzy.options[document.myform.frenzy.length - 1].value = 0;
			}
		}
	} else {
		neuElement = new Option("-", 0);
		document.myform.frenzy.options[document.myform.frenzy.length] = neuElement;
	}
	while (document.myform.wolf.length > 0) document.myform.wolf.options[0] = null;
	if ((document.myform.char.value == 2) || (document.myform.char.value == 3)) {
		for (i = 0; i <= 50; i++) {
			neuElement = new Option(i, Math.floor(Math.floor((110 * i) / (6 + i)) * (80 - 10) / 100) + 10);
			document.myform.wolf.options[document.myform.wolf.length] = neuElement;
			if (i == 0) {
				document.myform.wolf.options[document.myform.wolf.length - 1].value = 0;
			}
		}
	} else {
		neuElement = new Option("-", 0);
		document.myform.wolf.options[document.myform.wolf.length] = neuElement;
	}
	while (document.myform.tempo.length > 0) document.myform.tempo.options[0] = null;
	if (document.myform.char.value == 1) {
		for (i = 0; i <= 50; i++) {
			neuElement = new Option(i, Math.floor(Math.floor((110 * i) / (6 + i)) * (60 - 15) / 100) + 15);
			document.myform.tempo.options[document.myform.tempo.length] = neuElement;
			if (i == 0) {
				document.myform.tempo.options[document.myform.tempo.length - 1].value = 0;
			}
		}
	} else {
		neuElement = new Option("-", 0);
		document.myform.tempo.options[document.myform.tempo.length] = neuElement;
	}
	if (statischFrost == true) {
		statischFrost = false;
		while (document.myform.holyfrost.length > 0) document.myform.holyfrost.options[0] = null;
		for (i = 0; i <= 30; i++) {
			neuElement = new Option(i, Math.floor(Math.floor((110 * i) / (6 + i)) * (60 - 25) / 100) + 25);
			document.myform.holyfrost.options[document.myform.holyfrost.length] = neuElement;
			if (i == 0) {
				document.myform.holyfrost.options[document.myform.holyfrost.length - 1].value = 0;
			}
		}
	}
}

function IASabstufung() {
	statischIAS = true;
	if (mIAS == 1) {
		mIAS = 5;
	} else {
		mIAS = 1;
	}
	setzeIAS();
}

function FensterZauber() {
	FensterZ = window.open("", "Casting Speeds", "width=1200,height=700,left=110,top=50,scrollbars=yes");
	FensterZ.focus();
	FensterZ.document.write('<html><head><style type="text/css"> .body { background-color:#000000; color:#FFFFFF; } .normal { background-color:#000000; color:#FFFFFF; } .title { background-color:#45070E; color:#FFFFFF; font-weight:bold; }</style></head>');
	FensterZ.document.write('<body><br><br><table cellpadding="4" cellspacing="1" style="border-color:#45070E; border-width:2px; border-style:solid;" align="center"><colgroup width="100" span="9"><tr align="center" class="title"><td class="normal"></td><td>Amazon</td><td>Assassin</td><td></td><td>Druid</td><td>Necromancer</td><td>Paladin</td><td>Sorceress</td><td width="115">Sorceress L/CL</td></tr>');
	FensterZ.document.write('<tr align="center"><td class="title">19</td><td>00 </td><td>   </td><td>   </td><td>  </td><td>   </td><td>   </td><td>   </td><td>00 </td></tr>       <tr align="center"><td class="title">18</td><td>07</td><td>   </td><td>   </td><td>00 </td><td>  </td><td>  </td><td>   </td><td>07 </td></tr>');
	FensterZ.document.write('<tr align="center"><td class="title">17</td><td>14 </td><td>   </td><td>   </td><td>04</td><td>   </td><td>   </td><td>   </td><td>15 </td></tr>       <tr align="center"><td class="title">16</td><td>22</td><td>00 </td><td>   </td><td>10 </td><td>  </td><td>  </td><td>   </td><td>23 </td></tr>');
	FensterZ.document.write('<tr align="center"><td class="title">15</td><td>32 </td><td>08 </td><td>   </td><td>19</td><td>00 </td><td>00 </td><td>   </td><td>35 </td></tr>       <tr align="center"><td class="title">14</td><td>48</td><td>16 </td><td>   </td><td>30 </td><td>09</td><td>09</td><td>   </td><td>52 </td></tr>');
	FensterZ.document.write('<tr align="center"><td class="title">13</td><td>68 </td><td>27 </td><td>00 </td><td>46</td><td>18 </td><td>18 </td><td>00 </td><td>78 </td></tr>       <tr align="center"><td class="title">12</td><td>99</td><td>42 </td><td>09 </td><td>68 </td><td>30</td><td>30</td><td>09 </td><td>117</td></tr>');
	FensterZ.document.write('<tr align="center"><td class="title">11</td><td>152</td><td>65 </td><td>20 </td><td>99</td><td>48 </td><td>48 </td><td>20 </td><td>194</td></tr>       <tr align="center"><td class="title">10</td><td>  </td><td>102</td><td>37 </td><td>163</td><td>75</td><td>75</td><td>37 </td><td>   </td></tr>');
	FensterZ.document.write('<tr align="center"><td class="title">09</td><td>   </td><td>174</td><td>63 </td><td>  </td><td>125</td><td>125</td><td>63 </td><td>   </td></tr>       <tr align="center"><td class="title">08</td><td>  </td><td>   </td><td>105</td><td>   </td><td>  </td><td>  </td><td>105</td><td>   </td></tr>');
	FensterZ.document.write('<tr align="center"><td class="title">07</td><td>   </td><td>   </td><td>200</td><td>  </td><td>   </td><td>   </td><td>200</td><td>   </td></tr></table>');
	FensterZ.document.write('<p align="center"><b>L/CL:</b> Skills "Lightning" und "Chain Lightning"</p>');
	FensterZ.document.write('<br><br>');
	FensterZ.document.write('<table cellspacing="1" cellpadding="4" align="center" style="border-color:#45070E; border-width:2px; border-style:solid;"><colgroup width="100" span="5"><tr align="center" class="title"><td class="normal"></td><td>Iron Wolf</td><td>Vampire</td><td>Werebear</td><td>Werewolf</td></tr>');
	FensterZ.document.write('<tr align="center"><td class="title">23</td><td>  </td><td>00 </td><td>   </td><td>   </td></tr>       <tr align="center"><td class="title">22</td><td>   </td><td>06 </td><td>  </td><td>  </td></tr>');
	FensterZ.document.write('<tr align="center"><td class="title">21</td><td>  </td><td>11 </td><td>   </td><td>   </td></tr>       <tr align="center"><td class="title">20</td><td>   </td><td>18 </td><td>  </td><td>  </td></tr>');
	FensterZ.document.write('<tr align="center"><td class="title">19</td><td>  </td><td>24 </td><td>   </td><td>   </td></tr>       <tr align="center"><td class="title">18</td><td>   </td><td>35 </td><td>  </td><td>  </td></tr>');
	FensterZ.document.write('<tr align="center"><td class="title">17</td><td>00</td><td>48 </td><td>   </td><td>   </td></tr>       <tr align="center"><td class="title">16</td><td>08 </td><td>65 </td><td>00</td><td>00</td></tr>');
	FensterZ.document.write('<tr align="center"><td class="title">15</td><td>15</td><td>86 </td><td>07 </td><td>06 </td></tr>       <tr align="center"><td class="title">14</td><td>26 </td><td>120</td><td>15</td><td>14</td></tr>');
	FensterZ.document.write('<tr align="center"><td class="title">13</td><td>39</td><td>180</td><td>26 </td><td>26 </td></tr>       <tr align="center"><td class="title">12</td><td>58 </td><td>   </td><td>40</td><td>40</td></tr>');
	FensterZ.document.write('<tr align="center"><td class="title">11</td><td>86</td><td>   </td><td>63 </td><td>60 </td></tr>       <tr align="center"><td class="title">10</td><td>138</td><td>   </td><td>99</td><td>95</td></tr>');
	FensterZ.document.write('<tr align="center"><td class="title">09</td><td>  </td><td>   </td><td>163</td><td>157</td></tr></table><br><br><script type="text/javascript">window.setTimeout("stop()", 1000);</script');
	FensterZ.document.write('>');
}

function FensterBlock() {
	FensterB = window.open("", "Blocking Speeds", "width=1200,height=700,left=110,top=50,scrollbars=yes");
	FensterB.focus();
	FensterB.document.write('<html><head><style type="text/css"> body { background-color:#000000; color:#FFFFFF; } .normal { background-color:#000000; color:#FFFFFF; } .title { background-color:#45070E; color:#FFFFFF; font-weight:bold; }</style></head>');
	FensterB.document.write('<body><br><br><table cellpadding="4" cellspacing="1" style="border-color:#45070E; border-width:2px; border-style:solid;" align="center"><colgroup width="100" span="10"><tr align="center" class="title"><td class="normal"></td><td>Amazon 1hs</td><td>Amazon</td><td>Assassin</td><td>Barbarian</td><td>Druid</td><td>Necromancer</td><td>Paladin</td><td>Paladin HS</td><td>Sorceress</td></tr>');
	FensterB.document.write('<tr align="center"><td class="title">17</td><td>00 </td><td>   </td><td>   </td><td>  </td><td>   </td><td>   </td><td>   </td><td>  </td><td>   </td></tr>            <tr align="center"><td class="title">16</td><td>04 </td><td>  </td><td>  </td><td>   </td><td>   </td><td>   </td><td>  </td><td>  </td><td>    </td></tr>');
	FensterB.document.write('<tr align="center"><td class="title">15</td><td>06 </td><td>   </td><td>   </td><td>  </td><td>   </td><td>   </td><td>   </td><td>  </td><td>   </td></tr>            <tr align="center"><td class="title">14</td><td>11 </td><td>  </td><td>  </td><td>   </td><td>   </td><td>   </td><td>  </td><td>  </td><td>    </td></tr>');
	FensterB.document.write('<tr align="center"><td class="title">13</td><td>15 </td><td>   </td><td>   </td><td>  </td><td>   </td><td>   </td><td>   </td><td>  </td><td>   </td></tr>            <tr align="center"><td class="title">12</td><td>23 </td><td>  </td><td>  </td><td>   </td><td>   </td><td>   </td><td>  </td><td>  </td><td>    </td></tr>');
	FensterB.document.write('<tr align="center"><td class="title">11</td><td>29 </td><td>   </td><td>   </td><td>  </td><td>00 </td><td>00 </td><td>   </td><td>  </td><td>   </td></tr>            <tr align="center"><td class="title">10</td><td>40 </td><td>  </td><td>  </td><td>   </td><td>06 </td><td>06 </td><td>  </td><td>  </td><td>    </td></tr>');
	FensterB.document.write('<tr align="center"><td class="title">09</td><td>56 </td><td>   </td><td>   </td><td>  </td><td>13 </td><td>13 </td><td>   </td><td>  </td><td>00 </td></tr>            <tr align="center"><td class="title">08</td><td>80 </td><td>  </td><td>  </td><td>   </td><td>20 </td><td>20 </td><td>  </td><td>  </td><td>07  </td></tr>');
	FensterB.document.write('<tr align="center"><td class="title">07</td><td>120</td><td>   </td><td>   </td><td>00</td><td>32 </td><td>32 </td><td>   </td><td>  </td><td>15 </td></tr>            <tr align="center"><td class="title">06</td><td>200</td><td>  </td><td>  </td><td>09 </td><td>52 </td><td>52 </td><td>  </td><td>  </td><td>27  </td></tr>');
	FensterB.document.write('<tr align="center"><td class="title">05</td><td>480</td><td>00 </td><td>00 </td><td>20</td><td>86 </td><td>86 </td><td>00 </td><td>  </td><td>48 </td></tr>            <tr align="center"><td class="title">04</td><td>   </td><td>13</td><td>13</td><td>42 </td><td>174</td><td>174</td><td>13</td><td>  </td><td>86  </td></tr>');
	FensterB.document.write('<tr align="center"><td class="title">03</td><td>   </td><td>32 </td><td>32 </td><td>86</td><td>600</td><td>600</td><td>32 </td><td>  </td><td>200</td></tr>            <tr align="center"><td class="title">02</td><td>   </td><td>86</td><td>86</td><td>280</td><td>   </td><td>   </td><td>86</td><td>00</td><td>4680</td></tr>');
	FensterB.document.write('<tr align="center"><td class="title">01</td><td>   </td><td>600</td><td>600</td><td>  </td><td>   </td><td>   </td><td>600</td><td>86</td><td>   </td></tr></table>');
	FensterB.document.write('<p align="center"><b>1hs:</b> single-handed swinging weapons (swords, axes, clubs, maces, sceptre, hammers, throwing axes)<br><b>HS:</b> Skill "Holy Shield"</p>');
	FensterB.document.write('<br><br>');
	FensterB.document.write('<table cellspacing="1" cellpadding="4" align="center" style="border-color:#45070E; border-width:2px; border-style:solid;"><colgroup width="100" span="4"><tr align="center" class="title"><td class="normal"></td><td>Vampire</td><td>Werebear</td><td>Werewolf</td></tr>');
	FensterB.document.write('<tr align="center"><td class="title">15</td><td>00 </td><td>    </td><td>   </td></tr>     <tr align="center"><td class="title">14</td><td>02 </td><td></td><td></td></tr>');
	FensterB.document.write('<tr align="center"><td class="title">13</td><td>06 </td><td>    </td><td>   </td></tr>     <tr align="center"><td class="title">12</td><td>10 </td><td>00 </td><td>    </td></tr>');
	FensterB.document.write('<tr align="center"><td class="title">11</td><td>16 </td><td>05  </td><td>   </td></tr>     <tr align="center"><td class="title">10</td><td>24 </td><td>10 </td><td>    </td></tr>');
	FensterB.document.write('<tr align="center"><td class="title">09</td><td>34 </td><td>16  </td><td>00 </td></tr>     <tr align="center"><td class="title">08</td><td>48 </td><td>27 </td><td>07  </td></tr>');
	FensterB.document.write('<tr align="center"><td class="title">07</td><td>72 </td><td>40  </td><td>15 </td></tr>     <tr align="center"><td class="title">06</td><td>117</td><td>65 </td><td>27  </td></tr>');
	FensterB.document.write('<tr align="center"><td class="title">05</td><td>208</td><td>109 </td><td>48 </td></tr>     <tr align="center"><td class="title">04</td><td>638</td><td>223</td><td>86  </td></tr>');
	FensterB.document.write('<tr align="center"><td class="title">03</td><td>   </td><td>1320</td><td>200</td></tr>     <tr align="center"><td class="title">02</td><td>   </td><td>   </td><td>4680</td></tr></table><br><br><script type="text/javascript">window.setTimeout("stop()", 1000);</script');
	FensterB.document.write('>');
}

function FensterTreffer() {
	FensterT = window.open("", "Hit Recovery Speeds", "width=1200,height=700,left=110,top=50,scrollbars=yes");
	FensterT.focus();
	FensterT.document.write('<html><head><style type="text/css"> body { background-color:#000000; color:#FFFFFF; } .normal { background-color:#000000; color:#FFFFFF; } .title { background-color:#45070E; color:#FFFFFF; font-weight:bold; }</style></head>');
	FensterT.document.write('<body><br><br><table cellpadding="4" cellspacing="1" style="border-color:#45070E; border-width:2px; border-style:solid;" align="center"><colgroup width="100" span="10"><tr align="center" class="title"><td class="normal"></td><td>Amazon</td><td>Assassin</td><td>Barbarian</td><td>Druid 1hs</td><td>Druid</td><td>Necromancer</td><td width="115">Paladin stf/2ht</td><td>Paladin</td><td>Sorceress</td></tr>');
	FensterT.document.write('<tr align="center"><td class="title">15</td><td>   </td><td>   </td><td>   </td><td>   </td><td>   </td><td>   </td><td>    </td><td>   </td><td>00 </td></tr>     <tr align="center"><td class="title">14</td><td>   </td><td>    </td><td>    </td><td>00 </td><td>   </td><td>   </td><td>   </td><td>    </td><td>05  </td></tr>');
	FensterT.document.write('<tr align="center"><td class="title">13</td><td>   </td><td>   </td><td>   </td><td>03 </td><td>00 </td><td>00 </td><td>00  </td><td>   </td><td>09 </td></tr>     <tr align="center"><td class="title">12</td><td>   </td><td>    </td><td>    </td><td>07 </td><td>05 </td><td>05 </td><td>03 </td><td>    </td><td>14  </td></tr>');
	FensterT.document.write('<tr align="center"><td class="title">11</td><td>00 </td><td>   </td><td>   </td><td>13 </td><td>10 </td><td>10 </td><td>07  </td><td>   </td><td>20 </td></tr>     <tr align="center"><td class="title">10</td><td>06 </td><td>    </td><td>    </td><td>19 </td><td>16 </td><td>16 </td><td>13 </td><td>    </td><td>30  </td></tr>');
	FensterT.document.write('<tr align="center"><td class="title">09</td><td>13 </td><td>00 </td><td>00 </td><td>29 </td><td>26 </td><td>26 </td><td>20  </td><td>00 </td><td>42 </td></tr>     <tr align="center"><td class="title">08</td><td>20 </td><td>07  </td><td>07  </td><td>42 </td><td>39 </td><td>39 </td><td>32 </td><td>07  </td><td>60  </td></tr>');
	FensterT.document.write('<tr align="center"><td class="title">07</td><td>32 </td><td>15 </td><td>15 </td><td>63 </td><td>56 </td><td>56 </td><td>48  </td><td>15 </td><td>86 </td></tr>     <tr align="center"><td class="title">06</td><td>52 </td><td>27  </td><td>27  </td><td>99 </td><td>86 </td><td>86 </td><td>75 </td><td>27  </td><td>142 </td></tr>');
	FensterT.document.write('<tr align="center"><td class="title">05</td><td>86 </td><td>48 </td><td>48 </td><td>174</td><td>152</td><td>152</td><td>129 </td><td>48 </td><td>280</td></tr>     <tr align="center"><td class="title">04</td><td>174</td><td>86  </td><td>86  </td><td>456</td><td>377</td><td>377</td><td>280</td><td>86  </td><td>1480</td></tr>');
	FensterT.document.write('<tr align="center"><td class="title">03</td><td>600</td><td>200</td><td>200</td><td>   </td><td>   </td><td>   </td><td>4680</td><td>200</td><td>   </td></tr>     <tr align="center"><td class="title">02</td><td>   </td><td>4680</td><td>4680</td><td>   </td><td>   </td><td>   </td><td>   </td><td>4680</td><td>    </td></tr></table>');
	FensterT.document.write('<p align="center"><b>1hs:</b> single-handed swinging weapons (swords, axes, clubs, maces, sceptre, hammers, throwing axes)<br><b>stf/2ht</b>: All two-handed weapons except swords</p>');
	FensterT.document.write('<br><br>');
	FensterT.document.write('<table cellspacing="1" cellpadding="4" align="center" style="border-color:#45070E; border-width:2px; border-style:solid;"><colgroup width="100" span="8"><tr align="center" class="title"><td class="normal"></td><td>Barbarian</td><td>Iron Wolf</td><td>Rogue</td><td>Town Guard</td><td>Vampire</td><td>Werebear</td><td>Werewolf</td></tr>');
	FensterT.document.write('<tr align="center"><td class="title">17</td><td>   </td><td>00 </td><td>   </td><td>   </td><td>   </td><td>   </td><td>  </td></tr>       <tr align="center"><td class="title">16</td><td>    </td><td>05 </td><td>   </td><td>   </td><td>   </td><td>   </td><td>   </td></tr>');
	FensterT.document.write('<tr align="center"><td class="title">15</td><td>   </td><td>08 </td><td>   </td><td>00 </td><td>00 </td><td>   </td><td>  </td></tr>       <tr align="center"><td class="title">14</td><td>    </td><td>13 </td><td>   </td><td>05 </td><td>02 </td><td>   </td><td>   </td></tr>');
	FensterT.document.write('<tr align="center"><td class="title">13</td><td>   </td><td>18 </td><td>   </td><td>09 </td><td>06 </td><td>00 </td><td>  </td></tr>       <tr align="center"><td class="title">12</td><td>    </td><td>24 </td><td>   </td><td>14 </td><td>10 </td><td>05 </td><td>   </td></tr>');
	FensterT.document.write('<tr align="center"><td class="title">11</td><td>   </td><td>32 </td><td>00 </td><td>20 </td><td>16 </td><td>10 </td><td>  </td></tr>       <tr align="center"><td class="title">10</td><td>    </td><td>46 </td><td>06 </td><td>30 </td><td>24 </td><td>16 </td><td>   </td></tr>');
	FensterT.document.write('<tr align="center"><td class="title">09</td><td>00 </td><td>63 </td><td>13 </td><td>42 </td><td>34 </td><td>24 </td><td>  </td></tr>       <tr align="center"><td class="title">08</td><td>07  </td><td>86 </td><td>20 </td><td>60 </td><td>48 </td><td>37 </td><td>   </td></tr>');
	FensterT.document.write('<tr align="center"><td class="title">07</td><td>15 </td><td>133</td><td>32 </td><td>86 </td><td>72 </td><td>54 </td><td>00</td></tr>       <tr align="center"><td class="title">06</td><td>27  </td><td>232</td><td>52 </td><td>142</td><td>117</td><td>86 </td><td>09 </td></tr>');
	FensterT.document.write('<tr align="center"><td class="title">05</td><td>48 </td><td>600</td><td>86 </td><td>280</td><td>208</td><td>152</td><td>20</td></tr>       <tr align="center"><td class="title">04</td><td>86  </td><td>   </td><td>174</td><td>   </td><td>   </td><td>360</td><td>42 </td></tr>');
	FensterT.document.write('<tr align="center"><td class="title">03</td><td>200</td><td>   </td><td>600</td><td>   </td><td>   </td><td>   </td><td>86</td></tr>       <tr align="center"><td class="title">02</td><td>4680</td><td>   </td><td>   </td><td>   </td><td>   </td><td>   </td><td>280</td></tr></table><br><br><script type="text/javascript">window.setTimeout("stop()", 1000);</script');
	FensterT.document.write('>');
}
var wereform = ["unchanged", "Werebear", "Werewolf"]
var startingFrames = [1, 0, 2, 2, 2, 2, 2, 0, 0]
var weaponTypes = [
	[
		[13, 13],
		[11, 12],
		[12, 12],
		[16, 16],
		[15, 15],
		[14, 14],
		[16, 16], 0, 0, 0, "unarmed"
	],
	[
		[0, 0],
		[11, 12],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0], 0, 0, 0, "claw"
	],
	[
		[16, 16],
		[15, 15],
		[16, 16],
		[19, 19],
		[19, 19],
		[15, 15],
		[20, 20], 0, 0, [16, 16], "one-handed swinging weapon"
	],
	[
		[20, 20],
		[23, 23],
		[18, 18],
		[21, 21],
		[23, 23],
		[18, 19],
		[24, 24], 0, 0, [16, 16], "two-handed sword"
	],
	[
		[15, 15],
		[15, 15],
		[16, 16],
		[19, 19],
		[19, 19],
		[17, 17],
		[19, 19], 0, [16, 16], 0, "one-handed thrusting weapon"
	],
	[
		[18, 18],
		[23, 23],
		[19, 19],
		[23, 23],
		[24, 24],
		[20, 20],
		[23, 23], 0, [16, 16], 0, "spear"
	],
	[
		[20, 20],
		[19, 19],
		[19, 19],
		[17, 17],
		[20, 20],
		[18, 18],
		[18, 18], 0, [16, 16], 0, "two-handed weapon"
	],
	[
		[14, 14],
		[16, 16],
		[15, 15],
		[16, 16],
		[18, 18],
		[16, 16],
		[17, 17],
		[15, 15], 0, 0, "bow"
	],
	[
		[20, 20],
		[21, 21],
		[20, 20],
		[20, 20],
		[20, 20],
		[20, 20],
		[20, 20], 0, 0, 0, "crossbow"
	],
	[16, 16, 16, 18, 20, 16, 20]
]
var actionsFrames = [
	[8, 6, 6, 8, 8, 7, 9],
	[0, 0, 0, 0, 0, 0, 0],
	[10, 7, 7, 9, 9, 7, 12],
	[12, 11, 8, 10, 11, 8, 14],
	[9, 7, 7, 8, 9, 8, 11],
	[11, 10, 9, 9, 10, 8, 13],
	[12, 9, 9, 9, 11, 9, 11],
	[6, 7, 7, 8, 9, 8, 9],
	[9, 10, 10, 10, 11, 10, 11]
]
var skills = [
	["Standard", 0, 1, 0, 100],
	["Throw", 1, 2, 0, 100],
	["Impale", 2, 7, 0, 100],
	["Jab", 3, 7, 1, 100],
	["Strafe", 4, 0, 0, 50],
	["Fend", 5, 0, 0, 40],
	["Tiger Strike", 6, 0, 0, 100],
	["Cobra Strike", 7, 0, 0, 100],
	["Phoenix Strike", 8, 0, 0, 100],
	["Fists of Fire", 9, 7, 2, 100],
	["Claws of Thunder", 10, 7, 2, 100],
	["Blades of Ice", 11, 7, 2, 100],
	["Dragon Claw", 12, 7, 2, 100],
	["Dragon Tail", 13, 3, 0, 100],
	["Dragon Talon", 14, 3, 0, 0],
	["Laying Traps", 15, 5, 0, 100],
	["Double Swing", 16, 7, 3, 100],
	["Frenzy", 17, 7, 3, 100],
	["Double Throw", 18, 7, 4, 100],
	["Whirlwind", 19, 7, 0, 100],
	["Concentrate", 20, 0, 0, 100],
	["Berserk", 21, 0, 0, 100],
	["Bash", 22, 0, 0, 100],
	["Stun", 23, 0, 0, 100],
	["Zeal", 24, 0, 0, 0],
	["Smite", 25, 4, 0, 100],
	["Feral Rage", 26, 0, 0, 100],
	["Hunger", 27, 6, 0, 100],
	["Rabies", 28, 6, 0, 100],
	["Fury", 29, 0, 0, 0],
	["Sacrifice", 30, 0, 0, 100],
	["Vengeance", 31, 0, 0, 100],
	["Conversion", 32, 0, 0, 100]
]
var sequences = [
	[0, 0, 0, 0, 21, 24, 0, 0, 0],
	[0, 0, 0, 0, 18, 21, 0, 0, 0],
	[12, 12, 16, 0, 0, 0, 0, 0, 0],
	[0, 0, 17, 17, 17, 0, 0, 0, 0],
	[0, 0, 12, 0, 12, 0, 0, 0, 0]
]
var weapons = [
	["[unarmed]", 0, 0, -1, 0, 0],
	["Ancient Axe", 10, 6, -1, 0, 1],
	["Ancient Sword", 0, 2, -1, 9, 0],
	["Arbalest", -10, 8, -1, 1, 0],
	["Archon Staff", 10, 6, -1, 0, 1],
	["Ashwood Bow", 0, 7, 0, 1, 0],
	["Ataghan", -20, 2, -1, 9, 0],
	["Axe", 10, 2, -1, 0, 1],
	["Balanced Axe", -10, 2, -1, 3, 0],
	["Balanced Knife", -20, 4, -1, 3, 0],
	["Ballista", 10, 8, -1, 1, 0],
	["Balrog Blade", 0, 3, -1, 9, 1],
	["Balrog Spear", 10, 4, -1, 2, 0],
	["Barbed Club", 0, 2, -1, 0, 0],
	["Bardiche", 10, 6, -1, 8, 0],
	["Bastard Sword", 10, 3, -1, 9, 1],
	["Battle Axe", 10, 6, -1, 0, 1],
	["Battle Cestus", -10, 1, 1, 0, 0],
	["Battle Dart", 0, 4, -1, 3, 0],
	["Battle Hammer", 20, 2, -1, 0, 1],
	["Battle Scythe", -10, 6, -1, 8, 1],
	["Battle Staff", 0, 6, -1, 0, 1],
	["Battle Sword", 0, 2, -1, 9, 1],
	["Bearded Axe", 0, 6, -1, 0, 1],
	["Bec-de-Corbin", 0, 6, -1, 8, 1],
	["Berserker Axe", 0, 2, -1, 0, 1],
	["Bill", 0, 6, -1, 8, 1],
	["Blade Bow", -10, 7, -1, 1, 0],
	["Blade Talons", -20, 1, 1, 0, 0],
	["Blade", -10, 4, -1, 0, 0],
	["Bone Knife", -20, 4, -1, 0, 0],
	["Bone Wand", -20, 2, -1, 0, 0],
	["Brandistock", -20, 5, -1, 8, 1],
	["Broad Axe", 0, 6, -1, 0, 1],
	["Broad Sword", 0, 2, -1, 9, 1],
	["Burnt Wand", 0, 2, -1, 0, 0],
	["Caduceus", -10, 2, -1, 0, 1],
	["Cedar Bow", 0, 7, -1, 1, 0],
	["Cedar Staff", 10, 6, -1, 0, 1],
	["Ceremonial Bow", 10, 7, 0, 1, 0],
	["Ceremonial Javelin", -10, 4, 0, 2, 0],
	["Ceremonial Pike", 20, 5, 0, 8, 1],
	["Ceremonial Spear", 0, 5, 0, 8, 1],
	["Cestus", 0, 1, 1, 0, 0],
	["Champion Axe", -10, 6, -1, 0, 1],
	["Champion Sword", -10, 3, -1, 9, 1],
	["Chu-Ko-Nu", -60, 8, -1, 1, 0],
	["Cinquedeas", -20, 4, -1, 0, 0],
	["Clasped Orb", 0, 2, 6, 0, 0],
	["Claws", -10, 1, 1, 0, 0],
	["Claymore", 10, 3, -1, 9, 1],
	["Cleaver", 10, 2, -1, 0, 1],
	["Cloudy Sphere", 0, 2, 6, 0, 0],
	["Club", -10, 2, -1, 0, 0],
	["Colossus Blade", 5, 3, -1, 9, 1],
	["Colossus Crossbow", 10, 8, -1, 1, 0],
	["Colossus Sword", 10, 3, -1, 9, 1],
	["Colossus Voulge", 10, 6, -1, 8, 1],
	["Composite Bow", -10, 7, -1, 1, 0],
	["Conquest Sword", 0, 2, -1, 9, 1],
	["Crossbow", 0, 8, -1, 1, 0],
	["Crowbill", -10, 2, -1, 0, 1],
	["Crusader Bow", 10, 7, -1, 1, 0],
	["Cryptic Axe", 10, 6, -1, 8, 1],
	["Cryptic Sword", -10, 2, -1, 9, 1],
	["Crystal Sword", 0, 2, -1, 9, 1],
	["Crystalline Globe", -10, 2, 6, 0, 0],
	["Cudgel", -10, 2, -1, 0, 0],
	["Cutlass", -30, 2, -1, 9, 0],
	["Dacian Falx", 10, 3, -1, 9, 1],
	["Dagger", -20, 4, -1, 0, 0],
	["Decapitator", 10, 6, -1, 0, 1],
	["Demon Crossbow", -60, 8, -1, 1, 0],
	["Demon Heart", 0, 2, 6, 0, 0],
	["Devil Star", 10, 2, -1, 0, 0],
	["Diamond Bow", 0, 7, -1, 1, 0],
	["Dimensional Blade", 0, 2, -1, 9, 1],
	["Dimensional Shard", 10, 2, 6, 0, 0],
	["Dirk", 0, 4, -1, 0, 0],
	["Divine Scepter", -10, 2, -1, 0, 1],
	["Double Axe", 10, 2, -1, 0, 1],
	["Double Bow", -10, 7, -1, 1, 0],
	["Eagle Orb", -10, 2, 6, 0, 0],
	["Edge Bow", 5, 7, -1, 1, 0],
	["Elder Staff", 0, 6, -1, 0, 1],
	["Eldritch Orb", -10, 2, 6, 0, 0],
	["Elegant Blade", -10, 2, -1, 9, 0],
	["Espandon", 0, 3, -1, 9, 0],
	["Ettin Axe", 10, 2, -1, 0, 1],
	["Executioner Sword", 10, 3, -1, 9, 1],
	["Falcata", 0, 2, -1, 9, 0],
	["Falchion", 20, 2, -1, 9, 0],
	["Fanged Knife", -20, 4, -1, 0, 0],
	["Fascia", 10, 1, 1, 0, 0],
	["Feral Axe", -15, 6, -1, 0, 1],
	["Feral Claws", -20, 1, 1, 0, 0],
	["Flail", -10, 2, -1, 0, 1],
	["Flamberge", -10, 3, -1, 9, 1],
	["Flanged Mace", 0, 2, -1, 0, 0],
	["Flying Axe", 10, 2, -1, 3, 0],
	["Francisca", 10, 2, -1, 3, 0],
	["Fuscina", 0, 5, -1, 8, 1],
	["Ghost Glaive", 20, 4, -1, 2, 0],
	["Ghost Spear", 0, 5, -1, 8, 1],
	["Ghost Wand", 10, 2, -1, 0, 0],
	["Giant Axe", 10, 6, -1, 0, 1],
	["Giant Sword", 0, 3, -1, 9, 1],
	["Giant Thresher", -10, 6, -1, 8, 1],
	["Gladius", 0, 2, -1, 9, 0],
	["Glaive", 20, 4, -1, 2, 0],
	["Glorious Axe", 10, 6, -1, 0, 1],
	["Glowing Orb", -10, 2, 6, 0, 0],
	["Gnarled Staff", 10, 6, -1, 0, 1],
	["Gorgon Crossbow", 0, 8, -1, 1, 0],
	["Gothic Axe", -10, 6, -1, 0, 1],
	["Gothic Bow", 10, 7, -1, 1, 0],
	["Gothic Staff", 0, 6, -1, 0, 1],
	["Gothic Sword", 10, 3, -1, 9, 1],
	["Grand Matron Bow", 10, 7, 0, 1, 0],
	["Grand Scepter", 10, 2, -1, 0, 0],
	["Grave Wand", 0, 2, -1, 0, 0],
	["Great Axe", -10, 6, -1, 0, 1],
	["Great Bow", -10, 7, -1, 1, 0],
	["Great Maul", 20, 6, -1, 0, 1],
	["Great Pilum", 0, 4, -1, 2, 0],
	["Great Poleaxe", 0, 6, -1, 8, 1],
	["Great Sword", 10, 3, -1, 9, 1],
	["Greater Claws", -20, 1, 1, 0, 0],
	["Greater Talons", -30, 1, 1, 0, 0],
	["Grim Scythe", -10, 6, -1, 8, 1],
	["Grim Wand", 0, 2, -1, 0, 0],
	["Halberd", 0, 6, -1, 8, 1],
	["Hand Axe", 0, 2, -1, 0, 0],
	["Hand Scythe", -10, 1, 1, 0, 0],
	["Harpoon", -10, 4, -1, 2, 0],
	["Hatchet Hands", 10, 1, 1, 0, 0],
	["Hatchet", 0, 2, -1, 0, 0],
	["Heavenly Stone", -10, 2, 6, 0, 0],
	["Heavy Crossbow", 10, 8, -1, 1, 0],
	["Highland Blade", -5, 3, -1, 9, 1],
	["Holy Water Sprinkler", 10, 2, -1, 0, 0],
	["Hunter's Bow", -10, 7, -1, 1, 0],
	["Hurlbat", -10, 2, -1, 3, 0],
	["Hydra Bow", 10, 7, -1, 1, 0],
	["Hydra Edge", 10, 2, -1, 9, 0],
	["Hyperion Javelin", -10, 4, -1, 2, 0],
	["Hyperion Spear", -10, 5, -1, 8, 0],
	["Jagged Star", 10, 2, -1, 0, 0],
	["Jared's Stone", 10, 2, 6, 0, 0],
	["Javelin", -10, 4, -1, 2, 0],
	["Jo Staff", -10, 6, -1, 0, 0],
	["Katar", -10, 1, 1, 0, 0],
	["Knout", -10, 2, -1, 0, 1],
	["Kris", -20, 4, -1, 0, 0],
	["Lance", 20, 5, -1, 8, 1],
	["Large Axe", -10, 6, -1, 0, 1],
	["Large Siege Bow", 10, 7, -1, 1, 0],
	["Legend Spike", -10, 4, -1, 0, 0],
	["Legend Sword", -15, 3, -1, 9, 0],
	["Legendary Mallet", 20, 2, -1, 0, 1],
	["Lich Wand", -20, 2, -1, 0, 0],
	["Light Crossbow", -10, 8, -1, 1, 0],
	["Lochaber Axe", 10, 6, -1, 8, 0],
	["Long Battle Bow", 10, 7, -1, 1, 0],
	["Long Bow", 0, 7, -1, 1, 0],
	["Long Staff", 0, 6, -1, 0, 0],
	["Long Sword", -10, 2, -1, 9, 1],
	["Long War Bow", 10, 7, -1, 1, 0],
	["Mace", 0, 2, -1, 0, 0],
	["Maiden Javelin", -10, 4, 0, 2, 0],
	["Maiden Pike", 10, 5, 0, 8, 1],
	["Maiden Spear", 0, 5, 0, 8, 1],
	["Mancatcher", -20, 5, -1, 8, 1],
	["Martel de Fer", 20, 6, -1, 0, 1],
	["Matriarchal Bow", -10, 7, 0, 1, 0],
	["Matriarchal Javelin", -10, 4, 0, 2, 0],
	["Matriarchal Pike", 20, 5, 0, 8, 1],
	["Matriarchal Spear", 0, 5, 0, 8, 1],
	["Maul", 10, 6, -1, 0, 1],
	["Mighty Scepter", 0, 2, -1, 0, 0],
	["Military Axe", -10, 6, -1, 0, 1],
	["Military Pick", -10, 2, -1, 0, 1],
	["Mithril Point", 0, 4, -1, 0, 0],
	["Morning Star", 10, 2, -1, 0, 0],
	["Mythical Sword", 0, 2, -1, 9, 0],
	["Naga", 0, 2, -1, 0, 1],
	["Ogre Axe", 0, 6, -1, 8, 0],
	["Ogre Maul", 10, 6, -1, 0, 1],
	["Partizan", 10, 6, -1, 8, 1],
	["Pellet Bow", -10, 8, -1, 1, 0],
	["Petrified Wand", 10, 2, -1, 0, 0],
	["Phaseblade", -30, 2, -1, 9, 1],
	["Pike", 20, 5, -1, 8, 1],
	["Pilum", 0, 4, -1, 2, 0],
	["Poignard", -20, 4, -1, 0, 0],
	["Poleaxe", 10, 6, -1, 8, 1],
	["Polished Wand", 0, 2, -1, 0, 0],
	["Quarterstaff", 0, 6, -1, 0, 0],
	["Quhab", 0, 1, 1, 0, 0],
	["Razor Bow", -10, 7, -1, 1, 0],
	["Reflex Bow", 10, 7, 0, 1, 0],
	["Reinforced Mace", 0, 2, -1, 0, 0],
	["Repeating Crossbow", -40, 8, -1, 1, 0],
	["Rondel", 0, 4, -1, 0, 0],
	["Rune Bow", 0, 7, -1, 1, 0],
	["Rune Scepter", 0, 2, -1, 0, 0],
	["Rune Staff", 20, 6, -1, 0, 1],
	["Rune Sword", -10, 2, -1, 9, 1],
	["Runic Talons", -30, 1, 1, 0, 0],
	["Sabre", -10, 2, -1, 9, 0],
	["Sacred Globe", -10, 2, 6, 0, 0],
	["Scepter", 0, 2, -1, 0, 0],
	["Scimitar", -20, 2, -1, 9, 0],
	["Scissors Katar", -10, 1, 1, 0, 0],
	["Scissors Quhab", 0, 1, 1, 0, 0],
	["Scissors Suwayyah", 0, 1, 1, 0, 0],
	["Scourge", -10, 2, -1, 0, 1],
	["Scythe", -10, 6, -1, 8, 1],
	["Seraph Rod", 10, 2, -1, 0, 0],
	["Shadow Bow", 0, 7, -1, 1, 0],
	["Shamshir", -10, 2, -1, 9, 0],
	["Shillelagh", 0, 6, -1, 0, 1],
	["Short Battle Bow", 0, 7, -1, 1, 0],
	["Short Bow", 5, 7, -1, 1, 0],
	["Short Siege Bow", 0, 7, -1, 1, 0],
	["Short Spear", 10, 4, -1, 2, 0],
	["Short Staff", -10, 6, -1, 0, 0],
	["Short Sword", 0, 2, -1, 9, 0],
	["Short War Bow", 0, 7, -1, 1, 0],
	["Siege Crossbow", 0, 8, -1, 1, 0],
	["Silver-edged Axe", 0, 6, -1, 0, 1],
	["Simbilan", 10, 4, -1, 2, 0],
	["Small Crescent", 10, 2, -1, 0, 1],
	["Smoked Sphere", 0, 2, 6, 0, 0],
	["Sparkling Ball", 0, 2, 6, 0, 0],
	["Spear", -10, 5, -1, 8, 0],
	["Spetum", 0, 5, -1, 8, 1],
	["Spiculum", 20, 4, -1, 2, 0],
	["Spider Bow", 5, 7, -1, 1, 0],
	["Spiked Club", 0, 2, -1, 0, 0],
	["Stag Bow", 0, 7, 0, 1, 0],
	["Stalagmite", 10, 6, -1, 0, 0],
	["Stiletto", -10, 4, -1, 0, 0],
	["Stygian Pike", 0, 5, -1, 8, 1],
	["Stygian Pilum", 0, 4, -1, 2, 0],
	["Suwayyah", 0, 1, 1, 0, 0],
	["Swirling Crystal", 10, 2, 6, 0, 0],
	["Tabar", 10, 6, -1, 0, 1],
	["Thresher", -10, 6, -1, 8, 1],
	["Throwing Axe", 10, 2, -1, 3, 0],
	["Throwing Knife", 0, 4, -1, 3, 0],
	["Throwing Spear", -10, 4, -1, 2, 0],
	["Thunder Maul", 20, 6, -1, 0, 1],
	["Tomahawk", 0, 2, -1, 0, 0],
	["Tomb Wand", -20, 2, -1, 0, 0],
	["Trident", 0, 5, -1, 8, 1],
	["Truncheon", -10, 2, -1, 0, 0],
	["Tulwar", 20, 2, -1, 9, 0],
	["Tusk Sword", 0, 3, -1, 9, 1],
	["Twin Axe", 10, 2, -1, 0, 1],
	["Two-Handed Sword", 0, 3, -1, 9, 0],
	["Tyrant Club", 0, 2, -1, 0, 0],
	["Unearthed Wand", 0, 2, -1, 0, 0],
	["Vortex Orb", 0, 2, 6, 0, 0],
	["Voulge", 0, 6, -1, 8, 1],
	["Walking Stick", -10, 6, -1, 0, 0],
	["Wand", 0, 2, -1, 0, 0],
	["War Axe", 0, 2, -1, 0, 1],
	["War Club", 10, 6, -1, 0, 0],
	["War Dart", -20, 4, -1, 3, 0],
	["War Fist", 10, 1, 1, 0, 0],
	["War Fork", -20, 5, -1, 8, 1],
	["War Hammer", 20, 2, -1, 0, 1],
	["War Javelin", -10, 4, -1, 2, 0],
	["War Pike", 20, 5, -1, 8, 1],
	["War Scepter", -10, 2, -1, 0, 1],
	["War Scythe", -10, 6, -1, 8, 1],
	["War Spear", -10, 5, -1, 8, 0],
	["War Spike", -10, 2, -1, 0, 1],
	["War Staff", 20, 6, -1, 0, 1],
	["War Sword", 0, 2, -1, 9, 0],
	["Ward Bow", 0, 7, -1, 1, 0],
	["Winged Axe", -10, 2, -1, 3, 0],
	["Winged Harpoon", -10, 4, -1, 2, 0],
	["Winged Knife", -20, 4, -1, 3, 0],
	["Wrist Blade", 0, 1, 1, 0, 0],
	["Wrist Spike", -10, 1, 1, 0, 0],
	["Wrist Sword", -10, 1, 1, 0, 0],
	["Yari", 0, 5, -1, 8, 1],
	["Yew Wand", 10, 2, -1, 0, 0],
	["Zweihander", -10, 3, -1, 9, 1]
];
