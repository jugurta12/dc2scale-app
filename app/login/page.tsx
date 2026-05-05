"use client"
import { signIn } from "next-auth/react"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
        backgroundSize: "48px 48px"
      }} />

      {/* Glow spots */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-teal-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">

        {/* Badge top */}
        <div className="flex justify-center mb-6">
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-widest">
            Accès restreint
          </span>
        </div>

        {/* Card */}
        <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-8 shadow-2xl shadow-black/50">

          {/* Logo */}
          <div className="mb-8 text-center">
            <Image
              src="/assets/Datacenters.png"
              alt="DC2Scale"
              width={180}
              height={60}
              className="mx-auto object-contain"
              priority
            />
          </div>

          {/* Titre */}
          <div className="mb-6 text-center">
            <h1 className="text-white font-semibold text-lg mb-1">Bienvenue</h1>
            <p className="text-zinc-500 text-xs">Connectez-vous pour accéder à votre espace de production documentaire.</p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-600 text-[10px] uppercase tracking-widest">via</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Google Button */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-zinc-900 font-medium text-sm py-3 px-4 rounded-xl transition-all duration-150 active:scale-95 shadow-lg shadow-black/20"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>

          {/* Stats déco */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-zinc-800">
            <div className="text-center">
              <div className="text-white font-semibold text-sm">11</div>
              <div className="text-zinc-600 text-[10px] mt-0.5">Modèles</div>
            </div>
            <div className="text-center border-x border-zinc-800">
              <div className="text-emerald-400 font-semibold text-sm">∞</div>
              <div className="text-zinc-600 text-[10px] mt-0.5">Documents</div>
            </div>
            <div className="text-center">
              <div className="text-white font-semibold text-sm">PDF</div>
              <div className="text-zinc-600 text-[10px] mt-0.5">Auto-généré</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-zinc-600 text-[11px] mt-5">
          Accès réservé aux membres <span className="text-zinc-500">@dc2scale.com</span>
        </p>

      </div>
    </div>
  )
}