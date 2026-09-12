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
});
