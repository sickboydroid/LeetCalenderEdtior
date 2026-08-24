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
    return <span className="tracker-inline empty">No planned submissions</span>;
  }

  const isToday = nextDate === todayStr;
  
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
    month: 'short', day: 'numeric'
  });

  return (
    <span className={`tracker-inline ${isToday ? 'urgent' : ''}`}>
      Next submission: <strong>{formattedDate}</strong> ({relativeText})
    </span>
  );
}
