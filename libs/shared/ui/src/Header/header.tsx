import React, { useState } from 'react';
import { HeaderProps } from './header.types';
import './header.scss';

const Header: React.FC<HeaderProps> = ({ logo, title, version, pages, style }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header" style={style}>
      <div className="header__left">
        <img src={logo} alt={`${title} logo`} className="header__logo" />
        <div className="header__title">{title}</div>
        <div className="header__version">{version}</div>
      </div>
      <nav className="header__nav">
        <ul className={`header__nav-list ${menuOpen ? 'header__nav-list--open' : ''}`}>
          {pages.map((page) => (
            <li key={page.name} className="header__nav-item">
              <a href={page.url} className="header__nav-link">
                {page.name}
              </a>
            </li>
          ))}
        </ul>
        <button className="header__menu-button" onClick={toggleMenu}>
          ☰
        </button>
      </nav>
    </header>
  );
};

export default Header;
