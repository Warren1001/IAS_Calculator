import { OUTPUT, CONTAINER, SELECT, NUMBER, CHECKBOX, CHAR, WF, OPTION, BUTTON, OTHER, AS_SKILL, ANIM_DATA, SKILLS } from './constants.js'

window.addEventListener("load", load, false);

//load();

function load() {

    // notes, maxroll's frenzy table differs to mine, i think theirs is wrong
    // in all their tables, the AFs take place in the first half + 1 of the animation, leaving the last half - 1 of just concluding the animation, which seems weird.
    // mine is slightly more centered than theirs which makes sense to me. need to test.
    // AF should be 4,9

    // notes, wereforms do not use druid's A1 FPD,AF for A1 animations, they use their own A1, however they use human A1 AS. idk what the identifier for it is in animdata, chthonvii has this data in his wereform calculator

    let table = generateNormalBreakpointTable(12, [7], 0, 256, false, false, 12 / 19);
    displayNormalBreakpointTable(table);

    function displayNormalBreakpointTable(table) {
        const output = document.getElementById("output");
        addTableHeader(output);
        for (let i = 0; i < table.length; i++) {
            addTableRow(output, table, i);
        }
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
        iasCell.innerHTML = ias < 0 ? "" : ias;
        iasCell.className = "cellFull";

        breakpoint.push(actionFrameCell);
        breakpoint.push(lengthCell);
        breakpoint.push(eiasCell);
        breakpoint.push(iasCell);
    
        tableRow.appendChild(actionFrameCell);
        tableRow.appendChild(lengthCell);
        tableRow.appendChild(eiasCell);
        tableRow.appendChild(iasCell);
    
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
        iasHeader.title = "Total Increased Attack Speed needed for this breakpoint";
        iasHeader.className = "hoverable";
    
        tableRow.appendChild(actionFrameHeader);
        tableRow.appendChild(lengthHeader);
        tableRow.appendChild(eiasHeader);
        tableRow.appendChild(iasHeader);
    
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
        console.log(table);
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