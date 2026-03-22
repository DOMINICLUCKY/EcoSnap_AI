require('dotenv').config()
const mongoose = require('mongoose')
const Item = require('./models/Item')

// CSV Data - 50 Recycling Items
const recyclingData = [
  {
    ItemName: "Plastic Water Bottle",
    Material: "Polyethylene Terephthalate (PET)",
    EcologicalFootprint: "Takes up to 450 years to decompose, shedding toxic microplastics into soil and waterways.",
    PathwayA: "1. Empty all liquids. 2. Crush the bottle to save space. 3. Leave the cap on and place in the plastics bin.",
    PathwayB: "1. Cut the bottle in half. 2. Invert the top half into the base. 3. Add soil and use as a self-watering seedling starter.",
    EcoMetric: "Recycling one plastic bottle saves enough energy to power a 60W lightbulb for 3 hours."
  },
  {
    ItemName: "Aluminum Can",
    Material: "Aluminum",
    EcologicalFootprint: "Takes 200 years to decompose in a landfill, but can be recycled infinitely without any loss of quality.",
    PathwayA: "1. Empty the contents completely. 2. Do not crush it (sorting machines read 3D shapes better). 3. Place in the metals bin.",
    PathwayB: "1. Carefully cut off the top. 2. Sand down any sharp inner edges. 3. Paint the outside and use as a modern desk pen holder.",
    EcoMetric: "Recycling aluminum saves 95% of the energy required to make the same amount of aluminum from its virgin source."
  },
  {
    ItemName: "Cardboard Box",
    Material: "Corrugated Cardboard",
    EcologicalFootprint: "Decomposes in 2 months, but produces methane gas if buried in a compacted, oxygen-starved landfill.",
    PathwayA: "1. Remove all plastic packing tape and shipping labels. 2. Flatten the box completely. 3. Keep dry and place in the paper bin.",
    PathwayB: "1. Cut into thick strips. 2. Roll the strips tightly together into a large disk. 3. Glue the edges to create a cat scratching pad.",
    EcoMetric: "Recycling 1 ton of cardboard saves 46 gallons of oil and 9 cubic yards of landfill space."
  },
  {
    ItemName: "Glass Jar",
    Material: "Soda-Lime Glass",
    EcologicalFootprint: "Glass takes over 1 million years to decompose in a landfill, remaining indefinitely as a physical hazard.",
    PathwayA: "1. Rinse out food residue. 2. Remove the metal lid (recycle separately). 3. Place in the glass recycling bin.",
    PathwayB: "1. Clean and dry the jar. 2. Add a layer of pebbles, then activated charcoal, then soil. 3. Plant moss to create a mini terrarium.",
    EcoMetric: "Glass can be recycled endlessly; doing so reduces related air pollution by 20% and water pollution by 50%."
  },
  {
    ItemName: "Newspaper",
    Material: "Cellulose Fiber",
    EcologicalFootprint: "Decomposes in 2-6 weeks, but the toxic inks can leach heavy metals into groundwater if not lined properly.",
    PathwayA: "1. Keep clean and dry. 2. Remove any plastic inserts or rubber bands. 3. Place loose in the paper recycling bin.",
    PathwayB: "1. Shred the paper into thin strips. 2. Soak in water and blend into a pulp. 3. Press flat to make your own artisan recycled paper.",
    EcoMetric: "Recycling a single run of the Sunday New York Times would save 75,000 trees."
  },
  {
    ItemName: "Steel Tin Can",
    Material: "Tin-Plated Steel",
    EcologicalFootprint: "Takes 50 years to decompose, slowly rusting and releasing iron oxides into the surrounding ecosystem.",
    PathwayA: "1. Rinse the can. 2. Place the detached lid inside the can and pinch the top closed. 3. Place in the metals bin.",
    PathwayB: "1. Remove the label and clean thoroughly. 2. Punch holes in the sides using a nail. 3. Place a candle inside for a rustic outdoor lantern.",
    EcoMetric: "Every ton of steel recycled saves 2,500 pounds of iron ore, 1,400 pounds of coal, and 120 pounds of limestone."
  },
  {
    ItemName: "Plastic Grocery Bag",
    Material: "High-Density Polyethylene (HDPE)",
    EcologicalFootprint: "Takes 1,000 years to degrade, breaking into micro-fragments that absorb toxins and kill marine life.",
    PathwayA: "1. Ensure they are clean and dry. 2. Bundle them together into one bag. 3. Drop them off at a designated grocery store film recycling bin (NOT curbside).",
    PathwayB: "1. Layer 3 bags together. 2. Place parchment paper over them and iron on low heat to fuse them. 3. Sew the fused fabric into a reusable tote pouch.",
    EcoMetric: "A single person uses around 365 plastic bags a year; recycling them prevents massive petroleum waste."
  },
  {
    ItemName: "Alkaline Battery",
    Material: "Zinc, Manganese Dioxide",
    EcologicalFootprint: "Leaks corrosive potassium hydroxide and heavy metals into the soil, severely contaminating groundwater.",
    PathwayA: "1. Do not put in standard recycling. 2. Tape the terminal ends with clear tape. 3. Take to a hazardous waste facility or electronics store.",
    PathwayB: "1. Batteries are too hazardous for DIY projects. 2. Store safely in a plastic container. 3. Deliver to a certified e-waste handler.",
    EcoMetric: "Recycling batteries recovers up to 99% of the heavy metals, which are then used to forge new electronics."
  },
  {
    ItemName: "Coffee Cup",
    Material: "Paper lined with Polyethylene",
    EcologicalFootprint: "Takes 20 years to decompose. The plastic lining prevents the paper from breaking down naturally.",
    PathwayA: "1. Throw away the paper cup (most curbside programs cannot separate the plastic lining). 2. Rinse the plastic lid. 3. Recycle the lid only.",
    PathwayB: "1. Wash out the cup. 2. Poke a hole in the bottom. 3. Fill with potting soil to start growing herb seeds on your windowsill.",
    EcoMetric: "Over 50 billion single-use coffee cups are thrown away annually in the US alone."
  },
  {
    ItemName: "Old T-Shirt",
    Material: "Cotton / Polyester Blend",
    EcologicalFootprint: "Polyester threads take 200 years to decompose, shedding microfibers, while cotton produces methane.",
    PathwayA: "1. Wash and dry the shirt. 2. If wearable, donate to a local charity. 3. If torn, drop off at a textile recycling bin to be shredded for insulation.",
    PathwayB: "1. Cut the shirt into horizontal strips. 2. Stretch the strips until they curl into 't-shirt yarn'. 3. Braid the yarn into a thick dog chew toy.",
    EcoMetric: "The fashion industry is responsible for 10% of annual global carbon emissions; upcycling drastically cuts this."
  },
  {
    ItemName: "Smartphone",
    Material: "Glass, Aluminum, Lithium, Gold",
    EcologicalFootprint: "Leaches highly toxic lead, mercury, and cadmium into the soil, while wasting rare earth metals.",
    PathwayA: "1. Factory reset and wipe all personal data. 2. Remove the SIM card. 3. Drop off at a certified Best Buy, Apple Store, or e-waste kiosk.",
    PathwayB: "1. Wipe the phone. 2. Download a security camera app. 3. Mount it in your home and plug it in to act as a free Wi-Fi security monitor.",
    EcoMetric: "For every 1 million cell phones recycled, 35,000 pounds of copper and 75 pounds of gold are recovered."
  },
  {
    ItemName: "Pizza Box",
    Material: "Corrugated Cardboard + Grease",
    EcologicalFootprint: "The cardboard takes months to decompose, but the trapped grease ruins entire batches of paper recycling.",
    PathwayA: "1. Tear off the clean top half of the box and place it in the paper recycling bin. 2. Throw the greasy bottom half in the regular trash or compost.",
    PathwayB: "1. Cut the clean cardboard into a large circle. 2. Paint it with bright colors. 3. Use it as a base for a homemade DIY wall clock.",
    EcoMetric: "Grease and oil are the #1 contaminants that ruin commercial paper recycling batches."
  },
  {
    ItemName: "Glass Wine Bottle",
    Material: "Colored Soda-Lime Glass",
    EcologicalFootprint: "Takes over 1 million years to decompose. Dark glass absorbs heat and can cause landfill fires.",
    PathwayA: "1. Rinse the bottle out. 2. Remove the cork or metal screw cap. 3. Place in the glass recycling bin (sort by color if required by your city).",
    PathwayB: "1. Clean the bottle and remove labels. 2. Fill with water and insert a slow-drip terracotta spike. 3. Use as an automatic plant waterer.",
    EcoMetric: "Recycled glass melts at a lower temperature than raw materials, saving massive amounts of manufacturing energy."
  },
  {
    ItemName: "Styrofoam Cup",
    Material: "Polystyrene (EPS)",
    EcologicalFootprint: "Takes 500 years to decompose. It easily breaks into lightweight pellets that choke wildlife.",
    PathwayA: "1. Styrofoam is NOT accepted in most curbside recycling. 2. Check for local drop-off centers that process EPS. 3. If none exist, it must go in the trash.",
    PathwayB: "1. Break into small chunks. 2. Place at the bottom of a large potted plant. 3. This improves water drainage and makes the heavy pot lighter to lift.",
    EcoMetric: "By volume, polystyrene takes up up to 30% of space in some landfills due to its airy composition."
  },
  {
    ItemName: "Rubber Tire",
    Material: "Vulcanized Rubber",
    EcologicalFootprint: "Takes 50-80 years to decompose. Tires trap methane gas and regularly cause massive, unextinguishable landfill fires.",
    PathwayA: "1. Do not put in standard recycling or trash. 2. Take to an auto shop or specific municipal tire drop-off center. 3. Pay the small disposal fee.",
    PathwayB: "1. Clean the tire thoroughly with soap. 2. Paint it a bright color. 3. Fill the center with soil and use as a durable outdoor garden planter.",
    EcoMetric: "Recycled tires are shredded and turned into playground turf, asphalt, and new shoe soles."
  },
  {
    ItemName: "Plastic Cutlery",
    Material: "Polystyrene (PS)",
    EcologicalFootprint: "Takes 100 to 1,000 years to decompose. Because of their odd shape, they often jam recycling sorting machinery.",
    PathwayA: "1. Most plastic cutlery cannot be recycled curbside. 2. If marked with a #6, check local drop-offs. 3. Otherwise, they must be thrown in the trash.",
    PathwayB: "1. Wash the forks thoroughly. 2. Snap the handles off. 3. Write plant names on the handles and stick them in the soil as garden markers.",
    EcoMetric: "Over 40 billion individual pieces of plastic cutlery are discarded every year in the United States."
  },
  {
    ItemName: "Aluminum Foil",
    Material: "Aluminum",
    EcologicalFootprint: "Takes 200 years to break down. Food-contaminated foil attracts pests and ruins clean recycling batches.",
    PathwayA: "1. Wash off all food residue and grease. 2. Crumple the foil into a ball (it must be at least 2 inches wide for sorting machines to catch it). 3. Recycle with metals.",
    PathwayB: "1. Smooth out clean foil. 2. Fold it tightly into long strips. 3. Coil the strips to create shiny, metallic DIY coasters.",
    EcoMetric: "Recycling aluminum saves 90% of the energy needed to mine and process new bauxite ore."
  },
  {
    ItemName: "Laptop",
    Material: "Plastics, Heavy Metals, Silicon",
    EcologicalFootprint: "Toxic batteries can explode in landfills, while heavy metals poison the surrounding water table.",
    PathwayA: "1. Back up data and wipe the hard drive. 2. Remove the battery if possible. 3. Take to a certified e-waste recycler or manufacturer take-back program.",
    PathwayB: "1. If the screen works, remove it from the chassis. 2. Buy a cheap LCD controller board online. 3. Turn the old screen into a custom second monitor.",
    EcoMetric: "E-waste represents 2% of America's trash in landfills, but it equals 70% of overall toxic waste."
  },
  {
    ItemName: "Egg Carton",
    Material: "Molded Pulp Paper",
    EcologicalFootprint: "Decomposes quickly in 2-4 weeks, but if thrown in the trash, it wastes perfectly good, reusable fiber.",
    PathwayA: "1. Ensure there is no egg yolk residue. 2. Flatten the carton. 3. Place in the paper recycling bin or tear up and put in your compost pile.",
    PathwayB: "1. Cut out the individual cups. 2. Paint them to look like flowers. 3. String them together with fairy lights for a beautiful bedroom garland.",
    EcoMetric: "Molded pulp is already 100% recycled paper, meaning recycling it again creates a closed-loop system."
  },
  {
    ItemName: "Wire Coat Hanger",
    Material: "Steel Wire",
    EcologicalFootprint: "Takes 50+ years to rust away. If put in curbside bins, they wrap around and destroy sorting machine gears.",
    PathwayA: "1. Do not put in curbside bins! 2. Collect them and return them to your local dry cleaner. 3. Alternatively, drop them at a scrap metal facility.",
    PathwayB: "1. Use pliers to untwist the top. 2. Bend the wire into a large circle. 3. Tie seasonal foliage around it to make a custom front-door wreath.",
    EcoMetric: "Scrap metal recycling is a $32 billion industry in the US, drastically reducing the need for raw mining."
  },
  {
    ItemName: "Plastic Straw",
    Material: "Polypropylene (PP)",
    EcologicalFootprint: "Takes 200 years to degrade. They are too small and lightweight for recycling machines to sort, ending up in oceans.",
    PathwayA: "1. Plastic straws are NOT recyclable in standard facilities. 2. Put them directly into the trash bin. 3. Refuse them at restaurants in the future.",
    PathwayB: "1. Clean the straws. 2. Cut them into 1-inch pieces. 3. String them onto yarn or wire to create colorful, lightweight geometric jewelry.",
    EcoMetric: "An estimated 8.3 billion plastic straws pollute the world's beaches right now."
  },
  {
    ItemName: "CD or DVD",
    Material: "Polycarbonate Plastic",
    EcologicalFootprint: "Takes 1 million years to decompose. They release Bisphenol A (BPA) when exposed to landfill heat and pressure.",
    PathwayA: "1. Do not put in curbside bins. 2. Look for specialized mail-in programs like GreenDisk. 3. Or, drop them off at a local tech recycling center.",
    PathwayB: "1. Boil water and soften the CD slightly. 2. Cut it into small, jagged pieces. 3. Glue the shiny pieces onto a cheap picture frame for a mosaic effect.",
    EcoMetric: "Millions of CDs are discarded monthly; their polycarbonate is highly valuable for making automotive parts."
  },
  {
    ItemName: "Tea Bag",
    Material: "Paper, sometimes Nylon/Plastic",
    EcologicalFootprint: "Paper decomposes in weeks, but many premium tea bags contain a plastic mesh that sheds billions of microplastics.",
    PathwayA: "1. Check if the bag is 100% paper. 2. If yes, throw the whole thing in the compost. 3. If it has a plastic seal, empty the leaves into the compost and trash the bag.",
    PathwayB: "1. Dry the used tea bags. 2. Dab them with essential oils. 3. Place them in your shoes or gym bag as an all-natural, free deodorizer.",
    EcoMetric: "A single plastic tea bag steeped at brewing temperature releases approximately 11.6 billion microplastics."
  },
  {
    ItemName: "Banana Peel",
    Material: "Organic Matter",
    EcologicalFootprint: "Decomposes in 2-4 weeks in compost, but takes up to 2 years in a landfill due to lack of oxygen (creating methane).",
    PathwayA: "1. Do not throw in the trash or recycling. 2. Place in a designated municipal green compost bin. 3. Or, start a backyard compost pile.",
    PathwayB: "1. Chop the peel into small pieces. 2. Soak in a jar of water for 48 hours. 3. Use this nutrient-rich 'banana water' to fertilize indoor houseplants.",
    EcoMetric: "Food waste in landfills generates methane, a greenhouse gas 25 times more potent than carbon dioxide."
  },
  {
    ItemName: "Shampoo Bottle",
    Material: "High-Density Polyethylene (HDPE)",
    EcologicalFootprint: "Takes 400 years to decompose. The thick plastic slowly breaks down into micro-particles that enter the food chain.",
    PathwayA: "1. Empty all remaining shampoo. 2. Give the inside a quick rinse. 3. Leave the pump/cap on and toss in the plastics recycling bin.",
    PathwayB: "1. Cut the top third of the bottle off. 2. Cut a small hole in the back. 3. Decorate it and hang it on a wall hook as a charging cradle for your phone.",
    EcoMetric: "Only 1 in 5 people consistently recycle bathroom items, meaning millions of tons of HDPE are wasted."
  },
  {
    ItemName: "Fluorescent Light Bulb",
    Material: "Glass, Argon, Mercury vapor",
    EcologicalFootprint: "Highly toxic. Breaking one releases mercury vapor into the air and contaminates thousands of gallons of groundwater.",
    PathwayA: "1. NEVER throw in the trash or recycling bin. 2. Wrap it carefully to prevent breakage. 3. Take to a hardware store (like Home Depot) that offers free bulb recycling.",
    PathwayB: "1. Bulbs are too dangerous for DIY projects due to the internal toxic chemicals. 2. Store safely. 3. Recycle properly.",
    EcoMetric: "A single drop of mercury from a broken bulb can contaminate a 20-acre lake."
  },
  {
    ItemName: "Used Toothbrush",
    Material: "Nylon bristles, Polypropylene handle",
    EcologicalFootprint: "Takes 400+ years to decompose. Because they are made of mixed plastics, they are almost impossible to recycle normally.",
    PathwayA: "1. Standard recycling cannot process them. 2. Sign up for a mail-in program like TerraCycle. 3. Otherwise, throw them in the regular trash.",
    PathwayB: "1. Boil the toothbrush to sanitize it. 2. Use it with baking soda to scrub tile grout. 3. Use it to detail your car vents or clean bicycle chains.",
    EcoMetric: "Over 1 billion plastic toothbrushes are thrown away every year in the United States."
  },
  {
    ItemName: "Denim Jeans",
    Material: "Cotton, Elastane",
    EcologicalFootprint: "Decomposes in 10-12 months, but the synthetic dyes and micro-elastane fibers pollute soil and water.",
    PathwayA: "1. Wash the jeans. 2. If in good condition, donate to a thrift store. 3. If ripped, drop at a textile recycling bin (they are shredded for housing insulation).",
    PathwayB: "1. Cut off the legs to make shorts. 2. Use the leftover leg fabric to sew a durable tool pouch. 3. Use the back pockets as DIY wall organizers.",
    EcoMetric: "It takes roughly 1,800 gallons of water to grow enough cotton to produce a single pair of jeans."
  },
  {
    ItemName: "Chip Bag",
    Material: "Metallized Polypropylene",
    EcologicalFootprint: "Takes 80+ years to decompose. The fusion of plastic and aluminum makes it impossible to recycle in standard facilities.",
    PathwayA: "1. Do NOT put in your curbside bin. 2. Collect them and drop them off at a TerraCycle designated location. 3. Otherwise, they must go in the trash.",
    PathwayB: "1. Wash the inside with soap and dry it. 2. Cut it into a large rectangle. 3. Use the shiny side as a reflective backing behind a radiator to bounce heat into the room.",
    EcoMetric: "Multi-layer packaging like chip bags accounts for over 30% of global plastic waste."
  },
  {
    ItemName: "Almond Milk Carton",
    Material: "Tetra Pak (Paper, Plastic, Aluminum)",
    EcologicalFootprint: "Takes 300 years to decompose. The complex layered materials require specialized hydro-pulping machines to separate.",
    PathwayA: "1. Empty and rinse the carton. 2. Remove the plastic cap. 3. Check if your city accepts Tetra Paks; if yes, recycle with paper. If no, trash it.",
    PathwayB: "1. Cut the top off and wash thoroughly. 2. Poke holes in the bottom. 3. Fill with soil and use as a starter pot for planting herbs.",
    EcoMetric: "Recycling one ton of Tetra Pak cartons saves 17 trees and 7,000 gallons of water."
  },
  {
    ItemName: "Wine Cork",
    Material: "Natural Cork Oak",
    EcologicalFootprint: "Decomposes in 3-10 years. It is 100% biodegradable, but wastes a valuable, slow-growing natural resource if trashed.",
    PathwayA: "1. Natural corks can be composted in a backyard pile. 2. Alternatively, drop them at a Whole Foods or ReCORK collection bin. 3. Do not put in curbside recycling.",
    PathwayB: "1. Collect 20-30 corks. 2. Glue them side-by-side onto a piece of cardboard. 3. Hang it on the wall as a custom DIY bulletin board.",
    EcoMetric: "Cork forests absorb millions of tons of CO2; recycling corks reduces the need to harvest new bark."
  },
  {
    ItemName: "Plastic Tupperware",
    Material: "Polypropylene (PP #5)",
    EcologicalFootprint: "Takes up to 1,000 years to degrade, slowly releasing endocrine-disrupting chemicals as it breaks down.",
    PathwayA: "1. Wash it thoroughly to remove food grease. 2. Check the bottom for the #5 triangle. 3. If your city accepts #5, place in the plastics recycling bin.",
    PathwayB: "1. Drill a hole in the lid. 2. Spool twine or string inside. 3. Thread the string through the hole to create a tangle-free twine dispenser.",
    EcoMetric: "Containers and packaging make up a massive 28% of all municipal solid waste in the USA."
  },
  {
    ItemName: "Receipt",
    Material: "Thermal Paper (BPA coated)",
    EcologicalFootprint: "Decomposes in a few months, but the chemical coating (BPA/BPS) poisons paper recycling batches and water supplies.",
    PathwayA: "1. Do NOT put receipts in the recycling bin! The chemicals ruin other paper. 2. Do not compost them. 3. Throw them directly in the regular trash.",
    PathwayB: "1. Receipts are toxic and should not be handled excessively or upcycled into crafts. 2. Request digital email receipts whenever possible. 3. Dispose of them safely.",
    EcoMetric: "Thermal paper receipts consume over 3 million trees and 9 billion gallons of water annually."
  },
  {
    ItemName: "Tin Foil Baking Pan",
    Material: "Aluminum",
    EcologicalFootprint: "Takes 200+ years to decompose. Often discarded with heavy food waste, which prevents it from being recycled.",
    PathwayA: "1. Wash the pan vigorously to remove ALL baked-on food. 2. If it cannot be cleaned, it must go in the trash. 3. If clean, place in the metals recycling bin.",
    PathwayB: "1. Clean the pan. 2. Poke several holes in the bottom. 3. Place it under a potted plant to catch excess water and reflect light up to the leaves.",
    EcoMetric: "Aluminum can be recycled using only 5% of the energy it takes to manufacture new aluminum."
  },
  {
    ItemName: "Old Paint Can",
    Material: "Steel and Chemical Paint",
    EcologicalFootprint: "Takes 50 years to rust. Leftover liquid paint contains VOCs that create toxic smog and poison groundwater.",
    PathwayA: "1. Do not throw liquid paint in the trash. 2. Let the paint dry out completely by adding kitty litter. 3. Once totally solid, take to a hazardous waste facility.",
    PathwayB: "1. Clean the empty can thoroughly. 2. Wrap the outside in thick rope, gluing it down securely. 3. Use as a rustic, heavy-duty doorstop or planter.",
    EcoMetric: "Improperly disposed paint is the #1 source of household hazardous waste found in landfills."
  },
  {
    ItemName: "Plastic Milk Jug",
    Material: "High-Density Polyethylene (HDPE #2)",
    EcologicalFootprint: "Takes 400 years to break down. Due to its large size, it takes up massive amounts of landfill volume.",
    PathwayA: "1. Empty and rinse the jug. 2. Crush it flat to save space in the truck. 3. Put the cap back on and place in the plastics recycling bin.",
    PathwayB: "1. Cut the bottom off at an angle. 2. Keep the handle intact. 3. Use the top half as a heavy-duty scoop for pet food, rock salt, or gardening soil.",
    EcoMetric: "HDPE #2 is one of the most easily recyclable plastics and is turned into park benches and plastic lumber."
  },
  {
    ItemName: "Tennis Ball",
    Material: "Rubber and Felt",
    EcologicalFootprint: "Takes 400 years to decompose. The complex mixture of pressurized rubber and synthetic felt makes them unrecyclable.",
    PathwayA: "1. Standard recycling facilities cannot process them. 2. Use a mail-in program like RecycleBalls. 3. Otherwise, they must be thrown in the trash.",
    PathwayB: "1. Cut a slit in the tennis ball. 2. Squeeze the sides to open the 'mouth'. 3. Mount it on the wall to hold keys, mail, or charging cables.",
    EcoMetric: "Over 125 million tennis balls end up in US landfills every single year."
  },
  {
    ItemName: "Toilet Paper Roll",
    Material: "Cardboard",
    EcologicalFootprint: "Decomposes in 1-2 months. If thrown in the trash, it generates methane, but it is incredibly easy to recycle.",
    PathwayA: "1. Ensure the roll is completely free of paper. 2. Flatten it. 3. Place it in your paper recycling bin or toss it in a compost pile.",
    PathwayB: "1. Cut the roll into 2-inch sections. 2. Fill the sections with potting soil. 3. Plant seeds in them; when they sprout, plant the whole cardboard ring directly into the ground.",
    EcoMetric: "Recycling cardboard requires 25% less energy than making new cardboard from raw wood pulp."
  },
  {
    ItemName: "Broken Ceramic Mug",
    Material: "Clay / Ceramic",
    EcologicalFootprint: "Takes 1 million+ years to break down. It acts like rocks in a landfill. It melts at a different temperature than glass, ruining glass recycling.",
    PathwayA: "1. NEVER put ceramics in the glass recycling bin. 2. Wrap the broken pieces in newspaper to protect sanitation workers. 3. Throw it in the regular trash.",
    PathwayB: "1. Carefully smash the mug into smaller, flatter pieces. 2. Get some grout or strong glue. 3. Use the pieces to create a mosaic pattern on a plain flower pot.",
    EcoMetric: "Ceramics are essentially baked earth; they don't harm the environment in landfills, but they take up permanent space."
  },
  {
    ItemName: "Plastic Clothes Hanger",
    Material: "Polystyrene or Polycarbonate",
    EcologicalFootprint: "Takes up to 1,000 years to decompose. Their hooked shape catches on sorting belts, jamming entire recycling plants.",
    PathwayA: "1. Do NOT put in curbside recycling bins. 2. Donate to a local thrift store if they are not broken. 3. If broken, throw them in the regular trash.",
    PathwayB: "1. Break the hooks off. 2. Glue the straight plastic arms together into a geometric shape. 3. Paint them to create modern, abstract wall art.",
    EcoMetric: "Billions of plastic hangers are used and discarded by the fast fashion industry every year."
  },
  {
    ItemName: "Old Mattress",
    Material: "Steel Springs, Polyurethane Foam, Wood",
    EcologicalFootprint: "Takes 120 years to break down. They take up 400% more space in landfills than regular trash and damage landfill compactors.",
    PathwayA: "1. Never leave on the curb for trash collection. 2. Call your municipality for bulk pickup. 3. Or hire a specialized mattress recycling company.",
    PathwayB: "1. Tear open the mattress to extract the metal springs. 2. Clean the springs. 3. Mount a spring on the wall to act as an industrial-chic wine bottle holder.",
    EcoMetric: "Over 75% of a mattress can be fully recycled into carpet padding, scrap metal, and mulch."
  },
  {
    ItemName: "Silica Gel Packet",
    Material: "Silica Dioxide / Plastic",
    EcologicalFootprint: "Takes 500 years for the plastic packet to degrade. The silica itself is essentially harmless sand, but it is a choking hazard.",
    PathwayA: "1. Do not recycle the packets. 2. They are non-toxic but useless to recycling facilities. 3. Throw them in the regular trash.",
    PathwayB: "1. Collect the packets in a jar. 2. Place your smartphone in the jar if it ever gets wet. 3. The silica will absorb the moisture faster than rice.",
    EcoMetric: "Silica gel can absorb up to 40% of its weight in moisture, making it infinitely reusable if dried out in an oven."
  },
  {
    ItemName: "Aerosol Can",
    Material: "Steel / Aluminum + Pressurized Gas",
    EcologicalFootprint: "Takes 200 years to rust. If the can is not completely empty, the pressurized gas can explode in a garbage truck or compactor.",
    PathwayA: "1. Ensure the can is COMPLETELY empty (no hissing sound). 2. Remove the plastic cap. 3. Place the empty metal can in your metals recycling bin.",
    PathwayB: "1. Cans under pressure are dangerous. 2. Do not puncture or attempt to cut aerosol cans for DIY projects. 3. Recycle them safely instead.",
    EcoMetric: "Empty aerosol cans are highly valuable scrap metal and can be melted down endlessly."
  },
  {
    ItemName: "K-Cup / Coffee Pod",
    Material: "Mixed Plastic #7, Aluminum, Coffee",
    EcologicalFootprint: "Takes 500 years to decompose. The mix of plastic, organic waste, and foil makes them a nightmare for sorting facilities.",
    PathwayA: "1. Peel off the aluminum foil lid. 2. Dump the coffee grounds into your compost. 3. Rinse the plastic cup and check if your city accepts #7 plastic.",
    PathwayB: "1. Clean the empty plastic pods. 2. Poke a hole in the bottom of each. 3. String them over a set of LED holiday lights for a custom mini-lampshade effect.",
    EcoMetric: "In 2014 alone, enough K-Cups were sold to circle the Earth more than 10 times."
  },
  {
    ItemName: "Yoga Mat",
    Material: "PVC or Polyurethane",
    EcologicalFootprint: "Takes 1,000 years to decompose. PVC releases highly toxic dioxins if incinerated or exposed to extreme landfill heat.",
    PathwayA: "1. PVC cannot be recycled in curbside bins. 2. Look for specialized athletic gear drop-offs. 3. If none are available, it must go in the trash.",
    PathwayB: "1. Cut the mat into smaller squares. 2. Glue them to the bottom of heavy furniture legs. 3. Use them as durable, scratch-proof floor protectors.",
    EcoMetric: "PVC (Polyvinyl Chloride) is considered one of the most environmentally damaging plastics in existence."
  },
  {
    ItemName: "Tangled Cords / Cables",
    Material: "Copper Wire, PVC Plastic Insulation",
    EcologicalFootprint: "Takes 1,000 years for the plastic to degrade, while the valuable copper oxidizes and leaches into the soil.",
    PathwayA: "1. Do not put in curbside bins (they are 'tanglers' that jam machines). 2. Take to Best Buy or an e-waste drop-off center. 3. The facility will strip the plastic to save the copper.",
    PathwayB: "1. Separate and organize the cords. 2. Braid them tightly together. 3. Use the braided wire to wrap and strengthen the handles of heavy tools or bags.",
    EcoMetric: "Copper can be recycled repeatedly without any loss of performance, making scrap cables highly valuable."
  },
  {
    ItemName: "Bubble Wrap",
    Material: "Low-Density Polyethylene (LDPE #4)",
    EcologicalFootprint: "Takes 500 to 1,000 years to break down. It tangles and destroys the spinning gears inside recycling sorting facilities.",
    PathwayA: "1. NEVER put bubble wrap in curbside bins. 2. Pop all the bubbles to save space. 3. Drop it off at a grocery store bin that collects plastic bags and films.",
    PathwayB: "1. Cut the wrap to the size of your windows. 2. Spray the window with water. 3. Press the flat side of the wrap to the glass for instant, cheap winter insulation.",
    EcoMetric: "LDPE film recycling programs turn bubble wrap and grocery bags into composite deck boards."
  },
  {
    ItemName: "Disposable Lighter",
    Material: "Plastic, Butane, Flint, Steel",
    EcologicalFootprint: "Takes 500 years to decompose. Trapped butane gas is a severe fire hazard in hot, compressed garbage trucks.",
    PathwayA: "1. Lighters cannot be recycled due to the mixed materials and explosive gas. 2. Ensure it is completely empty of fuel. 3. Throw it in the regular trash.",
    PathwayB: "1. Carefully pry off the metal guard and remove the flint wheel. 2. The flint can be saved for starting campfires. 3. Trash the plastic body safely.",
    EcoMetric: "Over 1.5 billion disposable lighters end up in landfills every year, leaching toxic lighter fluid."
  },
  {
    ItemName: "Rubber Band",
    Material: "Natural or Synthetic Rubber",
    EcologicalFootprint: "Natural rubber degrades in 1 year; synthetic rubber takes 50 years. They are harmless but entirely unrecyclable.",
    PathwayA: "1. Do not put in recycling bins. 2. If it is natural rubber, it can technically be composted. 3. Otherwise, throw it in the trash.",
    PathwayB: "1. Wrap several rubber bands tightly around the ends of a wooden clothes hanger. 2. This creates a non-slip grip. 3. Use it to hang slippery silk shirts or dresses.",
    EcoMetric: "Rubber bands are made from the latex sap of the Pará rubber tree, a renewable resource if harvested sustainably."
  },
  {
    ItemName: "Toothpaste Tube",
    Material: "Mixed Plastic, Aluminum layer",
    EcologicalFootprint: "Takes 500 years to decompose. The fusion of plastic and aluminum makes it impossible to separate and recycle normally.",
    PathwayA: "1. Curbside programs will not take them. 2. Squeeze out every last drop. 3. Mail them to TerraCycle's oral care recycling program, or throw in the trash.",
    PathwayB: "1. Cut the bottom off the tube and clean it completely. 2. Fill it with homemade icing or caulking. 3. Fold the bottom and use it as a precision squeeze-piping bag.",
    EcoMetric: "Over 1 billion toothpaste tubes are sent to landfills globally each year."
  }
]

async function loadData() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in .env file')
      process.exit(1)
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      ssl: true,
      tlsInsecure: true,
      retryWrites: true,
      w: 'majority'
    })

    console.log('✅ Connected to MongoDB')

    // Clear existing items (optional - comment out if you want to keep data)
    await Item.deleteMany({})
    console.log('🗑️  Cleared existing items')

    // Insert the recycling data
    const result = await Item.insertMany(recyclingData)
    console.log(`✅ Inserted ${result.length} recycling items into the database`)

    mongoose.connection.close()
    console.log('✅ Database loading complete!')
  } catch (error) {
    console.error('❌ Error loading data:', error)
    process.exit(1)
  }
}

loadData()
