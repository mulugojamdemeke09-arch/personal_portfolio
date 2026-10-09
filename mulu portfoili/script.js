/* ==========================================================================
   Mulugojam Demeke — Portfolio
   Front-end interactions: navigation, scroll effects, resume download, toast
   ========================================================================== */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------------
     Toast
     ---------------------------------------------------------------------- */
  var toastEl = document.getElementById('toast');
  var toastTimer = null;

  function showToast(message, icon) {
    if (!toastEl) return;
    toastEl.innerHTML =
      '<i class="fa-solid ' + (icon || 'fa-circle-check') + '" aria-hidden="true"></i><span>' + message + '</span>';
    toastEl.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 2600);
  }

  /* ----------------------------------------------------------------------
     Sticky navbar + back-to-top
     ---------------------------------------------------------------------- */
  var navbar = document.getElementById('navbar');
  var toTop = document.getElementById('toTop');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (navbar) navbar.classList.toggle('is-scrolled', y > 20);
    if (toTop) toTop.classList.toggle('is-visible', y > 600);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  /* ----------------------------------------------------------------------
     Mobile menu
     ---------------------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    if (!mobileMenu || !navToggle) return;
    mobileMenu.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function (event) {
      event.stopPropagation();
      var isOpen = mobileMenu.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', function (event) {
      if (!mobileMenu.classList.contains('is-open')) return;
      if (mobileMenu.contains(event.target) || navToggle.contains(event.target)) return;
      closeMobileMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024) closeMobileMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMobileMenu();
    });
  }

  /* ----------------------------------------------------------------------
     Smooth scrolling for in-page anchors
     ---------------------------------------------------------------------- */
  var anchorLinks = document.querySelectorAll('a[href^="#"]');

  Array.prototype.forEach.call(anchorLinks, function (link) {
    link.addEventListener('click', function (event) {
      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      var target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      closeMobileMenu();

      var offset = navbar ? navbar.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - offset - 12;

      window.scrollTo({ top: top, behavior: prefersReduced ? 'auto' : 'smooth' });
      if (history.replaceState) history.replaceState(null, '', hash);
    });
  });

  /* ----------------------------------------------------------------------
     Scroll spy — highlight the section in view
     ---------------------------------------------------------------------- */
  var navLinks = document.querySelectorAll('.nav-link');

  if (navLinks.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          Array.prototype.forEach.call(navLinks, function (l) {
            l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id);
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    Array.prototype.forEach.call(navLinks, function (link) {
      var section = document.querySelector(link.getAttribute('href'));
      if (section) spy.observe(section);
    });
  }

  /* ----------------------------------------------------------------------
     Reveal on scroll
     ---------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');

  Array.prototype.forEach.call(revealEls, function (el, index) {
    el.style.transitionDelay = (index % 3) * 80 + 'ms';
  });

  if (prefersReduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealEls, function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    );

    Array.prototype.forEach.call(revealEls, function (el) {
      revealObserver.observe(el);
    });
  }

  /* ----------------------------------------------------------------------
     Subtle parallax on the hero portrait (desktop only)
     ---------------------------------------------------------------------- */
  var heroPhoto = document.querySelector('.hero-photo img');

  if (heroPhoto && !prefersReduced && window.matchMedia('(min-width: 901px)').matches) {
    window.addEventListener(
      'scroll',
      function () {
        var y = window.scrollY || window.pageYOffset;
        if (y < 900) heroPhoto.style.transform = 'translateY(' + y * 0.045 + 'px) scale(1.08)';
      },
      { passive: true }
    );
  }

  /* ----------------------------------------------------------------------
     Download resume — builds a printable resume file client-side
     ---------------------------------------------------------------------- */
  var RESUME = {
    name: 'Mulugojam Demeke',
    role: 'Full Stack Developer & Software Engineer',
    email: 'Mulugojamdemeke09@gmail.com',
    phone: '0930893127',
    location: 'Addis Ababa, Ethiopia',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    summary:
      'Full Stack Developer and Software Engineer with a passion for building modern, scalable web applications. Experienced with both front-end and back-end technologies, solving complex problems, and continuously learning new tools and frameworks.',
    skills:
      'HTML, CSS, JavaScript, TypeScript, PHP, React, Next.js, Node.js, Express.js, MySQL, MongoDB, Git, Docker',
    experience: [
      {
        role: 'Full Stack Developer',
        company: 'Freelance / Remote',
        period: '2022 — Present',
        points: [
          'Designed and shipped full-stack web applications using React, Node.js and MongoDB.',
          'Built REST APIs, authentication flows and admin dashboards end to end.',
          'Wrote clean, reusable code and participated in code reviews to maintain quality.',
          'Worked directly with clients to translate requirements into shipped features.'
        ]
      },
      {
        role: 'Software Engineer Intern',
        company: 'Remote',
        period: '2021 — 2022',
        points: [
          'Contributed to front-end features using JavaScript and React.',
          'Assisted in building and testing API endpoints backed by Node.js and MySQL.',
          'Fixed bugs, wrote documentation and joined daily code reviews.'
        ]
      }
    ],
    education: [
      {
        degree: 'B.Sc. in Computer Science',
        school: 'Unity University',
        period: '2018 — 2022',
        detail: 'Focused on software engineering, data structures, algorithms, and web technologies.'
      }
    ],
    projects: [
      { title: 'Online Bookstore', tech: 'React, Node.js, MongoDB' },
      { title: 'Bus Reservation System', tech: 'Java, MySQL, OOP' },
      { title: 'Apartment Rental Management', tech: 'C#, ADO.NET, SQL Server' }
    ]
  };

  function buildResumeHtml() {
    var accent = '#E82B5C';

    var expHtml = RESUME.experience
      .map(function (job) {
        return (
          '<div class="item">' +
          '<div class="row"><h3>' + job.role + '</h3><span>' + job.period + '</span></div>' +
          '<p class="meta">' + job.company + '</p>' +
          '<ul>' + job.points.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul>' +
          '</div>'
        );
      })
      .join('');

    var eduHtml = RESUME.education
      .map(function (ed) {
        return (
          '<div class="item">' +
          '<div class="row"><h3>' + ed.degree + '</h3><span>' + ed.period + '</span></div>' +
          '<p class="meta">' + ed.school + '</p>' +
          '<p>' + ed.detail + '</p>' +
          '</div>'
        );
      })
      .join('');

    var projHtml = RESUME.projects
      .map(function (p) { return '<li><strong>' + p.title + '</strong> — ' + p.tech + '</li>'; })
      .join('');

    return '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' +
      '<title>' + RESUME.name + ' — Resume</title>' +
      '<style>' +
      '*{box-sizing:border-box}body{font-family:Inter,Arial,Helvetica,sans-serif;color:#111;margin:0 auto;padding:48px;max-width:860px;line-height:1.6}' +
      'h1{font-size:30px;margin:0;letter-spacing:-.02em}' +
      'h2{font-size:13px;text-transform:uppercase;letter-spacing:.16em;color:' + accent + ';margin:32px 0 12px;border-bottom:1px solid #E5E7EB;padding-bottom:7px}' +
      'h3{font-size:16px;margin:0}' +
      '.role{color:' + accent + ';font-weight:600;margin:6px 0 0;font-size:15px}' +
      '.contact{color:#4B5563;font-size:13.5px;margin-top:10px}' +
      '.contact span{margin-right:14px;white-space:nowrap}' +
      '.item{margin-bottom:18px}' +
      '.row{display:flex;justify-content:space-between;align-items:baseline;gap:12px}' +
      '.row span{font-size:12.5px;color:#6B7280;white-space:nowrap}' +
      '.meta{margin:4px 0 0;color:#6B7280;font-size:13.5px}' +
      'ul{margin:8px 0 0;padding-left:20px}li{font-size:14px;margin-bottom:4px}p{font-size:14px}' +
      '.bar{height:4px;width:120px;background:' + accent + ';margin-bottom:18px}' +
      '@media print{body{padding:24px}}' +
      '</style></head><body>' +
      '<div class="bar"></div>' +
      '<h1>' + RESUME.name + '</h1>' +
      '<p class="role">' + RESUME.role + '</p>' +
      '<p class="contact">' +
        '<span>&#9993; ' + RESUME.email + '</span>' +
        '<span>&#9742; ' + RESUME.phone + '</span>' +
        '<span>&#9906; ' + RESUME.location + '</span>' +
        '<span>GitHub: ' + RESUME.github + '</span>' +
        '<span>LinkedIn: ' + RESUME.linkedin + '</span>' +
      '</p>' +
      '<h2>Summary</h2><p>' + RESUME.summary + '</p>' +
      '<h2>Technical Skills</h2><p>' + RESUME.skills + '</p>' +
      '<h2>Work Experience</h2>' + expHtml +
      '<h2>Education</h2>' + eduHtml +
      '<h2>Featured Projects</h2><ul>' + projHtml + '</ul>' +
      '</body></html>';
  }

  function downloadResume() {
    try {
      var blob = new Blob([buildResumeHtml()], { type: 'text/html;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'Mulugojam-Demeke-Resume.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      showToast('Resume downloaded — open it and print to PDF.', 'fa-circle-check');
    } catch (err) {
      showToast('Could not generate the resume file.', 'fa-triangle-exclamation');
    }
  }

  ['downloadResumeTop', 'downloadResumeMobile'].forEach(function (id) {
    var btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', downloadResume);
  });

  /* ----------------------------------------------------------------------
     Copy email on Ctrl/Cmd + click of any mailto link
     ---------------------------------------------------------------------- */
  var EMAIL = 'Mulugojamdemeke09@gmail.com';

  function copyEmail() {
    var done = function () { showToast('Email copied: ' + EMAIL, 'fa-envelope-circle-check'); };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).then(done).catch(fallback);
    } else {
      fallback();
    }

    function fallback() {
      var input = document.createElement('textarea');
      input.value = EMAIL;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      try { document.execCommand('copy'); done(); } catch (e) { /* noop */ }
      document.body.removeChild(input);
    }
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest ? event.target.closest('a[href^="mailto:"]') : null;
    if (!link) return;
    if (event.metaKey || event.ctrlKey) {
      event.preventDefault();
      copyEmail();
    }
  });

  /* ----------------------------------------------------------------------
     Footer year
     ---------------------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
