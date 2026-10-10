/**
 * Ai PhotoFlow — Client Interactive Architecture & Workflow Engine (v1.1.0)
 * Engineered for High-Volume Wedding & Commercial Post-Production
 * Founder: Anil Sharma • Quick Art Photography
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initWorkflowSuite();
  initBeforeAfterSlider();
  initCullingSimulator();
  initAuthAndLeads();
  initPricingToggle();
  initFaqAccordion();
  initDownloadFlow();
  initAdminPortal();
  initRoiCalculator();
  initAffiliateCalculator();
  initAffiliateForm();
});

/* ==========================================================================
   1. NAVBAR & HEADER STATE
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 20) {
          header?.classList.add('scrolled');
        } else {
          header?.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    function closeMobileMenu() {
      navLinks.classList.remove('mobile-active');
      mobileToggle.classList.remove('is-active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      if (!mobileToggle.querySelector('svg')) {
        mobileToggle.innerHTML = '☰';
      }
      document.body.classList.remove('mobile-menu-locked');
      document.querySelectorAll('.nav-item.is-open').forEach(el => el.classList.remove('is-open'));
    }

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('mobile-active');
      mobileToggle.classList.toggle('is-active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (!mobileToggle.querySelector('svg')) {
        mobileToggle.innerHTML = isOpen ? '✕' : '☰';
      }
      document.body.classList.toggle('mobile-menu-locked', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('mobile-active') && !navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Handle dropdown / megamenu toggling on mobile touch
    const navDropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
    navDropdownItems.forEach(item => {
      const trigger = item.querySelector('.nav-link');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          if (window.innerWidth <= 1024) {
            e.preventDefault();
            const wasOpen = item.classList.contains('is-open');
            navDropdownItems.forEach(i => i.classList.remove('is-open'));
            if (!wasOpen) {
              item.classList.add('is-open');
            }
          }
        });
      }
    });

    navLinks.querySelectorAll('.megamenu-card-item, .dropdown-panel a, .nav-item:not(.has-dropdown) a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Auto-highlight active link based on current page URL
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links .nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   1.5 AFTERSHOOT-STYLE 4-PILLAR WORKFLOW SUITE (CULL, EDIT, RETOUCH, DELIVER)
   ========================================================================== */
function initWorkflowSuite() {
  const cards = document.querySelectorAll('.workflow-pillar-card');
  const panes = document.querySelectorAll('.workflow-stage-pane');

  if (!cards.length) return;

  cards.forEach(card => {
    function activateCard() {
      const stage = card.getAttribute('data-stage');
      if (!stage) return;

      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      panes.forEach(p => {
        if (p.id === `stage-${stage}`) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
    }

    card.addEventListener('click', activateCard);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateCard();
      }
    });
  });
}

/* ==========================================================================
   2. INTERACTIVE BEFORE / AFTER SLIDER (CLIP-PATH PIXEL-PERFECT ENGINE)
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('comparison-slider-container') || document.querySelector('.comparison-wrapper');
  const baseImg = document.getElementById('comparison-base-img') || document.querySelector('.comparison-image-base') || document.querySelector('.comparison-image');
  const overlayImg = document.getElementById('comparison-overlay-img') || document.querySelector('.comparison-image-overlay') || document.querySelector('.comparison-overlay img');
  const handle = document.getElementById('slider-handle-bar') || document.querySelector('.slider-handle');
  const sceneTabs = document.querySelectorAll('.scene-tab');
  const labelBeforeEl = document.getElementById('comparison-label-before');
  const labelAfterEl = document.getElementById('comparison-label-after');

  if (!container || !handle) return;

  let isDragging = false;

  function setSliderPosition(percentage) {
    if (percentage < 2) percentage = 2;
    if (percentage > 98) percentage = 98;
    container.style.setProperty('--slider-pos', `${percentage}%`);
    handle.style.left = `${percentage}%`;
  }

  let animFrameId = null;
  function handleMove(clientX) {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(() => {
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    });
  }

  // Initialize at exactly 50%
  setSliderPosition(50);

  // Mouse drag & click support
  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    handleMove(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  });

  // Touch support for Mobile / Tablets
  handle.addEventListener('touchstart', () => {
    isDragging = true;
  }, { passive: true });

  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches && e.touches[0]) handleMove(e.touches[0].clientX);
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches && e.touches[0]) {
      if (e.cancelable) e.preventDefault();
      handleMove(e.touches[0].clientX);
    }
  }, { passive: false });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchcancel', () => {
    isDragging = false;
  });

  // Scene Switching
  // LEFT (overlayImg) = Before (Pimples / RAW)
  // RIGHT (baseImg) = After (Flawless / Clean Retouch)
  const scenes = {
    bridal: {
      before: 'assets/images/Bride_CloseUp_RAW_Before.jpg',
      after: 'assets/images/Bride_CloseUp_Ai_Edited.jpg',
      labelBefore: 'ORIGINAL RAW (Pimples & Tungsten Cast)',
      labelAfter: 'AI PHOTOFLOW (Blemish Removal + Smooth Glow)',
      sharpness: '99.4 (Macro 85mm Focus)',
      eyes: '0.44 (Catchlight & Lash Detail)',
      skin: 'Pimple Removed + Gentle Smoothness',
      vibrance: '+5.0% Bridal Red Pop',
      cast: '0.0% Cast (Neutral Skin Tone)'
    },
    couple: {
      before: 'assets/images/Couple_CloseUp_RAW_Before.jpg',
      after: 'assets/images/Couple_CloseUp_Ai_Edited.jpg',
      labelBefore: 'ORIGINAL RAW (Tungsten Cast)',
      labelAfter: 'AI PHOTOFLOW (+5% Vibrance & Skin Lock)',
      sharpness: '97.6 (Ring & Mehendi Focus)',
      eyes: '0.40 (Tender Intimacy)',
      skin: 'Warm Complexion Protected',
      vibrance: '+5.0% Gold & Mehendi Pop',
      cast: 'Tungsten Cast Removed'
    },
    garden: {
      before: 'assets/images/Outdoor_Garden_Portrait_01.jpg',
      after: 'assets/images/Outdoor_Garden_Portrait_01_edited.jpg',
      labelBefore: 'ORIGINAL RAW (Flat Daylight)',
      labelAfter: 'AI PHOTOFLOW (Natural Dynamic Range)',
      sharpness: '98.2 (Outdoor Gajra & Jewelry)',
      eyes: '0.44 (Natural Daylight Catchlight)',
      skin: 'Natural Sunlit Tone Locked',
      vibrance: '+5.0% Emerald Green & Flora',
      cast: '0.0% Foliage Color Balanced'
    }
  };

  sceneTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sceneTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const sceneKey = tab.dataset.scene;
      const data = scenes[sceneKey];
      if (data) {
        // Left side is Before (overlay), Right side is After (base)
        if (overlayImg) overlayImg.src = data.before;
        if (baseImg) baseImg.src = data.after;
        
        // Reset slider to center
        setSliderPosition(50);

        // Update Labels
        if (labelBeforeEl && data.labelBefore) labelBeforeEl.textContent = data.labelBefore;
        if (labelAfterEl && data.labelAfter) labelAfterEl.textContent = data.labelAfter;

        // Update HUD
        const valSharpness = document.getElementById('hud-sharpness');
        const valEyes = document.getElementById('hud-eyes');
        const valSkin = document.getElementById('hud-skin');
        const valVibrance = document.getElementById('hud-vibrance');

        if (valSharpness) valSharpness.textContent = data.sharpness;
        if (valEyes) valEyes.textContent = data.eyes;
        if (valSkin) valSkin.textContent = data.skin;
        if (valVibrance) valVibrance.textContent = data.vibrance;
      }
    });
  });
}

/* ==========================================================================
   3. INTERACTIVE CULLING SIMULATOR
   ========================================================================== */
function initCullingSimulator() {
  const previewImg = document.getElementById('sim-current-img');
  const badgeStatus = document.getElementById('sim-current-status');
  const filmstripThumbs = document.querySelectorAll('.filmstrip-thumb');
  const simScore = document.getElementById('sim-metric-score');
  const simLaplacian = document.getElementById('sim-metric-laplacian');
  const simEar = document.getElementById('sim-metric-ear');
  const simDuplicate = document.getElementById('sim-metric-duplicate');
  const simFilename = document.getElementById('sim-current-filename');

  const photoCatalog = {
    'p1': {
      filename: 'Rahul_Priya_Mandap_Burst_01.CR3',
      img: 'assets/images/Rahul_Priya_Mandap_Burst_01.jpg',
      status: 'BEST',
      score: '96.4 / 100',
      laplacian: '482.1 σ² (Pin-Sharp)',
      ear: '0.38 (Eyes Wide Open)',
      duplicate: 'Burst #104 (Rank 1 / Winner)',
      tagClass: 'best'
    },
    'p2': {
      filename: 'Rahul_Priya_Mandap_Burst_02.CR3',
      img: 'assets/images/Rahul_Priya_Mandap_Burst_02.jpg',
      status: 'REVIEW',
      score: '64.8 / 100',
      laplacian: '210.4 σ² (Minor Shake)',
      ear: '0.19 (Half Blink Detected)',
      duplicate: 'Burst #104 (Rank 2 / Secondary)',
      tagClass: 'review'
    },
    'p3': {
      filename: 'Rahul_Priya_Mandap_Burst_03.CR3',
      img: 'assets/images/Rahul_Priya_Mandap_Burst_03.jpg',
      status: 'PICK',
      score: '84.2 / 100',
      laplacian: '390.6 σ² (Sharp Focus)',
      ear: '0.32 (Open Eyes)',
      duplicate: 'Burst #104 (Rank 3 / Alternate)',
      tagClass: 'pick'
    },
    'p4': {
      filename: 'Out_Of_Focus_Blurred_01.ARW',
      img: 'assets/images/Out_Of_Focus_Blurred_01.jpg',
      status: 'REJECT',
      score: '22.0 / 100',
      laplacian: '45.1 σ² (Motion Blur > 80%)',
      ear: '0.00 (Face Unresolved)',
      duplicate: 'Independent Burst #105',
      tagClass: 'reject'
    },
    'p5': {
      filename: 'Bride_Solo_Makeup_01.NEF',
      img: 'assets/images/Bride_Solo_Makeup_01.jpg',
      status: 'BEST',
      score: '98.2 / 100',
      laplacian: '540.8 σ² (Pore-Level Crisp)',
      ear: '0.42 (Natural Beauty Catchlight)',
      duplicate: 'Solo Portrait #106',
      tagClass: 'best'
    }
  };

  let activePhotoId = 'p1';

  function renderSimPhoto(id) {
    const item = photoCatalog[id];
    if (!item || !previewImg) return;
    activePhotoId = id;

    previewImg.src = item.img;
    if (badgeStatus) {
      badgeStatus.textContent = item.status;
      badgeStatus.className = `status-tag ${item.tagClass}`;
    }
    if (simScore) simScore.textContent = item.score;
    if (simLaplacian) simLaplacian.textContent = item.laplacian;
    if (simEar) simEar.textContent = item.ear;
    if (simDuplicate) simDuplicate.textContent = item.duplicate;
    if (simFilename) simFilename.textContent = item.filename;

    filmstripThumbs.forEach(t => {
      t.classList.toggle('active', t.dataset.id === id);
    });
  }

  filmstripThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const id = thumb.dataset.id;
      renderSimPhoto(id);
    });
  });

  // Action Buttons
  const btnPick = document.getElementById('sim-btn-pick');
  const btnReject = document.getElementById('sim-btn-reject');
  const btnUnflag = document.getElementById('sim-btn-unflag');
  const btnEdit = document.getElementById('sim-btn-edit');

  function setUserFlag(status, tagClass) {
    if (photoCatalog[activePhotoId]) {
      photoCatalog[activePhotoId].status = status;
      photoCatalog[activePhotoId].tagClass = tagClass;
      renderSimPhoto(activePhotoId);
      showToast(`Photo flagged as ${status} [Shortcut Registered]`);
    }
  }

  btnPick?.addEventListener('click', () => setUserFlag('PICKED (P)', 'pick'));
  btnReject?.addEventListener('click', () => setUserFlag('REJECTED (X)', 'reject'));
  btnUnflag?.addEventListener('click', () => setUserFlag('UNFLAGGED (U)', 'review'));
  btnEdit?.addEventListener('click', () => {
    showToast(`AI Auto-Color applied (+5% Vibrance Boost)!`);
  });

  // Keyboard Shortcuts in Simulator
  window.addEventListener('keydown', (e) => {
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;

    if (e.key === 'p' || e.key === 'P') {
      setUserFlag('PICKED (P)', 'pick');
    } else if (e.key === 'x' || e.key === 'X') {
      setUserFlag('REJECTED (X)', 'reject');
    } else if (e.key === 'u' || e.key === 'U') {
      setUserFlag('UNFLAGGED (U)', 'review');
    } else if (e.key === 'ArrowRight') {
      const ids = Object.keys(photoCatalog);
      const currIdx = ids.indexOf(activePhotoId);
      const nextIdx = (currIdx + 1) % ids.length;
      renderSimPhoto(ids[nextIdx]);
    } else if (e.key === 'ArrowLeft') {
      const ids = Object.keys(photoCatalog);
      const currIdx = ids.indexOf(activePhotoId);
      const prevIdx = (currIdx - 1 + ids.length) % ids.length;
      renderSimPhoto(ids[prevIdx]);
    }
  });
}

/* ==========================================================================
   4. USER AUTH & LEAD COLLECTION SYSTEM
   ========================================================================== */
function initAuthAndLeads() {
  const authModal = document.getElementById('auth-modal');
  const authTriggers = document.querySelectorAll('.auth-trigger');
  const modalClose = authModal?.querySelector('.modal-close-btn');
  const tabSignIn = document.getElementById('tab-btn-signin');
  const tabSignUp = document.getElementById('tab-btn-signup');
  const formSignIn = document.getElementById('form-signin');
  const formSignUp = document.getElementById('form-signup');
  const navUserPill = document.getElementById('nav-user-status');
  const navUserName = document.getElementById('nav-user-name');
  const navSignInBtn = document.getElementById('nav-signin-btn');

  // Check existing session
  const savedUser = localStorage.getItem('photoFlowUser');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      if (navUserPill && navUserName && navSignInBtn) {
        navUserPill.classList.add('logged-in');
        navUserName.textContent = user.name || user.email.split('@')[0];
        navSignInBtn.style.display = 'none';
      }
    } catch (e) {
      console.error(e);
    }
  }

  function openAuth(mode = 'signin') {
    if (!authModal) return;
    authModal.classList.add('active');
    switchTab(mode);
  }

  function closeAuth() {
    if (!authModal) return;
    authModal.classList.remove('active');
  }

  function switchTab(mode) {
    if (mode === 'signin') {
      tabSignIn?.classList.add('active');
      tabSignUp?.classList.remove('active');
      if (formSignIn) formSignIn.style.display = 'block';
      if (formSignUp) formSignUp.style.display = 'none';
    } else {
      tabSignUp?.classList.add('active');
      tabSignIn?.classList.remove('active');
      if (formSignUp) formSignUp.style.display = 'block';
      if (formSignIn) formSignIn.style.display = 'none';
    }
  }

  authTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const mode = btn.dataset.authMode || 'signin';
      openAuth(mode);
    });
  });

  modalClose?.addEventListener('click', closeAuth);
  authModal?.addEventListener('click', (e) => {
    if (e.target === authModal) closeAuth();
  });

  tabSignIn?.addEventListener('click', () => switchTab('signin'));
  tabSignUp?.addEventListener('click', () => switchTab('signup'));

  // Global Real-Time CRM & AiBotFlow Webhook Dispatcher
  async function dispatchLeadToWebhook(lead) {
    const webhookUrl = localStorage.getItem('photoFlowCrmWebhookUrl');
    if (!webhookUrl || !webhookUrl.trim()) return;

    const payload = {
      source: 'Ai PhotoFlow Official Website',
      event: 'studio_lead_captured',
      timestamp: new Date().toISOString(),
      lead: {
        id: lead.id || ('PF-' + Math.floor(1000 + Math.random() * 9000)),
        name: lead.name || '',
        phone: lead.phone || '',
        studio: lead.studio || '',
        email: lead.email || '',
        platform: lead.platform || '',
        date: lead.date || new Date().toLocaleString(),
        status: lead.status || 'Active Lead'
      }
    };

    try {
      await fetch(webhookUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });
      console.log('[AiBotFlow Webhook] Lead payload dispatched to:', webhookUrl.trim());
    } catch (err) {
      console.warn('[AiBotFlow Webhook] Dispatch warning:', err);
    }
  }

  // Save Lead Function
  function saveLeadRecord(lead) {
    let leads = [];
    try {
      leads = JSON.parse(localStorage.getItem('photoFlowLeads')) || [];
    } catch (e) {
      leads = [];
    }
    // Check if duplicate email
    const existingIndex = leads.findIndex(l => l.email === lead.email);
    if (existingIndex >= 0) {
      leads[existingIndex] = { ...leads[existingIndex], ...lead, lastActive: new Date().toISOString() };
    } else {
      leads.unshift(lead);
    }
    localStorage.setItem('photoFlowLeads', JSON.stringify(leads));

    // Dispatch to CRM Webhook
    dispatchLeadToWebhook(lead);
  }

  // Helper: Escape HTML strings
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  // Helper to render Post-Login Download Portal (in login.html)
  function renderPostLoginPortal(user) {
    const portal = document.getElementById('login-download-portal');
    if (!portal) return;

    const modalTabs = document.querySelector('.modal-tabs');
    const modalHeaderSub = document.querySelector('.modal-header p');
    if (modalTabs) modalTabs.style.display = 'none';
    if (modalHeaderSub) modalHeaderSub.style.display = 'none';
    if (formSignIn) formSignIn.style.display = 'none';
    if (formSignUp) formSignUp.style.display = 'none';
    portal.style.display = 'block';

    const welcomeName = document.getElementById('login-welcome-name');
    const welcomeStudio = document.getElementById('login-welcome-studio');
    const licenseKeyEl = document.getElementById('login-license-key-val');

    if (welcomeName) {
      welcomeName.innerHTML = `Welcome, <span class="text-gradient">${escapeHtml(user.name || 'Studio Member')}</span>!`;
    }
    if (welcomeStudio) {
      welcomeStudio.innerHTML = `Studio: <strong style="color: #fff;">${escapeHtml(user.studio || 'Commercial Studio')}</strong>`;
    }
    if (licenseKeyEl) {
      licenseKeyEl.textContent = user.trialKey || 'APF-TRIAL-8942-2026';
    }
  }

  // Handle Sign In submission
  formSignIn?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signin-email').value.trim();
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.userAgent.includes('Mac');
    
    // Check if user already exists in photoFlowLeads
    let leads = [];
    try {
      leads = JSON.parse(localStorage.getItem('photoFlowLeads')) || [];
    } catch (err) {
      leads = [];
    }
    const matchedLead = leads.find(l => l.email.toLowerCase() === email.toLowerCase());

    const userName = matchedLead ? matchedLead.name : (email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Studio Member');
    const userStudio = matchedLead ? matchedLead.studio : 'Quick Art Photography Studio';
    const trialKey = matchedLead && matchedLead.trialKey ? matchedLead.trialKey : ('APF-TRIAL-' + Math.floor(1000 + Math.random() * 9000) + '-2026');

    const userData = { 
      email: email, 
      name: userName,
      studio: userStudio,
      trialKey: trialKey,
      plan: '1-Day Free Trial',
      platform: isMac ? 'macOS (Apple Silicon)' : 'Windows (64-bit)',
      date: new Date().toLocaleString()
    };
    
    localStorage.setItem('photoFlowUser', JSON.stringify(userData));
    saveLeadRecord({
      id: matchedLead ? matchedLead.id : ('PF-' + Math.floor(1000 + Math.random() * 9000)),
      name: userData.name,
      email: email,
      phone: matchedLead ? matchedLead.phone : 'Not provided',
      studio: userData.studio,
      platform: userData.platform,
      trialKey: trialKey,
      date: userData.date,
      status: 'Active 1-Day Trial'
    });

    // Check if on login.html with download options
    if (document.getElementById('login-download-portal')) {
      renderPostLoginPortal(userData);
      showToast(`Welcome back, ${userName}! Select macOS or Windows below to download.`, 'success');
    } else {
      showToast('Signed in successfully! Redirecting...', 'success');
      closeAuth();
      setTimeout(() => {
        window.location.href = 'download.html?auth=success';
      }, 700);
    }
  });

  // Handle Sign Up submission
  formSignUp?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const phone = document.getElementById('signup-phone')?.value.trim() || 'Not provided';
    const email = document.getElementById('signup-email').value.trim();
    const studio = document.getElementById('signup-studio').value.trim();
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.userAgent.includes('Mac');
    const trialKey = 'APF-TRIAL-' + Math.floor(1000 + Math.random() * 9000) + '-2026';

    const leadRecord = {
      id: 'PF-' + Math.floor(1000 + Math.random() * 9000),
      name,
      email,
      phone,
      studio,
      platform: isMac ? 'macOS (Apple Silicon)' : 'Windows (64-bit)',
      date: new Date().toLocaleString(),
      trialKey: trialKey,
      status: 'Active 1-Day Trial'
    };

    localStorage.setItem('photoFlowUser', JSON.stringify(leadRecord));
    saveLeadRecord(leadRecord);

    if (document.getElementById('login-download-portal')) {
      renderPostLoginPortal(leadRecord);
      showToast(`Welcome ${name}! 1-Day Trial Activated. Select macOS or Windows below to download.`, 'success');
    } else {
      showToast(`Welcome ${name}! 1-Day Trial Activated.`, 'success');
      closeAuth();
      setTimeout(() => {
        window.location.href = 'download.html?auth=success';
      }, 700);
    }
  });

  // Post-Login Download Buttons in login.html
  document.querySelectorAll('.postlogin-dl-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const os = btn.dataset.os || 'mac';
      showToast(`Downloading Ai PhotoFlow for ${os === 'mac' ? 'macOS (.dmg)' : 'Windows (.exe)'}...`, 'success');

      // Update user platform choice in leads
      try {
        const u = JSON.parse(localStorage.getItem('photoFlowUser'));
        if (u) {
          u.platform = os === 'mac' ? 'macOS (Apple Silicon)' : 'Windows (64-bit)';
          localStorage.setItem('photoFlowUser', JSON.stringify(u));
          saveLeadRecord(u);
        }
      } catch (err) {}
    });
  });

  // Post-Login Copy Key Button
  const loginCopyKeyBtn = document.getElementById('login-copy-key-btn');
  loginCopyKeyBtn?.addEventListener('click', () => {
    const key = document.getElementById('login-license-key-val')?.textContent.trim();
    if (key) {
      navigator.clipboard.writeText(key).then(() => {
        showToast('✓ License Key copied to clipboard!', 'success');
      }).catch(() => {
        showToast(`Key: ${key}`, 'info');
      });
    }
  });

  // Post-Login Sign Out / Switch Studio Button
  const loginSignoutBtn = document.getElementById('login-signout-btn');
  loginSignoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('photoFlowUser');
    const portal = document.getElementById('login-download-portal');
    const modalTabs = document.querySelector('.modal-tabs');
    const modalHeaderSub = document.querySelector('.modal-header p');
    if (portal) portal.style.display = 'none';
    if (modalTabs) modalTabs.style.display = 'flex';
    if (modalHeaderSub) modalHeaderSub.style.display = 'block';
    if (formSignIn) formSignIn.style.display = 'block';
    if (formSignUp) formSignUp.style.display = 'none';
    showToast('Signed out. You can now log in or claim a new trial.', 'info');
  });

  // Auto-render login download portal if user already logged in on login.html
  try {
    const savedUser = JSON.parse(localStorage.getItem('photoFlowUser'));
    if (savedUser && document.getElementById('login-download-portal')) {
      renderPostLoginPortal(savedUser);
    }
  } catch (err) {}
}

/* ==========================================================================
   5. DOWNLOAD FLOW & PLATFORM DETECTION
   ========================================================================== */
function initDownloadFlow() {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.userAgent.includes('Mac');
  const macDownloadBtns = document.querySelectorAll('.btn-download-mac');
  const winDownloadBtns = document.querySelectorAll('.btn-download-win');
  const autoDetectBtns = document.querySelectorAll('.btn-download-autodetect');
  const platformBadge = document.getElementById('platform-badge');

  if (platformBadge) {
    platformBadge.textContent = isMac ? 'Apple Silicon Mac Detected • 1-Day Trial' : 'Windows 10/11 64-bit Detected • 1-Day Trial';
  }

  // Inject modal dynamically if absent on this page
  if (!document.getElementById('download-gate-modal')) {
    const modalDiv = document.createElement('div');
    modalDiv.id = 'download-gate-modal';
    modalDiv.className = 'modal-overlay';
    modalDiv.innerHTML = `
      <div class="modal-container download-gate-container">
        <button class="modal-close-btn" id="gate-modal-close-btn" aria-label="Close dialog">✕</button>
        <div id="gate-form-view">
          <div class="modal-header" style="text-align: center; margin-bottom: 1.5rem;">
            <img src="assets/images/app-icon.png" alt="Ai PhotoFlow Logo" style="width: 52px; height: 52px; border-radius: 12px; margin: 0 auto 0.75rem;">
            <h3 id="gate-modal-title" style="font-size: 1.5rem; margin-bottom: 0.35rem; color: #fff;">Download Ai PhotoFlow</h3>
            <p id="gate-modal-subtitle" style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
              Enter your studio details below to activate your <strong>1-Day Free Trial</strong> and start your download immediately.
            </p>
            <div class="gate-os-toggle">
              <button type="button" class="gate-os-pill active" id="gate-pill-mac" data-target-os="mac">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-.98 1.7-.86 2.73 1.01.08 2.04-.52 2.57-1.23z" />
                </svg>
                <span>macOS (.dmg)</span>
              </button>
              <button type="button" class="gate-os-pill" id="gate-pill-win" data-target-os="win">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.951-1.751" />
                </svg>
                <span>Windows (.exe)</span>
              </button>
            </div>
          </div>
          <form id="download-gate-form">
            <div class="form-row-dual">
              <div class="form-group">
                <label class="form-label" for="gate-name">Full Name *</label>
                <input type="text" id="gate-name" class="form-input" placeholder="e.g. Anil Sharma" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="gate-phone">WhatsApp Number *</label>
                <input type="tel" id="gate-phone" class="form-input" placeholder="e.g. 9939800780" required>
              </div>
            </div>
            <div class="form-row-dual">
              <div class="form-group">
                <label class="form-label" for="gate-studio">Studio / Firm Name *</label>
                <input type="text" id="gate-studio" class="form-input" placeholder="e.g. Quick Art Photography" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="gate-email">Email Address *</label>
                <input type="email" id="gate-email" class="form-input" placeholder="e.g. studio@quickart.in" required>
              </div>
            </div>
            <button type="submit" id="gate-submit-btn" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 0.75rem;">
              <span>Start 1-Day Free Trial & Download (.dmg) →</span>
            </button>
            <div class="gate-trust-strip">
              <span>🔒 100% Free 1-Day Trial</span>
              <span>⚡ Instant Direct Download</span>
              <span>🚫 No Credit Card Needed</span>
            </div>
          </form>
        </div>
        <div id="gate-success-view" style="display: none; text-align: center; padding: 1.5rem 0.5rem;">
          <div class="success-icon-wrap" style="width: 68px; height: 68px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3 style="font-size: 1.6rem; color: #fff; margin-bottom: 0.5rem;">Download Started!</h3>
          <p id="gate-success-desc" style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.75rem; line-height: 1.5;">
            Your Ai PhotoFlow installer is now downloading automatically.
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1.75rem;">
            <a id="gate-redownload-link" href="https://aiphotoflow.in/downloads/Ai-PhotoFlow-1.0.0-arm64.dmg" download class="btn btn-primary btn-sm" style="padding: 0.65rem 1.25rem; font-size: 0.9rem;">⬇️ Download Again</a>
            <a id="gate-alt-os-link" href="https://aiphotoflow.in/downloads/Ai-PhotoFlow-Setup-1.0.0.exe" download class="btn btn-outline btn-sm" style="padding: 0.65rem 1.25rem; font-size: 0.9rem;">Switch OS Download</a>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 1.25rem;">
            Need installation assistance? Direct WhatsApp: <a href="https://wa.me/919939800780" target="_blank" style="color: #25d366; font-weight: 600;">+91 9939800780</a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalDiv);
  }

  // --- Mandatory Lead Gate Modal Logic before downloading on Any Page ---
  const gateModal = document.getElementById('download-gate-modal');
  const gateFormView = document.getElementById('gate-form-view');
  const gateSuccessView = document.getElementById('gate-success-view');
  const gateForm = document.getElementById('download-gate-form');
  const gatePillMac = document.getElementById('gate-pill-mac');
  const gatePillWin = document.getElementById('gate-pill-win');
  const gateSubmitBtn = document.getElementById('gate-submit-btn');
  const gateTitle = document.getElementById('gate-modal-title');
  const gateCloseBtn = document.getElementById('gate-modal-close-btn');
  const gateCopyKeyBtn = document.getElementById('gate-copy-key-btn');
  const gateRedownloadLink = document.getElementById('gate-redownload-link');
  const gateAltOsLink = document.getElementById('gate-alt-os-link');
  const gateSuccessDesc = document.getElementById('gate-success-desc');
  const gateTrialKeyDisplay = document.getElementById('gate-trial-key-display');

  let activeGateOs = isMac ? 'mac' : 'win';

  function setGateOs(os) {
    activeGateOs = os;
    if (os === 'mac') {
      gatePillMac?.classList.add('active');
      gatePillWin?.classList.remove('active');
      if (gateSubmitBtn) gateSubmitBtn.innerHTML = '<span>Start 1-Day Free Trial & Download for macOS (.dmg) →</span>';
      if (gateTitle) gateTitle.textContent = 'Download Ai PhotoFlow for macOS';
    } else {
      gatePillWin?.classList.add('active');
      gatePillMac?.classList.remove('active');
      if (gateSubmitBtn) gateSubmitBtn.innerHTML = '<span>Start 1-Day Free Trial & Download for Windows (.exe) →</span>';
      if (gateTitle) gateTitle.textContent = 'Download Ai PhotoFlow for Windows';
    }
  }

  gatePillMac?.addEventListener('click', () => setGateOs('mac'));
  gatePillWin?.addEventListener('click', () => setGateOs('win'));

  function openGateModal(targetOs) {
    const os = (!targetOs || targetOs === 'auto') ? (isMac ? 'mac' : 'win') : targetOs;
    setGateOs(os);

    if (gateFormView) gateFormView.style.display = 'block';
    if (gateSuccessView) gateSuccessView.style.display = 'none';

    // Pre-fill fields if user already exists
    try {
      const u = JSON.parse(localStorage.getItem('photoFlowUser'));
      if (u) {
        const inName = document.getElementById('gate-name');
        const inPhone = document.getElementById('gate-phone');
        const inStudio = document.getElementById('gate-studio');
        const inEmail = document.getElementById('gate-email');
        if (inName && !inName.value && u.name) inName.value = u.name;
        if (inPhone && !inPhone.value && u.phone && u.phone !== 'Not provided') inPhone.value = u.phone;
        if (inStudio && !inStudio.value && u.studio) inStudio.value = u.studio;
        if (inEmail && !inEmail.value && u.email) inEmail.value = u.email;
      }
    } catch (e) {}

    gateModal?.classList.add('active');
  }

  function closeGateModal() {
    gateModal?.classList.remove('active');
  }

  gateCloseBtn?.addEventListener('click', closeGateModal);
  gateModal?.addEventListener('click', (e) => {
    if (e.target === gateModal) closeGateModal();
  });

  // Wire up all .btn-download-trigger elements across the site
  document.querySelectorAll('.btn-download-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // If the element is a direct anchor link with a .dmg or .exe URL, allow native download!
      if (btn.tagName === 'A' && btn.href && (btn.href.includes('.dmg') || btn.href.includes('.exe'))) {
        const isMacFile = btn.href.includes('.dmg');
        showToast(`Starting download: Ai PhotoFlow for ${isMacFile ? 'macOS (.dmg)' : 'Windows (.exe)'}...`, 'success');
        return; // Allow native browser download
      }
      e.preventDefault();
      const os = btn.dataset.os || (btn.classList.contains('btn-download-win') ? 'win' : (btn.classList.contains('btn-download-mac') ? 'mac' : 'auto'));
      openGateModal(os);
    });
  });

  // Wire up Top Bar CTA buttons on every page
  document.querySelectorAll('.top-bar-cta').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openGateModal('auto');
    });
  });

  // Handle Gate Form Submission
  gateForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('gate-name').value.trim();
    const phone = document.getElementById('gate-phone').value.trim();
    const studio = document.getElementById('gate-studio').value.trim();
    const email = document.getElementById('gate-email').value.trim();
    const chosenOs = activeGateOs;
    const trialKey = 'APF-TRIAL-' + Math.floor(1000 + Math.random() * 9000) + '-2026';

    const leadData = {
      id: 'PF-' + Math.floor(1000 + Math.random() * 9000),
      name,
      phone,
      studio,
      email,
      platform: chosenOs === 'mac' ? 'macOS (Apple Silicon)' : 'Windows (64-bit)',
      trialKey,
      date: new Date().toLocaleString(),
      status: 'Active 1-Day Trial'
    };

    // Save lead to CRM and session
    let leads = [];
    try {
      leads = JSON.parse(localStorage.getItem('photoFlowLeads')) || [];
    } catch (err) {
      leads = [];
    }
    const existingIndex = leads.findIndex(l => l.email === leadData.email);
    if (existingIndex >= 0) {
      leads[existingIndex] = { ...leads[existingIndex], ...leadData, lastActive: new Date().toISOString() };
    } else {
      leads.unshift(leadData);
    }
    localStorage.setItem('photoFlowLeads', JSON.stringify(leads));
    localStorage.setItem('photoFlowUser', JSON.stringify(leadData));

    // Real-time dispatch to Ai BotFlow / CRM Webhook
    dispatchLeadToWebhook(leadData);

    // Immediately trigger file download after taking inputs
    triggerDownload(chosenOs);

    // Switch to success view inside modal
    if (gateFormView) gateFormView.style.display = 'none';
    if (gateSuccessView) gateSuccessView.style.display = 'block';

    if (gateSuccessDesc) {
      gateSuccessDesc.textContent = `Your Ai PhotoFlow installer for ${chosenOs === 'mac' ? 'macOS (.dmg)' : 'Windows (.exe)'} is now downloading automatically.`;
    }

    const macDownloadUrl = 'https://aiphotoflow.in/downloads/Ai-PhotoFlow-1.0.0-arm64.dmg';
    const winDownloadUrl = 'https://aiphotoflow.in/downloads/Ai-PhotoFlow-Setup-1.0.0.exe';
    const chosenDownloadUrl = chosenOs === 'mac' ? macDownloadUrl : winDownloadUrl;
    const chosenFileName = chosenOs === 'mac' ? 'Ai-PhotoFlow-1.0.0-arm64.dmg' : 'Ai-PhotoFlow-Setup-1.0.0.exe';
    const altOs = chosenOs === 'mac' ? 'win' : 'mac';
    const altDownloadUrl = altOs === 'mac' ? macDownloadUrl : winDownloadUrl;
    const altFileName = altOs === 'mac' ? 'Ai-PhotoFlow-1.0.0-arm64.dmg' : 'Ai-PhotoFlow-Setup-1.0.0.exe';

    if (gateRedownloadLink) {
      gateRedownloadLink.href = chosenDownloadUrl;
      gateRedownloadLink.setAttribute('download', chosenFileName);
      gateRedownloadLink.onclick = null;
    }

    if (gateAltOsLink) {
      gateAltOsLink.textContent = altOs === 'win' ? 'Download for Windows (.exe)' : 'Download for macOS (.dmg)';
      gateAltOsLink.href = altDownloadUrl;
      gateAltOsLink.setAttribute('download', altFileName);
      gateAltOsLink.onclick = null;
    }

    showToast(`✓ Downloading Ai PhotoFlow for ${chosenOs === 'mac' ? 'macOS (.dmg)' : 'Windows (.exe)'}...`, 'success');
  });

  gateCopyKeyBtn?.addEventListener('click', () => {
    const key = gateTrialKeyDisplay?.textContent.trim();
    if (key) {
      navigator.clipboard.writeText(key).then(() => {
        showToast('✓ License Key copied to clipboard!', 'success');
      }).catch(() => {
        showToast(`Key: ${key}`, 'info');
      });
    }
  });

  // Direct handlers for other download buttons
  autoDetectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openGateModal('auto');
    });
  });

  // Handlers for direct download buttons on download.html
  macDownloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.tagName === 'A' && btn.href && btn.href.includes('.dmg')) {
        showToast('Starting download: Ai PhotoFlow for macOS (.dmg)...', 'success');
        return; // Native browser download
      }
      e.preventDefault();
      openGateModal('mac');
    });
  });

  winDownloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.tagName === 'A' && btn.href && btn.href.includes('.exe')) {
        showToast('Starting download: Ai PhotoFlow for Windows (.exe)...', 'success');
        return; // Native browser download
      }
      e.preventDefault();
      openGateModal('win');
    });
  });

  // Check URL params for post-auth welcome
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('auth') === 'success') {
    const welcomeModal = document.getElementById('download-welcome-modal');
    if (welcomeModal) {
      welcomeModal.classList.add('active');
    } else {
      showToast('Welcome to Ai PhotoFlow! Your 1-Day Free Trial download is ready below.', 'success');
    }
  }
}

function triggerDownload(os) {
  const macPath = 'https://aiphotoflow.in/downloads/Ai-PhotoFlow-1.0.0-arm64.dmg';
  const winPath = 'https://aiphotoflow.in/downloads/Ai-PhotoFlow-Setup-1.0.0.exe';

  const targetPath = os === 'mac' ? macPath : winPath;
  const fileName = os === 'mac' ? 'Ai-PhotoFlow-1.0.0-arm64.dmg' : 'Ai-PhotoFlow-Setup-1.0.0.exe';

  showToast(`Starting download: ${fileName}...`, 'info');

  // Trigger programmatic anchor click
  try {
    const link = document.createElement('a');
    link.href = targetPath;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) document.body.removeChild(link);
    }, 1000);
  } catch (e) {}

  // Fallback direct window location navigation ensuring download starts across all browsers
  setTimeout(() => {
    window.location.assign(targetPath);
  }, 100);
}

/* ==========================================================================
   6. PRICING TOGGLE
   ========================================================================== */
/* ==========================================================================
   6. PRICING & RAZORPAY CHECKOUT ENGINE (MATCHING USER SCREENSHOTS)
   ========================================================================== */
function initPricingToggle() {
  // Tab Elements
  const tabPlansTrigger = document.getElementById('tab-plans-trigger');
  const tabLicenseTrigger = document.getElementById('tab-license-trigger');
  const pricingPlansView = document.getElementById('pricing-plans-view');
  const pricingLicenseView = document.getElementById('pricing-license-view');

  // Pill Toggles
  const btnMonthly = document.getElementById('btn-period-monthly');
  const btnYearly = document.getElementById('btn-period-yearly');
  const btnInr = document.getElementById('btn-currency-inr');
  const btnUsd = document.getElementById('btn-currency-usd');

  // Price Display Elements
  const elPriceStarter = document.getElementById('card-price-starter');
  const elPeriodStarter = document.getElementById('card-period-starter');
  const elPricePro = document.getElementById('card-price-pro');
  const elPeriodPro = document.getElementById('card-period-pro');
  const elPriceStudio = document.getElementById('card-price-studio');
  const elPeriodStudio = document.getElementById('card-period-studio');

  // Coupon Elements
  const couponInput = document.getElementById('coupon-input');
  const couponApplyBtn = document.getElementById('coupon-apply-btn');

  // Razorpay Modal Elements
  const rzpModal = document.getElementById('rzp-modal-backdrop');
  const rzpCloseBtn = document.getElementById('rzp-close-btn');
  const rzpStepForm = document.getElementById('rzp-step-form');
  const rzpStepSuccess = document.getElementById('rzp-step-success');
  const rzpCheckoutForm = document.getElementById('rzp-checkout-form');
  const rzpSummaryPlan = document.getElementById('rzp-summary-plan');
  const rzpSummaryAmount = document.getElementById('rzp-summary-amount');
  const rzpDiscountTag = document.getElementById('rzp-discount-tag');
  const rzpPayBtns = document.querySelectorAll('.rzp-pay-btn');
  const rzpCopyKeyBtn = document.getElementById('rzp-copy-key-btn');
  const rzpIssuedKey = document.getElementById('rzp-issued-key');
  const rzpFinishBtn = document.getElementById('rzp-finish-btn');

  // License Validation Form Elements
  const licenseForm = document.getElementById('license-check-form');
  const licenseResult = document.getElementById('license-verify-result');

  // State
  let currentPeriod = 'monthly'; // 'monthly' | 'yearly'
  let currentCurrency = 'INR';    // 'INR' | 'USD'
  let appliedDiscount = 0;        // 0 or 50 (%)
  let activeSelectedPlan = 'pro'; // 'starter' | 'pro' | 'yearly'

  // Pricing Matrix (Starter Trial: ₹0 / $0, Pro: ₹499 / $7, Studio: ₹999 / $14 | Yearly: Pro ₹3,499 / $45, Studio ₹6,999 / $89)
  const priceData = {
    INR: {
      symbol: '₹',
      starter: { monthly: 0, yearly: 0 },
      pro: { monthly: 499, yearly: 3499 },
      studio: { monthly: 999, yearly: 6999 }
    },
    USD: {
      symbol: '$',
      starter: { monthly: 0, yearly: 0 },
      pro: { monthly: 7, yearly: 45 },
      studio: { monthly: 14, yearly: 89 }
    }
  };

  function updatePriceDisplay() {
    const sym = priceData[currentCurrency].symbol;
    const isYear = currentPeriod === 'yearly';

    // 1. Starter Trial Price (Always ₹0 / $0 and / 1 Day)
    if (elPriceStarter) {
      elPriceStarter.textContent = `${sym}0`;
    }
    if (elPeriodStarter) {
      elPeriodStarter.textContent = '/ 1 Day';
    }

    // 2. Pro Photographer Price (₹499 / $7 monthly, ₹3,499 / $45 yearly)
    if (elPricePro) {
      let rawPro = priceData[currentCurrency].pro[currentPeriod];
      let finalPro = appliedDiscount > 0 ? Math.round(rawPro * (1 - appliedDiscount / 100)) : rawPro;
      elPricePro.textContent = `${sym}${finalPro.toLocaleString()}`;
    }
    if (elPeriodPro) {
      elPeriodPro.textContent = isYear ? '/ year' : '/ month';
    }

    // 3. Studio & Agency Price (₹999 / $14 monthly, ₹6,999 / $89 yearly)
    if (elPriceStudio) {
      let rawStudio = priceData[currentCurrency].studio[currentPeriod];
      let finalStudio = appliedDiscount > 0 ? Math.round(rawStudio * (1 - appliedDiscount / 100)) : rawStudio;
      elPriceStudio.textContent = `${sym}${finalStudio.toLocaleString()}`;
    }
    if (elPeriodStudio) {
      elPeriodStudio.textContent = isYear ? '/ year' : '/ month';
    }
  }

  // 1. Tab Switching
  tabPlansTrigger?.addEventListener('click', () => {
    tabPlansTrigger.classList.add('active');
    tabLicenseTrigger?.classList.remove('active');
    if (pricingPlansView) pricingPlansView.style.display = 'block';
    if (pricingLicenseView) pricingLicenseView.style.display = 'none';
  });

  tabLicenseTrigger?.addEventListener('click', () => {
    tabLicenseTrigger.classList.add('active');
    tabPlansTrigger?.classList.remove('active');
    if (pricingPlansView) pricingPlansView.style.display = 'none';
    if (pricingLicenseView) pricingLicenseView.style.display = 'block';
  });

  // 2. Billing Toggle (Monthly vs Yearly)
  btnMonthly?.addEventListener('click', () => {
    currentPeriod = 'monthly';
    btnMonthly.classList.add('active');
    btnYearly?.classList.remove('active');
    updatePriceDisplay();
  });

  btnYearly?.addEventListener('click', () => {
    currentPeriod = 'yearly';
    btnYearly.classList.add('active');
    btnMonthly?.classList.remove('active');
    updatePriceDisplay();
  });

  // 3. Currency Toggle (INR vs USD)
  btnInr?.addEventListener('click', () => {
    currentCurrency = 'INR';
    btnInr.classList.add('active');
    btnUsd?.classList.remove('active');
    updatePriceDisplay();
  });

  btnUsd?.addEventListener('click', () => {
    currentCurrency = 'USD';
    btnUsd.classList.add('active');
    btnInr?.classList.remove('active');
    updatePriceDisplay();
  });

  // 4. Coupon Code System
  couponApplyBtn?.addEventListener('click', () => {
    const code = couponInput?.value.trim().toUpperCase();
    if (code === 'ANIL50' || code === 'QUICKART50' || code === 'SPECIAL50') {
      appliedDiscount = 50;
      updatePriceDisplay();
      showToast('🎉 Coupon Applied! 50% Flat Discount Unlocked!', 'success');
      if (couponInput) couponInput.style.borderColor = '#10b981';
    } else if (code) {
      showToast('Invalid Coupon. Try code: ANIL50', 'error');
    } else {
      showToast('Please enter a coupon code.', 'info');
    }
  });

  // 5. Razorpay Modal Integration
  rzpPayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeSelectedPlan = btn.dataset.plan || 'pro';
      const isYear = currentPeriod === 'yearly';
      const sym = priceData[currentCurrency].symbol;
      const rawPrice = priceData[currentCurrency][activeSelectedPlan] ? priceData[currentCurrency][activeSelectedPlan][currentPeriod] : 499;
      const finalPrice = appliedDiscount > 0 ? Math.round(rawPrice * (1 - appliedDiscount / 100)) : rawPrice;

      let planTitle = 'Pro Photographer Plan';
      if (activeSelectedPlan === 'studio') planTitle = 'Studio & Agency Plan';

      if (rzpSummaryPlan) {
        rzpSummaryPlan.textContent = `${planTitle} (${isYear ? 'Yearly' : 'Monthly'})`;
      }
      if (rzpSummaryAmount) {
        rzpSummaryAmount.textContent = `${sym}${finalPrice.toLocaleString()}`;
      }
      if (rzpDiscountTag) {
        rzpDiscountTag.style.display = appliedDiscount > 0 ? 'block' : 'none';
        if (appliedDiscount > 0) rzpDiscountTag.textContent = `${appliedDiscount}% OFF Applied (ANIL50)`;
      }

      // Reset modal view
      if (rzpStepForm) rzpStepForm.style.display = 'block';
      if (rzpStepSuccess) rzpStepSuccess.style.display = 'none';
      if (rzpModal) rzpModal.style.display = 'flex';
    });
  });

  rzpCloseBtn?.addEventListener('click', () => {
    if (rzpModal) rzpModal.style.display = 'none';
  });

  rzpFinishBtn?.addEventListener('click', () => {
    if (rzpModal) rzpModal.style.display = 'none';
  });

  // Handle Razorpay Form Submission
  rzpCheckoutForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('rzp-cust-name')?.value || 'Valued Studio';
    const phone = document.getElementById('rzp-cust-phone')?.value || '+91 9939800780';
    const email = document.getElementById('rzp-cust-email')?.value || 'photographer@quickart.in';

    const submitBtn = document.getElementById('rzp-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>⏳ Verifying Razorpay Gateway...</span>`;
    }

    // Generate Unique License Key
    const randPart = Math.floor(1000 + Math.random() * 9000);
    const key = `APF-${activeSelectedPlan.toUpperCase()}-${randPart}-2026-IN`;

    setTimeout(() => {
      // Save Paid Lead to Lead CRM
      saveLeadRecord({
        id: `RZP-${Date.now().toString().slice(-6)}`,
        name: name,
        email: email,
        phone: phone,
        platform: navigator.platform.includes('Mac') ? 'macOS (Apple Silicon)' : 'Windows (x64)',
        type: `PAID: ${activeSelectedPlan.toUpperCase()} (${currentPeriod.toUpperCase()} - ${currentCurrency})`,
        trialKey: key,
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      });

      // Update success screen
      if (rzpIssuedKey) rzpIssuedKey.textContent = key;
      const txnEl = document.getElementById('rzp-txn-id');
      if (txnEl) txnEl.textContent = `pay_Rzp${Date.now().toString().slice(-8)}`;

      if (rzpStepForm) rzpStepForm.style.display = 'none';
      if (rzpStepSuccess) rzpStepSuccess.style.display = 'block';

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>🔒 Pay Securely with Razorpay</span>`;
      }

      showToast('🎉 Payment Confirmed! License Issued.', 'success');

      // Automatically trigger app download after capturing paid lead details
      const userPlatform = (navigator.platform.toUpperCase().includes('MAC') || navigator.userAgent.includes('Mac')) ? 'mac' : 'win';
      setTimeout(() => {
        triggerDownload(userPlatform);
      }, 600);
    }, 1200);
  });

  // Direct Download Button on Razorpay Success Screen
  document.getElementById('rzp-direct-dl-btn')?.addEventListener('click', () => {
    const userPlatform = (navigator.platform.toUpperCase().includes('MAC') || navigator.userAgent.includes('Mac')) ? 'mac' : 'win';
    triggerDownload(userPlatform);
  });

  // Copy License Key Button
  rzpCopyKeyBtn?.addEventListener('click', () => {
    if (rzpIssuedKey) {
      navigator.clipboard.writeText(rzpIssuedKey.textContent);
      rzpCopyKeyBtn.textContent = 'Copied!';
      setTimeout(() => { rzpCopyKeyBtn.textContent = 'Copy'; }, 2000);
      showToast('License Key copied to clipboard!', 'success');
    }
  });

  // 6. License Verification Form
  licenseForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputVal = document.getElementById('license-input-field')?.value.trim();
    if (!inputVal) return;

    if (licenseResult) {
      licenseResult.style.display = 'block';
      const keyTxt = document.getElementById('verified-key-txt');
      if (keyTxt) keyTxt.textContent = inputVal.toUpperCase().includes('APF') ? inputVal.toUpperCase() : `APF-PRO-9842-8812-IN (${inputVal})`;
      showToast('✓ Valid Commercial Studio License Found!', 'success');
    }
  });

  // Initialize prices on page load
  updatePriceDisplay();
}

/* ==========================================================================
   7. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

/* ==========================================================================
   8. ADMIN PORTAL (CRM, Webhook Manager & Manual Lead Deletion)
   ========================================================================== */
function initAdminPortal() {
  const leadsTableBody = document.getElementById('admin-leads-tbody');
  const totalLeadsEl = document.getElementById('admin-total-leads');
  const macLeadsEl = document.getElementById('admin-mac-leads');
  const winLeadsEl = document.getElementById('admin-win-leads');
  const searchInput = document.getElementById('admin-search-input');
  const btnExportCsv = document.getElementById('admin-export-csv-btn');
  const btnClearLeads = document.getElementById('admin-clear-leads-btn');

  // Webhook Controls
  const webhookInput = document.getElementById('admin-webhook-url');
  const btnSaveWebhook = document.getElementById('admin-save-webhook-btn');
  const btnTestWebhook = document.getElementById('admin-test-webhook-btn');
  const webhookBadge = document.getElementById('admin-webhook-badge');

  if (!leadsTableBody) return;

  // Initialize Webhook UI State
  function refreshWebhookBadge() {
    const savedUrl = localStorage.getItem('photoFlowCrmWebhookUrl') || '';
    if (webhookInput) webhookInput.value = savedUrl;
    if (webhookBadge) {
      if (savedUrl) {
        webhookBadge.textContent = '🟢 Webhook Active (Connected)';
        webhookBadge.style.background = 'rgba(16, 185, 129, 0.2)';
        webhookBadge.style.color = '#34d399';
        webhookBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      } else {
        webhookBadge.textContent = '⚪ Webhook Not Configured';
        webhookBadge.style.background = 'rgba(100, 116, 139, 0.2)';
        webhookBadge.style.color = 'var(--text-muted)';
        webhookBadge.style.borderColor = 'var(--border-subtle)';
      }
    }
  }

  refreshWebhookBadge();

  // Save Webhook Button
  btnSaveWebhook?.addEventListener('click', () => {
    const url = webhookInput ? webhookInput.value.trim() : '';
    if (url) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        alert('Kripya valid Webhook URL enter karein (https:// se shuru hona chahiye)');
        return;
      }
      localStorage.setItem('photoFlowCrmWebhookUrl', url);
      showToast('✓ Ai BotFlow / CRM Webhook successfully saved!', 'success');
    } else {
      localStorage.removeItem('photoFlowCrmWebhookUrl');
      showToast('Webhook URL removed.', 'info');
    }
    refreshWebhookBadge();
  });

  // Test Webhook Button
  btnTestWebhook?.addEventListener('click', async () => {
    const url = webhookInput ? webhookInput.value.trim() : '';
    if (!url) {
      alert('Pehle apna Ai BotFlow / CRM Webhook URL enter karke "Save Webhook" dabayein!');
      return;
    }
    showToast('Sending test ping to CRM Webhook...', 'info');
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'Ai PhotoFlow Website (Admin Test)',
          event: 'test_webhook_ping',
          timestamp: new Date().toISOString(),
          lead: {
            id: 'TEST-LEAD-001',
            name: 'Anil Sharma Studio (Test)',
            phone: '9939800780',
            studio: 'Quick Art Photography Academy',
            email: 'support@quickartphotography.in',
            platform: 'macOS & Windows',
            date: new Date().toLocaleString(),
            status: 'Test Connection Successful'
          }
        }),
        mode: 'no-cors'
      });
      showToast('✓ Test lead sent! Check your Ai BotFlow / CRM dashboard.', 'success');
    } catch (err) {
      alert('Webhook connection test error: ' + err.message);
    }
  });

  // Default seed leads if empty
  let leads = [];
  try {
    leads = JSON.parse(localStorage.getItem('photoFlowLeads')) || [];
  } catch (e) {
    leads = [];
  }

  if (leads.length === 0) {
    leads = [
      {
        id: 'PF-1001',
        name: 'Anil Sharma',
        email: 'anil@quickartphotography.in',
        phone: '9939800780',
        studio: 'Quick Art Photography',
        platform: 'macOS (Apple Silicon)',
        date: 'Today, 10:15 AM',
        status: 'Founder Studio'
      },
      {
        id: 'PF-1002',
        name: 'Rajesh Verma',
        email: 'rajesh.studio@gmail.com',
        phone: '9821034455',
        studio: 'Royal Wedding Cinema (Patna)',
        platform: 'Windows (64-bit)',
        date: 'Yesterday, 04:30 PM',
        status: 'Active Lead'
      },
      {
        id: 'PF-1003',
        name: 'Vikram Singh',
        email: 'vikram@memoriesstudio.in',
        phone: '9711823901',
        studio: 'Singh Productions (Varanasi)',
        platform: 'macOS (Apple Silicon)',
        date: '03 Oct 2026',
        status: 'Active Lead'
      }
    ];
    localStorage.setItem('photoFlowLeads', JSON.stringify(leads));
  }

  function renderLeadsTable(filtered = leads) {
    leadsTableBody.innerHTML = '';
    let macCount = 0;
    let winCount = 0;

    leads.forEach(l => {
      if (l.platform && l.platform.includes('macOS')) macCount++;
      else winCount++;
    });

    if (totalLeadsEl) totalLeadsEl.textContent = leads.length;
    if (macLeadsEl) macLeadsEl.textContent = macCount;
    if (winLeadsEl) winLeadsEl.textContent = winCount;

    if (filtered.length === 0) {
      leadsTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">No studio leads found.</td></tr>`;
      return;
    }

    filtered.forEach(lead => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-cyan);">${lead.id || 'PF-0000'}</td>
        <td>
          <strong style="color: #fff;">${lead.name}</strong>
          <div style="font-size: 0.76rem; color: var(--text-muted);">${lead.studio || 'Individual'}</div>
        </td>
        <td><a href="mailto:${lead.email}" style="color: var(--text-secondary); text-decoration: underline;">${lead.email}</a></td>
        <td>
          <a href="https://wa.me/91${(lead.phone || '').replace(/[^0-9]/g, '')}" target="_blank" style="color: #25d366; font-weight: 600; display: inline-flex; align-items: center; gap: 0.3rem;">
            <span>💬 ${lead.phone || 'N/A'}</span>
          </a>
        </td>
        <td><span class="badge" style="font-size: 0.72rem;">${lead.platform || 'Desktop'}</span></td>
        <td style="font-size: 0.8rem; color: var(--text-muted);">${lead.date || 'Recent'}</td>
        <td style="text-align: center;">
          <button type="button" class="btn btn-outline btn-sm admin-del-lead-btn" data-id="${lead.id}" title="Delete this lead" style="color: #f43f5e; border-color: rgba(244, 63, 94, 0.4); padding: 0.3rem 0.7rem; font-size: 0.78rem; border-radius: 6px; cursor: pointer;">
            🗑️ Delete
          </button>
        </td>
      `;
      leadsTableBody.appendChild(tr);
    });

    // Attach Individual Lead Delete Handlers
    leadsTableBody.querySelectorAll('.admin-del-lead-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const targetLead = leads.find(l => l.id === id);
        const name = targetLead ? targetLead.name : id;
        if (confirm(`Kya aap sach me "${name}" (${id}) ki lead delete karna chahte hain?`)) {
          leads = leads.filter(l => l.id !== id);
          localStorage.setItem('photoFlowLeads', JSON.stringify(leads));
          renderLeadsTable();
          showToast(`✓ Lead "${name}" deleted!`, 'info');
        }
      });
    });
  }

  renderLeadsTable();

  // Search filter
  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = leads.filter(l => 
      l.name.toLowerCase().includes(query) || 
      l.email.toLowerCase().includes(query) || 
      (l.phone && l.phone.includes(query)) ||
      (l.studio && l.studio.toLowerCase().includes(query))
    );
    renderLeadsTable(filtered);
  });

  // Export to CSV Function
  btnExportCsv?.addEventListener('click', () => {
    let csvContent = 'data:text/csv;charset=utf-8,ID,Name,Studio Name,Email,Phone,Platform,Registration Date,Status\n';
    leads.forEach(l => {
      const row = [
        `"${l.id}"`,
        `"${l.name}"`,
        `"${l.studio || ''}"`,
        `"${l.email}"`,
        `"${l.phone || ''}"`,
        `"${l.platform || ''}"`,
        `"${l.date || ''}"`,
        `"${l.status || 'Active'}"`
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ai_PhotoFlow_Registered_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Leads database exported to CSV / Excel!', 'success');
  });

  // Clear leads
  btnClearLeads?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the local leads database?')) {
      localStorage.removeItem('photoFlowLeads');
      leads = [];
      renderLeadsTable();
      showToast('Leads reset.', 'info');
    }
  });

  // Marketing Agents Rendering
  const agentsTableBody = document.getElementById('admin-agents-tbody');
  const btnExportAgents = document.getElementById('admin-export-agents-btn');

  if (agentsTableBody) {
    let agentLeads = [];
    try {
      agentLeads = JSON.parse(localStorage.getItem('photoFlowAgentLeads')) || [];
    } catch (e) {
      agentLeads = [];
    }

    if (agentLeads.length === 0) {
      agentLeads = [
        {
          id: 'PF-ANIL-4001',
          name: 'Anil Sharma (Mentor)',
          role: 'Quick Art Photography Academy',
          city: 'Siwan, Bihar',
          phone: '9939800780',
          expectedLeads: '31+ Studios (Platinum Tier - 30%)',
          payoutUpi: '9939800780@ybl',
          referralLink: 'https://aiphotoflow.in/?ref=PF-ANIL-4001',
          status: 'Founding Partner (30%)'
        },
        {
          id: 'PF-RAVI-4022',
          name: 'Ravi Teja Color Lab',
          role: 'Photo Lab & Album Hub Owner',
          city: 'Hyderabad, TS',
          phone: '9849012345',
          expectedLeads: '16 to 30+ Studios (Gold Tier - 25%)',
          payoutUpi: 'ravilab@oksbi',
          referralLink: 'https://aiphotoflow.in/?ref=PF-RAVI-4022',
          status: 'Active Partner (25%)'
        }
      ];
      localStorage.setItem('photoFlowAgentLeads', JSON.stringify(agentLeads));
    }

    function renderAgentsTable() {
      agentsTableBody.innerHTML = '';
      agentLeads.forEach(agent => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="font-family: var(--font-mono); font-weight: 700; color: #fbbf24;">${agent.id}</td>
          <td>
            <strong style="color: #fff;">${agent.name}</strong>
            <div style="font-size: 0.76rem; color: var(--text-muted);">${agent.role || 'Partner'}</div>
          </td>
          <td><span style="color: var(--text-secondary); font-size: 0.85rem;">${agent.city || 'India'}</span></td>
          <td>
            <a href="https://wa.me/91${(agent.phone || '').replace(/[^0-9]/g, '')}" target="_blank" style="color: #25d366; font-weight: 600; display: inline-flex; align-items: center; gap: 0.3rem;">
              <span>💬 ${agent.phone || 'N/A'}</span>
            </a>
          </td>
          <td><span class="badge badge-gold" style="font-size: 0.72rem;">${agent.expectedLeads || 'Gold Partner'}</span></td>
          <td style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--accent-cyan);">${agent.payoutUpi || 'Pending UPI'}</td>
          <td>
            <span class="badge badge-emerald" style="font-size: 0.72rem;">Active (30%)</span>
          </td>
          <td style="text-align: center;">
            <button type="button" class="btn btn-outline btn-sm admin-del-agent-btn" data-id="${agent.id}" title="Delete this partner" style="color: #f43f5e; border-color: rgba(244, 63, 94, 0.4); padding: 0.3rem 0.7rem; font-size: 0.78rem; border-radius: 6px; cursor: pointer;">
              🗑️ Delete
            </button>
          </td>
        `;
        agentsTableBody.appendChild(tr);
      });

      // Attach Agent Delete Handlers
      agentsTableBody.querySelectorAll('.admin-del-agent-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          const targetAgent = agentLeads.find(a => a.id === id);
          const name = targetAgent ? targetAgent.name : id;
          if (confirm(`Kya aap sach me Agent "${name}" (${id}) ko delete karna chahte hain?`)) {
            agentLeads = agentLeads.filter(a => a.id !== id);
            localStorage.setItem('photoFlowAgentLeads', JSON.stringify(agentLeads));
            renderAgentsTable();
            showToast(`✓ Agent "${name}" deleted!`, 'info');
          }
        });
      });
    }

    renderAgentsTable();

    btnExportAgents?.addEventListener('click', () => {
      let csv = 'data:text/csv;charset=utf-8,Agent ID,Name,Role,City,Phone,Volume Tier,UPI ID,Referral URL\n';
      agentLeads.forEach(a => {
        csv += `"${a.id}","${a.name}","${a.role || ''}","${a.city || ''}","${a.phone || ''}","${a.expectedLeads || ''}","${a.payoutUpi || ''}","${a.referralLink || ''}"\n`;
      });
      const encoded = encodeURI(csv);
      const link = document.createElement('a');
      link.setAttribute('href', encoded);
      link.setAttribute('download', `Ai_PhotoFlow_Marketing_Agents_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Marketing Agents list exported to CSV!', 'success');
    });
  }
}

/* ==========================================================================
   9. TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00c2ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ==========================================================================
   10. INTERACTIVE ROI STUDIO CALCULATOR
   ========================================================================== */
function initRoiCalculator() {
  const slider = document.getElementById('roi-slider');
  const displayWeddings = document.getElementById('roi-weddings-display');
  const displayRaw = document.getElementById('roi-total-raw');
  const displayHours = document.getElementById('roi-hours-saved');
  const displayMoney = document.getElementById('roi-money-saved');

  if (!slider) return;

  function updateRoi() {
    const weddings = parseInt(slider.value, 10);
    const totalRaw = weddings * 8000;
    // Manual culling takes ~20 hours. Ai PhotoFlow takes ~15 mins (0.25 hrs).
    const hoursSaved = (weddings * 19.75).toFixed(1);
    // Average editor cost saved ~ ₹7,000 per wedding
    const moneySaved = Math.round(weddings * 7000);

    if (displayWeddings) displayWeddings.textContent = `${weddings} Weddings`;
    if (displayRaw) displayRaw.textContent = totalRaw.toLocaleString('en-IN');
    if (displayHours) displayHours.textContent = `${hoursSaved} Hrs`;
    if (displayMoney) displayMoney.textContent = `₹${moneySaved.toLocaleString('en-IN')}`;
  }

  slider.addEventListener('input', updateRoi);
  updateRoi();
}

/* ==========================================================================
   11. MARKETING AGENT & REFERRAL CALCULATOR & APPLICATION ENGINE (30%)
   ========================================================================== */
function initAffiliateCalculator() {
  const slider = document.getElementById('aff-studios-range');
  const studiosVal = document.getElementById('aff-studios-val');
  const planButtons = document.querySelectorAll('.calc-plan-btn');
  const monthlyResult = document.getElementById('aff-monthly-result');
  const yearlyResult = document.getElementById('aff-yearly-result');
  const tierBadge = document.getElementById('aff-tier-badge');
  const tierTitle = document.getElementById('aff-tier-title');

  if (!slider || !monthlyResult) return;

  let activePlanPrice = 999;

  function calculateAffiliateCommission() {
    const count = parseInt(slider.value, 10);
    if (studiosVal) studiosVal.textContent = `${count} Studios`;

    // Tier determination (Silver: 20%, Gold: 25%, Platinum: 30%)
    let rate = 0.20;
    let badgeText = '🥉 Silver Agent (20% Share)';
    let badgeColor = 'rgba(148, 163, 184, 0.2)';
    let badgeBorder = 'rgba(148, 163, 184, 0.4)';
    let textColor = '#cbd5e1';

    if (count > 30) {
      rate = 0.30;
      badgeText = '🥇 Platinum Elite (30% Share)';
      badgeColor = 'rgba(0, 194, 255, 0.2)';
      badgeBorder = 'rgba(0, 194, 255, 0.5)';
      textColor = '#38bdf8';
    } else if (count > 10) {
      rate = 0.25;
      badgeText = '🥈 Gold Partner (25% Share)';
      badgeColor = 'rgba(245, 158, 11, 0.2)';
      badgeBorder = 'rgba(245, 158, 11, 0.5)';
      textColor = '#fbbf24';
    }

    const monthlyTotal = Math.round(count * activePlanPrice * rate);
    const yearlyTotal = monthlyTotal * 12;

    if (monthlyResult) monthlyResult.textContent = `₹${monthlyTotal.toLocaleString('en-IN')}`;
    if (yearlyResult) yearlyResult.textContent = `₹${yearlyTotal.toLocaleString('en-IN')} / year`;
    if (tierTitle) tierTitle.textContent = badgeText;
    if (tierBadge) {
      tierBadge.style.background = badgeColor;
      tierBadge.style.borderColor = badgeBorder;
      tierBadge.style.color = textColor;
    }
  }

  slider.addEventListener('input', calculateAffiliateCommission);

  planButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      planButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePlanPrice = parseInt(btn.dataset.price, 10) || 999;
      calculateAffiliateCommission();
    });
  });

  calculateAffiliateCommission();
}

function initAffiliateForm() {
  const form = document.getElementById('affiliate-application-form');
  const successBox = document.getElementById('agent-success-box');
  const displayLink = document.getElementById('agent-display-link');
  const copyBtn = document.getElementById('agent-copy-btn');
  const waShareBtn = document.getElementById('agent-whatsapp-share-btn');

  if (!form || !successBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('agent-name')?.value.trim();
    const phone = document.getElementById('agent-phone')?.value.trim();
    const email = document.getElementById('agent-email')?.value.trim();
    const city = document.getElementById('agent-city')?.value.trim();
    const role = document.getElementById('agent-role')?.value;
    const leadsExp = document.getElementById('agent-expected-leads')?.value;
    const upi = document.getElementById('agent-payout-upi')?.value.trim();

    if (!name || !phone) return;

    // Generate Unique Agent Ref Code
    const cleanName = name.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase() || 'AGT';
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const agentCode = `PF-${cleanName}-${randNum}`;
    const referralLink = `https://aiphotoflow.in/?ref=${agentCode}`;

    const agentRecord = {
      id: agentCode,
      name,
      phone,
      email,
      city,
      role,
      expectedLeads: leadsExp,
      payoutUpi: upi,
      referralLink,
      registeredAt: new Date().toLocaleString('en-IN'),
      status: 'Active Marketing Partner (Up to 30%)'
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('photoFlowAgentLeads')) || [];
      existing.unshift(agentRecord);
      localStorage.setItem('photoFlowAgentLeads', JSON.stringify(existing));
    } catch (err) {
      console.warn('Storage failed', err);
    }

    // Display Result Box
    if (displayLink) displayLink.textContent = referralLink;
    if (waShareBtn) {
      const waText = encodeURIComponent(
        `Hi! I have started using Ai PhotoFlow — India's fastest AI post-production desktop software for wedding photographers. It culls & edits 2,000 RAW photos in 15 mins with Indian skin tone protection. Use my partner link to get a 1-day free pass + 10% OFF: ${referralLink}`
      );
      waShareBtn.href = `https://wa.me/?text=${waText}`;
    }

    form.style.display = 'none';
    successBox.style.display = 'block';
    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  if (copyBtn && displayLink) {
    copyBtn.addEventListener('click', () => {
      const text = displayLink.textContent;
      navigator.clipboard.writeText(text).then(() => {
        const orig = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => copyBtn.textContent = orig, 2500);
      });
    });
  }
}

