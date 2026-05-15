import { FC, ReactNode } from 'react';
import Header from '../organisms/Header';
import AnnouncementBar from '../organisms/AnnouncementBar';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * 🏠 MainLayout Template
 * 負責網站整體的結構骨架 (Header + Announcement + Content)
 */
const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <AnnouncementBar />
      <main className="content-wrapper">{children}</main>
    </div>
  );
};

export default MainLayout;
