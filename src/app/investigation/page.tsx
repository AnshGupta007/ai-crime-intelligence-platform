"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, Brain, FileText, Users, MapPin, Link2, Sparkles,
  MessageSquare, Send, Clock, Shield, Eye, Target, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  actions?: { label: string; type: string }[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: "assistant",
    content: "Welcome to CIPAP Investigation Assistant. I'm powered by LLM + Knowledge Graph intelligence. I can help you with:\n\n• FIR Summary Generation\n• Related Case Discovery\n• Suspect Association Analysis\n• Investigation Timeline\n• Court-Ready Summary\n• Crime Section Suggestions\n\nAsk me anything about a case, suspect, or crime pattern.",
    timestamp: "Now",
    actions: [
      { label: "Generate FIR Summary for FIR/2025/0001", type: "fir_summary" },
      { label: "Find related cases for Burglary in Koramangala", type: "related_cases" },
      { label: "Analyze suspect: Ravi Kumar", type: "suspect_analysis" },
    ],
  },
];

export default function InvestigationPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text?: string) => {
    const userMsg = text || input;
    if (!userMsg.trim()) return;

    setMessages(prev => [...prev, { role: "user", content: userMsg, timestamp: "Now" }]);
    setInput("");
    setIsTyping(true);

    // Simulate LLM response
    setTimeout(() => {
      let response: Message;
      if (userMsg.toLowerCase().includes("fir summary") || userMsg.toLowerCase().includes("fir/2025/0001")) {
        response = {
          role: "assistant",
          content: "**FIR Summary — FIR/2025/0001**\n\n**Crime:** Burglary — Section 454 IPC\n**Location:** Koramangala 5th Block, Bengaluru Urban\n**Date of Occurrence:** 15 Nov 2025, 02:30 AM\n**Complainant:** Priya S (35/F), Resident of Koramangala\n\n**Brief Facts:**\nAccused broke into residential property during night hours. Stolen: Cash ₹50,000, Gold jewelry worth ₹2.5L, Laptop. MO matches 3 prior burglaries in same area.\n\n**Accused:** Ravi Kumar (32/M) — Repeat offender, 4 prior cases, Brigade Road Crew gang member.\n\n**AI Assessment:**\n- 91.2% confidence this is linked to Brigade Road Crew operations\n- MO pattern matches FIR/2025/0045 (Vehicle Theft, MG Road) — same accused\n- Shared vehicle KA-05-MZ-1234 used in both cases\n- Recommended: Cross-reference with FIR/2025/0089 for robbery pattern\n\n**Investigation Timeline:**\n- Nov 15: FIR registered at Koramangala PS\n- Nov 16: Accused identified through CCTV\n- Nov 18: Arrest made — Accused Ravi Kumar arrested by SI Murthy\n- Nov 20: Confession obtained — links to 2 other unsolved cases",
          timestamp: "Now",
          actions: [
            { label: "View related cases", type: "related" },
            { label: "Generate court-ready summary", type: "court" },
            { label: "Full suspect profile", type: "suspect" },
          ],
        };
      } else if (userMsg.toLowerCase().includes("related") || userMsg.toLowerCase().includes("burglary")) {
        response = {
          role: "assistant",
          content: "**Related Cases — Burglary Pattern in Koramangala**\n\nAI identified 5 related cases using crime embedding similarity + MO clustering:\n\n1. **FIR/2025/0001** — Burglary, Koramangala (91% match) — Same accused\n2. **FIR/2025/0045** — Vehicle Theft, MG Road (78% match) — Shared vehicle, co-accused\n3. **FIR/2024/0189** — Burglary, HSR Layout (72% match) — Same MO, same gang\n4. **FIR/2024/0312** — Burglary, JP Nagar (65% match) — Similar time pattern\n5. **FIR/2025/0089** — Robbery, Indiranagar (58% match) — Shared weapon\n\n**Criminal Network:**\nAll 5 cases link to Brigade Road Crew gang through:\n- Shared vehicle (KA-05-MZ-1234)\n- Shared mobile number (+91-98XXX)\n- Shared address (Koramangala 4th Block)\n\n**Recommendation:** Coordinate investigation across 5 cases. Combined chargesheet will strengthen prosecution.",
          timestamp: "Now",
          actions: [
            { label: "View network graph", type: "graph" },
            { label: "Generate combined chargesheet draft", type: "chargesheet" },
          ],
        };
      } else if (userMsg.toLowerCase().includes("ravi kumar") || userMsg.toLowerCase().includes("suspect")) {
        response = {
          role: "assistant",
          content: "**Suspect Profile — Ravi Kumar**\n\n**Personal:** 32/M, Koramangala, Bengaluru\n**Alias:** RK\n**Gang:** Brigade Road Crew (6 members)\n**Criminal History:** 4 prior cases\n\n**Case Timeline:**\n1. FIR/2023/0045 — Vehicle Theft (Convicted, 6 months)\n2. FIR/2024/0189 — Burglary, HSR Layout (Chargesheeted)\n3. FIR/2025/0045 — Vehicle Theft, MG Road (Under Investigation)\n4. FIR/2025/0001 — Burglary, Koramangala (Under Investigation)\n\n**AI Risk Assessment:**\n- Re-offend probability: 91.2% (within 30 days)\n- Currently on bail from Case #2\n- Active in same jurisdiction\n- 2 unsolved cases likely linked\n\n**Associations:**\n- Mohammed Ashraf (co-accused in Case #3)\n- Shared phone +91-98XXX with 3 other accused\n- Same gang: Brigade Road Crew\n\n**Recommended Actions:**\n1. Enhanced surveillance — place on watch list\n2. Cross-reference movement data with unsolved cases\n3. Coordinate with probation officer\n4. Consider bail cancellation application",
          timestamp: "Now",
          actions: [
            { label: "View full association graph", type: "graph" },
            { label: "Generate surveillance request", type: "surveillance" },
          ],
        };
      } else {
        response = {
          role: "assistant",
          content: `I've analyzed your query across the FIR database and knowledge graph.\n\n**Relevant Findings:**\n- 23 FIRs match the pattern you described\n- 6 repeat offenders associated with this crime type\n- 3 active hotspots detected in the relevant jurisdiction\n\nWould you like me to:\n1. Generate a detailed case summary\n2. Find related cases using crime embeddings\n3. Analyze suspect associations\n4. Predict crime risk for the area\n\nJust ask and I'll provide specific intelligence.`,
          timestamp: "Now",
          actions: [
            { label: "Deep dive analysis", type: "analysis" },
            { label: "Export report", type: "report" },
          ],
        };
      }
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="p-6 h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Brain className="w-7 h-7 text-indigo-400" />
            Investigation Assistant
          </h1>
          <p className="text-sm text-slate-400 mt-1">LLM-powered &bull; Knowledge Graph Enhanced &bull; Explainable AI</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="glass-card px-3 py-1.5 flex items-center gap-2 animate-pulse-glow">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-violet-400 font-medium">AI Active</span>
          </div>
        </div>
      </motion.div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "")}
          >
            {msg.role === "assistant" && (
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-indigo-400" />
              </div>
            )}
            <div className={cn("max-w-[80%] p-4 rounded-xl", msg.role === "user" ? "bg-indigo-600/30 border border-indigo-500/30" : "glass-card")}>
              <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">{msg.content}</div>
              {msg.actions && (
                <div className="flex flex-col gap-2 mt-3">
                  {msg.actions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleSend(action.label)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 text-xs text-indigo-300 hover:bg-indigo-600/20 hover:text-indigo-200 transition-all text-left"
                    >
                      <ChevronRight className="w-3 h-3" />
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
              <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {msg.timestamp}
              </div>
            </div>
            {msg.role === "user" && (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-emerald-400">IO</span>
              </div>
            )}
          </motion.div>
        ))}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="animate-pulse">Analyzing</span>
                <span>knowledge graph + FIR database + prediction models...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="glass-card p-4 flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about a case, suspect, crime pattern, or investigation strategy..."
          className="flex-1 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
        />
        <button onClick={() => handleSend()} className="px-4 py-2 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 transition-all flex items-center gap-2 text-sm font-medium">
          <Send className="w-4 h-4" /> Send
        </button>
      </div>
    </div>
  );
}
