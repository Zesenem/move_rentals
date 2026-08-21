function FieldGroup({ label, hint, children }) {
  return (
    <div className="min-w-0">
      <label className="block break-words text-sm font-bold uppercase tracking-[0.18em] text-graphite">
        {label}
      </label>
      {hint && <p className="mt-1 break-words text-sm text-space">{hint}</p>}
      <div className="mt-3 min-w-0">{children}</div>
    </div>
  );
}

export default FieldGroup;
