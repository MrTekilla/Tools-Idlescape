function callFetchComparator() {
    //document.getElementById("SmithingBarContent").getElementsByClassName("table")[0].tBodies[0].innerHTML = "<p>Fetchning data from <a href=\"https://idlescape.xyz\">https://idlescape.xyz</a></p>";
    fetch('https://api.idlescape.xyz/prices')
        .then(response => response.json())
        .then(json => initComparator(json));
}


function initComparator(json) {
    json.items.forEach(element => {
        var result = itemsList.find(obj => {
            return obj.name === element.name
        });
        if (typeof (result) != "undefined") {
            //console.log("undefined : " + element.name);
            if (element.price != 0 && result.gamePrice > element.price) {
                console.log("name : " + result.name + " | store price : " + result.gamePrice + " | marketprice : " + element.price);
            }
        }
    });

}