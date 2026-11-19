// All invitation content lives here: edit this file to customise the site.

export const wedding = {
  partner1: "Savini",
  partner2: "Avantha",
  monogram: ["S", "A"] as const,

  // Public address of the site, used for guest links and link previews.
  // Leave empty to use whatever domain the admin page is opened on.
  baseUrl: "",

  eventName: "Wedding Celebration",
  dateShort: "17 . 03 . 27",
  dateLong: "Wednesday, 17 March 2027",
  start: "2027-03-17T09:00:00+05:30",
  end: "2027-03-17T15:00:00+05:30",

  parents: [
    // Entries left empty are hidden on the site
    { label: "Parents of Savini", names: "Mr. Sunil Ranjith Mapalagamage & Mrs. Sujeewani Gunawardana" },
    { label: "Parents of Avantha", names: "Mr. Kolitha Senanayake & Mrs. Malika Senanayake" },
  ],

  venue: {
    name: "The Balmoral Banquet",
    area: "The Kingsbury, Colombo",
    address: "The Kingsbury Hotel, 48 Janadhipathi Mawatha, Colombo 01",
    mapQuery: "The Kingsbury Hotel, Colombo, Sri Lanka",
  },

  // Order of the day, shown as cards in the Details section
  events: [
    { title: "Arrival & Welcome", time: "9:00 AM", icon: "pin", note: "The Balmoral Banquet, The Kingsbury" },
    { title: "Poruwa Ceremony", time: "9:10 AM", icon: "rings", note: "The traditional Poruwa ceremony" },
    { title: "Going Away", time: "3:00 PM", icon: "heart", note: "Bid farewell to the newlyweds" },
  ],

  // Add phone numbers like { label: "Savini · 07X XXX XXXX", href: "tel:07XXXXXXXX", whatsapp: false }
  contacts: [] as { label: string; href: string; whatsapp: boolean }[],

  // Dress code shown under the Details cards
  dressCode: {
    title: "Our autumn theme colours",
    note: "We'd love to see you in warm autumn tones: terracotta, antique wine, dusty blush, cream, sage or golden amber.",
    colors: [
      { name: "Terracotta", hex: "#A84E2C" },
      { name: "Wine", hex: "#4A1418" },
      { name: "Blush", hex: "#C99088" },
      { name: "Cream", hex: "#EEE4D6" },
      { name: "Sage", hex: "#7C8C6C" },
      { name: "Amber", hex: "#C38A45" },
    ],
  },

  // Couple photos (graded copies of public/1.JPG – 4.JPG). The first is shown in the hero arch.
  photos: [
    { src: "/assets/photos/photo-4.webp", alt: "Savini and Avantha on the beach" },
    { src: "/assets/photos/photo-1.webp", alt: "Savini and Avantha in the mountains" },
    { src: "/assets/photos/photo-2.webp", alt: "Savini and Avantha on a city night walk" },
    { src: "/assets/photos/photo-3.webp", alt: "Savini and Avantha by the lake" },
  ],

  // Background music (public/song.mp3)
  music: "/song.mp3",

  maxGuests: 6,

  // Google Apps Script web app that saves RSVPs and wishes to the sheet (google-apps-script/Code.gs).
  // Sheet: https://docs.google.com/spreadsheets/d/1Z98ysW8ahS56JWZzJDJexAkrxImXGT4GGEdvSl7eEzY
  // Paste the deployment's /exec URL here (the SHEET_SCRIPT_URL environment variable overrides it).
  rsvpScriptUrl: "https://script.google.com/macros/s/AKfycbzrUacSIPFIgE_tMPbEI_opWwf-NT5iRFWyeV1PmlQU9NNlK3ELNJpbdrdIlGidXP78qw/exec",
};

export const coupleNames = `${wedding.partner1} & ${wedding.partner2}`;

// partner1 is the bride, partner2 the groom. WhatsApp messages are signed "groom & bride".
export const brideName = wedding.partner1;
export const groomName = wedding.partner2;

// Link-preview image for WhatsApp, Facebook, etc.
export const ogImage = { url: "/assets/og-image.jpg", width: 1200, height: 1200, alt: `${coupleNames} · ${wedding.eventName}` };

export const mapsLink =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(wedding.venue.mapQuery);

export const mapsEmbed =
  "https://maps.google.com/maps?q=" + encodeURIComponent(wedding.venue.mapQuery) + "&z=14&output=embed";
