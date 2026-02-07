// ============================================
// FlavorMixer.html Specific JavaScript
// ============================================

let selectedIngredients = [];

function initFlavorMixer() {
  setupIngredientPool();
  setupIngredientSearch();
}

function setupIngredientPool() {
  const pool = document.getElementById('ingPool');
  if (!pool) return;
  
  const ingredients = Object.keys(INGREDIENT_PAIRINGS);
  
  pool.innerHTML = ingredients.map(ing => `
    <button class="btn btn-sm btn-outline-success" onclick="toggleIngredient('${ing}')">
      ${ing}
    </button>
  `).join('');
}

function setupIngredientSearch() {
  const searchInput = document.getElementById('ingSearch');
  if (!searchInput) return;
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const pool = document.getElementById('ingPool');
    if (!pool) return;
    
    const ingredients = Object.keys(INGREDIENT_PAIRINGS);
    const filtered = query ? ingredients.filter(ing => ing.toLowerCase().includes(query)) : ingredients;
    
    if (filtered.length === 0) {
      pool.innerHTML = '<p class="text-muted small">No ingredients found</p>';
      return;
    }
    
    pool.innerHTML = filtered.map(ing => `
      <button class="btn btn-sm btn-outline-success ${selectedIngredients.includes(ing) ? 'active' : ''}" 
              onclick="toggleIngredient('${ing}')">
        ${ing}
      </button>
    `).join('');
  });
}

function toggleIngredient(ingredient) {
  const index = selectedIngredients.indexOf(ingredient);
  
  if (index === -1) {
    selectedIngredients.push(ingredient);
  } else {
    selectedIngredients.splice(index, 1);
  }
  
  updateSelectedDisplay();
  updatePairings();
  
  // Update button state in pool
  const pool = document.getElementById('ingPool');
  if (pool) {
    const buttons = pool.querySelectorAll('button');
    buttons.forEach(btn => {
      if (btn.textContent.trim() === ingredient) {
        if (selectedIngredients.includes(ingredient)) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      }
    });
  }
}

function updateSelectedDisplay() {
  const container = document.getElementById('selectedIngs');
  if (!container) return;
  
  if (selectedIngredients.length === 0) {
    container.innerHTML = '<span class="text-muted">No ingredients chosen.</span>';
    return;
  }
  
  container.innerHTML = selectedIngredients.map(ing => `
    <span class="badge bg-success me-2 mb-2" style="font-size:0.9rem; cursor:pointer;" 
          onclick="toggleIngredient('${ing}')">
      ${ing} <i class="fa-solid fa-xmark ms-1"></i>
    </span>
  `).join('');
}

function updatePairings() {
  const container = document.getElementById('pairingResults');
  if (!container) return;
  
  if (selectedIngredients.length === 0) {
    container.innerHTML = '<span class="text-muted">Suggestions will appear here.</span>';
    return;
  }
  
  // Collect all possible pairings
  const allPairings = new Set();
  const recipeIds = new Set();
  
  selectedIngredients.forEach(ing => {
    const data = INGREDIENT_PAIRINGS[ing];
    if (data) {
      data.pairs.forEach(pair => allPairings.add(pair));
      data.recipes.forEach(id => recipeIds.add(id));
    }
  });
  
  // Remove ingredients already selected
  selectedIngredients.forEach(ing => allPairings.delete(ing));
  
  // Get recipe suggestions
  const suggestedRecipes = Array.from(recipeIds).map(id => getRecipeById(id)).filter(r => r);
  
  let html = '';
  
  // Show pairings
  if (allPairings.size > 0) {
    html += '<div class="mb-4">';
    html += '<h6 class="mb-2">✨ Flavor Pairings</h6>';
    html += '<p class="small text-muted mb-2">These ingredients complement your selection:</p>';
    html += '<div class="d-flex flex-wrap gap-2">';
    Array.from(allPairings).slice(0, 12).forEach(pair => {
      html += `<span class="badge bg-light text-success border" style="font-size:0.85rem; cursor:pointer;"
                     onclick="toggleIngredient('${pair}')">${pair}</span>`;
    });
    html += '</div></div>';
  }
  
  // Show recipe suggestions
  if (suggestedRecipes.length > 0) {
    html += '<div>';
    html += '<h6 class="mb-2">🍳 Suggested Recipes</h6>';
    html += '<p class="small text-muted mb-3">Try these recipes featuring your ingredients:</p>';
    html += '<div class="row g-3">';
    suggestedRecipes.slice(0, 6).forEach(recipe => {
      html += `
        <div class="col-md-6">
          <div class="card h-100" style="cursor:pointer;" onclick="openRecipeModal(${recipe.id})">
            <div class="row g-0" style="height:120px;">
              <div class="col-4">
                <img src="${recipe.image}" class="img-fluid h-100 w-100" alt="${recipe.name}" style="object-fit:cover;">
              </div>
              <div class="col-8">
                <div class="card-body p-2 d-flex flex-column" style="height:120px;">
                  <h6 class="card-title small mb-1" style="overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">${recipe.name}</h6>
                  <div class="small text-muted mt-auto">
                    <span class="badge bg-light text-success border me-1">${recipe.category}</span>
                    <span>${recipe.area}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    html += '</div></div>';
  }
  
  if (html === '') {
    html = '<p class="text-muted">No pairings found. Try different ingredients!</p>';
  }
  
  container.innerHTML = html;
}

// Initialize FlavorMixer Page
if (document.getElementById('ingPool')) {
  document.addEventListener('DOMContentLoaded', () => {
    initFlavorMixer();
  });
}
