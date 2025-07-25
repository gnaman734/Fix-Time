import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { API_BASE_URL } from '../App';
import "./AppointmentBooking.css";
import ReviewForm from './ReviewForm';

const defaultTimeSlots = [
  "8:00 AM", "9:00 AM", "10:00 AM",
  "10:30 AM", "11:30 AM", "1:00 PM",
  "2:00 PM", "2:30 PM", "3:30 PM",
  "4:30 PM", "5:30 PM"
];

const AppointmentBooking = ({ serviceId = null }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const preSelectedService = searchParams.get('service');
  const preSelectedServiceId = searchParams.get('serviceId');

  const [dateOptions, setDateOptions] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: preSelectedService || "",
    customerAddress: ""
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [bookedAppointmentId, setBookedAppointmentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serviceSlots, setServiceSlots] = useState(null); // null = not loaded, [] = no slots

  useEffect(() => {
    const generateDates = () => {
      const dates = [];
      const today = new Date();
      for (let i = 0; i < 10; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedDate = `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}`;
        dates.push(formattedDate);
      }
      setDateOptions(dates);
      setSelectedDate(dates[0]);
    };
    generateDates();
  }, []);

  useEffect(() => {
    if (preSelectedService) {
      setFormData(prev => ({ ...prev, reason: preSelectedService }));
    }
  }, [preSelectedService]);

  // Autofill address from user profile if available
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5001/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (res.data?.user?.address) {
            setFormData(prev => ({ ...prev, customerAddress: res.data.user.address }));
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    // Fetch service details if we have an ID
    const id = preSelectedServiceId || serviceId;
    if (id) {
      axios.get(`${API_BASE_URL}/services/${id}`)
        .then(res => {
          const slots = res.data?.service?.timeSlots;
          if (Array.isArray(slots) && slots.length > 0) {
            setServiceSlots(slots);
          } else {
            setServiceSlots([]); // explicitly no slots
          }
        })
        .catch(() => setServiceSlots([]));
    } else {
      setServiceSlots([]);
    }
  }, [preSelectedServiceId, serviceId]);

  // Use serviceSlots if loaded and non-empty, else defaultTimeSlots
  const timeSlots = (serviceSlots && serviceSlots.length > 0) ? serviceSlots : defaultTimeSlots;

  // Helper to format time to 12-hour with AM/PM
  function formatTime12h(timeStr) {
    // If already in 12-hour format with AM/PM, return as is
    if (/am|pm|AM|PM/.test(timeStr)) return timeStr;
    // If in HH:MM format, convert
    const [h, m] = timeStr.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return timeStr;
    let hour = h % 12;
    if (hour === 0) hour = 12;
    const ampm = h < 12 ? "AM" : "PM";
    return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePhone = (phone) => {
    return /^\d{10,15}$/.test(phone.replace(/\D/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert("Please select both a date and time for your appointment");
      return;
    }
    const phoneToUse = formData.phone.trim();
    if (!validatePhone(phoneToUse)) {
      alert("Please enter a valid phone number (at least 10 digits)");
      return;
    }
    if (!formData.customerAddress.trim()) {
      alert("Please enter your address");
      return;
    }
    const [dayName, monthStr, dayNum] = selectedDate.replace(',', '').split(' ');
    const year = new Date().getFullYear();
    const months = { "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5, "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11 };
    const appointmentDate = new Date(year, months[monthStr], parseInt(dayNum));
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("You must be logged in to book an appointment");
        navigate('/login');
        return;
      }
      const userResponse = await axios.get('http://localhost:5001/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!userResponse.data || !userResponse.data.success || !userResponse.data.user) {
        throw new Error("Could not fetch user profile");
      }
      const user = userResponse.data.user;
      const effectiveServiceId = preSelectedServiceId || serviceId;
      let finalServiceId = effectiveServiceId;

      if (!finalServiceId && preSelectedService) {
        try {
          const servicesResponse = await axios.get('http://localhost:5001/services', {
            params: { name: preSelectedService }
          });
          if (servicesResponse.data?.services?.length > 0) {
            finalServiceId = servicesResponse.data.services[0]._id;
          }
        } catch (err) {
          console.error("Error finding service by name:", err);
        }
      }
      if (!finalServiceId) {
        const servicesResponse = await axios.get('http://localhost:5001/services');
        if (servicesResponse.data?.services?.length > 0) {
          finalServiceId = servicesResponse.data.services[0]._id;
        }
      }
      if (!finalServiceId) {
        throw new Error("No service ID available for booking");
      }
      const appointmentData = {
        serviceId: finalServiceId,
        date: appointmentDate.toISOString(),
        time: selectedTime,
        notes: formData.reason,
        customerName: formData.name || user.name,
        customerEmail: formData.email || user.email,
        customerPhone: phoneToUse,
        customerAddress: formData.customerAddress.trim()
      };
      const response = await axios.post(
        'http://localhost:5001/appointments',
        appointmentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data?.success) {
        setBookedAppointmentId(response.data.appointment._id);
        setBookedSlots([...bookedSlots, { date: selectedDate, time: selectedTime }]);
        alert(`✅ Appointment booked successfully on ${selectedDate} at ${selectedTime}`);
        navigate('/calendar');
      } else {
        throw new Error(response.data?.message || "Failed to book appointment");
      }
    } catch (err) {
      alert(`Failed to book appointment: ${err.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const isSlotDisabled = (date, time) => {
    const now = new Date();
    const [dayName, monthStr, dayNum] = date.replace(',', '').split(' ');
    const year = new Date().getFullYear();
    const fullDateStr = `${monthStr} ${dayNum}, ${year} ${time}`;
    const slotDateTime = new Date(fullDateStr);
    const isPast = slotDateTime < now;
    const isBooked = bookedSlots.some(b => b.date === date && b.time === time);
    return isPast || isBooked;
  };

  // ✅ Added Function: Check if ALL future slots are in the past
  const isAllFutureSlotsPast = () => {
    return dateOptions.every(date =>
      timeSlots.every(time => isSlotDisabled(date, time))
    );
  };

  const handleReviewSubmitted = (review) => {
    setTimeout(() => {
      alert('Thank you for your review! Your feedback is valuable to us.');
      setShowReviewForm(false);
    }, 2000);
  };

  if (showReviewForm) {
    return (
      <div className="booking-container">
        <h2>Thank You for Booking!</h2>
        <p className="booking-success-message">
          Your appointment has been confirmed. We look forward to serving you!
        </p>
        <div className="review-form-wrapper">
          <ReviewForm appointmentId={bookedAppointmentId} onReviewSubmitted={handleReviewSubmitted} />
        </div>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <h2>Book Your Appointment!</h2>
      {preSelectedService && (
        <div className="selected-service">
          <span>Service: </span>
          <strong>{preSelectedService}</strong>
        </div>
      )}

      <h4 className="section-heading">📅 Select a Date</h4>
      <div className="date-selector">
        {dateOptions.map((date) => (
          <button
            key={date}
            className={`date-button ${selectedDate === date ? "selected" : ""}`}
            onClick={() => setSelectedDate(date)}
          >
            {date}
          </button>
        ))}
      </div>

      <h4 className="section-heading">⏰ Select a Time Slot</h4>
      <div className="time-selector">
        {timeSlots.map((slot) => {
          const disabled = isSlotDisabled(selectedDate, slot);
          return (
            <button
              key={slot}
              className={`time-button ${selectedTime === slot ? "selected" : ""}`}
              onClick={() => !disabled && setSelectedTime(slot)}
              disabled={disabled}
              style={{
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? "not-allowed" : "pointer"
              }}
            >
              {formatTime12h(slot)}
            </button>
          );
        })}
      </div>

      <form className="form-fields" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Full Name"
            onChange={handleChange}
            value={formData.name}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            value={formData.email}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            value={formData.phone}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="customerAddress">Address:</label>
          <textarea
            id="customerAddress"
            name="customerAddress"
            placeholder="Enter your Address"
            rows={3}
            onChange={handleChange}
            value={formData.customerAddress}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reason">Enter your reason for Visit:</label>
          <textarea
            id="reason"
            name="reason"
            placeholder="Reason for Visit"
            rows={3}
            onChange={handleChange}
            value={formData.reason}
            required
          />
        </div>

        {isAllFutureSlotsPast() && (
          <p style={{ color: 'red', fontWeight: 'bold' }}>
            ⚠️ All available slots for the next 10 days have passed or are fully booked.
          </p>
        )}

        <button className="confirm-button" type="submit" disabled={loading || isAllFutureSlotsPast()}>
          {loading ? "Booking..." : "Confirm Appointment"}
        </button>
      </form>
    </div>
  );
};

export default AppointmentBooking;
