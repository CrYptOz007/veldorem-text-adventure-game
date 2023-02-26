
// Set Local Storage
function setLocalStorage(name,array) {
  localStorage.setItem(name, JSON.stringify(array));
}

// Set Local Storage values for classes
function setClassLocalStorage(name, value) {
  // If there's no localStorage value for that name
  if (localStorage.getItem(name) === null) {
    // Get the local storage
    return setLocalStorage(name, value)
  // If there is already a localStorage value for that name
  } else {
    // Set the localStorage
    return getLocalStorage(name)
  }
}

// Get Local Storage
function getLocalStorage(name) {
  return JSON.parse(window.localStorage.getItem(name));
}

// Remove Specific Item from array
function removeItemFromArray(array, item) {
  var index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
}


function addItemToArray(array, item) {
  array.push(item);
}

function activityLog(message) {
	// Set activityLog array from getLocalStorage
	var activityLog = getLocalStorage("activityLog");
  // If activityLog array is not there
	if (typeof activityLog == "undefined" || !(activityLog instanceof Array)) {
    var activityLog = [];
  // Set activityLog array to blank
    setLocalStorage("activityLog", activityLog);
    activityLog = getLocalStorage("activityLog");
  }
	// Unshift message to array
	activityLog.unshift(message + "<br>");
	// Set LocalStorage array
	setLocalStorage("activityLog", activityLog);
}

function battleLog(message) {
	// Set battleLog array from getLocalStorage
	var battleLog = getLocalStorage("battleLog");
  // If battleLog array is not there
	if (typeof battleLog == "undefined" || !(battleLog instanceof Array)) {
    var battleLog = [];
  // Set battleLog array to blank
    setLocalStorage("battleLog", battleLog);
    battleLog = getLocalStorage("battleLog");
  }
	// Unshift message to array
	battleLog.unshift(message + "<br>");
	// Set LocalStorage array
	setLocalStorage("battleLog", battleLog);
}

function refreshContent(array) {
  if (array === "playerInventory") {
    var array = getLocalStorage(array);

  	// Refresh elements in array
    for (i = 0; i < array.length; i++ ) {
      document.write(`<option class="tooltip">`, eval(array[i]).displayName, '</option>');
    }
  } else {
  	// Set array from localstorage array
  	var array = getLocalStorage(array);

  	// Refresh elements in array
    for (i = 0; i < array.length; i++ ) {
        document.write('<option>', array[i], '</option>');
    }
  }
}

// Initiate Show Inventory list
function showInventory(name) {
  var array = getLocalStorage(name)
  // Set Inventory to run showDisplayName()
  document.getElementById(name).innerHTML = showDisplayName(array);
}

// New Game function
function newGame() {
  // Get the savedLocation from LocalStorage
  var savedLocation = getLocalStorage("savedLocation")
  // If there isn't saved game
  if (localStorage.getItem("savedLocation") === null) {
    // Clear the localStorage
    localStorage.clear();
    // Set GameOver to false
    setLocalStorage("gameOver", false)
    // Reset all defeated Monsters
    setLocalStorage("defeatedMonsters", [])
    // Redirect to the first location
    window.location.href = 'locations/castle.html';
  // If there is a saved game
  } else {
    // Output confirmation box
    var r = confirm("You have an existing saved game. Do you want to proceed with a new game?")
    // If user wants to overwrite existing saved game
    if (r == true) {
      // Perform same functions as setting new game without confirmation
      localStorage.clear();
      setLocalStorage("gameOver", false)
      setLocalStorage("defeatedMonsters", [])
      window.location.href = 'locations/castle.html';
    }
  }
}

// Load saved game
function loadSave() {
  // Get localstorage of saved location
  var savedLocation = getLocalStorage("savedLocation")
  // Redirect to it
  window.location.href = 'locations/' + savedLocation;
}

// Initiation of elements in all pages
function initialisePage(location) {
  // Get the localstorage of the array from the current location passed through
  let locationInventoryArray = getLocalStorage(location.inventoryName)
  // Display Location Name on the page
  document.getElementById("locationName").innerHTML = location.displayName;
  // Display Location Image on the page
  document.getElementById("locationImage").style.backgroundImage = `url(${location.imageLocationPath})`;
  // Display Location description on the page
  document.getElementById("locationDescription").innerHTML = location.description;
  // If there are no items found in the location
  if (locationInventoryArray.length === 0) {
    // Display location item list description
    document.getElementById("locationInventory").innerHTML = "There are no items seen in this location";
  // If there are items in the location
  } else {
    // List out all available items in that location
    document.getElementById("locationInventory").innerHTML = "You can see: <br>" + showDisplayName(locationInventoryArray);
  }
  // Display the player Health Bar on the player stats section
  document.getElementById("playerHealthBar").style.width = getLocalStorage("playerHealth") + "%";
  // Display the player Health number displayed on the player stats section
  document.getElementById("playerHealthNumber").innerHTML = getLocalStorage("playerHealth") + "/100 HP"
  // Display the player Balance on the player stats section
  document.getElementById("playerBalance").innerHTML = getLocalStorage("playerBalance")
  // Display the retreat attempts on the player stats section
  document.getElementById("retreatAttempts").innerHTML = getLocalStorage("retreatAttempts") + "/3"
  //Execute function to get current weight from all items in inventory
  calCurrentWeight();
  // Display the current weight on the player stats section
  document.getElementById("currentWeight").innerHTML = getLocalStorage("currentWeight") + "kg/" + player.maxWeight + "kg"
  // Display the currently equiped sword or armour on the player stats section
  activeItemStats();
  // Display the active potions list on the player stats section
  document.getElementById("activePotions").innerHTML = getLocalStorage("activePotions").join("<br>")

  //If the location has a monster in it
  if (location.hasMonster) {
    // If the monster hasn't been defeated yet
    if (getLocalStorage(location.monster) == false) {
      // Change the current location in localStorage
    	setLocalStorage("currentMonster", location.monster)
      // Log the initiation text in BatteLog
    	setLocalStorage("battleLog", ["Battle commenced with a " + location.monster + "<br>"])
      // Set the health bar for the monster
      setLocalStorage("compMaxHealth", getLocalStorage(eval(location.monster).name + "Health"))
      // Calculate the multipler used to set the health bar to 100% even if the monster's health is not exactly 100HP
    	setLocalStorage("compHealthMultiplier", (100/getLocalStorage(eval(location.monster).name + "Health")))
      // Redirect to the battle page
    	window.location = "../../locations/battle.html"
    }
  }
  // Game over function to check if the player has died
  gameOver();
}

// Display the currently equiped weapon and armour
function activeItemStats() {
  // If player has a sword equiped
  if (getLocalStorage("activeSword").length > 0) {
    // Display the currently equiped sword name
    document.getElementById("activeSword").innerHTML = eval(getLocalStorage("activeSword")).displayName
    // Display the currently equiped sword damage value
    document.getElementById("swordDamage").innerHTML = eval(getLocalStorage("activeSword")).swordDamage
  // If player doesn't have a sword equiped
  } else {
    // Don't display the equiped sword
    document.getElementById("activeSword").innerHTML = "No sword equiped"
    // Don't display the sword damage because it's not equiped
    document.getElementById("swordDamage").innerHTML = 0
  }
  // If player has armour equiped
  if (getLocalStorage("activeArmour").length > 0) {
    // Display the currently equiped armour name
    document.getElementById("activeArmour").innerHTML = eval(getLocalStorage("activeArmour")).displayName
    // Display the currently equiped armour value
    document.getElementById("armourValue").innerHTML = eval(getLocalStorage("activeArmour")).armourValue
  // If player has no armour equiped
  } else {
    // Don't display armour name
    document.getElementById("activeArmour").innerHTML = "No armour equiped"
    // Don't display armour value
    document.getElementById("armourValue").innerHTML = 0
  }
}

// Calculate the current weight of the player from all items in his inventory
function calCurrentWeight() {
  // Get the inventory array of the player
  var inventoryArray = getLocalStorage("playerInventory")
  // Set the weight variable
  var weight = 0
  // Loop through all items
  for (i = 0; i < inventoryArray.length; i++) {
    // Add the weight of each item to the total weight
    weight += eval(inventoryArray[i]).weight
  }
  // Set the total weight by localStorage
  setLocalStorage("currentWeight", weight)
  // Return the total weight
  return weight
}

// Show the display name of each item with their information box
function showDisplayName(array) {
  // Set list to nothing
  var display = "";
  // Loop through the array
  for (i = 0; i < array.length; i++) {
    // display += eval(array[i]).displayName + "<br>"
    /* Add all the items display name and their associated information box AND
    the hover item event function to display the information box of the item when hovered*/
    display += `<a class='tooltip' onmouseover='hoverItem(${i})'>${eval(array[i]).displayName}<span style='padding: 5px; line-height: 30px;' id='tooltip-span${i}'>${displayItemStats(eval(array[i]))}</span></a><br>`
  }
  // Return the list of items and their information box
  return display
}

// Make the information box moving with the mouse when hovering over the item
function hoverItem(i) {
  // Get the information box element
  var tooltipSpan = document.getElementById('tooltip-span' + i);
  // On mouse hover and moving
  window.onmousemove = function (e) {
    // Get the values of the mouse x and y values
    var x = e.clientX,
        y = e.clientY;
    // Change the position of the information box
    tooltipSpan.style.top = (y + 20) + 'px';
    tooltipSpan.style.left = (x + 20) + 'px';
  }
}

// Add all the values of the item to the information box element
function displayItemStats(item) {
  // Set the displayed values to nothing
  var text = "";
  // Add the description
  text += `<b>Description:</b> <i>${item.description}</i><br>`
  // Add the weight
  text += `<b>Weight:</b> <i>${item.weight}kg</i><br>`
  // Add whether it's equipable
  text += `<b>Equipable:</b> `
  if (item.isEquipable) {
    text +=`<i>Yes</i><br>`
  } else {
    text +=`<i>No</i><br>`
  }
  // If it's a only a sword or armour
  if (item instanceof Sword || item instanceof Armour) {
    // Display the teir
    text += '<b>Current Tier:</b> <i>' + getLocalStorage(`${item.shortName}Teir`) + '</i><br>'
    // Display the crafting materials
    text += `<b>Crafting Materials:</b> `
    // If it isn't craftable
    if (!item.isCraftable) {
      text += "<i>None</i><br>"
    // If it is craftable
    } else {
      // List out all the materials
      text += `<i>${item.craftingMaterials}</i><br>`
    }
    // If it's only a sword
    if (item instanceof Sword) {
      // Add the sword damage value
      text += '<b>Attack Damage:</b> <i>' + getLocalStorage(`${item.shortName}Damage`) + '</i><br>'
    // Else if it's armour
    } else {
      // Add the armour protection value
      text += '<b>Armour Protection:</b> <i>' + getLocalStorage(`${item.shortName}Value`) + '</i><br>'
    }
  }
  // If it is craftable
  if (item.isCraftable) {
    // List out all the crafting materials
    text += `<b>Crafting Materials:</b> `
    text += `<i>${item.craftingMaterials.join(", ")}</i><br>`
  }
  // If it's a health potion
  if (item instanceof HealthPotion) {
    // Add the health regeneration value
    text += `<b>Regeneration:</b> <i>${item.healthRegenValue}%</i><br>`
  }
  // If it's a strength potion
  if (item instanceof StrengthPotion) {
    // Add the strength boot value
    text += `<b>Strength Boost:</b> <i>${item.strengthValue}%</i><br>`
  }
  if (item instanceof RetreatPotion) {
    text += `<b>Retreat Chance Boost:</b> <i>${item.retreatValue}%</i><br>`
  }
  // Add the cost of the item
  text += `<b>Cost:</b> <i>${item.cost} Gold</i><br>`
  // Add the selling price of the item
  text += `<b>Sell:</b> <i>${item.sell} Gold</i><br>`

  // Display all the values associated to that item to the info box
  return text;
}

// Function used to iterate all possible combinations of long descriptive name
function generateOtherNames(string) {
  // String 1 for names containing "the" at the start
  var string = string
  // String 1 for names containing "a" at the start
  var string2 = string
  // Set these strings first
  var otherNames = [`${string}`, `${string2}`]
  // Cut out the "the" or "a"
  string = string.split(" ")
  string2 = string2.split(" ")
  string.unshift("the")
  string2.unshift("a")
  string = string.join(" ")
  string2 = string2.join(" ")

  // Start adding all possible combintations eg. Removing spaces, apostrophes and pural 's'
  otherNames.push(string)
  otherNames.push(string2)
  otherNames.push(removeLetterS(string))
  otherNames.push(string.replace(/the /i, ''))
  otherNames.push(string.replace(/'/gi, ''))
  otherNames.push(string.replace(/ /gi, ''))
  otherNames.push(string.replace(/'/gi, ''))
  otherNames.push(string.replace(/ /gi, ''))
  otherNames.push(removeLetterS(string).replace(/the /i, ''))
  otherNames.push(removeLetterS(string).replace(/'/gi, ''))
  otherNames.push(removeLetterS(string).replace(/ /gi, ''))
  otherNames.push(removeLetterS(string).replace(/the /i, '').replace(/'/gi, ''))
  otherNames.push(removeLetterS(string).replace(/the /i, '').replace(/ /gi, ''))
  otherNames.push(removeLetterS(string).replace(/the /i, '').replace(/'/gi, '').replace(/ /gi, ''))
  otherNames.push(string.replace(/the /i, '').replace(/'/gi, ''))
  otherNames.push(string.replace(/the /i, '').replace(/ /gi, ''))
  otherNames.push(string.replace(/the /i, '').replace(/'/gi, '').replace(/ /gi, ''))
  otherNames.push(string.replace(/'/i, '').replace(/ /gi, ''))

  otherNames.push(removeLetterS(string2))
  otherNames.push(string2.replace(/a /i, ''))
  otherNames.push(string2.replace(/'/gi, ''))
  otherNames.push(string2.replace(/ /gi, ''))
  otherNames.push(string2.replace(/'/gi, ''))
  otherNames.push(string2.replace(/ /gi, ''))
  otherNames.push(removeLetterS(string2).replace(/a /i, ''))
  otherNames.push(removeLetterS(string2).replace(/'/gi, ''))
  otherNames.push(removeLetterS(string2).replace(/ /gi, ''))
  otherNames.push(removeLetterS(string2).replace(/a /i, '').replace(/'/gi, ''))
  otherNames.push(removeLetterS(string2).replace(/a /i, '').replace(/ /gi, ''))
  otherNames.push(removeLetterS(string2).replace(/a /i, '').replace(/'/gi, '').replace(/ /gi, ''))
  otherNames.push(string2.replace(/a /i, '').replace(/'/gi, ''))
  otherNames.push(string2.replace(/a /i, '').replace(/ /gi, ''))
  otherNames.push(string2.replace(/a /i, '').replace(/'/gi, '').replace(/ /gi, ''))
  otherNames.push(string2.replace(/'/i, '').replace(/ /gi, ''))

  return otherNames
}

// Function used to remove the pural 's' at the each word in the extended name
function removeLetterS(string) {
  // split the string into an array by words
  var a = string.split(" ")
  // Create a new variable for the new string
  var newString = []
  // Iterate through each word
  for (i = 0; i < a.length; i++) {
    // Remove the S character of the word
    var lastChar = a[i].slice(-1)
    // If the last character of the word has an 's'
    if (lastChar == "s") {
      // Remove it and push that word to the new string
      newString.push(a[i].substring(0, a[i].length-1))
    // If not
    } else {
      // Push the original word back into the new string
      newString.push(a[i])
    }
  }
  // Join the array of the new string into a string
  return newString.join(" ")
}

////////////////////////////////////
// Set the variables for words used for navigating and some commands that are commonly known
////////////////////////////////////
var directionWords = ["n", "e", "s", "w", "ne", "se", "nw", "sw", "north", "east", "south", "west", "northeast", "southeast", "northwest", "southwest"];
var north = ["n", "north"]
var east = ["e", "east"]
var south = ["s", "south"]
var west = ["w", "west"]
var northEast = ["nw", "northeast"]
var southEast = ["se", "southeast"]
var northWest = ["nw", "northwest"]
var southWest = ["sw", "southwest"]

var pickupWords = ["take", "pickup", "get", "retrieve", "grab"];
var dropWords = ["drop", "remove"];

// Input box command function
function playerAction() {
  // Get the input of what the user typed and set it to all lower case
  var userInput = document.getElementById("answer").value.toLowerCase();
  // Set the verb to the first word
  var verb = userInput.split(" ")[0];
  // Set all subsequent variables for each word of the input
  var secondWord = userInput.split(" ")[1];
  var thirdWord = userInput.split(" ")[2];
  var forthWord = userInput.split(" ")[3];
  var fifthWord = userInput.split(" ")[4];
  /* Set the variable of the item that contains multiple word
  to be rest of the input string after the verb */
  var item = userInput.split(" ").splice(1).join(" ")

  // If the verb is a one-word direction
  if (directionWords.includes(verb)) {
    // Move player to that location
    player.move(thisLocation, verb);
  // Else if the verb has a "go"
  } else if (verb === "go") {
    // If the second word is 'back'
    if (secondWord === "back") {
      // Teleport the player back to the previous location
      event.preventDefault();
      window.location = thisLocation.goBack;
    // If the second word is the direction
    } else {
      // Move plyaer to that location
      player.move(thisLocation, secondWord)
    }
  // If the verb is "exit"
  } else if (verb === "exit") {
    // Teleport the player back to the previous location
    event.preventDefault();
    window.location = thisLocation.goBack;
  // If the verb is 'take' and secondWord is 'on'
  } else if (verb === "take" && secondWord === "on") {
    // Set the item name to be the rest of the input
    item = userInput.split(" ").splice(2).join(" ")
    // Execute the equip armour only function
    player.takeOn(item)
  // If verb is 'take' and second word is 'off'
  } else if (verb === "take" && secondWord === "off") {
    // Set the item name to be the rest of the Input
    item = userInput.split(" ").splice(2).join(" ")
    // Execute the unequip armour only function
    player.takeOff(item)
  // If the verb is any of the pickupWords array
  } else if (pickupWords.includes(verb)) {
    // Execute the getItem function
    player.getItem(thisLocation, item)
  // If the verb is any of the dropWords array
  } else if (dropWords.includes(verb)) {
    // Execute the drop item array
    player.dropItem(thisLocation, item)
  // If the verb is 'equip'
} else if (verb === "equip" || verb === "wear") {
    // Execute the equip item array
    player.equip(item)
  // If the verb is 'unequip'
  } else if (verb === "unequip") {
    // Execute the unequip item array
    player.unequip(item)
  // If the verb is 'talk or speak' and second word is 'to'
} else if ((verb === "talk" || verb === "speak") && secondWord === "to") {
    // Set the npc name or occupation to be the rest of the input
    let npc = userInput.split(" ").splice(2).join(" ")
    // Execute the talk to NPC function
    player.talk(npc)
  // If the verb is 'buy'
  } else if (verb === "buy") {
    // If the second word is a number for quantity
    if (parseInt(secondWord, 10) > 0) {
      // Set the rest of the input to be the item name
      item = userInput.split(" ").splice(2).join(" ")
      // Execute the buy from NPC function with quantity
      player.buyItem(eval(thisLocation.hasNPC), parseInt(secondWord, 10), item)
    // If the second word is a word and not a number for quantity
    } else {
      // Execute the buy from NPC function with only 1 as the quantity amount
      player.buyItem(eval(thisLocation.hasNPC), 1, item)
    }
  // If the verb is 'sell'
  } else if (verb === "sell") {
    // If the second word is a number for quantity
    if (parseInt(secondWord, 10) > 0) {
      // Set the rest of the input to be the item name
      item = userInput.split(" ").splice(2).join(" ")
      // Execute the sell to NPC function with quantity
      player.sellItem(eval(thisLocation.hasNPC), parseInt(secondWord, 10), item)
    // If the second word is a word and not a number for quantity
    } else {
      // Execute the sell to NPC function with only 1 as the quantity amount
      player.sellItem(eval(thisLocation.hasNPC), 1, item)
    }
  // If the verb is 'upgrade'
  } else if (verb === "upgrade") {
    // If the player is not talking to an NPC
    if (eval(thisLocation.hasNPC === false || eval(thisLocation.hasNPC) === true)) {
      activityLog("You're not talking to an NPC")
    // If the player is talking to an NPC
    } else {
      // Execute the upgrade item function
      player.upgrade(item)
    }
  // If the verb is 'show'
  } else if (verb === "show") {
    // If the player is not talking to an NPC
    if (eval(thisLocation.hasNPC === false || eval(thisLocation.hasNPC) === true)) {
      activityLog("You're not talking to an NPC")
    // If the player is talking to an NPC
    } else {
      // Execute the show hidden item description function
      player.showItem(item, eval(thisLocation.hasNPC))
    }
  // If the verb is 'drink'
  } else if (verb === "drink") {
    // Execute the drink potion function
    player.drink(item)
  // If the verb is 'use'
  } else if (verb === "use") {
    // Get the info of the item properties
    var item = getItemInfo(item)
    // If the item is drinkable
    if (item.isDrinkable) {
      // Execute the drink potion function
      player.drink(item)
    }
  // If the verb is 'craft'
  } else if (verb === "craft") {
    // Execute the player crafting function
    player.craft(eval(thisLocation.hasNPC), item)
  } else if (verb === "help") {
  window.open("../documentation.pdf", "_blank")
  }
}

// Function to redirect player to that location based on the direction
function redirectLocation(locationExit, direction) {
  // If the direction to go to doesn't have a location
  if (typeof locationExit == "undefined") {
    activityLog("You cannot go " + direction)
  // If the direction to go to does have location
  } else {
    // Redirect player to that location
    event.preventDefault();
    window.location = locationExit
  }
}

// Set the game over function
function gameOver() {
  // If the game over value is true
  if (getLocalStorage("gameOver")) {
    // Reset the game and redirect to game over page
    localStorage.clear()
    window.location = "../gameOver.html"
  }
}

// Get the properties of an item based on it's name or extended name
function getItemInfo(item) {
  // Loop through list of all items in the game
  for (i = 0; i < allItems.length; i++) {
    // If the generated names of the item in the list of items in the game is true
    if (eval(allItems[i]).otherNames.includes(item)) {
      // Set the variable of the item with it's properties
      var item = eval(allItems[i]);
      // Return it
      return item
    }
  }
}

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      var secondVal = val.split(" ")[1]
      var thirdVal = val.split(" ")[2]
      var forthVal = val.split(" ")[3]
      val = val.split(" ")[0]
      //console.log(val)
      //console.log(secondVal)
      //console.log(thirdVal)
      // var secondVal = val.split(" ")[1]
      // console.log(secondVal)
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        var verb = arr[i].split(" ")[0]
        var secondWord = arr[i].split(" ")[1]
        var thirdWord = arr[i].split(" ")[2]
        var forthWord = arr[i].split(" ")[3]
        var fifthWord = arr[i].split(" ")[4]
        /*check if the item starts with the same letters as the text field value:*/
        if (verb.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/

          b = document.createElement("DIV");
          //console.log("1:" + b.innerHTML)
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>" + arr[i].substr(val.length);;
          //console.log("2:" + b.innerHTML)
          //console.log("3:" + b.innerHTML)
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + verb + "'>";
          //console.log("4:" + b.innerHTML)
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = verb;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          if (typeof secondWord == "undefined") {
            secondWord = ""
            thirdWord = ""
            forthWord = ""
            fifthWord = ""
          } else if (typeof thirdWord == "undefined") {
            thirdWord = ""
            forthWord = ""
            fifthWord = ""
          } else if (typeof forthWord == "undefined") {
            forthWord = ""
            fifthWord = ""
          } else if (typeof fifthWord == "undefined") {
            fifthWord = ""
          }

          if (typeof secondVal !== "undefined") {
            b.innerHTML = "<strong>" + verb + " " + secondWord + "</strong>" + " " + thirdWord + " " + forthWord + " " + fifthWord;
          }
          if (typeof thirdVal !== "undefined") {
            b.innerHTML = "<strong>" + verb + " " +  secondWord + " " + thirdWord + "</strong>" + " " + forthWord + " " + fifthWord;
          }
          if (typeof forthVal !== "undefined") {
            b.innerHTML = "<strong>" + verb + " " +  secondWord + " " + thirdWord + " " + forthWord + "</strong>" + " " + fifthWord;
          }
          if (typeof fifthVal !== "undefined") {
            b.innerHTML = "<strong>" + verb + " " +  secondWord + " " + thirdWord + " " + forthWord +  " " + fifthWord + "</strong>";
          }

          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

/*An array containing all the commands*/
var autoCommands = ['Go back', 'Exit', 'Take on (armour)', 'Take off (armour)', 'Unequip (item)', 'Equip (item)', 'Talk to (NPC)', 'Speak to (NPC)', 'Buy (opt.quantity) (item)', 'Sell (opt.quantity) (item)', 'Upgrade (item)', 'Drink (item)', 'Show (item)', 'Use (item)', 'Craft (item)'];
arrayToArray(directionWords, autoCommands)
arrayToArray(pickupWords, autoCommands, "(item)")
arrayToArray(dropWords, autoCommands, "(item)")

// Adding all elements of one array to another
function arrayToArray(arr1, arr2, suffix) {
  if (typeof suffix == "undefined") {
    suffix = ""
  }
  for (i = 0; i < arr1.length; i++) {
    arr2.push(arr1[i] + " " + suffix)
  }
}
