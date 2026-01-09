import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import axios from "axios";
import "./Calender.css";

const BookingCalendar = forwardRef(({ onDatesSelected, companyName }, ref) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useImperativeHandle(ref, () => ({
    getDates() {
      return { startDate, endDate };
    },
  }));

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/bookings/booked-dates/${companyName}`);

        if (response.status === 200) {
          const bookings = response.data.map((booking) => ({
            start: new Date(booking.startDate),
            end: booking.endDate ? new Date(booking.endDate) : new Date(booking.startDate),
          }));
          setBookedDates(bookings);
        }
      } catch (error) {
        setError("Error fetching booked dates");
        console.error("Error fetching booked dates:", error);
      } finally {
        setLoading(false);
      }
    };

    if (companyName) {
      fetchBookedDates();
    }
  }, [companyName]);

  const handleChange = (dates) => {
    const [start, end] = dates;

    if (start && end) {
      if (!isRangeBooked(start, end)) {
        setStartDate(start);
        setEndDate(end);
        if (onDatesSelected) {
          onDatesSelected(start, end);
        }
      } else {
        showAlert("Dates Conflict", "The selected date range overlaps with already booked dates. Please choose a different range.");
      }
    } else {
      setStartDate(start);
      setEndDate(end);
    }
  };

  const showAlert = (title, text) => {
    Swal.fire({ title, text, icon: "error", confirmButtonText: "OK" });
  };

  const isDateBooked = (date) => {
    return bookedDates.some(({ start, end }) => {
      return date >= start && date <= end;
    });
  };

  const isRangeBooked = (start, end) => {
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (isDateBooked(d)) return true;
    }
    return false;
  };

  const isDateAvailable = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) >= today && !isDateBooked(date);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <div className="col-md-3 form-group">
        <label htmlFor="date-range">Select Date</label>
        <div className="datepicker-container">
          <DatePicker
            selected={startDate}
            onChange={handleChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            className="form-control datepicker-input"
            id="date-range"
            dateFormat="yyyy/MM/dd"
            isClearable
            placeholderText="Select a date range"
            filterDate={isDateAvailable}
          />
        </div>
      </div>
    </div>
  );
});

export default BookingCalendar;
