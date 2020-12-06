function callFetchSeeds(){
	document.getElementById("Seeds").getElementsByClassName("table")[0].tBodies[0].innerHTML = "<p>Fetchning data from <a href=\"https://idlescape.xyz\">https://idlescape.xyz</a></p>";
	fetch('https://api.idlescape.xyz/farming')
    .then(response => response.json())
    .then(json => traitementDataSeeds(json));
}


//-------------------------------------------
//Tools
function millionFormate(value){
  var nf = new Intl.NumberFormat('en-DE', { minimumFractionDigits: 2  });
  return nf.format(value);
}

//-------------------------------------------
//Calculs
var finalResultsSeeds = [];
function traitementDataSeeds(json){
	finalResultsSeeds = [];
	json.seeds.forEach(e => {
		var tmpResult = {
			"name" : e.name,
			"prix" : millionFormate(e.price),
			"exp" : millionFormate(e.exp),
			"width" : e.width,
			"height" : e.height,
			"prix_1xp" :  (e.price/e.exp).toFixed(2),
			"xpMinute" :  ((e.exp/(e.width*e.height))/e.minutes).toFixed(2)
		}

		finalResultsSeeds.push(tmpResult);
	});

	//sortByXpMinute();
	sortByPriceXP();

}


function sortByXpMinute(){
	finalResultsSeeds.sort(function(a, b) {
	    return parseFloat(b.xpMinute) - parseFloat(a.xpMinute);
	});
	var i = 1;
	document.getElementById("Seeds").getElementsByClassName("table")[0].tBodies[0].innerHTML = "";
	finalResultsSeeds.forEach(e => {
        document.getElementById("Seeds").getElementsByClassName("table")[0].tBodies[0].innerHTML += "<tr><th scope=\"row\">"+i+"</th><td>" + e.name + "</td><td>" + e.prix +  "</td><td>" + e.exp +"</td><td>" + e.width + "x" + e.height +"</td><td>" + e.xpMinute + "</td><td>" + e.prix_1xp + "</td></tr>"
		//console.log(e.name + " -> Prix market: " + e.prix + " | exp total : " + e.exp + " | " + e.width + "x" + e.height + " | prix 1xp : " + e.prix_1xp + " | xp/bloc/min : " + e.xpMinute);
		i++;
	});
}

function sortByPriceXP(){
	finalResultsSeeds.sort(function(a, b) {
	    return parseFloat(a.prix_1xp) - parseFloat(b.prix_1xp);
	});

	var i = 1;
	document.getElementById("Seeds").getElementsByClassName("table")[0].tBodies[0].innerHTML = "";
	finalResultsSeeds.forEach(e => {
        document.getElementById("Seeds").getElementsByClassName("table")[0].tBodies[0].innerHTML += "<tr><th scope=\"row\">"+i+"</th><td>" + e.name + "</td><td>" + e.prix +  "</td><td>" + e.exp +"</td><td>" + e.width + "x" + e.height +"</td><td>" + e.xpMinute + "</td><td>" + e.prix_1xp + "</td></tr>"
		//console.log(e.name + " -> Prix market: " + e.prix + " | exp total : " + e.exp + " | " + e.width + "x" + e.height + " | xp/bloc/min : " + e.xpMinute + " | prix 1xp : " + e.prix_1xp);
		i++;
	});
}