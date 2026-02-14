import React, { createContext, useContext, useState, useCallback } from "react";

export type Language = "en" | "hi";

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    "app.name": "UPI X",
    "common.back": "Back",
    "common.continue": "Continue",
    "common.done": "Done",
    "common.retry": "Retry",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.online": "Online",
    "common.offline": "Offline",
    "common.amount": "Amount",
    "common.status": "Status",
    "common.search": "Search",

    // Dashboard
    "dashboard.greeting": "Good morning",
    "dashboard.balance": "Wallet Balance",
    "dashboard.pending_settlement": "pending offline settlement",
    "dashboard.scan_pay": "Scan & Pay",
    "dashboard.send": "Send",
    "dashboard.add_money": "Add Money",
    "dashboard.pay_offline": "Pay Offline",
    "dashboard.recent": "Recent Transactions",
    "dashboard.no_transactions": "No transactions yet",
    "dashboard.view_all": "View All",
    "dashboard.sync_now": "Sync Now",
    "dashboard.syncing": "Syncing…",
    "dashboard.syncing_payments": "Syncing offline payments…",
    "dashboard.sync_complete": "Sync Complete",
    "dashboard.settled": "settled",
    "dashboard.failed": "failed",
    "dashboard.expired": "expired",
    "dashboard.ready_settle": "Ready to settle",
    "dashboard.will_auto_sync": "Will auto-sync when you're back online",
    "dashboard.offline_payments": "offline payment",
    "dashboard.offline_payments_plural": "offline payments",
    "dashboard.pending_payments": "pending payment",
    "dashboard.pending_payments_plural": "pending payments",

    // Wallet
    "wallet.title": "Wallet",
    "wallet.available": "Available Balance",
    "wallet.add_money": "Add Money to Wallet",
    "wallet.limits": "Limits",
    "wallet.per_txn": "Per transaction (offline)",
    "wallet.offline_cap": "Offline wallet cap",
    "wallet.offline_used": "Offline balance used",
    "wallet.recent_activity": "Recent Activity",
    "wallet.no_activity": "No activity yet",
    "wallet.pending_tokens": "Pending Offline Tokens",
    "wallet.awaiting_settlement": "awaiting settlement",
    "wallet.locked_amount": "Locked amount",

    // History
    "history.title": "Transaction History",
    "history.search_placeholder": "Search by merchant or ID…",
    "history.all": "All",
    "history.completed": "Completed",
    "history.pending": "Pending",
    "history.failed": "Failed",
    "history.no_transactions": "No transactions yet",
    "history.no_match": "No matching transactions",

    // Scan & Pay
    "scan.title": "Scan & Pay",
    "scan.scanning": "Point camera at QR code",
    "scan.manual": "Or select merchant",
    "scan.enter_amount": "Enter Amount",
    "scan.max_txn": "Max ₹2,000 per transaction",

    // Offline Pay
    "offline.title": "Offline Payment",
    "offline.select_merchant": "Select merchant to pay offline",
    "offline.choose_method": "Choose transfer method",
    "offline.nfc_tap": "NFC Tap",
    "offline.hold_near": "Hold near terminal",
    "offline.bluetooth": "Bluetooth",
    "offline.nearby_pairing": "Nearby pairing",
    "offline.pay_offline": "Pay Offline",
    "offline.token_delivered": "Token Delivered!",
    "offline.token_sent": "Payment token sent. It will settle when you're back online.",
    "offline.pending_settlement": "Pending Settlement",
    "offline.transfer_failed": "Transfer Failed",
    "offline.token_remains": "Token was generated but delivery failed. It remains in your wallet for retry.",

    // Menu
    "menu.title": "Menu",
    "menu.profile": "Profile",
    "menu.profile_desc": "Manage your account",
    "menu.security": "Security",
    "menu.security_desc": "PIN, biometrics, devices",
    "menu.support": "Support",
    "menu.support_desc": "Help & FAQs",
    "menu.language": "Language",
    "menu.language_desc": "English",
    "menu.logout": "Log Out",

    // Support
    "support.title": "Help & Support",
    "support.faq": "Frequently Asked Questions",
    "support.live_chat": "Live Chat",
    "support.chat_available": "Available when online",
    "support.offline_help": "Offline Help",
    "support.troubleshooting": "Troubleshooting",
    "support.contact": "Contact Us",
    "support.email": "Email: support@upix.app",
    "support.phone": "Phone: 1800-XXX-XXXX",

    // FAQ
    "faq.q1": "How do offline payments work?",
    "faq.a1": "UPI X generates a secure digital token that's transferred to the merchant via NFC or Bluetooth. The token is settled when you're back online, within 24 hours.",
    "faq.q2": "What are the transaction limits?",
    "faq.a2": "Maximum ₹2,000 per offline transaction. Total offline balance cannot exceed ₹5,000. Online wallet limit depends on KYC level.",
    "faq.q3": "What if my offline payment fails to settle?",
    "faq.a3": "The system retries up to 3 times with exponential backoff. If settlement fails, funds are automatically refunded to your wallet.",
    "faq.q4": "How secure are offline tokens?",
    "faq.a4": "Tokens are device-bound, time-limited (48h), and cryptographically signed using SHA-256. Double-spending is prevented via serial number tracking.",
    "faq.q5": "How do I add money to my wallet?",
    "faq.a5": "Go to Wallet → Add Money. You can fund via UPI, debit card, or credit card. Maximum ₹10,000 per top-up (minimum KYC).",
    "faq.q6": "What happens when tokens expire?",
    "faq.a6": "Tokens expire after 48 hours. Expired tokens are automatically invalidated and funds are refunded to your wallet during the next sync.",

    // Language
    "lang.title": "Language",
    "lang.select": "Select your preferred language",
    "lang.english": "English",
    "lang.hindi": "हिंदी (Hindi)",
    "lang.changed": "Language changed",
  },
  hi: {
    // Common
    "app.name": "UPI X",
    "common.back": "वापस",
    "common.continue": "जारी रखें",
    "common.done": "हो गया",
    "common.retry": "पुन: प्रयास",
    "common.cancel": "रद्द करें",
    "common.save": "सहेजें",
    "common.online": "ऑनलाइन",
    "common.offline": "ऑफ़लाइन",
    "common.amount": "राशि",
    "common.status": "स्थिति",
    "common.search": "खोजें",

    // Dashboard
    "dashboard.greeting": "सुप्रभात",
    "dashboard.balance": "वॉलेट बैलेंस",
    "dashboard.pending_settlement": "ऑफ़लाइन सेटलमेंट बाकी",
    "dashboard.scan_pay": "स्कैन और भुगतान",
    "dashboard.send": "भेजें",
    "dashboard.add_money": "पैसे जोड़ें",
    "dashboard.pay_offline": "ऑफ़लाइन भुगतान",
    "dashboard.recent": "हालिया लेनदेन",
    "dashboard.no_transactions": "अभी तक कोई लेनदेन नहीं",
    "dashboard.view_all": "सभी देखें",
    "dashboard.sync_now": "अभी सिंक करें",
    "dashboard.syncing": "सिंक हो रहा है…",
    "dashboard.syncing_payments": "ऑफ़लाइन भुगतान सिंक हो रहे हैं…",
    "dashboard.sync_complete": "सिंक पूरा",
    "dashboard.settled": "सेटल हुए",
    "dashboard.failed": "विफल",
    "dashboard.expired": "समाप्त",
    "dashboard.ready_settle": "सेटल के लिए तैयार",
    "dashboard.will_auto_sync": "ऑनलाइन आने पर ऑटो-सिंक होगा",
    "dashboard.offline_payments": "ऑफ़लाइन भुगतान",
    "dashboard.offline_payments_plural": "ऑफ़लाइन भुगतान",
    "dashboard.pending_payments": "लंबित भुगतान",
    "dashboard.pending_payments_plural": "लंबित भुगतान",

    // Wallet
    "wallet.title": "वॉलेट",
    "wallet.available": "उपलब्ध बैलेंस",
    "wallet.add_money": "वॉलेट में पैसे जोड़ें",
    "wallet.limits": "सीमाएं",
    "wallet.per_txn": "प्रति लेनदेन (ऑफ़लाइन)",
    "wallet.offline_cap": "ऑफ़लाइन वॉलेट सीमा",
    "wallet.offline_used": "ऑफ़लाइन बैलेंस उपयोग",
    "wallet.recent_activity": "हालिया गतिविधि",
    "wallet.no_activity": "अभी तक कोई गतिविधि नहीं",
    "wallet.pending_tokens": "लंबित ऑफ़लाइन टोकन",
    "wallet.awaiting_settlement": "सेटलमेंट की प्रतीक्षा",
    "wallet.locked_amount": "लॉक राशि",

    // History
    "history.title": "लेनदेन इतिहास",
    "history.search_placeholder": "व्यापारी या ID से खोजें…",
    "history.all": "सभी",
    "history.completed": "पूर्ण",
    "history.pending": "लंबित",
    "history.failed": "विफल",
    "history.no_transactions": "अभी तक कोई लेनदेन नहीं",
    "history.no_match": "कोई मिलान लेनदेन नहीं",

    // Scan & Pay
    "scan.title": "स्कैन और भुगतान",
    "scan.scanning": "QR कोड पर कैमरा रखें",
    "scan.manual": "या व्यापारी चुनें",
    "scan.enter_amount": "राशि दर्ज करें",
    "scan.max_txn": "अधिकतम ₹2,000 प्रति लेनदेन",

    // Offline Pay
    "offline.title": "ऑफ़लाइन भुगतान",
    "offline.select_merchant": "ऑफ़लाइन भुगतान के लिए व्यापारी चुनें",
    "offline.choose_method": "ट्रांसफ़र विधि चुनें",
    "offline.nfc_tap": "NFC टैप",
    "offline.hold_near": "टर्मिनल के पास रखें",
    "offline.bluetooth": "ब्लूटूथ",
    "offline.nearby_pairing": "नज़दीकी पेयरिंग",
    "offline.pay_offline": "ऑफ़लाइन भुगतान करें",
    "offline.token_delivered": "टोकन पहुंच गया!",
    "offline.token_sent": "भुगतान टोकन भेजा गया। ऑनलाइन आने पर सेटल होगा।",
    "offline.pending_settlement": "सेटलमेंट लंबित",
    "offline.transfer_failed": "ट्रांसफ़र विफल",
    "offline.token_remains": "टोकन बना लेकिन डिलीवरी विफल। पुन: प्रयास के लिए वॉलेट में है।",

    // Menu
    "menu.title": "मेन्यू",
    "menu.profile": "प्रोफ़ाइल",
    "menu.profile_desc": "अपना खाता प्रबंधित करें",
    "menu.security": "सुरक्षा",
    "menu.security_desc": "PIN, बायोमेट्रिक्स, डिवाइस",
    "menu.support": "सहायता",
    "menu.support_desc": "मदद और FAQ",
    "menu.language": "भाषा",
    "menu.language_desc": "हिंदी",
    "menu.logout": "लॉग आउट",

    // Support
    "support.title": "सहायता और समर्थन",
    "support.faq": "अक्सर पूछे जाने वाले प्रश्न",
    "support.live_chat": "लाइव चैट",
    "support.chat_available": "ऑनलाइन होने पर उपलब्ध",
    "support.offline_help": "ऑफ़लाइन सहायता",
    "support.troubleshooting": "समस्या निवारण",
    "support.contact": "संपर्क करें",
    "support.email": "ईमेल: support@upix.app",
    "support.phone": "फ़ोन: 1800-XXX-XXXX",

    // FAQ
    "faq.q1": "ऑफ़लाइन भुगतान कैसे काम करता है?",
    "faq.a1": "UPI X एक सुरक्षित डिजिटल टोकन बनाता है जो NFC या ब्लूटूथ से व्यापारी को भेजा जाता है। ऑनलाइन आने पर 24 घंटे में सेटल होता है।",
    "faq.q2": "लेनदेन की सीमाएं क्या हैं?",
    "faq.a2": "अधिकतम ₹2,000 प्रति ऑफ़लाइन लेनदेन। कुल ऑफ़लाइन बैलेंस ₹5,000 से अधिक नहीं। ऑनलाइन सीमा KYC स्तर पर निर्भर।",
    "faq.q3": "अगर ऑफ़लाइन भुगतान सेटल नहीं होता तो?",
    "faq.a3": "सिस्टम 3 बार तक पुन: प्रयास करता है। विफल होने पर राशि स्वचालित रूप से वॉलेट में वापस आ जाती है।",
    "faq.q4": "ऑफ़लाइन टोकन कितने सुरक्षित हैं?",
    "faq.a4": "टोकन डिवाइस-बाउंड, समय-सीमित (48 घंटे), और SHA-256 से हस्ताक्षरित हैं। सीरियल नंबर ट्रैकिंग से डबल-स्पेंडिंग रोकी जाती है।",
    "faq.q5": "वॉलेट में पैसे कैसे जोड़ें?",
    "faq.a5": "वॉलेट → पैसे जोड़ें पर जाएं। UPI, डेबिट कार्ड, या क्रेडिट कार्ड से फंड कर सकते हैं। अधिकतम ₹10,000 (न्यूनतम KYC)।",
    "faq.q6": "टोकन समाप्त होने पर क्या होता है?",
    "faq.a6": "टोकन 48 घंटे बाद समाप्त होते हैं। समाप्त टोकन स्वचालित रूप से अमान्य होते हैं और अगले सिंक में राशि वापस आती है।",

    // Language
    "lang.title": "भाषा",
    "lang.select": "अपनी पसंदीदा भाषा चुनें",
    "lang.english": "English (अंग्रेज़ी)",
    "lang.hindi": "हिंदी",
    "lang.changed": "भाषा बदली गई",
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("upix_lang");
    return (saved === "hi" ? "hi" : "en") as Language;
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("upix_lang", lang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
