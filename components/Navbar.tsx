'use client'
import { useState } from 'react'


const Navbar = () => {
    const [open,setOpen] = useState< "signin" | "signup" | null> (null)
  return (
     <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3 font-bold text-xl text-primary">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary grid place-items-center text-white">
            🎥
          </div>
          RecordFlow
        </div>

        <nav className="hidden md:flex items-center gap-8 text-slate-500 font-medium">
          <a href="#">Features</a>
          <a href="#">How It Works</a>
          <a href="#" onClick={() => setOpen("signin")}>Log in</a>
          
            
            {/* MODAL */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
          >
            {/* HEADER */}
            <div className="relative px-8 py-6 bg-gradient-to-br from-[#eef4ff] to-[#f9e9f6] text-center">
              <h2 className="text-2xl font-bold">
                {open === "signin" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-slate-500 mt-1">
                {open === "signin"
                  ? "Sign in to access your videos"
                  : "Sign up to start recording"}
              </p>

              <button
                onClick={() => setOpen(null)}
                className="absolute right-4 top-4 text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="px-8 py-6 space-y-5">
              {/* SOCIAL */}
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-medium hover:bg-slate-50">
                  <span className="text-lg">G</span> Google
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-medium hover:bg-slate-50">
                  <span className="text-lg">🐙</span> GitHub
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400">
                <div className="h-px flex-1 bg-slate-200" />
                OR CONTINUE WITH EMAIL
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* CONFIRM PASSWORD (SIGN UP ONLY) */}
              {open === "signup" && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              {/* CTA */}
              <button className="w-full rounded-xl bg-gradient-to-br from-primary to-secondary py-3 font-semibold text-white">
                {open === "signin" ? "Sign In" : "Create Account"}
              </button>

              {/* FOOTER */}
              <p className="text-center text-sm text-slate-500">
                {open === "signin" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      onClick={() => setOpen("signup")}
                      className="text-primary font-semibold"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setOpen("signin")}
                      className="text-primary font-semibold"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
          
          <a
            href="#"
            className="px-5 py-2 rounded-full bg-gradient-to-br from-primary to-secondary text-white font-semibold"
          >
            Get Started
          </a>
        </nav>
      </header>
  )
}

export default Navbar