import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Bot,
  TrendingUp,
  ShieldAlert,
  BarChart3,
  PieChart,
  AlertTriangle,
  Zap,
  ArrowRight,
  MapPin,
  Sparkles,
} from "lucide-react";

const agents = [
  {
    id: "property-valuation",
    name: "Property Valuation Agent",
    description:
      "AI-powered property valuation using market comparables, location analytics, and historical trends to give you an accurate fair-market estimate.",
    icon: TrendingUp,
    status: "ready" as const,
    iconBg: "bg-chart-1/10",
    iconColor: "text-chart-1",
    glowColor: "hover:shadow-chart-1/10",
  },
  {
    id: "investment-advisory",
    name: "Investment Advisory Agent",
    description:
      "Get personalized investment recommendations based on your risk tolerance, budget, and market conditions. Optimized for long-term portfolio growth.",
    icon: BarChart3,
    status: "ready" as const,
    iconBg: "bg-chart-2/10",
    iconColor: "text-chart-2",
    glowColor: "hover:shadow-chart-2/10",
  },
  {
    id: "offer-risk",
    name: "Offer Risk Assessment",
    description:
      "Analyze buyer and seller credibility, transaction history, and market volatility to assess the risk level of any property offer.",
    icon: ShieldAlert,
    status: "ready" as const,
    iconBg: "bg-chart-3/10",
    iconColor: "text-chart-3",
    glowColor: "hover:shadow-chart-3/10",
  },
  {
    id: "market-intelligence",
    name: "Market Intelligence Agent",
    description:
      "Real-time market trends, price movements, demand-supply metrics, and micro-market insights for informed decision-making.",
    icon: PieChart,
    status: "ready" as const,
    iconBg: "bg-chart-4/10",
    iconColor: "text-chart-4",
    glowColor: "hover:shadow-chart-4/10",
  },
  {
    id: "portfolio-optimization",
    name: "Portfolio Optimization Agent",
    description:
      "Maximize returns across your real estate portfolio with AI-driven rebalancing suggestions, diversification analysis, and exit timing.",
    icon: Zap,
    status: "ready" as const,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    glowColor: "hover:shadow-primary/10",
  },
  {
    id: "fraud-anomaly",
    name: "Fraud & Anomaly Detection",
    description:
      "Detect suspicious listings, price manipulation, fake documents, and anomalous transaction patterns using advanced ML models.",
    icon: AlertTriangle,
    status: "ready" as const,
    iconBg: "bg-chart-5/10",
    iconColor: "text-chart-5",
    glowColor: "hover:shadow-chart-5/10",
  },
  {
    id: "neighbourhood-analysis",
    name: "Neighbourhood Analysis Agent",
    description:
      "Comprehensive locality insights: nearby properties, amenities, connectivity, price trends, news, and livability scores for any area.",
    icon: MapPin,
    status: "ready" as const,
    iconBg: "bg-chart-2/10",
    iconColor: "text-chart-2",
    glowColor: "hover:shadow-chart-2/10",
  },
];

export default async function AgentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-chart-2/20 flex items-center justify-center">
              <Bot size={22} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Agents</h1>
              <p className="text-sm text-muted-foreground">
                Intelligent assistants to power your real estate decisions
              </p>
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents.map((agent) => {
            const Icon = agent.icon;
            const isReady = agent.status === "ready";

            return (
              <div
                key={agent.id}
                className={`group relative bg-card rounded-xl border border-border p-5 flex flex-col gap-4 card-hover hover:shadow-lg ${agent.glowColor}`}
              >
                {/* Status badge */}
                <span
                  className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isReady
                    ? "bg-chart-2/10 text-chart-2"
                    : "bg-muted text-muted-foreground"
                    }`}
                >
                  {isReady ? "Ready" : "Coming Soon"}
                </span>

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl ${agent.iconBg} flex items-center justify-center group-hover:scale-105 transition-transform`}
                >
                  <Icon size={24} className={agent.iconColor} />
                </div>

                {/* Text */}
                <div className="flex-1 space-y-1.5">
                  <h3 className="text-base font-semibold text-foreground leading-tight">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {agent.description}
                  </p>
                </div>

                {/* Action */}
                {isReady ? (
                  <Link
                    href={`/agents/${agent.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 mt-auto transition-colors"
                  >
                    Launch Agent <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground mt-auto cursor-default">
                    Notify Me <ArrowRight size={14} />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Info Banner */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                How do these agents work?
              </p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Our AI agents combine large language models with real-time market
                data, property records, and your personal preferences to deliver
                actionable insights. Each agent specializes in a specific domain
                and improves over time as it learns from more data points.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
