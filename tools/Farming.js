function callFetchFarming(refresh = false) {
	document.getElementById("Seeds").getElementsByClassName("table")[0].tBodies[0].innerHTML = "<p>Fetching data from <a href=\"https://idlescape.xyz\">https://idlescape.xyz</a></p>";
	fetch('https://api.idlescape.xyz/farming')
		.then(response => response.json())
		.then(json => traitementDataSeeds(json, refresh));
}


//-------------------------------------------
//Calculs
var actualSortSeeds = "prix_1xp";
var sortOrderSeeds = false;
var finalResultsSeeds = [], seedsListOverview = [];
function traitementDataSeeds(json, refresh) {
	finalResultsSeeds = [];
	json.seeds.forEach(e => {

		var compos = [];
		e.yield.forEach(c => {
			//console.log(c.name);
			compos.push({ "name": c.name, "price": c.price, "min": c.min, "max": c.max, "chance": c.chance * 100 });
		});

		var tmpResult = {
			"img": e.image,
			"name": e.name,
			"compos": compos,
			"prix": millionFormate(e.price),
			"exp": millionFormate(e.exp),
			"minutes": e.minutes,
			"width": e.width,
			"height": e.height,
			"benefMin": e.minGoldPerSeed - e.price,
			"benefMax": e.maxGoldPerSeed - e.price,
			"prix_1xp": (e.price / e.exp).toFixed(2),
			"xpMinute": ((e.exp / (e.width * e.height)) / e.minutes).toFixed(2)
		}

		finalResultsSeeds.push(tmpResult);
		//compos = [];

	});
	seedsListOverview = finalResultsSeeds;
	fillSeedsListOverview();
	sortByValueSeeds(actualSortSeeds, refresh);

}

function fillSeedsListOverview(){
	seedsListOverview.sort(function (a, b) {
		return parseFloat(b["benefMax"]) - parseFloat(a["benefMax"]);
	});
	fillSeedsOverview(seedsListOverview);
}

function sortByValueSeeds(value, refresh) {
	//var t0 = performance.now();
	if (!refresh) {

		if (actualSortSeeds == value) {
			sortOrderSeeds = !sortOrderSeeds;
		} else {
			sortOrderSeeds = false;
		}

		actualSortSeeds = value;
	}

	finalResultsSeeds.sort(function (a, b) {
		return parseFloat(sortOrderSeeds ? a[value] : b[value]) - parseFloat(sortOrderSeeds ? b[value] : a[value]);
	});
	//var t1 = performance.now();
	//console.log("Sorting took " + (t1 - t0) + " milliseconds.");

	populateSeeds();

}

function populateSeeds() {
	var i = 1;
	var tmpDoc = document.getElementById("Seeds").getElementsByClassName("table")[0].tBodies[0];
	tmpDoc.innerHTML = "";
	finalResultsSeeds.forEach(e => {
		//console.log(e.compos);
		tmpDoc.innerHTML +=
			"<tr><th scope=\"row\" class=\"thImg\"><img src=\"" + (websiteURL + e.img) + "\" class=\"widthSet\">" +
			"</th><td><a class=\"btn btn-primary\" data-toggle=\"collapse\" href=\"#collapseSeeds" + i + "\" role=\"button\" aria-expanded=\"false\" aria-controls=\"collapseSeeds" + i + "\"><i class=\"glyphicon glyphicon-triangle-right\"></i>\t " + e.name + "</a>" +
			"<div class=\"collapse\" id=\"collapseSeeds" + i + "\"><div class=\"card card-body\">" + resultSeeds(e.compos) + "</div></div>" +
			"</td><td>" + e.prix +
			"</td><td>" + e.exp +
			"</td><td>" + e.minutes +
			"</td><td>" + e.width + "x" + e.height +
			"</td><td class=\"" + (e.benefMin > 0 ? "positive" : "negative") + "\"" + "><b>" + millionFormate(e.benefMin) + "</b>" +
			"</td><td class=\"" + (e.benefMax > 0 ? "positive" : "negative") + "\"" + "><b>" + millionFormate(e.benefMax) + "</b>" +
			"</td><td>" + e.xpMinute +
			"</td><td>" + e.prix_1xp +
			"</td></tr>";
		//console.log(e.name + " -> Prix market: " + e.prix + " | exp total : " + e.exp + " | " + e.width + "x" + e.height + " | xp/bloc/min : " + e.xpMinute + " | prix 1xp : " + e.prix_1xp);
		i++;
	});
}

function resultSeeds(compos) {
	var newHtml = "", composHtml = "";
	var i;

	for (i = 0; i < compos.length; i++) {
		composHtml += "<tr><th scope=\"row\" class=\"thImg\">" + (i + 1) +
			"</th><td>" + compos[i].name +
			"</td><td>" + millionFormate(compos[i].price) +
			"</td><td>" + millionFormate(compos[i].chance) + "%" +
			"</td><td>" + millionFormate(compos[i].min) +
			"</td><td>" + millionFormate(compos[i].max) +
			"</td></tr>";
	}
	newHtml += "<table class=\"table\"><thead><tr>" +
		"<th scope=\"col\">#</th>" +
		"<th scope=\"col\">Name</th>" +
		"<th scope=\"col\">Price</th>" +
		"<th scope=\"col\">Chance</th>" +
		"<th scope=\"col\">Min</th>" +
		"<th scope=\"col\">Max</th></tr></thead>" +
		"<tbody>" +
		composHtml +
		"</tbody>" +
		"</table>";
	return newHtml;
}

