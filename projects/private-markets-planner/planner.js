const form = document.querySelector("#plannerForm");
const defaults = {
  commitment: 100,
  paidIn: 62,
  distributions: 18,
  nav: 54,
  fundAge: 5,
  remainingYears: 5,
  futureCallPct: 80,
  navGrowth: 6,
  distributionYield: 16,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const money = (value) => `$${value.toFixed(1)}m`;
const multiple = (value) => `${value.toFixed(2)}x`;
const percent = (value) => `${Math.round(value)}%`;

function readInputs() {
  const raw = Object.fromEntries(new FormData(form).entries());
  return {
    commitment: Math.max(0.01, Number(raw.commitment) || 0.01),
    paidIn: Math.max(0, Number(raw.paidIn) || 0),
    distributions: Math.max(0, Number(raw.distributions) || 0),
    nav: Math.max(0, Number(raw.nav) || 0),
    fundAge: clamp(Math.round(Number(raw.fundAge) || 1), 1, 12),
    remainingYears: clamp(Math.round(Number(raw.remainingYears) || 1), 1, 12),
    futureCallPct: clamp(Number(raw.futureCallPct) || 0, 0, 100),
    navGrowth: clamp(Number(raw.navGrowth) || 0, -20, 30),
    distributionYield: clamp(Number(raw.distributionYield) || 0, 0, 100),
  };
}

function weightedSchedule(total, years, direction = "declining") {
  if (years <= 0 || total <= 0) return Array(Math.max(years, 0)).fill(0);
  const weights = Array.from({ length: years }, (_, index) => {
    if (direction === "increasing") return Math.pow(index + 1, 1.45);
    return Math.exp(-0.32 * index);
  });
  const weightTotal = weights.reduce((sum, value) => sum + value, 0);
  return weights.map((weight) => (total * weight) / weightTotal);
}

function projectScenario(inputs, growthRate, distributionRate) {
  const uncalled = Math.max(0, inputs.commitment - inputs.paidIn);
  const futureCalls = uncalled * (inputs.futureCallPct / 100);
  const callSchedule = weightedSchedule(futureCalls, inputs.remainingYears, "declining");
  let nav = inputs.nav;
  let futureDistributions = 0;
  const annualDistributions = [];

  for (let year = 0; year < inputs.remainingYears; year += 1) {
    nav += callSchedule[year];
    nav *= 1 + growthRate / 100;
    const distribution = year === inputs.remainingYears - 1 ? nav : nav * (distributionRate / 100);
    futureDistributions += distribution;
    annualDistributions.push(distribution);
    nav -= distribution;
  }

  const projectedPaidIn = inputs.paidIn + futureCalls;
  const projectedDistributions = inputs.distributions + futureDistributions;
  const projectedTvpi = projectedPaidIn > 0 ? projectedDistributions / projectedPaidIn : 0;
  return { futureCalls, callSchedule, annualDistributions, projectedPaidIn, projectedDistributions, projectedTvpi };
}

function buildCurve(inputs, projection) {
  const historicalCalls = weightedSchedule(inputs.paidIn, inputs.fundAge, "declining");
  const historicalDistributions = weightedSchedule(inputs.distributions, inputs.fundAge, "increasing");
  const values = [0];
  let cumulative = 0;

  for (let year = 0; year < inputs.fundAge; year += 1) {
    cumulative += historicalDistributions[year] - historicalCalls[year];
    values.push(cumulative);
  }
  for (let year = 0; year < inputs.remainingYears; year += 1) {
    cumulative += projection.annualDistributions[year] - projection.callSchedule[year];
    values.push(cumulative);
  }
  return values;
}

function renderChart(values, fundAge) {
  const width = 760;
  const height = 310;
  const pad = { top: 28, right: 28, bottom: 42, left: 52 };
  const minValue = Math.min(0, ...values);
  const maxValue = Math.max(0, ...values);
  const range = Math.max(1, maxValue - minValue);
  const x = (index) => pad.left + (index / Math.max(1, values.length - 1)) * (width - pad.left - pad.right);
  const y = (value) => pad.top + ((maxValue - value) / range) * (height - pad.top - pad.bottom);
  const zeroY = y(0);
  const points = values.map((value, index) => [x(index), y(value)]);
  const linePath = points.map(([px, py], index) => `${index === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${points.at(-1)[0].toFixed(1)} ${zeroY.toFixed(1)} L ${points[0][0].toFixed(1)} ${zeroY.toFixed(1)} Z`;

  document.querySelector("#jCurveLine").setAttribute("d", linePath);
  document.querySelector("#jCurveArea").setAttribute("d", areaPath);
  document.querySelector("#chartGrid").innerHTML = [0.25, 0.5, 0.75]
    .map((ratio) => `<line class="chart-grid-line" x1="${pad.left}" x2="${width - pad.right}" y1="${(pad.top + ratio * (height - pad.top - pad.bottom)).toFixed(1)}" y2="${(pad.top + ratio * (height - pad.top - pad.bottom)).toFixed(1)}"></line>`)
    .join("") + `<line class="chart-zero-line" x1="${pad.left}" x2="${width - pad.right}" y1="${zeroY.toFixed(1)}" y2="${zeroY.toFixed(1)}"></line>`;
  document.querySelector("#chartPoints").innerHTML = points
    .map(([px, py], index) => `<circle class="chart-point" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${index === fundAge ? 5 : 3.5}"><title>Year ${index}: ${money(values[index])} cumulative net cash flow</title></circle>`)
    .join("");
  document.querySelector("#chartLabels").innerHTML = points
    .map(([px], index) => `<text class="chart-label" x="${px.toFixed(1)}" y="${height - 16}" text-anchor="middle">${index}</text>`)
    .join("") + `<text class="chart-label" x="${pad.left}" y="16">Cumulative net cash flow ($m)</text>`;
}

function render() {
  const inputs = readInputs();
  const paidIn = Math.min(inputs.paidIn, inputs.commitment);
  const normalized = { ...inputs, paidIn };
  const tvpi = paidIn > 0 ? (inputs.nav + inputs.distributions) / paidIn : 0;
  const dpi = paidIn > 0 ? inputs.distributions / paidIn : 0;
  const rvpi = paidIn > 0 ? inputs.nav / paidIn : 0;
  const uncalled = Math.max(0, inputs.commitment - paidIn);
  const calledPct = (paidIn / inputs.commitment) * 100;
  const base = projectScenario(normalized, inputs.navGrowth, inputs.distributionYield);

  document.querySelector("#tvpiMetric").textContent = multiple(tvpi);
  document.querySelector("#dpiMetric").textContent = multiple(dpi);
  document.querySelector("#rvpiMetric").textContent = multiple(rvpi);
  document.querySelector("#uncalledMetric").textContent = money(uncalled);
  document.querySelector("#calledMetric").textContent = percent(calledPct);
  document.querySelector("#projectedTvpiMetric").textContent = multiple(base.projectedTvpi);
  document.querySelector("#plannerStatus").textContent = `Synthetic year-${inputs.fundAge} position with ${inputs.remainingYears} years remaining.`;

  const plannedCalls = base.futureCalls;
  const reserve = Math.max(0, uncalled - plannedCalls);
  document.querySelector("#paidBar").style.width = `${clamp((paidIn / inputs.commitment) * 100, 0, 100)}%`;
  document.querySelector("#plannedBar").style.width = `${clamp((plannedCalls / inputs.commitment) * 100, 0, 100)}%`;
  document.querySelector("#reserveBar").style.width = `${clamp((reserve / inputs.commitment) * 100, 0, 100)}%`;
  document.querySelector("#paidLegend").textContent = money(paidIn);
  document.querySelector("#plannedLegend").textContent = money(plannedCalls);
  document.querySelector("#reserveLegend").textContent = money(reserve);

  const scenarios = [
    { name: "Downside", growth: inputs.navGrowth - 4, yieldRate: Math.max(0, inputs.distributionYield - 4) },
    { name: "Base", growth: inputs.navGrowth, yieldRate: inputs.distributionYield },
    { name: "Upside", growth: inputs.navGrowth + 4, yieldRate: Math.min(100, inputs.distributionYield + 4) },
  ];
  document.querySelector("#scenarioRows").innerHTML = scenarios.map((scenario) => {
    const result = projectScenario(normalized, scenario.growth, scenario.yieldRate);
    const tone = scenario.name === "Downside" ? "warning" : scenario.name === "Upside" ? "positive" : "";
    return `<tr><td>${scenario.name}</td><td>${scenario.growth.toFixed(1)}%</td><td>${scenario.yieldRate.toFixed(1)}%</td><td>${money(result.projectedPaidIn)}</td><td>${money(result.projectedDistributions)}</td><td class="${tone}">${multiple(result.projectedTvpi)}</td></tr>`;
  }).join("");

  const curve = buildCurve(normalized, base);
  renderChart(curve, inputs.fundAge);
  const lowPoint = Math.min(...curve);
  const lowYear = curve.indexOf(lowPoint);
  const breakEvenYear = curve.findIndex((value, index) => index > lowYear && value >= 0);
  document.querySelector("#curveSummary").textContent = breakEvenYear >= 0
    ? `The illustrative curve reaches its low point in year ${lowYear} and crosses cumulative break-even in year ${breakEvenYear}.`
    : `The illustrative curve reaches its low point in year ${lowYear} and does not cross cumulative break-even within the selected fund life.`;
}

form.addEventListener("input", render);
document.querySelector("#resetPlanner").addEventListener("click", () => {
  Object.entries(defaults).forEach(([key, value]) => { form.elements[key].value = value; });
  render();
});

render();
