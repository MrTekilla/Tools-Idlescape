function callFetchScrolls(){
	document.getElementById("Scrolls").getElementsByClassName("table")[0].tBodies[0].innerHTML = "<p>Fetchning data from <a href=\"https://idlescape.xyz\">https://idlescape.xyz</a></p>";
	fetch('https://api.idlescape.xyz/scrolls')
	    .then(response => response.json())
	    .then(json => traitementDataScrolls(json));
}

//-------------------------------------------
//Tools
function millionFormate(value){
  var nf = new Intl.NumberFormat('en-DE', { minimumFractionDigits: 2  });
  return nf.format(value);
}

//-------------------------------------------
//Calculs
var finalResultsScrolls = [];
function traitementDataScrolls(json){
	finalResultsScrolls = [];
	json.scrolls.forEach(e => {
		var totalPrice = 0;

		e.resources[0].forEach(c => {
			totalPrice += c.price * c.quantity;
		});

		var tmpResult = {
			"name" : e.name,
			"prix" : millionFormate(totalPrice),
			"exp" : millionFormate(e.exp),
			"prix_1xp" :  (totalPrice/e.exp).toFixed(2)
		}

		finalResultsScrolls.push(tmpResult);
	});

	finalResultsScrolls.sort(function(a, b) {
	    return parseFloat(a.prix_1xp) - parseFloat(b.prix_1xp);
	});

	var i = 1;
	document.getElementById("Scrolls").getElementsByClassName("table")[0].tBodies[0].innerHTML = "";
	finalResultsScrolls.forEach(e => {
        document.getElementById("Scrolls").getElementsByClassName("table")[0].tBodies[0].innerHTML += "<tr><th scope=\"row\">"+i+"</th><td>" + e.name + "</td><td>" + e.prix + "</td><td>" + e.exp + "</td><td>" + e.prix_1xp + "</td></tr>"
		//console.log(e.name + " -> Prix craft: " + e.prix + " | exp : " + e.exp + " | prix 1xp : " + e.prix_1xp);
		i++;
	});

}



