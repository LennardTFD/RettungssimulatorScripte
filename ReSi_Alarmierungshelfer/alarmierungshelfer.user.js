// ==UserScript==
// @name         Alarmierungs Helfer
// @namespace    https://rettungssimulator.online/
// @version      1.0
// @description  Listet benötigte Fahrzeuge für Einsätze auf
// @author       Lennard[TFD]
// @match        https://rettungssimulator.online/alarming-choose-vehicles?missionid=*
// @updateURL    https://github.com/LennardTFD/RettungssimulatorScripte/raw/master/ReSi_Alarmierungshelfer/alarmierungshelfer.user.js
// @downloadURL  https://github.com/LennardTFD/RettungssimulatorScripte/raw/master/ReSi_Alarmierungshelfer/alarmierungshelfer.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let requirements, missionId;
    async function getRequirements()
    {
        await $.ajax({url:"https://rettungssimulator.online/json/missions.json", success: (result) => {requirements = result; localStorage.setItem("alarmHelperCache", JSON.stringify(requirements))}});
    }

    function buildRequirementsString()
    {
        let missionRequirements = requirements["missions"][missionId];
        let requirementsString = "";
        let key, value;
        for ([key, value] of Object.entries(missionRequirements))
        {
            console.log(key + " | " + value);
            if(key.includes("need_"))
            {
                requirementsString += "<li>" + value + "x " + key.replace("need_", "");
            }
        }
        return requirementsString;
    }

    async function init()
    {
        missionId = parseInt($("div[missionid]").attr("missionid"));
        requirements = JSON.parse(localStorage.getItem("alarmHelperCache"));
        if(!requirements || !requirements[missionId]);
        {
            await getRequirements();
        }
        $("#table_alarming_vehicles").parent().parent().before("<div id='alarmHelper' class='box_single border_feuerwehr'><div class='box_single_headline background_feuerwehr'>Alarmierungshelfer</div><div class='box_single_content_all'><ul>" + buildRequirementsString() + "</ul></div></div>");
    }

    init();

})();