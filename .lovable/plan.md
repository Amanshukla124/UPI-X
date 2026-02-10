

# UPI X — Feature-Complete Prototype Plan

## Overview
Build a **feature-complete prototype** of UPI X — a secure mobile payment app for the Indian market — as a **Capacitor native app** with **Supabase backend** and **simulated/mock APIs** for UPI, KYC, NFC, and OTP services.

---

## Phase 1: Foundation & Design System
- Set up Capacitor for native iOS/Android builds
- Configure the **UPI X design system**: Deep Blue (#1565C0) primary, Saffron Orange (#FF8F00) secondary, Green (#2E7D32) accent
- Set up Inter font for headings, system fonts for body
- Build reusable UI components: large touch targets, high-contrast elements, offline indicators, loading states
- Configure Supabase (Lovable Cloud) for auth, database, and storage
- Set up bottom tab navigation (Home, Scan, Wallet, History, Menu) and hamburger menu

## Phase 2: Onboarding & Authentication Flow
- **Splash screen** (`/splash`): Logo, loading animation, connectivity check, auto-redirect logic
- **Onboarding carousel** (`/onboarding`): Swipeable feature introduction cards with skip/next
- **Phone verification** (`/phone-verify`): Phone input with country code (+91 default), simulated OTP send
- **OTP verification** (`/otp-verify`): 6-digit input with auto-focus, countdown timer, resend, simulated verification
- Supabase auth integration for user registration and session management

## Phase 3: KYC & Wallet Setup
- **KYC setup** (`/kyc-setup`): Document type selector (Aadhaar/PAN), camera/gallery upload, simulated document verification with progress tracking
- **Wallet setup** (`/wallet-setup`): Funding source selection (UPI, cards), minimum balance info, regulatory notices
- Store KYC status and wallet configuration in Supabase database

## Phase 4: Dashboard & Core Navigation
- **Main dashboard** (`/dashboard`): Wallet balance card, quick action buttons (Pay/Request), recent transactions list, offline status indicator
- Tutorial overlay for first-time users
- Bottom tab bar navigation fully wired
- Hamburger menu with Profile, Security, Support, Language, Logout

## Phase 5: Payment Flows
- **QR Scanner** (`/scan-pay`): Camera viewfinder with scan overlay, simulated QR decode, manual merchant ID entry, amount input
- **Payment confirmation** (`/payment-confirm`): Merchant details, amount breakdown, payment method selector, PIN/biometric prompt
- **Transaction success** (`/transaction-success`): Animated success state, transaction details, receipt sharing
- **Transaction failed** (`/transaction-failed`): Error messaging, retry button, support shortcut
- Simulated online UPI processing and offline digital token generation

## Phase 6: Wallet Management
- **Wallet page** (`/wallet`): Balance display, transaction history, spending limits, add money and withdrawal options
- **Add money** (`/add-money`): Amount input, funding source selection, fee breakdown, simulated payment processing
- Balance updates and regulatory limit indicators stored in Supabase

## Phase 7: Transaction History
- **History page** (`/history`): Filterable/searchable transaction list with date filters, status badges (completed, pending, failed), pagination
- **Transaction detail** (`/transaction-detail`): Full transaction info, receipt download, dispute option, status timeline
- All transaction data stored and queried from Supabase

## Phase 8: Offline Capabilities
- Service Worker setup for offline-first architecture
- IndexedDB for local transaction and data storage
- Simulated offline token generation and double-spending prevention logic
- Auto-sync mechanism: detect connectivity restoration, queue processing, status updates
- Offline status indicators throughout the app
- Pre-cached help articles and FAQs for offline support

## Phase 9: Profile, Settings & Security
- **Profile** (`/profile`): Photo, personal info, KYC status badges, device management
- **Settings** (`/settings`): Notification preferences, language selection (English/Hindi), biometric toggle, logout
- **Security** (`/security`): PIN change, simulated biometric setup, device list, login history, privacy toggles
- Device binding logic with simulated tamper detection

## Phase 10: Support & Notifications
- **Support page** (`/support`): Expandable FAQ categories, search, simulated live chat widget, contact options
- **Offline help** (`/offline-help`): Pre-cached articles, troubleshooting guides, contact info
- Push notification setup via Capacitor for transaction confirmations, balance alerts, security notifications

## Phase 11: Multi-language & Polish
- Hindi and English language support with language switcher
- Final responsive design polish for various screen sizes
- Accessibility review (contrast ratios, touch targets, screen reader support)
- Performance optimization for low-end devices

---

## Backend (Supabase / Lovable Cloud)
- **Auth**: Phone-based authentication with session management
- **Database tables**: Users, wallets, transactions, KYC documents, devices, support tickets
- **Storage**: KYC document uploads, profile photos
- **Edge Functions**: Simulated UPI processing, token generation/validation, sync processing
- **Row Level Security**: User-scoped data access for all tables

## Key Notes
- All external integrations (UPI, NFC, Aadhaar KYC, SMS OTP) will be **simulated with realistic mock APIs** — ready to swap for real providers later
- NFC and Bluetooth interactions will use **simulated device pairing flows** since web/Capacitor support is limited
- Cryptographic token logic will be implemented with web crypto APIs but with **simulated validation**
- The app is structured so real API providers can be plugged in without UI changes

