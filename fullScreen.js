(() => {
  document.addEventListener('click', (e) => {
    fullscreen(e.target);
  });

  function fullscreen(element) {
    if (element.tagName !== 'VIDEO') {
      return;
    }

    element.classList.toggle('video_state__fullscreen');
  }
})();
