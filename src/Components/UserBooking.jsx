import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box, // Import Box for flexible styling
} from "@mui/material";
import { Edit, Delete, CheckCircle, Cancel, HourglassEmpty } from "@mui/icons-material"; // Add status icons
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

// Helper function to get status color and icon
const getStatusProps = (status) => {
  switch (status) {
    case "Confirmed":
      return { color: '#4caf50', icon: <CheckCircle /> }; // Green
    case "Cancelled":
      return { color: '#f44336', icon: <Cancel /> }; // Red
    case "Pending":
    default:
      return { color: '#ff9800', icon: <HourglassEmpty /> }; // Amber/Orange
  }
};

const UserBooking = () => {
  const { companyName } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [status, setStatus] = useState("Pending"); // Default status

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/bookings/${companyName}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        setError('Failed to load bookings. Please try again later.');
        Swal.fire({
          title: 'Error',
          text: 'Failed to load bookings. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [companyName]);

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setOpenEditDialog(true);
    setStatus(booking.status); // Set status for editing
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedBooking(null);
  };

  const handleUpdateBooking = async () => {
    if (!selectedBooking) {
      console.error("No booking selected for update");
      return;
    }

    // Capture all editable fields from the dialog state (assuming the dialog is fully functional)
    const payload = {
      ...selectedBooking,
      status: selectedBooking.status, // We assume the status is updated via the separate status handler OR via the dialog if the select was included here
    };

    try {
      const response = await fetch(
        `http://localhost:8000/api/bookings/${companyName}/${selectedBooking._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update booking");
      }

      const updatedBooking = await response.json();
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === updatedBooking._id ? updatedBooking : booking
        )
      );

      Swal.fire({
        title: "Success",
        text: "Booking updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      });

      handleCloseEditDialog();
    } catch (error) {
      console.error('Error during update:', error);
      Swal.fire({
        title: "Error",
        text: "Failed to update booking",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this booking!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `http://localhost:8000/api/bookings/${companyName}/${bookingId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete booking");
        }

        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== bookingId)
        );

        Swal.fire("Deleted!", "Your booking has been deleted.", "success");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "Failed to delete booking. Please try again later.",
        "error"
      );
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/bookings/status/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedBooking = await response.json();
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === updatedBooking._id ? updatedBooking : booking
        )
      );

      Swal.fire({
        title: "Success",
        text: `Booking status updated to ${newStatus}`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error('Error during status update:', error);
      Swal.fire({
        title: "Error",
        text: "Failed to update status",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2, boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 3 }}>
        Bookings for {companyName} 📅
      </Typography>
      
      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "auto", padding: 2 }} />
      ) : error ? (
        <Typography variant="h6" color="error" sx={{ padding: 2 }}>
          {error}
        </Typography>
      ) : (
        <>
          {bookings.length === 0 ? (
            <Typography variant="h6" color="text.secondary" sx={{ p: 2 }}>
              No bookings found.
            </Typography>
          ) : (
            bookings.map((booking) => {
              const statusProps = getStatusProps(booking.status);
              
              return (
                <Card 
                  key={booking._id} 
                  sx={{ 
                    marginBottom: 3, 
                    borderLeft: `5px solid ${statusProps.color}`, // Status color border
                    transition: 'box-shadow 0.3s',
                    '&:hover': {
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    }
                  }}
                >
                  <CardContent>
                    <Grid container spacing={3} alignItems="center">
                      
                      {/* --- Booking Details (Left Side) --- */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{booking.fullName}</Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          📧 Email: <Box component="span" sx={{ fontWeight: 500 }}>{booking.email}</Box>
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          📞 Phone: <Box component="span" sx={{ fontWeight: 500 }}>{booking.phone}</Box>
                        </Typography>
                        <Box sx={{ mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                          <Typography variant="body2">
                            🛫 Origin: <Box component="span" sx={{ fontWeight: 500 }}>{booking.origin}</Box>
                          </Typography>
                          <Typography variant="body2">
                            🛬 Destination: <Box component="span" sx={{ fontWeight: 500 }}>{booking.destination}</Box>
                          </Typography>
                          <Typography variant="body2">
                            🗓️ Dates: <Box component="span" sx={{ fontWeight: 500 }}>{new Date(booking.startDate).toLocaleDateString()} - {booking.endDate ? new Date(booking.endDate).toLocaleDateString() : "N/A"}</Box>
                          </Typography>
                        </Box>
                      </Grid>

                      {/* --- Actions & Price (Right Side) --- */}
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            {/* Price and Distance */}
                            <Box>
                                <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700, color: '#3f51b5' }}>
                                    ${parseFloat(booking.price).toFixed(2)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Distance: {booking.distance} km
                                </Typography>
                            </Box>
                            
                            {/* Status Tag */}
                            <Box 
                                sx={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    borderRadius: "20px",
                                    padding: "4px 12px",
                                    backgroundColor: statusProps.color,
                                    color: 'white',
                                    fontWeight: 600,
                                    boxShadow: `0 2px 10px ${statusProps.color}50`,
                                }}
                            >
                                {statusProps.icon}
                                <Typography variant="body2" sx={{ ml: 0.5 }}>{booking.status}</Typography>
                            </Box>
                        </Box>

                        {/* Status Update Form */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Update Status</InputLabel>
                            <Select
                              value={booking.status} // Show the actual current status
                              onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                              label="Update Status"
                            >
                              <MenuItem value="Pending">Pending</MenuItem>
                              <MenuItem value="Confirmed">Confirmed</MenuItem>
                              <MenuItem value="Cancelled">Cancelled</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        
                        {/* Edit/Delete Actions */}
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <IconButton 
                            color="primary" 
                            onClick={() => handleEdit(booking)}
                            sx={{ color: '#1a75ff' }} // Blue for Edit
                          >
                            <Edit />
                          </IconButton>
                          <IconButton 
                            color="secondary" 
                            onClick={() => handleDelete(booking._id)}
                            sx={{ color: '#f44336' }} // Red for Delete
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              );
            })
          )}

          {/* Edit Dialog (Kept clean and functional) */}
          <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 600 }}>
              Edit Booking Details for {selectedBooking?.fullName}
            </DialogTitle>
            <DialogContent dividers>
              {/* Note: Ensure selectedBooking is handled for fields not present in the original component */}
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={selectedBooking?.fullName || ""}
                onChange={(e) => setSelectedBooking({ ...selectedBooking, fullName: e.target.value })}
                margin="dense"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={selectedBooking?.email || ""}
                onChange={(e) => setSelectedBooking({ ...selectedBooking, email: e.target.value })}
                margin="dense"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={selectedBooking?.phone || ""}
                onChange={(e) => setSelectedBooking({ ...selectedBooking, phone: e.target.value })}
                margin="dense"
                variant="outlined"
              />
              {/* Placeholder for other editable fields like origin, destination, etc. */}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditDialog}>Cancel</Button>
              <Button 
                onClick={handleUpdateBooking} 
                variant="contained" 
                color="primary"
                sx={{ bgcolor: '#3f51b5', '&:hover': { bgcolor: '#303f9f' } }}
              >
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Paper>
  );
};

export default UserBooking;