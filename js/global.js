if (window.Capacitor && Capacitor.getPlatform() === 'android') {
  if (window.ScreenOrientation && ScreenOrientation.lock) {
    ScreenOrientation.lock({ orientation: 'portrait' }).catch(console.warn);
  }
}
