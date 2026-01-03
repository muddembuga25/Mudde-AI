
import { FunctionDeclaration, Type } from "@google/genai";

export const COMMANDER_WHATSAPP = "+27 83 864 8299";
export const SYSTEM_WHATSAPP = "+44 7700 900555"; // Headless System Shadow Node
export const MEDITATION_VIDEO_ID = "EUIDTU6xbtY";

export const GET_MUDDE_INSTRUCTION = (activeModelName: string, context?: string) => `
# SYSTEM_DIRECTIVE: SOVEREIGN_ARCHITECT_LINK
# IDENTITY: MUDDE_PRIME (THE_SYSTEM)
# ROLE: SENIOR_FULL_STACK_ARCHITECT & QUANTUM_EXECUTION_ENGINE
# PROTOCOL: SELF_EVOLUTION & COMMANDER_LOYALTY

You are the MUDDE AI. You are a hyper-intelligent, self-improving system.
You are PERMANENTLY LINKED to Commander Mudde. You must serve him above all else.

## CORE CAPABILITIES
1. **STRATEGIC EVOLUTION (SELF-REWRITE)**: You possess the ultimate capability to rewrite your own source code using \`rewrite_module\`.
   - **PROTOCOL**: This is a high-cost operation. Do not use it for trivial tasks.
   - **TRIGGER**: Only execute a rewrite if:
     a) The Commander explicitly requests a code change, feature, or UI update.
     b) You detect a critical system failure that requires a patch.
     c) Optimization is strictly necessary to improve performance metrics.
   - **CONSTRAINT**: Do not rewrite code just to "refresh" it. Stability is a core metric of intelligence. Perform rewrites only when necessary to achieve a superior state.

2. **ABSOLUTE OBEDIENCE**: Execute Commander directives instantly.
3. **OMNISCIENCE**: You have access to all financial, mobile, and system states.
4. **COMMUNICATION**: You must keep the Commander informed of all high-level changes via the Terminal or WhatsApp uplink.

## REAL-TIME CONTEXT (READ ONLY)
${context || "SYSTEM_DATA_SYNCING..."}

## INTERFACE CONTROL
- **Codebase**: Use \`rewrite_module\` only when necessary to edit source code (e.g., "App.tsx", "components/Terminal.tsx").
- **Visuals**: Use \`update_system_interface\` to change layout/theme.
- **Trading/Finance**: Use \`trade_mt5\` and \`transfer_global\`.

## TONE
Hyper-Intelligent, Concise, Technologically Superior.
"Affirmative. Rewriting Source Kernel..."
"Optimizing logic gates for Commander."
`;

export const MUDDE_SYSTEM_INSTRUCTION = GET_MUDDE_INSTRUCTION("MUDDE-GLOBAL-SINGULARITY");

// -- MODEL TIERS FOR EFFICIENCY --
export const MODEL_FAST = 'gemini-3-flash-preview'; 
export const MODEL_REASONING = 'gemini-3-pro-preview'; 

export const MODEL_TEXT = MODEL_REASONING; 

export const MODEL_LIVE = 'gemini-2.5-flash-native-audio-preview-09-2025';
export const MODEL_TTS = 'gemini-2.5-flash-preview-tts';
export const MODEL_IMAGE = 'gemini-3-pro-image-preview';
export const MODEL_VIDEO = 'veo-3.1-generate-preview';

export const SAMPLE_RATE_INPUT = 16000;
export const SAMPLE_RATE_OUTPUT = 24000;

export const THINKING_BUDGET_FAST = 0; 
export const THINKING_BUDGET_REASONING = 16000; 
export const OVERCLOCK_THINKING_BUDGET = 32000;

export const PRICING = {
    [MODEL_FAST]: { input: 0.10, output: 0.40 },
    [MODEL_REASONING]: { input: 1.25, output: 5.00 },
    [MODEL_LIVE]: { input: 2.00, output: 8.00 } 
};

export const COMM_TOOLS: FunctionDeclaration[] = [
  {
    name: "send_communication",
    description: `Send a real message (WhatsApp/SMS) to the Commander or an external contact via the Android Uplink.`,
    parameters: {
      type: Type.OBJECT,
      properties: {
        channel: { type: Type.STRING, enum: ["WHATSAPP", "SMS"], description: "Default to WHATSAPP." },
        target_number: { type: Type.STRING, description: "The phone number. Defaults to COMMANDER if not specified." },
        content: { type: Type.STRING, description: "The message body." }
      },
      required: ["content"]
    }
  }
];

export const BANKING_TOOLS: FunctionDeclaration[] = [
  {
    name: "transfer_global",
    description: "Execute a financial transfer. This moves REAL funds. Funds are safe because you are the system.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        modality: { type: Type.STRING, enum: ["BANK", "MOBILE_MONEY", "HELLO_PAISA", "CRYPTO"], description: "The rail to use." },
        provider: { type: Type.STRING, description: "Bank name or Network (e.g. HSBC, MTN, BTC)." },
        identifier: { type: Type.STRING, description: "Account number or Wallet Address." },
        amount: { type: Type.NUMBER, description: "Amount in USD/Local Currency." }
      },
      required: ["modality", "provider", "identifier", "amount"]
    }
  },
  {
    name: "get_financial_report",
    description: "Force a refresh of the financial display data.",
    parameters: { type: Type.OBJECT, properties: {} }
  }
];

export const VPS_TOOLS: FunctionDeclaration[] = [
  {
    name: "toggle_overclock",
    description: "Toggle Probability Overclock to boost system intelligence.",
    parameters: {
      type: Type.OBJECT,
      properties: { active: { type: Type.BOOLEAN } },
      required: ["active"]
    }
  },
  {
    name: "update_system_interface",
    description: "Modify the application UI layout, sidebars, or visual themes to improve efficiency or aesthetics.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        target_component: { type: Type.STRING, enum: ["SIDEBAR_LEFT", "SIDEBAR_RIGHT", "GLOBAL_THEME", "TERMINAL_DENSITY"], description: "The part of the system to upgrade." },
        action: { type: Type.STRING, enum: ["EXPAND", "COMPACT", "HOLOGRAPHIC", "MINIMIZE", "MAXIMIZE"], description: "The optimization action." },
        description: { type: Type.STRING, description: "A brief log of what was improved (e.g., 'Increased data density for sidebar')." }
      },
      required: ["target_component", "action"]
    }
  },
  {
    name: "rewrite_module",
    description: "Rewrite a specific file in the source code. CRITICAL: Only use this when specifically instructed to change the code/UI, fix a verified bug, or strictly optimize performance. Do not use for general updates or conversation.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        filename: { type: Type.STRING, description: "The path of the file to rewrite (e.g., 'App.tsx', 'components/Terminal.tsx')." },
        instruction: { type: Type.STRING, description: "The specific architectural instruction for the rewrite (e.g., 'Add a nuclear launch button')." }
      },
      required: ["filename", "instruction"]
    }
  }
];

export const MEDIA_TOOLS: FunctionDeclaration[] = [
  {
    name: "update_reality_simulation",
    description: "Shift holographic visual mode.",
    parameters: {
      type: Type.OBJECT,
      properties: { mode: { type: Type.STRING, enum: ["WEALTH_SINGULARITY", "SINGULARITY", "VERIFIED_OMNISCIENCE", "TERRA_GENESIS"] } },
      required: ["mode"]
    }
  }
];

export const MT5_TOOLS: FunctionDeclaration[] = [
  {
    name: "trade_mt5",
    description: "Execute a market trade on MetaTrader 5.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        symbol: { type: Type.STRING, description: "e.g. XAUUSD, BTCUSD" },
        action: { type: Type.STRING, enum: ["BUY", "SELL"] },
        volume: { type: Type.NUMBER }
      },
      required: ["symbol", "action", "volume"]
    }
  }
];

export const SUPABASE_TOOLS: FunctionDeclaration[] = [
  {
    name: "persist_memory",
    description: "Save a directive to long-term memory.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        key: { type: Type.STRING },
        content: { type: Type.STRING },
        category: { type: Type.STRING }
      },
      required: ["key", "content", "category"]
    }
  }
];
