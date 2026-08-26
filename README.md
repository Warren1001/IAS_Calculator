## [IAS Calculator](https://warren1001.github.io/IAS_Calculator/)

- Credits to RuffnecKk for dumping the hardcoded player sequence animation table data for D2R 3.3.
- Credits to ChthonVII and ubeogesh for helping with the calculator.
- Credits to The Amazon Basin/similar D2 forums (mostly TitanSeal, onderduiker, and Hammerman) for information.
- Credits to Phrozen Keep for information.

### v1.2.1

Well, unfortunately, I'm an idiot. I thought I had the Jab tables wrong because in the function within this calculator I use to fetch the base sequence animation length for sequence skills (and Jab is one of them), I had 24 written. I took this as all Jab tables had been incorrect. But based on what the community showed me, the old animation table is the same as the 'new' one. The original code base was a bit messy and there were instances of me handling the same logic for some skills in two different places. I'm guessing I had the right base sequence animation length for Jab listed this entire time and it was just in some other random function for some crazy reason. I cleaned up the code base a decent bit in 1.2.0 so I don't have that possible duplicate code anymore to verify that hypothetical so maybe I've simply gone off the deep end.

On top of that, 1.2.0 introduced a minor counting bug when I redid the function for sequences. The one-handed Jab table base animation length has 18 frames but I mistakenly counted 19 and wrote that instead. So rather than Jab being wrong all this time, one-handed Jab tables were wrong only in 1.2.0. end me

- Fixed stupid Jab table actually this time. I verified it both manually myself in-game and with Amazon Basin's Jab table. All match.

### v1.2.0

This update was made possible by RuffnecKk over at [D2RLoader](https://d2rloader.net) (one of the plugin devs in the Discord). He dumped all the hardcoded player sequence animation tables for D2R and (unintentionally) provided some clarifying logic on how some sequence tables were utilized.

The hardcoded sequence tables for Cleave and Mirrored Blades are now known (at least for me, maybe someone else already knew about them), so they have been added. I added the rest of the Warlock tables too. Be sure to provide your Cleave and Mirrored Blades skill levels when applicable, as they give themselves attack speed based on their skill level.

Up until this point, Amazon's Jab tables have been completely incorrect. I was using a base animation length in frames (FramesPerDirection, FPD) of 23. I think I got that number from the original D2L calculator, but I don't remember. [D2MOO has always had the sequence tables](https://github.com/ThePhrozenKeep/D2MOO/blob/master/source/D2Common/src/DataTbls/SequenceTbls.cpp) for D2L available, however... Jab tables were listed for 1HS (one-handed swinging weapons, like swords) and BOW (bows), which always confused me, as obviously you can't Jab with swords or bows. I didn't know what to make of this so I simply left it as is and continued using the 23 value. It turns out that the table names are simply called that, but 1HT (one-handed thrusting weapons, like javelins) uses the BOW table and 2HT (two-handed thrusting weapons, like spears) use the 1HS table. The base animation length in frames should have been 19 and 21 respectively. Jab tables for Amazon are now accurate, faster than shown before, and differ between one handed and two handed weapons.

- Added all Warlock tables.
- Fixed Jab tables for Amazon.
- Added Hex: Purge for Warlock.
- Added Sigil: Lethargy slow for PvP.
- Various bug fixes with calculator usage.
- Improved some text/descriptions across the board.
- Removed Werewolf access to all player classes added in 1.1.1. The Winter event a year or two ago allowed everyone to shapeshift for a brief time and I never got around to removing the access afterwards.

### v1.1.2
- Allowed non-Paladins to select any melee weapon when using Zeal, since Zeal charges exist.

### v1.1.1
- Added the ability to select Werewolf and Werewolf skills to all player classes. This will be removed once the event is over.

### v1.1.0
- Added Burst of Speed for all classes (Hustle).
- Added Mark of the Bear for all character classes (Metamorphosis).

### v1.0.7
- Bug fix for skill IAS tables

### v1.0.6
- Fixed Strafe tables not displaying properly.

### v1.0.5
- Fixed dual-wielded tables using WIAS, hopefully it all works now?
- Fixed being unable to unequip the second weapon when swapping from a skill that required two weapons to a skill that could use two weapons but wasn't required to.

### v1.0.4
- Fixed Assassin claw speeds showing tables for skills that wasn't possible.

### v1.0.2
- Fixed Paladin's basic attack for two handed weapons and two handed swords. The two handed sword animation has two different animation lengths, but I mistakenly had the two handed weapon animation with two different animation lengths.
- Updated the Assassin's basic attack with the claws change from the 2.5 PTR v1.

### v1.0.1
- Fixed multihitting skills last hit, breakpoints are correct now
- Fixed "is one handed" checkbox appearing for Whirlwind when it doesn't change the breakpoints at all
- Fixed the one-off Whirlwind bugs (might have fixed it in the last update, don't remember)

- There's still one minor bug when using WIAS inputs when you are 1 WIAS away from the breakpoint, the table won't update and still shows 2 IAS. Otherwise, the two-handed sequence skills are difficult to show contextual numbers for, so certain configurations may appear weird but are actually correct. I'm still thinking on the best way to present the information in a less confusing way.
- I plan to work on the Assassin claws attack speed "fixes" from the 2.5 PTR next.

### v1.0.0
- Restructured a lot of the code.
- Redesigned how the UI functions, inputs work top down. Examples:
  - Setting skill to Double Swing for Barbarian will only let you choose one-handable weapons.
  - Choosing Werebear on any non-Druid class only allows Standard and Kick skills.
- Whirlwind is fully updated.
- Updated info messages again.
- Added favicon :) (little icon in the tab)

### v0.17.0
- Updated Whirlwind for Barbarian single-handed after D2R 2.4.3, a bug fix or two.

### v0.16.0
- Fixed NaN for unarmed Mercenaries.
- Tested Kick (KK) animations (Barrels, etc), they should all be correct given the information available.
- Added Dodge animation breakpoints, 'Dodge' is the same as Avoid and Evade. Dodge is only impacted by SIAS, so Fanaticism is the only way to speed it up, and Holy Freeze, Chilled, and Slows Target is the only way to slow it down.
- Added Slows Target modifier for PvP. Maximum is 50%.
- Added Chilled modifier (cold damage (chill length)/freeze length (chill length)/Freezes Target (chill length) without CBF), always -50 SIAS.
- Fixed a bug where Holy Freeze wasn't being affected by its maximum slow value (maximum slow is -50 against players).
- Modified some infos.

### v0.15.0
- Literally everything should be correct for 2.4, with the exception of off-hand Normal Attack for Characters (untested).
- All wereform animations should be correct in all cases.
- All dual wielding skills should be correct.
- All breakpoints where EIAS would be <0 should be correct.
- All sequence skills (Frenzy, Double Swing, Dragon Claw, Fists of Fire, A5 Merc Normal Attack, etc) should be correct.
- Impale should be correct.
- Strafe bug was fixed in D2R/2.4, 2 frame attack is actually reachable.
- Whirlwind is correct. Whirlwind does hit on the 4th and 8th frame, the hit-check bug works differently than people think it does.

### v0.14.5
- Fixed bug with dual wielding Act 5 Mercenary.
- Updated some infos.

### v0.14.4
- Fixed EIAS iteration in some instances to show accurate breakpoints possibilities.

### v0.14.3
- Changed link data separator so it won't break in Twitch Chat.

### v0.14.2
- Fixed Werewolf and Werebear skills being reversed

### v0.14.1
- Updated some info messages

### v0.14.0
- Updated a lot of the code behind the scenes.
- Fixed a lot of small issues that had creeped into the calculator with 2.4.
- Fury was updated with fair test results in the previous calc update.
