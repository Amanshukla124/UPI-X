import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileCheck, Camera, Upload, CheckCircle2, AlertCircle } from "lucide-react";

type DocType = "aadhaar" | "pan";
type UploadState = "idle" | "uploading" | "verifying" | "verified" | "error";

const KycSetup = () => {
  const { completeKyc } = useAuth();
  const [selectedDoc, setSelectedDoc] = useState<DocType | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");

  const simulateUpload = () => {
    if (!selectedDoc) return;
    setUploadState("uploading");
    setTimeout(() => {
      setUploadState("verifying");
      setTimeout(() => {
        setUploadState("verified");
      }, 1500);
    }, 1200);
  };

  const docOptions: { type: DocType; label: string; desc: string }[] = [
    { type: "aadhaar", label: "Aadhaar Card", desc: "12-digit identity number issued by UIDAI" },
    { type: "pan", label: "PAN Card", desc: "Permanent Account Number for tax purposes" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col safe-top">
      <div className="flex-1 flex flex-col px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">KYC Verification</h1>
              <p className="text-sm text-muted-foreground">Verify your identity to unlock full features</p>
            </div>
          </div>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`h-1.5 flex-1 rounded-full ${selectedDoc ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-1.5 flex-1 rounded-full ${uploadState !== "idle" ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-1.5 flex-1 rounded-full ${uploadState === "verified" ? "bg-primary" : "bg-muted"}`} />
        </div>

        {/* Document selection */}
        <AnimatePresence mode="wait">
          {uploadState === "idle" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-3"
            >
              <p className="text-sm font-medium text-muted-foreground mb-1">Select document type</p>
              {docOptions.map((doc) => (
                <Card
                  key={doc.type}
                  className={`cursor-pointer transition-all border-2 ${
                    selectedDoc === doc.type
                      ? "border-primary bg-primary/5"
                      : "border-transparent hover:border-muted-foreground/20"
                  }`}
                  onClick={() => setSelectedDoc(doc.type)}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <FileCheck className={`h-6 w-6 ${selectedDoc === doc.type ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="flex-1">
                      <p className="font-semibold">{doc.label}</p>
                      <p className="text-xs text-muted-foreground">{doc.desc}</p>
                    </div>
                    {selectedDoc === doc.type && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </CardContent>
                </Card>
              ))}

              {selectedDoc && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex flex-col gap-3">
                  <p className="text-sm font-medium text-muted-foreground">Upload document</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-20 flex-col gap-2" onClick={simulateUpload}>
                      <Camera className="h-5 w-5" />
                      <span className="text-xs">Take Photo</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2" onClick={simulateUpload}>
                      <Upload className="h-5 w-5" />
                      <span className="text-xs">Upload File</span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {(uploadState === "uploading" || uploadState === "verifying") && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-4"
            >
              <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <p className="text-lg font-semibold">
                {uploadState === "uploading" ? "Uploading document..." : "Verifying identity..."}
              </p>
              <p className="text-sm text-muted-foreground">This is a simulated verification</p>
            </motion.div>
          )}

          {uploadState === "verified" && (
            <motion.div
              key="verified"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-4"
            >
              <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-accent" />
              </div>
              <p className="text-xl font-bold">Identity Verified</p>
              <p className="text-sm text-muted-foreground text-center">
                Your {selectedDoc === "aadhaar" ? "Aadhaar" : "PAN"} has been verified successfully.
                <br />Full KYC unlocks up to ₹1,00,000 wallet limit.
              </p>
            </motion.div>
          )}

          {uploadState === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-4"
            >
              <AlertCircle className="h-12 w-12 text-destructive" />
              <p className="text-lg font-semibold">Verification Failed</p>
              <Button variant="outline" onClick={() => setUploadState("idle")}>Try Again</Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom action */}
        <div className="mt-auto pt-6">
          {uploadState === "verified" ? (
            <Button className="w-full h-12 text-base font-semibold" onClick={completeKyc}>
              Continue to Wallet Setup
            </Button>
          ) : (
            <Button variant="ghost" className="w-full text-muted-foreground" onClick={completeKyc}>
              Skip for now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KycSetup;
