function callFetchSmithing(refresh = false) {
    document.getElementById("smithingTable").getElementsByClassName("table")[0].tBodies[0].innerHTML = "<p>Fetchning data from <a href=\"https://idlescape.xyz\">https://idlescape.xyz</a></p>";
    fetch('https://api.idlescape.xyz/smelting')
        .then(response => response.json())
        .then(json => traitementDataSmithing(json, refresh));
}

//-------------------------------------------
//Calculs
var finalResultsSmithing = [];
