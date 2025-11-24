import EmergencyFundCalculator from "../../components/EmergencyFundCalculator/EmergencyFundCalculator";
import "./calculatorPage.css"; // if you want styles for page

export default function CalculatorPage() {
  return (
    <div className="calc-page">
      <h1 className="calc-title">Financial Calculators</h1>

      {/* Add the component here */}
      <EmergencyFundCalculator />
    </div>
  );
}
