import { useThemeLogic } from '@hooks';

const Header: React.FC = () => {
  const { currentTheme, setTheme, daisyThemes } = useThemeLogic();

  return (
    <header>
      <img src="logo.png" alt="Logo" />
      <h1>SavvySheet</h1>
      <div>
        <label htmlFor="theme-select" style={{ marginRight: 8 }}>
          Tema:
        </label>
        <select
          id="theme-select"
          value={currentTheme}
          onChange={(e) => setTheme(e.target.value)}
          className="select select-bordered select-sm"
        >
          {daisyThemes.map((theme) => (
            <option key={theme} value={theme}>
              {theme}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};

export default Header;
