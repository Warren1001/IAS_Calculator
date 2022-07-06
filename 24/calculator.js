
import { container, select, number, checkbox, option, button, skill as speed, other, debug, tv, char, wf, skills, wt, ic } from './constants.js'
import * as constants from './constants.js'

window.addEventListener("load", load, false);

function load() {

	let tableVariable = tv.IAS;
	let character = char.AMAZON;
	let wereform = wf.HUMAN;
	let skill = skills.STANDARD;
	let primaryWeapon = constants.getWeapon("None");
	let secondaryWeapon = constants.getWeapon("None");

	let maxAccelerationIncrease = other.MAX_IAS_ACCELERATION_CHARACTER;

	setupConstants();

	setSkills();
	setPrimaryWeapons();
	loadFromParams();
	displayFrames();

	function onTableVariableChange(updateTable) {
		tableVariable = parseInt(select.TABLE_VARIABLE.value);
		switch (tableVariable) {
			case tv.EIAS:
				hideElement(container.PRIMARY_WEAPON_IAS);
				hideElement(container.SECONDARY_WEAPON_IAS);
				hideElement(container.IAS);
				hideElement(container.FANATICISM);
				hideElement(container.BURST_OF_SPEED);
				hideElement(container.FRENZY);
				hideElement(container.DECREPIFY);
				hideElement(container.HOLY_FREEZE);
				hideElement(container.SLOWED_BY);
				hideElement(container.CHILLED);
				break;
			case tv.IAS:
				hideElement(container.IAS);
				if (isCharacterSelected()) {
					maxAccelerationIncrease = primaryWeapon.type.isOneHand ? other.MAX_IAS_ACCELERATION_CHARACTER : other.MAX_IAS_ACCELERATION_CHARACTER_TWO_HANDED; // TODO barb using 2h sword?
				} else {
					maxAccelerationIncrease = other.MAX_IAS_ACCELERATION_MERCENARY;
				}
				break;
			case tv.PRIMARY_WEAPON_IAS:
				hideElement(container.PRIMARY_WEAPON_IAS);
				maxAccelerationIncrease = other.MAX_IAS_ACCELERATION_WEAPON;
				break;
			case tv.SECONDARY_WEAPON_IAS:
				hideElement(container.SECONDARY_WEAPON_IAS);
				maxAccelerationIncrease = other.MAX_IAS_ACCELERATION_WEAPON;
				break;
			case tv.FANATICISM:
				hideElement(container.FANATICISM);
				maxAccelerationIncrease = speed.FANATICISM.max;
				break;
			case tv.BURST_OF_SPEED:
				hideElement(container.BURST_OF_SPEED);
				maxAccelerationIncrease = speed.BURST_OF_SPEED.max;
				break;
			case tv.WEREWOLF:
				hideElement(container.WEREWOLF);
				maxAccelerationIncrease = speed.WEREWOLF.max;
				break;
			case tv.MAUL:
				hideElement(container.MAUL);
				maxAccelerationIncrease = speed.MAUL.max;
				break;
			case tv.FRENZY:
				hideElement(container.FRENZY);
				maxAccelerationIncrease = speed.FRENZY.max;
				break;
		}
		if (tableVariable != tv.EIAS) {
			if (tableVariable != tv.PRIMARY_WEAPON_IAS && isSecondWeaponSet()) {
				unhideElement(container.PRIMARY_WEAPON_IAS);
			}
			if (tableVariable != tv.SECONDARY_WEAPON_IAS && isSecondWeaponSet()) {
				unhideElement(container.SECONDARY_WEAPON_IAS);
			}
			if (tableVariable != tv.IAS && skill != skills.DODGE) {
				unhideElement(container.IAS);
			}
			if (tableVariable != tv.FANATICISM) {
				unhideElement(container.FANATICISM);
			}
			if (tableVariable != tv.BURST_OF_SPEED && character == char.ASSASSIN) {
				unhideElement(container.BURST_OF_SPEED);
			}
			if (tableVariable != tv.WEREWOLF && wereform == wf.WEREWOLF) {
				unhideElement(container.WEREWOLF);
			}
			if (tableVariable != tv.MAUL && wereform == wf.WEREBEAR && character == char.DRUID) {
				unhideElement(container.MAUL);
			}
			if (tableVariable != tv.FRENZY && (character == char.BARBARIAN || character == char.FRENZY_BARBARIAN)) {
				unhideElement(container.FRENZY);
			}
			unhideElement(container.DECREPIFY);
			unhideElement(container.HOLY_FREEZE);
			unhideElement(container.SLOWED_BY);
			unhideElement(container.CHILLED);
		}
		if (updateTable) displayFrames();
	}

	function onCharacterChange(updateTable) {
		character = parseInt(select.CHARACTER.value);

		if (isCharacterSelected()) {

			if (tableVariable == tv.IAS) {
				if (primaryWeapon.type.isOneHand || (character == char.BARBARIAN || character == char.FRENZY_BARBARIAN)) { // TODO second weapon cant really contribute IAS like a shield can?
					maxAccelerationIncrease = other.MAX_IAS_ACCELERATION_CHARACTER;
				} else {
					maxAccelerationIncrease = other.MAX_IAS_ACCELERATION_CHARACTER_TWO_HANDED;
				}
			}

			unhideElement(container.WEREFORM);

		} else {

			if (tableVariable == tv.IAS) {
				maxAccelerationIncrease = other.MAX_IAS_ACCELERATION_MERCENARY;
			}

			hideElement(container.WEREFORM);
			if (wereform != wf.HUMAN) {
				select.WEREFORM.value = wf.HUMAN;
				onWereformChange(false);
			}
		}

		if (character == char.BARBARIAN || character == char.DRUID) unhideElement(option.WEREFORM_WEREWOLF);
		else {
			hideElement(option.WEREFORM_WEREWOLF);
			if (select.WEREFORM.value == wf.WEREWOLF) {
				select.WEREFORM.value = wf.HUMAN;
				onWereformChange(false);
			}
		}

		if (character == char.ASSASSIN) {
			unhideElement(container.BURST_OF_SPEED);
			//unhideElement(container.BURST_OF_SPEED);
			unhideElement(option.TABLE_VARIABLE_BURST_OF_SPEED);
		} else {
			hideElement(container.BURST_OF_SPEED);
			//hideElement(container.BURST_OF_SPEED);
			hideElement(option.TABLE_VARIABLE_BURST_OF_SPEED);
			if (tableVariable == tv.BURST_OF_SPEED) {
				tv.IAS.checked = true;
				onTableVariableChange(false);
			}
		}

		if (character == char.BARBARIAN || character == char.FRENZY_BARBARIAN) {
			unhideElement(container.FRENZY);
			//unhideElement(container.FRENZY);
			unhideElement(option.TABLE_VARIABLE_FRENZY);
		} else {
			hideElement(container.FRENZY);
			//hideElement(container.FRENZY);
			hideElement(option.TABLE_VARIABLE_FRENZY);
			if (tableVariable == tv.FRENZY) {
				tv.IAS.checked = true;
				onTableVariableChange(false);
			}
		}

		if (character != char.BARBARIAN && character != char.ASSASSIN && character != char.FRENZY_BARBARIAN) {
			console.log("c1");
			hideElement(container.SECONDARY_WEAPON);
			hideElement(container.SECONDARY_WEAPON_IAS);
		}

		let primaryWeaponType = primaryWeapon.type;
		if ((character == char.ASSASSIN && primaryWeaponType == wt.CLAW && skill.canDualWield) ||
				((character == char.BARBARIAN || character == char.FRENZY_BARBARIAN) && skill.canDualWield &&
				(primaryWeaponType == wt.ONE_HANDED_SWINGING || primaryWeaponType == wt.ONE_HANDED_THRUSTING || primaryWeaponType == wt.TWO_HANDED_SWORD))) {
			console.log("c2");
			unhideElement(container.SECONDARY_WEAPON);
			setSecondaryWeapons();
		} else {
			hideElement(container.SECONDARY_WEAPON);
		}

		setPrimaryWeapons();
		setSkills();

		if (updateTable) displayFrames();
	}

	function onWereformChange(updateTable) {
		wereform = parseInt(select.WEREFORM.value);
		if (wereform == wf.WEREWOLF) {
			unhideElement(option.TABLE_VARIABLE_WEREWOLF);
			unhideElement(container.WEREWOLF);
			hideElement(container.MAUL);
			hideElement(option.TABLE_VARIABLE_MAUL);
		} else if (wereform == wf.WEREBEAR) {
			if (character == char.DRUID) {
				unhideElement(option.TABLE_VARIABLE_MAUL);
				unhideElement(container.MAUL);
			}
			hideElement(container.WEREWOLF);
			hideElement(option.TABLE_VARIABLE_WEREWOLF);
		} else {
			hideElement(container.WEREWOLF);
			hideElement(option.TABLE_VARIABLE_WEREWOLF);
			hideElement(container.MAUL);
			hideElement(option.TABLE_VARIABLE_MAUL);
			if (tableVariable == tv.WEREWOLF || tableVariable == tv.MAUL) {
				tv.IAS.checked = true;
				onTableVariableChange(false);
			}
		}

		setSkills();

		if (updateTable) displayFrames();
	}

	function onPrimaryWeaponChange(updateTable) {
		let selection = select.PRIMARY_WEAPON.value;
		primaryWeapon = constants.getWeapon(selection.substring(0, selection.indexOf(" [")));
		let type = primaryWeapon.type;

		if (tableVariable == tv.IAS) {
			if (isCharacterSelected()) {
				if (type.isOneHand || (character == char.BARBARIAN || character == char.FRENZY_BARBARIAN)) {
					maxAccelerationIncrease = other.MAX_IAS_ACCELERATION_CHARACTER;
				} else {
					maxAccelerationIncrease = other.MAX_IAS_ACCELERATION_CHARACTER_TWO_HANDED;
				}
			} else {
				maxAccelerationIncrease = other.MAX_IAS_ACCELERATION_MERCENARY;
			}
		}

		if (character == char.BARBARIAN && type == wt.TWO_HANDED_SWORD && !isDualWieldedSequenceSkill()) {
			unhideElement(container.IS_ONE_HANDED);
		} else {
			hideElement(container.IS_ONE_HANDED);
		}

		if ((character == char.ASSASSIN && type == wt.CLAW && skill.canDualWield) ||
				((character == char.BARBARIAN || character == char.FRENZY_BARBARIAN) && skill.canDualWield &&
				(type == wt.ONE_HANDED_SWINGING || type == wt.ONE_HANDED_THRUSTING || type == wt.TWO_HANDED_SWORD))) {
			unhideElement(container.SECONDARY_WEAPON);
			setSecondaryWeapons();
		} else {
			hideElement(container.SECONDARY_WEAPON);
		}

		if (updateTable) {
			console.log("updateTable (primary)");
			displayFrames();
		}
	}

	function onSecondaryWeaponChange(updateTable) {
		let selection = select.SECONDARY_WEAPON.value;
		secondaryWeapon = constants.getWeapon(selection.substring(0, selection.indexOf(" [")));
		//log(secondaryWeapon);

		if (secondaryWeapon.type != wt.UNARMED) {
			hideElement(container.IS_ONE_HANDED);
			if (character == char.FRENZY_BARBARIAN) unhideElement(container.FRENZY);
			if (skill.canDualWield && !skill.isDualWieldOnly) {
				unhideElement(container.PRIMARY_WEAPON_IAS);
				unhideElement(container.SECONDARY_WEAPON_IAS);
			}
		} else {
			if (character != char.BARBARIAN && character != char.FRENZY_BARBARIAN) hideElement(container.FRENZY);
			if (character == char.BARBARIAN && primaryWeapon.type == wt.TWO_HANDED_SWORD) {
				unhideElement(container.IS_ONE_HANDED);
			} else {
				hideElement(container.IS_ONE_HANDED);
			}
			if (skill.canDualWield && !skill.isDualWieldOnly) {
				hideElement(container.PRIMARY_WEAPON_IAS);
				hideElement(container.SECONDARY_WEAPON_IAS);
			}
			// TODO hide primary and secondary wias (on conditions)
		}

		if (updateTable) {
			console.log("updateTable (secondary)");
			displayFrames();
		}
	}

	function onSkillChange(updateTable) {
		log("onSkillChange(updateTable=%s)", updateTable)
		let previousSkill = skill;
		skill = constants.getSkill(select.SKILL.value);

		if (skill == skills.DODGE) {
			hideElement(container.TABLE_VARIABLE);
			hideElement(container.PRIMARY_WEAPON_IAS);
			hideElement(container.SECONDARY_WEAPON_IAS);
			hideElement(container.FANATICISM);
			hideElement(container.BURST_OF_SPEED);
			hideElement(container.FRENZY);
			hideElement(container.DECREPIFY);
			hideElement(container.PRIMARY_WEAPON);
			hideElement(container.WEREFORM);
			select.TABLE_VARIABLE.value = tv.FANATICISM;
			onTableVariableChange(false);
		} else if (previousSkill == skills.DODGE) {
			unhideElement(container.TABLE_VARIABLE);
			if (isCharacterSelected()) unhideElement(container.WEREFORM);
			unhideElement(container.PRIMARY_WEAPON);
			if (tableVariable != tv.FANATICISM) unhideElement(container.FANATICISM);
			if (character == char.ASSASSIN && tableVariable != tv.BURST_OF_SPEED) unhideElement(container.BURST_OF_SPEED);
			if (character == char.BARBARIAN && tableVariable != tv.FRENZY) unhideElement(container.FRENZY);
			unhideElement(container.DECREPIFY);

			if (skill == skills.FRENZY) {
				unhideElement(option.TABLE_VARIABLE_SECONDARY_WEAPON_IAS);
				unhideElement(option.TABLE_VARIABLE_SECONDARY_WEAPON_IAS);
			} else {
				hideElement(option.TABLE_VARIABLE_SECONDARY_WEAPON_IAS);
				hideElement(option.TABLE_VARIABLE_SECONDARY_WEAPON_IAS);
				if (tableVariable == tv.PRIMARY_WEAPON_IAS || tableVariable == tv.SECONDARY_WEAPON_IAS) {
					tv.IAS.checked = true;
					onTableVariableChange(false);
				}
			}
		}

		setPrimaryWeapons();

		if (skill.isDualWieldOnly) {
			unhideElement(container.SECONDARY_WEAPON);
			unhideElement(container.PRIMARY_WEAPON_IAS);
			unhideElement(container.SECONDARY_WEAPON_IAS);
			setSecondaryWeapons();
		} else if (skill.canDualWield && (character == char.BARBARIAN || character == char.ASSASSIN || character == char.FRENZY_BARBARIAN)) {
			let primaryWeaponType = primaryWeapon.type;
			if ((character == char.ASSASSIN && primaryWeaponType == wt.CLAW && skill.canDualWield) ||
					((character == char.BARBARIAN || character == char.FRENZY_BARBARIAN) && skill.canDualWield &&
					(primaryWeaponType == wt.ONE_HANDED_SWINGING || primaryWeaponType == wt.ONE_HANDED_THRUSTING || primaryWeaponType == wt.TWO_HANDED_SWORD))) {
				unhideElement(container.SECONDARY_WEAPON);
			}
			if (isSecondWeaponSet()) {
				unhideElement(container.PRIMARY_WEAPON_IAS);
				unhideElement(container.SECONDARY_WEAPON_IAS);
			} else {
				hideElement(container.PRIMARY_WEAPON_IAS);
				hideElement(container.SECONDARY_WEAPON_IAS);
			}
		} else {
			hideElement(container.SECONDARY_WEAPON);
			hideElement(container.PRIMARY_WEAPON_IAS);
			hideElement(container.SECONDARY_WEAPON_IAS);
		}

		if (updateTable) displayFrames();
	}

	function setPrimaryWeapons() {
		let previousValue = select.PRIMARY_WEAPON.value;
		let previousValueName = previousValue.substring(0, previousValue.indexOf(" ["));
		let reselect = false;
		clear(select.PRIMARY_WEAPON);
		for (const weapon of constants.weaponsMap.values()) {
			if (canBeEquipped(weapon, false)) {
				select.PRIMARY_WEAPON.add(createOption(weapon.name + " [" + weapon.WSM + "]"));
				if (previousValueName == weapon.name) reselect = true;
			}
		}
		if (reselect) {
			select.PRIMARY_WEAPON.value = previousValue;
		} else {
			onPrimaryWeaponChange(false);
		}
	}

	function setSecondaryWeapons() {
		let previousValue = select.SECONDARY_WEAPON.value;
		let previousValueName = previousValue.substring(0, previousValue.indexOf(" ["));
		let reselect = false;
		clear(select.SECONDARY_WEAPON);
		if (character == char.BARBARIAN || character == char.FRENZY_BARBARIAN) {
			for (const weapon of constants.weaponsMap.values()) {
				if ((weapon.type.isOneHand && weapon.type != wt.CLAW) || (character == char.BARBARIAN && weapon.type == wt.TWO_HANDED_SWORD)) {
					if (canBeEquipped(weapon, true)) {
						select.SECONDARY_WEAPON.add(createOption(weapon.name + " [" + weapon.WSM + "]"));
						if (previousValueName == weapon.name) reselect = true;
					}
				}
			}
		} else if (character == char.ASSASSIN) {
			for (const weapon of constants.weaponsMap.values()) {
				if (canBeEquipped(weapon, true)) {
					select.SECONDARY_WEAPON.add(createOption(weapon.name + " [" + weapon.WSM + "]"));
					if (previousValueName == weapon.name) reselect = true;
				}
			}
		}
		if (reselect) {
			select.SECONDARY_WEAPON.value = previousValue;
		}
		onSecondaryWeaponChange(false);
	}

	function setSkills() {

		let currentSkills = [skills.STANDARD];

		clear(select.SKILL);

		if (isCharacterSelected()) {
			if (wereform == wf.HUMAN) currentSkills.push(skills.THROW);
			currentSkills.push(skills.KICK);
		}

		switch (parseInt(character)) {
			case char.AMAZON:
				if (wereform == wf.HUMAN) {
					currentSkills.push(skills.STRAFE);
					currentSkills.push(skills.JAB);
					currentSkills.push(skills.IMPALE);
					currentSkills.push(skills.FEND);
					currentSkills.push(skills.DODGE);
				}
				break;
			case char.ASSASSIN:
				if (wereform == wf.HUMAN) {
					currentSkills.push(skills.LAYING_TRAPS);
					currentSkills.push(skills.DRAGON_TALON);
					currentSkills.push(skills.TIGER_STRIKE);
					currentSkills.push(skills.COBRA_STRIKE);
					currentSkills.push(skills.PHOENIX_STRIKE);
					currentSkills.push(skills.FISTS_OF_FIRE);
					currentSkills.push(skills.CLAWS_OF_THUNDER);
					currentSkills.push(skills.BLADES_OF_ICE);
					currentSkills.push(skills.DRAGON_TAIL);
					currentSkills.push(skills.DRAGON_CLAW);
				}
				break;
			case char.BARBARIAN:
				if (wereform == wf.HUMAN) {
					currentSkills.push(skills.FRENZY);
					currentSkills.push(skills.DOUBLE_SWING);
					currentSkills.push(skills.WHIRLWIND);
					currentSkills.push(skills.CONCENTRATE);
					currentSkills.push(skills.BERSERK);
					currentSkills.push(skills.BASH);
					currentSkills.push(skills.STUN);
					currentSkills.push(skills.DOUBLE_THROW);
				}
				break;
			case char.DRUID:
				if (wereform == wf.WEREWOLF) {
					currentSkills.push(skills.FURY);
					currentSkills.push(skills.RABIES);
					currentSkills.push(skills.FERAL_RAGE);
					currentSkills.push(skills.HUNGER);
				} else if (wereform == wf.WEREBEAR) {
					currentSkills.push(skills.HUNGER);
				}
				break;
			case char.PALADIN:
				if (wereform == wf.HUMAN) {
					currentSkills.push(skills.SMITE);
					currentSkills.push(skills.ZEAL);
					currentSkills.push(skills.SACRIFICE);
					currentSkills.push(skills.VENGEANCE);
					currentSkills.push(skills.CONVERSION);
				}
				break;
			case char.DESERT_MERCENARY:
				currentSkills.push(skills.JAB);
				break;
			case char.BASH_BARBARIAN:
				currentSkills.push(skills.BASH);
				currentSkills.push(skills.STUN);
				break;
			case char.FRENZY_BARBARIAN:
				currentSkills.push(skills.FRENZY);
				currentSkills.push(skills.TAUNT);
				break;
			default:
				console.log("that character has not been implemented yet");
				break;
		}

		if (isCharacterSelected()) {

			let oskills = [];

			if (character == char.ASSASSIN) {
				oskills.push(skills.WHIRLWIND);
			}

			if (wereform == wf.HUMAN) {
				oskills.push(skills.ZEAL);
			} else if (wereform == wf.WEREWOLF && character == char.BARBARIAN) {
				oskills.push(skills.FERAL_RAGE);
			}

			if (oskills.length > 0) {
				currentSkills.push("divider");
				oskills.forEach(s => currentSkills.push(s));
			}

		}

		currentSkills.forEach(s => select.SKILL.add(createOption(s == "divider" ? s : s.name)));

		if (!currentSkills.includes(skill)) {
			onSkillChange(false);
		} else {
			select.SKILL.value = skill.name;
		}

	}

	function getWeaponIAS(isPrimary) {
		if ((isPrimary && isElementHidden(container.PRIMARY_WEAPON_IAS)) || (!isPrimary && isElementHidden(container.SECONDARY_WEAPON_IAS))) return 0;
		let wIAS = 0;
		if (isPrimary && tableVariable != tv.PRIMARY_WEAPON_IAS) wIAS = parseInt(number.PRIMARY_WEAPON_IAS.value);
		else if (!isPrimary && tableVariable != tv.SECONDARY_WEAPON_IAS) wIAS = parseInt(number.SECONDARY_WEAPON_IAS.value);
		return wIAS;
	}

	function displayFrames() {

		//log("----------------- start new table(s) ------------------");

		removeAllChildNodes(container.TABLE);

		if (wereform != wf.HUMAN && isSecondWeaponSet() && skill == skills.STANDARD) {
			displayTableInfo("Using Standard Attack while dual wielding in a wereform will not let you attack after your first successful attack until you swap weapons, remorph, or enter and exit town. Currently bugged in D2R.");
			//return;
		}

		preinfo();

		log("----------- start primary table ------------");
		let table1 = d(primaryWeapon, fpd1(primaryWeapon.type, false, true), true);
		log("----------- end primary table ------------");

		if (wereform == wf.HUMAN && isCharacterSelected() && skill == skills.STANDARD) {
			displayTable(table1[0]);
			if (primaryWeapon.type.hasAlternateAnimation(character)) {
				log("----------- start primary alt table ------------");
				let altTable1 = d(primaryWeapon, fpd1(primaryWeapon.type, true, true), true);
				log("----------- end primary alt table ------------");
				displayTable(altTable1[0]);
			}
			if (isSecondWeaponSet()) {
				log("----------- start secondary table ------------");
				let table2 = d(secondaryWeapon, fpd1(secondaryWeapon.type, false, false), false);
				log("----------- end secondary table ------------");
				displayTable(table2[0]);
			}
		} else if (skill == skills.WHIRLWIND && isSecondWeaponSet()) {
			log("----------- start secondary table ------------");
			let table2 = d(secondaryWeapon, fpd1(secondaryWeapon.type, false, false), false);
			log("----------- end secondary table ------------");
			log("----------- start ww merge table ------------");
			displayTable(mergeAccelerationTables([table1, table2]));
			log("----------- end ww merge table ------------");
		} else {
			if (skill != skills.STRAFE || primaryWeapon.type == wt.CROSSBOW) {
				displayTable(table1[0]);
			}
			if (table1.length > 1) {
				displayTable(table1[1]);
			}
		}

		//log("------------------ end new table(s) -------------------");

	}

	function displayTable(breakpoints, tableName) {

		let variableLabel = getTableVariableName(tableVariable);

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

		for (const bp of breakpoints) {
			addTableRow(table, bp.convertEIAStoVariable(tableVariable), bp.FPA);
		}

		tableDiv.appendChild(table);
		container.TABLE.appendChild(tableDiv);

	}

	function getTableVariableName(variable) {
		switch (variable) {
			case tv.EIAS:
				return "EIAS";
			case tv.PRIMARY_WEAPON_IAS:
			case tv.SECONDARY_WEAPON_IAS:
				return "WIAS";
			case tv.IAS:
				return "IAS";
			case tv.FANATICISM:
			case tv.BURST_OF_SPEED:
			case tv.WEREWOLF:
			case tv.MAUL:
			case tv.FRENZY:
				return skill == skills.DODGE ? "Fanaticism" : "Skill Level";
			default:
				return "Unknown";
		}
	}

	function d(weapon, fpd1, isPrimary) {

		let weaponType = weapon.type;

		let framesPerDirectionHuman = calculateFramesPerDirection(weaponType);
		let framesPerDirection1 = fpd1;
		let framesPerDirection2 = fpd2();
		let framesPerDirection3 = fpd3(weaponType);
		let animationSpeed = as(weaponType);
		let startingFrame = getStartingFrame(weaponType);
		let EIAS = tableVariable == tv.EIAS ? 0 : calculateEIAS(isPrimary);
		let totalIAS = tableVariable == tv.EIAS ? 0 : getTotalIAS(isPrimary);
		let speedReduction = skill == skills.WHIRLWIND ? framesPerDirectionHuman / framesPerDirection3 : framesPerDirection3 / framesPerDirectionHuman;
		let offset = skill == skills.IMPALE || skill == skills.JAB || skill == skills.FISTS_OF_FIRE || skill == skills.CLAWS_OF_THUNDER
			|| skill == skills.BLADES_OF_ICE || skill == skills.DRAGON_CLAW || skill == skills.DOUBLE_SWING
			|| skill == skills.DOUBLE_THROW || skill == skills.FURY || skill == skills.DRAGON_TALON
			|| skill == skills.ZEAL || skill == skills.FEND || skill == skills.STRAFE || skill == skills.FRENZY ? 0 : 1;
		let startingAcceleration = tableVariable == tv.EIAS ? other.MIN_EIAS : 0;
		let trueMaxAccelerationIncrease = tableVariable == tv.EIAS ? other.MAX_EIAS : maxAccelerationIncrease;//Math.max(maxAccelerationIncrease, other.MAX_EIAS - EIAS);

		log("framesPerDirectionHuman=%s", framesPerDirectionHuman);
		log("framesPerDirection1=%s", framesPerDirection1);
		log("framesPerDirection2=%s", framesPerDirection2);
		log("framesPerDirection3=%s", framesPerDirection3);
		log("animationSpeed=%s", animationSpeed);
		log("startingFrame=%s", startingFrame);
		log("EIAS=%s", EIAS);
		log("totalIAS=%s", totalIAS);
		log("speedReduction=%s", speedReduction);
		log("offset=%s", offset);
		log("startingAcceleration=%s", startingAcceleration);
		log("trueMaxAccelerationIncrease=%s", trueMaxAccelerationIncrease);

		let accelerationTables = [[]];
		let previousFrameLengths = [0];

		if (skill == skills.STRAFE || skill == skills.FEND) {
			accelerationTables.push([]);
			previousFrameLengths.push(0);
		}

		for (let acceleration = startingAcceleration; acceleration <= trueMaxAccelerationIncrease; acceleration++) {
				
			let accelerationModified = tableVariable == (isPrimary ? tv.SECONDARY_WEAPON_IAS : tv.PRIMARY_WEAPON_IAS) ? 0 : acceleration;
			let speedIncrease;
			if (wereform == wf.HUMAN && skill != skills.WHIRLWIND) {
				speedIncrease = trun(animationSpeed * (100 + limitEIAS(EIAS + accelerationModified)) / 100);
			} else {
				speedIncrease = trun((animationSpeed + trun(animationSpeed * limitEIAS(EIAS + accelerationModified) / 100)) * speedReduction);
			}

			let firstHitLength = Math.ceil(256 * (framesPerDirection1 - startingFrame) / speedIncrease) - offset;
			if (skill == skills.WHIRLWIND) firstHitLength = Math.max(firstHitLength, 4); // whirlwind cannot be less than 4 frames

			if (skill == skills.FURY || skill == skills.STRAFE || skill == skills.FEND || skill == skills.DRAGON_TALON || skill == skills.ZEAL) {

				let hitLengths = [firstHitLength];
				let rollbackFactor = rbf();

				let rollbacks = [startingFrame];
				let hits = rhits();

				for (let hit = 0; hit < hits; hit++) {

					let rollback = parseInt(parseInt((256 * rollbacks[hit] + speedIncrease * hitLengths[hit]) / 256) * (100 - rollbackFactor) / 100);
					let nextHitLength = Math.ceil(256 * (framesPerDirection1 - rollback) / speedIncrease);

					rollbacks.push(rollback);
					hitLengths.push(nextHitLength);

					if ((skill == skills.STRAFE || skill == skills.FEND) && hit == hits - 2) {

						let oscillatingOddHitLengths = [...hitLengths];

						let lastHitLength = Math.ceil(256 * (framesPerDirection2 - rollbacks[rollbacks.length - 1]) / speedIncrease) - 1;
						oscillatingOddHitLengths.push(lastHitLength);

						if (frameLengthsNotEqual(previousFrameLengths[1], oscillatingOddHitLengths)) {
							previousFrameLengths[1] = oscillatingOddHitLengths;
							accelerationTables[1].push(new constants.Breakpoint(totalIAS, acceleration, formatRollbackHitLength(oscillatingOddHitLengths)));
						}
								
					}

				}

				let lastHitLength = Math.ceil(256 * (framesPerDirection2 - rollbacks[rollbacks.length - 1]) / speedIncrease) - 1;
				hitLengths.push(lastHitLength);

				if (frameLengthsNotEqual(previousFrameLengths[0], hitLengths)) {
					previousFrameLengths[0] = hitLengths;
					accelerationTables[0].push(new constants.Breakpoint(totalIAS, acceleration, formatRollbackHitLength(hitLengths)));
				}

			} else if (frameLengthsNotEqual(previousFrameLengths[0], firstHitLength)) {

				previousFrameLengths[0] = firstHitLength;
				accelerationTables[0].push(new constants.Breakpoint(totalIAS, acceleration, firstHitLength));

				log("acceleration=%s,firstHitLength=%s", acceleration, firstHitLength);

				if (skill == skills.WHIRLWIND && firstHitLength == 4) break;

			}

		}

		return accelerationTables;
	}

	function mergeAccelerationTables(accelerationTables) {
		log("accelerationTables[0]=%s", accelerationTables[0]);
		log("accelerationTables[1]=%s", accelerationTables[1]);
		let merge = [];
		let leftLastBreakpoint = null;
		let rightLastBreakpoint = null;
		let averageLastFPA = 0;
		let existingIAS = 0;
		let merged = [];
		for (const bp of accelerationTables[0][0]) {
			log("accelerationTables[0]: %s,%s", bp.neededEIAS, bp.FPA);
			if (leftLastBreakpoint == null) {
				leftLastBreakpoint = bp;
				existingIAS = bp.existingIAS;
			} else merge.push([0, bp]);
		}
		for (const bp of accelerationTables[1][0]) {
			log("accelerationTables[1]: %s,%s",  bp.neededEIAS, bp.FPA);
			if (rightLastBreakpoint == null) {
				rightLastBreakpoint = bp;
				existingIAS = Math.max(existingIAS, bp.existingIAS);
			} else merge.push([1, bp]);
		}
		averageLastFPA = averageToCeiling(leftLastBreakpoint.FPA, rightLastBreakpoint.FPA)
		merge.sort((a, b) => a[1].neededEIAS - b[1].neededEIAS);
		merged.push(new constants.Breakpoint(existingIAS, Math.min(leftLastBreakpoint.neededEIAS, rightLastBreakpoint.neededEIAS), averageLastFPA));
		for (const a of merge) {
			log("a=%s", a);
			let hand = a[0];
			let acceleration = a[1].neededEIAS;
			let FPA = a[1].FPA;
			if (hand == 0) {
				log("l %s > %s", leftLastBreakpoint.FPA, FPA);
				if (leftLastBreakpoint.FPA > FPA) {
					leftLastBreakpoint = a[1];
					log("lFPA=%s", FPA);
					let average = averageToCeiling(FPA, rightLastBreakpoint.FPA);
					if (average < averageLastFPA) {
						averageLastFPA = average;
						merged.push(new constants.Breakpoint(a[1].existingIAS, acceleration, average));
					}
				}
			} else if (hand == 1) {
				log("r %s > %s", rightLastBreakpoint.FPA, FPA);
				if (rightLastBreakpoint.FPA > FPA) {
					rightLastBreakpoint = a[1];
					log("rFPA=%s", FPA);
					let average = averageToCeiling(leftLastBreakpoint.FPA, FPA);
					if (average < averageLastFPA) {
						averageLastFPA = average;
						merged.push(new constants.Breakpoint(a[1].existingIAS, acceleration, average));
					}
				}
			}
		}
		return merged;
	}

	function averageToCeiling(a, b) {
		return Math.ceil((a + b) / 2);
	}

	function preinfo() {

		if (wereform != wf.HUMAN) {
			displayTableInfo("All Wereform skills have undergone basic testing and should be correct.");
		} else if (character == char.FRENZY_BARBARIAN) {
			displayTableInfo("No testing has been done for " + skill.name + " yet for the Act 5 Mercenary. It's extremely likely correct, though.");
		}

		if (skill == skills.KICK) {
			displayTableInfo("Kicking barrels/etc. Tested, should be correct based on given information, except for in Wereform, not tested.");
		} else if (skill == skills.DODGE) {
			displayTableInfo("Dodge/Avoid/Evade. Tested, should be correct based on given information.");
		} else if (skill == skills.WHIRLWIND) {
			displayTableInfo("Whirlwind is correct in all tested scenarios.");
		} else if (skill == skills.FRENZY) {
			displayTableInfo("With the dual wield attack speed changes in 2.4, Frenzy got an unintentional minor buff.");
		} else if (skill == skills.IMPALE) {
			displayTableInfo("Impale should be correct based on modifications in the files. No testing was made, though.");
		}

	}

	function formatRollbackHitLength(hitLengths) {
		let frameLengthString;
		if (hitLengths.length == 2) {
			frameLengthString = "(" + hitLengths[0] + ")+" + hitLengths[1];
		} else if (hitLengths.length == 3) {
			frameLengthString = hitLengths[0] == hitLengths[1] ? "(" + hitLengths[0] + ")+" + hitLengths[2] : hitLengths[0] + "+(" + hitLengths[1] + ")+" + hitLengths[2];
		} else if (hitLengths.length == 5) {
			if (hitLengths[1] == hitLengths[2]) {
				frameLengthString = hitLengths[0] + "+(" + hitLengths[1] + ")+" + hitLengths[4];
			} else if (hitLengths[1] == hitLengths[3]) {
				frameLengthString = hitLengths[0] + "+" + hitLengths[1] + "+(" + hitLengths[2] + "+" + hitLengths[3] + ")+" + hitLengths[4];
			} else {
				frameLengthString = hitLengths[0] + "+" + hitLengths[1] + "+(" + hitLengths[2] + ")+" + hitLengths[4];
			}
		} else if (hitLengths.length % 2 == 0) {
			if (hitLengths[1] == hitLengths[3]) {
				if (hitLengths[2] == hitLengths[3]) {
					frameLengthString = hitLengths[0] + "+(" + hitLengths[1] + ")+" + hitLengths[hitLengths.length - 1];
				} else {
					frameLengthString = hitLengths[0] + "+(" + hitLengths[1] + "+" + hitLengths[2] + ")+" + hitLengths[hitLengths.length - 1];
				}
			} else {
				frameLengthString = hitLengths[0] + "+" + hitLengths[1] + "+(" + hitLengths[2] + ")+" + hitLengths[hitLengths.length - 1];
			}
		}
		return frameLengthString;
	}

	function frameLengthsNotEqual(previousFrameLength, nextFrameLength) {
		if (typeof previousFrameLength == "object" && typeof nextFrameLength == "object") {
			for (let i = 0; i < previousFrameLength.length; i++) {
				if (previousFrameLength[i] != nextFrameLength[i]) return true;
			}
			return false;
		}
		if (previousFrameLength == nextFrameLength) return false;
		return true;
	}

	function fpd1(weaponType, isAlternate, isPrimary) {
		if (isPrimary || skill == skills.WHIRLWIND) {
			if (isAlternate) return weaponType.getAlternateFramesPerDirection(character);
			if (skill == skills.FURY) return 7;
			if (skill == skills.HUNGER || skill == skills.RABIES) return 10;
			if (wereform == wf.WEREWOLF) return 13;
			if (wereform == wf.WEREBEAR) return 12;
			if (skill == skills.DRAGON_TALON || skill == skills.STRAFE || skill == skills.ZEAL || skill == skills.FEND) return calculateActionFrame(weaponType);
			return calculateFramesPerDirection(weaponType);
		}
		return 12; // off hand normal attack swings are 12 FPD across the board
	}

	function fpd2() {
		if (skill == skills.FURY) return 13;
		if (wereform == wf.WEREWOLF) return 9;
		if (wereform == wf.WEREBEAR) return 10;
		return -1;
	}

	function fpd3(weaponType) {
		if (skill == skills.WHIRLWIND) return calculateActionFrame(weaponType);
		if (wereform == wf.WEREWOLF) return 13;
		if (wereform == wf.WEREBEAR) return 12;
		return -1;
	}

	function as(weaponType) {
		if (character == char.DRUID && skill == skills.KICK && (primaryWeapon.type == wt.ONE_HANDED_SWINGING || primaryWeapon.type == wt.TWO_HANDED_SWORD)) return 224;
		return calculateAnimationSpeed(weaponType);
	}

	function rbf() {
		if (skill == skills.FURY) return 70;
		if (skill == skills.STRAFE) return 50;
		if (skill == skills.FEND) return 30;
		return 100;
	}

	function rhits() {
		if (skill == skills.ZEAL || skill == skills.DRAGON_TALON) return 1;
		if (skill == skills.FURY) return 3;
		if (skill == skills.STRAFE || skill == skills.FEND) return 4;
		return -1;
	}

	function getTotalIAS(isPrimary) {
		return (tableVariable != tv.IAS ? parseInt(number.IAS.value) : 0) + getWeaponIAS(isPrimary);
	}

	function calculateEIAS(isPrimary) {
		let SIAS = calculateSIAS();
		if (skill == skills.DODGE) return SIAS;
		log("SIAS=%s", SIAS);
		let IAS = tableVariable != tv.IAS ? parseInt(number.IAS.value) : 0;
		log("IAS=%s", IAS);
		if ((isDualWieldedSequenceSkill() && (character == char.BARBARIAN || character == char.ASSASSIN)) || (character == char.FRENZY_BARBARIAN && isSecondWeaponSet())) {
			let WSM1 = getWSM(isPrimary);
			log("WSM1=%s", WSM1);
			let WIAS1 = getWeaponIAS(isPrimary);
			log("WIAS1=%s", WIAS1);
			let EIAS1 = SIAS - WSM1 + constants.convertIAStoEIAS(IAS + WIAS1);
			log("EIAS1=%s", EIAS1);
			let WSM2 = getWSM(!isPrimary);
			log("WSM2=%s", WSM2);
			let WIAS2 = getWeaponIAS(!isPrimary);
			log("WIAS2=%s", WIAS2);
			let EIAS2 = SIAS - WSM2 + constants.convertIAStoEIAS(IAS + WIAS2);
			log("EIAS2=%s", EIAS2);
			return limitEIAS(trun((EIAS1 + EIAS2) / 2));
		} else {
			let WSM = getWSM(isPrimary);
			log("WSM=%s", WSM);
			let WIAS = getWeaponIAS(isPrimary);
			log("WIAS=%s", WIAS);
			let EIAS = SIAS - WSM + constants.convertIAStoEIAS(IAS + WIAS);
			log("EIAS=%s", EIAS);
			return limitEIAS(EIAS);
		}
	}

	function getWSM(isPrimary) {
		return (isPrimary ? primaryWeapon : secondaryWeapon).WSM;
	}

	/*function displayBreakpoints(table, tableName) {

		let newTable = new Map();

		let variableLabel = undefined;

		if (constants.isTableVariableSkill(tableVariable)) {
			variableLabel = skill == skills.DODGE ? "Fanaticism" : "Skill Level";
			let skillData = getTableVariableSkill();
			for (const [accelerationNeeded, FPA] of table) {
				let level = skillData.getLevelFromEIAS(accelerationNeeded);
				newTable.set(level, FPA);
				//log("acceleration=%s,FPA=%s,level=%s", accelerationNeeded, FPA, level);
			}
		} else if (tableVariable == tv.IAS || tableVariable == tv.PRIMARY_WEAPON_IAS || tableVariable == tv.SECONDARY_WEAPON_IAS) {
			if (debug) {
				variableLabel = "EIAS";
				newTable = table;
			} else {
				variableLabel = tableVariable == tv.IAS ? "IAS" : "WIAS";
				let firstWasSet = false;
				for (const [accelerationNeeded, FPA] of table) {
					let IAS = convertEIAStoIAS(accelerationNeeded);
					//if (wereform != wf.HUMAN && !constants.checkbox.2_4_CHANGES.checked) IAS -= getWeaponIAS(true);

					if (IAS > 0) firstWasSet = true;
					else if (IAS <= 0 && firstWasSet) break;
					else if (IAS < 0) IAS = 0;

					newTable.set(IAS, FPA);
				}
			}
			
		} else {
			displayTableInfo("Missing functionality, probably coming soon.");
		}

		displayTable(newTable, variableLabel, tableName);
	}*/

	function isCharacterSelected() {
		return character == char.AMAZON || character == char.ASSASSIN || character == char.BARBARIAN
			|| character == char.DRUID || character == char.NECROMANCER || character == char.PALADIN || character == char.SORCERESS; // readability
	}

	function isMercenarySelected() {
		return !isCharacterSelected();
	}

	function isDualWieldedSequenceSkill() {
		return skill == skills.FISTS_OF_FIRE || skill == skills.CLAWS_OF_THUNDER ||
			skill == skills.BLADES_OF_ICE || skill == skills.DRAGON_CLAW ||
			skill == skills.DOUBLE_SWING || skill == skills.FRENZY || skill == skills.DOUBLE_THROW;
	}

	function calculateFramesPerDirection(weaponType) {

		if (skill == skills.KICK) return character == char.ASSASSIN ? 13 : 12;

		if (skill == skills.DODGE) return 9;

		if (character == char.BARBARIAN && weaponType == wt.TWO_HANDED_SWORD && (constants.checkbox.IS_ONE_HANDED.checked || isSecondWeaponSet())) weaponType = wt.ONE_HANDED_SWINGING;

		let framesPerDirection = weaponType.getFramesPerDirection(character);

		if (skill == skills.THROW) {
			framesPerDirection = wt.THROWING.getFramesPerDirection(character);
		} else if (skill == skills.DRAGON_TAIL || skill == skills.DRAGON_TALON) {
			framesPerDirection = 13;
		} else if (skill == skills.SMITE) {
			framesPerDirection = 12;
		} else if (skill == skills.LAYING_TRAPS) {
			framesPerDirection = 8;
		} else if (skill == skills.IMPALE || skill == skills.JAB || skill == skills.FISTS_OF_FIRE ||
				skill == skills.CLAWS_OF_THUNDER || skill == skills.BLADES_OF_ICE || skill == skills.DRAGON_CLAW ||
				skill == skills.DOUBLE_SWING || skill == skills.FRENZY || skill == skills.DOUBLE_THROW) {

			if ((skill == skills.FISTS_OF_FIRE || skill == skills.CLAWS_OF_THUNDER || skill == skills.BLADES_OF_ICE || skill == skills.DRAGON_CLAW) && isSecondWeaponSet()) { // TODO only if dual wielded?
				framesPerDirection = 16;
			} else if (character == char.DESERT_MERCENARY) {
				framesPerDirection = 14;
			} else {
				framesPerDirection = getSequence(weaponType);
			}

		}

		return framesPerDirection;
	}

	function calculateAnimationSpeed(weaponType) {
		let animationSpeed = 256;
		if (skill == skills.LAYING_TRAPS) {
			animationSpeed = 128;
		} else if (weaponType == wt.CLAW && !(skill == skills.FISTS_OF_FIRE || skill == skills.CLAWS_OF_THUNDER ||
				skill == skills.BLADES_OF_ICE || skill == skills.DRAGON_CLAW || skill == skills.DRAGON_TAIL || skill == skills.DRAGON_TALON)) {
			animationSpeed = 208;
		}
		return animationSpeed;
	}

	function calculateSIAS() {

		let SIAS = speed.FANATICISM.calculate(tableVariable, character, wereform) + speed.BURST_OF_SPEED.calculate(tableVariable, character, wereform)
			+ speed.WEREWOLF.calculate(tableVariable, character, wereform) + speed.FRENZY.calculate(tableVariable, character, wereform) + speed.MAUL.calculate(tableVariable, character, wereform)
			- speed.HOLY_FREEZE.calculate(tableVariable, character, wereform);

		if (skill != skills.DODGE && constants.checkbox.DECREPIFY.checked) SIAS -= 50;
		if (constants.checkbox.CHILLED.checked) SIAS -= 50;

		SIAS -= number.SLOWED_BY.value;

		if (skill == skills.DOUBLE_SWING) {
			SIAS += 20;
		} else if (skill == skills.DRAGON_TAIL) {
			SIAS -= 40;
		} else if ((skill == skills.JAB || skill == skills.FISTS_OF_FIRE ||
				skill == skills.CLAWS_OF_THUNDER || skill == skills.BLADES_OF_ICE || skill == skills.DRAGON_CLAW ||
				skill == skills.FRENZY || skill == skills.DOUBLE_THROW) && isCharacterSelected()) {
			// sequence skills get a -30 EIAS debuff, easiest to put it here. does not apply to whirlwind. impale has a 30 EIAS buff, so the debuff is canceled out
			SIAS -= 30;
		}

		return SIAS;
	}

	function isSecondWeaponSet() {
		return !isElementHidden(container.SECONDARY_WEAPON) && secondaryWeapon.type != wt.UNARMED;
	}

	function limitEIAS(EIAS) {
		return Math.max(other.MIN_EIAS, Math.min(wereform != wf.HUMAN ? other.MAX_EIAS_WEREFORMS : other.MAX_EIAS, EIAS));
	}

	function getSequence(weaponType) {
		if (skill == skills.DOUBLE_THROW) return 12;
		if (skill == skills.DOUBLE_SWING || skill == skills.FRENZY) return 17;
		if (skill == skills.FISTS_OF_FIRE || skill == skills.CLAWS_OF_THUNDER
				|| skill == skills.BLADES_OF_ICE || skill == skills.DRAGON_CLAW) return (weaponType == wt.UNARMED || weaponType == wt.CLAW) ? 12 : 16;
		if (skill == skills.JAB) return weaponType == wt.ONE_HANDED_THRUSTING ? 18 : 21;
		if (weaponType == wt.ONE_HANDED_THRUSTING) return 21;
		if (weaponType == wt.TWO_HANDED_THRUSTING) return 24;
		return -1;
	}

	function getStartingFrame(weaponType) {
		if ((character == char.AMAZON || character == char.SORCERESS) && (skill == skills.STANDARD || skill == skills.FEND || skill == skills.ZEAL)) {
			if (weaponType == wt.UNARMED) return 1;
			if (weaponType == wt.ONE_HANDED_SWINGING || weaponType == wt.TWO_HANDED_SWORD || weaponType == wt.ONE_HANDED_THRUSTING
					|| weaponType == wt.TWO_HANDED_THRUSTING || weaponType == wt.TWO_HANDED) return 2;
		}
		return 0;
	}

	function calculateActionFrame(weaponType) {
		if (skill == skills.DRAGON_TALON) return 4;
		if (character == char.BARBARIAN && weaponType == wt.TWO_HANDED_SWORD && (constants.checkbox.IS_ONE_HANDED.checked || skill == skills.WHIRLWIND || isSecondWeaponSet())) weaponType = wt.ONE_HANDED_SWINGING;
		return weaponType.getActionFrame(character);
	}

	function canBeEquipped(weapon, isSecondary) {
		let name = weapon.name;
		let weaponType = weapon.type;
		let itemClass = weapon.itemClass;
		if (weaponType == wt.UNARMED && (skill == skills.STANDARD || isMercenarySelected())) return true;
		if (character == char.ROGUE_SCOUT && weaponType != wt.BOW) return false;
		if (character == char.DESERT_MERCENARY && itemClass != ic.POLEARM && itemClass != ic.SPEAR && itemClass != ic.JAVELIN) return false;
		if (character == char.BASH_BARBARIAN && itemClass != ic.SWORD) return false;
		if (character == char.FRENZY_BARBARIAN && !(itemClass == ic.SWORD && weaponType.isOneHand)) return false;
		if (character != char.ASSASSIN && weaponType == wt.CLAW) return false;
		if ((character != char.AMAZON && character != char.ROGUE_SCOUT) && (
			name == "Stag Bow" || name == "Reflex Bow" || name == "Ashwood Bow" || name == "Ceremonial Bow" || name == "Matriarchal Bow" || name == "Grand Matron Bow" ||
			name == "Maiden Javelin" || name == "Ceremonial Javelin" || name == "Matriarchal Javelin" ||
			name == "Maiden Spear" || name == "Maiden Pike" || name == "Ceremonial Spear" || name == "Ceremonial Pike" || name == "Matriarchal Spear" || name == "Matriarchal Pike"
			)) return false;
		if (character != char.SORCERESS && itemClass == ic.ORB) return false;
		if (character != char.PALADIN && skill == skills.ZEAL && !(weaponType.isMelee && weapon.maxSockets >= 4)) return false;
		if (skill == skills.THROW && !weapon.canBeThrown()) return false;
		if (isSecondary && character == char.ASSASSIN && !(weaponType == wt.UNARMED || weaponType == wt.CLAW)) return false;
		if (isSecondary && character == char.BARBARIAN && !(weaponType == wt.UNARMED || weaponType.isOneHand || weaponType == wt.TWO_HANDED_SWORD)) return false;
		if (skill == skills.STRAFE && !(weaponType == wt.BOW || weaponType == wt.CROSSBOW)) return false;
		if (character == char.AMAZON && (skill == skills.JAB || skill == skills.IMPALE || skill == skills.FEND) && !(itemClass == ic.JAVELIN || itemClass == ic.SPEAR)) return false;
		if (skill == skills.DRAGON_CLAW && weaponType != wt.CLAW) return false;
		if ((skill == skills.TIGER_STRIKE || skill == skills.COBRA_STRIKE || skill == skills.PHOENIX_STRIKE) && !weaponType.isMelee) return false;
		if (character == char.ASSASSIN && (skill == skills.FISTS_OF_FIRE || skill == skills.CLAWS_OF_THUNDER || skill == skills.BLADES_OF_ICE || skill == skills.WHIRLWIND) && !((isSecondary && weaponType == wt.UNARMED) || weaponType == wt.CLAW)) return false;
		if (character == char.BARBARIAN && (skill == skills.DOUBLE_SWING || skill == skills.FRENZY) && (weaponType == wt.UNARMED || !(weaponType.isOneHand || weaponType == wt.TWO_HANDED_SWORD))) return false;
		if (skill == skills.DOUBLE_THROW && !weapon.canBeThrown()) return false;
		return true;
	}

	function displayTableInfo(text) {
		let element = document.createElement("p");
		element.className = "tablesDesc";
		element.innerHTML = text;
		container.TABLE.appendChild(element);
	}

	function generateLink() {
		let data = character + constants.LINK_SEPARATOR +
			wereform + constants.LINK_SEPARATOR +
			primaryWeapon.name + constants.LINK_SEPARATOR +
			number.PRIMARY_WEAPON_IAS.value + constants.LINK_SEPARATOR +
			(constants.checkbox.IS_ONE_HANDED.checked ? 1 : 0) + constants.LINK_SEPARATOR +
			secondaryWeapon.name + constants.LINK_SEPARATOR +
			number.SECONDARY_WEAPON_IAS.value + constants.LINK_SEPARATOR +
			skill.name + constants.LINK_SEPARATOR +
			tableVariable + constants.LINK_SEPARATOR +
			number.IAS.value + constants.LINK_SEPARATOR +
			number.FANATICISM.value + constants.LINK_SEPARATOR +
			number.BURST_OF_SPEED.value + constants.LINK_SEPARATOR +
			number.WEREWOLF.value + constants.LINK_SEPARATOR +
			number.MAUL.value + constants.LINK_SEPARATOR +
			number.FRENZY.value + constants.LINK_SEPARATOR +
			number.HOLY_FREEZE.value + constants.LINK_SEPARATOR +
			number.SLOWED_BY.value + constants.LINK_SEPARATOR +
			(constants.checkbox.DECREPIFY.checked ? 1 : 0) + constants.LINK_SEPARATOR +
			(constants.checkbox.CHILLED.checked ? 1 : 0);
		let link = window.location.href;
		if (link.includes("?data=")) link = link.substring(0, link.indexOf("?data="));
		copyToClipboard(link + "?data=" + data.replace(/\ /g, "_"));
	}

	function loadFromParams() {
		let params = new URLSearchParams(location.search);
		let data = params.get("data");
		if (data == null) return;
		let parser = new constants.DataParser(data);
		let characterL = parser.readInt();
		let wereformL = parser.readInt();
		let primaryWeaponName = parser.readString().replace(/\_/g, " ");
		let primaryWIAS = parser.readInt();
		let oneHanded = parser.readBoolean();
		let secondaryWeaponName = parser.readString().replace(/\_/g, " ");
		let secondaryWIAS = parser.readInt();
		let skillName = parser.readString().replace(/\_/g, " ");
		let tableVariableValue = parser.readInt();
		let IAS = parser.readInt();
		let fanaticism = parser.readInt();
		let burstOfSpeed = parser.readInt();
		let werewolf = parser.readInt();
		let maul = parser.readInt();
		let frenzy = parser.readInt();
		let holyFreeze = parser.readInt();
		let slowedBy = parser.readInt();
		let decrepify = parser.readBoolean();
		let chilled = parser.readBoolean();

		character = characterL;
		select.CHARACTER.value = character;
		onCharacterChange(false);

		wereform = wereformL;
		select.WEREFORM.value = wereform;
		onWereformChange(false);

		skill = constants.getSkill(skillName);
		select.SKILL.value = skillName;
		onSkillChange(false);

		tableVariable = tableVariableValue;
		select.TABLE_VARIABLE.value = tableVariableValue;
		onTableVariableChange(false);

		primaryWeapon = constants.getWeapon(primaryWeaponName);
		select.PRIMARY_WEAPON.value = primaryWeapon.name + " [" + primaryWeapon.WSM + "]";
		onPrimaryWeaponChange(false);

		number.PRIMARY_WEAPON_IAS.value = primaryWIAS;
		constants.checkbox.IS_ONE_HANDED.checked = oneHanded;

		secondaryWeapon = constants.getWeapon(secondaryWeaponName);
		select.SECONDARY_WEAPON.value = secondaryWeapon.name + " [" + secondaryWeapon.WSM + "]";
		if (secondaryWeaponName != "None") onSecondaryWeaponChange(false);

		number.SECONDARY_WEAPON_IAS.value = secondaryWIAS;

		number.IAS.value = IAS;
		number.FANATICISM.value = fanaticism;
		number.BURST_OF_SPEED.value = burstOfSpeed;
		number.WEREWOLF.value = werewolf;
		number.MAUL.value = maul;
		number.FRENZY.value = frenzy;
		number.HOLY_FREEZE.value = holyFreeze;
		number.SLOWED_BY.value = slowedBy;
		checkbox.DECREPIFY.checked = decrepify;
		checkbox.CHILLED.checked = chilled;

	}

	function log(...msg) {
		if (debug) {
			let message = "" + msg[0];
			for (let i = 1; i < msg.length; i++) {
				message = message.replace("%s", msg[i]);
			}
			console.log(message);
		}
	}

	function setupConstants() {
		constants.setupInputElement(select.TABLE_VARIABLE, () => onTableVariableChange(true));
		constants.setupInputElement(select.CHARACTER, () => onCharacterChange(true));
		constants.setupInputElement(select.WEREFORM, () => onWereformChange(true));
		constants.setupInputElement(select.SKILL, () => onSkillChange(true));
		constants.setupInputElement(select.PRIMARY_WEAPON, () => onPrimaryWeaponChange(true));
		constants.setupInputElement(select.SECONDARY_WEAPON, () => onSecondaryWeaponChange(true));
		constants.setupInputElement(button.GENERATE_LINK, generateLink);
		constants.setupUpdateTableInputElements(displayFrames);
	}

}

function trun(number) {
	if (number == -0) number = 0;
	return number >= 0 ? Math.floor(number) : Math.ceil(number);
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

function hideElement(element) {
	element.style.display = "none";
}

function unhideElement(element) {
	element.style.display = "initial";
}

function isElementHidden(element) {
	return !(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
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
	if (value == "divider") option.disabled = true;
	else option.setAttribute("value", value);
	option.text = value == "divider" ? "───────────" : value;
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
	tdFPA.title = "Frames Per Animation (not Attack/Hit)";
	tdFPA.className = "hoverable";

	tableRow.appendChild(thVariableLabel);
	tableRow.appendChild(tdFPA);

	table.appendChild(tableRow);
}
