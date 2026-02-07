// ============================================
// Recipes.html Specific JavaScript
// ============================================

let recipesFiltered = [...RECIPES_DATA];
let recipesDisplayed = [];

function initRecipesPage() {
  populateFilterDropdowns();
  setupRecipesControls();
  
  // Check if category was selected from index page
  const selectedCategory = localStorage.getItem('selectedCategory');
  if (selectedCategory) {
    document.getElementById('recFilterCategory').value = selectedCategory;
    localStorage.removeItem('selectedCategory');
  }
  
  applyRecipesFilters();
}

function populateFilterDropdowns() {
  const categorySelect = document.getElementById('recFilterCategory');
  const areaSelect = document.getElementById('recFilterArea');
  
  if (categorySelect) {
    const categories = [...new Set(RECIPES_DATA.map(r => r.category))].sort();
    categorySelect.innerHTML = '<option value="">All categories</option>' + 
      categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
  }
  
  if (areaSelect) {
    const areas = [...new Set(RECIPES_DATA.map(r => r.area))].sort();
    areaSelect.innerHTML = '<option value="">All areas</option>' + 
      areas.map(area => `<option value="${area}">${area}</option>`).join('');
  }
}

function setupRecipesControls() {
  const categoryFilter = document.getElementById('recFilterCategory');
  const areaFilter = document.getElementById('recFilterArea');
  const clearFiltersBtn = document.getElementById('recClearFilters');
  const searchInput = document.getElementById('recSearch');
  const searchBtn = document.getElementById('recBtnSearch');
  const shuffleBtn = document.getElementById('recShuffle');
  
  if (categoryFilter) categoryFilter.addEventListener('change', applyRecipesFilters);
  if (areaFilter) areaFilter.addEventListener('change', applyRecipesFilters);
  
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      if (categoryFilter) categoryFilter.value = '';
      if (areaFilter) areaFilter.value = '';
      if (searchInput) searchInput.value = '';
      applyRecipesFilters();
    });
  }
  
  if (searchBtn && searchInput) {
    const performSearch = () => applyRecipesFilters();
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }
  
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      recipesDisplayed = shuffleArray(recipesDisplayed);
      renderRecipesGrid();
    });
  }
}

function applyRecipesFilters() {
  const category = document.getElementById('recFilterCategory')?.value || '';
  const area = document.getElementById('recFilterArea')?.value || '';
  const search = document.getElementById('recSearch')?.value.trim().toLowerCase() || '';
  
  recipesFiltered = RECIPES_DATA.filter(recipe => {
    const matchCategory = !category || recipe.category === category;
    const matchArea = !area || recipe.area === area;
    const matchSearch = !search || recipe.name.toLowerCase().includes(search);
    return matchCategory && matchArea && matchSearch;
  });
  
  recipesDisplayed = [...recipesFiltered];
  renderRecipesGrid();
  updateRecipesCounter();
}

function renderRecipesGrid() {
  const grid = document.getElementById('recipesGrid');
  if (!grid) return;
  
  if (recipesDisplayed.length === 0) {
    grid.innerHTML = '<div class="col-12"><p class="text-center text-muted py-5">No recipes found. Try adjusting your filters.</p></div>';
    return;
  }
  
  grid.innerHTML = recipesDisplayed.map(recipe => createRecipeCard(recipe)).join('');
}

function updateRecipesCounter() {
  const counter = document.getElementById('recipesCounter');
  if (!counter) return;
  
  const count = recipesDisplayed.length;
  const total = RECIPES_DATA.length;
  
  if (count === total) {
    counter.textContent = `Showing all ${total} recipes`;
  } else {
    counter.textContent = `Showing ${count} of ${total} recipes`;
  }
}

// Initialize Recipes Page
if (document.getElementById('recipesGrid')) {
  document.addEventListener('DOMContentLoaded', () => {
    initRecipesPage();
  });
}
