import React, { useRef, useEffect } from 'react';
import { Calendar } from './Calendar';
import { Tracker } from './Tracker';
import { useCalendarData } from './useCalendarData';
import './App.css';

function App() {
  const {
    activeDates,
    burnedDates,
    toggleDate,
    endSwipe,
    undo,
    redo,
    canUndo,
    canRedo,
    savePattern,
    exportData,
    exportICS,
    importData,
    setActiveDates
  } = useCalendarData();

  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      importData(file);
    }
    e.target.value = null;
  };

  const handleSave = () => {
    savePattern();
  };

  // Keyboard shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo) redo();
        } else {
          if (canUndo) undo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-top">
          <div className="title-area">
            <h1>LeetCalenderEditor</h1>
            <Tracker burnedDates={burnedDates} />
          </div>
          <div className="header-actions">
            <button className="text-btn" onClick={exportICS}>Export ICS</button>
            <button className="text-btn" onClick={exportData}>Export JSON</button>
            <button className="text-btn" onClick={handleImportClick}>Import JSON</button>
            <button className="text-btn primary-text" onClick={handleSave}>Save Pattern</button>
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange} 
            />
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="controls-bar">
          <div className="controls-group">
            <button className="icon-btn" onClick={() => { setActiveDates(new Set(burnedDates)); setTimeout(endSwipe, 0); }} title="Revert to Saved">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
          </div>
          
          <div className="controls-group">
            <button className="icon-btn" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h10a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5H11"/><polyline points="7 6 3 10 7 14"/></svg>
            </button>
            <button className="icon-btn" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10H11a5 5 0 0 0-5 5v0a5 5 0 0 0 5 5h2"/><polyline points="17 6 21 10 17 14"/></svg>
            </button>
          </div>
        </div>

        <Calendar 
          activeDates={activeDates} 
          burnedDates={burnedDates}
          toggleDate={toggleDate} 
          endSwipe={endSwipe}
        />
      </main>
      
      <footer className="app-footer">
        Click and drag to draw on the calendar. The grid spans from 1 year in the past to 1 year in the future.
      </footer>
    </div>
  );
}

export default App;
