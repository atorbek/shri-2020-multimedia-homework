'use strict';
(() => {
  window.addEventListener('load', () => {
    const FULLSCREEN_CLASS_NAME = 'video_state_fullscreen';
    const controls = document.querySelector('.controls');
    const contrast = document.getElementById('contrast-input');
    const bright = document.getElementById('bright-input');
    const volumeValue = document.querySelector('.volume__value');
    const videos = document.querySelectorAll('.video');
    const Analyzer = new Analyser((v) => {
      volumeValue.style.width = v;
    });

    document.addEventListener('click', (e) => {
      const { target } = e;

      cameras(target);
      if (isVideo(target) && !isFullScreenVideo(target)) {
        Analyzer.subscribeMediaElement(target);
      }
      // call after Analyzer.subscribeMediaElement
      fullscreen(target);
    });

    document.addEventListener('input', (e) => {
      filter(e.target);
    });

    const isVideo = (element) => element.classList.contains('video');
    const isFullScreenVideo = (element) =>
      element.classList.contains('video_state_fullscreen');

    function fullscreen(element) {
      if (isVideo(element) && !isFullScreenVideo(element)) {
        element.muted = false;
        element.classList.add(FULLSCREEN_CLASS_NAME);
        controls.classList.remove('controls_hidden');

        videos.forEach((element) => {
          !isFullScreenVideo(element) &&
            element.classList.add('video_state_hidden');
        });
      }
    }

    function cameras(element) {
      const isCameras = element.classList.contains('cameras');

      if (isCameras) {
        const fullScreenVideo = document.querySelector(
          `.${FULLSCREEN_CLASS_NAME}`
        );
        fullScreenVideo.classList.remove(FULLSCREEN_CLASS_NAME);
        fullScreenVideo.muted = true;
        controls.classList.add('controls_hidden');

        videos.forEach((element) => {
          element.classList.remove('video_state_hidden');
        });

        // reset filter value to default
        bright.value = '1';
        contrast.value = '1';
      }
    }

    function filter(element) {
      const isBrightOrContrast =
        element.id === 'bright-input' || element.id === 'contrast-input';
      const fullScreenVideo = document.querySelector(
        `.${FULLSCREEN_CLASS_NAME}`
      );

      if (isBrightOrContrast) {
        fullScreenVideo.style.filter = `brightness(${bright.value}) contrast(${contrast.value})`;
      }
    }

    function Analyser(cb) {
      let self = this;
      this._sources = new Map();
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this._context = new AudioContext();
      this._node = this._context.createScriptProcessor(2048, 1, 1);
      this._cb = cb;

      this._analyser = this._context.createAnalyser();
      this._analyser.smoothingTimeConstant = 0.3;
      this._analyser.fftSize = 512;
      this._bands = new Uint8Array(this._analyser.frequencyBinCount);

      this._node.addEventListener('audioprocess', () => {
        self._analyser.getByteFrequencyData(self._bands);
        self.update();
      });

      this.subscribeMediaElement = (element) => {
        self._context.resume().then(() => {
          let source = self._sources.get(element);

          // cache source
          if (source) {
            self.source = source;
          } else {
            source = self._context.createMediaElementSource(element);
            self._sources.set(element, source);
          }

          self.source = source;
          self.source.connect(self._analyser);
          self._analyser.connect(self._node);
          self._node.connect(self._context.destination);
          self.source.connect(self._context.destination);
        });
      };

      this.update = () => {
        requestAnimationFrame(this.update);
        this._analyser.getByteFrequencyData(self._bands);
        self._cb(`${Math.round((Math.max(...this._bands) / 256) * 100)}%`);
      };
    }
  });
})();
