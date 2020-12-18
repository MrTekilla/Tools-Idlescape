//-------------------------------------------

var websiteURL = "https://idlescape.com"

//Tools
function millionFormate(value) {
	var nf = new Intl.NumberFormat('en-DE', { minimumFractionDigits: 0 });
	return nf.format(value);
}


function startAutoRefresh() {
	setInterval(function () { callFetchCrafting(true); callFetchScrolls(true); callFetchFarming(true); }, 300000);
}

function manualRefresh() {
	callFetchCrafting(true); callFetchScrolls(true); callFetchFarming(true); callFetchHeatCalculator(true);
}

function generateComposHtml(compos, quantt = 1) {
	var newHtml = "", composHtml = "";
	var i;

	for (i = 0; i < compos.length; i++) {
		composHtml += "<tr><th scope=\"row\"><img src=\"" + (websiteURL + compos[i].img) + "\" class=\"widthSet\">" +
			"</th><td>" + compos[i].name +
			"</td><td>" + millionFormate(compos[i].quantity * quantt) +
			"</td><td>" + millionFormate(compos[i].price) +
			"</td><td>" + millionFormate(compos[i].price * compos[i].quantity * quantt) +
			"</td></tr>";
	}
	newHtml += "<table class=\"table\"><thead><tr>" +
		"<th scope=\"col\">#</th>" +
		"<th scope=\"col\">Name</th>" +
		"<th scope=\"col\">Quantity</th>" +
		"<th scope=\"col\">Price</th>" +
		"<th scope=\"col\">Total price</th></tr></thead>" +
		"<tbody>" +
		composHtml +
		"</tbody>" +
		"</table>";
	return newHtml;
}

function sortByString(list) {
	list.sort(function (a, b) {
		return ('' + a['name']).localeCompare(b['name']);
	})
}

function isBlank(str) {
	return (!str || /^\s*$/.test(str));
}
