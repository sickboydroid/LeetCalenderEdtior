import { useState, useEffect, useRef } from 'react';

export function useCalendarData() {
  const [activeDates, setActiveDates] = useState(new Set());
  const [burnedDates, setBurnedDates] = useState(new Set());

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const activeDatesRef = useRef(activeDates);
  activeDatesRef.current = activeDates;

  useEffect(() => {
    const saved = localStorage.getItem('leetcode-burned-dates');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const savedSet = new Set(parsed);
        setBurnedDates(savedSet);
        setActiveDates(new Set(parsed));
        setHistory([parsed]);
        setHistoryIndex(0);
      } catch (e) {
        console.error("Failed to load burned dates", e);
        setHistory([[]]);
        setHistoryIndex(0);
      }
    } else {
      setHistory([[]]);
      setHistoryIndex(0);
    }
  }, []);

  const toggleDate = (dateStr, forceState = null) => {
    setActiveDates(prev => {
      const next = new Set(prev);
      if (forceState === true) {
        next.add(dateStr);
      } else if (forceState === false) {
        next.delete(dateStr);
      } else {
        if (next.has(dateStr)) next.delete(dateStr);
        else next.add(dateStr);
      }
      return next;
    });
  };

  const endSwipe = () => {
    // Only commit if there was an actual change compared to current history
    setHistory(prevHistory => {
      const currentStateArray = Array.from(activeDatesRef.current);
      if (historyIndex >= 0 && prevHistory[historyIndex]) {
        const prevSet = new Set(prevHistory[historyIndex]);
        if (prevSet.size === currentStateArray.length && 
            currentStateArray.every(d => prevSet.has(d))) {
          // No actual change, don't push
          return prevHistory;
        }
      }

      const newHistory = prevHistory.slice(0, historyIndex + 1);
      newHistory.push(currentStateArray);
      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setActiveDates(new Set(history[prevIndex]));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setActiveDates(new Set(history[nextIndex]));
    }
  };

  const savePattern = () => {
    setBurnedDates(activeDates);
    localStorage.setItem('leetcode-burned-dates', JSON.stringify(Array.from(activeDates)));
    // Clear history so saved things cannot be undone
    setHistory([Array.from(activeDates)]);
    setHistoryIndex(0);
  };

  const clear = () => {
    setActiveDates(new Set());
    setTimeout(endSwipe, 0); 
  };

  const resetToSaved = () => {
    setActiveDates(new Set(burnedDates));
    setTimeout(endSwipe, 0);
  };

  const exportData = () => {
    const data = JSON.stringify(Array.from(activeDates));
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leetcode-planner.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportICS = () => {
    if (burnedDates.size === 0) {
      alert("No saved dates to export. Please save your pattern first.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const now = new Date();
    const dtstamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//LeetCalender//Profile Planner//EN\nCALSCALE:GREGORIAN\n";

    const sortedDates = Array.from(burnedDates).sort();
    
    for (const dateStr of sortedDates) {
      if (dateStr >= todayStr) {
        const dateFormatted = dateStr.replace(/-/g, '');
        
        // 10 AM Event
        icsContent += "BEGIN:VEVENT\n";
        icsContent += `UID:${dateFormatted}-10am@leetcalender\n`;
        icsContent += `DTSTAMP:${dtstamp}\n`;
        icsContent += `DTSTART:${dateFormatted}T100000\n`;
        icsContent += `DTEND:${dateFormatted}T103000\n`;
        icsContent += "SUMMARY:LeetCode Profile: Morning Session\n";
        icsContent += "DESCRIPTION:Time to make a LeetCode submission to maintain your profile calendar!\n";
        icsContent += "BEGIN:VALARM\nTRIGGER:-PT0M\nACTION:DISPLAY\nDESCRIPTION:LeetCode Reminder\nEND:VALARM\n";
        icsContent += "END:VEVENT\n";

        // 10 PM Event
        icsContent += "BEGIN:VEVENT\n";
        icsContent += `UID:${dateFormatted}-10pm@leetcalender\n`;
        icsContent += `DTSTAMP:${dtstamp}\n`;
        icsContent += `DTSTART:${dateFormatted}T220000\n`;
        icsContent += `DTEND:${dateFormatted}T223000\n`;
        icsContent += "SUMMARY:LeetCode Profile: Night Session\n";
        icsContent += "DESCRIPTION:Time to make a LeetCode submission to maintain your profile calendar!\n";
        icsContent += "BEGIN:VALARM\nTRIGGER:-PT0M\nACTION:DISPLAY\nDESCRIPTION:LeetCode Reminder\nEND:VALARM\n";
        icsContent += "END:VEVENT\n";
      }
    }

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leetcode-schedule.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (Array.isArray(parsed)) {
          setActiveDates(new Set(parsed));
          setTimeout(endSwipe, 0);
        }
      } catch (err) {
        alert("Invalid file format");
      }
    };
    reader.readAsText(file);
  };

  return {
    activeDates,
    burnedDates,
    toggleDate,
    endSwipe,
    undo,
    redo,
    savePattern,
    clear,
    resetToSaved,
    exportData,
    exportICS,
    importData,
    setActiveDates,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };
}
