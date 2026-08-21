import { describeCustomList } from "../metadataHelpers.js";
import MetaList from "./MetaList.jsx";
import QuickGlanceList from "./QuickGlanceList.jsx";

function VehicleRecordCard({ vehicle }) {
  return (
    <article className="min-w-0 overflow-hidden rounded-2xl border border-graphite/50 bg-arsenic p-6 shadow-lg">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="break-all text-xs uppercase tracking-[0.18em] text-graphite">
            {vehicle.id}
          </p>
          <h2 className="mt-2 break-words text-2xl font-extrabold text-cloud">{vehicle.name}</h2>
          <p className="mt-1 break-all text-sm text-space">Slug: {vehicle.slug}</p>
        </div>

        <div className="min-w-0 flex flex-wrap gap-2">
          <span className="rounded-full bg-phantom px-3 py-1 text-xs font-semibold text-steel">
            Estado: {vehicle.availability_label || vehicle.status || "disponível"}
          </span>
          <span className="rounded-full bg-phantom px-3 py-1 text-xs font-semibold text-steel">
            Caução:{" "}
            {typeof vehicle.security_deposit === "number"
              ? `EUR ${vehicle.security_deposit}`
              : vehicle.security_deposit || "Não definida"}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-graphite">Destaques</h3>
          <div className="mt-3">
            <MetaList items={vehicle.badges} emptyLabel="Sem destaques" />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-graphite">
            Informações rápidas
          </h3>
          <div className="mt-3">
            <QuickGlanceList items={vehicle.quick_glance} />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-graphite">Exceções</h3>
          <ul className="mt-3 space-y-1 text-sm text-space">
            <li>
              Incluídos: {describeCustomList(vehicle.included, !Array.isArray(vehicle.included))}
            </li>
            <li>
              Requisitos:{" "}
              {describeCustomList(vehicle.requirements, !Array.isArray(vehicle.requirements))}
            </li>
            <li>Notas importantes: {vehicle.important_notes?.length || 0}</li>
            <li>Especificações: {vehicle.technical_features?.length || 0}</li>
          </ul>
        </div>
      </div>
    </article>
  );
}

export default VehicleRecordCard;
