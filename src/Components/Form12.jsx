import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
    "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
    "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia, Plurinational State of", "Bonaire",
    "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory",
    "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon",
    "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile",
    "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros",
    "Congo, The Democratic Republic of The", "Cook Islands", "Costa Rica", "Côte D'ivoire",
    "Croatia", "Cuba", "Curaçao", "Cyprus", "Czechia", "Denmark", "Djibouti",
    "Dominica", "Dominican Republic", "Easter Island", "Ecuador", "Egypt", "El Salvador",
    "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (malvinas)",
    "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia",
    "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
    "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala",
    "Guernsey", "Guinea", "Guinea-bissau", "Guyana", "Haiti", "Heard Island and Mcdonald Islands",
    "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland",
    "India", "Indonesia", "Iran, Islamic Republic of", "Iraq", "Ireland", "Isle of Man",
    "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Johnston Island", "Jordan",
    "Kazakhstan", "Kenya", "Kingman Reef", "Kiribati", "Korea, Democratic People's Republic of",
    "Korea, Republic of", "Kosovo", "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic",
    "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
    "Luxembourg", "Macao", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali",
    "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte",
    "Mexico", "Micronesia, Federated States of", "Midway", "Moldova, Republic of",
    "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique",
    "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles",
    "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue",
    "Norfolk Island", "North Macedonia", "Northern Mariana Islands", "Norway", "Oman",
    "Pakistan", "Palau", "Palestine, State of", "Palmyra", "Panama", "Papua New Guinea",
    "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico",
    "Qatar", "Romania", "Russian Federation", "Rwanda", "Réunion", "Saint Barthélemy",
    "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin (French Part)",
    "Saint Pierre and Miquelon", "Saint Vincent and The Grenadines", "Samoa", "San Marino",
    "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
    "Singapore", "Sint Maartin (Dutch Part)", "Slovakia", "Slovenia", "Solomon Islands",
    "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
    "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China"
  ];
  

function Form12() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // State to manage focus and info messages
  const [infoMessages, setInfoMessages] = useState({
    firstName: "",
    lastName: "",
    company: "",
    workEmail: "",
    phoneNumber: "",
    country: "",
  });

  const handleFocus = (field) => {
    const messages = {
      firstName: "Please enter your first name.",
      lastName: "Please enter your last name.",
      company: "Please enter your company name.",
      workEmail: "Please enter a valid work email.",
      phoneNumber: "Please enter your phone number (numbers only).",
      country: "Please select your country.",
    };

    setInfoMessages((prev) => ({
      ...prev,
      [field]: messages[field],
    }));
  };

  const handleBlur = (field) => {
    setInfoMessages((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

 

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Reset info messages
    setInfoMessages({
      firstName: "",
      lastName: "",
      company: "",
      workEmail: "",
      phoneNumber: "",
      country: "",
    });

    // Simulate a successful submission
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  const fieldStyles = {
    mb: 2,
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "grey",
        borderWidth: "2px",
        borderRadius: "1px",
        color:"grey !important",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#B4D625",
        color:"grey !important",
      },
      "&:hover fieldset": {
        borderColor: "grey", // Grey border on hover
        color:"grey !important",
      },
    },
  };

  return (
    <Container
      sx={{
        backgroundColor: "#F2F2F2",
        padding: "32px",
        borderRadius: "7px",
        margin: "20px",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontFamily: "Gelica, Arial, sans-serif",
          fontWeight: 300,
          color: "rgb(2, 82, 75)",
          fontSize: "30px",
          lineHeight: "40px",
          mb: 2,
          textAlign: "center",
        }}
      >
        See Salesloft in Action
      </Typography>
      <Typography
        variant="h6"
        component="h2"
        sx={{
          fontFamily: "Lato",
          fontWeight: 400,
          color: "rgb(2, 82, 75)",
          fontSize: "18px",
          lineHeight: "24px",
          mb: 4,
          textAlign: "center",
        }}
      >
        Fill out the form to request a demo.
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 2,
          backgroundColor: "white",
          padding: "60px",
          borderRadius: "7px",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)", // Small box shadow
        }}
      >
        <TextField
          label={<span>First Name <span style={{ color: "red" }}>*</span></span>}
          variant="outlined"
          fullWidth
          required
          InputLabelProps={{
            required: false, // Disables the default asterisk
            sx: {
              color: "black", // Set the default label color
              "&.Mui-focused": {
                color: "black !important", // Maintain label color on focus
              },
            },
          }}
          onFocus={() => handleFocus("firstName")}
          onBlur={() => handleBlur("firstName")}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          sx={fieldStyles}
        />
   {infoMessages.firstName && (
  <Box
    sx={{
        position: "absolute", // Position it relative to the field
        top: "1", // Start just below the input field
        left: 90, 
        transform: "translateY(4px)", // Adjust for a little space below the field
        backgroundColor: "#e51b00",
        backgroundImage: "linear-gradient(#e51b00 43%, #ba1600 100%)", // Gradient
        border: "1px solid #9f1300", // Light red border
        borderRadius: "6px",
        boxShadow: "rgba(0, 0, 0, 0.65) 0 2px 7px, inset #ff3c3c 0 1px 0px", // Darker box shadow
        color: "#f3f3f3",
        fontSize: "13px",
        lineHeight: "16px",
        maxWidth: "16em",
        padding: "0.4em 0.6em",
        textShadow: "#901100 0 -1px 0", // Text shadow for depth
        fontWeight: "bold", // Bold font
        zIndex: 10, // Ensure it appears above other elements
       
    }}
  >
       This field is required

  </Box>
)}
        <TextField
          label={<span>Last Name <span style={{ color: "red" }}>*</span></span>}
          variant="outlined"
          fullWidth
          required
          InputLabelProps={{
            required: false, // Disables the default asterisk
            sx: {
              color: "black", // Set the default label color
              "&.Mui-focused": {
                color: "black !important", // Maintain label color on focus
              },
            },
          }}
          onFocus={() => handleFocus("lastName")}
          onBlur={() => handleBlur("lastName")}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          sx={fieldStyles}
        />
        {infoMessages.lastName && (
          <Box
          sx={{
            position: "absolute", // Position it relative to the field
            top: "1", // Start just below the input field
            left: 90, 
            transform: "translateY(4px)", // Adjust for a little space below the field
            backgroundColor: "#e51b00",
            backgroundImage: "linear-gradient(#e51b00 43%, #ba1600 100%)", // Gradient
            border: "1px solid #9f1300", // Light red border
            borderRadius: "6px",
            boxShadow: "rgba(0, 0, 0, 0.65) 0 2px 7px, inset #ff3c3c 0 1px 0px", // Darker box shadow
            color: "#f3f3f3",
            fontSize: "13px",
            lineHeight: "16px",
            maxWidth: "16em",
            padding: "0.4em 0.6em",
            textShadow: "#901100 0 -1px 0", // Text shadow for depth
            fontWeight: "bold", // Bold font
            zIndex: 10, // Ensure it appears above other elements
       
        }}
      >
           This field is required
          </Box>
        )}

        <TextField
          label={<span>Company <span style={{ color: "red" }}>*</span></span>}
          variant="outlined"
          fullWidth
          required
          InputLabelProps={{
            required: false, // Disables the default asterisk
            sx: {
              color: "black", // Set the default label color
              "&.Mui-focused": {
                color: "black !important", // Maintain label color on focus
              },
            },
          }}
          onFocus={() => handleFocus("company")}
          onBlur={() => handleBlur("company")}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          sx={fieldStyles}
        />
        {infoMessages.company && (
           <Box
           sx={{
             position: "absolute", // Position it relative to the field
             top: "1", // Start just below the input field
             left: 90, 
             transform: "translateY(4px)", // Adjust for a little space below the field
             backgroundColor: "#e51b00",
             backgroundImage: "linear-gradient(#e51b00 43%, #ba1600 100%)", // Gradient
             border: "1px solid #9f1300", // Light red border
             borderRadius: "6px",
             boxShadow: "rgba(0, 0, 0, 0.65) 0 2px 7px, inset #ff3c3c 0 1px 0px", // Darker box shadow
             color: "#f3f3f3",
             fontSize: "13px",
             lineHeight: "16px",
             maxWidth: "16em",
             padding: "0.4em 0.6em",
             textShadow: "#901100 0 -1px 0", // Text shadow for depth
             fontWeight: "bold", // Bold font
             zIndex: 10, // Ensure it appears above other elements
            
         }}
       >
                This field is required
           </Box>
        )}

        <TextField
          label={<span>Work Email <span style={{ color: "red" }}>*</span></span>}
          variant="outlined"
          fullWidth
          required
          InputLabelProps={{
            required: false, // Disables the default asterisk
            sx: {
              color: "black", // Set the default label color
              "&.Mui-focused": {
                color: "black !important", // Maintain label color on focus
              },
            },
          }}
          type="email"
          onFocus={() => handleFocus("workEmail")}
          onBlur={() => handleBlur("workEmail")}
          value={workEmail}
          onChange={(e) => setWorkEmail(e.target.value)}
          sx={fieldStyles}
        />
        {infoMessages.workEmail && (
          <Box
          sx={{
            position: "absolute", // Position it relative to the field
            top: "1", // Start just below the input field
            left: 90, 
            transform: "translateY(4px)", // Adjust for a little space below the field
            backgroundColor: "#e51b00",
            backgroundImage: "linear-gradient(#e51b00 43%, #ba1600 100%)", // Gradient
            border: "1px solid #9f1300", // Light red border
            borderRadius: "6px",
            boxShadow: "rgba(0, 0, 0, 0.65) 0 2px 7px, inset #ff3c3c 0 1px 0px", // Darker box shadow
            color: "#f3f3f3",
            fontSize: "13px",
            lineHeight: "16px",
            maxWidth: "16em",
            padding: "0.4em 0.6em",
            textShadow: "#901100 0 -1px 0", // Text shadow for depth
            fontWeight: "bold", // Bold font
            zIndex: 10, // Ensure it appears above other elements
           
        }}
      >
           Must be valid email.
           example@yourdomain.com
          </Box>
        )}

        <TextField
          label={<span>Phone Number <span style={{ color: "red" }}>*</span></span>}
          variant="outlined"
          fullWidth
          required
          InputLabelProps={{
            required: false, // Disables the default asterisk
            sx: {
              color: "black", // Set the default label color
              "&.Mui-focused": {
                color: "black !important", // Maintain label color on focus
              },
            },
          }}
          
          type="tel"
          onFocus={() => handleFocus("phoneNumber")}
          onBlur={() => handleBlur("phoneNumber")}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          sx={fieldStyles}
        />
        {infoMessages.phoneNumber && (
          <Box
          sx={{
            position: "absolute", // Position it relative to the field
            top: "1", // Start just below the input field
            left: 90, 
            transform: "translateY(4px)", // Adjust for a little space below the field
            backgroundColor: "#e51b00",
            backgroundImage: "linear-gradient(#e51b00 43%, #ba1600 100%)", // Gradient
            border: "1px solid #9f1300", // Light red border
            borderRadius: "6px",
            boxShadow: "rgba(0, 0, 0, 0.65) 0 2px 7px, inset #ff3c3c 0 1px 0px", // Darker box shadow
            color: "#f3f3f3",
            fontSize: "13px",
            lineHeight: "16px",
            maxWidth: "16em",
            padding: "0.4em 0.6em",
            textShadow: "#901100 0 -1px 0", // Text shadow for depth
            fontWeight: "bold", // Bold font
            zIndex: 10, // Ensure it appears above other elements
           
        }}
      >
           Must be a phone number.
           503-555-1212
          </Box>
        )}

<FormControl
  variant="outlined"
  fullWidth
  sx={{
    mb: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: "1px", 
      "& fieldset": {
        borderColor: "grey", 
        borderWidth: "2px",   
      },
      "&:hover fieldset": {
        borderColor: "grey !important", 
      },
      "&.Mui-focused fieldset": {
        borderColor: "#B4D625 !important", // Green border on focus
        borderWidth: "2px", // Keep border width at 2px
        color:"grey !important",
      },
      "&.Mui-active fieldset": {
        borderColor: "#B4D625 !important", // Override any active state as well
        color:"grey !important",
      },
      "&.Mui-disabled fieldset": {
        borderColor: "grey", // If disabled, set border to grey (optional)
        color:"grey !important",
      },
    },
    "& .MuiSelect-select:focus": {
      backgroundColor: "transparent", // Remove any background change on focus
      color:"grey !important",
    },
  }}
>
  <InputLabel     sx={{
      color: "black", // Set the default label color
      "&.Mui-focused": {
        color: "black !important", // Maintain label color on focus
      },
    }}>
    Country <span style={{ color: "red" }}
    >*</span>
    
  </InputLabel>
  <Select
    value={country}
    onChange={(e) => setCountry(e.target.value)}
    label="Country"
    onFocus={() => handleFocus("country")}
    onBlur={() => handleBlur("country")}
    MenuProps={{
      PaperProps: {
        sx: {
          maxHeight: 200, // Set max height for the dropdown
          overflowY: 'auto', // Allow scrolling
        },
      },
    }}
  >
    {countries.map((country) => (
      <MenuItem key={country} value={country}>
        {country}
      </MenuItem>
    ))}
  </Select>
</FormControl>


        {infoMessages.country && (
          <Box
          sx={{
            position: "absolute", // Position it relative to the field
            top: "1", // Start just below the input field
            left: 90, 
            transform: "translateY(4px)", // Adjust for a little space below the field
            backgroundColor: "#e51b00",
            backgroundImage: "linear-gradient(#e51b00 43%, #ba1600 100%)", // Gradient
            border: "1px solid #9f1300", // Light red border
            borderRadius: "6px",
            boxShadow: "rgba(0, 0, 0, 0.65) 0 2px 7px, inset #ff3c3c 0 1px 0px", // Darker box shadow
            color: "#f3f3f3",
            fontSize: "13px",
            lineHeight: "16px",
            maxWidth: "16em",
            padding: "0.4em 0.6em",
            textShadow: "#901100 0 -1px 0", // Text shadow for depth
            fontWeight: "bold", // Bold font
            zIndex: 10, // Ensure it appears above other elements
           
        }}
      >
        This field is required

          </Box>
        )}

        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#B4D625",
            color: "#02524B",
            "&:hover": {
              backgroundColor: "#02524B !important",
              color: "white !important",
            },
            marginTop: "16px",
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Request a Demo"}
        </Button>

        {success && (
          <Alert severity="success" sx={{ marginTop: 2 }}>
            Your request has been submitted successfully!
          </Alert>
        )}
      </Box>
    </Container>
  );
}

export default Form12;
