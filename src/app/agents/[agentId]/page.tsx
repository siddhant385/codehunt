import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AgentChat } from "@/components/agents/agent-chat";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("@/components/ui/globe"));

const agentInfo: Record<
  string,
  { name: string; description: string; emoji: string; placeholder: string }
> = {
  "property-valuation": {
    name: "Property Valuation Agent",
    description:
      "Get AI-powered property valuations using market comparables and location analytics.",
    emoji: "📊",
    placeholder:
      "Describe a property to get its estimated valuation (e.g., 3BHK apartment in Sector 62, Noida, 1800 sqft)...",
  },
  "investment-advisory": {
    name: "Investment Advisory Agent",
    description:
      "Get personalized investment recommendations based on your profile and market conditions.",
    emoji: "💡",
    placeholder:
      "Ask about investment opportunities (e.g., Best areas to invest 50L in Bangalore for rental yield)...",
  },
  "market-intelligence": {
    name: "Market Intelligence Agent",
    description:
      "Real-time market trends, price movements, and micro-market insights.",
    emoji: "📈",
    placeholder:
      "Ask about market trends (e.g., How has the property market in Pune performed in the last 6 months?)...",
  },
  "offer-risk": {
    name: "Offer Risk Assessment Agent",
    description:
      "Analyze offer amounts, buyer credibility, and market volatility to assess transaction risk.",
    emoji: "🛡️",
    placeholder:
      "Ask about offer risks (e.g., I received an offer of 85L on my 2BHK in Gurgaon listed at 95L — should I accept?)...",
  },
  "portfolio-optimization": {
    name: "Portfolio Optimization Agent",
    description:
      "AI-driven rebalancing, diversification analysis, and exit timing for your portfolio.",
    emoji: "⚡",
    placeholder:
      "Ask about your portfolio (e.g., Analyze my portfolio and suggest diversification strategies)...",
  },
  "fraud-anomaly": {
    name: "Fraud & Anomaly Detection Agent",
    description:
      "Detect suspicious listings, price manipulation, and anomalous patterns.",
    emoji: "🔍",
    placeholder:
      "Ask about listing integrity (e.g., Check if a 3BHK in Mumbai listed at 15L is legitimate)...",
  },
  "neighbourhood-analysis": {
    name: "Neighbourhood Analysis Agent",
    description:
      "Comprehensive locality insights: nearby properties, amenities, price trends, and livability analysis.",
    emoji: "📍",
    placeholder:
      "Ask about a neighbourhood (e.g., What's the real estate market like around Whitefield, Bangalore? or Analyze the locality around lat 12.97, lng 77.75)...",
  },
};

interface Props {
  params: Promise<{ agentId: string }>;
}

export default async function AgentDetailPage({ params }: Props) {
  const { agentId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const agent = agentInfo[agentId];
  if (!agent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-4xl">🤖</p>
          <h2 className="text-lg font-semibold text-foreground">Agent Not Found</h2>
          <p className="text-sm text-muted-foreground">
            This agent doesn&#39;t exist or is coming soon.
          </p>
          <Link
            href="/agents"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <ArrowLeft size={14} /> Back to Agents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* 
        Layer 1: Globe Background
        Placed at the back, opacity controlled by the Globe component
      */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center">
        <Globe opacity={0.25} />
      </div>

      {/* 
        Layer 2: Gradient Overlays 
        Helps text remain readable and gives depth
      */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none z-10 bg-gradient-to-t from-background to-transparent" />

      {/* 
        Layer 3: Main Interface (Header + Chat)
        Positioned relative to sit above the absolute background layers
      */}
      <div className="relative z-20 flex flex-col flex-1 h-full">
        {/* Header */}
        <div className="border-b border-border/50 bg-background/40 backdrop-blur-md px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <Link
              href="/agents"
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted/50"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary/15 to-chart-2/15 flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl">{agent.emoji}</span>
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <h1 className="text-sm font-semibold text-foreground truncate">{agent.name}</h1>
              <p className="text-xs text-muted-foreground truncate">{agent.description}</p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium text-chart-2 bg-chart-2/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-chart-2 animate-pulse" />
              Online
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <AgentChat agentId={agentId} agentName={agent.name} placeholder={agent.placeholder} />
      </div>
    </div>
  );
}
