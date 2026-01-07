import BmrCalculator from "./BmrCalculator";

export const metadata = {
  title: "BMR & BMI 計算機｜基礎代謝率與身體質量指數｜猛健樂森友會",
  description:
    "免費線上 BMR (基礎代謝率) 與 BMI 計算機。輸入身高、體重、年齡，立即計算您的每日消耗熱量。根據 Mifflin-St. Jeor 標準公式，協助您規劃減重飲食與運動計畫。",
  keywords: [
    "BMR計算",
    "BMI計算",
    "基礎代謝率",
    "每日消耗熱量",
    "TDEE",
    "減肥計算機",
    "熱量赤字",
    "增肌減脂",
    "Mifflin-St Jeor",
  ],
  openGraph: {
    title: "BMR & BMI 計算機｜精準計算基礎代謝率",
    description:
      "想減肥先算 BMR！輸入數值立即獲得您的基礎代謝率與 BMI 指數，科學化管理體重。",
  },
};

export default function BmrPage() {
  return <BmrCalculator />;
}
