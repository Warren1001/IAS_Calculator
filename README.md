## [IAS Calculator](https://warren1001.github.io/IAS_Calculator/)

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
