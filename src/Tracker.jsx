import React from 'react';
import './Tracker.css';

export function Tracker({ burnedDates }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  let nextDate = null;
  const sortedDates = Array.from(burnedDates).sort();
  
  for (const dateStr of sortedDates) {
    if (dateStr >= todayStr) {
      nextDate = dateStr;
      break;
    }
  }

  if (!nextDate) {
    return (
      <div className="tracker-panel">
        <h3 className="tracker-title">Next Planned Submission</h3>
        <p className="tracker-none">No upcoming submissions in your burned plan.</p>
      </div>
    );
  }

  const isToday = nextDate === todayStr;
  
  // Need to parse date without timezone shifting issues
  const [y, m, d] = nextDate.split('-');
  const nextDateObj = new Date(y, m - 1, d);
  
  const diffTime = nextDateObj - today;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  let relativeText = '';
  if (isToday) {
    relativeText = 'Today!';
  } else if (diffDays === 1) {
    relativeText = 'Tomorrow';
  } else {
    relativeText = `In ${diffDays} days`;
  }

  const formattedDate = nextDateObj.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="tracker-panel">
      <h3 className="tracker-title">Next Planned Submission</h3>
      <div className="tracker-content">
        <div className={`tracker-date ${isToday ? 'urgent' : ''}`}>
          {formattedDate}
        </div>
        <div className={`tracker-relative ${isToday ? 'urgent-text' : ''}`}>
          {relativeText}
        </div>
      </div>
    </div>
  );
}
