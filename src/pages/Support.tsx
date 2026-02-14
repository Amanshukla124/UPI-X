import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, MessageCircle, WifiOff, ChevronDown, ChevronUp, Phone, Mail, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/contexts/I18nContext";
import { useConnectivity } from "@/hooks/useConnectivity";

const Support = () => {
  const { t } = useI18n();
  const { isOnline } = useConnectivity();
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Hi! How can I help you today? Ask me about payments, wallet, or offline features." },
  ]);
  const [chatInput, setChatInput] = useState("");

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
    { q: t("faq.q6"), a: t("faq.a6") },
  ];

  const filteredFaqs = search
    ? faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
    : faqs;

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");

    // Simulated bot response
    setTimeout(() => {
      const responses = [
        "I understand your concern. Let me check that for you.",
        "For offline payment issues, try syncing when you're back online. Go to Dashboard → Sync Now.",
        "Your wallet balance updates in real-time. If you see a discrepancy, try refreshing the app.",
        "Transaction limits are ₹2,000 per offline payment and ₹5,000 total offline balance.",
        "If a token transfer failed, the funds remain in your wallet. You can retry the payment.",
        "For KYC-related queries, please visit Profile → KYC Status in the Menu section.",
      ];
      const reply = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [...prev, { role: "bot", text: reply }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col p-4 gap-4">
      <header className="pt-2">
        <h1 className="text-2xl font-bold">{t("support.title")}</h1>
      </header>

      {/* Offline indicator */}
      {!isOnline && (
        <div className="flex items-center gap-2 rounded-xl bg-secondary/10 border border-secondary p-3 text-sm">
          <WifiOff className="h-4 w-4 text-secondary" />
          <span className="text-muted-foreground">{t("support.offline_help")} — FAQs available offline</span>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <HelpCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("common.search") + "…"}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* FAQ Section */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          {t("support.faq")}
        </h2>
        {filteredFaqs.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No matching questions found</p>
        ) : (
          filteredFaqs.map((faq, i) => (
            <button
              key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full text-left rounded-xl border border-border bg-card p-4 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium pr-2">{faq.q}</span>
                {openFaq === i ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </div>
              {openFaq === i && (
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{faq.a}</p>
              )}
            </button>
          ))
        )}
      </section>

      {/* Contact Info */}
      <section className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h2 className="text-sm font-semibold">{t("support.contact")}</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{t("support.email")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{t("support.phone")}</span>
        </div>
      </section>

      {/* Live Chat */}
      {isOnline && (
        <section>
          {!chatOpen ? (
            <Button onClick={() => setChatOpen(true)} className="w-full gap-2">
              <MessageCircle className="h-4 w-4" />
              {t("support.live_chat")}
            </Button>
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="bg-primary p-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-primary-foreground">{t("support.live_chat")}</span>
                <button onClick={() => setChatOpen(false)} className="text-xs text-primary-foreground/80">✕</button>
              </div>
              <div className="h-48 overflow-y-auto p-3 space-y-2">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border p-2 flex gap-2">
                <Input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSendChat()}
                  placeholder="Type a message…"
                  className="h-9 text-sm"
                />
                <Button size="sm" onClick={handleSendChat} disabled={!chatInput.trim()}>
                  Send
                </Button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Support;
