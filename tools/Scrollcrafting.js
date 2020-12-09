function callFetchScrolls(refresh = false){
	document.getElementById("scrollingTable").getElementsByClassName("table")[0].tBodies[0].innerHTML = "<p>Fetchning data from <a href=\"https://idlescape.xyz\">https://idlescape.xyz</a></p>";
	fetch('https://api.idlescape.xyz/scrolls')
		.then(response => response.json())
		.then(json => traitementDataScrolls(json,refresh));
}

//-------------------------------------------
//Calculs
var finalResultsScrolls = [], selectScrollRecipe = [];
var actualSortScrolls = "prix_1xp";
var sortOrderScrolls = false;
var sortingScrollName = null;
var customScrollLevel = 0;

function traitementDataScrolls(json,refresh){
	finalResultsScrolls = [];
	json.scrolls.forEach(e => {
		var totalPrice = 0;
		var compos = [];
		var mindRune = false;
		e.resources[0].forEach(c => {
			totalPrice += c.price * c.quantity;
			if(c.name == "Mind Rune"){
				mindRune = true;
			}
			compos.push({"name":c.name,"price" : c.price, "quantity":c.quantity});
			//console.log({"name":c.name,"price" : c.price, "quantity":c.quantity});
		});

		var tmpResult = {
			"id" : finalResultsScrolls.length,
			"name" : e.name,
			"level" : e.level,
			"CraftingPrice" : totalPrice,
			"MarketPrice" : e.price,
			"exp" : e.exp,
			"Benefits" : e.price - totalPrice,
			"prix_1xp" :  (totalPrice/e.exp).toFixed(2),
			"mindRune" : mindRune ? "Yes" : "No",
			"ppxBenef" : ((e.price-totalPrice)/e.exp).toFixed(2),
			"compos"  : compos
		}

		finalResultsScrolls.push(tmpResult);
		compos = [];

	});

	selectScrollRecipe = finalResultsScrolls;
	sortByValueScrolls(actualSortScrolls,refresh);
	sortByString(selectScrollRecipe);
	populateSelectScroll(selectScrollRecipe);
}


function sortByValueScrolls(value,refresh){
	if(!refresh){
		if(actualSortScrolls == value){
			sortOrderScrolls = !sortOrderScrolls;
		}else{
			sortOrderScrolls = false;
		}

		actualSortScrolls = value
	}

	finalResultsScrolls.sort(function(a, b) {
		return parseFloat(sortOrderScrolls ? a[value] : b[value]) - parseFloat(sortOrderScrolls ? b[value] : a[value]);
	});

	populateScrolls(sortingScrollName,customScrollLevel);

}


function populateScrolls(craftName, sortingLevel){
	var i = 1;
	document.getElementById("scrollingTable").getElementsByClassName("table")[0].tBodies[0].innerHTML = "";
	finalResultsScrolls.forEach(e => {
		if(craftName != null && !e.name.toLowerCase().match(craftName)){
			return;
		}
		if(sortingLevel != 0 && parseInt(e.level) > sortingLevel){
			return;
		}
		document.getElementById("scrollingTable").getElementsByClassName("table")[0].tBodies[0].innerHTML +=
		"<tr><th scope=\"row\">"+i+
		"</th><td><a class=\"btn btn-primary\" data-toggle=\"collapse\" href=\"#collapseScrolls"+i+"\" role=\"button\" aria-expanded=\"false\" aria-controls=\"collapseScrolls"+i+"\"><i class=\"glyphicon glyphicon-triangle-right\"></i>\t " + e.name + "</a>" +
		"<div class=\"collapse\" id=\"collapseScrolls"+i+"\"><div class=\"card card-body\">" + generateComposHtml(e.compos) + "</div></div>" +
		"</td><td>" + e.level +
		"</td><td>" + e.mindRune +
		"</td><td>" + millionFormate(e.CraftingPrice) +
		"</td><td>" + millionFormate(e.MarketPrice) +
		"</td><td class=\"" + (e.Benefits > 0 ? "positive" : "negative") + "\""+ "><b>" + millionFormate(e.Benefits) + "</b>" +
		"</td><td>" + millionFormate(e.exp) +
		"</td><td class=\"" + (e.ppxBenef > 0 ? "positive" : "negative") + "\""+ "><b>" + millionFormate(e.ppxBenef) + "</b>" +
		"</td><td>" + e.prix_1xp +
		"</td></tr>";
		//console.log(e.name + " -> Prix craft: " + e.prix + " | exp : " + e.exp + " | prix 1xp : " + e.prix_1xp);
		i++;
	});
}

function findScrollName(value){
	if(value == ""){
		sortingScrollName = null;
	}
	populateScrolls(value,customCraftingLevel);
	sortingScrollName = value;
}

function findScrollByLevel(value){
	if(parseInt(value) > 99){
		value = 99;
	}else if(parseInt(value) < 0){
		value = 0;
	}
	customScrollLevel = value;
	populateScrolls(sortingScrollName,customScrollLevel);
}

function populateSelectScroll(list){
	list.forEach(e => {
		document.getElementById("selectedScrollRecipe").innerHTML +=
		"<option>" + e.name + "</option>";
	});

}