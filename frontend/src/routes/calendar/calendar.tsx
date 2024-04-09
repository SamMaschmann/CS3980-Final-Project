import React, { useState } from 'react';
import './calendar.css';
function Calendar() {
  const [date, setDate] = useState(new Date());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    setDate(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    setDate(nextMonth);
  };

  const renderCalendar = () => {
    const firstDayOfMonth = getFirstDayOfMonth(date);
    const daysInMonth = getDaysInMonth(date);
    const month = date.getMonth();
    const year = date.getFullYear();

    const blanks = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      blanks.push(<td key={`blank-${i}`} className="calendar-day empty"></td>);
    }

    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <td key={`day-${day}`} className="calendar-day">
          {day}
        </td>
      );
    }

    const totalSlots = [...blanks, ...days];
    const rows: JSX.Element[][] = [];

    let cells: JSX.Element[] = [];


    totalSlots.forEach((slot, i) => {
      if (i % 7 !== 0) {
        cells.push(slot);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(slot);
      }
      if (i === totalSlots.length - 1) {
        rows.push(cells);
      }
    });

    return rows.map((row, i) => (
      <tr key={`row-${i}`}>
        {row}
      </tr>
    ));
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>Prev</button>
        <span>{months[date.getMonth()]} {date.getFullYear()}</span>
        <button onClick={handleNextMonth}>Next</button>
      </div>
      <table className="calendar-table">
        <thead>
          <tr>
            {daysOfWeek.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {renderCalendar()}
        </tbody>
      </table>
    </div>
  );
}

export default Calendar;
