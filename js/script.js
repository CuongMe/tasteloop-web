// ============================================
// TastyLoop - Main JavaScript Application
// ============================================

// Global state
let currentRecipe = null;
let currentServings = 1;
let originalServings = 1;
let currentStep = 0;
let shoppingList = [];
let timers = [];

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Get random items from array
function getRandomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Shuffle array
function shuffleArray(arr) {
  return [...arr].sort(() => 0.5 - Math.random());
}

// Get random image from assets
function getRandomImage(type = 'recipes') {
  const recipeImages = Array.from({ length: 19 }, (_, i) => `assets/recipes/recipes (${i + 1}).jpg`);
  const aboutImages = Array.from({ length: 6 }, (_, i) => `assets/about/about_1 (${i + 1}).jpg`);
  
  const images = type === 'about' ? aboutImages : recipeImages;
  return images[Math.floor(Math.random() * images.length)];
}

// Scale ingredient quantity
function scaleQuantity(measure, scale) {
  if (!measure || measure === 'to taste' || measure === 'for serving') return measure;
  
  // Extract number from measure
  const match = measure.match(/(\d+\.?\d*)/);
  if (match) {
    const num = parseFloat(match[1]);
    const scaled = (num * scale).toFixed(2).replace(/\.?0+$/, '');
    return measure.replace(match[1], scaled);
  }
  
  return measure;
}

// Format time display
function formatTime(minutes) {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

// ============================================
// RECIPE FUNCTIONS
// ============================================

// Get recipe by ID
function getRecipeById(id) {
  return RECIPES_DATA.find(r => r.id === id);
}

// Filter recipes
function filterRecipes(category = '', area = '', search = '') {
  return RECIPES_DATA.filter(recipe => {
    const matchCategory = !category || recipe.category === category;
    const matchArea = !area || recipe.area === area;
    const matchSearch = !search || recipe.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchArea && matchSearch;
  });
}

// Create recipe card HTML
function createRecipeCard(recipe) {
  const flagPath = getFlagPath(recipe.area);
  const flagImg = flagPath ? `<img src="${flagPath}" alt="${recipe.area}">` : '';
  
  return `
    <div class="col-md-6 col-lg-4 col-xl-3">
      <div class="recipe-card">
        <div class="img-wrap">
          <img src="${recipe.image}" alt="${recipe.name}" loading="lazy">
        </div>
        <div class="card-body">
          <h6 class="card-title mb-2">${recipe.name}</h6>
          <div class="meta mb-2">
            <span class="flag-pill">
              ${flagImg}
              <span>${recipe.area}</span>
            </span>
            <span class="badge bg-light text-success border ms-1">${recipe.category}</span>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">
              <i class="fa-regular fa-clock me-1"></i>${formatTime(recipe.prepTime + recipe.cookTime)}
            </small>
            <button class="btn btn-sm btn-success" onclick="openRecipeModal(${recipe.id})">
              Cook
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Create category card HTML with carousel navigation
function createCategoryCard(category) {
  const recipes = RECIPES_DATA.filter(r => r.category === category.name);
  
  if (recipes.length === 0) return '';
  
  const cardId = `cat-${category.name.toLowerCase().replace(/\s+/g, '-')}`;
  
  return `
    <div class="col-md-6 col-lg-3">
      <div class="card h-100 shadow-sm category-card" style="cursor:pointer;">
        <div class="position-relative">
          <div id="${cardId}" class="carousel slide" data-bs-interval="false">
            <div class="carousel-inner" style="height:180px;">
              ${recipes.slice(0, 5).map((recipe, i) => {
                const flagPath = getFlagPath(recipe.area);
                const flagImg = flagPath ? `<img src="${flagPath}" alt="${recipe.area}" style="width:18px;height:14px;border-radius:2px;">` : '';
                
                return `
                  <div class="carousel-item ${i === 0 ? 'active' : ''}" onclick="openRecipeModal(${recipe.id})">
                    <img src="${recipe.image}" class="d-block w-100" alt="${recipe.name}" style="height:180px; object-fit:cover;">
                    <div class="carousel-caption d-flex align-items-center gap-2" style="bottom:8px;left:8px;right:auto;">
                      ${flagImg}
                      <span class="small fw-bold text-white">${recipe.area}</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            ${recipes.length > 1 ? `
              <button class="carousel-control-prev" type="button" data-bs-target="#${cardId}" data-bs-slide="prev" style="width:40px;">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#${cardId}" data-bs-slide="next" style="width:40px;">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
              </button>
            ` : ''}
          </div>
        </div>
        <div class="card-body" onclick="filterByCategory('${category.name}')">
          <div class="d-flex align-items-center gap-2 mb-2">
            <span class="fs-5">${category.icon}</span>
            <h6 class="card-title mb-0">${category.name}</h6>
          </div>
          <div class="text-muted small">${recipes.length} recipe${recipes.length !== 1 ? 's' : ''}</div>
        </div>
      </div>
    </div>
  `;
}

// Open recipe modal
function openRecipeModal(recipeId) {
  const recipe = getRecipeById(recipeId);
  if (!recipe) return;
  
  currentRecipe = recipe;
  currentServings = recipe.servings;
  originalServings = recipe.servings;
  currentStep = 0;
  
  // Fill modal with recipe data
  const modal = document.getElementById('recipeModal');
  if (!modal) return;
  
  // Set title
  const titleEl = modal.querySelector('[data-r-title]');
  if (titleEl) titleEl.textContent = recipe.name;
  
  // Set image carousel
  const carouselInner = modal.querySelector('#recipeImgCarousel .carousel-inner');
  if (carouselInner) {
    // Use recipe image + 2 random images for variety
    const images = [recipe.image, getRandomImage(), getRandomImage()];
    carouselInner.innerHTML = images.map((img, i) => `
      <div class="carousel-item ${i === 0 ? 'active' : ''}">
        <img src="${img}" class="d-block w-100" alt="${recipe.name}" style="object-fit:cover;">
      </div>
    `).join('');
  }
  
  // Set area/metadata with flag
  const areaEl = modal.querySelector('[data-r-area]');
  if (areaEl) {
    const flagPath = getFlagPath(recipe.area);
    const flagImg = flagPath ? `<img src="${flagPath}" alt="${recipe.area}">` : '';
    
    areaEl.innerHTML = `
      <span class="flag-pill me-2">
        ${flagImg}
        <span>${recipe.area}</span>
      </span>
      <span class="badge bg-light text-success border">${recipe.category}</span>
      <span class="ms-2 text-muted small">
        <i class="fa-regular fa-clock me-1"></i>${formatTime(recipe.prepTime + recipe.cookTime)}
      </span>
    `;
  }
  
  // Set ingredients with servings control
  const ingredientsEl = modal.querySelector('[data-r-ingredients]');
  if (ingredientsEl) {
    updateIngredientsList();
  }
  
  // Set instructions/steps
  const stepsEl = modal.querySelector('[data-r-steps]');
  if (stepsEl) {
    stepsEl.innerHTML = recipe.instructions.map((step, i) => `
      <li class="list-group-item">${step}</li>
    `).join('');
  }
  
  // Setup servings controls
  setupServingsControls();
  
  // Setup interactive cooking mode
  setupInteractiveCooking();
  
  // Setup rating
  setupRating();
  
  // Setup concise mode
  setupConciseMode();
  
  // Show modal
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
}

// Update ingredients list based on servings
function updateIngredientsList() {
  if (!currentRecipe) return;
  
  const scale = currentServings / originalServings;
  const ingredientsEl = document.querySelector('[data-r-ingredients]');
  
  if (ingredientsEl) {
    ingredientsEl.innerHTML = currentRecipe.ingredients.map(ing => `
      <li class="col-md-6 mb-2">
        <span class="ingredient-qty">${scaleQuantity(ing.measure, scale)}</span>
        <span>${ing.name}</span>
      </li>
    `).join('');
  }
  
  // Update servings display
  const servingsDisplay = document.querySelector('[data-servings-value]');
  if (servingsDisplay) servingsDisplay.textContent = currentServings;
}

// Setup servings controls
function setupServingsControls() {
  const decreaseBtn = document.querySelector('[data-servings-dec]');
  const increaseBtn = document.querySelector('[data-servings-inc]');
  const resetBtn = document.querySelector('[data-servings-reset]');
  const servingsDisplay = document.querySelector('[data-servings-value]');
  const servingsNote = document.querySelector('[data-servings-note]');
  
  if (decreaseBtn && increaseBtn && servingsDisplay) {
    servingsDisplay.textContent = currentServings;
    
    decreaseBtn.onclick = () => {
      if (currentServings > 1) {
        currentServings--;
        updateIngredientsList();
        if (servingsNote) {
          const scale = (currentServings / originalServings).toFixed(2);
          servingsNote.textContent = `Scaled x${scale} from base ${originalServings} servings`;
        }
      }
    };
    
    increaseBtn.onclick = () => {
      currentServings++;
      updateIngredientsList();
      if (servingsNote) {
        const scale = (currentServings / originalServings).toFixed(2);
        servingsNote.textContent = `Scaled x${scale} from base ${originalServings} servings`;
      }
    };
    
    if (resetBtn) {
      resetBtn.onclick = () => {
        currentServings = originalServings;
        updateIngredientsList();
        if (servingsNote) {
          servingsNote.textContent = `Scaled x1.00 from base ${originalServings} servings`;
        }
      };
    }
  }
}

// Setup interactive cooking mode
function setupInteractiveCooking() {
  const prevStepBtn = document.querySelector('[data-step-prev]');
  const nextStepBtn = document.querySelector('[data-step-next]');
  const restartBtn = document.querySelector('[data-step-restart]');
  
  if (prevStepBtn) {
    prevStepBtn.onclick = () => {
      if (currentStep > 0) {
        currentStep--;
        updateCookingStep();
      }
    };
  }
  
  if (nextStepBtn) {
    nextStepBtn.onclick = () => {
      if (currentStep < currentRecipe.instructions.length - 1) {
        currentStep++;
        updateCookingStep();
      } else {
        // Cooking complete
        showCookingComplete();
      }
    };
  }
  
  if (restartBtn) {
    restartBtn.onclick = () => {
      currentStep = 0;
      updateCookingStep();
    };
  }
  
  // Initialize first step
  currentStep = 0;
  updateCookingStep();
}

// Update cooking step display
function updateCookingStep() {
  if (!currentRecipe) return;
  
  const stepCurrent = document.querySelector('[data-step-current]');
  const stepTotal = document.querySelector('[data-step-total]');
  const stepText = document.querySelector('[data-step-text]');
  const progressBar = document.querySelector('[data-step-progress]');
  const prevBtn = document.querySelector('[data-step-prev]');
  const nextBtn = document.querySelector('[data-step-next]');
  
  if (stepCurrent) stepCurrent.textContent = `${currentStep + 1}`;
  if (stepTotal) stepTotal.textContent = `${currentRecipe.instructions.length}`;
  if (stepText) stepText.textContent = currentRecipe.instructions[currentStep];
  
  if (progressBar) {
    const progress = ((currentStep + 1) / currentRecipe.instructions.length) * 100;
    progressBar.style.width = `${progress}%`;
  }
  
  if (prevBtn) prevBtn.disabled = currentStep === 0;
  if (nextBtn) {
    nextBtn.textContent = currentStep === currentRecipe.instructions.length - 1 ? 'Complete' : 'Next →';
  }
}

// Show cooking complete message
function showCookingComplete() {
  alert('🎉 Congratulations! You\'ve completed the recipe!\n\n' + currentRecipe.name + ' is ready to serve!');
  currentStep = 0;
  updateCookingStep();
}

// ============================================
// RATING FUNCTIONS
// ============================================

function setupRating() {
  const rateStars = document.querySelectorAll('#rateStars .star');
  const rateSubmit = document.getElementById('rateSubmit');
  const rateText = document.getElementById('rateText');
  const rateMsg = document.getElementById('rateMsg');
  
  let selectedRating = 0;
  
  // Setup star click handlers
  rateStars.forEach((star, index) => {
    star.addEventListener('click', () => {
      selectedRating = index + 1;
      updateStarDisplay(selectedRating);
    });
    
    star.addEventListener('mouseenter', () => {
      updateStarDisplay(index + 1, true);
    });
  });
  
  // Reset stars on mouse leave
  const rateStarsContainer = document.getElementById('rateStars');
  if (rateStarsContainer) {
    rateStarsContainer.addEventListener('mouseleave', () => {
      updateStarDisplay(selectedRating);
    });
  }
  
  // Submit rating
  if (rateSubmit) {
    rateSubmit.addEventListener('click', () => {
      if (selectedRating === 0) {
        showRatingMessage('Please select a rating!', 'warning');
        return;
      }
      
      const comment = rateText ? rateText.value.trim() : '';
      
      // Save rating to localStorage
      const ratings = JSON.parse(localStorage.getItem('recipeRatings') || '{}');
      ratings[currentRecipe.id] = {
        rating: selectedRating,
        comment: comment,
        date: new Date().toISOString()
      };
      localStorage.setItem('recipeRatings', JSON.stringify(ratings));
      
      showRatingMessage(`✓ Thank you for rating ${currentRecipe.name}!`, 'success');
      
      // Reset form
      setTimeout(() => {
        selectedRating = 0;
        updateStarDisplay(0);
        if (rateText) rateText.value = '';
      }, 2000);
    });
  }
}

function updateStarDisplay(rating, isHover = false) {
  const rateStars = document.querySelectorAll('#rateStars .star');
  rateStars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('active');
      if (isHover) star.style.opacity = '0.7';
      else star.style.opacity = '1';
    } else {
      star.classList.remove('active');
      star.style.opacity = '1';
    }
  });
}

function showRatingMessage(message, type) {
  const rateMsg = document.getElementById('rateMsg');
  if (!rateMsg) return;
  
  rateMsg.textContent = message;
  rateMsg.className = `small mt-2 text-${type}`;
  
  setTimeout(() => {
    rateMsg.textContent = '';
  }, 3000);
}

// ============================================
// CONCISE MODE TOGGLE
// ============================================

function setupConciseMode() {
  const conciseSwitch = document.getElementById('conciseSwitch');
  const stepsContainer = document.querySelector('[data-r-steps]');
  
  if (!conciseSwitch || !stepsContainer) return;
  
  conciseSwitch.addEventListener('change', () => {
    if (conciseSwitch.checked) {
      // Concise mode: show shorter steps
      stepsContainer.classList.add('concise-mode');
      stepsContainer.querySelectorAll('.list-group-item').forEach(item => {
        if (item.textContent.length > 100) {
          item.dataset.fullText = item.textContent;
          item.textContent = item.textContent.substring(0, 100) + '...';
        }
      });
    } else {
      // Full mode: restore full steps
      stepsContainer.classList.remove('concise-mode');
      stepsContainer.querySelectorAll('.list-group-item').forEach(item => {
        if (item.dataset.fullText) {
          item.textContent = item.dataset.fullText;
        }
      });
    }
  });
}

// ============================================
// SHOPPING LIST FUNCTIONS
// ============================================

function addToShoppingList(item) {
  if (!shoppingList.find(i => i.name === item)) {
    shoppingList.push({ name: item, done: false });
    updateShoppingListDisplay();
    saveShoppingList();
  }
}

function removeFromShoppingList(index) {
  shoppingList.splice(index, 1);
  updateShoppingListDisplay();
  saveShoppingList();
}

function toggleShoppingListItem(index) {
  shoppingList[index].done = !shoppingList[index].done;
  updateShoppingListDisplay();
  saveShoppingList();
}

function updateShoppingListDisplay() {
  const listContainer = document.getElementById('listItems');
  const progressBar = document.getElementById('listProgress');
  const counter = document.getElementById('listCounter');
  
  if (!listContainer) return;
  
  if (shoppingList.length === 0) {
    listContainer.innerHTML = '<p class="text-muted text-center py-4">Your shopping list is empty.<br>Add ingredients from recipes!</p>';
    if (progressBar) progressBar.style.width = '0%';
    if (counter) counter.textContent = '0 / 0 items';
    return;
  }
  
  listContainer.innerHTML = shoppingList.map((item, i) => `
    <div class="list-card ${item.done ? 'done' : ''}">
      <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleShoppingListItem(${i})">
      <span>${item.name}</span>
      <div class="list-actions">
        <button class="btn btn-sm btn-outline-danger" onclick="removeFromShoppingList(${i})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
  
  // Update progress
  const doneCount = shoppingList.filter(i => i.done).length;
  const progress = (doneCount / shoppingList.length) * 100;
  
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (counter) counter.textContent = `${doneCount} / ${shoppingList.length} items`;
}

function saveShoppingList() {
  localStorage.setItem('tastyloop_shopping_list', JSON.stringify(shoppingList));
}

function loadShoppingList() {
  const saved = localStorage.getItem('tastyloop_shopping_list');
  if (saved) {
    shoppingList = JSON.parse(saved);
    updateShoppingListDisplay();
  }
}

// Add recipe ingredients to shopping list
function addRecipeToShoppingList() {
  if (!currentRecipe) return;
  
  const scale = currentServings / originalServings;
  currentRecipe.ingredients.forEach(ing => {
    const item = `${scaleQuantity(ing.measure, scale)} ${ing.name}`;
    addToShoppingList(item);
  });
  
  alert(`Added ${currentRecipe.ingredients.length} ingredients to shopping list!`);
}

// ============================================
// UNIT CONVERTER
// ============================================

function convertUnits() {
  const fromValue = parseFloat(document.getElementById('convFrom')?.value);
  const fromUnit = document.getElementById('convFromUnit')?.value;
  const toUnit = document.getElementById('convToUnit')?.value;
  const resultDiv = document.getElementById('convResult');
  
  if (!fromValue || !fromUnit || !toUnit || !resultDiv) return;
  
  // Conversion factors to grams
  const toGrams = {
    'g': 1,
    'kg': 1000,
    'oz': 28.35,
    'lb': 453.59,
    'ml': 1,
    'l': 1000,
    'cup': 240,
    'tbsp': 15,
    'tsp': 5
  };
  
  // Check if converting between weight and volume
  const weightUnits = ['g', 'kg', 'oz', 'lb'];
  const volumeUnits = ['ml', 'l', 'cup', 'tbsp', 'tsp'];
  
  const fromIsWeight = weightUnits.includes(fromUnit);
  const toIsWeight = weightUnits.includes(toUnit);
  
  if (fromIsWeight !== toIsWeight) {
    resultDiv.className = 'alert alert-danger';
    resultDiv.textContent = 'Cannot convert between weight and volume units!';
    resultDiv.classList.remove('d-none');
    return;
  }
  
  // Convert
  const grams = fromValue * toGrams[fromUnit];
  const result = grams / toGrams[toUnit];
  
  resultDiv.className = 'alert alert-success';
  resultDiv.textContent = `${fromValue} ${fromUnit} = ${result.toFixed(2)} ${toUnit}`;
  resultDiv.classList.remove('d-none');
}

// ============================================
// TIMER FUNCTIONS
// ============================================

function startTimer() {
  const minutesInput = document.getElementById('timerMin');
  const secondsInput = document.getElementById('timerSec');
  const nameInput = document.getElementById('timerName');
  
  if (!minutesInput || !secondsInput) return;
  
  const minutes = parseInt(minutesInput.value) || 0;
  const seconds = parseInt(secondsInput.value) || 0;
  const name = nameInput ? nameInput.value.trim() || 'Timer' : 'Timer';
  const totalSeconds = minutes * 60 + seconds;
  
  if (totalSeconds <= 0) {
    alert('Please enter a valid time');
    return;
  }
  
  const timer = {
    id: Date.now(),
    name: name,
    remaining: totalSeconds,
    total: totalSeconds,
    interval: null
  };
  
  timers.push(timer);
  
  timer.interval = setInterval(() => {
    timer.remaining--;
    updateTimersDisplay();
    
    if (timer.remaining <= 0) {
      clearInterval(timer.interval);
      playTimerAlert(timer.name);
      removeTimer(timer.id);
    }
  }, 1000);
  
  updateTimersDisplay();
  
  // Clear inputs
  minutesInput.value = '';
  secondsInput.value = '';
  if (nameInput) nameInput.value = '';
}

function removeTimer(id) {
  const index = timers.findIndex(t => t.id === id);
  if (index !== -1) {
    if (timers[index].interval) clearInterval(timers[index].interval);
    timers.splice(index, 1);
    updateTimersDisplay();
  }
}

function updateTimersDisplay() {
  const container = document.getElementById('timerList');
  if (!container) return;
  
  if (timers.length === 0) {
    container.innerHTML = '<li class="list-group-item text-muted">No active timers</li>';
    return;
  }
  
  container.innerHTML = timers.map(timer => {
    const mins = Math.floor(timer.remaining / 60);
    const secs = timer.remaining % 60;
    const progress = ((timer.total - timer.remaining) / timer.total) * 100;
    
    return `
      <li class="list-group-item">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div>
            <strong>${timer.name}</strong>
            <div class="fs-4 text-success">${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}</div>
          </div>
          <button class="btn btn-sm btn-outline-danger" onclick="removeTimer(${timer.id})">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="progress" style="height:6px;">
          <div class="progress-bar bg-success" style="width:${progress}%"></div>
        </div>
      </li>
    `;
  }).join('');
}

function playTimerAlert(timerName) {
  const alarmBody = document.getElementById('alarmBody');
  if (alarmBody) {
    alarmBody.textContent = `"${timerName}" has finished!`;
  }
  const alarmModal = document.getElementById('alarmModal');
  if (alarmModal) {
    const bsModal = new bootstrap.Modal(alarmModal);
    bsModal.show();
  } else {
    alert(`⏰ Timer "${timerName}" Complete!`);
  }
}

// ============================================
// SUBSTITUTES FUNCTIONS
// ============================================

function searchSubstitutes() {
  const searchInput = document.getElementById('subsSearch');
  
  if (!searchInput) return;
  
  const query = searchInput.value.trim().toLowerCase();
  
  populateSubstitutesList(query);
}

function populateSubstitutesList(filterQuery = '') {
  const listContainer = document.getElementById('subsList');
  
  if (!listContainer) return;
  
  let ingredients = [...new Set(SUBSTITUTES_DATA.map(s => s.original))];
  
  if (filterQuery) {
    ingredients = ingredients.filter(ing => ing.toLowerCase().includes(filterQuery));
  }
  
  if (ingredients.length === 0) {
    listContainer.innerHTML = '<li class="list-group-item text-muted">No ingredients found</li>';
    return;
  }
  
  listContainer.innerHTML = ingredients.map(ing => {
    const subs = SUBSTITUTES_DATA.filter(s => s.original === ing);
    return `
      <li class="list-group-item subs-item" onclick="showSubstituteDetail('${ing.replace(/'/g, "\\'")}')">
        <strong>${ing}</strong>
        <span class="subs-qty">${subs.length} option${subs.length > 1 ? 's' : ''}</span>
      </li>
    `;
  }).join('');
}

function showSubstituteDetail(ingredient) {
  const detailContainer = document.getElementById('subsDetail');
  
  if (!detailContainer) return;
  
  // Update active state
  document.querySelectorAll('.subs-item').forEach(item => item.classList.remove('active'));
  event.target.closest('.subs-item')?.classList.add('active');
  
  const subs = SUBSTITUTES_DATA.filter(s => s.original === ingredient);
  
  if (subs.length === 0) {
    detailContainer.innerHTML = '<p class="text-muted">No substitutes found</p>';
    return;
  }
  
  detailContainer.innerHTML = `
    <div class="subs-original mb-3">
      <small class="text-muted">SUBSTITUTES FOR</small>
      <h6>${ingredient}</h6>
    </div>
    ${subs.map(sub => `
      <div class="border rounded p-3 mb-2 bg-light">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <strong class="text-success">${sub.substitute}</strong>
          <span class="subs-badge">${sub.ratio}</span>
        </div>
        <small class="text-muted">${sub.notes}</small>
      </div>
    `).join('')}
  `;
}

// ============================================
// FAB TOOLBOX
// ============================================

function setupFABToolbox() {
  const fab = document.getElementById('fabToolbox');
  const fabMain = fab?.querySelector('.fab-main');
  const fabItems = fab?.querySelectorAll('.fab-item');
  
  if (!fab || !fabMain) return;
  
  fabMain.addEventListener('click', () => {
    fab.classList.toggle('open');
    const isOpen = fab.classList.contains('open');
    fabMain.setAttribute('aria-expanded', isOpen);
  });
  
  fabItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const modalId = item.dataset.open;
      if (modalId) {
        const modal = document.querySelector(modalId);
        if (modal) {
          const bsModal = new bootstrap.Modal(modal);
          bsModal.show();
        }
      }
      fab.classList.remove('open');
    });
  });
  
  // Close FAB when clicking outside
  document.addEventListener('click', (e) => {
    if (!fab.contains(e.target)) {
      fab.classList.remove('open');
    }
  });
}

// ============================================
// NEWSLETTER SUBSCRIPTION
// ============================================

function setupNewsletterSubscription() {
  const subscribeBtn = document.getElementById('footerSubscribeBtn');
  const emailInput = document.getElementById('footerSubscribeEmail');
  const messageDiv = document.getElementById('footerSubMsg');
  
  if (subscribeBtn && emailInput && messageDiv) {
    subscribeBtn.addEventListener('click', () => {
      const email = emailInput.value.trim();
      
      if (!email) {
        messageDiv.textContent = 'Please enter your email address';
        messageDiv.className = 'small mt-2 text-danger';
        return;
      }
      
      if (!email.includes('@')) {
        messageDiv.textContent = 'Please enter a valid email address';
        messageDiv.className = 'small mt-2 text-danger';
        return;
      }
      
      messageDiv.textContent = '✓ Successfully subscribed!';
      messageDiv.className = 'small mt-2 text-white';
      emailInput.value = '';
      
      setTimeout(() => {
        messageDiv.textContent = '';
      }, 3000);
    });
  }
}

// ============================================
// UNIT CONVERTER (GLOBAL)
// ============================================

const CONVERSION_UNITS = {
  volume: {
    ml: 1,
    l: 1000,
    tsp: 4.92892,
    tbsp: 14.7868,
    cup: 236.588,
    floz: 29.5735,
    pint: 473.176,
    quart: 946.353,
    gallon: 3785.41
  },
  weight: {
    g: 1,
    kg: 1000,
    mg: 0.001,
    oz: 28.3495,
    lb: 453.592
  },
  temp: {
    c: 'celsius',
    f: 'fahrenheit',
    k: 'kelvin'
  }
};

let currentConvCategory = 'volume';

function setupConverter() {
  const categoryButtons = document.querySelectorAll('[data-cat]');
  const fromUnitSelect = document.getElementById('convFromUnit');
  const toUnitSelect = document.getElementById('convToUnit');
  const convertBtn = document.getElementById('btnConvert');
  const categoryInput = document.getElementById('convCategory');
  const fromLabel = document.getElementById('convFromLabel');
  const toLabel = document.getElementById('convToLabel');
  const hintDiv = document.getElementById('convHint');
  
  // Setup category switching
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const category = btn.dataset.cat;
      currentConvCategory = category;
      if (categoryInput) categoryInput.value = category;
      
      // Update labels
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      if (fromLabel) fromLabel.textContent = `FROM (${categoryName})`;
      if (toLabel) toLabel.textContent = `TO (${categoryName})`;
      
      // Update hints
      if (hintDiv) {
        if (category === 'volume') {
          hintDiv.textContent = 'Volume units: ml, l, tsp, tbsp, cup, floz, pint, quart, gallon';
        } else if (category === 'weight') {
          hintDiv.textContent = 'Weight units: g, kg, mg, oz, lb';
        } else {
          hintDiv.textContent = 'Temperature: Celsius (°C), Fahrenheit (°F), Kelvin (K)';
        }
      }
      
      // Populate unit dropdowns
      populateUnitDropdowns(category);
    });
  });
  
  // Populate initial units
  populateUnitDropdowns('volume');
  
  // Setup convert button
  if (convertBtn) {
    convertBtn.addEventListener('click', performConversion);
  }
}

function populateUnitDropdowns(category) {
  const fromUnitSelect = document.getElementById('convFromUnit');
  const toUnitSelect = document.getElementById('convToUnit');
  
  if (!fromUnitSelect || !toUnitSelect) return;
  
  const units = Object.keys(CONVERSION_UNITS[category]);
  
  fromUnitSelect.innerHTML = units.map(unit => 
    `<option value="${unit}">${unit.toUpperCase()}</option>`
  ).join('');
  
  toUnitSelect.innerHTML = units.map(unit => 
    `<option value="${unit}">${unit.toUpperCase()}</option>`
  ).join('');
  
  // Set default selections
  if (units.length >= 2) {
    toUnitSelect.selectedIndex = 1;
  }
}

function performConversion() {
  const fromInput = document.getElementById('convFrom');
  const toInput = document.getElementById('convTo');
  const fromUnitSelect = document.getElementById('convFromUnit');
  const toUnitSelect = document.getElementById('convToUnit');
  const resultDiv = document.getElementById('convResult');
  
  if (!fromInput || !toInput || !fromUnitSelect || !toUnitSelect || !resultDiv) return;
  
  const fromValue = parseFloat(fromInput.value);
  const fromUnit = fromUnitSelect.value;
  const toUnit = toUnitSelect.value;
  
  if (isNaN(fromValue)) {
    showConversionResult('Please enter a valid number', 'danger');
    return;
  }
  
  let result;
  
  if (currentConvCategory === 'temp') {
    result = convertTemperature(fromValue, fromUnit, toUnit);
  } else {
    const baseValue = fromValue * CONVERSION_UNITS[currentConvCategory][fromUnit];
    result = baseValue / CONVERSION_UNITS[currentConvCategory][toUnit];
  }
  
  toInput.value = result.toFixed(3);
  showConversionResult(`${fromValue} ${fromUnit.toUpperCase()} = ${result.toFixed(3)} ${toUnit.toUpperCase()}`, 'success');
}

function convertTemperature(value, from, to) {
  // Convert to Celsius first
  let celsius;
  if (from === 'c') celsius = value;
  else if (from === 'f') celsius = (value - 32) * 5 / 9;
  else if (from === 'k') celsius = value - 273.15;
  
  // Convert from Celsius to target
  if (to === 'c') return celsius;
  else if (to === 'f') return celsius * 9 / 5 + 32;
  else if (to === 'k') return celsius + 273.15;
  
  return value;
}

function showConversionResult(message, type) {
  const resultDiv = document.getElementById('convResult');
  if (!resultDiv) return;
  
  resultDiv.className = `alert alert-${type}`;
  resultDiv.textContent = message;
  resultDiv.classList.remove('d-none');
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Setup FAB Toolbox
  setupFABToolbox();
  
  // Setup Newsletter
  setupNewsletterSubscription();
  
  // Load shopping list from localStorage
  loadShoppingList();
  
  // Setup converter when modal is shown
  const converterModal = document.getElementById('converterModal');
  if (converterModal) {
    converterModal.addEventListener('shown.bs.modal', () => {
      setupConverter();
    });
  }
  
  // Setup timer button
  const timerAddBtn = document.getElementById('btnAddTimer');
  if (timerAddBtn) {
    timerAddBtn.addEventListener('click', startTimer);
  }
  
  // Setup substitutes search
  const subsSearchInput = document.getElementById('subsSearch');
  if (subsSearchInput) {
    subsSearchInput.addEventListener('input', searchSubstitutes);
    // Initialize with full list
    populateSubstitutesList();
  }
  
  // Setup shopping list buttons
  const clearCheckedBtn = document.getElementById('btnClearChecked');
  if (clearCheckedBtn) {
    clearCheckedBtn.addEventListener('click', () => {
      shoppingList = shoppingList.filter(item => !item.done);
      updateShoppingListDisplay();
      saveShoppingList();
    });
  }
  
  const addItemBtn = document.getElementById('btnAddListItem');
  const itemNameInput = document.getElementById('listItemName');
  const itemQtyInput = document.getElementById('listItemQty');
  
  if (addItemBtn && itemNameInput) {
    addItemBtn.addEventListener('click', () => {
      const name = itemNameInput.value.trim();
      const qty = itemQtyInput ? itemQtyInput.value.trim() : '';
      
      if (name) {
        const item = qty ? `${qty} ${name}` : name;
        addToShoppingList(item);
        itemNameInput.value = '';
        if (itemQtyInput) itemQtyInput.value = '';
      }
    });
    
    itemNameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addItemBtn.click();
      }
    });
  }
  
  console.log('TastyLoop initialized!');
  console.log(`Loaded ${RECIPES_DATA.length} recipes`);
});
