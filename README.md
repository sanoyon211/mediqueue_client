# 🎓 MediQueue - Tutor Booking Platform

**Live Site URL:** [https://mediqueue-booking.vercel.app](https://mediqueue-booking.vercel.app)

MediQueue is a modern, premium, and fully responsive Tutor Booking Web Application built with the **MERN** stack (Next.js, Express.js, MongoDB, Node.js). It allows students to explore, filter, and book experienced tutors, while also enabling tutors to register and manage their tuition slots dynamically.
---
## 🌟 Key Features
### 🔍 Explore & Filter Tutors
- **Real-Time Search:** Search tutors instantly by name or subject.
- **Date-Range Filtering:** Filter available study sessions by custom start and end dates.
- **Tutor Details:** Detailed tutor profile pages showing subject, price, experience, medium of language, and availability.
### 📅 Booking & Slot Management
- **One-Click Booking:** Students can reserve study slots with a specific target date.
- **Automatic Slot Control:** Slots automatically decrement on new bookings and lock when fully booked.
- **Booking Cancellations:** Students can cancel booked sessions, which immediately restores tutor slot availability.
### 👤 Tutor Dashboard (CRUD)
- **Register as Tutor:** Users can create customized tuition listings.
- **Update Listings:** Edit tutor parameters (price, subject, availability, description).
- **Delete Listings:** Cleanly remove slot entries from the active database.
### 🔒 Secure Authentication & Fallbacks
- **JWT Authorization:** Secured private endpoints utilizing JSON Web Tokens on the Express server.
- **Robust Image Fallback:** Built-in client and server-side image check to automatically replace invalid or broken image URLs with premium placeholder avatars.
---
## 🛠️ Tech Stack
- **Frontend:** Next.js (App Router), Tailwind CSS, Framer Motion (Animations), Lucide Icons, Auth Client
- **Backend:** Node.js, Express.js, JSON Web Token (JWT)
- **Database:** MongoDB (Atlas / Native Driver)
---