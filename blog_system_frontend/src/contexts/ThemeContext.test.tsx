import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';
import type { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.classList.remove('light', 'dark');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('ThemeProvider', () => {
    it('должен использовать тему из localStorage если она есть', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('dark');
      
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      expect(result.current.theme).toBe('dark');
      expect(result.current.resolvedTheme).toBe('dark');
    });

    it('должен использовать system тему по умолчанию', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      expect(result.current.theme).toBe('system');
    });

    it('должен применять класс темы к documentElement', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('dark');
      
      renderHook(() => useTheme(), { wrapper });
      
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('должен удалять предыдущий класс темы при смене', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('light');
      
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      expect(document.documentElement.classList.contains('light')).toBe(true);
      
      act(() => {
        result.current.setTheme('dark');
      });
      
      expect(document.documentElement.classList.contains('light')).toBe(false);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('setTheme', () => {
    it('должен изменять тему на light', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('dark');
      
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      act(() => {
        result.current.setTheme('light');
      });
      
      expect(result.current.theme).toBe('light');
      expect(result.current.resolvedTheme).toBe('light');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    it('должен изменять тему на dark', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('light');
      
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      act(() => {
        result.current.setTheme('dark');
      });
      
      expect(result.current.theme).toBe('dark');
      expect(result.current.resolvedTheme).toBe('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('должен изменять тему на system', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('dark');
      
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      act(() => {
        result.current.setTheme('system');
      });
      
      expect(result.current.theme).toBe('system');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'system');
    });
  });

  describe('resolvedTheme', () => {
    it('должен возвращать light когда тема light', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('light');
      
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      expect(result.current.resolvedTheme).toBe('light');
    });

    it('должен возвращать dark когда тема dark', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('dark');
      
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      expect(result.current.resolvedTheme).toBe('dark');
    });

    it('должен возвращать системную тему когда тема system (light)', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('system');
      vi.mocked(window.matchMedia).mockReturnValue({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      });
      
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      expect(result.current.resolvedTheme).toBe('light');
    });

    it('должен возвращать системную тему когда тема system (dark)', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('system');
      vi.mocked(window.matchMedia).mockReturnValue({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      });
      
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      expect(result.current.resolvedTheme).toBe('dark');
    });
  });

  describe('useTheme', () => {
    it('должен выбрасывать ошибку при использовании вне ThemeProvider', () => {
      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');
    });

    it('должен возвращать корректные значения', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('light');
      
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      expect(result.current).toHaveProperty('theme');
      expect(result.current).toHaveProperty('setTheme');
      expect(result.current).toHaveProperty('resolvedTheme');
      expect(typeof result.current.setTheme).toBe('function');
    });
  });

  describe('system theme listener', () => {
    it('должен добавлять слушатель при system теме', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('system');
      const addEventListenerMock = vi.fn();
      const removeEventListenerMock = vi.fn();
      
      vi.mocked(window.matchMedia).mockReturnValue({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: addEventListenerMock,
        removeEventListener: removeEventListenerMock,
        dispatchEvent: vi.fn(),
      });
      
      const { unmount } = renderHook(() => useTheme(), { wrapper });
      
      expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
      
      unmount();
      
      expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('не должен добавлять слушатель при конкретной теме', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('dark');
      const addEventListenerMock = vi.fn();
      
      vi.mocked(window.matchMedia).mockReturnValue({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: addEventListenerMock,
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      });
      
      renderHook(() => useTheme(), { wrapper });
      
      expect(addEventListenerMock).not.toHaveBeenCalled();
    });
  });
});
