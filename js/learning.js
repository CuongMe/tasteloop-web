// ============================================
// Learning.html Specific JavaScript
// ============================================

// Use RECIPES_DATA for learning cards
let learningFiltered = [...RECIPES_DATA];

function initLearningPage() {
  setupLearningControls();
  renderLearningGrid();
}

function setupLearningControls() {
  const searchInput = document.getElementById('learningSearch');
  
  // Category filters
  document.querySelectorAll('#filterCategories button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#filterCategories button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyLearningFilters();
    });
  });
  
  // Difficulty filters - map to preparation difficulty
  document.querySelectorAll('#filterDifficulty button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#filterDifficulty button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyLearningFilters();
    });
  });
  
  // Area filters
  document.querySelectorAll('#filterAreas button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#filterAreas button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyLearningFilters();
    });
  });
  
  // Search
  if (searchInput) {
    searchInput.addEventListener('input', applyLearningFilters);
  }
}

function applyLearningFilters() {
  const categoryBtn = document.querySelector('#filterCategories button.active');
  const difficultyBtn = document.querySelector('#filterDifficulty button.active');
  const areaBtn = document.querySelector('#filterAreas button.active');
  const searchInput = document.getElementById('learningSearch');
  
  const category = categoryBtn?.dataset.cat || 'all';
  const difficulty = difficultyBtn?.dataset.diff || 'all';
  const area = areaBtn?.dataset.area || 'all';
  const search = searchInput?.value.trim().toLowerCase() || '';
  
  learningFiltered = RECIPES_DATA.filter(recipe => {
    const matchCategory = category === 'all' || recipe.category === category;
    // Map difficulty: easy = prepTime < 30, medium = 30-60, hard = > 60
    const totalTime = recipe.prepTime + recipe.cookTime;
    let recipeDifficulty = 'easy';
    if (totalTime > 60) recipeDifficulty = 'hard';
    else if (totalTime > 30) recipeDifficulty = 'medium';
    const matchDifficulty = difficulty === 'all' || recipeDifficulty === difficulty;
    const matchArea = area === 'all' || recipe.area === area;
    const matchSearch = !search || 
      recipe.name.toLowerCase().includes(search) ||
      recipe.area.toLowerCase().includes(search) ||
      recipe.category.toLowerCase().includes(search);
    
    return matchCategory && matchDifficulty && matchArea && matchSearch;
  });
  
  renderLearningGrid();
}

function renderLearningGrid() {
  const grid = document.getElementById('learnGrid');
  const counter = document.getElementById('learningCounter');
  
  if (!grid) return;
  
  if (counter) {
    counter.textContent = `${learningFiltered.length} recipe${learningFiltered.length !== 1 ? 's' : ''}`;
  }
  
  if (learningFiltered.length === 0) {
    grid.innerHTML = '<div class="col-12"><p class="text-center text-muted py-5">No recipes found. Try different filters.</p></div>';
    return;
  }
  
  grid.innerHTML = learningFiltered.map(lesson => createLearningCard(lesson)).join('');
}

function createLearningCard(lesson) {
  const flagPath = getFlagPath(lesson.area);
  const flagImg = flagPath ? `<img src="${flagPath}" alt="${lesson.area}" style="width:20px;height:15px;margin-right:4px;border-radius:2px;">` : '';
  
  return `
    <div class="col-md-6 col-lg-4">
      <div class="card h-100 shadow-sm" style="cursor:pointer;">
        <img src="${lesson.image}" class="card-img-top" alt="${lesson.name || lesson.title}" style="height:200px; object-fit:cover;" onclick="openLearningModal('${lesson.name || lesson.title}')">
        <div class="card-body">
          <div class="d-flex align-items-center gap-2 mb-2">
            ${flagImg}
            <span class="small fw-semibold">${lesson.area}</span>
          </div>
          <h6 class="card-title mb-2">${lesson.name || lesson.title}</h6>
          <span class="badge bg-light text-dark border">${lesson.category}</span>
          <button class="btn btn-outline-success btn-sm mt-2 w-100" onclick="openLearningModal('${lesson.name || lesson.title}')">
            Learn More
          </button>
        </div>
      </div>
    </div>
  `;
}

// Make openLearningModal available globally - now uses recipe name from RECIPES_DATA
window.openLearningModal = function(recipeName) {
  const recipe = RECIPES_DATA.find(r => r.name === recipeName);
  if (!recipe) {
    console.error('Recipe not found:', recipeName);
    return;
  }
  
  const modal = document.getElementById('learningModal');
  if (!modal) {
    console.error('Modal element not found!');
    return;
  }
  
  // Set title
  const titleEl = document.getElementById('learnModalTitle');
  if (titleEl) {
    titleEl.textContent = recipe.name;
  }
  
  // Set flags/badges
  const flagsEl = document.getElementById('learnModalFlags');
  if (flagsEl) {
    const flagPath = getFlagPath(recipe.area);
    const flagImg = flagPath ? `<img src="${flagPath}" alt="${recipe.area}" style="width:20px;height:15px;margin-right:6px;border-radius:2px;">` : '';
    
    // Calculate difficulty based on time
    const totalTime = recipe.prepTime + recipe.cookTime;
    let difficulty = 'Easy';
    if (totalTime > 60) difficulty = 'Hard';
    else if (totalTime > 30) difficulty = 'Medium';
    
    flagsEl.innerHTML = `
      ${flagImg}
      <span class="badge bg-light text-dark border">${recipe.category}</span>
      <span class="ms-2">${recipe.area}</span>
      <span class="difficulty-badge ${difficulty.toLowerCase()} ms-2">${difficulty}</span>
    `;
  }
  
  // Set image
  const imgWrap = document.getElementById('learnModalImageWrap');
  if (imgWrap) {
    imgWrap.innerHTML = `<img src="${recipe.image}" alt="${recipe.name}" class="w-100" style="object-fit:cover; max-height:350px;">`;
  }
  
  // Calculate difficulty
  const totalTime = recipe.prepTime + recipe.cookTime;
  let difficulty = 'Easy';
  if (totalTime > 60) difficulty = 'Hard';
  else if (totalTime > 30) difficulty = 'Medium';
  
  // Populate content sections - with error checking
  const aboutEl = document.getElementById('learnAbout');
  const historyEl = document.getElementById('learnHistory');
  const originEl = document.getElementById('learnOrigin');
  const difficultyEl = document.getElementById('learnDifficulty');
  const techniquesEl = document.getElementById('learnTechniquesRight');
  const funFactEl = document.getElementById('learnFunRight');
  
  // Instructions is an array, join first few steps
  const instructionText = Array.isArray(recipe.instructions) 
    ? recipe.instructions.slice(0, 2).join(' ').substring(0, 200) + '...'
    : (recipe.instructions || 'A delicious dish.').substring(0, 200) + '...';
  
  if (aboutEl) aboutEl.textContent = instructionText;
  if (historyEl) historyEl.textContent = `A beloved dish from ${recipe.area}.`;
  if (originEl) originEl.textContent = `Typically prepared in ${recipe.area} and categorized as ${recipe.category}.`;
  
  if (difficultyEl) {
    difficultyEl.innerHTML = `
      <strong>Difficulty:</strong> ${difficulty}<br>
      <strong>Prep Time:</strong> ${recipe.prepTime} min<br>
      <strong>Cook Time:</strong> ${recipe.cookTime} min<br>
      <strong>Servings:</strong> ${recipe.servings || 4}
    `;
  }
  
  // Techniques from tags
  if (techniquesEl) {
    const techniques = recipe.tags?.slice(0, 5) || ['Prep', 'Cook', 'Season'];
    techniquesEl.innerHTML = techniques.map(t => 
      `<span class="badge bg-light text-dark border me-1 mb-1">${t}</span>`
    ).join('');
  }
  
  // Fun fact
  if (funFactEl) {
    funFactEl.textContent = `Fun fact: This dish is categorized as ${recipe.category}.`;
  }
  
  // Setup quiz
  setupLearningQuiz(recipe);
  
  // Show modal
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
}

function setupLearningQuiz(recipe) {
  const startQuizBtn = document.getElementById('btnStartQuiz');
  const viewRecipeBtn = document.getElementById('btnViewRecipe');
  
  if (!startQuizBtn) return;
  
  // Always enable quiz (we can generate basic questions)
  startQuizBtn.disabled = false;
  startQuizBtn.textContent = 'Start Quiz';
  
  // Start quiz handler
  startQuizBtn.onclick = function() {
    startQuiz(recipe);
  };
  
  // View recipe handler - opens the recipe modal
  if (viewRecipeBtn) {
    viewRecipeBtn.onclick = function() {
      // Close learning modal
      const learningModal = document.getElementById('learningModal');
      if (learningModal) {
        const bsModal = bootstrap.Modal.getInstance(learningModal);
        if (bsModal) bsModal.hide();
      }
      
      // Open recipe modal with recipe ID (after a short delay to let modal close)
      setTimeout(() => {
        if (typeof openRecipeModal === 'function') {
          openRecipeModal(recipe.id);
        }
      }, 300);
    };
  }
}

// Quiz state
let currentQuiz = {
  questions: [],
  currentQuestion: 0,
  score: 0,
  recipe: null
};

function startQuiz(recipe) {
  // Generate 3 questions about the recipe
  const allQuestions = [
    {
      q: `What category does ${recipe.name} belong to?`,
      options: [recipe.category, 'Dessert', 'Soup', 'Beverage'],
      correct: 0,
      explanation: `${recipe.name} is categorized as ${recipe.category}.`
    },
    {
      q: `Which country is ${recipe.name} from?`,
      options: [recipe.area, 'Italy', 'China', 'Mexico'],
      correct: 0,
      explanation: `${recipe.name} originates from ${recipe.area}.`
    },
    {
      q: `What is the main ingredient in ${recipe.name}?`,
      options: [recipe.category, 'Rice', 'Pasta', 'Potatoes'],
      correct: 0,
      explanation: `This dish features ${recipe.category} as the main component.`
    }
  ];
  
  // Shuffle options for each question
  allQuestions.forEach(q => {
    const correctAnswer = q.options[q.correct];
    q.options = q.options.sort(() => Math.random() - 0.5);
    q.correct = q.options.indexOf(correctAnswer);
  });
  
  // Initialize quiz state
  currentQuiz = {
    questions: allQuestions,
    currentQuestion: 0,
    score: 0,
    recipe: recipe
  };
  
  // Open quiz modal
  const quizModal = document.getElementById('quizModal');
  if (!quizModal) return;
  
  // Show quiz modal
  const bsModal = new bootstrap.Modal(quizModal);
  bsModal.show();
  
  // Load first question
  loadQuizQuestion();
}

function loadQuizQuestion() {
  const q = currentQuiz.questions[currentQuiz.currentQuestion];
  const totalQuestions = currentQuiz.questions.length;
  const questionNum = currentQuiz.currentQuestion + 1;
  
  // Update meta info
  document.getElementById('quizMeta').textContent = `Question ${questionNum} of ${totalQuestions}`;
  document.getElementById('quizScore').textContent = `Score: ${currentQuiz.score}`;
  document.getElementById('quizProgress').style.width = `${(currentQuiz.currentQuestion / totalQuestions) * 100}%`;
  
  // Update question
  document.getElementById('quizQuestion').textContent = q.q;
  
  // Update choices
  const choicesContainer = document.getElementById('quizChoices');
  choicesContainer.innerHTML = q.options.map((option, index) => `
    <button class="btn btn-outline-secondary text-start quiz-option" data-index="${index}">
      ${option}
    </button>
  `).join('');
  
  // Add click handlers
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => handleQuizAnswer(parseInt(btn.dataset.index)));
  });
  
  // Hide feedback and next button
  document.getElementById('quizFeedback').classList.add('d-none');
  document.getElementById('quizNextBtn').classList.add('d-none');
}

function handleQuizAnswer(selectedIndex) {
  const q = currentQuiz.questions[currentQuiz.currentQuestion];
  const isCorrect = selectedIndex === q.correct;
  const buttons = document.querySelectorAll('.quiz-option');
  const feedbackEl = document.getElementById('quizFeedback');
  const nextBtn = document.getElementById('quizNextBtn');
  
  // Disable all buttons
  buttons.forEach(btn => btn.disabled = true);
  
  // Highlight correct and incorrect answers
  buttons.forEach((btn, index) => {
    if (index === q.correct) {
      btn.classList.remove('btn-outline-secondary');
      btn.classList.add('btn-success');
    } else if (index === selectedIndex && !isCorrect) {
      btn.classList.remove('btn-outline-secondary');
      btn.classList.add('btn-danger');
    }
  });
  
  // Update score
  if (isCorrect) {
    currentQuiz.score += 1;
    document.getElementById('quizScore').textContent = `Score: ${currentQuiz.score}`;
  }
  
  // Show feedback
  feedbackEl.className = isCorrect ? 'alert alert-success mt-3' : 'alert alert-warning mt-3';
  feedbackEl.innerHTML = isCorrect 
    ? `<strong>✓ Correct!</strong> ${q.explanation}`
    : `<strong>✗ Incorrect.</strong> ${q.explanation}`;
  feedbackEl.classList.remove('d-none');
  
  // Show next button or finish
  if (currentQuiz.currentQuestion < currentQuiz.questions.length - 1) {
    nextBtn.textContent = 'Next Question';
    nextBtn.classList.remove('d-none');
    nextBtn.onclick = () => {
      currentQuiz.currentQuestion++;
      loadQuizQuestion();
    };
  } else {
    // Quiz finished
    nextBtn.textContent = 'Finish Quiz';
    nextBtn.classList.remove('d-none');
    nextBtn.onclick = finishQuiz;
  }
  
  // Update progress
  document.getElementById('quizProgress').style.width = `${((currentQuiz.currentQuestion + 1) / currentQuiz.questions.length) * 100}%`;
}

function finishQuiz() {
  const score = currentQuiz.score;
  const total = currentQuiz.questions.length;
  const percentage = Math.round((score / total) * 100);
  
  // Show final score
  const feedbackEl = document.getElementById('quizFeedback');
  let message = '';
  let alertClass = '';
  
  if (percentage >= 80) {
    message = `🎉 Excellent! You scored ${score}/${total} (${percentage}%)`;
    alertClass = 'alert-success';
  } else if (percentage >= 60) {
    message = `👍 Good job! You scored ${score}/${total} (${percentage}%)`;
    alertClass = 'alert-info';
  } else {
    message = `📚 Keep learning! You scored ${score}/${total} (${percentage}%)`;
    alertClass = 'alert-warning';
  }
  
  feedbackEl.className = `alert ${alertClass} mt-3`;
  feedbackEl.innerHTML = `<strong>${message}</strong><br>Close this modal to continue exploring.`;
  feedbackEl.classList.remove('d-none');
  
  // Hide next button
  document.getElementById('quizNextBtn').classList.add('d-none');
  
  // Hide question and choices
  document.getElementById('quizQuestion').textContent = 'Quiz Complete!';
  document.getElementById('quizChoices').innerHTML = '';
}

// Initialize Learning Page
if (document.getElementById('learnGrid')) {
  document.addEventListener('DOMContentLoaded', () => {
    initLearningPage();
  });
}

