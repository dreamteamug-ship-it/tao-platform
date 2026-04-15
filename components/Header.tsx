'use client';
import { Language, TRANSLATIONS } from '@/types';

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
  currentView: string;
  onNavShop: () => void;
  onNavSubscribe: () => void;
  onNavCC: () => void;
}

export default function Header({ lang, setLang, currentView, onNavShop, onNavSubscribe, onNavCC }: HeaderProps) {
  const t = TRANSLATIONS[lang];

  return (
    <header className="header">
      <div className="logo" onClick={onNavShop} role="button" tabIndex={0}>
        Together <span>As One</span>
      </div>
      <div className="header-actions">
        <select
          className="lang-select"
          value={lang}
          onChange={e => setLang(e.target.value as Language)}
          aria-label="Language selector"
        >
          <option value="en">🌍 ENG</option>
          <option value="sw">🇰🇪 SWA</option>
          <option value="sh">🇰🇪 SHG</option>
        </select>
        <button
          className="btn-subscribe"
          onClick={onNavSubscribe}
          id="btn-post-subscribe"
        >
          <i className="fas fa-crown" aria-hidden="true" /> {t.postBtn}
        </button>
        <button
          className="btn-gold"
          onClick={onNavCC}
          id="btn-cto-login"
        >
          <i className="fas fa-terminal" aria-hidden="true" /> {t.ctoBtn}
        </button>
      </div>
    </header>
  );
}
