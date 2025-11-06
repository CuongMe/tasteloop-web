/* ----------------------------------------------------------
   TasteLoop — script.js
   Updates (2025-11-06):
   - "More categories": expanded grid sits right under the main grid.
     The toggle button is automatically moved under the expanded list.
   - Converter: category-aware labels/placeholders + unit hints + DROPDOWNS.
   - Flags: add Norwegian + Danish. Image fallback on error.
   - Recipes page: top-row window (4) with arrows, remainder grid (8), counter.
   - Recipes page (new): search by name, filter by category/area, scrollable board.
   - Minor: better a11y, lazy images.
---------------------------------------------------------- */

(() => {
  const API = {
    base: "https://www.themealdb.com/api/json/v1/1/",
    categories: "categories.php",
    filterByCategory: (c) => `filter.php?c=${encodeURIComponent(c)}`,
    filterByArea: (a) => `filter.php?a=${encodeURIComponent(a)}`,         // ← added
    lookupById: (id) => `lookup.php?i=${encodeURIComponent(id)}`,
    searchByName: (q) => `search.php?s=${encodeURIComponent(q)}`,
    listAreas: "list.php?a=list",                                         // ← added
    random: "random.php",
  };

  // FIX: removed duplicate key, added 'no' and 'dk'
  const AREA_TO_ISO = {
    American:"us", British:"gb", Canadian:"ca", Chinese:"cn", Croatian:"hr",
    Dutch:"nl", Egyptian:"eg", French:"fr", Greek:"gr", Indian:"in",
    Irish:"ie", Italian:"it", Jamaican:"jm", Japanese:"jp", Kenyan:"ke",
    Malaysian:"my", Mexican:"mx", Moroccan:"ma", Polish:"pl", Portuguese:"pt",
    Russian:"ru", Spanish:"es", Thai:"th", Turkish:"tr", Vietnamese:"vn",
    Australian:"au", Norwegian:"no", Danish:"dk", Unknown:null
  };

  const qs  = (s, root=document) => root.querySelector(s);
  const qsa = (s, root=document) => [...root.querySelectorAll(s)];

  const state = {
    // Home
    heroMeals: [],
    categories: [],
    catWindowStart: 0,
    catWindowSize: 4,
    catDataMap: new Map(), // name -> { meals:[detail], idx }
    moreOpen: false,

    // Recipes page
    recCats: [],
    recWindowStart: 0,
    recWindowSize: 4,
  };

  // ----------- Common elements for Home (if present) -----------
  const el = {
    heroInner: qs("#heroCarousel .carousel-inner"),
    heroInd: qs("#heroCarousel .carousel-indicators"),
    btnSurprise: qs("#btnSurprise"),

    catCounter: qs("#catCounter"),
    catSlider: qs("#categorySlider"),
    catPrev: qs("#catPrev"),
    catNext: qs("#catNext"),
    moreBtn: qs("#btnMoreCats"),
    moreWrap: qs("#moreCategories"),

    homeSearch: qs("#homeSearch"),
    btnHomeSearch: qs("#btnHomeSearch"),
    btnClearSearch: qs("#btnClearSearch"),
    searchWrap: qs("#searchResultsWrap"),
    searchGrid: qs("#searchResults"),

    recipeModal: qs("#recipeModal"),
    rTitle: qs("[data-r-title]"),
    rArea: qs("[data-r-area]"),
    rIngredients: qs("[data-r-ingredients]"),
    rStepsList: qs("[data-r-steps]"),
    stepText: qs("[data-step-text]"),
    stepPrev: qs("[data-step-prev]"),
    stepNext: qs("[data-step-next]"),
    stepRestart: qs("[data-step-restart]"),
    stepCur: qs("[data-step-current]"),
    stepTot: qs("[data-step-total]"),
    stepProgress: qs("[data-step-progress]"),
    conciseSwitch: qs("#conciseSwitch"),
    servingsDec: qs("[data-servings-dec]"),
    servingsInc: qs("[data-servings-inc]"),
    servingsVal: qs("[data-servings-value]"),
    servingsReset: qs("[data-servings-reset]"),
    servingsNote: qs("[data-servings-note]"),

    imgCarouselInner: qs("#recipeImgCarousel .carousel-inner"),
    imgCarouselRoot : qs("#recipeImgCarousel"),

    // rating
    rateStars: qs("#rateStars"),
    rateText: qs("#rateText"),
    rateSubmit: qs("#rateSubmit"),
    rateMsg: qs("#rateMsg"),
  };

  // ----------- Elements for Recipes page (if present) ----------
  const recEl = {
    topRow: qs("#recipesTopRow"),
    grid: qs("#recipesGrid"),
    counter: qs("#recipesCounter"),
    prev: qs("#recPrev"),
    next: qs("#recNext"),
    shuffle: qs("#recShuffle"),
    search: qs("#recSearch"),                 // ← added
    searchBtn: qs("#recBtnSearch"),           // ← added
    filterCategory: qs("#recFilterCategory"), // ← added
    filterArea: qs("#recFilterArea"),         // ← added
    clearFilters: qs("#recClearFilters"),     // ← added
    board: qs("#recipesBoard"),               // ← added (scroll container)
  };

  /* -------------------------- Utilities -------------------------- */
  const flagImg = (area) => {
    const code = AREA_TO_ISO[area] || null;
    if (!code)
      return `<span class="flag-pill"><img src="https://flagcdn.com/24x18/zz.png" onerror="this.style.opacity=0" alt=""><span>${area||'Unknown'}</span></span>`;
    return `<span class="flag-pill"><img src="https://flagcdn.com/24x18/${code}.png" alt=""><span>${area}</span></span>`;
  };

  const fmtQty = (n) => (Math.round(n*100)/100).toString();

  const getJSON = async (path) => {
    const r = await fetch(API.base + path);
    return r.json();
  };

  /* ----------------------- Hero Carousel (Home) ------------------------ */
  async function buildHero() {
    if (!el.heroInner || !el.heroInd) return; // guard for recipes page
    const uniq = new Map();
    let tries = 0;
    while (uniq.size < 6 && tries < 20) {
      const j = await getJSON(API.random);
      const m = j.meals?.[0];
      if (m && !uniq.has(m.idMeal)) uniq.set(m.idMeal, m);
      tries++;
    }
    const slides = [...uniq.values()];
    state.heroMeals = slides;

    el.heroInner.innerHTML = "";
    el.heroInd.innerHTML = "";
    slides.forEach((m, i) => {
      el.heroInd.insertAdjacentHTML(
        "beforeend",
        `<button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="${i}" class="${i===0?'active':''}" aria-label="Slide ${i+1}"></button>`
      );
      el.heroInner.insertAdjacentHTML(
        "beforeend",
        `<div class="carousel-item ${i===0?'active':''}">
          <img class="d-block w-100 h-100 object-fit-cover" src="${m.strMealThumb}" alt="${m.strMeal}">
        </div>`
      );
    });
  }

  /* ------------------ Categories (Home: window + more) ----------------- */
  async function loadCategoriesHome() {
    if (!el.catSlider) return;
    const j = await getJSON(API.categories);
    state.categories = (j.categories || []).map(c => c.strCategory);
    renderCategoryWindow();
    updateCatCounter();

    qs("#btnShuffle")?.removeAttribute("disabled");
    await Promise.all(getWindowCats().map(name => ensureCategoryData(name)));
  }

  function getWindowCats() {
    const {catWindowStart, catWindowSize, categories} = state;
    const out = [];
    if (!categories.length) return out;
    for (let i=0; i<Math.min(catWindowSize, categories.length); i++) {
      const idx = (catWindowStart + i) % categories.length;
      out.push(categories[idx]);
    }
    return out;
  }

  function updateCatCounter() {
    if (!el.catCounter) return;
    el.catCounter.textContent = `${state.categories.length ? state.catWindowStart+1 : 0}–${Math.min(state.catWindowStart+state.catWindowSize, state.categories.length)} of ${state.categories.length} categories`;
  }

  function renderCategoryWindow() {
    if (!el.catSlider) return;
    const cats = getWindowCats();
    el.catSlider.innerHTML = "";
    cats.forEach(name => el.catSlider.appendChild(buildCategoryCard(name)));
  }

  async function ensureCategoryData(name) {
    if (state.catDataMap.has(name)) return state.catDataMap.get(name);
    const j = await getJSON(API.filterByCategory(name));
    const pool = (j.meals || []).slice(0, 9);
    const details = await Promise.all(pool.map(async (m) => {
      const dj = await getJSON(API.lookupById(m.idMeal));
      return dj.meals?.[0];
    }));
    const obj = { meals: details.filter(Boolean), idx: 0 };
    state.catDataMap.set(name, obj);
    return obj;
  }

  function buildCategoryCard(name) {
    const wrap = document.createElement("div");
    wrap.className = "col-12 col-sm-6 col-lg-3";
    wrap.innerHTML = `
      <div class="recipe-card h-100">
        <div class="img-wrap">
          <img alt="" loading="lazy">
          <button class="nav-dot prev" data-card-prev aria-label="Previous">‹</button>
          <button class="nav-dot next" data-card-next aria-label="Next">›</button>
        </div>
        <div class="card-body small">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <div data-area></div>
            <div class="meta"><span data-cat-name></span></div>
          </div>
          <h6 class="card-title mb-0" data-title></h6>
        </div>
      </div>
    `;

    (async () => {
      const data = await ensureCategoryData(name);
      showMealOnCard(wrap, name, data.meals[data.idx] || null);

      wrap.querySelector("[data-card-prev]").addEventListener("click", (e) => {
        e.stopPropagation(); e.preventDefault();
        data.idx = (data.idx - 1 + data.meals.length) % data.meals.length;
        showMealOnCard(wrap, name, data.meals[data.idx]);
      });

      wrap.querySelector("[data-card-next]").addEventListener("click", (e) => {
        e.stopPropagation(); e.preventDefault();
        data.idx = (data.idx + 1) % data.meals.length;
        showMealOnCard(wrap, name, data.meals[data.idx]);
      });

      wrap.addEventListener("click", () => openRecipeModal(data.meals[data.idx]));
    })();

    return wrap;
  }

  function showMealOnCard(card, catName, m) {
    const img = card.querySelector("img");
    const areaBox = card.querySelector("[data-area]");
    const catBox = card.querySelector("[data-cat-name]");
    const title = card.querySelector("[data-title]");

    if (!m) {
      img.removeAttribute("src");
      areaBox.innerHTML = flagImg("Unknown");
      catBox.textContent = catName;
      title.textContent = "No recipe";
      return;
    }
    // robust image load + fallback
    img.onerror = () => {
      img.onerror = null;
      img.src = "https://via.placeholder.com/600x400?text=Recipe";
    };
    img.src = m.strMealThumb;
    areaBox.innerHTML = flagImg(m.strArea || "Unknown");
    catBox.textContent = m.strCategory || catName;
    title.textContent = m.strMeal || "Recipe";
  }

  el.catPrev?.addEventListener("click", async () => {
    state.catWindowStart = (state.catWindowStart - state.catWindowSize + state.categories.length) % state.categories.length;
    renderCategoryWindow(); updateCatCounter();
    await Promise.all(getWindowCats().map(name => ensureCategoryData(name)));
    if (state.moreOpen) await renderMoreCategories();
  });

  el.catNext?.addEventListener("click", async () => {
    state.catWindowStart = (state.catWindowStart + state.catWindowSize) % state.categories.length;
    renderCategoryWindow(); updateCatCounter();
    await Promise.all(getWindowCats().map(name => ensureCategoryData(name)));
    if (state.moreOpen) await renderMoreCategories();
  });

  // Helper to move the "More categories" button row
  function moveMoreButtonBelow(isOpen){
    const btnRow = el.moreBtn?.closest(".text-center");
    if (!btnRow || !el.moreWrap) return;
    if (isOpen){
      // place the button directly UNDER the expanded grid
      el.moreWrap.insertAdjacentElement("afterend", btnRow);
    } else {
      // restore button ABOVE (right before the expanded grid)
      el.moreWrap.insertAdjacentElement("beforebegin", btnRow);
    }
  }

  // More categories (no duplicates vs first 4) — smooth expand and keep button under list
  el.moreBtn?.addEventListener("click", async () => {
    if (!state.moreOpen) {
      el.moreBtn.disabled = true;
      el.moreBtn.textContent = "Loading…";

      const windowCats = new Set(getWindowCats());
      const remainder = state.categories.filter(c => !windowCats.has(c));

      await Promise.all(remainder.map(name => ensureCategoryData(name)));

      const frag = document.createDocumentFragment();
      remainder.forEach((name) => frag.appendChild(buildCategoryCard(name)));
      el.moreWrap.innerHTML = "";
      el.moreWrap.appendChild(frag);
      el.moreWrap.classList.add("open");

      moveMoreButtonBelow(true);
      state.moreOpen = true;
      el.moreBtn.textContent = "Show less";
      el.moreBtn.disabled = false;
    } else {
      el.moreWrap.classList.remove("open");
      el.moreWrap.innerHTML = "";
      state.moreOpen = false;
      moveMoreButtonBelow(false);
      el.moreBtn.textContent = "More categories";
    }
  });

  async function renderMoreCategories() {
    if (!state.moreOpen) return;
    const windowCats = new Set(getWindowCats());
    const remainder = state.categories.filter(c => !windowCats.has(c));
    await Promise.all(remainder.map(name => ensureCategoryData(name)));
    const frag = document.createDocumentFragment();
    remainder.forEach((name) => frag.appendChild(buildCategoryCard(name)));
    el.moreWrap.innerHTML = "";
    el.moreWrap.appendChild(frag);
    el.moreWrap.classList.add("open");
    moveMoreButtonBelow(true);
  }

  /* --------------------------- Search (Home) --------------------------- */
  el.btnHomeSearch?.addEventListener("click", () => doSearch());
  el.homeSearch?.addEventListener("keydown", (e) => { if (e.key === "Enter") doSearch(); });
  el.btnClearSearch?.addEventListener("click", () => {
    if (!el.homeSearch || !el.searchWrap || !el.btnClearSearch) return;
    el.homeSearch.value = "";
    el.searchWrap.classList.add("d-none");
    el.btnClearSearch.hidden = true;
  });

  async function doSearch() {
    const q = el.homeSearch?.value.trim();
    if (!q) return;
    const j = await getJSON(API.searchByName(q));
    const list = (j.meals || []);
    el.searchGrid.innerHTML = "";
    if (!list.length) {
      el.searchGrid.innerHTML = `<div class="col-12 text-muted">No results</div>`;
    } else {
      list.slice(0, 20).forEach(m => {
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-lg-3";
        col.innerHTML = `
          <div class="recipe-card h-100">
            <div class="img-wrap">
              <img class="object-fit-cover" style="height:220px" src="${m.strMealThumb}" alt="${m.strMeal}" loading="lazy" onerror="this.onerror=null;this.src='https://via.placeholder.com/600x400?text=Recipe'">
            </div>
            <div class="card-body small">
              <div class="mb-1">${flagImg(m.strArea || "Unknown")}</div>
              <h6 class="card-title mb-0">${m.strMeal}</h6>
            </div>
          </div>
        `;
        col.addEventListener("click", async () => {
          const dj = await getJSON(API.lookupById(m.idMeal));
          openRecipeModal(dj.meals?.[0] || m);
        });
        el.searchGrid.appendChild(col);
      });
    }
    el.searchWrap.classList.remove("d-none");
    el.btnClearSearch.hidden = false;
  }

  /* ------------------------ Recipe Modal (Shared) ------------------------ */
  const mainModal = el.recipeModal ? new bootstrap.Modal(el.recipeModal) : null;

  function splitSteps(str) {
    return (str || "")
      .split(/\r?\n+/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  let modalCtx = {
    baseServings: 2,
    curServings: 2,
    steps: [],
    stepIdx: 0,
    concise: false
  };

  function buildIngredientList(m) {
    const items = [];
    for (let i=1; i<=20; i++) {
      const ing = m[`strIngredient${i}`]?.trim();
      const mea = m[`strMeasure${i}`]?.trim();
      if (ing) items.push({ing,mea});
    }
    return items;
  }

  function setServings(n) {
    modalCtx.curServings = Math.max(1, n);
    el.servingsVal.textContent = modalCtx.curServings;
    const scale = modalCtx.curServings / modalCtx.baseServings;
    el.servingsNote.textContent = `Scaled x${(Math.round(scale*100)/100).toFixed(2)} from base ${modalCtx.baseServings} servings`;

    qsa("[data-r-ingredients] li .qty").forEach(span => {
      const base = parseFloat(span.getAttribute("data-base") || "0");
      if (!isNaN(base)) span.textContent = fmtQty(base * scale);
    });
  }

  function renderSteps() {
    el.stepTot.textContent = modalCtx.steps.length.toString();
    el.stepCur.textContent = (modalCtx.stepIdx+1).toString();
    const pct = ((modalCtx.stepIdx+1)/Math.max(1, modalCtx.steps.length))*100;
    el.stepProgress.style.width = `${pct}%`;
    el.stepText.textContent = modalCtx.steps[modalCtx.stepIdx] || "";
  }

  function openRecipeModal(m) {
    if (!mainModal) return;
    if (el.conciseSwitch) el.conciseSwitch.checked = false;

    el.rTitle.textContent = m.strMeal || "Recipe";
    el.rArea.innerHTML = flagImg(m.strArea || "Unknown");

    el.imgCarouselInner.innerHTML = "";
    const imgs = new Set();
    if (m.strMealThumb) imgs.add(m.strMealThumb);

    const ings = buildIngredientList(m).slice(0, 6).map(i => i.ing);
    ings.forEach(ing => imgs.add(`https://www.themealdb.com/images/ingredients/${encodeURIComponent(ing)}.png`));

    [...imgs].forEach((src, i) => {
      el.imgCarouselInner.insertAdjacentHTML(
        "beforeend",
        `<div class="carousel-item ${i===0?'active':''}">
           <img class="d-block w-100 h-100 object-fit-cover" src="${src}" alt="">
         </div>`
      );
    });

    const rc = new bootstrap.Carousel(el.imgCarouselRoot, { interval:false, ride:false });
    rc.to(0);

    el.rIngredients.innerHTML = "";
    const ingList = buildIngredientList(m);
    modalCtx.baseServings = 2; modalCtx.curServings = 2;
    ingList.forEach(({ing, mea}) => {
      const num = parseFloat((mea||"").match(/[\d.]+/)?.[0] || "0");
      el.rIngredients.insertAdjacentHTML(
        "beforeend",
        `<li class="col-12 col-sm-6 mb-1">
          <span class="ingredient-qty qty" data-base="${isNaN(num)?'':num}">${isNaN(num)?(mea||''):fmtQty(num)}</span>
          ${isNaN(num)?'':' '}
          <span class="text-muted">${isNaN(num)?'':(mea||'').replace(/^[\d.\s/]+/,'')}</span>
          — ${ing}
        </li>`
      );
    });
    setServings(modalCtx.curServings);

    const stepsFull = splitSteps(m.strInstructions);
    modalCtx.steps = stepsFull.length ? stepsFull : ["No instructions available."];
    modalCtx.stepIdx = 0;
    renderSteps();

    el.stepPrev.onclick = () => { if (modalCtx.stepIdx>0) { modalCtx.stepIdx--; renderSteps(); } };
    el.stepNext.onclick = () => { if (modalCtx.stepIdx < modalCtx.steps.length-1) { modalCtx.stepIdx++; renderSteps(); } };
    el.stepRestart.onclick = () => { modalCtx.stepIdx = 0; renderSteps(); };

    el.servingsDec.onclick = () => setServings(modalCtx.curServings - 1);
    el.servingsInc.onclick = () => setServings(modalCtx.curServings + 1);
    el.servingsReset.onclick = () => setServings(modalCtx.baseServings);

    el.conciseSwitch.onchange = (e) => {
      const base = stepsFull;
      if (e.target.checked) modalCtx.steps = base.map(s => (s.split(/[.!?]/)[0]||s).trim()+"." );
      else modalCtx.steps = base;
      modalCtx.stepIdx = 0; renderSteps(); renderAllSteps();
    };

    function renderAllSteps() {
      el.rStepsList.innerHTML = "";
      modalCtx.steps.forEach((s) => {
        el.rStepsList.insertAdjacentHTML("beforeend", `<li class="list-group-item">${s}</li>`);
      });
    }
    renderAllSteps();

    // rating
    let chosen = 0;
    const paint = (n) => qsa(".rating-stars .star").forEach((b, i) => { b.style.color = i < n ? "#0f7335" : "#b8c3bb"; });
    qsa(".rating-stars .star").forEach((b) => { b.onclick = () => { chosen = +b.dataset.val; paint(chosen); }; });
    el.rateSubmit.onclick = () => {
      const txt = el.rateText.value.trim();
      if (!chosen) { el.rateMsg.textContent = "Please choose a star rating."; return; }
      el.rateMsg.textContent = "Thanks! Your review was saved locally.";
      try { localStorage.setItem(`rating:${m.idMeal}`, JSON.stringify({stars:chosen, text:txt, at:Date.now()})); } catch {}
    };

    mainModal.show();
  }

  /* ========= FAB (collapsible) ========= */
  document.addEventListener('DOMContentLoaded', () => {
    const fab = document.getElementById('fabToolbox');
    if (fab) {
      const main = fab.querySelector('.fab-main');
      main.addEventListener('click', () => {
        fab.classList.toggle('open');
        main.setAttribute('aria-expanded', fab.classList.contains('open'));
      });
      document.addEventListener('click', (e) => { if (!fab.contains(e.target)) fab.classList.remove('open'); });
      fab.querySelectorAll('[data-open]').forEach(btn => {
        btn.addEventListener('click', () => {
          const sel = btn.getAttribute('data-open');
          const target = document.querySelector(sel);
          if (target) new bootstrap.Modal(target).show();
          fab.classList.remove('open');
        });
      });
    }

    initConverter();
    initSubstitutes();
    initShoppingList();
    initTimers();
  });

  /* ========= Converter ========= */
  function initConverter(){
    const from = document.getElementById('convFrom');
    const to = document.getElementById('convTo');
    const cat = document.getElementById('convCategory');
    const btn = document.getElementById('btnConvert');
    const out = document.getElementById('convResult');
    const fromLabel = document.getElementById('convFromLabel');
    const toLabel = document.getElementById('convToLabel');
    const hint = document.getElementById('convHint');

    // NEW: dropdowns (optional in HTML)
    const selFrom = document.getElementById('convFromUnit');
    const selTo   = document.getElementById('convToUnit');

    if (!from || !to || !btn) return;

    // Optional pill selector (if present in your HTML)
    qsa('#converterModal .wf-pill').forEach(p=>{
      p.addEventListener('click',()=>{
        qsa('#converterModal .wf-pill').forEach(x=>x.classList.remove('active'));
        p.classList.add('active');
        const v = p.dataset.cat;
        if (cat) cat.value = v;
        updateCategoryUI(v);
        out.classList.add('d-none');
      });
    });

    const ALIASES = {
      milliliter:'ml', milliliters:'ml', ml:'ml',
      liter:'l', litre:'l', liters:'l', litres:'l', l:'l',
      teaspoon:'tsp', teaspoons:'tsp', tsp:'tsp',
      tablespoon:'tbsp', tablespoons:'tbsp', tbsp:'tbsp',
      cup:'cup', cups:'cup', 'fl oz':'floz', floz:'floz', 'fluid ounce':'floz',
      pint:'pint', pints:'pint', quart:'quart', quarts:'quart', gallon:'gallon', gallons:'gallon',
      gram:'g', grams:'g', g:'g', kilogram:'kg', kilograms:'kg', kg:'kg',
      milligram:'mg', milligrams:'mg', mg:'mg',
      ounce:'oz', ounces:'oz', oz:'oz', pound:'lb', pounds:'lb', lb:'lb', lbs:'lb',
      c:'cup', t:'tsp', T:'tbsp'
    };

    const VOLUME = { ml:1, l:1000, tsp:4.92892, tbsp:14.7868, cup:240, floz:29.5735, pint:473.176, quart:946.353, gallon:3785.41 };
    const WEIGHT = { mg:0.001, g:1, kg:1000, oz:28.3495, lb:453.592 }; // normalized to include mg
    const TEMP = ['c','f','k'];
    const VOLUME_UNITS = ['ml','l','tsp','tbsp','cup','floz','pint','quart','gallon'];
    const WEIGHT_UNITS = ['mg','g','kg','oz','lb'];
    const TEMP_UNITS   = ['c','f','k'];

    const normUnit = (u)=>{ u=(u||'').trim().toLowerCase(); return ALIASES[u] || u; };

    function parseFromFree(str){
      if(!str) return null;
      const parts = str.trim().toLowerCase().split(/\s+/);
      const val = parseFloat(parts[0]);
      const unit = normUnit(parts.slice(1).join(' '));
      if (Number.isFinite(val) && unit) return {val, unit};
      return null;
    }
    function convertVolume(v,a,b){ return v * (VOLUME[a] / VOLUME[b]); }
    function convertWeight(v,a,b){ return v * (WEIGHT[a] / WEIGHT[b]); }
    function convertTemp(v,a,b){
      const f = a[0], t = b[0]; let c;
      if (f==='c') c=v; else if (f==='f') c=(v-32)*5/9; else if (f==='k') c=v-273.15;
      if (t==='c') return c; if (t==='f') return c*9/5+32; if (t==='k') return c+273.15;
    }
    function roundSmart(n){ if (!Number.isFinite(n)) return n; if (Math.abs(n)>=100) return n.toFixed(0); if (Math.abs(n)>=10) return n.toFixed(1); return n.toFixed(2); }
    function bad(msg){ out.textContent = msg; out.classList.remove('d-none','alert-success'); out.classList.add('alert-danger'); }

    function fillSelect(sel, units){
      if (!sel) return;
      sel.innerHTML = units.map(u=>`<option value="${u}">${u.toUpperCase()}</option>`).join('');
    }

    function updateCategoryUI(kind){
      const label = kind==='temp'?'Temperature':kind[0].toUpperCase()+kind.slice(1);
      if (fromLabel) fromLabel.textContent = `FROM (${label})`;
      if (toLabel)   toLabel.textContent   = `TO (${label})`;

      if (kind==='weight'){
        from.placeholder = "e.g., 200";
        to.placeholder = "e.g., 7";
        if (hint) hint.textContent = "Weight units: mg, g, kg, oz, lb";
        fillSelect(selFrom, WEIGHT_UNITS);
        fillSelect(selTo, WEIGHT_UNITS);
      } else if (kind==='temp'){
        from.placeholder = "e.g., 180";
        to.placeholder = "e.g., 356";
        if (hint) hint.textContent = "Temperature units: C, F, K";
        fillSelect(selFrom, TEMP_UNITS);
        fillSelect(selTo, TEMP_UNITS);
      } else {
        from.placeholder = "e.g., 1.5";
        to.placeholder = "e.g., 360";
        if (hint) hint.textContent = "Volume units: ml, l, tsp, tbsp, cup, floz, pint, quart, gallon";
        fillSelect(selFrom, VOLUME_UNITS);
        fillSelect(selTo, VOLUME_UNITS);
      }
    }
    // init with current
    updateCategoryUI(cat ? cat.value : 'volume');

    btn.addEventListener('click', () => {
      out.classList.add('d-none');

      const category = cat ? cat.value : 'volume';

      // Prefer dropdown units if present; fallback to free-text
      let val = parseFloat((from.value||"").trim());
      if (!Number.isFinite(val)) {
        const pf = parseFromFree(from.value);
        if (pf) { val = pf.val; if (selFrom && selFrom.options.length) selFrom.value = pf.unit; }
      }
      const fromUnit = selFrom && selFrom.options.length ? selFrom.value : parseFromFree(from.value || "")?.unit;
      const toUnit   = selTo && selTo.options.length ? selTo.value   : normUnit(to.value);

      if (!Number.isFinite(val) || !fromUnit || !toUnit) return bad('Provide a number and choose units.');

      let res;
      if (category==='volume'){
        if (!(fromUnit in VOLUME) || !(toUnit in VOLUME)) return bad('Unit not valid for Volume.');
        res = convertVolume(val, fromUnit, toUnit);
      } else if (category==='weight') {
        if (!(fromUnit in WEIGHT) || !(toUnit in WEIGHT)) return bad('Unit not valid for Weight.');
        res = convertWeight(val, fromUnit, toUnit);
      } else {
        const ok = TEMP.includes(fromUnit[0]) && TEMP.includes(toUnit[0]);
        if (!ok) return bad('Use C/F/K units.');
        res = convertTemp(val, fromUnit, toUnit);
      }
      out.textContent = `${val} ${fromUnit.toUpperCase()} ≈ ${roundSmart(res)} ${toUnit.toUpperCase()}`;
      out.classList.remove('d-none','alert-danger'); out.classList.add('alert-success');
    });
  }

  /* ========= Substitutes (left list -> right details) ========= */
  function initSubstitutes(){
    const search = document.getElementById('subsSearch');
    const listEl = document.getElementById('subsList');
    const detail = document.getElementById('subsDetail');
    if (!search || !listEl || !detail) return;

    const DB = {
      milk:{ label:'Milk (1 cup)', subs:[['Almond Milk','1 cup — unsweetened recommended'],['Oat Milk','1 cup — creamy texture'],['Coconut Milk','1 cup — richer, tropical flavor']] },
      eggs:{ label:'Eggs (1 egg)', subs:[['Applesauce','¼ cup — baking'],['Ground Flax + Water','1 tbsp flax + 3 tbsp water = 1 egg'],['Greek Yogurt','¼ cup']] },
      butter:{ label:'Butter (1 tbsp)', subs:[['Olive Oil','¾ tbsp — savory'],['Coconut Oil','1 tbsp — baking'],['Margarine','1 tbsp']] },
      "all-purpose flour":{ label:'All-Purpose Flour (1 cup)', subs:[['Cake Flour','1 cup — lighter texture'],['Bread Flour','1 cup — chewier'],['Gluten-Free Blend','1 cup']] },
      "sour cream":{ label:'Sour Cream (1 cup)', subs:[['Greek Yogurt','1 cup'],['Crème Fraîche','1 cup'],['Cottage Cheese (blended)','1 cup']] },
      "brown sugar":{ label:'Brown Sugar (1 cup)', subs:[['White Sugar + Molasses','1 cup + 1 tbsp molasses'],['Coconut Sugar','1 cup']] },
      "buttermilk":{ label:'Buttermilk (1 cup)', subs:[['Milk + Lemon Juice','1 cup + 1 tbsp lemon, rest 5 min'],['Milk + Vinegar','1 cup + 1 tbsp vinegar']] }
    };

    function renderList(query=''){
      listEl.innerHTML = '';
      const keys = Object.keys(DB).filter(k => k.includes(query.toLowerCase()));
      if (!keys.length){
        listEl.innerHTML = `<li class="list-group-item text-muted">Try: milk, eggs, butter…</li>`;
        detail.innerHTML = '';
        return;
      }
      keys.forEach((k, idx)=>{
        const li = document.createElement('li');
        li.className = `list-group-item ${idx===0?'active':''}`;
        li.textContent = DB[k].label;
        li.dataset.key = k;
        li.addEventListener('click', ()=>{
          qsa('#subsList .list-group-item').forEach(x=>x.classList.remove('active'));
          li.classList.add('active');
          renderDetail(k);
        });
        listEl.appendChild(li);
      });
      renderDetail(keys[0]);
    }

    function renderDetail(key){
      const d = DB[key]; if (!d){ detail.innerHTML=''; return; }
      detail.innerHTML = `
        <div class="hint-block mb-2">
          <div class="hint-title">Original</div>
          <div class="text-muted">${d.label}</div>
        </div>
        ${d.subs.map(([name,desc])=>`
          <div class="hint-block mb-2">
            <div class="d-flex justify-content-between"><strong>${name}</strong><span class="badge text-bg-light border">1:1</span></div>
            <div class="text-muted small mt-1">${desc}</div>
          </div>`).join('')}
      `;
    }

    search.addEventListener('input', ()=>renderList(search.value));
    renderList();
  }

  /* ========= Shopping List ========= */
  function initShoppingList(){
    const name = document.getElementById('listItemName');
    const qty  = document.getElementById('listItemQty');
    const add  = document.getElementById('btnAddListItem');
    const list = document.getElementById('listItems');
    const clr  = document.getElementById('btnClearChecked');
    const bar  = document.getElementById('listProgress');
    if (!name || !add || !list) return;

    const LS_KEY = 'tasteloop.list';
    let items = load();

    function load(){ try{ return JSON.parse(localStorage.getItem(LS_KEY))||[] }catch{return []} }
    function save(){ localStorage.setItem(LS_KEY, JSON.stringify(items)); }
    function pct(){ const total=items.length||1; const done=items.filter(i=>i.done).length; return Math.round(done*100/total); }
    function render(){
      list.innerHTML='';
      if (!items.length){
        list.innerHTML = `<div class="text-muted small">No items yet. Add something above.</div>`;
        if (bar) bar.style.width = '0%'; return;
      }
      items.forEach((it, idx) => {
        const row = document.createElement('div');
        row.className = 'list-card'+(it.done?' done':'');

        row.innerHTML = `
          <input type="checkbox" ${it.done?'checked':''} class="form-check-input">
          <div><strong>${escapeHtml(it.name)}</strong>${it.qty?` — <span class="text-muted">${escapeHtml(it.qty)}</span>`:''}</div>
          <div class="list-actions"><button class="btn btn-outline-secondary btn-sm" data-act="del">🗑</button></div>
        `;
        row.querySelector('input').addEventListener('change', e=>{ items[idx].done = e.target.checked; save(); render(); });
        row.querySelector('[data-act="del"]').addEventListener('click', ()=>{ items.splice(idx,1); save(); render(); });
        list.appendChild(row);
      });
      if (bar) bar.style.width = pct() + '%';
    }
    function addItem(){
      const n = (name.value||'').trim(); const q = (qty.value||'').trim();
      if (!n) return;
      items.push({name:n, qty:q, done:false});
      save(); render();
      name.value=''; qty.value='';
    }
    add.addEventListener('click', addItem);
    name.addEventListener('keydown', e=>{ if(e.key==='Enter') addItem(); });
    qty.addEventListener('keydown', e=>{ if(e.key==='Enter') addItem(); });
    if (clr) clr.addEventListener('click', ()=>{ items = items.filter(i=>!i.done); save(); render(); });
    render();
    function escapeHtml(s){ return s.replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }
  }

  /* ========= Multi-Timer with popup ========= */
  function initTimers(){
    const name = qs('#timerName');
    const min  = qs('#timerMin');
    const sec  = qs('#timerSec');
    const add  = qs('#btnAddTimer');
    const list = qs('#timerList');
    const alarmBody = qs('#alarmBody');
    const alarmEl   = document.getElementById('alarmModal');
    if(!name || !add || !list || !alarmEl) return;

    let timers = []; // {label, remain, id}

    function render(){
      list.innerHTML='';
      if(!timers.length){
        list.innerHTML = `<li class="list-group-item text-center text-muted">No timers yet. Add one above!</li>`;
        return;
      }
      timers.forEach((t, idx)=>{
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
          <div><strong>${t.label}</strong><div class="small text-muted">Remaining</div></div>
          <div class="d-flex align-items-center gap-2">
            <code class="fw-bold" style="font-size:1.1rem">${fmt(t.remain)}</code>
            <button class="btn btn-outline-secondary btn-sm" data-act="stop">Stop</button>
          </div>`;
        li.querySelector('[data-act="stop"]').addEventListener('click', ()=>stop(idx));
        list.appendChild(li);
      });
    }

    function fmt(s){
      s = Math.max(0, Math.floor(s));
      const m = Math.floor(s/60), r = s%60;
      return `${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`;
    }

    function addTimer(){
      const label = (name.value||'Timer').trim();
      const total = (parseInt(min.value||0,10)*60) + (parseInt(sec.value||0,10)||0);
      if (!total) return;
      const t = {label, remain: total, id: null};
      timers.push(t);
      tick(t);
      render();
      name.value=''; min.value='0'; sec.value='30';
    }

    function tick(t){
      t.id = setInterval(()=>{
        t.remain -= 1;
        if (t.remain <= 0){
          clearInterval(t.id);
          t.remain = 0;
          popup(t.label);
          timers = timers.filter(x => x!==t);
        }
        render();
      }, 1000);
    }

    function stop(idx){
      const t = timers[idx];
      if (!t) return;
      clearInterval(t.id);
      timers.splice(idx,1);
      render();
    }

    function beep(){
      try{
        const ctx = new (window.AudioContext||window.webkitAudioContext)();
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type='sine'; o.frequency.value=880; o.connect(g); g.connect(ctx.destination);
        o.start(); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+1); setTimeout(()=>ctx.close(),1200);
      }catch{}
    }

    function popup(label){
      if (alarmBody) alarmBody.textContent = `"${label}" is done!`;
      beep();
      new bootstrap.Modal(alarmEl).show();
    }

    add.addEventListener('click', addTimer);
  }

  /* --------------------------- Shuffle (Home) -------------------------- */
  qs("#btnShuffle")?.addEventListener("click", async () => {
    const total = state.categories.length;
    if (!total) return;
    state.catWindowStart = Math.floor(Math.random() * total);
    renderCategoryWindow(); updateCatCounter();
    await Promise.all(getWindowCats().map(name => ensureCategoryData(name)));
    if (state.moreOpen) await renderMoreCategories();
  });

  /* -------------------------- Surprise Me (Shared) ----------------------- */
  el.btnSurprise?.addEventListener("click", async () => {
    const j = await getJSON(API.random);
    openRecipeModal(j.meals?.[0]);
  });

  /* ======================= RECIPES PAGE LOGIC ======================= */
  function buildRecipeCard(m){
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-3";
    col.innerHTML = `
      <div class="recipe-card h-100">
        <div class="img-wrap">
          <img src="${m.strMealThumb}" alt="${m.strMeal}" loading="lazy"
               onerror="this.onerror=null;this.src='https://via.placeholder.com/600x400?text=Recipe'">
        </div>
        <div class="card-body small">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <div>${flagImg(m.strArea || "Unknown")}</div>
            <div class="meta">${m.strCategory || ""}</div>
          </div>
          <h6 class="card-title mb-0">${m.strMeal}</h6>
        </div>
      </div>`;
    col.addEventListener("click", () => openRecipeModal(m));
    return col;
  }

  async function initRecipesPage(){
    if (!recEl.topRow || !recEl.grid) return;

    // Load categories and areas (for filters)
    const catJ = await getJSON(API.categories);
    state.recCats = (catJ.categories || []).map(c => c.strCategory);

    const areaJ = await getJSON(API.listAreas);
    const areas = (areaJ.meals || []).map(a => a.strArea).filter(Boolean).sort();

    // Fill filters
    if (recEl.filterCategory){
      recEl.filterCategory.innerHTML =
        `<option value="">All categories</option>` +
        state.recCats.map(c=>`<option value="${c}">${c}</option>`).join("");
    }
    if (recEl.filterArea){
      recEl.filterArea.innerHTML =
        `<option value="">All areas</option>` +
        areas.map(a=>`<option value="${a}">${a}</option>`).join("");
    }

    async function buildTopAndGrid(){
      // top window (4)
      const start = state.recWindowStart;
      const size = state.recWindowSize;
      const total = state.recCats.length;
      const topNames = [];
      for (let i=0;i<Math.min(size,total);i++){
        topNames.push(state.recCats[(start+i)%total]);
      }
      await Promise.all(topNames.map(n=>ensureCategoryData(n)));
      recEl.topRow.innerHTML = "";
      topNames.forEach(n => recEl.topRow.appendChild(buildCategoryCard(n)));

      // remainder grid (8)
      const topSet = new Set(topNames);
      const rest = state.recCats.filter(c=>!topSet.has(c)).slice(0,8);
      await Promise.all(rest.map(n=>ensureCategoryData(n)));
      recEl.grid.innerHTML = "";
      const frag = document.createDocumentFragment();
      rest.forEach(n => frag.appendChild(buildCategoryCard(n)));
      recEl.grid.appendChild(frag);

      // counter
      if (recEl.counter){
        const end = Math.min(start+size, total);
        recEl.counter.textContent = `${total ? start+1 : 0}–${Math.min(end,total)} of ${total} categories`;
      }
    }

    // Search by name (fills grid with actual recipes)
    async function doRecipeSearch(){
      const q = (recEl.search?.value || "").trim();
      if (!q) return;
      const j = await getJSON(API.searchByName(q));
      const list = (j.meals || []).slice(0, 24);
      recEl.grid.innerHTML = "";
      if (!list.length){
        recEl.grid.innerHTML = `<div class="col-12 text-muted">No results</div>`;
        return;
      }
      const frag = document.createDocumentFragment();
      list.forEach(m => frag.appendChild(buildRecipeCard(m)));
      recEl.grid.appendChild(frag);
    }

    // Filter by category / area (intersection)
    async function applyFilters(){
      const cat = recEl.filterCategory?.value || "";
      const area = recEl.filterArea?.value || "";
      if (!cat && !area){ await buildTopAndGrid(); return; }

      async function idsBy(url){
        const j = await getJSON(url);
        return new Set((j.meals || []).map(m=>m.idMeal));
      }

      let idSet = null;
      if (cat)  idSet = await idsBy(API.filterByCategory(cat));
      if (area){
        const aSet = await idsBy(API.filterByArea(area));
        idSet = idSet ? new Set([...idSet].filter(x=>aSet.has(x))) : aSet;
      }

      const ids = [...(idSet||new Set())].slice(0, 24);
      if (!ids.length){ recEl.grid.innerHTML = `<div class="col-12 text-muted">No recipes match your filters.</div>`; return; }

      const details = await Promise.all(ids.map(async id => {
        const dj = await getJSON(API.lookupById(id));
        return dj.meals?.[0];
      }));
      recEl.grid.innerHTML = "";
      const frag = document.createDocumentFragment();
      details.filter(Boolean).forEach(m => frag.appendChild(buildRecipeCard(m)));
      recEl.grid.appendChild(frag);
    }

    // Wire controls
    recEl.prev?.addEventListener("click", async ()=>{
      const total = state.recCats.length||1;
      state.recWindowStart = (state.recWindowStart - state.recWindowSize + total) % total;
      await buildTopAndGrid();
    });
    recEl.next?.addEventListener("click", async ()=>{
      const total = state.recCats.length||1;
      state.recWindowStart = (state.recWindowStart + state.recWindowSize) % total;
      await buildTopAndGrid();
    });
    recEl.shuffle?.addEventListener("click", async ()=>{
      const total = state.recCats.length||1;
      state.recWindowStart = Math.floor(Math.random()*total);
      await buildTopAndGrid();
    });

    recEl.searchBtn?.addEventListener("click", doRecipeSearch);
    recEl.search?.addEventListener("keydown", e => { if (e.key === "Enter") doRecipeSearch(); });
    recEl.filterCategory?.addEventListener("change", applyFilters);
    recEl.filterArea?.addEventListener("change", applyFilters);
    recEl.clearFilters?.addEventListener("click", async ()=>{
      if (recEl.filterCategory) recEl.filterCategory.value = "";
      if (recEl.filterArea)     recEl.filterArea.value = "";
      if (recEl.search)         recEl.search.value = "";
      await buildTopAndGrid();
    });

    await buildTopAndGrid();
  }

  /* ----------------------------- Init --------------------------- */
  document.addEventListener("DOMContentLoaded", async () => {
    const isHome = !!el.catSlider || !!el.heroInner;
    const isRecipes = !!recEl.topRow;

    if (isHome){
      await Promise.all([buildHero(), loadCategoriesHome()]);
    }
    if (isRecipes){
      await initRecipesPage();
    }
  });
})();
