// Class contructor for Locations
class Location {
  constructor(shortName, displayName, description, inventoryName, inventoryArray, imageLocationPath, north, east, south, west, northEast, northWest, southEast, southWest, hasHiddenMonster, hiddenMonster, hasMonster, monster, hasNPC, floor, goBack) {
    this.shortName = shortName;
    this.displayName = displayName;
    this.description = description;
    this.inventoryName = inventoryName;
    this.inventoryArray = setClassLocalStorage(this.inventoryName, inventoryArray)
    this.imageLocationPath = imageLocationPath;
    this.north = north;
    this.east = east;
    this.south = south;
    this.west = west;
    this.northEast = northEast;
    this.northWest = northWest;
    this.southEast = southEast;
    this.southWest = southWest;
    this.hasHiddenMonster = hasHiddenMonster;
    this.hiddenMonster = hiddenMonster;
    this.hasMonster = hasMonster;
    this.monster = monster;
    this.hasNPC = hasNPC
    this.floor = floor
    this.goBack = goBack
  }
}

// Basic class contructor for any character
class Character {
  constructor(name, inventoryName, inventoryArray) {
    this.name = name;
    this.inventoryName = inventoryName;
    this.inventoryArray = setClassLocalStorage(this.inventoryName, inventoryArray)
  }

}

// Subclass of a character: Hero
class Hero extends Character {
  // Set the constructor values of that class
  constructor(name, inventoryName, inventoryArray, balance, health, currentWeight, maxWeight, forceHiddenStats, retreatAttempts, activePotions, activeSword, activeArmour) {
    super(name, inventoryName, inventoryArray)
    this.balance = setClassLocalStorage("playerBalance", 0);
    this.health = setClassLocalStorage("playerHealth", 100);
    this.currentWeight = setClassLocalStorage("currentWeight", 0);
    this.maxWeight = maxWeight;
    this.forceHiddenStats = forceHiddenStats;
    this.retreatAttempts = setClassLocalStorage("retreatAttempts", 0);
    this.activePotions = setClassLocalStorage("activePotions", []);
    this.activeSword = setClassLocalStorage("activeSword", "");
    this.activeArmour = setClassLocalStorage("activeArmour", "");
  }

  // getGold method for player
  getGold(amount) {
    // Get balance from location storage
    var balance = getLocalStorage("playerBalance")
    // Add the amount to Balance
    balance += amount;
    // Set the new balance and log it
    setLocalStorage("playerBalance", balance)
    activityLog("You received " + amount + " Gold")
  }

  // move method for player
  move(location, direction) {
    if (north.includes(direction)) {
      redirectLocation(location.north, "north")
    } else if (east.includes(direction)) {
      redirectLocation(location.east, "east")
    } else if (south.includes(direction)) {
      redirectLocation(location.south, "south")
    } else if (west.includes(direction)) {
      redirectLocation(location.west, "west")
    } else if(northEast.includes(direction)) {
      redirectLocation(location.northEast, "northeast")
    } else if (southEast.includes(direction)) {
      redirectLocation(location.southEast, "southeast")
    } else if (northWest.includes(direction)) {
      redirectLocation(location.northWest, "northwest")
    } else if (southWest.includes(direction)) {
      redirectLocation(location.southWest, "southwest")
    }
  }

  // Get item method for player
  getItem(location, item) {
    // Get and set all variables
    var locationInventoryArray = getLocalStorage(location.inventoryName)
    var playerInventoryArray = getLocalStorage(player.inventoryName)
    var playerCurrentWeight = getLocalStorage('currentWeight')
    var count = 0;
    var itemFound = false;

    // Get the item object by the name
    item = getItemInfo(item)

    // Search for the item in the location
    while (locationInventoryArray.length > count) {
      if (item.shortName === locationInventoryArray[count]) {
        itemFound = true;
      }
      count++;
    }

    // If the item is found
    if (itemFound === true) {
      // If the player's current weight can carry the item
      if (playerCurrentWeight + item.weight <= player.maxWeight) {
        // Remove and add the item to the arrays
        removeItemFromArray(locationInventoryArray, item.shortName)
        addItemToArray(playerInventoryArray, item.shortName)
        setLocalStorage(location.inventoryName, locationInventoryArray)
        setLocalStorage(player.inventoryName, playerInventoryArray)
        activityLog("You've picked up the " + item.displayName)
      // Else if the object is a world instance object that can't be picked up
      } else if (item.tooHeavy) {
        activityLog("You can't pick this item up")
      // Else if the object is too heavy for the current weight
      } else if (player.currentWeight + item.weight > player.maxWeight) {
        activityLog("You can't carry this item, please drop some first")
      }
    // Else if the item is not found
    } else {
      activityLog("Invalid Item in Location")
    }
  }

  // Drop method function for player
  dropItem(location, item) {
    // Get and set all variables
    var locationInventoryArray = getLocalStorage(location.inventoryName)
    var playerInventoryArray = getLocalStorage(player.inventoryName)
    var count = 0;
    var itemFound = false;

    // Get the item object by the name
    item = getItemInfo(item)

    // Search for the item in the location
    while (playerInventoryArray.length > count) {
      if (item.shortName === playerInventoryArray[count]) {
        itemFound = true;
      }
      count++;
    }

    // If the item is found
    if (itemFound === true) {
      // Remove item from player inventory and add it back to the location
      removeItemFromArray(playerInventoryArray, item.shortName)
      addItemToArray(locationInventoryArray, item.shortName)
      setLocalStorage(location.inventoryName, locationInventoryArray)
      setLocalStorage(player.inventoryName, playerInventoryArray)
      activityLog("You've dropped the " + eval(item).displayName)
    } else {
      // Else if the item is not found in the player's inventory
      activityLog("Item not found in your Inventory")
    }
  }

  // Buy method for player
  buyItem(npc, quantity, item) {
    // If you can't buy items from the current NPC the player is talking to
    if (!npc.canBuy) {
      activityLog("You can't buy items from " + npc.name)
      return false;
    }

    // Get and set all variables
    var npcInventoryArray = getLocalStorage(npc.inventoryName)
    var playerInventoryArray = getLocalStorage(player.inventoryName)
    var playerBalance = player.balance
    var count = 0;
    var npcHasItem = false;

    // Get the item object by the name
    item = getItemInfo(item)

    // Search for the item in the location
    while (npcInventoryArray.length > count) {
      if (item.shortName === npcInventoryArray[count]) {
        npcHasItem = true;
      }
      count++;
    }

    // If the NPC has the item
    if (npcHasItem === true) {
      // If the player has enough money to buy the items
      if (playerBalance - (item.cost * quantity) >= 0) {
        // If the total quantified weight of the items is too much to carry
        if (this.currentWeight + (item.weight * quantity) > this.maxWeight) {
          activityLog("Inventory full! You can't carry them if you buy it")
        // Else if the player can carry them
        } else {
        // Deduct the cost of the total items bought
          playerBalance -= item.cost * quantity;
        // Loop through the quantity
          for (i = 0; i < quantity; i++) {
            // If it's a sword or armour that exists only once in the game
            if (item instanceof Sword || item instanceof Armour) {
              // Remove it from the NPC's inventory
              removeItemFromArray(npcInventoryArray, item.shortName);
              setLocalStorage(npc.inventoryName, npcInventoryArray);
            }
            // Add the item to the player's inventory
            addItemToArray(playerInventoryArray, item.shortName);
            setLocalStorage(player.inventoryName, playerInventoryArray);
          }
          // Set the player balance and log it
          setLocalStorage("playerBalance", playerBalance)
          activityLog("You bought " + quantity + " " + item.displayName + " for " + item.cost * quantity + " Gold")
        }
      // Else if the player doesn't have enough money
      } else {
        activityLog("You don't have enough money!")
      }
    // Else if item input is invalid or the NPC doesn't have the item
    } else {
      activityLog("NPC doesn't have the item or it's Invalid!")
    }
  }

  // Sell method for player
  sellItem(npc, quantity, item) {
    // If you can't sell items to the current NPC the player is talking to
    if (!npc.canSell) {
      activityLog("You can't sell items to " + npc.name)
    }
    var npcInventoryArray = getLocalStorage(npc.inventoryName)
    var playerInventoryArray = getLocalStorage(player.inventoryName)
    var playerBalance = player.balance
    var count = 0;
    var playerHasItem = false;

    // Get and set all variables
    item = getItemInfo(item)

    // Search for the item in the location
    while (playerInventoryArray.length > count) {
      if (item.shortName === playerInventoryArray[count]) {
        playerHasItem = true;
      }
      count++;
    }

    // If the player has the item
    if (playerHasItem === true) {
      // Add the sell value of all items to the player balance
      playerBalance = playerBalance + (item.sell * quantity);
      // Loop through the quantity of items being sold
      for (i = 0; i < quantity; i++) {
        // Remove it from the player's inventory
        removeItemFromArray(playerInventoryArray, item.shortName);
        // If it's a sword or armour
        if (item instanceof Sword || item instanceof Armour) {
          // Put it back into the NPC's inventory
          addItemToArray(npcInventoryArray, item.shortName);
          setLocalStorage(npc.inventoryName, npcInventoryArray);
        }
      }
      // Set the player balance and Inventory
      setLocalStorage("playerBalance", playerBalance)
      setLocalStorage(player.inventoryName, playerInventoryArray);
      activityLog("You sold " + quantity + " " + item.displayName + " for " + item.sell * quantity + " Gold")
    // If you typed the item name wrong or don't have it in your inventory
    } else {
      activityLog("Invalid Item name or you don't have this item!")
    }
  }

  // Equip method for player
  equip(item) {
    // Get and set all variables
    var localStorageName = "";
    var activeSlot = "";
    var playerInventoryArray = getLocalStorage(player.inventoryName)
    var itemFound = false;
    var count = 0;

    // Loop through all items by their generated names from the input
    for (i = 0; i < allItems.length; i++) {
      if (eval(allItems[i]).otherNames.includes(item)) {
        item = eval(allItems[i]).shortName;

        // If the item is a sword
        if (eval(item) instanceof Sword) {
          // Get the current active sword slot
          localStorageName = "activeSword"
          activeSlot = getLocalStorage(localStorageName)
        // If the item is armour
        } else if (eval(item) instanceof Armour) {
          // Get the current active armour slot
          localStorageName = "activeArmour"
          activeSlot = getLocalStorage(localStorageName)
        // Else if it's neither and item or armour
        } else {
          activityLog("You cannot equip this item")
          return false;
        }
      }
    }

    // Search for the item in the player's inventory
    while (playerInventoryArray.length > count) {
      if (item === playerInventoryArray[count]) {
        itemFound = true;
      }
      count++;
    }

    // If the player has the item
    if (itemFound === true) {
      // If there's already an item equiped for that slot
      if (activeSlot.length > 0) {
        activityLog(`Unequip the current ${eval(getLocalStorage(localStorageName)).constructor.name.toLowerCase()} first`)
        return false;
      // If there isn't an item equiped for that slot
      } else {
        // Remove it from the inventory and add it to the active slot
        removeItemFromArray(playerInventoryArray, item)
        setLocalStorage(localStorageName, item)
        setLocalStorage(player.inventoryName, playerInventoryArray)
        activityLog("You've equiped the " + eval(item).displayName)
      }
    // Else if the player doesn't have the item in the inventory
    } else {
      activityLog("Item not found in your Inventory")
    }
  }

  // Unequip method for player
  unequip(item) {
    // Get and set all variables
    var localStorageName = "";
    var activeSlot = "";
    var playerInventoryArray = getLocalStorage(player.inventoryName)
    var itemFound = false;

    // Loop through all items by their generated names from the input, same as equip function
    for (i = 0; i < allItems.length; i++) {
      if (eval(allItems[i]).otherNames.includes(item)) {
        item = eval(allItems[i]).shortName;

        if (eval(item) instanceof Sword) {
          localStorageName = "activeSword"
          activeSlot = getLocalStorage(localStorageName)
        } else if (eval(item) instanceof Armour) {
          localStorageName = "activeArmour"
          activeSlot = getLocalStorage(localStorageName)
        } else {
          activityLog("You cannot unequip this item")
          return false;
        }
      }
    }

    // If there's nothing to unequip
    if (activeSlot.length === 0) {
      activityLog(`There's nothing to unequip`)
      return false;
    }

    // Check if the item is found in the active slot
    if (item === getLocalStorage(localStorageName)) {
      itemFound = true;
    }

    // If it is found in the active slot
    if (itemFound === true) {
      // Remove the item from the active slot and place it back into the player's inventory
      addItemToArray(playerInventoryArray, item)
      setLocalStorage(localStorageName, "")
      setLocalStorage(player.inventoryName, playerInventoryArray)
      activityLog("You've unequiped the " + eval(item).displayName)
    // If the item is not found in the active slot
    } else {
      activityLog("Item not found in your equiped " + eval(getLocalStorage(localStorageName)).constructor.name.toLowerCase())
    }
  }

  /////////////////////////////////////////////////////////////////////
  // Same as equip method but manipulated to be used only to equip armour
  /////////////////////////////////////////////////////////////////////
  takeOn(item) {
    var localStorageName = "";
    var activeSlot = "";
    var playerInventoryArray = getLocalStorage(player.inventoryName)
    var itemFound = false;
    var count = 0;

    for (i = 0; i < allItems.length; i++) {
      if (eval(allItems[i]).otherNames.includes(item)) {
        item = eval(allItems[i]).shortName;

        if (eval(item) instanceof Armour) {
          localStorageName = "activeArmour"
          activeSlot = getLocalStorage(localStorageName)
        } else {
          activityLog("You can only take on and off the armour")
          return false;
        }

      }
    }

    while (playerInventoryArray.length > count) {
      if (item === playerInventoryArray[count]) {
        itemFound = true;
      }
      count++;
    }

    if (itemFound === true) {
      if (activeSlot.length > 0) {
        activityLog(`Unequip the current ${eval(getLocalStorage(localStorageName)).constructor.name.toLowerCase()} first`)
        return false;
      } else {
        removeItemFromArray(playerInventoryArray, item)
        setLocalStorage(localStorageName, item)
        setLocalStorage(player.inventoryName, playerInventoryArray)
        activityLog("You've equiped the " + eval(item).displayName)
      }
    } else {
      activityLog("Item not found in your Inventory")
    }

  }


  /////////////////////////////////////////////////////////////////////
  // Same as unequip method but manipulated to be used only to unequip armour
  /////////////////////////////////////////////////////////////////////
  takeOff(item) {
    var localStorageName = "";
    var activeSlot = "";
    var playerInventoryArray = getLocalStorage(player.inventoryName)
    var itemFound = false;

    for (i = 0; i < allItems.length; i++) {
      if (eval(allItems[i]).otherNames.includes(item)) {
        item = eval(allItems[i]).shortName;

        if (eval(item) instanceof Armour) {
          localStorageName = "activeArmour"
          activeSlot = getLocalStorage(localStorageName)
        } else {
          activityLog("You can only take on and off the armour")
          return false;
        }

      }
    }

    if (activeSlot === "") {
      activityLog(`There's nothing to unequip`)
      return false;
    }

    if (item === getLocalStorage(localStorageName)) {
      itemFound = true;
    }

    if (itemFound === true) {
      addItemToArray(playerInventoryArray, item)
      setLocalStorage(localStorageName, "")
      setLocalStorage(player.inventoryName, playerInventoryArray)
      activityLog("You've unequiped the " + eval(item).displayName)
    } else {
      activityLog("Item not found in your equiped " + eval(getLocalStorage(localStorageName)).constructor.name.toLowerCase())
    }
  }

  // Talk to NPC method
  talk(npc) {
    // If the location has an NPC
    if (thisLocation.hasNPC) {
      // Set the initial variable
      var validNPC = false;
      // Loop through the NPC List
      for (i = 0; i < npcList.length; i++) {
        // If the npc inputted is either it's name or occupation
        if (npcList[i].includes(npc) || npcList[i][1].includes(npc)) {
          // Redirect to player to talk to that NPC
          validNPC = true;
          npc = npcList[i][1][0];
          event.preventDefault();
          window.location = npc + ".html"
        }
      }
      // If the player inputted the incorrect name or occupation
      if (!validNPC) {
        activityLog("Invalid NPC")
      }
    // Else if the location doesn't have an NPC
    } else {
      activityLog("There's no NPC to talk to")
    }
  }

  // Upgrade method for player
  upgrade(item) {
    // Get and set all variables
    var playerInventoryArray = getLocalStorage(player.inventoryName)
    var playerBalance = player.balance
    var count = 0;
    var playerHasItem = false;

    // If the NPC can't upgrade items
    if (eval(thisLocation.hasNPC).canUpgrade == false) {
      activityLog("This NPC can't upgrade your item")
      return false;
    }

    // Set the item properties from the generated names of the item
    item = getItemInfo(item)

    // Search for the item in the player's inventory
    while (playerInventoryArray.length > count) {
      if (item.shortName === playerInventoryArray[count]) {
        playerHasItem = true;
      }
      count++;
    }

    // If player has the item
    if (playerHasItem === true) {
      // If it's not a sword or armour
      if (!(item instanceof Sword) && !(item instanceof Armour)) {
        activityLog("You can't upgrade this item")
        return false;
      }
      // If it is a sword or armour
      var upgradeCost;
      // Case statement for upgrading item based on its teir
      switch (item.currentTeir) {
        case 1:
          this.upgradeItem(item, 1.3, 1.6)
          break;
        case 2:
          this.upgradeItem(item, 1.8, 1.4)
          break;
        default:
          activityLog("This item is max upgraded")
      }
    // If the item is invalid
    } else {
      activityLog("Invalid Item in your Inventory")
    }
  }

  // Method for upgrading the item
  upgradeItem(item, upgradeCost, upgradeValue) {
    // Set the upgrade cost multiplier
    upgradeCost = item.cost * upgradeCost
    // Get the current teir of the item
    var itemTeir = getLocalStorage(`${item.shortName}Teir`)
    // Ouput the confirmation box on the details of the upgrade
    var r = confirm("The upgrade cost is " + upgradeCost + " Gold which increases it by " + (upgradeValue * 100) + "%. Are you sure you want to upgrade this item?")
    // If player's wants to upgrade
    if (r) {
      // If the player can afford the upgrade
      if (player.balance - upgradeCost >= -1) {
        //Increase the teir by 1
        itemTeir++
        // If it's a sword
        if (item instanceof Sword) {
          // Increase the sword damage by the upgradeValue multiplier
          var itemDamage = getLocalStorage(`${item.shortName}Damage`)
          itemDamage = Math.round(item.swordDamage * upgradeValue)
          setLocalStorage(`${item.shortName}Damage`, itemDamage)
        // If it's an armour
        } else if (item instanceof Armour) {
          // Increase the armour protection by the upgradeValue multiplier
          var itemValue = getLocalStorage(`${item.shortName}Value`)
          itemValue = Math.round(item.armourValue * upgradeValue)
          setLocalStorage(`${item.shortName}Value`, itemValue)
        }
        // Deduct the upgrade cost from the balance
        var playerBalance = player.balance - upgradeCost
        // Set all the new localstorage values from the upgrade
        setLocalStorage("playerBalance", playerBalance)
        setLocalStorage(`${item.shortName}Teir`, itemTeir)
        activityLog("Successfully upgraded " + item.displayName + " for " + upgradeCost + " Gold.")
      // Else if the player doesn't have enough money
      } else {
        activityLog("You don't have enough money to upgrade this item")
      }
    }
    return false;
  }

  // Craft method for player
  craft(npc, item) {
    // If NPC can craft
    if (!npc.canCraft) {
      activityLog("You can't craft items from " + npc.name)
      return false;
    }

    // Get and set variables
    var npcInventoryArray = getLocalStorage(npc.inventoryName)
    var playerInventoryArray = getLocalStorage(player.inventoryName)
    var count = 0;
    var npcHasItem = false;

    //Get item properties by name
    item = getItemInfo(item)

    // Search through the NPC inventory for the item
    while (npcInventoryArray.length > count) {
      if (item.shortName === npcInventoryArray[count]) {
        npcHasItem = true;
      }
      count++;
    }

    // If NPC has the item to craft
    if (npcHasItem === true) {
      // If the item is craftable
      if (item.isCraftable === true) {
        // Loop through all the crafting materials
        for (i = 0; i < item.craftingMaterials.length; i++) {
          // If playerInventory includes one of the crafting materials
          if (playerInventoryArray.includes(item.craftingMaterials[i])) {
            // Remove it from the player Inventory
            removeItemFromArray(playerInventoryArray, item.craftingMaterials[i])
          // Else, the player doesn't have the required materials
          } else {
            activityLog("You don't have the required items to craft this " + item.displayName)
            return false
          }
        }
        // Add the item to the array after it's successfully removed all the items
        addItemToArray(playerInventoryArray, item.shortName)
        setLocalStorage(player.inventoryName, playerInventoryArray)
        activityLog("You have successfully crafted the " + item.displayName)
        return false;
      // Else if the item is not craftable
      } else {
        activityLog("You can't craft this item")
        return false
      }
    // Else if the NPC doesn't have the item to craft
    } else {
      activityLog("NPC doesn't have this item")
      return false
    }

  }

  // Show hidden description of an item method
  showItem(item, npc) {
    // If the NPC the player is talking to isn't lenina
    if (npc.name !== "Lenina") {
      activityLog("This NPC doesn't know anything about the hidden aspects of this item")
      return false
    }

    // Get and set all variables
    var playerInventoryArray = getLocalStorage(player.inventoryName)
    var count = 0;
    var playerHasItem = false;

    // Get item properties by name
    item = getItemInfo(item)

    // Search through player inventory for the item
    while (playerInventoryArray.length > count) {
      if (item.shortName === playerInventoryArray[count]) {
        playerHasItem = true;
      }
      count++;
    }

    // If player has the item
    if (playerHasItem) {
      // If theres a hidden description of the item found
      if (item.hiddenDescription !== undefined) {
        // Show it to the player
        activityLog("Hidden Description: " + item.hiddenDescription)
      // Else, there is not hidden description
      } else {
        activityLog("There is no hidden description of this item")
      }
    }
    //return false;
  }

  // Drink potions method for player
  drink(item) {
    // Get and set all variables
    var playerInventoryArray = getLocalStorage(player.inventoryName)
    var playerActivePotions = getLocalStorage("activePotions")
    var count = 0;
    var playerHasItem = false;

    // Set the item object by name
    item = getItemInfo(item)

    // Search through the player inventory for the item
    while (playerInventoryArray.length > count) {
      if (item.shortName === playerInventoryArray[count]) {
        playerHasItem = true;
      }
      count++;
    }

    // If player has the item
    if (playerHasItem) {
      // If the item is a Health potion
      if (item instanceof HealthPotion) {
        // Heal the player
        heal(item.shortName)
        return false
      }
      // Else if item is not a health potion but is drinkable
      if (item.isDrinkable) {
        // if the potion isn't already active
        if (!playerActivePotions.includes(item.shortName)) {
          // Remove potion from inventory and add it to the active potions
          removeItemFromArray(playerInventoryArray, item.shortName)
          addItemToArray(playerActivePotions, item.shortName)
          setLocalStorage(player.inventoryName, playerInventoryArray)
          setLocalStorage("activePotions", playerActivePotions)
          activityLog("You drank a " + item.displayName)
          return false;
        // If potion is already active
        } else {
          activityLog("You already drank this potion")
          return false;
        }
      // Else if item is not drinkable
      } else {
        activityLog("You can't drink this")
        return false
      }
    } else {
      activityLog("You don't have this potion in your inventory")
    }
  }

}

// Subclass of a character: Monster
class Monster extends Character {
  constructor(name, inventoryName, inventoryArray, isMonster, description, otherNames, damage, health, forceHiddenStats, isDefeated, returnPath, reward) {
    super(name, inventoryName, inventoryArray)
    this.isMonster = true;
    this.description = description;
    this.otherNames = otherNames;
    this.damage = damage;
    this.health = setClassLocalStorage(name + "Health", health);
    this.forceHiddenStats = forceHiddenStats
    this.isDefeated = setClassLocalStorage(name, false)
    this.returnPath = returnPath
    this.reward = reward
  }
}

// Subclass of a character: Boss
class Boss extends Character {
  constructor(name, inventoryName, inventoryArray, isMonster, description, otherNames, damage, health, forceHiddenStats, isDefeated, returnPath, reward) {
    super(name, inventoryName, inventoryArray, Monster.reward)
    this.isMonster = true;
    this.description = description;
    this.otherNames = otherNames;
    this.damage = damage;
    this.health = setClassLocalStorage(name + "Health", health);
    this.forceHiddenStats = forceHiddenStats
    this.isDefeated = setClassLocalStorage(name, false)
    this.returnPath = returnPath
    this.reward = reward
  }
}

// Subclass of a character: NPC
class NPC extends Character {
  constructor(name, inventoryName, inventoryArray, isNPC, isTalkable, canBuy, canSell, canCraft, canUpgrade) {
    super(name, inventoryName, inventoryArray)
    this.isNPC = true;
    this.isTalkable = true;
    this.canBuy = canBuy;
    this.canSell = canSell;
    this.canCraft = canCraft;
    this.canUpgrade = canUpgrade;
  }
}

// Basic class contructor for any item
class Item {
  constructor(shortName, displayName, description, hiddenDescription, otherNames, weight, cost, sell, isCraftable, craftingMaterials, openable, isOpened, closable, unlockable, requiredItem, exit, enclosedItems, tooHeavy, isBreakable, isDrinkable, isRetreatPotion, retreatValue, isStrengthPotion, strengthValue, isCriticalPotion, criticalValue, isEquipable, isEnterable, lookUnderDescription, isPushable, isUpgradable, currentTeir) {
    this.shortName = shortName;
    this.displayName = displayName;
    this.description = description;
    this.hiddenDescription = hiddenDescription;
    this.otherNames = otherNames,
    this.weight = weight;
    this.cost = cost;
    this.sell = sell;
    this.isCraftable = isCraftable;
    this.craftingMaterials = craftingMaterials
    this.openable = false;
    this.isOpened = false;
    this.closable = false;
    this.unlockable = false;
    this.requiredItem = requiredItem;
    this.exit = exit;
    this.enclosedItems = enclosedItems;
    this.tooHeavy = tooHeavy;
    this.isBreakable = false;
    this.isDrinkable = false;
    this.isEquipable = false;
    this.isEnterable = false;
    this.lookUnderDescription = lookUnderDescription;
    this.isPushable = false;
    this.isUpgradable = false;
  }
}

// Subclass of an item: Health Potion
class HealthPotion extends Item {
  constructor(shortName, displayName, description, isDrinkable, otherNames, weight, isHealthPotion, healthRegenValue, cost, sell) {
    super(shortName, displayName, description, Item.isDrinkable, Item.otherNames, Item.cost, Item.sell, Item.weight)
    this.isDrinkable =  true;
    this.otherNames = otherNames
    this.weight = weight
    this.isHealthPotion = true;
    this.healthRegenValue = healthRegenValue;
    this.cost = cost;
    this.sell = sell;
  }
}

// Subclass of an item: Strength Potion
class StrengthPotion extends Item {
  constructor(shortName, displayName, description, isDrinkable, otherNames, weight, isStrengthPotion, strengthValue, cost, sell) {
    super(shortName, displayName, description, Item.isDrinkable, Item.otherNames, Item.cost, Item.sell, Item.weight)
    this.isDrinkable = true;
    this.otherNames = otherNames
    this.weight = weight
    this.isStrengthPotion = true;
    this.strengthValue = strengthValue;
    this.cost = cost;
    this.sell = sell;
  }
}

// Subclass of an item: Critical Potion
class CriticalPotion extends Item {
  constructor(shortName, displayName, description, isDrinkable, otherNames, weight, isStrengthPotion, strengthValue, cost, sell) {
    super(shortName, displayName, description, Item.isDrinkable, Item.otherNames, Item.cost, Item.sell, Item.weight)
    this.isDrinkable = true;
    this.otherNames = otherNames
    this.weight = weight
    this.isCriticalPotion = true;
    this.criticalValue = strengthValue;
    this.cost = cost;
    this.sell = sell;
  }
}

// Subclass of an item: Retreat Potion
class RetreatPotion extends Item {
  constructor(shortName, displayName, description, isDrinkable, otherNames, weight, isStrengthPotion, strengthValue, cost, sell) {
    super(shortName, displayName, description, Item.isDrinkable, Item.otherNames, Item.cost, Item.sell, Item.weight)
    this.isDrinkable = true;
    this.otherNames = otherNames
    this.weight = weight
    this.isRetreatPotion = true;
    this.retreatValue = strengthValue;
    this.cost = cost;
    this.sell = sell;
  }
}

// Subclass of an item: Armour
class Armour extends Item {
  constructor(shortName, displayName, description, otherNames, armourValue, isEquipable, currentTeir, isCraftable, craftingMaterials, cost, sell, weight) {
    super(shortName, displayName, description, Item.weight, Item.otherNames, Item.isEquipable, Item.currentTeir, Item.isCraftable, Item.craftingMaterials, Item.cost, Item.sell, Item.weight)
    this.weight = weight
    this.armourValue = setClassLocalStorage(shortName + "Value", armourValue)
    this.otherNames = otherNames
    this.isEquipable = true;
    this.currentTeir = setClassLocalStorage(shortName + `Teir`, currentTeir);
    this.isCraftable = isCraftable;
    this.craftingMaterials = craftingMaterials;
    this.weight = weight;
    this.cost = cost;
    this.sell = sell;
  }
}

// Subclass of an item: Sword
class Sword extends Item {
  constructor(shortName, displayName, description, otherNames, swordDamage, isEquipable, currentTeir, isCraftable, craftingMaterials, cost, sell, weight) {
    super(shortName, displayName, description, Item.otherNames, Item.isEquipable, Item.weight)
    this.swordDamage = setClassLocalStorage(shortName + "Damage", swordDamage)
    this.otherNames = otherNames
    this.isEquipable = true;
    this.currentTeir = setClassLocalStorage(shortName + `Teir`, currentTeir);
    this.isCraftable = isCraftable;
    this.craftingMaterials = craftingMaterials;
    this.weight = weight;
    this.cost = cost;
    this.sell = sell;
  }
}
