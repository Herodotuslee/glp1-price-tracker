"use client";

import { useEffect, useState } from "react";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../../config/supabase";
import texts from "../../data/texts.json";
import LoadingIndicator from "../../components/LoadingIndicator";

function FaqPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFaq() {
      try {
        setLoading(true);
        setError(null);

        const url = `${SUPABASE_URL}/rest/v1/mounjaro_faq?select=*&order=item_order.asc`;

        const res = await fetch(url, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setFaqs(data);
      } catch (err) {
        console.error("FAQ Load Failed:", err);
        setError("Unable to load FAQs. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadFaq();
  }, []);

  if (loading) return <LoadingIndicator centered={true} />;
  if (error) return <div className="status-text error">{error}</div>;

  return (
    <div className="price-page-root">
      <div className="price-page-inner">
        <header className="page-header">
          <h1 className="page-title">
            <span className="title-icon">❔</span> 常見問題
          </h1>
          <p className="page-subtitle-text">
            這裡整理了島民們最常問的問題。
            <br />
            點擊卡片就可以看到詳細解答喔！
          </p>
        </header>

        <div className="info-banner warning-block">
          <span className="icon">🦉</span> {texts.generalWarning}
        </div>

        <div className="faq-list">
          {faqs.map((item) => (
            <details key={item.id} className="faq-card">
              <summary className="faq-summary">
                <span className="faq-icon">🍃</span>
                {item.question}
              </summary>

              <div className="faq-content">
                <p className="faq-answer">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FaqPage;
