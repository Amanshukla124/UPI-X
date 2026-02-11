

# Phase 0: Foundation and Compliance Alignment

This phase establishes the project foundation -- design system, Capacitor setup, Supabase configuration, and compliance documentation -- before any feature screens are built.

---

## Step 1: Design System Configuration

Update the CSS variables and Tailwind config to match the UPI X brand:

- **Primary**: Deep Blue (#1565C0) -> HSL 207, 90%, 37%
- **Secondary**: Saffron Orange (#FF8F00) -> HSL 34, 100%, 50%
- **Accent/Success**: Green (#2E7D32) -> HSL 125, 46%, 34%
- **Destructive**: Red for errors/failures
- Add custom CSS variables for `--upi-blue`, `--upi-orange`, `--upi-green` for direct use
- Set Inter as the heading font via Google Fonts import
- Update `index.html` title, meta tags, and description to "UPI X"

## Step 2: Capacitor Native App Setup

- Install `@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, `@capacitor/android`
- Initialize Capacitor with `capacitor.config.ts` pointing to the project sandbox preview URL for hot-reload
- App ID: `app.lovable.79a1b22eb2b84b0196c3ddc952dcd983`

## Step 3: Bottom Tab Navigation Shell

Create a mobile app layout with a persistent bottom tab bar:

- **Home** (/) - Dashboard placeholder
- **Scan** (/scan-pay) - QR scanner placeholder
- **Wallet** (/wallet) - Wallet placeholder
- **History** (/history) - Transaction history placeholder
- **Menu** (/menu) - Profile/settings placeholder

Each tab will render a simple placeholder page for now. Routes will be wired in `App.tsx`.

## Step 4: Compliance & Architecture Documentation

Create a `docs/compliance.md` file capturing:

- Offline wallet limits (per NPCI/RBI UPI Lite guidelines): max Rs 2,000 per transaction, max Rs 5,000 wallet balance
- Token expiry rules: offline tokens expire after 48 hours
- Settlement window: offline transactions must settle within 24 hours of connectivity restoration
- KYC tiers: minimum KYC (Rs 10,000 limit), full KYC (Rs 1,00,000 limit)
- Data encryption requirements: AES-256 at rest, TLS 1.3 in transit
- Device binding: one active device per wallet
- Simulated API note: all external integrations are mocked for prototype

## Step 5: Threat Model Documentation

Create `docs/threat-model.md` covering:

- Double-spend prevention: token serial numbers, device-bound tokens, server reconciliation on sync
- Replay attack mitigation: timestamp + nonce in token payload
- Device compromise: tamper detection flags, remote device deactivation
- Man-in-the-middle: TLS pinning (noted for real implementation)
- Custody model: escrow-based -- funds locked in wallet before offline token issuance

---

## Technical Details

### Files Created/Modified

| File | Action |
|------|--------|
| `src/index.css` | Update CSS variables for UPI X color palette |
| `tailwind.config.ts` | Add UPI X custom colors |
| `index.html` | Update title, meta, add Inter font |
| `src/App.tsx` | Add routes for all tab pages |
| `src/components/layout/MobileLayout.tsx` | New -- bottom tab bar layout wrapper |
| `src/components/layout/BottomTabBar.tsx` | New -- tab bar component with 5 tabs |
| `src/pages/Dashboard.tsx` | New -- placeholder |
| `src/pages/ScanPay.tsx` | New -- placeholder |
| `src/pages/Wallet.tsx` | New -- placeholder |
| `src/pages/History.tsx` | New -- placeholder |
| `src/pages/Menu.tsx` | New -- placeholder |
| `capacitor.config.ts` | New -- Capacitor configuration |
| `docs/compliance.md` | New -- regulatory rules and limits |
| `docs/threat-model.md` | New -- security threat model |

### No Backend Changes

Phase 0 is purely frontend foundation and documentation. Supabase setup will begin in Phase 1 when auth is needed.

