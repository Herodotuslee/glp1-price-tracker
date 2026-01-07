import Image from "next/image";
import Link from "next/link";

function LazyPage() {
  return (
    <div className="price-page-root">
      <div className="price-page-inner">
        {/* --- Header --- */}
        <header className="page-header">
          <h1 className="page-title">
            <span className="title-icon">📖</span> 新手懶人包
          </h1>
          <p className="page-subtitle-text">
            這是最精簡的攻略指南。
            <br />
            第一張圖能幫你省下不少錢（約數千到一萬多元）；
            <br />
            第二張圖則是健康減重的關鍵心法，跟著做能比 99% 的人更順利喔！
          </p>
        </header>

        {/* --- Card 1: Buying Guide --- */}
        <article className="lazy-card">
          <div className="tape-strip"></div>
          <Image
            src="/image/buying.jpg"
            alt="猛健樂購買指南懶人包"
            className="lazy-image"
            width={800}
            height={600}
          />
        </article>

        {/* --- Card 2: Using Guide --- */}
        <article className="lazy-card">
          <Image
            src="/image/using.png"
            alt="猛健樂使用方式懶人包"
            className="lazy-image"
            width={800}
            height={600}
          />
          <p className="lazy-note">
            💡 BMR (基礎代謝率) 可以參考 Inbody 機器測量，或是
            <Link href="/bmr" className="ac-link">
              使用本站 BMR 計算機
            </Link>
            幫你估算喔！
          </p>
        </article>
      </div>
    </div>
  );
}

export default LazyPage;
