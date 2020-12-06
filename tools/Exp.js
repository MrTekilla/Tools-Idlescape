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
			var compos = [];
			for(j = 0 ; j < e.resources[i].length ; j++){
				totalPrice += e.resources[i][j].price * e.resources[i][j].quantity;
				nameCompos += e.resources[i][j].name + (j == (e.resources[i].length - 1) ? "" : " + ");
				compos.push({"name":e.resources[i][j].name,"price" : e.resources[i][j].price, "quantity":e.resources[i][j].quantity});
			}
			var tmpResult = {
				"name" : e.name + (e.resources.length > 1 ? " (Recipe : " + nameCompos + ")" : ""),
				"prix" : millionFormate(totalPrice),
				"exp" : millionFormate(e.exp),
				"prix_1xp" :  (totalPrice/e.exp).toFixed(2),
				"compos" : compos
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
		//document.getElementById("Exp").getElementsByClassName("table")[0].tBodies[0].innerHTML += "<tr><th scope=\"row\">"+i+"</th><td><i class=\"glyphicon glyphicon-triangle-right\"></i>\t" + e.name + "</td><td>" + e.prix + "</td><td>" + e.exp + "</td><td>" + e.prix_1xp + "</td></tr>"
		document.getElementById("Exp").getElementsByClassName("table")[0].tBodies[0].innerHTML +=
		"<tr><th scope=\"row\">"+i+
		"</th><td><a class=\"btn btn-primary\" data-toggle=\"collapse\" href=\"#collapseExp"+i+"\" role=\"button\" aria-expanded=\"false\" aria-controls=\"collapseExp"+i+"\"><i class=\"glyphicon glyphicon-triangle-right\"></i>\t " + e.name + "</a>" +
		"<div class=\"collapse\" id=\"collapseExp"+i+"\"><div class=\"card card-body\">" + generateComposHtml(e.compos) + "</div></div>" +
		"</td><td>" + e.prix +
		"</td><td>" + e.exp +
		"</td><td>" + e.prix_1xp +
		"</td></tr>";
		//console.log(e.name + " -> Prix : " + e.prix + " | exp : " + e.exp + " | prix 1xp : " + e.prix_1xp);
		i++;
	});
}

