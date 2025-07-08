import { MdConstruction } from "react-icons/md";

function ComingSoonCard({ delay }) {
  return (
    <div
      className="w-full max-w-sm border-2 border-dashed border-graphite/60 rounded-lg flex flex-col items-center justify-center p-8 text-center h-full card-animate"
      style={{ animationDelay: delay }}
    >
      <MdConstruction className="text-5xl text-space" />
      <h3 className="mt-4 text-2xl font-bold text-steel">More Bikes</h3>
      <p className="mt-2 text-space">Coming Soon</p>
    </div>
  );
}

export default ComingSoonCard;
