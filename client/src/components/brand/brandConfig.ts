import type { BrandGalleryProps } from "./BrandGallery";
import type { BrandHeroProps } from "./BrandHero";
import type { BrandBannerProps } from "./BrandBanner";
import type { BrandBenefitsProps } from "./BrandBenefits";
import type { BrandStatsProps } from "./BrandStats";
import type { BrandFAQProps } from "./BrandsFaq";

export const A = (p: string) =>
  new URL(
    // "/src/assets/gallery/x.webp" -> "assets/gallery/x.webp"
    p.trim()
      .replace(/^['"]|['"]$/g, "") // снять лишние кавычки
      .replace(/^\/+/, "")         // убрать лидирующий /
      .replace(/^src\//, ""),      // убрать префикс src/
    // brandConfig.ts находится в src/components/... -> до src нужно подняться на два уровня
    import.meta.url.replace(/\/components\/.*$/, "/") // базой остаётся файл модуля
  ).href;

type Brand = {
  slug: string;
  name: string;
  models: string;
  hero: BrandHeroProps;
  gallery?: BrandGalleryProps;
  banner?: BrandBannerProps;
  benefits?: BrandBenefitsProps;
  stats?: BrandStatsProps;
  faq?: BrandFAQProps;
};

export const BRANDS: Record<string, Brand> = {
  "mercedes-benz": {
    slug: "mercedes-benz",
    name: "Mercedes-Benz",

    hero: {
      brand: "mercedes-benz",
      headline: ["The all new", "Mercedes EQE", "4MATIC+"],
      subheading: "Born for the Boldest",
      media: {
        kind: "video",
        src: A("/assets/heroVids/mbVid.webm"),
        poster: A("/src/assets/posters/mbPoster.webp"),
        autoPlay: true,
        loop: true,
        muted: true,
      },
      ctas: [{ label: "Learn more", href: "/evs/mercedes-benz-eqe" }],
      overlay: true,
    },

    gallery: {
      title: "Design details of Mercedes-EQ",
      subtitle: "Signature lights, sculpted wheels and the MBUX-driven cockpit.",
      layout: "feature-right",
      widthPattern: [2, 1, 2, 1],
      rowPattern: [2, 2, 2, 2],
      items: [
        { src: A("/src/assets/gallery/mbCard4.webp"), alt: "EQS SUV headlights close-up",
          caption: "Striking EQS SUV design feature: new radiator trim with chrome applications and upright star." },
        { src: A("/src/assets/gallery/mbCard1.webp"), alt: "EQS interior with Hyperscreen",
          caption: "Red gold elements in the interior hint at the electric character." },
        { src: A("/src/assets/gallery/mbCard2.webp"), alt: "LED light strip at rear",
          caption: "LED light strip at front and rear for high recognition by day and night." },
        { src: A("/src/assets/gallery/mbCard3.webp"), alt: "Aero wheel close-up",
          caption: "Wheel designs specially developed for Mercedes-EQ electric cars." }
      ]
    },

    models: "mercedes-benz",

    banner: {
      title: "THE NEXT LEVEL OF LUXURY.",
      subtitle: "Drive the all-new Mercedes EQE and experience unmatched performance.",
      ctaLabel: "Discover More",
      ctaHref: "/mercedes-benz/eqe",
      bgImage: A("/src/assets/banner/mb.webp"),
      bgSize: "cover",
    },

    benefits: {
      title: "Charging & convenience",
      subtitle: "Plug & Charge, guided navigation and home solutions.",
      items: [
        {
          image: A("/src/assets/benefits/mb-1.jpg"),
          alt: "Mercedes at fast charger",
          title: "Plug & Charge simplicity.",
          text: "Authenticate automatically at compatible stations and just plug in — charging starts instantly."
        },
        {
          image: A("/src/assets/benefits/mb-2.webp"),
          alt: "Mercedes me Charge app",
          title: "One app for many networks.",
          text: "Mercedes me Charge brings access to major networks and transparent pricing in one place."
        },
        {
          image: A("/src/assets/benefits/mb-3.avif"),
          alt: "Mercedes home wallbox",
          title: "Home charging made easy.",
          text: "Install a wallbox for overnight charging and manage charging schedules right from the car or app."
        }
      ]
    },

    stats: {
      title: "Quick facts",
      subtitle: "What you get with Mercedes-EQ.",
      items: [
        { value: "≈628 km", label: "Max EPA range", note: "EQS 450+" },
        { value: "~31 min", label: "10→80% DC charging", note: "High-power station" },
        { value: "8 yrs / 100k", label: "Battery warranty", note: "Whichever comes first" }
      ]
    },

    faq: {
      title: "FAQ",
      items: [
        { q: "Does navigation plan charging stops?", a: "Yes, the system routes via compatible chargers and estimates arrival SoC." },
        { q: "Is there Plug & Charge?", a: "Supported with selected networks and compatible stations." },
        { q: "What home charging options are available?", a: "A Level 2 wallbox is recommended for overnight charging." }
      ]
    },
  },

  tesla: {
    slug: "tesla",
    name: "Tesla",

    hero: {
      brand: "tesla",
      headline: ["Model 3", "Quick. Nimble. Efficient."],
      subheading: "Order online for touchless delivery.",
      media: {
        kind: "image",
        src: A("/src/assets/heroVids/posters/teslaPoster.png"),
        alt: "Tesla Model 3"
      },
      ctas: [
        { label: "Order now", href: "/evs/tesla-model-3" },
        { label: "Demo drive", href: "/brand/tesla/test-drive", variant: "secondary" },
      ],
      overlay: true,
    },

    gallery: {
      title: "Design details of Tesla",
      subtitle: "Clean lines, glass roof and a driver-focused cabin.",
      layout: "feature-left",
      widthPattern: [2, 1, 2, 1],
      rowPattern: [2, 2, 2, 2],
      items: [
        { src: A("/src/assets/gallery/tsCard1.webp"), alt: "Tesla LED headlights close-up",
          caption: "Sharper LED headlights and a sculpted front fascia." },
        { src: A("/src/assets/gallery/tsCard2.webp"), alt: "Tesla interior with central touchscreen",
          caption: "Minimalist cabin with a large central touchscreen." },
        { src: A("/src/assets/gallery/tsCard3.webp"), alt: "Tesla rear three-quarter view",
          caption: "Continuous light signature and aero-optimized silhouette." },
        { src: A("/src/assets/gallery/tsCard4.webp"), alt: "Tesla aero wheels close-up",
          caption: "Aerodynamic wheel designs developed for efficiency." }
      ]
    },

    models: "tesla",

    banner: {
      title: "THE FUTURE IS NOW.",
      subtitle: "Drive the future with the all-new Tesla Model 3.",
      ctaLabel: "Order Now",
      ctaHref: "/tesla/model-3",
      bgImage: A("/src/assets/banner/tesla.png"),
      bgSize: "cover",
    },

    benefits: {
      title: "Everyday Tesla benefits",
      subtitle: "Superchargers, app-first ownership and home charging.",
      items: [
        {
          image: A("/src/assets/benefits/tesla-1.avif"),
          alt: "Tesla at Supercharger",
          title: "Supercharger network.",
          text: "Thousands of high-power Superchargers with automatic routing and preconditioning."
        },
        {
          image: A("/src/assets/benefits/tesla-2.webp"),
          alt: "Tesla mobile app",
          title: "App-first ownership.",
          text: "Remote control, climate preconditioning, charging limits and trip planning — all in the app."
        },
        {
          image: A("/src/assets/benefits/tesla-3.avif"),
          alt: "Tesla home charging",
          title: "Convenient at home.",
          text: "Wall Connector for fast overnight charging and scheduled departure to start every day at 100%."
        }
      ]
    },

    stats: {
      title: "Quick facts",
      items: [
        { value: "Supercharger", label: "Largest fast-charge network" },
        { value: "OTA", label: "Frequent software updates" },
        { value: "Autopilot", label: "Advanced driver assist" }
      ]
    },

    faq: {
      title: "FAQ",
      items: [
        { q: "Do I need the app?", a: "Yes, the Tesla app handles keys, charging, climate and more." },
        { q: "What connector is used?", a: "Most new Teslas use NACS; adapters may be needed for other networks." },
        { q: "Can I schedule charging?", a: "Yes, set limits and departure times from the app or the car." }
      ]
    },
  },

  bmw: {
    slug: "bmw",
    name: "BMW",

    hero: {
      brand: "bmw",
      headline: ["THE i5", "Born Electric"],
      subheading: "Business athlete, redefined.",
      media: {
        kind: "video",
        src: A("/src/assets/heroVids/bmwVid.webm"),
        poster: A("/src/assets/posters/mboster.webp"),
        autoPlay: true,
        loop: true,
        muted: true,
      },
      ctas: [{ label: "Build & price", href: "/evs/bmw-i5" }],
      overlay: true,
    },

    gallery: {
      title: "Design details of BMW i5",
      subtitle: "Iconic proportions, tech-forward cockpit and efficient aero.",
      layout: "feature-right",
      widthPattern: [2, 1, 2, 1],
      rowPattern: [2, 2, 2, 2],
      items: [
        { src: A("/src/assets/gallery/bmwCard3.jpg"), alt: "BMW illuminated grille and headlights",
          caption: "Striking front with illuminated contour and precise LED headlights." },
        { src: A("/src/assets/gallery/bmwCard1.jpg"), alt: "BMW i5 interior with Curved Display",
          caption: "Curved Display and an interaction light bar across the dashboard." },
        { src: A("/src/assets/gallery/bmwCard4.jpg"), alt: "BMW i5 rear three-quarter view",
          caption: "Slim L-shaped taillights and a dynamic roofline." },
        { src: A("/src/assets/gallery/bmwCard2.webp"), alt: "BMW aerodynamic wheel close-up",
          caption: "Aerodynamic wheel designs that reduce drag and noise." }
      ]
    },

    models: "bmw",

    banner: {
      title: "THE FUTURE OF DRIVING.",
      subtitle: "The all-new BMW i4: Luxury, performance, and electric power.",
      ctaLabel: "Build Your i4",
      ctaHref: "/evs/bmw-i4",
      bgImage: A("/src/assets/banner/bmw.webp"),
      bgSize: "cover",
    },

    benefits: {
      title: "BMW electric ownership",
      subtitle: "Complimentary charging, one app and home convenience.",
      items: [
        {
          image: A("/src/assets/benefits/bmw-1.jpg"),
          alt: "BMW charging at night",
          title: "Complimentary charging.",
          text: "Save with offers on major networks and enjoy quick authentication with Plug & Charge."
        },
        {
          image: A("/src/assets/benefits/bmw-2.jpg"),
          alt: "My BMW app",
          title: "One app, countless stations.",
          text: "Find, start and pay for charging from the My BMW App across large partner networks."
        },
        {
          image: A("/src/assets/benefits/bmw-3.jpg"),
          alt: "BMW at home",
          title: "Convenience at home.",
          text: "Charge from a household outlet or install a BMW Wallbox with our trusted partner."
        }
      ]
    },

    stats: {
      title: "Quick facts",
      items: [
        { value: "≈586 km", label: "Max EPA range", note: "iX xDrive50" },
        { value: "~30 min", label: "10→80% DC charging" },
        { value: "My BMW", label: "App-first experience" }
      ]
    },

    faq: {
      title: "FAQ",
      items: [
        { q: "Is charging included?", a: "Promos vary by model and market; check current offers." },
        { q: "Does iDrive plan charging?", a: "Yes, route planning includes charging stops and pre-conditioning." },
        { q: "Wallbox options?", a: "BMW Wallbox or partner solutions for Level 2 home charging." }
      ]
    },
  },

  audi: {
    slug: "audi",
    name: "Audi",

    hero: {
      brand: "audi",
      headline: ["RS e-tron family", "Progress, electrified."],
      subheading: "Design meets electric performance.",
      media: {
        kind: "image",
        src: A("/src/assets/heroVids/posters/audiPoster.avif"),
        alt: "Audi RS e-tron GT",
      },
      ctas: [],
      overlay: true,
    },

    models: "audi",

    gallery: {
      title: "Design details of Audi",
      subtitle: "quattro DNA, progressive cockpit and refined aero.",
      layout: "feature-left",
      widthPattern: [2, 1, 2, 1],
      rowPattern: [2, 2, 2, 2],
      items: [
        { src: A("/src/assets/gallery/audiCard1.webp"), alt: "Audi Matrix LED close-up",
          caption: "Matrix LED lighting signature with dynamic turn indicators." },
        { src: A("/src/assets/gallery/audiCard2.avif"), alt: "Audi Virtual Cockpit interior",
          caption: "Virtual Cockpit and MMI touch response with haptic feedback." },
        { src: A("/src/assets/gallery/audiCard3.webp"), alt: "Audi rear light bar",
          caption: "Continuous rear light bar emphasizes width and stance." },
        { src: A("/src/assets/gallery/audiCard4.jpg"), alt: "Aero wheel close-up",
          caption: "Aero-optimized wheels for efficiency and presence." }
      ]
    },

    banner: {
      title: "THE SUMMER OF PROGRESS.",
      subtitle: "Limited-time lease offers on the 2025 Audi Q8 e-tron.",
      ctaLabel: "See All Offers",
      ctaHref: "/evs/audi-q8-e-tron",
      bgImage: A("/src/assets/banner/audi.avif"),
      bgSize: "cover",
    },

    benefits: {
      title: "Audi electric ownership",
      subtitle: "Networked charging, myAudi app and home convenience.",
      items: [
        {
          image: A("/src/assets/benefits/audi-1.avif"),
          alt: "Audi at fast charger",
          title: "Charging made simple.",
          text: "Access major charging networks and use Plug & Charge where available."
        },
        {
          image: A("/src/assets/benefits/audi-2.jpg"),
          alt: "myAudi app on phone",
          title: "myAudi app.",
          text: "Plan routes with charging, precondition the cabin and manage charging limits remotely."
        },
        {
          image: A("/src/assets/benefits/audi-3.jpg"),
          alt: "Audi home wallbox",
          title: "Convenient at home.",
          text: "Install a Level 2 wallbox and schedule overnight charging from the car or app."
        }
      ]
    },

    stats: {
      title: "Quick facts",
      items: [
        { value: "quattro", label: "Electric AWD heritage" },
        { value: "Virtual Cockpit", label: "Driver-centric UI" },
        { value: "Matrix LED", label: "Signature lighting tech" }
      ]
    },

    faq: {
      title: "FAQ",
      items: [
        { q: "How does Plug & Charge work?", a: "Where available, the car authenticates automatically at a compatible charger." },
        { q: "Heat pump included?", a: "Depends on model and trim; improves winter efficiency." },
        { q: "Home charging?", a: "Level 2 wallbox recommended for overnight charging." }
      ]
    },
  },
};
