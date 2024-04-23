import React, { useState } from 'react';
import './calendar.css';

interface Payment {
  date: Date;
  amount: number;
  description: string;
}

const Calendar: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');

  const today = new Date();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const dayWithEvents = [1, 9, 22];

  const addPayment = () => {
    const payment: Payment = {
      date: selectedDate,
      amount,
      description,
    };
    setPayments([...payments, payment]);
    setShowModal(false); // Close modal after adding payment
  };

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

  const isItToday = (day: number) => {
    return date.getMonth() === today.getMonth() && day === today.getDate() && date.getFullYear() === today.getFullYear();
  };

  const PaymentModal: React.FC = () => {
    const handleSubmit = () => {
      addPayment();
    };

    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => setShowModal(false)}>&times;</span>
          <h2>Schedule Payment</h2>
          <p>Date: {selectedDate.toLocaleDateString()}</p>
          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="Amount" />
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
          <button onClick={handleSubmit}>Schedule Payment</button>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const firstDayOfMonth = getFirstDayOfMonth(date);
    const daysInMonth = getDaysInMonth(date);
    const month = date.getMonth();
    const year = date.getFullYear();

    const blanks: JSX.Element[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      blanks.push(<td key={`blank-${i}`} className="calendar-day empty"></td>);
    }

    const days: JSX.Element[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <td
          key={`day-${day}`}
          style={{
            backgroundColor: isItToday(day) ? "var(--color-primary)" : "",
          }}
          className="calendar-day"
          onClick={() => handleDateClick(day)} // Add onClick handler for date selection
        >
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

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(date.getFullYear(), date.getMonth(), day);
    setSelectedDate(selectedDate);
    setShowModal(true); // Show modal when a date is clicked
  };

  return (
    <div>
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={handlePrevMonth}>Prev</button>
          <span>
            {months[date.getMonth()]} {date.getFullYear()}
          </span>
          <button onClick={handleNextMonth}>Next</button>
        </div>
        <table className="calendar-table">
          <thead>
            <tr>
              {daysOfWeek.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>{renderCalendar()}</tbody>
        </table>
      </div>
      <div>Scheduled Payments</div>
      {/* Display scheduled payments */}
      <ul>
        {payments.map((payment, index) => (
          <li key={index}>
            {payment.date.toLocaleDateString()} - {payment.amount} - {payment.description}
          </li>
        ))}
      </ul>
      {showModal && <PaymentModal />}
    </div>
  );
};

export default Calendar;
