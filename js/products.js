/**
 * RG SHOP - Luxury Fragrance Catalog Data
 * Architectural & Contemporary Olfactory Creations
 * Handcrafted in our Artisan Atelier
 */

const FRAGRANCES = [
  {
    id: "averon",
    name: "Averon Extrait de Parfum",
    subtitle: "Smoky vetiver and dark patchouli.",
    tagline: "An enigmatic woody narrative inspired by twilight over brutalist stone structures.",
    price: 195,
    formattedPrice: "€195",
    family: "Woody",
    occasion: "Signature",
    intensity: "Medium",
    intensityValue: 2,
    inStock: true,
    stockStatus: "In Stock - Dispatches Today",
    size: "50ml / 1.7 FL. OZ.",
    sizes: [
      { ml: 50, price: 195, label: "50ml - €195" },
      { ml: 100, price: 285, label: "100ml - €285" }
    ],
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "Averon Extrait de Parfum Bottle on architectural stone",
    gallery: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=1000&auto=format&fit=crop"
    ],
    notes: {
      top: ["Haitian Vetiver", "Cardamom", "Pink Peppercorn"],
      heart: ["Indonesian Patchouli", "Atlas Cedar", "Smoked Papyrus"],
      base: ["Ambergris", "Birch Tar", "Bourbon Vanilla"]
    },
    sillage: "Moderate to Pronounced",
    longevity: "10 - 12 Hours",
    description: "Averon balances the raw earthly grounding of wild vetiver with the mysterious depth of aged patchouli and whispered birch tar. Formulated with high-concentration extrait de parfum, it rests close on warm skin with architectural restraint.",
    featured: true,
    badge: "Bestseller"
  },
  {
    id: "lumera",
    name: "Lumera Extrait de Parfum",
    subtitle: "Radiant jasmine and sparkling bergamot.",
    tagline: "A luminous burst of Mediterranean citrus grounded by creamy night-blooming white florals.",
    price: 205,
    formattedPrice: "€205",
    family: "Floral",
    occasion: "Daytime",
    intensity: "Light",
    intensityValue: 1,
    inStock: true,
    stockStatus: "In Stock - Dispatches Today",
    size: "50ml / 1.7 FL. OZ.",
    sizes: [
      { ml: 50, price: 205, label: "50ml - €205" },
      { ml: 100, price: 295, label: "100ml - €295" }
    ],
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "Lumera Extrait de Parfum Bottle on Italian marble",
    gallery: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop"
    ],
    notes: {
      top: ["Calabrian Bergamot", "Neroli Petals", "Green Mandarin"],
      heart: ["Grasse Jasmine Grandiflorum", "Ylang-Ylang", "White Tea Leaf"],
      base: ["Crystal Musk", "Cashmere Wood", "Golden Benzoin"]
    },
    sillage: "Elegant & Airy",
    longevity: "8 - 10 Hours",
    description: "Capturing the golden morning light over historic courtyards. Lumera opens with crystalline sparkling citrus before evolving into an intoxicating, petal-soft halo of hand-harvested jasmine.",
    featured: true,
    badge: "Editor's Choice"
  },
  {
    id: "santal-noir",
    name: "Santal Noir Extrait de Parfum",
    subtitle: "Australian sandalwood, cardamom and black pepper.",
    tagline: "Rich, creamy sandalwood cut through with chilled spices and dark resins.",
    price: 215,
    formattedPrice: "€215",
    family: "Woody",
    occasion: "Evening",
    intensity: "Intense",
    intensityValue: 3,
    inStock: true,
    stockStatus: "Low Stock - Only 6 Left",
    size: "50ml / 1.7 FL. OZ.",
    sizes: [
      { ml: 50, price: 215, label: "50ml - €215" },
      { ml: 100, price: 310, label: "100ml - €310" }
    ],
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "Santal Noir Extrait de Parfum Bottle",
    gallery: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop"
    ],
    notes: {
      top: ["Crushed Cardamom", "Black Peppercorn", "Violet Leaves"],
      heart: ["Creamy Santalum Album", "Iris Concrete", "Incense Smoke"],
      base: ["Sandalwood Bark", "Dark Leather", "Musk Accord"]
    },
    sillage: "Bold & Magnetic",
    longevity: "12+ Hours",
    description: "An homage to nocturnal mystery. Santal Noir juxtaposes the velvety comfort of rare Australian sandalwood with sharp smoky cardamom, developing into a sultry, lingering signature.",
    featured: true,
    badge: "Private Blend"
  },
  {
    id: "amber-celeste",
    name: "Ambre Céleste Extrait de Parfum",
    subtitle: "Warm labdanum, golden resin and tonka bean.",
    tagline: "Liquid gold crystallized into a sensual, enveloping aura.",
    price: 225,
    formattedPrice: "€225",
    family: "Amber",
    occasion: "Evening",
    intensity: "Intense",
    intensityValue: 3,
    inStock: true,
    stockStatus: "In Stock - Dispatches Today",
    size: "50ml / 1.7 FL. OZ.",
    sizes: [
      { ml: 50, price: 225, label: "50ml - €225" },
      { ml: 100, price: 320, label: "100ml - €320" }
    ],
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "Ambre Céleste Extrait de Parfum Bottle",
    gallery: [
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=1000&auto=format&fit=crop"
    ],
    notes: {
      top: ["Spanish Cistus Labdanum", "Bitter Almond", "Saffron Thread"],
      heart: ["Benzoin Tears", "Roasted Tonka Bean", "Cinnamon Bark"],
      base: ["Madagascar Vanilla Infusion", "Dark Ambergris", "Opoponax"]
    },
    sillage: "Intense & Enveloping",
    longevity: "14+ Hours",
    description: "Ambre Céleste is a luxurious celebration of the ancient amber resin trade. Enriched with rare Spanish labdanum and rich roasted tonka bean for unforgettable depth.",
    featured: true,
    badge: "Rare Harvest"
  },
  {
    id: "cypres-royal",
    name: "Cyprès Royal Extrait de Parfum",
    subtitle: "Sun-drenched cypress needles and bitter citrus.",
    tagline: "Crisp alpine greenery bathed in golden Iberian sunshine.",
    price: 190,
    formattedPrice: "€190",
    family: "Citrus",
    occasion: "Daytime",
    intensity: "Light",
    intensityValue: 1,
    inStock: true,
    stockStatus: "In Stock - Dispatches Today",
    size: "50ml / 1.7 FL. OZ.",
    sizes: [
      { ml: 50, price: 190, label: "50ml - €190" },
      { ml: 100, price: 280, label: "100ml - €280" }
    ],
    image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "Cyprès Royal Extrait de Parfum Bottle",
    gallery: [
      "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=1000&auto=format&fit=crop"
    ],
    notes: {
      top: ["Spanish Lemon Peel", "Bitter Orange", "Juniper Berry"],
      heart: ["Mediterranean Cypress Needle", "Rosemary", "Sage Absolute"],
      base: ["Dry Cedarwood", "Oakmoss", "Clean White Amber"]
    },
    sillage: "Crisp & Refreshing",
    longevity: "7 - 9 Hours",
    description: "Inspired by the stately cypress gardens of the Royal Palace. Fresh aromatic conifers and zesty citrus peel deliver an uplifting, pristine olfactory clarity.",
    featured: false,
    badge: "New Release"
  },
  {
    id: "fleur-blanche",
    name: "Fleur Blanche Extrait de Parfum",
    subtitle: "Tuberose, neroli blossom and silky musks.",
    tagline: "A modern sculptural bouquet of velvet white florals.",
    price: 210,
    formattedPrice: "€210",
    family: "Floral",
    occasion: "Signature",
    intensity: "Medium",
    intensityValue: 2,
    inStock: true,
    stockStatus: "In Stock - Dispatches Today",
    size: "50ml / 1.7 FL. OZ.",
    sizes: [
      { ml: 50, price: 210, label: "50ml - €210" },
      { ml: 100, price: 300, label: "100ml - €300" }
    ],
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "Fleur Blanche Luxury White Floral Fragrance Flacon",
    gallery: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop"
    ],
    notes: {
      top: ["Orange Blossom Water", "Freesia", "Dewy Pear"],
      heart: ["Indian Tuberose Absolute", "Gardenia Petals", "Magnolia"],
      base: ["Silk Musks", "Blonde Woods", "Cashmere"]
    },
    sillage: "Graceful & Addictive",
    longevity: "9 - 11 Hours",
    description: "Fleur Blanche redefines the classic white floral profile into a sleek, contemporary statement. Sensual tuberose is softened by orange blossom and silky cocooning musks.",
    featured: false,
    badge: "Limited Batch"
  }
];

const COLLECTIONS = [
  {
    id: "architectural-series",
    title: "The Architectural Series",
    description: "Fragrances sculpted around structural geometry, raw minerals, and minimalist silences.",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop",
    count: "4 Creations",
    tag: "Core Atelier"
  },
  {
    id: "private-harvest-blend",
    title: "Atelier Private Harvest Blend",
    description: "High-concentration extraits crafted with rare historic botanicals.",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop",
    count: "3 Rare Editions",
    tag: "Private Harvest"
  },
  {
    id: "evening-silhouettes",
    title: "Evening Silhouettes",
    description: "Deep resins, smoky woods, and night-blooming accords formulated for nocturnal sophistication.",
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=1000&auto=format&fit=crop",
    count: "3 Formulations",
    tag: "Nocturne"
  },
  {
    id: "discovery-set",
    title: "The Discovery Coffret",
    description: "Experience the complete spectrum with five 5ml sample vials accompanied by a voucher redeemable on full flacons.",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop",
    count: "5 x 5ml Vials",
    price: "€48",
    tag: "Complimentary Voucher"
  }
];

if (typeof window !== "undefined") {
  window.FRAGRANCES = FRAGRANCES;
  window.COLLECTIONS = COLLECTIONS;
}
