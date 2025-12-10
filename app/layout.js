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

// app/layout.js
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://www.glp-1-taiwan.com/"),
  title: {
    default: "猛健樂(Mounjaro)森友會｜台灣猛健樂資訊網",
    template: "%s｜台灣猛健樂資訊網",
  },
  verification: {
    google: "taKJMmSFvJl2KEpQhzJEiCEtRdrV_mdCnviuStSON8Q",
  },
  description:
    "猛健樂（Mounjaro）自費價格查詢網站。整理各縣市診所費用、劑量計算器、RPG健康任務、FAQ、Threads 精選醫師文章。",
  keywords: [
    "Mounjaro",
    "猛健樂",
    "Zepbound",
    "減肥針",
    "瘦瘦筆",
    "glp-1",
    "台灣",
    "價格查詢",
    "自費",
    "診所",
    "tirzepatide",
  ],

  openGraph: {
    title: "猛健樂(Mounjaro)森友會｜台灣猛健樂資訊網",
    description:
      "全台猛健樂(Mounjaro) 價格查詢、劑量計算器、FAQ、醫師文章與健康任務。",
    url: "https://www.glp-1-taiwan.com/",
    siteName: "猛健樂(Mounjaro)森友會｜台灣猛健樂資訊網",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "台灣猛健樂資訊網",
      },
    ],
    locale: "zh_TW",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "猛健樂(Mounjaro)森友會｜台灣猛健樂資訊網",
    description: "全台診所資訊與自費價格公開透明。",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
  },
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
