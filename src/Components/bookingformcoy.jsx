import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import BookingCalendar from "./BookingCalender"; // Ensure this is correctly imported
import { TextField, Button, Container, Grid, Typography, Paper, Box, CircularProgress } from "@mui/material";
import queryString from 'query-string';

const BookingForm = () => {
  const location = useLocation();
  const { search } = location;
  const queryParams = queryString.parse(search);

  const {
    from: fromLocationName = "Unknown",
    to: toLocationName = "Unknown",
    price: carPrice = "N/A",
    distance = "Unknown",
    companyName = "CompanyName"
  } = queryParams;

  const fromLocation = fromLocationName; // Defined
  const toLocation = toLocationName; // Defined

  const [loading, setLoading] = useState(false); // Loading state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    startDate: "",
    endDate: "",
    time: "",
    comments: "",
    origin: fromLocation,
    destination: toLocation,
    price: carPrice,
    distance,
  });

  const [datesSelected, setDatesSelected] = useState(false);
  const [bookedDates, setBookedDates] = useState([]); // Initialize as empty array

  useEffect(() => {
    // Fetch booked dates from the server
    const fetchBookedDates = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/booking/booked-dates/${companyName}`);
        const data = await response.json();
        setBookedDates(data.bookedDates || []);
        alert(bookedDates);
      } catch (error) {
        console.error("Error fetching booked dates:", error);
        Swal.fire({
          title: 'Error',
          text: 'Could not fetch booked dates. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookedDates();
  }, [companyName]);

  useEffect(() => {
    if (location.state) {
      setFormData((prevState) => ({
        ...prevState,
        origin: fromLocation || "Unknown",
        destination: toLocation || "Unknown",
        price: carPrice,
        distance, // Update distance when location state changes
      }));
    }
  }, [location.state, fromLocation, toLocation, carPrice, distance]);

  const handleDatesSelected = (start, end) => {
    setDatesSelected(true); // Show form when dates are selected

    const formatDate = (date) => {
      if (!date) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    setFormData((prevState) => ({
      ...prevState,
      startDate: formatDate(start),
      endDate: formatDate(end),
    }));
  };

  const isDateBooked = (startDate, endDate) => {
    if (!Array.isArray(bookedDates) || !startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    return bookedDates.some((bookedDate) => {
      const bookedStart = new Date(bookedDate.startDate);
      const bookedEnd = new Date(bookedDate.endDate);
      
      const isOverlapping = start <= bookedEnd && end >= bookedStart;
  
      console.log(`Checking overlap: Selected (${start} to ${end}), Booked (${bookedStart} to ${bookedEnd}), Overlapping: ${isOverlapping}`);
      
      return isOverlapping;
    });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.phone || !formData.startDate || !formData.time) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill in all required fields.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    const sanitizedFormData = {
      ...formData,
      endDate: formData.endDate || null,
      companyName, // Include the company name in the request body
    };

    try {
      setLoading(true);
      const bookingResponse = await fetch(`http://localhost:8000/api/bookings/book/${companyName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizedFormData),
      });

      if (!bookingResponse.ok) throw new Error(`Booking submission failed: ${bookingResponse.statusText}`);

      Swal.fire({
        title: 'Success',
        text: 'Booking submitted successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      // Optionally reset form or redirect after submission
    } catch (error) {
      console.error("Error submitting booking:", error);
      Swal.fire({
        title: 'Error',
        text: 'There was an error submitting your booking. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <BookingCalendar onDatesSelected={handleDatesSelected} />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
          <CircularProgress />
        </Box>
      ) : datesSelected ? (
        <Paper sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h6" gutterBottom>
            Booking Form
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Form fields for user input */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="End Date (Optional)"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="From"
                  name="origin"
                  value={formData.origin}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="To"
                  name="destination"
                  value={formData.destination}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  value={formData.price}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Comments"
                  name="comments"
                  multiline
                  rows={4}
                  value={formData.comments}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <Box sx={{ marginTop: 2 }}>
              <Button variant="contained" type="submit">
                Submit Booking
              </Button>
            </Box>
          </Box>
        </Paper>
      ) : (
        <Typography variant="h6" gutterBottom>
          Please select your dates to proceed.
        </Typography>
      )}
    </Container>
  );
};

export default BookingForm;
