# Sinaptex Frontend

Frontend untuk platform *business matching* **Sinaptex**, dipasangkan dengan
repo engine [mulyadiiya28/Sinaptex](https://github.com/mulyadiiya28/Sinaptex.git)
(Node.js/Express + Prisma + Supabase + Socket.IO).

## Stack

- **Next.js** (App Router, TypeScript)
- **Tailwind CSS**
- **Zod** — validasi form & response API
- **TanStack React Query** — data fetching/caching ke API engine
- **Zustand** — state UI client-side
- **Lucide React** — ikon
- **Supabase JS** — auth client (engine hanya verifikasi access token, lihat README engine bagian 5)
- **socket.io-client** — chat real-time (README engine bagian 4, "Socket.IO")

## Struktur folder

Folder `features/` sengaja dibuat 1:1 dengan `src/modules/` di repo engine,
supaya gampang dilacak endpoint mana dipakai di komponen mana.

```
src/
├── app/                      # Routing (App Router)
│   ├── login/                # Halaman masuk (Supabase email/password)
│   ├── register/             # Halaman daftar + sinkron profil ke engine
│   └── page.tsx              # Home (auth-aware)
├── components/
│   └── auth-provider.tsx     # Listener onAuthStateChange + sync session
├── features/                  # 1 folder = 1 domain, cermin src/modules/ di engine
│   ├── auth/                   # signIn/signUp/signOut + register sync + GET /api/auth/me
│   ├── profile/                 # profil + party
│   ├── verification/            # upload dokumen, status APPROVED/REJECTED
│   ├── opportunity/              # Need/Offer, quota, status ACTIVE/CLOSED/…
│   ├── boost/                    # plans + activate
│   ├── matching/                  # GET /matching/:opportunityId/run
│   ├── invitation/                 # PENDING -> ACCEPTED/REJECTED/EXPIRED
│   ├── deal/                        # NEGOTIATION -> DEAL -> IN_PROGRESS -> COMPLETED
│   ├── chat/                         # REST (list) + Socket.IO (real-time)
│   ├── membership/                    # plans, status, checkout
│   ├── review/                         # rating pasca-deal
│   └── notification/                    # FR-12 multi-channel (in-app list)
│       Tiap folder umumnya berisi:
│       *.schema.ts  → Zod schema + type (z.infer)
│       *.api.ts      → fungsi fetch lewat apiClient
│       *.hooks.ts     → React Query hooks (useQuery/useMutation)
├── lib/
│   ├── api-client.ts            # wrapper fetch, auto-attach Bearer token Supabase
│   ├── supabase-client.ts        # Supabase client + getAccessToken()
│   ├── socket-client.ts           # Socket.IO singleton untuk chat
│   └── query-provider.tsx          # Provider React Query
└── store/
    ├── use-ui-store.ts             # state UI (sidebar, modal, dll)
    └── use-session-store.ts         # cache ringan profil user login
```

## Setup

```bash
npm install
cp .env.example .env.local
# isi NEXT_PUBLIC_API_URL (default engine: http://localhost:4000)
# isi NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY (sama dg project Supabase engine)
npm run dev
```

Jalankan juga repo engine secara terpisah (lihat README engine bagian "Setup") —
default `http://localhost:4000`, prefix `/api` dan `/api/v1`, Swagger di `/api/docs`.

## Alur auth (sudah terintegrasi)

1. **Register** (`/register`)
   - User isi fullName, email, password (+ phone opsional).
   - Client memanggil `supabase.auth.signUp()`.
   - Jika session langsung tersedia (email confirmation dimatikan di Supabase),
     otomatis panggil `POST /api/auth/register` untuk sinkron `users`/`profiles` di engine.
   - Jika butuh konfirmasi email, tampilkan pesan "cek email".

2. **Login** (`/login`)
   - `supabase.auth.signInWithPassword()`.
   - Setelah session aktif, `AuthProvider` memanggil `GET /api/auth/me` dan
     menyimpan ke Zustand + React Query cache.

3. **Session persistence**
   - `AuthProvider` (`src/components/auth-provider.tsx`) listen
     `onAuthStateChange` dan menjaga sinkronisasi session ↔ store ↔ cache.

4. **API calls**
   - `apiClient` otomatis melampirkan `Authorization: Bearer <supabase_access_token>`.

5. **Logout**
   - `useSignOut()` → `supabase.auth.signOut()` + clear store & query cache.

### Hooks auth yang tersedia

| Hook | Kegunaan |
|------|----------|
| `useSignIn()` | Login email/password |
| `useSignUp()` | Register + sinkron profil engine |
| `useSignOut()` | Logout |
| `useMe()` | Ambil profil dari engine |
| `useRegisterProfile()` | Sinkron profil manual (jika perlu) |

## Alur produk yang perlu diperhatikan di UI

Mengikuti README engine:

- **Opportunity quota**: non-member maks 1 Need ACTIVE + 1 Offer ACTIVE; member aktif
  maks 20 + 20. Tangkap error `OPPORTUNITY_QUOTA_EXCEEDED` (sudah di-handle di
  `features/opportunity/opportunity.hooks.ts`) untuk arahkan user upgrade membership.
- **Chat dari Opportunity**: `originType: NEED` saat ini *tanpa* gate membership;
  `OFFER`/`PROFILE` masih perlu membership aktif di kode produksi (FR-16 belum final).
  Jangan asumsikan semua originType punya akses sama di UI.
- **Invitation ≠ satu-satunya jalur komunikasi** — chat dari Opportunity berjalan
  paralel, tidak wajib menunggu Invitation di-accept.
- **Deal state machine**: `NEGOTIATION → DEAL → IN_PROGRESS → COMPLETED`, dengan
  `CANCELLED`/`EXPIRED` sebagai jalur keluar di tiap tahap awal.

## Konvensi

- Semua request ke engine lewat `apiClient` (`src/lib/api-client.ts`) — jangan
  `fetch` langsung di komponen.
- Validasi input pakai Zod di `features/<domain>/*.schema.ts`, turunkan type dengan
  `z.infer<...>`.
- State server → React Query (`*.hooks.ts` per domain). State UI lokal → Zustand
  (`src/store/`).
- Chat pakai `features/chat/chat-socket.ts` (`useChatSocket`) untuk real-time,
  REST `chat.api.ts` untuk riwayat percakapan/pesan dan upload media.
