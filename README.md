# LeetCalenderEditor

A frontend web application to plan, draw, and save customized patterns for your LeetCode (or GitHub) contribution graph.

## Features

- **Exact Grid Alignment**: The grid mirrors LeetCode's exact layout, padding months based on actual weekdays, ensuring your pattern maps 1:1 with your real profile.
- **Draw to Paint**: Click and drag across cells to easily toggle dates on and off.
- **Google Calendar Integration**: Instantly export an `.ics` file that automatically sets morning (10:00 AM) and night (10:00 PM) reminders in your Google Calendar for the days you need to submit.
- **Persistent Local Storage**: Your masterpiece is saved securely in your browser when you click "Save Pattern".
- **Undo / Redo System**: Full history stack mapped to global keyboard shortcuts (`Ctrl+Z`, `Ctrl+Y`).
- **Offline First**: Entirely client-side with no backend.
- **Import / Export JSON**: Back up your raw pattern data as JSON.

## How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.
