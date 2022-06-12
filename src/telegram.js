const getCSSProperty = (property) =>
  getComputedStyle(document.documentElement).getPropertyValue(property);

export class Telegram {
  static reset() {
    window.Telegram.WebApp.MainButton?.hide?.();
  }

  static restartButton() {
    const mainButton = window.Telegram.WebApp?.MainButton;
    if (!mainButton) {
      return;
    }
    mainButton.show();
    const buttonColor = getCSSProperty('--tg-secondary-button_color');
    mainButton.color = buttonColor;
    mainButton.setText('RESTART');
  }

  static onMainButtonClick(callback) {
    window.Telegram.WebApp.onEvent('mainButtonClicked', callback);
  }

  static offMainButtonClick(callback) {
    window.Telegram.WebApp.offEvent('mainButtonClicked', callback);
  }
}
