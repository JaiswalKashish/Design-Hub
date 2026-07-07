import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CreditCard, Building2, Globe, AlertCircle, Loader2, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Inline fallback data for instant results — also shown while API loads
const DOCUMENT_DATA: Record<string, {
  requiredDocuments: string[];
  fees: string;
  processingTime: string;
  offlineOffice: string;
  onlinePortal: string;
  official_portal: string | null;
  importantNotes: string[];
}> = {
  "Passport": {
    requiredDocuments: ["Aadhaar Card", "Birth Certificate", "PAN Card", "Address Proof", "Passport-size Photographs (2)", "Application Form (Form-1)"],
    fees: "₹1,500 (36-page) / ₹2,000 (60-page) for adults. Tatkal: ₹2,000 extra",
    processingTime: "3–4 weeks (normal) / 1–3 days (Tatkal)",
    offlineOffice: "Passport Seva Kendra (PSK) / District Passport Cell",
    onlinePortal: "https://portal2.passportindia.gov.in/",
    official_portal: "https://www.passportindia.gov.in/",
    importantNotes: [
      "Book appointment online first — walk-ins not accepted at most PSKs",
      "Carry all originals plus self-attested photocopies",
      "Police verification is mandatory for fresh passports",
      "Tatkal passport is available for urgent travel needs",
      "Do NOT use touts or agents — apply only on official portal",
    ],
  },
  "PAN Card": {
    requiredDocuments: ["Aadhaar Card", "Identity Proof (Voter ID / Passport)", "Address Proof", "Date of Birth Proof", "Photograph"],
    fees: "₹107 (physical PAN, Indian address) / ₹1,017 (foreign address) / Free (e-PAN)",
    processingTime: "15–20 working days (physical) / Instant (e-PAN)",
    offlineOffice: "NSDL / UTIITSL facilitation centres",
    onlinePortal: "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
    official_portal: "https://www.onlineservices.nsdl.com/",
    importantNotes: [
      "e-PAN is free and delivered instantly to your email if Aadhaar is linked to mobile",
      "One PAN per person — having two PANs is a punishable offence",
      "Required for income tax filing, financial transactions above ₹50,000",
      "Update details at NSDL or UTIITSL in case of name/address change",
      "PAN-Aadhaar linking is mandatory — deadline extended to 31 May 2024",
    ],
  },
  "Driving License": {
    requiredDocuments: ["Aadhaar Card", "Address Proof", "Age Proof (Birth Certificate)", "Passport-size Photographs (6)", "Learner's License (if applicable)", "Form 4 / Form 6"],
    fees: "₹200 (Learner's License) / ₹300 (Driving License) / ₹150 (Renewal). Varies by state",
    processingTime: "Learner's License: Same day | Driving License: 15–30 days after passing test",
    offlineOffice: "Regional Transport Office (RTO)",
    onlinePortal: "https://parivahan.gov.in/parivahan/",
    official_portal: "https://parivahan.gov.in/",
    importantNotes: [
      "First obtain a Learner's License; apply for DL after 30 days",
      "Must pass a driving skill test at the RTO",
      "International Driving Permit (IDP) can be obtained at your RTO",
      "Renew DL at least 1 month before expiry",
      "Driving without a valid license is punishable with a fine of ₹5,000",
    ],
  },
  "Voter ID": {
    requiredDocuments: ["Identity Proof (Aadhaar / PAN)", "Address Proof", "Age Proof", "Passport-size Photograph", "Form 6 (for new registration)"],
    fees: "Free of cost",
    processingTime: "15–30 days after verification",
    offlineOffice: "Electoral Registration Officer (ERO) / BLO Office",
    onlinePortal: "https://voters.eci.gov.in/",
    official_portal: "https://voters.eci.gov.in/",
    importantNotes: [
      "Must be an Indian citizen aged 18 or above",
      "Enrol using Form 6 on the voter portal",
      "Download e-EPIC (digital voter card) from voters.eci.gov.in",
      "Update your address by submitting Form 8A",
      "Check your name in the electoral roll on the same portal",
    ],
  },
  "Aadhaar": {
    requiredDocuments: ["Proof of Identity (any govt ID)", "Proof of Address", "Proof of Date of Birth (Birth Cert / Marksheet)", "Photograph (taken at centre)"],
    fees: "Free for first enrolment | ₹50 for updates",
    processingTime: "Aadhaar generated within 90 days of enrolment",
    offlineOffice: "Aadhaar Enrolment Centre (Post Offices, Banks, CSCs)",
    onlinePortal: "https://uidai.gov.in/",
    official_portal: "https://uidai.gov.in/",
    importantNotes: [
      "Biometrics (fingerprint, iris, photo) are captured at the centre",
      "Download e-Aadhaar (PDF) from uidai.gov.in anytime",
      "Update name, address, mobile via UIDAI portal or enrolment centre",
      "Link Aadhaar to mobile for OTP-based online services",
      "mAadhaar app available for carrying digital Aadhaar on phone",
    ],
  },
  "Birth Certificate": {
    requiredDocuments: ["Hospital Discharge Summary", "Parents' ID Proof (Aadhaar / PAN)", "Parents' Address Proof", "Affidavit (if delayed registration)", "Application Form"],
    fees: "Usually free within 21 days of birth | ₹5–₹200 for delayed registration (varies by state)",
    processingTime: "7–30 days depending on the municipality",
    offlineOffice: "Municipal Corporation / Gram Panchayat / Registrar of Births & Deaths",
    onlinePortal: "https://crsorgi.gov.in/",
    official_portal: null,
    importantNotes: [
      "Must be registered within 21 days of birth to avoid delays",
      "Portal varies by state — check your state government's e-district portal",
      "Delayed registration (after 1 year) requires a magistrate order",
      "Online corrections/digitisation available in most urban municipalities",
      "Required for school admission, passport, and other government documents",
    ],
  },
  "Income Certificate": {
    requiredDocuments: ["Aadhaar Card", "Ration Card", "Self-declaration of annual income", "Revenue / Patwari's report (rural)", "Salary slip (if employed)", "Application Form"],
    fees: "₹10–₹50 (varies by state). Many states offer it free via e-District portals",
    processingTime: "7–15 working days",
    offlineOffice: "Tehsildar's Office / Revenue Department / Common Service Centre (CSC)",
    onlinePortal: "https://edistrict.gov.in/",
    official_portal: null,
    importantNotes: [
      "Valid for 1 year from date of issue in most states",
      "Required for applying to EWS / OBC / SC/ST reservations",
      "Apply online via your state's e-District portal for faster processing",
      "Rural applicants may need a Patwari (village accountant) certificate",
      "Certificate format and requirements vary from state to state",
    ],
  },
  "Marriage Certificate": {
    requiredDocuments: ["Aadhaar Card of both parties", "Birth Certificates (both)", "Address Proof (both)", "Passport-size Photographs (4 each)", "Two witnesses' Aadhaar", "Application Form"],
    fees: "₹100–₹500 (varies by state and marriage act)",
    processingTime: "15–30 days",
    offlineOffice: "Sub-Registrar Office / Municipal Corporation",
    onlinePortal: "https://edistrict.gov.in/",
    official_portal: null,
    importantNotes: [
      "Can be registered under Hindu Marriage Act or Special Marriage Act",
      "Both parties must appear in person with witnesses",
      "Mandatory for women seeking name change in documents after marriage",
      "Required for spouse visa, joint bank accounts, and insurance claims",
      "Online appointment booking available in many states",
    ],
  },
  "Ration Card": {
    requiredDocuments: ["Aadhaar Card (all family members)", "Address Proof", "Bank Account Details", "Passport-size Photographs (head of family)", "Existing Ration Card (if surrendering)"],
    fees: "Free (below poverty line) | Nominal fee for other categories",
    processingTime: "15–30 days",
    offlineOffice: "State Food & Civil Supplies Department / Tehsildar's Office",
    onlinePortal: "https://nfsa.gov.in/",
    official_portal: null,
    importantNotes: [
      "Ration card type depends on annual income: AAY, BPL, APL, Antyodaya",
      "Required for subsidised food grains under National Food Security Act",
      "Aadhaar seeding of all family members is mandatory",
      "Check NFSA portal for state-wise portals and application links",
      "One Nation One Ration Card (ONORC) allows portability across states",
    ],
  },
};

const DOCUMENT_TYPES = Object.keys(DOCUMENT_DATA);

interface DocInfo {
  documentType: string;
  requiredDocuments: string[];
  fees: string;
  processingTime: string;
  offlineOffice: string;
  onlinePortal: string;
  official_portal: string | null;
  importantNotes: string[];
}

export default function DocumentsPage() {
  const [selectedDoc, setSelectedDoc] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [docInfo, setDocInfo] = useState<DocInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetInfo = async () => {
    if (!selectedDoc) return;

    // Immediately show inline data
    const fallback = DOCUMENT_DATA[selectedDoc];
    if (fallback) {
      setDocInfo({ documentType: selectedDoc, ...fallback });
    }

    // Also fetch from API to get enriched AI data
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/documents/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentType: selectedDoc }),
      });
      if (res.ok) {
        const data = await res.json();
        // Merge API data with fallback, preferring API data but using fallback official_portal if API doesn't have one
        setDocInfo({
          documentType: data.documentType || selectedDoc,
          requiredDocuments: data.requiredDocuments?.length ? data.requiredDocuments : fallback?.requiredDocuments || [],
          fees: data.fees || fallback?.fees || "Contact local office",
          processingTime: data.processingTime || fallback?.processingTime || "Varies",
          offlineOffice: data.offlineOffice || fallback?.offlineOffice || "District Office",
          onlinePortal: data.onlinePortal || fallback?.onlinePortal || "https://www.india.gov.in",
          official_portal: data.official_portal || fallback?.official_portal || null,
          importantNotes: data.importantNotes?.length ? data.importantNotes : fallback?.importantNotes || [],
        });
      }
    } catch (err) {
      // Keep showing fallback data, just don't show an error since we already have data
      console.warn("API fetch failed, showing fallback data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Document Assistant</h1>
        <p className="text-muted-foreground mt-1">Get precise information about required documents, fees, and application processes for any government document.</p>
      </div>

      <Card className="border-primary/20 shadow-md">
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row gap-4 items-end">
          <div className="space-y-2 flex-1 w-full">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Select Document Type
            </label>
            <Select value={selectedDoc} onValueChange={setSelectedDoc}>
              <SelectTrigger className="h-12 text-base border-primary/30 focus:ring-primary/50">
                <SelectValue placeholder="e.g. Passport, PAN Card, Aadhaar..." />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map(doc => (
                  <SelectItem key={doc} value={doc}>{doc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            size="lg"
            className="w-full sm:w-auto h-12"
            onClick={handleGetInfo}
            disabled={!selectedDoc || loading}
          >
            {loading ? (
              <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...</>
            ) : (
              "Get Information"
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {docInfo && (
          <motion.div
            key={docInfo.documentType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="overflow-hidden border-border/50 shadow-lg">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b px-6 py-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{docInfo.documentType}</h2>
                  <p className="text-sm text-muted-foreground">Official Government Document Guide</p>
                </div>
                {loading && (
                  <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Fetching AI data...
                  </div>
                )}
              </div>

              <CardContent className="p-0">
                {/* Stats row */}
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b">
                  <div className="p-6 flex items-start gap-4">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full text-orange-600 dark:text-orange-400 shrink-0">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Government Fees</h4>
                      <p className="font-semibold text-sm leading-snug">{docInfo.fees}</p>
                    </div>
                  </div>

                  <div className="p-6 flex items-start gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400 shrink-0">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Processing Time</h4>
                      <p className="font-semibold text-sm leading-snug">{docInfo.processingTime}</p>
                    </div>
                  </div>

                  <div className="p-6 flex items-start gap-4">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400 shrink-0">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Where to Apply</h4>
                      <div className="text-sm font-medium mt-1 flex flex-col gap-1">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="h-3 w-3 shrink-0" />
                          {docInfo.offlineOffice}
                        </span>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Globe className="h-3 w-3 shrink-0" />
                          Online portal available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 grid md:grid-cols-5 gap-8">
                  {/* Required Documents */}
                  <div className="md:col-span-3 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        <FileText className="h-5 w-5 text-primary" /> Required Documents Checklist
                      </h3>
                      <div className="bg-muted/30 rounded-xl border p-4">
                        <ul className="space-y-3">
                          {docInfo.requiredDocuments.map((doc, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                              <span className="text-sm md:text-base">{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Important Notes + Portal */}
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        <AlertCircle className="h-5 w-5 text-amber-500" /> Important Notes
                      </h3>
                      <div className="space-y-3">
                        {docInfo.importantNotes.map((note, i) => (
                          <div key={i} className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-200/90 text-sm p-3 rounded-lg leading-snug">
                            {note}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 space-y-3">
                      {docInfo.official_portal ? (
                        <Button className="w-full h-12 gap-2" asChild>
                          <a href={docInfo.official_portal} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4" />
                            Visit Official Portal
                            <ExternalLink className="h-3.5 w-3.5 ml-auto" />
                          </a>
                        </Button>
                      ) : (
                        <Button className="w-full h-12 gap-2" variant="outline" asChild>
                          <a href={docInfo.onlinePortal} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4" />
                            Visit State Portal
                            <ExternalLink className="h-3.5 w-3.5 ml-auto" />
                          </a>
                        </Button>
                      )}
                      {docInfo.official_portal && (
                        <p className="text-xs text-center text-muted-foreground">
                          Note: State-level documents may use your state's e-District portal
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!docInfo && !error && (
        <div className="text-center py-20 text-muted-foreground">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Select a document type to get started</p>
          <p className="text-sm mt-2">We'll show you required documents, fees, and official portals instantly.</p>
        </div>
      )}
    </div>
  );
}