import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "bn";

type Dict = Record<string, { en: string; bn: string }>;

export const translations: Dict = {
  // Quote bar
  "quote.text":
    {
      en: "And whoever saves a life, it will be as if they saved all of humanity.",
      bn: "আর যে কেউ একটি প্রাণ বাঁচায়, সে যেন সমগ্র মানবজাতিকে বাঁচাল।",
    },
  "quote.source": { en: "— Al-Ma'idah 5:32", bn: "— আল-মায়িদা ৫:৩২" },

  // Nav
  "nav.home": { en: "Home", bn: "হোম" },
  "nav.donors": { en: "Find Donors", bn: "ডোনার খুঁজুন" },
  "nav.requests": { en: "Blood Requests", bn: "রক্তের অনুরোধ" },
  "nav.donate": { en: "Become a Donor", bn: "ডোনার হন" },
  "nav.requestBlood": { en: "Request Blood", bn: "রক্ত চান" },
  "nav.login": { en: "Donor login", bn: "ডোনার লগইন" },
  "nav.menu": { en: "Toggle menu", bn: "মেনু খুলুন" },
  "lang.label": { en: "Language", bn: "ভাষা" },

  // Home hero
  "home.badge": {
    en: "Serving Maijdee & surrounding areas",
    bn: "মাইজদী ও আশপাশের এলাকায় সেবা",
  },
  "home.title.a": { en: "Find a blood donor in", bn: "রক্তদাতা খুঁজুন" },
  "home.title.b": { en: "Maijdee & Noakhali.", bn: "মাইজদী ও নোয়াখালীতে।" },
  "home.subtitle": {
    en: "A local platform connecting blood donors with people who need blood. No sign-up required.",
    bn: "একটি স্থানীয় প্ল্যাটফর্ম, যা রক্তদাতা ও রক্তপ্রার্থীদের যুক্ত করে। কোনো সাইন-আপ লাগবে না।",
  },
  "home.cta.find": { en: "Find donors", bn: "ডোনার খুঁজুন" },
  "home.cta.request": { en: "Request blood", bn: "রক্তের অনুরোধ" },

  // Urgent
  "home.urgent.title": { en: "Urgent blood requests", bn: "জরুরি রক্তের অনুরোধ" },
  "home.urgent.subtitle": {
    en: "People who need blood right now or within 24 hours.",
    bn: "যাদের এখনই বা ২৪ ঘণ্টার মধ্যে রক্ত প্রয়োজন।",
  },
  "home.urgent.viewAll": { en: "View all blood requests", bn: "সব অনুরোধ দেখুন" },
  "home.urgent.emptyTitle": { en: "No urgent requests right now.", bn: "এই মুহূর্তে কোনো জরুরি অনুরোধ নেই।" },
  "home.urgent.emptyBody": {
    en: "If you need blood urgently, post a request and donors will see it here.",
    bn: "জরুরি রক্ত প্রয়োজন হলে অনুরোধ পোস্ট করুন, ডোনাররা এখানে দেখতে পাবেন।",
  },

  // Stats
  "home.stats.donors": { en: "Registered donors", bn: "নিবন্ধিত ডোনার" },
  "home.stats.requests": { en: "Active requests", bn: "চলমান অনুরোধ" },
  "home.stats.available": { en: "Donors available now", bn: "এখন উপলব্ধ ডোনার" },
  "home.stats.groups": { en: "Blood groups", bn: "রক্তের গ্রুপ" },

  // How it works
  "home.how.title": { en: "How it works", bn: "কীভাবে কাজ করে" },
  "home.how.1.title": { en: "Search or post", bn: "খুঁজুন বা পোস্ট করুন" },
  "home.how.1.body": {
    en: "Find donors by blood group and location, or post a blood request.",
    bn: "রক্তের গ্রুপ ও এলাকা অনুযায়ী ডোনার খুঁজুন, অথবা রক্তের অনুরোধ পোস্ট করুন।",
  },
  "home.how.2.title": { en: "Connect safely", bn: "নিরাপদে যোগাযোগ" },
  "home.how.2.body": {
    en: "Contact details are shared only as needed to help coordinate the donation.",
    bn: "রক্তদান সমন্বয়ের প্রয়োজনেই কেবল যোগাযোগের তথ্য শেয়ার করা হয়।",
  },
  "home.how.3.title": { en: "Save a life", bn: "একটি জীবন বাঁচান" },
  "home.how.3.body": {
    en: "Donors respond to requests and patients get the blood they need.",
    bn: "ডোনাররা সাড়া দেন এবং রোগীরা প্রয়োজনীয় রক্ত পান।",
  },

  // Sections
  "home.recentDonors.title": { en: "Recent donors", bn: "সাম্প্রতিক ডোনার" },
  "home.recentDonors.subtitle": {
    en: "People ready to donate blood near you.",
    bn: "আপনার কাছেই রক্তদানে প্রস্তুত মানুষ।",
  },
  "home.recentRequests.title": { en: "Recent requests", bn: "সাম্প্রতিক অনুরোধ" },
  "home.recentRequests.subtitle": {
    en: "Patients currently looking for blood.",
    bn: "যেসব রোগী এখন রক্ত খুঁজছেন।",
  },
  "common.viewAll": { en: "View all", bn: "সব দেখুন" },
  "home.viewAllDonors": { en: "View all donors", bn: "সব ডোনার দেখুন" },
  "home.viewAllRequests": { en: "View all requests", bn: "সব অনুরোধ দেখুন" },
  "home.noRequests": { en: "No active blood requests right now.", bn: "এই মুহূর্তে কোনো সক্রিয় অনুরোধ নেই।" },

  // Disclaimer / CTA
  "disclaimer.label": { en: "Important:", bn: "গুরুত্বপূর্ণ:" },
  "disclaimer.body": {
    en: "BloodConnect helps connect blood donors and people requesting blood. Blood availability, donor eligibility, and medical suitability should be confirmed independently with the relevant hospital or medical professional.",
    bn: "BloodConnect কেবল রক্তদাতা ও রক্তপ্রার্থীদের সংযোগে সহায়তা করে। রক্তের প্রাপ্যতা, ডোনারের যোগ্যতা ও চিকিৎসাগত উপযুক্ততা সংশ্লিষ্ট হাসপাতাল বা চিকিৎসকের কাছ থেকে আলাদাভাবে নিশ্চিত করুন।",
  },
  "home.cta.title": { en: "Ready to make a difference?", bn: "পরিবর্তন আনতে প্রস্তুত?" },
  "home.cta.body": {
    en: "Whether you want to donate or need blood, it only takes a minute to get started.",
    bn: "রক্ত দিতে চান বা রক্ত প্রয়োজন — শুরু করতে এক মিনিটই যথেষ্ট।",
  },
  "home.cta.become": { en: "Become a donor", bn: "ডোনার হন" },
  "home.cta.post": { en: "Post a request", bn: "অনুরোধ পোস্ট করুন" },

  // Donors page
  "donors.title": { en: "Find blood donors", bn: "রক্তদাতা খুঁজুন" },
  "donors.subtitle": {
    en: "Search by blood group and location to find someone who can help.",
    bn: "রক্তের গ্রুপ ও এলাকা দিয়ে খুঁজে সাহায্যকারী কাউকে বের করুন।",
  },
  "donors.emptyTitle": { en: "No donors match your filters.", bn: "আপনার ফিল্টারে কোনো ডোনার মেলেনি।" },
  "donors.emptyBody": {
    en: "Try widening your search or register as a donor to help others.",
    bn: "অনুসন্ধান প্রসারিত করুন অথবা নিজেই ডোনার হিসেবে নিবন্ধন করুন।",
  },

  // Requests page
  "requests.title": { en: "Blood requests", bn: "রক্তের অনুরোধ" },
  "requests.subtitle": {
    en: "Active requests from patients and families. Reach out directly if you can help.",
    bn: "রোগী ও পরিবারের সক্রিয় অনুরোধ। সাহায্য করতে পারলে সরাসরি যোগাযোগ করুন।",
  },

  // Donate / request pages
  "donate.title": { en: "Become a blood donor", bn: "রক্তদাতা হন" },
  "donate.subtitle": {
    en: "Share your details so patients and families can reach you when they need blood.",
    bn: "আপনার তথ্য দিন, যেন রক্তের প্রয়োজনে রোগী ও পরিবার আপনার কাছে পৌঁছাতে পারে।",
  },
  "requestBlood.title": { en: "Request blood", bn: "রক্তের অনুরোধ করুন" },
  "requestBlood.subtitle": {
    en: "Post your need so nearby donors can see it and reach out to help.",
    bn: "আপনার প্রয়োজন পোস্ট করুন, যেন কাছের ডোনাররা দেখে সাহায্যে এগিয়ে আসেন।",
  },

  // Cards
  "card.available": { en: "Available", bn: "উপলব্ধ" },
  "card.unavailable": { en: "Unavailable", bn: "অনুপলব্ধ" },
  "card.updated": { en: "Updated", bn: "হালনাগাদ" },
  "card.posted": { en: "Posted", bn: "পোস্ট করা হয়েছে" },
  "card.recentlyPosted": { en: "Recently posted", bn: "সদ্য পোস্ট করা" },
  "card.viewRequest": { en: "View request", bn: "অনুরোধ দেখুন" },

  // Filters
  "filter.location": { en: "Location", bn: "এলাকা" },
  "filter.locationPlaceholder": { en: "City, hospital, or area", bn: "শহর, হাসপাতাল বা এলাকা" },
  "filter.bloodGroup": { en: "Blood Group", bn: "রক্তের গ্রুপ" },
  "filter.allGroups": { en: "All groups", bn: "সব গ্রুপ" },
  "filter.availableOnly": { en: "Available only", bn: "শুধু উপলব্ধ" },
  "filter.search": { en: "Search", bn: "খুঁজুন" },
  "filter.urgency": { en: "Urgency", bn: "জরুরি অবস্থা" },
  "filter.all": { en: "All", bn: "সব" },

  // Urgency
  "urgency.urgent": { en: "Urgent", bn: "জরুরি" },
  "urgency.within_24h": { en: "Within 24 hours", bn: "২৪ ঘণ্টার মধ্যে" },
  "urgency.within_week": { en: "Within a week", bn: "এক সপ্তাহের মধ্যে" },
  "urgency.planned": { en: "Planned", bn: "পরিকল্পিত" },

  // Forms
  "form.fullName": { en: "Full name", bn: "পূর্ণ নাম" },
  "form.yourName": { en: "Your name", bn: "আপনার নাম" },
  "form.patientName": { en: "Patient name", bn: "রোগীর নাম" },
  "form.bloodGroup": { en: "Blood group", bn: "রক্তের গ্রুপ" },
  "form.selectBloodGroup": { en: "Select blood group", bn: "রক্তের গ্রুপ নির্বাচন করুন" },
  "form.location": { en: "Location", bn: "এলাকা" },
  "form.locationPlaceholder": { en: "City or area", bn: "শহর বা এলাকা" },
  "form.phone": { en: "Phone", bn: "ফোন" },
  "form.required": { en: "(required)", bn: "(আবশ্যক)" },
  "form.optional": { en: "(optional)", bn: "(ঐচ্ছিক)" },
  "form.email": { en: "Email", bn: "ইমেইল" },
  "form.emailHint": {
    en: "Phone is the fastest way to connect in an emergency — email is optional.",
    bn: "জরুরি অবস্থায় ফোনই দ্রুততম মাধ্যম — ইমেইল ঐচ্ছিক।",
  },
  "form.note": { en: "Note", bn: "মন্তব্য" },
  "form.notePlaceholder": {
    en: "Any extra details, e.g. preferred contact time",
    bn: "অতিরিক্ত তথ্য, যেমন যোগাযোগের পছন্দের সময়",
  },
  "form.availableNow": { en: "I am currently available to donate", bn: "আমি এখন রক্তদানে প্রস্তুত" },
  "form.registerDonor": { en: "Register as donor", bn: "ডোনার হিসেবে নিবন্ধন" },
  "form.thanksTitle": { en: "Thank you for registering!", bn: "নিবন্ধনের জন্য ধন্যবাদ!" },
  "form.thanksBody": {
    en: "Your donor profile has been added. People in need can now reach out to you.",
    bn: "আপনার ডোনার প্রোফাইল যুক্ত হয়েছে। প্রয়োজনে মানুষ আপনার সাথে যোগাযোগ করতে পারবে।",
  },
  "form.registerAnother": { en: "Register another donor", bn: "আরেকজন ডোনার নিবন্ধন" },
  "form.postedTitle": { en: "Request posted!", bn: "অনুরোধ পোস্ট হয়েছে!" },
  "form.postedBody": {
    en: "Your blood request is now visible to potential donors. We hope you find help soon.",
    bn: "আপনার রক্তের অনুরোধ এখন ডোনারদের কাছে দৃশ্যমান। আশা করি দ্রুত সাহায্য পাবেন।",
  },
  "form.postAnother": { en: "Post another request", bn: "আরেকটি অনুরোধ পোস্ট করুন" },
  "form.postRequest": { en: "Post blood request", bn: "রক্তের অনুরোধ পোস্ট করুন" },
  "form.urgency": { en: "Urgency", bn: "জরুরি অবস্থা" },

  // Footer
  "footer.tagline": {
    en: "Connecting blood donors with those in need. Every donation can save a life.",
    bn: "রক্তদাতা ও প্রয়োজনগ্রস্তদের সংযোগ। প্রতিটি রক্তদান একটি জীবন বাঁচাতে পারে।",
  },
  "footer.createdBy": { en: "Created by", bn: "নির্মাতা" },
  "footer.university": {
    en: "Noakhali Science and Technology University",
    bn: "নোয়াখালী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়",
  },
  "footer.rights": { en: "All rights reserved.", bn: "সর্বস্বত্ব সংরক্ষিত।" },
  "footer.made": { en: "Made with", bn: "ভালোবাসা দিয়ে তৈরি" },
  "footer.humanity": { en: "for humanity", bn: "মানবতার জন্য" },
};

const STORAGE_KEY = "bloodconnect-lang";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };

const LanguageContext = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  t: (key) => translations[key]?.en ?? key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "bn" || stored === "en") setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback(
    (key: string) => translations[key]?.[lang] ?? translations[key]?.en ?? key,
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
