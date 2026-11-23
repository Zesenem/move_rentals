import { FaHistory } from "react-icons/fa";
import SectionHeading from "../components/SectionHeading.jsx";
import { sectionCardClassName } from "../constants.js";

function RevisionHistorySection({ revisions, isLoading }) {
  return (
    <div className={sectionCardClassName}>
      <SectionHeading
        icon={FaHistory}
        title="Histórico de alterações"
        description="As 20 gravações mais recentes. As gravações antigas ficam disponíveis para auditoria."
      />
      {isLoading ? (
        <p className="mt-5 text-sm text-space">A carregar histórico...</p>
      ) : revisions.length ? (
        <ol className="mt-5 space-y-3">
          {revisions.map((revision) => (
            <li
              key={`${revision.revision}-${revision.updated_at}`}
              className="rounded-xl border border-graphite/50 bg-phantom/50 px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-cloud">Revisão {revision.revision}</span>
                <span className="text-xs text-space">
                  {new Date(revision.updated_at).toLocaleString("pt-PT")}
                </span>
              </div>
              <p className="mt-1 text-sm text-steel">
                {revision.updated_by || "Administrador"} · {revision.vehicle_count || 0} registos
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-5 text-sm text-space">
          Ainda não existem revisões. A primeira gravação cria o histórico inicial.
        </p>
      )}
    </div>
  );
}

export default RevisionHistorySection;
