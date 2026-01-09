import React, { useState, forwardRef, useImperativeHandle } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// NOTE: I've commented out the Swal import since it's not used in this function, 
// but you can re-enable it if you add validation/alerts.
// import Swal from "sweetalert2"; 
import "./Calender.css"; // Ensure your styling is correctly applied

const MIN_BOOKING_DAYS = 2; // Set minimum duration to 2 days

const BookingCalendar = forwardRef(({ onDatesSelected }, ref) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    getDates() {
      return { startDate, endDate };
    },
    // Optional: Add a method to reset the selection
    resetDates() {
      setStartDate(null);
      setEndDate(null);
    }
  }));

  const handleChange = (dates) => {
    const [start, end] = dates;

    // 1. Update state optimistically
    setStartDate(start);
    setEndDate(end);

    // 2. Check for minimum duration ONLY if both start and end are selected
    if (start && end) {
      // Calculate the difference in days
      const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
      const diffDays = Math.round(Math.abs((end - start) / oneDay));
      
      // The range selection is INCLUSIVE of both the start and end date.
      // E.g., Selecting May 25 to May 26 is 2 days.
      if (diffDays + 1 < MIN_BOOKING_DAYS) {
        // If the duration is too short, show an error (or use Swal here)
        alert(`Booking requires a minimum duration of ${MIN_BOOKING_DAYS} days.`);
        
        // Reset the selection to just the start date
        setEndDate(null);
        // Do NOT call onDatesSelected yet
        return; 
      }
      
      // If valid, call the parent callback
      if (onDatesSelected) {
        onDatesSelected(start, end);
      }
    } else {
      // If selection is incomplete (only start date is picked), 
      // clear previous range output.
      if (onDatesSelected) {
        onDatesSelected(start, null);
      }
    }
  };

  return (
    <div className="container">
      <div className="col-md-3 form-group">
        <label htmlFor="date-range">Select Date Range (Min {MIN_BOOKING_DAYS} days)</label>
        <div className="datepicker-container">
          <DatePicker
            selected={startDate}
            onChange={handleChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            // Disable dates before today (for booking)
            minDate={new Date()} 
            className="form-control datepicker-input"
            id="date-range"
            dateFormat="yyyy/MM/dd"
            isClearable
            placeholderText="Select a date range"
          />
        </div>
      </div>
    </div>
  );
});

export default BookingCalendar;