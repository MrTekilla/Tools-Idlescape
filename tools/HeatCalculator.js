function callFetchHeatCalculator(refresh = false){
	document.getElementById("HeatCalculator").getElementsByClassName("table")[0].tBodies[0].innerHTML = "<p>Fetchning data from <a href=\"https://idlescape.xyz\">https://idlescape.xyz</a></p>";
	fetch('https://api.idlescape.xyz/prices')
		.then(response => response.json())
		.then(json => getHeatMaterials(json,refresh));
}

var actualSortHeat = "prix_1heat";
var sortOrderHeat = false;
function getHeatMaterials(json,refresh){
	finalResultsHeatMaterial = [];
	
	json.items.forEach(e => {
		if(e.hasOwnProperty('heat')){
			var tmpResult = {
				"id" : finalResultsHeatMaterial.length,
				"img" : e.image,
				"name" : e.name,
				"heat" : e.heat,
				"MarketPrice" : e.price,
				"prix_1heat" :  (e.price/e.heat).toFixed(2),
			}
			
			finalResultsHeatMaterial.push(tmpResult);
		}
	});
	//console.log(finalResultsHeatMaterial);
	sortByValueHeatCalculator(actualSortHeat,refresh);
	populateHeatCalculator();
}

function populateHeatCalculator(){
	var i = 1;
	document.getElementById("HeatCalculator").getElementsByClassName("table")[0].tBodies[0].innerHTML = "";
	finalResultsHeatMaterial.forEach(e => {
		document.getElementById("HeatCalculator").getElementsByClassName("table")[0].tBodies[0].innerHTML +=
		"<tr><th scope=\"row\"><img src=\""+(websiteURL + e.img)+"\" class=\"widthSet\">"+
		"</th><td>" + e.name +
		"</td><td>" + millionFormate(e.MarketPrice) +
		"</td><td>" + millionFormate(e.heat) +
		"</td><td>" + e.prix_1heat +
		"</td></tr>";
		//console.log(e.name + " -> Prix : " + e.prix + " | exp : " + e.exp + " | prix 1xp : " + e.prix_1xp);
		i++;
	});
}

function sortByValueHeatCalculator(value,refresh){
	
	if(!refresh){

		if(actualSortHeat == value){
			sortOrderHeat = !sortOrderHeat;
		}else{
			sortOrderHeat = false;
		}

		actualSortHeat = value
	}

	finalResultsHeatMaterial.sort(function(a, b) {
			return parseFloat(sortOrderHeat ? a[value] : b[value]) - parseFloat(sortOrderHeat ? b[value] : a[value]);
		});

	populateHeatCalculator();
}
