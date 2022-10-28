
const OUTPUT = document.getElementById("output");

const CONTAINER = {
	WEREFORM: document.getElementById("wereformContainer"),
	IS_ONE_HANDED: document.getElementById("isOneHandedContainer"),
	SECONDARY_WEAPON: document.getElementById("secondaryWeaponContainer"),
	BURST_OF_SPEED: document.getElementById("burstOfSpeedContainer"),
	WEREWOLF: document.getElementById("werewolfContainer"),
	MAUL: document.getElementById("maulContainer"),
	FRENZY: document.getElementById("frenzyContainer")
};

const SELECT = {
	CHARACTER: document.getElementById("characterSelect"),
	WEREFORM: document.getElementById("wereformSelect"),
	SKILL: document.getElementById("skillSelect"),
	PRIMARY_WEAPON: document.getElementById("primaryWeaponSelect"),
	SECONDARY_WEAPON: document.getElementById("secondaryWeaponSelect")
};

const NUMBER = {
    PRIMARY_WEAPON_IAS: document.getElementById("primaryWeaponIAS"),
	SECONDARY_WEAPON_IAS: document.getElementById("secondaryWeaponIAS"),
	IAS: document.getElementById("IAS"),
	FANATICISM: document.getElementById("fanaticismLevel"),
	BURST_OF_SPEED: document.getElementById("burstOfSpeedLevel"),
	WEREWOLF: document.getElementById("werewolfLevel"),
	MAUL: document.getElementById("maulLevel"),
	FRENZY: document.getElementById("frenzyLevel"),
	HOLY_FREEZE: document.getElementById("holyFreezeLevel"),
	SLOWED_BY: document.getElementById("slowedByLevel")
};

const CHECKBOX = {
    IS_ONE_HANDED: document.getElementById("isOneHanded"),
	DECREPIFY: document.getElementById("decrepify"),
	CHILLED: document.getElementById("chilled")
};

class Character {

	constructor(name, token, isPlayer) {
		this.name = name;
		this.token = token;
		this.isPlayer = isPlayer;
	}

}

const CHAR_MAP = 
const CHAR = {
    AMAZON: "AM",
    ASSASSIN: "AI",
    BARBARIAN: "BA",
    DRUID: "DZ",
    NECROMANCER: "NE",
    PALADIN: "PA",
    SORCERESS: "SO",
	// mercs
    ROGUE_SCOUT: "RG",
    TOWN_GUARD: "GU",
	IRON_WOLF: "IW",
    BARBARIAN_MERCENARY: "0A",
	// code utility only
	PLAYER: "P",
	ALL: true
};

const MORPH = {
    HUMAN: "H",
    WEREBEAR: "TG",
    WEREWOLF: "40",
	// code utility only
	ALL: true
};

const OPTION = {
	WEREFORM_WEREWOLF: getOption(SELECT.WEREFORM, WF.WEREWOLF)
};

function getOption(select, value) {
	for (let i = 0; i < select.options.length; i++) {
		let option = select.options[i];
		if (option.value == value) return option;
	}
	return 0;
}

const BUTTON = {
    GENERATE_LINK: document.getElementById("generateLink")
};

const OTHER = {

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

class Weapon {

	constructor(name, WSM, type, itemClass, maxSockets) {
		this.name = name;
		this.WSM = WSM;
		this.type = type;
		this.itemClass = itemClass;
		this.maxSockets = maxSockets;
	}

	canBeThrown() {
		return this.itemClass == "THROWING" || this.itemClass == "JAVELIN";
	}

}

class AttackSpeedSkill {

	constructor(input, min, factor, max, predicate) {
		this.input = input;
		this.min = min;
		this.factor = factor;
		this.max = max;
		this.predicate = predicate;
		this.reverse = new Map();
		for (let level = 60; level >= 0; level--) {
			this.reverse.set(this.getEIASFromLevel(level), level);
		}
	}

	calculate(character, wereform) {
		if (this.predicate != null && !this.predicate(character, wereform)) return 0;
		let level = parseInt(this.input.value);
		if (this.min == -1) return level == 0 ? 0 : this.factor * (parseInt(level / 2) + 3); 
		return level == 0 ? 0 : Math.min(this.min + parseInt(this.factor * parseInt((110 * level) / (level + 6)) / 100), this.max);
	}

	getEIASFromLevel(level) {
		if (this.min == -1) return level == 0 ? 0 : this.factor * (parseInt(level / 2) + 3); // hardcoded specifically for maul
		if (level == 0) return 0;
		return Math.min(this.min + parseInt(this.factor * parseInt((110 * level) / (level + 6)) / 100), this.max);
	}

	getLevelFromEIAS(EIAS) { // this probably doesn't work for holy freeze, but the interface never uses this with holy freeze
		let lastLevel = 60;
		for (const [levelEIAS, level] of this.reverse) {
			if (EIAS > levelEIAS) return lastLevel;
			lastLevel = level;
		}
		return 0;
	}

}

const AS_SKILL = {
    FANATICISM: new AttackSpeedSkill(NUMBER.FANATICISM, 10, 30, 40),
	BURST_OF_SPEED: new AttackSpeedSkill(NUMBER.BURST_OF_SPEED, 15, 45, 60, (character, _wereform) => character == CHAR.ASSASSIN),
	WEREWOLF: new AttackSpeedSkill(NUMBER.WEREWOLF, 10, 70, 80, (_character, wereform) => wereform == WF.WEREWOLF),
	MAUL: new AttackSpeedSkill(NUMBER.MAUL, -1, 3, 99, (_character, wereform) => wereform == WF.WEREBEAR),
	FRENZY: new AttackSpeedSkill(NUMBER.FRENZY, 0, 50, 50, (character, _wereform) => character == CHAR.BARBARIAN || character == CHAR.BARBARIAN_MERCENARY),
	HOLY_FREEZE: new AttackSpeedSkill(NUMBER.HOLY_FREEZE, 25, 35, 50) // -50 cap cuz chill effectiveness
};

const ANIM_DATA = {
	// [model code]{2}[animation mode]{2}[weapon class]{3}: [framesPerDirection, action frame, starting frame, animation speed]
	// 0A - Act 5 Mercenary - originally calculating with only 16 FPD, which one is correct?
	// A1 - normal attack animation 1
	"0AA11HS": [17, 6, 0, 256],
	"0AA12HS": [16, 5, 0, 256],
	// A2 - normal attack animation 2
	"0AA21HS": [17, 9, 0, 256],
	"0AA22HS": [16, 6, 0, 256],
	// 40 - Werewolf
	// A1 - normal attack animation 1
	"40A1HTH": [13, 7, 0, 256],
	// A2 - normal attack animation 2
	"40A2HTH": [13, 7, 0, 256],
	// S3 - bite animation
	"40S3HTH": [10, 6, 0, 240],
	// AI - Assassin
	// A1 - normal attack animation 1
	AIA11HS: [15, 7, 0, 256],		// one handed swinging
	AIA11HT: [15, 7, 0, 256],		// one handed thrusting
	AIA12HS: [23, 11, 0, 256],		// two handed swords
	AIA12HT: [23, 10, 0, 256],		// two handed thrusting
	AIA1BOW: [16, 7, 0, 256],		// bows
	AIA1HT1: [11, 6, 0, 208],		// one claw
	AIA1HT2: [11, 6, 0, 208],		// two claws
	AIA1HTH: [11, 6, 0, 256],		// unarmed
	AIA1STF: [19, 9, 0, 256],		// two handed weapons (but not swords)
	AIA1XBW: [21, 10, 0, 256],		// crossbows
	// A2 - normal attack animation 2 (different for HTH, HT1, and HT2)
	AIA21HS: [15, 7, 0, 256],		// one handed swinging
	AIA21HT: [15, 7, 0, 256],		// one handed thrusting
	AIA22HS: [23, 11, 0, 256],		// two handed swords
	AIA22HT: [23, 10, 0, 256],		// two handed thrusting
	AIA2HT1: [12, 6, 0, 227],		// one claw: 208->227 in 2.5
	AIA2HT2: [12, 6, 0, 227],		// two claws: 208->227 in 2.5
	AIA2HTH: [12, 6, 0, 256],		// unarmed
	AIA2STF: [19, 9, 0, 256],		// two handed weapons (but not swords)
	// KK - kicking animation
	AIKK1HS: [13, 4, 0, 256],		// one handed swinging
	AIKK1HT: [13, 4, 0, 256],		// one handed thrusting
	AIKK2HS: [13, 4, 0, 256],		// two handed swords
	AIKK2HT: [13, 4, 0, 256],		// two handed thrusting
	AIKKBOW: [13, 4, 0, 256],		// bows
	AIKKHT1: [13, 4, 0, 208],		// one claw
	AIKKHT2: [13, 4, 0, 208],		// two claws
	AIKKHTH: [13, 4, 0, 256],		// unarmed
	AIKKSTF: [13, 4, 0, 256],		// two handed weapons (but not swords)
	AIKKXBW: [13, 4, 0, 256],		// crossbows
	// S2 - trap laying animation
	AIS21HS: [8, 4, 0, 128],
	AIS21HT: [8, 4, 0, 128],
	AIS22HS: [8, 4, 0, 128],
	AIS22HT: [8, 4, 0, 128],
	AIS2BOW: [8, 4, 0, 128],
	AIS2HT1: [8, 4, 0, 128],
	AIS2HT2: [8, 4, 0, 128],
	AIS2HTH: [8, 4, 0, 128],
	AIS2STF: [8, 4, 0, 128],
	AIS2XBW: [8, 4, 0, 128],
	// S4 - second weapon melee animation while dual wielding for Assassin
	AIS4HT2: [12, 6, 0, 227],		// two claws: 208->227 in 2.5
	// TH - throwing animation
	AITH1HS: [16, 7, 0, 256],		// one handed swinging
	AITH1HT: [16, 7, 0, 256],		// one handed thrusting
	// AM - Amazon
	// A1 - normal attack animation 1
	AMA11HS: [16, 10, 2, 256],		// one handed swinging
	AMA11HT: [15, 9, 2, 256],		// one handed thrusting
	AMA12HS: [20, 12, 2, 256],		// two handed swords
	AMA12HT: [18, 11, 2, 256],		// two handed thrusting
	AMA1BOW: [14, 6, 0, 256],		// bows
	AMA1HTH: [13, 8, 1, 256],		// unarmed
	AMA1STF: [20, 12, 2, 256],		// two handed weapons (but not swords)
	AMA1XBW: [20, 9, 0, 256],		// crossbows
	// A2 - normal attack animation 2 (identical to A1)
	AMA21HS: [16, 10, 2, 256],		// one handed swinging
	AMA21HT: [15, 9, 2, 256],		// one handed thrusting
	AMA22HS: [20, 12, 2, 256],		// two handed swords
	AMA22HT: [18, 11, 2, 256],		// two handed thrusting
	AMA2STF: [20, 12, 2, 256],		// two handed weapons (but not swords)
	// KK - kicking animation
	AMKK1HS: [12, 5, 0, 256],		// one handed swinging
	AMKK1HT: [12, 5, 0, 256],		// one handed thrusting
	AMKK2HS: [12, 5, 0, 256],		// two handed swords
	AMKK2HT: [12, 5, 0, 256],		// two handed thrusting
	AMKKBOW: [12, 5, 0, 256],		// bows
	AMKKHTH: [12, 5, 0, 256],		// unarmed
	AMKKSTF: [12, 5, 0, 256],		// two handed weapons (but not swords)
	AMKKXBW: [12, 5, 0, 256],		// crossbows
	// S1 - dodge animation (action frame omitted because not relevant and not all animations had an action frame)
	AMS11HS: [9, 0, 0, 256],		// one handed swinging
	AMS11HT: [9, 0, 0, 256],		// one handed thrusting
	AMS12HS: [9, 0, 0, 256],		// two handed swords
	AMS12HT: [9, 0, 0, 256],		// two handed thrusting
	AMS1BOW: [9, 0, 0, 256],		// bows
	AMS1HTH: [9, 0, 0, 256],		// unarmed
	AMS1STF: [9, 0, 0, 256],		// two handed weapons (but not swords)
	AMS1XBW: [9, 0, 0, 256],		// crossbows
	// TH - throwing animation
	AMTH1HS: [16, 9, 0, 256],		// one handed swinging
	AMTH1HT: [16, 9, 0, 256],		// one handed thrusting
	//AMTHHTH: [16, 9, 0, 256],		// ?
	// BA - Barbarian
	// A1 - normal attack animation 1
	BAA11HS: [16, 7, 0, 256],		// one handed swinging
	BAA11HT: [16, 7, 0, 256],		// one handed thrusting
	BAA11JS: [16, 7, 0, 256], 		// glove-side hand thrusting, boot-side hand swinging
	BAA11JT: [16, 7, 0, 256],		// two thrusting weapons
	BAA11SS: [16, 7, 0, 256], 		// two swinging weapons
	BAA11ST: [16, 7, 0, 256], 		// glove-side hand swinging, boot-side hand thrusting
	BAA12HS: [18, 8, 0, 256],		// two handed swords
	BAA12HT: [19, 9, 0, 256],		// two handed thrusting
	BAA1BOW: [15, 7, 0, 256],		// bows
	BAA1HTH: [12, 6, 0, 256],		// unarmed
	BAA1STF: [19, 9, 0, 256],		// two handed weapons (but not swords)
	BAA1XBW: [20, 10, 0, 256],		// crossbows
	// A2 - normal attack animation 2 (identical)
	BAA11HS: [16, 7, 0, 256],		// one handed swinging
	BAA11HT: [16, 7, 0, 256],		// one handed thrusting
	BAA11JS: [16, 7, 0, 256], 		// glove-side hand thrusting, boot-side hand swinging
	BAA11JT: [16, 7, 0, 256],		// two thrusting weapons
	BAA11SS: [16, 7, 0, 256], 		// two swinging weapons
	BAA11ST: [16, 7, 0, 256], 		// glove-side hand swinging, boot-side hand thrusting
	BAA12HS: [18, 8, 0, 256],		// two handed swords
	BAA12HT: [19, 9, 0, 256],		// two handed thrusting
	BAA1HTH: [12, 6, 0, 256],		// unarmed
	BAA1STF: [19, 9, 0, 256],		// two handed weapons (but not swords)
	// KK - kicking animation
	BAKK1HS: [12, 4, 0, 256],		// one handed swinging
	BAKK1HT: [12, 4, 0, 256],		// one handed thrusting
	BAKK1JS: [12, 4, 0, 256], 		// glove-side hand thrusting, boot-side hand swinging
	BAKK1JT: [12, 4, 0, 256],		// two thrusting weapons
	BAKK1SS: [12, 4, 0, 256], 		// two swinging weapons
	BAKK1ST: [12, 4, 0, 256], 		// glove-side hand swinging, boot-side hand thrusting
	BAKK2HS: [12, 4, 0, 256],		// two handed swords
	BAKK2HT: [12, 4, 0, 256],		// two handed thrusting
	BAKKBOW: [12, 4, 0, 256],		// bows
	BAKKHTH: [12, 4, 0, 256],		// unarmed
	BAKKSTF: [12, 4, 0, 256],		// two handed weapons (but not swords)
	BAKKXBW: [12, 4, 0, 256],		// crossbows
	// S3 - second weapon melee animation while dual wielding for Barbarian
	BAS31JS: [12, 8, 0, 256],		// glove-side hand thrusting, boot-side hand swinging
	BAS31JT: [12, 8, 0, 256],		// two thrusting weapons
	BAS31SS: [12, 7, 0, 256], 		// two swinging weapons
	BAS31ST: [12, 7, 0, 256], 		// glove-side hand swinging, boot-side hand thrusting
	// S4 - second weapon throw animation while dual wielding for Barbarian
	BAS41JS: [16, 8, 0, 256],		// glove-side hand thrusting, boot-side hand swinging
	BAS41JT: [16, 8, 0, 256],		// two thrusting weapons
	BAS41SS: [16, 9, 0, 256], 		// two swinging weapons
	BAS41ST: [16, 9, 0, 256], 		// glove-side hand swinging, boot-side hand thrusting
	// TH - throwing animation
	BATH1HS: [16, 8, 0, 256],		// one handed swinging
	BATH1HT: [16, 8, 0, 256],		// one handed thrusting
	BATH1JS: [16, 8, 0, 256],		// glove-side hand thrusting, boot-side hand swinging
	BATH1JT: [16, 8, 0, 256],		// two thrusting weapons
	BATH1SS: [16, 8, 0, 256],		// two swinging weapons
	BATH1ST: [16, 8, 0, 256],		// glove-side hand swinging, boot-side hand thrusting
	//BATHHTH: [16, 8, 0, 256],		// ?
	// DZ - Druid
	// A1 - normal attack animation 1
	DZA11HS: [19, 9, 0, 256],		// one handed swinging
	DZA11HT: [19, 8, 0, 256],		// one handed thrusting
	DZA12HS: [21, 10, 0, 256],		// two handed swords
	DZA12HT: [23, 9, 0, 256],		// two handed thrusting
	DZA1BOW: [16, 8, 0, 256],		// bows
	DZA1HTH: [16, 8, 0, 256],		// unarmed
	DZA1STF: [17, 9, 0, 256],		// two handed weapons (but not swords)
	DZA1XBW: [20, 10, 0, 256],		// crossbows
	// A2 - normal attack animation 2 (identical to A1)
	DZA21HS: [19, 9, 0, 256],		// one handed swinging
	DZA21HT: [19, 8, 0, 256],		// one handed thrusting
	DZA22HS: [21, 10, 0, 256],		// two handed swords
	DZA22HT: [23, 9, 0, 256],		// two handed thrusting
	DZA2STF: [17, 9, 0, 256],		// two handed weapons (but not swords)
	// KK - kicking animation
	DZKK1HS: [12, 5, 0, 224],		// one handed swinging
	DZKK1HT: [12, 5, 0, 256],		// one handed thrusting
	DZKK2HS: [12, 5, 0, 224],		// two handed swords
	DZKK2HT: [12, 5, 0, 256],		// two handed thrusting
	DZKKBOW: [12, 5, 0, 256],		// bows
	DZKKHTH: [12, 5, 0, 256],		// unarmed
	DZKKSTF: [12, 5, 0, 256],		// two handed weapons (but not swords)
	DZKKXBW: [12, 5, 0, 256],		// crossbows
	// TH - throwing animation
	DZTH1HS: [18, 8, 0, 256],		// one handed swinging
	DZTH1HT: [18, 8, 0, 256],		// one handed thrusting
	//DZTHHTH: [18, 9, 0, 256],		// ?
	// GU - Act 2 Mercenary
	// A1 - normal attack animation 1
	GUA1HTH: [16, 11, 0, 256],
	// IW - Act 3 Mercenary
	// A1 - normal attack animation 1
	IWA11HS: [15, 6, 0, 256],
	// NE - Necromancer
	// A1 - normal attack animation 1
	NEA11HS: [19, 9, 0, 256],		// one handed swinging
	NEA11HT: [19, 9, 0, 256],		// one handed thrusting
	NEA12HS: [23, 11, 0, 256],		// two handed swords
	NEA12HT: [24, 10, 0, 256],		// two handed thrusting
	NEA1BOW: [18, 9, 0, 256],		// bows
	NEA1HTH: [15, 8, 0, 256],		// unarmed
	NEA1STF: [20, 11, 0, 256],		// two handed weapons (but not swords)
	NEA1XBW: [20, 11, 0, 256],		// crossbows
	// A2 - normal attack animation 2 (identical to A1)
	NEA21HS: [19, 9, 0, 256],		// one handed swinging
	NEA21HT: [19, 9, 0, 256],		// one handed thrusting
	NEA22HS: [23, 11, 0, 256],		// two handed swords
	NEA22HT: [24, 10, 0, 256],		// two handed thrusting
	NEA2HTH: [15, 8, 0, 256],		// unarmed
	NEA2STF: [20, 11, 0, 256],		// two handed weapons (but not swords)
	// KK - kicking animation
	NEKK1HS: [12, 6, 0, 256],		// one handed swinging
	NEKK1HT: [12, 6, 0, 256],		// one handed thrusting
	NEKK2HS: [12, 6, 0, 256],		// two handed swords
	NEKK2HT: [12, 6, 0, 256],		// two handed thrusting
	NEKKBOW: [12, 6, 0, 256],		// bows
	NEKKHTH: [12, 6, 0, 256],		// unarmed
	NEKKSTF: [12, 6, 0, 256],		// two handed weapons (but not swords)
	NEKKXBW: [12, 6, 0, 256],		// crossbows
	// TH - throwing animation
	NETH1HS: [20, 10, 0, 256],		// one handed swinging
	NETH1HT: [20, 10, 0, 256],		// one handed thrusting
	//NETHHTH: [20, 10, 0, 256],		// ?
	// PA - Paladin
	// A1 - normal attack animation 1
	PAA11HS: [15, 7, 0, 256],		// one handed swinging
	PAA11HT: [17, 8, 0, 256],		// one handed thrusting
	PAA12HS: [18, 8, 0, 256],		// two handed swords
	PAA12HT: [20, 8, 0, 256],		// two handed thrusting
	PAA1BOW: [16, 8, 0, 256],		// bows
	PAA1HTH: [14, 7, 0, 256],		// unarmed
	PAA1STF: [18, 9, 0, 256],		// two handed weapons (but not swords)
	PAA1XBW: [20, 10, 0, 256],		// crossbows
	// A2 - normal attack animation 2 (2HS is different)
	PAA21HS: [15, 7, 0, 256],		// one handed swinging
	PAA21HT: [17, 8, 0, 256],		// one handed thrusting
	PAA22HS: [19, 8, 0, 256],		// two handed swords
	PAA22HT: [20, 8, 0, 256],		// two handed thrusting
	PAA2HTH: [14, 7, 0, 256],		// unarmed
	PAA2STF: [18, 9, 0, 256],		// two handed weapons (but not swords)
	// KK - kicking animation
	PAKK1HS: [12, 5, 0, 256],		// one handed swinging
	PAKK1HT: [12, 5, 0, 256],		// one handed thrusting
	PAKK2HS: [12, 5, 0, 256],		// two handed swords
	PAKK2HT: [12, 5, 0, 256],		// two handed thrusting
	PAKKBOW: [12, 5, 0, 256],		// bows
	PAKKHTH: [12, 5, 0, 256],		// unarmed
	PAKKSTF: [12, 5, 0, 256],		// two handed weapons (but not swords)
	PAKKXBW: [12, 5, 0, 256],		// crossbows
	// S1 - smite
	PAS11HS: [12, 7, 0, 256],		// one handed swinging
	PAS11HT: [12, 7, 0, 256],		// one handed thrusting
	PAS1HTH: [12, 7, 0, 256],		// unarmed
	// TH - throwing animation
	PATH1HS: [16, 8, 0, 256],		// one handed swinging
	PATH1HT: [16, 8, 0, 256],		// one handed thrusting
	//PATHHTH: [12, 6, 0, 256],		// ?
	// RG - Act 1 Mercenary
	// A1 - normal attack animation 1
	RGA1HTH: [15, 6, 0, 256],
	// SO - Sorceress
	// A1 - normal attack animation 1
	SOA11HS: [20, 12, 2, 256],		// one handed swinging
	SOA11HT: [19, 11, 2, 256],		// one handed thrusting
	SOA12HS: [24, 14, 2, 256],		// two handed swords
	SOA12HT: [23, 13, 2, 256],		// two handed thrusting
	SOA1BOW: [17, 9, 0, 256],		// bows
	SOA1HTH: [16, 9, 1, 256],		// unarmed
	SOA1STF: [18, 11, 2, 256],		// two handed weapons (but not swords)
	SOA1XBW: [20, 11, 0, 256],		// crossbows
	// A2 - normal attack animation 2 (identical to A1)
	AMA21HS: [16, 10, 2, 256],		// one handed swinging
	AMA21HT: [15, 9, 2, 256],		// one handed thrusting
	AMA22HS: [20, 12, 2, 256],		// two handed swords
	AMA22HT: [18, 11, 2, 256],		// two handed thrusting
	AMA2STF: [20, 12, 2, 256],		// two handed weapons (but not swords)
	// KK - kicking animation
	SOKK1HS: [12, 5, 0, 256],		// one handed swinging
	SOKK1HT: [12, 5, 0, 256],		// one handed thrusting
	SOKK2HS: [12, 5, 0, 256],		// two handed swords
	SOKK2HT: [12, 5, 0, 256],		// two handed thrusting
	SOKKBOW: [12, 5, 0, 256],		// bows
	SOKKHTH: [12, 5, 0, 256],		// unarmed
	SOKKSTF: [12, 5, 0, 256],		// two handed weapons (but not swords)
	SOKKXBW: [12, 5, 0, 256],		// crossbows
	// TH - throwing animation
	SOTH1HS: [16, 9, 0, 256],		// one handed swinging
	SOTH1HT: [16, 9, 0, 256],		// one handed thrusting
	//AMTHHTH: [16, 9, 0, 256],		// ?
	// TG - Werebear
	// A1 - normal attack animation 1
	TGA1HTH: [12, 7, 0, 224],
	// A2 - normal attack animation 2 (identical to A1)
	TGA2HTH: [12, 7, 0, 224],
	// S3 - bite animation
	TGS3HTH: [10, 6, 0, 208]
};

class Skill {

	constructor(name, usedByChar, usedByMorph, animationMode) {
		this.name = name;
		this.usedByChar = usedByChar;
		this.usedByMorph = usedByMorph;
		this.animationMode = animationMode;
	}

	canBeUsedBy(char, morph) {
		if (this.usedByChar === true && this.usedByMorph === true) return true;
		if (Array.isArray(this.usedByMorph)) {
			let found = false;
			this.usedByMorph.forEach(element => {
				if (element === morph) found = true;
			});
			if (!found) return false;
		}
		if (this.usedByMorph !== morph) return false;
		if (this.usedByChar === char) return true;
		if (this.usedByChar === MORPH.PLAYER && char.isPlayer) return true;
		if (Array.isArray(this.usedByChar)) {
			this.usedByChar.forEach(element => {
				if (char === element) return true;
			});
		}
		return false;
	}

}

class SequenceSkill extends Skill {

	constructor(name, usedByChar, usedByMorph, frameDatas) {
		super(name, usedByChar, usedByMorph, "SQ");
		this.frameDatas = frameDatas;
	}

}

class RollbackSkill extends Skill {

	constructor(name, usedByChar, usedByMorph, animationMode, hits) {
		super(name, usedByChar, usedByMorph, animationMode);
		this.hits = hits;
	}

}

const SKILLS_MAP = new Map();
const SKILLS = {
	NORMAL: addSkill(new Skill("Normal", CHAR.ALL, MORPH.ALL, ["A1", "A2"])),
	THROW: addSkill(new Skill("Throw", CHAR.PLAYER, MORPH.HUMAN, "TH")),
	KICK: addSkill(new Skill("Kick", CHAR.PLAYER, MORPH.HUMAN, "KK")),

	DODGE: addSkill(new Skill("Dodge", CHAR.AMAZON, MORPH.ALL, "S1")),
	IMPALE: addSkill(new SequenceSkill("Impale", CHAR.AMAZON, MORPH.HUMAN,
	{ 
		"1HT": [21, 13, 0, 256],
		"2HT": [24, 15, 0, 256]
	})),
	JAB: addSkill(new SequenceSkill("Jab", [CHAR.AMAZON, CHAR.TOWN_GUARD], MORPH.HUMAN,
	{
		"1HT": [18, [3, 9, 15], 0, 256],
		"2HT": [21, [3, 10, 17], 0, 256]
	})),
	STRAFE: addSkill(new RollbackSkill("Strafe", CHAR.AMAZON, MORPH.HUMAN, "A1", 10)),
	FEND: addSkill(new RollbackSkill("Fend", CHAR.AMAZON, MORPH.HUMAN, "A1", 12)),

	TIGER_STRIKE: addSkill(new Skill("Tiger Strike", CHAR.ASSASSIN, MORPH.HUMAN, "A1")),
	COBRA_STRIKE: addSkill(new Skill("Cobra Strike", CHAR.ASSASSIN, MORPH.HUMAN, "A1")),
	PHOENIX_STRIKE: addSkill(new Skill("Phoenix Strike", CHAR.ASSASSIN, MORPH.HUMAN, "A1")),
	FISTS_OF_FIRE: addSkill(new SequenceSkill("Fists of Fire", CHAR.ASSASSIN, MORPH.HUMAN,
	{
		HT1: [12, 6, 0, 256],
		HT2: [16, [6, 10], 0, 256]
	})),
	CLAWS_OF_THUNDER: addSkill(new SequenceSkill("Claws of Thunder", CHAR.ASSASSIN, MORPH.HUMAN,
	{
		HT1: [12, 6, 0, 256],
		HT2: [16, [6, 10], 0, 256]
	})),
	BLADES_OF_ICE: addSkill(new SequenceSkill("Blades of Ice", CHAR.ASSASSIN, MORPH.HUMAN,
	{
		HT1: [12, 6, 0, 256],
		HT2: [16, [6, 10], 0, 256]
	})),
	DRAGON_CLAW: addSkill(new SequenceSkill("Dragon Claw", CHAR.ASSASSIN, MORPH.HUMAN,
	{
		HT1: [12, 6, 0, 256],
		HT2: [16, [6, 10], 0, 256]
	})),
	DRAGON_TAIL: addSkill(new Skill("Dragon Tail", CHAR.ASSASSIN, MORPH.HUMAN, "KK")),
	DRAGON_TALON: addSkill(new RollbackSkill("Dragon Talon", CHAR.ASSASSIN, MORPH.HUMAN, "KK", 5)),
	LAYING_TRAPS: addSkill(new Skill("Laying Traps", CHAR.ASSASSIN, MORPH.HUMAN, "S2")),

	DOUBLE_SWING: addSkill(new SequenceSkill("Double Swing", CHAR.BARBARIAN, MORPH.HUMAN, [17, [4, 9], 0, 256])),
	FRENZY: addSkill(new SequenceSkill("Frenzy", [CHAR.BARBARIAN, CHAR.BARBARIAN_MERCENARY], MORPH.HUMAN, [17, [4, 9], 0, 256])),
	// TODO taunt for a5 merc
	DOUBLE_THROW: addSkill(new SequenceSkill("Double Throw", CHAR.BARBARIAN, MORPH.HUMAN, [12, [5, 9], 0, 256])),
	WHIRLWIND: addSkill(new Skill("Whirlwind", [CHAR.BARBARIAN, CHAR.ASSASSIN], MORPH.HUMAN, "A1")), // TODO
	CONCENTRATE: addSkill(new Skill("Concentrate", CHAR.BARBARIAN, MORPH.HUMAN, "A1")),
	BERSERK: addSkill(new Skill("Berserk", CHAR.BARBARIAN, MORPH.HUMAN, "A1")),
	BASH: addSkill(new Skill("Bash", [CHAR.BARBARIAN, CHAR.BARBARIAN_MERCENARY], MORPH.HUMAN, "A1")),
	STUN: addSkill(new Skill("Stun", CHAR.BARBARIAN, MORPH.HUMAN, "A1")),

	FERAL_RAGE: addSkill(new Skill("Feral Rage", [CHAR.DRUID, CHAR.BARBARIAN], MORPH.WEREWOLF, "A1")),
	HUNGER: addSkill(new Skill("Hunger", CHAR.DRUID, [MORPH.WEREBEAR, MORPH.WEREWOLF], "S3")),
	RABIES: addSkill(new Skill("Rabies", CHAR.DRUID, MORPH.WEREWOLF, "S3")),
	FURY: addSkill(new RollbackSkill("Fury", CHAR.DRUID, MORPH.WEREWOLF, "A1", 5)),

	ZEAL: addSkill(new RollbackSkill("Zeal", CHAR.ALL, MORPH.HUMAN, "A1", 5)),
	SMITE: addSkill(new Skill("Smite", CHAR.PALADIN, MORPH.HUMAN, "S1")),
	SACRIFICE: addSkill(new Skill("Sacrifice", CHAR.PALADIN, MORPH.HUMAN, "A1")),
	VENGEANCE: addSkill(new Skill("Vengeance", CHAR.PALADIN, MORPH.HUMAN, "A1")),
	CONVERSION: addSkill(new Skill("Conversion", CHAR.PALADIN, MORPH.HUMAN, "A1"))
};
function addSkill(skill) { SKILLS_MAP.set(skill.name, skill); return skill; }
export function getSkill(name) { return SKILLS_MAP.get(name); }

const WEAPONS = new Map([
	["None", new Weapon("None", 0, "HTH", "NONE", 0)],
	["Ancient Axe", new Weapon("Ancient Axe", 10, "STF", "AXE", 6)],
	["Ancient Sword", new Weapon("Ancient Sword", 0, "1HS", "SWORD", 3)],
	["Arbalest", new Weapon("Arbalest", -10, "XBW", "MISSILE", 3)],
	["Archon Staff", new Weapon("Archon Staff", 10, "STF", "STAFF", 6)],
	["Ashwood Bow", new Weapon("Ashwood Bow", 0, "BOW", "MISSILE", 5)],
	["Ataghan", new Weapon("Ataghan", -20, "1HS", "SWORD", 2)],
	["Axe", new Weapon("Axe", 10, "1HS", "AXE", 4)],
	["Balanced Axe", new Weapon("Balanced Axe", -10, "1HS", "THROWING", 0)],
	["Balanced Knife", new Weapon("Balanced Knife", -20, "1HT", "THROWING", 0)],
	["Ballista", new Weapon("Ballista", 10, "XBW", "MISSILE", 6)],
	["Balrog Blade", new Weapon("Balrog Blade", 0, "2HS", "SWORD", 4)],
	["Balrog Spear", new Weapon("Balrog Spear", 10, "1HT", "JAVELIN", 0)],
	["Barbed Club", new Weapon("Barbed Club", 0, "1HS", "MACE", 3)],
	["Bardiche", new Weapon("Bardiche", 10, "STF", "POLEARM", 3)],
	["Bastard Sword", new Weapon("Bastard Sword", 10, "2HS", "SWORD", 4)],
	["Battle Axe", new Weapon("Battle Axe", 10, "STF", "AXE", 5)],
	["Battle Cestus", new Weapon("Battle Cestus", -10, "HT1", "CLAW", 2)],
	["Battle Dart", new Weapon("Battle Dart", 0, "1HT", "THROWING", 0)],
	["Battle Hammer", new Weapon("Battle Hammer", 20, "1HS", "MACE", 4)],
	["Battle Scythe", new Weapon("Battle Scythe", -10, "STF", "POLEARM", 5)],
	["Battle Staff", new Weapon("Battle Staff", 0, "STF", "STAFF", 4)],
	["Battle Sword", new Weapon("Battle Sword", 0, "1HS", "SWORD", 4)],
	["Bearded Axe", new Weapon("Bearded Axe", 0, "STF", "AXE", 5)],
	["Bec-de-Corbin", new Weapon("Bec-de-Corbin", 0, "STF", "POLEARM", 6)],
	["Berserker Axe", new Weapon("Berserker Axe", 0, "1HS", "AXE", 6)],
	["Bill", new Weapon("Bill", 0, "STF", "POLEARM", 4)],
	["Blade Bow", new Weapon("Blade Bow", -10, "BOW", "MISSILE", 4)],
	["Blade Talons", new Weapon("Blade Talons", -20, "HT1", "CLAW", 3)],
	["Blade", new Weapon("Blade", -10, "1HT", "DAGGER", 2)],
	["Bone Knife", new Weapon("Bone Knife", -20, "1HT", "DAGGER", 1)],
	["Bone Wand", new Weapon("Bone Wand", -20, "1HS", "STAFF", 2)],
	["Brandistock", new Weapon("Brandistock", -20, "2HT", "SPEAR", 5)],
	["Broad Axe", new Weapon("Broad Axe", 0, "STF", "AXE", 5)],
	["Broad Sword", new Weapon("Broad Sword", 0, "1HS", "SWORD", 4)],
	["Burnt Wand", new Weapon("Burnt Wand", 0, "1HS", "STAFF", 1)],
	["Caduceus", new Weapon("Caduceus", -10, "1HS", "MACE", 5)],
	["Cedar Bow", new Weapon("Cedar Bow", 0, "BOW", "MISSILE", 5)],
	["Cedar Staff", new Weapon("Cedar Staff", 10, "STF", "STAFF", 4)],
	["Ceremonial Bow", new Weapon("Ceremonial Bow", 10, "BOW", "MISSILE", 5)],
	["Ceremonial Javelin", new Weapon("Ceremonial Javelin", -10, "1HT", "JAVELIN", 0)],
	["Ceremonial Pike", new Weapon("Ceremonial Pike", 20, "2HT", "SPEAR", 6)],
	["Ceremonial Spear", new Weapon("Ceremonial Spear", 0, "2HT", "SPEAR", 6)],
	["Cestus", new Weapon("Cestus", 0, "HT1", "CLAW", 2)],
	["Champion Axe", new Weapon("Champion Axe", -10, "STF", "AXE", 6)],
	["Champion Sword", new Weapon("Champion Sword", -10, "2HS", "SWORD", 4)],
	["Chu-Ko-Nu", new Weapon("Chu-Ko-Nu", -60, "XBW", "MISSILE", 5)],
	["Cinquedeas", new Weapon("Cinquedeas", -20, "1HT", "DAGGER", 3)],
	["Clasped Orb", new Weapon("Clasped Orb", 0, "1HS", "ORB", 3)],
	["Claws", new Weapon("Claws", -10, "HT1", "CLAW", 3)],
	["Claymore", new Weapon("Claymore", 10, "2HS", "SWORD", 4)],
	["Cleaver", new Weapon("Cleaver", 10, "1HS", "AXE", 4)],
	["Cloudy Sphere", new Weapon("Cloudy Sphere", 0, "1HS", "ORB", 3)],
	["Club", new Weapon("Club", -10, "1HS", "MACE", 2)],
	["Colossus Blade", new Weapon("Colossus Blade", 5, "2HS", "SWORD", 6)],
	["Colossus Crossbow", new Weapon("Colossus Crossbow", 10, "XBW", "MISSILE", 6)],
	["Colossus Sword", new Weapon("Colossus Sword", 10, "2HS", "SWORD", 5)],
	["Colossus Voulge", new Weapon("Colossus Voulge", 10, "STF", "POLEARM", 4)],
	["Composite Bow", new Weapon("Composite Bow", -10, "BOW", "MISSILE", 4)],
	["Conquest Sword", new Weapon("Conquest Sword", 0, "1HS", "SWORD", 4)],
	["Crossbow", new Weapon("Crossbow", 0, "XBW", "MISSILE", 4)],
	["Crowbill", new Weapon("Crowbill", -10, "1HS", "AXE", 6)],
	["Crusader Bow", new Weapon("Crusader Bow", 10, "BOW", "MISSILE", 6)],
	["Cryptic Axe", new Weapon("Cryptic Axe", 10, "STF", "POLEARM", 5)],
	["Cryptic Sword", new Weapon("Cryptic Sword", -10, "1HS", "SWORD", 4)],
	["Crystal Sword", new Weapon("Crystal Sword", 0, "1HS", "SWORD", 6)],
	["Crystalline Globe", new Weapon("Crystalline Globe", -10, "1HS", "ORB", 3)],
	["Cudgel", new Weapon("Cudgel", -10, "1HS", "MACE", 2)],
	["Cutlass", new Weapon("Cutlass", -30, "1HS", "SWORD", 2)],
	["Dacian Falx", new Weapon("Dacian Falx", 10, "2HS", "SWORD", 4)],
	["Dagger", new Weapon("Dagger", -20, "1HT", "DAGGER", 1)],
	["Decapitator", new Weapon("Decapitator", 10, "STF", "AXE", 5)],
	["Demon Crossbow", new Weapon("Demon Crossbow", -60, "XBW", "MISSILE", 5)],
	["Demon Heart", new Weapon("Demon Heart", 0, "1HS", "ORB", 3)],
	["Devil Star", new Weapon("Devil Star", 10, "1HS", "MACE", 3)],
	["Diamond Bow", new Weapon("Diamond Bow", 0, "BOW", "MISSILE", 5)],
	["Dimensional Blade", new Weapon("Dimensional Blade", 0, "1HS", "SWORD", 6)],
	["Dimensional Shard", new Weapon("Dimensional Shard", 10, "1HS", "ORB", 3)],
	["Dirk", new Weapon("Dirk", 0, "1HT", "DAGGER", 1)],
	["Divine Scepter", new Weapon("Divine Scepter", -10, "1HS", "MACE", 5)],
	["Double Axe", new Weapon("Double Axe", 10, "1HS", "AXE", 5)],
	["Double Bow", new Weapon("Double Bow", -10, "BOW", "MISSILE", 4)],
	["Eagle Orb", new Weapon("Eagle Orb", -10, "1HS", "ORB", 3)],
	["Edge Bow", new Weapon("Edge Bow", 5, "BOW", "MISSILE", 3)],
	["Elder Staff", new Weapon("Elder Staff", 0, "STF", "STAFF", 4)],
	["Eldritch Orb", new Weapon("Eldritch Orb", -10, "1HS", "ORB", 3)],
	["Elegant Blade", new Weapon("Elegant Blade", -10, "1HS", "SWORD", 2)],
	["Espandon", new Weapon("Espandon", 0, "2HS", "SWORD", 3)],
	["Ettin Axe", new Weapon("Ettin Axe", 10, "1HS", "AXE", 5)],
	["Executioner Sword", new Weapon("Executioner Sword", 10, "2HS", "SWORD", 6)],
	["Falcata", new Weapon("Falcata", 0, "1HS", "SWORD", 2)],
	["Falchion", new Weapon("Falchion", 20, "1HS", "SWORD", 2)],
	["Fanged Knife", new Weapon("Fanged Knife", -20, "1HT", "DAGGER", 3)],
	["Fascia", new Weapon("Fascia", 10, "HT1", "CLAW", 2)],
	["Feral Axe", new Weapon("Feral Axe", -15, "STF", "AXE", 4)],
	["Feral Claws", new Weapon("Feral Claws", -20, "HT1", "CLAW", 3)],
	["Flail", new Weapon("Flail", -10, "1HS", "MACE", 5)],
	["Flamberge", new Weapon("Flamberge", -10, "2HS", "SWORD", 5)],
	["Flanged Mace", new Weapon("Flanged Mace", 0, "1HS", "MACE", 2)],
	["Flying Axe", new Weapon("Flying Axe", 10, "1HS", "THROWING", 0)],
	["Flying Knife", new Weapon("Flying Knife", 0, "1HT", "THROWING", 0)],
	["Francisca", new Weapon("Francisca", 10, "1HS", "THROWING", 0)],
	["Fuscina", new Weapon("Fuscina", 0, "2HT", "SPEAR", 4)],
	["Ghost Glaive", new Weapon("Ghost Glaive", 20, "1HT", "JAVELIN", 0)],
	["Ghost Spear", new Weapon("Ghost Spear", 0, "2HT", "SPEAR", 6)],
	["Ghost Wand", new Weapon("Ghost Wand", 10, "1HS", "STAFF", 2)],
	["Giant Axe", new Weapon("Giant Axe", 10, "STF", "AXE", 6)],
	["Giant Sword", new Weapon("Giant Sword", 0, "2HS", "SWORD", 4)],
	["Giant Thresher", new Weapon("Giant Thresher", -10, "STF", "POLEARM", 6)],
	["Gladius", new Weapon("Gladius", 0, "1HS", "SWORD", 2)],
	["Glaive", new Weapon("Glaive", 20, "1HT", "JAVELIN", 0)],
	["Glorious Axe", new Weapon("Glorious Axe", 10, "STF", "AXE", 6)],
	["Glowing Orb", new Weapon("Glowing Orb", -10, "1HS", "ORB", 3)],
	["Gnarled Staff", new Weapon("Gnarled Staff", 10, "STF", "STAFF", 4)],
	["Gorgon Crossbow", new Weapon("Gorgon Crossbow", 0, "XBW", "MISSILE", 4)],
	["Gothic Axe", new Weapon("Gothic Axe", -10, "STF", "AXE", 6)],
	["Gothic Bow", new Weapon("Gothic Bow", 10, "BOW", "MISSILE", 6)],
	["Gothic Staff", new Weapon("Gothic Staff", 0, "STF", "STAFF", 4)],
	["Gothic Sword", new Weapon("Gothic Sword", 10, "2HS", "SWORD", 4)],
	["Grand Matron Bow", new Weapon("Grand Matron Bow", 10, "BOW", "MISSILE", 5)],
	["Grand Scepter", new Weapon("Grand Scepter", 10, "1HS", "MACE", 3)],
	["Grave Wand", new Weapon("Grave Wand", 0, "1HS", "STAFF", 2)],
	["Great Axe", new Weapon("Great Axe", -10, "STF", "AXE", 6)],
	["Great Bow", new Weapon("Great Bow", -10, "BOW", "MISSILE", 4)],
	["Great Maul", new Weapon("Great Maul", 20, "STF", "MACE", 6)],
	["Great Pilum", new Weapon("Great Pilum", 0, "1HT", "JAVELIN", 0)],
	["Great Poleaxe", new Weapon("Great Poleaxe", 0, "STF", "POLEARM", 6)],
	["Great Sword", new Weapon("Great Sword", 10, "2HS", "SWORD", 6)],
	["Greater Claws", new Weapon("Greater Claws", -20, "HT1", "CLAW", 3)],
	["Greater Talons", new Weapon("Greater Talons", -30, "HT1", "CLAW", 3)],
	["Grim Scythe", new Weapon("Grim Scythe", -10, "STF", "POLEARM", 6)],
	["Grim Wand", new Weapon("Grim Wand", 0, "1HS", "STAFF", 2)],
	["Halberd", new Weapon("Halberd", 0, "STF", "POLEARM", 6)],
	["Hand Axe", new Weapon("Hand Axe", 0, "1HS", "AXE", 2)],
	["Hand Scythe", new Weapon("Hand Scythe", -10, "HT1", "CLAW", 2)],
	["Harpoon", new Weapon("Harpoon", -10, "1HT", "JAVELIN", 0)],
	["Hatchet Hands", new Weapon("Hatchet Hands", 10, "HT1", "CLAW", 2)],
	["Hatchet", new Weapon("Hatchet", 0, "1HS", "AXE", 2)],
	["Heavenly Stone", new Weapon("Heavenly Stone", -10, "1HS", "ORB", 3)],
	["Heavy Crossbow", new Weapon("Heavy Crossbow", 10, "XBW", "MISSILE", 6)],
	["Highland Blade", new Weapon("Highland Blade", -5, "2HS", "SWORD", 4)],
	["Holy Water Sprinkler", new Weapon("Holy Water Sprinkler", 10, "1HS", "MACE", 3)],
	["Hunter's Bow", new Weapon("Hunter's Bow", -10, "BOW", "MISSILE", 4)],
	["Hurlbat", new Weapon("Hurlbat", -10, "1HS", "THROWING", 0)],
	["Hydra Bow", new Weapon("Hydra Bow", 10, "BOW", "MISSILE", 6)],
	["Hydra Edge", new Weapon("Hydra Edge", 10, "1HS", "SWORD", 2)],
	["Hyperion Javelin", new Weapon("Hyperion Javelin", -10, "1HT", "JAVELIN", 0)],
	["Hyperion Spear", new Weapon("Hyperion Spear", -10, "2HT", "SPEAR", 3)],
	["Jagged Star", new Weapon("Jagged Star", 10, "1HS", "MACE", 3)],
	["Jared's Stone", new Weapon("Jared's Stone", 10, "1HS", "ORB", 3)],
	["Javelin", new Weapon("Javelin", -10, "1HT", "JAVELIN", 0)],
	["Jo Staff", new Weapon("Jo Staff", -10, "STF", "STAFF", 2)],
	["Katar", new Weapon("Katar", -10, "HT1", "CLAW", 2)],
	["Knout", new Weapon("Knout", -10, "1HS", "MACE", 5)],
	["Kris", new Weapon("Kris", -20, "1HT", "DAGGER", 3)],
	["Lance", new Weapon("Lance", 20, "2HT", "SPEAR", 6)],
	["Large Axe", new Weapon("Large Axe", -10, "STF", "AXE", 4)],
	["Large Siege Bow", new Weapon("Large Siege Bow", 10, "BOW", "MISSILE", 6)],
	["Legend Spike", new Weapon("Legend Spike", -10, "1HT", "DAGGER", 2)],
	["Legend Sword", new Weapon("Legend Sword", -15, "2HS", "SWORD", 3)],
	["Legendary Mallet", new Weapon("Legendary Mallet", 20, "1HS", "MACE", 4)],
	["Lich Wand", new Weapon("Lich Wand", -20, "1HS", "STAFF", 2)],
	["Light Crossbow", new Weapon("Light Crossbow", -10, "XBW", "MISSILE", 3)],
	["Lochaber Axe", new Weapon("Lochaber Axe", 10, "STF", "POLEARM", 3)],
	["Long Battle Bow", new Weapon("Long Battle Bow", 10, "BOW", "MISSILE", 6)],
	["Long Bow", new Weapon("Long Bow", 0, "BOW", "MISSILE", 5)],
	["Long Staff", new Weapon("Long Staff", 0, "STF", "STAFF", 3)],
	["Long Sword", new Weapon("Long Sword", -10, "1HS", "SWORD", 4)],
	["Long War Bow", new Weapon("Long War Bow", 10, "BOW", "MISSILE", 6)],
	["Mace", new Weapon("Mace", 0, "1HS", "MACE", 2)],
	["Maiden Javelin", new Weapon("Maiden Javelin", -10, "1HT", "JAVELIN", 0)],
	["Maiden Pike", new Weapon("Maiden Pike", 10, "2HT", "SPEAR", 6)],
	["Maiden Spear", new Weapon("Maiden Spear", 0, "2HT", "SPEAR", 6)],
	["Mancatcher", new Weapon("Mancatcher", -20, "2HT", "SPEAR", 5)],
	["Martel de Fer", new Weapon("Martel de Fer", 20, "STF", "MACE", 6)],
	["Matriarchal Bow", new Weapon("Matriarchal Bow", -10, "BOW", "MISSILE", 5)],
	["Matriarchal Javelin", new Weapon("Matriarchal Javelin", -10, "1HT", "JAVELIN", 0)],
	["Matriarchal Pike", new Weapon("Matriarchal Pike", 20, "2HT", "SPEAR", 6)],
	["Matriarchal Spear", new Weapon("Matriarchal Spear", 0, "2HT", "SPEAR", 6)],
	["Maul", new Weapon("Maul", 10, "STF", "MACE", 6)],
	["Mighty Scepter", new Weapon("Mighty Scepter", 0, "1HS", "MACE", 2)],
	["Military Axe", new Weapon("Military Axe", -10, "STF", "AXE", 4)],
	["Military Pick", new Weapon("Military Pick", -10, "1HS", "AXE", 6)],
	["Mithril Point", new Weapon("Mithril Point", 0, "1HT", "DAGGER", 1)],
	["Morning Star", new Weapon("Morning Star", 10, "1HS", "MACE", 3)],
	["Mythical Sword", new Weapon("Mythical Sword", 0, "1HS", "SWORD", 3)],
	["Naga", new Weapon("Naga", 0, "1HS", "AXE", 6)],
	["Ogre Axe", new Weapon("Ogre Axe", 0, "STF", "POLEARM", 3)],
	["Ogre Maul", new Weapon("Ogre Maul", 10, "STF", "MACE", 6)],
	["Partizan", new Weapon("Partizan", 10, "STF", "POLEARM", 5)],
	["Pellet Bow", new Weapon("Pellet Bow", -10, "XBW", "MISSILE", 3)],
	["Petrified Wand", new Weapon("Petrified Wand", 10, "1HS", "STAFF", 2)],
	["Phase Blade", new Weapon("Phase Blade", -30, "1HS", "SWORD", 6)],
	["Pike", new Weapon("Pike", 20, "2HT", "SPEAR", 6)],
	["Pilum", new Weapon("Pilum", 0, "1HT", "JAVELIN", 0)],
	["Poignard", new Weapon("Poignard", -20, "1HT", "DAGGER", 1)],
	["Poleaxe", new Weapon("Poleaxe", 10, "STF", "POLEARM", 5)],
	["Polished Wand", new Weapon("Polished Wand", 0, "1HS", "STAFF", 2)],
	["Quarterstaff", new Weapon("Quarterstaff", 0, "STF", "STAFF", 3)],
	["Quhab", new Weapon("Quhab", 0, "HT1", "CLAW", 3)],
	["Razor Bow", new Weapon("Razor Bow", -10, "BOW", "MISSILE", 4)],
	["Reflex Bow", new Weapon("Reflex Bow", 10, "BOW", "MISSILE", 5)],
	["Reinforced Mace", new Weapon("Reinforced Mace", 0, "1HS", "MACE", 2)],
	["Repeating Crossbow", new Weapon("Repeating Crossbow", -40, "XBW", "MISSILE", 5)],
	["Rondel", new Weapon("Rondel", 0, "1HT", "DAGGER", 1)],
	["Rune Bow", new Weapon("Rune Bow", 0, "BOW", "MISSILE", 5)],
	["Rune Scepter", new Weapon("Rune Scepter", 0, "1HS", "MACE", 2)],
	["Rune Staff", new Weapon("Rune Staff", 20, "STF", "STAFF", 6)],
	["Rune Sword", new Weapon("Rune Sword", -10, "1HS", "SWORD", 4)],
	["Runic Talons", new Weapon("Runic Talons", -30, "HT1", "CLAW", 3)],
	["Sabre", new Weapon("Sabre", -10, "1HS", "SWORD", 2)],
	["Sacred Globe", new Weapon("Sacred Globe", -10, "1HS", "ORB", 3)],
	["Scepter", new Weapon("Scepter", 0, "1HS", "MACE", 2)],
	["Scimitar", new Weapon("Scimitar", -20, "1HS", "SWORD", 2)],
	["Scissors Katar", new Weapon("Scissors Katar", -10, "HT1", "CLAW", 3)],
	["Scissors Quhab", new Weapon("Scissors Quhab", 0, "HT1", "CLAW", 3)],
	["Scissors Suwayyah", new Weapon("Scissors Suwayyah", 0, "HT1", "CLAW", 3)],
	["Scourge", new Weapon("Scourge", -10, "1HS", "MACE", 5)],
	["Scythe", new Weapon("Scythe", -10, "STF", "POLEARM", 5)],
	["Seraph Rod", new Weapon("Seraph Rod", 10, "1HS", "MACE", 3)],
	["Shadow Bow", new Weapon("Shadow Bow", 0, "BOW", "MISSILE", 5)],
	["Shamshir", new Weapon("Shamshir", -10, "1HS", "SWORD", 2)],
	["Shillelagh", new Weapon("Shillelagh", 0, "STF", "STAFF", 4)],
	["Short Battle Bow", new Weapon("Short Battle Bow", 0, "BOW", "MISSILE", 5)],
	["Short Bow", new Weapon("Short Bow", 5, "BOW", "MISSILE", 3)],
	["Short Siege Bow", new Weapon("Short Siege Bow", 0, "BOW", "MISSILE", 5)],
	["Short Spear", new Weapon("Short Spear", 10, "1HT", "JAVELIN", 0)],
	["Short Staff", new Weapon("Short Staff", -10, "STF", "STAFF", 2)],
	["Short Sword", new Weapon("Short Sword", 0, "1HS", "SWORD", 2)],
	["Short War Bow", new Weapon("Short War Bow", 0, "BOW", "MISSILE", 5)],
	["Siege Crossbow", new Weapon("Siege Crossbow", 0, "XBW", "MISSILE", 4)],
	["Silver-edged Axe", new Weapon("Silver-edged Axe", 0, "STF", "AXE", 5)],
	["Simbilan", new Weapon("Simbilan", 10, "1HT", "JAVELIN", 0)],
	["Small Crescent", new Weapon("Small Crescent", 10, "1HS", "AXE", 4)],
	["Smoked Sphere", new Weapon("Smoked Sphere", 0, "1HS", "ORB", 3)],
	["Sparkling Ball", new Weapon("Sparkling Ball", 0, "1HS", "ORB", 3)],
	["Spear", new Weapon("Spear", -10, "2HT", "SPEAR", 3)],
	["Spetum", new Weapon("Spetum", 0, "2HT", "SPEAR", 6)],
	["Spiculum", new Weapon("Spiculum", 20, "1HT", "JAVELIN", 0)],
	["Spider Bow", new Weapon("Spider Bow", 5, "BOW", "MISSILE", 3)],
	["Spiked Club", new Weapon("Spiked Club", 0, "1HS", "MACE", 2)],
	["Stag Bow", new Weapon("Stag Bow", 0, "BOW", "MISSILE", 5)],
	["Stalagmite", new Weapon("Stalagmite", 10, "STF", "STAFF", 3)],
	["Stiletto", new Weapon("Stiletto", -10, "1HT", "DAGGER", 2)],
	["Stygian Pike", new Weapon("Stygian Pike", 0, "2HT", "SPEAR", 4)],
	["Stygian Pilum", new Weapon("Stygian Pilum", 0, "1HT", "JAVELIN", 0)],
	["Suwayyah", new Weapon("Suwayyah", 0, "HT1", "CLAW", 3)],
	["Swirling Crystal", new Weapon("Swirling Crystal", 10, "1HS", "ORB", 3)],
	["Tabar", new Weapon("Tabar", 10, "STF", "AXE", 5)],
	["Thresher", new Weapon("Thresher", -10, "STF", "POLEARM", 5)],
	["Throwing Axe", new Weapon("Throwing Axe", 10, "1HS", "THROWING", 0)],
	["Throwing Knife", new Weapon("Throwing Knife", 0, "1HT", "THROWING", 0)],
	["Throwing Spear", new Weapon("Throwing Spear", -10, "1HT", "JAVELIN", 0)],
	["Thunder Maul", new Weapon("Thunder Maul", 20, "STF", "MACE", 6)],
	["Tomahawk", new Weapon("Tomahawk", 0, "1HS", "AXE", 2)],
	["Tomb Wand", new Weapon("Tomb Wand", -20, "1HS", "STAFF", 2)],
	["Trident", new Weapon("Trident", 0, "2HT", "SPEAR", 4)],
	["Truncheon", new Weapon("Truncheon", -10, "1HS", "MACE", 2)],
	["Tulwar", new Weapon("Tulwar", 20, "1HS", "SWORD", 2)],
	["Tusk Sword", new Weapon("Tusk Sword", 0, "2HS", "SWORD", 4)],
	["Twin Axe", new Weapon("Twin Axe", 10, "1HS", "AXE", 5)],
	["Two-Handed Sword", new Weapon("Two-Handed Sword", 0, "2HS", "SWORD", 3)],
	["Tyrant Club", new Weapon("Tyrant Club", 0, "1HS", "MACE", 3)],
	["Unearthed Wand", new Weapon("Unearthed Wand", 0, "1HS", "STAFF", 2)],
	["Vortex Orb", new Weapon("Vortex Orb", 0, "1HS", "ORB", 3)],
	["Voulge", new Weapon("Voulge", 0, "STF", "POLEARM", 4)],
	["Walking Stick", new Weapon("Walking Stick", -10, "STF", "STAFF", 2)],
	["Wand", new Weapon("Wand", 0, "1HS", "STAFF", 1)],
	["War Axe", new Weapon("War Axe", 0, "1HS", "AXE", 6)],
	["War Club", new Weapon("War Club", 10, "STF", "MACE", 6)],
	["War Dart", new Weapon("War Dart", -20, "1HT", "THROWING", 0)],
	["War Fist", new Weapon("War Fist", 10, "HT1", "CLAW", 2)],
	["War Fork", new Weapon("War Fork", -20, "2HT", "SPEAR", 5)],
	["War Hammer", new Weapon("War Hammer", 20, "1HS", "MACE", 4)],
	["War Javelin", new Weapon("War Javelin", -10, "1HT", "JAVELIN", 0)],
	["War Pike", new Weapon("War Pike", 20, "2HT", "SPEAR", 6)],
	["War Scepter", new Weapon("War Scepter", -10, "1HS", "MACE", 5)],
	["War Scythe", new Weapon("War Scythe", -10, "STF", "POLEARM", 6)],
	["War Spear", new Weapon("War Spear", -10, "2HT", "SPEAR", 3)],
	["War Spike", new Weapon("War Spike", -10, "1HS", "AXE", 6)],
	["War Staff", new Weapon("War Staff", 20, "STF", "STAFF", 6)],
	["War Sword", new Weapon("War Sword", 0, "1HS", "SWORD", 3)],
	["Ward Bow", new Weapon("Ward Bow", 0, "BOW", "MISSILE", 5)],
	["Winged Axe", new Weapon("Winged Axe", -10, "1HS", "THROWING", 0)],
	["Winged Harpoon", new Weapon("Winged Harpoon", -10, "1HT", "JAVELIN", 0)],
	["Winged Knife", new Weapon("Winged Knife", -20, "1HT", "THROWING", 0)],
	["Wrist Blade", new Weapon("Wrist Blade", 0, "HT1", "CLAW", 2)],
	["Wrist Spike", new Weapon("Wrist Spike", -10, "HT1", "CLAW", 2)],
	["Wrist Sword", new Weapon("Wrist Sword", -10, "HT1", "CLAW", 3)],
	["Yari", new Weapon("Yari", 0, "2HT", "SPEAR", 6)],
	["Yew Wand", new Weapon("Yew Wand", 10, "1HS", "STAFF", 1)],
	["Zweihander", new Weapon("Zweihander", -10, "2HS", "SWORD", 5)]
]);
export function getWeapon(name) { return WEAPONS.get(name); }

export { OUTPUT, CONTAINER, SELECT, NUMBER, CHECKBOX, CHAR, MORPH, OPTION, BUTTON, OTHER, AS_SKILL, ANIM_DATA, SKILLS };

//export { container, select, number, checkbox, option, button, skill, other, debug, tv, char, wf, skills, wt, ic, weaponsMap, LINK_SEPARATOR };

/*function setupInputElement(element, eventListener) {
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
}*/

/*function setupUpdateTableInputElements(eventListener) {
    setupInputElement(number.PRIMARY_WEAPON_IAS, eventListener);
    setupInputElement(number.PRIMARY_WEAPON_IAS, eventListener);
	setupInputElement(number.SECONDARY_WEAPON_IAS, eventListener);
	setupInputElement(number.IAS, eventListener);
	setupInputElement(number.FANATICISM, eventListener);
	setupInputElement(number.BURST_OF_SPEED, eventListener);
	setupInputElement(number.WEREWOLF, eventListener);
	setupInputElement(number.MAUL, eventListener);
	setupInputElement(number.FRENZY, eventListener);
	setupInputElement(number.HOLY_FREEZE, eventListener);
	setupInputElement(number.SLOWED_BY, eventListener);
    
	setupInputElement(checkbox.IS_ONE_HANDED, eventListener);
	setupInputElement(checkbox.DECREPIFY, eventListener);
	setupInputElement(checkbox.CHILLED, eventListener);
}*/

//function convertIAStoEIAS(IAS) { return Math.floor(120 * IAS / (120 + IAS)); }

//function convertEIAStoIAS(EIAS) { return Math.ceil(120 * EIAS / (120 - EIAS)); }
