import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "./logger";

const apiKey = process.env["GEMINI_API_KEY"] || "";

let genAI: GoogleGenerativeAI | null = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  logger.warn("GEMINI_API_KEY not set — AI features will return placeholder responses");
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
  if (!genAI) {
    return `I'm Smart Bharat AI. I'm currently operating in demo mode (API key not configured). 

For your question: "${message}"

In full mode, I would provide detailed guidance on Indian government services, including required documents, fees, processing times, and official portals. Please configure the GEMINI_API_KEY environment variable to enable full AI responses.`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      { text: CIVIC_SYSTEM_PROMPT },
      { text: message },
    ]);
    return result.response.text();
  } catch (err) {
    logger.error({ err }, "Gemini chat error");
    throw new Error("Failed to get AI response");
  }
}

export async function findGovernmentSchemes(profile: {
  age: number;
  gender: string;
  occupation: string;
  income: string;
  state: string;
  category: string;
}): Promise<string> {
  const prompt = `You are a government scheme advisor for India. Based on the following citizen profile, list the top 5-8 most relevant central and state government schemes they are eligible for.

Citizen Profile:
- Age: ${profile.age}
- Gender: ${profile.gender}
- Occupation: ${profile.occupation}
- Annual Income: ${profile.income}
- State: ${profile.state}
- Category: ${profile.category}

For each scheme, provide a JSON array with objects containing:
- name: scheme name
- description: 1-2 sentence description
- eligibility: specific eligibility criteria
- benefits: key benefits
- documents: array of required documents (strings)
- applicationProcess: step-by-step process
- officialPortal: official website URL
- category: category tag (Agriculture/Education/Health/Housing/Finance/Women/Youth etc)

Return ONLY a valid JSON array, no markdown, no explanation.`;

  if (!genAI) {
    return JSON.stringify([
      {
        id: "pm-kisan",
        name: "PM-KISAN Samman Nidhi",
        description: "Income support scheme for farmers providing ₹6,000 per year in three installments.",
        eligibility: "Small and marginal farmers with cultivable land",
        benefits: "₹6,000 per year direct bank transfer",
        documents: ["Aadhaar Card", "Land Records", "Bank Account Details"],
        applicationProcess: "1. Visit PM-KISAN portal. 2. Click 'Farmer Corner'. 3. Fill registration form. 4. Submit with documents.",
        officialPortal: "https://pmkisan.gov.in",
        category: "Agriculture"
      }
    ]);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    logger.error({ err }, "Gemini scheme finder error");
    throw new Error("Failed to find schemes");
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

  if (!genAI) {
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    logger.error({ err }, "Gemini document assistant error");
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

  if (!genAI) {
    return {
      issue: `${category} issue reported`,
      department: getDepartmentForCategory(category),
      priority: "medium",
      severity: "moderate",
      suggestedDescription: `A ${category.toLowerCase()} issue has been reported. Immediate inspection and resolution is requested from the concerned authorities. Please take appropriate action at the earliest.`,
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    logger.error({ err }, "Gemini complaint analysis error");
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
