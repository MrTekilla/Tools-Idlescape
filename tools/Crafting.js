function callFetchCrafting(refresh = false){
	document.getElementById("craftingTable").getElementsByClassName("table")[0].tBodies[0].innerHTML = "<p>Fetchning data from <a href=\"https://idlescape.xyz\">https://idlescape.xyz</a></p>";
	fetch('https://api.idlescape.xyz/crafting')
		.then(response => response.json())
		.then(json => traitementDataCrafting(json,refresh));
}

//-------------------------------------------
//Calculs
var finalResultsExp = [], selectCraftRecipe = [];
var actualSortExp = "prix_1xp";
var sortOrderExp = false;
var sortingCraftingName = null;
var customCraftingLevel = 0;
function traitementDataCrafting(json,refresh){
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
				compos.push({"name":e.resources[i][j].name,"price" : e.resources[i][j].price, "quantity":e.resources[i][j].quantity, "img":e.resources[i][j].image});
			}
			var tmpBenef = e.price - totalPrice;
			var benef = tmpBenef - Math.abs((e.price * 0.05))
			var tmpResult = {
				"id" : finalResultsExp.length,
				"img" : e.image,
				"name" : e.name + (e.resources.length > 1 ? " (Recipe : " + nameCompos + ")" : ""),
				"level" : e.level,
				"CraftingPrice" : totalPrice,
				"MarketPrice" : e.price,
				"Benefits" : benef,
				"exp" : e.exp,
				"prix_1xp" :  (totalPrice/e.exp).toFixed(2),
				"ppxBenef" : (benef/e.exp).toFixed(2),
				"compos" : compos
			}

			finalResultsExp.push(tmpResult);
			nameCompos = "";
			totalPrice = 0;
		}
	});
	selectCraftRecipe = finalResultsExp;
	sortByValueCrafting(actualSortExp,refresh);
	sortByString(selectCraftRecipe);
	populateSelectCraft(selectCraftRecipe);
}

function sortByValueCrafting(value,refresh){
	
	if(!refresh){

		if(actualSortExp == value){
			sortOrderExp = !sortOrderExp;
		}else{
			sortOrderExp = false;
		}

		actualSortExp = value
	}

		finalResultsExp.sort(function(a, b) {
			return parseFloat(sortOrderExp ? a[value] : b[value]) - parseFloat(sortOrderExp ? b[value] : a[value]);
		});

	populateCrafting(sortingCraftingName,customCraftingLevel);
}





function populateCrafting(craftName, sortingLevel){
	var i = 1;
	document.getElementById("craftingTable").getElementsByClassName("table")[0].tBodies[0].innerHTML = "";
	finalResultsExp.forEach(e => {
		if(craftName != null && !e.name.toLowerCase().match(craftName)){
			return;
		}
		if(sortingLevel != 0 && parseInt(e.level) > sortingLevel){
			return;
		}
		document.getElementById("craftingTable").getElementsByClassName("table")[0].tBodies[0].innerHTML +=
		"<tr><th scope=\"row\"><img src=\""+(websiteURL + e.img)+"\" class=\"widthSet\">"+
		"</th><td><a class=\"btn btn-primary\" data-toggle=\"collapse\" href=\"#collapseExp"+i+"\" role=\"button\" aria-expanded=\"false\" aria-controls=\"collapseExp"+i+"\"><i class=\"glyphicon glyphicon-triangle-right\"></i>\t " + e.name + "</a>" +
		"<div class=\"collapse\" id=\"collapseExp"+i+"\"><div class=\"card card-body\">" + generateComposHtml(e.compos) + "</div></div>" +
		"</td><td>" + e.level +
		"</td><td>" + millionFormate(e.CraftingPrice) +
		"</td><td>" + millionFormate(e.MarketPrice) +
		"</td><td class=\"" + (e.Benefits > 0 ? "positive" : "negative") + "\""+ "><b>" + millionFormate(e.Benefits) + "</b>" +
		"</td><td>" + millionFormate(e.exp) +
		"</td><td class=\"" + (e.ppxBenef > 0 ? "positive" : "negative") + "\""+ "><b>" + millionFormate(e.ppxBenef) + "</b>" +
		"</td><td>" + e.prix_1xp +
		"</td></tr>";
		//console.log(e.name + " -> Prix : " + e.prix + " | exp : " + e.exp + " | prix 1xp : " + e.prix_1xp);
		i++;
	});
}

function findCraftName(value){
	if(value == ""){
		sortingCraftingName = null;
	}
	populateCrafting(value,customCraftingLevel);
	sortingCraftingName = value;
}

function findCraftByLevel(value){
	if(parseInt(value) > 99){
		value = 99;
	}else if(parseInt(value) < 0){
		value = 0;
	}
	customCraftingLevel = value;
	populateCrafting(sortingCraftingName,customCraftingLevel);
}

function populateSelectCraft(list){
	list.forEach(e => {
		document.getElementById("selectedCraftRecipe").innerHTML +=
		"<option>" + e.name + "</option>";
	});

}
