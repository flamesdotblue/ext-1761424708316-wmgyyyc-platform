import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-black shadow-xl">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(80%_60%_at_50%_10%,rgba(56,189,248,0.15),transparent_70%)]" />
      <div className="grid md:grid-cols-2 gap-6 items-center p-6 md:p-10">
        <div className="space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300/80">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Impossible Goals Tracker
          </span>
          <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300">
            Build habits, routines, and systems that make the impossible inevitable
          </h1>
          <p className="text-slate-300/90 max-w-prose">
            Define your North Star, break it into systems, design routines, and execute with daily habits. Track streaks, momentum, and progress — all in one place.
          </p>
        </div>
        <div className="h-[280px] md:h-[360px] lg:h-[420px]">
          <Spline style={{ width: '100%', height: '100%' }} scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" />
        </div>
      </div>
    </section>
  );
}
