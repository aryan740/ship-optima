# 📦 ShipOptima — Dynamic Carrier & SLA Breach Risk Optimizer

[![Live Demo](https://img.shields.io/badge/Live-Demo-22c55e?style=for-the-badge&logo=githubpages&logoColor=white)](https://aryan740.github.io/ship-optima/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/aryan740/ship-optima)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20TailwindCSS%20%7C%20Vite-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://vitejs.dev/)

An enterprise-grade Decision Science & Logistics Decision Support System (DSS) designed to solve the classic operational trade-off in supply chains: **Transportation Costs vs. Customer SLA Breach Penalties**.

---

## 🎯 The Core Business Problem

In supply chain operations, dispatch managers face a daily dilemma across thousands of orders:
- **Defaulting to cheap surface trucking** minimizes upfront freight expenses but risks SLA breaches during bad weather or long transit corridors, triggering steep contractual penalties (₹150 – ₹2,000/hr) and damaging customer trust.
- **Defaulting to express air cargo** eliminates late deliveries but erodes unit margins with exorbitant shipping fees.

**ShipOptima** replaces static rule-based dispatching with a real-time mathematical cost-risk optimization model:

$$\text{Optimal Cost} = \min_{c \in \text{Carriers}} \left( \text{Freight Fee}_c + \left( P(\text{Delay}_c) \times \text{Expected Overdue Hours}_c \times \text{Hourly SLA Penalty} \right) \right)$$

---

## 🚀 Key Features

- **🌐 Pan-India Geocoding & Distance Engine:** Integrated with OpenStreetMap Nominatim API with 300ms debounce and autocomplete to compute realistic road transit distances from the central Delhi NCR Fulfilment Hub.
- **⚖️ Logistics Volumetric Weight Billing:** Implemented the industry-standard IATA cubic divisor formula:
  $$\text{Volumetric Weight} = \frac{\text{Length (cm)} \times \text{Width (cm)} \times \text{Height (cm)}}{5000}$$
  $$\text{Billable Weight} = \max(\text{Dead Weight}, \text{Volumetric Weight})$$
- **⚡ Dynamic Sensitivity & Scenario Testing:** Real-time sliders to stress-test carrier allocation under **Monsoon / Traffic Surges (1.0x to 2.5x risk multiplier)** and custom contractual hourly breach penalties.
- **📊 Carrier Breakdown Drawer:** Full explainability for dispatch managers showing side-by-side cost breakdown, risk trade-offs, and clear rationale behind the recommended carrier.
- **🎨 Modern Enterprise SaaS UI:** Built with Tailwind CSS, featuring **Light, Dark, and System theme persistence** via `localStorage` and full mobile responsiveness.
- **📑 Executive Dispatch Manifest Export:** Instant CSV export for downstream ERP sync and dispatch audit logs.

---

## 🛠️ Carrier Specifications (Indian Logistics Calibrated)

| Carrier Tier | Transit Speed | Base Rate (₹) | Distance Rate (₹) | Base Delay Risk | Ideal Use Case |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Surface Eco** | 35 km/h | ₹8 / kg | ₹1.5 / km | 20% | Bulk, non-urgent shipments with 48h+ SLA |
| **Express Road** | 65 km/h | ₹18 / kg | ₹3.2 / km | 8% | Regional next-day delivery (12h - 24h SLA) |
| **Air Priority** | 450 km/h | ₹50 / kg | ₹6.5 / km | 2% | High-value, critical same-day shipments (< 12h SLA) |

---

## 💻 Tech Stack & Architecture

- **Frontend:** React.js (Vite), JavaScript (ES6+)
- **Styling:** Tailwind CSS (Dark/Light mode support)
- **External Services:** OpenStreetMap Nominatim API (Free Geocoding & Location Search)
- **State & Storage:** LocalStorage Persistence for custom shipments & scenario states
- **Deployment:** GitHub Pages (`gh-pages`)

---

## 📦 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/aryan740/ship-optima.git

# Navigate to project directory
cd ship-optima

# Install dependencies
npm install

# Start development server
npm run dev
```
