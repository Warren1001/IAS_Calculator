window.addEventListener("load", load, false);

/**
 * bugs:
 * frenzy tables are slightly off - possibly only when NOT indexing by a weapon ias
 * 
 * missing features:
 * dual wielding needs secondary weapon ias implementation for non-ias table variable
 * wereforms needs table variable weapon ias implementation
 * contemplate the usefulness of a WSM table variable
 */

function load() {
	
	const CONTAINER_TABLE_VARIABLE = document.getElementById("tableVariableContainer");
	const CONTAINER_TABLE_VARIABLE_PRIMARY_WEAPON_IAS = document.getElementById("tableVariablePrimaryWeaponIASContainer");
	const CONTAINER_TABLE_VARIABLE_SECONDARY_WEAPON_IAS = document.getElementById("tableVariableSecondaryWeaponIASContainer");
	const CONTAINER_TABLE_VARIABLE_BURST_OF_SPEED = document.getElementById("tableVariableBurstOfSpeedContainer");
	const CONTAINER_TABLE_VARIABLE_WEREWOLF = document.getElementById("tableVariableWerewolfContainer");
	const CONTAINER_TABLE_VARIABLE_FRENZY = document.getElementById("tableVariableFrenzyContainer");
	const CONTAINER_WEREFORM = document.getElementById("wereformContainer");
	const CONTAINER_IS_ONE_HANDED = document.getElementById("isOneHandedContainer");
	const CONTAINER_PRIMARY_WEAPON_IAS = document.getElementById("primaryWeaponIASContainer");
	const CONTAINER_SECONDARY_WEAPON = document.getElementById("secondaryWeaponContainer");
	const CONTAINER_WSM_BUGGED = document.getElementById("wsmBuggedContainer");
	const CONTAINER_SECONDARY_WEAPON_IAS = document.getElementById("secondaryWeaponIASContainer");
	const CONTAINER_IAS = document.getElementById("IASContainer");
	const CONTAINER_FANATICISM = document.getElementById("fanaticismContainer");
	const CONTAINER_BURST_OF_SPEED = document.getElementById("burstOfSpeedContainer");
	const CONTAINER_WEREWOLF = document.getElementById("werewolfContainer");
	const CONTAINER_FRENZY = document.getElementById("frenzyContainer");
	const CONTAINER_HOLY_FREEZE = document.getElementById("holyFreezeContainer");
	const CONTAINER_TABLE = document.getElementById("tableContainer");

	const TABLE_VARIABLE_IAS = setupInputElement(document.getElementById("tableVariableIAS"), e => onTableVariableChange(true));
	const TABLE_VARIABLE_PRIMARY_WEAPON_IAS = setupInputElement(document.getElementById("tableVariablePrimaryWeaponIAS"), e => onTableVariableChange(true));
	const TABLE_VARIABLE_SECONDARY_WEAPON_IAS = setupInputElement(document.getElementById("tableVariableSecondaryWeaponIAS"), e => onTableVariableChange(true));
	const TABLE_VARIABLE_FANATICISM = setupInputElement(document.getElementById("tableVariableFanaticism"), e => onTableVariableChange(true));
	const TABLE_VARIABLE_BURST_OF_SPEED = setupInputElement(document.getElementById("tableVariableBurstOfSpeed"), e => onTableVariableChange(true));
	const TABLE_VARIABLE_WEREWOLF = setupInputElement(document.getElementById("tableVariableWerewolf"), e => onTableVariableChange(true));
	const TABLE_VARIABLE_FRENZY = setupInputElement(document.getElementById("tableVariableFrenzy"), e => onTableVariableChange(true));

	const SELECT_CHARACTER = setupInputElement(document.getElementById("characterSelect"), e => onCharacterChange(true));
	const SELECT_WEREFORM = setupInputElement(document.getElementById("wereformSelect"), e => onWereformChange(true));
	const SELECT_PRIMARY_WEAPON = setupInputElement(document.getElementById("primaryWeaponSelect"), e => onPrimaryWeaponChange(true));
	const SELECT_SECONDARY_WEAPON = setupInputElement(document.getElementById("secondaryWeaponSelect"), e => onSecondaryWeaponChange(true));
	const SELECT_SKILL = setupInputElement(document.getElementById("skillSelect"), e => onSkillChange(true));

	const NUMBER_PRIMARY_WEAPON_IAS = setupInputElement(document.getElementById("primaryWeaponIAS"), displayFrames);
	const NUMBER_SECONDARY_WEAPON_IAS = setupInputElement(document.getElementById("secondaryWeaponIAS"), displayFrames);
	const NUMBER_IAS = setupInputElement(document.getElementById("IAS"), displayFrames);
	const NUMBER_FANATICISM = setupInputElement(document.getElementById("fanaticismLevel"), displayFrames);
	const NUMBER_BURST_OF_SPEED = setupInputElement(document.getElementById("burstOfSpeedLevel"), displayFrames);
	const NUMBER_WEREWOLF = setupInputElement(document.getElementById("werewolfLevel"), displayFrames);
	const NUMBER_FRENZY = setupInputElement(document.getElementById("frenzyLevel"), displayFrames);
	const NUMBER_HOLY_FREEZE = setupInputElement(document.getElementById("holyFreezeLevel"), displayFrames);

	const CHECKBOX_WSM_BUGGED = setupInputElement(document.getElementById("wsmBugged"), displayFrames);
	const CHECKBOX_IS_ONE_HANDED = setupInputElement(document.getElementById("isOneHanded"), displayFrames);
	const CHECKBOX_DECREPIFY = setupInputElement(document.getElementById("decrepify"), displayFrames);

	const OPTION_WEREWOLF = SELECT_WEREFORM.options[2];

	const BUTTON_GENERATE_LINK = document.getElementById("generateLink");
	BUTTON_GENERATE_LINK.addEventListener("click", generateLink, false);

	const SKILL_FANATICISM = new AttackSpeedSkill(NUMBER_FANATICISM, 10, 30, 40, TABLE_VARIABLE_FANATICISM);
	const SKILL_BURST_OF_SPEED = new AttackSpeedSkill(NUMBER_BURST_OF_SPEED, 15, 45, 60, TABLE_VARIABLE_BURST_OF_SPEED, () => character == ASSASSIN);
	const SKILL_WEREWOLF = new AttackSpeedSkill(NUMBER_WEREWOLF, 10, 70, 80, TABLE_VARIABLE_WEREWOLF, () => wereform == WEREWOLF);
	const SKILL_FRENZY = new AttackSpeedSkill(NUMBER_FRENZY, 0, 50, 50, TABLE_VARIABLE_FRENZY, () => character == BARBARIAN);
	const SKILL_HOLY_FREEZE = new AttackSpeedSkill(NUMBER_HOLY_FREEZE, 25, 35, 60);
	
	const MAX_EIAS = 175; // for a brief period of D2R, this limit did not exist. rip bugged ias frames :(
	const MIN_EIAS = 15;	
	const MAX_IAS_WEAPON = 120;
	const MAX_IAS_ACCELERATION_WEAPON = 60;
	const MAX_IAS_ACCELERATION_CHARACTER = 88;
	const MAX_IAS_ACCELERATION_CHARACTER_TWO_HANDED = 83;
	const MAX_IAS_ACCELERATION_MERCENARY = 78;

	let character = PALADIN;
	let wereform = HUMAN;
	let primaryWeapon = WEAPONS.get("None");
	let skill = SKILLS.get("Standard");
	let secondaryWeapon = WEAPONS.get("None");
	let isDualWielding = false;
	let tableVariable = TABLE_VARIABLE_IAS;
	let maxAccelerationIncrease = MAX_IAS_ACCELERATION_CHARACTER;

	setPrimaryWeapons();
	setSkills();
	loadFromParams();
	displayFrames();

	function onTableVariableChange(updateTable) {
		let newTableVariable = document.querySelector('input[name="tableVariable"]:checked');
		//if (tableVariable == newTableVariable) return;
		tableVariable = newTableVariable;
		switch (tableVariable) {
			case TABLE_VARIABLE_IAS:
				hideElement(CONTAINER_IAS);
				if (isCharacterSelected()) {
					maxAccelerationIncrease = primaryWeapon.type.isOneHand ? MAX_IAS_ACCELERATION_CHARACTER : MAX_IAS_ACCELERATION_CHARACTER_TWO_HANDED;
				} else {
					maxAccelerationIncrease = MAX_IAS_ACCELERATION_MERCENARY;
				}
				break;
			case TABLE_VARIABLE_PRIMARY_WEAPON_IAS:
				hideElement(CONTAINER_PRIMARY_WEAPON_IAS);
				maxAccelerationIncrease = MAX_IAS_ACCELERATION_WEAPON;
				break;
			case TABLE_VARIABLE_SECONDARY_WEAPON_IAS:
				hideElement(CONTAINER_SECONDARY_WEAPON_IAS);
				maxAccelerationIncrease = MAX_IAS_ACCELERATION_WEAPON;
				break;
			case TABLE_VARIABLE_FANATICISM:
				hideElement(CONTAINER_FANATICISM);
				maxAccelerationIncrease = SKILL_FANATICISM.max;
				break;
			case TABLE_VARIABLE_BURST_OF_SPEED:
				hideElement(CONTAINER_BURST_OF_SPEED);
				maxAccelerationIncrease = SKILL_BURST_OF_SPEED.max;
				break;
			case TABLE_VARIABLE_WEREWOLF:
				hideElement(CONTAINER_WEREWOLF);
				maxAccelerationIncrease = SKILL_WEREWOLF.max;
			case TABLE_VARIABLE_FRENZY:
				hideElement(CONTAINER_FRENZY);
				maxAccelerationIncrease = SKILL_FRENZY.max;
				break;
		}
		if (tableVariable != TABLE_VARIABLE_PRIMARY_WEAPON_IAS && isDualWielding) {
			unhideElement(CONTAINER_PRIMARY_WEAPON_IAS);
		}
		if (tableVariable != TABLE_VARIABLE_SECONDARY_WEAPON_IAS && isDualWielding) {
			unhideElement(CONTAINER_SECONDARY_WEAPON_IAS);
		}
		if (tableVariable != TABLE_VARIABLE_IAS) {
			unhideElement(CONTAINER_IAS);
		}
		if (tableVariable != TABLE_VARIABLE_FANATICISM) {
			unhideElement(CONTAINER_FANATICISM);
		}
		if (tableVariable != TABLE_VARIABLE_BURST_OF_SPEED && character == ASSASSIN) {
			unhideElement(CONTAINER_BURST_OF_SPEED);
		}
		if (tableVariable != TABLE_VARIABLE_WEREWOLF && wereform == WEREWOLF) {
			unhideElement(CONTAINER_WEREWOLF);
		}
		if (tableVariable != TABLE_VARIABLE_FRENZY && character == BARBARIAN) {
			unhideElement(CONTAINER_FRENZY);
		}
		if (updateTable) displayFrames();
	}

	function isTableVariableSkill() {
		return tableVariable == TABLE_VARIABLE_FANATICISM || tableVariable == TABLE_VARIABLE_BURST_OF_SPEED || tableVariable == TABLE_VARIABLE_WEREWOLF || tableVariable == TABLE_VARIABLE_FRENZY;
	}

	function getTableVariableSkill() {
		switch(tableVariable) {
			case TABLE_VARIABLE_FANATICISM:
				return SKILL_FANATICISM;
			case TABLE_VARIABLE_BURST_OF_SPEED:
				return SKILL_BURST_OF_SPEED;
			case TABLE_VARIABLE_WEREWOLF:
				return SKILL_WEREWOLF;
			case TABLE_VARIABLE_FRENZY:
				return SKILL_FRENZY;
		}
		return null;
	}

	function onCharacterChange(updateTable) {
		character = parseInt(SELECT_CHARACTER.value);

		if (isCharacterSelected()) {

			if (tableVariable == TABLE_VARIABLE_IAS) {
				maxAccelerationIncrease = MAX_IAS_ACCELERATION_CHARACTER;
			}

			unhideElement(CONTAINER_WEREFORM);

		} else {

			if (tableVariable == TABLE_VARIABLE_IAS) {
				maxAccelerationIncrease = MAX_IAS_ACCELERATION_MERCENARY;
			}

			hideElement(CONTAINER_WEREFORM);
			if (wereform != HUMAN) {
				SELECT_WEREFORM.value = HUMAN;
				onWereformChange(false);
			}
		}

		if (character == BARBARIAN || character == DRUID) unhideElement(OPTION_WEREWOLF);
		else {
			hideElement(OPTION_WEREWOLF);
			if (SELECT_WEREFORM.value == WEREWOLF) {
				SELECT_WEREFORM.value = HUMAN;
				onWereformChange(false);
			}
		}

		if (character == ASSASSIN) {
			unhideElement(CONTAINER_BURST_OF_SPEED);
			unhideElement(CONTAINER_TABLE_VARIABLE_BURST_OF_SPEED);
		} else {
			hideElement(CONTAINER_BURST_OF_SPEED);
			hideElement(CONTAINER_TABLE_VARIABLE_BURST_OF_SPEED);
			if (tableVariable == TABLE_VARIABLE_BURST_OF_SPEED) {
				TABLE_VARIABLE_IAS.checked = true;
				onTableVariableChange(false);
			}
		}

		if (character == BARBARIAN) {
			unhideElement(CONTAINER_FRENZY);
			unhideElement(CONTAINER_TABLE_VARIABLE_FRENZY);
		} else {
			hideElement(CONTAINER_FRENZY);
			hideElement(CONTAINER_TABLE_VARIABLE_FRENZY);
			if (tableVariable == TABLE_VARIABLE_FRENZY) {
				TABLE_VARIABLE_IAS.checked = true;
				onTableVariableChange(false);
			}
		}

		if (character != BARBARIAN && character != ASSASSIN) {
			//hideElement(CONTAINER_WSM_BUGGED);
			hideElement(CONTAINER_SECONDARY_WEAPON);
			isDualWielding = false;
		}

		let primaryWeaponType = primaryWeapon.type;
		if ((character == ASSASSIN && primaryWeaponType == CLAW) || (character == BARBARIAN && (primaryWeaponType == ONE_HANDED_SWINGING || primaryWeaponType == ONE_HANDED_THRUSTING || primaryWeaponType == TWO_HANDED_SWORD))) {
			unhideElement(CONTAINER_SECONDARY_WEAPON);
			setSecondaryWeapons();
		} else {
			//hideElement(CONTAINER_WSM_BUGGED);
			hideElement(CONTAINER_SECONDARY_WEAPON);
			isDualWielding = false;
		}

		setPrimaryWeapons();
		setSkills();

		if (updateTable) displayFrames();
	}

	function onWereformChange(updateTable) {
		wereform = SELECT_WEREFORM.value;
		if (wereform == HUMAN) {
			hideElement(CONTAINER_PRIMARY_WEAPON_IAS);
		} else {
			unhideElement(CONTAINER_PRIMARY_WEAPON_IAS);
		}
		if (wereform == WEREWOLF) {
			unhideElement(CONTAINER_TABLE_VARIABLE_WEREWOLF);
			unhideElement(CONTAINER_WEREWOLF);
		} else {
			hideElement(CONTAINER_WEREWOLF);
			hideElement(CONTAINER_TABLE_VARIABLE_WEREWOLF);
			if (tableVariable == TABLE_VARIABLE_WEREWOLF) {
				TABLE_VARIABLE_IAS.checked = true;
				onTableVariableChange(false);
			}
		}

		setSkills();

		if (updateTable) displayFrames();
	}

	function onPrimaryWeaponChange(updateTable) {
		primaryWeapon = WEAPONS.get(SELECT_PRIMARY_WEAPON.value);
		let type = primaryWeapon.type;

		if (character == BARBARIAN && type == TWO_HANDED_SWORD && !isDualWielding) {
			unhideElement(CONTAINER_IS_ONE_HANDED);
		} else {
			hideElement(CONTAINER_IS_ONE_HANDED);
		}

		if ((character == ASSASSIN && type == CLAW) || (character == BARBARIAN && (type == ONE_HANDED_SWINGING || type == ONE_HANDED_THRUSTING || type == TWO_HANDED_SWORD))) {
			unhideElement(CONTAINER_SECONDARY_WEAPON);
			setSecondaryWeapons();
		} else {
			hideElement(CONTAINER_SECONDARY_WEAPON);
			hideElement(CONTAINER_WSM_BUGGED);
			CHECKBOX_WSM_BUGGED.checked = false;
			isDualWielding = false;
		}

		setSkills();

		if (updateTable) displayFrames();
	}

	function onSecondaryWeaponChange(updateTable) {
		let a = SELECT_SECONDARY_WEAPON.value;
		console.log("a=" + a);
		secondaryWeapon = WEAPONS.get(a);
		console.log(secondaryWeapon);

		if (secondaryWeapon.type != UNARMED) {
			isDualWielding = true;
			hideElement(CONTAINER_IS_ONE_HANDED);
			unhideElement(CONTAINER_WSM_BUGGED);
		} else {
			isDualWielding = false;
			hideElement(CONTAINER_WSM_BUGGED);
			CHECKBOX_WSM_BUGGED.checked = false;
			if (character == BARBARIAN && primaryWeapon.type == TWO_HANDED_SWORD) {
				unhideElement(CONTAINER_IS_ONE_HANDED);
			} else {
				hideElement(CONTAINER_IS_ONE_HANDED);
			}
		}

		setSkills();

		if (updateTable) displayFrames();
	}

	function onSkillChange(updateTable) {
		skill = SKILLS.get(SELECT_SKILL.value);

		if (skill == WHIRLWIND) {
			hideElement(CONTAINER_TABLE_VARIABLE);
			hideElement(CONTAINER_FANATICISM);
			hideElement(CONTAINER_BURST_OF_SPEED);
			hideElement(CONTAINER_FRENZY);
			hideElement(CONTAINER_HOLY_FREEZE);
		} else {
			unhideElement(CONTAINER_TABLE_VARIABLE);
			if (tableVariable != TABLE_VARIABLE_FANATICISM) unhideElement(CONTAINER_FANATICISM);
			if (character == ASSASSIN && tableVariable != TABLE_VARIABLE_BURST_OF_SPEED) unhideElement(CONTAINER_BURST_OF_SPEED);
			if (character == BARBARIAN && tableVariable != TABLE_VARIABLE_FRENZY) unhideElement(CONTAINER_FRENZY);
			unhideElement(CONTAINER_HOLY_FREEZE);

			if (skill == FRENZY) {
				unhideElement(CONTAINER_TABLE_VARIABLE_PRIMARY_WEAPON_IAS);
				unhideElement(CONTAINER_TABLE_VARIABLE_SECONDARY_WEAPON_IAS);
			} else {
				hideElement(CONTAINER_TABLE_VARIABLE_PRIMARY_WEAPON_IAS);
				hideElement(CONTAINER_TABLE_VARIABLE_SECONDARY_WEAPON_IAS);
				console.log(tableVariable);
				if (tableVariable == TABLE_VARIABLE_PRIMARY_WEAPON_IAS || tableVariable == TABLE_VARIABLE_SECONDARY_WEAPON_IAS) {
					TABLE_VARIABLE_IAS.checked = true;
					onTableVariableChange(false);
				}
			}

		}

		if (updateTable) displayFrames();
	}

	function setPrimaryWeapons() {
		let previousValue = SELECT_PRIMARY_WEAPON.value;
		let reselect = false;
		clear(SELECT_PRIMARY_WEAPON);
		for (const weapon of WEAPONS.values()) {
			if (canBeEquipped(weapon)) {
				SELECT_PRIMARY_WEAPON.add(createOption(weapon.name));
				if (previousValue == weapon.name) reselect = true;
			}
		}
		if (reselect) {
			SELECT_PRIMARY_WEAPON.value = previousValue;
		} else {
			onPrimaryWeaponChange(false);
		}
	}

	function setSecondaryWeapons() {
		let previousValue = SELECT_SECONDARY_WEAPON.value;
		let reselect = false;
		clear(SELECT_SECONDARY_WEAPON);
		if (character == BARBARIAN) {
			for (const weapon of WEAPONS.values()) {
				if ((weapon.type.isOneHand && weapon.type != CLAW) || weapon.type == TWO_HANDED_SWORD) {
					if (canBeEquipped(weapon)) {
						SELECT_SECONDARY_WEAPON.add(createOption(weapon.name));
						if (previousValue == weapon.name) reselect = true;
					}
				}
			}
		} else if (character == ASSASSIN) {
			SELECT_SECONDARY_WEAPON.add(createOption("None"));
			for (const weapon of WEAPONS.values()) {
				if (weapon.type == CLAW) {
					SELECT_SECONDARY_WEAPON.add(createOption(weapon.name));
					if (previousValue == weapon.name) reselect = true;
				}
			}
		}
		if (reselect) {
			SELECT_SECONDARY_WEAPON.value = previousValue;
		} else {
			onSecondaryWeaponChange(false);
		}
	}

	function setSkills() {

		let type = primaryWeapon.type;
		let itemClass = primaryWeapon.itemClass;

		let currentSkills = [STANDARD];

		clear(SELECT_SKILL);

		if (wereform == HUMAN && isCharacterSelected() && (itemClass == CLASS_THROWING || itemClass == CLASS_JAVELIN)) {
			currentSkills.push(THROW);
		}

		switch (parseInt(character)) {
			case AMAZON:
				if (wereform == HUMAN) {
					if (type == BOW || type == CROSSBOW) {
						currentSkills.push(STRAFE);
					} else if (itemClass == CLASS_SPEAR || itemClass == CLASS_JAVELIN) {
						currentSkills.push(JAB);
						currentSkills.push(IMPALE);
						currentSkills.push(FEND);
					}
				}
				break;
			case ASSASSIN:
				if (wereform == HUMAN) {
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
				if (wereform == HUMAN) {
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
				} else if (wereform == WEREWOLF) {
					currentSkills.push(FERAL_RAGE);
				}
				break;
			case DRUID:
				if (wereform == WEREWOLF) {
					currentSkills.push(FURY);
					currentSkills.push(RABIES);
					currentSkills.push(FERAL_RAGE);
				} else if (wereform == WEREBEAR) {
					currentSkills.push(HUNGER);
				}
				break;
			case PALADIN:
				if (wereform == HUMAN && type.isMelee) {
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

		if (wereform == HUMAN && character != PALADIN && isCharacterSelected() &&
			!(primaryWeapon.type == UNARMED || primaryWeapon.type == BOW || primaryWeapon.type == CROSSBOW || primaryWeapon.type == CLAW) && primaryWeapon.maxSockets >= 4) {
			currentSkills.push(ZEAL);
		}

		if (isCharacterSelected()) {
			currentSkills.push(KICK);
		}

		currentSkills.forEach(s => SELECT_SKILL.add(createOption(s.name)));

		if (!currentSkills.includes(skill)) {
			onSkillChange(false);
		} else {
			SELECT_SKILL.value = skill.name;
		}

	}

	function getWeaponIAS(isPrimary) {
		let wIAS = 0;
		if (isPrimary && tableVariable != TABLE_VARIABLE_PRIMARY_WEAPON_IAS) wIAS = parseInt(NUMBER_PRIMARY_WEAPON_IAS.value);
		else if (!isPrimary && tableVariable != TABLE_VARIABLE_SECONDARY_WEAPON_IAS) wIAS = parseInt(NUMBER_SECONDARY_WEAPON_IAS.value);
		return wIAS;
	}

	function displayFrames() {

		console.log("----------------- start new table(s) ------------------");

		removeAllChildNodes(CONTAINER_TABLE);

		if (wereform != HUMAN) {
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

		console.log("------------------ end new table(s) -------------------");

	}

	function displayTable(breakpoints, variableLabel, tableName) {
		let tableDiv = document.createElement("div");
		tableDiv.className = "tableHeader";
		let table = document.createElement("table");

		if (tableName !== undefined) {
			let headerDiv = document.createElement("div");
			headerDiv.className = "headerDiv";
			let headerText = document.createElement("h4");
			headerText.innerHTML = tableName;
			headerDiv.appendChild(headerText);
			tableDiv.appendChild(headerDiv);
		}

		addTableHeader(table, variableLabel);

		for (const [tableVariableIndex, FPA] of breakpoints) {
			addTableRow(table, tableVariableIndex, FPA);
		}

		tableDiv.appendChild(table);
		CONTAINER_TABLE.appendChild(tableDiv);
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
		if (wereform == WEREWOLF) {
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

		let tableName = undefined;
		if (isPrimary) {
			if (isAlternate) tableName = "Primary Weapon Second Animation";
			else tableName = "Primary Weapon";
		} else {
			tableName = "Secondary Weapon";
		}

		displayBreakpoints(accelerationTable, tableName);

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
		let primaryWSM = CHECKBOX_WSM_BUGGED.checked ? primaryWeapon.WSM - secondaryWeapon.WSM + averageWSM : primaryWeapon.WSM + secondaryWeapon.WSM - averageWSM;
		let secondaryWSM = CHECKBOX_WSM_BUGGED.checked ? averageWSM : 2 * secondaryWeapon.WSM - averageWSM;
		console.log("primaryWSM: " + primaryWSM);
		console.log("secondaryWSM: " + secondaryWSM);

		let primaryEIAS = calculateEIAS(primaryWSM, getWeaponIAS(true));
		let secondaryEIAS = calculateEIAS(secondaryWSM, getWeaponIAS(false));
		console.log("primaryEIAS: " + primaryEIAS);
		console.log("secondaryEIAS: " + secondaryEIAS);

		let accelerationTable = new Map();

		let temp = 0;
		for (let acceleration = 0; acceleration <= maxAccelerationIncrease; acceleration++) {
			let acceleration1 = tableVariable == TABLE_VARIABLE_SECONDARY_WEAPON_IAS ? 0 : acceleration;
			let acceleration2 = tableVariable == TABLE_VARIABLE_PRIMARY_WEAPON_IAS ? 0 : acceleration;
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
		console.log("framesPerDirection1: " + framesPerDirection1);
		console.log("framesPerDirection2: " + framesPerDirection2);
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
			let evenFPA =  Math.ceil(256 * (framesPerDirection2 - rollback3) / frameLengthDivisor) - 1;
			let oddFPA =  Math.ceil(256 * (framesPerDirection2 - rollback4) / frameLengthDivisor) - 1;
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
				if (FPA2 == FPA3) {
					accelerationOddTable.set(acceleration, FPA + "+(" + FPA2 + ")+" + oddFPA);
				} else if (FPA2 == FPA4) {
					accelerationOddTable.set(acceleration, FPA + "+" + FPA2 + "+(" + FPA3 + "+" + FPA4 + ")+" + oddFPA);
				} else {
					accelerationOddTable.set(acceleration, FPA + "+" + FPA2 + "+(" + FPA3 + ")+" + oddFPA);
				}
				console.log("(odd) acceleration=" + acceleration + ",FPA=" + FPA + ",FPA2=" + FPA2 + ",FPA3=" + FPA3 + ",FPA4=" + FPA4 + ",oddFPA=" + oddFPA);
			}
		}

		displayBreakpoints(accelerationEvenTable);
		if (weaponType == CROSSBOW) displayBreakpoints(accelerationOddTable);

		console.log(" -- end displayStrafeTable -- ");

	}

	function calculateEIAS(WSM, wIAS) {
		let SIAS = calculateSIAS();
		console.log("SIAS: " + SIAS);
		let IAS = wIAS;
		if (tableVariable != TABLE_VARIABLE_IAS) IAS += parseInt(NUMBER_IAS.value);
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
		if (CHECKBOX_WSM_BUGGED.checked) {
			return isPrimary ? averageWSM - secondaryWSM + primaryWSM : averageWSM;
		} else {
			return isPrimary ? averageWSM : averageWSM - primaryWSM + secondaryWSM;
		}
		/*return (CHECKBOX_WSM_BUGGED.checked && !isPrimary) ?
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

	function displayBreakpoints(table, tableName) {

		let newTable = new Map();

		let variableLabel = undefined;

		if (skill == WHIRLWIND) {
			displayTable(table, "WIAS");
			return;
		}
		
		if (isTableVariableSkill()) {
			variableLabel = "Level";
			let skill = getTableVariableSkill();
			for (const [accelerationNeeded, FPA] of table) {
				let level = skill.getLevelFromEIAS(accelerationNeeded);
				newTable.set(level, FPA);
				console.log("acceleration=" + accelerationNeeded + ",FPA=" + FPA + ",level=" + level);
			}
			
		} else if (tableVariable == TABLE_VARIABLE_IAS || tableVariable == TABLE_VARIABLE_PRIMARY_WEAPON_IAS || tableVariable == TABLE_VARIABLE_SECONDARY_WEAPON_IAS) {
			variableLabel = tableVariable == TABLE_VARIABLE_IAS ? "IAS" : "WIAS";
			for (const [accelerationNeeded, FPA] of table) {
				let IAS = convertEIAStoIAS(accelerationNeeded);
				if (wereform != HUMAN) IAS -= getWeaponIAS(true);
				if (IAS < 0) IAS = 0;
				newTable.set(IAS, FPA);
			}
		} else {
			console.log("conversion not yet implemented");
		}

		displayTable(newTable, variableLabel, tableName);
	}

	function isCharacterSelected() {
		return character == AMAZON || character == ASSASSIN || character == BARBARIAN
			|| character == DRUID || character == NECROMANCER || character == PALADIN || character == SORCERESS; // readability
	}

	function calculateFramesPerDirection(weaponType) {

		if (skill == KICK) return character == ASSASSIN ? 13 : 12;

		if (character == BARBARIAN && weaponType == TWO_HANDED_SWORD && (CHECKBOX_IS_ONE_HANDED.checked || isDualWielding)) weaponType = ONE_HANDED_SWINGING;

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

		let SIAS = SKILL_FANATICISM.calculate(tableVariable) + SKILL_BURST_OF_SPEED.calculate(tableVariable)
			+ SKILL_WEREWOLF.calculate(tableVariable) + SKILL_FRENZY.calculate(tableVariable) - SKILL_HOLY_FREEZE.calculate(tableVariable);

		if (CHECKBOX_DECREPIFY.checked) SIAS -= 50;

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
		return Math.max(MIN_EIAS, Math.min(MAX_EIAS, EIAS));
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
		if (character == BARBARIAN && weaponType == TWO_HANDED_SWORD && (CHECKBOX_IS_ONE_HANDED.checked || isDualWielding)) weaponType = ONE_HANDED_SWINGING;
		return weaponType.getActionFrame(character);
	}

	function calculateWhirlwindFPA(FPA) {
		for (const [calculatedFPA, adjustedFPA] of ADJUSTED_WHIRLWIND_FPAS) {
			if (FPA <= calculatedFPA) return adjustedFPA;
		}
		return 16;
	}

	function canBeEquipped(weapon) {
		let name = weapon.name;
		let weaponType = weapon.type;
		let itemClass = weapon.itemClass;
		if (character == MERC_A1 && weaponType != BOW) return false;
		if (character == MERC_A2 && itemClass != CLASS_POLEARM && itemClass != CLASS_SPEAR && itemClass != CLASS_JAVELIN) return false;
		if (character == MERC_A5 && itemClass != CLASS_SWORD) return false;
		if (character != ASSASSIN && weaponType == CLAW) return false;
		if (character != AMAZON && (
			name == "Stag Bow" || name == "Reflex Bow" || name == "Ashwood Bow" || name == "Ceremonial Bow" || name == "Matriarchal Bow" || name == "Grand Matron Bow" ||
			name == "Maiden Javelin" || name == "Ceremonial Javelin" || name == "Matriarchal Javelin" ||
			name == "Maiden Spear" || name == "Maiden Pike" || name == "Ceremonial Spear" || name == "Ceremonial Pike" || name == "Matriarchal Spear" || name == "Matriarchal Pike"
			)) return false;
		if (character != SORCERESS && itemClass == CLASS_ORB) return false;
		return true;
	}

	function generateLink() {
		let data = {
			"character": character,
			"wereform": wereform,
			"pweapon": primaryWeapon.name,
			"skill": skill.name,
			"sweapon": secondaryWeapon.name,
			"tablevar": tableVariable.id,
			"pwias": NUMBER_PRIMARY_WEAPON_IAS.value,
			"swias": NUMBER_SECONDARY_WEAPON_IAS.value,
			"ias": NUMBER_IAS.value,
			"fanat": NUMBER_FANATICISM.value,
			"bos": NUMBER_BURST_OF_SPEED.value,
			"ww": NUMBER_WEREWOLF.value,
			"frenzy": NUMBER_FRENZY.value,
			"hf": NUMBER_HOLY_FREEZE.value,
			"decrep": CHECKBOX_DECREPIFY.checked,
			"onehand": CHECKBOX_IS_ONE_HANDED.checked,
			"wsmbug": CHECKBOX_WSM_BUGGED.checked
		};
		let encodedData = btoa(JSON.stringify(data));
		let link = window.location.href;
		if (link.includes("?data=")) link = link.substring(0, link.indexOf("?data="));
		copyToClipboard(link + "?data=" + encodedData);
	}

	function loadFromParams() {
		let params = new URLSearchParams(location.search);
		let encode = params.get("data");
		if (encode == null) return;
		let data = JSON.parse(atob(encode));
		character = data["character"];
		SELECT_CHARACTER.value = character;
		onCharacterChange(false);
		wereform = data["wereform"];
		SELECT_WEREFORM.value = wereform;
		onWereformChange(false);
		primaryWeapon = WEAPONS.get(data["pweapon"]);
		SELECT_PRIMARY_WEAPON.value = primaryWeapon.name;
		onPrimaryWeaponChange(false);
		CHECKBOX_IS_ONE_HANDED.checked = data["onehand"];
		let weaponType = primaryWeapon.type;
		if ((character == ASSASSIN && weaponType == CLAW) || (character == BARBARIAN
				&& (weaponType.isOneHand || weaponType == TWO_HANDED_SWORD))) {
			secondaryWeapon = WEAPONS.get(data["sweapon"]);
			SELECT_SECONDARY_WEAPON.value = secondaryWeapon.name;
			onSecondaryWeaponChange(false);
		}
		tableVariable = document.querySelector('input[id="' + data["tablevar"] + '"]');
		tableVariable.checked = true;
		onTableVariableChange(false);
		skill = SKILLS.get(data["skill"]);
		SELECT_SKILL.value = skill.name;
		onSkillChange(false);
		NUMBER_PRIMARY_WEAPON_IAS.value = data["pwias"];
		NUMBER_SECONDARY_WEAPON_IAS.value = data["swias"];
		NUMBER_IAS.value = data["ias"];
		NUMBER_FANATICISM.value = data["fanat"];
		NUMBER_BURST_OF_SPEED.value = data["bos"];
		NUMBER_WEREWOLF.value = data["ww"];
		NUMBER_FRENZY.value = data["frenzy"];
		NUMBER_HOLY_FREEZE.value = data["hf"];
		CHECKBOX_DECREPIFY.checked = data["decrep"];
		CHECKBOX_WSM_BUGGED.checked = data["wsmbug"];
	}

}

/**
 * https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript/33928558#33928558
 */
 function copyToClipboard(text) {
	if (window.clipboardData && window.clipboardData.setData) {
		// Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
		return window.clipboardData.setData("Text", text);

	}
	else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
		var textarea = document.createElement("textarea");
		textarea.textContent = text;
		textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
		document.body.appendChild(textarea);
		textarea.select();
		try {
			return document.execCommand("copy");  // Security exception may be thrown by some browsers.
		}
		catch (ex) {
			console.warn("Copy to clipboard failed.", ex);
			return prompt("Copy to clipboard: Ctrl+C, Enter", text);
		}
		finally {
			document.body.removeChild(textarea);
		}
	}
}

function setupInputElement(element, eventListener) {
	element.addEventListener("change", eventListener, false);
	if (element.type == "number") {
		element.onkeydown = function (e) { // only allows the input of numbers, no negative signs
			if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8)) {
				return false;
			}
		}
	}
	return element;
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
	tdIAS.innerHTML = IAS;

	let tdFrame = document.createElement("td");
	tdFrame.innerHTML = frame;

	tableRow.appendChild(tdIAS);
	tableRow.appendChild(tdFrame);

	table.appendChild(tableRow);
}

function addTableHeader(table, variableLabel) {

	let tableRow = document.createElement("tr");

	let thVariableLabel = document.createElement("th");
	thVariableLabel.innerHTML = variableLabel;

	let tdFPA = document.createElement("th");
	tdFPA.innerHTML = "FPA";

	tableRow.appendChild(thVariableLabel);
	tableRow.appendChild(tdFPA);

	table.appendChild(tableRow);
}

class WeaponType {

	constructor(isMelee, isOneHand, frameData) {
		this.isMelee = isMelee;
		this.isOneHand = isOneHand;
		this.frameData = new Map(frameData);
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

	constructor(input, min, factor, max, tableVariable, predicate) {
		this.input = input;
		this.min = min;
		this.factor = factor;
		this.max = max;
		this.tableVariable = tableVariable;
		this.predicate = predicate;
		this.reverse = new Map();
		for (let level = 60; level >= 0; level--) {
			this.reverse.set(this.getEIASFromLevel(level), level);
		}
	}

	calculate(tableVariable) {
		if (this.tableVariable == tableVariable || (this.predicate != null && !this.predicate())) return 0;
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

	constructor(name, WSM, type, itemClass, maxSockets) {
		this.name = name;
		this.WSM = WSM;
		this.type = type;
		this.itemClass = itemClass;
		this.maxSockets = maxSockets;
	}

}

class Skill {

	constructor(name, isDualWieldOnly) {
		this.name = name;
		this.isDualWieldOnly = isDualWieldOnly;
	}

}

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

const SKILLS = new Map();
const STANDARD = add(new Skill("Standard", false));
const KICK = add(new Skill("Kick", false));
const THROW = add(new Skill("Throw", false));
const IMPALE = add(new Skill("Impale", false));
const JAB = add(new Skill("Jab", false));
const STRAFE = add(new Skill("Strafe", false));
const FEND = add(new Skill("Fend", false));
const TIGER_STRIKE = add(new Skill("Tiger Strike", false));
const COBRA_STRIKE = add(new Skill("Cobra Strike", false));
const PHOENIX_STRIKE = add(new Skill("Phoenix Strike", false));
const FISTS_OF_FIRE = add(new Skill("Fists of Fire", false));
const CLAWS_OF_THUNDER = add(new Skill("Claws of Thunder", false));
const BLADES_OF_ICE = add(new Skill("Blades of Ice", false));
const DRAGON_CLAW = add(new Skill("Dragon Claw", true));
const DRAGON_TAIL = add(new Skill("Dragon Tail", false));
const DRAGON_TALON = add(new Skill("Dragon Talon", false));
const LAYING_TRAPS = add(new Skill("Laying Traps", false));
const DOUBLE_SWING = add(new Skill("Double Swing", true));
const FRENZY = add(new Skill("Frenzy", true));
const DOUBLE_THROW = add(new Skill("Double Throw", true));
const WHIRLWIND = add(new Skill("Whirlwind", false));
const CONCENTRATE = add(new Skill("Concentrate", false));
const BERSERK = add(new Skill("Berserk", false));
const BASH = add(new Skill("Bash", false));
const STUN = add(new Skill("Stun", false));
const ZEAL = add(new Skill("Zeal", false));
const SMITE = add(new Skill("Smite", false));
const FERAL_RAGE = add(new Skill("Feral Rage", false));
const HUNGER = add(new Skill("Hunger", false));
const RABIES = add(new Skill("Rabies", false));
const FURY = add(new Skill("Fury", false));
const SACRIFICE = add(new Skill("Sacrifice", false));
const VENGEANCE = add(new Skill("Vengeance", false));
const CONVERSION = add(new Skill("Conversion", false));

function add(skill) { SKILLS.set(skill.name, skill); return skill; }

const UNARMED = new WeaponType(true, true, [
	[AMAZON, [13, 8]],
	[ASSASSIN, [11, 12, 6]],
	[BARBARIAN, [12, 6]],
	[DRUID, [16, 8]],
	[NECROMANCER, [15, 8]],
	[PALADIN, [14, 7]],
	[SORCERESS, [16, 9]]
]);
const CLAW = new WeaponType(true, true, [[ASSASSIN, [11, 12, 0]]]);
const ONE_HANDED_SWINGING = new WeaponType(true, true, [
	[AMAZON, [16, 10]],
	[ASSASSIN, [15, 7]],
	[BARBARIAN, [16, 7]],
	[DRUID, [19, 9]],
	[NECROMANCER, [19, 9]],
	[PALADIN, [15, 7]],
	[SORCERESS, [20, 12]],
	[MERC_A5, 16]
]);
const ONE_HANDED_THRUSTING = new WeaponType(true, true, [
	[AMAZON, [15, 9]],
	[ASSASSIN, [15, 7]],
	[BARBARIAN, [16, 7]],
	[DRUID, [19, 8]],
	[NECROMANCER, [19, 9]],
	[PALADIN, [17, 8]],
	[SORCERESS, [19, 11]],
	[MERC_A2, 16]
]);
const TWO_HANDED_SWORD = new WeaponType(true, false, [
	[AMAZON, [20, 12]],
	[ASSASSIN, [23, 11]],
	[BARBARIAN, [18, 8]],
	[DRUID, [21, 10]],
	[NECROMANCER, [23, 11]],
	[PALADIN, [19, 8]],
	[SORCERESS, [24, 14]],
	[MERC_A5, 16]
]);
const TWO_HANDED_THRUSTING = new WeaponType(true, false, [
	[AMAZON, [18, 11]],
	[ASSASSIN, [23, 10]],
	[BARBARIAN, [19, 9]],
	[DRUID, [23, 9]],
	[NECROMANCER, [24, 10]],
	[PALADIN, [20, 8]],
	[SORCERESS, [23, 13]],
	[MERC_A2, 16]
]);
// all other two handed weapons
const TWO_HANDED = new WeaponType(true, false, [
	[AMAZON, [20, 12]],
	[ASSASSIN, [19, 9]],
	[BARBARIAN, [19, 9]],
	[DRUID, [17, 9]],
	[NECROMANCER, [20, 11]],
	[PALADIN, [18, 19, 9]],
	[SORCERESS, [18, 11]],
	[MERC_A2, 16]
]);
const BOW = new WeaponType(false, false, [
	[AMAZON, [14, 6]],
	[ASSASSIN, [16, 7]],
	[BARBARIAN, [15, 7]],
	[DRUID, [16, 8]],
	[NECROMANCER, [18, 9]],
	[PALADIN, [16, 8]],
	[SORCERESS, [17, 9]],
	[MERC_A1, 15]
]);
const CROSSBOW = new WeaponType(false, false, [
	[AMAZON, [20, 9]],
	[ASSASSIN, [21, 10]],
	[BARBARIAN, [20, 10]],
	[DRUID, [20, 10]],
	[NECROMANCER, [20, 11]],
	[PALADIN, [20, 10]],
	[SORCERESS, [20, 11]]
]);
const THROWING = new WeaponType(true, true, [
	[AMAZON, 16],
	[ASSASSIN, 16],
	[BARBARIAN, 16],
	[DRUID, 18],
	[NECROMANCER, 20],
	[PALADIN, 16],
	[SORCERESS, 20]
]);



/**
 * [calculatedFPA, adjustedFPA]
 */
 const ADJUSTED_WHIRLWIND_FPAS = new Map([
	[11, 4], // 0-11
	[14, 6], // 12-14
	[17, 8], // 15-17
	[19, 10], // 18-19
	[22, 12], // 20-22
	[25, 14] // 23-25
//  [99, 16] // 26+
]);

const CLASS_NONE = "None";
const CLASS_AXE = "Axe";
const CLASS_DAGGER = "Dagger";
const CLASS_POLEARM = "Polearm";
const CLASS_JAVELIN = "Javelin";
const CLASS_SPEAR = "Spear";
const CLASS_SWORD = "Sword";
const CLASS_MACE = "Mace";
const CLASS_MISSILE = "Missile";
const CLASS_STAFF = "Staff";
const CLASS_ORB = "Orb";
const CLASS_CLAW = "Claw";
const CLASS_THROWING = "Throwing";

const WEAPONS = new Map([
	["None", new Weapon("None", 0, UNARMED, CLASS_NONE, 0)],
	["Ancient Axe", new Weapon("Ancient Axe", 10, TWO_HANDED, CLASS_AXE, 6)],
	["Ancient Sword", new Weapon("Ancient Sword", 0, ONE_HANDED_SWINGING, CLASS_SWORD, 3)],
	["Arbalest", new Weapon("Arbalest", -10, CROSSBOW, CLASS_MISSILE, 3)],
	["Archon Staff", new Weapon("Archon Staff", 10, TWO_HANDED, CLASS_STAFF, 6)],
	["Ashwood Bow", new Weapon("Ashwood Bow", 0, BOW, CLASS_MISSILE, 5)],
	["Ataghan", new Weapon("Ataghan", -20, ONE_HANDED_SWINGING, CLASS_SWORD, 2)],
	["Axe", new Weapon("Axe", 10, ONE_HANDED_SWINGING, CLASS_AXE, 4)],
	["Balanced Axe", new Weapon("Balanced Axe", -10, ONE_HANDED_SWINGING, CLASS_THROWING, 0)],
	["Balanced Knife", new Weapon("Balanced Knife", -20, ONE_HANDED_THRUSTING, CLASS_THROWING, 0)],
	["Ballista", new Weapon("Ballista", 10, CROSSBOW, CLASS_MISSILE, 6)],
	["Balrog Blade", new Weapon("Balrog Blade", 0, TWO_HANDED_SWORD, CLASS_SWORD, 4)],
	["Balrog Spear", new Weapon("Balrog Spear", 10, ONE_HANDED_THRUSTING, CLASS_JAVELIN, 0)],
	["Barbed Club", new Weapon("Barbed Club", 0, ONE_HANDED_SWINGING, CLASS_MACE, 3)],
	["Bardiche", new Weapon("Bardiche", 10, TWO_HANDED, CLASS_POLEARM, 3)],
	["Bastard Sword", new Weapon("Bastard Sword", 10, TWO_HANDED_SWORD, CLASS_SWORD, 4)],
	["Battle Axe", new Weapon("Battle Axe", 10, TWO_HANDED, CLASS_AXE, 5)],
	["Battle Cestus", new Weapon("Battle Cestus", -10, CLAW, CLASS_CLAW, 2)],
	["Battle Dart", new Weapon("Battle Dart", 0, ONE_HANDED_THRUSTING, CLASS_THROWING, 0)],
	["Battle Hammer", new Weapon("Battle Hammer", 20, ONE_HANDED_SWINGING, CLASS_MACE, 4)],
	["Battle Scythe", new Weapon("Battle Scythe", -10, TWO_HANDED, CLASS_POLEARM, 5)],
	["Battle Staff", new Weapon("Battle Staff", 0, TWO_HANDED, CLASS_STAFF, 4)],
	["Battle Sword", new Weapon("Battle Sword", 0, ONE_HANDED_SWINGING, CLASS_SWORD, 4)],
	["Bearded Axe", new Weapon("Bearded Axe", 0, TWO_HANDED, CLASS_AXE, 5)],
	["Bec-de-Corbin", new Weapon("Bec-de-Corbin", 0, TWO_HANDED, CLASS_POLEARM, 6)],
	["Berserker Axe", new Weapon("Berserker Axe", 0, ONE_HANDED_SWINGING, CLASS_AXE, 6)],
	["Bill", new Weapon("Bill", 0, TWO_HANDED, CLASS_POLEARM, 4)],
	["Blade Bow", new Weapon("Blade Bow", -10, BOW, CLASS_MISSILE, 4)],
	["Blade Talons", new Weapon("Blade Talons", -20, CLAW, CLASS_CLAW, 3)],
	["Blade", new Weapon("Blade", -10, ONE_HANDED_THRUSTING, CLASS_DAGGER, 2)],
	["Bone Knife", new Weapon("Bone Knife", -20, ONE_HANDED_THRUSTING, CLASS_DAGGER, 1)],
	["Bone Wand", new Weapon("Bone Wand", -20, ONE_HANDED_SWINGING, CLASS_STAFF, 2)],
	["Brandistock", new Weapon("Brandistock", -20, TWO_HANDED_THRUSTING, CLASS_SPEAR, 5)],
	["Broad Axe", new Weapon("Broad Axe", 0, TWO_HANDED, CLASS_AXE, 5)],
	["Broad Sword", new Weapon("Broad Sword", 0, ONE_HANDED_SWINGING, CLASS_SWORD, 4)],
	["Burnt Wand", new Weapon("Burnt Wand", 0, ONE_HANDED_SWINGING, CLASS_STAFF, 1)],
	["Caduceus", new Weapon("Caduceus", -10, ONE_HANDED_SWINGING, CLASS_MACE, 5)],
	["Cedar Bow", new Weapon("Cedar Bow", 0, BOW, CLASS_MISSILE, 5)],
	["Cedar Staff", new Weapon("Cedar Staff", 10, TWO_HANDED, CLASS_STAFF, 4)],
	["Ceremonial Bow", new Weapon("Ceremonial Bow", 10, BOW, CLASS_MISSILE, 5)],
	["Ceremonial Javelin", new Weapon("Ceremonial Javelin", -10, ONE_HANDED_THRUSTING, CLASS_JAVELIN, 0)],
	["Ceremonial Pike", new Weapon("Ceremonial Pike", 20, TWO_HANDED_THRUSTING, CLASS_SPEAR, 6)],
	["Ceremonial Spear", new Weapon("Ceremonial Spear", 0, TWO_HANDED_THRUSTING, CLASS_SPEAR, 6)],
	["Cestus", new Weapon("Cestus", 0, CLAW, CLASS_CLAW, 2)],
	["Champion Axe", new Weapon("Champion Axe", -10, TWO_HANDED, CLASS_AXE, 6)],
	["Champion Sword", new Weapon("Champion Sword", -10, TWO_HANDED_SWORD, CLASS_SWORD, 4)],
	["Chu-Ko-Nu", new Weapon("Chu-Ko-Nu", -60, CROSSBOW, CLASS_MISSILE, 5)],
	["Cinquedeas", new Weapon("Cinquedeas", -20, ONE_HANDED_THRUSTING, CLASS_DAGGER, 3)],
	["Clasped Orb", new Weapon("Clasped Orb", 0, ONE_HANDED_SWINGING, CLASS_ORB, 3)],
	["Claws", new Weapon("Claws", -10, CLAW, CLASS_CLAW, 3)],
	["Claymore", new Weapon("Claymore", 10, TWO_HANDED_SWORD, CLASS_SWORD, 4)],
	["Cleaver", new Weapon("Cleaver", 10, ONE_HANDED_SWINGING, CLASS_AXE, 4)],
	["Cloudy Sphere", new Weapon("Cloudy Sphere", 0, ONE_HANDED_SWINGING, CLASS_ORB, 3)],
	["Club", new Weapon("Club", -10, ONE_HANDED_SWINGING, CLASS_MACE, 2)],
	["Colossus Blade", new Weapon("Colossus Blade", 5, TWO_HANDED_SWORD, CLASS_SWORD, 6)],
	["Colossus Crossbow", new Weapon("Colossus Crossbow", 10, CROSSBOW, CLASS_MISSILE, 6)],
	["Colossus Sword", new Weapon("Colossus Sword", 10, TWO_HANDED_SWORD, CLASS_SWORD, 5)],
	["Colossus Voulge", new Weapon("Colossus Voulge", 10, TWO_HANDED, CLASS_POLEARM, 4)],
	["Composite Bow", new Weapon("Composite Bow", -10, BOW, CLASS_MISSILE, 4)],
	["Conquest Sword", new Weapon("Conquest Sword", 0, ONE_HANDED_SWINGING, CLASS_SWORD, 4)],
	["Crossbow", new Weapon("Crossbow", 0, CROSSBOW, CLASS_MISSILE, 4)],
	["Crowbill", new Weapon("Crowbill", -10, ONE_HANDED_SWINGING, CLASS_AXE, 6)],
	["Crusader Bow", new Weapon("Crusader Bow", 10, BOW, CLASS_MISSILE, 6)],
	["Cryptic Axe", new Weapon("Cryptic Axe", 10, TWO_HANDED, CLASS_POLEARM, 5)],
	["Cryptic Sword", new Weapon("Cryptic Sword", -10, ONE_HANDED_SWINGING, CLASS_SWORD, 4)],
	["Crystal Sword", new Weapon("Crystal Sword", 0, ONE_HANDED_SWINGING, CLASS_SWORD, 6)],
	["Crystalline Globe", new Weapon("Crystalline Globe", -10, ONE_HANDED_SWINGING, CLASS_ORB, 3)],
	["Cudgel", new Weapon("Cudgel", -10, ONE_HANDED_SWINGING, CLASS_MACE, 2)],
	["Cutlass", new Weapon("Cutlass", -30, ONE_HANDED_SWINGING, CLASS_SWORD, 2)],
	["Dacian Falx", new Weapon("Dacian Falx", 10, TWO_HANDED_SWORD, CLASS_SWORD, 4)],
	["Dagger", new Weapon("Dagger", -20, ONE_HANDED_THRUSTING, CLASS_DAGGER, 1)],
	["Decapitator", new Weapon("Decapitator", 10, TWO_HANDED, CLASS_AXE, 5)],
	["Demon Crossbow", new Weapon("Demon Crossbow", -60, CROSSBOW, CLASS_MISSILE, 5)],
	["Demon Heart", new Weapon("Demon Heart", 0, ONE_HANDED_SWINGING, CLASS_ORB, 3)],
	["Devil Star", new Weapon("Devil Star", 10, ONE_HANDED_SWINGING, CLASS_MACE, 3)],
	["Diamond Bow", new Weapon("Diamond Bow", 0, BOW, CLASS_MISSILE, 5)],
	["Dimensional Blade", new Weapon("Dimensional Blade", 0, ONE_HANDED_SWINGING, CLASS_SWORD, 6)],
	["Dimensional Shard", new Weapon("Dimensional Shard", 10, ONE_HANDED_SWINGING, CLASS_ORB, 3)],
	["Dirk", new Weapon("Dirk", 0, ONE_HANDED_THRUSTING, CLASS_DAGGER, 1)],
	["Divine Scepter", new Weapon("Divine Scepter", -10, ONE_HANDED_SWINGING, CLASS_MACE, 5)],
	["Double Axe", new Weapon("Double Axe", 10, ONE_HANDED_SWINGING, CLASS_AXE, 5)],
	["Double Bow", new Weapon("Double Bow", -10, BOW, CLASS_MISSILE, 4)],
	["Eagle Orb", new Weapon("Eagle Orb", -10, ONE_HANDED_SWINGING, CLASS_ORB, 3)],
	["Edge Bow", new Weapon("Edge Bow", 5, BOW, CLASS_MISSILE, 3)],
	["Elder Staff", new Weapon("Elder Staff", 0, TWO_HANDED, CLASS_STAFF, 4)],
	["Eldritch Orb", new Weapon("Eldritch Orb", -10, ONE_HANDED_SWINGING, CLASS_ORB, 3)],
	["Elegant Blade", new Weapon("Elegant Blade", -10, ONE_HANDED_SWINGING, CLASS_SWORD, 2)],
	["Espandon", new Weapon("Espandon", 0, TWO_HANDED_SWORD, CLASS_SWORD, 3)],
	["Ettin Axe", new Weapon("Ettin Axe", 10, ONE_HANDED_SWINGING, CLASS_AXE, 5)],
	["Executioner Sword", new Weapon("Executioner Sword", 10, TWO_HANDED_SWORD, CLASS_SWORD, 6)],
	["Falcata", new Weapon("Falcata", 0, ONE_HANDED_SWINGING, CLASS_SWORD, 2)],
	["Falchion", new Weapon("Falchion", 20, ONE_HANDED_SWINGING, CLASS_SWORD, 2)],
	["Fanged Knife", new Weapon("Fanged Knife", -20, ONE_HANDED_THRUSTING, CLASS_DAGGER, 3)],
	["Fascia", new Weapon("Fascia", 10, CLAW, CLASS_CLAW, 2)],
	["Feral Axe", new Weapon("Feral Axe", -15, TWO_HANDED, CLASS_AXE, 4)],
	["Feral Claws", new Weapon("Feral Claws", -20, CLAW, CLASS_CLAW, 3)],
	["Flail", new Weapon("Flail", -10, ONE_HANDED_SWINGING, CLASS_MACE, 5)],
	["Flamberge", new Weapon("Flamberge", -10, TWO_HANDED_SWORD, CLASS_SWORD, 5)],
	["Flanged Mace", new Weapon("Flanged Mace", 0, ONE_HANDED_SWINGING, CLASS_MACE, 2)],
	["Flying Axe", new Weapon("Flying Axe", 10, ONE_HANDED_SWINGING, CLASS_THROWING, 0)],
	["Flying Knife", new Weapon("Flying Knife", 0, ONE_HANDED_THRUSTING, CLASS_THROWING, 0)],
	["Francisca", new Weapon("Francisca", 10, ONE_HANDED_SWINGING, CLASS_THROWING, 0)],
	["Fuscina", new Weapon("Fuscina", 0, TWO_HANDED_THRUSTING, CLASS_SPEAR, 4)],
	["Ghost Glaive", new Weapon("Ghost Glaive", 20, ONE_HANDED_THRUSTING, CLASS_JAVELIN, 0)],
	["Ghost Spear", new Weapon("Ghost Spear", 0, TWO_HANDED_THRUSTING, CLASS_SPEAR, 6)],
	["Ghost Wand", new Weapon("Ghost Wand", 10, ONE_HANDED_SWINGING, CLASS_STAFF, 2)],
	["Giant Axe", new Weapon("Giant Axe", 10, TWO_HANDED, CLASS_AXE, 6)],
	["Giant Sword", new Weapon("Giant Sword", 0, TWO_HANDED_SWORD, CLASS_SWORD, 4)],
	["Giant Thresher", new Weapon("Giant Thresher", -10, TWO_HANDED, CLASS_POLEARM, 6)],
	["Gladius", new Weapon("Gladius", 0, ONE_HANDED_SWINGING, CLASS_SWORD, 2)],
	["Glaive", new Weapon("Glaive", 20, ONE_HANDED_THRUSTING, CLASS_JAVELIN, 0)],
	["Glorious Axe", new Weapon("Glorious Axe", 10, TWO_HANDED, CLASS_AXE, 6)],
	["Glowing Orb", new Weapon("Glowing Orb", -10, ONE_HANDED_SWINGING, CLASS_ORB, 3)],
	["Gnarled Staff", new Weapon("Gnarled Staff", 10, TWO_HANDED, CLASS_STAFF, 4)],
	["Gorgon Crossbow", new Weapon("Gorgon Crossbow", 0, CROSSBOW, CLASS_MISSILE, 4)],
	["Gothic Axe", new Weapon("Gothic Axe", -10, TWO_HANDED, CLASS_AXE, 6)],
	["Gothic Bow", new Weapon("Gothic Bow", 10, BOW, CLASS_MISSILE, 6)],
	["Gothic Staff", new Weapon("Gothic Staff", 0, TWO_HANDED, CLASS_STAFF, 4)],
	["Gothic Sword", new Weapon("Gothic Sword", 10, TWO_HANDED_SWORD, CLASS_SWORD, 4)],
	["Grand Matron Bow", new Weapon("Grand Matron Bow", 10, BOW, CLASS_MISSILE, 5)],
	["Grand Scepter", new Weapon("Grand Scepter", 10, ONE_HANDED_SWINGING, CLASS_MACE, 3)],
	["Grave Wand", new Weapon("Grave Wand", 0, ONE_HANDED_SWINGING, CLASS_STAFF, 2)],
	["Great Axe", new Weapon("Great Axe", -10, TWO_HANDED, CLASS_AXE, 6)],
	["Great Bow", new Weapon("Great Bow", -10, BOW, CLASS_MISSILE, 4)],
	["Great Maul", new Weapon("Great Maul", 20, TWO_HANDED, CLASS_MACE, 6)],
	["Great Pilum", new Weapon("Great Pilum", 0, ONE_HANDED_THRUSTING, CLASS_JAVELIN, 0)],
	["Great Poleaxe", new Weapon("Great Poleaxe", 0, TWO_HANDED, CLASS_POLEARM, 6)],
	["Great Sword", new Weapon("Great Sword", 10, TWO_HANDED_SWORD, CLASS_SWORD, 6)],
	["Greater Claws", new Weapon("Greater Claws", -20, CLAW, CLASS_CLAW, 3)],
	["Greater Talons", new Weapon("Greater Talons", -30, CLAW, CLASS_CLAW, 3)],
	["Grim Scythe", new Weapon("Grim Scythe", -10, TWO_HANDED, CLASS_POLEARM, 6)],
	["Grim Wand", new Weapon("Grim Wand", 0, ONE_HANDED_SWINGING, CLASS_STAFF, 2)],
	["Halberd", new Weapon("Halberd", 0, TWO_HANDED, CLASS_POLEARM, 6)],
	["Hand Axe", new Weapon("Hand Axe", 0, ONE_HANDED_SWINGING, CLASS_AXE, 2)],
	["Hand Scythe", new Weapon("Hand Scythe", -10, CLAW, CLASS_CLAW, 2)],
	["Harpoon", new Weapon("Harpoon", -10, ONE_HANDED_THRUSTING, CLASS_JAVELIN, 0)],
	["Hatchet Hands", new Weapon("Hatchet Hands", 10, CLAW, CLASS_CLAW, 2)],
	["Hatchet", new Weapon("Hatchet", 0, ONE_HANDED_SWINGING, CLASS_AXE, 2)],
	["Heavenly Stone", new Weapon("Heavenly Stone", -10, ONE_HANDED_SWINGING, CLASS_ORB, 3)],
	["Heavy Crossbow", new Weapon("Heavy Crossbow", 10, CROSSBOW, CLASS_MISSILE, 6)],
	["Highland Blade", new Weapon("Highland Blade", -5, TWO_HANDED_SWORD, CLASS_SWORD, 4)],
	["Holy Water Sprinkler", new Weapon("Holy Water Sprinkler", 10, ONE_HANDED_SWINGING, CLASS_MACE, 3)],
	["Hunter's Bow", new Weapon("Hunter's Bow", -10, BOW, CLASS_MISSILE, 4)],
	["Hurlbat", new Weapon("Hurlbat", -10, ONE_HANDED_SWINGING, CLASS_THROWING, 0)],
	["Hydra Bow", new Weapon("Hydra Bow", 10, BOW, CLASS_MISSILE, 6)],
	["Hydra Edge", new Weapon("Hydra Edge", 10, ONE_HANDED_SWINGING, CLASS_SWORD, 2)],
	["Hyperion Javelin", new Weapon("Hyperion Javelin", -10, ONE_HANDED_THRUSTING, CLASS_JAVELIN, 0)],
	["Hyperion Spear", new Weapon("Hyperion Spear", -10, TWO_HANDED_THRUSTING, CLASS_SPEAR, 3)],
	["Jagged Star", new Weapon("Jagged Star", 10, ONE_HANDED_SWINGING, CLASS_MACE, 3)],
	["Jared's Stone", new Weapon("Jared's Stone", 10, ONE_HANDED_SWINGING, CLASS_ORB, 3)],
	["Javelin", new Weapon("Javelin", -10, ONE_HANDED_THRUSTING, CLASS_JAVELIN, 0)],
	["Jo Staff", new Weapon("Jo Staff", -10, TWO_HANDED, CLASS_STAFF, 2)],
	["Katar", new Weapon("Katar", -10, CLAW, CLASS_CLAW, 2)],
	["Knout", new Weapon("Knout", -10, ONE_HANDED_SWINGING, CLASS_MACE, 5)],
	["Kris", new Weapon("Kris", -20, ONE_HANDED_THRUSTING, CLASS_DAGGER, 3)],
	["Lance", new Weapon("Lance", 20, TWO_HANDED_THRUSTING, CLASS_SPEAR, 6)],
	["Large Axe", new Weapon("Large Axe", -10, TWO_HANDED, CLASS_AXE, 4)],
	["Large Siege Bow", new Weapon("Large Siege Bow", 10, BOW, CLASS_MISSILE, 6)],
	["Legend Spike", new Weapon("Legend Spike", -10, ONE_HANDED_THRUSTING, CLASS_DAGGER, 2)],
	["Legend Sword", new Weapon("Legend Sword", -15, TWO_HANDED_SWORD, CLASS_SWORD, 3)],
	["Legendary Mallet", new Weapon("Legendary Mallet", 20, ONE_HANDED_SWINGING, CLASS_MACE, 4)],
	["Lich Wand", new Weapon("Lich Wand", -20, ONE_HANDED_SWINGING, CLASS_STAFF, 2)],
	["Light Crossbow", new Weapon("Light Crossbow", -10, CROSSBOW, CLASS_MISSILE, 3)],
	["Lochaber Axe", new Weapon("Lochaber Axe", 10, TWO_HANDED, CLASS_POLEARM, 3)],
	["Long Battle Bow", new Weapon("Long Battle Bow", 10, BOW, CLASS_MISSILE, 6)],
	["Long Bow", new Weapon("Long Bow", 0, BOW, CLASS_MISSILE, 5)],
	["Long Staff", new Weapon("Long Staff", 0, TWO_HANDED, CLASS_STAFF, 3)],
	["Long Sword", new Weapon("Long Sword", -10, ONE_HANDED_SWINGING, CLASS_SWORD, 4)],
	["Long War Bow", new Weapon("Long War Bow", 10, BOW, CLASS_MISSILE, 6)],
	["Mace", new Weapon("Mace", 0, ONE_HANDED_SWINGING, CLASS_MACE, 2)],
	["Maiden Javelin", new Weapon("Maiden Javelin", -10, ONE_HANDED_THRUSTING, CLASS_JAVELIN, 0)],
	["Maiden Pike", new Weapon("Maiden Pike", 10, TWO_HANDED_THRUSTING, CLASS_SPEAR, 6)],
	["Maiden Spear", new Weapon("Maiden Spear", 0, TWO_HANDED_THRUSTING, CLASS_SPEAR, 6)],
	["Mancatcher", new Weapon("Mancatcher", -20, TWO_HANDED_THRUSTING, CLASS_SPEAR, 5)],
	["Martel de Fer", new Weapon("Martel de Fer", 20, TWO_HANDED, CLASS_MACE, 6)],
	["Matriarchal Bow", new Weapon("Matriarchal Bow", -10, BOW, CLASS_MISSILE, 5)],
	["Matriarchal Javelin", new Weapon("Matriarchal Javelin", -10, ONE_HANDED_THRUSTING, CLASS_JAVELIN, 0)],
	["Matriarchal Pike", new Weapon("Matriarchal Pike", 20, TWO_HANDED_THRUSTING, CLASS_SPEAR, 6)],
	["Matriarchal Spear", new Weapon("Matriarchal Spear", 0, TWO_HANDED_THRUSTING, CLASS_SPEAR, 6)],
	["Maul", new Weapon("Maul", 10, TWO_HANDED, CLASS_MACE, 6)],
	["Mighty Scepter", new Weapon("Mighty Scepter", 0, ONE_HANDED_SWINGING, CLASS_MACE, 2)],
	["Military Axe", new Weapon("Military Axe", -10, TWO_HANDED, CLASS_AXE, 4)],
	["Military Pick", new Weapon("Military Pick", -10, ONE_HANDED_SWINGING, CLASS_AXE, 6)],
	["Mithril Point", new Weapon("Mithril Point", 0, ONE_HANDED_THRUSTING, CLASS_DAGGER, 1)],
	["Morning Star", new Weapon("Morning Star", 10, ONE_HANDED_SWINGING, CLASS_MACE, 3)],
	["Mythical Sword", new Weapon("Mythical Sword", 0, ONE_HANDED_SWINGING, CLASS_SWORD, 3)],
	["Naga", new Weapon("Naga", 0, ONE_HANDED_SWINGING, CLASS_AXE, 6)],
	["Ogre Axe", new Weapon("Ogre Axe", 0, TWO_HANDED, CLASS_POLEARM, 3)],
	["Ogre Maul", new Weapon("Ogre Maul", 10, TWO_HANDED, CLASS_MACE, 6)],
	["Partizan", new Weapon("Partizan", 10, TWO_HANDED, CLASS_POLEARM, 5)],
	["Pellet Bow", new Weapon("Pellet Bow", -10, CROSSBOW, CLASS_MISSILE, 3)],
	["Petrified Wand", new Weapon("Petrified Wand", 10, ONE_HANDED_SWINGING, CLASS_STAFF, 2)],
	["Phase Blade", new Weapon("Phase Blade", -30, ONE_HANDED_SWINGING, CLASS_SWORD, 6)],
	["Pike", new Weapon("Pike", 20, TWO_HANDED_THRUSTING, CLASS_SPEAR, 6)],
	["Pilum", new Weapon("Pilum", 0, ONE_HANDED_THRUSTING, CLASS_JAVELIN, 0)],
	["Poignard", new Weapon("Poignard", -20, ONE_HANDED_THRUSTING, CLASS_DAGGER, 1)],
	["Poleaxe", new Weapon("Poleaxe", 10, TWO_HANDED, CLASS_POLEARM, 5)],
	["Polished Wand", new Weapon("Polished Wand", 0, ONE_HANDED_SWINGING, CLASS_STAFF, 2)],
	["Quarterstaff", new Weapon("Quarterstaff", 0, TWO_HANDED, CLASS_STAFF, 3)],
	["Quhab", new Weapon("Quhab", 0, CLAW, CLASS_CLAW, 3)],
	["Razor Bow", new Weapon("Razor Bow", -10, BOW, CLASS_MISSILE, 4)],
	["Reflex Bow", new Weapon("Reflex Bow", 10, BOW, CLASS_MISSILE, 5)],
	["Reinforced Mace", new Weapon("Reinforced Mace", 0, ONE_HANDED_SWINGING, CLASS_MACE, 2)],
	["Repeating Crossbow", new Weapon("Repeating Crossbow", -40, CROSSBOW, CLASS_MISSILE, 5)],
	["Rondel", new Weapon("Rondel", 0, ONE_HANDED_THRUSTING, CLASS_DAGGER, 1)],
	["Rune Bow", new Weapon("Rune Bow", 0, BOW, CLASS_MISSILE, 5)],
	["Rune Scepter", new Weapon("Rune Scepter", 0, ONE_HANDED_SWINGING, CLASS_MACE, 2)],
	["Rune Staff", new Weapon("Rune Staff", 20, TWO_HANDED, CLASS_STAFF, 6)],
	["Rune Sword", new Weapon("Rune Sword", -10, ONE_HANDED_SWINGING, CLASS_SWORD, 4)],
	["Runic Talons", new Weapon("Runic Talons", -30, CLAW, CLASS_CLAW, 3)],
	["Sabre", new Weapon("Sabre", -10, ONE_HANDED_SWINGING, CLASS_SWORD, 2)],
	["Sacred Globe", new Weapon("Sacred Globe", -10, ONE_HANDED_SWINGING, CLASS_ORB, 3)],
	["Scepter", new Weapon("Scepter", 0, ONE_HANDED_SWINGING, CLASS_MACE, 2)],
	["Scimitar", new Weapon("Scimitar", -20, ONE_HANDED_SWINGING, CLASS_SWORD, 2)],
	["Scissors Katar", new Weapon("Scissors Katar", -10, CLAW, CLASS_CLAW, 3)],
	["Scissors Quhab", new Weapon("Scissors Quhab", 0, CLAW, CLASS_CLAW, 3)],
	["Scissors Suwayyah", new Weapon("Scissors Suwayyah", 0, CLAW, CLASS_CLAW, 3)],
	["Scourge", new Weapon("Scourge", -10, ONE_HANDED_SWINGING, CLASS_MACE, 5)],
	["Scythe", new Weapon("Scythe", -10, TWO_HANDED, CLASS_POLEARM, 5)],
	["Seraph Rod", new Weapon("Seraph Rod", 10, ONE_HANDED_SWINGING, CLASS_MACE, 3)],
	["Shadow Bow", new Weapon("Shadow Bow", 0, BOW, CLASS_MISSILE, 5)],
	["Shamshir", new Weapon("Shamshir", -10, ONE_HANDED_SWINGING, CLASS_SWORD, 2)],
	["Shillelagh", new Weapon("Shillelagh", 0, TWO_HANDED, CLASS_STAFF, 4)],
	["Short Battle Bow", new Weapon("Short Battle Bow", 0, BOW, CLASS_MISSILE, 5)],
	["Short Bow", new Weapon("Short Bow", 5, BOW, CLASS_MISSILE, 3)],
	["Short Siege Bow", new Weapon("Short Siege Bow", 0, BOW, CLASS_MISSILE, 5)],
	["Short Spear", new Weapon("Short Spear", 10, ONE_HANDED_THRUSTING, CLASS_JAVELIN, 0)],
	["Short Staff", new Weapon("Short Staff", -10, TWO_HANDED, CLASS_STAFF, 2)],
	["Short Sword", new Weapon("Short Sword", 0, ONE_HANDED_SWINGING, CLASS_SWORD, 2)],
	["Short War Bow", new Weapon("Short War Bow", 0, BOW, CLASS_MISSILE, 5)],
	["Siege Crossbow", new Weapon("Siege Crossbow", 0, CROSSBOW, CLASS_MISSILE, 4)],
	["Silver-edged Axe", new Weapon("Silver-edged Axe", 0, TWO_HANDED, CLASS_AXE, 5)],
	["Simbilan", new Weapon("Simbilan", 10, ONE_HANDED_THRUSTING, CLASS_JAVELIN, 0)],
	["Small Crescent", new Weapon("Small Crescent", 10, ONE_HANDED_SWINGING, CLASS_AXE, 4)],
	["Smoked Sphere", new Weapon("Smoked Sphere", 0, ONE_HANDED_SWINGING, CLASS_ORB, 3)],
	["Sparkling Ball", new Weapon("Sparkling Ball", 0, ONE_HANDED_SWINGING, CLASS_ORB, 3)],
	["Spear", new Weapon("Spear", -10, TWO_HANDED_THRUSTING, CLASS_SPEAR, 3)],
	["Spetum", new Weapon("Spetum", 0, TWO_HANDED_THRUSTING, CLASS_SPEAR, 6)],
	["Spiculum", new Weapon("Spiculum", 20, ONE_HANDED_THRUSTING, CLASS_JAVELIN, 0)],
	["Spider Bow", new Weapon("Spider Bow", 5, BOW, CLASS_MISSILE, 3)],
	["Spiked Club", new Weapon("Spiked Club", 0, ONE_HANDED_SWINGING, CLASS_MACE, 2)],
	["Stag Bow", new Weapon("Stag Bow", 0, BOW, CLASS_MISSILE, 5)],
	["Stalagmite", new Weapon("Stalagmite", 10, TWO_HANDED, CLASS_STAFF, 3)],
	["Stiletto", new Weapon("Stiletto", -10, ONE_HANDED_THRUSTING, CLASS_DAGGER, 2)],
	["Stygian Pike", new Weapon("Stygian Pike", 0, TWO_HANDED_THRUSTING, CLASS_SPEAR, 4)],
	["Stygian Pilum", new Weapon("Stygian Pilum", 0, ONE_HANDED_THRUSTING, CLASS_JAVELIN, 0)],
	["Suwayyah", new Weapon("Suwayyah", 0, CLAW, CLASS_CLAW, 3)],
	["Swirling Crystal", new Weapon("Swirling Crystal", 10, ONE_HANDED_SWINGING, CLASS_ORB, 3)],
	["Tabar", new Weapon("Tabar", 10, TWO_HANDED, CLASS_AXE, 5)],
	["Thresher", new Weapon("Thresher", -10, TWO_HANDED, CLASS_POLEARM, 5)],
	["Throwing Axe", new Weapon("Throwing Axe", 10, ONE_HANDED_SWINGING, CLASS_THROWING, 0)],
	["Throwing Knife", new Weapon("Throwing Knife", 0, ONE_HANDED_THRUSTING, CLASS_THROWING, 0)],
	["Throwing Spear", new Weapon("Throwing Spear", -10, ONE_HANDED_THRUSTING, CLASS_JAVELIN, 0)],
	["Thunder Maul", new Weapon("Thunder Maul", 20, TWO_HANDED, CLASS_MACE, 6)],
	["Tomahawk", new Weapon("Tomahawk", 0, ONE_HANDED_SWINGING, CLASS_AXE, 2)],
	["Tomb Wand", new Weapon("Tomb Wand", -20, ONE_HANDED_SWINGING, CLASS_STAFF, 2)],
	["Trident", new Weapon("Trident", 0, TWO_HANDED_THRUSTING, CLASS_SPEAR, 4)],
	["Truncheon", new Weapon("Truncheon", -10, ONE_HANDED_SWINGING, CLASS_MACE, 2)],
	["Tulwar", new Weapon("Tulwar", 20, ONE_HANDED_SWINGING, CLASS_SWORD, 2)],
	["Tusk Sword", new Weapon("Tusk Sword", 0, TWO_HANDED_SWORD, CLASS_SWORD, 4)],
	["Twin Axe", new Weapon("Twin Axe", 10, ONE_HANDED_SWINGING, CLASS_AXE, 5)],
	["Two-Handed Sword", new Weapon("Two-Handed Sword", 0, TWO_HANDED_SWORD, CLASS_SWORD, 3)],
	["Tyrant Club", new Weapon("Tyrant Club", 0, ONE_HANDED_SWINGING, CLASS_MACE, 3)],
	["Unearthed Wand", new Weapon("Unearthed Wand", 0, ONE_HANDED_SWINGING, CLASS_STAFF, 2)],
	["Vortex Orb", new Weapon("Vortex Orb", 0, ONE_HANDED_SWINGING, CLASS_ORB, 3)],
	["Voulge", new Weapon("Voulge", 0, TWO_HANDED, CLASS_POLEARM, 4)],
	["Walking Stick", new Weapon("Walking Stick", -10, TWO_HANDED, CLASS_STAFF, 2)],
	["Wand", new Weapon("Wand", 0, ONE_HANDED_SWINGING, CLASS_STAFF, 1)],
	["War Axe", new Weapon("War Axe", 0, ONE_HANDED_SWINGING, CLASS_AXE, 6)],
	["War Club", new Weapon("War Club", 10, TWO_HANDED, CLASS_MACE, 6)],
	["War Dart", new Weapon("War Dart", -20, ONE_HANDED_THRUSTING, CLASS_THROWING, 0)],
	["War Fist", new Weapon("War Fist", 10, CLAW, CLASS_CLAW, 2)],
	["War Fork", new Weapon("War Fork", -20, TWO_HANDED_THRUSTING, CLASS_SPEAR, 5)],
	["War Hammer", new Weapon("War Hammer", 20, ONE_HANDED_SWINGING, CLASS_MACE, 4)],
	["War Javelin", new Weapon("War Javelin", -10, ONE_HANDED_THRUSTING, CLASS_JAVELIN, 0)],
	["War Pike", new Weapon("War Pike", 20, TWO_HANDED_THRUSTING, CLASS_SPEAR, 6)],
	["War Scepter", new Weapon("War Scepter", -10, ONE_HANDED_SWINGING, CLASS_MACE, 5)],
	["War Scythe", new Weapon("War Scythe", -10, TWO_HANDED, CLASS_POLEARM, 6)],
	["War Spear", new Weapon("War Spear", -10, TWO_HANDED_THRUSTING, CLASS_SPEAR, 3)],
	["War Spike", new Weapon("War Spike", -10, ONE_HANDED_SWINGING, CLASS_AXE, 6)],
	["War Staff", new Weapon("War Staff", 20, TWO_HANDED, CLASS_STAFF, 6)],
	["War Sword", new Weapon("War Sword", 0, ONE_HANDED_SWINGING, CLASS_SWORD, 3)],
	["Ward Bow", new Weapon("Ward Bow", 0, BOW, CLASS_MISSILE, 5)],
	["Winged Axe", new Weapon("Winged Axe", -10, ONE_HANDED_SWINGING, CLASS_THROWING, 0)],
	["Winged Harpoon", new Weapon("Winged Harpoon", -10, ONE_HANDED_THRUSTING, CLASS_JAVELIN, 0)],
	["Winged Knife", new Weapon("Winged Knife", -20, ONE_HANDED_THRUSTING, CLASS_THROWING, 0)],
	["Wrist Blade", new Weapon("Wrist Blade", 0, CLAW, CLASS_CLAW, 2)],
	["Wrist Spike", new Weapon("Wrist Spike", -10, CLAW, CLASS_CLAW, 2)],
	["Wrist Sword", new Weapon("Wrist Sword", -10, CLAW, CLASS_CLAW, 3)],
	["Yari", new Weapon("Yari", 0, TWO_HANDED_THRUSTING, CLASS_SPEAR, 6)],
	["Yew Wand", new Weapon("Yew Wand", 10, ONE_HANDED_SWINGING, CLASS_STAFF, 1)],
	["Zweihander", new Weapon("Zweihander", -10, TWO_HANDED_SWORD, CLASS_SWORD, 5)]
]);
