function QuickGlanceList({ items }) {
  if (!items?.length) {
    return <span className="text-graphite">Sem informações rápidas</span>;
  }

  return (
    <ul className="space-y-1 text-sm text-space">
      {items.map((item, index) => (
        <li key={`${item.icon}-${item.label}-${index}`} className="break-words">
          <span className="font-semibold text-cloud">{item.label}</span>
          <span className="text-graphite"> / </span>
          <span>{item.icon}</span>
        </li>
      ))}
    </ul>
  );
}

export default QuickGlanceList;
