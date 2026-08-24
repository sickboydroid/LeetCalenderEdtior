<p align="center">
  <img src="public/icon-big.png" alt="LeetCalenderEditor Logo" width="128" />
</p>

# LeetCalenderEditor

A specialized, completely offline web tool to plan and design custom visual patterns for your LeetCode/GitHub contribution graph. 

The application perfectly replicates the exact Month-blocked calendar layout that LeetCode uses, ensuring that any pattern you draw corresponds exactly to the 1-year contribution history grid on your profile.

**Live Link:** [https://sickboydroid.github.io/LeetCalenderEdtior/](https://sickboydroid.github.io/LeetCalenderEdtior/)

## Features

- **Pixel-Perfect LeetCode Grid**: Accurately simulates the gapped, month-blocked view with identical day-of-week paddings.
- **Save Patterns**: Keep your master plan securely saved in your browser's Local Storage.
- **Export / Import**: Back up your designs or transfer them between devices using JSON export.
- **Google Calendar Integration**: Instantly generate an `.ics` file from your saved plan. Adds morning (10:00 AM) and night (10:00 PM) reminders to your calendar for every single day you need to submit.
- **Next Submission Tracking**: View exactly when your next planned submission is due right in the UI.
- **Keyboard Shortcuts**: Quickly `Undo` (Ctrl+Z) and `Redo` (Ctrl+Y) your sketching strokes.

## Development

This project was bootstrapped with [Vite](https://vitejs.dev/) and React.

### Running Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. All processing is fully local and offline.
