function getCraftXpFromXtoY(resultID, actualcraftingLevelID, desiredcraftingLevelID, selectedCraftRecipeID, levelTable ,selectCraftRecipeList) {
    var newHtml = "";
    var composHtml = "";
    var actualLevel = parseInt(document.getElementById(actualcraftingLevelID).value)
    var desiredLevel = parseInt(document.getElementById(desiredcraftingLevelID).value)
    var craftRecipe = document.getElementById(selectedCraftRecipeID).value
    //console.log(actualLevel + " " + desiredLevel + " " + craftRecipe);
    if (desiredLevel == actualLevel) { return 0 };
    if (desiredLevel < actualLevel) {
        tmp = desiredLevel;
        document.getElementById(desiredcraftingLevelID).value = actualLevel;
        document.getElementById(actualcraftingLevelID).value = desiredLevel;
        desiredLevel = actualLevel;
        actualLevel = tmp;
    };
    if (desiredLevel < 1) { desiredLevel = 1; document.getElementById(desiredcraftingLevelID).value = desiredLevel; };
    if (desiredLevel > 99) { desiredLevel = 99; document.getElementById(desiredcraftingLevelID).value = desiredLevel; };
    if (actualLevel < 1) { actualLevel = 1; document.getElementById(actualcraftingLevelID).value = actualLevel; };
    if (actualLevel > 99) { actualLevel = 99; document.getElementById(actualcraftingLevelID).value = actualLevel; };

    var craftRecipeObjectID = selectCraftRecipeList.findIndex((e) => e.name.localeCompare(craftRecipe) == 0);
    var craftRecipeObject = selectCraftRecipeList[craftRecipeObjectID];

    var i;
    var totalXp = 0;
    for (i = actualLevel; i < desiredLevel; i++) {
        //console.log("expTable :" + expTable[i].level + " " + expTable[i].xp + " " + expTable[i].difference);
        totalXp += levelTable.xp[i].difference;
    }
    //console.log(totalXp);
    var tmpNumberCraft = totalXp / craftRecipeObject.exp;
    var numberCraft = (tmpNumberCraft % 1 != 0 ? parseInt(tmpNumberCraft) + 1 : tmpNumberCraft);
    var extendID = new Date().getTime();
    //console.log(numberCraft % 1 != 0);
    composHtml +=
        "<tr class=\"accordion-toggle\">"+
        "<td><a class=\"btn btn-primary\" data-toggle=\"collapse\" href=\"#collapseTotalCraft" + extendID + craftRecipeObject.id + totalXp + "\" role=\"button\" aria-expanded=\"false\" aria-controls=\"collapseTotalCraft" + resultID + craftRecipeObject.id + totalXp + "\"><i class=\"glyphicon glyphicon-triangle-right\"></i>\t " + craftRecipeObject.name + " | " + actualLevel + " -> " + desiredLevel + "</a>" +
        //"<div class=\"collapse\" id=\"collapseTotalCraft" + extendID + craftRecipeObject.id + totalXp + "\"><div class=\"card card-body\">" + generateComposHtml(craftRecipeObject.compos, numberCraft) + "</div></div>" +
        "</td><td>" + millionFormate(numberCraft) +
        "</td><td>" + millionFormate(totalXp) +
        "</td><td>" + millionFormate(craftRecipeObject.CraftingPrice * numberCraft) +
        "</td><td class=\"" + (craftRecipeObject.Benefits * numberCraft > 0 ? "positive" : "negative") + "\"><b>" + millionFormate(craftRecipeObject.Benefits * numberCraft) + "</b>" +
        "</td><td><b>" + millionFormate((craftRecipeObject.CraftingPrice * numberCraft) + (craftRecipeObject.Benefits * numberCraft)) + "</b>" +
        "</td><td class=\"" + (craftRecipeObject.StorePriceBenef * numberCraft > 0 ? "positive" : "negative") + "\"><b>" + (isNaN(craftRecipeObject.StorePriceBenef) ? 0 : millionFormate(craftRecipeObject.StorePriceBenef * numberCraft)) + "</b>" +
        "</td><td><b>" + (isNaN(craftRecipeObject.StorePriceBenef) ? 0 : millionFormate((craftRecipeObject.CraftingPrice * numberCraft) + (craftRecipeObject.StorePriceBenef * numberCraft))) + "</b>" +
        "</td></tr>" +
        "<tr style=\"pointer-events: none;\">" +
        "<td colspan=\"3\">" +
            "<div id=\"collapseTotalCraft" + extendID + craftRecipeObject.id + totalXp + "\" class=\"collapse in\">" +
            "<span>Level up : <b>" + levelTable.name + "</b></span><br>" +
            ("ScrollcraftBuff" in craftRecipeObject ? "<span>Crafting buff : <b>" +  craftRecipeObject.ScrollcraftBuff + "%</b></span> | " : "") +
            ("buffWealthSmithing" in craftRecipeObject ? "<span>Wealth buff : <b>" +  craftRecipeObject.buffWealthSmithing + "%</b></span> | " : "") +
            ("buffScholarSmithing" in craftRecipeObject ? "<span>Scholar buff : <b>" +  craftRecipeObject.buffScholarSmithing + "%</b></span> | " : "") +
            ("buffPyromancySmithing" in craftRecipeObject ? "<span>Pyromancy buff : <b>" +  craftRecipeObject.buffPyromancySmithing + "%</b></span> | " : "") +
            ("buffIntuitionSmithing" in craftRecipeObject ? "<span>Intuition buff : <b>" +  craftRecipeObject.buffIntuitionSmithing + "%</b></span> | " : "") +
                ((resultID == "resultatsCraft") ? generateComposHtml(craftRecipeObject.compos, numberCraft, parseInt(document.getElementById("ScrollCraftingBuffCraft").value)) : generateComposHtml(craftRecipeObject.compos, numberCraft)) +
            "</div>" +
        "</td>" +
        "</tr>";

        //console.log("new Date().getTime() : " + new Date().getTime());

    //console.log("Number craft : " + numberCraft + " | totalXp : " + totalXp + "| crafting price : " + craftRecipeObject.CraftingPrice + " | cout : " + craftRecipeObject.CraftingPrice * numberCraft)
    //console.log("Name : " + craftRecipeObject.name + " | xp : "+ craftRecipeObject.exp + " | lvl : " + craftRecipeObject.level);
    //console.log(craftRecipeObject.CraftingPrice * numberCraft);

    newHtml += "<table class=\"table table-hover\"><thead><tr>" +
        "<th scope=\"col\">Name</th>" +
        "<th scope=\"col\" data-toggle=\"tooltip\" title=\"The number of item you need to craft.\">Quant.</th>" +
        "<th scope=\"col\" data-toggle=\"tooltip\" title=\"Experience.\">XP</th>" +
        "<th scope=\"col\" data-toggle=\"tooltip\" title=\"The total price of crafting.\">Crafting Price</th>" +
        "<th scope=\"col\" data-toggle=\"tooltip\" title=\"The benefits you get by selling all the items to the market.\"><img class=\"widthSet\" src=\"https://idlescape.com/images/ui/marketplace_icon.png\">Benef.</th>" +
        "<th scope=\"col\" data-toggle=\"tooltip\" title=\"Earning you get after selling all the items to the market.\"><img class=\"widthSet\" src=\"https://idlescape.com/images/ui/marketplace_icon.png\">Earning</th>" +
        "<th scope=\"col\" data-toggle=\"tooltip\" title=\"The benefits you get by selling all the items to the game.\"><img class=\"widthSet\" src=\"https://idlescape.com/images/gold_coin.png\">Benef.</th>" +
        "<th scope=\"col\" data-toggle=\"tooltip\" title=\"Earning you get after selling all the items to the game.\"><img class=\"widthSet\" src=\"https://idlescape.com/images/gold_coin.png\">Earning</th></tr></thead>" +
        "<tbody>" +
        composHtml +
        "</tbody>" +
        "</table>";

    if (isBlank(document.getElementById(resultID).innerHTML)) {
        document.getElementById(resultID).innerHTML += newHtml;
    } else {
        document.getElementById(resultID).getElementsByClassName("table")[0].tBodies[0].innerHTML += composHtml;
    }

}

function cleanLevelUpResult(resultID) {
    document.getElementById(resultID).innerHTML = "";

}