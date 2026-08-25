
const debug = true;

const container = {
    TABLE_VARIABLE: document.getElementById("tableVariableContainer"),
	WEREFORM: document.getElementById("wereformContainer"),
	PRIMARY_WEAPON: document.getElementById("primaryWeaponContainer"),
	IS_ONE_HANDED: document.getElementById("isOneHandedContainer"),
	PRIMARY_WEAPON_IAS: document.getElementById("primaryWeaponIASContainer"),
	SECONDARY_WEAPON: document.getElementById("secondaryWeaponContainer"),
	SECONDARY_WEAPON_IAS: document.getElementById("secondaryWeaponIASContainer"),
	IAS: document.getElementById("IASContainer"),
	FANATICISM: document.getElementById("fanaticismContainer"),
	BURST_OF_SPEED: document.getElementById("burstOfSpeedContainer"),
	WEREWOLF: document.getElementById("werewolfContainer"),
	MAUL: document.getElementById("maulContainer"),
	FRENZY: document.getElementById("frenzyContainer"),
	MARK_OF_BEAR: document.getElementById("markOfBearContainer"),
	PURGE: document.getElementById("purgeContainer"),
	CLEAVE: document.getElementById("cleaveContainer"),
	MIRRORED_BLADES: document.getElementById("mirroredBladesContainer"),
	HOLY_FREEZE: document.getElementById("holyFreezeContainer"),
	SLOWED_BY: document.getElementById("slowedByContainer"),
	DECREPIFY: document.getElementById("decrepifyContainer"),
	CHILLED: document.getElementById("chilledContainer"),
	LETHARGY: document.getElementById("lethargyContainer"),
	TABLE: document.getElementById("tableContainer")
};

const select = {
    TABLE_VARIABLE: document.getElementById("tableVariableSelect"),
	CHARACTER: document.getElementById("characterSelect"),
	WEREFORM: document.getElementById("wereformSelect"),
	SKILL: document.getElementById("skillSelect"),
	PRIMARY_WEAPON: document.getElementById("primaryWeaponSelect"),
	SECONDARY_WEAPON: document.getElementById("secondaryWeaponSelect")
};

const number = {
    PRIMARY_WEAPON_IAS: document.getElementById("primaryWeaponIAS"),
	SECONDARY_WEAPON_IAS: document.getElementById("secondaryWeaponIAS"),
	IAS: document.getElementById("IAS"),
	FANATICISM: document.getElementById("fanaticismLevel"),
	BURST_OF_SPEED: document.getElementById("burstOfSpeedLevel"),
	WEREWOLF: document.getElementById("werewolfLevel"),
	MAUL: document.getElementById("maulLevel"),
	FRENZY: document.getElementById("frenzyLevel"),
	PURGE: document.getElementById("purgeLevel"),
	CLEAVE: document.getElementById("cleaveLevel"),
	MIRRORED_BLADES: document.getElementById("mirroredBladesLevel"),
	HOLY_FREEZE: document.getElementById("holyFreezeLevel"),
	SLOWED_BY: document.getElementById("slowedByLevel")
};

const checkbox = {
    IS_ONE_HANDED: document.getElementById("isOneHanded"),
	MARK_OF_BEAR: document.getElementById("markOfBear"),
	DECREPIFY: document.getElementById("decrepify"),
	CHILLED: document.getElementById("chilled"),
	LETHARGY: document.getElementById("lethargy")
};

const char = {
    AMAZON: 0,
    ASSASSIN: 1,
    BARBARIAN: 2,
    DRUID: 3,
    NECROMANCER: 4,
    PALADIN: 5,
    SORCERESS: 6,
	WARLOCK: 11,
	// mercs
    ROGUE_SCOUT: 7,
    DESERT_MERCENARY: 8,
    BASH_BARBARIAN: 9,
    FRENZY_BARBARIAN: 10
};

const wf = {
    HUMAN: 0,
    WEREBEAR: 1,
    WEREWOLF: 2
};

const tv = {
	EIAS: 0,
    IAS: 1,
    FANATICISM: 2,
    PRIMARY_WEAPON_IAS: 3,
    SECONDARY_WEAPON_IAS: 4,
    BURST_OF_SPEED: 5,
    WEREWOLF: 6,
    FRENZY: 7,
    MAUL: 8
};

export function isTableVariableSkill(variable) {
	return variable == tv.FANATICISM || variable == tv.BURST_OF_SPEED || variable == tv.WEREWOLF
		|| variable == tv.MAUL || variable == tv.FRENZY;
}

export function getTableVariableSkill(variable) {
	switch(variable) {
		case tv.FANATICISM:
			return skill.FANATICISM;
		case tv.BURST_OF_SPEED:
			return skill.BURST_OF_SPEED;
		case tv.WEREWOLF:
			return skill.WEREWOLF;
		case tv.MAUL:
			return skill.MAUL;
		case tv.FRENZY:
			return skill.FRENZY;
		default:
			return null;
	}
}

const option = {
	TABLE_VARIABLE_IAS: select.TABLE_VARIABLE.options[tv.IAS],
    TABLE_VARIABLE_PRIMARY_WEAPON_IAS: select.TABLE_VARIABLE.options[tv.PRIMARY_WEAPON_IAS],
	TABLE_VARIABLE_SECONDARY_WEAPON_IAS: select.TABLE_VARIABLE.options[tv.SECONDARY_WEAPON_IAS],
	TABLE_VARIABLE_BURST_OF_SPEED: select.TABLE_VARIABLE.options[tv.BURST_OF_SPEED],
	TABLE_VARIABLE_WEREWOLF: select.TABLE_VARIABLE.options[tv.WEREWOLF],
	TABLE_VARIABLE_FRENZY: select.TABLE_VARIABLE.options[tv.FRENZY],
	TABLE_VARIABLE_MAUL: select.TABLE_VARIABLE.options[tv.MAUL],

	WEREFORM_WEREWOLF: select.WEREFORM.options[wf.WEREWOLF]
};

const button = {
    GENERATE_LINK: document.getElementById("generateLink")
};

const other = {

	MAX_EIAS: 75, // for a brief period of D2R, this limit did not exist. rip bugged ias frames :(
	MIN_EIAS: -85,	
	MAX_EIAS_WEREFORMS: 150,
	MAX_IAS_ACCELERATION_WEAPON: 60,
	MAX_IAS_ACCELERATION_CHARACTER: 88,
	MAX_IAS_ACCELERATION_CHARACTER_TWO_HANDED: 83,
	MAX_IAS_ACCELERATION_MERCENARY: 78,
	MAX_IAS_WEAPON: 120

};

const LINK_SEPARATOR = '-';

export class DataParser {

	constructor(data) {
		this.data = [...data];
		this.index = 0;
	}

	readToken() {
		let string = "";
		while (this.index < this.data.length && this.data[this.index] != LINK_SEPARATOR) {
			string += this.data[this.index++];
		}
		this.index++;
		return string;
	}

	readInt() {
		return parseInt(this.readToken());
	}

	readBoolean() {
		return !!this.readInt();
	}

	readString() {
		return this.readToken();
	}

	isLetter(c) {
		return c.toLowerCase() != c.toUpperCase();
	}

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

class Weapon {

	constructor(name, WSM, type, itemClass, maxSockets) {
		this.name = name;
		this.WSM = WSM;
		this.type = type;
		this.itemClass = itemClass;
		this.maxSockets = maxSockets;
	}

	canBeThrown() {
		return this.itemClass == ic.THROWING || this.itemClass == ic.JAVELIN;
	}

}

class Skill {

	constructor(name, canDualWield, isDualWieldOnly, isSequence, isRollback) {
		this.name = name;
		this.canDualWield = canDualWield;
		this.isDualWieldOnly = isDualWieldOnly;
		this.isSequence = isSequence;
		this.isRollback = isRollback;
	}

	isDualWieldedSequenceSkill() {
		return this.isDualWieldOnly && this.isSequence;
	}

}

const LEVEL_SKILL_MAXIMUM = 60;

class AttackSpeedSkill {

	constructor(input, calcFunction, tableVariable, predicate) {
		this.input = input;
		this.calcFunction = calcFunction;
		this.tableVariable = tableVariable;
		this.predicate = predicate;
		this.max = this.getEIASFromLevel(LEVEL_SKILL_MAXIMUM);
		this.reverse = new Map();
		for (let level = LEVEL_SKILL_MAXIMUM; level >= 0; level--) {
			this.reverse.set(this.getEIASFromLevel(level), level);
		}
	}

	getEIASFromLevel(level) {
		if (level == 0) return 0;
		return this.calcFunction(level);
	}

	calculate(tableVariable, character, wereform, skill) {
		if (this.tableVariable == tableVariable || (this.predicate != null && !this.predicate(character, wereform, skill))) return 0;
		let level = parseInt(this.input.value);
		return this.getEIASFromLevel(level);
	}

	getLevelFromEIAS(EIAS) {
		let lastLevel = LEVEL_SKILL_MAXIMUM;
		for (const [levelEIAS, level] of this.reverse) {
			if (EIAS > levelEIAS) return lastLevel;
			lastLevel = level;
		}
		return 0;
	}

}

const skill = {
    FANATICISM: new AttackSpeedSkill(number.FANATICISM, skillCalcDiminishing.bind(null, 10, 40, 0, -1), tv.FANATICISM),
	BURST_OF_SPEED: new AttackSpeedSkill(number.BURST_OF_SPEED, skillCalcDiminishing.bind(null, 15, 60, 0, -1), tv.BURST_OF_SPEED),
	WEREWOLF: new AttackSpeedSkill(number.WEREWOLF, skillCalcDiminishing.bind(null, 10, 80, 0, -1), tv.WEREWOLF, (_character, wereform, _skill) => wereform == wf.WEREWOLF),
	MAUL: new AttackSpeedSkill(number.MAUL, maulCalc.bind(null), tv.MAUL, (_character, wereform, _skill) => wereform == wf.WEREBEAR),
	FRENZY: new AttackSpeedSkill(number.FRENZY, skillCalcDiminishing.bind(null, 0, 50, 0, -1), tv.FRENZY, (character, _wereform, _skill) => character == char.BARBARIAN || character == char.FRENZY_BARBARIAN),
	HOLY_FREEZE: new AttackSpeedSkill(number.HOLY_FREEZE, skillCalcDiminishing.bind(null, 25, 60, 0, 50)), // -50 cap cuz chill effectiveness
	PURGE: new AttackSpeedSkill(number.PURGE, skillCalcLinear.bind(null, 10, 1, 0, 30)),
	CLEAVE: new AttackSpeedSkill(number.CLEAVE, skillCalcDiminishing.bind(null, 10, 30, 0, -1), null, (_character, _wereform, skill) => skill == skills.CLEAVE),
	MIRRORED_BLADES: new AttackSpeedSkill(number.MIRRORED_BLADES, skillCalcDiminishing.bind(null, 10, 30, 0, -1), null, (_character, _wereform, skill) => skill == skills.MIRRORED_BLADES)
};

function skillCalcLinear(par1, par2, min, max, lvl) {
	let value = par1 + (lvl - 1) * par2;
	if (value < min) value = min;
	else if (max != -1 && value > max) value = max;
	return value;
}

function skillCalcDiminishing(par1, par2, min, max, lvl) {
	let value = par1 + parseInt(110 * lvl * (par2 - par1) / (100 * (lvl + 6)));
	//let value = par1 + parseInt((par2 - par1) * parseInt((110 * lvl) / (lvl + 6)) / 100); // it was originally written this way but idk why, its not whats written in skillcalc, values are still the same (seemingly)
	if (value < min) value = min;
	else if (max != -1 && value > max) value = max;
	return value;
}

function maulCalc(lvl) {
	return lvl == 0 ? 0 : 3 * (parseInt(lvl / 2) + 3); 
}

const skillsMap = new Map();
const skills = {
    // common
    STANDARD: addSkill(new Skill("Standard", true, false, false, false)), // offhand hits have different speed in normal attack
    THROW: addSkill(new Skill("Throw", false, false, false, false)),
    KICK: addSkill(new Skill("Kick", false, false, false, false)), // kicking barrels open
    // amazon
    DODGE: addSkill(new Skill("Dodge", false, false, false, false)),
    IMPALE: addSkill(new Skill("Impale", false, false, true, false)),
    JAB: addSkill(new Skill("Jab", false, false, true, false)),
    STRAFE: addSkill(new Skill("Strafe", false, false, false, true)),
    FEND: addSkill(new Skill("Fend", false, false, false, true)),
    // assassin
    TIGER_STRIKE: addSkill(new Skill("Tiger Strike", false, false, false, false)),
    COBRA_STRIKE: addSkill(new Skill("Cobra Strike", false, false, false, false)),
    PHOENIX_STRIKE: addSkill(new Skill("Phoenix Strike", false, false, false, false)),
    FISTS_OF_FIRE: addSkill(new Skill("Fists of Fire", true, false, true, false)),
    CLAWS_OF_THUNDER: addSkill(new Skill("Claws of Thunder", true, false, true, false)),
    BLADES_OF_ICE: addSkill(new Skill("Blades of Ice", true, false, true, false)),
    DRAGON_CLAW: addSkill(new Skill("Dragon Claw", true, true, true, false)),
    DRAGON_TAIL: addSkill(new Skill("Dragon Tail", false, false, false, false)),
    DRAGON_TALON: addSkill(new Skill("Dragon Talon", false, false, false, true)),
    LAYING_TRAPS: addSkill(new Skill("Laying Traps", false, false, false, false)),
    // barbarian
    DOUBLE_SWING: addSkill(new Skill("Double Swing", true, true, true, false)),
    FRENZY: addSkill(new Skill("Frenzy", true, true, true, false)),
    TAUNT: addSkill(new Skill("Taunt", true, false, false)), // frenzy merc
    DOUBLE_THROW: addSkill(new Skill("Double Throw", true, true, true, false)),
    WHIRLWIND: addSkill(new Skill("Whirlwind", true, false, false, false)), // whirlwind is technically a sequence skill, but its very hardcoded, so it doesnt follow the same logic for calculation
    CONCENTRATE: addSkill(new Skill("Concentrate", false, false, false, false)),
    BERSERK: addSkill(new Skill("Berserk", false, false, false, false)),
    BASH: addSkill(new Skill("Bash", false, false, false, false)),
    STUN: addSkill(new Skill("Stun", false, false, false, false)),
    // druid
    FERAL_RAGE: addSkill(new Skill("Feral Rage", false, false, false, false)), // barb can dual wield but it doesn't impact the skill since its primary-only
    HUNGER: addSkill(new Skill("Hunger", false, false, false, false)),
    RABIES: addSkill(new Skill("Rabies", false, false, false, false)),
    FURY: addSkill(new Skill("Fury", false, false, false, false)),
    // paladin
    ZEAL: addSkill(new Skill("Zeal", false, false, false, true)),
    SMITE: addSkill(new Skill("Smite", false, false, false, false)),
    SACRIFICE: addSkill(new Skill("Sacrifice", false, false, false, false)),
    VENGEANCE: addSkill(new Skill("Vengeance", false, false, false, false)),
    CONVERSION: addSkill(new Skill("Conversion", false, false, false, false)),
	// warlock
	CLEAVE: addSkill(new Skill("Cleave", false, false, true, false)),
	MIRRORED_BLADES: addSkill(new Skill("Mirrored Blades", false, false, true, false))
};

function addSkill(skill) { skillsMap.set(skill.name, skill); return skill; }

export function getSkill(name) {
    return skillsMap.get(name);
}

const wt = { // weapon types
	// HTH
    UNARMED: new WeaponType(true, true, [
        [char.AMAZON, [13, 8]],
        [char.ASSASSIN, [11, 12, 6]],
        [char.BARBARIAN, [12, 6]],
        [char.DRUID, [16, 8]],
        [char.NECROMANCER, [15, 8]],
        [char.PALADIN, [14, 7]],
        [char.SORCERESS, [16, 9]],
		[char.WARLOCK, [16, 9]], // A2 has AF=7 but i don't display action frames currently
        [char.ROGUE_SCOUT, 15], // assumed
        [char.DESERT_MERCENARY, 16], // assumed
        [char.BASH_BARBARIAN, 16],  // assumed
        [char.FRENZY_BARBARIAN, 16]  // assumed
    ]),
	// HT1, HT2 (HT1 if single wield, HT2 if dual wield)
    CLAW: new WeaponType(true, true, [[char.ASSASSIN, [11, 12, 6]]]),
	// 1HS
    ONE_HANDED_SWINGING: new WeaponType(true, true, [
        [char.AMAZON, [16, 10]],
        [char.ASSASSIN, [15, 7]],
        [char.BARBARIAN, [16, 7]],
        [char.DRUID, [19, 9]],
        [char.NECROMANCER, [19, 9]],
        [char.PALADIN, [15, 7]],
        [char.SORCERESS, [20, 12]],
		[char.WARLOCK, [16, 9]],
        [char.BASH_BARBARIAN, 16],
        [char.FRENZY_BARBARIAN, 16]
    ]),
	// 1HT
    ONE_HANDED_THRUSTING: new WeaponType(true, true, [
        [char.AMAZON, [15, 9]],
        [char.ASSASSIN, [15, 7]],
        [char.BARBARIAN, [16, 7]],
        [char.DRUID, [19, 8]],
        [char.NECROMANCER, [19, 9]],
        [char.PALADIN, [17, 8]],
        [char.SORCERESS, [19, 11]],
		[char.WARLOCK, [16, 8]],
        [char.DESERT_MERCENARY, 16]
    ]),
	// 2HS
    TWO_HANDED_SWORD: new WeaponType(true, false, [
        [char.AMAZON, [20, 12]],
        [char.ASSASSIN, [23, 11]],
        [char.BARBARIAN, [18, 8]],
        [char.DRUID, [21, 10]],
        [char.NECROMANCER, [23, 11]],
        [char.PALADIN, [18, 19, 8]],
        [char.SORCERESS, [24, 14]],
		[char.WARLOCK, [19, 11]], // A2 has AF=12 but i don't display action frames currently
        [char.BASH_BARBARIAN, 16],
        [char.FRENZY_BARBARIAN, 16]
    ]),
	// 2HT
    TWO_HANDED_THRUSTING: new WeaponType(true, false, [
        [char.AMAZON, [18, 11]],
        [char.ASSASSIN, [23, 10]],
        [char.BARBARIAN, [19, 9]],
        [char.DRUID, [23, 9]],
        [char.NECROMANCER, [24, 10]],
        [char.PALADIN, [20, 8]],
        [char.SORCERESS, [23, 13]],
		[char.WARLOCK, [21, 23, 11]],
        [char.DESERT_MERCENARY, 16]
    ]),
    // STF
    TWO_HANDED: new WeaponType(true, false, [ // original calc suggests this is STF while two handed sword is 2HS
        [char.AMAZON, [20, 12]],
        [char.ASSASSIN, [19, 9]],
        [char.BARBARIAN, [19, 9]],
        [char.DRUID, [17, 9]],
        [char.NECROMANCER, [20, 11]],
        [char.PALADIN, [18, 9]],
        [char.SORCERESS, [18, 11]],
		[char.WARLOCK, [17, 10]],
        [char.DESERT_MERCENARY, 16]
    ]),
    BOW: new WeaponType(false, false, [
        [char.AMAZON, [14, 6]],
        [char.ASSASSIN, [16, 7]],
        [char.BARBARIAN, [15, 7]],
        [char.DRUID, [16, 8]],
        [char.NECROMANCER, [18, 9]],
        [char.PALADIN, [16, 8]],
        [char.SORCERESS, [17, 9]],
		[char.WARLOCK, [17, 11]],
        [char.ROGUE_SCOUT, 15]
    ]),
	// XBW
    CROSSBOW: new WeaponType(false, false, [
        [char.AMAZON, [20, 9]],
        [char.ASSASSIN, [21, 10]],
        [char.BARBARIAN, [20, 10]],
        [char.DRUID, [20, 10]],
        [char.NECROMANCER, [20, 11]],
        [char.PALADIN, [20, 10]],
        [char.SORCERESS, [20, 11]],
		[char.WARLOCK, [18, 10]]
    ]),
	// TH
    THROWING: new WeaponType(true, true, [
        [char.AMAZON, 16],
        [char.ASSASSIN, 16],
        [char.BARBARIAN, 16],
        [char.DRUID, 18],
        [char.NECROMANCER, 20],
        [char.PALADIN, 16],
        [char.SORCERESS, 20],
		[char.WARLOCK, [20, 10]]
    ])
};

const ic = {
	NONE: "None",
	AXE: "Axe",
	DAGGER: "Dagger",
	POLEARM: "Polearm",
	JAVELIN: "Javelin",
	SPEAR: "Spear",
	SWORD: "Sword",
	MACE: "Mace",
	MISSILE: "Missile",
	STAFF: "Staff",
	ORB: "Orb",
	CLAW: "Claw",
	THROWING: "Throwing"
};

const weaponsMap = new Map();
const weapons = {
	NONE: addWeapon(new Weapon("None", 0, wt.UNARMED, ic.NONE, 0))
}
addWeapon(new Weapon("Ancient Axe", 10, wt.TWO_HANDED, ic.AXE, 6));
addWeapon(new Weapon("Ancient Sword", 0, wt.ONE_HANDED_SWINGING, ic.SWORD, 3));
addWeapon(new Weapon("Arbalest", -10, wt.CROSSBOW, ic.MISSILE, 3));
addWeapon(new Weapon("Archon Staff", 10, wt.TWO_HANDED, ic.STAFF, 6));
addWeapon(new Weapon("Ashwood Bow", 0, wt.BOW, ic.MISSILE, 5));
addWeapon(new Weapon("Ataghan", -20, wt.ONE_HANDED_SWINGING, ic.SWORD, 2));
addWeapon(new Weapon("Axe", 10, wt.ONE_HANDED_SWINGING, ic.AXE, 4));
addWeapon(new Weapon("Balanced Axe", -10, wt.ONE_HANDED_SWINGING, ic.THROWING, 0));
addWeapon(new Weapon("Balanced Knife", -20, wt.ONE_HANDED_THRUSTING, ic.THROWING, 0));
addWeapon(new Weapon("Ballista", 10, wt.CROSSBOW, ic.MISSILE, 6));
addWeapon(new Weapon("Balrog Blade", 0, wt.TWO_HANDED_SWORD, ic.SWORD, 4));
addWeapon(new Weapon("Balrog Spear", 10, wt.ONE_HANDED_THRUSTING, ic.JAVELIN, 0));
addWeapon(new Weapon("Barbed Club", 0, wt.ONE_HANDED_SWINGING, ic.MACE, 3));
addWeapon(new Weapon("Bardiche", 10, wt.TWO_HANDED, ic.POLEARM, 3));
addWeapon(new Weapon("Bastard Sword", 10, wt.TWO_HANDED_SWORD, ic.SWORD, 4));
addWeapon(new Weapon("Battle Axe", 10, wt.TWO_HANDED, ic.AXE, 5));
addWeapon(new Weapon("Battle Cestus", -10, wt.CLAW, ic.CLAW, 2));
addWeapon(new Weapon("Battle Dart", 0, wt.ONE_HANDED_THRUSTING, ic.THROWING, 0));
addWeapon(new Weapon("Battle Hammer", 20, wt.ONE_HANDED_SWINGING, ic.MACE, 4));
addWeapon(new Weapon("Battle Scythe", -10, wt.TWO_HANDED, ic.POLEARM, 5));
addWeapon(new Weapon("Battle Staff", 0, wt.TWO_HANDED, ic.STAFF, 4));
addWeapon(new Weapon("Battle Sword", 0, wt.ONE_HANDED_SWINGING, ic.SWORD, 4));
addWeapon(new Weapon("Bearded Axe", 0, wt.TWO_HANDED, ic.AXE, 5));
addWeapon(new Weapon("Bec-de-Corbin", 0, wt.TWO_HANDED, ic.POLEARM, 6));
addWeapon(new Weapon("Berserker Axe", 0, wt.ONE_HANDED_SWINGING, ic.AXE, 6));
addWeapon(new Weapon("Bill", 0, wt.TWO_HANDED, ic.POLEARM, 4));
addWeapon(new Weapon("Blade Bow", -10, wt.BOW, ic.MISSILE, 4));
addWeapon(new Weapon("Blade Talons", -20, wt.CLAW, ic.CLAW, 3));
addWeapon(new Weapon("Blade", -10, wt.ONE_HANDED_THRUSTING, ic.DAGGER, 2));
addWeapon(new Weapon("Bone Knife", -20, wt.ONE_HANDED_THRUSTING, ic.DAGGER, 1));
addWeapon(new Weapon("Bone Wand", -20, wt.ONE_HANDED_SWINGING, ic.STAFF, 2));
addWeapon(new Weapon("Brandistock", -20, wt.TWO_HANDED_THRUSTING, ic.SPEAR, 5));
addWeapon(new Weapon("Broad Axe", 0, wt.TWO_HANDED, ic.AXE, 5));
addWeapon(new Weapon("Broad Sword", 0, wt.ONE_HANDED_SWINGING, ic.SWORD, 4));
addWeapon(new Weapon("Burnt Wand", 0, wt.ONE_HANDED_SWINGING, ic.STAFF, 1));
addWeapon(new Weapon("Caduceus", -10, wt.ONE_HANDED_SWINGING, ic.MACE, 5));
addWeapon(new Weapon("Cedar Bow", 0, wt.BOW, ic.MISSILE, 5));
addWeapon(new Weapon("Cedar Staff", 10, wt.TWO_HANDED, ic.STAFF, 4));
addWeapon(new Weapon("Ceremonial Bow", 10, wt.BOW, ic.MISSILE, 5));
addWeapon(new Weapon("Ceremonial Javelin", -10, wt.ONE_HANDED_THRUSTING, ic.JAVELIN, 0));
addWeapon(new Weapon("Ceremonial Pike", 20, wt.TWO_HANDED_THRUSTING, ic.SPEAR, 6));
addWeapon(new Weapon("Ceremonial Spear", 0, wt.TWO_HANDED_THRUSTING, ic.SPEAR, 6));
addWeapon(new Weapon("Cestus", 0, wt.CLAW, ic.CLAW, 2));
addWeapon(new Weapon("Champion Axe", -10, wt.TWO_HANDED, ic.AXE, 6));
addWeapon(new Weapon("Champion Sword", -10, wt.TWO_HANDED_SWORD, ic.SWORD, 4));
addWeapon(new Weapon("Chu-Ko-Nu", -60, wt.CROSSBOW, ic.MISSILE, 5));
addWeapon(new Weapon("Cinquedeas", -20, wt.ONE_HANDED_THRUSTING, ic.DAGGER, 3));
addWeapon(new Weapon("Clasped Orb", 0, wt.ONE_HANDED_SWINGING, ic.ORB, 3));
addWeapon(new Weapon("Claws", -10, wt.CLAW, ic.CLAW, 3));
addWeapon(new Weapon("Claymore", 10, wt.TWO_HANDED_SWORD, ic.SWORD, 4));
addWeapon(new Weapon("Cleaver", 10, wt.ONE_HANDED_SWINGING, ic.AXE, 4));
addWeapon(new Weapon("Cloudy Sphere", 0, wt.ONE_HANDED_SWINGING, ic.ORB, 3));
addWeapon(new Weapon("Club", -10, wt.ONE_HANDED_SWINGING, ic.MACE, 2));
addWeapon(new Weapon("Colossus Blade", 5, wt.TWO_HANDED_SWORD, ic.SWORD, 6));
addWeapon(new Weapon("Colossus Crossbow", 10, wt.CROSSBOW, ic.MISSILE, 6));
addWeapon(new Weapon("Colossus Sword", 10, wt.TWO_HANDED_SWORD, ic.SWORD, 5));
addWeapon(new Weapon("Colossus Voulge", 10, wt.TWO_HANDED, ic.POLEARM, 4));
addWeapon(new Weapon("Composite Bow", -10, wt.BOW, ic.MISSILE, 4));
addWeapon(new Weapon("Conquest Sword", 0, wt.ONE_HANDED_SWINGING, ic.SWORD, 4));
addWeapon(new Weapon("Crossbow", 0, wt.CROSSBOW, ic.MISSILE, 4));
addWeapon(new Weapon("Crowbill", -10, wt.ONE_HANDED_SWINGING, ic.AXE, 6));
addWeapon(new Weapon("Crusader Bow", 10, wt.BOW, ic.MISSILE, 6));
addWeapon(new Weapon("Cryptic Axe", 10, wt.TWO_HANDED, ic.POLEARM, 5));
addWeapon(new Weapon("Cryptic Sword", -10, wt.ONE_HANDED_SWINGING, ic.SWORD, 4));
addWeapon(new Weapon("Crystal Sword", 0, wt.ONE_HANDED_SWINGING, ic.SWORD, 6));
addWeapon(new Weapon("Crystalline Globe", -10, wt.ONE_HANDED_SWINGING, ic.ORB, 3));
addWeapon(new Weapon("Cudgel", -10, wt.ONE_HANDED_SWINGING, ic.MACE, 2));
addWeapon(new Weapon("Cutlass", -30, wt.ONE_HANDED_SWINGING, ic.SWORD, 2));
addWeapon(new Weapon("Dacian Falx", 10, wt.TWO_HANDED_SWORD, ic.SWORD, 4));
addWeapon(new Weapon("Dagger", -20, wt.ONE_HANDED_THRUSTING, ic.DAGGER, 1));
addWeapon(new Weapon("Decapitator", 10, wt.TWO_HANDED, ic.AXE, 5));
addWeapon(new Weapon("Demon Crossbow", -60, wt.CROSSBOW, ic.MISSILE, 5));
addWeapon(new Weapon("Demon Heart", 0, wt.ONE_HANDED_SWINGING, ic.ORB, 3));
addWeapon(new Weapon("Devil Star", 10, wt.ONE_HANDED_SWINGING, ic.MACE, 3));
addWeapon(new Weapon("Diamond Bow", 0, wt.BOW, ic.MISSILE, 5));
addWeapon(new Weapon("Dimensional Blade", 0, wt.ONE_HANDED_SWINGING, ic.SWORD, 6));
addWeapon(new Weapon("Dimensional Shard", 10, wt.ONE_HANDED_SWINGING, ic.ORB, 3));
addWeapon(new Weapon("Dirk", 0, wt.ONE_HANDED_THRUSTING, ic.DAGGER, 1));
addWeapon(new Weapon("Divine Scepter", -10, wt.ONE_HANDED_SWINGING, ic.MACE, 5));
addWeapon(new Weapon("Double Axe", 10, wt.ONE_HANDED_SWINGING, ic.AXE, 5));
addWeapon(new Weapon("Double Bow", -10, wt.BOW, ic.MISSILE, 4));
addWeapon(new Weapon("Eagle Orb", -10, wt.ONE_HANDED_SWINGING, ic.ORB, 3));
addWeapon(new Weapon("Edge Bow", 5, wt.BOW, ic.MISSILE, 3));
addWeapon(new Weapon("Elder Staff", 0, wt.TWO_HANDED, ic.STAFF, 4));
addWeapon(new Weapon("Eldritch Orb", -10, wt.ONE_HANDED_SWINGING, ic.ORB, 3));
addWeapon(new Weapon("Elegant Blade", -10, wt.ONE_HANDED_SWINGING, ic.SWORD, 2));
addWeapon(new Weapon("Espandon", 0, wt.TWO_HANDED_SWORD, ic.SWORD, 3));
addWeapon(new Weapon("Ettin Axe", 10, wt.ONE_HANDED_SWINGING, ic.AXE, 5));
addWeapon(new Weapon("Executioner Sword", 10, wt.TWO_HANDED_SWORD, ic.SWORD, 6));
addWeapon(new Weapon("Falcata", 0, wt.ONE_HANDED_SWINGING, ic.SWORD, 2));
addWeapon(new Weapon("Falchion", 20, wt.ONE_HANDED_SWINGING, ic.SWORD, 2));
addWeapon(new Weapon("Fanged Knife", -20, wt.ONE_HANDED_THRUSTING, ic.DAGGER, 3));
addWeapon(new Weapon("Fascia", 10, wt.CLAW, ic.CLAW, 2));
addWeapon(new Weapon("Feral Axe", -15, wt.TWO_HANDED, ic.AXE, 4));
addWeapon(new Weapon("Feral Claws", -20, wt.CLAW, ic.CLAW, 3));
addWeapon(new Weapon("Flail", -10, wt.ONE_HANDED_SWINGING, ic.MACE, 5));
addWeapon(new Weapon("Flamberge", -10, wt.TWO_HANDED_SWORD, ic.SWORD, 5));
addWeapon(new Weapon("Flanged Mace", 0, wt.ONE_HANDED_SWINGING, ic.MACE, 2));
addWeapon(new Weapon("Flying Axe", 10, wt.ONE_HANDED_SWINGING, ic.THROWING, 0));
addWeapon(new Weapon("Flying Knife", 0, wt.ONE_HANDED_THRUSTING, ic.THROWING, 0));
addWeapon(new Weapon("Francisca", 10, wt.ONE_HANDED_SWINGING, ic.THROWING, 0));
addWeapon(new Weapon("Fuscina", 0, wt.TWO_HANDED_THRUSTING, ic.SPEAR, 4));
addWeapon(new Weapon("Ghost Glaive", 20, wt.ONE_HANDED_THRUSTING, ic.JAVELIN, 0));
addWeapon(new Weapon("Ghost Spear", 0, wt.TWO_HANDED_THRUSTING, ic.SPEAR, 6));
addWeapon(new Weapon("Ghost Wand", 10, wt.ONE_HANDED_SWINGING, ic.STAFF, 2));
addWeapon(new Weapon("Giant Axe", 10, wt.TWO_HANDED, ic.AXE, 6));
addWeapon(new Weapon("Giant Sword", 0, wt.TWO_HANDED_SWORD, ic.SWORD, 4));
addWeapon(new Weapon("Giant Thresher", -10, wt.TWO_HANDED, ic.POLEARM, 6));
addWeapon(new Weapon("Gladius", 0, wt.ONE_HANDED_SWINGING, ic.SWORD, 2));
addWeapon(new Weapon("Glaive", 20, wt.ONE_HANDED_THRUSTING, ic.JAVELIN, 0));
addWeapon(new Weapon("Glorious Axe", 10, wt.TWO_HANDED, ic.AXE, 6));
addWeapon(new Weapon("Glowing Orb", -10, wt.ONE_HANDED_SWINGING, ic.ORB, 3));
addWeapon(new Weapon("Gnarled Staff", 10, wt.TWO_HANDED, ic.STAFF, 4));
addWeapon(new Weapon("Gorgon Crossbow", 0, wt.CROSSBOW, ic.MISSILE, 4));
addWeapon(new Weapon("Gothic Axe", -10, wt.TWO_HANDED, ic.AXE, 6));
addWeapon(new Weapon("Gothic Bow", 10, wt.BOW, ic.MISSILE, 6));
addWeapon(new Weapon("Gothic Staff", 0, wt.TWO_HANDED, ic.STAFF, 4));
addWeapon(new Weapon("Gothic Sword", 10, wt.TWO_HANDED_SWORD, ic.SWORD, 4));
addWeapon(new Weapon("Grand Matron Bow", 10, wt.BOW, ic.MISSILE, 5));
addWeapon(new Weapon("Grand Scepter", 10, wt.ONE_HANDED_SWINGING, ic.MACE, 3));
addWeapon(new Weapon("Grave Wand", 0, wt.ONE_HANDED_SWINGING, ic.STAFF, 2));
addWeapon(new Weapon("Great Axe", -10, wt.TWO_HANDED, ic.AXE, 6));
addWeapon(new Weapon("Great Bow", -10, wt.BOW, ic.MISSILE, 4));
addWeapon(new Weapon("Great Maul", 20, wt.TWO_HANDED, ic.MACE, 6));
addWeapon(new Weapon("Great Pilum", 0, wt.ONE_HANDED_THRUSTING, ic.JAVELIN, 0));
addWeapon(new Weapon("Great Poleaxe", 0, wt.TWO_HANDED, ic.POLEARM, 6));
addWeapon(new Weapon("Great Sword", 10, wt.TWO_HANDED_SWORD, ic.SWORD, 6));
addWeapon(new Weapon("Greater Claws", -20, wt.CLAW, ic.CLAW, 3));
addWeapon(new Weapon("Greater Talons", -30, wt.CLAW, ic.CLAW, 3));
addWeapon(new Weapon("Grim Scythe", -10, wt.TWO_HANDED, ic.POLEARM, 6));
addWeapon(new Weapon("Grim Wand", 0, wt.ONE_HANDED_SWINGING, ic.STAFF, 2));
addWeapon(new Weapon("Halberd", 0, wt.TWO_HANDED, ic.POLEARM, 6));
addWeapon(new Weapon("Hand Axe", 0, wt.ONE_HANDED_SWINGING, ic.AXE, 2));
addWeapon(new Weapon("Hand Scythe", -10, wt.CLAW, ic.CLAW, 2));
addWeapon(new Weapon("Harpoon", -10, wt.ONE_HANDED_THRUSTING, ic.JAVELIN, 0));
addWeapon(new Weapon("Hatchet Hands", 10, wt.CLAW, ic.CLAW, 2));
addWeapon(new Weapon("Hatchet", 0, wt.ONE_HANDED_SWINGING, ic.AXE, 2));
addWeapon(new Weapon("Heavenly Stone", -10, wt.ONE_HANDED_SWINGING, ic.ORB, 3));
addWeapon(new Weapon("Heavy Crossbow", 10, wt.CROSSBOW, ic.MISSILE, 6));
addWeapon(new Weapon("Highland Blade", -5, wt.TWO_HANDED_SWORD, ic.SWORD, 4));
addWeapon(new Weapon("Holy Water Sprinkler", 10, wt.ONE_HANDED_SWINGING, ic.MACE, 3));
addWeapon(new Weapon("Hunter's Bow", -10, wt.BOW, ic.MISSILE, 4));
addWeapon(new Weapon("Hurlbat", -10, wt.ONE_HANDED_SWINGING, ic.THROWING, 0));
addWeapon(new Weapon("Hydra Bow", 10, wt.BOW, ic.MISSILE, 6));
addWeapon(new Weapon("Hydra Edge", 10, wt.ONE_HANDED_SWINGING, ic.SWORD, 2));
addWeapon(new Weapon("Hyperion Javelin", -10, wt.ONE_HANDED_THRUSTING, ic.JAVELIN, 0));
addWeapon(new Weapon("Hyperion Spear", -10, wt.TWO_HANDED_THRUSTING, ic.SPEAR, 3));
addWeapon(new Weapon("Jagged Star", 10, wt.ONE_HANDED_SWINGING, ic.MACE, 3));
addWeapon(new Weapon("Jared's Stone", 10, wt.ONE_HANDED_SWINGING, ic.ORB, 3));
addWeapon(new Weapon("Javelin", -10, wt.ONE_HANDED_THRUSTING, ic.JAVELIN, 0));
addWeapon(new Weapon("Jo Staff", -10, wt.TWO_HANDED, ic.STAFF, 2));
addWeapon(new Weapon("Katar", -10, wt.CLAW, ic.CLAW, 2));
addWeapon(new Weapon("Knout", -10, wt.ONE_HANDED_SWINGING, ic.MACE, 5));
addWeapon(new Weapon("Kris", -20, wt.ONE_HANDED_THRUSTING, ic.DAGGER, 3));
addWeapon(new Weapon("Lance", 20, wt.TWO_HANDED_THRUSTING, ic.SPEAR, 6));
addWeapon(new Weapon("Large Axe", -10, wt.TWO_HANDED, ic.AXE, 4));
addWeapon(new Weapon("Large Siege Bow", 10, wt.BOW, ic.MISSILE, 6));
addWeapon(new Weapon("Legend Spike", -10, wt.ONE_HANDED_THRUSTING, ic.DAGGER, 2));
addWeapon(new Weapon("Legend Sword", -15, wt.TWO_HANDED_SWORD, ic.SWORD, 3));
addWeapon(new Weapon("Legendary Mallet", 20, wt.ONE_HANDED_SWINGING, ic.MACE, 4));
addWeapon(new Weapon("Lich Wand", -20, wt.ONE_HANDED_SWINGING, ic.STAFF, 2));
addWeapon(new Weapon("Light Crossbow", -10, wt.CROSSBOW, ic.MISSILE, 3));
addWeapon(new Weapon("Lochaber Axe", 10, wt.TWO_HANDED, ic.POLEARM, 3));
addWeapon(new Weapon("Long Battle Bow", 10, wt.BOW, ic.MISSILE, 6));
addWeapon(new Weapon("Long Bow", 0, wt.BOW, ic.MISSILE, 5));
addWeapon(new Weapon("Long Staff", 0, wt.TWO_HANDED, ic.STAFF, 3));
addWeapon(new Weapon("Long Sword", -10, wt.ONE_HANDED_SWINGING, ic.SWORD, 4));
addWeapon(new Weapon("Long War Bow", 10, wt.BOW, ic.MISSILE, 6));
addWeapon(new Weapon("Mace", 0, wt.ONE_HANDED_SWINGING, ic.MACE, 2));
addWeapon(new Weapon("Maiden Javelin", -10, wt.ONE_HANDED_THRUSTING, ic.JAVELIN, 0));
addWeapon(new Weapon("Maiden Pike", 10, wt.TWO_HANDED_THRUSTING, ic.SPEAR, 6));
addWeapon(new Weapon("Maiden Spear", 0, wt.TWO_HANDED_THRUSTING, ic.SPEAR, 6));
addWeapon(new Weapon("Mancatcher", -20, wt.TWO_HANDED_THRUSTING, ic.SPEAR, 5));
addWeapon(new Weapon("Martel de Fer", 20, wt.TWO_HANDED, ic.MACE, 6));
addWeapon(new Weapon("Matriarchal Bow", -10, wt.BOW, ic.MISSILE, 5));
addWeapon(new Weapon("Matriarchal Javelin", -10, wt.ONE_HANDED_THRUSTING, ic.JAVELIN, 0));
addWeapon(new Weapon("Matriarchal Pike", 20, wt.TWO_HANDED_THRUSTING, ic.SPEAR, 6));
addWeapon(new Weapon("Matriarchal Spear", 0, wt.TWO_HANDED_THRUSTING, ic.SPEAR, 6));
addWeapon(new Weapon("Maul", 10, wt.TWO_HANDED, ic.MACE, 6));
addWeapon(new Weapon("Mighty Scepter", 0, wt.ONE_HANDED_SWINGING, ic.MACE, 2));
addWeapon(new Weapon("Military Axe", -10, wt.TWO_HANDED, ic.AXE, 4));
addWeapon(new Weapon("Military Pick", -10, wt.ONE_HANDED_SWINGING, ic.AXE, 6));
addWeapon(new Weapon("Mithril Point", 0, wt.ONE_HANDED_THRUSTING, ic.DAGGER, 1));
addWeapon(new Weapon("Morning Star", 10, wt.ONE_HANDED_SWINGING, ic.MACE, 3));
addWeapon(new Weapon("Mythical Sword", 0, wt.ONE_HANDED_SWINGING, ic.SWORD, 3));
addWeapon(new Weapon("Naga", 0, wt.ONE_HANDED_SWINGING, ic.AXE, 6));
addWeapon(new Weapon("Ogre Axe", 0, wt.TWO_HANDED, ic.POLEARM, 3));
addWeapon(new Weapon("Ogre Maul", 10, wt.TWO_HANDED, ic.MACE, 6));
addWeapon(new Weapon("Partizan", 10, wt.TWO_HANDED, ic.POLEARM, 5));
addWeapon(new Weapon("Pellet Bow", -10, wt.CROSSBOW, ic.MISSILE, 3));
addWeapon(new Weapon("Petrified Wand", 10, wt.ONE_HANDED_SWINGING, ic.STAFF, 2));
addWeapon(new Weapon("Phase Blade", -30, wt.ONE_HANDED_SWINGING, ic.SWORD, 6));
addWeapon(new Weapon("Pike", 20, wt.TWO_HANDED_THRUSTING, ic.SPEAR, 6));
addWeapon(new Weapon("Pilum", 0, wt.ONE_HANDED_THRUSTING, ic.JAVELIN, 0));
addWeapon(new Weapon("Poignard", -20, wt.ONE_HANDED_THRUSTING, ic.DAGGER, 1));
addWeapon(new Weapon("Poleaxe", 10, wt.TWO_HANDED, ic.POLEARM, 5));
addWeapon(new Weapon("Polished Wand", 0, wt.ONE_HANDED_SWINGING, ic.STAFF, 2));
addWeapon(new Weapon("Quarterstaff", 0, wt.TWO_HANDED, ic.STAFF, 3));
addWeapon(new Weapon("Quhab", 0, wt.CLAW, ic.CLAW, 3));
addWeapon(new Weapon("Razor Bow", -10, wt.BOW, ic.MISSILE, 4));
addWeapon(new Weapon("Reflex Bow", 10, wt.BOW, ic.MISSILE, 5));
addWeapon(new Weapon("Reinforced Mace", 0, wt.ONE_HANDED_SWINGING, ic.MACE, 2));
addWeapon(new Weapon("Repeating Crossbow", -40, wt.CROSSBOW, ic.MISSILE, 5));
addWeapon(new Weapon("Rondel", 0, wt.ONE_HANDED_THRUSTING, ic.DAGGER, 1));
addWeapon(new Weapon("Rune Bow", 0, wt.BOW, ic.MISSILE, 5));
addWeapon(new Weapon("Rune Scepter", 0, wt.ONE_HANDED_SWINGING, ic.MACE, 2));
addWeapon(new Weapon("Rune Staff", 20, wt.TWO_HANDED, ic.STAFF, 6));
addWeapon(new Weapon("Rune Sword", -10, wt.ONE_HANDED_SWINGING, ic.SWORD, 4));
addWeapon(new Weapon("Runic Talons", -30, wt.CLAW, ic.CLAW, 3));
addWeapon(new Weapon("Sabre", -10, wt.ONE_HANDED_SWINGING, ic.SWORD, 2));
addWeapon(new Weapon("Sacred Globe", -10, wt.ONE_HANDED_SWINGING, ic.ORB, 3));
addWeapon(new Weapon("Scepter", 0, wt.ONE_HANDED_SWINGING, ic.MACE, 2));
addWeapon(new Weapon("Scimitar", -20, wt.ONE_HANDED_SWINGING, ic.SWORD, 2));
addWeapon(new Weapon("Scissors Katar", -10, wt.CLAW, ic.CLAW, 3));
addWeapon(new Weapon("Scissors Quhab", 0, wt.CLAW, ic.CLAW, 3));
addWeapon(new Weapon("Scissors Suwayyah", 0, wt.CLAW, ic.CLAW, 3));
addWeapon(new Weapon("Scourge", -10, wt.ONE_HANDED_SWINGING, ic.MACE, 5));
addWeapon(new Weapon("Scythe", -10, wt.TWO_HANDED, ic.POLEARM, 5));
addWeapon(new Weapon("Seraph Rod", 10, wt.ONE_HANDED_SWINGING, ic.MACE, 3));
addWeapon(new Weapon("Shadow Bow", 0, wt.BOW, ic.MISSILE, 5));
addWeapon(new Weapon("Shamshir", -10, wt.ONE_HANDED_SWINGING, ic.SWORD, 2));
addWeapon(new Weapon("Shillelagh", 0, wt.TWO_HANDED, ic.STAFF, 4));
addWeapon(new Weapon("Short Battle Bow", 0, wt.BOW, ic.MISSILE, 5));
addWeapon(new Weapon("Short Bow", 5, wt.BOW, ic.MISSILE, 3));
addWeapon(new Weapon("Short Siege Bow", 0, wt.BOW, ic.MISSILE, 5));
addWeapon(new Weapon("Short Spear", 10, wt.ONE_HANDED_THRUSTING, ic.JAVELIN, 0));
addWeapon(new Weapon("Short Staff", -10, wt.TWO_HANDED, ic.STAFF, 2));
addWeapon(new Weapon("Short Sword", 0, wt.ONE_HANDED_SWINGING, ic.SWORD, 2));
addWeapon(new Weapon("Short War Bow", 0, wt.BOW, ic.MISSILE, 5));
addWeapon(new Weapon("Siege Crossbow", 0, wt.CROSSBOW, ic.MISSILE, 4));
addWeapon(new Weapon("Silver-edged Axe", 0, wt.TWO_HANDED, ic.AXE, 5));
addWeapon(new Weapon("Simbilan", 10, wt.ONE_HANDED_THRUSTING, ic.JAVELIN, 0));
addWeapon(new Weapon("Small Crescent", 10, wt.ONE_HANDED_SWINGING, ic.AXE, 4));
addWeapon(new Weapon("Smoked Sphere", 0, wt.ONE_HANDED_SWINGING, ic.ORB, 3));
addWeapon(new Weapon("Sparkling Ball", 0, wt.ONE_HANDED_SWINGING, ic.ORB, 3));
addWeapon(new Weapon("Spear", -10, wt.TWO_HANDED_THRUSTING, ic.SPEAR, 3));
addWeapon(new Weapon("Spetum", 0, wt.TWO_HANDED_THRUSTING, ic.SPEAR, 6));
addWeapon(new Weapon("Spiculum", 20, wt.ONE_HANDED_THRUSTING, ic.JAVELIN, 0));
addWeapon(new Weapon("Spider Bow", 5, wt.BOW, ic.MISSILE, 3));
addWeapon(new Weapon("Spiked Club", 0, wt.ONE_HANDED_SWINGING, ic.MACE, 2));
addWeapon(new Weapon("Stag Bow", 0, wt.BOW, ic.MISSILE, 5));
addWeapon(new Weapon("Stalagmite", 10, wt.TWO_HANDED, ic.STAFF, 3));
addWeapon(new Weapon("Stiletto", -10, wt.ONE_HANDED_THRUSTING, ic.DAGGER, 2));
addWeapon(new Weapon("Stygian Pike", 0, wt.TWO_HANDED_THRUSTING, ic.SPEAR, 4));
addWeapon(new Weapon("Stygian Pilum", 0, wt.ONE_HANDED_THRUSTING, ic.JAVELIN, 0));
addWeapon(new Weapon("Suwayyah", 0, wt.CLAW, ic.CLAW, 3));
addWeapon(new Weapon("Swirling Crystal", 10, wt.ONE_HANDED_SWINGING, ic.ORB, 3));
addWeapon(new Weapon("Tabar", 10, wt.TWO_HANDED, ic.AXE, 5));
addWeapon(new Weapon("Thresher", -10, wt.TWO_HANDED, ic.POLEARM, 5));
addWeapon(new Weapon("Throwing Axe", 10, wt.ONE_HANDED_SWINGING, ic.THROWING, 0));
addWeapon(new Weapon("Throwing Knife", 0, wt.ONE_HANDED_THRUSTING, ic.THROWING, 0));
addWeapon(new Weapon("Throwing Spear", -10, wt.ONE_HANDED_THRUSTING, ic.JAVELIN, 0));
addWeapon(new Weapon("Thunder Maul", 20, wt.TWO_HANDED, ic.MACE, 6));
addWeapon(new Weapon("Tomahawk", 0, wt.ONE_HANDED_SWINGING, ic.AXE, 2));
addWeapon(new Weapon("Tomb Wand", -20, wt.ONE_HANDED_SWINGING, ic.STAFF, 2));
addWeapon(new Weapon("Trident", 0, wt.TWO_HANDED_THRUSTING, ic.SPEAR, 4));
addWeapon(new Weapon("Truncheon", -10, wt.ONE_HANDED_SWINGING, ic.MACE, 2));
addWeapon(new Weapon("Tulwar", 20, wt.ONE_HANDED_SWINGING, ic.SWORD, 2));
addWeapon(new Weapon("Tusk Sword", 0, wt.TWO_HANDED_SWORD, ic.SWORD, 4));
addWeapon(new Weapon("Twin Axe", 10, wt.ONE_HANDED_SWINGING, ic.AXE, 5));
addWeapon(new Weapon("Two-Handed Sword", 0, wt.TWO_HANDED_SWORD, ic.SWORD, 3));
addWeapon(new Weapon("Tyrant Club", 0, wt.ONE_HANDED_SWINGING, ic.MACE, 3));
addWeapon(new Weapon("Unearthed Wand", 0, wt.ONE_HANDED_SWINGING, ic.STAFF, 2));
addWeapon(new Weapon("Vortex Orb", 0, wt.ONE_HANDED_SWINGING, ic.ORB, 3));
addWeapon(new Weapon("Voulge", 0, wt.TWO_HANDED, ic.POLEARM, 4));
addWeapon(new Weapon("Walking Stick", -10, wt.TWO_HANDED, ic.STAFF, 2));
addWeapon(new Weapon("Wand", 0, wt.ONE_HANDED_SWINGING, ic.STAFF, 1));
addWeapon(new Weapon("War Axe", 0, wt.ONE_HANDED_SWINGING, ic.AXE, 6));
addWeapon(new Weapon("War Club", 10, wt.TWO_HANDED, ic.MACE, 6));
addWeapon(new Weapon("War Dart", -20, wt.ONE_HANDED_THRUSTING, ic.THROWING, 0));
addWeapon(new Weapon("War Fist", 10, wt.CLAW, ic.CLAW, 2));
addWeapon(new Weapon("War Fork", -20, wt.TWO_HANDED_THRUSTING, ic.SPEAR, 5));
addWeapon(new Weapon("War Hammer", 20, wt.ONE_HANDED_SWINGING, ic.MACE, 4));
addWeapon(new Weapon("War Javelin", -10, wt.ONE_HANDED_THRUSTING, ic.JAVELIN, 0));
addWeapon(new Weapon("War Pike", 20, wt.TWO_HANDED_THRUSTING, ic.SPEAR, 6));
addWeapon(new Weapon("War Scepter", -10, wt.ONE_HANDED_SWINGING, ic.MACE, 5));
addWeapon(new Weapon("War Scythe", -10, wt.TWO_HANDED, ic.POLEARM, 6));
addWeapon(new Weapon("War Spear", -10, wt.TWO_HANDED_THRUSTING, ic.SPEAR, 3));
addWeapon(new Weapon("War Spike", -10, wt.ONE_HANDED_SWINGING, ic.AXE, 6));
addWeapon(new Weapon("War Staff", 20, wt.TWO_HANDED, ic.STAFF, 6));
addWeapon(new Weapon("War Sword", 0, wt.ONE_HANDED_SWINGING, ic.SWORD, 3));
addWeapon(new Weapon("Ward Bow", 0, wt.BOW, ic.MISSILE, 5));
addWeapon(new Weapon("Winged Axe", -10, wt.ONE_HANDED_SWINGING, ic.THROWING, 0));
addWeapon(new Weapon("Winged Harpoon", -10, wt.ONE_HANDED_THRUSTING, ic.JAVELIN, 0));
addWeapon(new Weapon("Winged Knife", -20, wt.ONE_HANDED_THRUSTING, ic.THROWING, 0));
addWeapon(new Weapon("Wrist Blade", 0, wt.CLAW, ic.CLAW, 2));
addWeapon(new Weapon("Wrist Spike", -10, wt.CLAW, ic.CLAW, 2));
addWeapon(new Weapon("Wrist Sword", -10, wt.CLAW, ic.CLAW, 3));
addWeapon(new Weapon("Yari", 0, wt.TWO_HANDED_THRUSTING, ic.SPEAR, 6));
addWeapon(new Weapon("Yew Wand", 10, wt.ONE_HANDED_SWINGING, ic.STAFF, 1));
addWeapon(new Weapon("Zweihander", -10, wt.TWO_HANDED_SWORD, ic.SWORD, 5));

function addWeapon(weapon) { weaponsMap.set(weapon.name, weapon); return weapon; }

export function getWeapon(name) {
	return weaponsMap.get(name);
}

export { container, select, number, checkbox, option, button, skill, other, debug, tv, char, wf, skills, wt, ic, weapons, weaponsMap, LINK_SEPARATOR };

export function setupInputElement(element, eventListener) {
    if (element.type == "button") {
        element.addEventListener("click", eventListener, false);
    } else {
        element.addEventListener("change", eventListener, false);
        if (element.type == "number") {
            element.onkeydown = function (e) { // only allows the input of numbers, no negative signs
                if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8)) {
                    return false;
                }
            }
        }
    }
	return element;
}

export function setupUpdateTableInputElements(eventListener) {
    setupInputElement(number.PRIMARY_WEAPON_IAS, eventListener);
    setupInputElement(number.PRIMARY_WEAPON_IAS, eventListener);
	setupInputElement(number.SECONDARY_WEAPON_IAS, eventListener);
	setupInputElement(number.IAS, eventListener);
	setupInputElement(number.FANATICISM, eventListener);
	setupInputElement(number.BURST_OF_SPEED, eventListener);
	setupInputElement(number.WEREWOLF, eventListener);
	setupInputElement(number.MAUL, eventListener);
	setupInputElement(number.FRENZY, eventListener);
	setupInputElement(number.PURGE, eventListener);
	setupInputElement(number.CLEAVE, eventListener);
	setupInputElement(number.MIRRORED_BLADES, eventListener);
	setupInputElement(number.HOLY_FREEZE, eventListener);
	setupInputElement(number.SLOWED_BY, eventListener);
    
	setupInputElement(checkbox.IS_ONE_HANDED, eventListener);
	setupInputElement(checkbox.MARK_OF_BEAR, eventListener);
	setupInputElement(checkbox.DECREPIFY, eventListener);
	setupInputElement(checkbox.CHILLED, eventListener);
	setupInputElement(checkbox.LETHARGY, eventListener);
}

export function convertIAStoEIAS(IAS) {
	let a = parseInt(120 * IAS / (120 + IAS));
	//console.log("convertIAStoEIAS: ", IAS, "->", a);
	return a;
}

export function convertEIAStoIAS(EIAS) {
	let a = Math.ceil(120 * EIAS / (120 - EIAS));
	//console.log("convertEIAStoIAS: ", EIAS, "->", a);
	return a;
}
