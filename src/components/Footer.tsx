import React from 'react';
import { BookIcon } from './Icons';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand-title">
              <span className="footer-brand-badge" aria-hidden="true">
                <BookIcon size={16} />
              </span>
              <span>Mini Library</span>
            </div>
            <p className="footer-desc">
              Hệ thống Thư viện Khoa Công nghệ Thông tin & Truyền thông — Ứng dụng tra cứu & quản lý mượn trả tài liệu học tập chuyên ngành.
            </p>
          </div>

          <div className="footer-rules">
            <span className="footer-rules-heading">Quy định mượn trả</span>
            <ul className="footer-rules-list">
              <li>Mỗi sinh viên được mượn tối đa <strong>3 cuốn</strong> đồng thời</li>
              <li>Thời hạn mượn tiêu chuẩn: <strong>14 ngày</strong> / lượt</li>
              <li>Bảo quản sách nguyên vẹn và hoàn trả đúng hạn</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copyright">
            © {new Date().getFullYear()} Mini Library — Bài tập lớn Lập trình Web Nâng cao (LTWNC).
          </span>
          <div className="footer-tech-stack">
            <span className="tech-tag">React 18</span>
            <span className="tech-tag">TypeScript</span>
            <span className="tech-tag">Redux Toolkit</span>
            <span className="tech-tag">Zustand</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
