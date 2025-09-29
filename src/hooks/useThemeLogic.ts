import { useState, useEffect } from 'react';
import { daisyThemes } from '@styles';

const THEME_KEY = 'savvysheet-daisyui-theme';

export default function useThemeLogic() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved && daisyThemes.includes(saved) ? saved : daisyThemes[0];
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem(THEME_KEY, currentTheme);
  }, [currentTheme]);

  function setTheme(theme: string) {
    if (daisyThemes.includes(theme)) {
      setCurrentTheme(theme);
    }
  }

  return { currentTheme, setTheme, daisyThemes };
}
