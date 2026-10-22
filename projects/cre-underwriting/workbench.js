const form = document.querySelector("#assumptions");
const defaults = Object.fromEntries(new FormData(form).entries());

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const percent = new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 });
const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

function readInputs() {
  return Object.fromEntries([...new FormData(form).entries()].map(([key, value]) => [key, Number(value)]));
}

function annualDebtService(principal, annualRate, amortizationYears) {
  const monthlyRate = annualRate / 12;
  const months = amortizationYears * 12;
  if (principal <= 0) return 0;
  if (monthlyRate === 0) return principal / amortizationYears;
  return (principal * monthlyRate / (1 - (1 + monthlyRate) ** -months)) * 12;
}

function remainingBalance(principal, annualRate, amortizationYears, elapsedMonths) {
  const monthlyRate = annualRate / 12;
  const totalMonths = amortizationYears * 12;
  if (principal <= 0) return 0;
  if (monthlyRate === 0) return principal * Math.max(0, 1 - elapsedMonths / totalMonths);
  const payment = principal * monthlyRate / (1 - (1 + monthlyRate) ** -totalMonths);
  return principal * (1 + monthlyRate) ** elapsedMonths - payment * (((1 + monthlyRate) ** elapsedMonths - 1) / monthlyRate);
}

function irr(cashFlows) {
  if (!cashFlows.some((value) => value < 0) || !cashFlows.some((value) => value > 0)) return null;
  const npv = (rate) => cashFlows.reduce((sum, value, year) => sum + value / (1 + rate) ** year, 0);
  let low = -0.999;
  let high = 10;
  if (npv(low) * npv(high) > 0) return null;
  for (let i = 0; i < 180; i += 1) {
    const mid = (low + high) / 2;
    if (npv(low) * npv(mid) <= 0) high = mid;
    else low = mid;
  }
  return (low + high) / 2;
}

function calculate(input, overrides = {}) {
  const assumptions = { ...input, ...overrides };
  const vacancy = assumptions.vacancy / 100;
  const rentGrowth = assumptions.rentGrowth / 100;
  const expenseGrowth = assumptions.expenseGrowth / 100;
  const ltv = assumptions.ltv / 100;
  const annualRate = assumptions.interestRate / 100;
  const exitCap = assumptions.exitCap / 100;
  const saleCosts = assumptions.saleCosts / 100;
  const loanAmount = assumptions.purchasePrice * ltv;
  const debtService = annualDebtService(loanAmount, annualRate, assumptions.amortizationYears);
  const initialEquity = assumptions.purchasePrice - loanAmount;
  const years = [];

  for (let year = 1; year <= assumptions.holdYears + 1; year += 1) {
    const grossRent = assumptions.grossPotentialRent * (1 + rentGrowth) ** (year - 1);
    const otherIncome = assumptions.otherIncome * (1 + rentGrowth) ** (year - 1);
    const effectiveIncome = grossRent * (1 - vacancy) + otherIncome;
    const expenses = assumptions.operatingExpenses * (1 + expenseGrowth) ** (year - 1);
    const noi = effectiveIncome - expenses;
    const capex = assumptions.annualCapex * (1 + expenseGrowth) ** (year - 1);
    years.push({ year, effectiveIncome, expenses, noi, capex });
  }

  const remainingLoan = remainingBalance(loanAmount, annualRate, assumptions.amortizationYears, assumptions.holdYears * 12);
  const grossSale = years[assumptions.holdYears].noi / exitCap;
  const netSale = grossSale * (1 - saleCosts) - remainingLoan;
  const cashFlows = [-initialEquity];
  years.slice(0, assumptions.holdYears).forEach((row, index) => {
    const sale = index === assumptions.holdYears - 1 ? netSale : 0;
    cashFlows.push(row.noi - debtService - row.capex + sale);
  });
  const returnRate = irr(cashFlows);
  const distributions = cashFlows.slice(1).reduce((sum, value) => sum + Math.max(0, value), 0);

  return {
    assumptions,
    years,
    loanAmount,
    debtService,
    initialEquity,
    remainingLoan,
    grossSale,
    netSale,
    cashFlows,
    irr: returnRate,
    equityMultiple: initialEquity > 0 ? distributions / initialEquity : null,
    goingInCap: years[0].noi / assumptions.purchasePrice,
    dscr: debtService > 0 ? years[0].noi / debtService : null,
    debtYield: loanAmount > 0 ? years[0].noi / loanAmount : null,
  };
}

function toneMetric(element, value, warnBelow, badBelow) {
  element.classList.remove("positive", "warning", "negative");
  if (value == null) return;
  element.classList.add(value < badBelow ? "negative" : value < warnBelow ? "warning" : "positive");
}

function render(model) {
  const yearOne = model.years[0];
  document.querySelector("#noiMetric").textContent = money.format(yearOne.noi);
  document.querySelector("#capMetric").textContent = percent.format(model.goingInCap);
  document.querySelector("#dscrMetric").textContent = model.dscr == null ? "No debt" : `${number.format(model.dscr)}x`;
  document.querySelector("#debtYieldMetric").textContent = model.debtYield == null ? "No debt" : percent.format(model.debtYield);
  document.querySelector("#irrMetric").textContent = model.irr == null ? "Unavailable" : percent.format(model.irr);
  document.querySelector("#emMetric").textContent = model.equityMultiple == null ? "Unavailable" : `${number.format(model.equityMultiple)}x`;
  document.querySelector("#loanMetric").textContent = money.format(model.loanAmount);
  document.querySelector("#debtServiceMetric").textContent = money.format(model.debtService);
  toneMetric(document.querySelector("#dscrMetric"), model.dscr, 1.25, 1);
  toneMetric(document.querySelector("#irrMetric"), model.irr, 0.12, 0.08);

  document.querySelector("#cashFlowRows").innerHTML = model.years.slice(0, model.assumptions.holdYears).map((row, index) => {
    const cashFlow = model.cashFlows[index + 1];
    return `<tr><td>Year ${row.year}${index === model.assumptions.holdYears - 1 ? " + sale" : ""}</td><td>${money.format(row.effectiveIncome)}</td><td>${money.format(row.expenses)}</td><td>${money.format(row.noi)}</td><td>${money.format(model.debtService)}</td><td>${money.format(cashFlow)}</td></tr>`;
  }).join("");

  const growthSteps = [-1, 0, 1].map((delta) => model.assumptions.rentGrowth + delta);
  const capSteps = [-0.5, 0, 0.5].map((delta) => model.assumptions.exitCap + delta);
  document.querySelector("#sensitivityHead").innerHTML = `<tr><th>Exit cap ↓ / growth →</th>${growthSteps.map((growth) => `<th>${growth.toFixed(1)}%</th>`).join("")}</tr>`;
  document.querySelector("#sensitivityBody").innerHTML = capSteps.map((cap) => `<tr><td>${cap.toFixed(2)}%</td>${growthSteps.map((growth) => {
    const scenario = calculate(model.assumptions, { exitCap: cap, rentGrowth: growth });
    const value = scenario.irr == null ? "—" : percent.format(scenario.irr);
    const base = cap === model.assumptions.exitCap && growth === model.assumptions.rentGrowth;
    return `<td${base ? ' style="outline:2px solid var(--coral);outline-offset:-3px;font-weight:600"' : ""}>${value}</td>`;
  }).join("")}</tr>`).join("");

  const warnings = [];
  if (model.dscr != null && model.dscr < 1) warnings.push("Year 1 NOI does not cover annual debt service.");
  if (model.assumptions.exitCap < model.goingInCap * 100) warnings.push("Exit cap compression increases projected value; review whether that assumption is supportable.");
  if (model.assumptions.rentGrowth > 8) warnings.push("Income growth above 8% is an aggressive assumption.");
  document.querySelector("#modelStatus").textContent = warnings.length ? warnings.join(" ") : `Base case: ${model.assumptions.units} units, ${model.assumptions.holdYears}-year hold, ${percent.format(model.goingInCap)} entry cap.`;
  window.currentModel = model;
}

function run() {
  const input = readInputs();
  const invalid = input.purchasePrice <= 0 || input.units <= 0 || input.vacancy < 0 || input.vacancy > 100 || input.ltv < 0 || input.ltv > 100 || input.interestRate < 0 || input.exitCap <= 0;
  if (invalid) {
    document.querySelector("#modelStatus").textContent = "Check the highlighted assumptions: price, units, rates, vacancy, and leverage must be within valid ranges.";
    return;
  }
  render(calculate(input));
}

form.addEventListener("submit", (event) => { event.preventDefault(); run(); });
form.addEventListener("input", run);
document.querySelector("#resetModel").addEventListener("click", () => {
  Object.entries(defaults).forEach(([name, value]) => { form.elements[name].value = value; });
  run();
});
document.querySelector("#downloadBrief").addEventListener("click", () => {
  const model = window.currentModel;
  const text = [
    "# CRE Underwriting Snapshot",
    "",
    "Synthetic educational scenario — not investment advice.",
    "",
    `- Purchase price: ${money.format(model.assumptions.purchasePrice)}`,
    `- Units: ${model.assumptions.units}`,
    `- Year 1 NOI: ${money.format(model.years[0].noi)}`,
    `- Going-in cap: ${percent.format(model.goingInCap)}`,
    `- DSCR: ${model.dscr == null ? "No debt" : `${number.format(model.dscr)}x`}`,
    `- Debt yield: ${model.debtYield == null ? "No debt" : percent.format(model.debtYield)}`,
    `- Levered IRR: ${model.irr == null ? "Unavailable" : percent.format(model.irr)}`,
    `- Equity multiple: ${model.equityMultiple == null ? "Unavailable" : `${number.format(model.equityMultiple)}x`}`,
    "",
    "Generated by Will Wu's CRE Underwriting Workbench prototype.",
  ].join("\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/markdown" }));
  const link = document.createElement("a");
  link.href = url; link.download = "cre-underwriting-snapshot.md"; link.click();
  URL.revokeObjectURL(url);
});

run();
