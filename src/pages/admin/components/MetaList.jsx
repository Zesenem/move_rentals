function MetaList({ items, emptyLabel }) {
  if (!items?.length) {
    return <span className="text-graphite">{emptyLabel}</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="rounded-full border border-graphite/60 bg-phantom px-3 py-1 text-center text-sm leading-snug text-steel break-words"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default MetaList;
