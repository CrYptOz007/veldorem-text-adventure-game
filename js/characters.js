var npcList = [["gazel", generateOtherNames("blacksmith")], ["fiona", generateOtherNames("alchemist")], ["lenina", generateOtherNames("guide")]]

/////////////////////////////////////////////////////////////
// NPC
/////////////////////////////////////////////////////////////

var gazel = new NPC("Gazel", //npc Name
                    "gazelInventory", // npc inventoryName
                    ['leather', 'thickLeather', 'ironOre', 'ironIngot', 'carbonSteelIngot', 'meteoriteOre', 'meteoriteIngot', 'tritiumIngot', 'diamond', 'woodenPlank', 'hardenedTimber'], // npc inventoryArray
                    undefined, // isNpc = default: true
                    undefined, // isTalkable = default: true
                    true, // can buy
                    true, // can sell
                    true, // can craft
                    true) // can upgrade

var fiona = new NPC("Fiona",
                    "fionaInventory",
                    ['smallHealthPotion', 'mediumHealthPotion', 'largeHealthPotion', 'strengthPotion', 'criticalPotion', 'retreatPotion'],
                    undefined,
                    undefined,
                    true,
                    true,
                    false,
                    false)

var lenina = new NPC("Lenina",
                    "leninaInventory",
                    [],
                    undefined,
                    undefined,
                    false,
                    false,
                    false,
                    false)

var player = new Hero(getLocalStorage("playerName"), //playerName
                      "playerInventory", //playerInventory
                      [], //playerInventoryArray
                      getLocalStorage("playerBalance"), //playerBalance
                      getLocalStorage("playerHealth"), //playerHealth
                      getLocalStorage("currentWeight"),
                      15, //player Max Weight allowed
                      false, //forceHiddenStats
                      getLocalStorage("retreatAttempts"), //retreatAttempts
                      getLocalStorage("activePotions"), //activePotions
                      getLocalStorage("activeSword"), //activeSword
                      getLocalStorage("activeArmour")) //activeArmour

                      /////////////////////////////////////////////////////////////
                      // Monsters
                      /////////////////////////////////////////////////////////////

var arachnomorpha = new Boss("arachnomorpha", // monster name
                              "arachnomorphaInventory", // monster inventoryName
                              [], // monster inventory array
                              undefined, //ismonster true
                              "A large insectoid creature resembling a spider. It usually lives in damp caves and swamps.",
                              generateOtherNames("The Arachnomorpha"), // otherNames
                              14, // monster damage
                              75, // monster hp
                              true, // force hidden stats
                              getLocalStorage(this.name), // isDefeated
                              "../locations/floor1/floor1BossRoom.html", // returnPath
                              100); // reward
