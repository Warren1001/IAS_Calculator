window.addEventListener("load", load, false);

const EIAS_MAX = 175; // for a brief period of D2R, this limit did not exist. rip bugged ias frames :(
const EIAS_MIN = 15;

function load() {
	
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
	let wsmBugged = false;
	let showBy = SHOW_BY_IAS;
	let maxAccelerationIncrease = MAX_IAS_ACCELERATION_CHARACTER; // TODO
	
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

		} else {

			if (showBy == SHOW_BY_IAS) {
				maxAccelerationIncrease = MAX_IAS_ACCELERATION_MERCENARY;
			}

			hideElement(formSelectContainer);
			formSelect.value = HUMAN;
			formChanged();
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
			hideElement(fanaticismContainer);
			hideElement(frenzyContainer);
			hideElement(holyFreezeContainer);
		} else {
			unhideElement(fanaticismContainer);
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

	function setPrimaryWeapons() {

		if (character == ASSASSIN) {
			for (const weapon of WEAPONS.values()) {
				primaryWeaponSelect.add(createOption(weapon.name));
			}
		} else {
			for (const weapon of WEAPONS.values()) { // todo class only weapons
				if (weapon.type != CLAW) primaryWeaponSelect.add(createOption(weapon.name));
			}
		}

	}

	function setSecondaryWeapons() {
		let previousValue = secondaryWeaponSelect.value; // TODO
		clear(secondaryWeaponSelect);
		if (character == BARBARIAN) {
			for (const weapon of WEAPONS.values()) {
				if ((weapon.type.isOneHand && weapon.type != CLAW) || weapon.type == TWO_HANDED_SWORD) secondaryWeaponSelect.add(createOption(weapon.name));
			}
		} else if (character == ASSASSIN) {
			for (const weapon of WEAPONS.values()) {
				if (weapon.type == CLAW) secondaryWeaponSelect.add(createOption(weapon.name));
			}
		}
	}

	function setSkills() {

		let type = primaryWeapon.type;

		let currentSkills = [STANDARD];

		clear(skillSelect);

		if (form == HUMAN && (type == ONE_HANDED_THRUSTING || type == THROWING)) {
			currentSkills.push(THROW);
		}

		switch (parseInt(character)) { // i could add these in with a loop, but might make changes in the future
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

	function getPrimaryWeaponIAS() {
		return form == HUMAN ? 0 : parseInt(primaryWeaponIAS.value);
	}

	function displayFrames() {

		removeAllChildNodes(tableContainer);

		if (skill == STANDARD) { // TODO temp solution

			let framesPerDirection = calculateFramesPerDirection(false, primaryWeapon);
			displayTable(framesPerDirection, true);

			if (primaryWeapon.type.hasAlternateAnimation(character)) {
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

			framesPerDirection = primaryWeapon.type.getActionFrame(character);
			displayTable(framesPerDirection, true);

		} else {

			let framesPerDirection = calculateFramesPerDirection(false, primaryWeapon);
			displayTable(framesPerDirection, true);

		}

	}

	function displayTable(framesPerDirection, isPrimary) {

		if (form != HUMAN) {
			displayAccelerationNeeded(calculateAccelerationNeededWereform(framesPerDirection));
			return
		}

		if (skill == FEND || skill == STRAFE || skill == WHIRLWIND) {
			displayAccelerationNeededFromHardcode();
			return;
		}
		if (skill == DRAGON_TALON || skill == ZEAL) {
			displayReducedSequenceTable();
			return;
		}

		let weapon = isPrimary ? primaryWeapon : secondaryWeapon;
		let isSequenceSkill = skill == FRENZY || skill == JAB;
		let startingFrame = getStartingFrame(weapon.type);
		let animationSpeed = calculateAnimationSpeed(weapon.type);

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

		let accelerationNeeded = calculateAccelerationNeeded(framesPerDirection, startingFrame, animationSpeed, isSequenceSkill, WSM);
		displayAccelerationNeeded(accelerationNeeded);

		console.log("--- end ---");
	}

	function displayAccelerationNeeded(breakpoints) {
		let table = document.createElement("table");
		table.className = "table";
		tableContainer.appendChild(table);

		breakpoints = convertAccelerationNeededTableToShowBy(breakpoints);

		for (const [showByIndex, FPA] of breakpoints) {
			addTableRow(table, showByIndex, FPA);
		}
	}

	function calculateAccelerationNeededWereform(framesPerDirection) {

		let weapon = primaryWeapon;
		let WSM = weapon.WSM;
		let animationSpeed = calculateAnimationSpeed(weapon.type);


		console.log("animationSpeed: " + animationSpeed);
		console.log("startingFrame: " + startingFrame);
		console.log("WSM: " + WSM);
		let wIAS = getPrimaryWeaponIAS();
		console.log("wIAS: " + wIAS);
		let EIAS = calculateEIAS(WSM, wIAS);
		//let EIAS = BASE_EIAS;

		let framesPerDirection0 = framesPerDirection;
		let framesPerDirection1 = (form == WEREWOLF ? 13 : 12);
		let framesPerDirection2 = (form == WEREWOLF ? 9 : 10);
		if (skill == HUNGER || skill == RABIES) framesPerDirection1 = 10;
		else if (skill == FERAL_RAGE || skill == FURY) {
			framesPerDirection1 = 7;
			framesPerDirection2 = 9;
		}
		//EIAS = calculateEIAS(WSM, wIAS);
		framesPerDirection = framesPerDirection1;
		let accelerationModifier = Math.floor(256 * framesPerDirection2 / Math.floor(256 * framesPerDirection0 / Math.floor((100 + wIAS - WSM) * animationSpeed / 100)));
		

		console.log("framesPerDirection: " + framesPerDirection);
		//console.log("BASE_EIAS: " + BASE_EIAS);
		console.log("EIAS: " + EIAS);
		console.log("accelerationModifier: " + accelerationModifier);

		let offset = (skill == FERAL_RAGE || skill == FURY ? 0 : 1);
		let accelerationNeeded = new Map();

		let temp = 0;
		for (let acceleration = 0; acceleration <= maxAccelerationIncrease; acceleration++) {
			let frameLengthDivisor = Math.floor(accelerationModifier * limitToEIASBounds(EIAS + acceleration) / 100);
			let FPA = Math.ceil(256 * (framesPerDirection - startingFrame) / frameLengthDivisor) - offset;
			if (skill == FURY) {
				let FPA2 = Math.ceil(256 * 13 / frameLengthDivisor) - 1;
				if (temp != FPA + FPA2) {
					temp = FPA + FPA2;
					accelerationNeeded.set(acceleration, "(" + FPA + ")/" + FPA2);
					console.log("acceleration=" + acceleration + ",FPA=" + FPA + ",FPA2=" + FPA2);
				}
			} else {
				if (skill == FERAL_RAGE) {
					FPA += Math.ceil((256 * 13 - FPA * frameLengthDivisor) / (2 * frameLengthDivisor)) - 1;
				}
				if (temp != FPA) {
					temp = FPA;
					accelerationNeeded.set(acceleration, FPA);
					console.log("acceleration=" + acceleration + ",FPA=" + FPA);
				}
			}
		}

		return accelerationNeeded;
	}

	function calculateAccelerationNeeded(framesPerDirection, startingFrame, animationSpeed, isSequenceSkill, WSM) {

		console.log("animationSpeed: " + animationSpeed);
		console.log("startingFrame: " + startingFrame);
		console.log("WSM: " + WSM);

		let EIAS = calculateEIAS(WSM, 0);

		if (skill == FRENZY) {
			framesPerDirection = 9;
		}

		console.log("framesPerDirection: " + framesPerDirection);
		//console.log("BASE_EIAS: " + BASE_EIAS);
		console.log("EIAS: " + EIAS);
		//console.log("accelerationModifier: " + accelerationModifier);

		let offset = isSequenceSkill ? 0 : 1;
		let accelerationNeeded = new Map();

		let temp = 0;
		for (let acceleration = 0; acceleration <= maxAccelerationIncrease; acceleration++) {
			let frameLengthDivisor = Math.floor(animationSpeed * limitToEIASBounds(EIAS + acceleration) / 100);
			let FPA = Math.ceil(256 * (framesPerDirection - startingFrame) / frameLengthDivisor) - offset;
			if (skill == FRENZY) {
				let FPA2 = Math.ceil((256 * 17 - FPA * frameLengthDivisor) / frameLengthDivisor);
				if (temp != FPA + FPA2) {
					temp = FPA + FPA2;
					accelerationNeeded.set(acceleration, FPA + "/" + FPA2 + "|" + FPA);
					console.log("acceleration=" + acceleration + ",FPA=" + FPA + ",FPA2=" + FPA2);
				}
			} else {
				if (temp != FPA) {
					temp = FPA;
					accelerationNeeded.set(acceleration, FPA);
					console.log("acceleration=" + acceleration + ",FPA=" + FPA);
				}
			}
		}

		return accelerationNeeded;
	}

	function calculateEIAS(WSM, wIAS) {
		let SIAS = calculateSIAS();
		console.log("SIAS: " + SIAS);
		let IAS = wIAS;
		if (showBy != SHOW_BY_IAS) IAS += parseInt(gearIAS.value);
		let IAS_EIAS = convertIAStoEIAS(IAS);
		return limitToEIASBounds(100 + SIAS - WSM + IAS_EIAS);
	}

	function convertIAStoEIAS(IAS) {
		return Math.floor(120 * IAS / (120 + IAS));
	}

	function convertEIAStoIAS(EIAS) {
		return Math.ceil(120 * EIAS / (120 - EIAS));
	}

	function displayAccelerationNeededFromHardcode() {

		let WSM = primaryWeapon.WSM;
		let EIAS = calculateEIAS(WSM, 0);
		let breakpointTable;

		if (skill == FEND) {
			if (primaryWeapon.type == TWO_HANDED_THRUSTING) {
				breakpointTable = FEND_TWO_HANDED_THRUSTING_TABLE;
			} else if (primaryWeapon.type == ONE_HANDED_THRUSTING) {
				breakpointTable = FEND_ONE_HANDED_THRUSTING_TABLE;
			}
		} else if (skill == STRAFE) {
			if (primaryWeapon.type == BOW) {
				breakpointTable = STRAFE_BOW_TABLE;
			} else if (primaryWeapon.type == CROSSBOW) {
				breakpointTable = STRAFE_EVEN_CROSSBOW_TABLE;
			}
		} else if (skill == WHIRLWIND) { // TODO
			SIAS = 0;

			if (isDualWielding) {
				if (wsmBugged) {
					WSM = (secondaryWeapon.WSM + primaryWeapon.WSM) / 2 - secondaryWeapon.WSM + primaryWeapon.WSM;
				} else {
					WSM = (primaryWeapon.WSM + secondaryWeapon.WSM) / 2;
				}
			}

			EIAS = Math.max(15, SIAS - WSM);

			if (character == ASSASSIN && primaryWeapon.type == CLAW) {
				breakpointTable = WHIRLWIND_CLAW_TABLE;
			} else if (character == BARBARIAN) {
				if (primaryWeapon.type == UNARMED || primaryWeapon.type == ONE_HANDED_SWINGING ||
					primaryWeapon.type == ONE_HANDED_THRUSTING || primaryWeapon.type == TWO_HANDED_SWORD) {
					breakpointTable = WHIRLWIND_ONE_HANDED_TABLE;
				} else {
					breakpointTable = WHIRLWIND_TWO_HANDED_TABLE;
				}
			}
		}

		let table = breakpointTable.getTableAfter(EIAS);
		let accelerationNeeded = table.getAdjustedTable(EIAS); // TODO for whirlwind

		displayAccelerationNeeded(accelerationNeeded);

		if (skill == STRAFE && primaryWeapon.type == CROSSBOW) {

			breakpointTable = STRAFE_ODD_CROSSBOW_TABLE;
			table = breakpointTable.getTableAfter(EIAS);
			accelerationNeeded = table.getAdjustedTable(EIAS);

			displayAccelerationNeeded(accelerationNeeded);

		} else if (skill == WHIRLWIND && isDualWielding && primaryWeapon != secondaryWeapon) { // TODO

			if (wsmBugged) {
				WSM = (secondaryWeapon.WSM + primaryWeapon.WSM) / 2;
			} else {
				WSM = (primaryWeapon.WSM + secondaryWeapon.WSM) / 2 - primaryWeapon.WSM + secondaryWeapon.WSM;
			}
			EIAS = Math.max(15, SIAS - WSM);

			table = breakpointTable.getTableAfter(EIAS);
			accelerationNeeded = table.getAdjustedTable(EIAS); // TODO

			displayAccelerationNeeded(accelerationNeeded);

		}

	}

	function displayReducedSequenceTable() {

		let framesPerDirection = (skill == DRAGON_TALON ? 4 : primaryWeapon.type.getActionFrame(character));
		let animationSpeed = calculateAnimationSpeed(primaryWeapon.type);
		let startingFrame = 0; // starting frames only apply to sorcs and zons using normal attack, strafe, or fend
		let WSM = primaryWeapon.WSM;

		if (character == BARBARIAN && primaryWeapon.type == TWO_HANDED_SWORD && isOneHanded) framesPerDirection = 7;

		let sequenceAccelerationNeeded = calculateAccelerationNeeded(framesPerDirection, startingFrame, animationSpeed, true, WSM);

		framesPerDirection = (skill == DRAGON_TALON ? 13 : primaryWeapon.type.getFramesPerDirection(character));
		if (character == BARBARIAN && primaryWeapon.type == TWO_HANDED_SWORD && isOneHanded) framesPerDirection = 16;

		let finishingAccelerationNeeded = calculateAccelerationNeeded(framesPerDirection, startingFrame, animationSpeed, false, WSM);

		let breakpoints = mergeSequenceTables(sequenceAccelerationNeeded, finishingAccelerationNeeded);
		displayAccelerationNeeded(breakpoints);

	}

	function convertAccelerationNeededTableToShowBy(table) {

		let newTable = new Map();
		//let alreadyExistingIAS = getPrimaryWeaponIAS();

		if (showingBySkill()) {
			let skill = getShowingBySkill();
			for (const [accelerationNeeded, FPA] of table) {
				let level = skill.getLevelFromEIAS(accelerationNeeded);
				//if (!newTable.has(level)) {
					console.log("acceleration=" + accelerationNeeded + ",FPA=" + FPA + ",level=" + level);
					newTable.set(level, FPA);
				//}
			}
			
		} else if (showBy == SHOW_BY_IAS) {
			for (const [accelerationNeeded, FPA] of table) {
				let IAS = Math.max(0, convertEIAStoIAS(accelerationNeeded));
				newTable.set(IAS, FPA);
			}
		} else {
			console.log("conversion not yet implemented");
		}

		return newTable;
	}

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
			let nextTableIndex = 0;
			let smallestIAS = 999;
			let connectedFrame = 0;
			for (let o = 0; o < sequences; o++) {
				if (tables[o].length == 0) continue;
				let [firstKey] = tables[o].keys();
				let [firstValue] = tables[o].values();
				if (firstKey < smallestIAS) {
					smallestIAS = firstKey;
					connectedFrame = firstValue;
					nextTableIndex = o;
				}
			}
			if (smallestIAS == 999) continue;
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

	function isCharacterSelected() {
		return character == AMAZON || character == ASSASSIN || character == BARBARIAN || character == DRUID || character == NECROMANCER || character == PALADIN || character == SORCERESS; // readability
	}

	function calculateFramesPerDirection(alternate, weapon) {

		let type = weapon.type;
		if (character == BARBARIAN && type == TWO_HANDED_SWORD && (isOneHanded.checked || isDualWielding)) type = ONE_HANDED_SWINGING;

		let framesPerDirection = (alternate ? type.getAlternateFramesPerDirection(character) : type.getFramesPerDirection(character));

		if (skill == THROW) {
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
				framesPerDirection = getSequence(type);
			}
		}

		return framesPerDirection;
	}

	function calculateAnimationSpeed(type) {
		let animationSpeed = 256;
		if (skill == LAYING_TRAPS) {
			animationSpeed = 128;
		} else if (type == CLAW && !(skill == FISTS_OF_FIRE || skill == CLAWS_OF_THUNDER ||
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

	function limitToEIASBounds(EIAS) {
		return Math.max(EIAS_MIN, Math.min(EIAS_MAX, EIAS));
	}

	function getSequence(type) {
		if (skill == DOUBLE_THROW) return 12;
		if (skill == DOUBLE_SWING || skill == FRENZY) return 17;
		if (skill == FISTS_OF_FIRE || skill == CLAWS_OF_THUNDER || skill == BLADES_OF_ICE || skill == DRAGON_CLAW) return (type == UNARMED || type == CLAW) ? 12 : 16;
		if (skill == JAB) return type == ONE_HANDED_THRUSTING ? 18 : 21;
		if (type == ONE_HANDED_THRUSTING) return 21;
		if (type == TWO_HANDED_THRUSTING) return 24;
		return 0;
	}

	function getStartingFrame(type) {
		if ((character == AMAZON || character == SORCERESS) && (skill == STANDARD || skill == STRAFE || skill == FEND)) {
			if (type == UNARMED) return 1;
			if (type == ONE_HANDED_THRUSTING || type == TWO_HANDED_SWORD || type == ONE_HANDED_THRUSTING || type == TWO_HANDED_THRUSTING || type == TWO_HANDED) return 2;
		}
		return 0;
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

	constructor(name, WSM, type) {
		this.name = name;
		this.WSM = WSM;
		this.type = type;
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
	}

	getTableAfter(EIAS) {
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
		return new BreakpointTable(filteredBreakpoints);
	}

	getAdjustedTable(EIAS) {
		let adjustedBreakpoints = new Map();
		for (let i = 0; i < this.breakpoints.length; i++) {
			let breakpoint = this.breakpoints[i];
			let neededAcceleration = breakpoint[0] - EIAS;
			let frames = breakpoint[1];

			if (neededAcceleration < 0) {
				if (i == 0) neededAcceleration = 0; // first breakpoint might be slightly negative
			}

			adjustedBreakpoints.set(neededAcceleration, frames);
		}
		return adjustedBreakpoints;
	}

}

const WHIRLWIND_CLAW_TABLE = new BreakpointTable([ // TODO
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

const FEND_TWO_HANDED_THRUSTING_TABLE = new BreakpointTable([
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
