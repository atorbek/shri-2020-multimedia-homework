(() => {
  const controls = document.getElementsByClassName('controls');
  let fsElement;

  document.addEventListener('click', (e) => {
    fullScreen(e.target);
    closeFullScreen(e.target);
  });

  function fullScreen(element) {
    if (!element.classList.contains('video')) {
      return;
    }

    fsElement = element;
    element.classList.add('video_state__fullscreen');
    controls[0].classList.remove('controls_hidden');
  }

  function closeFullScreen(element) {
    if (!element.classList.contains('controls__button')) {
      console.log(element);
      return;
    }
    fsElement.classList.remove('video_state__fullscreen');
  }
})();
