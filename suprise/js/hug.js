const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hugStage = document.querySelector('.hug-stage');

const goToBirthday = () => {
  window.location.href = 'birthday.html';
};

if (hugStage) {
  hugStage.addEventListener('click', goToBirthday);
  hugStage.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      goToBirthday();
    }
  });

  if (prefersReducedMotion.matches) {
    document.body.classList.add('characters-together');
  } else {
    window.setTimeout(() => document.body.classList.add('characters-together'), 240);
  }
}
