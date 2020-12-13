function getCraftXpFromXtoY(resultID,actualcraftingLevelID,desiredcraftingLevelID,selectedCraftRecipeID,selectCraftRecipeList){
    var newHtml = "";
    var composHtml = "";
    var actualLevel =  parseInt(document.getElementById(actualcraftingLevelID).value)
    var desiredLevel =  parseInt(document.getElementById(desiredcraftingLevelID).value)
    var craftRecipe = document.getElementById(selectedCraftRecipeID).value
    //console.log(actualLevel + " " + desiredLevel + " " + craftRecipe);
    if(desiredLevel == actualLevel){return 0};
    if(desiredLevel < actualLevel){
        tmp = desiredLevel;
        document.getElementById(desiredcraftingLevelID).value = actualLevel;
        document.getElementById(actualcraftingLevelID).value = desiredLevel;
        desiredLevel = actualLevel;
        actualLevel = tmp;
    };
    if(desiredLevel < 1){desiredLevel = 1;document.getElementById(desiredcraftingLevelID).value = desiredLevel;};
    if(desiredLevel > 99){desiredLevel = 99; document.getElementById(desiredcraftingLevelID).value = desiredLevel;};
    if(actualLevel < 1){actualLevel = 1; document.getElementById(actualcraftingLevelID).value = actualLevel;};
    if(actualLevel > 99){actualLevel = 99; document.getElementById(actualcraftingLevelID).value = actualLevel;};

    var craftRecipeObjectID = selectCraftRecipeList.findIndex((e) => e.name.localeCompare(craftRecipe) == 0);
    var craftRecipeObject = selectCraftRecipeList[craftRecipeObjectID];

    var i;
    var totalXp = 0;
    for(i = actualLevel; i < desiredLevel ; i++){
        //console.log("expTable :" + expTable[i].level + " " + expTable[i].xp + " " + expTable[i].difference);
        totalXp += expTable[i].difference;
    }
    //console.log(totalXp);
    var tmpNumberCraft = totalXp/craftRecipeObject.exp;
    var numberCraft = (tmpNumberCraft % 1 != 0 ? parseInt(tmpNumberCraft) + 1 : tmpNumberCraft);
    //console.log(numberCraft % 1 != 0);
    composHtml +=
    "<tr><td><a class=\"btn btn-primary\" data-toggle=\"collapse\" href=\"#collapseTotalCraft"+resultID+craftRecipeObject.id+totalXp+"\" role=\"button\" aria-expanded=\"false\" aria-controls=\"collapseTotalCraft"+resultID+craftRecipeObject.id+totalXp+"\"><i class=\"glyphicon glyphicon-triangle-right\"></i>\t " + craftRecipeObject.name + " | " + actualLevel +" -> " + desiredLevel + "</a>" +
    "<div class=\"collapse\" id=\"collapseTotalCraft"+resultID+craftRecipeObject.id+totalXp+"\"><div class=\"card card-body\">" + generateComposHtml(craftRecipeObject.compos,numberCraft) + "</div></div>" +
    "</td><td>" + millionFormate(numberCraft) +
    "</td><td>" + millionFormate(totalXp) +
    "</td><td>" + millionFormate(craftRecipeObject.CraftingPrice * numberCraft) +
    "</td><td class=\"" + (craftRecipeObject.Benefits * numberCraft > 0 ? "positive" : "negative") + "\"><b>" + millionFormate(craftRecipeObject.Benefits * numberCraft) + "</b>"+
    "</td></tr>";

    //console.log("Number craft : " + numberCraft + " | totalXp : " + totalXp + "| crafting price : " + craftRecipeObject.CraftingPrice + " | cout : " + craftRecipeObject.CraftingPrice * numberCraft)

    //console.log(craftRecipeObject.CraftingPrice * numberCraft);

    newHtml += "<table class=\"table\"><thead><tr>"+
        "<th scope=\"col\">Name</th>"+
        "<th scope=\"col\">Quantity</th>"+
        "<th scope=\"col\">XP</th>"+
        "<th scope=\"col\">Price</th>"+
        "<th scope=\"col\">Benefits</th></tr></thead>"+
        "<tbody>"+
        composHtml+
        "</tbody>"+
        "</table>";

    if(isBlank(document.getElementById(resultID).innerHTML)){
        document.getElementById(resultID).innerHTML += newHtml;
    }else{
        document.getElementById(resultID).getElementsByClassName("table")[0].tBodies[0].innerHTML += composHtml;
    }
    
}

function cleanCraftResult(resultID){
    document.getElementById(resultID).innerHTML = "";

}