import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import BookingCalendar from "./BookingCalender"; 
import { 
    TextField, 
    Button, 
    Container, 
    Grid, 
    Typography, 
    Paper, 
    Box, 
    CircularProgress, 
    Card, 
    CardContent 
} from "@mui/material";
import { EventNote, Send, AccessTime, LocationOn, AttachMoney, Map, Person, Email, Phone } from '@mui/icons-material';
import queryString from 'query-string';

const BookingForm = () => {
    const location = useLocation();
    const { search } = location;
    const queryParams = queryString.parse(search);

    // Destructure query parameters
    const {
        from: fromLocationName = "Unknown",
        to: toLocationName = "Unknown",
        price: carPrice = "N/A",
        distance = "Unknown",
        duration = "N/A", // Added duration for summary
        company: companyName = "myaio" 
    } = queryParams;

    const fromLocation = fromLocationName;
    const toLocation = toLocationName;

    const [loading, setLoading] = useState(false);
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

    useEffect(() => {
        // Update the form data with query params upon load
        setFormData((prevState) => ({
            ...prevState,
            origin: fromLocation || "Unknown",
            destination: toLocation || "Unknown",
            price: carPrice,
            distance,
        }));
    }, [fromLocation, toLocation, carPrice, distance]);

    const handleDatesSelected = (start, end) => {
        setDatesSelected(true);

        const formatDate = (date) => {
            if (!date) return "";
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        setFormData((prevState) => ({
            ...prevState,
            startDate: formatDate(start),
            endDate: formatDate(end),
        }));
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
    
        if (!companyName || !formData.fullName || !formData.email || !formData.phone || !formData.startDate || !formData.time) {
            Swal.fire({
                title: 'Validation Error',
                text: 'Please fill in all required fields (Name, Email, Phone, Start Date, and Time).',
                icon: 'warning',
                confirmButtonText: 'OK',
            });
            return;
        }
    
        const sanitizedFormData = {
            ...formData,
            endDate: formData.endDate || null, 
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
                title: 'Booking Confirmed! 🚀',
                text: 'Your booking has been submitted successfully!',
                icon: 'success',
                confirmButtonText: 'Great!',
            });
            
            // Optional: Reset form after success
            setFormData({
                fullName: "", email: "", phone: "", startDate: "", endDate: "", time: "", comments: "",
                origin: fromLocation, destination: toLocation, price: carPrice, distance,
            });
            setDatesSelected(false);

        } catch (error) {
            console.error("Error submitting booking:", error);
    
            Swal.fire({
                title: 'Error',
                text: 'There was an error confirming your booking. Please check the network and try again.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, color: '#1976d2' }}>
                <EventNote sx={{ mr: 1, fontSize: 'inherit', verticalAlign: 'middle' }} /> Confirm Your Booking
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
                Finalize your trip details for **{companyName}**.
            </Typography>

            <BookingCalendar onDatesSelected={handleDatesSelected} />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ ml: 2, color: 'text.secondary' }}>Submitting booking...</Typography>
                </Box>
            ) : datesSelected ? (
                <Grid container spacing={4} sx={{ mt: 3 }}>
                    
                    {/* --- Booking Form Section --- */}
                    <Grid item xs={12} md={7}>
                        <Card 
                            component={Paper} 
                            elevation={10} 
                            sx={{ padding: 4, borderRadius: 3, transition: 'box-shadow 0.3s' }}
                        >
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                Personal & Trip Information
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    
                                    {/* Personal Info */}
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} required InputProps={{ startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} /> }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth type="email" label="Email" name="email" value={formData.email} onChange={handleInputChange} required InputProps={{ startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} /> }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth type="tel" label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} required InputProps={{ startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} /> }} />
                                    </Grid>
                                    
                                    {/* Date & Time */}
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth type="date" label="Start Date (Trip Day)" name="startDate" value={formData.startDate} onChange={handleInputChange} required InputLabelProps={{ shrink: true }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth type="date" label="End Date (Optional)" name="endDate" value={formData.endDate} onChange={handleInputChange} InputLabelProps={{ shrink: true }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth type="time" label="Pickup Time" name="time" value={formData.time} onChange={handleInputChange} required InputLabelProps={{ shrink: true }} />
                                    </Grid>
                                    
                                    {/* Comments */}
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Additional Comments / Special Requests" name="comments" multiline rows={4} value={formData.comments} onChange={handleInputChange} />
                                    </Grid>

                                    {/* Submission Button */}
                                    <Grid item xs={12}>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            type="submit" 
                                            fullWidth 
                                            size="large"
                                            endIcon={<Send />}
                                            sx={{ mt: 2, borderRadius: 2, height: 56, fontWeight: 700 }}
                                        >
                                            Confirm Booking
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Card>
                    </Grid>

                    {/* --- Booking Summary Section --- */}
                    <Grid item xs={12} md={5}>
                        <Card 
                            component={Paper} 
                            elevation={10} 
                            sx={{ 
                                padding: 4, 
                                borderRadius: 3, 
                                backgroundColor: '#e3f2fd', // Light blue background for emphasis
                                border: '2px solid #90caf9'
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2', mb: 2 }}>
                                <Map sx={{ mr: 1 }} /> Trip Summary
                            </Typography>
                            
                            {/* Display read-only route details */}
                            <Box sx={{ mb: 3 }}>
                                <SummaryItem icon={LocationOn} label="Departure" value={formData.origin} color="success" />
                                <SummaryItem icon={LocationOn} label="Destination" value={formData.destination} color="error" />
                                <SummaryItem icon={Map} label="Distance" value={`${distance} km`} />
                                <SummaryItem icon={AccessTime} label="Duration" value={`${duration} mins`} />
                            </Box>

                            {/* Price/Total Cost */}
                            <Box sx={{ 
                                borderTop: '2px dashed #90caf9', 
                                pt: 2, 
                                mt: 2, 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center' 
                            }}>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1976d2' }}>
                                    Total Price:
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 800, color: '#4caf50' }}>
                                    ${formData.price}
                                </Typography>
                            </Box>

                            <Typography variant="caption" display="block" align="center" sx={{ mt: 2, color: 'text.secondary' }}>
                                Note: Price includes estimated trip costs. Final charges may vary slightly.
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
            ) : (
                <Paper sx={{ padding: 4, marginTop: 4, textAlign: 'center', border: '2px dashed #1976d2', borderRadius: 3 }}>
                    <EventNote sx={{ fontSize: 60, color: '#1976d2', mb: 1 }} />
                    <Typography variant="h5" color="text.secondary">
                        First, select your **Start Date** and **End Date** on the calendar above to unlock the form.
                    </Typography>
                </Paper>
            )}
        </Container>
    );
};

// Helper component for cleaner summary display
const SummaryItem = ({ icon: Icon, label, value, color }) => (
    <Box display="flex" alignItems="center" mb={1} sx={{ opacity: 0.9 }}>
        <Icon sx={{ mr: 1, color: color || 'primary.main' }} fontSize="small" />
        <Typography variant="body1" sx={{ fontWeight: 500, minWidth: 100 }}>{label}:</Typography>
        <Typography variant="body1" sx={{ ml: 1, fontWeight: 700, color: 'text.primary' }}>{value}</Typography>
    </Box>
);

export default BookingForm;