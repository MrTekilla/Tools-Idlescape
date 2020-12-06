function callFetchScrolls(){
	document.getElementById("Scrolls").getElementsByClassName("table")[0].tBodies[0].innerHTML = "<p>Fetchning data from <a href=\"https://idlescape.xyz\">https://idlescape.xyz</a></p>";
	fetch('https://api.idlescape.xyz/scrolls')
		.then(response => response.json())
		.then(json => traitementDataScrolls(json));
}

//-------------------------------------------
//Calculs
var finalResultsScrolls = [];
function traitementDataScrolls(json){
	finalResultsScrolls = [];
	json.scrolls.forEach(e => {
		var totalPrice = 0;
		var compos = [];
		e.resources[0].forEach(c => {
			totalPrice += c.price * c.quantity;
			compos.push({"name":c.name,"price" : c.price, "quantity":c.quantity});
			//console.log({"name":c.name,"price" : c.price, "quantity":c.quantity});
		});

		var tmpResult = {
			"name" : e.name,
			"prix" : millionFormate(totalPrice),
			"exp" : millionFormate(e.exp),
			"prix_1xp" :  (totalPrice/e.exp).toFixed(2),
			"compos"  : compos
		}

		finalResultsScrolls.push(tmpResult);
		compos = [];

	});

	finalResultsScrolls.sort(function(a, b) {
		return parseFloat(a.prix_1xp) - parseFloat(b.prix_1xp);
	});

	var i = 1;
	document.getElementById("Scrolls").getElementsByClassName("table")[0].tBodies[0].innerHTML = "";
	finalResultsScrolls.forEach(e => {
		document.getElementById("Scrolls").getElementsByClassName("table")[0].tBodies[0].innerHTML +=
		"<tr><th scope=\"row\">"+i+
		"</th><td><a class=\"btn btn-primary\" data-toggle=\"collapse\" href=\"#collapseScrolls"+i+"\" role=\"button\" aria-expanded=\"false\" aria-controls=\"collapseScrolls"+i+"\"><i class=\"glyphicon glyphicon-triangle-right\"></i>\t " + e.name + "</a>" +
		"<div class=\"collapse\" id=\"collapseScrolls"+i+"\"><div class=\"card card-body\">" + generateComposHtml(e.compos) + "</div></div>" +
		"</td><td>" + e.prix +
		"</td><td>" + e.exp +
		"</td><td>" + e.prix_1xp +
		"</td></tr>";
		//console.log(e.name + " -> Prix craft: " + e.prix + " | exp : " + e.exp + " | prix 1xp : " + e.prix_1xp);
		i++;
	});

}



