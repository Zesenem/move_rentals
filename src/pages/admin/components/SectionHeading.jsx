import { hintPillClassName } from "../constants.js";

const HelperPill = ({ children }) => <span className={hintPillClassName}>{children}</span>;

function SectionHeading({ icon, title, description, pills = [] }) {
  const Icon = icon;

  return (
    <div className="mb-5">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-arsenic text-cloud">
            <Icon className="text-base" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="break-words text-xl font-bold text-cloud">{title}</h2>
            {pills.map((pill) => (
              <HelperPill key={pill}>{pill}</HelperPill>
            ))}
          </div>
          {description && <p className="mt-2 text-sm leading-relaxed text-space">{description}</p>}
        </div>
      </div>
    </div>
  );
}

export default SectionHeading;
