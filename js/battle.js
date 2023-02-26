function initialiseBattlePage(location) {
	// Location = monster object
	location = eval(location)
	// Get monster inventory
	let locationInventoryArray = getLocalStorage(location.inventoryName)
	// Create the battle interface page
  document.getElementById("locationName").innerHTML = location.name;
  document.getElementById("locationImage").style.backgroundImage = `url(../img/${location.name}.png)`;
  document.getElementById("locationDescription").innerHTML = location.description;
	document.getElementById("playerHealthBar").style.width = getLocalStorage("playerHealth") + "%";
  document.getElementById("playerHealthNumber").innerHTML = getLocalStorage("playerHealth") + "/100 HP"
	document.getElementById("compHealthBar").style.width = getLocalStorage("compHealthMultiplier") * getLocalStorage(location.name + "Health") + "%";
  document.getElementById("compHealthNumber").innerHTML = getLocalStorage(location.name + "Health") + "/" + getLocalStorage("compMaxHealth") +" HP";
  document.getElementById("retreatAttempts").innerHTML = getLocalStorage("retreatAttempts") + "/3"
  activeItemStats();
  document.getElementById("activePotions").innerHTML = showDisplayName(getLocalStorage("activePotions"))
	if (location.forceHiddenStats) {
		document.getElementById("monsterDamage").innerHTML = "<i>???</i>"
	} else {
		document.getElementById("monsterDamage").innerHTML = location.damage
	}
	//Check if the player has died
	gameOver();
	// Check if the monster has died
	if(getLocalStorage(location.name)) {
		setLocalStorage("currentMonster", "")
		activityLog("You killed the " + location.name)
		var defeatedMonsters = getLocalStorage("defeatedMonsters")
		defeatedMonsters.push(location.name)
		setLocalStorage("defeatedMonsters", defeatedMonsters)
		window.location = location.returnPath
	}
}

// Execute fight action
function fight(action) {
	// Get current monster object
	var thisMonster = eval(getLocalStorage("currentMonster"))
	// If gameOver
	if (getLocalStorage("gameOver")) {
		window.location = "../gameOver.html"
	}
	// If Button press is attack
	if (action === "attack") {
		attack()
	// If button press is counter
	} else if (action === "counter") {
		counter()
	// If button press is heal
	} else if (action === "heal") {
		heal(potion)
	// If button press is retreat
	} else if (action === "retreat") {
		var success = retreat()
		if (success) {
			window.location = "../locations/town.html"
			return false;
		}
	}
	location.reload()
	return false;
}

// Grab the potion from the active potion list
function checkPotions(classContructor) {
	// Get list of active potions
	var playerActivePotions = getLocalStorage("activePotions")
	// Loop through active potions
	for (i = 0; i < playerActivePotions.length; i++) {
		// Check if the potion is the potion being grabbed
		if (eval(playerActivePotions[i]) instanceof eval(classContructor)) {
			// Grab the potion
			return playerActivePotions[i];
		}
	}
}

// Action function
function attack() {
	// Get monster object
	var thisMonster = eval(getLocalStorage("currentMonster"))
	// Set the monster health local variable
	var compHealth = thisMonster.health
	// Randomise a chance for the move
	var move = Math.floor((Math.random()*100)+1);
	// Get the critical potion from active potion list
	var critical = checkPotions("CriticalPotion")
	// Get the strength potion from active potion list
	var strength = checkPotions("StrengthPotion")
	// Check if the player has a sword equiped
	if(eval(player.activeSword) instanceof Sword) {
		// If the player has a critical potion in effect
		if (critical) {
			// If the chance is less than 25
			if (move <= 25) {
				// Deal randomised critical damage to monster health
				let dmg = Math.round(eval(player.activeSword).swordDamage * ((Math.random() * (1.8 - 1.35) + 1.35)))
				compHealth -= dmg
				battleLog("Critical hit! You delt " + dmg + " Damage to the " + thisMonster.name)
			// If the chance is less than 40
			} else if (move <= 40 - eval(critical).criticalValue) {
				// Deal no damage to monster health
				battleLog("The " + thisMonster.name + " dodged your attack")
				// Deal Regular damage to monster health
			} else if (move <= 100) {
				// If player has a strength potion applied
				if (strength) {
					// Deal increased regular damage
					var dmg = Math.round(eval(player.activeSword).swordDamage * ((eval(strength).strengthValue)/100 + 1))
					compHealth -= dmg
					battleLog("You delt an increased damage of " + dmg + " Damage")
				// If player doesn't have a strength potion applied
				} else {
					// Deal regular damage
					var dmg = eval(player.activeSword).swordDamage
					compHealth -= dmg
					battleLog("You delt a normal attack of " + eval(player.activeSword).swordDamage + " Damage to the " + thisMonster.name)
				}
			}
		// Else if player doesn't have a critical potion in effet
		} else {
			// If chance is less or equal to 15
			if (move <= 15) {
				// Deal critical damage
				let dmg = Math.round(eval(player.activeSword).swordDamage * (Math.random() * (1.8 - 1.35) + 1.35))
				compHealth -= dmg
				battleLog("Critical hit! You delt " + dmg + " Damage to the " + thisMonster.name)
			// If chance is less or equal to 15
			} else if (move <= 40) {
				// Deal no damage
				battleLog("The " + thisMonster.name + " dodged your attack")
			// If chance is less than 100
			} else if (move <= 100) {
				// If player does have a strength potion applied
				if (strength) {
					// Deal increased damage
					var dmg = Math.round(eval(player.activeSword).swordDamage * ((eval(strength).strengthValue)/100 + 1))
					compHealth -= dmg
					battleLog("You delt an increased damage of " + dmg + " Damage")
				// If player doesn't have a strength potion applied
				} else {
					// Deal regular damage
					var dmg = eval(player.activeSword).swordDamage
					compHealth -= dmg
					battleLog("You delt a normal attack of " + eval(player.activeSword).swordDamage + " Damage to the " + thisMonster.name)
				}
			}
		}
	// If player doesn't have a sword equiped
	} else {
		battleLog("You don't have a sword equipped! Retreat ASAP")
	}
	// Get monster health
	setLocalStorage(thisMonster.name + "Health", compHealth)
	// If monster health is 0
	if (battleOver('monster', compHealth)) {
		// Reward player and redirect back to location
		player.getGold(Math.floor(Math.random() * ((thisMonster.reward * 1.2) - (thisMonster.reward * 0.8)) + (thisMonster.reward * 0.8)))
		battleOver('monster', compHealth)
		event.preventDefault();
		return false;
	// If monster health is not 0
	} else {
		// Execute monster attack move
		compCounter()
		battleLog("===================================================================")
		return false;
	}
}

// Monster attack function
function compCounter() {
	// get and set all variables
	var thisMonster = eval(getLocalStorage("currentMonster"))
	var playerHealth = player.health
	// Random chance move
	var move = Math.floor((Math.random()*100)+1);
	var dmg = 0;
	// If player doesn't have armour equiped
	if (getLocalStorage("activeArmour") === "") {
		// Armour protection from monster damage = 0
		var armour = 0
	// Else if player does have armour equiped
	} else {
		// Set armour protection
		var armour = eval(player.activeArmour).armourValue
	}
	// If chance is less than or equal to 15
	if (move <= 15) {
		// Deal critical damage to player
		dmg = (Math.round(thisMonster.damage * (Math.random() * (2 - 1.5) + 1.5)) - armour)
		playerHealth -= dmg
		battleLog("The " + thisMonster.name + " used it's ultimate! Critical hit taken -" + dmg + "HP" )
	// Else if chance is less than or equal to 40
	} else if (move <= 40) {
		// Deal no damage to player
		battleLog("You dodged its attack!")
	// Else if chance is less than or equal to 100
	} else if (move <= 100) {
		// Deal regular damage to player
		dmg = (Math.round(thisMonster.damage) - armour)
		playerHealth -= dmg
		battleLog("The " + thisMonster.name + " delt " + dmg + " Damage off you")
	}
	// Get player health
	setLocalStorage("playerHealth", playerHealth)
	// Check if player health is 0
	if (battleOver('player', playerHealth)) {
		// Game over
		battleOver('player', playerHealth)
		return false;
	}
	return dmg;
}

/* Displays the list of healing potions the player has in his
inventory under the heal button */
function potionListDropdown() {
	// get and set all variables
	var playerInventory = player.inventoryArray;
	var display = "";
	var potionFound = false;
	var duplicate = []
	for (i = 0; i < playerInventory.length; i++) { // Look through all items in playerInventory
		if (eval(playerInventory[i]) instanceof HealthPotion) { // Check item is constructor of HealthPotion
			var potion = eval(playerInventory[i]).shortName //Set the shortName of the potion
			if (!duplicate.includes(potion)) { //Check if it's already been added to the list in html
				var para = document.createElement("a"); // Create <a> element
				var index = playerInventory.reduce(function(n, val) {return n + (val === potion);}, 0); // Count how many of the same potion is in playerInventory
				var node = document.createTextNode(potion + " x" + index); // Assign the text value of the <a> element
				para.appendChild(node);
				var element = document.getElementById("dropdown-content");
				element.appendChild(para);
				para.setAttribute('onclick',`heal(${potion});`); // for FF
	    	para.onclick = function() {heal(potion);}; // for IE
				duplicate.push(potion)
				potionFound = true
			}
		}
	}

	// If no potion is found in player's inventory
	if (potionFound == false) {
		// Display no potions found
		var para = document.createElement("a");
		var node = document.createTextNode("No healing potions available");
		para.appendChild(node);
		var element = document.getElementById("dropdown-content");
		element.appendChild(para);
	}
	return false;
}

// Execute heal potion
function heal(potion) {
	// Get potion object
	var potion = eval(potion)
	// Get the player health
	var playerHealth = player.health
	// Get the player inventory
	var playerInventory = player.inventoryArray
	// If potion is not drinkable
	if (!potion.isDrinkable) {
		// If the player is currently in the battle interface
		if (window.location.pathname.split("/").pop().split(".").join(".") === "battle.html") {
			battleLog("You can't drink this potion")
		// If the player is not in the battle interface
		} else {
			activityLog("You can't drink this potion")
		}
	}
	// If the player health is 100
	if (playerHealth === 100) {
		// If the player is currently in the battle interface
		if (window.location.pathname.split("/").pop().split(".").join(".") === "battle.html") {
			battleLog("You're already Max HP")
		// If the player is not in the battle interface
		} else {
			activityLog("You're already Max HP")
		}
	// Else if the player health is not a 100
	} else {
		// Calculate new health from the regen potion
		var newHealth = playerHealth += potion.healthRegenValue
		// If the new health is more than 100
		if (newHealth > 100) {
			// Set the player's health to 100
			setLocalStorage("playerHealth", 100)
			// If the player is currently in the battle interface
			if (window.location.pathname.split("/").pop().split(".").join(".") === "battle.html") {
				battleLog("You drank a " + potion.otherNames[0] + " and you're now Max HP")
			// If the player is not in the battle interface
			} else {
				activityLog("You drank a " + potion.otherNames[0] + " and you're now Max HP")
			}
			// Remove potion from player inventory after drinking the health potion
			removeItemFromArray(playerInventory, potion.shortName)
		// If the player's health does not go over 100
		} else {
			// Set the new health
			setLocalStorage("playerHealth", newHealth)
			// If the player is currently in the battle interface
			if (window.location.pathname.split("/").pop().split(".").join(".") === "battle.html") {
				battleLog("You drank a " + potion.otherNames[0] + " and regenerated " + potion.healthRegenValue + "HP")
			// If the player is not in the battle interface
			} else {
				activityLog("You drank a " + potion.otherNames[0] + " and regenerated " + potion.healthRegenValue + "HP")
			}
			// Remove potion from player inventory
			removeItemFromArray(playerInventory, potion.shortName)
		}
	}
	// Set the new player inventory
	setLocalStorage("playerInventory", playerInventory)
	if (window.location.pathname.split("/").pop().split(".").join(".") === "battle.html") {
		battleLog("===================================================================")
	}
	location.reload();
}

// Check whether the player or monster health
function battleOver(character, health) {
	// Get the current monster object
	var thisMonster = eval(getLocalStorage("currentMonster"))
	// If the health is less than or equal to 0
	if (health <= 0) {
		// If the player health reaches 0
		if (character === 'player') {
			// Game over
			setLocalStorage("gameOver", true)
		// If the monster health is 0
		} else if (character === 'monster') {
			// Set Monster defeated
			setLocalStorage(thisMonster.name, true)
			// Clear active potions
			setLocalStorage("activePotions", [])
		}
		return true;
	}
}

// Player counter function
function counter() {
	// Get the current monster object
	var thisMonster = eval(getLocalStorage("currentMonster"))
	// Get the dmg taken from the monster
	var dmgTaken = compCounter()
	// If dmg taken from monster > 0
	if (dmgTaken > 0) {
	// Deal the part of the damage back to the monster
	var dmgBack = Math.round((Math.random() * (0.5 - 0.2) + 0.2) * test)
		setLocalStorage(thisMonster.name + "Health", thisMonster.health - dmgBack)
		battleLog("You managed to counter his attack and did " + dmgBack + " Damage")
	}
	battleLog("===================================================================")
}

// Retreat function
function retreat() {
	// If player is fighting a monster
	if (getLocalStorage("currentMonster").length > 0) {
		// If retreat attempt less than 3
		if (getLocalStorage("retreatAttempts") < 3) {
			// Generate a chance
			var chance = Math.round((Math.random() * (100 - 0) + 0))
			// If chance is more than 80
			if (chance > 80) {
				// Reset monsters
				var monsterHealth = eval(getLocalStorage("currentMonster")).name + "Health"
				setLocalStorage(monsterHealth, getLocalStorage("compMaxHealth"))
				var defeatedMonsters = getLocalStorage("defeatedMonsters")
				var bossMonsters = []
				for (i = 0; i < defeatedMonsters.length; i++) {
					if (eval(defeatedMosters[i]) instanceof Boss) {
						bossMonsters.push(defeatedMonsters[i])
					}
				}
				setLocalStorage("retreatAttempts", 0)
				setLocalStorage("defeatedMosters", [])
				battleLog("You successfully retreated back to town!")
				return true;
			// If retreat failed
			} else {
				var retreatAttempts = getLocalStorage("retreatAttempts")
				retreatAttempts++
				setLocalStorage("retreatAttempts", retreatAttempts)
				battleLog("You failed to retreat!")
				compCounter();
				battleLog("===================================================================")
				return false;
			}
		} else {
			battleLog("You can't retreat anymore!")
			battleLog("===================================================================")
			return false;
		}
	}
}
