const envelopeButton = document.querySelector('.envelope-button');
const letterPaper = document.querySelector('.love-letter');
const letterBackButton = document.querySelector('.letter-back-button');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (envelopeButton && letterPaper) {
  envelopeButton.addEventListener('click', () => {
    if (document.body.classList.contains('is-opening')) {
      return;
    }

    envelopeButton.disabled = true;
    envelopeButton.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-opening');

    const revealLetter = () => {
      letterPaper.hidden = false;
      letterPaper.setAttribute('aria-hidden', 'false');
      document.body.classList.add('letter-is-open');
      letterPaper.focus({ preventScroll: true });
    };

    if (reducedMotion.matches) {
      revealLetter();
      return;
    }

    window.setTimeout(revealLetter, 480);
  });
}

if (letterBackButton) {
  letterBackButton.addEventListener('click', () => {
    const previousPage = document.referrer;
    const cameFromThisSite = previousPage && new URL(previousPage).origin === window.location.origin;

    if (cameFromThisSite && window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = 'our-world.html';
  });
}
