import { OUTPUT, CONTAINER, SELECT, NUMBER, CHECKBOX, CHAR, MORPH, OPTION, BUTTON, OTHER, AS_SKILL, ANIM_DATA, SKILL, getCharacter, getSkill, forEachSkill, getWeapon, forEachWeapon, Skill, SequenceSkill, RollbackSkill } from './constants.js'

window.addEventListener("load", load, false);

//load();

function load() {

    // notes, maxroll's frenzy table differs to mine, i think theirs is wrong
    // in all their tables, the AFs take place in the first half + 1 of the animation, leaving the last half - 1 of just concluding the animation, which seems weird.
    // mine is slightly more centered than theirs which makes sense to me. need to test.
    // AF should be 4,9

    // notes, wereforms do not use druid's A1 FPD,AF for A1 animations, they use their own A1, however they use human A1 AS. idk what the identifier for it is in animdata, chthonvii has this data in his wereform calculator

    let rows = [];

    class Cell {

        constructor(startingId)

    }

    class Row {

        constructor(tr, eiasNeeded) {
            this.cells = tr.cells;
            this.size = this.cells.size;
            this.eiasNeeded = eiasNeeded;
        }

        resize(size, addMore) {
            this.size = size;
            if (this.cells.size < size) {
                addMore(tr);
                this.cells = tr.cells;
            }
            for (let i = 0; i < this.cells.size; i++) {
                if (i < size) {
                    showElement(this.cells[i]);
                } else {
                    hideElement(this.cells[i]);
                }
            }
        }

        size() {
            return this.size;
        }

        getCell(index) {
            return this.cells[index];
        }

        forEach(action) {
            this.cells.forEach(action);
        }

        setColor(color) {
            this.forEach(cell => {/* TODO */});
        }

    }

    let character = CHAR.AMAZON;
    let morph = MORPH.HUMAN;
    let skill = SKILL.ATTACK;
    let pweapon = getWeapon("None");

    updateSkills();
    updateWeapons();

    generateFirstTable();

    function generateFirstTable() {
        let animData = getAnimData();
        let table = generateNormalBreakpointTable(animData[0], [animData[1]], animData[2], animData[3], false, false, 1);
        generateFirstTable(table);
    }

    function updateTable() {

    }

    function getAnimData() {
        let token = character.token;
        let weaponClass = pweapon.weaponClass;
        let mode = "A1";
        if (skill instanceof RollbackSkill) {

        } else if (skill instanceof SequenceSkill) {

        } else {
            mode = skill.animationMode;
            if (Array.isArray(mode)) mode = mode[0];
        }
        return ANIM_DATA[token + mode + weaponClass];
    }

    function updateSkills() {
        clear(SELECT.SKILL);
        let hasSameSkill = false;
        forEachSkill(s => {
            if (s.canBeUsedBy(character, morph)) {
                SELECT.SKILL.add(createOption(s.name, s.name))
                if (skill == s) hasSameSkill = true;
            }
        });
        if (hasSameSkill) {
            SELECT.SKILL.value = skill.name;
        } else {
            // TODO
        }
    }

    function updateWeapons() {
        clear(SELECT.PRIMARY_WEAPON);
        let hasSameWeapon = false;
        forEachWeapon(weapon => {
            if (weapon.canBeUsedBy(character)) {
                SELECT.PRIMARY_WEAPON.add(createOption(weapon.name, weapon.name + " [" + weapon.WSM + "]"));
                if (pweapon == weapon) hasSameWeapon = true;
            }
        });
        if (hasSameWeapon) {
            SELECT.PRIMARY_WEAPON.value = pweapon.name;
        } else {
            // TODO
        }
    }

    function clear(select) {
        for (let i = select.options.length - 1; i >= 0; i--) {
            select.remove(i);
        }
    }

    function createOption(value, text) {
        let option = document.createElement("option");
        if (value == "divider") option.disabled = true;
        else option.setAttribute("value", value);
        option.text = text;
        return option;
    }

    function generateFirstTable(table) {
        addTableHeader(OUTPUT);
        for (let i = 0; i < table.length; i++) {
            addTableRow(OUTPUT, table, i);
        }
    }

    function hideElement(element) {
        let className = element.className;
        if (!className.includes("hidden")) {
            element.className = className + " hidden";
        }
    }

    function showElement(element) {
        element.className = element.className.replace(" hidden", "").replace("hidden ", "");
    }

    function addTableRow(output, table, index) {

        let breakpoint = table[index];

        let tableRow = document.createElement("tr");
    
        let actionFrameCell = document.createElement("td");
        let actionFrame = breakpoint[2][0];
        if (index > 0) {
            let previousBreakpoint = table[index - 1];
            if (previousBreakpoint[2][0] == actionFrame) {
                let className = previousBreakpoint[3].className;
                if (className.startsWith("cellFull")) previousBreakpoint[3].className = "cellTop";
                else if (className.startsWith("cellBottom")) previousBreakpoint[3].className  = "cellMiddle";
                actionFrameCell.innerHTML = "";
                actionFrameCell.className = "cellBottom";
            } else {
                actionFrameCell.innerHTML = actionFrame;
                actionFrameCell.className = "cellFull";
            }
        } else {
            actionFrameCell.innerHTML = actionFrame;
            actionFrameCell.className = "cellFull";
        }
    
        let lengthCell = document.createElement("td");
        let length = breakpoint[1];
        if (index > 0) {
            let previousBreakpoint = table[index - 1];
            if (previousBreakpoint[1] == length) {
                let className = previousBreakpoint[4].className;
                if (className.startsWith("cellFull")) previousBreakpoint[4].className = "cellTop";
                else if (className.startsWith("cellBottom")) previousBreakpoint[4].className  = "cellMiddle";
                lengthCell.innerHTML = "";
                lengthCell.className = "cellBottom";
            } else {
                lengthCell.innerHTML = length;
                lengthCell.className = "cellFull";
            }
        } else {
            lengthCell.innerHTML = length;
            lengthCell.className = "cellFull";
        }

        let eiasCell = document.createElement("td");
        eiasCell.innerHTML = breakpoint[0];
        eiasCell.className = "cellFull";

        let iasCell = document.createElement("td");
        let ias = convertEIAStoIAS(breakpoint[0]);
        iasCell.innerHTML = ias <= 0 ? "" : ias;
        iasCell.className = "cellFull";

        let fanaticismCell = document.createElement("td");
        let skillLevel = AS_SKILL.FANATICISM.getLevelFromEIAS(breakpoint[0]);
        fanaticismCell.innerHTML = skillLevel <= 0 ? "" : (skillLevel > 60 ? "∞" : skillLevel);
        fanaticismCell.className = "cellFull";

        breakpoint.push(actionFrameCell);
        breakpoint.push(lengthCell);
        breakpoint.push(eiasCell);
        breakpoint.push(iasCell);
        breakpoint.push(fanaticismCell);
    
        tableRow.appendChild(actionFrameCell);
        tableRow.appendChild(lengthCell);
        tableRow.appendChild(eiasCell);
        tableRow.appendChild(iasCell);
        tableRow.appendChild(fanaticismCell);
        
        rows.push(new Row(tableRow));
    
        output.appendChild(tableRow);
    }
    
    function addTableHeader(output) {
    
        let tableRow = document.createElement("tr");
    
        let actionFrameHeader = document.createElement("th");
        actionFrameHeader.innerHTML = "AF";
    
        let lengthHeader = document.createElement("th");
        lengthHeader.innerHTML = "Len";
        lengthHeader.title = "Animation Length";
        lengthHeader.className = "hoverable";

        let eiasHeader = document.createElement("th");
        eiasHeader.innerHTML = "EIAS";

        let iasHeader = document.createElement("th");
        iasHeader.innerHTML = "IAS";
        iasHeader.title = "Additional Increased Attack Speed needed for this breakpoint";
        iasHeader.className = "hoverable";

        let fanaticismHeader = document.createElement("th");
        fanaticismHeader.innerHTML = "Fan";
        fanaticismHeader.title = "Additional Fanaticism skill levels needed for this breakpoint";
        fanaticismHeader.className = "hoverable";
    
        tableRow.appendChild(actionFrameHeader);
        tableRow.appendChild(lengthHeader);
        tableRow.appendChild(eiasHeader);
        tableRow.appendChild(iasHeader);
        tableRow.appendChild(fanaticismHeader);

        rows.push(new Row(tableRow));
    
        output.appendChild(tableRow);
    }

    function convertEIAStoIAS(eias) {
        return Math.ceil(120 * eias / (120 - eias));
    }

    function generateNormalBreakpointTable(fpd, actionFrame, startingFrame, animationSpeed, isSequence, isWhirlwind, speedReduction) {

        let comparisonStrategy = isWhirlwind ? (left, right) => left <= right : (left, right) => left < right;
        let incrementStrategy = speedReduction < 1 ? (eias) => truncate((animationSpeed + truncate(animationSpeed * eias / 100)) * speedReduction) : (eias) => truncate(animationSpeed * (100 + eias) / 100);

        let table = [];

        for (let eias = -85; eias <= 75; eias++) {

            let increment = incrementStrategy(eias);
            let ticks = isSequence;
            let actionTicks = [];

            for (let counter = startingFrame * 256 + increment; comparisonStrategy(counter, fpd * 256); counter += increment) {
                
                ticks++;
        
                let frame = truncate(counter / 256);

                if (!isWhirlwind && actionTicks.length < actionFrame.length && frame >= actionFrame[actionTicks.length]) {
                    actionTicks.push(ticks);
                }
        
            }
            
            if (table.length == 0 || ticks != table[table.length - 1][1] || (!isWhirlwind && checkArrayNotEqual(actionTicks, table[table.length - 1][2]))) {
                table.push([eias, ticks, actionTicks]);
            }

        }

        table = table.reverse();
        //console.log(table);
        return table;

    }

    function generateRollbackBreakpointTable(fpd, actionFrame, startingFrame, animationSpeed, hits, rollbackAmount) {

        let table = [];

        for (let eias = -85; eias <= 75; eias++) {

            let increment = truncate(animationSpeed * (100 + eias) / 100);
            let ticks = isSequence;
            let actionTicks = [];

            for (let counter = startingFrame * 256 + increment; counter < fpd * 256; counter += increment) {
                
                ticks++;
        
                let frame = truncate(counter / 256);

                if (actionTicks.length <= hits - 1 && frame >= actionFrame) {
                    actionTicks.push(ticks);
                    counter = truncate(frame * (100 - rollbackAmount) / 100) * 256;
                }
        
            }
            
            if (table.length == 0 || ticks != table[table.length - 1][1] || checkArrayNotEqual(actionTicks, table[table.length - 1][2])) {
                table.push([eias, ticks, actionTicks]);
            }

        }

        table = table.reverse();
        console.log(table);
        return table;

    }

    function truncate(int) {
        return int < 0 ? Math.ceil(int) : Math.floor(int);
    }

    function checkArrayNotEqual(array1, array2) {
        if (array1.length != array2.length) return true;
        for (let i = 0; i < array1.length; i++) {
            if (array1[i] != array2[i]) return true;
        }
        return false;
    }


}