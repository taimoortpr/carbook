import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
  Container,
  CardMedia,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  AccessTime,
  LocationOn,
  Map,
  DirectionsCar,
  GpsFixed,
  Route,
} from "@mui/icons-material";
import { keyframes } from "@emotion/react";

// --- Mapbox Configuration ---
mapboxgl.accessToken =
  "pk.eyJ1IjoidGFpbW9vcnhwZXJ0ZGlnaSIsImEiOiJjbHpzejd6cXAxZWVuMmtzM3hoeWJyMHdwIn0.21zpVXe583hKT8Pt5ImOgg";

// --- CSS for MapboxGeocoder and subtle animations (CRITICAL for Z-INDEX FIX) ---
const geocoderStyles = `
  /* Z-Index Fix: Ensures the dropdown appears above other elements */
  .mapboxgl-ctrl-geocoder {
    width: 100% !important;
    max-width: none !important;
    border-radius: 12px !important;
    /* Added high z-index to fix dropdown behind issue */
    z-index: 1000 !important; 
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
    transition: box-shadow 0.3s;
  }
  .mapboxgl-ctrl-geocoder:focus-within {
      box-shadow: 0 4px 20px rgba(25, 118, 210, 0.4) !important;
  }
  .mapboxgl-ctrl-geocoder--input {
    height: 56px;
    padding: 0 16px;
    font-size: 1rem;
    color: #333;
    outline: none;
    border: 2px solid #e0e0e0; /* Added subtle border */
    border-radius: 12px;
    transition: border-color 0.3s;
  }
  .mapboxgl-ctrl-geocoder--input:focus {
    border-color: #1976d2; /* Primary color focus */
  }
  .geocoder-box {
    width: 100%;
    margin-bottom: 24px; /* Increased spacing */
  }
  /* Style for the dropdown list */
  .mapboxgl-ctrl-geocoder--suggestions {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const pulsate = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
`;
// --- End CSS ---

const Mapbox = () => {
  const mapContainerRef = useRef(null);
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const [map, setMap] = useState(null);
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [fromLocationName, setFromLocationName] = useState("Select A Starting Point");
  const [toLocationName, setToLocationName] = useState("Select A Destination");
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [routeCalculated, setRouteCalculated] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { companyName } = useParams();

  // Apply Geocoder styles and z-index fix
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = geocoderStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // --- Map and Geocoder Initialization ---
  useEffect(() => {
    const initialMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-77.04, 38.907],
      zoom: 11,
    });

    initialMap.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    setMap(initialMap);

    // Initializing Geocoders
    const geocoderFrom = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      placeholder: "Departure Location",
      mapboxgl: mapboxgl,
      marker: false,
    });

    const geocoderTo = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      placeholder: "Arrival Location",
      mapboxgl: mapboxgl,
      marker: false,
    });

    // Event handling (same as before)
    const handleGeocoderResult = (e, type) => {
      const coordinates = e.result.geometry.coordinates;
      const locationName = e.result.place_name;

      // ... rest of the logic ...
      if (type === "from") {
        setFromLocation(coordinates);
        setFromLocationName(locationName);
      } else {
        setToLocation(coordinates);
        setToLocationName(locationName);
      }

      // Add custom marker for better visual feedback
      new mapboxgl.Marker({ color: type === "from" ? "#007bff" : "#dc3545" })
        .setLngLat(coordinates)
        .addTo(initialMap);
    };

    geocoderFrom.on("result", (e) => handleGeocoderResult(e, "from"));
    geocoderTo.on("result", (e) => handleGeocoderResult(e, "to"));

    if (fromRef.current && toRef.current) {
      fromRef.current.innerHTML = "";
      toRef.current.innerHTML = "";
      // Append Geocoders to their respective refs
      fromRef.current.appendChild(geocoderFrom.onAdd(initialMap));
      toRef.current.appendChild(geocoderTo.onAdd(initialMap));
    }

    return () => {
      initialMap.remove();
    };
  }, []);

  // --- Product Fetching (same as before) ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/products/${companyName}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load car listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [companyName]);

  // --- Route Calculation Handler (same as before) ---
  const handleRoute = () => {
    if (!fromLocation || !toLocation) {
      alert("Please select both a Departure and Arrival location.");
      return;
    }

    setIsCalculating(true);
    setRouteCalculated(false);
    setDistance(null);
    setDuration(null);

    fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${fromLocation.join(
        ","
      )};${toLocation.join(",")}?geometries=geojson&access_token=${
        mapboxgl.accessToken
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0].geometry;
          const routeDistance = (data.routes[0].distance / 1000).toFixed(2); // km
          const routeDuration = (data.routes[0].duration / 60).toFixed(0); // minutes (rounded)

          setDistance(routeDistance);
          setDuration(routeDuration);
          setRouteCalculated(true);

          // Update car prices based on distance
          const updatedCarPrices = products.map((car) => ({
            ...car,
            price: (parseFloat(car.price) + parseFloat(routeDistance) * 2).toFixed(2),
          }));
          setProducts(updatedCarPrices);

          // Map layer updates (same as before)
          if (map.getSource("route")) {
            map.getSource("route").setData(route);
          } else {
            map.addSource("route", {
              type: "geojson",
              data: route,
            });
            map.addLayer({
              id: "route",
              type: "line",
              source: "route",
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#007bff",
                "line-width": 6,
                "line-opacity": 0.8,
              },
            });
          }

          map.fitBounds([fromLocation, toLocation], {
            padding: { top: 50, bottom: 50, left: 50, right: 50 },
            duration: 1500,
          });
        } else {
          console.error("No routes found in API response");
          setDistance("N/A");
          setDuration("N/A");
          setError("Could not find a route between the selected locations.");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("An error occurred during route calculation.");
      })
      .finally(() => {
        setIsCalculating(false);
      });
  };

  // --- Component Rendering ---
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: 700, color: "#1976d2" }}
      >
        <DirectionsCar sx={{ mr: 1, verticalAlign: "bottom" }} /> Smart Ride Planner
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
        Calculate your route and view vehicle options with integrated pricing.
      </Typography>

      <Grid container spacing={4} justifyContent="center" sx={{ mt: 3 }}>
        {/* --- LEFT COLUMN: Input, Map, and Results Summary --- */}
        <Grid item xs={12} lg={6}>
          <Card
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
              border: "1px solid #f0f0f0",
              minHeight: "650px",
            }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Route Calculator
              </Typography>

              {/* Input Fields wrapped with high zIndex to ensure dropdown visibility */}
              <Box sx={{ zIndex: 1000, position: 'relative' }}> 
                <Box className="geocoder-box" ref={fromRef} />
                <Box className="geocoder-box" ref={toRef} sx={{ mb: 3 }} />
              </Box>

              {/* Calculate Button with Loading State */}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleRoute}
                disabled={isCalculating}
                sx={{
                  height: 56,
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  mt: 1,
                  mb: 3,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 12px rgba(0, 123, 255, 0.4)",
                  },
                  transition: "all 0.3s",
                }}
              >
                {isCalculating ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    <Route sx={{ mr: 1 }} /> Calculate Route & Price
                  </>
                )}
              </Button>

              {/* Map Container */}
              <Box
                ref={mapContainerRef}
                sx={{
                  height: "400px",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                }}
              />

              {/* Route Summary Card */}
              <Card
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 3,
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(5px)",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  animation: routeCalculated ? `${pulsate} 2s infinite ease-out` : 'none',
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: "#1976d2" }}>
                  <GpsFixed sx={{ mr: 1, verticalAlign: "middle" }} /> Route Details
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <AccessTime color="secondary" sx={{ mr: 1 }} />
                      <Typography variant="body1" fontWeight="bold">
                        Duration:{" "}
                        <Typography component="span" color="primary">
                          {duration ? `${duration} mins` : "N/A"}
                        </Typography>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <Map color="secondary" sx={{ mr: 1 }} />
                      <Typography variant="body1" fontWeight="bold">
                        Distance:{" "}
                        <Typography component="span" color="primary">
                          {distance ? `${distance} km` : "N/A"}
                        </Typography>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center">
                      <LocationOn color="success" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        From: **{fromLocationName}**
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center">
                      <LocationOn color="error" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        To: **{toLocationName}**
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </CardContent>
          </Card>
        </Grid>

        {/* --- RIGHT COLUMN: Car Listings (Content remains largely the same) --- */}
        <Grid item xs={12} lg={6}>
          <Card
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
              minHeight: "650px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              <DirectionsCar sx={{ mr: 1, verticalAlign: "bottom" }} /> Available Vehicles
            </Typography>

            {loading && (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress color="primary" />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading listings...</Typography>
              </Box>
            )}

            {error && <Alert severity="error">{error}</Alert>}

            {!routeCalculated ? (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100%"
                sx={{
                  p: 4,
                  textAlign: "center",
                  backgroundColor: "#f5f5f5",
                  borderRadius: 3,
                  mt: 2,
                }}
              >
                <Route color="disabled" sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Route Calculation Pending
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Enter your **Departure** and **Arrival** locations, then click **Calculate Route & Price** to see final trip costs and book a vehicle.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {products.map((car) => (
                  <Grid item xs={12} sm={6} key={car._id}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    >
                      {car.images.length > 0 && (
                        <CardMedia
                          component="img"
                          height="180"
                          image={`http://localhost:8000/uploads/${car.images[0]}`}
                          alt={car.productName}
                          sx={{ borderTopLeftRadius: 3, borderTopRightRadius: 3 }}
                        />
                      )}
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {car.productName}
                        </Typography>
                        <Typography variant="h5" color="primary" sx={{ my: 1, fontWeight: 700 }}>
                          ${car.price}
                          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                            (Total Est.)
                          </Typography>
                        </Typography>
                        <Button
                          variant="contained"
                          color="secondary"
                          fullWidth
                          component={Link}
                          to={`/${companyName}/book-now?from=${encodeURIComponent(
                            fromLocationName
                          )}&to=${encodeURIComponent(
                            toLocationName
                          )}&price=${car.price}&distance=${distance}&duration=${duration}&company=${companyName}&car=${car.productName}`}
                          sx={{ mt: 1, borderRadius: 2 }}
                        >
                          Book Now
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Mapbox;