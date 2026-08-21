import Button from "../../../components/Button.jsx";
import { adminButtonClassName } from "../constants.js";

function WorkspaceHeader({ adminUser, onLogout }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] xl:items-start">
      <div className="min-w-0 max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cloud">
          Admin Workspace
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-cloud sm:text-5xl">
          Fleet Metadata Editor
        </h1>
        <p className="mt-4 text-lg text-space">
          Edit the customer-facing website details for one vehicle at a time. Use this page to
          adjust cards, descriptions, rental rules, and notes without touching code.
        </p>
      </div>

      <div className="min-w-0 rounded-2xl border border-graphite/50 bg-arsenic p-5 shadow-lg">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-graphite">Signed In</p>
        <p className="mt-2 break-all text-lg font-semibold text-cloud">
          {adminUser?.email || "Admin user"}
        </p>
        <p className="mt-2 text-sm text-space">
          This account can create and update vehicle metadata entries.
        </p>
        <Button
          variant="ghost"
          onClick={onLogout}
          className={`mt-5 w-full justify-center ${adminButtonClassName}`}
        >
          Log Out
        </Button>
      </div>
    </div>
  );
}

export default WorkspaceHeader;
