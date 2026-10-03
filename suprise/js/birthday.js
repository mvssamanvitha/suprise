const birthdayStage = document.querySelector('.birthday-stage');

if (birthdayStage) {
  birthdayStage.addEventListener('click', () => {
    window.location.href = 'home.html';
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      window.location.href = 'home.html';
    }
  });
}
