/**
 * Curated property images for realistic UI fallbacks.
 * Uses Unsplash photo IDs for high-quality, royalty-free images.
 * Selection is deterministic — same property always gets the same image.
 */

// ── Fallback property images by type ──────────────────────────────────

const PROPERTY_IMAGES: Record<string, string[]> = {
    apartment: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=500&fit=crop&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&q=80",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=500&fit=crop&q=80",
    ],
    villa: [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=500&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop&q=80",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=500&fit=crop&q=80",
    ],
    independent_house: [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=500&fit=crop&q=80",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=500&fit=crop&q=80",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop&q=80",
        "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=500&fit=crop&q=80",
        "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=500&fit=crop&q=80",
    ],
    plot: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop&q=80",
        "https://images.unsplash.com/photo-1592595896616-c37162298647?w=800&h=500&fit=crop&q=80",
        "https://images.unsplash.com/photo-1583086150247-497d396cd87b?w=800&h=500&fit=crop&q=80",
        "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=500&fit=crop&q=80",
    ],
    commercial: [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop&q=80",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop&q=80",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=500&fit=crop&q=80",
        "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800&h=500&fit=crop&q=80",
    ],
};

// Default fallback if type doesn't match
const DEFAULT_IMAGES = [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=500&fit=crop&q=80",
];

/**
 * Get a deterministic fallback image for a property.
 * Same property ID always returns the same image.
 */
export function getPropertyFallbackImage(
    propertyType: string | null,
    propertyId: string
): string {
    const images = PROPERTY_IMAGES[propertyType ?? ""] ?? DEFAULT_IMAGES;
    // Simple hash from property ID for deterministic selection
    let hash = 0;
    for (let i = 0; i < propertyId.length; i++) {
        hash = (hash * 31 + propertyId.charCodeAt(i)) | 0;
    }
    return images[Math.abs(hash) % images.length];
}

/**
 * Get a smaller thumbnail version of any image URL.
 * Adjusts Unsplash parameters for smaller dimensions.
 */
export function getThumbnailUrl(url: string, size = 200): string {
    if (url.includes("images.unsplash.com")) {
        return url.replace(/w=\d+/, `w=${size}`).replace(/h=\d+/, `h=${size}`);
    }
    return url;
}

// ── Hero image for landing page ───────────────────────────────────────

export const HERO_IMAGE =
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&h=900&fit=crop&q=80";

// ── Neighbourhood context images ──────────────────────────────────────

export const NEIGHBOURHOOD_IMAGES = {
    transit:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop&q=80",
    parks:
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=250&fit=crop&q=80",
    schools:
        "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=250&fit=crop&q=80",
    skyline:
        "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=250&fit=crop&q=80",
} as const;
