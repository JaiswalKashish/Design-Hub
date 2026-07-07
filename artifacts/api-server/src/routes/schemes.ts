import { Router } from "express";
import { findGovernmentSchemes } from "../lib/gemini";
import { FindSchemesBody, GetSavedSchemesQueryParams } from "@workspace/api-zod";

const router = Router();

// POST /api/schemes/find
router.post("/find", async (req, res) => {
  const parse = FindSchemesBody.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const raw = await findGovernmentSchemes(parse.data);
    let schemes;
    try {
      const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      schemes = (Array.isArray(parsed) ? parsed : [parsed]).map((s: Record<string, unknown>, i: number) => ({
        id: `scheme-${i + 1}`,
        name: s.name || "Unknown Scheme",
        description: s.description || "",
        eligibility: s.eligibility || "",
        benefits: s.benefits || "",
        documents: Array.isArray(s.documents) ? s.documents : [],
        applicationProcess: s.applicationProcess || "",
        officialPortal: s.officialPortal || "https://www.india.gov.in",
        category: s.category || "General",
      }));
    } catch {
      // Return fallback if parse fails
      schemes = [{
        id: "scheme-1",
        name: "PM Jan Dhan Yojana",
        description: "Financial inclusion scheme providing bank accounts, insurance, and credit access to unbanked citizens.",
        eligibility: "Any Indian citizen without a bank account",
        benefits: "Zero-balance bank account, ₹2 lakh accident insurance, ₹30,000 life cover",
        documents: ["Aadhaar Card", "PAN Card (optional)", "Passport photo"],
        applicationProcess: "Visit nearest bank branch with Aadhaar. Fill PMJDY form. Get zero-balance account.",
        officialPortal: "https://pmjdy.gov.in",
        category: "Finance",
      }];
    }
    return res.json(schemes);
  } catch (err) {
    req.log.error({ err }, "Scheme finder error");
    return res.status(500).json({ error: "Failed to find schemes" });
  }
});

// GET /api/schemes/saved
router.get("/saved", async (req, res) => {
  const parse = GetSavedSchemesQueryParams.safeParse(req.query);
  if (!parse.success) {
    return res.status(400).json({ error: "Missing userId" });
  }
  // Saved schemes would be in a separate table in production
  // For now return empty array
  return res.json([]);
});

export default router;
