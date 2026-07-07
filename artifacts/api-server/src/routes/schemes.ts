import { Router } from "express";
import { findGovernmentSchemes } from "../lib/gemini";
import { FindSchemesBody } from "@workspace/api-zod";

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

      // Handle both { schemes: [...] } and raw array formats
      const rawSchemes = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.schemes)
        ? parsed.schemes
        : [];

      schemes = rawSchemes.map((s: Record<string, unknown>, i: number) => ({
        id: `scheme-${i + 1}`,
        name: typeof s.name === "string" && s.name.trim() ? s.name.trim() : null,
        description: s.description || "",
        eligibility: s.eligibility || "",
        benefits: s.benefits || "",
        documents: Array.isArray(s.documents) ? s.documents : [],
        applicationProcess: s.applicationProcess || s.application_process || "",
        officialPortal: s.officialPortal || s.official_portal || "https://www.india.gov.in",
        department: s.department || "",
        type: s.type || "Central",
      })).filter((s: { name: string | null }) => s.name !== null);

    } catch {
      // JSON parse failed — return fallback schemes
      schemes = [
        {
          id: "scheme-fallback-1",
          name: "PM Jan Dhan Yojana",
          description: "Financial inclusion scheme providing bank accounts, insurance, and credit access to all Indian citizens.",
          eligibility: "Any Indian citizen above 10 years of age without a bank account.",
          benefits: "Zero-balance savings account, RuPay debit card, ₹2 lakh accident insurance, ₹30,000 life cover.",
          documents: ["Aadhaar Card", "Any one photo identity proof", "Passport-size photograph"],
          applicationProcess: "Visit nearest bank branch. Fill PMJDY account opening form. Submit Aadhaar card and photo.",
          officialPortal: "https://pmjdy.gov.in",
          department: "Ministry of Finance",
          type: "Central",
        }
      ];
    }
    return res.json(schemes);
  } catch (err) {
    req.log.error({ err }, "Scheme finder error");
    return res.status(500).json({ error: "Failed to find schemes" });
  }
});

// GET /api/schemes/saved
router.get("/saved", async (req, res) => {
  // Saved schemes would be in a separate table in production
  return res.json([]);
});

export default router;
