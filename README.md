# 🛡️ RESQTAG — QR-Based Emergency Identity System

> **“When the victim cannot speak, ResQTag speaks for them.”**  
> *Quick access to essential emergency information when every second matters.*

---

## 🚨 Project Purpose & Overview
**ResQTag** is an emergency-tech platform engineered to assist first responders, bystanders, and paramedics during road accidents and acute medical distress. When an accident victim is unconscious or unable to communicate, any person can scan the weatherproof ResQTag QR decal (affixed on a helmet, bike fuel tank, or car windshield) or enter a 6-character backup code (e.g., `RQ7K29`) to immediately retrieve life-saving medical identity data and 1-tap dial trusted emergency contacts.

---

## 🚀 Key Features

### 1. 🔒 Zero-Knowledge QR Architecture (Security First)
- **No private or unencrypted medical data is stored inside the physical QR code.**
- The QR contains only a stable, secure identifier string (e.g. `RQ7K29`) pointing to our cloud API.
- **Stable QR Guarantee**: When users update their address, emergency phone numbers, or medications in their dashboard, **the same printed sticker continues working without reprinting**.

### 2. ⚡ Zero-App Public Responder Scanner
- First responders and good samaritans do **not** need to download an app or create an account.
- Scan with any iPhone/Android camera, upload a photo, or manually input the backup code.
- Works across 100% of modern mobile browsers.

### 3. 🩸 Emergency Triage View
- **High-Priority Blood Group Display** (`O+`, `B+`, `AB-`, etc.) for immediate paramedic triage.
- **Critical Allergy Warnings** (e.g. *Penicillin, Peanuts anaphylaxis risk*).
- **Vital Medical Conditions** (e.g. *Asthmatic, Diabetic, Pacemaker*).
- **1-Tap Direct SOS Phone Calls** to Emergency Contacts 1, 2, and 3.
- **National Emergency Dispatch Quick Dials**:
  - 🚑 Ambulance: `108` / `112`
  - 🚓 Police Control: `100` / `112`
  - 🚒 Fire & Rescue: `101`

### 4. 📍 Privacy-Compliant Scan Notification & Audit History
- When a tag is scanned, responders are explicitly asked: *"Share approximate incident location with emergency contacts?"*
- **Strict Privacy**: Responders are never tracked. If location is declined, the event is recorded as *"Location not shared"*.
- Trusted contacts receive a simulated SMS alert:  
  `🚨 RESQTAG ALERT: Rahul Kumar's tag (KA-01-AB-1234) was scanned near Indiranagar, Bengaluru. [View Location]`
- Owner Dashboard records complete audit history of all scan timestamps, locations, and device types.

### 5. 🖨️ Weatherproof QR Sticker Generator
- Printable presets tailored for:
  - **Motorcycle Helmet** (Compact decal)
  - **Bike / Scooter** (Fuel tank decal)
  - **Car Windshield** (Interior tag)
  - **Wallet Emergency ID Card**
- Direct browser print styling with cut-out guidelines.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti |
| **Backend API** | Node.js, Express, TypeScript (TSX), CORS, JSON Data Store |
| **QR Engine** | `qrcode.react` (High-res SVG/Canvas), `html5-qrcode` (Live Camera & File Scanner) |
| **Authentication** | Phone + Safe Demo OTP Verification (`123456`) |
| **Database** | File-backed JSON store (`server/data/store.json`) with mock Supabase/PostgreSQL schema |

---

## 🏁 Quick Start & Running Locally

### Prerequisites
- Node.js (v18+ or v20+)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Full-Stack Application (Backend + Frontend)
```bash
npm run dev
```
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 🧪 Hackathon Demo Fast-Track Walkthrough (60 Seconds)

1. **Preloaded Demo Tag**:
   - Tag ID: `RQT-8829A4`
   - Short Code: `RQ7K29`
   - Profile: **Rahul Kumar** (24 Yrs, Blood `O+`, Vehicle `KA-01-AB-1234`)
   - Safe Demo OTP: `123456`

2. **Step-by-Step Flow for Evaluators**:
   - **Step 1: Open Dashboard / Preloaded Profile**  
     Click **`⚡ Try Demo`** or **`Load Profile (Rahul)`** in the top banner.
   - **Step 2: Check QR Stickers**  
     Navigate to **`My QR & Stickers`** or **`Print Stickers`** to inspect the printable helmet/bike decals.
   - **Step 3: Simulate Incident**  
     Click **`🔥 Simulate Incident`** in the top banner.
   - **Step 4: Public Responder Screen**  
     Watch the emergency profile load with blood group `O+`, allergy warnings, 1-tap call buttons, and explicit location consent.
   - **Step 5: Trusted Contact Alert**  
     Observe the live SMS notification toast received by Rahul's family (`Ramesh Kumar`).
   - **Step 6: Update Profile & Verify Stable QR**  
     Edit Rahul's medical notes in the dashboard — the same QR code (`RQ7K29`) continues resolving the updated data!

---

## ⚖️ Disclaimer
> ResQTag provides emergency information and communication support. It does not replace professional medical assessment, hospital emergency triage, or official emergency services dispatch.
