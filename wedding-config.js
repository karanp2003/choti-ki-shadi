/**
 * ====================================================================
 * BLUSH & GOLD WEDDING INVITATION CONFIGURATION
 * ====================================================================
 * Customised for: Antima Gupta & Saksham Mathur
 * Theme: Blush & Gold (InviteVibes)
 */

window.WEDDING_CONFIG = {
  // Theme styling
  theme: {
    name: "modern-bliss",
    primaryColor: "#9E4D56",      // Burgundy / terracotta (envelope)
    accentColor: "#B8956A",       // Antique gold
    headingFont: "Pinyon Script",
    petalsEnabled: true,
  },

  // Romantic Wedding Background Song (Exact song from Blush & Gold theme)
  audio: {
    enabled: true,
    title: "Romantic Bollywood Acoustic Reel",
    src: "https://pub-1953a6673e864f3488c645252f75de98.r2.dev/April/Kriti%20%26%20Manmeet/ReelAudio-14254.mp3",
  },

  // Modern Bliss entry gate (red terracotta envelope — same video as invitevibes.in Modern Bliss)
  entry: {
    enabled: true,
    variantType: "type2",
    overlayStyle: "light",
    tapHintTopPercent: 48,
    entryVariantId: "entry-video-envelope-10",
    videoUrl:
      "https://pub-1953a6673e864f3488c645252f75de98.r2.dev/website%20assets/New%20Envelope/1%20(10).mp4",
    message: "With love and blessings,\nwe invite you to the wedding of\nAntima & Saksham",
    tapHint: "Tap to Open",
    loaderNames: "Antima & Saksham",
  },

  // Hero Section
  hero: {
    ganeshImageUrl: "https://pub-1953a6673e864f3488c645252f75de98.r2.dev/website%20assets/godsymbols/1.webp",
    godQuote: "|| Shree Ganeshay Namah ||",
    introLine: "Together with their families, cordially invite you to celebrate the wedding of",
    connector: "with",
    bride: {
      name: "Antima Gupta",
      familyLine: "Beloved Daughter of Gupta Family",
    },
    groom: {
      name: "Saksham Mathur",
      familyLine: "Beloved Son of Mathur Family",
    },
    weddingDateText: "Saturday · 5th December 2026",
    weddingLocationText: "Royal Palace · Jaipur / Delhi",
  },

  // Live Countdown & Save the Date
  countdown: {
    heading: "Forever Begins In",
    targetDate: "2026-12-05T10:30:00", // 5th December 2026, 10:30 AM
  },

  // Welcome Note
  welcome: {
    heading: "Dear Friends and Family,",
    message: "As we embark on this beautiful new chapter of our lives, we seek your warmest love and blessings. Your presence will make our celebrations truly unforgettable.",
  },

  // Romantic Moments / Our Story
  story: {
    subheading: "Our Story",
    heading: "Forever Us",
    items: [
      {
        image: "https://pub-1953a6673e864f3488c645252f75de98.r2.dev/April/Demo/download%20(2).jfif",
        caption: "Where It Began",
        text: "From casual conversations to laughter that never ended, our journey quietly began.",
      },
      {
        image: "https://pub-1953a6673e864f3488c645252f75de98.r2.dev/April/Demo/download%20(3).jfif",
        caption: "Joy & Togetherness",
        text: "Every single day with you is a celebration of love, friendship, and joy.",
      },
      {
        image: "https://pub-1953a6673e864f3488c645252f75de98.r2.dev/April/Demo/%F0%9F%91%A5%F0%9F%92%97.jfif",
        caption: "Our Forever Begins",
        text: "Surrounded by our families, prayers, and pure love, two souls unite for eternity.",
      },
      {
        image: "https://pub-1953a6673e864f3488c645252f75de98.r2.dev/April/Demo/%F0%9F%92%96.jfif",
        caption: "Written In The Stars",
        text: "Two hearts, one lifelong promise. Forever starts right here, right now.",
      },
    ],
  },

  // Schedule of Events (Configured exactly as requested)
  events: {
    subheading: "The Celebrations Unfold",
    heading: "Wedding Festivities",
    items: [
      {
        id: "haldi",
        dayLabel: "DAY 1",
        title: "Haldi Ceremony",
        date: "Friday · 04 December 2026",
        time: "12:30 PM (Lunch Time)",
        description: "Auspicious yellow hues, fragrant turmeric, family giggles, and joyous beats followed by a lavish festive lunch.",
        venue: "Poolside Lawns & Courtyard",
        mapsUrl: "https://maps.google.com/?q=Jaipur",
        image: "https://pub-b147f35c3bd843e3834167baded16edb.r2.dev/users/6a38c351a72cdffebb09bc37/animated/carnival/714ad36f-83ff-40d1-a6dc-6d7efd785430.webp",
        dressCode: {
          label: "Shades of Yellow & Marigold",
          colors: ["#F7D070", "#E8A317", "#FFF8DC"],
          names: "Yellow · Ochre · Cream",
        },
      },
      {
        id: "sangeet",
        dayLabel: "DAY 1",
        title: "Sangeet & Musical Night",
        date: "Friday · 04 December 2026",
        time: "7:30 PM Onwards (Night)",
        description: "An enchanting evening of high-voltage dance performances, dhol beats, live music, and dinner under the stars.",
        venue: "Grand Crystal Ballroom",
        mapsUrl: "https://maps.google.com/?q=Jaipur",
        image: "https://pub-b147f35c3bd843e3834167baded16edb.r2.dev/users/6a38c351a72cdffebb09bc37/animated/sangeet/9493c344-69bd-47c0-9b2b-5096d5005698.webp",
        dressCode: {
          label: "Dark & Dazzling Glam / Indo-Western",
          colors: ["#1A1A2E", "#D4AF37", "#E2B4B1"],
          names: "Midnight Navy · Gold · Rose",
        },
      },
      {
        id: "wedding",
        dayLabel: "DAY 2",
        title: "Wedding Ceremony (Phere)",
        date: "Saturday · 05 December 2026",
        time: "10:30 AM – 2:00 PM (Day Wedding)",
        description: "The auspicious Baraat arrival, Varmala, and the sacred seven pheras around the holy fire, followed by a Royal Wedding Feast.",
        venue: "Mandapam Royal Heritage Palace",
        mapsUrl: "https://maps.google.com/?q=Jaipur",
        image: "https://pub-b147f35c3bd843e3834167baded16edb.r2.dev/users/6a38c351a72cdffebb09bc37/animated/phere/c4215868-219f-440f-8207-abd795ed44d1.webp",
        highlighted: true,
        dressCode: {
          label: "Traditional Festive / Pastel & Royal Indian",
          colors: ["#E2B4B1", "#D4AF37", "#F2EAE1"],
          names: "Blush Rose · Gold · Ivory",
        },
      },
    ],
  },

  // Venue & Location
  venue: {
    subheading: "Where We Gather",
    heading: "The Royal Venue",
    name: "Royal Heritage Palace & Resorts",
    address: "Palace Road, Near Heritage Garden, Jaipur, Rajasthan",
    image: "https://pub-1953a6673e864f3488c645252f75de98.r2.dev/may/Balapriya%20%26%5C/ChatGPT%20Image%20May%2030%2C%202026%2C%2009_57_15%20AM.png",
    mapsUrl: "https://maps.google.com/?q=Jaipur",
    buttonLabel: "View on Google Maps",
  },



  // Footer & Blessings
  footer: {
    message: "Your gracious presence will turn our special day into a celebration of love, laughter, and lifelong memories.",
    regards: "With heartfelt gratitude & blessings,",
    familyLine: "Gupta & Mathur Families",
    contacts: [
      { name: "Gupta Family Coordinator", phone: "+91 98765 43210" },
      { name: "Mathur Family Coordinator", phone: "+91 98765 43211" },
    ],
  },
};
