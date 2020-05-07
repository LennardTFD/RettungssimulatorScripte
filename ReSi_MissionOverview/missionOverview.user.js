// ==UserScript==
// @name         Einsatz Übersicht
// @namespace    https://rettungssimulator.online/
// @version      1.0
// @description  Übersicht an Einsätzen
// @author       Lennard[TFD]
// @match        https://rettungssimulator.online/missionsOverview
// @match        https://rettungssimulator.online/start
// @match        https://rettungssimulator.online/alarming-choose-vehicles?missionid=*
// @updateURL    https://github.com/LennardTFD/RettungssimulatorScripte/raw/master/ReSi_MissionOverview/missionOverview.user.js
// @downloadURL  https://github.com/LennardTFD/RettungssimulatorScripte/raw/master/ReSi_MissionOverview/missionOverview.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let missions;

    async function getMissions()
    {
        await $.ajax({url: "/json/missions.json", success: (res) => {missions = res.missions}})
    }

    async function init()
    {
        if(document.location.pathname == "/start")
        {
            //console.log("Start");
            //Add to Dropdown
            $(".dropdown-content a[onclick*='settings']").after("<a href=\"#\" onclick=\"openFrame('missionsOverview')\">Einsatzübersicht</a>")
        } else if(document.location.pathname == "/missionsOverview") {
            createBody();
            await getMissions();
            let missionId = parseInt(document.location.hash.replace("#", ""));
            if(missionId)
            {
                //console.log("Single Mission");
                drawRequirements(missionId);
            } else {
                //console.log("All Mission");
                for(missionId in missions)
                {
                    //console.log(missionId);
                    drawRequirements(missionId);
                }
            }
        }
        else
        {
            let header = $("div[missionid]");
            let missionId = parseInt(header.attr("missionid"));
            header.append('<span class="status s6" style="float: right;margin-top: -2px"><a href="missionsOverview#' + missionId + '" target="_blank">Details</a></span>');
        }
    }
    
    function drawRequirements(missionId) {
        let mission = missions[missionId];
        let name = mission.name;
        let credits = mission.credits;
        let icon = mission.icon;

        let vehTable = "";
        let vehicleRequirements = Object.keys(mission).filter(key => key.includes("need_"));
        for(var key of vehicleRequirements)
        {
            var amount = mission[key];
            var vehicle = key.replace("need_", "");

            vehTable += "<tr><td><div><span class='box_single_content_vehicles_name'>" + vehicle + "</span></div></td><td><div><span class='box_single_content_vehicles_name''>" + amount + "</span></div></td></tr>";
        }

        var missionHTML = `
        <div class='box_single border_feuerwehr'>
            <div style='display:flex'>
                <div class='box_single_headline background_feuerwehr form-left'>` + name + `</div>
                <div class="box_single_headline background_feuerwehr box_single_buy" style="width:70px">
                    <img src="/Bilder/map/marker/missions/` + icon +  `_3.png" style="height:20px">
                    <img src="/Bilder/map/marker/missions/` + icon +  `_2.png" style="height:20px">
                    <img src="/Bilder/map/marker/missions/` + icon +  `_1.png" style="height:20px">
                </div>
            </div>
                <div class="box_single_content_single">Münzen: ` + credits + `</div>
                <div class="box_single_content_single">
                    <table>
                        <thead><tr>
                            <th>Fahrzeug</th>
                            <th>Anzahl</th>
                        </tr></thead>
                        <tbody>
                            ` + vehTable + `
                        </tbody>
                    </table>
                </div>
            </div>`;

        $("#missionOverview").append(missionHTML);
    }

    function createBody()
    {
        $("body").html(`
                <div class="mainarea" style="height: 100%; top: 0;">
                    <div style="height: 100%; width: 100%; position: fixed; top: 0; left: 0; text-align: right;" onclick="closeFrame()">
                        <svg class="svg-inline--fa fa-times fa-w-11" style="font-size: 2.5em; padding: 2%; color: #EA2027; cursor: pointer;" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" data-fa-i2svg=""><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg><!-- <i class="fas fa-times" style="font-size: 2.5em; padding: 2%; color: #EA2027; cursor: pointer"></i> -->
                    </div>
                    <script>
                        function closeFrame() {
                            iframe = $("#iframe", parent.document);
                            iframe.fadeOut(500, function() {
                                parent.document.getElementById("iframe").src="";
                                iframe.css('opacity', '1');
                                parent.document.getElementById("mainarea").style.overflow = "auto";
                                parent.document.getElementById("mainarea").style.width = "100%";
                                parent.updateData();
                                
                            });
                            //iframe.delay(500).css("display","none");
                            
                        };
                        $(document).keyup(function(e) {
                          if (e.keyCode === 27) closeFrame();   // esc
                        });
                    </script>
                    <div id='hv-center' style=\"transform: translate(-50%); top: 5%; margin-bottom: 2%; height: auto !important;\">
                        <div class="box_all border_feuerwehr" style="margin:0px;">
                        <div class="box_all_headline_border">
                            <div class="box_all_headline">
                            Einsatzübersicht
                            </div>
                        </div>
                        <div id="missionOverview">
                            
                        </div>
                        </div>
                    </div>
                </div>`);
    }


    init();

})();