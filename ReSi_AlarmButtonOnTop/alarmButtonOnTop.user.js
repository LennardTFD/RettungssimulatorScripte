// ==UserScript==
// @name         Alarmierungsbutton oben
// @namespace    https://rettungssimulator.online/
// @version      1.0
// @description  Fügt Alarmierungsbutton auch über Liste an
// @author       Lennard[TFD]
// @match        https://rettungssimulator.online/alarming-choose-vehicles?missionid=*
// @updateURL    https://github.com/LennardTFD/RettungssimulatorScripte/raw/master/ReSi_AlarmButtonOnTop/alarmButtonOnTop.user.js
// @downloadURL  https://github.com/LennardTFD/RettungssimulatorScripte/raw/master/ReSi_AlarmButtonOnTop/alarmButtonOnTop.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $("#table_alarming_vehicles").before('<div class="box_submit box_submit_disabled" title="Anruf ohne Alarmierung bearbeiten"><input type="submit" value="Anruf ohne Alarmierung bearbeiten" id="submit_alarming_window" class="submit_disabled"></div>');
})();