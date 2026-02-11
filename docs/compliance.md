# UPI X — Compliance & Regulatory Alignment

## Offline Wallet Limits (per NPCI/RBI UPI Lite Guidelines)

| Parameter | Limit |
|-----------|-------|
| Max per offline transaction | ₹2,000 |
| Max offline wallet balance | ₹5,000 |
| Max online wallet balance (min KYC) | ₹10,000 |
| Max online wallet balance (full KYC) | ₹1,00,000 |

## Token Expiry Rules

- Offline digital tokens expire **48 hours** after generation
- Expired tokens are automatically invalidated and funds returned to wallet on sync

## Settlement Window

- Offline transactions must settle within **24 hours** of connectivity restoration
- Failed settlements trigger automatic retry (max 3 attempts) then escalation

## KYC Tiers

| Tier | Document Required | Wallet Limit |
|------|-------------------|--------------|
| Minimum KYC | Mobile number + OTP | ₹10,000 |
| Full KYC | Aadhaar + PAN verification | ₹1,00,000 |

## Data Security Requirements

- **At rest**: AES-256 encryption for all stored sensitive data
- **In transit**: TLS 1.3 for all network communications
- **Token signing**: ECDSA with device-bound private keys
- **PIN storage**: Salted bcrypt hash, never stored in plaintext

## Device Binding

- One active device per wallet at any time
- Device change requires re-authentication via OTP + KYC re-verification
- Device fingerprint includes: hardware ID, OS version, app signature

## Prototype Note

> All external integrations (UPI APIs, Aadhaar eKYC, SMS OTP, NFC hardware) are **simulated with mock APIs** in this prototype. The architecture is designed for drop-in replacement with real providers without UI changes.
