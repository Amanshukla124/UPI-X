# UPI X — Security Threat Model

## 1. Double-Spend Prevention

**Threat**: A user generates an offline token and attempts to spend it at multiple merchants before syncing.

**Mitigations**:
- Each token has a unique serial number bound to the issuing device
- Tokens are signed with a device-bound private key (non-exportable via Web Crypto API)
- Local token registry tracks spent tokens in IndexedDB — tokens are marked spent immediately on device
- Server reconciliation on sync validates token serial uniqueness across all merchants
- Duplicate token submissions result in transaction reversal and account flagging

## 2. Replay Attack Mitigation

**Threat**: An attacker intercepts a token transmission (NFC/Bluetooth) and replays it.

**Mitigations**:
- Every token payload includes a timestamp and cryptographic nonce
- Tokens include a one-time challenge from the receiving device
- Tokens older than 48 hours are automatically rejected
- Merchant devices maintain a local nonce cache to reject duplicates

## 3. Device Compromise

**Threat**: A rooted/jailbroken device extracts wallet keys or token data.

**Mitigations**:
- Tamper detection flags: check for root/jailbreak indicators on app launch
- Private keys stored in platform secure enclave (Keychain/Keystore) via Capacitor
- Remote device deactivation: server can revoke device binding instantly
- Offline wallet balance frozen on tamper detection until re-verification

## 4. Man-in-the-Middle (MITM)

**Threat**: Attacker intercepts NFC/Bluetooth communication between devices.

**Mitigations**:
- End-to-end encryption for all device-to-device communication
- Certificate/TLS pinning for all server communications (noted for production)
- NFC transactions use short-range proximity as physical security layer
- Bluetooth connections use authenticated pairing with ECDH key exchange

## 5. Custody Model

**Model**: Escrow-based

- Funds are **locked in the wallet** before any offline token is issued
- Wallet balance is reduced at token generation time (not at settlement)
- If token expires unused, funds are automatically released back to wallet
- Settlement confirms the already-deducted amount to the merchant's account
- This prevents over-spending and ensures funds are always backed

## 6. Data at Rest

**Threat**: Physical device access exposes sensitive data.

**Mitigations**:
- All IndexedDB data encrypted with AES-256 using device-derived key
- PIN/biometric required to access app after background timeout (configurable)
- Transaction history contains no raw token data — only settlement references
- KYC documents stored server-side only; device stores only verification status
