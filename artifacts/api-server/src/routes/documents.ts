import { Router } from "express";
import { getDocumentAssistance } from "../lib/gemini";
import { GetDocumentInfoBody } from "@workspace/api-zod";

// Mapping of document types to official government portals
const OFFICIAL_PORTALS: Record<string, string | null> = {
  "Passport": "https://www.passportindia.gov.in/",
  "Aadhaar": "https://uidai.gov.in/",
  "PAN Card": "https://www.onlineservices.nsdl.com/",
  "Driving License": "https://parivahan.gov.in/",
  "Voter ID": "https://voters.eci.gov.in/",
  "Birth Certificate": null, // varies by state
  "Income Certificate": null, // varies by state
  "Ration Card": null, // varies by state
  "PM Kisan": "https://pmkisan.gov.in/",
  "Ayushman Bharat": "https://beneficiary.nha.gov.in/",
};

const router = Router();

// POST /api/documents/info
router.post("/info", async (req, res) => {
  const parse = GetDocumentInfoBody.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const { documentType } = parse.data;

  try {
    const raw = await getDocumentAssistance(documentType);
    let info;
    try {
      const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      info = JSON.parse(cleaned);
    } catch {
      info = {
        documentType,
        requiredDocuments: ["Aadhaar Card", "Proof of Address", "Passport-size Photographs", "Application Form"],
        fees: "Varies by state and type",
        processingTime: "7-30 working days",
        offlineOffice: "District Collector's Office / Municipal Corporation",
        onlinePortal: "https://www.india.gov.in",
        importantNotes: [
          "Keep all original documents ready for verification",
          "Online applications are processed faster than offline",
          "Track application status using the provided reference number",
          "Fees may vary by state"
        ],
      };
    }
    return res.json({
      documentType: info.documentType || documentType,
      requiredDocuments: info.requiredDocuments || [],
      fees: info.fees || "Contact local office",
      processingTime: info.processingTime || "Varies",
      offlineOffice: info.offlineOffice || "District Office",
      onlinePortal: info.onlinePortal || "https://www.india.gov.in",
      official_portal: OFFICIAL_PORTALS[documentType] || "",
      importantNotes: info.importantNotes || [],
    });
  } catch (err) {
    req.log.error({ err }, "Document assistant error");
    return res.status(500).json({ error: "Failed to get document info" });
  }
});

export default router;
