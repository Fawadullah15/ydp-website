"use client";

import { use, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BadgeCheck, CheckCircle2, Download, LoaderCircle, Printer, Search, ShieldAlert, XCircle } from 'lucide-react';

type VerificationStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'EXPIRED';
type Credential = {
  type: 'MEMBER' | 'CERTIFICATE';
  memberId?: string;
  certificateId?: string;
  name?: string;
  recipientName?: string;
  status: VerificationStatus | string;
  chapter?: string | null;
  position?: string | null;
  membershipType?: string | null;
  verificationDate?: string;
  expiresAt?: string | null;
  title?: string;
  issuedAt?: string;
  photo?: string | null;
  qrCode?: string | null;
};
type VerificationResponse = { valid: boolean; type?: Credential['type']; data?: Credential; error?: string };

const labels: Record<string, { title: string; detail: string; className: string }> = {
  ACTIVE: { title: 'Verified', detail: 'This membership is active and authentic.', className: 'bg-emerald-600' },
  PENDING: { title: 'Pending Approval', detail: 'This application is awaiting an administrator review.', className: 'bg-amber-500' },
  SUSPENDED: { title: 'Rejected', detail: 'This membership is not currently approved.', className: 'bg-rose-600' },
  EXPIRED: { title: 'Expired', detail: 'This membership has expired and requires renewal.', className: 'bg-slate-600' },
};

const formatDate = (value?: string | null) => value
  ? new Intl.DateTimeFormat('en-PK', { dateStyle: 'long' }).format(new Date(value))
  : 'Not provided';

export default function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code: pathCode } = use(params);
  const code = pathCode.trim().toUpperCase();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerificationResponse | null>(null);

  const verify = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/verify/${encodeURIComponent(code)}`, { cache: 'no-store' });
      const body = (await response.json()) as VerificationResponse;
      setResult(body);
    } catch {
      setResult({ valid: false, error: 'The verification service is temporarily unavailable. Please try again.' });
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => { void verify(); }, [verify]);

  const credential = result?.data;
  const status = credential?.status || '';
  const statusMeta = labels[status] || { title: 'Verified', detail: 'This credential is authentic.', className: 'bg-emerald-600' };
  const isApproved = status === 'ACTIVE';
  const id = credential?.memberId || credential?.certificateId || code;
  const name = credential?.name || credential?.recipientName || 'Not provided';

  const downloadCredential = () => {
    if (!credential) return;
    const documentText = [
      'YOUTH DEVELOPMENT PROGRAM', 'MEMBERSHIP VERIFICATION', '',
      `Name: ${name}`, `Membership ID: ${id}`, `Status: ${statusMeta.title}`,
      `Verification date: ${formatDate(credential.verificationDate || credential.issuedAt)}`,
      `Chapter: ${credential.chapter || 'Not provided'}`,
      `Position: ${credential.position || 'Not provided'}`,
      `Membership expiry: ${formatDate(credential.expiresAt)}`,
    ].join('\n');
    const url = URL.createObjectURL(new Blob([documentText], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${id}-verification.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 pb-12 pt-28 dark:bg-gray-950 sm:px-6">
      <section className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
        {loading ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center p-8" role="status" aria-live="polite">
            <LoaderCircle className="mb-4 h-11 w-11 animate-spin text-cyan-500" aria-hidden="true" />
            <p className="font-medium text-gray-700 dark:text-gray-200">Verifying your membership…</p>
            <p className="mt-1 text-sm text-gray-500">Please wait while we securely check the record.</p>
          </div>
        ) : result?.valid && credential ? (
          <>
            <header className={`${statusMeta.className} px-6 py-7 text-center text-white sm:px-8`}>
              {isApproved ? <BadgeCheck className="mx-auto mb-2 h-16 w-16" aria-hidden="true" /> : <ShieldAlert className="mx-auto mb-2 h-16 w-16" aria-hidden="true" />}
              <h1 className="text-2xl font-bold">{statusMeta.title}</h1>
              <p className="mx-auto mt-1 max-w-sm text-sm text-white/90">{statusMeta.detail}</p>
            </header>
            <div className="p-5 sm:p-8">
              <div className="mb-6 flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                {credential.photo ? <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full"><Image src={credential.photo} alt={`${name} profile`} fill sizes="56px" className="object-cover object-top" /></div> : <CheckCircle2 className={`h-10 w-10 shrink-0 ${isApproved ? 'text-emerald-500' : 'text-amber-500'}`} aria-hidden="true" />}
                <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Member name</p><p className="truncate text-lg font-bold text-gray-900 dark:text-white">{name}</p></div>
              </div>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
                <div className="border-b border-gray-100 pb-3 dark:border-gray-800"><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Membership ID</dt><dd className="mt-1 break-all font-mono font-bold text-gray-900 dark:text-white">{id}</dd></div>
                <div className="border-b border-gray-100 pb-3 dark:border-gray-800"><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Approval status</dt><dd className="mt-1 font-semibold text-gray-900 dark:text-white">{statusMeta.title}</dd></div>
                <div className="border-b border-gray-100 pb-3 dark:border-gray-800"><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Chapter</dt><dd className="mt-1 font-medium text-gray-900 dark:text-white">{credential.chapter || 'Not provided'}</dd></div>
                <div className="border-b border-gray-100 pb-3 dark:border-gray-800"><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Position</dt><dd className="mt-1 font-medium text-gray-900 dark:text-white">{credential.position || credential.membershipType || 'Member'}</dd></div>
                <div className="border-b border-gray-100 pb-3 dark:border-gray-800"><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Verification date</dt><dd className="mt-1 font-medium text-gray-900 dark:text-white">{formatDate(credential.verificationDate || credential.issuedAt)}</dd></div>
                <div className="border-b border-gray-100 pb-3 dark:border-gray-800"><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Membership expiry</dt><dd className="mt-1 font-medium text-gray-900 dark:text-white">{formatDate(credential.expiresAt)}</dd></div>
              </dl>
              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 print:hidden">
                <button type="button" onClick={downloadCredential} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-800 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"><Download className="h-4 w-4" /> Download record</button>
                <button type="button" onClick={() => window.print()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#1B2A6B] px-4 py-2 font-semibold text-white transition hover:bg-[#152054] focus:outline-none focus:ring-2 focus:ring-cyan-500"><Printer className="h-4 w-4" /> Print record</button>
              </div>
              {credential.type === 'MEMBER' && <section className="mt-8 overflow-hidden rounded-2xl bg-[#0c1b4d] p-5 text-white sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f7c948]">YDP Digital Membership Card</p><h2 className="mt-2 text-xl font-bold">{name}</h2><p className="mt-1 font-mono text-sm text-white/80">{id}</p><p className="mt-4 text-sm text-white/80">{credential.position || credential.membershipType || 'Member'} · {credential.chapter || 'YDP Pakistan'}</p></div>{credential.qrCode ? <Image src={credential.qrCode} alt="Membership verification QR code" width={76} height={76} className="rounded bg-white p-1" /> : <BadgeCheck className="h-14 w-14 shrink-0 text-[#f7c948]" />}</div></section>}
            </div>
          </>
        ) : (
          <div className="p-6 text-center sm:p-8">
            <XCircle className="mx-auto mb-4 h-16 w-16 text-rose-500" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Member Not Found</h1>
            <p className="mx-auto mt-3 max-w-sm text-gray-600 dark:text-gray-300">{result?.error || 'We could not find a matching membership record. Check the ID and try again.'}</p>
            <p className="mt-3 break-all font-mono text-sm text-gray-500">{code}</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button type="button" onClick={() => void verify()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-2 font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"><Search className="h-4 w-4" /> Try again</button>
              <Link href="/membership" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#1B2A6B] px-5 py-2 font-semibold text-white hover:bg-[#152054] focus:outline-none focus:ring-2 focus:ring-cyan-500">Verify another ID</Link>
            </div>
          </div>
        )}
      </section>
      <p className="mx-auto mt-6 max-w-xl text-center text-sm text-gray-500">Verified securely by the Youth Development Program.</p>
    </main>
  );
}
