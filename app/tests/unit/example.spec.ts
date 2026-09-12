import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AboutCard from '@/views/AboutCard.vue';
import MenuList from '@/views/MenuList.vue';
import ViewSettingsCard from '@/views/ViewSettingsCard.vue';
import BrowserLink from '@/views/BrowserLink.vue';

describe('App Components', () => {
  it('renders AboutCard with provided appVersion', () => {
    const wrapper = mount(AboutCard, {
      global: {
        provide: {
          appVersion: '2026.09.1'
        },
        stubs: {
          'ion-page': { template: '<div><slot /></div>' },
          'ion-header': { template: '<div><slot /></div>' },
          'ion-toolbar': { template: '<div><slot /></div>' },
          'ion-buttons': { template: '<div><slot /></div>' },
          'ion-button': { template: '<button><slot /></button>' },
          'ion-content': { template: '<div><slot /></div>' },
          Browserlink: { template: '<a><slot /></a>', props: ['url'] }
        }
      }
    });

    expect(wrapper.text()).toContain('Über das Rondo');
    expect(wrapper.text()).toContain('APP Version 2026.09.1');
  });

  it('renders MenuList with navigation options', () => {
    const wrapper = mount(MenuList, {
      global: {
        provide: {
          appVersion: '2026.09.1'
        },
        stubs: {
          'ion-page': { template: '<div><slot /></div>' },
          'ion-header': { template: '<div><slot /></div>' },
          'ion-toolbar': { template: '<div><slot /></div>' },
          'ion-buttons': { template: '<div><slot /></div>' },
          'ion-button': { template: '<button><slot /></button>' },
          'ion-content': { template: '<div><slot /></div>' }
        }
      }
    });

    expect(wrapper.text()).toContain('Vollversion freischalten');
    expect(wrapper.text()).toContain('Anzeigeeinstellungen');
    expect(wrapper.text()).toContain('Songeinstellungen');
    expect(wrapper.text()).toContain('Über das Rondo');
  });

  it('renders ViewSettingsCard with theme toggle buttons', () => {
    const wrapper = mount(ViewSettingsCard, {
      global: {
        stubs: {
          'ion-page': { template: '<div><slot /></div>' },
          'ion-header': { template: '<div><slot /></div>' },
          'ion-toolbar': { template: '<div><slot /></div>' },
          'ion-buttons': { template: '<div><slot /></div>' },
          'ion-button': { template: '<button><slot /></button>' },
          'ion-content': { template: '<div><slot /></div>' }
        }
      }
    });

    expect(wrapper.text()).toContain('Anzeigeeinstellungen');
    expect(wrapper.text()).toContain('System');
    expect(wrapper.text()).toContain('Hell');
    expect(wrapper.text()).toContain('Dunkel');
  });

  it('renders BrowserLink correctly', () => {
    const wrapper = mount(BrowserLink, {
      props: {
        url: 'https://www.rondo-verlag.ch'
      },
      slots: {
        default: 'Rondo Verlag'
      }
    });

    expect(wrapper.text()).toBe('Rondo Verlag');
    expect(wrapper.attributes('href')).toBe('https://www.rondo-verlag.ch');
    expect(wrapper.attributes('target')).toBe('_blank');
  });
});
