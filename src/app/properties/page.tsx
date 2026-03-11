import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  IndianRupee,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Property, PropertyImage } from "@/lib/schema/property.schema";
import { getPropertyFallbackImage } from "@/lib/property-images";

const ITEMS_PER_PAGE = 12;

const PROPERTY_TYPES = [
  { value: "", label: "All Types" },
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "independent_house", label: "House" },
  { value: "plot", label: "Plot" },
  { value: "commercial", label: "Commercial" },
];



interface Props {
  searchParams: Promise<{
    page?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    city?: string;
  }>;
}

export default async function PropertiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const typeFilter = params.type ?? "";
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const cityFilter = params.city ?? "";

  let query = supabase
    .from("properties")
    .select("*, property_images(id, image_url, is_cover, display_order)", { count: "exact" })
    .eq("is_active", true)
    .eq("status", "active");

  if (typeFilter) query = query.eq("property_type", typeFilter);
  if (minPrice) query = query.gte("asking_price", minPrice);
  if (maxPrice) query = query.lte("asking_price", maxPrice);
  if (cityFilter) query = query.ilike("city", `%${cityFilter}%`);

  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data: properties, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  const items = (properties ?? []) as (Property & { property_images?: Pick<PropertyImage, "id" | "image_url" | "is_cover" | "display_order">[] })[];
  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  function buildUrl(overrides: Record<string, string>) {
    const p = new URLSearchParams();
    if (typeFilter) p.set("type", typeFilter);
    if (minPrice) p.set("minPrice", String(minPrice));
    if (maxPrice) p.set("maxPrice", String(maxPrice));
    if (cityFilter) p.set("city", cityFilter);
    for (const [k, v] of Object.entries(overrides)) {
      if (v) p.set(k, v);
      else p.delete(k);
    }
    const qs = p.toString();
    return `/properties${qs ? `?${qs}` : ""}`;
  }

  const hasFilters = !!(typeFilter || cityFilter || minPrice || maxPrice);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Properties</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {totalCount} propert{totalCount !== 1 ? "ies" : "y"} available
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild className="rounded-xl">
              <Link href="/search">
                <Search size={15} className="mr-1.5" /> Search
              </Link>
            </Button>
            <Button asChild className="rounded-xl shadow-sm shadow-primary/20">
              <Link href="/properties/new">
                <Plus size={15} className="mr-1.5" /> List Property
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <form action="/properties" method="GET" className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal size={14} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filters</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <select
              name="type"
              defaultValue={typeFilter}
              className="bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <input
              name="city"
              defaultValue={cityFilter}
              placeholder="City..."
              className="bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all"
            />
            <input
              name="minPrice"
              type="number"
              defaultValue={minPrice ?? ""}
              placeholder="Min Price (₹)"
              className="bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all"
            />
            <input
              name="maxPrice"
              type="number"
              defaultValue={maxPrice ?? ""}
              placeholder="Max Price (₹)"
              className="bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              Apply Filters
            </button>
            {hasFilters && (
              <Link
                href="/properties"
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear All
              </Link>
            )}
          </div>
        </form>

        {/* Grid */}
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Building2 size={24} className="text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">No properties found</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {hasFilters
                ? "Try adjusting your filters"
                : "Be the first to list a property on CodeHunt"}
            </p>
            <div className="flex gap-3 justify-center mt-4">
              {hasFilters && (
                <Button variant="outline" asChild className="rounded-xl">
                  <Link href="/properties">Clear Filters</Link>
                </Button>
              )}
              <Button asChild className="rounded-xl">
                <Link href="/properties/new">
                  <Plus size={15} className="mr-1.5" /> List Your Property
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((p) => {
              const imgs = p.property_images ?? [];
              const coverImg = imgs.find((i) => i.is_cover) ?? imgs[0];
              // Enforce the use of curated fallback images rather than raw user uploads 
              // which may be irrelevant or poor quality, keeping the UI premium and consistent.
              const imgSrc = getPropertyFallbackImage(p.property_type, p.id);
              return (
                <Link
                  key={p.id}
                  href={`/properties/${p.id}`}
                  className="group block"
                >
                  <div className="bg-card rounded-xl border border-border overflow-hidden card-hover h-full flex flex-col">
                    {/* Property image */}
                    <div className="h-44 relative overflow-hidden">
                      <Image
                        src={imgSrc}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/90 dark:bg-black/70 text-foreground capitalize backdrop-blur-sm">
                        {p.property_type?.replace("_", " ")}
                      </span>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {p.title}
                      </h3>

                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin size={13} />
                        {p.city}, {p.state}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {p.bedrooms != null && (
                          <span className="flex items-center gap-1">
                            <BedDouble size={12} /> {p.bedrooms} BHK
                          </span>
                        )}
                        {p.bathrooms != null && (
                          <span className="flex items-center gap-1">
                            <Bath size={12} /> {p.bathrooms}
                          </span>
                        )}
                        {p.area_sqft != null && (
                          <span className="flex items-center gap-1">
                            <Ruler size={12} /> {p.area_sqft} sqft
                          </span>
                        )}
                      </div>

                      <p className="flex items-center gap-0.5 text-lg font-bold text-foreground mt-auto pt-2">
                        <IndianRupee size={16} />
                        {p.asking_price
                          ? Number(p.asking_price).toLocaleString("en-IN")
                          : "—"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-4">
            {page > 1 ? (
              <Link
                href={buildUrl({ page: String(page - 1) })}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <ChevronLeft size={14} /> Prev
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground bg-muted/30 border border-border rounded-lg cursor-not-allowed">
                <ChevronLeft size={14} /> Prev
              </span>
            )}

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <Link
                    key={pageNum}
                    href={buildUrl({ page: String(pageNum) })}
                    className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${pageNum === page
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card border border-border text-foreground hover:bg-muted"
                      }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>

            {page < totalPages ? (
              <Link
                href={buildUrl({ page: String(page + 1) })}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Next <ChevronRight size={14} />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground bg-muted/30 border border-border rounded-lg cursor-not-allowed">
                Next <ChevronRight size={14} />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
