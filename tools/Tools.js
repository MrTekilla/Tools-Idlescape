//-------------------------------------------
//Tools
function millionFormate(value){
  var nf = new Intl.NumberFormat('en-DE', { minimumFractionDigits: 2  });
  return nf.format(value);
}


function startAutoRefresh(){
	setInterval(function(){ callFetchExp(); callFetchScrolls(); callFetchSeeds(); }, 300000);
}

function generateComposHtml(compos){
	var newHtml = "", composHtml ="";
	var i;

	for(i = 0 ; i < compos.length ; i++){
		composHtml += "<tr><th scope=\"row\">"+(i+1)+
		"</th><td>" + compos[i].name +
		"</td><td>" + compos[i].quantity +
		"</td><td>" + compos[i].price +
		"</td><td>" + millionFormate(compos[i].price * compos[i].quantity) +
		"</td></tr>";
	}
	newHtml += "<table class=\"table\"><thead><tr>"+
		"<th scope=\"col\">#</th>"+
		"<th scope=\"col\">Name</th>"+
		"<th scope=\"col\">Quantity</th>"+
		"<th scope=\"col\">Price</th>"+
		"<th scope=\"col\">Total price</th></tr></thead>"+
		"<tbody>"+
		composHtml+
		"</tbody>"+
		"</table>";
	return newHtml;
}