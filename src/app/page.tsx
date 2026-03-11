import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/lib/schema/property.schema";
import { PropertySearch } from "@/components/property-search";
import { NewlyLaunched } from "@/components/newly-launched";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  Bot,
  Search,
  TrendingUp,
  ShieldCheck,
  BarChart3,
  Sparkles,
  Zap,
  Target,
} from "lucide-react";
import { HERO_IMAGE } from "@/lib/property-images";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-up");
  }

  // Fetch recent properties for Newly Launched section
  const { data: recentProperties } = await supabase
    .from("properties")
    .select("*")
    .eq("is_active", true)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-primary/5 to-background py-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            AI-Powered Real Estate Intelligence
      <section className="w-full relative overflow-hidden py-24 sm:py-32 px-4 -mt-24">
        {/* Background image */}
        <Image
          src={HERO_IMAGE}
          alt="Modern cityscape with residential buildings"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={85}
        />
        {/* Gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative pt-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium mb-2">
            <Sparkles size={12} />
            AI-Powered Property Intelligence
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] drop-shadow-lg">
            Smarter Real Estate
            <br />
            <span className="text-white/90">Decisions, Faster</span>

          </h1>

          <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover, evaluate, and invest in properties with AI-powered valuations,
            risk analysis, and market intelligence — all in one platform.
          </p>

          {/* Search */}
          <div className="flex justify-center pt-2">
            <PropertySearch />
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="w-full max-w-5xl mx-auto px-4 mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatPill value="10K+" label="Properties Analyzed" />
          <StatPill value="₹500Cr+" label="Valuations Generated" />
          <StatPill value="98%" label="Prediction Accuracy" />
          <StatPill value="7" label="AI Agents Active" />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="w-full max-w-5xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickCard
            href="/properties"
            icon={<Building2 size={20} className="text-primary" />}
            title="Browse Properties"
            description="Explore active listings with AI insights"
            gradient="from-primary/10 to-primary/5"
          />
          <QuickCard
            href="/agents"
            icon={<Bot size={20} className="text-chart-2" />}
            title="AI Agents"
            description="Valuation, risk analysis & market intel"
            gradient="from-chart-2/10 to-chart-2/5"
          />
          <QuickCard
            href="/search"
            icon={<Search size={20} className="text-chart-4" />}
            title="Smart Search"
            description="Find by location, type, or budget"
            gradient="from-chart-4/10 to-chart-4/5"
          />
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-5xl mx-auto py-6 px-4">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-foreground">
            Why CodeHunt?
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            icon={<TrendingUp size={18} />}
            iconBg="bg-chart-1/10 text-chart-1"
            title="Smart Valuations"
            description="AI models trained on 10M+ data points for accurate property price estimates."
          />
          <FeatureCard
            icon={<ShieldCheck size={18} />}
            iconBg="bg-chart-2/10 text-chart-2"
            title="Risk Analysis"
            description="Comprehensive fraud detection and offer risk scoring before you commit."
          />
          <FeatureCard
            icon={<BarChart3 size={18} />}
            iconBg="bg-chart-3/10 text-chart-3"
            title="Market Intelligence"
            description="Real-time trends, demand-supply metrics, and micro-market analytics."
          />
          <FeatureCard
            icon={<Zap size={18} />}
            iconBg="bg-chart-4/10 text-chart-4"
            title="Portfolio Optimization"
            description="AI-driven rebalancing and exit timing for maximum returns."
          />
          <FeatureCard
            icon={<Target size={18} />}
            iconBg="bg-chart-5/10 text-chart-5"
            title="Neighbourhood Intel"
            description="Livability scores, amenities, connectivity, and price trends by area."
          />
          <FeatureCard
            icon={<Bot size={18} />}
            iconBg="bg-primary/10 text-primary"
            title="AI Assistants"
            description="Conversational agents that answer your real estate questions instantly."
          />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="w-full max-w-5xl mx-auto py-6 px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/90 to-primary/70 p-8 sm:p-10">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-white space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold">
                Ready to make data-driven property decisions?
              </h3>
              <p className="text-white/80 text-sm sm:text-base">
                List your first property and get instant AI-powered insights.
              </p>
            </div>
            <Link
              href="/properties/new"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Newly Launched */}
      <section className="w-full max-w-5xl mx-auto py-6 px-4 pb-16">
        <NewlyLaunched properties={(recentProperties ?? []) as Property[]} />
=======
        <NewlyLaunched properties={(recentProperties ?? []) as Property[]} />
>>>>>>> main
      </section>
    </div>
  );
}

/* ── Helper Components ───────────────────────────────────────────────── */

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 text-center card-hover">
      <p className="text-lg sm:text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

function QuickCard({
  href,
  icon,
  title,
  description,
  gradient,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-card border border-border rounded-xl p-5 flex items-start gap-4 card-hover"
    >
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
          {title}
          <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}

function FeatureCard({
  icon,
  iconBg,
  title,
  description,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3 card-hover">
      <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}>
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
