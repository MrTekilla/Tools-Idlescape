function callFetchExp(){
    document.getElementById("Exp").getElementsByClassName("table")[0].tBodies[0].innerHTML = "<p>Fetchning data from <a href=\"https://idlescape.xyz\">https://idlescape.xyz</a></p>";
    fetch('https://api.idlescape.xyz/crafting')
        .then(response => response.json())
        .then(json => traitementDataExp(json));
}

//-------------------------------------------
//Calculs
var finalResultsExp = [];

function traitementDataExp(json){
    finalResultsExp = [];
    json.crafts.forEach(e => {
    	var totalPrice = 0;
        var nameCompos = "";
        var i,j;
        for(i = 0 ; i < e.resources.length ; i++){
            for(j = 0 ; j < e.resources[i].length ; j++){
                totalPrice += e.resources[i][j].price * e.resources[i][j].quantity;
                nameCompos += e.resources[i][j].name + (j == (e.resources[i].length - 1) ? "" : " + ");
            }
            var tmpResult = {
                "name" : e.name + (e.resources.length > 1 ? " (Recipe : " + nameCompos + ")" : ""),
                "prix" : millionFormate(totalPrice),
                "exp" : millionFormate(e.exp),
                "prix_1xp" :  (totalPrice/e.exp).toFixed(2)
            }

            finalResultsExp.push(tmpResult);
            nameCompos = "";
        }
    });

    finalResultsExp.sort(function(a, b) {
        return parseFloat(a.prix_1xp) - parseFloat(b.prix_1xp);
    });

    //console.log(finalResultsExp);

    var i = 1;
    document.getElementById("Exp").getElementsByClassName("table")[0].tBodies[0].innerHTML = "";
    finalResultsExp.forEach(e => {
        document.getElementById("Exp").getElementsByClassName("table")[0].tBodies[0].innerHTML += "<tr><th scope=\"row\">"+i+"</th><td>" + e.name + "</td><td>" + e.prix + "</td><td>" + e.exp + "</td><td>" + e.prix_1xp + "</td></tr>"
    	//console.log(e.name + " -> Prix : " + e.prix + " | exp : " + e.exp + " | prix 1xp : " + e.prix_1xp);
        i++;
    });
}

//callFetchExp();