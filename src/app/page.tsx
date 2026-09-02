"use client";

import { useState } from "react";
import {
  Search,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Users,
  Briefcase,
  Compass,
  Megaphone,
  Code2,
  Factory,
  Truck,
  LayoutGrid,
  Globe,
  UserPlus,
  MessageSquare,
  Menu,
  X,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Building2,
  Sparkles,
  MapPin,
  Tag,
  Wallet,
  BadgeCheck,
  Bookmark,
  Clock,
  Flame,
  Eye as EyeIcon,
  Check,
  Star,
  Handshake,
  Play,
  Zap,
} from "lucide-react";
import Link from "next/link";

/* ───────────────────────────────────────────────
   DATA
   ─────────────────────────────────────────────── */

const opportunities = [
  {
    id: "need-001",
    type: "Need",
    title: "Mencari Supplier Kemasan Produk Food Grade",
    category: "Packaging",
    location: "Jakarta Selatan",
    budget: "Rp 15.000.000",
    description:
      "Membutuhkan supplier kemasan standing pouch offset printing minimal order 5000 pcs untuk snack renyah.",
    verified: true,
    urgent: true,
    timeAgo: "2 jam lalu",
    views: 142,
    publisher: "PT Boga Rasa Nusantara",
  },
  {
    id: "offer-001",
    type: "Offer",
    title: "Jasa Desain Logo, Packaging & Corporate Identity",
    category: "Design",
    location: "Bandung",
    budget: "Mulai Rp 2.500.000",
    description:
      "Layanan desain visual profesional oleh tim berpengalaman 7+ tahun. Bonus mock-up 3D dan pedoman warna.",
    verified: true,
    urgent: false,
    timeAgo: "5 jam lalu",
    views: 210,
    publisher: "Studio Karsa Digital",
  },
  {
    id: "need-002",
    type: "Need",
    title: "Agensi Meta Ads & TikTok Campaign Specialist",
    category: "Marketing",
    location: "Surabaya",
    budget: "Rp 10.000.000 / bln",
    description:
      "Mencari digital marketer berpengalaman untuk mengelola iklan e-commerce skincare dengan target ROI 4x.",
    verified: true,
    urgent: true,
    timeAgo: "1 hari lalu",
    views: 98,
    publisher: "GlowUp Cosmetic",
  },
  {
    id: "offer-002",
    type: "Offer",
    title: "Pengembangan Website e-Commerce & POS Kasir Integrated",
    category: "IT & Development",
    location: "Jakarta Pusat",
    budget: "Mulai Rp 8.000.000",
    description:
      "Pembuatan website cepat, aman, terintegrasi payment gateway (Midtrans/Xendit) & sistem inventori stok.",
    verified: true,
    urgent: false,
    timeAgo: "1 hari lalu",
    views: 175,
    publisher: "TechNova Solusindo",
  },
  {
    id: "need-003",
    type: "Need",
    title: "Sewa Armada Truk Engkel Box Pendingin (Cold Chain)",
    category: "Logistics",
    location: "Semarang",
    budget: "Rp 25.000.000 / bln",
    description:
      "Dibutuhkan 2 unit truk engkel refrigerator kontrak 6 bulan pengiriman produk beku rute Jawa Tengah - Jawa Timur.",
    verified: false,
    urgent: false,
    timeAgo: "2 hari lalu",
    views: 84,
    publisher: "FreshLogistics ID",
  },
  {
    id: "offer-003",
    type: "Offer",
    title: "Maklon Produksi Minuman Herbal Instan Berizin BPOM",
    category: "Packaging",
    location: "Yogyakarta",
    budget: "Nego / Sesuai Formulasi",
    description:
      "Fasilitas pabrik maklon standar GMP & BPOM. Siap bantu pembuatan izin edar dan pencampuran bahan baku.",
    verified: true,
    urgent: false,
    timeAgo: "3 hari lalu",
    views: 312,
    publisher: "CV Herbal Alami Sejahtera",
  },
];

const categories = [
  { id: 1, title: "Desain & Kreatif", count: "321 peluang", icon: Compass, color: "bg-indigo-500/10 text-indigo-600" },
  { id: 2, title: "Pemasaran & Digital", count: "287 peluang", icon: Megaphone, color: "bg-orange-500/10 text-orange-600" },
  { id: 3, title: "IT & Pengembangan", count: "195 peluang", icon: Code2, color: "bg-blue-500/10 text-blue-600" },
  { id: 4, title: "Produksi & Manufaktur", count: "176 peluang", icon: Factory, color: "bg-emerald-500/10 text-emerald-600" },
  { id: 5, title: "Logistik & Pengiriman", count: "143 peluang", icon: Truck, color: "bg-cyan-500/10 text-cyan-600" },
  { id: 6, title: "Lainnya", count: "250+ peluang", icon: LayoutGrid, color: "bg-slate-500/10 text-slate-600" },
];

const trustBadges = [
  { title: "Peluang Terverifikasi", desc: "Setiap peluang diverifikasi untuk menjaga kualitas dan keamanan.", icon: CheckCircle2 },
  { title: "Partner Terpercaya", desc: "Temukan partner bisnis yang sesuai kebutuhan dan lokasi Anda.", icon: Users },
  { title: "Aman & Terpercaya", desc: "Transaksi aman, data terlindungi, dan sistem terjamin.", icon: ShieldCheck },
  { title: "Proses Lebih Cepat", desc: "Hemat waktu dengan proses digital yang efisien dan praktis.", icon: Sparkles },
];

const steps = [
  { num: "1", icon: UserPlus, title: "Daftar Gratis", desc: "Buat akun gratis dalam hitungan detik." },
  { num: "2", icon: Search, title: "Temukan Peluang", desc: "Cari peluang atau layanan yang sesuai kebutuhan Anda." },
  { num: "3", icon: MessageSquare, title: "Hubungi & Match", desc: "Kirim undangan atau mulai percakapan langsung." },
  { num: "4", icon: CheckCircle2, title: "Kerja Sama", desc: "Bangun kerja sama dan kembangkan bisnis Anda." },
];

/* ───────────────────────────────────────────────
   SUB-COMPONENTS
   ─────────────────────────────────────────────── */

function SinaptexLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0B2F6E] via-[#092557] to-[#FF6B00] p-0.5 shadow-md">
        <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white">
          <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 22C8 18.6863 10.6863 16 14 16H18C21.3137 16 24 13.3137 24 10C24 6.68629 21.3137 4 18 4H10" stroke="#0B2F6E" strokeWidth="4" strokeLinecap="round" />
            <path d="M24 10C24 13.3137 21.3137 16 18 16H14C10.6863 16 8 18.6863 8 22C8 25.3137 10.6863 28 14 28H22" stroke="#FF6B00" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-black tracking-tight text-[#0B2F6E] leading-none">Sinaptex</span>
        <span className="text-[10px] font-semibold text-slate-500 tracking-wider">Ekosistem Bisnis & Layanan Cerdas</span>
      </div>
    </Link>
  );
}

function CardCategoryBanner({ category, type }: { category: string; type: string }) {
  const isNeed = type?.toUpperCase() === "NEED";
  const catLower = (category || "").toLowerCase();

  if (catLower.includes("design") || catLower.includes("desain")) {
    return (
      <div className="relative h-32 w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4">
        <Sparkles className="absolute -right-4 -top-4 h-24 w-24 text-white/10" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
            <Sparkles className="h-3 w-3" /> Creative & Design
          </span>
          <div className="text-xs font-semibold text-white/90">Visual Identity & Assets</div>
        </div>
      </div>
    );
  }

  if (catLower.includes("pack")) {
    return (
      <div className="relative h-32 w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 p-4">
        <Factory className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
            <Factory className="h-3 w-3" /> Packaging & Material
          </span>
          <div className="text-xs font-semibold text-white/90">Custom Box & Printing</div>
        </div>
      </div>
    );
  }

  if (catLower.includes("market") || catLower.includes("digital")) {
    return (
      <div className="relative h-32 w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-blue-600 via-teal-600 to-emerald-500 p-4">
        <Megaphone className="absolute right-0 top-0 h-24 w-24 text-white/10" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
            <Megaphone className="h-3 w-3" /> Digital Marketing
          </span>
          <div className="text-xs font-semibold text-white/90">Growth & Advertising</div>
        </div>
      </div>
    );
  }

  if (catLower.includes("it") || catLower.includes("software") || catLower.includes("tech")) {
    return (
      <div className="relative h-32 w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
        <Code2 className="absolute -right-2 -top-2 h-24 w-24 text-cyan-400/15" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-white/15 px-2.5 py-1 text-[10px] font-bold text-cyan-300 backdrop-blur-md">
            <Code2 className="h-3 w-3" /> Tech & Development
          </span>
          <div className="text-xs font-semibold text-white/90">Software & Web Solutions</div>
        </div>
      </div>
    );
  }

  if (catLower.includes("logis")) {
    return (
      <div className="relative h-32 w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 p-4">
        <Truck className="absolute right-2 bottom-1 h-20 w-20 text-white/10" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
            <Truck className="h-3 w-3" /> Logistics & Cargo
          </span>
          <div className="text-xs font-semibold text-white/90">Distribution & Transit</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative h-32 w-full overflow-hidden rounded-t-2xl p-4 ${
        isNeed
          ? "bg-gradient-to-br from-[#0B2F6E] via-[#092557] to-[#1E40af]"
          : "bg-gradient-to-br from-slate-800 via-sky-900 to-[#0B2F6E]"
      }`}
    >
      <Briefcase className="absolute -right-4 -top-4 h-24 w-24 text-white/10" />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
          <Briefcase className="h-3 w-3" /> Business Opportunity
        </span>
        <div className="text-xs font-semibold text-white/90">{category || "Sinaptex Partner"}</div>
      </div>
    </div>
  );
}

function OpportunityCard({ opportunity }: { opportunity: (typeof opportunities)[0] }) {
  const isNeed = opportunity.type.toUpperCase() === "NEED";
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-xl">
      <div className="relative">
        <CardCategoryBanner category={opportunity.category} type={opportunity.type} />

        <div className="absolute left-3 right-3 top-3 z-20 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className={`rounded-lg px-2.5 py-1 text-[11px] font-black uppercase tracking-wider shadow-sm ${
                isNeed ? "bg-[#FF6B00] text-white" : "bg-[#0B2F6E] text-white"
              }`}
            >
              {opportunity.type}
            </span>
            {opportunity.urgent && (
              <span className="flex animate-pulse items-center gap-1 rounded-lg bg-red-600 px-2 py-1 text-[10px] font-extrabold text-white shadow-sm">
                <Flame className="h-3 w-3" /> URGENT
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`flex h-8 w-8 items-center justify-center rounded-xl backdrop-blur-md transition-all ${
              isBookmarked
                ? "bg-amber-500 text-white shadow-md"
                : "bg-black/30 text-white hover:bg-black/50"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {opportunity.timeAgo}
          </span>
          <span className="flex items-center gap-1">
            <EyeIcon className="h-3.5 w-3.5" />
            {opportunity.views} dilihat
          </span>
        </div>

        <h3 className="line-clamp-2 text-base font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-[#0B2F6E]">
          {opportunity.title}
        </h3>

        {opportunity.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{opportunity.description}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1">
            <Tag className="h-3.5 w-3.5 text-slate-500" />
            <span>{opportunity.category}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span>{opportunity.location}</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Estimasi Budget / Harga</p>
          <div className="mt-1 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-[#0B2F6E]" />
            <span className="text-sm font-extrabold text-slate-900">{opportunity.budget}</span>
          </div>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0B2F6E] text-xs font-extrabold text-white shadow-xs">
                {opportunity.publisher ? opportunity.publisher.charAt(0).toUpperCase() : "P"}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="truncate text-xs font-bold text-slate-800">{opportunity.publisher}</span>
                  {opportunity.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-blue-600" />}
                </div>
                <span className="text-[10px] font-semibold text-slate-400">Mitra Terverifikasi</span>
              </div>
            </div>
            <Link
              href={`#opportunity-${opportunity.id}`}
              className="flex h-9 items-center gap-1 rounded-xl bg-blue-50 px-3 text-xs font-bold text-[#0B2F6E] transition-colors group-hover:bg-[#0B2F6E] group-hover:text-white"
            >
              <span>Detail</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function PopularTags() {
  const tags = ["Desain Logo", "Kemasan Produk", "Digital Marketing", "Pengiriman Cargo", "Bahan Baku", "IT Software"];
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-[#0B2F6E] hover:bg-blue-50 hover:text-[#0B2F6E]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

/* ───────────────────────────────────────────────
   MAIN PAGE
   ─────────────────────────────────────────────── */

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [language, setLanguage] = useState("ID");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredOpportunities =
    activeFilter === "ALL" ? opportunities : opportunities.filter((o) => o.type.toUpperCase() === activeFilter);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-[#0B2F6E] selection:text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <SinaptexLogo />

          <nav className="hidden items-center gap-8 lg:flex">
            <a href="#peluang" className="text-xs font-bold text-[#0B2F6E] transition-colors hover:text-[#FF6B00]">
              Jelajahi Peluang
            </a>
            <a href="#kategori" className="text-xs font-semibold text-slate-600 transition-colors hover:text-[#0B2F6E]">
              Kategori
            </a>
            <a href="#cara-kerja" className="text-xs font-semibold text-slate-600 transition-colors hover:text-[#0B2F6E]">
              Cara Kerja
            </a>
            <a href="#" className="text-xs font-semibold text-slate-600 transition-colors hover:text-[#0B2F6E]">
              Membership
            </a>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Globe className="h-3.5 w-3.5 text-slate-500" />
                <span>{language}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-28 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                  <button
                    onClick={() => { setLanguage("ID"); setLangDropdownOpen(false); }}
                    className="w-full px-3 py-1.5 text-left text-xs font-semibold hover:bg-slate-100"
                  >
                    ID (Indonesia)
                  </button>
                  <button
                    onClick={() => { setLanguage("EN"); setLangDropdownOpen(false); }}
                    className="w-full px-3 py-1.5 text-left text-xs font-semibold hover:bg-slate-100"
                  >
                    EN (English)
                  </button>
                </div>
              )}
            </div>
            <Link
              href="/login"
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-[#0B2F6E] transition-all hover:bg-slate-100"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-[#0B2F6E] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#082352] active:scale-95"
            >
              Daftar Gratis
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-b border-slate-200 bg-white px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-3">
              <a href="#peluang" className="text-xs font-bold text-[#0B2F6E]">Jelajahi Peluang</a>
              <a href="#kategori" className="text-xs font-semibold text-slate-600">Kategori</a>
              <a href="#cara-kerja" className="text-xs font-semibold text-slate-600">Cara Kerja</a>
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login" className="w-full rounded-xl border border-slate-300 py-2.5 text-center text-xs font-bold text-[#0B2F6E]">
                  Masuk
                </Link>
                <Link href="/register" className="w-full rounded-xl bg-[#0B2F6E] py-2.5 text-center text-xs font-bold text-white">
                  Daftar Gratis
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/40 pb-12 pt-6 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
            {/* LEFT */}
            <div className="lg:col-span-7">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1 text-[11px] font-extrabold text-[#0B2F6E]">
                <Sparkles className="h-3.5 w-3.5 text-[#FF6B00]" />
                <span>Platform B2B & Layanan Bisnis Cerdas #1</span>
              </div>

              <h1 className="text-2xl font-black leading-[1.18] tracking-tight text-[#0B2F6E] sm:text-4xl lg:text-5xl">
                Temukan peluang terbaik, <br className="hidden sm:inline" />
                bangun <span className="text-[#FF6B00]">bisnis tanpa batas</span>
              </h1>

              <p className="mt-3 max-w-xl text-xs leading-relaxed text-slate-600 sm:mt-4 sm:text-sm">
                Sinaptex menghubungkan kebutuhan bisnis Anda dengan penyedia solusi terpercaya. Temukan partner, layanan, dan transaksi aman dalam satu ekosistem.
              </p>

              {/* SEARCH */}
              <div className="mt-6 rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-xl shadow-slate-200/50 sm:mt-8">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-center">
                  <div className="relative flex items-center sm:col-span-5">
                    <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari kebutuhan atau penawaran..."
                      className="w-full rounded-xl bg-transparent py-2.5 pl-10 pr-3 text-xs text-slate-800 placeholder-slate-400 outline-none"
                    />
                  </div>
                  <div className="border-t border-slate-200 pt-2 sm:col-span-3 sm:border-l sm:border-t-0 sm:pl-2 sm:pt-0">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full cursor-pointer bg-transparent px-2 py-2.5 text-xs font-semibold text-slate-700 outline-none"
                    >
                      <option value="">Semua Kategori</option>
                      <option value="desain">Desain & Kreatif</option>
                      <option value="pemasaran">Pemasaran & Digital</option>
                      <option value="it">IT & Pengembangan</option>
                      <option value="produksi">Produksi & Manufaktur</option>
                      <option value="logistik">Logistik & Pengiriman</option>
                    </select>
                  </div>
                  <div className="border-t border-slate-200 pt-2 sm:col-span-2 sm:border-l sm:border-t-0 sm:pl-2 sm:pt-0">
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full cursor-pointer bg-transparent px-2 py-2.5 text-xs font-semibold text-slate-700 outline-none"
                    >
                      <option value="">Semua Lokasi</option>
                      <option value="jakarta">Jakarta</option>
                      <option value="surabaya">Surabaya</option>
                      <option value="bandung">Bandung</option>
                      <option value="medan">Medan</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <button className="w-full rounded-xl bg-[#0B2F6E] px-3 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#082352] active:scale-95">
                      Cari Peluang
                    </button>
                  </div>
                </div>
              </div>

              <PopularTags />
            </div>

            {/* RIGHT — Illustration */}
            <div className="flex items-center justify-center lg:col-span-5">
              <div className="relative w-full max-w-[420px]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0B2F6E]">
                      <Handshake className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Matching Cerdas</p>
                      <p className="text-xs text-slate-500">AI-powered business matching</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF6B00] text-xs font-bold text-white">N</div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-800">Butuh Desain Interior</p>
                        <p className="text-[10px] text-slate-400">Jakarta • 2 hari lalu</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <Zap className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B2F6E] text-xs font-bold text-white">O</div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-800">Menawarkan Jasa Desain</p>
                        <p className="text-[10px] text-slate-400">Bandung • 1 jam lalu</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="border-y border-slate-200/80 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustBadges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#0B2F6E]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{badge.title}</h3>
                    <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{badge.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* OPPORTUNITIES */}
      <section id="peluang" className="border-b border-slate-200/70 bg-slate-50/70 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#FF6B00]"></span>
                <p className="text-xs font-black uppercase tracking-wider text-[#FF6B00]">Eksplorasi Ekosistem</p>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-[#0B2F6E] sm:text-3xl">Kebutuhan & Penawaran Aktif</h2>
              <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-500 sm:text-sm">
                Temukan peluang bisnis terverifikasi lengkap dengan estimasi budget dan informasi mitra.
              </p>
            </div>
            <a href="#peluang" className="inline-flex items-center gap-2 text-xs font-bold text-[#0B2F6E] transition hover:text-[#FF6B00] sm:text-sm">
              Lihat Semua Peluang ({opportunities.length})
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-7 flex items-center gap-2 overflow-x-auto pb-2">
            {["ALL", "NEED", "OFFER"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-xs font-bold transition ${
                  activeFilter === f
                    ? "bg-[#0B2F6E] text-white shadow-md"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-[#0B2F6E] hover:text-[#0B2F6E]"
                }`}
              >
                {f === "ALL" ? "Semua" : f === "NEED" ? "Kebutuhan (Need)" : "Penawaran (Offer)"}
              </button>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOpportunities.map((o) => (
              <OpportunityCard key={o.id} opportunity={o} />
            ))}
          </div>

          {filteredOpportunities.length === 0 && (
            <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <p className="font-bold text-slate-700">Belum ada peluang tersedia pada kategori ini</p>
              <p className="mt-1 text-xs text-slate-500">Coba ubah filter atau kata kunci pencarian Anda.</p>
            </div>
          )}

          <div className="mt-10 text-center">
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-xs font-bold text-[#0B2F6E] shadow-2xs transition hover:border-[#0B2F6E] hover:bg-blue-50">
              Muat Lebih Banyak Peluang Bisnis
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="kategori" className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#0B2F6E] sm:text-3xl">
              Jelajahi Peluang Berdasarkan Kategori
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${cat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-[#0B2F6E]">
                        {cat.title}
                      </h3>
                      <p className="mt-0.5 text-xs font-medium text-slate-500">{cat.count}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="cara-kerja" className="border-t border-slate-100 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#0B2F6E] sm:text-3xl">Cara Kerja Sinaptex</h2>
          </div>
          <div className="relative">
            <div className="absolute left-[12%] right-[12%] top-10 hidden h-0.5 border-t-2 border-dashed border-slate-200 lg:block"></div>
            <div className="relative z-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.num} className="group flex flex-col items-center text-center">
                    <div className="relative mb-4 flex items-center justify-center">
                      <span className="absolute -left-1 -top-1 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF6B00] text-xs font-bold text-white shadow-md">
                        {step.num}
                      </span>
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#0B2F6E] shadow-xs transition-all group-hover:scale-105 group-hover:bg-[#0B2F6E] group-hover:text-white">
                        <Icon className="h-7 w-7" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                    <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-slate-500">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#082250] p-8 text-white shadow-xl sm:p-12">
            <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
              <div className="max-w-2xl text-center lg:text-left">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Siap mengembangkan bisnis Anda?</h2>
                <p className="mt-2 text-sm leading-relaxed text-blue-100/90">
                  Bergabung dengan ribuan pelaku bisnis & penyedia layanan di Sinaptex.
                </p>
              </div>
              <Link
                href="/register"
                className="w-full rounded-xl bg-[#FF6B00] px-6 py-3.5 text-center text-xs font-extrabold text-white shadow-lg transition-all hover:bg-[#e05e00] active:scale-95 sm:w-auto"
              >
                Daftar Gratis Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div>© 2026 Sinaptex - Ekosistem Bisnis dan Layanan Cerdas. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-6 font-semibold text-slate-600">
            <a href="#" className="hover:text-[#0B2F6E]">Tentang Kami</a>
            <a href="#" className="hover:text-[#0B2F6E]">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-[#0B2F6E]">Kebijakan Privasi</a>
          </div>
        </div>
      </footer>
    </div>
  );
}