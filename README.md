# 📊 FIG Dashboard

> Business performance dashboard for **Fresh Island Global** — tracks revenue, expenses, profit, clients, jobs, and monthly goals.

![Static Site](https://img.shields.io/badge/static-site-blue) ![Chart.js](https://img.shields.io/badge/Chart.js-4.4-orange) ![Vanilla JS](https://img.shields.io/badge/vanilla-JS-yellow) ![License](https://img.shields.io/badge/license-MIT-green)

---

## Preview

| Dark Mode | Light Mode |
|-----------|------------|
| Full dark theme with vibrant chart colors | Clean light theme, same layout |

---

## Features

- **8 KPI Cards** — Revenue, Expenses, Net Profit, Active Clients, Jobs Completed, Satisfaction Score, Outstanding Invoices, Client Retention
- **Animated counters** — Numbers count up on load
- **Sparkline charts** per KPI card
- **Revenue vs Expenses** — 12-month bar or line chart with PNG export
- **Revenue by Service** — Donut breakdown by service category
- **Client Growth** — New vs churned clients per month
- **Jobs by Status** — Completed / In Progress / Scheduled / Cancelled
- **Cash Flow** — Net GYD movement trend line
- **Recent Activity table** — Latest jobs with client, type, amount, and status badges
- **Top Clients** — Ranked by monthly contract value
- **Monthly Goals tracker** — 8 animated progress bars with current vs target
- **Add Entry forms** — Log Revenue, Expenses, Jobs, and Clients
- **Dark / Light mode toggle**
- **Period selector** — 7D / 30D / 90D / 1Y
- **Fully responsive** — Works on desktop, tablet, and mobile

---

## File Structure

```
fig-dashboard/
├── index.html    # Markup and layout
├── style.css     # All styling, design tokens, dark/light themes
├── app.js        # Charts, animations, data, and interactivity
└── README.md
```

No build step. No dependencies to install. Everything runs in the browser.

---

## Getting Started

### Run locally

Just open `index.html` in any modern browser — no server needed.

```bash
# Optional: serve with a local server
npx serve .
# Then open http://localhost:3000
```

### Deploy to Netlify (recommended)

1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop the `fig-dashboard` folder
3. Get a live URL instantly

### Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages → Source → main → / (root)**
3. Live at `https://yourusername.github.io/fig-dashboard`

---

## Updating the Data

All dashboard data lives in `app.js`. To update with real numbers, find these sections:

```js
// KPI values — update data-target in index.html
// e.g. <div class="kpi-value" data-target="84650" data-prefix="$">

// Monthly revenue/expenses history (12 months)
const revenueData  = [42000, 47500, ...];
const expensesData = [18200, 19500, ...];

// Recent activity table
const activities = [ ... ];

// Top clients list
const topClients = [ ... ];

// Monthly goals
const goals = [ ... ];
```

---

## Customization

| What | Where |
|------|-------|
| Colors / theme | `:root` and `[data-theme="dark"]` in `style.css` |
| Business name / logo | `.logo` section in `index.html` |
| KPI cards | `.kpi-card` blocks in `index.html` |
| Service categories | `<select>` dropdowns in the Add Entry forms |
| Chart types | `buildRevenueChart()` in `app.js` |
| Goals | `const goals = [...]` in `app.js` |

---

## Tech Stack

- **HTML5 / CSS3 / Vanilla JS** — zero framework dependencies
- **[Chart.js 4.4](https://www.chartjs.org/)** — via CDN
- **[Cabinet Grotesk](https://www.fontshare.com/fonts/cabinet-grotesk)** + **[General Sans](https://www.fontshare.com/fonts/general-sans)** — via Fontshare CDN
- **[JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)** — via Google Fonts CDN

---

## License

MIT — free to use and modify for your business.

---

*Built with [Perplexity Computer](https://www.perplexity.ai/computer)*
