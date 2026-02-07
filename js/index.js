// ============================================
// Index.html Specific JavaScript
// ============================================

// Hero Carousel - Fill with random recipes
function initHeroCarousel() {
  const carouselInner = document.querySelector('#heroCarousel .carousel-inner');
  const carouselIndicators = document.querySelector('#heroCarousel .carousel-indicators');
  
  if (!carouselInner || !carouselIndicators) return;
  
  // Get 6 unique random recipes
  const randomRecipes = getRandomItems(RECIPES_DATA, 6);
  
  carouselInner.innerHTML = randomRecipes.map((recipe, i) => `
    <div class="carousel-item ${i === 0 ? 'active' : ''}">
      <img src="${recipe.image}" class="d-block w-100" alt="${recipe.name}" 
           style="height:100%; object-fit:cover; cursor:pointer;"
           onclick="openRecipeModal(${recipe.id})">
      <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
        <h5>${recipe.name}</h5>
        <p>${recipe.area} · ${recipe.category}</p>
      </div>
    </div>
  `).join('');
  
  carouselIndicators.innerHTML = randomRecipes.map((_, i) => `
    <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="${i}" 
            ${i === 0 ? 'class="active" aria-current="true"' : ''} 
            aria-label="Slide ${i + 1}"></button>
  `).join('');
}

// Category Slider
let categoryPage = 0;
const categoriesPerPage = 4;

function initCategorySlider() {
  renderCategories();
  setupCategoryControls();
  updateCategoryCounter();
}

function renderCategories() {
  const slider = document.getElementById('categorySlider');
  if (!slider) return;
  
  const start = categoryPage * categoriesPerPage;
  const end = start + categoriesPerPage;
  const categoriesToShow = CATEGORIES.slice(start, end);
  
  slider.innerHTML = categoriesToShow.map(cat => createCategoryCard(cat)).join('');
}

function setupCategoryControls() {
  const prevBtn = document.getElementById('catPrev');
  const nextBtn = document.getElementById('catNext');
  const shuffleBtn = document.getElementById('btnShuffle');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (categoryPage > 0) {
        categoryPage--;
        renderCategories();
        updateCategoryCounter();
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if ((categoryPage + 1) * categoriesPerPage < CATEGORIES.length) {
        categoryPage++;
        renderCategories();
        updateCategoryCounter();
      }
    });
  }
  
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      CATEGORIES.sort(() => 0.5 - Math.random());
      categoryPage = 0;
      renderCategories();
      updateCategoryCounter();
    });
  }
  
  // Enable shuffle button
  if (shuffleBtn) shuffleBtn.disabled = false;
}

function updateCategoryCounter() {
  const counter = document.getElementById('catCounter');
  if (!counter) return;
  
  const start = categoryPage * categoriesPerPage + 1;
  const end = Math.min((categoryPage + 1) * categoriesPerPage, CATEGORIES.length);
  
  counter.textContent = `${start}–${end} of ${CATEGORIES.length} categories`;
}

// Filter by category (navigates to recipes page)
function filterByCategory(categoryName) {
  localStorage.setItem('selectedCategory', categoryName);
  window.location.href = 'recipes.html';
}

// More Categories Button
function setupMoreCategories() {
  const btnMoreCats = document.getElementById('btnMoreCats');
  const moreCategories = document.getElementById('moreCategories');
  
  if (!btnMoreCats || !moreCategories) return;
  
  // Fill more categories (remaining ones)
  const remainingCategories = CATEGORIES.slice(categoriesPerPage);
  if (remainingCategories.length === 0) {
    btnMoreCats.style.display = 'none';
    return;
  }
  
  btnMoreCats.addEventListener('click', () => {
    const isOpen = moreCategories.classList.contains('open');
    
    if (!isOpen) {
      // Populate if empty
      if (!moreCategories.innerHTML) {
        moreCategories.innerHTML = remainingCategories.map(cat => createCategoryCard(cat)).join('');
      }
      moreCategories.classList.add('open');
      btnMoreCats.textContent = 'Show less';
    } else {
      moreCategories.classList.remove('open');
      btnMoreCats.textContent = 'More categories';
    }
  });
}

// Home Search
function setupHomeSearch() {
  const searchInput = document.getElementById('homeSearch');
  const searchBtn = document.getElementById('btnHomeSearch');
  const clearBtn = document.getElementById('btnClearSearch');
  const resultsWrap = document.getElementById('searchResultsWrap');
  const resultsGrid = document.getElementById('searchResults');
  
  if (!searchInput || !searchBtn || !resultsGrid) return;
  
  const performSearch = () => {
    const query = searchInput.value.trim();
    
    if (!query) return;
    
    const results = RECIPES_DATA.filter(recipe => 
      recipe.name.toLowerCase().includes(query.toLowerCase())
    );
    
    if (results.length === 0) {
      resultsGrid.innerHTML = '<div class="col-12"><p class="text-muted text-center">No recipes found</p></div>';
    } else {
      resultsGrid.innerHTML = results.map(recipe => createRecipeCard(recipe)).join('');
    }
    
    if (resultsWrap) resultsWrap.classList.remove('d-none');
    if (clearBtn) clearBtn.hidden = false;
  };
  
  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });
  
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      if (resultsWrap) resultsWrap.classList.add('d-none');
      clearBtn.hidden = true;
    });
  }
}

// Surprise Me Button
function setupSurpriseMe() {
  const surpriseBtn = document.getElementById('btnSurprise');
  
  if (surpriseBtn) {
    surpriseBtn.addEventListener('click', () => {
      const randomRecipe = RECIPES_DATA[Math.floor(Math.random() * RECIPES_DATA.length)];
      openRecipeModal(randomRecipe.id);
    });
  }
}

// Initialize Index Page
if (document.getElementById('heroCarousel')) {
  document.addEventListener('DOMContentLoaded', () => {
    initHeroCarousel();
    initCategorySlider();
    setupMoreCategories();
    setupHomeSearch();
    setupSurpriseMe();
  });
}
