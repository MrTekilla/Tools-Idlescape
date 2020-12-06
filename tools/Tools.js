//-------------------------------------------
//Tools
function millionFormate(value){
  var nf = new Intl.NumberFormat('en-DE', { minimumFractionDigits: 2  });
  return nf.format(value);
}


function startAutoRefresh(){
	setInterval(function(){ callFetchExp(); callFetchScrolls(); callFetchSeeds(); }, 300000);
}