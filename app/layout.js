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

const siteUrl = "https://www.glp-1-taiwan.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: siteUrl },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
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
    url: siteUrl,
    siteName: "猛健樂(Mounjaro)森友會｜一起變健康的好朋友",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
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
    description: "讓每個台灣人一起變更健康吧！",
    images: [`${siteUrl}/og-image.png`],
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
