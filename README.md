# Support FAQ Helper

A lightweight FAQ web app built with **TypeScript, HTML, and CSS**, designed to quickly search and filter support knowledge (Lace, Daedalus, staking, etc.).

---

## 🚀 Features

- 🔍 **Search by keyword** (questions & answers)
- 🗂 **Category filter** (Lace, Daedalus, Staking, etc.)
- 📊 **Result count** updates dynamically
- 📂 **Expandable Q&A** (click question to show/hide answer)
- 📅 **Last updated date** (from `faq.json`)
- ⌨️ **Keyboard shortcut**: press `/` to focus the search box

---

## 📸 Screenshot

![screenshot](./screenshot.png)

---

## 🛠 Tech Stack

- TypeScript for logic
- Vanilla HTML + CSS for UI
- JSON (`faq.json`) as the data source
- Local testing with [`http-server`](https://www.npmjs.com/package/http-server)

---

## ▶️ How to Run Locally

```bash
# Clone repository
git clone https://github.com/Sesshu620/support-faq-helper.git
cd support-faq-helper

# Install TypeScript if needed
npm install

# Compile TypeScript to JavaScript
npx tsc --project ./tsconfig.json

# Start local server (port 8080)
npx http-server -p 8080 -c-1

Roadmap

 Highlight matching keywords in results

 Add "Expand all / Collapse all" toggle

 Deploy to GitHub Pages for public access
```
