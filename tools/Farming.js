function callFetchFarming(refresh = false) {
	document.getElementById("Seeds").getElementsByClassName("table")[0].tBodies[0].innerHTML = "<p>Fetchning data from <a href=\"https://idlescape.xyz\">https://idlescape.xyz</a></p>";
	fetch('https://api.idlescape.xyz/farming')
		.then(response => response.json())
		.then(json => traitementDataSeeds(json, refresh));
}


//-------------------------------------------
//Calculs
var actualSortSeeds = "prix_1xp";
var sortOrderSeeds = false;
var finalResultsSeeds = [];
function traitementDataSeeds(json,refresh) {
	finalResultsSeeds = [];
	json.seeds.forEach(e => {
		var tmpResult = {
			"img": e.image,
			"name": e.name,
			"prix": millionFormate(e.price),
			"exp": millionFormate(e.exp),
			"minutes": e.minutes,
			"width": e.width,
			"height": e.height,
			"prix_1xp": (e.price / e.exp).toFixed(2),
			"xpMinute": ((e.exp / (e.width * e.height)) / e.minutes).toFixed(2)
		}

		finalResultsSeeds.push(tmpResult);
	});

	sortByValueSeeds(actualSortSeeds, refresh);

}

function sortByValueSeeds(value, refresh) {
	var t0 = performance.now();
	if (!refresh) {

		if (actualSortSeeds == value) {
			sortOrderSeeds = !sortOrderSeeds;
		} else {
			sortOrderSeeds = false;
		}

		actualSortSeeds = value
	}

	finalResultsSeeds.sort(function (a, b) {
		return parseFloat(sortOrderSeeds ? a[value] : b[value]) - parseFloat(sortOrderSeeds ? b[value] : a[value]);
	});
	var t1 = performance.now();
	console.log("Sorting took " + (t1 - t0) + " milliseconds.");

	populateSeeds();

}

function populateSeeds() {
	var i = 1;
	var tmpDoc = document.getElementById("Seeds").getElementsByClassName("table")[0].tBodies[0];
	tmpDoc.innerHTML = "";
	finalResultsSeeds.forEach(e => {
		tmpDoc.innerHTML +=
			"<tr><th scope=\"row\"><img src=\"" + (websiteURL + e.img) + "\" class=\"widthSet\">" +
			"</th><td>" + e.name +
			"</td><td>" + e.prix +
			"</td><td>" + e.exp +
			"</td><td>" + e.minutes +
			"</td><td>" + e.width + "x" + e.height +
			"</td><td>" + e.xpMinute +
			"</td><td>" + e.prix_1xp +
			"</td></tr>";
		//console.log(e.name + " -> Prix market: " + e.prix + " | exp total : " + e.exp + " | " + e.width + "x" + e.height + " | xp/bloc/min : " + e.xpMinute + " | prix 1xp : " + e.prix_1xp);
		i++;
	});
}