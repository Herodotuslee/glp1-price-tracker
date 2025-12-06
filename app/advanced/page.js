"use client";
import React from "react";

function AdvancedPage() {
  return (
    <div className="advanced-page">
      <div className="advanced-container">
        <h1 className="advanced-title">
          猛健樂（Mounjaro / tirzepatide）進階知識整理
        </h1>

        <p className="advanced-intro">
          本頁內容依據公開演講與文獻中的觀念，將與猛健樂（Mounjaro /
          tirzepatide）相關的背景資訊做系統性整理，包含：肥胖作為慢性病的觀點、內臟脂肪與異位脂肪的角色、
          熱能調節與意志力減重的限制、GIP 與
          GLP-1的機轉、臨床試驗數據以及安全性與限制。
          內容以提供知識與理解為目的，不構成任何個別醫療建議或處方依據。
        </p>

        {/* 一、肥胖作為慢性病的觀點 */}
        <section className="advanced-section">
          <h2 className="advanced-section-title">
            一、肥胖作為慢性病：三大特性
          </h2>
          <p className="advanced-text">
            肥胖在現代代謝醫學中，多被視為一種慢性疾病，而非單純外觀或生活習慣問題。
            慢性病通常具有以下三項特性，肥胖也符合這些特徵：
          </p>
          <h3 className="advanced-subtitle">1. 漸進性（Progressive）</h3>
          <p className="advanced-text">
            漸進性代表疾病不會自動停在原地。如果長期缺乏介入，體重與相關代謝指標通常會逐步惡化，
            從體重增加延伸到血糖、血壓、血脂、肝功能等多項指標的變化。
          </p>

          <h3 className="advanced-subtitle">2. 高度復發性（Relapsing）</h3>
          <p className="advanced-text">
            許多人在短期減重後會進入「體重下降期」與「暫時穩定期」，但在壓力、環境或飲食行為改變下，
            體重常再次上升。肥胖因此被視為容易復發，並需要長期追蹤與管理的疾病。
          </p>

          <h3 className="advanced-subtitle">3. 多因性（Multifactorial）</h3>
          <p className="advanced-text">
            肥胖的成因包含遺傳體質、成長環境、飲食模式、心理壓力、睡眠品質、荷爾蒙狀態以及社會環境等。
            同一個
            BMI，在不同個體身上可能代表完全不同的代謝風險與疾病背景，因此治療策略必須個別化，
            無法用單一公式套用在所有人身上。
          </p>

          <p className="advanced-text">
            從健康風險角度來看，肥胖與第二型糖尿病、高血壓、高血脂、脂肪肝、
            睡眠呼吸中止症與部分癌症的風險增高密切相關。肥胖常被視為這些慢性疾病的前導風險因子，
            也就是說，肥胖不是問題的終點，而是多種代謝問題的起點。
          </p>
        </section>

        {/* 二、脂肪從「資源」到「負擔」：位置與質的重要性 */}
        <section className="advanced-section">
          <h2 className="advanced-section-title">
            二、脂肪從「資源」到「負擔」：位置與質的轉變
          </h2>
          <p className="advanced-text">
            從演化角度來看，脂肪是重要的能量儲存資源。當攝取食物後未立即使用的能量，需要適當的儲存空間，
            以應付未來的能量需求。因此，略高一點的脂肪儲存對早期人類生存是有利的。
          </p>
          <p className="advanced-text">
            問題在於，當能量長期過剩，脂肪儲存會發生兩件事：脂肪細胞變大（hypertrophy），
            以及脂肪細胞數量增加（hyperplasia）。此時，脂肪的「量」本身尚不足以定義是否生病，
            真正關鍵在於脂肪的「質」與「位置」。
          </p>

          <h3 className="advanced-subtitle">1. 皮下脂肪與「豪宅儲藏室」比喻</h3>
          <p className="advanced-text">
            可以把身體想像成一棟房子，皮下脂肪是相對安全且設計良好的儲藏室。體質較好的個體，
            儲存空間充足、動線良好，能把多餘能量有條理地存放在皮下脂肪中。
          </p>
          <p className="advanced-text">
            若儲存空間有限或已飽和，多出的「物品」會被迫堆到走廊、客廳、浴室甚至逃生通道。
            對應到身體，就是脂肪不再只存放在皮下，而是逐漸溢出到器官周圍與組織間隙，
            這被稱為脂肪外溢（fat spillover）與異位脂肪（ectopic fat）。
          </p>

          <h3 className="advanced-subtitle">
            2. 異位脂肪與慢性發炎、胰島素阻抗
          </h3>
          <p className="advanced-text">
            異位脂肪常見位置包括肝臟、胰臟、骨骼肌、心臟、腎臟周圍與血管周圍。
            當脂肪堆積在這些部位時，會分泌多種發炎因子，造成慢性發炎反應，並干擾胰島素作用，
            引發胰島素阻抗與代謝症候群。
          </p>
          <p className="advanced-text">
            因此，脂肪對健康的影響，不能只看「總量」，更要看「放在哪裡」、「是否處於健康狀態」。
            簡單來說，脂肪不是一多就一定有害，而是「放錯地方」時，才成為代謝疾病的重要觸發點。
          </p>
        </section>

        {/* 三、意志力減重與熱能調節反撲 */}
        <section className="advanced-section">
          <h2 className="advanced-section-title">
            三、意志力減重的限制與熱能調節反撲
          </h2>
          <p className="advanced-text">
            多數人對減重的第一印象是「少吃多動」，這在方向上並非錯誤，但要長期執行非常困難。
            其原因並不僅在於自律或意志力，而是身體存在一套保護能量儲存的生理機制。
          </p>

          <h3 className="advanced-subtitle">
            1. 熱能遺傳調節系統（Thermogenetic Adaptation）
          </h3>
          <p className="advanced-text">
            當身體長期處於能量赤字（例如持續少吃、多動）時，會啟動能量保護機制，
            嘗試維持原本的脂肪儲備。這個過程有時被稱為熱能遺傳調節或有效熱能調節（effective
            thermogenetic regulation）。
          </p>
          <p className="advanced-text">主要反應可分為兩類：</p>
          <ul className="advanced-list">
            <li>增加食慾與對高熱量食物的渴望。</li>
            <li>降低基礎代謝率、體溫與自發性活動量。</li>
          </ul>
          <p className="advanced-text">
            這些變化並非意識可以完全控制，而是身體在保護能量儲存的本能反應。
          </p>

          <h3 className="advanced-subtitle">2. 生活型態介入的實際成效</h3>
          <p className="advanced-text">
            在多項實務性臨床追蹤中，如果只依賴飲食控制與運動等生活型態調整，
            一年後的平均減重幅度大約為原始體重的 2%～3%。以 80 公斤為例，約減少
            1.6～2.4 公斤。
          </p>
          <p className="advanced-text">
            這些數據並非否定生活型態介入的重要性，而是反映：
            純粹依靠意志力與行為調整，與身體長期演化出的能量保護機制對抗時，往往處於劣勢。
          </p>
        </section>

        {/* 四、GIP 研究歷史與 tirzepatide 基本結構 */}
        <section className="advanced-section">
          <h2 className="advanced-section-title">
            四、GIP 研究歷史與 tirzepatide 的分子設計
          </h2>
          <p className="advanced-text">
            GIP（Glucose-dependent Insulinotropic
            Polypeptide）作為腸泌素的一種， 研究歷史可追溯至 1980
            年代。早期研究關注其促進胰島素分泌的作用，
            但受限於對其在肥胖與胰島素阻抗狀態中的角色了解不足，單獨以 GIP
            為治療靶點的策略並未成熟。
          </p>
          <p className="advanced-text">
            後續研究顯示，單獨刺激 GIP
            受體，對減重效果有限，甚至在某些情況下可能促進脂肪堆積； 然而，當
            GIP 與 GLP-1 的作用被同時調節時，整體代謝效果反而有顯著提升。
          </p>

          <h3 className="advanced-subtitle">1. Tirzepatide 的分子特性</h3>
          <p className="advanced-text">
            Tirzepatide 為一種單一分子、同時作用於 GIP 與 GLP-1
            受體的雙重促進劑（dual agonist）， 其結構基於內生性 GIP
            序列進行改造，並加入延長作用時間的設計。
          </p>
          <ul className="advanced-list">
            <li>對 GIP 受體具高親和力，接近原生 GIP 的活性。</li>
            <li>
              對 GLP-1 受體為部分效應，活性低於原生 GLP-1，但足以發揮臨床效果。
            </li>
            <li>平均半衰期約 5 天，可設計為每週一次施打。</li>
          </ul>
          <p className="advanced-text">
            這種「偏重 GIP、兼具 GLP-1」的不對稱雙重作用方式，被視為貼近人體自然
            incretin 系統的一種生理仿生配置，而非單純的兩種藥物疊加。
          </p>
        </section>

        {/* 五、Incretin 系統：GIP 與 GLP-1 的分工 */}
        <section className="advanced-section">
          <h2 className="advanced-section-title">
            五、Incretin 系統：GIP 與 GLP-1 的分工與互補
          </h2>
          <p className="advanced-text">
            Incretin
            系統是指進食後由腸道分泌的荷爾蒙，協助調節胰島素分泌與血糖平衡。
            其中兩個主要成員為 GIP 與 GLP-1。
          </p>
          <p className="advanced-text">
            在一般生理條件下，GIP 被認為約貢獻三分之二的 incretin effect， GLP-1
            則約貢獻三分之一。也就是說，GIP 在自然情況下原本就是主要的 incretin
            成員， 只是過去較少被用於治療設計。
          </p>

          <h3 className="advanced-subtitle">1. GIP 的多重生理功能</h3>
          <ul className="advanced-list">
            <li>葡萄糖依賴性的胰島素分泌調節。</li>
            <li>協同升糖素釋放，以微調血糖平衡。</li>
            <li>促進脂肪組織對葡萄糖與脂肪酸的攝取與儲存。</li>
            <li>增加脂肪組織與內臟血流。</li>
            <li>在中樞神經系統中參與食慾調節，並具抗噁心與神經保護效果。</li>
            <li>抑制飯後骨質吸收，促進骨生成，有利骨質健康。</li>
          </ul>

          <h3 className="advanced-subtitle">2. GLP-1 的主要功能</h3>
          <ul className="advanced-list">
            <li>促進葡萄糖依賴性的胰島素分泌。</li>
            <li>抑制升糖素於高血糖時的過度分泌。</li>
            <li>延緩胃排空，減緩飯後血糖上升。</li>
            <li>增加飽足感，降低食慾與能量攝取。</li>
          </ul>

          <p className="advanced-text">
            當 GIP 與 GLP-1
            受體同時被適度刺激時，除了血糖控制之外，還能在脂肪分布、
            食物偏好、脂質代謝與骨質保護等層面產生協同效果。
          </p>
        </section>

        {/* 六、減重時的體組成與 GIP 的潛在優勢 */}
        <section className="advanced-section">
          <h2 className="advanced-section-title">六、減重、體組成與骨質保護</h2>
          <p className="advanced-text">
            減重時，體重下降的組成不僅包含脂肪，還包括瘦體組織（肌肉與骨骼）。
            目標不只是「變輕」，而是「減脂、維持肌肉與骨質」。
          </p>
          <p className="advanced-text">
            GIP 在動物與部分人體研究中，與骨生成增加與飯後骨質吸收下降有關，
            顯示其可能在減重過程中，有助於維持骨代謝的平衡。對於高風險族群（如年長者、
            絕經後族群等），這類作用被視為有潛在價值的方向之一。
          </p>
        </section>

        {/* 七、GIP 在脂肪組織中的作用：儲存與異位脂肪風險 */}
        <section className="advanced-section">
          <h2 className="advanced-section-title">
            七、GIP 在脂肪組織中的作用與異位脂肪風險
          </h2>
          <p className="advanced-text">
            在進食狀態下，GIP 與胰島素共同調節脂肪組織代謝：
          </p>
          <ul className="advanced-list">
            <li>提升脂蛋白酯酶（LPL）活性，促進血中三酸甘油脂分解。</li>
            <li>增加脂肪細胞對葡萄糖與脂肪酸的攝取，用於脂肪合成與儲存。</li>
            <li>促進脂肪細胞成熟與穩定，維持脂滴結構。</li>
          </ul>
          <p className="advanced-text">
            乍看之下，這些作用像是在「幫助變胖」，但重點在於：若脂肪能被有效儲存在適當的脂肪組織中，
            就較不會在血液中長時間停留，也較不會堆積在肝臟、胰臟、肌肉與血管周圍，
            因此可降低異位脂肪與相關代謝風險。
          </p>
          <p className="advanced-text">
            搭配 GLP-1 所帶來的食慾下降與能量攝取減少，整體效果可視為：
            一方面減少多餘能量的進入，一方面改善脂肪的「質」與「位置」，而非單純消除所有脂肪。
          </p>
        </section>

        {/* 八、能量赤字、脂肪動員與 GIP+GLP-1 的整體效果 */}
        <section className="advanced-section">
          <h2 className="advanced-section-title">
            八、能量赤字、脂肪動員與整體代謝效果
          </h2>
          <p className="advanced-text">
            在能量赤字狀態下，脂肪細胞會動員儲存的三酸甘油脂與脂肪酸，供應整體能量需求。
            若能透過藥物幫助延長能量赤字狀態（例如減少食慾與攝食），同時又維持脂肪組織的健康儲存能力，
            就有機會加速異位脂肪的減少與脂肪再分配。
          </p>
          <p className="advanced-text">
            GIP 與 GLP-1 的雙重作用，概念上可視為：
          </p>
          <ul className="advanced-list">
            <li>減少多餘能量攝取與吸收。</li>
            <li>改善脂肪在身體中的分布與動員方式。</li>
            <li>降低異位脂肪與胰島素阻抗相關風險。</li>
          </ul>
          <p className="advanced-text">
            從代謝系統的角度來看，這不只是讓體重下降，而是協助身體回到較接近「代謝正軌」的狀態。
          </p>
        </section>

        {/* 九、SURMOUNT-1 試驗：肥胖治療的關鍵數據 */}
        <section className="advanced-section">
          <h2 className="advanced-section-title">
            九、SURMOUNT-1：tirzepatide 用於肥胖的臨床試驗
          </h2>
          <p className="advanced-text">
            SURMOUNT-1
            是針對過重或肥胖、且無糖尿病的成人族群所進行的大型國際臨床試驗，
            旨在評估 tirzepatide 在肥胖治療中的長期效果與安全性。
          </p>

          <h3 className="advanced-subtitle">1. 試驗設計概要</h3>
          <ul className="advanced-list">
            <li>對象為成人過重或肥胖者，曾經嘗試生活型態介入但效果有限。</li>
            <li>排除近期體重大幅變動與減重手術後族群。</li>
            <li>
              受試者被隨機分配至安慰劑、5 mg、10 mg 或 15 mg tirzepatide 組別。
            </li>
            <li>治療時間為 72 週，並搭配基本生活型態建議。</li>
          </ul>

          <h3 className="advanced-subtitle">2. 體重減少與達標率</h3>
          <p className="advanced-text">
            在此試驗中，平均體重減少比例隨劑量增加而提高：
          </p>
          <ul className="advanced-list">
            <li>5 mg 組別：約 16% 體重減少。</li>
            <li>15 mg 組別：約 22.5% 體重減少。</li>
          </ul>
          <p className="advanced-text">
            達標率方面，超過八至九成的受試者可達到至少 5% 減重；體重減少超過 20%
            或 25% 的比例， 也明顯高於以往多數減重藥物。這樣的結果，使
            tirzepatide 被視為效果接近代謝減重手術等級的藥物之一。
          </p>
        </section>

        {/* 十、糖尿病族群與減重難度 */}
        <section className="advanced-section">
          <h2 className="advanced-section-title">
            十、糖尿病患者的減重困難與藥物意義
          </h2>
          <p className="advanced-text">
            在第二型糖尿病患者中，除了胰島素阻抗之外，研究顯示可能同時存在
            incretin 受體反應減弱、 leptin
            訊號受損等多重層面的「訊號阻抗」。相較於非糖尿病個體，糖尿病患者在同樣介入下的減重幅度，
            通常約為非糖尿病者的三分之二。
          </p>
          <p className="advanced-text">
            在這類較難減重的族群中，若仍能達到超過 10–15%
            的體重減少，對代謝風險的改善具有相當意義。 相關試驗中，tirzepatide
            在糖尿病族群內對體重與血糖的雙重改善，也因此受到高度關注。
          </p>
        </section>

        {/* 十一、安全性與使用限制（資訊觀點） */}
        <section className="advanced-section">
          <h2 className="advanced-section-title">
            十一、安全性與使用限制（資訊整理）
          </h2>

          <div className="advanced-warning-box">
            <p className="advanced-warning-text">
              本區內容為公開資料之概念整理，僅提供對藥物安全性議題的概念性參考。
              實際用藥評估、風險判斷與處方調整，必須由具處方資格之專業醫療人員進行。
            </p>
          </div>

          <h3 className="advanced-subtitle">1. 常見不良反應</h3>
          <p className="advanced-text">
            在相關臨床試驗與觀察中，常見不良反應多集中於腸胃道症狀，例如噁心、嘔吐、腹瀉、便秘與食慾下降等。
            這些反應與起始劑量與加量速度有密切關係。
          </p>

          <h3 className="advanced-subtitle">2. 劑量遞增的重要性</h3>
          <p className="advanced-text">
            安排逐步遞增的劑量（escalation
            protocol），可以降低腸胃道不適的發生率，提高耐受性與治療持續性。
            過快加量可能會增加不良反應發生風險，因此通常遵循既定的加量間隔與步伐。
          </p>

          <h3 className="advanced-subtitle">3. 特殊族群與風險考量</h3>
          <p className="advanced-text">
            對於有糖尿病、胰臟疾病史、甲狀腺相關疾病、腎功能不全或正在使用其他會影響代謝藥物的族群，
            是否適合使用相關藥物、適合的劑量與監測頻率，皆需個別化評估。
          </p>
        </section>

        {/* 十二、總結：從減重到代謝重整的觀點 */}
        <section className="advanced-section">
          <h2 className="advanced-section-title">
            十二、總結：從「減重」到「代謝重整」
          </h2>
          <p className="advanced-text">
            以 tirzepatide 為代表的 GIP + GLP-1
            雙重受體促進劑，並非單純追求體重數字下降，
            而是從代謝機制出發，試圖同時改善血糖、脂肪分布、異位脂肪、胰島素阻抗與相關心血管風險。
          </p>
          <p className="advanced-text">
            從觀念上，肥胖不再只是「外觀」或「意志力」問題，而是與內臟脂肪、異位脂肪、
            發炎反應與荷爾蒙調節密切相關的慢性代謝疾病。減重不只是讓體重變輕，
            而是希望透過生活型態與必要時的藥物介入，讓身體的脂肪儲存方式與代謝功能更接近健康範圍。
          </p>
          <p className="advanced-text">
            本頁內容的角色，是協助理解相關研究與機轉的基本概念，便於閱讀國內外資料時有一個脈絡。
            實際治療與用藥仍需回到個別病史、風險評估與專業醫療判斷。
          </p>
        </section>
      </div>
    </div>
  );
}

export default AdvancedPage;
