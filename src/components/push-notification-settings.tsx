"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  BellRing,
  BellOff,
  Send,
  Download,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { usePWA } from "@/components/pwa-provider";

const PREF_KEY = "sinaptex_notification_prefs";

interface NotificationPrefs {
  match: boolean;
  invite: boolean;
  chat: boolean;
  deal: boolean;
}

function loadPrefs(): NotificationPrefs {
  if (typeof window === "undefined") {
    return { match: true, invite: true, chat: true, deal: true };
  }
  try {
    const raw = localStorage.getItem(PREF_KEY);
    if (raw) return JSON.parse(raw) as NotificationPrefs;
  } catch {
    // ignore parse error
  }
  return { match: true, invite: true, chat: true, deal: true };
}

function savePrefs(prefs: NotificationPrefs) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
}

export function PushNotificationSettings() {
  const {
    permission,
    requestPermission,
    sendTestNotification,
    isInstalled,
    isInstallable,
    promptInstall,
    isOnline,
  } = usePWA();

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<NotificationPrefs>(loadPrefs);

  // Persist ke localStorage setiap kali prefs berubah
  useEffect(() => {
    savePrefs(prefs);
  }, [prefs]);

  async function handleEnablePush() {
    setTestResult(null);
    const result = await requestPermission();
    if (result === "granted") {
      setTestResult("Izin notifikasi berhasil diaktifkan!");
    } else if (result === "denied") {
      setTestResult("Izin notifikasi diblokir oleh browser. Harap ubah setelan izin di browser Anda.");
    }
  }

  async function handleTriggerTest() {
    setIsTesting(true);
    setTestResult(null);

    try {
      const ok = await sendTestNotification(
        "Sinaptex Match Alert! 🚀",
        "Pencocokan baru ditemukan: PT Maju Logistik cocok 94% dengan kebutuhan Anda.",
        "/marketplace"
      );

      if (ok) {
        setTestResult("Notifikasi uji coba berhasil dikirim ke perangkat Anda!");
      } else {
        setTestResult("Gagal memunculkan notifikasi. Pastikan izin notifikasi sudah diizinkan.");
      }
    } catch {
      setTestResult("Terjadi kesalahan saat mengirim notifikasi.");
    } finally {
      setIsTesting(false);
    }
  }

  const isGranted = permission === "granted";
  const isDenied = permission === "denied";

  return (
    <div className="space-y-6">
      {/* Header / Intro */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Push Notification & PWA (Serwist)
            </h2>
          </div>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Terima pembaruan peluang bisnis secara instan langsung di desktop atau smartphone Anda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
              isOnline
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isOnline ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            {isOnline ? "Online (Service Worker Aktif)" : "Offline Mode"}
          </span>
        </div>
      </div>

      {testResult && (
        <div
          className={`flex items-center gap-2 rounded-xl p-4 text-sm ${
            testResult.includes("berhasil")
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
              : "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
          }`}
        >
          {testResult.includes("berhasil") ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 shrink-0" />
          )}
          <span>{testResult}</span>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Push Notification Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isGranted
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    : isDenied
                    ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                }`}
              >
                {isGranted ? (
                  <BellRing className="h-5 w-5" />
                ) : isDenied ? (
                  <BellOff className="h-5 w-5" />
                ) : (
                  <Bell className="h-5 w-5" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  Status Notifikasi
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {isGranted
                    ? "Push notification aktif dan siap menerima notifikasi."
                    : isDenied
                    ? "Izin notifikasi diblokir di browser."
                    : "Belum diaktifkan pada peramban ini."}
                </p>
              </div>
            </div>

            <span
              className={`rounded px-2 py-0.5 text-xs font-semibold ${
                isGranted
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                  : isDenied
                  ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {isGranted ? "AKTIF" : isDenied ? "DIBLOKIR" : "STANDBY"}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Notifikasi Web Push dikelola oleh Service Worker Serwist di latar belakang, bahkan saat tab browser tidak aktif.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {!isGranted && (
                <button
                  type="button"
                  onClick={handleEnablePush}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  <BellRing className="h-3.5 w-3.5" />
                  Izinkan Notifikasi
                </button>
              )}

              <button
                type="button"
                onClick={handleTriggerTest}
                disabled={isTesting}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3.5 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <Send className="h-3.5 w-3.5" />
                {isTesting ? "Mengirim…" : "Kirim Notifikasi Uji Coba"}
              </button>
            </div>
          </div>
        </div>

        {/* PWA App Installation Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  Progressive Web App (PWA)
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {isInstalled
                    ? "Aplikasi Sinaptex berjalan dalam mode Standalone PWA."
                    : "Pasang sebagai aplikasi di homescreen atau desktop."}
                </p>
              </div>
            </div>

            <span
              className={`rounded px-2 py-0.5 text-xs font-semibold ${
                isInstalled
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
              }`}
            >
              {isInstalled ? "TERPASANG" : "PWA READY"}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Dukungan caching offline otomatis via Serwist</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Layar penuh responsif tanpa bilah navigasi browser</span>
              </div>
            </div>

            <div className="pt-2">
              {isInstalled ? (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Aplikasi sudah terpasang di perangkat
                </span>
              ) : isInstallable ? (
                <button
                  type="button"
                  onClick={promptInstall}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  <Download className="h-3.5 w-3.5" />
                  Pasang Aplikasi Sinaptex
                </button>
              ) : (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Untuk memasang, gunakan menu <strong>&quot;Add to Home Screen&quot;</strong> atau ikon instalasi di bilah alamat browser Anda.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Toggles */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
          Kategori Push Notifikasi
        </h3>
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
          Sesuaikan jenis peristiwa yang ingin Anda terima sebagai push notification. Preferensi tersimpan secara lokal.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-3.5 text-xs font-medium text-zinc-800 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-200">
            <span>Rekomendasi Matching Otomatis</span>
            <input
              type="checkbox"
              checked={prefs.match}
              onChange={(e) => setPrefs((p) => ({ ...p, match: e.target.checked }))}
              className="h-4 w-4 rounded accent-zinc-900"
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-3.5 text-xs font-medium text-zinc-800 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-200">
            <span>Undangan Kolaborasi Masuk</span>
            <input
              type="checkbox"
              checked={prefs.invite}
              onChange={(e) => setPrefs((p) => ({ ...p, invite: e.target.checked }))}
              className="h-4 w-4 rounded accent-zinc-900"
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-3.5 text-xs font-medium text-zinc-800 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-200">
            <span>Pesan Chat Real-Time</span>
            <input
              type="checkbox"
              checked={prefs.chat}
              onChange={(e) => setPrefs((p) => ({ ...p, chat: e.target.checked }))}
              className="h-4 w-4 rounded accent-zinc-900"
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-3.5 text-xs font-medium text-zinc-800 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-200">
            <span>Perubahan Status & Tahapan Deal</span>
            <input
              type="checkbox"
              checked={prefs.deal}
              onChange={(e) => setPrefs((p) => ({ ...p, deal: e.target.checked }))}
              className="h-4 w-4 rounded accent-zinc-900"
            />
          </label>
        </div>
      </div>
    </div>
  );
}