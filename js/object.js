var allItems = ['heroArmour', 'heroSword', 'smallHealthPotion', 'mediumHealthPotion', 'largeHealthPotion', 'strengthPotion', 'criticalPotion', 'retreatPotion', 'leather', 'thickLeather', 'ironOre', 'ironIngot', 'carbonSteelIngot', 'meteoriteOre', 'meteoriteIngot', 'tritiumIngot', 'diamond', 'woodenPlank', 'hardenedTimber']

var heroArmour = new Armour('heroArmour',
                            "Hero's Armour",
                            "The starting armour given to you by the King.",
                            generateOtherNames("hero's armour"),
                            5,
                            undefined,
                            1,
                            false,
                            false,
                            350,
                            200,
                            5.5)

var heroSword = new Sword('heroSword',
                          "Hero's Sword",
                          "The starting sword given to you by the King.",
                          generateOtherNames("hero's sword"),
                          7,
                          undefined,
                          1,
                          false,
                          false,
                          350,
                          200,
                          3.5)

var smallHealthPotion = new HealthPotion("smallHealthPotion",
                                          "Small Health Potion",
                                          "A small pot of instant health regeneration potion",
                                          true,
                                          generateOtherNames("small health potions"),
                                          0.25,
                                          true,
                                          25,
                                          75,
                                          25)

var mediumHealthPotion = new HealthPotion("mediumHealthPotion",
                                          "Medium Health Potion",
                                          "A medium pot of instant health regeneration potion",
                                          true,
                                          generateOtherNames("medium health potions"),
                                          0.35,
                                          true,
                                          50,
                                          170,
                                          75)

var largeHealthPotion = new HealthPotion("largeHealthPotion",
                                          "Large Health Potion",
                                          "A large pot of instant health regeneration potion",
                                          true,
                                          generateOtherNames("large health potions"),
                                          0.50,
                                          true,
                                          70,
                                          220,
                                          100)

var strengthPotion = new StrengthPotion("strengthPotion",
                                        "Strength Potion",
                                        "A small vial of synthesised concentrated steriods and adrenalin. One time use only, the effects will wear out after the battle",
                                        true,
                                        generateOtherNames("strength potions"),
                                        0.35,
                                        true,
                                        35,
                                        350,
                                        125)

var criticalPotion = new CriticalPotion("criticalPotion",
                                        "Critical Potion",
                                        "Increases player critical hit chance. One time use only, the effects will wear out after the battle",
                                        true,
                                        generateOtherNames("critical potions"),
                                        0.35,
                                        true,
                                        10,
                                        450,
                                        200)

var retreatPotion = new RetreatPotion("retreatPotion",
                                      "Retreat Potion",
                                      "Increases player retreat chance by deploying a cloud of smoke. One time use only, the effects will wear out after the battle",
                                      true,
                                      generateOtherNames("retreat potions"),
                                      0.35,
                                      true,
                                      50,
                                      250,
                                      100)

var leather = new Item("leather",
                        "Leather",
                        "Regular Grade Leather. Useful for crafting lower tier items.",
                        undefined,
                        generateOtherNames("leathers"),
                        0.13,
                        30,
                        15)

var thickLeather = new Item("thickLeather",
                            "Thick Leather",
                            "Higher Quality and more durable than regular leather, it is used for crafting high teir items",
                            undefined,
                            generateOtherNames("thick leathers"),
                            0.13,
                            65,
                            20)

var ironOre = new Item("ironOre",
                        "Iron Ore",
                        "A common raw metal. 3 Iron Ores can be crafted into an ingot",
                        undefined,
                        generateOtherNames("iron ores"),
                        0.2,
                        10,
                        5)

var ironIngot = new Item("ironIngot",
                        "Iron Ingot",
                        "Lower quality iron ingot used for general purpose tools",
                        undefined,
                        generateOtherNames("iron ingots"),
                        0.4,
                        35,
                        15,
                        true,
                        ['ironOre', 'ironOre', 'ironOre'])

var carbonSteelIngot = new Item("carbonSteelIngot",
                                "Carbon Steel Ingot",
                                "Very strong refined steel with approxmiately 1% carbon content used for crafting edged tools",
                                undefined,
                                generateOtherNames("carbon steel ingots"),
                                0.5,
                                75,
                                25,
                                true,
                                ['ironIngot', 'ironIngot'])

var meteoriteOre = new Item("meteoriteOre",
                              "Meteorite Ore",
                              "An unknown raw metal, crafted into Meteorite Ingots",
                              undefined,
                              generateOtherNames("meteorite ores"),
                              0.2,
                              30,
                              15)

var meteoriteIngot = new Item("meteoriteIngot",
                              "Meteorite Ingot",
                              "An unknown refined metal, but known for its high density and complex molecular structure, tempered to thousands for degrees",
                              undefined,
                              generateOtherNames("meteorite ingots"),
                              0.6,
                              120,
                              55,
                              true,
                            ["meteoriteOre", "meteoriteOre", "meteoriteOre"])

var tritiumIngot = new Item("tritiumIngot",
                            "Tritium Ingot",
                            "A rare radioactive metal used for crafting higher teir tools",
                            undefined,
                            generateOtherNames("tritium ingots"),
                            0.6,
                            120,
                            55)

var diamond = new Item("diamond",
                        "Diamond",
                        "A solid carbon crystal structure. It is the hardest material but difficult to work with",
                        undefined,
                        generateOtherNames("diamonds"),
                        0.1,
                        250,
                        125)


var woodenPlank = new Item("woodenPlank",
                            "Wooden Plank",
                            "Wood used for crafting handles of swords and other capentry objects",
                            undefined,
                            generateOtherNames("wooden planks"),
                            0.8,
                            20,
                            5)

var hardenedTimber = new Item("hardenedTimber",
                            "Hardened Timber",
                            "Higher quality, durable and strong plank that has been cultivated for months to the desired hardness.",
                            undefined,
                            generateOtherNames("hardened timbers"),
                            1.2,
                            50,
                            25,
                            true,
                          ['woodenPlank', 'woodenPlank'])
