import { FC } from 'react';

const Header: FC = () => {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="logo" href="index.html">
          <img src="img/brand/logo.png" alt="YoGo Logo" className="logo-img" />
          <span>YoGo 有夠菜-芽菜工坊</span>
        </a>
        <nav className="main-nav">
          <a href="about.html">關於 YoGo</a>
          <a href="index.html" className="active">商品選購</a>
          <button id="theme-toggle-btn" className="theme-toggle-btn" aria-label="切換深淺模式">🌙</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
