function callFetchSmithing(refresh = false) {
    document.getElementById("SmithingBarContent").getElementsByClassName("table")[0].tBodies[0].innerHTML = "<p>Fetching data from <a href=\"https://idlescape.xyz\">https://idlescape.xyz</a></p>";
    fetch('https://api.idlescape.xyz/smelting')
        .then(response => response.json())
        .then(json => initSmithingData(json, refresh));
}

//-------------------------------------------
//Calculs
var finalResultsSmithing = [], selectSmithingRecipe = [], smeltListOverview = [];
var jsonSmithing;
var buffWealthSmithing = 0, buffScholarSmithing = 0, buffPyromancySmithing = 0, buffIntuitionSmithing = 0;
var actualSortSmithing = "prix_1xp";
var sortOrderSmithing = false;

function initSmithingData(json, refresh){
    jsonSmithing = json;
    traitementDataSmithing(refresh);
}

function traitementDataSmithing(refresh) {
    buffWealthSmithing = parseInt((document.getElementById("WealthBuff").value == "") ? "0" : document.getElementById("WealthBuff").value);
    buffScholarSmithing = parseInt((document.getElementById("ScholarBuff").value == "") ? "0" : document.getElementById("ScholarBuff").value);
    buffPyromancySmithing = parseInt((document.getElementById("PyromancyBuff").value == "") ? "0" : document.getElementById("PyromancyBuff").value);
    buffIntuitionSmithing = parseInt((document.getElementById("IntuitionBuff").value == "") ? "0" : document.getElementById("IntuitionBuff").value);
    finalResultsSmithing = [];
	jsonSmithing.smelts.forEach(e => {
		var totalPrice = 0;
		var nameCompos = "";
		var i, j;
		for (i = 0; i < e.resources.length; i++) {
			var compos = [];
			for (j = 0; j < e.resources[i].length; j++) {
                var quantityAfterBuff = ((e.resources[i][j].name) == "Heat" ? (e.resources[i][j].quantity - (e.resources[i][j].quantity * buffPyromancySmithing / 100)) : e.resources[i][j].quantity);
				totalPrice += e.resources[i][j].price * quantityAfterBuff;
				nameCompos += e.resources[i][j].name + (j == (e.resources[i].length - 1) ? "" : " + ");
                compos.push({
                    "name": e.resources[i][j].name,
                    "price": e.resources[i][j].price,
                    "originalQuantity": quantityAfterBuff,
                    "quantity": quantityAfterBuff,
                    "img": e.resources[i][j].image
                });
            }
			var prixStore = findItemFromjs(e.name);
            var tmpBenef = e.price - totalPrice;
            var realStorePrice = ((buffWealthSmithing == 0) ? prixStore : (prixStore + (prixStore * buffWealthSmithing / 100)));
			var benefStore = realStorePrice - totalPrice;
            var benef = tmpBenef - Math.abs((e.price * 0.05))
            var IntuitionBuffExp = ((buffIntuitionSmithing) == 0 ? 0 : (e.exp * buffIntuitionSmithing / 100));
            var ScholarBuffExp = ((buffScholarSmithing) == 0 ? 0 : (e.exp * buffScholarSmithing / 100));
            var realXp = e.exp + IntuitionBuffExp + ScholarBuffExp;
			var tmpResult = {
				"id": finalResultsSmithing.length,
				"img": e.image,
				"name": e.name + (e.resources.length > 1 ? " (" + nameCompos + ")" : ""),
				"level": e.level,
				"CraftingPrice": totalPrice,
				"MarketPrice": e.price,
				"Benefits": benef,
				"exp": realXp,
				"prix_1xp": (totalPrice / realXp).toFixed(2),
				"ppxBenef": ((((e.price  - Math.abs((e.price * 0.05))) - totalPrice) * 100) / totalPrice).toFixed(2),
				"compos": compos,
				"StorePrice" : realStorePrice,
				"StorePriceBenef" : benefStore,
                "StorePriceBenefppx" : (((realStorePrice - totalPrice) * 100) / totalPrice).toFixed(2),
                "buffWealthSmithing" : buffWealthSmithing,
                "buffScholarSmithing" : buffScholarSmithing,
                "buffPyromancySmithing" : buffPyromancySmithing,
                "buffIntuitionSmithing" : buffIntuitionSmithing
				/*"compoArray" : generateComposHtml(compos)*/
			}
			//Percentage profits formula : ((v2 - v1)*100)/v1 -> V2 : Selling price (Including marketplace fees) | V1 : Crafting price

			finalResultsSmithing.push(tmpResult);
			nameCompos = "";
			totalPrice = 0;
        }
    });
    selectSmithingRecipe = finalResultsSmithing;
    sortByValueSmelting(actualSortSmithing, refresh);
	sortByString(selectSmithingRecipe);
	fillSmeltListOverview();
	populateSelectSmithing(selectSmithingRecipe);
}

function fillSmeltListOverview(){
	smeltListOverview = finalResultsSmithing;
	smeltListOverview.sort(function (a, b) {
		return parseFloat(b["Benefits"]) - parseFloat(a["Benefits"]);
	});
	fillSmeltOverview(smeltListOverview);
}


function refreshBuffValue(){
    traitementDataSmithing(true);
}

function populateSmithing() {
	//var t0 = performance.now();
	var i = 1;
	var docTmp = document.getElementById("SmithingBarContent").getElementsByClassName("table")[0].tBodies[0];
	docTmp.innerHTML = "";
	for (i = 0; i < finalResultsSmithing.length; i++) {
		docTmp.innerHTML +=
			"<tr class=\"accordion-toggle\">"+
			"<th scope=\"row\" class=\"thImg\"><img src=\"" + (websiteURL + finalResultsSmithing[i].img) + "\" class=\"widthSet\">" +
			"</th><td><a class=\"btn btn-primary\" data-toggle=\"collapse\" href=\"#collapseSmelting" + i + "\" role=\"button\" aria-expanded=\"false\" aria-controls=\"collapseSmelting" + i + "\"><i class=\"glyphicon glyphicon-triangle-right\"></i>\t " + finalResultsSmithing[i].name + "</a>" +
			"</td><td>" + finalResultsSmithing[i].level +
			"</td><td>" + millionFormate(finalResultsSmithing[i].exp) +
			"</td><td>" + millionFormate(finalResultsSmithing[i].CraftingPrice) +
			"</td><td>" + millionFormate(finalResultsSmithing[i].MarketPrice) +
			"</td><td class=\"" + (finalResultsSmithing[i].Benefits > 0 ? "positive" : "negative") + "\"" + "><b>" + millionFormate(finalResultsSmithing[i].Benefits) + "</b>" +
			"</td><td class=\"" + (finalResultsSmithing[i].ppxBenef > 0 ? "positive" : "negative") + "\"" + "><b>" + (finalResultsSmithing[i].ppxBenef > 0 ? "+" : "") + millionFormate(finalResultsSmithing[i].ppxBenef) + "%</b>" +
			"</td><td>" + millionFormate(finalResultsSmithing[i].StorePrice) +
			"</td><td class=\"" + (finalResultsSmithing[i].StorePriceBenef > 0 ? "positive" : "negative") + "\"" + "><b>" + millionFormate(finalResultsSmithing[i].StorePriceBenef) + "</b>" +
			"</td><td class=\"" + (finalResultsSmithing[i].StorePriceBenefppx > 0 ? "positive" : "negative") + "\"" + "><b>" + (finalResultsSmithing[i].StorePriceBenefppx > 0 ? "+" : "") + millionFormate(finalResultsSmithing[i].StorePriceBenefppx) + "%</b>" +
			"</td><td>" + finalResultsSmithing[i].prix_1xp +
			"</td></tr>" +
			"<tr style=\"pointer-events: none;\">" +
			"<td></td>" +
			"<td colspan=\"3\">" +
				"<div id=\"collapseSmelting" + i + "\" class=\"collapse in\">" +
					generateComposHtml(finalResultsSmithing[i].compos) +
				"</div>" +
			"</td>" +
			"</tr>";
	}

}

function sortByValueSmelting(value, refresh) {
	//var t0 = performance.now();
	if (!refresh) {

		if (actualSortSmithing == value) {
			sortOrderSmithing = !sortOrderSmithing;
		} else {
			sortOrderSmithing = false;
		}

		actualSortSmithing = value
	}

	finalResultsSmithing.sort(function (a, b) {
		return parseFloat(sortOrderSmithing ? a[value] : b[value]) - parseFloat(sortOrderSmithing ? b[value] : a[value]);
	});

	populateSmithing();
}

function populateSelectSmithing(list) {
    document.getElementById("selectedSmithingRecipe").innerHTML = "";
	list.forEach(e => {
		document.getElementById("selectedSmithingRecipe").innerHTML +=
			"<option>" + e.name + "</option>";
	});

}


