import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  IndianRupee,
  Calendar,
  ArrowLeft,
  Home,
  User,
  Clock,
  Phone,
} from "lucide-react";
import { MakeOfferForm } from "@/components/property/make-offer-form";
import { AIValuationCard } from "@/components/property/ai-valuation-card";
import { PropertyContextCard } from "@/components/property/property-context-card";
import { InvestmentInsightsCard } from "@/components/property/investment-insights-card";
import { PropertyImageUpload } from "@/components/property/property-image-upload";
import { OfferActions } from "@/components/property/offer-actions";
import { PropertyStatusManager } from "@/components/property/property-status-manager";
import { RealtimeValuationListener, RealtimeOfferListener, RealtimeContextListener, RealtimeInsightsListener } from "@/components/property/realtime-listeners";
import type { Property, PropertyImage } from "@/lib/schema/property.schema";
import type { Offer, Valuation } from "@/lib/schema/property.schema";
import Image from "next/image";
import { getPropertyFallbackImage } from "@/lib/property-images";

const typeEmoji: Record<string, string> = {
  apartment: "🏢",
  villa: "🏡",
  plot: "🌳",
  commercial: "🏪",
  independent_house: "🏠",
};

interface Props {
  params: Promise<{ propertyId: string }>;
}

export default async function PropertyDetailPage({ params }: Props) {
  const { propertyId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", propertyId)
    .single();

  if (error || !property) notFound();

  const p = property as Property;
  const isOwner = user.id === p.owner_id;

  let offers: (Offer & { buyer_name?: string; buyer_phone?: string })[] = [];
  if (isOwner) {
    const { data } = await supabase
      .from("offers")
      .select("*, profiles:buyer_id(full_name, phone)")
      .eq("property_id", propertyId)
      .order("created_at", { ascending: false });
    offers = ((data ?? []) as Array<Offer & { profiles: { full_name: string | null; phone: string | null } | null }>).map((o) => ({
      ...o,
      buyer_name: o.profiles?.full_name ?? undefined,
      buyer_phone: o.profiles?.phone ?? undefined,
    }));
  }

  let ownerName = "Unknown";
  let ownerPhone: string | null = null;
  if (p.owner_id) {
    const { data: ownerProfile } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", p.owner_id)
      .single();
    ownerName = ownerProfile?.full_name ?? "Unknown";
    ownerPhone = ownerProfile?.phone ?? null;
  }

  const { data: latestValuation } = await supabase
    .from("ai_property_valuations")
    .select("*")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const valuation = (latestValuation ?? null) as Valuation | null;

  const { data: propertyContext } = await supabase
    .from("property_context")
    .select("*")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: investmentInsight } = await supabase
    .from("ai_investment_insights")
    .select("*")
    .eq("user_id", p.owner_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: propertyImages } = await supabase
    .from("property_images")
    .select("*")
    .eq("property_id", propertyId)
    .order("display_order", { ascending: true });
  const images = (propertyImages ?? []) as PropertyImage[];
  const coverImage = images.find((img) => img.is_cover) ?? images[0] ?? null;

  const emoji = typeEmoji[p.property_type ?? ""] ?? "🏠";

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      {/* Supabase Realtime */}
      <RealtimeValuationListener propertyId={p.id} />
      <RealtimeContextListener propertyId={p.id} />
      <RealtimeInsightsListener userId={user.id} />
      {isOwner && <RealtimeOfferListener propertyId={p.id} />}

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back */}
        <Link
          href="/properties"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Properties
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover Image / Fallback */}
            {coverImage ? (
              <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-border shadow-sm">
                <Image
                  src={getPropertyFallbackImage(p.property_type, p.id)}
                  alt={p.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            ) : (
              <div className="h-64 sm:h-80 bg-gradient-to-br from-primary/10 via-accent/5 to-chart-2/10 rounded-2xl border border-border flex items-center justify-center shadow-sm">
                <span className="text-7xl">{emoji}</span>
              </div>
            )}

            {/* Image Gallery & Upload */}
            <div className="bg-card rounded-xl border border-border p-5">
              <PropertyImageUpload
                propertyId={p.id}
                initialImages={images}
                isOwner={isOwner}
              />
            </div>

            {/* Title + Meta */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">
                  {p.property_type?.replace("_", " ")}
                </span>
                <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${p.status === "active"
                  ? "bg-chart-2/10 text-chart-2"
                  : p.status === "sold"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                  }`}>
                  {p.status}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {p.title}
              </h1>
              <p className="flex items-center gap-1.5 text-muted-foreground mt-1.5">
                <MapPin size={15} />
                {p.address}, {p.city}, {p.state}
              </p>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <SpecCard icon={<Ruler size={18} />} label="Area" value={p.area_sqft ? `${p.area_sqft} sqft` : "—"} />
              <SpecCard icon={<BedDouble size={18} />} label="Bedrooms" value={p.bedrooms?.toString() ?? "—"} />
              <SpecCard icon={<Bath size={18} />} label="Bathrooms" value={p.bathrooms?.toString() ?? "—"} />
              <SpecCard icon={<Calendar size={18} />} label="Year Built" value={p.year_built?.toString() ?? "—"} />
            </div>

            {/* Description */}
            {p.description && (
              <div className="bg-card rounded-xl border border-border p-5">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Description
                </h2>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {p.description}
                </p>
              </div>
            )}

            {/* Offers (owner only) */}
            {isOwner && (
              <div className="bg-card rounded-xl border border-border p-5">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Offers Received ({offers.length})
                </h2>
                {offers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No offers yet.</p>
                ) : (
                  <div className="space-y-3">
                    {offers.map((offer) => (
                      <div
                        key={offer.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border gap-3"
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                            <IndianRupee size={13} className="shrink-0" />
                            <span className="truncate">{Number(offer.offer_price).toLocaleString("en-IN")}</span>
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 min-w-0">
                            <Clock size={11} className="shrink-0" />
                            <span className="shrink-0">{new Date(offer.created_at).toLocaleDateString("en-IN")}</span>
                            {offer.buyer_name && (
                              <span className="ml-1 truncate">· {offer.buyer_name}</span>
                            )}
                          </p>
                        </div>
                        <OfferActions
                          offerId={offer.id}
                          status={offer.status}
                          buyerName={offer.buyer_name}
                          buyerPhone={offer.buyer_phone}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* AI Valuation Report */}
            <AIValuationCard
              propertyId={p.id}
              askingPrice={p.asking_price}
              valuation={valuation}
            />

            {/* Neighbourhood Intelligence */}
            <PropertyContextCard context={propertyContext ?? null} />

            {/* Investment Insights */}
            <InvestmentInsightsCard insight={investmentInsight ?? null} />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Price Card */}
            <div className="bg-card rounded-xl border border-border p-5 sticky top-24 shadow-sm">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Asking Price</p>
              <p className="flex items-center gap-0.5 text-3xl font-bold text-foreground">
                <IndianRupee size={24} />
                {p.asking_price
                  ? Number(p.asking_price).toLocaleString("en-IN")
                  : "—"}
              </p>
              {p.area_sqft && p.asking_price && (
                <p className="text-xs text-muted-foreground mt-1">
                  ₹{Math.round(Number(p.asking_price) / Number(p.area_sqft)).toLocaleString("en-IN")} / sqft
                </p>
              )}

              <div className="border-t border-border my-4" />

              {/* Owner info */}
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-chart-2/20 flex items-center justify-center">
                  <User size={15} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{ownerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {isOwner ? "You (Owner)" : "Property Owner"}
                  </p>
                </div>
              </div>

              {/* Owner phone (non-owner view) */}
              {!isOwner && ownerPhone && (
                <a
                  href={`tel:${ownerPhone}`}
                  className="flex items-center gap-2 text-sm text-primary hover:underline mb-4"
                >
                  <Phone size={14} />
                  {ownerPhone}
                </a>
              )}

              {/* Make Offer (non-owner) */}
              {!isOwner && (
                <>
                  <div className="border-t border-border my-4" />
                  <MakeOfferForm propertyId={p.id} askingPrice={p.asking_price} />
                </>
              )}

              {isOwner && (
                <>
                  <div className="border-t border-border my-4" />
                  <PropertyStatusManager propertyId={p.id} currentStatus={p.status ?? "draft"} />
                  <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground mt-4 flex items-start gap-1.5">
                    <Home size={13} className="mt-0.5 flex-shrink-0" />
                    This is your property listing. Offers will appear above.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Spec Card ────────────────────────────────────────────────────────── */
function SpecCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card rounded-xl border border-border p-3.5 text-center card-hover">
      <div className="flex justify-center text-muted-foreground mb-1.5">{icon}</div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
    </div>
  );
}
