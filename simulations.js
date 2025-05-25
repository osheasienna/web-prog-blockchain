"use strict;"
  const simFrame = document.getElementById('simulator-frame');

  const opts = { root: null, threshold: 0.5 };
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const id = e.target.id;
      const bar = document.querySelector(`.bar[data-target="${id}"]`);
      if (e.isIntersecting) {
        e.target.classList.add('active');
        bar.classList.add('active');
        // Swap simulator iframe
        simFrame.src = e.target.dataset.simSrc;
        simFrame.title = e.target.dataset.simTitle;
      } else {
        e.target.classList.remove('active');
        bar.classList.remove('active');
      }
    });
  }, opts);

  document.querySelectorAll('section').forEach(s => obs.observe(s));

  // clicking a bar scrolls you to its section
  document.querySelectorAll('.bar').forEach(bar =>
          bar.addEventListener('click', () => {
            document
                    .getElementById(bar.dataset.target)
                    .scrollIntoView({ behavior: 'smooth' });
          })
  );
