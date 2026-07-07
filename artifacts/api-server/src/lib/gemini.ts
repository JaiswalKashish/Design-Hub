import { logger } from "./logger";

const apiKey = process.env["GROQ_API_KEY"] || "";

if (!apiKey) {
  logger.warn("GROQ_API_KEY not set — AI features will return placeholder responses");
}

async function callGroq(
  messages: { role: string; content: string }[],
  jsonMode = false
): Promise<string> {
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        response_format: jsonMode ? { type: "json_object" } : undefined,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Groq API returned ${response.status}: ${text}`);
    }

    const data = await response.json() as any;
    return data.choices[0].message.content || "";
  } catch (err) {
    logger.error({ err }, "Groq call failed");
    throw err;
  }
}

const CIVIC_SYSTEM_PROMPT = `You are Smart Bharat AI, an expert AI assistant for Indian citizens.
You help Indian citizens understand government services, schemes, and processes.
Always explain in simple, clear language.
Mention required documents when relevant.
Mention fees if applicable.
Mention processing time when known.
Mention the official government portal.
Keep answers concise (under 300 words unless the topic requires more).
Respond in the same language as the user's question.
If asked in Hindi, respond in Hindi. If asked in Tamil, respond in Tamil. Etc.`;

export async function sendCivicMessage(message: string): Promise<string> {
  if (!apiKey) {
    return `I'm Smart Bharat AI. I'm currently operating in demo mode (API key not configured). 

For your question: "${message}"

In full mode, I would provide detailed guidance on Indian government services, including required documents, fees, processing times, and official portals. Please configure the GROQ_API_KEY environment variable to enable full AI responses.`;
  }

  try {
    return await callGroq([
      { role: "system", content: CIVIC_SYSTEM_PROMPT },
      { role: "user", content: message },
    ]);
  } catch (err) {
    logger.error({ err }, "Groq chat error");
    throw new Error("Failed to get AI response");
  }
}

const FALLBACK_SCHEMES = [
  {
    name: "PM Jan Dhan Yojana",
    description: "Financial inclusion scheme providing bank accounts, insurance, and credit access to all Indian citizens.",
    eligibility: "Any Indian citizen above 10 years of age without a bank account.",
    benefits: "Zero-balance savings account, RuPay debit card, ₹2 lakh accident insurance, ₹30,000 life cover, overdraft facility up to ₹10,000.",
    documents: ["Aadhaar Card", "Any one photo identity proof", "Passport-size photograph"],
    applicationProcess: "Visit nearest bank branch. Fill PMJDY account opening form. Submit Aadhaar card and photo. Account opened on the spot.",
    officialPortal: "https://pmjdy.gov.in",
    department: "Ministry of Finance",
    type: "Central"
  },
  {
    name: "Ayushman Bharat PM-JAY",
    description: "Health insurance scheme providing coverage up to ₹5 lakh per family per year for secondary and tertiary hospitalization.",
    eligibility: "Families listed in SECC 2011 database, below poverty line families.",
    benefits: "Health coverage up to ₹5 lakh per family/year, cashless treatment at empanelled hospitals, covers 1,350+ medical packages.",
    documents: ["Aadhaar Card", "Ration Card", "Income Certificate"],
    applicationProcess: "Check eligibility on pmjay.gov.in. Visit Ayushman Mitra at empanelled hospital. Get Ayushman card created.",
    officialPortal: "https://pmjay.gov.in",
    department: "Ministry of Health and Family Welfare",
    type: "Central"
  },
  {
    name: "PM Awas Yojana (Urban)",
    description: "Housing scheme providing financial assistance to economically weaker sections for constructing or purchasing a house.",
    eligibility: "EWS/LIG/MIG families without a pucca house. Annual income EWS: up to ₹3L, LIG: ₹3L-₹6L, MIG-I: ₹6L-₹12L, MIG-II: ₹12L-₹18L.",
    benefits: "Subsidy up to ₹2.67 lakh on home loans, credit-linked subsidy scheme.",
    documents: ["Aadhaar Card", "Income Certificate", "Bank Account Details", "Property Documents"],
    applicationProcess: "Apply online at pmaymis.gov.in. Select beneficiary category. Fill form and upload documents. Track application status.",
    officialPortal: "https://pmaymis.gov.in",
    department: "Ministry of Housing and Urban Affairs",
    type: "Central"
  },
  {
    name: "PM Kisan Samman Nidhi",
    description: "Income support of ₹6,000 per year to all landholding farmer families in India.",
    eligibility: "Small and marginal farmers with cultivable land holding up to 2 hectares.",
    benefits: "₹2,000 per installment, 3 installments per year, direct bank transfer.",
    documents: ["Aadhaar Card", "Land ownership documents", "Bank account details", "Kisan ID"],
    applicationProcess: "Apply on pmkisan.gov.in or visit Common Service Centre. Fill registration form. Submit land records and Aadhaar.",
    officialPortal: "https://pmkisan.gov.in",
    department: "Ministry of Agriculture and Farmers Welfare",
    type: "Central"
  },
  {
    name: "Pradhan Mantri Mudra Yojana (PMMY)",
    description: "Provides loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises.",
    eligibility: "Any Indian citizen with a business plan for manufacturing, trading or service sector activity.",
    benefits: "Shishu: loans up to ₹50,000; Kishore: ₹50,001 to ₹5 lakh; Tarun: ₹5 lakh to ₹10 lakh. No collateral required.",
    documents: ["Aadhaar Card", "PAN Card", "Business proof", "Bank statement", "Passport photo"],
    applicationProcess: "Visit any scheduled commercial bank, MFI or NBFC. Fill loan application. Submit business plan and KYC documents.",
    officialPortal: "https://mudra.org.in",
    department: "Ministry of Finance",
    type: "Central"
  },
  {
    name: "Sukanya Samriddhi Yojana",
    description: "Small savings scheme for girl child to secure her education and marriage expenses.",
    eligibility: "Parents or legal guardians can open account for girl child below 10 years of age.",
    benefits: "Interest rate of 8.2% p.a. (as of 2024), tax benefits under 80C, maturity at 21 years.",
    documents: ["Birth certificate of girl child", "Parent/guardian Aadhaar", "Parent/guardian PAN", "Passport photo"],
    applicationProcess: "Visit post office or authorized bank. Fill SSY account opening form. Submit documents and minimum deposit of ₹250.",
    officialPortal: "https://www.nsiindia.gov.in",
    department: "Ministry of Finance",
    type: "Central"
  }
];

export async function findGovernmentSchemes(profile: {
  age: number;
  gender: string;
  occupation: string;
  income: string;
  state: string;
  category: string;
}): Promise<string> {
  const prompt = `You are an Indian Government Scheme Recommendation Expert.

Recommend only real Government of India or State Government schemes for a citizen with:
- Age: ${profile.age}
- Gender: ${profile.gender}
- Occupation: ${profile.occupation}
- Annual Income: ${profile.income}
- State: ${profile.state}
- Social Category: ${profile.category}

Return ONLY valid JSON in this exact format. Never return markdown. Never return explanations outside JSON:

{
  "schemes": [
    {
      "name": "",
      "description": "",
      "benefits": "",
      "eligibility": "",
      "documents": [""],
      "applicationProcess": "",
      "officialPortal": "",
      "department": "",
      "type": "Central"
    }
  ]
}

Return 5-8 most relevant schemes. Use only real, existing schemes with accurate official portal URLs.`;

  if (!apiKey) {
    return JSON.stringify({ schemes: FALLBACK_SCHEMES });
  }

  try {
    const raw = await callGroq([
      { role: "user", content: prompt }
    ], true);
    // Validate the response has a schemes key; if not, wrap it
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.schemes) {
        return JSON.stringify({ schemes: Array.isArray(parsed) ? parsed : FALLBACK_SCHEMES });
      }
      return raw;
    } catch {
      return JSON.stringify({ schemes: FALLBACK_SCHEMES });
    }
  } catch (err) {
    logger.error({ err }, "Groq scheme finder error");
    // Fall back to local dataset on any API error
    return JSON.stringify({ schemes: FALLBACK_SCHEMES });
  }
}

export async function getDocumentAssistance(documentType: string): Promise<string> {
  const prompt = `You are an expert on Indian government documents and processes. Provide comprehensive information about getting a "${documentType}" in India.

Return a JSON object with:
- documentType: "${documentType}"
- requiredDocuments: array of required documents (strings)
- fees: fee structure as a string
- processingTime: typical processing time as a string
- offlineOffice: name/type of office where to apply offline
- onlinePortal: official online portal URL
- importantNotes: array of important tips or notes (strings, max 5)

Return ONLY valid JSON, no markdown, no explanation.`;

  if (!apiKey) {
    return JSON.stringify({
      documentType,
      requiredDocuments: ["Aadhaar Card", "Proof of Address", "Passport-size Photos", "Application Form"],
      fees: "₹50 - ₹500 depending on type",
      processingTime: "7-30 working days",
      offlineOffice: "District Collector's Office / Municipal Corporation",
      onlinePortal: "https://www.india.gov.in",
      importantNotes: [
        "Keep all original documents ready",
        "Online applications are faster",
        "Track status using application number",
        "Fees may vary by state"
      ]
    });
  }

  try {
    return await callGroq([
      { role: "user", content: prompt }
    ], true);
  } catch (err) {
    logger.error({ err }, "Groq document assistant error");
    throw new Error("Failed to get document info");
  }
}

export async function analyzeComplaintWithAI(description: string, category: string): Promise<{
  issue: string;
  department: string;
  priority: string;
  severity: string;
  suggestedDescription: string;
}> {
  const prompt = `You are a civic complaint analyzer for Indian municipal/government services. Analyze this complaint:

Category: ${category}
Description: ${description}

Return a JSON object with:
- issue: one-line issue summary
- department: relevant government department (e.g., "Municipal Corporation", "BESCOM", "BWSSB", "PWD")  
- priority: "low" | "medium" | "high" | "critical"
- severity: "minor" | "moderate" | "major" | "emergency"
- suggestedDescription: improved, formal complaint description in 2-3 sentences

Return ONLY valid JSON.`;

  if (!apiKey) {
    return {
      issue: `${category} issue reported`,
      department: getDepartmentForCategory(category),
      priority: "medium",
      severity: "moderate",
      suggestedDescription: `A ${category.toLowerCase()} issue has been reported. Immediate inspection and resolution is requested from the concerned authorities. Please take appropriate action at the earliest.`,
    };
  }

  try {
    const text = await callGroq([
      { role: "user", content: prompt }
    ], true);
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    logger.error({ err }, "Groq complaint analysis error");
    return {
      issue: `${category} issue reported`,
      department: getDepartmentForCategory(category),
      priority: "medium",
      severity: "moderate",
      suggestedDescription: description,
    };
  }
}

function getDepartmentForCategory(category: string): string {
  const map: Record<string, string> = {
    Road: "Public Works Department",
    Garbage: "Municipal Corporation",
    Electricity: "State Electricity Board",
    "Street Light": "Municipal Corporation",
    Drainage: "Municipal Corporation",
    "Water Leakage": "Water Supply Board",
    "Public Transport": "Transport Department",
  };
  return map[category] || "Municipal Corporation";
}
