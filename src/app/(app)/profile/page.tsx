"use client";

import { useState } from "react";
import {
  User,
  ShieldCheck,
  FileCheck,
  Upload,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useSessionStore } from "@/store/use-session-store";
import { useProfile, useUpdateProfile } from "@/features/profile/profile.hooks";
import {
  useMyVerifications,
  useSubmitVerification,
} from "@/features/verification/verification.hooks";
import { PushNotificationSettings } from "@/components/push-notification-settings";

export default function ProfilePage() {
  const me = useSessionStore((s) => s.me);
  const { refetch: refetchProfile } = useProfile();
  const updateProfile = useUpdateProfile();

  const { data: verifications, isLoading: isVerifLoading } = useMyVerifications();
  const submitVerification = useSubmitVerification();

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  // Verification form state
  const [documentType, setDocumentType] = useState("NIB / SIUP");
  const [documentUrl, setDocumentUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [verifSuccessMsg, setVerifSuccessMsg] = useState<string | null>(null);
  const [verifErrorMsg, setVerifErrorMsg] = useState<string | null>(null);

  function handleStartEdit() {
    setFullName(me?.fullName ?? "");
    setPhone(me?.phone ?? "");
    setIsEditing(true);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileErrorMsg(null);
    setProfileSuccessMsg(null);

    try {
      await updateProfile.mutateAsync({
        fullName: fullName.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      setProfileSuccessMsg("Profil berhasil diperbarui!");
      setIsEditing(false);
      refetchProfile();
    } catch (err) {
      setProfileErrorMsg(
        err instanceof Error ? err.message : "Gagal memperbarui profil"
      );
    }
  }

  async function handleSubmitVerification(e: React.FormEvent) {
    e.preventDefault();
    setVerifErrorMsg(null);
    setVerifSuccessMsg(null);

    if (!documentUrl.startsWith("http://") && !documentUrl.startsWith("https://")) {
      setVerifErrorMsg("URL dokumen harus diawali http:// atau https://");
      return;
    }

    try {
      await submitVerification.mutateAsync({
        documentType,
        documentUrl,
        notes: notes.trim() || undefined,
      });
      setVerifSuccessMsg("Dokumen legal berhasil diajukan untuk verifikasi!");
      setDocumentUrl("");
      setNotes("");
    } catch (err) {
      setVerifErrorMsg(
        err instanceof Error ? err.message : "Gagal mengajukan verifikasi"
      );
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Profil & Verifikasi Legal
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Kelola data akun, informasi bisnis, dan sertifikasi verifikasi resmi Anda.
        </p>
      </div>

      {profileSuccessMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{profileSuccessMsg}</span>
        </div>
      )}

      {profileErrorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{profileErrorMsg}</span>
        </div>
      )}

      {/* Profile Details Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 font-bold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              {me?.fullName ? me.fullName.charAt(0).toUpperCase() : <User className="h-6 w-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {me?.fullName ?? "Pengguna Sinaptex"}
                </h2>
                {me?.isVerified && (
                  <span className="flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{me?.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={isEditing ? () => setIsEditing(false) : handleStartEdit}
            className="rounded-lg border border-zinc-300 px-3.5 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {isEditing ? "Batal Edit" : "Edit Profil"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="fullNameInput"
                className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Nama Lengkap
              </label>
              <input
                id="fullNameInput"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm outline-none ring-zinc-900 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:ring-zinc-100"
              />
            </div>

            <div>
              <label
                htmlFor="phoneInput"
                className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Nomor Telepon
              </label>
              <input
                id="phoneInput"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm outline-none ring-zinc-900 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:ring-zinc-100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                disabled={updateProfile.isPending}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {updateProfile.isPending ? "Menyimpan…" : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        ) : (
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Nama Lengkap
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {me?.fullName ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Email
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {me?.email ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Nomor Telepon
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {me?.phone || "Belum ditambahkan"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Status Verifikasi Legal
              </dt>
              <dd className="mt-0.5 text-sm">
                {me?.isVerified ? (
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    Terverifikasi Resmi
                  </span>
                ) : (
                  <span className="text-zinc-500">Belum diverifikasi</span>
                )}
              </dd>
            </div>
          </dl>
        )}
      </div>

      {/* Legal Verification Section */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Verifikasi Dokumen Legal Bisnis
            </h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Unggah dokumen NIB, SIUP, atau Akta Perusahaan untuk mendapatkan badge terverifikasi dan meningkatkan skor matching.
          </p>
        </div>

        {verifSuccessMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{verifSuccessMsg}</span>
          </div>
        )}

        {verifErrorMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-300">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{verifErrorMsg}</span>
          </div>
        )}

        {/* Verification Submission Form */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Ajukan Verifikasi Dokumen Baru
          </h3>

          <form onSubmit={handleSubmitVerification} className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="docType"
                  className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Jenis Dokumen
                </label>
                <select
                  id="docType"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm outline-none ring-zinc-900 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-100"
                >
                  <option value="NIB / SIUP">NIB (Nomor Induk Berusaha) / SIUP</option>
                  <option value="NPWP Badan">NPWP Badan Usaha</option>
                  <option value="Akta Perusahaan">Akta Notaris / SK Kemenkumham</option>
                  <option value="KTP Pemilik">KTP Pemilik Bisnis</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="docUrl"
                  className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  URL Tautan Dokumen (Google Drive, Cloud Storage, PDF)
                </label>
                <input
                  id="docUrl"
                  type="url"
                  required
                  value={documentUrl}
                  onChange={(e) => setDocumentUrl(e.target.value)}
                  placeholder="https://storage.googleapis.com/..."
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm outline-none ring-zinc-900 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="verifNotes"
                className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Catatan Tambahan (opsional)
              </label>
              <textarea
                id="verifNotes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Dokumen NIB diterbitkan tahun 2024..."
                className="w-full rounded-lg border border-zinc-300 bg-white p-2.5 text-sm outline-none ring-zinc-900 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-100"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={submitVerification.isPending}
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <Upload className="h-4 w-4" />
                {submitVerification.isPending ? "Mengajukan…" : "Ajukan Verifikasi"}
              </button>
            </div>
          </form>
        </div>

        {/* History of Verifications */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Riwayat Pengajuan Verifikasi
          </h3>

          {isVerifLoading && (
            <div className="flex justify-center py-6">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
            </div>
          )}

          {!isVerifLoading && (!verifications || verifications.length === 0) && (
            <p className="rounded-xl border border-dashed border-zinc-300 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800">
              Belum ada riwayat pengajuan verifikasi dokumen.
            </p>
          )}

          {verifications && verifications.length > 0 && (
            <div className="space-y-2">
              {verifications.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">
                        {item.documentType}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-semibold ${
                          item.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                            : item.status === "REJECTED"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Diajukan pada {new Date(item.createdAt).toLocaleDateString("id-ID")}
                    </p>
                    {item.rejectionReason && (
                      <p className="text-xs text-red-600 dark:text-red-400">
                        Alasan penolakan: {item.rejectionReason}
                      </p>
                    )}
                  </div>

                  <a
                    href={item.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
                  >
                    Buka Dokumen ↗
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PWA & Push Notification Settings */}
      <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <PushNotificationSettings />
      </div>
    </div>
  );
}
