window.addEventListener("load", loadPage, false);

const EIAS_LIMIT = 175; // for a brief period of D2R, this limit did not exist. rip bugged ias frames :(

function loadPage() {

	const characterSelect = document.getElementById("characterSelect");
	const formSelectContainer = document.getElementById("formSelectContainer");
	const formSelect = document.getElementById("formSelect");
	const optionWerewolf = formSelect.options[2];
	const primaryWeaponSelect = document.getElementById("primaryWeaponSelect");
	const secondaryWeaponContainer = document.getElementById("secondaryWeaponContainer");
	const secondaryWeaponSelect = document.getElementById("secondaryWeaponSelect");
	const isOneHandedContainer = document.getElementById("isOneHandedContainer");
	const isOneHanded = document.getElementById("isOneHanded");
	const skillSelect = document.getElementById("skillSelect");
	const tableContainer = document.getElementById("tableContainer");
	const fanaticismContainer = document.getElementById("fanaticismContainer");
	const fanaticismLevelInput = document.getElementById("fanaticismLevel");
	const burstOfSpeedContainer = document.getElementById("burstOfSpeedContainer");
	const burstOfSpeedLevelInput = document.getElementById("burstOfSpeedLevel");
	const werewolfContainer = document.getElementById("werewolfContainer");
	const werewolfLevelInput = document.getElementById("werewolfLevel");
	const frenzyContainer = document.getElementById("frenzyContainer");
	const frenzyLevelInput = document.getElementById("frenzyLevel");
	const holyFreezeContainer = document.getElementById("holyFreezeContainer");
	const holyFreezeLevelInput = document.getElementById("holyFreezeLevel");
	const decrepify = document.getElementById("decrepify");

	var firstRun = true;
	var character = PALADIN;
	var form = HUMAN;
	var primaryWeapon = WEAPONS.get("None");
	var skill = 0;
	var skillData = SKILLS[skill];
	var secondaryWeapon = WEAPONS.get("None");
	var isDualWielding = false;
	var wsmBugged = false;

	characterSelect.addEventListener("change", characterChanged, false);
	formSelect.addEventListener("change", formChanged, false);
	primaryWeaponSelect.addEventListener("change", primaryWeaponChanged, false);
	secondaryWeaponSelect.addEventListener("change", secondaryWeaponChanged, false);
	isOneHanded.addEventListener("change", isOneHandedChanged, false);
	skillSelect.addEventListener("change", skillChanged, false);
	fanaticismLevelInput.addEventListener("change", fanaticismChanged, false);
	burstOfSpeedLevelInput.addEventListener("change", burstOfSpeedChanged, false);
	werewolfLevelInput.addEventListener("change", werewolfChanged, false);
	frenzyLevelInput.addEventListener("change", frenzyChanged, false);
	holyFreezeLevelInput.addEventListener("change", holyFreezeChanged, false);
	decrepify.addEventListener("change", decrepifyChanged, false);
	noNegativeValues(fanaticismLevelInput);
	noNegativeValues(burstOfSpeedLevelInput);
	noNegativeValues(werewolfLevelInput);
	noNegativeValues(frenzyLevelInput);
	noNegativeValues(holyFreezeLevelInput);

	formChanged();
	characterChanged();

	function characterChanged() {
		character = parseInt(characterSelect.value);
		console.log("New character selected: " + character);

		if (isCharacterSelected()) {

			unhideElement(formSelectContainer);

			if (character == BARBARIAN || character == DRUID) unhideElement(optionWerewolf);
			else {
				hideElement(optionWerewolf);
				if (formSelect.value == WEREWOLF) {
					formSelect.value = HUMAN;
					formChanged();
				}
			}

			if (character == ASSASSIN) {
				unhideElement(burstOfSpeedContainer);
			} else {
				hideElement(burstOfSpeedContainer);
			}

			if (character == BARBARIAN) {
				unhideElement(frenzyContainer);
			} else {
				hideElement(frenzyContainer);
			}

			if (character != BARBARIAN && character != ASSASSIN) {
				hideElement(secondaryWeaponContainer);
				isDualWielding = false;
			}


		} else {
			hideElement(formSelectContainer);
			formSelect.value = HUMAN;
			formChanged();
		}

		setWeapons();
		setSkills();
		displayFrames();
		if (firstRun) firstRun = false;
	}

	function formChanged() {
		form = formSelect.value;
		console.log("New form selected: " + form);
		if (form == WEREWOLF) {
			unhideElement(werewolfContainer);
		} else {
			hideElement(werewolfContainer);
		}
		setSkills();
		if (!firstRun) displayFrames();
	}

	function primaryWeaponChanged() {
		primaryWeapon = WEAPONS.get(primaryWeaponSelect.value);
		let weaponType = primaryWeapon.weaponType;
		console.log("New primaryWeapon selected: " + primaryWeapon.name + " - " + primaryWeapon.WSM);

		if (character == BARBARIAN && weaponType == TWO_HANDED_SWORD && !isDualWielding) {
			unhideElement(isOneHandedContainer);
		} else {
			hideElement(isOneHandedContainer);
		}

		if ((character == ASSASSIN && weaponType == CLAW) || (character == BARBARIAN && (weaponType == ONE_HANDED_SWINGING || weaponType == ONE_HANDED_THRUSTING || weaponType == TWO_HANDED_SWORD))) {
			unhideElement(secondaryWeaponContainer);
		} else {
			hideElement(secondaryWeaponContainer);
			isDualWielding = false;
		}

		if (!firstRun) displayFrames();
	}

	function secondaryWeaponChanged() {
		secondaryWeapon = WEAPONS.get(secondaryWeaponSelect.value);
		console.log("New secondaryWeapon selected: " + secondaryWeapon.name + " - " + secondaryWeapon.WSM);

		if (secondaryWeapon.name != "None") {
			isDualWielding = true;
			hideElement(isOneHandedContainer);
		} else {
			isDualWielding = false;
			if (character == BARBARIAN && secondaryWeapon.weaponType == TWO_HANDED_SWORD) {
				unhideElement(isOneHandedContainer);
			} else {
				hideElement(isOneHandedContainer);
			}
		}

		if (!firstRun) displayFrames();
	}

	function isOneHandedChanged() {
		let isOneHandedBool = isOneHanded.checked;
		console.log("isOneHandedBool: " + isOneHandedBool);
		if (!firstRun) displayFrames();
	}

	function skillChanged() {
		skill = parseInt(skillSelect.value);
		skillData = SKILLS[skill];
		console.log("New skill selected: " + skill + " - " + skillData[0]);

		if (skill == WHIRLWIND) {
			hideElement(fanaticismContainer);
			hideElement(frenzyContainer);
			hideElement(holyFreezeContainer);
		} else {
			unhideElement(fanaticismContainer);
			if (character == BARBARIAN) unhideElement(frenzyContainer);
			unhideElement(holyFreezeContainer);
		}

		if (!firstRun) displayFrames();
	}

	function fanaticismChanged() {
		var fanaticismLevel = fanaticismLevelInput.value;
		console.log("Fanaticism level: " + fanaticismLevel);
		if (!firstRun) displayFrames();
	}

	function burstOfSpeedChanged() {
		var burstOfSpeedLevel = burstOfSpeedLevelInput.value;
		console.log("Burst of Speed level: " + burstOfSpeedLevel);
		if (!firstRun) displayFrames();
	}

	function werewolfChanged() {
		var werewolfLevel = werewolfLevelInput.value;
		console.log("Werewolf level: " + werewolfLevel);
		if (!firstRun) displayFrames();
	}

	function frenzyChanged() {
		var frenzyLevel = frenzyLevelInput.value;
		console.log("Frenzy level: " + frenzyLevel);
		if (!firstRun) displayFrames();
	}

	function holyFreezeChanged() {
		var holyFreezeLevel = holyFreezeLevelInput.value;
		console.log("Holy Freeze level: " + holyFreezeLevel);
		if (!firstRun) displayFrames();
	}

	function decrepifyChanged() {
		let decrepifySelected = decrepify.checked;
		console.log("Decrepify checked: " + decrepifySelected);
		if (!firstRun) displayFrames();
	}

	function setWeapons() {

		if (primaryWeaponSelect.options.length != 291) {
			for (const weaponName of WEAPONS.keys()) {
				primaryWeaponSelect.add(createOption(weaponName, weaponName));
			}
			primaryWeaponChanged();
		}

		if (secondaryWeaponSelect.options.length != 291) {
			for (const weaponName of WEAPONS.keys()) {
				secondaryWeaponSelect.add(createOption(weaponName, weaponName));
			}
			secondaryWeaponChanged();
		}

	}

	function setSkills() {

		let currentSkills = [STANDARD];

		clearSkills();

		if (form == HUMAN) {
			currentSkills.push(THROW);
		}

		switch (parseInt(character)) { // i could add these in with a loop, but might make changes in the future
			case AMAZON:
				if (form == HUMAN) {
					currentSkills.push(STRAFE);
					currentSkills.push(JAB);
					currentSkills.push(IMPALE);
					currentSkills.push(FEND);
				}
				break;
			case ASSASSIN:
				if (form == HUMAN) {
					currentSkills.push(LAYING_TRAPS);
					currentSkills.push(DRAGON_TALON);
					currentSkills.push(PHOENIX_STRIKE);
					currentSkills.push(TIGER_STRIKE);
					currentSkills.push(COBRA_STRIKE);
					currentSkills.push(FISTS_OF_FIRE);
					currentSkills.push(CLAWS_OF_THUNDER);
					currentSkills.push(BLADES_OF_ICE);
					currentSkills.push(DRAGON_CLAW);
					currentSkills.push(DRAGON_TAIL);
				}
				break;
			case BARBARIAN:
				if (form == HUMAN) {
					currentSkills.push(FRENZY);
					currentSkills.push(WHIRLWIND);
					currentSkills.push(DOUBLE_SWING);
					currentSkills.push(DOUBLE_THROW);
					currentSkills.push(CONCENTRATE);
					currentSkills.push(BERSERK);
					currentSkills.push(BASH);
					currentSkills.push(STUN);
				} else if (form == WEREWOLF) {
					currentSkills.push(FERAL_RAGE);
				}
				break;
			case DRUID:
				if (form == WEREWOLF) {
					currentSkills.push(FURY);
					currentSkills.push(RABIES);
					currentSkills.push(FERAL_RAGE);
				} else if (form == WEREBEAR) {
					currentSkills.push(HUNGER);
				}
				break;
			case PALADIN:
				if (form == HUMAN) {
					currentSkills.push(SMITE);
					currentSkills.push(ZEAL);
					currentSkills.push(SACRIFICE);
					currentSkills.push(VENGEANCE);
					currentSkills.push(CONVERSION);
				}
				break;
			case MERC_A2:
				currentSkills.push(JAB);
				break;
			case MERC_A5:
				currentSkills.push(BASH);
				currentSkills.push(STUN);
				break;

		}

		if (form == HUMAN && character != PALADIN && isCharacterSelected() &&
			!(primaryWeapon.weaponType == UNARMED || primaryWeapon.weaponType == BOW || primaryWeapon.weaponType == CROSSBOW || primaryWeapon.weaponType == CLAW)) {
			currentSkills.push(ZEAL);
		}

		currentSkills.forEach(skillId => {
			skillSelect.add(createOption(skillId, SKILLS[skillId][0]));
		});

		if (!currentSkills.includes(skill)) {
			skillChanged();
		} else {
			skillSelect.value = skill;
		}


	}

	function displayFrames() {
		
		removeAllChildNodes(tableContainer);

		if (skill == STANDARD) { // temp solution

			let framesPerDirection = calculateFramesPerDirection(false, primaryWeapon);
			displayTable(framesPerDirection, true);

			if (primaryWeapon.weaponType.hasAlternateAnimation(character)) {
				let alternateFramesPerDirection = calculateFramesPerDirection(true, primaryWeapon);
				displayTable(alternateFramesPerDirection, true);
				if (isDualWielding && primaryWeapon != secondaryWeapon) {
					alternateFramesPerDirection = 12; // seems this is hardcoded for off hand swings of any class
					displayTable(alternateFramesPerDirection, false);
				}
			} else if (isDualWielding) {
				framesPerDirection = 12; // seems this is hardcoded for off hand swings of any class, would like to test this
				displayTable(framesPerDirection, false);
			}

		} else if (skill == FEND) {

			framesPerDirection = ACTIONS_FRAMES[primaryWeapon.weaponType.type][character];
			displayTable(framesPerDirection, true);

		} else {

			console.log("here");
			let framesPerDirection = calculateFramesPerDirection(false, primaryWeapon);
			displayTable(framesPerDirection, true);

		}

	}

	function displayTable(framesPerDirection, isPrimary) {

		console.log("here 3");

		if (skill == FEND || skill == STRAFE || skill == WHIRLWIND) {
			displayBreakpointTableFromHardcode();
			return;
		}
		if (skill == DRAGON_TALON || skill == ZEAL) {
			displayReducedSequenceTable();
			return;
		}
		if (skill == FRENZY) {
			//displayFrenzyTable();
			return;
		}

		let weapon = isPrimary ? primaryWeapon : secondaryWeapon;
		let isSequenceSkill = skill == FRENZY || skill == JAB;
		let startingFrame = calculateStartingFrame(weapon);
		let animationSpeed = calculateAnimationSpeed(weapon.weaponType);

		console.log("--- start ---");
		let WSM = 0;
		if (isDualWielding) {
			if (isPrimary) {
				if (wsmBugged) {
					WSM = (secondaryWeapon.WSM + primaryWeapon.WSM) / 2 - secondaryWeapon.WSM + primaryWeapon.WSM;
				} else {
					WSM = (primaryWeapon.WSM + secondaryWeapon.WSM) / 2;
				}
			} else {
				if (wsmBugged) {
					WSM = (secondaryWeapon.WSM + primaryWeapon.WSM) / 2;
				} else {
					WSM = (primaryWeapon.WSM + secondaryWeapon.WSM) / 2 - primaryWeapon.WSM + secondaryWeapon.WSM;
				}
			}
		} else {
			WSM = (isPrimary ? primaryWeapon : secondaryWeapon).WSM;
		}
		let breakpoints = calculateBreakpointTable(framesPerDirection, startingFrame, WSM, animationSpeed, isSequenceSkill);
		displayBreakpointTable(breakpoints);

		console.log("--- end ---");
	}

	function displayBreakpointTable(breakpoints) {
		let table = document.createElement("table");
		table.className = "table";
		tableContainer.appendChild(table);

		for (const [gearIAS, FPA] of breakpoints) {
			addTableRow(table, gearIAS, FPA);
		}
	}

	/*function displayFendTable() {
		console.log("--- start fend ---");
		let animationSpeed = 256;
		let startingFrame = calculateStartingFrame(primaryWeapon);
		let SIAS = calculateSIAS();
		let WSM = primaryWeapon.WSM;
		let framesPerDirection = ACTIONS_FRAMES[primaryWeapon.weaponType.type][character];
		console.log("startingFrame=" + startingFrame + ",SIAS=" + SIAS + ",WSM=" + WSM + ",framesPerDirection=" + framesPerDirection);

		let bounds = calculateMinimumAndMaximumFrameLength(framesPerDirection, startingFrame, primaryWeapon.WSM, primaryWeapon.weaponType, true);
		let min = bounds[0];
		let max = bounds[1];

		let table = document.createElement("table");
		table.className = "table";
		tableContainer.appendChild(table);

		let breakpoints = new Map();

		for (FPA = max; FPA >= min; FPA--) {

			let acceleration = 110;//Math.max(15, Math.min(EIAS_LIMIT, Math.ceil(Math.ceil(256 * (framesPerDirection - startingFrame) / (FPA + 1)) * 100 / animationSpeed)));
			let gearIAS = Math.max(0, Math.ceil(120 * (acceleration - 100 - SIAS + WSM) / (120 - (acceleration - 100 - SIAS + WSM))));
			let rollbackStartingFrame = Math.floor(Math.floor((256 * startingFrame + Math.floor(256 * acceleration / 100) * FPA) / 256) * 40 / 100);
			console.log("FPA=" + FPA + ",acceleration=" + acceleration + ",rollbackStartingFrame=" + rollbackStartingFrame);
			let min2 = Math.ceil((256 * (framesPerDirection - rollbackStartingFrame)) / (Math.max(15, Math.min(SIAS - WSM + 220, EIAS_LIMIT))) * (100 / animationSpeed).toFixed(5)) - 1;
			let max2 = Math.ceil((256 * (framesPerDirection - rollbackStartingFrame)) / (Math.max(15, Math.min(SIAS - WSM + 100, EIAS_LIMIT))) * (100 / animationSpeed).toFixed(5));

			let breakpoints2 = new Map();

			for (FPA2 = max2; FPA2 >= min2; FPA2--) {
				let acceleration2 = Math.max(15, Math.min(EIAS_LIMIT, Math.ceil(Math.ceil(256 * (framesPerDirection - rollbackStartingFrame) / (FPA2 + 1)) * 100 / animationSpeed)));
				let gearIAS2 = Math.max(0, Math.ceil(120 * (acceleration2 - 100 - SIAS + WSM) / (120 - (acceleration2 - 100 - SIAS + WSM))));

				let actualFPA2 = FPA2 + 1;
				breakpoints2.set(gearIAS2, actualFPA2);
			}

			for (const [gearIAS0, FPA0] of breakpoints2) {
				//addTableRow(table, gearIAS, FPA);
				console.log(gearIAS0 + "  |  " + FPA0);
			}

			let actualFPA = FPA + 1;
			breakpoints.set(gearIAS, actualFPA);

		}

		for (const [gearIAS, FPA] of breakpoints) {
			addTableRow(table, gearIAS, FPA);
		}

		//for (const [gearIAS, FPA] of breakpoints) {
		//	let rollbackStartingFrame = Math.floor(Math.floor((256 * startingFrame + Math.floor(256 * acceleration / 100) * FPA) / 256) * 40 / 100);
		//}

		console.log("--- end fend ---");
	}*/

	function calculateBreakpointTable(framesPerDirection, startingFrame, WSM, animationSpeed, isSequenceSkill) {

		let SIAS = calculateSIAS();

		console.log("framesPerDirection: " + framesPerDirection);
		console.log("animationSpeed: " + animationSpeed);
		console.log("startingFrame: " + startingFrame);
		console.log("SIAS: " + SIAS);
		console.log("WSM: " + WSM);

		// credit to BinaryAzeotrope for helping come up with these formulas
		let unroundedMin = (256 * (framesPerDirection - startingFrame)) / (Math.max(15, Math.min(SIAS - WSM + 220, EIAS_LIMIT))) * (100 / animationSpeed);
		//console.log("unroundedMin: " + unroundedMin);
		let min = Math.ceil(unroundedMin.toFixed(5)) - 1;
		let unroundedMax = (256 * (framesPerDirection - startingFrame)) / (Math.max(15, Math.min(SIAS - WSM + 100, EIAS_LIMIT))) * (100 / animationSpeed);
		//console.log("unroundedMax: " + unroundedMax);
		if (parseInt(unroundedMax) == parseFloat(unroundedMax)) {
			unroundedMax++;
			console.log("increased unroundedMax by 1");
		}
		let max = Math.ceil(unroundedMax.toFixed(5))/* - 1*/; // temp fix, duplicate starting frames handled by unique gearIAS filtering below

		console.log("min=" + min + ",max=" + max);

		let breakpoints = new Map();

		for (FPA = max; FPA >= min; FPA--) {

			let acceleration = Math.max(15, Math.min(EIAS_LIMIT, Math.ceil(Math.ceil(256 * (framesPerDirection - startingFrame) / (FPA + 1)) * 100 / animationSpeed)));
			console.log("acceleration=" + acceleration + " at FPA=" + FPA);
			let gearIAS = Math.max(0, Math.ceil(120 * (acceleration - 100 - SIAS + WSM) / (120 - (acceleration - 100 - SIAS + WSM))));

			let actualFPA = FPA;
			if (isSequenceSkill) {
				actualFPA++;
			}

			breakpoints.set(gearIAS, actualFPA);
		}

		return breakpoints;
	}

	function displayBreakpointTableFromHardcode() {

		let WSM = primaryWeapon.WSM;
		let SIAS = calculateSIAS();
		let EIAS = Math.max(15, 100 + SIAS - WSM);
		let breakpointTable;

		if (skill == FEND) {
			if (primaryWeapon.weaponType == SPEAR) {
				breakpointTable = FEND_SPEAR_TABLE;
			} else if (primaryWeapon.weaponType == ONE_HANDED_THRUSTING) {
				breakpointTable = FEND_ONE_HANDED_THRUSTING_TABLE;
			}
		} else if (skill == STRAFE) {
			if (primaryWeapon.weaponType == BOW) {
				breakpointTable = STRAFE_BOW_TABLE;
			} else if (primaryWeapon.weaponType == CROSSBOW) {
				breakpointTable = STRAFE_EVEN_CROSSBOW_TABLE;
			}
		} else if (skill == WHIRLWIND) {
			SIAS = 0;

			if (isDualWielding) {
				if (wsmBugged) {
					WSM = (secondaryWeapon.WSM + primaryWeapon.WSM) / 2 - secondaryWeapon.WSM + primaryWeapon.WSM;
				} else {
					WSM = (primaryWeapon.WSM + secondaryWeapon.WSM) / 2;
				}
			}

			EIAS = Math.max(15, 100 + SIAS - WSM);

			if (character == ASSASSIN && primaryWeapon.weaponType == CLAW) {
				breakpointTable = WHIRLWIND_CLAW_TABLE;
			} else if (character == BARBARIAN) {
				if (primaryWeapon.weaponType == UNARMED || primaryWeapon.weaponType == ONE_HANDED_SWINGING ||
					primaryWeapon.weaponType == ONE_HANDED_THRUSTING || primaryWeapon.weaponType == TWO_HANDED_SWORD) {
					breakpointTable = WHIRLWIND_ONE_HANDED_TABLE;
				} else {
					breakpointTable = WHIRLWIND_TWO_HANDED_TABLE;
				}
			}
		}

		let table = breakpointTable.getTableAfter(EIAS);
		let tableIAS = (skill == WHIRLWIND ? table.getAdjustedTable(WSM) : table.convertToIASTable(EIAS));
		let breakpoints = new Map();
		//console.log("calculateBreakpointTableFromHardcode (WSM=" + WSM + "):");
		for (let index in tableIAS) {
			let breakpoint = tableIAS[index];
		//	console.log(breakpoint[0] + ", " + breakpoint[1]);
			breakpoints.set(breakpoint[0], breakpoint[1]);
		}
		displayBreakpointTable(breakpoints);

		if (skill == STRAFE && primaryWeapon.weaponType == CROSSBOW) {

			breakpointTable = STRAFE_ODD_CROSSBOW_TABLE;
			table = breakpointTable.getTableAfter(EIAS);
			tableIAS = table.convertToIASTable(EIAS);
			breakpoints = new Map();
			//console.log("calculateBreakpointTableFromHardcode (WSM=" + WSM + "):");
			for (let index in tableIAS) {
				let breakpoint = tableIAS[index];
			//	console.log(breakpoint[0] + ", " + breakpoint[1]);
				breakpoints.set(breakpoint[0], breakpoint[1]);
			}

			displayBreakpointTable(breakpoints);

		} else if (skill == WHIRLWIND && isDualWielding && primaryWeapon != secondaryWeapon) {

			if (wsmBugged) {
				WSM = (secondaryWeapon.WSM + primaryWeapon.WSM) / 2;
			} else {
				WSM = (primaryWeapon.WSM + secondaryWeapon.WSM) / 2 - primaryWeapon.WSM + secondaryWeapon.WSM;
			}
			EIAS = Math.max(15, 100 + SIAS - WSM);

			table = breakpointTable.getTableAfter(EIAS);
			tableIAS = table.getAdjustedTable(WSM);
			breakpoints = new Map();
			//console.log("calculateBreakpointTableFromHardcode (WSM=" + WSM + "):");
			for (let index in tableIAS) {
				let breakpoint = tableIAS[index];
			//	console.log(breakpoint[0] + ", " + breakpoint[1]);
				breakpoints.set(breakpoint[0], breakpoint[1]);
			}

			displayBreakpointTable(breakpoints);

		}

	}

	/*function calculateFrenzySecondHitBreakpointTable(secondaryWSM, firstSwingFPA, primaryWSM) {

		let framesPerDirection = 17;
		let startingFrame = 0;
		let animationSpeed = 256;
		let SIAS = calculateSIAS();

		// credit to BinaryAzeotrope for helping come up with these formulas
		let unroundedMin = (256 * (framesPerDirection - startingFrame) - (firstSwingFPA * Math.max(15, Math.min(SIAS - primaryWSM + 220, EIAS_LIMIT)))) / (Math.max(15, Math.min(SIAS - secondaryWSM + 220, EIAS_LIMIT))) * (100 / animationSpeed);
		//console.log("unroundedMin: " + unroundedMin);
		let min = Math.ceil(unroundedMin.toFixed(5)) - 1;
		let unroundedMax = (256 * (framesPerDirection - startingFrame) - (firstSwingFPA * Math.max(15, Math.min(SIAS - primaryWSM + 220, EIAS_LIMIT)))) / (Math.max(15, Math.min(SIAS - secondaryWSM + 100, EIAS_LIMIT))) * (100 / animationSpeed);
		//console.log("unroundedMax: " + unroundedMax);
		if (parseInt(unroundedMax) == parseFloat(unroundedMax)) {
			unroundedMax++;
			console.log("increased unroundedMax by 1");
		}
		let max = Math.ceil(unroundedMax.toFixed(5))// - 1; // temp fix, duplicate starting frames handled by unique gearIAS filtering below

		console.log("min=" + min + ",max=" + max);

		let breakpoints = new Map();

		for (FPA = max; FPA >= min; FPA--) {

			let acceleration = Math.max(15, Math.min(EIAS_LIMIT, Math.ceil(Math.ceil(256 * (framesPerDirection - startingFrame) / (FPA + 1)) * 100 / animationSpeed)));
			//console.log("acceleration=" + acceleration + " at FPA=" + FPA);
			let gearIAS = Math.max(0, Math.ceil(120 * (acceleration - 100 - SIAS + WSM) / (120 - (acceleration - 100 - SIAS + WSM))));

			let actualFPA = FPA + 1;

			breakpoints.set(gearIAS, actualFPA);
		}

		return breakpoints;
	}*/

	function displayReducedSequenceTable() {
		console.log("--- start reduced sequence ---");

		let framesPerDirection = (skill == DRAGON_TALON ? 4 : ACTIONS_FRAMES[primaryWeapon.weaponType.type][character]);
		let animationSpeed = calculateAnimationSpeed(primaryWeapon.weaponType);
		let startingFrame = 0; // starting frames only apply to sorcs and zons using normal attack, strafe, or fend

		if (character == BARBARIAN && primaryWeapon.weaponType == TWO_HANDED_SWORD && isOneHanded) framesPerDirection = 7;
		console.log("framesPerDirection=" + framesPerDirection + ",startingFrame=" + startingFrame);

		let sequenceBreakpoints = calculateBreakpointTable(framesPerDirection, startingFrame, primaryWeapon.WSM, animationSpeed, true);

		framesPerDirection = (skill == DRAGON_TALON ? 13 : primaryWeapon.weaponType.getFramesPerDirection(character));
		if (character == BARBARIAN && primaryWeapon.weaponType == TWO_HANDED_SWORD && isOneHanded) framesPerDirection = 16;

		let finishingBreakpoints = calculateBreakpointTable(framesPerDirection, startingFrame, primaryWeapon.WSM, animationSpeed, false);

		console.log("-- starting final --");
		let breakpoints = mergeSequenceTables(sequenceBreakpoints, finishingBreakpoints);
		displayBreakpointTable(breakpoints);
		
	}

	/**
	 * credits to chthonvii for putting all the information about frenzy together in their calc: https://chthonvii.github.io/resurrectedfrenzyiascalc/
	 * this here is essentially a copy paste ("paraphrased") to work here
	 */
	/*function displayFrenzyTable() {

		let framesPerDirection = 9; // not sure why, the only link i can see as to why this is is two-handed sword framesPerDirection for barbarian is 18, half of this. no other correlation noted
		let startingFrame = 0; // starting frames only apply to sorcs and zons using normal attack, strafe, or fend
		let animationSpeed = 256; // only using claws and laying traps have different animationSpeed, rest are 256

		let averageWSM = (primaryWeapon.WSM + secondaryWeapon.WSM) / 2;
		// chthonvii mentions that there was a difference for the average wsm based on if it was wsm bugged or not
		// also mentions that raising it to the ceiling might be the point of matter for a negative value, and is unsure if the same would be true for a positive number
		// their suspicion is likely right, truncating doesnt necessarily floor or ceiling, so negative numbers would ceiling and positive numbers would floor
		// ill implement it chthonvii's way as is and then do my own testing afterwards
		if (wsmBugged) {
			averageWSM = Math.ceil(averageWSM);
		} else {
			averageWSM = Math.floor(averageWSM);
		}

		// strange interaction of WSM, must be specific to frenzy
		var primaryWSM = primaryWeapon.WSM + secondaryWeapon.WSM - averageWSM;
		var secondaryWSM = secondaryWeapon.WSM * 2 - averageWSM;
		if (wsmBugged) {
			primaryWSM = primaryWeapon.WSM - secondaryWeapon.WSM + averageWSM;
			secondaryWSM = averageWSM;
		}

		let primaryWeaponBreakpointTable = calculateBreakpointTable(framesPerDirection, startingFrame, primaryWSM, animationSpeed, false);

		framesPerDirection = 17; // 17 is the sequence frame for frenzy for 1HS, 1HT, and 2HS weapons, the only weapons a barbarian can frenzy with

		let secondaryWeaponBreakpointTable = calculateFrenzySecondHitBreakpointTable(secondaryWSM, ??, primaryWSM); // the last hit in a sequence skill is not a sequence swing

		displayBreakpointTable(primaryWeaponBreakpointTable);
		displayBreakpointTable(secondaryWeaponBreakpointTable);

	}*/

	function mergeSequenceTables(...tables) {
		let uniqueKeys = new Set();
		tables.forEach(table => {
			for (const value of table.values()) {
				uniqueKeys.add(value);
			}
		});

		let mergedTable = new Map();
		let sequences = tables.length;
		let iterations = uniqueKeys.size - 1;
		let lastSequenceLength = new Array(sequences);
		let sequenceString = "";

		console.log("sequences=" + sequences + ",iterations=" + iterations);

		for (let o = 0; o < sequences; o++) {
			let first = [...tables[o]][0];
			lastSequenceLength[o] = first[1];
			tables[o].delete(first[0]);
			sequenceString += first[1];
			if (o != sequences - 1) {
				sequenceString += "/";
			}
		}
		mergedTable.set(0, sequenceString);

		for (let i = 0; i < iterations; i++) {
			console.log("-- start iteration " + i + " --")
			let nextTableIndex = 0;
			let smallestIAS = 999;
			let connectedFrame = 0;
			for (let o = 0; o < sequences; o++) {
				if (tables[o].length == 0) continue;
				let [firstKey] = tables[o].keys();
				let [firstValue] = tables[o].values();
				if (firstKey < smallestIAS) {
					console.log("firstKey=" + firstKey + " was smaller than smallestIAS=" + smallestIAS);
					smallestIAS = firstKey;
					connectedFrame = firstValue;
					nextTableIndex = o;
				}
			}
			if (smallestIAS == 999) continue;
			console.log("smallestIAS=" + smallestIAS + ",connectedFrame=" + connectedFrame);
			tables[nextTableIndex].delete(smallestIAS);
			lastSequenceLength[nextTableIndex] = connectedFrame;


			sequenceString = "";
			for (let o = 0; o < sequences; o++) {
				let frame = lastSequenceLength[o];
				sequenceString += frame;
				if (o != sequences - 1) {
					sequenceString += "/";
				}
			}
			mergedTable.set(smallestIAS, sequenceString);

		}

		return mergedTable;
	}

	function addTableRow(table, IAS, frame) {
		let tableRow = document.createElement("tr");
		let tdIAS = document.createElement("td");
		tdIAS.className = "tableEntry";
		tdIAS.innerHTML = IAS;
		let tdFrame = document.createElement("td");
		tdFrame.className = "tableEntry";
		tdFrame.innerHTML = frame;
		tableRow.appendChild(tdIAS);
		tableRow.appendChild(tdFrame);
		table.appendChild(tableRow);
	}

	function createOption(value, text) {
		let option = document.createElement("option");
		option.setAttribute("value", value);
		option.text = text;
		return option;
	}

	function clearWeapons() {
		let options = primaryWeaponSelect.options;
		let i, L = options.length - 1;
		for (i = L; i >= 0; i--) {
			primaryWeaponSelect.remove(i);
		}
	}

	function clearSkills() {
		let options = skillSelect.options;
		let i, L = options.length - 1;
		for (i = L; i >= 0; i--) {
			skillSelect.remove(i);
		}
	}

	function isMercenarySelected() {
		return character == MERC_A1 || character == MERC_A2 || character == MERC_A5; // readability
	}

	function isCharacterSelected() {
		return !isMercenarySelected();
	}

	function calculateFramesPerDirection(alternate, weapon) {

		let weaponType = weapon.weaponType;
		if (character == BARBARIAN && weaponType == TWO_HANDED_SWORD && (isOneHanded.checked || isDualWielding)) weaponType = ONE_HANDED_SWINGING;

		let framesPerDirection = (alternate ? weaponType.getAlternateFramesPerDirection(character) : weaponType.getFramesPerDirection(character));

		if (skill == THROW) { // throw
			framesPerDirection = THROWING.getFramesPerDirection(character);
		} else if (skill == DRAGON_TAIL) {
			framesPerDirection = 13;
		} else if (skill == SMITE) {
			framesPerDirection = 12;
		} else if (skill == LAYING_TRAPS) {
			framesPerDirection = 8;
		} else if (skill == IMPALE || skill == JAB || skill == FISTS_OF_FIRE ||
			skill == CLAWS_OF_THUNDER || skill == BLADES_OF_ICE || skill == DRAGON_CLAW ||
			skill == DOUBLE_SWING || skill == FRENZY || skill == DOUBLE_THROW) {
			if ((skill == FISTS_OF_FIRE || skill == CLAWS_OF_THUNDER || skill == BLADES_OF_ICE || skill == DRAGON_CLAW) && isDualWielding) {
				framesPerDirection = 16;
			} else if (character == MERC_A2) {
				framesPerDirection = 14;
			} else {
				framesPerDirection = SEQUENCES[skillData[3]][weaponType.type];
			}
		} else if (skill == WHIRLWIND) {

		}

		return framesPerDirection;
	}

	function calculateAnimationSpeed(weaponType) {
		let animationSpeed = 256;
		if (skill == LAYING_TRAPS) {
			animationSpeed = 128;
		} else if (weaponType == CLAW && !(skill == FISTS_OF_FIRE || skill == CLAWS_OF_THUNDER ||
			skill == BLADES_OF_ICE || skill == DRAGON_CLAW || skill == DRAGON_TAIL || skill == DRAGON_TALON)) {
			animationSpeed = 208;
		}
		return animationSpeed;
	}

	function calculateStartingFrame(weapon) {
		let startingFrame = 0;
		if ((character == AMAZON || character == SORCERESS) && (skill == STANDARD || skill == STRAFE || skill == FEND)) {
			startingFrame = weapon.weaponType.startingFrame;
		}
		console.log("calculateStartingFrame: " + startingFrame);
		return startingFrame;
	}

	function calculateSIAS() {

		let SIAS = calculateFanaticismSIAS() + calculateBurstOfSpeedSIAS() + calculateWerewolfSIAS() + calculateFrenzySIAS() + calculateHolyFreezeSIAS();

		if (decrepify.checked) SIAS -= 50;

		if (skill == DOUBLE_SWING) {
			SIAS += 20;
		} else if (skill == DRAGON_TAIL) {
			SIAS -= 40;
		} else if ((skill == IMPALE || skill == JAB || skill == FISTS_OF_FIRE ||
			skill == CLAWS_OF_THUNDER || skill == BLADES_OF_ICE || skill == DRAGON_CLAW ||
			skill == FRENZY || skill == DOUBLE_THROW) && isCharacterSelected()) {
			SIAS -= 30;
		}

		return SIAS;
	}

	function calculateFanaticismSIAS() {
		var fanaticismLevel = fanaticismLevelInput.value;
		if (fanaticismLevel == 0) return 0;
		fanaticismLevel = parseInt(fanaticismLevel);
		var fanaticismSIAS = Math.min(10 + Math.floor(30 * Math.floor((110 * fanaticismLevel) / (fanaticismLevel + 6)) / 100), 40);
		console.log("fanaticismSIAS: " + fanaticismSIAS);
		return fanaticismSIAS;
	}

	function calculateBurstOfSpeedSIAS() {
		var burstOfSpeedLevel = burstOfSpeedLevelInput.value;
		if (character != ASSASSIN || burstOfSpeedLevel == 0) return 0;
		burstOfSpeedLevel = parseInt(burstOfSpeedLevel);
		var burstOfSpeedSIAS = Math.min(15 + Math.floor(45 * Math.floor((110 * burstOfSpeedLevel) / (burstOfSpeedLevel + 6)) / 100), 60);
		console.log("burstOfSpeedSIAS: " + burstOfSpeedSIAS);
		return burstOfSpeedSIAS;
	}

	function calculateWerewolfSIAS() {
		var werewolfLevel = werewolfLevelInput.value;
		if (form != WEREWOLF || werewolfLevel == 0) return 0;
		werewolfLevel = parseInt(werewolfLevel);
		var werewolfSIAS = Math.min(10 + Math.floor(70 * Math.floor((110 * werewolfLevel) / (werewolfLevel + 6)) / 100), 80);
		console.log("werewolfSIAS: " + werewolfSIAS);
		return werewolfSIAS;
	}

	function calculateFrenzySIAS() {
		var frenzyLevel = frenzyLevelInput.value;
		if (character != BARBARIAN || frenzyLevel == 0) return 0;
		frenzyLevel = parseInt(frenzyLevel);
		var frenzySIAS = Math.min(Math.floor(50 * Math.floor((110 * frenzyLevel) / (frenzyLevel + 6)) / 100), 50);
		console.log("frenzySIAS: " + frenzySIAS);
		return frenzySIAS;
	}


	function calculateHolyFreezeSIAS() {
		let holyFreezeLevel = holyFreezeLevelInput.value;
		if (holyFreezeLevel == 0) return 0;
		holyFreezeLevel = parseInt(holyFreezeLevel);
		let holyFreezeSIAS = -Math.min(25 + Math.floor(35 * Math.floor((110 * holyFreezeLevel) / (holyFreezeLevel + 6)) / 100), 60);
		console.log("holyFreezeSIAS: " + holyFreezeSIAS);
		return holyFreezeSIAS;
	}

}

function hideElement(element) {
	element.style.display = "none";
}

function unhideElement(element) {
	element.style.display = "initial";
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function noNegativeValues(input) {
	input.onkeydown = function(e) { // only allows the input of numbers, no negative signs
		if(!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8)) {
        	return false;
    	}
	}
}

class BreakpointTable {

	constructor(breakpoints) {
		this.breakpoints = breakpoints;
	}

	addBreakpoint(EIAS, FPA) {
		this.breakpoints.push([EIAS, FPA]);
	}

	getFPA(EIAS) {
		for (let i = 0; i < this.breakpoints.length; i++) {
			let breakpoint = this.breakpoints[i];
			if (EIAS < breakpoint[0]) {
				return (i == 0 ? this.breakpoint[1] : this.breakpoints[i - 1][1]);
			}
		}
		console.log("error, somehow exited getFPA loop");
	}

	getTableAfter(EIAS) {
		console.log("getTableAfter: EIAS=" + EIAS);
		let filterEIAS = -1;
		for (let i = 0; i < this.breakpoints.length; i++) {
			let breakpoint = this.breakpoints[i];
			if (EIAS < breakpoint[0]) {
				filterEIAS = (i == 0 ? breakpoint[0] : this.breakpoints[i - 1][0]);
				break;
			}
		}
		if (filterEIAS == -1) {
			return new BreakpointTable([[0, this.breakpoints[this.breakpoints.length - 1][1]]]);
		}
		let filteredBreakpoints = this.breakpoints.filter(a => a[0] >= filterEIAS);
		//console.log("getTableAfter (EIAS=" + EIAS + "):");
		for (let b1 in filteredBreakpoints) {
			let b = filteredBreakpoints[b1];
			console.log(b[0] + ", " + b[1]);
		}
		return new BreakpointTable(filteredBreakpoints);
	}

	getAdjustedTable(WSM) {
		let adjustedBreakpoints = new Array(this.breakpoints.length);
		console.log("getAdjustedTable (length=" + this.breakpoints.length + "):");
		for (let i = 0; i < this.breakpoints.length; i++) {
			let breakpoint = this.breakpoints[i];
			let EIAS = breakpoint[0] - 100 + WSM;
			let frames = breakpoint[1];

			if (EIAS < 0) {
				if (i == 0) EIAS = 0; // first breakpoint might be slightly negative
			}

			console.log("EIAS=" + EIAS + ",frames=" + frames);
			adjustedBreakpoints.push([EIAS, frames]);
		}
		return adjustedBreakpoints;
	}

	convertToIASTable(EIAS) {
		if (EIAS < 0) {
			console.log("-- error -- EIAS was < 0: " + EIAS);
		}
		let breakpointsIAS = new Array(this.breakpoints.length);
		console.log("convertToIASTable (length=" + this.breakpoints.length + "):");
		for (let i = 0; i < this.breakpoints.length; i++) {
			let breakpoint = this.breakpoints[i];
			let targetEIAS = breakpoint[0];
			let frames = breakpoint[1];
			let IAS = Math.ceil(120 * (targetEIAS - EIAS) / (120 - (targetEIAS - EIAS)));

			if (IAS < 0) {
				if (i == 0) IAS = 0; // first breakpoint might be slightly negative
				else break; // the upper breakpoints at really low EIAS values roll over into negative gear ias, skip those as theyre not possible to obtain
			}

			console.log("targetEIAS=" + targetEIAS + ",frames=" + frames + ",IAS=" + IAS);
			breakpointsIAS.push([IAS, frames]);
		}
		return breakpointsIAS;
	}

}

const WHIRLWIND_CLAW_TABLE = new BreakpointTable([
	[90, 8],
	[91, 6],
	[113, 4]
]);

const WHIRLWIND_ONE_HANDED_TABLE = new BreakpointTable([
	[15, 16],
	[62, 14],
	[70, 12],
	[81, 10],
	[90, 8],
	[108, 6],
	[134, 4]
]);

const WHIRLWIND_TWO_HANDED_TABLE = new BreakpointTable([
	[80, 14],
	[83, 12],
	[96, 10],
	[106, 8],
	[127, 6],
	[159, 4]
]);

const FEND_SPEAR_TABLE = new BreakpointTable([
	[15, "61/(48)/94"],
	[16, "58/(45)/89"],
	[17, "54/(42)/83"],
	[18, "51/(39)/77"],
	[19, "48/(38)/74"],
	[20, "46/(36)/70"],
	[21, "44/(34)/67"],
	[22, "42/(32)/63"],
	[23, "40/(31)/61"],
	[24, "38/(30)/58"],
	[25, "36/(28)/55"],
	[26, "35/(28)/54"],
	[27, "34/(26)/51"],
	[28, "33/(26)/50"],
	[29, "32/(25)/48"],
	[30, "31/(24)/47"],
	[31, "30/(23)/45"],
	[32, "29/(23)/44"],
	[33, "28/(22)/42"],
	[34, "27/(21)/41"],
	[35, "26/(21)/40"],
	[36, "26/(20)/38"],
	[37, "25/(20)/38"],
	[38, "24/(19)/36"],
	[40, "23/(18)/35"],
	[41, "23/(18)/34"],
	[42, "22/(17)/33"],
	[43, "21/(17)/32"],
	[44, "21/(16)/31"],
	[46, "20/(16)/30"],
	[47, "20/(15)/29"],
	[48, "19/(15)/29"],
	[49, "19/(15)/28"],
	[50, "18/(14)/27"],
	[52, "18/(14)/26"],
	[54, "17/(13)/25"],
	[57, "16/(13)/24"],
	[59, "16/(12)/23"],
	[61, "15/(12)/22"],
	[64, "15/(11)/21"],
	[65, "14/(11)/21"],
	[67, "14/(11)/20"],
	[70, "13/(11)/20"],
	[71, "13/(10)/19"],
	[74, "13/(10)/18"],
	[75, "12/(10)/18"],
	[79, "12/(9)/17"],
	[83, "11/(9)/16"],
	[88, "11/(8)/15"],
	[91, "10/(8)/15"],
	[94, "10/(8)/14"],
	[100, "9/(7)/13"],
	[108, "9/(7)/12"],
	[113, "8/(7)/12"],
	[117, "8/(6)/11"],
	[128, "8/(6)/10"],
	[129, "7/(6)/10"],
	[141, "7/(5)/9"],
	[150, "6/(5)/9"],
	[156, "6/(5)/8"],
	[175, "6/(4)/7"]
]);

const FEND_ONE_HANDED_THRUSTING_TABLE = new BreakpointTable([
	[15, "48/(41)/80"],
	[16, "45/(39)/76"],
	[17, "42/(36)/71"],
	[18, "39/(34)/66"],
	[19, "38/(32)/63"],
	[20, "36/(31)/60"],
	[21, "34/(29)/57"],
	[22, "32/(28)/54"],
	[23, "31/(27)/52"],
	[24, "30/(26)/50"],
	[25, "28/(24)/47"],
	[26, "28/(24)/46"],
	[27, "26/(23)/44"],
	[28, "26/(22)/43"],
	[29, "25/(21)/41"],
	[30, "24/(21)/40"],
	[31, "23/(20)/38"],
	[32, "23/(19)/37"],
	[33, "22/(19)/36"],
	[34, "21/(18)/35"],
	[35, "21/(18)/34"],
	[36, "20/(17)/33"],
	[37, "20/(17)/32"],
	[38, "19/(16)/31"],
	[40, "18/(16)/30"],
	[41, "18/(15)/29"],
	[42, "17/(15)/28"],
	[43, "17/(14)/27"],
	[44, "16/(14)/27"],
	[45, "16/(14)/26"],
	[47, "15/(13)/25"],
	[49, "15/(13)/24"],
	[50, "14/(12)/23"],
	[53, "14/(12)/22"],
	[54, "13/(12)/22"],
	[55, "13/(11)/21"],
	[58, "13/(11)/20"],
	[59, "12/(11)/20"],
	[61, "12/(10)/19"],
	[64, "11/(10)/18"],
	[67, "11/(9)/17"],
	[71, "10/(9)/16"],
	[75, "10/(8)/15"],
	[79, "9/(8)/15"],
	[81, "9/(8)/14"],
	[86, "9/(7)/13"],
	[88, "8/(7)/13"],
	[93, "8/(7)/12"],
	[100, "7/(6)/11"],
	[110, "7/(6)/10"],
	[115, "7/(5)/10"],
	[117, "6/(6)/9"],
	[121, "6/(5)/9"],
	[134, "6/(4)/8"],
	[141, "5/(5)/7"],
	[150, "5/(4)/7"],
	[161, "5/(4)/6"],
	[172, "5/(3)/6"]
]);

const STRAFE_ODD_CROSSBOW_TABLE = new BreakpointTable([
	[15, "61/(34)/107"],
	[16, "58/(32)/102"],
	[17, "54/(30)/95"],
	[18, "51/(28)/89"],
	[19, "48/(27)/85"],
	[20, "46/(26)/80"],
	[21, "44/(25)/77"],
	[22, "42/(23)/73"],
	[23, "40/(23)/70"],
	[24, "38/(21)/67"],
	[25, "36/(20)/63"],
	[26, "35/(20)/62"],
	[27, "34/(19)/59"],
	[28, "33/(19)/57"],
	[29, "32/(18)/55"],
	[30, "31/(17)/53"],
	[31, "30/(17)/51"],
	[32, "29/(16)/50"],
	[33, "28/(16)/48"],
	[34, "27/(15)/47"],
	[35, "26/(15)/46"],
	[36, "26/(14)/44"],
	[37, "25/(14)/43"],
	[38, "24/(14)/42"],
	[39, "24/(13)/41"],
	[40, "23/(13)/40"],
	[41, "23/(13)/39"],
	[42, "22/(12)/38"],
	[43, "21/(12)/37"],
	[44, "21/(12)/36"],
	[45, "21/(12)/35"],
	[46, "20/(11)/35"],
	[47, "20/(11)/34"],
	[48, "19/(11)/33"],
	[49, "19/(11)/32"],
	[50, "18/(10)/31"],
	[52, "18/(10)/30"],
	[54, "17/(10)/29"],
	[56, "17/(9)/28"],
	[57, "16/(9)/28"],
	[58, "16/(9)/27"],
	[60, "16/(9)/26"],
	[61, "15/(9)/26"],
	[62, "15/(9)/25"],
	[63, "15/(8)/25"],
	[65, "14/(8)/24"],
	[67, "14/(8)/23"],
	[70, "13/(8)/22"],
	[72, "13/(7)/22"],
	[74, "13/(7)/21"],
	[75, "12/(7)/21"],
	[77, "12/(7)/20"],
	[81, "12/(7)/19"],
	[83, "11/(7)/19"],
	[84, "11/(6)/19"],
	[85, "11/(6)/18"],
	[90, "11/(6)/17"],
	[91, "10/(6)/17"],
	[95, "10/(6)/16"],
	[100, "9/(5)/15"],
	[108, "9/(5)/14"],
	[112, "9/4/(5)/14"],
	[113, "8/(5)/14"],
	[115, "8/(5)/13"],
	[121, "8/5/(4/5)/12"],
	[125, "8/(4)/11"],
	[129, "7/(4)/12"],
	[134, "7/(4)/11"],
	[143, "7/3/(4)/11"],
	[146, "7/3/(4)/10"],
	[150, "6/4/(3/4)/9"],
	[167, "6/(3)/8"]
]);

const STRAFE_EVEN_CROSSBOW_TABLE = new BreakpointTable([
	[15, "61/(34)/107"],
	[16, "58/(32)/102"],
	[17, "54/(30)/95"],
	[18, "51/(28)/89"],
	[19, "48/(27)/85"],
	[20, "46/(26)/80"],
	[21, "44/(25)/77"],
	[22, "42/(23)/73"],
	[23, "40/(23)/70"],
	[24, "38/(21)/67"],
	[25, "36/(20)/63"],
	[26, "35/(20)/62"],
	[27, "34/(19)/59"],
	[28, "33/(19)/57"],
	[29, "32/(18)/55"],
	[30, "31/(17)/53"],
	[31, "30/(17)/51"],
	[32, "29/(16)/50"],
	[33, "28/(16)/48"],
	[34, "27/(15)/47"],
	[35, "26/(15)/46"],
	[36, "26/(14)/44"],
	[37, "25/(14)/43"],
	[38, "24/(14)/42"],
	[39, "24/(13)/41"],
	[40, "23/(13)/40"],
	[41, "23/(13)/39"],
	[42, "22/(12)/38"],
	[43, "21/(12)/37"],
	[44, "21/(12)/36"],
	[45, "21/(12)/35"],
	[46, "20/(11)/35"],
	[47, "20/(11)/34"],
	[48, "19/(11)/33"],
	[49, "19/(11)/32"],
	[50, "18/(10)/31"],
	[52, "18/(10)/30"],
	[54, "17/(10)/29"],
	[56, "17/(9)/28"],
	[57, "16/(9)/28"],
	[58, "16/(9)/27"],
	[60, "16/(9)/26"],
	[61, "15/(9)/26"],
	[62, "15/(9)/25"],
	[63, "15/(8)/25"],
	[65, "14/(8)/24"],
	[67, "14/(8)/23"],
	[70, "13/(8)/22"],
	[72, "13/(7)/22"],
	[74, "13/(7)/21"],
	[75, "12/(7)/21"],
	[77, "12/(7)/20"],
	[81, "12/(7)/19"],
	[83, "11/(7)/19"],
	[84, "11/(6)/19"],
	[85, "11/(6)/18"],
	[90, "11/(6)/17"],
	[91, "10/(6)/17"],
	[95, "10/(6)/16"],
	[100, "9/(5)/15"],
	[108, "9/(5)/14"],
	[112, "9/4/(5)/14"],
	[113, "8/(5)/14"],
	[115, "8/(5)/13"],
	[121, "8/(5/4)/13"],
	[124, "8/(5/4)/12"],
	[125, "8/(4)/11"],
	[129, "7/(4)/12"],
	[134, "7/(4)/11"],
	[143, "7/3/(4)/11"],
	[146, "7/3/(4)/10"],
	[150, "6/(4/3)/10"],
	[161, "6/(4/3)/9"],
	[167, "6/(3)/8"]
]);

const STRAFE_BOW_TABLE = new BreakpointTable([
	[15, "41/(21)/74"],
	[16, "39/(20)/70"],
	[17, "36/(18)/65"],
	[18, "34/(17)/61"],
	[19, "32/(16)/58"],
	[20, "31/(16)/55"],
	[21, "29/(15)/53"],
	[22, "28/(14)/50"],
	[23, "27/(14)/48"],
	[24, "26/(13)/46"],
	[25, "24/(12)/43"],
	[26, "24/(12)/42"],
	[27, "23/(12)/40"],
	[28, "22/(11)/39"],
	[29, "21/(11)/38"],
	[30, "21/(11)/37"],
	[31, "20/(10)/35"],
	[32, "19/(10)/34"],
	[33, "19/(10)/33"],
	[34, "18/(9)/32"],
	[35, "18/(9)/31"],
	[36, "17/(9)/30"],
	[37, "17/(9)/29"],
	[38, "16/(8)/29"],
	[39, "16/(8)/28"],
	[40, "16/(8)/27"],
	[41, "15/(8)/27"],
	[42, "15/(8)/26"],
	[43, "14/(7)/25"],
	[45, "14/(7)/24"],
	[47, "13/(7)/23"],
	[49, "13/(7)/22"],
	[50, "12/(6)/21"],
	[53, "12/(6)/20"],
	[55, "11/(6)/20"],
	[56, "11/(6)/19"],
	[59, "11/(6)/18"],
	[61, "10/(5)/18"],
	[62, "10/(5)/17"],
	[65, "10/(5)/16"],
	[67, "9/(5)/16"],
	[69, "9/(5)/15"],
	[74, "9/(5)/14"],
	[75, "8/(4)/14"],
	[79, "8/(4)/13"],
	[85, "8/(4)/12"],
	[86, "7/(4)/12"],
	[92, "7/(4)/11"],
	[100, "6/(3)/10"],
	[111, "6/(3)/9"],
	[121, "5/(3)/9"],
	[123, "5/(3)/8"],
	[138, "5/(3)/7"],
	[150, "4/(2)/7"],
	[158, "4/(2)/6"]
]);

const AMAZON = 0;
const ASSASSIN = 1;
const BARBARIAN = 2;
const DRUID = 3;
const NECROMANCER = 4;
const PALADIN = 5;
const SORCERESS = 6;
const MERC_A1 = 7;
const MERC_A2 = 8;
const MERC_A5 = 9;

const HUMAN = "None";
const WEREWOLF = "Werewolf";
const WEREBEAR = "Werebear";

const STANDARD = 0;
const THROW = 1;
const IMPALE = 2;
const JAB = 3;
const STRAFE = 4;
const FEND = 5;
const TIGER_STRIKE = 6;
const COBRA_STRIKE = 7;
const PHOENIX_STRIKE = 8;
const FISTS_OF_FIRE = 9;
const CLAWS_OF_THUNDER = 10;
const BLADES_OF_ICE = 11;
const DRAGON_CLAW = 12;
const DRAGON_TAIL = 13;
const DRAGON_TALON = 14;
const LAYING_TRAPS = 15;
const DOUBLE_SWING = 16;
const FRENZY = 17;
const DOUBLE_THROW = 18;
const WHIRLWIND = 19;
const CONCENTRATE = 20;
const BERSERK = 21;
const BASH = 22;
const STUN = 23;
const ZEAL = 24;
const SMITE = 25;
const FERAL_RAGE = 26;
const HUNGER = 27;
const RABIES = 28;
const FURY = 29;
const SACRIFICE = 30;
const VENGEANCE = 31;
const CONVERSION = 32;

class WeaponType {

	constructor(type, startingFrame, framesPerDirectionMap) {
		this.type = type;
		this.startingFrame = startingFrame;
		this.framesPerDirectionMap = framesPerDirectionMap;
	}

	getFramesPerDirection(character) {
		let value = this.framesPerDirectionMap.get(character);
		return (Array.isArray(value) ? value[0] : value);
	}

	hasAlternateAnimation(character) {
		return Array.isArray(this.framesPerDirectionMap.get(character));
	}

	getAlternateFramesPerDirection(character) {
		return this.framesPerDirectionMap.get(character)[1];
	}

}

const UNARMED = new WeaponType(0, 1, new Map([[AMAZON, 13], [ASSASSIN, [11, 12]], [BARBARIAN, 12], [DRUID, 16], [NECROMANCER, 15], [PALADIN, 14], [SORCERESS, 16]]));
const CLAW = new WeaponType(1, 0, new Map([[ASSASSIN, [11, 12]]]));
const ONE_HANDED_SWINGING = new WeaponType(2, 2, new Map([[AMAZON, 16], [ASSASSIN, 15], [BARBARIAN, 16], [DRUID, 19], [NECROMANCER, 19], [PALADIN, 15], [SORCERESS, 20], [MERC_A5, 16]]));
const TWO_HANDED_SWORD = new WeaponType(3, 2, new Map([[AMAZON, 20], [ASSASSIN, 23], [BARBARIAN, 18], [DRUID, 21], [NECROMANCER, 23], [PALADIN, 19], [SORCERESS, 24], [MERC_A5, 16]]));
const ONE_HANDED_THRUSTING = new WeaponType(4, 2, new Map([[AMAZON, 15], [ASSASSIN, 15], [BARBARIAN, 16], [DRUID, 19], [NECROMANCER, 19], [PALADIN, 17], [SORCERESS, 19], [MERC_A2, 16]]));
const SPEAR = new WeaponType(5, 2, new Map([[AMAZON, 18], [ASSASSIN, 23], [BARBARIAN, 19], [DRUID, 23], [NECROMANCER, 24], [PALADIN, 20], [SORCERESS, 23], [MERC_A2, 16]]));
const TWO_HANDED = new WeaponType(6, 2, new Map([[AMAZON, 20], [ASSASSIN, 19], [BARBARIAN, 19], [DRUID, 17], [NECROMANCER, 20], [PALADIN, [18, 19]], [SORCERESS, 18], [MERC_A2, 16]])); // two-handed weapon (not sword)
const BOW = new WeaponType(7, 0, new Map([[AMAZON, 14], [ASSASSIN, 16], [BARBARIAN, 15], [DRUID, 16], [NECROMANCER, 18], [PALADIN, 16], [SORCERESS, 17], [MERC_A1, 15]]));
const CROSSBOW = new WeaponType(8, 0, new Map([[AMAZON, 20], [ASSASSIN, 21], [BARBARIAN, 20], [DRUID, 20], [NECROMANCER, 20], [PALADIN, 20], [SORCERESS, 20]]));
const THROWING = new WeaponType(9, 0, new Map([[AMAZON, 16], [ASSASSIN, 16], [BARBARIAN, 16], [DRUID, 18], [NECROMANCER, 20], [PALADIN, 16], [SORCERESS, 20]]));

const ACTIONS_FRAMES = [
	[8, 6, 6, 8, 8, 7, 9],
	[0, 0, 0, 0, 0, 0, 0],
	[10, 7, 7, 9, 9, 7, 12],
	[12, 11, 8, 10, 11, 8, 14],
	[9, 7, 7, 8, 9, 8, 11],
	[11, 10, 9, 9, 10, 8, 13],
	[12, 9, 9, 9, 11, 9, 11],
	[6, 7, 7, 8, 9, 8, 9],
	[9, 10, 10, 10, 11, 10, 11]
];

const SKILLS = [
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
];

const SEQUENCES = [
	[0, 0, 0, 0, 21, 24, 0, 0, 0],
	[0, 0, 0, 0, 18, 21, 0, 0, 0],
	[12, 12, 16, 0, 0, 0, 0, 0, 0],
	[0, 0, 17, 17, 17, 0, 0, 0, 0],
	[0, 0, 12, 0, 12, 0, 0, 0, 0]
];

function Weapon(name, WSM, weaponType) {
	this.name = name;
	this.WSM = WSM;
	this.weaponType = weaponType;
}

// \["([\w \-']+)", ([-]?[\d]+), ([\d]+), [-]?[\d]+, [\d]+, [\d]+\][,]?
// WEAPONS.set("\1", new Weapon("\1", \2, \3));

const WEAPONS = new Map();
WEAPONS.set("None", new Weapon("None", 0, UNARMED))
	   .set("Ancient Axe", new Weapon("Ancient Axe", 10, TWO_HANDED))
	   .set("Ancient Sword", new Weapon("Ancient Sword", 0, ONE_HANDED_SWINGING))
	   .set("Arbalest", new Weapon("Arbalest", -10, CROSSBOW))
	   .set("Archon Staff", new Weapon("Archon Staff", 10, TWO_HANDED))
	   .set("Ashwood Bow", new Weapon("Ashwood Bow", 0, BOW))
	   .set("Ataghan", new Weapon("Ataghan", -20, ONE_HANDED_SWINGING))
	   .set("Axe", new Weapon("Axe", 10, ONE_HANDED_SWINGING))
	   .set("Balanced Axe", new Weapon("Balanced Axe", -10, ONE_HANDED_SWINGING))
	   .set("Balanced Knife", new Weapon("Balanced Knife", -20, ONE_HANDED_THRUSTING))
	   .set("Ballista", new Weapon("Ballista", 10, CROSSBOW))
	   .set("Balrog Blade", new Weapon("Balrog Blade", 0, TWO_HANDED_SWORD))
	   .set("Balrog Spear", new Weapon("Balrog Spear", 10, ONE_HANDED_THRUSTING))
	   .set("Barbed Club", new Weapon("Barbed Club", 0, ONE_HANDED_SWINGING))
	   .set("Bardiche", new Weapon("Bardiche", 10, TWO_HANDED))
	   .set("Bastard Sword", new Weapon("Bastard Sword", 10, TWO_HANDED_SWORD))
	   .set("Battle Axe", new Weapon("Battle Axe", 10, TWO_HANDED))
	   .set("Battle Cestus", new Weapon("Battle Cestus", -10, CLAW))
	   .set("Battle Dart", new Weapon("Battle Dart", 0, ONE_HANDED_THRUSTING))
	   .set("Battle Hammer", new Weapon("Battle Hammer", 20, ONE_HANDED_SWINGING))
	   .set("Battle Scythe", new Weapon("Battle Scythe", -10, TWO_HANDED))
	   .set("Battle Staff", new Weapon("Battle Staff", 0, TWO_HANDED))
	   .set("Battle Sword", new Weapon("Battle Sword", 0, ONE_HANDED_SWINGING))
	   .set("Bearded Axe", new Weapon("Bearded Axe", 0, TWO_HANDED))
	   .set("Bec-de-Corbin", new Weapon("Bec-de-Corbin", 0, TWO_HANDED))
	   .set("Berserker Axe", new Weapon("Berserker Axe", 0, ONE_HANDED_SWINGING))
	   .set("Bill", new Weapon("Bill", 0, TWO_HANDED))
	   .set("Blade Bow", new Weapon("Blade Bow", -10, BOW))
	   .set("Blade Talons", new Weapon("Blade Talons", -20, CLAW))
	   .set("Blade", new Weapon("Blade", -10, ONE_HANDED_THRUSTING))
	   .set("Bone Knife", new Weapon("Bone Knife", -20, ONE_HANDED_THRUSTING))
	   .set("Bone Wand", new Weapon("Bone Wand", -20, ONE_HANDED_SWINGING))
	   .set("Brandistock", new Weapon("Brandistock", -20, SPEAR))
	   .set("Broad Axe", new Weapon("Broad Axe", 0, TWO_HANDED))
	   .set("Broad Sword", new Weapon("Broad Sword", 0, ONE_HANDED_SWINGING))
	   .set("Burnt Wand", new Weapon("Burnt Wand", 0, ONE_HANDED_SWINGING))
	   .set("Caduceus", new Weapon("Caduceus", -10, ONE_HANDED_SWINGING))
	   .set("Cedar Bow", new Weapon("Cedar Bow", 0, BOW))
	   .set("Cedar Staff", new Weapon("Cedar Staff", 10, TWO_HANDED))
	   .set("Ceremonial Bow", new Weapon("Ceremonial Bow", 10, BOW))
	   .set("Ceremonial Javelin", new Weapon("Ceremonial Javelin", -10, ONE_HANDED_THRUSTING))
	   .set("Ceremonial Pike", new Weapon("Ceremonial Pike", 20, SPEAR))
	   .set("Ceremonial Spear", new Weapon("Ceremonial Spear", 0, SPEAR))
	   .set("Cestus", new Weapon("Cestus", 0, CLAW))
	   .set("Champion Axe", new Weapon("Champion Axe", -10, TWO_HANDED))
	   .set("Champion Sword", new Weapon("Champion Sword", -10, TWO_HANDED_SWORD))
	   .set("Chu-Ko-Nu", new Weapon("Chu-Ko-Nu", -60, CROSSBOW))
	   .set("Cinquedeas", new Weapon("Cinquedeas", -20, ONE_HANDED_THRUSTING))
	   .set("Clasped Orb", new Weapon("Clasped Orb", 0, ONE_HANDED_SWINGING))
	   .set("Claws", new Weapon("Claws", -10, CLAW))
	   .set("Claymore", new Weapon("Claymore", 10, TWO_HANDED_SWORD))
	   .set("Cleaver", new Weapon("Cleaver", 10, ONE_HANDED_SWINGING))
	   .set("Cloudy Sphere", new Weapon("Cloudy Sphere", 0, ONE_HANDED_SWINGING))
	   .set("Club", new Weapon("Club", -10, ONE_HANDED_SWINGING))
	   .set("Colossus Blade", new Weapon("Colossus Blade", 5, TWO_HANDED_SWORD))
	   .set("Colossus Crossbow", new Weapon("Colossus Crossbow", 10, CROSSBOW))
	   .set("Colossus Sword", new Weapon("Colossus Sword", 10, TWO_HANDED_SWORD))
	   .set("Colossus Voulge", new Weapon("Colossus Voulge", 10, TWO_HANDED))
	   .set("Composite Bow", new Weapon("Composite Bow", -10, BOW))
	   .set("Conquest Sword", new Weapon("Conquest Sword", 0, ONE_HANDED_SWINGING))
	   .set("Crossbow", new Weapon("Crossbow", 0, CROSSBOW))
	   .set("Crowbill", new Weapon("Crowbill", -10, ONE_HANDED_SWINGING))
	   .set("Crusader Bow", new Weapon("Crusader Bow", 10, BOW))
	   .set("Cryptic Axe", new Weapon("Cryptic Axe", 10, TWO_HANDED))
	   .set("Cryptic Sword", new Weapon("Cryptic Sword", -10, ONE_HANDED_SWINGING))
	   .set("Crystal Sword", new Weapon("Crystal Sword", 0, ONE_HANDED_SWINGING))
	   .set("Crystalline Globe", new Weapon("Crystalline Globe", -10, ONE_HANDED_SWINGING))
	   .set("Cudgel", new Weapon("Cudgel", -10, ONE_HANDED_SWINGING))
	   .set("Cutlass", new Weapon("Cutlass", -30, ONE_HANDED_SWINGING))
	   .set("Dacian Falx", new Weapon("Dacian Falx", 10, TWO_HANDED_SWORD))
	   .set("Dagger", new Weapon("Dagger", -20, ONE_HANDED_THRUSTING))
	   .set("Decapitator", new Weapon("Decapitator", 10, TWO_HANDED))
	   .set("Demon Crossbow", new Weapon("Demon Crossbow", -60, CROSSBOW))
	   .set("Demon Heart", new Weapon("Demon Heart", 0, ONE_HANDED_SWINGING))
	   .set("Devil Star", new Weapon("Devil Star", 10, ONE_HANDED_SWINGING))
	   .set("Diamond Bow", new Weapon("Diamond Bow", 0, BOW))
	   .set("Dimensional Blade", new Weapon("Dimensional Blade", 0, ONE_HANDED_SWINGING))
	   .set("Dimensional Shard", new Weapon("Dimensional Shard", 10, ONE_HANDED_SWINGING))
	   .set("Dirk", new Weapon("Dirk", 0, ONE_HANDED_THRUSTING))
	   .set("Divine Scepter", new Weapon("Divine Scepter", -10, ONE_HANDED_SWINGING))
	   .set("Double Axe", new Weapon("Double Axe", 10, ONE_HANDED_SWINGING))
	   .set("Double Bow", new Weapon("Double Bow", -10, BOW))
	   .set("Eagle Orb", new Weapon("Eagle Orb", -10, ONE_HANDED_SWINGING))
	   .set("Edge Bow", new Weapon("Edge Bow", 5, BOW))
	   .set("Elder Staff", new Weapon("Elder Staff", 0, TWO_HANDED))
	   .set("Eldritch Orb", new Weapon("Eldritch Orb", -10, ONE_HANDED_SWINGING))
	   .set("Elegant Blade", new Weapon("Elegant Blade", -10, ONE_HANDED_SWINGING))
	   .set("Espandon", new Weapon("Espandon", 0, TWO_HANDED_SWORD))
	   .set("Ettin Axe", new Weapon("Ettin Axe", 10, ONE_HANDED_SWINGING))
	   .set("Executioner Sword", new Weapon("Executioner Sword", 10, TWO_HANDED_SWORD))
	   .set("Falcata", new Weapon("Falcata", 0, ONE_HANDED_SWINGING))
	   .set("Falchion", new Weapon("Falchion", 20, ONE_HANDED_SWINGING))
	   .set("Fanged Knife", new Weapon("Fanged Knife", -20, ONE_HANDED_THRUSTING))
	   .set("Fascia", new Weapon("Fascia", 10, CLAW))
	   .set("Feral Axe", new Weapon("Feral Axe", -15, TWO_HANDED))
	   .set("Feral Claws", new Weapon("Feral Claws", -20, CLAW))
	   .set("Flail", new Weapon("Flail", -10, ONE_HANDED_SWINGING))
	   .set("Flamberge", new Weapon("Flamberge", -10, TWO_HANDED_SWORD))
	   .set("Flanged Mace", new Weapon("Flanged Mace", 0, ONE_HANDED_SWINGING))
	   .set("Flying Axe", new Weapon("Flying Axe", 10, ONE_HANDED_SWINGING))
	   .set("Francisca", new Weapon("Francisca", 10, ONE_HANDED_SWINGING))
	   .set("Fuscina", new Weapon("Fuscina", 0, SPEAR))
	   .set("Ghost Glaive", new Weapon("Ghost Glaive", 20, ONE_HANDED_THRUSTING))
	   .set("Ghost Spear", new Weapon("Ghost Spear", 0, SPEAR))
	   .set("Ghost Wand", new Weapon("Ghost Wand", 10, ONE_HANDED_SWINGING))
	   .set("Giant Axe", new Weapon("Giant Axe", 10, TWO_HANDED))
	   .set("Giant Sword", new Weapon("Giant Sword", 0, TWO_HANDED_SWORD))
	   .set("Giant Thresher", new Weapon("Giant Thresher", -10, TWO_HANDED))
	   .set("Gladius", new Weapon("Gladius", 0, ONE_HANDED_SWINGING))
	   .set("Glaive", new Weapon("Glaive", 20, ONE_HANDED_THRUSTING))
	   .set("Glorious Axe", new Weapon("Glorious Axe", 10, TWO_HANDED))
	   .set("Glowing Orb", new Weapon("Glowing Orb", -10, ONE_HANDED_SWINGING))
	   .set("Gnarled Staff", new Weapon("Gnarled Staff", 10, TWO_HANDED))
	   .set("Gorgon Crossbow", new Weapon("Gorgon Crossbow", 0, CROSSBOW))
	   .set("Gothic Axe", new Weapon("Gothic Axe", -10, TWO_HANDED))
	   .set("Gothic Bow", new Weapon("Gothic Bow", 10, BOW))
	   .set("Gothic Staff", new Weapon("Gothic Staff", 0, TWO_HANDED))
	   .set("Gothic Sword", new Weapon("Gothic Sword", 10, TWO_HANDED_SWORD))
	   .set("Grand Matron Bow", new Weapon("Grand Matron Bow", 10, BOW))
	   .set("Grand Scepter", new Weapon("Grand Scepter", 10, ONE_HANDED_SWINGING))
	   .set("Grave Wand", new Weapon("Grave Wand", 0, ONE_HANDED_SWINGING))
	   .set("Great Axe", new Weapon("Great Axe", -10, TWO_HANDED))
	   .set("Great Bow", new Weapon("Great Bow", -10, BOW))
	   .set("Great Maul", new Weapon("Great Maul", 20, TWO_HANDED))
	   .set("Great Pilum", new Weapon("Great Pilum", 0, ONE_HANDED_THRUSTING))
	   .set("Great Poleaxe", new Weapon("Great Poleaxe", 0, TWO_HANDED))
	   .set("Great Sword", new Weapon("Great Sword", 10, TWO_HANDED_SWORD))
	   .set("Greater Claws", new Weapon("Greater Claws", -20, CLAW))
	   .set("Greater Talons", new Weapon("Greater Talons", -30, CLAW))
	   .set("Grim Scythe", new Weapon("Grim Scythe", -10, TWO_HANDED))
	   .set("Grim Wand", new Weapon("Grim Wand", 0, ONE_HANDED_SWINGING))
	   .set("Halberd", new Weapon("Halberd", 0, TWO_HANDED))
	   .set("Hand Axe", new Weapon("Hand Axe", 0, ONE_HANDED_SWINGING))
	   .set("Hand Scythe", new Weapon("Hand Scythe", -10, CLAW))
	   .set("Harpoon", new Weapon("Harpoon", -10, ONE_HANDED_THRUSTING))
	   .set("Hatchet Hands", new Weapon("Hatchet Hands", 10, CLAW))
	   .set("Hatchet", new Weapon("Hatchet", 0, ONE_HANDED_SWINGING))
	   .set("Heavenly Stone", new Weapon("Heavenly Stone", -10, ONE_HANDED_SWINGING))
	   .set("Heavy Crossbow", new Weapon("Heavy Crossbow", 10, CROSSBOW))
	   .set("Highland Blade", new Weapon("Highland Blade", -5, TWO_HANDED_SWORD))
	   .set("Holy Water Sprinkler", new Weapon("Holy Water Sprinkler", 10, ONE_HANDED_SWINGING))
	   .set("Hunter's Bow", new Weapon("Hunter's Bow", -10, BOW))
	   .set("Hurlbat", new Weapon("Hurlbat", -10, ONE_HANDED_SWINGING))
	   .set("Hydra Bow", new Weapon("Hydra Bow", 10, BOW))
	   .set("Hydra Edge", new Weapon("Hydra Edge", 10, ONE_HANDED_SWINGING))
	   .set("Hyperion Javelin", new Weapon("Hyperion Javelin", -10, ONE_HANDED_THRUSTING))
	   .set("Hyperion Spear", new Weapon("Hyperion Spear", -10, SPEAR))
	   .set("Jagged Star", new Weapon("Jagged Star", 10, ONE_HANDED_SWINGING))
	   .set("Jared's Stone", new Weapon("Jared's Stone", 10, ONE_HANDED_SWINGING))
	   .set("Javelin", new Weapon("Javelin", -10, ONE_HANDED_THRUSTING))
	   .set("Jo Staff", new Weapon("Jo Staff", -10, TWO_HANDED))
	   .set("Katar", new Weapon("Katar", -10, CLAW))
	   .set("Knout", new Weapon("Knout", -10, ONE_HANDED_SWINGING))
	   .set("Kris", new Weapon("Kris", -20, ONE_HANDED_THRUSTING))
	   .set("Lance", new Weapon("Lance", 20, SPEAR))
	   .set("Large Axe", new Weapon("Large Axe", -10, TWO_HANDED))
	   .set("Large Siege Bow", new Weapon("Large Siege Bow", 10, BOW))
	   .set("Legend Spike", new Weapon("Legend Spike", -10, ONE_HANDED_THRUSTING))
	   .set("Legend Sword", new Weapon("Legend Sword", -15, TWO_HANDED_SWORD))
	   .set("Legendary Mallet", new Weapon("Legendary Mallet", 20, ONE_HANDED_SWINGING))
	   .set("Lich Wand", new Weapon("Lich Wand", -20, ONE_HANDED_SWINGING))
	   .set("Light Crossbow", new Weapon("Light Crossbow", -10, CROSSBOW))
	   .set("Lochaber Axe", new Weapon("Lochaber Axe", 10, TWO_HANDED))
	   .set("Long Battle Bow", new Weapon("Long Battle Bow", 10, BOW))
	   .set("Long Bow", new Weapon("Long Bow", 0, BOW))
	   .set("Long Staff", new Weapon("Long Staff", 0, TWO_HANDED))
	   .set("Long Sword", new Weapon("Long Sword", -10, ONE_HANDED_SWINGING))
	   .set("Long War Bow", new Weapon("Long War Bow", 10, BOW))
	   .set("Mace", new Weapon("Mace", 0, ONE_HANDED_SWINGING))
	   .set("Maiden Javelin", new Weapon("Maiden Javelin", -10, ONE_HANDED_THRUSTING))
	   .set("Maiden Pike", new Weapon("Maiden Pike", 10, SPEAR))
	   .set("Maiden Spear", new Weapon("Maiden Spear", 0, SPEAR))
	   .set("Mancatcher", new Weapon("Mancatcher", -20, SPEAR))
	   .set("Martel de Fer", new Weapon("Martel de Fer", 20, TWO_HANDED))
	   .set("Matriarchal Bow", new Weapon("Matriarchal Bow", -10, BOW))
	   .set("Matriarchal Javelin", new Weapon("Matriarchal Javelin", -10, ONE_HANDED_THRUSTING))
	   .set("Matriarchal Pike", new Weapon("Matriarchal Pike", 20, SPEAR))
	   .set("Matriarchal Spear", new Weapon("Matriarchal Spear", 0, SPEAR))
	   .set("Maul", new Weapon("Maul", 10, TWO_HANDED))
	   .set("Mighty Scepter", new Weapon("Mighty Scepter", 0, ONE_HANDED_SWINGING))
	   .set("Military Axe", new Weapon("Military Axe", -10, TWO_HANDED))
	   .set("Military Pick", new Weapon("Military Pick", -10, ONE_HANDED_SWINGING))
	   .set("Mithril Point", new Weapon("Mithril Point", 0, ONE_HANDED_THRUSTING))
	   .set("Morning Star", new Weapon("Morning Star", 10, ONE_HANDED_SWINGING))
	   .set("Mythical Sword", new Weapon("Mythical Sword", 0, ONE_HANDED_SWINGING))
	   .set("Naga", new Weapon("Naga", 0, ONE_HANDED_SWINGING))
	   .set("Ogre Axe", new Weapon("Ogre Axe", 0, TWO_HANDED))
	   .set("Ogre Maul", new Weapon("Ogre Maul", 10, TWO_HANDED))
	   .set("Partizan", new Weapon("Partizan", 10, TWO_HANDED))
	   .set("Pellet Bow", new Weapon("Pellet Bow", -10, CROSSBOW))
	   .set("Petrified Wand", new Weapon("Petrified Wand", 10, ONE_HANDED_SWINGING))
	   .set("Phase Blade", new Weapon("Phase Blade", -30, ONE_HANDED_SWINGING))
	   .set("Pike", new Weapon("Pike", 20, SPEAR))
	   .set("Pilum", new Weapon("Pilum", 0, ONE_HANDED_THRUSTING))
	   .set("Poignard", new Weapon("Poignard", -20, ONE_HANDED_THRUSTING))
	   .set("Poleaxe", new Weapon("Poleaxe", 10, TWO_HANDED))
	   .set("Polished Wand", new Weapon("Polished Wand", 0, ONE_HANDED_SWINGING))
	   .set("Quarterstaff", new Weapon("Quarterstaff", 0, TWO_HANDED))
	   .set("Quhab", new Weapon("Quhab", 0, CLAW))
	   .set("Razor Bow", new Weapon("Razor Bow", -10, BOW))
	   .set("Reflex Bow", new Weapon("Reflex Bow", 10, BOW))
	   .set("Reinforced Mace", new Weapon("Reinforced Mace", 0, ONE_HANDED_SWINGING))
	   .set("Repeating Crossbow", new Weapon("Repeating Crossbow", -40, CROSSBOW))
	   .set("Rondel", new Weapon("Rondel", 0, ONE_HANDED_THRUSTING))
	   .set("Rune Bow", new Weapon("Rune Bow", 0, BOW))
	   .set("Rune Scepter", new Weapon("Rune Scepter", 0, ONE_HANDED_SWINGING))
	   .set("Rune Staff", new Weapon("Rune Staff", 20, TWO_HANDED))
	   .set("Rune Sword", new Weapon("Rune Sword", -10, ONE_HANDED_SWINGING))
	   .set("Runic Talons", new Weapon("Runic Talons", -30, CLAW))
	   .set("Sabre", new Weapon("Sabre", -10, ONE_HANDED_SWINGING))
	   .set("Sacred Globe", new Weapon("Sacred Globe", -10, ONE_HANDED_SWINGING))
	   .set("Scepter", new Weapon("Scepter", 0, ONE_HANDED_SWINGING))
	   .set("Scimitar", new Weapon("Scimitar", -20, ONE_HANDED_SWINGING))
	   .set("Scissors Katar", new Weapon("Scissors Katar", -10, CLAW))
	   .set("Scissors Quhab", new Weapon("Scissors Quhab", 0, CLAW))
	   .set("Scissors Suwayyah", new Weapon("Scissors Suwayyah", 0, CLAW))
	   .set("Scourge", new Weapon("Scourge", -10, ONE_HANDED_SWINGING))
	   .set("Scythe", new Weapon("Scythe", -10, TWO_HANDED))
	   .set("Seraph Rod", new Weapon("Seraph Rod", 10, ONE_HANDED_SWINGING))
	   .set("Shadow Bow", new Weapon("Shadow Bow", 0, BOW))
	   .set("Shamshir", new Weapon("Shamshir", -10, ONE_HANDED_SWINGING))
	   .set("Shillelagh", new Weapon("Shillelagh", 0, TWO_HANDED))
	   .set("Short Battle Bow", new Weapon("Short Battle Bow", 0, BOW))
	   .set("Short Bow", new Weapon("Short Bow", 5, BOW))
	   .set("Short Siege Bow", new Weapon("Short Siege Bow", 0, BOW))
	   .set("Short Spear", new Weapon("Short Spear", 10, ONE_HANDED_THRUSTING))
	   .set("Short Staff", new Weapon("Short Staff", -10, TWO_HANDED))
	   .set("Short Sword", new Weapon("Short Sword", 0, ONE_HANDED_SWINGING))
	   .set("Short War Bow", new Weapon("Short War Bow", 0, BOW))
	   .set("Siege Crossbow", new Weapon("Siege Crossbow", 0, CROSSBOW))
	   .set("Silver-edged Axe", new Weapon("Silver-edged Axe", 0, TWO_HANDED))
	   .set("Simbilan", new Weapon("Simbilan", 10, ONE_HANDED_THRUSTING))
	   .set("Small Crescent", new Weapon("Small Crescent", 10, ONE_HANDED_SWINGING))
	   .set("Smoked Sphere", new Weapon("Smoked Sphere", 0, ONE_HANDED_SWINGING))
	   .set("Sparkling Ball", new Weapon("Sparkling Ball", 0, ONE_HANDED_SWINGING))
	   .set("Spear", new Weapon("Spear", -10, SPEAR))
	   .set("Spetum", new Weapon("Spetum", 0, SPEAR))
	   .set("Spiculum", new Weapon("Spiculum", 20, ONE_HANDED_THRUSTING))
	   .set("Spider Bow", new Weapon("Spider Bow", 5, BOW))
	   .set("Spiked Club", new Weapon("Spiked Club", 0, ONE_HANDED_SWINGING))
	   .set("Stag Bow", new Weapon("Stag Bow", 0, BOW))
	   .set("Stalagmite", new Weapon("Stalagmite", 10, TWO_HANDED))
	   .set("Stiletto", new Weapon("Stiletto", -10, ONE_HANDED_THRUSTING))
	   .set("Stygian Pike", new Weapon("Stygian Pike", 0, SPEAR))
	   .set("Stygian Pilum", new Weapon("Stygian Pilum", 0, ONE_HANDED_THRUSTING))
	   .set("Suwayyah", new Weapon("Suwayyah", 0, CLAW))
	   .set("Swirling Crystal", new Weapon("Swirling Crystal", 10, ONE_HANDED_SWINGING))
	   .set("Tabar", new Weapon("Tabar", 10, TWO_HANDED))
	   .set("Thresher", new Weapon("Thresher", -10, TWO_HANDED))
	   .set("Throwing Axe", new Weapon("Throwing Axe", 10, ONE_HANDED_SWINGING))
	   .set("Throwing Knife", new Weapon("Throwing Knife", 0, ONE_HANDED_THRUSTING))
	   .set("Throwing Spear", new Weapon("Throwing Spear", -10, ONE_HANDED_THRUSTING))
	   .set("Thunder Maul", new Weapon("Thunder Maul", 20, TWO_HANDED))
	   .set("Tomahawk", new Weapon("Tomahawk", 0, ONE_HANDED_SWINGING))
	   .set("Tomb Wand", new Weapon("Tomb Wand", -20, ONE_HANDED_SWINGING))
	   .set("Trident", new Weapon("Trident", 0, SPEAR))
	   .set("Truncheon", new Weapon("Truncheon", -10, ONE_HANDED_SWINGING))
	   .set("Tulwar", new Weapon("Tulwar", 20, ONE_HANDED_SWINGING))
	   .set("Tusk Sword", new Weapon("Tusk Sword", 0, TWO_HANDED_SWORD))
	   .set("Twin Axe", new Weapon("Twin Axe", 10, ONE_HANDED_SWINGING))
	   .set("Two-Handed Sword", new Weapon("Two-Handed Sword", 0, TWO_HANDED_SWORD))
	   .set("Tyrant Club", new Weapon("Tyrant Club", 0, ONE_HANDED_SWINGING))
	   .set("Unearthed Wand", new Weapon("Unearthed Wand", 0, ONE_HANDED_SWINGING))
	   .set("Vortex Orb", new Weapon("Vortex Orb", 0, ONE_HANDED_SWINGING))
	   .set("Voulge", new Weapon("Voulge", 0, TWO_HANDED))
	   .set("Walking Stick", new Weapon("Walking Stick", -10, TWO_HANDED))
	   .set("Wand", new Weapon("Wand", 0, ONE_HANDED_SWINGING))
	   .set("War Axe", new Weapon("War Axe", 0, ONE_HANDED_SWINGING))
	   .set("War Club", new Weapon("War Club", 10, TWO_HANDED))
	   .set("War Dart", new Weapon("War Dart", -20, ONE_HANDED_THRUSTING))
	   .set("War Fist", new Weapon("War Fist", 10, CLAW))
	   .set("War Fork", new Weapon("War Fork", -20, SPEAR))
	   .set("War Hammer", new Weapon("War Hammer", 20, ONE_HANDED_SWINGING))
	   .set("War Javelin", new Weapon("War Javelin", -10, ONE_HANDED_THRUSTING))
	   .set("War Pike", new Weapon("War Pike", 20, SPEAR))
	   .set("War Scepter", new Weapon("War Scepter", -10, ONE_HANDED_SWINGING))
	   .set("War Scythe", new Weapon("War Scythe", -10, TWO_HANDED))
	   .set("War Spear", new Weapon("War Spear", -10, SPEAR))
	   .set("War Spike", new Weapon("War Spike", -10, ONE_HANDED_SWINGING))
	   .set("War Staff", new Weapon("War Staff", 20, TWO_HANDED))
	   .set("War Sword", new Weapon("War Sword", 0, ONE_HANDED_SWINGING))
	   .set("Ward Bow", new Weapon("Ward Bow", 0, BOW))
	   .set("Winged Axe", new Weapon("Winged Axe", -10, ONE_HANDED_SWINGING))
	   .set("Winged Harpoon", new Weapon("Winged Harpoon", -10, ONE_HANDED_THRUSTING))
	   .set("Winged Knife", new Weapon("Winged Knife", -20, ONE_HANDED_THRUSTING))
	   .set("Wrist Blade", new Weapon("Wrist Blade", 0, CLAW))
	   .set("Wrist Spike", new Weapon("Wrist Spike", -10, CLAW))
	   .set("Wrist Sword", new Weapon("Wrist Sword", -10, CLAW))
	   .set("Yari", new Weapon("Yari", 0, SPEAR))
	   .set("Yew Wand", new Weapon("Yew Wand", 10, ONE_HANDED_SWINGING))
	   .set("Zweihander", new Weapon("Zweihander", -10, TWO_HANDED_SWORD));
