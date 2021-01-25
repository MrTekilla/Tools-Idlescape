function callFetchComparator() {
    document.getElementById("itemTableOverview").innerHTML = "<p>Fetchning data from <a href=\"https://idlescape.xyz\">https://idlescape.xyz</a></p>";
	document.getElementById("craftingTableOverview").getElementsByClassName("table")[0].tBodies[0].innerHTML = "<p>Fetchning data from <a href=\"https://idlescape.xyz\">https://idlescape.xyz</a></p>";
	document.getElementById("scrollingTableOverview").getElementsByClassName("table")[0].tBodies[0].innerHTML = "<p>Fetchning data from <a href=\"https://idlescape.xyz\">https://idlescape.xyz</a></p>";
    fetch('https://api.idlescape.xyz/prices')
        .then(response => response.json())
        .then(json => initComparator(json));
}
var maxOverview = 5, maxSmeltingOverview = 3, maxSeedsOverview = 3;
var worthItems = [];
var jsonPrices;
function initComparator(json) {
    worthItems = [];
    jsonPrices = json.items;
    jsonPrices.forEach(element => {
        var result = getObjectByName(element.name,itemsList);
        if (typeof (result) != "undefined") {
            //console.log("undefined : " + element.name);
            if (element.price != 0 && result.gamePrice > element.price) {
                //console.log("name : " + result.name + " | store price : " + result.gamePrice + " | marketprice : " + element.price);
                worthItems.push({ "name": result.name , "storePrice" : result.gamePrice, "marketPrice" : element.price, "benef" : result.gamePrice - element.price , "img" : element.image});
            }
        }
    });
    populateItemsOverview();
    fillOpenableItems();
    //populateCraftingOverview();
}

function populateItemsOverview() {
    //var t0 = performance.now();
    var thead = "<table width=\"99%\" class=\"table table-hover\"><thead><tr><th>#</th><th>Name</th><th data-toggle=\"tooltip\" title=\"Price of the item when you sell it to the game.\" scope=\"col\"><img class=\"widthSet\" src=\"https://idlescape.com/images/gold_coin.png\">Store price</th>"+
    "<th data-toggle=\"tooltip\" title=\"Actual price from the marketplace.\" scope=\"col\"><img class=\"widthSet\" src=\"https://idlescape.com/images/ui/marketplace_icon.png\">Market price</th>"+
    "<th data-toggle=\"tooltip\" title=\"Profits once selling the item to the game\" scope=\"col\">Profits</th></tr></thead><tbody>";
    var i = 1;
	//var docTmp = document.getElementById("itemTableOverview").getElementsByClassName("table")[0].tBodies[0];
    //docTmp.innerHTML = "";

    if(worthItems.length == 0){
        document.getElementById("itemTableOverview").innerHTML = "There is no low price item for the moment...";
        return;
    }else{
        worthItems.sort(function (a, b) {
            return parseFloat(b["benef"]) - parseFloat(a["benef"]);
        });
        for (i = 0; i < worthItems.length; i++) {
            thead +=
                "<tr>"+
                "<th scope=\"row\" class=\"thImg\"><img src=\"" + (websiteURL + worthItems[i].img) + "\" class=\"widthSet\">" +
                "</th><td><a>"+ worthItems[i].name + "</a>" +
                "</td><td>" + millionFormate(worthItems[i].storePrice) +
                "</td><td>" + millionFormate(worthItems[i].marketPrice) +
                "</td><td class=\"positive\">" + millionFormate(worthItems[i].benef) +
                "</td></tr>";
        }
        thead += "</tbody></table>";
        document.getElementById("itemTableOverview").innerHTML = thead;
    }
}

function populateCraftingOverview() {
	var i = 1;
	var docTmp = document.getElementById("craftingTableOverview").getElementsByClassName("table")[0].tBodies[0];
	docTmp.innerHTML = "";
	for (i = 0; i < overviewCrafting.length; i++) {
		docTmp.innerHTML +=
			"<tr class=\"accordion-toggle\">"+
			"<th scope=\"row\" class=\"thImg\"><img src=\"" + (websiteURL + overviewCrafting[i].img) + "\" class=\"widthSet\">" +
			"</th><td><a class=\"btn btn-primary\" data-toggle=\"collapse\" href=\"#collapse" + i + "\" role=\"button\" aria-expanded=\"false\" aria-controls=\"collapse" + i + "\"><i class=\"glyphicon glyphicon-triangle-right\"></i>\t " + finalResultsExp[i].name + "</a>" +
			//"<div class=\"collapse\" id=\"collapseExp" + i + "\"><div class=\"card card-body\">" + generateComposHtml(finalResultsExp[i].compos) + "</div></div>" +
			"</td><td class=\"" + (overviewCrafting[i].Benefits > 0 ? "positive" : "negative") + "\"" + "><b>" + millionFormate(overviewCrafting[i].Benefits) + "</b>" +
			"</td><td class=\"" + (overviewCrafting[i].StorePriceBenef > 0 ? "positive" : "negative") + "\"" + "><b>" + millionFormate(overviewCrafting[i].StorePriceBenef) + "</b>" +
			"</td><td>" + overviewCrafting[i].prix_1xp +
			"</td></tr>" +
			"<tr style=\"pointer-events: none;\">" +
			"<td></td>" +
			"<td colspan=\"3\">" +
				"<div id=\"collapse" + i + "\" class=\"collapse in\">" +
					generateComposHtml(overviewCrafting[i].compos) +
				"</div>" +
			"</td>" +
			"</tr>";
	}

}

function populateScrollsOverview() {
	var i = 1;
	var tmpDoc = document.getElementById("scrollingTableOverview").getElementsByClassName("table")[0].tBodies[0];
	tmpDoc.innerHTML = "";
	overviewScrollCrafting.forEach(e => {
		tmpDoc.innerHTML +=
			"<tr><th scope=\"row\" class=\"thImg\"><img src=\"" + (websiteURL + e.img) + "\" class=\"widthSet\">" +
			"</th><td><a class=\"btn btn-primary\" data-toggle=\"collapse\" href=\"#collapseScrolls" + i + "\" role=\"button\" aria-expanded=\"false\" aria-controls=\"collapseScrolls" + i + "\"><i class=\"glyphicon glyphicon-triangle-right\"></i>\t " + e.name + "</a>" +
			//"<div class=\"collapse\" id=\"collapseScrolls" + i + "\"><div class=\"card card-body\">" + generateComposHtml(e.compos) + "</div></div>" +
			"</td><td>" + millionFormate(e.CraftingPrice) +
			"</td><td class=\"" + (e.Benefits > 0 ? "positive" : "negative") + "\"" + "><b>" + millionFormate(e.Benefits) + "</b>" +
			"</td><td>" + e.prix_1xp +
			"</td></tr>" +
			"<tr style=\"pointer-events: none;\">" +
			"<td></td>" +
			"<td colspan=\"3\">" +
				"<div id=\"collapseScrolls" + i + "\" class=\"collapse in\">" +
					generateComposHtml(e.compos) +
				"</div>" +
			"</td>" +
			"</tr>";
		//console.log(e.name + " -> Prix craft: " + e.prix + " | exp : " + e.exp + " | prix 1xp : " + e.prix_1xp);
		i++;
	});
}

function fillOpenableItems(){
    var openable = [
        getObjectByName("Geode",jsonPrices),
        getObjectByName("Bird's Nest",jsonPrices),
        getObjectByName("Sunken Treasure",jsonPrices),
        getObjectByName("Satchel",jsonPrices)
    ];
    var innerHtml = "";
    for(var i = 0 ; i < openable.length - 1 ; i+=2){
        if (typeof (openable[i]) != "undefined") {
            innerHtml += "<tr><td><img src=\"" + (websiteURL + openable[i].image) + "\" class=\"widthSet\"> <b>Price : <a class=\"positive\">" + millionFormate(openable[i].price) + "</b></a></td>";
            innerHtml += "<td><img src=\"" + (websiteURL + openable[i+1].image) + "\" class=\"widthSet\"> <b>Price : <a class=\"positive\">" + millionFormate(openable[i+1].price) + "</b></a></td></tr>";
        }
    }
    document.getElementById("openableItems").innerHTML = "<table width=\"99%\" class=\"table-hover\"><tbody>" + innerHtml + "</tbody></table>";
}

function fillheatOverview(heatListOverview){
    var innerHtml = "";
    for(var i = 0 ; i < heatListOverview.length ; i++){
        innerHtml += "<img src=\"" + (websiteURL + heatListOverview[i].img) + "\" class=\"widthSet\"> <b> " + heatListOverview[i].name + " : <a class=\"positive\">" + millionFormate(heatListOverview[i].prix_1heat) + "</a></b></br>";
    }
    document.getElementById("heatOverview").innerHTML = innerHtml;
}

function fillSmeltOverview(SmeltListOverview){
    var innerHtml = "";
    for(var i = 0 ; i < maxSmeltingOverview ; i++){
        innerHtml += "<tr><td><img src=\"" + (websiteURL + SmeltListOverview[i].img) + "\" class=\"widthSet\"></td> <td><b> " + SmeltListOverview[i].name + "</td> <td><a class=\"" + (SmeltListOverview[i].Benefits > 0 ? "positive" : "negative") + "\">" + millionFormate(Math.floor(SmeltListOverview[i].Benefits)) + "</a></td><td><a class=\"" + (SmeltListOverview[i].StorePriceBenef > 0 ? "positive" : "negative") + "\">" + millionFormate(Math.floor(SmeltListOverview[i].StorePriceBenef)) + "</a></td></tr>";
    }
    document.getElementById("smeltOverview").innerHTML =  "<table width=\"99%\" class=\"table-hover\"><thead><tr><th></th><th></th><th><img class=\"widthSet\" src=\"https://idlescape.com/images/ui/marketplace_icon.png\">Profits</th><th><img class=\"widthSet\" src=\"https://idlescape.com/images/gold_coin.png\">Profits</th></tr></thead><tbody>" + innerHtml + "</tbody></table>";
}

function fillSeedsOverview(SeedListOverview){
    var innerHtml = "";
    for(var i = 0 ; i < maxSeedsOverview ; i++){
        innerHtml += "<tr><td><img src=\"" + (websiteURL + SeedListOverview[i].img) + "\" class=\"widthSet\"></td> <td><b> " + SeedListOverview[i].name.replace("Seed", "") + "</td> <td><a class=\"" + (SeedListOverview[i].benefMin > 0 ? "positive" : "negative") + "\">" + millionFormate(Math.floor(SeedListOverview[i].benefMin)) + "</a></td><td><a class=\"" + (SeedListOverview[i].benefMax > 0 ? "positive" : "negative") + "\">" + millionFormate(Math.floor(SeedListOverview[i].benefMax)) + "</a></td></tr>";
    }
    document.getElementById("seedOverview").innerHTML =  "<table width=\"99%\" class=\"table-hover\"><thead><tr><th></th><th></th><th><img class=\"widthSet\" src=\"https://idlescape.com/images/ui/marketplace_icon.png\">Min</th><th><img class=\"widthSet\" src=\"https://idlescape.com/images/ui/marketplace_icon.png\">Max</th></tr></thead><tbody>" + innerHtml + "</tbody></table>";
}

function getObjectByName(name, json){
    var result = json.find(obj => {
        return obj.name === name
      });
    return result;
}