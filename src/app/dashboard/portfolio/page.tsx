import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp,
  BarChart3,
  Building2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Target,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { regeneratePortfolio } from "@/actions/portfolio/portfolio";
import { PortfolioRealtimeListener } from "@/components/portfolio/realtime-listener";
import { PortfolioGeneratingBanner } from "@/components/portfolio/generating-banner";

/* ─────────────────────────────────────────────────── types ── */

interface Asset {
  id: string;
  property_id: string;
  asset_name: string;
  asset_type: string;
  purchase_value: number;
  current_value: number;
  roi_estimate: number | null;
  risk_level: string | null;
  ai_notes: string | null;
}

interface Portfolio {
  id: string;
  user_id: string;
  status: string;
  ai_summary: string | null;
  ai_analysis: Record<string, unknown> | null;
  total_invested: number | null;
  projected_value: number | null;
  projected_roi: number | null;
  last_generated_at: string | null;
}

/* ───────────────────────────────── helpers ── */

function riskColor(risk: string | null) {
  switch (risk?.toUpperCase()) {
    case "CONSERVATIVE":
    case "LOW":
      return "text-chart-2 bg-chart-2/10 border-chart-2/20";
    case "MODERATE":
    case "BALANCED":
      return "text-chart-3 bg-chart-3/10 border-chart-3/20";
    case "AGGRESSIVE":
    case "HIGH":
    case "VERY HIGH":
      return "text-chart-5 bg-chart-5/10 border-chart-5/20";
    default:
      return "text-muted-foreground bg-muted border-border";
  }
}

function healthColor(health: string | null) {
  switch (health?.toUpperCase()) {
    case "EXCELLENT":
      return "text-chart-2";
    case "GOOD":
      return "text-chart-1";
    case "FAIR":
      return "text-chart-3";
    case "NEEDS_ATTENTION":
    case "NEEDS ATTENTION":
      return "text-chart-5";
    default:
      return "text-muted-foreground";
  }
}

function fmt(amount: number | null | undefined) {
  if (amount == null) return "—";
  return (
    "₹" +
    Number(amount).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })
  );
}

/* ────────────────────────────────────────── page ── */

export default async function PortfolioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: portfolioRow } = await supabase
    .from("portfolios")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const portfolio = portfolioRow as Portfolio | null;

  let assets: Asset[] = [];
  if (portfolio) {
    const { data: assetRows } = await supabase
      .from("portfolio_assets")
      .select("*")
      .eq("portfolio_id", portfolio.id)
      .order("purchase_value", { ascending: false });
    assets = (assetRows ?? []) as Asset[];
  }

  const analysis = portfolio?.ai_analysis as Record<string, unknown> | null;
  const recommendations = (analysis?.recommendations as Array<{
    title: string;
    description: string;
    priority: string;
    type: string;
  }>) ?? [];
  const strengths = (analysis?.strengths as string[]) ?? [];
  const weaknesses = (analysis?.weaknesses as string[]) ?? [];

  const isGenerating = portfolio?.status === "generating";
  const isReady = portfolio?.status === "ready";
  const isFailed = portfolio?.status === "failed";
  const hasPending = !portfolio || portfolio.status === "pending";

  return (
    <div className="min-h-screen bg-background">
      <PortfolioRealtimeListener
        portfolioId={portfolio?.id ?? null}
        userId={user.id}
        initialStatus={portfolio?.status ?? "pending"}
      />

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-chart-1/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-chart-1" />
              </div>
              AI Portfolio
            </h1>
            <p className="text-muted-foreground mt-1.5 text-sm">
              Powered by Gemini · auto-generated after each property listing
            </p>
          </div>
          <form action={regeneratePortfolio}>
            <Button
              type="submit"
              variant="outline"
              className="flex items-center gap-2 rounded-xl"
              disabled={isGenerating}
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
              {isGenerating ? "Generating…" : "Regenerate"}
            </Button>
          </form>
        </div>

        {/* ── Status: pending / generating / failed ── */}
        {(hasPending || isGenerating) && (
          <PortfolioGeneratingBanner isGenerating={isGenerating} />
        )}

        {isFailed && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="flex items-center gap-3 py-6">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              <div>
                <p className="font-medium text-destructive">Portfolio generation failed</p>
                <p className="text-sm text-destructive/70 mt-0.5">
                  Click Regenerate to try again.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Portfolio ready content ── */}
        {isReady && portfolio && (
          <>
            {/* Summary row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="card-hover">
                <CardContent className="py-4">
                  <p className="text-xs text-muted-foreground mb-1">Total Invested</p>
                  <p className="text-xl font-bold text-foreground">
                    {fmt(portfolio.total_invested ?? (analysis?.total_invested as number))}
                  </p>
                </CardContent>
              </Card>
              <Card className="card-hover">
                <CardContent className="py-4">
                  <p className="text-xs text-muted-foreground mb-1">Projected Value</p>
                  <p className="text-xl font-bold text-chart-2">
                    {fmt(portfolio.projected_value ?? (analysis?.projected_value as number))}
                  </p>
                </CardContent>
              </Card>
              <Card className="card-hover">
                <CardContent className="py-4">
                  <p className="text-xs text-muted-foreground mb-1">Projected ROI</p>
                  <p className="text-xl font-bold text-chart-1">
                    {portfolio.projected_roi != null
                      ? `${Number(portfolio.projected_roi).toFixed(1)}%`
                      : (analysis?.projected_roi as number) != null
                        ? `${Number(analysis!.projected_roi).toFixed(1)}%`
                        : "—"}
                  </p>
                </CardContent>
              </Card>
              <Card className="card-hover">
                <CardContent className="py-4">
                  <p className="text-xs text-muted-foreground mb-1">Overall Health</p>
                  <p className={`text-lg font-bold ${healthColor(analysis?.overall_health as string)}`}>
                    {(analysis?.overall_health as string) ?? "—"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* AI Summary */}
            {portfolio.ai_summary && (
              <Card className="border-chart-1/20 bg-chart-1/[0.03]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2 text-chart-1">
                    <Sparkles className="w-4 h-4" /> AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 leading-relaxed">{portfolio.ai_summary}</p>
                  {portfolio.last_generated_at && (
                    <p className="text-xs text-muted-foreground mt-3">
                      Last updated:{" "}
                      {new Date(portfolio.last_generated_at).toLocaleString("en-IN")}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Risk + Diversification badges */}
            {(!!analysis?.risk_level || !!analysis?.diversification_score) && (
              <div className="flex flex-wrap gap-3">
                {!!analysis?.risk_level && (
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${riskColor(analysis.risk_level as string)}`}>
                    <ShieldCheck className="inline w-3.5 h-3.5 mr-1" />
                    Risk: {String(analysis.risk_level)}
                  </span>
                )}
                {!!analysis?.diversification_score && (
                  <span className="px-3 py-1.5 rounded-full text-sm font-medium border text-chart-1 bg-chart-1/10 border-chart-1/20">
                    <Target className="inline w-3.5 h-3.5 mr-1" />
                    Diversification Score: {Number(analysis.diversification_score)}/10
                  </span>
                )}
              </div>
            )}

            {/* Strengths & Weaknesses */}
            {(strengths.length > 0 || weaknesses.length > 0) && (
              <div className="grid md:grid-cols-2 gap-4">
                {strengths.length > 0 && (
                  <Card className="border-chart-2/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-chart-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1.5">
                        {strengths.map((s, i) => (
                          <li key={i} className="text-sm text-foreground/80 flex gap-2">
                            <span className="text-chart-2 mt-0.5 flex-shrink-0">✓</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                {weaknesses.length > 0 && (
                  <Card className="border-chart-3/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-chart-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Weaknesses
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1.5">
                        {weaknesses.map((w, i) => (
                          <li key={i} className="text-sm text-foreground/80 flex gap-2">
                            <span className="text-chart-3 mt-0.5 flex-shrink-0">!</span>
                            {w}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* AI Recommendations */}
            {recommendations.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-chart-1" /> AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                        <div
                          className={`mt-0.5 shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full h-fit ${rec.priority === "HIGH"
                              ? "bg-chart-5/10 text-chart-5"
                              : rec.priority === "MEDIUM"
                                ? "bg-chart-3/10 text-chart-3"
                                : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {rec.priority}
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{rec.title}</p>
                          <p className="text-muted-foreground text-sm mt-0.5">{rec.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Market Outlook */}
            {analysis?.market_outlook && (
              <Card className="border-chart-1/15 bg-chart-1/[0.03]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-chart-1">Market Outlook</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 text-sm leading-relaxed">
                    {analysis.market_outlook as string}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Assets table */}
            {assets.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" /> Portfolio Assets
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th className="px-4 py-3 font-medium text-muted-foreground">Asset</th>
                          <th className="px-4 py-3 font-medium text-muted-foreground">Purchase Value</th>
                          <th className="px-4 py-3 font-medium text-muted-foreground">Current Value</th>
                          <th className="px-4 py-3 font-medium text-muted-foreground">ROI Est.</th>
                          <th className="px-4 py-3 font-medium text-muted-foreground">Risk</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {assets.map((asset) => (
                          <tr key={asset.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3">
                              <p className="font-medium text-foreground">{asset.asset_name}</p>
                              {asset.ai_notes && (
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                  {asset.ai_notes}
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-3 text-foreground/80">{fmt(asset.purchase_value)}</td>
                            <td className="px-4 py-3 text-foreground/80">{fmt(asset.current_value)}</td>
                            <td className="px-4 py-3">
                              {asset.roi_estimate != null ? (
                                <span
                                  className={`font-semibold ${asset.roi_estimate >= 10
                                      ? "text-chart-2"
                                      : asset.roi_estimate >= 0
                                        ? "text-chart-1"
                                        : "text-chart-5"
                                    }`}
                                >
                                  {asset.roi_estimate.toFixed(1)}%
                                </span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {asset.risk_level ? (
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${riskColor(asset.risk_level)}`}>
                                  {asset.risk_level}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
