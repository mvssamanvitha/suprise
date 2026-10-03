const screens = [...document.querySelectorAll('[data-screen]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const showScreen = (name) => {
  const nextScreen = screens.find((screen) => screen.dataset.screen === name);
  if (!nextScreen) return;

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  screens.forEach((screen) => {
    screen.hidden = screen !== nextScreen;
    screen.classList.remove('is-arriving');
  });
  void nextScreen.offsetWidth;
  nextScreen.classList.add('is-arriving');
  window.scrollTo(0, 0);
};

const acceptMissionButton = document.querySelector('.accept-mission');
const missionCard = document.querySelector('.mission-card');
const continueMissionButton = document.querySelector('.continue-mission');
const startChallengeButton = document.querySelector('.start-challenge');

acceptMissionButton.addEventListener('click', () => {
  acceptMissionButton.disabled = true;
  missionCard.classList.add('is-opening');
  window.setTimeout(() => showScreen('mission-reveal'), reducedMotion.matches ? 0 : 500);
});

continueMissionButton.addEventListener('click', () => showScreen('unlock-welcome'));
startChallengeButton.addEventListener('click', () => beginPuzzle());

const puzzlePhotoPath = 'assets/photos/5.jpeg';
const puzzleImage = new Image();
let puzzleImageLoaded = false;
let imageChecked = false;
let arrangement = [];
let selectedSlot = null;
let puzzleTiles = [];

const puzzleBoard = document.querySelector('.puzzle-board');
const puzzlePhotoNote = document.querySelector('.puzzle-photo-note');
const puzzleStatus = document.querySelector('.puzzle-status');
const restartPuzzleButton = document.querySelector('.restart-puzzle');
const puzzleImageResult = document.querySelector('.reconstructed-photo');
const puzzlePlaceholderResult = document.querySelector('.reconstructed-placeholder');

const isSolved = () => arrangement.every((pieceIndex, slotIndex) => pieceIndex === slotIndex);

const shufflePieces = () => {
  const pieces = Array.from({ length: 9 }, (_, index) => index);
  do {
    for (let index = pieces.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [pieces[index], pieces[swapIndex]] = [pieces[swapIndex], pieces[index]];
    }
  } while (pieces.every((pieceIndex, slotIndex) => pieceIndex === slotIndex));
  return pieces;
};

const updatePuzzlePhoto = () => {
  if (puzzleImageLoaded) {
    puzzleBoard.style.setProperty('--puzzle-ratio', `${puzzleImage.naturalWidth} / ${puzzleImage.naturalHeight}`);
    puzzlePhotoNote.textContent = 'Your photo is divided into nine pieces.';
    puzzleTiles.forEach((tile) => tile.classList.add('has-photo'));
    return;
  }

  puzzleBoard.style.removeProperty('--puzzle-ratio');
  puzzlePhotoNote.textContent = `Photo placeholder: add your image at ${puzzlePhotoPath}.`;
  puzzleTiles.forEach((tile) => tile.classList.remove('has-photo'));
};

const updatePuzzle = () => {
  puzzleTiles.forEach((tile, slotIndex) => {
    const pieceIndex = arrangement[slotIndex];
    tile.dataset.pieceIndex = String(pieceIndex);
    tile.setAttribute('aria-label', `Piece ${pieceIndex + 1}, currently in position ${slotIndex + 1} of 9`);
    tile.setAttribute('aria-pressed', String(selectedSlot === slotIndex));
    tile.classList.toggle('is-selected', selectedSlot === slotIndex);
    tile.querySelector('.piece-number').textContent = String(pieceIndex + 1);

    if (puzzleImageLoaded) {
      const x = (pieceIndex % 3) * 50;
      const y = Math.floor(pieceIndex / 3) * 50;
      tile.style.backgroundImage = `url("${puzzlePhotoPath}")`;
      tile.style.backgroundPosition = `${x}% ${y}%`;
    } else {
      tile.style.removeProperty('background-image');
      tile.style.removeProperty('background-position');
    }
  });
};

const finishPuzzle = () => {
  if (puzzleImageLoaded) {
    puzzleImageResult.src = puzzlePhotoPath;
    puzzleImageResult.hidden = false;
    puzzlePlaceholderResult.hidden = true;
  } else {
    puzzleImageResult.hidden = true;
    puzzlePlaceholderResult.textContent = `Add your photo at ${puzzlePhotoPath} to see the completed picture.`;
    puzzlePlaceholderResult.hidden = false;
  }

  document.body.classList.add('heart-unlocked');
  showScreen('mission-complete');
};

const selectPuzzleSlot = (slotIndex) => {
  if (isSolved()) return;

  if (selectedSlot === null) {
    selectedSlot = slotIndex;
    puzzleStatus.textContent = `Piece ${arrangement[slotIndex] + 1} selected. Now choose where it belongs.`;
    updatePuzzle();
    return;
  }

  if (selectedSlot === slotIndex) {
    selectedSlot = null;
    puzzleStatus.textContent = 'Selection cleared. Tap a piece to start again.';
    updatePuzzle();
    return;
  }

  [arrangement[selectedSlot], arrangement[slotIndex]] = [arrangement[slotIndex], arrangement[selectedSlot]];
  selectedSlot = null;
  updatePuzzle();

  if (isSolved()) {
    puzzleStatus.textContent = 'Puzzle complete. Your heart is opening!';
    finishPuzzle();
  } else {
    puzzleStatus.textContent = 'Pieces moved. Keep going, superhero!';
  }
};

const createPuzzleTiles = () => {
  puzzleBoard.replaceChildren();
  puzzleTiles = Array.from({ length: 9 }, (_, slotIndex) => {
    const tile = document.createElement('button');
    tile.className = 'puzzle-piece';
    tile.type = 'button';
    tile.setAttribute('aria-pressed', 'false');
    const number = document.createElement('span');
    number.className = 'piece-number';
    number.setAttribute('aria-hidden', 'true');
    tile.append(number);
    tile.addEventListener('click', () => selectPuzzleSlot(slotIndex));
    puzzleBoard.append(tile);
    return tile;
  });
};

const beginPuzzle = () => {
  arrangement = shufflePieces();
  selectedSlot = null;
  updatePuzzlePhoto();
  updatePuzzle();
  puzzleStatus.textContent = puzzleImageLoaded
    ? 'Your heart is still locked. Find the right order.'
    : `Photo placeholder is active. Add your image at ${puzzlePhotoPath}; the puzzle is ready to play.`;
  showScreen('puzzle');
};

const restartPuzzle = () => {
  arrangement = shufflePieces();
  selectedSlot = null;
  updatePuzzle();
  puzzleStatus.textContent = puzzleImageLoaded
    ? 'Puzzle reshuffled. Your heart is still locked.'
    : `Puzzle reshuffled. Add your image at ${puzzlePhotoPath} when ready.`;
};

createPuzzleTiles();
updatePuzzlePhoto();
updatePuzzle();

puzzleImage.onload = () => {
  puzzleImageLoaded = true;
  imageChecked = true;
  updatePuzzlePhoto();
  updatePuzzle();
};

puzzleImage.onerror = () => {
  puzzleImageLoaded = false;
  imageChecked = true;
  updatePuzzlePhoto();
  updatePuzzle();
  console.info(`Puzzle photo placeholder is active; add an image at ${puzzlePhotoPath}.`);
};

puzzleImage.src = puzzlePhotoPath;
restartPuzzleButton.addEventListener('click', restartPuzzle);
