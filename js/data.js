// ============================================
// TastyLoop - Mock Recipe Database
// ============================================

const RECIPES_DATA = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "Pasta",
    area: "Italian",
    image: "assets/recipes/recipes (1).jpg",
    ingredients: [
      { name: "Pizza Dough", measure: "1 ball" },
      { name: "Tomato Sauce", measure: "1/2 cup" },
      { name: "Mozzarella", measure: "200g" },
      { name: "Fresh Basil", measure: "10 leaves" },
      { name: "Olive Oil", measure: "2 tbsp" },
      { name: "Salt", measure: "to taste" }
    ],
    instructions: [
      "Preheat oven to 475°F (245°C). If using a pizza stone, place it in the oven.",
      "Roll out pizza dough on a floured surface to desired thickness.",
      "Spread tomato sauce evenly over the dough, leaving a 1-inch border.",
      "Tear mozzarella and distribute evenly over sauce.",
      "Drizzle with olive oil and season with salt.",
      "Bake for 10-12 minutes until crust is golden and cheese is bubbly.",
      "Remove from oven, top with fresh basil leaves, slice and serve hot."
    ],
    tags: ["Pizza", "Vegetarian", "Italian"],
    servings: 4,
    prepTime: 15,
    cookTime: 12
  },
  {
    id: 2,
    name: "Pad Thai",
    category: "Chicken",
    area: "Thai",
    image: "assets/recipes/recipes (2).jpg",
    ingredients: [
      { name: "Rice Noodles", measure: "200g" },
      { name: "Chicken Breast", measure: "300g" },
      { name: "Eggs", measure: "2" },
      { name: "Bean Sprouts", measure: "1 cup" },
      { name: "Peanuts", measure: "1/4 cup" },
      { name: "Fish Sauce", measure: "3 tbsp" },
      { name: "Tamarind Paste", measure: "2 tbsp" },
      { name: "Brown Sugar", measure: "2 tbsp" },
      { name: "Lime", measure: "1" },
      { name: "Green Onions", measure: "3 stalks" }
    ],
    instructions: [
      "Soak rice noodles in warm water for 30 minutes, then drain.",
      "Cut chicken into bite-sized pieces and season with salt and pepper.",
      "Heat oil in a wok over high heat. Cook chicken until golden, about 5 minutes. Set aside.",
      "In the same wok, scramble eggs until just set, then push to the side.",
      "Add noodles, fish sauce, tamarind paste, and sugar. Toss for 2-3 minutes.",
      "Return chicken to wok, add bean sprouts and half the green onions. Toss together.",
      "Serve topped with peanuts, remaining green onions, and lime wedges."
    ],
    tags: ["Noodles", "Chicken", "Thai"],
    servings: 3,
    prepTime: 40,
    cookTime: 15
  },
  {
    id: 3,
    name: "Beef Tacos",
    category: "Beef",
    area: "Mexican",
    image: "assets/recipes/recipes (3).jpg",
    ingredients: [
      { name: "Ground Beef", measure: "500g" },
      { name: "Taco Seasoning", measure: "2 tbsp" },
      { name: "Taco Shells", measure: "8" },
      { name: "Lettuce", measure: "2 cups" },
      { name: "Tomatoes", measure: "2" },
      { name: "Cheddar Cheese", measure: "1 cup" },
      { name: "Sour Cream", measure: "1/2 cup" },
      { name: "Onion", measure: "1" }
    ],
    instructions: [
      "Heat a large skillet over medium-high heat. Add ground beef and cook until browned.",
      "Drain excess fat, then add taco seasoning and 1/4 cup water. Simmer for 5 minutes.",
      "While beef cooks, chop lettuce, dice tomatoes and onions, and shred cheese.",
      "Warm taco shells according to package directions.",
      "Fill each shell with beef, then top with lettuce, tomatoes, cheese, onions.",
      "Add a dollop of sour cream on top.",
      "Serve immediately with lime wedges and hot sauce if desired."
    ],
    tags: ["Tacos", "Beef", "Mexican"],
    servings: 4,
    prepTime: 10,
    cookTime: 15
  },
  {
    id: 4,
    name: "Greek Salad",
    category: "Side",
    area: "Greek",
    image: "assets/recipes/recipes (4).jpg",
    ingredients: [
      { name: "Cucumber", measure: "2" },
      { name: "Tomatoes", measure: "4" },
      { name: "Red Onion", measure: "1" },
      { name: "Feta Cheese", measure: "200g" },
      { name: "Kalamata Olives", measure: "1 cup" },
      { name: "Olive Oil", measure: "1/4 cup" },
      { name: "Red Wine Vinegar", measure: "2 tbsp" },
      { name: "Oregano", measure: "1 tsp" }
    ],
    instructions: [
      "Chop cucumbers and tomatoes into bite-sized chunks.",
      "Slice red onion thinly and separate into rings.",
      "In a large bowl, combine cucumbers, tomatoes, and onions.",
      "Add kalamata olives and crumble feta cheese over top.",
      "In a small bowl, whisk together olive oil, vinegar, and oregano.",
      "Pour dressing over salad and toss gently to combine.",
      "Let sit for 10 minutes before serving to allow flavors to meld."
    ],
    tags: ["Salad", "Vegetarian", "Greek"],
    servings: 6,
    prepTime: 15,
    cookTime: 0
  },
  {
    id: 5,
    name: "Chicken Curry",
    category: "Chicken",
    area: "Indian",
    image: "assets/recipes/recipes (5).jpg",
    ingredients: [
      { name: "Chicken Thighs", measure: "600g" },
      { name: "Onion", measure: "2" },
      { name: "Garlic", measure: "4 cloves" },
      { name: "Ginger", measure: "2 tbsp" },
      { name: "Curry Powder", measure: "3 tbsp" },
      { name: "Coconut Milk", measure: "400ml" },
      { name: "Tomatoes", measure: "2 cups" },
      { name: "Cilantro", measure: "1/4 cup" }
    ],
    instructions: [
      "Cut chicken into bite-sized pieces and season with salt.",
      "Dice onions and mince garlic and ginger.",
      "Heat oil in a large pot. Add onions and cook until softened, 5 minutes.",
      "Add garlic, ginger, and curry powder. Cook for 1 minute until fragrant.",
      "Add chicken and cook until browned on all sides, about 8 minutes.",
      "Pour in coconut milk and tomatoes. Bring to a simmer.",
      "Cover and cook for 25 minutes until chicken is tender. Garnish with cilantro and serve with rice."
    ],
    tags: ["Curry", "Chicken", "Indian"],
    servings: 5,
    prepTime: 15,
    cookTime: 40
  },
  {
    id: 6,
    name: "Caesar Salad",
    category: "Side",
    area: "American",
    image: "assets/recipes/recipes (6).jpg",
    ingredients: [
      { name: "Romaine Lettuce", measure: "2 heads" },
      { name: "Parmesan Cheese", measure: "1 cup" },
      { name: "Croutons", measure: "2 cups" },
      { name: "Caesar Dressing", measure: "3/4 cup" },
      { name: "Lemon", measure: "1" },
      { name: "Black Pepper", measure: "to taste" }
    ],
    instructions: [
      "Wash and dry romaine lettuce thoroughly. Tear into bite-sized pieces.",
      "Place lettuce in a large bowl.",
      "Add half the parmesan cheese and toss with Caesar dressing.",
      "Add croutons and toss gently.",
      "Transfer to serving plates or bowls.",
      "Top with remaining parmesan, freshly cracked black pepper, and a squeeze of lemon.",
      "Serve immediately while croutons are still crispy."
    ],
    tags: ["Salad", "Side", "American"],
    servings: 4,
    prepTime: 10,
    cookTime: 0
  },
  {
    id: 7,
    name: "Spaghetti Carbonara",
    category: "Pasta",
    area: "Italian",
    image: "assets/recipes/recipes (7).jpg",
    ingredients: [
      { name: "Spaghetti", measure: "400g" },
      { name: "Pancetta", measure: "200g" },
      { name: "Eggs", measure: "4" },
      { name: "Parmesan Cheese", measure: "1 cup" },
      { name: "Black Pepper", measure: "2 tsp" },
      { name: "Salt", measure: "to taste" }
    ],
    instructions: [
      "Bring a large pot of salted water to boil. Cook spaghetti according to package directions.",
      "While pasta cooks, dice pancetta and cook in a large skillet until crispy, about 6 minutes.",
      "In a bowl, whisk together eggs, parmesan cheese, and black pepper.",
      "Reserve 1 cup pasta water, then drain spaghetti.",
      "Remove skillet from heat. Add hot pasta to pancetta and toss.",
      "Quickly pour in egg mixture, tossing constantly. Add pasta water as needed for creamy sauce.",
      "Serve immediately with extra parmesan and black pepper."
    ],
    tags: ["Pasta", "Italian", "Comfort Food"],
    servings: 4,
    prepTime: 10,
    cookTime: 20
  },
  {
    id: 8,
    name: "Beef Stir Fry",
    category: "Beef",
    area: "Chinese",
    image: "assets/recipes/recipes (8).jpg",
    ingredients: [
      { name: "Beef Sirloin", measure: "500g" },
      { name: "Broccoli", measure: "2 cups" },
      { name: "Bell Peppers", measure: "2" },
      { name: "Soy Sauce", measure: "3 tbsp" },
      { name: "Oyster Sauce", measure: "2 tbsp" },
      { name: "Garlic", measure: "3 cloves" },
      { name: "Ginger", measure: "1 tbsp" },
      { name: "Cornstarch", measure: "1 tbsp" }
    ],
    instructions: [
      "Slice beef thinly against the grain. Toss with cornstarch and 1 tbsp soy sauce.",
      "Cut broccoli into florets and bell peppers into strips.",
      "Heat wok over high heat with oil. Stir-fry beef in batches until browned, 2 minutes. Set aside.",
      "Add more oil if needed. Stir-fry broccoli for 3 minutes.",
      "Add bell peppers, garlic, and ginger. Cook for 2 minutes.",
      "Return beef to wok. Add remaining soy sauce and oyster sauce.",
      "Toss everything together for 1 minute. Serve hot over rice."
    ],
    tags: ["Stir Fry", "Beef", "Chinese"],
    servings: 4,
    prepTime: 15,
    cookTime: 10
  },
  {
    id: 9,
    name: "Chocolate Brownies",
    category: "Dessert",
    area: "American",
    image: "assets/recipes/recipes (9).jpg",
    ingredients: [
      { name: "Butter", measure: "200g" },
      { name: "Dark Chocolate", measure: "200g" },
      { name: "Sugar", measure: "1 1/2 cups" },
      { name: "Eggs", measure: "4" },
      { name: "Flour", measure: "3/4 cup" },
      { name: "Cocoa Powder", measure: "1/4 cup" },
      { name: "Vanilla Extract", measure: "1 tsp" },
      { name: "Salt", measure: "1/2 tsp" }
    ],
    instructions: [
      "Preheat oven to 350°F (175°C). Line a 9x13 inch pan with parchment paper.",
      "Melt butter and chocolate together in a double boiler or microwave. Stir until smooth.",
      "Remove from heat and whisk in sugar until combined.",
      "Add eggs one at a time, whisking well after each addition. Stir in vanilla.",
      "Sift in flour, cocoa powder, and salt. Fold gently until just combined.",
      "Pour batter into prepared pan and smooth the top.",
      "Bake for 25-30 minutes until a toothpick comes out with a few moist crumbs. Cool completely before cutting."
    ],
    tags: ["Dessert", "Chocolate", "Baking"],
    servings: 12,
    prepTime: 15,
    cookTime: 30
  },
  {
    id: 10,
    name: "Vegetable Stir Fry",
    category: "Vegetarian",
    area: "Chinese",
    image: "assets/recipes/recipes (10).jpg",
    ingredients: [
      { name: "Broccoli", measure: "2 cups" },
      { name: "Carrots", measure: "2" },
      { name: "Bell Peppers", measure: "2" },
      { name: "Snap Peas", measure: "1 cup" },
      { name: "Mushrooms", measure: "1 cup" },
      { name: "Soy Sauce", measure: "3 tbsp" },
      { name: "Sesame Oil", measure: "1 tbsp" },
      { name: "Garlic", measure: "3 cloves" }
    ],
    instructions: [
      "Prepare all vegetables: cut broccoli into florets, slice carrots diagonally, cut peppers into strips.",
      "Heat wok or large skillet over high heat with oil.",
      "Add carrots first and stir-fry for 2 minutes (they take longest to cook).",
      "Add broccoli and cook for 2 minutes.",
      "Add bell peppers, snap peas, mushrooms, and garlic. Stir-fry for 3 minutes.",
      "Pour in soy sauce and sesame oil. Toss everything together for 1 minute.",
      "Serve immediately over rice or noodles."
    ],
    tags: ["Vegetarian", "Stir Fry", "Healthy"],
    servings: 4,
    prepTime: 15,
    cookTime: 10
  },
  {
    id: 11,
    name: "Shrimp Scampi",
    category: "Seafood",
    area: "Italian",
    image: "assets/recipes/recipes (11).jpg",
    ingredients: [
      { name: "Shrimp", measure: "500g" },
      { name: "Linguine", measure: "400g" },
      { name: "Butter", measure: "4 tbsp" },
      { name: "Garlic", measure: "6 cloves" },
      { name: "White Wine", measure: "1/2 cup" },
      { name: "Lemon", measure: "1" },
      { name: "Parsley", measure: "1/4 cup" },
      { name: "Red Pepper Flakes", measure: "1/2 tsp" }
    ],
    instructions: [
      "Cook linguine according to package directions. Reserve 1 cup pasta water, then drain.",
      "Pat shrimp dry and season with salt and pepper.",
      "Melt 2 tbsp butter in a large skillet over medium-high heat.",
      "Add shrimp and cook until pink, about 2 minutes per side. Remove and set aside.",
      "Add remaining butter and garlic to skillet. Cook for 1 minute until fragrant.",
      "Pour in white wine and lemon juice. Simmer for 3 minutes.",
      "Add pasta, shrimp, and parsley. Toss together, adding pasta water if needed. Garnish with red pepper flakes."
    ],
    tags: ["Seafood", "Pasta", "Italian"],
    servings: 4,
    prepTime: 10,
    cookTime: 15
  },
  {
    id: 12,
    name: "Chicken Fajitas",
    category: "Chicken",
    area: "Mexican",
    image: "assets/recipes/recipes (12).jpg",
    ingredients: [
      { name: "Chicken Breast", measure: "600g" },
      { name: "Bell Peppers", measure: "3" },
      { name: "Onion", measure: "2" },
      { name: "Lime", measure: "2" },
      { name: "Cumin", measure: "1 tsp" },
      { name: "Paprika", measure: "1 tsp" },
      { name: "Tortillas", measure: "8" },
      { name: "Sour Cream", measure: "for serving" }
    ],
    instructions: [
      "Slice chicken into thin strips and season with cumin, paprika, salt, and pepper.",
      "Cut bell peppers and onions into thin strips.",
      "Heat oil in a large skillet or grill pan over high heat.",
      "Cook chicken until golden and cooked through, about 6-8 minutes. Remove and set aside.",
      "In the same pan, cook peppers and onions until slightly charred, about 5 minutes.",
      "Return chicken to pan, squeeze lime juice over everything, and toss.",
      "Warm tortillas and serve fajitas with sour cream, guacamole, and salsa."
    ],
    tags: ["Chicken", "Mexican", "Fajitas"],
    servings: 4,
    prepTime: 15,
    cookTime: 15
  },
  {
    id: 13,
    name: "Caprese Salad",
    category: "Side",
    area: "Italian",
    image: "assets/recipes/recipes (13).jpg",
    ingredients: [
      { name: "Tomatoes", measure: "4 large" },
      { name: "Fresh Mozzarella", measure: "400g" },
      { name: "Fresh Basil", measure: "1 bunch" },
      { name: "Olive Oil", measure: "1/4 cup" },
      { name: "Balsamic Vinegar", measure: "2 tbsp" },
      { name: "Salt", measure: "to taste" },
      { name: "Black Pepper", measure: "to taste" }
    ],
    instructions: [
      "Slice tomatoes and mozzarella into 1/4-inch thick rounds.",
      "Arrange tomato and mozzarella slices alternately on a serving platter.",
      "Tuck fresh basil leaves between the slices.",
      "Drizzle generously with olive oil and balsamic vinegar.",
      "Season with salt and freshly cracked black pepper.",
      "Let sit at room temperature for 10 minutes before serving.",
      "Serve as a fresh appetizer or side dish."
    ],
    tags: ["Salad", "Italian", "Vegetarian"],
    servings: 4,
    prepTime: 10,
    cookTime: 0
  },
  {
    id: 14,
    name: "Beef Lasagna",
    category: "Pasta",
    area: "Italian",
    image: "assets/recipes/recipes (14).jpg",
    ingredients: [
      { name: "Lasagna Noodles", measure: "12 sheets" },
      { name: "Ground Beef", measure: "500g" },
      { name: "Ricotta Cheese", measure: "500g" },
      { name: "Mozzarella", measure: "3 cups" },
      { name: "Parmesan", measure: "1 cup" },
      { name: "Marinara Sauce", measure: "4 cups" },
      { name: "Egg", measure: "1" },
      { name: "Italian Seasoning", measure: "2 tsp" }
    ],
    instructions: [
      "Preheat oven to 375°F (190°C). Cook lasagna noodles according to package directions.",
      "Brown ground beef in a large skillet. Drain fat and stir in marinara sauce. Simmer 10 minutes.",
      "In a bowl, mix ricotta, egg, 1 cup mozzarella, 1/2 cup parmesan, and Italian seasoning.",
      "Spread 1 cup meat sauce in bottom of 9x13 inch baking dish.",
      "Layer 4 noodles, half the ricotta mixture, and 1/3 of remaining meat sauce. Repeat.",
      "Top with final layer of noodles, remaining sauce, and remaining mozzarella and parmesan.",
      "Cover with foil and bake 25 minutes. Remove foil and bake 15 more minutes until bubbly. Let rest 10 minutes before serving."
    ],
    tags: ["Pasta", "Beef", "Italian"],
    servings: 8,
    prepTime: 30,
    cookTime: 40
  },
  {
    id: 15,
    name: "Tom Yum Soup",
    category: "Soup",
    area: "Thai",
    image: "assets/recipes/recipes (15).jpg",
    ingredients: [
      { name: "Shrimp", measure: "300g" },
      { name: "Mushrooms", measure: "200g" },
      { name: "Lemongrass", measure: "2 stalks" },
      { name: "Galangal", measure: "4 slices" },
      { name: "Lime Leaves", measure: "4" },
      { name: "Thai Chilies", measure: "3" },
      { name: "Fish Sauce", measure: "3 tbsp" },
      { name: "Lime Juice", measure: "3 tbsp" },
      { name: "Cilantro", measure: "1/4 cup" }
    ],
    instructions: [
      "Bring 4 cups water to boil in a pot.",
      "Bruise lemongrass stalks and add to pot with galangal and lime leaves. Simmer 5 minutes.",
      "Add mushrooms and cook for 3 minutes.",
      "Add shrimp and cook until they turn pink, about 3 minutes.",
      "Remove from heat. Stir in fish sauce, lime juice, and sliced Thai chilies.",
      "Taste and adjust seasoning with more fish sauce or lime juice.",
      "Garnish with cilantro and serve hot."
    ],
    tags: ["Soup", "Thai", "Seafood"],
    servings: 4,
    prepTime: 10,
    cookTime: 15
  },
  {
    id: 16,
    name: "Mushroom Risotto",
    category: "Vegetarian",
    area: "Italian",
    image: "assets/recipes/recipes (16).jpg",
    ingredients: [
      { name: "Arborio Rice", measure: "2 cups" },
      { name: "Mushrooms", measure: "400g" },
      { name: "Chicken Stock", measure: "6 cups" },
      { name: "White Wine", measure: "1/2 cup" },
      { name: "Onion", measure: "1" },
      { name: "Parmesan", measure: "1 cup" },
      { name: "Butter", measure: "3 tbsp" },
      { name: "Thyme", measure: "1 tsp" }
    ],
    instructions: [
      "Heat chicken stock in a pot and keep warm on low heat.",
      "Slice mushrooms and dice onion. Sauté mushrooms in butter until golden. Set aside.",
      "In the same pot, sauté onion until translucent, about 3 minutes.",
      "Add rice and stir for 2 minutes until lightly toasted.",
      "Pour in white wine and stir until absorbed.",
      "Add stock one ladle at a time, stirring constantly, waiting until absorbed before adding more. This takes about 20 minutes.",
      "When rice is creamy and al dente, stir in mushrooms, parmesan, butter, and thyme. Serve immediately."
    ],
    tags: ["Risotto", "Vegetarian", "Italian"],
    servings: 4,
    prepTime: 10,
    cookTime: 30
  },
  {
    id: 17,
    name: "BBQ Ribs",
    category: "Pork",
    area: "American",
    image: "assets/recipes/recipes (17).jpg",
    ingredients: [
      { name: "Pork Ribs", measure: "1.5kg" },
      { name: "BBQ Sauce", measure: "2 cups" },
      { name: "Brown Sugar", measure: "1/4 cup" },
      { name: "Paprika", measure: "2 tbsp" },
      { name: "Garlic Powder", measure: "1 tbsp" },
      { name: "Onion Powder", measure: "1 tbsp" },
      { name: "Black Pepper", measure: "1 tsp" },
      { name: "Salt", measure: "1 tsp" }
    ],
    instructions: [
      "Preheat oven to 275°F (135°C).",
      "Mix brown sugar, paprika, garlic powder, onion powder, salt, and pepper to make a dry rub.",
      "Remove membrane from back of ribs. Rub spice mixture all over ribs.",
      "Wrap ribs tightly in foil and place on a baking sheet.",
      "Bake for 2.5 hours until tender.",
      "Remove from oven, unwrap, and brush generously with BBQ sauce.",
      "Broil for 5-10 minutes until sauce is caramelized. Brush with more sauce and serve."
    ],
    tags: ["Pork", "BBQ", "American"],
    servings: 4,
    prepTime: 15,
    cookTime: 160
  },
  {
    id: 18,
    name: "French Onion Soup",
    category: "Soup",
    area: "French",
    image: "assets/recipes/recipes (18).jpg",
    ingredients: [
      { name: "Onions", measure: "6 large" },
      { name: "Beef Stock", measure: "6 cups" },
      { name: "Butter", measure: "4 tbsp" },
      { name: "White Wine", measure: "1/2 cup" },
      { name: "Thyme", measure: "2 sprigs" },
      { name: "Bay Leaf", measure: "1" },
      { name: "French Bread", measure: "8 slices" },
      { name: "Gruyere Cheese", measure: "2 cups" }
    ],
    instructions: [
      "Slice onions thinly. Melt butter in a large pot over medium heat.",
      "Add onions and cook slowly, stirring occasionally, until deep golden brown. This takes 40-45 minutes.",
      "Pour in white wine and scrape up browned bits. Let wine reduce by half.",
      "Add beef stock, thyme, and bay leaf. Simmer for 30 minutes.",
      "Toast bread slices until golden. Preheat broiler.",
      "Ladle soup into oven-safe bowls. Top each with bread and a generous amount of gruyere.",
      "Broil until cheese is melted and bubbly, about 3-5 minutes. Serve carefully (bowls will be hot)."
    ],
    tags: ["Soup", "French", "Comfort Food"],
    servings: 6,
    prepTime: 15,
    cookTime: 90
  },
  {
    id: 19,
    name: "Tiramisu",
    category: "Dessert",
    area: "Italian",
    image: "assets/recipes/recipes (19).jpg",
    ingredients: [
      { name: "Mascarpone", measure: "500g" },
      { name: "Eggs", measure: "6" },
      { name: "Sugar", measure: "3/4 cup" },
      { name: "Ladyfinger Cookies", measure: "24" },
      { name: "Espresso", measure: "2 cups" },
      { name: "Coffee Liqueur", measure: "1/4 cup" },
      { name: "Cocoa Powder", measure: "for dusting" },
      { name: "Vanilla Extract", measure: "1 tsp" }
    ],
    instructions: [
      "Separate egg yolks and whites. Beat yolks with sugar until pale and thick, about 5 minutes.",
      "Add mascarpone and vanilla to yolks, mixing until smooth.",
      "In a separate bowl, beat egg whites to stiff peaks. Gently fold into mascarpone mixture.",
      "Mix espresso and coffee liqueur in a shallow dish.",
      "Quickly dip each ladyfinger in coffee mixture (don't oversoak).",
      "Arrange half the ladyfingers in bottom of 9x13 dish. Spread half the mascarpone mixture over top.",
      "Repeat with remaining ladyfingers and cream. Dust generously with cocoa. Refrigerate at least 4 hours or overnight."
    ],
    tags: ["Dessert", "Italian", "Coffee"],
    servings: 8,
    prepTime: 30,
    cookTime: 0
  }
];

// Categories with descriptions
const CATEGORIES = [
  { name: "Beef", description: "Hearty beef dishes from around the world", icon: "🥩" },
  { name: "Chicken", description: "Versatile chicken recipes for every occasion", icon: "🍗" },
  { name: "Dessert", description: "Sweet treats and indulgent desserts", icon: "🍰" },
  { name: "Pasta", description: "Italian pasta classics and creative variations", icon: "🍝" },
  { name: "Seafood", description: "Fresh fish and shellfish recipes", icon: "🦐" },
  { name: "Side", description: "Perfect accompaniments to any meal", icon: "🥗" },
  { name: "Soup", description: "Warming soups and broths", icon: "🍲" },
  { name: "Vegetarian", description: "Plant-based dishes packed with flavor", icon: "🥕" },
  { name: "Pork", description: "Savory pork recipes", icon: "🐷" },
  { name: "Breakfast", description: "Start your day deliciously", icon: "🍳" },
  { name: "Lamb", description: "Tender lamb dishes", icon: "🐑" },
  { name: "Vegan", description: "100% plant-based recipes", icon: "🌱" },
  { name: "Goat", description: "Exotic goat meat preparations", icon: "🐐" },
  { name: "Miscellaneous", description: "Unique dishes that defy categories", icon: "🎯" }
];

// Areas/Cuisines
const AREAS = [
  "American", "British", "Canadian", "Chinese", "Croatian", "Dutch",
  "Egyptian", "Filipino", "French", "Greek", "Indian", "Irish",
  "Italian", "Jamaican", "Japanese", "Kenyan", "Malaysian", "Mexican",
  "Moroccan", "Polish", "Portuguese", "Russian", "Spanish", "Thai",
  "Tunisian", "Turkish", "Ukrainian", "Vietnamese"
];

// Country/Area to Flag Code Mapping
const AREA_TO_FLAG = {
  "American": "us",
  "British": "gb",
  "Canadian": "ca",
  "Chinese": "cn",
  "Croatian": "hr",
  "Dutch": "nl",
  "Egyptian": "eg",
  "Filipino": "ph",
  "French": "fr",
  "Greek": "gr",
  "Indian": "in",
  "Irish": "ie",
  "Italian": "it",
  "Jamaican": "jm",
  "Japanese": "jp",
  "Kenyan": "ke",
  "Malaysian": "my",
  "Mexican": "mx",
  "Moroccan": "ma",
  "Polish": "pl",
  "Portuguese": "pt",
  "Russian": "ru",
  "Spanish": "es",
  "Thai": "th",
  "Tunisian": "tn",
  "Turkish": "tr",
  "Ukrainian": "ua",
  "Vietnamese": "vn",
  "Syrian": "sy",
  "Norwegian": "no"
};

// Get flag path for an area
function getFlagPath(area) {
  const code = AREA_TO_FLAG[area];
  return code ? `assets/flags/${code}.svg` : null;
}

// Learning lessons database
const LEARNING_DATA = [
  {
    id: 1,
    title: "Knife Skills 101",
    category: "Pasta",
    area: "Italian",
    difficulty: "easy",
    image: "assets/recipes/recipes (1).jpg",
    description: "Master basic knife techniques including dice, julienne, and chiffonade for better texture and faster prep.",
    content: [
      { type: "text", value: "Good knife skills are the foundation of efficient cooking. In this lesson, you'll learn three essential cuts." },
      { type: "heading", value: "The Dice" },
      { type: "text", value: "Used for vegetables in soups, stews, and sauces. Start by cutting your ingredient into planks, then sticks, then cubes." },
      { type: "heading", value: "The Julienne" },
      { type: "text", value: "Thin matchstick cuts perfect for stir-fries and salads. Aim for 1/8 inch thickness." },
      { type: "heading", value: "The Chiffonade" },
      { type: "text", value: "For leafy herbs and greens. Stack leaves, roll tightly, and slice into thin ribbons." }
    ],
    quiz: {
      question: "Which knife cut is best for leafy herbs?",
      options: ["Dice", "Julienne", "Chiffonade", "Mince"],
      correct: 2
    }
  },
  {
    id: 2,
    title: "Building Pan Sauces",
    category: "Chicken",
    area: "French",
    difficulty: "medium",
    image: "assets/recipes/recipes (2).jpg",
    description: "Learn to deglaze, reduce, and finish with butter to turn weeknight pans into memorable meals.",
    content: [
      { type: "text", value: "Pan sauces transform simple proteins into restaurant-quality dishes using the flavorful fond left in your pan." },
      { type: "heading", value: "Step 1: Build the Fond" },
      { type: "text", value: "Sear your protein properly to create browned bits on the pan bottom. This is flavor gold." },
      { type: "heading", value: "Step 2: Deglaze" },
      { type: "text", value: "Add wine, stock, or even water while the pan is hot. Scrape up all those browned bits." },
      { type: "heading", value: "Step 3: Reduce" },
      { type: "text", value: "Simmer until the liquid reduces by half, concentrating the flavors." },
      { type: "heading", value: "Step 4: Finish" },
      { type: "text", value: "Swirl in cold butter for a silky, glossy sauce. Season and serve immediately." }
    ],
    quiz: {
      question: "What is 'fond' in cooking?",
      options: ["A type of stock", "Browned bits on pan", "A French dessert", "Butter sauce"],
      correct: 1
    }
  },
  {
    id: 3,
    title: "Understanding Spices",
    category: "Chicken",
    area: "Indian",
    difficulty: "easy",
    image: "assets/recipes/recipes (5).jpg",
    description: "Get to know cumin, coriander, cardamom and friends — plus how to toast and bloom them for maximum flavor.",
    content: [
      { type: "text", value: "Spices are the soul of many world cuisines. Learn how to unlock their full potential." },
      { type: "heading", value: "Toasting Whole Spices" },
      { type: "text", value: "Heat a dry skillet over medium heat. Add whole spices and toast until fragrant, about 2-3 minutes. This intensifies their flavor." },
      { type: "heading", value: "Blooming Ground Spices" },
      { type: "text", value: "Add ground spices to hot oil or fat before adding liquids. This 'blooms' them and removes any raw taste." },
      { type: "heading", value: "Common Spices" },
      { type: "text", value: "Cumin: earthy and warm. Coriander: citrusy and sweet. Cardamom: floral and complex. Turmeric: earthy and slightly bitter." }
    ],
    quiz: {
      question: "What does 'blooming' spices mean?",
      options: ["Grinding them fresh", "Cooking in hot oil", "Adding water", "Storing properly"],
      correct: 1
    }
  },
  {
    id: 4,
    title: "Perfect Pasta Every Time",
    category: "Pasta",
    area: "Italian",
    difficulty: "easy",
    image: "assets/recipes/recipes (7).jpg",
    description: "Learn the secrets to cooking pasta al dente and creating silky sauces that cling perfectly.",
    content: [
      { type: "text", value: "Perfect pasta is about timing, water, and technique. Follow these rules for success every time." },
      { type: "heading", value: "Salt Your Water" },
      { type: "text", value: "Use 1-2 tablespoons of salt per gallon. The water should taste like the sea." },
      { type: "heading", value: "Don't Break the Pasta" },
      { type: "text", value: "Let long pasta soften in the water for 30 seconds, then stir it down gently." },
      { type: "heading", value: "Save Pasta Water" },
      { type: "text", value: "Reserve a cup before draining. The starchy water helps sauce cling to pasta." },
      { type: "heading", value: "Finish in the Sauce" },
      { type: "text", value: "Transfer pasta to sauce 1-2 minutes before fully cooked. Let it finish cooking in the sauce for better flavor." }
    ],
    quiz: {
      question: "Why should you save pasta water?",
      options: ["To drink later", "Starch helps sauce stick", "To water plants", "Prevent sticking"],
      correct: 1
    }
  },
  {
    id: 5,
    title: "Stir-Fry Mastery",
    category: "Beef",
    area: "Chinese",
    difficulty: "medium",
    image: "assets/recipes/recipes (8).jpg",
    description: "Master high-heat cooking with proper prep, timing, and wok technique for restaurant-quality stir-fries.",
    content: [
      { type: "text", value: "Stir-frying is all about high heat and quick cooking. Preparation is 90% of success." },
      { type: "heading", value: "Prep Everything First" },
      { type: "text", value: "Cut all ingredients before you start cooking. Once the wok is hot, there's no time to chop." },
      { type: "heading", value: "Get the Wok Smoking Hot" },
      { type: "text", value: "Your wok should be so hot that a drop of water evaporates instantly." },
      { type: "heading", value: "Cook in Batches" },
      { type: "text", value: "Don't overcrowd the wok. This drops the temperature and causes steaming instead of searing." },
      { type: "heading", value: "Keep It Moving" },
      { type: "text", value: "Constantly toss and stir. This ensures even cooking and prevents burning." }
    ],
    quiz: {
      question: "Why cook stir-fry ingredients in batches?",
      options: ["Saves time", "Prevents overcrowding", "Uses less oil", "Easier to clean"],
      correct: 1
    }
  },
  {
    id: 6,
    title: "Salad Dressing Fundamentals",
    category: "Side",
    area: "French",
    difficulty: "easy",
    image: "assets/recipes/recipes (4).jpg",
    description: "Master vinaigrettes and creamy dressings with the perfect balance of acid, oil, and seasonings.",
    content: [
      { type: "text", value: "A great salad starts with a great dressing. Learn the basic ratios and techniques." },
      { type: "heading", value: "The Classic Ratio" },
      { type: "text", value: "3 parts oil to 1 part acid (vinegar or citrus). This is your starting point for vinaigrettes." },
      { type: "heading", value: "Emulsification" },
      { type: "text", value: "Whisk vigorously or use mustard to help oil and vinegar combine into a smooth dressing." },
      { type: "heading", value: "Seasoning" },
      { type: "text", value: "Always taste and adjust. Add salt, pepper, herbs, garlic, or honey to balance flavors." },
      { type: "heading", value: "Dress at the Last Minute" },
      { type: "text", value: "Toss salad with dressing just before serving to prevent wilting." }
    ],
    quiz: {
      question: "What is the classic oil to acid ratio for vinaigrette?",
      options: ["1:1", "2:1", "3:1", "4:1"],
      correct: 2
    }
  }
];

// Ingredient pairing data for FlavorMixer
const INGREDIENT_PAIRINGS = {
  "Lemon": {
    pairs: ["Garlic", "Basil", "Thyme", "Fish", "Chicken", "Olive Oil"],
    recipes: [1, 11, 13]
  },
  "Garlic": {
    pairs: ["Lemon", "Basil", "Tomato", "Olive Oil", "Ginger", "Soy Sauce"],
    recipes: [1, 5, 7, 8, 11]
  },
  "Basil": {
    pairs: ["Tomato", "Garlic", "Mozzarella", "Olive Oil", "Lemon"],
    recipes: [1, 13]
  },
  "Tomato": {
    pairs: ["Basil", "Garlic", "Onion", "Mozzarella", "Olive Oil"],
    recipes: [1, 3, 4, 5, 13, 14]
  },
  "Ginger": {
    pairs: ["Garlic", "Soy Sauce", "Lime", "Coconut Milk", "Chili"],
    recipes: [2, 5, 8]
  },
  "Soy Sauce": {
    pairs: ["Ginger", "Garlic", "Sesame Oil", "Rice Vinegar"],
    recipes: [2, 8, 10]
  },
  "Honey": {
    pairs: ["Soy Sauce", "Ginger", "Lime", "Chili"],
    recipes: [2]
  },
  "Chili": {
    pairs: ["Lime", "Coconut Milk", "Ginger", "Garlic"],
    recipes: [5, 15]
  },
  "Coconut Milk": {
    pairs: ["Curry", "Ginger", "Lime", "Cilantro"],
    recipes: [5]
  },
  "Cilantro": {
    pairs: ["Lime", "Chili", "Coconut Milk", "Cumin"],
    recipes: [2, 5, 15]
  },
  "Lime": {
    pairs: ["Cilantro", "Chili", "Coconut Milk", "Ginger"],
    recipes: [2, 12, 15]
  },
  "Onion": {
    pairs: ["Garlic", "Tomato", "Bell Pepper", "Olive Oil"],
    recipes: [3, 5, 8, 12, 18]
  },
  "Bell Pepper": {
    pairs: ["Onion", "Tomato", "Cumin", "Paprika"],
    recipes: [8, 10, 12]
  },
  "Cumin": {
    pairs: ["Coriander", "Paprika", "Chili", "Lime"],
    recipes: [3, 5, 12]
  },
  "Paprika": {
    pairs: ["Cumin", "Garlic", "Onion"],
    recipes: [3, 12, 17]
  },
  "Oregano": {
    pairs: ["Basil", "Thyme", "Tomato", "Garlic"],
    recipes: [4]
  },
  "Thyme": {
    pairs: ["Rosemary", "Garlic", "Lemon", "Butter"],
    recipes: [16, 18]
  },
  "Parsley": {
    pairs: ["Garlic", "Lemon", "Olive Oil", "Butter"],
    recipes: [11]
  },
  "Rosemary": {
    pairs: ["Thyme", "Garlic", "Olive Oil", "Lemon"],
    recipes: []
  }
};

// Ingredient substitutes
const SUBSTITUTES_DATA = [
  { original: "Butter", substitute: "Margarine or Coconut Oil", ratio: "1:1", notes: "Use coconut oil for baking" },
  { original: "Butter", substitute: "Greek Yogurt", ratio: "1:1/2", notes: "Best for baking, adds moisture" },
  { original: "Eggs", substitute: "Flax Egg (1 tbsp flax + 3 tbsp water)", ratio: "1:1", notes: "Let sit 5 min to gel" },
  { original: "Eggs", substitute: "Applesauce", ratio: "1 egg:1/4 cup", notes: "Best for sweet baked goods" },
  { original: "Milk", substitute: "Almond Milk", ratio: "1:1", notes: "Works in most recipes" },
  { original: "Milk", substitute: "Coconut Milk", ratio: "1:1", notes: "Adds slight coconut flavor" },
  { original: "Heavy Cream", substitute: "Coconut Cream", ratio: "1:1", notes: "Great dairy-free option" },
  { original: "Heavy Cream", substitute: "Milk + Butter", ratio: "1 cup:7/8 cup milk + 2 tbsp butter", notes: "Mix well" },
  { original: "Sour Cream", substitute: "Greek Yogurt", ratio: "1:1", notes: "Same tangy flavor" },
  { original: "Parmesan", substitute: "Pecorino Romano", ratio: "1:1", notes: "Slightly saltier" },
  { original: "Mozzarella", substitute: "Provolone", ratio: "1:1", notes: "Similar melting properties" },
  { original: "White Wine", substitute: "Chicken/Vegetable Stock", ratio: "1:1", notes: "Add a splash of vinegar" },
  { original: "Red Wine", substitute: "Beef Stock + Vinegar", ratio: "1 cup:1 cup stock + 1 tbsp vinegar", notes: "Adds depth" },
  { original: "Lemon Juice", substitute: "Lime Juice", ratio: "1:1", notes: "Similar acidity" },
  { original: "Lemon Juice", substitute: "White Wine Vinegar", ratio: "1:1/2", notes: "More acidic" },
  { original: "Garlic", substitute: "Garlic Powder", ratio: "1 clove:1/8 tsp powder", notes: "Less pungent" },
  { original: "Fresh Herbs", substitute: "Dried Herbs", ratio: "1 tbsp fresh:1 tsp dried", notes: "Add earlier in cooking" },
  { original: "Breadcrumbs", substitute: "Crushed Crackers or Oats", ratio: "1:1", notes: "Works well for coating" },
  { original: "Brown Sugar", substitute: "White Sugar + Molasses", ratio: "1 cup:1 cup sugar + 1 tbsp molasses", notes: "Mix well" },
  { original: "Baking Powder", substitute: "Baking Soda + Cream of Tartar", ratio: "1 tsp:1/4 tsp soda + 1/2 tsp cream", notes: "Use immediately" },
  { original: "Cornstarch", substitute: "Flour", ratio: "1 tbsp:2 tbsp flour", notes: "For thickening" },
  { original: "Soy Sauce", substitute: "Tamari", ratio: "1:1", notes: "Gluten-free option" },
  { original: "Soy Sauce", substitute: "Worcestershire + Water", ratio: "1 tbsp:1 tbsp worcestershire + 1 tsp water", notes: "Different flavor profile" }
];

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RECIPES_DATA, CATEGORIES, AREAS, LEARNING_DATA, INGREDIENT_PAIRINGS, SUBSTITUTES_DATA };
}
