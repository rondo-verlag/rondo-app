import { describe, it, expect, beforeEach } from 'vitest';
import AppState from '@/AppState';

describe('AppState', () => {
  beforeEach(() => {
    AppState.hasBought = false;
    AppState.purchaseLogs = [];
  });

  it('updates hasBought state via setHasBought', () => {
    expect(AppState.hasBought).toBe(false);
    AppState.setHasBought(true);
    expect(AppState.hasBought).toBe(true);
  });

  it('records purchase logs with timestamp format', () => {
    AppState.addPurchaseLog('Test purchase log message');
    expect(AppState.purchaseLogs.length).toBe(1);
    expect(AppState.purchaseLogs[0]).toMatch(/^\[\d{2}:\d{2}:\d{2}\] Test purchase log message$/);
  });

  it('updates theme state via setTheme', () => {
    AppState.setTheme('dark');
    expect(AppState.theme).toBe('dark');
    AppState.setTheme('light');
    expect(AppState.theme).toBe('light');
    AppState.setTheme('system');
    expect(AppState.theme).toBe('system');
  });

  it('updates autoScrollSpeed and clamps to range 1-10', () => {
    AppState.setAutoScrollSpeed(7);
    expect(AppState.autoScrollSpeed).toBe(7);

    AppState.setAutoScrollSpeed(1);
    expect(AppState.autoScrollSpeed).toBe(1);

    AppState.setAutoScrollSpeed(10);
    expect(AppState.autoScrollSpeed).toBe(10);

    // Clamping values outside 1-10
    AppState.setAutoScrollSpeed(0);
    expect(AppState.autoScrollSpeed).toBe(1);

    AppState.setAutoScrollSpeed(15);
    expect(AppState.autoScrollSpeed).toBe(10);

    // Fallback on NaN
    AppState.setAutoScrollSpeed(NaN);
    expect(AppState.autoScrollSpeed).toBe(5);
  });
});
