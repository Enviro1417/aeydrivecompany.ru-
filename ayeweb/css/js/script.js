(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  body.classList.add('is-ready');

  const nav = document.querySelector('#mainNav');
  const toggle = document.querySelector('#menuToggle');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
      });
    });
  }

  const normalize = (path) => {
    if (!path || path === '/') return 'index.html';
    return path.split('/').pop() || 'index.html';
  };

  const current = normalize(window.location.pathname);
  document.querySelectorAll('.main-nav a').forEach((link) => {
    const href = normalize(link.getAttribute('href'));
    if (href === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  const markRevealGroup = (selector, step = 90) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
      element.classList.add('reveal');
      element.style.setProperty('--reveal-delay', `${(index % 4) * step}ms`);
    });
  };

  markRevealGroup('.section-head', 70);
  markRevealGroup('.card', 90);
  markRevealGroup('.panel', 100);
  markRevealGroup('.faq-item', 85);
  markRevealGroup('.contact-map, .form-grid', 120);

  document.querySelectorAll('.split .panel:nth-child(odd)').forEach((panel) => {
    panel.dataset.reveal = 'left';
  });

  document.querySelectorAll('.split .panel:nth-child(even)').forEach((panel) => {
    panel.dataset.reveal = 'right';
  });

  const revealItems = Array.from(document.querySelectorAll('.reveal'));
  if (revealItems.length) {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.18,
          rootMargin: '0px 0px -8% 0px',
        },
      );

      revealItems.forEach((item) => revealObserver.observe(item));
    }
  }

  const counters = Array.from(document.querySelectorAll('.counter[data-count]'));
  if (counters.length) {
    const animateCounter = (element) => {
      const end = Number(element.dataset.count || 0);
      const suffix = element.dataset.suffix || '';
      const duration = 1400;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(end * eased);
        element.textContent = `${value}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    if (reducedMotion || !('IntersectionObserver' in window)) {
      counters.forEach((counter) => {
        counter.textContent = `${counter.dataset.count}${counter.dataset.suffix || ''}`;
      });
    } else {
      const counterObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.4 },
      );

      counters.forEach((counter) => counterObserver.observe(counter));
    }
  }

  document.querySelectorAll('.faq-item').forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach((openItem) => {
        if (openItem === item) return;
        openItem.classList.remove('open');
        const openQuestion = openItem.querySelector('.faq-question');
        const openAnswer = openItem.querySelector('.faq-answer');
        if (openQuestion) openQuestion.setAttribute('aria-expanded', 'false');
        if (openAnswer) openAnswer.style.maxHeight = '0px';
      });

      if (isOpen) {
        item.classList.remove('open');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0px';
      } else {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-inner">
      <button class="lightbox-close" type="button" aria-label="Закрыть">×</button>
      <img src="" alt="" />
      <div class="lightbox-caption"></div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  const openLightbox = (src, alt = '') => {
    if (!src) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightboxCaption.textContent = alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox || event.target.classList.contains('lightbox-close')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

  const clickableImages = Array.from(document.querySelectorAll('main img')).filter((img) => {
    return !img.closest('.logo') && !img.closest('.review-head');
  });

  clickableImages.forEach((img) => {
    img.addEventListener('click', () => {
      openLightbox(img.currentSrc || img.src, img.alt || 'Фото');
    });
  });

  const contactMap = document.querySelector('.contact-map');
  if (contactMap) {
    contactMap.addEventListener('click', () => {
      openLightbox('images/contact.png', 'Контакты AEY Drive');
    });
  }

  const internalLinks = document.querySelectorAll('a[href]');
  internalLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href') || '';
      if (
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        link.target === '_blank' ||
        link.classList.contains('no-transition')
      ) {
        return;
      }

      event.preventDefault();
      body.classList.add('is-leaving');
      window.setTimeout(() => {
        window.location.href = href;
      }, 260);
    });
  });

  const leadForm = document.querySelector('#leadForm');
  const formStatus = document.querySelector('#formStatus');

  const setStatus = (message, type = '') => {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.classList.remove('success', 'error');
    if (type) formStatus.classList.add(type);
  };

  if (!leadForm) return;

  leadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = leadForm.querySelector('button[type="submit"]');
    const formData = new FormData(leadForm);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      message: String(formData.get('message') || '').trim(),
      page: window.location.href,
    };

    if (!payload.name || !payload.phone || !payload.message) {
      setStatus('Пожалуйста, заполните все поля формы.', 'error');
      return;
    }

    if (submitButton) submitButton.disabled = true;
    setStatus('Отправляем заявку...');

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      leadForm.reset();
      setStatus('Заявка отправлена. Мы скоро свяжемся с вами.', 'success');
    } catch (error) {
      setStatus('Не удалось отправить заявку. Попробуйте еще раз или позвоните нам.', 'error');
      console.error(error);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
})();
