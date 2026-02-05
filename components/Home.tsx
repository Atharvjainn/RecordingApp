'use client'

export default function Home() {

  return (
    <>
      
      {/* HERO */}
      <main className="max-w-5xl mx-auto px-6 text-center mt-35 relative">

        <h1 className="text-[clamp(42px,6vw,72px)] font-extrabold leading-tight">
          Record.{" "}
          <span className="bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent">
            Share.
          </span>
          <br />
          Inspire.
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-500">
          The simplest way to record your screen and webcam, then share your
          videos with the world. No downloads, no hassle.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <a
            href="#"
            className="px-7 py-4 rounded-2xl bg-linear-to-br from-primary to-secondary text-white font-semibold text-lg shadow-lg"
          >
            Get Started Free →
          </a>

          <a
            href="#"
            className="px-7 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 font-semibold text-lg"
          >
            ▶ Watch Demo
          </a>
        </div>

        {/* RECORDING BADGE */}
        
      </main>
    </>
  );
}
