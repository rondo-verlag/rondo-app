import { Preferences } from '@capacitor/preferences';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SystemBars, SystemBarsStyle } from '@capacitor/core';

export type AppTheme = 'dark' | 'light' | 'system';

class ThemeService {
  private currentTheme: AppTheme = 'system';
  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    this.mediaQuery.addEventListener('change', () => {
      if (this.currentTheme === 'system') {
        this.applyTheme('system');
      }
    });
  }

  public async init(): Promise<AppTheme> {
    const { value } = await Preferences.get({ key: 'app_theme' });
    const theme: AppTheme = (value === 'dark' || value === 'light' || value === 'system') ? value : 'system';
    this.currentTheme = theme;
    this.applyTheme(theme);
    return theme;
  }

  public getTheme(): AppTheme {
    return this.currentTheme;
  }

  public isDark(): boolean {
    if (this.currentTheme === 'dark') {
      return true;
    }
    if (this.currentTheme === 'light') {
      return false;
    }
    return this.mediaQuery.matches;
  }

  public async setTheme(theme: AppTheme): Promise<void> {
    this.currentTheme = theme;
    await Preferences.set({ key: 'app_theme', value: theme });
    this.applyTheme(theme);
  }

  public applyTheme(theme: AppTheme = this.currentTheme): void {
    const isDark = theme === 'dark' || (theme === 'system' && this.mediaQuery.matches);

    // Toggle Ionic palette dark class on document element and body
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
    document.body.classList.toggle('ion-palette-dark', isDark);
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
    document.body.classList.toggle('light', !isDark);

    // Set System Bars style (Status Bar and Navigation Bar on Android / iOS)
    try {
      SystemBars.setStyle({
        style: isDark ? SystemBarsStyle.Dark : SystemBarsStyle.Light,
      }).catch(() => {
        // Ignore on platforms without native system bars
      });
    } catch {
      // Ignore
    }

    // Set Status Bar style
    try {
      StatusBar.setStyle({
        style: isDark ? Style.Dark : Style.Light,
      }).catch(() => {
        // Ignore on platforms without native status bar
      });
    } catch {
      // Ignore
    }
  }
}

export default new ThemeService();
