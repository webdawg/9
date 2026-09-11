(function () {
  const book = document.getElementById('book');
  const pages = Array.from(book.querySelectorAll('.page'));
  const total = pages.length;
  const prevBtn = document.querySelector('.nav.prev');
  const nextBtn = document.querySelector('.nav.next');
  const dotsWrap = document.querySelector('.dots');
  const counter = document.querySelector('.counter');

  let current = 0;
  let animating = false;

  pages.forEach((p, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.setAttribute('aria-label', 'Go to page ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function render() {
    pages.forEach((p, i) => {
      if (i < current) {
        p.classList.add('flipped');
        p.style.zIndex = i;
      } else {
        p.classList.remove('flipped');
        p.style.zIndex = total - i;
      }
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    counter.textContent = (current + 1) + ' / ' + total;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  function next() {
    if (animating || current >= total - 1) return;
    animating = true;
    pages[current].style.zIndex = 2000;
    pages[current].classList.add('flipped');
    current++;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    counter.textContent = (current + 1) + ' / ' + total;
    prevBtn.disabled = false;
    nextBtn.disabled = current === total - 1;
    setTimeout(() => { render(); animating = false; }, 1000);
  }

  function prev() {
    if (animating || current <= 0) return;
    animating = true;
    const target = current - 1;
    pages[target].style.zIndex = 2000;
    pages[target].classList.remove('flipped');
    current = target;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    counter.textContent = (current + 1) + ' / ' + total;
    nextBtn.disabled = false;
    prevBtn.disabled = current === 0;
    setTimeout(() => { render(); animating = false; }, 1000);
  }

  function goTo(index) {
    if (animating || index === current) return;
    if (index > current) {
      const steps = index - current;
      let i = 0;
      const run = () => { if (i < steps) { next(); i++; setTimeout(run, 60); } };
      run();
    } else {
      const steps = current - index;
      let i = 0;
      const run = () => { if (i < steps) { prev(); i++; setTimeout(run, 60); } };
      run();
    }
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  function jumpImmediate(index) {
    current = Math.max(0, Math.min(total - 1, index));
    render();
  }

  window.addEventListener('hashchange', () => {
    const n = parseInt(location.hash.replace('#', ''), 10);
    if (!isNaN(n)) jumpImmediate(n - 1);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') { next(); }
    if (e.key === 'ArrowLeft') { prev(); }
  });

  let touchStartX = null;
  book.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  book.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx < -40) next();
    if (dx > 40) prev();
    touchStartX = null;
  }, { passive: true });

  const initial = parseInt(location.hash.replace('#', ''), 10);
  if (!isNaN(initial)) current = Math.max(0, Math.min(total - 1, initial - 1));
  render();
})();
