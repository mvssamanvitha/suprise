const enterLink = document.querySelector('.enter-button');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (enterLink) {
  enterLink.addEventListener('click', (event) => {
    if (reduceMotion.matches || document.body.classList.contains('is-entering')) {
      return;
    }

    event.preventDefault();
    document.body.classList.add('is-entering');
    window.setTimeout(() => {
      window.location.href = enterLink.href;
    }, 740);
  });
}

const worldWelcome = document.querySelector('.world-welcome');
const worldHeartButton = document.querySelector('.world-heart-button');
const photoViewer = document.querySelector('.photo-viewer');

if (worldWelcome && worldHeartButton && photoViewer) {
  const photos = [
    { src: 'assets/photos/4.jpeg', alt: 'Together with red roses', caption: 'My favourite smile, my favourite person. \u2764\uFE0F' },
    { src: 'assets/photos/3.jpeg', alt: 'Holding the roses close together', caption: 'Every little moment with you is special. \u{1F339}' },
    { src: 'assets/photos/2.jpeg', alt: 'Standing together beside the blue wall', caption: 'My favourite place will always be beside you. \u{1F979}\u2764\uFE0F' }
  ];
  const photo = photoViewer.querySelector('.memory-photo');
  const photoPlaceholder = photoViewer.querySelector('.photo-placeholder');
  const photoCaption = photoViewer.querySelector('.photo-caption');
  const photoEnding = photoViewer.querySelector('.photo-ending');
  const previousPhotoButton = photoViewer.querySelector('.previous-photo-button');
  const nextPhotoButton = photoViewer.querySelector('.next-photo-button');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let photoIndex = 0;

  const showPhoto = () => {
    const currentPhoto = photos[photoIndex];
    photo.hidden = true;
    photoPlaceholder.hidden = false;
    photoPlaceholder.textContent = 'Your photo will appear here';
    photoCaption.textContent = currentPhoto.caption;
    photoEnding.hidden = photoIndex !== photos.length - 1;
    previousPhotoButton.hidden = photoIndex === 0;
    photoViewer.classList.remove('is-photo-entering');
    void photoViewer.offsetWidth;
    photoViewer.classList.add('is-photo-entering');

    photo.onload = () => {
      photo.hidden = false;
      photoPlaceholder.hidden = true;
    };
    photo.onerror = () => {
      photo.hidden = true;
      photoPlaceholder.hidden = false;
      photoPlaceholder.textContent = `Photo not found: ${currentPhoto.src}. Add the image at this path.`;
      console.error(`Unable to load album photo: ${currentPhoto.src}`, photo.src);
    };
    photo.alt = currentPhoto.alt;
    photo.src = currentPhoto.src;
  };

  worldHeartButton.addEventListener('click', () => {
    worldHeartButton.disabled = true;
    const revealPhotos = () => {
      worldWelcome.hidden = true;
      photoViewer.hidden = false;
      showPhoto();
    };

    if (reduceMotion.matches) {
      revealPhotos();
      return;
    }

    worldWelcome.classList.add('is-world-leaving');
    window.setTimeout(revealPhotos, 300);
  });

  nextPhotoButton.addEventListener('click', () => {
    if (photoIndex < photos.length - 1) {
      photoIndex += 1;
      showPhoto();
      return;
    }

    window.location.href = 'love-letter.html';
  });

  previousPhotoButton.addEventListener('click', () => {
    if (photoIndex > 0) {
      photoIndex -= 1;
      showPhoto();
    }
  });
}
