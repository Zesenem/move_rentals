function StatCard({ icon, label, value, helper }) {
  const Icon = icon;

  return (
    <div className="min-h-[164px] rounded-2xl border border-graphite/50 bg-arsenic p-5 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-phantom text-cloud">
          <Icon className="text-lg" />
        </div>
        <div className="min-w-0">
          <p className="text-sm uppercase tracking-[0.18em] text-graphite">{label}</p>
          <p className="break-words text-xl font-extrabold text-cloud sm:text-2xl">{value}</p>
        </div>
      </div>
      {helper && <p className="mt-4 text-sm leading-relaxed text-space">{helper}</p>}
    </div>
  );
}

export default StatCard;
