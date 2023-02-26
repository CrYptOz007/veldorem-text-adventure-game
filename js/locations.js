/////////////////////////////////////////////////////////////
// Main town
/////////////////////////////////////////////////////////////


var castle = new Location("castle",
                          "The Castle",
                          "In the land of Veldorem, where dungeons, monsters, dragons, fairy’s, dwarfs, goblins, ogres, trolls and demi-humans exist, every one thousand years there will be one hero that will save this world from destruction. You are the chosen one to defeat the demon lord, Musa, and set this world free for another millennium. To defeat this demon lord, you are to explore the hidden dungeon that had reported sightings of Musa’s underlings. Your adventure will be treacherous and exciting – facing many challenges as you make your way deeper into the dungeon. Monsters ranging from mutated spiders to zombie dragons and dinosaur sized scorpions. You will be summoned by his Majesty King of Veldermont, Napoleon IV, and he will give you the Legendary Hero Gear and 500 gold. As a Hero of Veldorem, you must choose a name that will resonate throughout the world and you'll be known as the one who has saved this world from destruction",
                          "castleInventory",
                          ['heroArmour', 'heroSword'],
                          "../img/castle.png")

var town = new Location("town", //shortName
                        "The Town", //displayName
                        `Welcome, ${getLocalStorage('playerName')}, to Kazah. The entrance to the dungeon is north. You may speak to Gazel, the blacksmith, Fiona, the alchemist, or talk to Lenina, she will give you a walkthrough of the dungeon and some insights. Make sure you're prepared before you enter! Recommended to buy some healing potions from Fiona first`, //description
                        "townInventory", //inventoryName
                        [], //inventoryArray
                        "../img/town.png", //imageLocationPath
                        "../locations/floor1/floor1Entrance.html", //north
                        undefined, //east
                        undefined, //south
                        undefined, //west
                        undefined, //northEast
                        undefined, //southEast
                        undefined, //northWest
                        undefined, //southWest
                        false, //hasHiddenMonster
                        undefined, //hiddenMonster
                        false, //hasMonster
                        undefined, //monster
                        true); //hasNPC

var blacksmith = new Location("blacksmith",
                              "The Blacksmith",
                              "Welcome young hero, what I have in stock is the finest quality sword and armour in all of Veldorem. If you need anything special, I can craft it for you, provided you have the materials for it",
                              "blacksmithInventory",
                              [],
                              "../img/gazel.png",
                              undefined,
                              undefined,
                              undefined,
                              undefined,
                              undefined,
                              undefined,
                              undefined,
                              undefined,
                              false,
                              undefined,
                              false,
                              undefined,
                              "gazel",
                              undefined,
                              "town.html")

var alchemist = new Location("alchemist",
                              "The Alchemist",
                              "Hello there " + getLocalStorage('playerName') + " I've brewed some of the best potions made. I hope that my potions will come in handy during your quest. All the best!",
                              "alchemistInventory",
                              [],
                              "../img/fiona.png",
                              undefined,
                              undefined,
                              undefined,
                              undefined,
                              undefined,
                              undefined,
                              undefined,
                              undefined,
                              false,
                              undefined,
                              false,
                              undefined,
                              "fiona",
                              undefined,
                              "town.html")

var guide = new Location("guide",
                        "The Guide",
                        "Hi there, I can explain some items to you and their functions, in solving a puzzle if you show it to me. Type <i>help</i> in the command input to view the list of available commands. I'll always be here waiting. Good luck!",
                        "guideInventory",
                        [],
                        "../img/lenina.png",
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        false,
                        undefined,
                        false,
                        undefined,
                        "lenina",
                        undefined,
                        "town.html")

/////////////////////////////////////////////////////////////
// Floor 1
/////////////////////////////////////////////////////////////

var floor1Entrance = new Location("entrance", //shortName
                                  "The First Floor Entrance", //displayName
                                  "You have entered the dungeon. Approaching forward, you see Arachnomorpha, a morphed, mutated spider which is the boss of this floor.", //description
                                  "floor1Entrance", //inventoryName
                                  ["smallHealthPotion"], //inventoryArray
                                  "../../img/floor1/entrance.png", //imageLocationPath
                                  "floor1BossRoom.html", //north
                                  undefined, //east
                                  undefined, //south
                                  undefined, //west
                                  undefined, //northEast
                                  undefined, //southEast
                                  undefined, //northWest
                                  undefined, //southWest
                                  false, //hasHiddenMonster
                                  undefined, //hiddenMonster
                                  false, //hasMonster
                                  undefined, //monster
                                  false, //hasNPC
                                  "floor1", //floor
                                  "../town.html"); //goBack

var floor1BossRoom = new Location("floor1BossRoom", //shortName
                                  "The First Floor Boss Room", //displayName
                                  "You can see a loot chest and a potion chest in your vicinity. The next floor down is north", //description
                                  "floor1BossRoom", //inventoryName
                                  [], //inventoryArray
                                  "../../img/floor1/bossRoom.png", //imageLocationPath
                                  "../floor2/floor2Entrance.html", //north
                                  undefined, //east
                                  undefined, //south
                                  undefined, //west
                                  undefined, //northEast
                                  undefined, //southEast
                                  undefined, //northWest
                                  undefined, //southWest
                                  false, //hasHiddenMonster
                                  undefined, //hiddenMonster
                                  true, //hasMonster
                                  "arachnomorpha", //monster
                                  false, //hasNPC
                                  "floor1", //floor
                                  "floor1Entrance.html"); //goBack
