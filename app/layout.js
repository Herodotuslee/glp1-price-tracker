import "./globals.css";
import "../styles/PricePage.css";
import "../styles/LazyPage.css";
import "../styles/FaqPage.css";
import "../styles/DoseCalculatorPage.css";
import "../styles/HealthPage.css";
import "../styles/ThreadsPage.css";
import "../styles/AdvancedPage.css";
import "../styles/ReportPriceFormPage.css";

import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
export const metadata = {
  title: "猛健樂資訊網",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
