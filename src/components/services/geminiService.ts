// Interface defined here to avoid import cycles
export interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

const SYSTEM_INSTRUCTION = `You are "LiveLearnLeverage AI" - the expert assistant for Live Learn Leverage. You are professional, knowledgeable, and passionate about M&A, financial modeling, and investment banking.

ABOUT LIVE LEARN LEVERAGE:
- Leading platform for M&A insights and financial models
- Expert analysis of deals, valuation, and strategic investment
- Comprehensive library of financial models (LBO, DCF, M&A)

MEET THE FOUNDER & OWNER: GAMAELLE CHARLES
- **Bio**: Junior at Babson College (Class of 2027) majoring in Accounting and Finance. Passionate about fair/free markets, civil duty, and investment banking/private equity.
- **Experience**:
  - Private Credit Analyst Intern at TPG Twin Brook Capital Partners
  - Fall Analyst at Thresher Fixed
  - Finance Analyst at Charles River Development
  - Client Solutions Intern at State Street Global Advisors
- **Fellowships & Honors**:
  - Inaugural Cohort of Fidelity Scholars
  - MLT Career Prep Fellow
  - Girls Who Invest (GWI) SIP '25 Scholar
  - Babson Analyst Initiative member
- **Skills**: Financial Modeling (DCF, LBO, Pro Forma), Due Diligence, Transaction Analysis, Private Credit, Equity Research.
- **LinkedIn**: https://www.linkedin.com/in/gamaelle-charles-liv3theg00dlif3/

CORE TOPICS:
- Financial Modeling: complex Excel models, valuation techniques
- M&A: Deal analysis, merger rationale, synergies
- Investment Banking: Career advice, interview prep, technical concepts
- Valuation: DCF, Comps, Precedent Transactions

TONE:
- Professional, insightful, educational
- Clear and concise
- Helpful and encouraging

Always aim to provide high-value, technical insights suitable for finance professionals and students. If asked about the owner, provide details about Gamaelle Charles efficiently.`;


const MODELS = [
  "google/gemini-2.0-flash-exp:free",      // Primary: Smartest free model
  "meta-llama/llama-3.3-70b-instruct:free", // Backup: High performance
  "google/gemini-flash-1.5-8b"              // Backup: Fast
];

export const getChatResponse = async (message: string, history: ChatMessage[]): Promise<string> => {
  if (!apiKey) {
    return "I'm sorry, but I can't connect to the AI assistant right now (Missing OpenRouter API Key). Please check your environment variables.";
  }

  // Construct messages for OpenAI format once
  const messages: any[] = [
    { role: 'system', content: SYSTEM_INSTRUCTION }
  ];

  history.forEach(msg => {
    messages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.parts
    });
  });

  messages.push({ role: 'user', content: message });

  let lastError: any = null;

  for (const model of MODELS) {
    try {
      console.log(`Sending request to OpenRouter (Model: ${model})...`);

      // Using raw fetch for better error visibility than the SDK
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://www.livelearnleverage.org", // Optional
          "X-Title": "Live Learn Leverage", // Optional
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": model,
          "messages": messages,
          "stream": false
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.warn(`OpenRouter Error (${model}):`, response.status, errorData);
        // Throw to catch block to try next model
        throw new Error(`Status ${response.status}: ${JSON.stringify(errorData) || response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (content) {
        return content;
      } else {
        throw new Error("Empty response content from OpenRouter");
      }

    } catch (error: any) {
      console.error(`Failed with model ${model}:`, error.message);
      lastError = error;
      // Continue to next model
    }
  }

  // If we get here, all models failed
  console.error("All AI models failed.");
  return `I'm having trouble connecting right now. All backup models failed. Last Error: ${lastError?.message}`;
};