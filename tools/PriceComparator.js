function callFetchComparator() {
    document.getElementById("itemTableOverview").getElementsByClassName("table")[0].tBodies[0].innerHTML = "<p>Fetchning data from <a href=\"https://idlescape.xyz\">https://idlescape.xyz</a></p>";
    fetch('https://api.idlescape.xyz/prices')
        .then(response => response.json())
        .then(json => initComparator(json));
}

var worthItems = [];
function initComparator(json) {
    json.items.forEach(element => {
        var result = itemsList.find(obj => {
            return obj.name === element.name
        });
        if (typeof (result) != "undefined") {
            //console.log("undefined : " + element.name);
            if (element.price != 0 && result.gamePrice > element.price) {
                console.log("name : " + result.name + " | store price : " + result.gamePrice + " | marketprice : " + element.price);
                worthItems.push({ "name": result.name , "storePrice" : result.gamePrice, "marketPrice" : element.price, "benef" : result.gamePrice - element.price , "img" : element.image});
            }
        }
    });
    populateItemsOverview();
}

function populateItemsOverview() {
	//var t0 = performance.now();
	var i = 1;
	var docTmp = document.getElementById("itemTableOverview").getElementsByClassName("table")[0].tBodies[0];
	docTmp.innerHTML = "";
	for (i = 0; i < worthItems.length; i++) {
		docTmp.innerHTML +=
			"<tr>"+
			"<th scope=\"row\" class=\"thImg\"><img src=\"" + (websiteURL + worthItems[i].img) + "\" class=\"widthSet\">" +
			"</th><td><a>"+ worthItems[i].name + "</a>" +
			"</td><td>" + millionFormate(worthItems[i].storePrice) +
			"</td><td>" + millionFormate(worthItems[i].marketPrice) +
			"</td><td class=\"positive\">" + millionFormate(worthItems[i].benef) +
            "</td></tr>";
	}
}