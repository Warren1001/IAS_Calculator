window.addEventListener("load", load, false);

const EIAS_MAX = 175; // for a brief period of D2R, this limit did not exist. rip bugged ias frames :(
const EIAS_MIN = 15;

/**
 * bugs:
 * 
 * 
 * missing features:
 * frenzy needs showby weapon ias implementation
 * dual wielding needs secondary weapon ias implementation for non-ias showby
 * wereforms needs showby weapon ias implementation
 * a5 mercs need to be limited to only swords, has access to all one handed weapons currently
 * a2 mercs need to be limited properly, throwing weapons are thrusting weapons, polearms are not thrusting weapons
 * zon has access to wrong skills with certain weapons
 */

function load() {
	
	const showByContainer = document.getElementById("showByContainer");
	const showByIAS = document.getElementById("showByIAS");
	const showByPrimaryWeaponIASContainer = document.getElementById("showByPrimaryWeaponIASContainer");
	const showByPrimaryWeaponIAS = document.getElementById("showByPrimaryWeaponIAS");
	const showBySecondaryWeaponIASContainer = document.getElementById("showBySecondaryWeaponIASContainer");
	const showBySecondaryWeaponIAS = document.getElementById("showBySecondaryWeaponIAS");
	const showByFanaticism = document.getElementById("showByFanaticism");
	const showByBurstOfSpeedContainer = document.getElementById("showByBurstOfSpeedContainer");
	const showByBurstOfSpeed = document.getElementById("showByBurstOfSpeed");
	const showByWerewolfContainer = document.getElementById("showByWerewolfContainer");
	const showByWerewolf = document.getElementById("showByWerewolf");
	const showByFrenzyContainer = document.getElementById("showByFrenzyContainer");
	const showByFrenzy = document.getElementById("showByFrenzy");
	const characterSelect = document.getElementById("characterSelect");
	const formSelectContainer = document.getElementById("formSelectContainer");
	const formSelect = document.getElementById("formSelect");
	const optionWerewolf = formSelect.options[2];
	const primaryWeaponSelect = document.getElementById("primaryWeaponSelect");
	const primaryWeaponIASContainer = document.getElementById("primaryWeaponIASContainer");
	const primaryWeaponIAS = document.getElementById("primaryWeaponIAS");
	const secondaryWeaponContainer = document.getElementById("secondaryWeaponContainer");
	const secondaryWeaponSelect = document.getElementById("secondaryWeaponSelect");
	const secondaryWeaponIASContainer = document.getElementById("secondaryWeaponIASContainer");
	const secondaryWeaponIAS = document.getElementById("secondaryWeaponIAS");
	const wsmBugged = document.getElementById("wsmBugged");
	const isOneHandedContainer = document.getElementById("isOneHandedContainer");
	const isOneHanded = document.getElementById("isOneHanded");
	const gearIASContainer = document.getElementById("gearIASContainer");
	const gearIAS = document.getElementById("gearIAS");
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

	const FANATICISM = new AttackSpeedSkill(fanaticismLevelInput, 10, 30, 40, SHOW_BY_FANATICISM);
	const BURST_OF_SPEED = new AttackSpeedSkill(burstOfSpeedLevelInput, 15, 45, 60, SHOW_BY_BURST_OF_SPEED, () => character == ASSASSIN);
	const WEREWOLF_AS = new AttackSpeedSkill(werewolfLevelInput, 10, 70, 80, SHOW_BY_WEREWOLF, () => form == WEREWOLF);
	const FRENZY_AS = new AttackSpeedSkill(frenzyLevelInput, 0, 50, 50, SHOW_BY_FRENZY, () => character == BARBARIAN);
	const HOLY_FREEZE = new AttackSpeedSkill(holyFreezeLevelInput, 25, 35, 60);

	const MAX_IAS_WEAPON = 120;
	const MAX_IAS_ACCELERATION_WEAPON = 60;
	const MAX_IAS_ACCELERATION_CHARACTER = 88;
	const MAX_IAS_ACCELERATION_MERCENARY = 78;

	let character = PALADIN;
	let form = HUMAN;
	let primaryWeapon = WEAPONS.get("None");
	let skill = STANDARD;
	let secondaryWeapon = WEAPONS.get("None");
	let isDualWielding = false;
	let showBy = SHOW_BY_IAS;
	let maxAccelerationIncrease = MAX_IAS_ACCELERATION_CHARACTER;
	
	showByIAS.addEventListener("change", showByChanged, false);
	showByPrimaryWeaponIAS.addEventListener("change", showByChanged, false);
	showBySecondaryWeaponIAS.addEventListener("change", showByChanged, false);
	showByFanaticism.addEventListener("change", showByChanged, false);
	showByBurstOfSpeed.addEventListener("change", showByChanged, false);
	showByWerewolf.addEventListener("change", showByChanged, false);
	showByFrenzy.addEventListener("change", showByChanged, false);
	characterSelect.addEventListener("change", characterChanged, false);
	formSelect.addEventListener("change", formChanged, false);
	primaryWeaponSelect.addEventListener("change", primaryWeaponChanged, false);
	primaryWeaponIAS.addEventListener("change", primaryWeaponIASChanged, false);
	secondaryWeaponSelect.addEventListener("change", secondaryWeaponChanged, false);
	secondaryWeaponIAS.addEventListener("change", secondaryWeaponIASChanged, false);
	wsmBugged.addEventListener("change", wsmBuggedChanged, false);
	isOneHanded.addEventListener("change", isOneHandedChanged, false);
	gearIAS.addEventListener("change", gearIASChanged, false);
	skillSelect.addEventListener("change", skillChanged, false);
	fanaticismLevelInput.addEventListener("change", fanaticismChanged, false);
	burstOfSpeedLevelInput.addEventListener("change", burstOfSpeedChanged, false);
	werewolfLevelInput.addEventListener("change", werewolfChanged, false);
	frenzyLevelInput.addEventListener("change", frenzyChanged, false);
	holyFreezeLevelInput.addEventListener("change", holyFreezeChanged, false);
	decrepify.addEventListener("change", decrepifyChanged, false);
	noNegativeValues(primaryWeaponIAS);
	noNegativeValues(gearIAS);
	noNegativeValues(fanaticismLevelInput);
	noNegativeValues(burstOfSpeedLevelInput);
	noNegativeValues(werewolfLevelInput);
	noNegativeValues(frenzyLevelInput);
	noNegativeValues(holyFreezeLevelInput);

	setPrimaryWeapons();
	setSkills();
	displayFrames();

	function showByChanged() {
		let newShowBy = document.querySelector('input[name="showBy"]:checked').value;
		if (showBy == newShowBy) return;
		showBy = newShowBy;
		switch (showBy) {
			case SHOW_BY_IAS:
				hideElement(gearIASContainer);
				maxAccelerationIncrease = isCharacterSelected() ? MAX_IAS_ACCELERATION_CHARACTER : MAX_IAS_ACCELERATION_MERCENARY;
				break;
			case SHOW_BY_PRIMARY_WEAPON_IAS:
			case SHOW_BY_SECONDARY_WEAPON_IAS:
				maxAccelerationIncrease = MAX_IAS_ACCELERATION_WEAPON;
				break;
			case SHOW_BY_FANATICISM:
				hideElement(fanaticismContainer);
				maxAccelerationIncrease = FANATICISM.max;
				break;
			case SHOW_BY_BURST_OF_SPEED:
				hideElement(burstOfSpeedContainer);
				maxAccelerationIncrease = BURST_OF_SPEED.max;
				break;
			case SHOW_BY_WEREWOLF:
				hideElement(werewolfContainer);
				maxAccelerationIncrease = WEREWOLF_AS.max;
			case SHOW_BY_FRENZY:
				hideElement(frenzyContainer);
				maxAccelerationIncrease = FRENZY_AS.max;
				break;
		}
		if (showBy != SHOW_BY_IAS) {
			unhideElement(gearIASContainer);
		}
		if (showBy != SHOW_BY_FANATICISM) {
			unhideElement(fanaticismContainer);
		}
		if (showBy != SHOW_BY_BURST_OF_SPEED && character == ASSASSIN) {
			unhideElement(burstOfSpeedContainer);
		}
		if (showBy != SHOW_BY_WEREWOLF && form == WEREWOLF) {
			unhideElement(werewolfContainer);
		}
		if (showBy != SHOW_BY_FRENZY && character == BARBARIAN) {
			unhideElement(frenzyContainer);
		}
		displayFrames();
	}

	function showingBySkill() {
		return showBy == SHOW_BY_FANATICISM || showBy == SHOW_BY_BURST_OF_SPEED || showBy == SHOW_BY_WEREWOLF || showBy == SHOW_BY_FRENZY;
	}

	function getShowingBySkill() {
		switch(showBy) {
			case SHOW_BY_FANATICISM:
				return FANATICISM;
			case SHOW_BY_BURST_OF_SPEED:
				return BURST_OF_SPEED;
			case SHOW_BY_WEREWOLF:
				return WEREWOLF_AS;
			case SHOW_BY_FRENZY:
				return FRENZY_AS;
		}
		return null;
	}

	function characterChanged() {
		character = parseInt(characterSelect.value);

		if (isCharacterSelected()) {

			if (showBy == SHOW_BY_IAS) {
				maxAccelerationIncrease = MAX_IAS_ACCELERATION_CHARACTER;
			}

			unhideElement(formSelectContainer);

		} else {

			if (showBy == SHOW_BY_IAS) {
				maxAccelerationIncrease = MAX_IAS_ACCELERATION_MERCENARY;
			}

			hideElement(formSelectContainer);
			if (form != HUMAN) {
				formSelect.value = HUMAN;
				formChanged();
			}
		}

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
			unhideElement(showByBurstOfSpeedContainer);
		} else {
			hideElement(burstOfSpeedContainer);
			hideElement(showByBurstOfSpeedContainer);
			if (showBy == SHOW_BY_BURST_OF_SPEED) {
				showByIAS.checked = true;
				showByChanged();
			}
		}

		if (character == BARBARIAN) {
			unhideElement(frenzyContainer);
			unhideElement(showByFrenzyContainer);
		} else {
			hideElement(frenzyContainer);
			hideElement(showByFrenzyContainer);
			if (showBy == SHOW_BY_FRENZY) {
				showByIAS.checked = true;
				showByChanged();
			}
		}

		if (character != BARBARIAN && character != ASSASSIN) {
			hideElement(secondaryWeaponContainer);
			isDualWielding = false;
		}

		let primaryWeaponType = primaryWeapon.type;
		if ((character == ASSASSIN && primaryWeaponType == CLAW) || (character == BARBARIAN && (primaryWeaponType == ONE_HANDED_SWINGING || primaryWeaponType == ONE_HANDED_THRUSTING || primaryWeaponType == TWO_HANDED_SWORD))) {
			unhideElement(secondaryWeaponContainer);
			setSecondaryWeapons();
		} else {
			hideElement(secondaryWeaponContainer);
			isDualWielding = false;
		}

		setPrimaryWeapons();
		setSkills();
		displayFrames();
	}

	function formChanged() {
		form = formSelect.value;
		if (form == HUMAN) {
			hideElement(primaryWeaponIASContainer);
		} else {
			unhideElement(primaryWeaponIASContainer);
		}
		if (form == WEREWOLF) {
			unhideElement(showByWerewolfContainer);
			unhideElement(werewolfContainer);
		} else {
			hideElement(werewolfContainer);
			hideElement(showByWerewolfContainer);
			if (showBy == SHOW_BY_WEREWOLF) {
				showByIAS.checked = true;
				showByChanged();
			}
		}
		setSkills();
		displayFrames();
	}

	function primaryWeaponChanged() {
		primaryWeapon = WEAPONS.get(primaryWeaponSelect.value);
		let type = primaryWeapon.type;

		if (character == BARBARIAN && type == TWO_HANDED_SWORD && !isDualWielding) {
			unhideElement(isOneHandedContainer);
		} else {
			hideElement(isOneHandedContainer);
		}

		if ((character == ASSASSIN && type == CLAW) || (character == BARBARIAN && (type == ONE_HANDED_SWINGING || type == ONE_HANDED_THRUSTING || type == TWO_HANDED_SWORD))) {
			unhideElement(secondaryWeaponContainer);
			setSecondaryWeapons();
		} else {
			hideElement(secondaryWeaponContainer);
			isDualWielding = false;
		}

		setSkills();

		displayFrames();
	}

	function secondaryWeaponChanged() {
		secondaryWeapon = WEAPONS.get(secondaryWeaponSelect.value);

		if (secondaryWeapon.type != UNARMED) {
			isDualWielding = true;
			hideElement(isOneHandedContainer);
		} else {
			isDualWielding = false;
			if (character == BARBARIAN && primaryWeapon.type == TWO_HANDED_SWORD) {
				unhideElement(isOneHandedContainer);
			} else {
				hideElement(isOneHandedContainer);
			}
		}

		setSkills();

		displayFrames();
	}

	function isOneHandedChanged() {
		displayFrames();
	}

	function gearIASChanged() {
		displayFrames();
	}

	function skillChanged() {
		skill = skillSelect.value;

		if (skill == WHIRLWIND) {
			hideElement(showByContainer);
			hideElement(fanaticismContainer);
			hideElement(burstOfSpeedContainer);
			hideElement(frenzyContainer);
			hideElement(holyFreezeContainer);
		} else {
			unhideElement(showByContainer);
			unhideElement(fanaticismContainer);
			if (character == ASSASSIN) unhideElement(burstOfSpeedContainer);
			if (character == BARBARIAN) unhideElement(frenzyContainer);
			unhideElement(holyFreezeContainer);
		}

		displayFrames();
	}

	function primaryWeaponIASChanged() {
		displayFrames();
	}

	function fanaticismChanged() {
		displayFrames();
	}

	function burstOfSpeedChanged() {
		displayFrames();
	}

	function werewolfChanged() {
		displayFrames();
	}

	function frenzyChanged() {
		displayFrames();
	}

	function holyFreezeChanged() {
		displayFrames();
	}

	function decrepifyChanged() {
		displayFrames();
	}

	function secondaryWeaponIASChanged() {
		displayFrames();
	}

	function wsmBuggedChanged() {
		if (isDualWielding) displayFrames();
	}

	function setPrimaryWeapons() {
		let previousValue = primaryWeaponSelect.value;
		let reselect = false;
		clear(primaryWeaponSelect);
		for (const weapon of WEAPONS.values()) {
			if (canBeEquipped(weapon)) {
				primaryWeaponSelect.add(createOption(weapon.name));
				if (previousValue == weapon.name) reselect = true;
			}
		}
		if (reselect) {
			primaryWeaponSelect.value = previousValue;
		} else {
			primaryWeaponChanged();
		}
	}

	function setSecondaryWeapons() {
		let previousValue = secondaryWeaponSelect.value;
		let reselect = false;
		clear(secondaryWeaponSelect);
		secondaryWeaponSelect.add(createOption("None"));
		if (character == BARBARIAN) {
			for (const weapon of WEAPONS.values()) {
				if ((weapon.type.isOneHand && weapon.type != CLAW) || weapon.type == TWO_HANDED_SWORD) {
					if (canBeEquipped(weapon)) {
						secondaryWeaponSelect.add(createOption(weapon.name));
						if (previousValue == weapon.name) reselect = true;
					}
				}
			}
		} else if (character == ASSASSIN) {
			for (const weapon of WEAPONS.values()) {
				if (weapon.type == CLAW) {
					secondaryWeaponSelect.add(createOption(weapon.name));
					if (previousValue == weapon.name) reselect = true;
				}
			}
		}
		if (reselect) {
			secondaryWeaponSelect.value = previousValue;
		} else {
			secondaryWeaponChanged();
		}
	}

	function setSkills() {

		let type = primaryWeapon.type;

		let currentSkills = [STANDARD];

		clear(skillSelect);

		if (form == HUMAN && (type == ONE_HANDED_THRUSTING || type == THROWING)) {
			currentSkills.push(THROW);
		}

		switch (parseInt(character)) {
			case AMAZON:
				if (form == HUMAN) {
					if (type == BOW || type == CROSSBOW) {
						currentSkills.push(STRAFE);
					} else if (type == ONE_HANDED_THRUSTING || type == TWO_HANDED_THRUSTING) {
						currentSkills.push(JAB);
						currentSkills.push(IMPALE);
						currentSkills.push(FEND);
					}
				}
				break;
			case ASSASSIN:
				if (form == HUMAN) {
					currentSkills.push(LAYING_TRAPS);
					currentSkills.push(DRAGON_TALON);
					if (type.isMelee) {
						currentSkills.push(TIGER_STRIKE);
						currentSkills.push(COBRA_STRIKE);
						currentSkills.push(PHOENIX_STRIKE);
					}
					if (type == CLAW || type == UNARMED) {
						currentSkills.push(FISTS_OF_FIRE);
						currentSkills.push(CLAWS_OF_THUNDER);
						currentSkills.push(BLADES_OF_ICE);
					}
					currentSkills.push(DRAGON_TAIL);
					if (type == CLAW && isDualWielding) {
						currentSkills.push(DRAGON_CLAW);
					}
					if (type == CLAW) {
						currentSkills.push(WHIRLWIND);
					}
				}
				break;
			case BARBARIAN:
				if (form == HUMAN) {
					if (type.isMelee) {
						if (isDualWielding) {
							currentSkills.push(FRENZY);
							currentSkills.push(DOUBLE_SWING);
						}
						currentSkills.push(WHIRLWIND);
						currentSkills.push(CONCENTRATE);
						currentSkills.push(BERSERK);
						currentSkills.push(BASH);
						currentSkills.push(STUN);
					}
					if ((type == ONE_HANDED_THRUSTING || type == THROWING) && isDualWielding && (secondaryWeapon.type == ONE_HANDED_THRUSTING || secondaryWeapon.type == TWO_HANDED_THRUSTING)) {
						currentSkills.push(DOUBLE_THROW);
					}
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
				if (form == HUMAN && type.isMelee) {
					if (type.isOneHand) currentSkills.push(SMITE);
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
			!(primaryWeapon.type == UNARMED || primaryWeapon.type == BOW || primaryWeapon.type == CROSSBOW || primaryWeapon.type == CLAW)) {
			currentSkills.push(ZEAL);
		}

		currentSkills.forEach(skill => skillSelect.add(createOption(skill)));

		if (!currentSkills.includes(skill)) {
			skillChanged();
		} else {
			skillSelect.value = skill;
		}


	}

	function getWeaponIAS(isPrimary) {
		return isPrimary ? parseInt(primaryWeaponIAS.value) : parseInt(secondaryWeaponIAS.value);
	}

	function displayFrames() {

		removeAllChildNodes(tableContainer);

		if (form != HUMAN) {
			displayWereformTables();
		} else if (skill == FRENZY) {
			displayFrenzyTable();
		} else if (skill == WHIRLWIND) {
			displayWhirlwindTable(true);
			if (isDualWielding) displayWhirlwindTable(false);
		} else if (skill == STRAFE) {
			displayStrafeTable();
		} else if (skill == FEND || skill == ZEAL || skill == DRAGON_TALON) {
			displaySimpleRollbackTable();
		}
		else {

			displayStandardTable(true, false);
			if (skill == STANDARD) {
				if (primaryWeapon.type.hasAlternateAnimation(character)) displayStandardTable(true, true);
				if (isDualWielding) displayStandardTable(false, false);
			}

		}

	}

	function displayTable(breakpoints) {
		let table = document.createElement("table");
		table.className = "table";
		tableContainer.appendChild(table);

		for (const [showByIndex, FPA] of breakpoints) {
			addTableRow(table, showByIndex, FPA);
		}
	}

	function displayWereformTables() {

		console.log(" -- start displayWereformTables -- ");

		let weapon = primaryWeapon;
		let weaponType = weapon.type;
		let WSM = weapon.WSM; // TODO possibly experiment
		let animationSpeed = calculateAnimationSpeed(weaponType);
		let wIAS = getWeaponIAS(true);
		let wEIAS = convertIAStoEIAS(wIAS);
		let EIAS = calculateEIAS(WSM, wIAS);

		console.log("animationSpeed: " + animationSpeed);
		console.log("WSM: " + WSM);
		console.log("wIAS: " + wIAS);
		console.log("EIAS: " + EIAS);

		let framesPerDirection0 = calculateFramesPerDirection(weaponType);
		let framesPerDirection1 = 0;
		let framesPerDirection2 = 0;
		let framesPerDirection3 = 13;
		if (form == WEREWOLF) {
			if (skill == FERAL_RAGE || skill == FURY) framesPerDirection1 = 7;
			else if (skill == RABIES) framesPerDirection1 = 10;
			else framesPerDirection1 = 13;
			framesPerDirection2 = 9;
		} else {
			if (skill == HUNGER) framesPerDirection1 = 10;
			else framesPerDirection1 = 12;
			framesPerDirection2 = 10;
		}

		let accelerationModifier = Math.floor(256 * framesPerDirection2 /
			Math.floor(256 * framesPerDirection0 / Math.floor((100 + wIAS - WSM) * animationSpeed / 100)));
		console.log("accelerationModifier: " + accelerationModifier);

		let offset = skill == FERAL_RAGE || skill == FURY ? 0 : 1;
		let accelerationTable = new Map();

		let temp = 0;
		for (let acceleration = 0; acceleration <= maxAccelerationIncrease; acceleration++) {
			let frameLengthDivisor = Math.floor(accelerationModifier * limitEIAS(EIAS + acceleration) / 100);
			let FPA = Math.ceil(256 * framesPerDirection1 / frameLengthDivisor) - offset;
			if (skill == FURY) {
				let FPA2 = Math.ceil(256 * framesPerDirection3 / frameLengthDivisor) - 1;
				if (temp != FPA + FPA2) {
					temp = FPA + FPA2;
					accelerationTable.set(acceleration + wEIAS, "(" + FPA + ")/" + FPA2);
					console.log("acceleration=" + acceleration + ",FPA=" + FPA + ",FPA2=" + FPA2);
				}
			} else {
				if (skill == FERAL_RAGE) {
					FPA += Math.ceil((256 * framesPerDirection3 - FPA * frameLengthDivisor) / (2 * frameLengthDivisor)) - 1;
				}
				if (temp != FPA) {
					temp = FPA;
					accelerationTable.set(acceleration + wEIAS, FPA);
					console.log("acceleration=" + acceleration + ",FPA=" + FPA);
				}
			}
		}

		displayBreakpoints(accelerationTable);

		console.log(" -- end displayWereformTables -- ");
	}

	function displayStandardTable(isPrimary, isAlternate) {

		console.log(" -- start displayStandardTable for isPrimary=" + isPrimary + ",isAlternate=" + isAlternate + " -- ");

		let weapon = isPrimary ? primaryWeapon : secondaryWeapon;
		let weaponType = weapon.type;
		// offhands are hardcoded to 12 framesPerDirection ? TODO does this switch with wsm bugging?
		let framesPerDirection = isPrimary ? (isAlternate ? weaponType.getAlternateFramesPerDirection(character) : calculateFramesPerDirection(weaponType)) : 12;
		let animationSpeed = calculateAnimationSpeed(weaponType);
		let startingFrame = getStartingFrame(weaponType);
		let WSM = getWSM(isPrimary);
		let EIAS = calculateEIAS(WSM, 0);
		let offset = skill == IMPALE || skill == JAB || skill == FISTS_OF_FIRE || skill == CLAWS_OF_THUNDER
			|| skill == BLADES_OF_ICE || skill == DRAGON_CLAW || skill == DOUBLE_SWING
			|| skill == DOUBLE_THROW ? 0 : 1;

		console.log("framesPerDirection: " + framesPerDirection);
		console.log("animationSpeed: " + animationSpeed);
		console.log("startingFrame: " + startingFrame);
		console.log("WSM: " + WSM);
		console.log("EIAS: " + EIAS);

		let accelerationTable = new Map();

		let temp = 0;
		for (let acceleration = 0; acceleration <= maxAccelerationIncrease; acceleration++) {
			let frameLengthDivisor = Math.floor(animationSpeed * limitEIAS(EIAS + acceleration) / 100);
			let FPA = Math.ceil(256 * (framesPerDirection - startingFrame) / frameLengthDivisor) - offset;
			if (temp != FPA) {
				temp = FPA;
				accelerationTable.set(acceleration, FPA);
				console.log("acceleration=" + acceleration + ",FPA=" + FPA);
			}
		}

		displayBreakpoints(accelerationTable);

		console.log(" -- end displayStandardTable for isPrimary=" + isPrimary + ",isAlternate=" + isAlternate + " -- ");

	}

	function displayFrenzyTable() {

		console.log(" -- start displayFrenzyTables -- ");

		let framesPerDirection1 = 9; // not sure why this is 9, its not a standard framesPerDirection and doesnt seem to be an action frame. startingFrame for frenzy would always be 0, so thats not a factor.
		let framesPerDirection2 = getSequence();
		let animationSpeed = 256;
		console.log("framesPerDirection1: " + framesPerDirection1);
		console.log("framesPerDirection2: " + framesPerDirection2);
		console.log("animationSpeed: " + animationSpeed);

		// frenzy seems to have its own way of calculating WSM
		let averageWSM = parseInt((primaryWeapon.WSM + secondaryWeapon.WSM) / 2); // TODO might be wrong
		let primaryWSM = wsmBugged.checked ? primaryWeapon.WSM - secondaryWeapon.WSM + averageWSM : primaryWeapon.WSM + secondaryWeapon.WSM - averageWSM;
		let secondaryWSM = wsmBugged.checked ? averageWSM : 2 * secondaryWeapon.WSM - averageWSM;
		console.log("primaryWSM: " + primaryWSM);
		console.log("secondaryWSM: " + secondaryWSM);

		let primaryEIAS = calculateEIAS(primaryWSM, getWeaponIAS(true));
		let secondaryEIAS = calculateEIAS(secondaryWSM, getWeaponIAS(false));
		console.log("primaryEIAS: " + primaryEIAS);
		console.log("secondaryEIAS: " + secondaryEIAS);

		let accelerationTable = new Map();

		let temp = 0;
		for (let acceleration = 0; acceleration <= maxAccelerationIncrease; acceleration++) {
			let acceleration1 = showBy == SHOW_BY_SECONDARY_WEAPON_IAS ? 0 : acceleration;
			let acceleration2 = showBy == SHOW_BY_PRIMARY_WEAPON_IAS ? 0 : acceleration;
			let frameLengthDivisor1 = Math.floor(animationSpeed * limitEIAS(primaryEIAS + acceleration1) / 100);
			let frameLengthDivisor2 = Math.floor(animationSpeed * limitEIAS(secondaryEIAS + acceleration2) / 100);
			let FPA = Math.ceil(256 * framesPerDirection1 / frameLengthDivisor1) - 1;
			let FPA2 = Math.ceil((256 * framesPerDirection2 - FPA * frameLengthDivisor1) / frameLengthDivisor2);
			if (temp != FPA + FPA2) {
				temp = FPA + FPA2;
				accelerationTable.set(acceleration, FPA + "/" + FPA2);
				console.log("acceleration=" + acceleration + ",FPA=" + FPA + ",FPA2=" + FPA2);
			}
		}

		displayBreakpoints(accelerationTable);

		console.log(" -- end displayFrenzyTables -- ");

	}

	/**
	 * Fend, Dragon Talon, and Zeal
	 */
	function displaySimpleRollbackTable() {

		console.log(" -- start displaySimpleRollbackTable -- ");

		let weapon = primaryWeapon;
		let weaponType = weapon.type;
		let framesPerDirection1 = calculateActionFrame(weaponType);
		let framesPerDirection2 = calculateFramesPerDirection(weaponType);
		let animationSpeed = calculateAnimationSpeed(weaponType);
		let startingFrame = getStartingFrame(weaponType);
		let WSM = getWSM(true);
		let EIAS = calculateEIAS(WSM, 0);
		let rollbackFactor = skill == FEND ? 40 : 0;
		console.log("framesPerDirection1: " + framesPerDirection1);
		console.log("framesPerDirection2: " + framesPerDirection2);
		console.log("animationSpeed: " + animationSpeed);
		console.log("startingFrame: " + startingFrame);
		console.log("WSM: " + WSM);
		console.log("EIAS: " + EIAS);
		console.log("rollbackFactor: " + rollbackFactor);

		let accelerationTable = new Map();

		let temp = 0;
		for (let acceleration = 0; acceleration <= maxAccelerationIncrease; acceleration++) {
			let frameLengthDivisor = Math.floor(animationSpeed * limitEIAS(EIAS + acceleration) / 100);
			let FPA = Math.ceil(256 * (framesPerDirection1 - startingFrame) / frameLengthDivisor);
			let rollback = Math.floor(Math.floor((256 * startingFrame + frameLengthDivisor * FPA) / 256) * rollbackFactor / 100);
			let FPA2 = Math.ceil(256 * (framesPerDirection1 - rollback) / frameLengthDivisor);
			rollback = Math.floor(Math.floor((256 * rollback + frameLengthDivisor * FPA2) / 256) * rollbackFactor / 100);
			let FPA3 = Math.ceil(256 * (framesPerDirection2 - rollback) / frameLengthDivisor) - 1;
			if (temp != FPA + FPA2 + FPA3) {
				temp = FPA + FPA2 + FPA3;
				accelerationTable.set(acceleration, FPA + "+(" + FPA2 + ")+" + FPA3);
				console.log("acceleration=" + acceleration + ",FPA=" + FPA + ",FPA2=" + FPA2 + ",FPA3=" + FPA3);
			}
		}

		displayBreakpoints(accelerationTable);

		console.log(" -- end displaySimpleRollbackTable -- ");

	}

	function displayStrafeTable() {

		console.log(" -- start displayStrafeTable -- ");

		let weapon = primaryWeapon;
		let weaponType = weapon.type;
		let framesPerDirection1 = calculateActionFrame(weaponType);
		let framesPerDirection2 = calculateFramesPerDirection(weaponType);
		let animationSpeed = calculateAnimationSpeed(weaponType);
		let startingFrame = getStartingFrame(weaponType);
		let WSM = weapon.WSM;
		let EIAS = calculateEIAS(WSM, 0);
		let rollbackFactor = 50;
		console.log("framesPerDirection: " + framesPerDirection);
		console.log("animationSpeed: " + animationSpeed);
		console.log("startingFrame: " + startingFrame);
		console.log("WSM: " + WSM);
		console.log("EIAS: " + EIAS);
		console.log("rollbackFactor: " + rollbackFactor);

		let accelerationEvenTable = new Map();
		let accelerationOddTable = new Map();

		let tempEven = new Array(4);
		let tempOdd = new Array(5);
		for (let acceleration = 0; acceleration <= maxAccelerationIncrease; acceleration++) {
			let frameLengthDivisor = Math.floor(animationSpeed * limitEIAS(EIAS + acceleration) / 100);
			let FPA = Math.ceil(256 * (framesPerDirection1 - startingFrame) / frameLengthDivisor);
			let rollback = Math.floor(Math.floor((256 * startingFrame + frameLengthDivisor * FPA) / 256) * rollbackFactor / 100);
			let FPA2 = Math.ceil(256 * (framesPerDirection1 - rollback) / frameLengthDivisor);
			let rollback2 = Math.floor(Math.floor((256 * rollback + frameLengthDivisor * FPA2) / 256) * rollbackFactor / 100);
			let FPA3 = Math.ceil(256 * (framesPerDirection1 - rollback2) / frameLengthDivisor);
			let rollback3 = Math.floor(Math.floor((256 * rollback2 + frameLengthDivisor * FPA3) / 256) * rollbackFactor / 100);
			let FPA4 = Math.ceil(256 * (framesPerDirection1 - rollback3) / frameLengthDivisor);
			let rollback4 = Math.floor(Math.floor((256 * rollback3 + frameLengthDivisor * FPA4) / 256) * rollbackFactor / 100);
			let evenFPA =  Math.ceil(256 * (framesPerDirection2 - rollback3) / frameLengthDivisor);
			let oddFPA =  Math.ceil(256 * (framesPerDirection2 - rollback4) / frameLengthDivisor);
			if (tempEven[0] != FPA || tempEven[1] != FPA2 || tempEven[2] != FPA3 || tempEven[3] != evenFPA) {
				tempEven[0] = FPA;
				tempEven[1] = FPA2;
				tempEven[2] = FPA3;
				tempEven[3] = evenFPA;
				if (FPA2 == FPA4) {
					if (FPA2 == FPA3) {
						accelerationEvenTable.set(acceleration, FPA + "+(" + FPA2 + ")+" + evenFPA);
					} else {
						accelerationEvenTable.set(acceleration, FPA + "+(" + FPA2 + "+" + FPA3 + ")+" + evenFPA);
					}
				} else {
					accelerationEvenTable.set(acceleration, FPA + "+" + FPA2 + "+(" + FPA3 + ")+" + evenFPA);
				}
				console.log("(even) acceleration=" + acceleration + ",FPA=" + FPA + ",FPA2=" + FPA2 + ",FPA3=" + FPA3 + ",FPA4=" + FPA4 + ",evenFPA=" + evenFPA);
			}
			if (tempOdd[0] != FPA || tempOdd[1] != FPA2 || tempOdd[2] != FPA3 || tempOdd[3] != FPA4 || tempOdd[4] != oddFPA) {
				tempOdd[0] = FPA;
				tempOdd[1] = FPA2;
				tempOdd[2] = FPA3;
				tempOdd[3] = FPA4;
				tempOdd[4] = oddFPA;
				if (rollback2 == rollback3) {
					accelerationOddTable.set(acceleration, FPA + "+(" + FPA2 + ")+" + oddFPA);
				} else if (rollback2 == rollback4) {
					accelerationOddTable.set(acceleration, FPA + "+" + FPA2 + "+(" + FPA3 + "+" + FPA4 + ")+" + oddFPA);
				} else {
					accelerationEvenTable.set(acceleration, FPA + "+" + FPA2 + "+(" + FPA3 + ")+" + oddFPA);
				}
				console.log("(odd) acceleration=" + acceleration + ",FPA=" + FPA + ",FPA2=" + FPA2 + ",FPA3=" + FPA3 + ",FPA4=" + FPA4 + ",oddFPA=" + oddFPA);
			}
		}

		displayBreakpoints(accelerationTable);

		console.log(" -- end displayStrafeTable -- ");

	}

	function calculateEIAS(WSM, wIAS) {
		let SIAS = calculateSIAS();
		console.log("SIAS: " + SIAS);
		let IAS = wIAS;
		if (showBy != SHOW_BY_IAS) IAS += parseInt(gearIAS.value);
		let IAS_EIAS = convertIAStoEIAS(IAS);
		return limitEIAS(100 + SIAS - WSM + IAS_EIAS);
	}

	function convertIAStoEIAS(IAS) {
		return Math.floor(120 * IAS / (120 + IAS));
	}

	function convertEIAStoIAS(EIAS) {
		return Math.ceil(120 * EIAS / (120 - EIAS));
	}

	function getWSM(isPrimary) {
		if (!isDualWielding) return primaryWeapon.WSM;
		let primaryWSM = primaryWeapon.WSM;
		let secondaryWSM = secondaryWeapon.WSM;
		let averageWSM = parseInt((primaryWSM + secondaryWSM) / 2); // TODO might be wrong
		if (wsmBugged.checked) {
			return isPrimary ? averageWSM - secondaryWSM + primaryWSM : averageWSM;
		} else {
			return isPrimary ? averageWSM : averageWSM - primaryWSM + secondaryWSM;
		}
		/*return (wsmBugged.checked && !isPrimary) ?
			averageWSM - (isPrimary ? secondaryWSM : primaryWSM) + (isPrimary ? primaryWSM : secondaryWSM)
			: averageWSM;*/
	}

	function displayWhirlwindTable(isPrimary) {

		console.log(" -- start displayWhirlwindTable for isPrimary=" + isPrimary + " -- ");

		let weapon = isPrimary? primaryWeapon : secondaryWeapon;
		let framesPerDirection = calculateFramesPerDirection(weapon.type);
		let animationSpeed = calculateAnimationSpeed(weapon.type);
		let WSM = getWSM(isPrimary);
		let EIAS = 100 - WSM;

		console.log("framesPerDirection: " + framesPerDirection);
		console.log("animationSpeed: " + animationSpeed);
		console.log("WSM: " + WSM);
		console.log("EIAS: " + EIAS);

		let accelerationTable = new Map();

		let temp = 0;
		for (let acceleration = 0; acceleration <= MAX_IAS_WEAPON; acceleration++) {
			let frameLengthDivisor = Math.floor(animationSpeed * limitEIAS(EIAS + acceleration) / 100);
			let FPA = Math.ceil(256 * framesPerDirection / frameLengthDivisor) - 1;
			FPA = calculateWhirlwindFPA(FPA);
			if (temp != FPA) {
				temp = FPA;
				accelerationTable.set(acceleration, FPA);
				console.log("acceleration=" + acceleration + ",FPA=" + FPA);
				if (FPA == 4) break;
			}
		}

		displayBreakpoints(accelerationTable);

		console.log(" -- end displayWhirlwindTable for isPrimary=" + isPrimary + " -- ");

	}

	function displayBreakpoints(table) {

		let newTable = new Map();

		if (skill == WHIRLWIND) displayTable(table);
		else if (showingBySkill()) {
			let skill = getShowingBySkill();
			for (const [accelerationNeeded, FPA] of table) {
				let level = skill.getLevelFromEIAS(accelerationNeeded);
				newTable.set(level, FPA);
				console.log("acceleration=" + accelerationNeeded + ",FPA=" + FPA + ",level=" + level);
			}
			
		} else if (showBy == SHOW_BY_IAS) {
			for (const [accelerationNeeded, FPA] of table) {
				let IAS = convertEIAStoIAS(accelerationNeeded);
				if (form != HUMAN) IAS -= getWeaponIAS(true);
				if (IAS < 0) IAS = 0;
				newTable.set(IAS, FPA);
			}
		} else {
			console.log("conversion not yet implemented");
		}

		displayTable(newTable);
	}

	function isCharacterSelected() {
		return character == AMAZON || character == ASSASSIN || character == BARBARIAN
			|| character == DRUID || character == NECROMANCER || character == PALADIN || character == SORCERESS; // readability
	}

	function calculateFramesPerDirection(weaponType) {

		if (character == BARBARIAN && weaponType == TWO_HANDED_SWORD && (isOneHanded.checked || isDualWielding)) weaponType = ONE_HANDED_SWINGING;

		let framesPerDirection = weaponType.getFramesPerDirection(character);

		if (skill == THROW) {
			framesPerDirection = THROWING.getFramesPerDirection(character);
		} else if (skill == DRAGON_TAIL || skill == DRAGON_TALON) {
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
				framesPerDirection = getSequence(weaponType);
			}
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

	function calculateSIAS() {

		let SIAS = FANATICISM.calculate(showBy) + BURST_OF_SPEED.calculate(showBy) + WEREWOLF_AS.calculate(showBy) + FRENZY_AS.calculate(showBy) - HOLY_FREEZE.calculate(showBy);

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

	function limitEIAS(EIAS) {
		return Math.max(EIAS_MIN, Math.min(EIAS_MAX, EIAS));
	}

	function getSequence(weaponType) {
		if (skill == DOUBLE_THROW) return 12;
		if (skill == DOUBLE_SWING || skill == FRENZY) return 17;
		if (skill == FISTS_OF_FIRE || skill == CLAWS_OF_THUNDER || skill == BLADES_OF_ICE || skill == DRAGON_CLAW) return (weaponType == UNARMED || weaponType == CLAW) ? 12 : 16;
		if (skill == JAB) return weaponType == ONE_HANDED_THRUSTING ? 18 : 21;
		if (weaponType == ONE_HANDED_THRUSTING) return 21;
		if (weaponType == TWO_HANDED_THRUSTING) return 24;
		return 0;
	}

	function getStartingFrame(weaponType) {
		if ((character == AMAZON || character == SORCERESS) && (skill == STANDARD || skill == STRAFE || skill == FEND || skill == ZEAL)) {
			if (weaponType == UNARMED) return 1;
			if (weaponType == ONE_HANDED_SWINGING || weaponType == TWO_HANDED_SWORD || weaponType == ONE_HANDED_THRUSTING
					|| weaponType == TWO_HANDED_THRUSTING || weaponType == TWO_HANDED) return 2;
		}
		return 0;
	}

	function calculateActionFrame(weaponType) {
		if (skill == DRAGON_TALON) return 4;
		if (character == BARBARIAN && weaponType == TWO_HANDED_SWORD && (isOneHanded.checked || isDualWielding)) weaponType = ONE_HANDED_SWINGING;
		return weaponType.getActionFrame(character);
	}

	/**
	 * [calculatedFPA, adjustedFPA]
	 */
	const adjustedWhirlwindFPAs = new Map([
		[11, 4], // 0-11
		[14, 6], // 12-14
		[17, 8], // 15-17
		[19, 10], // 18-19
		[22, 12], // 20-22
		[25, 14] // 23-25
	//  [99, 16] // 26+
	]);

	function calculateWhirlwindFPA(FPA) {
		for (const [calculatedFPA, adjustedFPA] of adjustedWhirlwindFPAs) {
			if (FPA <= calculatedFPA) return adjustedFPA;
		}
		return 16;
	}

	function canBeEquipped(weapon) {
		let name = weapon.name;
		let type = weapon.type;
		if (character == MERC_A1 && type != BOW) return false;
		if (character == MERC_A2 && type != ONE_HANDED_THRUSTING && type != TWO_HANDED_THRUSTING) return false;
		if (character == MERC_A5 && type != ONE_HANDED_SWINGING && type != TWO_HANDED_SWORD) return false; // todo, only swords
		if (character != ASSASSIN && type == CLAW) return false;
		if (character != AMAZON && (
			name == "Stag Bow" || name == "Reflex Bow" || name == "Ashwood Bow" || name == "Ceremonial Bow" || name == "Matriarchal Bow" || name == "Grand Matron Bow" ||
			name == "Maiden Javelin" || name == "Ceremonial Javelin" || name == "Matriarchal Javelin" ||
			name == "Maiden Spear" || name == "Maiden Pike" || name == "Ceremonial Spear" || name == "Ceremonial Pike" || name == "Matriarchal Spear" || name == "Matriarchal Pike"
			)) return false;
		if (character != SORCERESS && (
			name == "Eagle Orb" || name == "Sacred Globe" || name == "Smoked Sphere" || name == "Clasped Orb" || name == "Jared's Stone" ||
			name == "Glowing Orb" || name == "Crystalline Globe" || name == "Cloudy Sphere" || name == "Sparkling Ball" || name == "Swirling Crystal" ||
			name == "Heavenly Stone" || name == "Eldritch Orb" || name == "Demon Heart" || name == "Vortex Orb" || name == "Dimensional Shard"
			)) return false;
		return true;
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

function clear(select) {
	let options = select.options;
	let i, L = options.length - 1;
	for (i = L; i >= 0; i--) {
		select.remove(i);
	}
}

function createOption(value) {
	let option = document.createElement("option");
	option.setAttribute("value", value);
	option.text = value;
	return option;
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

function noNegativeValues(input) {
	input.onkeydown = function (e) { // only allows the input of numbers, no negative signs
		if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8)) {
			return false;
		}
	}
}

class WeaponType {

	constructor(isMelee, isOneHand, frameData) {
		this.isMelee = isMelee;
		this.isOneHand = isOneHand;
		this.frameData = frameData;
	}

	getFramesPerDirection(character) {
		let value = this.frameData.get(character);
		return Array.isArray(value) ? value[0] : value;
	}

	hasAlternateAnimation(character) {
		let characterFrameData = this.frameData.get(character);
		return Array.isArray(characterFrameData) && characterFrameData.length == 3;
	}

	getAlternateFramesPerDirection(character) {
		return this.frameData.get(character)[1];
	}

	getActionFrame(character) {
		let characterFrameData = this.frameData.get(character);
		return characterFrameData[characterFrameData.length - 1];
	}

}

class AttackSpeedSkill {

	constructor(input, min, factor, max, showBy, predicate) {
		this.input = input;
		this.min = min;
		this.factor = factor;
		this.max = max;
		this.showBy = showBy;
		this.predicate = predicate;
		this.reverse = new Map();
		for (let level = 60; level >= 0; level--) {
			this.reverse.set(this.getEIASFromLevel(level), level);
		}
	}

	calculate(showBy) {
		if (this.showBy == showBy || (this.predicate != null && !this.predicate())) return 0;
		let level = parseInt(this.input.value);
		return level == 0 ? 0 : Math.min(this.min + Math.floor(this.factor * Math.floor((110 * level) / (level + 6)) / 100), this.max);
	}

	getEIASFromLevel(level) {
		return level == 0 ? 0 : Math.min(this.min + Math.floor(this.factor * Math.floor((110 * level) / (level + 6)) / 100), this.max);
	}

	getLevelFromEIAS(EIAS) {
		let lastLevel = 60;
		for (const [levelEIAS, level] of this.reverse) {
			if (EIAS > levelEIAS) return lastLevel;
			lastLevel = level;
		}
		return 0;
	}

}

class Weapon {

	constructor(name, WSM, type, itemClass) {
		this.name = name;
		this.WSM = WSM;
		this.type = type;
		this.itemClass = itemClass;
	}

}

const SHOW_BY_IAS = "IAS";
const SHOW_BY_PRIMARY_WEAPON_IAS = "Primary Weapon IAS";
const SHOW_BY_SECONDARY_WEAPON_IAS = "Secondary Weapon IAS";
const SHOW_BY_FANATICISM = "Fanaticism";
const SHOW_BY_BURST_OF_SPEED = "Burst of Speed";
const SHOW_BY_WEREWOLF = "Werewolf";
const SHOW_BY_FRENZY = "Frenzy";

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

const STANDARD = "Standard";
const THROW = "Throw";
const IMPALE = "Impale";
const JAB = "Jab";
const STRAFE = "Strafe";
const FEND = "Fend";
const TIGER_STRIKE = "Tiger Strike";
const COBRA_STRIKE = "Cobra Strike";
const PHOENIX_STRIKE = "Phoenix Strike";
const FISTS_OF_FIRE = "Fists of Fire";
const CLAWS_OF_THUNDER = "Claws of Thunder";
const BLADES_OF_ICE = "Blades of Ice";
const DRAGON_CLAW = "Dragon Claw";
const DRAGON_TAIL = "Dragon Tail";
const DRAGON_TALON = "Dragon Talon";
const LAYING_TRAPS = "Laying Traps";
const DOUBLE_SWING = "Double Swing";
const FRENZY = "Frenzy";
const DOUBLE_THROW = "Double Throw";
const WHIRLWIND = "Whirlwind";
const CONCENTRATE = "Concentrate";
const BERSERK = "Berserk";
const BASH = "Bash";
const STUN = "Stun";
const ZEAL = "Zeal";
const SMITE = "Smite";
const FERAL_RAGE = "Feral Rage";
const HUNGER = "Hunger";
const RABIES = "Rabies";
const FURY = "Fury";
const SACRIFICE = "Sacrifice";
const VENGEANCE = "Vengeance";
const CONVERSION = "Conversion";

const UNARMED = new WeaponType(true, true, new Map([[AMAZON, [13, 8]], [ASSASSIN, [11, 12, 6]], [BARBARIAN, [12, 6]], [DRUID, [16, 8]], [NECROMANCER, [15, 8]], [PALADIN, [14, 7]], [SORCERESS, [16, 9]]]));
const CLAW = new WeaponType(true, true, new Map([[ASSASSIN, [11, 12, 0]]]));
const ONE_HANDED_SWINGING = new WeaponType(true, true, new Map([[AMAZON, [16, 10]], [ASSASSIN, [15, 7]], [BARBARIAN, [16, 7]], [DRUID, [19, 9]], [NECROMANCER, [19, 9]], [PALADIN, [15, 7]], [SORCERESS, [20, 12]], [MERC_A5, 16]]));
const TWO_HANDED_SWORD = new WeaponType(true, false, new Map([[AMAZON, [20, 12]], [ASSASSIN, [23, 11]], [BARBARIAN, [18, 8]], [DRUID, [21, 10]], [NECROMANCER, [23, 11]], [PALADIN, [19, 8]], [SORCERESS, [24, 14]], [MERC_A5, 16]]));
const ONE_HANDED_THRUSTING = new WeaponType(true, true, new Map([[AMAZON, [15, 9]], [ASSASSIN, [15, 7]], [BARBARIAN, [16, 7]], [DRUID, [19, 8]], [NECROMANCER, [19, 9]], [PALADIN, [17, 8]], [SORCERESS, [19, 11]], [MERC_A2, 16]]));
const TWO_HANDED_THRUSTING = new WeaponType(true, false, new Map([[AMAZON, [18, 11]], [ASSASSIN, [23, 10]], [BARBARIAN, [19, 9]], [DRUID, [23, 9]], [NECROMANCER, [24, 10]], [PALADIN, [20, 8]], [SORCERESS, [23, 13]], [MERC_A2, 16]]));
const TWO_HANDED = new WeaponType(true, false, new Map([[AMAZON, [20, 12]], [ASSASSIN, [19, 9]], [BARBARIAN, [19, 9]], [DRUID, [17, 9]], [NECROMANCER, [20, 11]], [PALADIN, [18, 19, 9]], [SORCERESS, [18, 11]], [MERC_A2, 16]])); // two-handed weapon (not sword)
const BOW = new WeaponType(false, false, new Map([[AMAZON, [14, 6]], [ASSASSIN, [16, 7]], [BARBARIAN, [15, 7]], [DRUID, [16, 8]], [NECROMANCER, [18, 9]], [PALADIN, [16, 8]], [SORCERESS, [17, 9]], [MERC_A1, 15]]));
const CROSSBOW = new WeaponType(false, false, new Map([[AMAZON, [20, 9]], [ASSASSIN, [21, 10]], [BARBARIAN, [20, 10]], [DRUID, [20, 10]], [NECROMANCER, [20, 11]], [PALADIN, [20, 10]], [SORCERESS, [20, 11]]]));
const THROWING = new WeaponType(true, true, new Map([[AMAZON, 16], [ASSASSIN, 16], [BARBARIAN, 16], [DRUID, 18], [NECROMANCER, 20], [PALADIN, 16], [SORCERESS, 20]]));

const NONE_IC = "None"; // ic = item class
const AXE = "Axe";
const POLEARM = "Polearm";
const JAVELIN = "Javelin";
const SWORD = "Sword";
const CROSSBOW_IC = "Crossbow";
const BOW_IC = "Bow";
const STAFF = "Staff";
const ORB = "Orb";

const WEAPONS = new Map();
WEAPONS.set("None", new Weapon("None", 0, UNARMED, NONE_IC))
	.set("Ancient Axe", new Weapon("Ancient Axe", 10, TWO_HANDED, AXE))
	.set("Ancient Sword", new Weapon("Ancient Sword", 0, ONE_HANDED_SWINGING, SWORD))
	.set("Arbalest", new Weapon("Arbalest", -10, CROSSBOW, CROSSBOW_IC))
	.set("Archon Staff", new Weapon("Archon Staff", 10, TWO_HANDED, STAFF))
	.set("Ashwood Bow", new Weapon("Ashwood Bow", 0, BOW, BOW_IC))
	.set("Ataghan", new Weapon("Ataghan", -20, ONE_HANDED_SWINGING, SWORD))
	.set("Axe", new Weapon("Axe", 10, ONE_HANDED_SWINGING, AXE))
	.set("Balanced Axe", new Weapon("Balanced Axe", -10, ONE_HANDED_SWINGING, AXE))
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
	.set("Brandistock", new Weapon("Brandistock", -20, TWO_HANDED_THRUSTING))
	.set("Broad Axe", new Weapon("Broad Axe", 0, TWO_HANDED))
	.set("Broad Sword", new Weapon("Broad Sword", 0, ONE_HANDED_SWINGING))
	.set("Burnt Wand", new Weapon("Burnt Wand", 0, ONE_HANDED_SWINGING))
	.set("Caduceus", new Weapon("Caduceus", -10, ONE_HANDED_SWINGING))
	.set("Cedar Bow", new Weapon("Cedar Bow", 0, BOW))
	.set("Cedar Staff", new Weapon("Cedar Staff", 10, TWO_HANDED))
	.set("Ceremonial Bow", new Weapon("Ceremonial Bow", 10, BOW))
	.set("Ceremonial Javelin", new Weapon("Ceremonial Javelin", -10, ONE_HANDED_THRUSTING))
	.set("Ceremonial Pike", new Weapon("Ceremonial Pike", 20, TWO_HANDED_THRUSTING))
	.set("Ceremonial Spear", new Weapon("Ceremonial Spear", 0, TWO_HANDED_THRUSTING))
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
	.set("Fuscina", new Weapon("Fuscina", 0, TWO_HANDED_THRUSTING))
	.set("Ghost Glaive", new Weapon("Ghost Glaive", 20, ONE_HANDED_THRUSTING))
	.set("Ghost Spear", new Weapon("Ghost Spear", 0, TWO_HANDED_THRUSTING))
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
	.set("Hyperion Spear", new Weapon("Hyperion Spear", -10, TWO_HANDED_THRUSTING))
	.set("Jagged Star", new Weapon("Jagged Star", 10, ONE_HANDED_SWINGING))
	.set("Jared's Stone", new Weapon("Jared's Stone", 10, ONE_HANDED_SWINGING))
	.set("Javelin", new Weapon("Javelin", -10, ONE_HANDED_THRUSTING))
	.set("Jo Staff", new Weapon("Jo Staff", -10, TWO_HANDED))
	.set("Katar", new Weapon("Katar", -10, CLAW))
	.set("Knout", new Weapon("Knout", -10, ONE_HANDED_SWINGING))
	.set("Kris", new Weapon("Kris", -20, ONE_HANDED_THRUSTING))
	.set("Lance", new Weapon("Lance", 20, TWO_HANDED_THRUSTING))
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
	.set("Maiden Pike", new Weapon("Maiden Pike", 10, TWO_HANDED_THRUSTING))
	.set("Maiden Spear", new Weapon("Maiden Spear", 0, TWO_HANDED_THRUSTING))
	.set("Mancatcher", new Weapon("Mancatcher", -20, TWO_HANDED_THRUSTING))
	.set("Martel de Fer", new Weapon("Martel de Fer", 20, TWO_HANDED))
	.set("Matriarchal Bow", new Weapon("Matriarchal Bow", -10, BOW))
	.set("Matriarchal Javelin", new Weapon("Matriarchal Javelin", -10, ONE_HANDED_THRUSTING))
	.set("Matriarchal Pike", new Weapon("Matriarchal Pike", 20, TWO_HANDED_THRUSTING))
	.set("Matriarchal Spear", new Weapon("Matriarchal Spear", 0, TWO_HANDED_THRUSTING))
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
	.set("Pike", new Weapon("Pike", 20, TWO_HANDED_THRUSTING))
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
	.set("Spear", new Weapon("Spear", -10, TWO_HANDED_THRUSTING))
	.set("Spetum", new Weapon("Spetum", 0, TWO_HANDED_THRUSTING))
	.set("Spiculum", new Weapon("Spiculum", 20, ONE_HANDED_THRUSTING))
	.set("Spider Bow", new Weapon("Spider Bow", 5, BOW))
	.set("Spiked Club", new Weapon("Spiked Club", 0, ONE_HANDED_SWINGING))
	.set("Stag Bow", new Weapon("Stag Bow", 0, BOW))
	.set("Stalagmite", new Weapon("Stalagmite", 10, TWO_HANDED))
	.set("Stiletto", new Weapon("Stiletto", -10, ONE_HANDED_THRUSTING))
	.set("Stygian Pike", new Weapon("Stygian Pike", 0, TWO_HANDED_THRUSTING))
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
	.set("Trident", new Weapon("Trident", 0, TWO_HANDED_THRUSTING))
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
	.set("War Fork", new Weapon("War Fork", -20, TWO_HANDED_THRUSTING))
	.set("War Hammer", new Weapon("War Hammer", 20, ONE_HANDED_SWINGING))
	.set("War Javelin", new Weapon("War Javelin", -10, ONE_HANDED_THRUSTING))
	.set("War Pike", new Weapon("War Pike", 20, TWO_HANDED_THRUSTING))
	.set("War Scepter", new Weapon("War Scepter", -10, ONE_HANDED_SWINGING))
	.set("War Scythe", new Weapon("War Scythe", -10, TWO_HANDED))
	.set("War Spear", new Weapon("War Spear", -10, TWO_HANDED_THRUSTING))
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
	.set("Yari", new Weapon("Yari", 0, TWO_HANDED_THRUSTING))
	.set("Yew Wand", new Weapon("Yew Wand", 10, ONE_HANDED_SWINGING))
	.set("Zweihander", new Weapon("Zweihander", -10, TWO_HANDED_SWORD));
