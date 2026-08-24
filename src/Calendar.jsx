import React, { useState, useEffect, useRef } from 'react';
import './Calendar.css';

export function Calendar({ activeDates, burnedDates, toggleDate, endSwipe }) {
  const [months, setMonths] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState(true);
  const containerRef = useRef(null);
  const todayRef = useRef(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  useEffect(() => {
    // Generate dates: 1 year past, 1 year future
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 365);
    
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 365);

    const generatedMonths = [];
    let currentMonth = null;
    let currentWeek = null;
    
    let loopDate = new Date(startDate);
    
    while (loopDate <= endDate) {
      const y = loopDate.getFullYear();
      const m = loopDate.getMonth();
      const dayOfWeek = loopDate.getDay(); // 0 (Sun) to 6 (Sat)
      
      const mStr = String(m + 1).padStart(2, '0');
      const dStr = String(loopDate.getDate()).padStart(2, '0');
      const dateStr = `${y}-${mStr}-${dStr}`;
      const isToday = loopDate.getTime() === today.getTime();
      
      if (!currentMonth || currentMonth.month !== m) {
        if (currentMonth && currentWeek) {
          while (currentWeek.length < 7) {
            currentWeek.push(null);
          }
        }
        
        currentWeek = [];
        for (let i = 0; i < dayOfWeek; i++) {
          currentWeek.push(null);
        }
        
        currentMonth = {
          year: y,
          month: m,
          label: loopDate.toLocaleString('default', { month: 'short' }),
          weeks: [currentWeek]
        };
        generatedMonths.push(currentMonth);
      }
      
      currentWeek.push({
        date: new Date(loopDate),
        dateStr,
        isToday
      });
      
      if (currentWeek.length === 7) {
        currentWeek = [];
        currentMonth.weeks.push(currentWeek);
      }
      
      loopDate.setDate(loopDate.getDate() + 1);
    }
    
    if (currentWeek && currentWeek.length > 0 && currentWeek.length < 7) {
       while (currentWeek.length < 7) {
         currentWeek.push(null);
       }
    }
    if (currentMonth && currentMonth.weeks[currentMonth.weeks.length - 1].length === 0) {
      currentMonth.weeks.pop();
    }
    
    setMonths(generatedMonths);

    // Scroll to center (today) after render
    setTimeout(() => {
      if (todayRef.current && containerRef.current) {
        const container = containerRef.current;
        const todayElement = todayRef.current;
        const scrollLeft = todayElement.offsetLeft - (container.clientWidth / 2) + (todayElement.clientWidth / 2);
        container.scrollLeft = scrollLeft;
      }
    }, 100);
  }, []);

  const handleMouseDown = (dateStr, currentState) => {
    if (dateStr < todayStr) return; // Prevent editing past dates
    setIsDrawing(true);
    const newDrawMode = !currentState;
    setDrawMode(newDrawMode);
    toggleDate(dateStr, newDrawMode);
  };

  const handleMouseEnter = (dateStr) => {
    if (isDrawing && dateStr >= todayStr) {
      toggleDate(dateStr, drawMode);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      endSwipe(); // Commit to history
    }
  };

  return (
    <div className="calendar-section">
      <div 
        className="calendar-wrapper"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDragStart={(e) => e.preventDefault()}
      >
        <div className="calendar-scroll-container" ref={containerRef}>
          <div className="calendar-grid-lc">
            {months.map((m, mIdx) => (
              <div key={`${m.year}-${m.month}`} className="lc-month-block">
                <div className="lc-month-weeks">
                  {m.weeks.map((week, wIdx) => (
                    <div key={wIdx} className="lc-week-column">
                      {week.map((day, dIdx) => {
                        if (!day) {
                          return <div key={`null-${dIdx}`} className="lc-cell empty-pad"></div>;
                        }
                        
                        const isActive = activeDates.has(day.dateStr);
                        const isBurned = burnedDates.has(day.dateStr);
                        
                        let classes = 'lc-cell';
                        if (isActive) classes += ' active';
                        if (isBurned) classes += ' burned';
                        if (day.isToday) classes += ' today';
                        if (day.dateStr < todayStr) classes += ' past-date';
                        
                        return (
                          <div
                            key={day.dateStr}
                            ref={day.isToday ? todayRef : null}
                            className={classes}
                            onMouseDown={(e) => {
                              if (e.button !== 0) return; // Only left click
                              e.preventDefault();
                              handleMouseDown(day.dateStr, isActive);
                            }}
                            onMouseEnter={() => handleMouseEnter(day.dateStr)}
                            title={`${day.dateStr}${day.isToday ? ' (Today)' : ''}${day.dateStr < todayStr ? ' (Cannot edit past)' : ''}`}
                          ></div>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="lc-month-label">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="calendar-legend">
        <span>Less</span>
        <div className="lc-cell" style={{backgroundColor: 'var(--cell-empty)'}}></div>
        <div className="lc-cell" style={{backgroundColor: 'var(--cell-active-1)'}}></div>
        <div className="lc-cell" style={{backgroundColor: 'var(--cell-active-2)'}}></div>
        <div className="lc-cell" style={{backgroundColor: 'var(--cell-active-3)'}}></div>
        <div className="lc-cell active"></div>
        <span style={{marginLeft: '16px'}}>Saved Plan</span>
        <div className="lc-cell burned active"></div>
        <span>More</span>
      </div>
    </div>
  );
}
