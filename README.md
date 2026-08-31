# Sinaptex Frontend

Frontend aplikasi Sinaptex, dibuat untuk dipasangkan dengan repo engine di
[mulyadiiya28/Sinaptex](https://github.com/mulyadiiya28/Sinaptex.git).

## Stack

- **Next.js** (App Router, TypeScript)
- **Tailwind CSS** untuk styling
- **Zod** untuk validasi schema/form
- **TanStack React Query** untuk data fetching & caching ke API engine
- **Zustand** untuk state management client-side
- **Lucide React** untuk ikon

## Struktur folder

```
src/
├── app/                # Routing (App Router)
├── components/         # Komponen UI
│   └── ui/              # (kosong, isi dengan komponen dasar: Button, Input, dll)
├── hooks/               # Custom hooks (termasuk hooks React Query)
├── lib/
│   ├── api-client.ts     # Wrapper fetch ke API engine
│   └── query-provider.tsx# Provider React Query
├── schemas/             # Skema Zod (validasi form & response API)
├── store/               # Store Zustand
└── types/               # Shared TypeScript types
```

## Setup

```bash
npm install
cp .env.example .env.local
# isi NEXT_PUBLIC_API_URL sesuai alamat API engine (Sinaptex)
npm run dev
```

## Menghubungkan ke API engine

Set `NEXT_PUBLIC_API_URL` di `.env.local` ke base URL API dari repo engine
(`mulyadiiya28/Sinaptex`). Semua request API sebaiknya lewat `src/lib/api-client.ts`
dan dibungkus custom hook React Query di `src/hooks/`, contoh: `use-login.ts`.

## Konvensi

- Validasi input form/API pakai Zod (`src/schemas/`), lalu turunkan type-nya dengan
  `z.infer<...>` — jangan duplikasi definisi type manual.
- State server (data dari API) pakai React Query; state UI lokal (modal, sidebar,
  dsb) pakai Zustand (`src/store/`).
- Ikon konsisten pakai `lucide-react`.
