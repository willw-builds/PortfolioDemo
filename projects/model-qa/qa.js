const fileInput = document.querySelector("#workbookFile");
const dropZone = document.querySelector("#dropZone");
const issueRows = document.querySelector("#issueRows");
const errorTokens = ["#REF!", "#DIV/0!", "#VALUE!", "#NAME?", "#N/A", "#NUM!"];
let currentReport = null;

function columnLabel(index) {
  let label = "";
  let value = index + 1;
  while (value > 0) { const remainder = (value - 1) % 26; label = String.fromCharCode(65 + remainder) + label; value = Math.floor((value - 1) / 26); }
  return label;
}

function cellAddress(row, column) { return `${columnLabel(column)}${row + 1}`; }
function columnIndex(label) {
  return [...label].reduce((total, letter) => total * 26 + letter.charCodeAt(0) - 64, 0) - 1;
}

function normalizeFormula(formula, originRow, originColumn) {
  return String(formula).toUpperCase().replace(/(\$?)([A-Z]{1,3})(\$?)(\d+)/g, (_, absoluteColumn, column, absoluteRow, row) => {
    const normalizedColumn = absoluteColumn ? `C${column}` : `C[${columnIndex(column) - originColumn}]`;
    const normalizedRow = absoluteRow ? `R${row}` : `R[${Number(row) - 1 - originRow}]`;
    return `${normalizedRow}${normalizedColumn}`;
  }).replace(/\s+/g, "");
}
function activeChecks() { return new Set([...document.querySelectorAll(".qa-toggle:checked")].map((node) => node.value)); }

function sampleWorkbook() {
  return {
    name: "Atlas Components — seeded QA sample",
    sheets: [{
      name: "Operating",
      rows: [
        ["Metric", "2026", "2027", "2028", "2029", "2030"],
        ["Revenue", 1000, { f: "B2*(1+0.05)", v: 1050 }, { f: "C2*(1+0.05)", v: 1102.5 }, { f: "D2*1.12", v: 1234.8 }, { f: "E2*(1+0.05)", v: 1296.5 }],
        ["Operating costs", -620, { f: "B3*(1+0.03)", v: -638.6 }, { f: "C3*(1+0.03)", v: -657.8 }, { f: "D3*(1+0.03)", v: -677.5 }, { f: "E3*(1+0.03)", v: -697.8 }],
        ["EBITDA", { f: "B2+B3", v: 380 }, { f: "C2+C3", v: 411.4 }, null, { f: "E2+E3", v: 557.3 }, { f: "F2+F3", v: 598.7 }],
        ["Margin", { f: "B4/B2", v: 0.38, z: "0.0%" }, { f: "C4/C2", v: 0.392, z: "0.0%" }, { f: "D4/D2", v: "#DIV/0!", z: "0.0%" }, { f: "E4/E2", v: 5, z: "0.0%" }, { f: "F4/F2", v: 0.462, z: "0.0%" }],
        ["Free cash flow", { f: "B4-80", v: 300 }, { f: "C4-80", v: 331.4 }, { f: "D4-80", v: 0 }, { f: "E4+80", v: 637.3 }, { f: "F4-80", v: 518.7 }],
      ],
    }, {
      name: "Returns",
      rows: [
        ["Metric", "Value"],
        ["Entry EV", 4200],
        ["Exit EV", { f: "Operating!F4*10.0", v: 5987 }],
        ["Equity value", { f: "B3-#REF!", v: "#REF!" }],
      ],
    }],
  };
}

function parseSheetJsWorkbook(workbook, fileName) {
  const sheets = workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name];
    if (!sheet["!ref"]) return { name, rows: [] };
    const range = XLSX.utils.decode_range(sheet["!ref"]);
    const rows = [];
    for (let row = range.s.r; row <= range.e.r; row += 1) {
      const cells = [];
      for (let col = range.s.c; col <= range.e.c; col += 1) {
        const raw = sheet[XLSX.utils.encode_cell({ r: row, c: col })];
        cells.push(raw ? { v: raw.v, f: raw.f, z: raw.z, t: raw.t } : null);
      }
      rows.push(cells);
    }
    return { name, rows };
  });
  return { name: fileName, sheets };
}

function addFinding(findings, severity, category, sheet, cell, evidence, action) {
  findings.push({ id: `QA-${String(findings.length + 1).padStart(3, "0")}`, severity, category, sheet, cell, evidence, action });
}

function inspect(model) {
  const enabled = activeChecks();
  const findings = [];
  let populated = 0;
  let formulas = 0;

  model.sheets.forEach((sheet) => {
    const rows = sheet.rows;
    rows.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell == null) return;
        populated += 1;
        const value = typeof cell === "object" ? cell.v : cell;
        const formula = typeof cell === "object" ? cell.f : null;
        const format = typeof cell === "object" ? cell.z : null;
        const address = cellAddress(rowIndex, colIndex);
        if (formula) formulas += 1;

        if (enabled.has("errors") && errorTokens.some((token) => String(value).includes(token) || String(formula || "").includes(token))) {
          addFinding(findings, "High", "Formula error", sheet.name, address, `${formula ? `=${formula}` : value}`, "Repair the broken reference or error-producing calculation, then recalculate the workbook.");
        }
        if (enabled.has("errors") && formula && /\/\s*0(?:\D|$)/.test(formula)) {
          addFinding(findings, "High", "Divide by zero", sheet.name, address, `=${formula}`, "Verify the denominator and add an explicit error-handling rule if appropriate.");
        }
        if (enabled.has("percentages") && format && format.includes("%") && typeof value === "number" && Math.abs(value) > 1) {
          addFinding(findings, "High", "Percentage magnitude", sheet.name, address, `${value} formatted as ${format}`, "Confirm whether the input should be expressed as a decimal (for example, 0.05 rather than 5).");
        }
        if (enabled.has("constants") && formula) {
          const literals = [...String(formula).matchAll(/(?:^|[^A-Z\d.])(\d+(?:\.\d+)?)(?![A-Z\d])/gi)].map((match) => Number(match[1]));
          const suspicious = literals.filter((literal) => ![0, 1, 12, 100, 365].includes(literal) && literal > 1);
          if (suspicious.length) addFinding(findings, "Medium", "Hard-code in formula", sheet.name, address, `=${formula}`, `Confirm whether ${suspicious.join(", ")} should reference an assumptions cell.`);
        }
      });

      const formulaColumns = row.map((cell, index) => (cell && typeof cell === "object" && cell.f ? index : -1)).filter((index) => index >= 0);
      if (formulaColumns.length >= 3) {
        const start = Math.min(...formulaColumns);
        const end = Math.max(...formulaColumns);
        for (let col = start + 1; col < end; col += 1) {
          const cell = row[col];
          const hasFormula = cell && typeof cell === "object" && cell.f;
          if (enabled.has("gaps") && !hasFormula) {
            addFinding(findings, "High", "Formula gap", sheet.name, cellAddress(rowIndex, col), cell == null ? "Blank inside formula run" : `Hard-coded value: ${typeof cell === "object" ? cell.v : cell}`, "Compare with adjacent periods and restore the expected formula or document the exception.");
          }
        }
        if (enabled.has("patterns")) {
          for (let col = start + 1; col < end; col += 1) {
            const left = row[col - 1]; const cell = row[col]; const right = row[col + 1];
            if (!left?.f || !cell?.f || !right?.f) continue;
            const leftPattern = normalizeFormula(left.f, rowIndex, col - 1); const pattern = normalizeFormula(cell.f, rowIndex, col); const rightPattern = normalizeFormula(right.f, rowIndex, col + 1);
            if (leftPattern === rightPattern && pattern !== leftPattern) addFinding(findings, "Medium", "Formula pattern", sheet.name, cellAddress(rowIndex, col), `=${cell.f}; neighbors follow ${leftPattern}`, "Review whether this period intentionally departs from the copied formula pattern.");
          }
        }
      }
    });
  });

  return { workbook: model.name, sheetCount: model.sheets.length, populated, formulas, findings };
}

function render(report) {
  currentReport = report;
  document.querySelector("#sheetCount").textContent = report.sheetCount;
  document.querySelector("#formulaCount").textContent = report.formulas;
  document.querySelector("#highCount").textContent = report.findings.filter((item) => item.severity === "High").length;
  document.querySelector("#findingCount").textContent = report.findings.length;
  document.querySelector("#qaStatus").textContent = `${report.workbook}: reviewed ${report.populated.toLocaleString()} populated cells. Findings are review signals, not a model certification.`;
  document.querySelector("#exportReport").disabled = false;
  issueRows.innerHTML = report.findings.length ? report.findings.map((item) => `<tr><td><span class="severity ${item.severity.toLowerCase()}">${item.severity}</span></td><td>${item.sheet}</td><td><strong>${item.cell}</strong></td><td>${item.category}</td><td>${item.evidence}</td><td>${item.action}</td></tr>`).join("") : `<tr><td class="empty-state" colspan="6">No structural findings from the enabled checks. This does not prove the model is correct.</td></tr>`;
}

async function loadFile(file) {
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { document.querySelector("#qaStatus").textContent = "This prototype accepts workbooks up to 5 MB."; return; }
  document.querySelector("#fileName").textContent = file.name;
  try {
    if (typeof XLSX === "undefined") throw new Error("Spreadsheet parser unavailable");
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array", cellFormula: true, cellNF: true, cellText: true });
    render(inspect(parseSheetJsWorkbook(workbook, file.name)));
  } catch (error) {
    document.querySelector("#qaStatus").textContent = `Could not analyze this workbook: ${error.message}. Try the seeded sample.`;
  }
}

fileInput.addEventListener("change", () => loadFile(fileInput.files[0]));
dropZone.addEventListener("dragover", (event) => { event.preventDefault(); dropZone.classList.add("is-dragging"); });
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("is-dragging"));
dropZone.addEventListener("drop", (event) => { event.preventDefault(); dropZone.classList.remove("is-dragging"); loadFile(event.dataTransfer.files[0]); });
document.querySelector("#sampleButton").addEventListener("click", () => { document.querySelector("#fileName").textContent = "Atlas Components — seeded sample"; render(inspect(sampleWorkbook())); });
document.querySelector("#clearButton").addEventListener("click", () => {
  fileInput.value = ""; currentReport = null; document.querySelector("#fileName").textContent = "No workbook selected"; document.querySelector("#qaStatus").textContent = "Load the sample model or choose a workbook to begin.";
  ["sheetCount", "formulaCount", "highCount", "findingCount"].forEach((id) => { document.querySelector(`#${id}`).textContent = "—"; });
  issueRows.innerHTML = `<tr><td class="empty-state" colspan="6">No model has been analyzed yet.</td></tr>`; document.querySelector("#exportReport").disabled = true;
});
document.querySelectorAll(".qa-toggle").forEach((toggle) => toggle.addEventListener("change", () => { if (document.querySelector("#fileName").textContent.includes("Atlas Components")) render(inspect(sampleWorkbook())); }));
document.querySelector("#exportReport").addEventListener("click", () => {
  if (!currentReport) return;
  const payload = JSON.stringify({ ...currentReport, disclaimer: "Structural QA signals only; human review required." }, null, 2);
  const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
  const link = document.createElement("a"); link.href = url; link.download = "financial-model-qa-report.json"; link.click(); URL.revokeObjectURL(url);
});
