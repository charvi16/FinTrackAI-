export function calculateEmergencyFund({
  essentialExpenses,
  jobRisk,
  dependents,
  insuranceCoverage,
  upcomingExpenses = 0
}) {
  // Convert to numbers safely
  essentialExpenses = Number(essentialExpenses);
  dependents = Number(dependents);
  upcomingExpenses = Number(upcomingExpenses);

  let warnings = [];

  // ----------- VALIDATIONS ------------- //

  // ❌ 1. Negative numbers → Auto-fix to zero
  if (essentialExpenses < 0) {
    essentialExpenses = 0;
    warnings.push("Essential expenses cannot be negative. Auto-adjusted to 0.");
  }

  if (dependents < 0) {
    dependents = 0;
    warnings.push("Dependents cannot be negative. Auto-adjusted to 0.");
  }

  if (upcomingExpenses < 0) {
    upcomingExpenses = 0;
    warnings.push("Upcoming expenses cannot be negative. Auto-adjusted to 0.");
  }

  // ❌ 2. Null / NaN / Empty inputs → Auto-fix to zero + warning
  const fields = [
    ["essentialExpenses", essentialExpenses],
    ["dependents", dependents],
    ["upcomingExpenses", upcomingExpenses],
  ];

  fields.forEach(([name, value]) => {
    if (isNaN(value)) {
      warnings.push(`${name} contained invalid data and was reset to 0.`);
      if (name === "essentialExpenses") essentialExpenses = 0;
      if (name === "dependents") dependents = 0;
      if (name === "upcomingExpenses") upcomingExpenses = 0;
    }
  });

  // ❌ 3. Unrealistic values → Warnings (but allowed)
  if (essentialExpenses > 300000) {
    warnings.push(
      "Your monthly essential expenses seem very high. Please double-check the value."
    );
  }

  if (dependents > 10) {
    warnings.push("You entered more than 10 dependents. This seems unrealistic.");
  }

  if (upcomingExpenses > 10000000) {
    warnings.push(
      "Upcoming big expenses exceed ₹1 crore. Ensure this is correct."
    );
  }

  // ------------- CALCULATION ------------ //

  let baseMonths = 0;

  if (jobRisk === "low") baseMonths = 3;
  else if (jobRisk === "medium") baseMonths = 6;
  else if (jobRisk === "high") baseMonths = 12;
  else {
    baseMonths = 6;
    warnings.push("Invalid job risk value. Defaulting to medium risk.");
  }

  // Dependents add +1 month (max 4)
  const dependentMonths = Math.min(dependents, 4);

  // Insurance reduces risk slightly
  const insuranceAdjustment = insuranceCoverage ? 1 : 0;

  let totalMonths = baseMonths + dependentMonths - insuranceAdjustment;

  // Minimum protection = 3 months
  if (totalMonths < 3) totalMonths = 3;

  const emergencyFundNeeded =
    essentialExpenses * totalMonths + upcomingExpenses;

  return {
    totalMonths,
    emergencyFundNeeded: Math.round(emergencyFundNeeded),
    warnings,
    summary: `
Based on your expenses, job stability, dependents, and insurance,
you need an emergency fund covering **${totalMonths} months**.
Total recommended emergency fund: **₹${Math.round(emergencyFundNeeded)}**.
    `,
  };
}
