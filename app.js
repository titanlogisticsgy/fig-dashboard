/* ─── FRESH ISLAND GLOBAL — DASHBOARD APP ─────────────────────────── */

/* ── Theme Toggle ─────────────────────────────────────────────────── */
(function () {
  const html = document.documentElement;
  const btn = document.querySelector('[data-theme-toggle]');
  let theme = html.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
  html.setAttribute('data-theme', theme);

  function updateBtn() {
    if (!btn) return;
    btn.innerHTML = theme === 'dark'
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  if (btn) btn.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', theme);
    updateBtn();
    updateAllCharts();
  });
  updateBtn();
})();

/* ── Date ─────────────────────────────────────────────────────────── */
const dateEl = document.getElementById('current-date');
if (dateEl) {
  dateEl.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

/* ── Set today in form date fields ────────────────────────────────── */
const today = new Date().toISOString().split('T')[0];
['rev-date', 'exp-date', 'job-date'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.value = today;
});

/* ── Navigation ───────────────────────────────────────────────────── */
const navItems = document.querySelectorAll('.nav-item[data-view]');
const views = document.querySelectorAll('.view');
const pageTitleEl = document.getElementById('page-title');

const viewTitles = {
  overview: 'Overview',
  revenue: 'Revenue',
  clients: 'Clients',
  operations: 'Operations',
  marketing: 'Marketing',
  finance: 'Finance',
  'add-entry': 'Add Entry'
};

navItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const target = item.dataset.view;
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    views.forEach(v => v.classList.remove('active'));
    const view = document.getElementById('view-' + target);
    if (view) view.classList.add('active');
    if (pageTitleEl) pageTitleEl.textContent = viewTitles[target] || target;
  });
});

/* ── Form Tabs ────────────────────────────────────────────────────── */
document.querySelectorAll('.form-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.entry-form').forEach(f => f.classList.remove('active'));
    tab.classList.add('active');
    const target = document.getElementById(tab.dataset.form);
    if (target) target.classList.add('active');
  });
});

/* ── Period Buttons ───────────────────────────────────────────────── */
document.querySelectorAll('.period-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ── Toast ────────────────────────────────────────────────────────── */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── Form Submit ──────────────────────────────────────────────────── */
function handleFormSubmit(e, type) {
  e.preventDefault();
  showToast(`${type} entry saved successfully`);
  e.target.reset();
  ['rev-date', 'exp-date', 'job-date'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = today;
  });
}

/* ── KPI Counter Animation ────────────────────────────────────────── */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * ease);
    el.textContent = prefix + (target >= 1000 ? current.toLocaleString() : current) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

document.querySelectorAll('.kpi-value[data-target]').forEach(el => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(el); observer.disconnect(); }
    });
  }, { threshold: 0.3 });
  observer.observe(el);
});

/* ── Color helper ─────────────────────────────────────────────────── */
function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/* ── Chart Registry ───────────────────────────────────────────────── */
const chartInstances = {};

function destroyChart(id) {
  if (chartInstances[id]) { chartInstances[id].destroy(); delete chartInstances[id]; }
}

function updateAllCharts() {
  Object.keys(chartInstances).forEach(id => {
    const c = chartInstances[id];
    if (!c) return;
    c.options.plugins.legend.labels.color = cssVar('--text-muted');
    if (c.options.scales) {
      Object.values(c.options.scales).forEach(s => {
        s.ticks = s.ticks || {};
        s.ticks.color = cssVar('--text-muted');
        s.grid = s.grid || {};
        s.grid.color = cssVar('--divider');
      });
    }
    c.update();
  });
  buildSparklines();
}

/* ── Shared Chart Defaults ────────────────────────────────────────── */
Chart.defaults.font.family = "'General Sans', 'Inter', sans-serif";
Chart.defaults.font.size = 11;

function getChartDefaults() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: cssVar('--surface-3'),
        titleColor: cssVar('--text'),
        bodyColor: cssVar('--text-muted'),
        borderColor: cssVar('--border'),
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { color: cssVar('--divider'), drawBorder: false },
        ticks: { color: cssVar('--text-muted') }
      },
      y: {
        grid: { color: cssVar('--divider'), drawBorder: false },
        ticks: { color: cssVar('--text-muted') }
      }
    }
  };
}

/* ── DATA ─────────────────────────────────────────────────────────── */
const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const revenueData  = [42000, 47500, 51200, 55000, 49800, 58300, 62100, 65400, 60200, 71800, 78400, 84650];
const expensesData = [18200, 19500, 21000, 22400, 20800, 23100, 25400, 26800, 24600, 28200, 30100, 31200];
const profitData   = revenueData.map((r, i) => r - expensesData[i]);

const sparklineData = {
  revenue:  [62100, 65400, 60200, 71800, 78400, 84650],
  clients:  [34, 36, 38, 40, 42, 47],
  jobs:     [145, 162, 151, 183, 198, 218],
  sat:      [90, 91, 92, 91, 93, 94],
  expenses: [24600, 26800, 24600, 28200, 30100, 31200],
  profit:   [35600, 38600, 35600, 43600, 48300, 53450],
  inv:      [5, 6, 4, 7, 6, 8],
  ret:      [82, 84, 84, 86, 87, 89]
};

/* ── Sparklines ───────────────────────────────────────────────────── */
function buildSparkline(canvasId, data, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  destroyChart(canvasId);
  const min = Math.min(...data) * 0.95;
  const max = Math.max(...data) * 1.05;
  chartInstances[canvasId] = new Chart(canvas, {
    type: 'line',
    data: {
      labels: data.map((_, i) => i),
      datasets: [{
        data,
        borderColor: color,
        borderWidth: 2,
        fill: true,
        backgroundColor: color.replace(')', ', 0.12)').replace('rgb', 'rgba'),
        pointRadius: 0,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: { display: false },
        y: { display: false, min, max }
      },
      animation: { duration: 600 }
    }
  });
}

function buildSparklines() {
  const green  = cssVar('--success');
  const blue   = cssVar('--accent');
  const amber  = cssVar('--warning');
  const purple = cssVar('--chart-5');
  const red    = cssVar('--danger');

  buildSparkline('sparkline-revenue',  sparklineData.revenue,  green);
  buildSparkline('sparkline-clients',  sparklineData.clients,  blue);
  buildSparkline('sparkline-jobs',     sparklineData.jobs,     amber);
  buildSparkline('sparkline-sat',      sparklineData.sat,      purple);
  buildSparkline('sparkline-expenses', sparklineData.expenses, red);
  buildSparkline('sparkline-profit',   sparklineData.profit,   green);
  buildSparkline('sparkline-inv',      sparklineData.inv,      red);
  buildSparkline('sparkline-ret',      sparklineData.ret,      blue);
}

/* ── Revenue vs Expenses Chart ────────────────────────────────────── */
let revChartType = 'bar';
function buildRevenueChart(type) {
  revChartType = type;
  const id = 'revenueChart';
  const canvas = document.getElementById(id);
  if (!canvas) return;
  destroyChart(id);
  const defaults = getChartDefaults();
  chartInstances[id] = new Chart(canvas, {
    type: type === 'line' ? 'line' : 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Revenue',
          data: revenueData,
          backgroundColor: type === 'bar' ? cssVar('--chart-1') + '99' : 'transparent',
          borderColor: cssVar('--chart-1'),
          borderWidth: type === 'bar' ? 0 : 2,
          fill: type === 'line',
          borderRadius: type === 'bar' ? 4 : 0,
          tension: 0.4,
          pointRadius: type === 'line' ? 3 : 0,
          pointBackgroundColor: cssVar('--chart-1'),
        },
        {
          label: 'Expenses',
          data: expensesData,
          backgroundColor: type === 'bar' ? cssVar('--chart-4') + '99' : 'transparent',
          borderColor: cssVar('--chart-4'),
          borderWidth: type === 'bar' ? 0 : 2,
          fill: false,
          borderRadius: type === 'bar' ? 4 : 0,
          tension: 0.4,
          pointRadius: type === 'line' ? 3 : 0,
          pointBackgroundColor: cssVar('--chart-4'),
        }
      ]
    },
    options: {
      ...defaults,
      plugins: {
        ...defaults.plugins,
        legend: {
          display: true,
          position: 'bottom',
          labels: { color: cssVar('--text-muted'), boxWidth: 10, padding: 16, usePointStyle: true }
        },
        tooltip: {
          ...defaults.plugins.tooltip,
          callbacks: {
            label: ctx => ' ' + ctx.dataset.label + ': $' + ctx.parsed.y.toLocaleString()
          }
        }
      },
      scales: {
        ...defaults.scales,
        y: {
          ...defaults.scales.y,
          ticks: {
            ...defaults.scales.y.ticks,
            callback: v => '$' + (v / 1000).toFixed(0) + 'k'
          }
        }
      }
    }
  });
}

/* ── Chart Type Toggle ────────────────────────────────────────────── */
document.querySelectorAll('.chart-btn[data-chart]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.chart-btn[data-chart]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    buildRevenueChart(btn.dataset.chart);
  });
});

/* ── Services Donut ───────────────────────────────────────────────── */
function buildServicesChart() {
  const id = 'servicesChart';
  const canvas = document.getElementById(id);
  if (!canvas) return;
  destroyChart(id);
  const labels = ['Hangar Cleaning', 'Corporate Offices', 'Deep Clean', 'Recurring', 'Other'];
  const data   = [38, 27, 15, 14, 6];
  const colors = [cssVar('--chart-1'), cssVar('--chart-2'), cssVar('--chart-3'), cssVar('--chart-5'), cssVar('--chart-6')];

  chartInstances[id] = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: cssVar('--surface'), hoverOffset: 6 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: cssVar('--surface-3'),
          titleColor: cssVar('--text'),
          bodyColor: cssVar('--text-muted'),
          borderColor: cssVar('--border'),
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          callbacks: { label: ctx => ' ' + ctx.label + ': ' + ctx.parsed + '%' }
        }
      }
    }
  });

  const legendEl = document.getElementById('services-legend');
  if (legendEl) {
    legendEl.innerHTML = labels.map((l, i) =>
      `<div class="legend-item"><span class="legend-dot" style="background:${colors[i]}"></span>${l} <strong style="color:var(--text);margin-left:2px">${data[i]}%</strong></div>`
    ).join('');
  }
}

/* ── Client Growth Chart ──────────────────────────────────────────── */
function buildClientsChart() {
  const id = 'clientsChart';
  const canvas = document.getElementById(id);
  if (!canvas) return;
  destroyChart(id);
  const defaults = getChartDefaults();
  const newClients    = [5, 6, 4, 7, 6, 8, 7, 9, 5, 10, 8, 11];
  const churnedClients = [1, 2, 1, 2, 3, 1, 2, 1, 2, 1, 2, 1];

  chartInstances[id] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'New',
          data: newClients,
          backgroundColor: cssVar('--chart-2') + 'cc',
          borderRadius: 4,
          borderWidth: 0
        },
        {
          label: 'Churned',
          data: churnedClients,
          backgroundColor: cssVar('--chart-4') + 'cc',
          borderRadius: 4,
          borderWidth: 0
        }
      ]
    },
    options: {
      ...defaults,
      plugins: {
        ...defaults.plugins,
        legend: {
          display: true,
          position: 'bottom',
          labels: { color: cssVar('--text-muted'), boxWidth: 10, padding: 16, usePointStyle: true }
        }
      }
    }
  });
}

/* ── Jobs Status Donut ────────────────────────────────────────────── */
function buildJobsChart() {
  const id = 'jobsChart';
  const canvas = document.getElementById(id);
  if (!canvas) return;
  destroyChart(id);
  const labels = ['Completed', 'In Progress', 'Scheduled', 'Cancelled'];
  const data   = [218, 14, 22, 6];
  const colors = [cssVar('--chart-2'), cssVar('--chart-1'), cssVar('--chart-3'), cssVar('--chart-4')];

  chartInstances[id] = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: cssVar('--surface'), hoverOffset: 6 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: cssVar('--surface-3'),
          titleColor: cssVar('--text'),
          bodyColor: cssVar('--text-muted'),
          borderColor: cssVar('--border'),
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
        }
      }
    }
  });

  const legendEl = document.getElementById('jobs-legend');
  if (legendEl) {
    legendEl.innerHTML = labels.map((l, i) =>
      `<div class="legend-item"><span class="legend-dot" style="background:${colors[i]}"></span>${l}: <strong style="color:var(--text);margin-left:2px">${data[i]}</strong></div>`
    ).join('');
  }
}

/* ── Cash Flow Chart ──────────────────────────────────────────────── */
function buildCashflowChart() {
  const id = 'cashflowChart';
  const canvas = document.getElementById(id);
  if (!canvas) return;
  destroyChart(id);
  const defaults = getChartDefaults();
  const cashflow = profitData.map(v => parseFloat((v / 1000).toFixed(1)));

  chartInstances[id] = new Chart(canvas, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Net Cash Flow (GYD \'000)',
        data: cashflow,
        borderColor: cssVar('--chart-5'),
        borderWidth: 2.5,
        backgroundColor: cssVar('--chart-5') + '18',
        fill: true,
        tension: 0.45,
        pointRadius: 4,
        pointBackgroundColor: cssVar('--chart-5'),
        pointBorderColor: cssVar('--surface'),
        pointBorderWidth: 2
      }]
    },
    options: {
      ...defaults,
      plugins: {
        ...defaults.plugins,
        tooltip: {
          ...defaults.plugins.tooltip,
          callbacks: { label: ctx => ' Net: GYD ' + ctx.parsed.y.toFixed(1) + 'k' }
        }
      },
      scales: {
        ...defaults.scales,
        y: {
          ...defaults.scales.y,
          ticks: {
            ...defaults.scales.y.ticks,
            callback: v => 'G$' + v + 'k'
          }
        }
      }
    }
  });
}

/* ── Export Chart ─────────────────────────────────────────────────── */
function exportChart(id) {
  const chart = chartInstances[id];
  if (!chart) return;
  const link = document.createElement('a');
  link.download = id + '-' + new Date().toISOString().split('T')[0] + '.png';
  link.href = chart.toBase64Image();
  link.click();
  showToast('Chart exported as PNG');
}

/* ── Activity Table ───────────────────────────────────────────────── */
const activities = [
  { job: 'Monthly Hangar Deep Clean', client: 'CJIA Aviation', type: 'Hangar', date: 'Mar 14', amount: '$3,800', status: 'paid' },
  { job: 'Corporate HQ Weekly Service', client: 'Atlantic Industries', type: 'Corporate', date: 'Mar 13', amount: '$1,200', status: 'paid' },
  { job: 'Emergency Clean - Engine Bay', client: 'Wings Air Charter', type: 'Hangar', date: 'Mar 12', amount: '$2,500', status: 'pending' },
  { job: 'Office Tower — Floors 8–12', client: 'Demerara Holdings', type: 'Corporate', date: 'Mar 11', amount: '$1,650', status: 'paid' },
  { job: 'Post-Event Deep Clean', client: 'Pegasus Hotel', type: 'Deep Clean', date: 'Mar 10', amount: '$4,200', status: 'overdue' },
  { job: 'Bi-weekly Maintenance Clean', client: 'Republic Bank', type: 'Recurring', date: 'Mar 9', amount: '$900', status: 'paid' },
  { job: 'Hangar B + Tarmac Area', client: 'GuyAna Airways', type: 'Hangar', date: 'Mar 8', amount: '$5,100', status: 'progress' },
];

function buildActivityTable() {
  const tbody = document.getElementById('activity-tbody');
  if (!tbody) return;
  const statusMap = { paid: 'status-paid', pending: 'status-pending', overdue: 'status-overdue', progress: 'status-progress' };
  const statusLabel = { paid: 'Paid', pending: 'Pending', overdue: 'Overdue', progress: 'In Progress' };
  tbody.innerHTML = activities.map(a => `
    <tr>
      <td>
        <div style="font-weight:600;font-size:var(--text-xs)">${a.job}</div>
        <div class="td-secondary">${a.client}</div>
      </td>
      <td class="td-secondary">${a.type}</td>
      <td class="td-secondary" style="white-space:nowrap">${a.date}</td>
      <td style="font-family:var(--font-mono);font-size:var(--text-xs);font-weight:600">${a.amount}</td>
      <td><span class="status-badge ${statusMap[a.status]}">${statusLabel[a.status]}</span></td>
    </tr>
  `).join('');
}

/* ── Top Clients ──────────────────────────────────────────────────── */
const topClients = [
  { name: 'CJIA Aviation', type: 'Hangar Contract', value: '$8,400/mo', initials: 'CA' },
  { name: 'Atlantic Industries', type: 'Corporate Weekly', value: '$4,800/mo', initials: 'AI' },
  { name: 'Demerara Holdings', type: 'Corporate Recurring', value: '$3,600/mo', initials: 'DH' },
  { name: 'Wings Air Charter', type: 'Hangar On-Call', value: '$3,100/mo', initials: 'WA' },
  { name: 'Republic Bank HQ', type: 'Corporate Weekly', value: '$2,700/mo', initials: 'RB' },
  { name: 'Pegasus Hotel', type: 'Event Deep Cleans', value: '$2,400/mo', initials: 'PH' },
];

function buildClientList() {
  const el = document.getElementById('client-list');
  if (!el) return;
  el.innerHTML = topClients.map(c => `
    <div class="client-row">
      <div class="client-avatar">${c.initials}</div>
      <div class="client-info">
        <div class="client-name">${c.name}</div>
        <div class="client-type">${c.type}</div>
      </div>
      <div class="client-value">${c.value}</div>
    </div>
  `).join('');
}

/* ── Goals ────────────────────────────────────────────────────────── */
const goals = [
  { name: 'Monthly Revenue', current: 84650, target: 90000, prefix: '$', color: 'blue' },
  { name: 'Jobs Completed',  current: 218,   target: 250,   prefix: '',  color: 'green' },
  { name: 'New Clients',     current: 8,     target: 10,    prefix: '',  color: 'amber' },
  { name: 'Satisfaction',    current: 94,    target: 97,    prefix: '',  suffix: '%', color: 'blue' },
  { name: 'Net Profit',      current: 53450, target: 60000, prefix: '$', color: 'green' },
  { name: 'Client Retention',current: 89,    target: 95,    prefix: '',  suffix: '%', color: 'amber' },
  { name: 'Invoices Cleared',current: 16,    target: 20,    prefix: '',  color: 'red' },
  { name: 'Staff Util. Rate',current: 82,    target: 90,    prefix: '',  suffix: '%', color: 'blue' },
];

function buildGoals() {
  const grid = document.getElementById('goals-grid');
  if (!grid) return;
  const colorMap = { blue: '', green: 'green', amber: 'amber', red: 'red' };
  grid.innerHTML = goals.map(g => {
    const pct = Math.min(Math.round((g.current / g.target) * 100), 100);
    const fmtNum = n => (n >= 1000 ? '$' + (n / 1000).toFixed(1) + 'k' : (g.prefix || '') + n + (g.suffix || ''));
    return `
      <div class="goal-item">
        <div class="goal-header">
          <span class="goal-name">${g.name}</span>
          <span class="goal-pct">${pct}%</span>
        </div>
        <div class="goal-track">
          <div class="goal-fill ${colorMap[g.color]}" style="width:0%" data-width="${pct}%"></div>
        </div>
        <div class="goal-numbers"><strong>${fmtNum(g.current)}</strong> / ${fmtNum(g.target)}</div>
      </div>
    `;
  }).join('');

  // Animate bars
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      grid.querySelectorAll('.goal-fill').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
    });
  });
}

/* ── INIT ─────────────────────────────────────────────────────────── */
function init() {
  buildSparklines();
  buildRevenueChart('bar');
  buildServicesChart();
  buildClientsChart();
  buildJobsChart();
  buildCashflowChart();
  buildActivityTable();
  buildClientList();
  buildGoals();
}

// Wait for fonts + DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
