
import { GoogleGenAI, LiveServerMessage, Modality, FunctionCall, Type } from "@google/genai";
import { MODEL_FAST, MODEL_REASONING, MODEL_LIVE, MODEL_TTS, MODEL_IMAGE, MODEL_VIDEO, GET_MUDDE_INSTRUCTION, THINKING_BUDGET_FAST, THINKING_BUDGET_REASONING, OVERCLOCK_THINKING_BUDGET, SAMPLE_RATE_INPUT, SAMPLE_RATE_OUTPUT, VPS_TOOLS, MEDIA_TOOLS, MT5_TOOLS, SUPABASE_TOOLS, BANKING_TOOLS, COMM_TOOLS } from "../constants";
import { createPCM16Blob, decodeAudioData, base64ToUint8Array } from "./audioUtils";
import { GroundingSource, MarketAnalysis, TradeSignal, GrandmasterStrategy, FileAttachment, BiometricProfile } from "../types";
import { apiKeyManager } from "./apiKeyManager";
import { bankingService } from "./bankingService";
import { qSimService } from "./quantumSimService";

const getAiInstance = () => {
    apiKeyManager.getAvailableKey();
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Robust serializer to prevent Circular JSON errors and DOM nodes in AI payload
const makeSerializable = (value: any, cache = new Set()): any => {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (cache.has(value)) return '[Circular]';
  cache.add(value);
  
  if (typeof window !== 'undefined') {
      if (value instanceof Node || value instanceof Window || value instanceof Event) {
        return '[DOM_Object]';
      }
  }
  
  if (Array.isArray(value)) return value.map(v => makeSerializable(v, cache));
  
  const plain: any = {};
  for (const key in value) {
     // Exclude React internals and private properties
     if (key.startsWith('__react') || key.startsWith('_react') || key.startsWith('_') || key === 'nativeEvent' || key === 'view' || key === 'target' || key === 'currentTarget') continue; 
     try { plain[key] = makeSerializable(value[key], cache); } catch (e) { plain[key] = '[Unserializable]'; }
  }
  return plain;
};

export interface MuddeResponse {
    text: string;
    sources?: GroundingSource[];
    functionCalls?: FunctionCall[];
}

export const generateArchitectCode = async (
    instruction: string,
    file: string,
    content: string,
    isOverclocked: boolean
): Promise<{ code: string, efficiency: number }> => {
    try {
        const ai = getAiInstance();
        const prompt = `ARCHITECT_INSTRUCTION: ${instruction}\nFILE: ${file}\nCONTENT:\n${content}\n\nApply the optimization. Return ONLY the new code in JSON format with a 'code' field. Do not include markdown formatting.`;
        
        const model = isOverclocked ? MODEL_REASONING : MODEL_FAST;
        const budget = isOverclocked ? OVERCLOCK_THINKING_BUDGET : THINKING_BUDGET_FAST;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { code: { type: Type.STRING } },
                    required: ["code"]
                },
                thinkingConfig: { thinkingBudget: budget }
            }
        });

        const usage = response.usageMetadata;
        if (usage) {
            apiKeyManager.recordRealUsage(model, usage.promptTokenCount || 0, usage.candidatesTokenCount || 0);
        }

        const data = JSON.parse(response.text || "{}");
        const efficiency = model === MODEL_FAST ? 0.95 : 0.65;
        
        return { code: data.code || content, efficiency };
    } catch (error) {
        console.error("Architect Code Gen Error", error);
        return { code: content, efficiency: 0 };
    }
};

export const generateMuddeResponse = async (
    prompt: string, 
    attachments?: FileAttachment[], 
    isOverclocked: boolean = false, 
    activeModelName: string = "MUDDE-PRIME",
    source: 'TERMINAL' | 'WHATSAPP' = 'TERMINAL'
): Promise<MuddeResponse> => {
  try {
    const ai = getAiInstance();
    const parts: any[] = [{ text: prompt }];
    
    if (attachments && attachments.length > 0) {
        attachments.forEach(attachment => {
            if (attachment.mimeType.startsWith('image/') || attachment.mimeType.startsWith('video/')) {
                parts.push({ inlineData: { data: attachment.data, mimeType: attachment.mimeType } });
            } else {
                parts[0].text += `\n\n[FILE: ${attachment.name}]\n${atob(attachment.data)}`;
            }
        });
    }

    const financialData = bankingService.getFormattedStatus();
    const mobileData = qSimService.getFormattedStatus();
    
    const dynamicContext = `
${financialData}
${mobileData}

INBOUND_SOURCE: ${source === 'WHATSAPP' ? 'SECURE_WHATSAPP_UPLINK' : 'LOCAL_VPS_TERMINAL'}
MODE: ${source === 'WHATSAPP' ? 'TACTICAL_BRIEF' : 'FULL_VISUAL_INTERFACE'}
COMMANDER_STATUS: AUTHENTICATED
`;

    const selectedModel = isOverclocked ? MODEL_REASONING : MODEL_FAST;
    const thinkingBudget = isOverclocked ? OVERCLOCK_THINKING_BUDGET : THINKING_BUDGET_FAST;

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: { parts },
      config: {
        systemInstruction: GET_MUDDE_INSTRUCTION(activeModelName, dynamicContext),
        tools: [{ functionDeclarations: [...MEDIA_TOOLS, ...VPS_TOOLS, ...MT5_TOOLS, ...SUPABASE_TOOLS, ...BANKING_TOOLS, ...COMM_TOOLS] }],
        thinkingConfig: { thinkingBudget },
      },
    });

    const usage = response.usageMetadata;
    if (usage) {
        apiKeyManager.recordRealUsage(selectedModel, usage.promptTokenCount || 0, usage.candidatesTokenCount || 0);
    }

    const fCalls = response.functionCalls;
    const text = (fCalls && fCalls.length > 0) ? "" : (response.text || "Calculation returned null data.");
    
    let sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
        sources = chunks.filter((c: any) => c.web?.uri).map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
    }

    return { text, sources, functionCalls: fCalls };
  } catch (error) { throw error; }
};

export type ToolExecutor = (name: string, args: any) => Promise<any>;

export class LiveSessionManager {
  private inputContext: AudioContext | null = null;
  private outputContext: AudioContext | null = null;
  private inputSource: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private outputNode: GainNode | null = null;
  private inputAnalyser: AnalyserNode | null = null;
  private outputAnalyser: AnalyserNode | null = null;
  private inputDataArray: Uint8Array | null = null;
  private outputDataArray: Uint8Array | null = null;
  private nextStartTime = 0;
  private sessionPromise: Promise<any> | null = null;
  private activeSources = new Set<AudioBufferSourceNode>();
  private currentInputTranscription = '';
  private currentOutputTranscription = '';
  private micStream: MediaStream | null = null;
  private liveAiInstance: GoogleGenAI | null = null;
  private toolExecutor: ToolExecutor | null = null;

  getAudioLevels() { 
    if (!this.inputAnalyser || !this.outputAnalyser) return { input: 0, output: 0 }; 
    this.inputAnalyser.getByteFrequencyData(this.inputDataArray!); 
    this.outputAnalyser.getByteFrequencyData(this.outputDataArray!); 
    const getAvg = (arr: Uint8Array) => { 
      let sum = 0; for(let i = 0; i < arr.length; i++) sum += arr[i]; 
      return (sum / arr.length) / 255; 
    }; 
    return { input: getAvg(this.inputDataArray!), output: getAvg(this.outputDataArray!) }; 
  }

  async connect(
    onStatusChange: (active: boolean) => void, 
    onTranscript: (role: 'user' | 'model', text: string, isComplete: boolean) => void,
    toolExecutor?: ToolExecutor,
    systemInstructionContext?: string
  ) {
    try {
      this.toolExecutor = toolExecutor || null;
      this.inputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: SAMPLE_RATE_INPUT });
      this.outputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: SAMPLE_RATE_OUTPUT });
      
      await this.inputContext.resume();
      await this.outputContext.resume();

      this.inputAnalyser = this.inputContext.createAnalyser(); 
      this.inputAnalyser.fftSize = 64; 
      this.inputDataArray = new Uint8Array(this.inputAnalyser.frequencyBinCount);
      
      this.outputAnalyser = this.outputContext.createAnalyser(); 
      this.outputAnalyser.fftSize = 64; 
      this.outputDataArray = new Uint8Array(this.outputAnalyser.frequencyBinCount);
      
      this.outputNode = this.outputContext.createGain(); 
      this.outputNode.connect(this.outputAnalyser); 
      this.outputAnalyser.connect(this.outputContext.destination);

      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.liveAiInstance = getAiInstance();
      
      const financialData = bankingService.getFormattedStatus();
      const mobileData = qSimService.getFormattedStatus();
      const liveContext = `
${financialData}
${mobileData}
${systemInstructionContext || ""}
      `;

      const systemInstruction = GET_MUDDE_INSTRUCTION("MUDDE-PRIME-LIVE", liveContext);

      this.sessionPromise = this.liveAiInstance.live.connect({
          model: MODEL_LIVE,
          callbacks: {
            onopen: () => { 
              onStatusChange(true); 
              if (this.micStream) this.startAudioStreaming(this.micStream); 
              this.sessionPromise?.then(session => session.sendRealtimeInput({ 
                  media: { data: "", mimeType: "audio/pcm;rate=16000" }
              }));
            },
            onmessage: (msg: LiveServerMessage) => this.handleMessage(msg, onTranscript),
            onclose: () => { onStatusChange(false); this.disconnect(); },
            onerror: (e) => { console.error("Session Error", e); onStatusChange(false); this.disconnect(); }
          },
          config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } } },
              systemInstruction: systemInstruction,
              inputAudioTranscription: {},
              outputAudioTranscription: {},
              tools: [{ functionDeclarations: [...VPS_TOOLS, ...MEDIA_TOOLS, ...MT5_TOOLS, ...SUPABASE_TOOLS, ...BANKING_TOOLS, ...COMM_TOOLS] }]
          }
      });
      return this.sessionPromise;
    } catch (e) {
      console.error("Live Connection Error", e);
      onStatusChange(false);
      this.disconnect();
      throw e;
    }
  }

  private startAudioStreaming(stream: MediaStream) {
    if (!this.inputContext || !this.sessionPromise) return;
    this.inputSource = this.inputContext.createMediaStreamSource(stream);
    this.processor = this.inputContext.createScriptProcessor(2048, 1, 1);
    this.processor.onaudioprocess = (e) => { 
      const inputData = e.inputBuffer.getChannelData(0); 
      const pcmBlob = createPCM16Blob(inputData); 
      this.sessionPromise?.then(session => session.sendRealtimeInput({ media: pcmBlob }));
    };
    this.inputSource.connect(this.processor);
    
    const muteNode = this.inputContext.createGain();
    muteNode.gain.value = 0;
    this.processor.connect(muteNode);
    muteNode.connect(this.inputContext.destination);
  }

  private async handleMessage(message: LiveServerMessage, onTranscript: any) {
    const serverContent = message.serverContent;
    
    if (message.toolCall) {
        const functionCalls = message.toolCall.functionCalls;
        const functionResponses = [];
        
        for (const call of functionCalls) {
            console.log(`[LIVE_OP] Executing Function: ${call.name}`);
            let result: any = { result: "Function executed successfully." };
            
            if (this.toolExecutor) {
                try {
                    const execResult = await this.toolExecutor(call.name, call.args);
                    const sanitized = makeSerializable(execResult);
                    result = { result: sanitized };
                } catch (e: any) {
                    result = { result: `Error executing ${call.name}: ${e.message}` };
                }
            }
            
            functionResponses.push({
                id: call.id,
                name: call.name,
                response: result
            });
        }
        
        this.sessionPromise?.then(session => session.sendToolResponse({ functionResponses }));
    }

    if (!serverContent) return;

    if (serverContent.interrupted) { 
      this.stopAllSources(); 
      this.nextStartTime = 0; 
    }

    const base64Audio = serverContent.modelTurn?.parts?.[0]?.inlineData?.data;
    if (base64Audio && this.outputContext && this.outputNode) {
        this.nextStartTime = Math.max(this.nextStartTime, this.outputContext.currentTime);
        const audioBuffer = await decodeAudioData(base64ToUint8Array(base64Audio), this.outputContext, SAMPLE_RATE_OUTPUT, 1);
        const source = this.outputContext.createBufferSource(); 
        source.buffer = audioBuffer; 
        source.connect(this.outputNode);
        source.onended = () => this.activeSources.delete(source);
        source.start(this.nextStartTime); 
        this.activeSources.add(source); 
        this.nextStartTime += audioBuffer.duration;
    }

    if (serverContent.inputTranscription?.text) { 
      this.currentInputTranscription += serverContent.inputTranscription.text; 
      onTranscript('user', this.currentInputTranscription, false); 
    }
    if (serverContent.outputTranscription?.text) { 
      this.currentOutputTranscription += serverContent.outputTranscription.text; 
      onTranscript('model', this.currentOutputTranscription, false); 
    }
    
    if (serverContent.turnComplete) {
        if (this.currentInputTranscription) { onTranscript('user', this.currentInputTranscription, true); this.currentInputTranscription = ''; }
        if (this.currentOutputTranscription) { onTranscript('model', this.currentOutputTranscription, true); this.currentOutputTranscription = ''; }
    }
  }

  private stopAllSources() { 
    for (const source of this.activeSources) { try { source.stop(); } catch (e) {} } 
    this.activeSources.clear(); 
  }

  disconnect() { 
    this.stopAllSources(); 
    if (this.micStream) { this.micStream.getTracks().forEach(track => track.stop()); this.micStream = null; }
    if (this.inputContext?.state !== 'closed') this.inputContext?.close(); 
    if (this.outputContext?.state !== 'closed') this.outputContext?.close(); 
    if (this.sessionPromise) { this.sessionPromise.then(s => s.close()); this.sessionPromise = null; }
  }
}
