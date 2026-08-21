import Button from "../../../components/Button.jsx";
import { adminButtonClassName } from "../constants.js";

function WorkspaceHeader({ adminUser, onLogout }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] xl:items-start">
      <div className="min-w-0 max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cloud">
          Área de Administração
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-cloud sm:text-5xl">
          Gestão da Frota
        </h1>
        <p className="mt-4 text-lg text-space">
          Edite as informações apresentadas aos clientes, um veículo de cada vez. Ajuste cartões,
          descrições, regras de aluguer e notas sem alterar código.
        </p>
      </div>

      <div className="min-w-0 rounded-2xl border border-graphite/50 bg-arsenic p-5 shadow-lg">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-graphite">Sessão iniciada</p>
        <p className="mt-2 break-all text-lg font-semibold text-cloud">
          {adminUser?.email || "Utilizador administrador"}
        </p>
        <p className="mt-2 text-sm text-space">
          Esta conta pode criar e atualizar os dados dos veículos.
        </p>
        <Button
          variant="ghost"
          onClick={onLogout}
          className={`mt-5 w-full justify-center ${adminButtonClassName}`}
        >
          Terminar sessão
        </Button>
      </div>
    </div>
  );
}

export default WorkspaceHeader;
