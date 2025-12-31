// app/layout.js

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
  metadataBase: new URL("https://www.glp-1-taiwan.com"),
  alternates: {
    canonical: "https://www.glp-1-taiwan.com/",
  },
  // 設置 Google 搜尋顯示的小圖示 (Favicon)
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" }, // 建議使用剛才幫您生成的綠色葉子圖
      { url: "/favicon.ico", sizes: "any" }, // 備用傳統格式
    ],
    apple: "/apple-touch-icon.png", // 用於 iPhone 加入主畫面時的圖示
  },
  title: {
    default: "猛健樂(Mounjaro)森友會｜一起變健康的好朋友",
    template: "%s｜台灣猛健樂資訊網",
  },
  verification: {
    google: "taKJMmSFvJl2KEpQhzJEiCEtRdrV_mdCnviuStSON8Q",
  },
  description:
    "猛健樂（Mounjaro）自費價格查詢網站。整理各縣市診所費用、劑量計算器、RPG 健康任務、FAQ、Threads 精選醫師文章。",
  keywords: [
    "Mounjaro",
    "猛健樂",
    "Zepbound",
    "減肥",
    "減脂",
    "瘦瘦筆",
    "GLP-1",
    "台灣",
    "價格查詢",
    "自費",
    "診所",
    "tirzepatide",
  ],
  openGraph: {
    title: "猛健樂(Mounjaro)森友會｜一起變健康的好朋友",
    description:
      "全台猛健樂（Mounjaro）價格查詢、劑量計算器、FAQ、醫師文章與健康任務。",
    url: "https://www.glp-1-taiwan.com/",
    siteName: "猛健樂(Mounjaro)森友會｜一起變健康的好朋友",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "台灣猛健樂資訊網 - 猛健樂森友會",
      },
    ],
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "猛健樂(Mounjaro)森友會｜一起變健康的好朋友",
    description: "讓每個台灣人一起變更健康吧！。",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/google.png" type="image/png" />

        {/* Google Fonts – Cute but subtle (Animal Crossing vibe) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
