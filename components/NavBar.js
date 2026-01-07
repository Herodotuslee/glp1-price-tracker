"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "../styles/navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (href, options = {}) => {
    const { exact = false } = options;

    if (exact) return pathname === href;
    if (href === "/") return pathname === "/";

    return pathname.startsWith(href);
  };

  const linkClass = (href, options) =>
    `nav-item ${isActive(href, options) ? "active" : ""}`;

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Header row */}
        <div className="nav-header-row">
          <Link href="/" className="nav-brand" onClick={closeMenu}>
            <span className="brand-icon">🍃</span>
            <span className="ac-colored-title">
              {"猛健樂森友會".split("").map((char, index) => (
                <span key={index} className={`ac-char ac-char-${index % 6}`}>
                  {char}
                </span>
              ))}
            </span>
          </Link>

          <button
            type="button"
            className="nav-toggle"
            aria-label="Toggle navigation menu"
            onClick={toggleMenu}
          >
            <span className={`nav-toggle-bar ${isMenuOpen ? "open" : ""}`} />
            <span className={`nav-toggle-bar ${isMenuOpen ? "open" : ""}`} />
            <span className={`nav-toggle-bar ${isMenuOpen ? "open" : ""}`} />
          </button>
        </div>

        {/* Main navigation */}
        <div className={`nav-main ${isMenuOpen ? "open" : ""}`}>
          <ul className="nav-links">
            <li>
              <Link
                href="/"
                className={linkClass("/", { exact: true })}
                onClick={closeMenu}
              >
                價格資訊
              </Link>
            </li>
            <li>
              <Link
                href="/lazy"
                className={linkClass("/lazy")}
                onClick={closeMenu}
              >
                簡易攻略
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className={linkClass("/faq")}
                onClick={closeMenu}
              >
                常見問題
              </Link>
            </li>
            <li>
              <Link
                href="/health"
                className={linkClass("/health")}
                onClick={closeMenu}
              >
                健康任務
              </Link>
            </li>
            <li>
              <Link
                href="/dose"
                className={linkClass("/dose")}
                onClick={closeMenu}
              >
                劑量計算
              </Link>
            </li>
            <li>
              <Link
                href="/threads"
                className={linkClass("/threads")}
                onClick={closeMenu}
              >
                精選文章
              </Link>
            </li>
            <li>
              <Link
                href="/bmr"
                className={linkClass("/bmr")}
                onClick={closeMenu}
              >
                BMR 計算
              </Link>
            </li>
            <li>
              <Link
                href="/report"
                className={linkClass("/report")}
                onClick={closeMenu}
              >
                回報價格
              </Link>
            </li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="nav-actions">
          <a
            href="https://line.me/ti/g2/14wNaS4K1nmA7ytMa8pgzTLuslICubxDFVdjuQ"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-btn nav-line-link"
            onClick={closeMenu}
          >
            <Image
              src="/image/icons8-line-me.svg"
              alt="LINE"
              width={18}
              height={18}
              className="nav-icon-img"
            />
            <span>加入群組</span>
          </a>

          <a
            href="https://buymeacoffee.com/holaalbertc"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-btn nav-coffee-link"
            onClick={closeMenu}
          >
            <span className="nav-icon-emoji">☕</span>
            <span>請喝咖啡</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
