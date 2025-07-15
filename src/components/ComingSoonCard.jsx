import { MdConstruction } from "react-icons/md";

function ComingSoonCard() {
  return (
    <div className="w-full max-w-[76rem] mx-auto bg-arsenic border-2 border-dashed border-graphite/60 rounded-lg flex items-center justify-center p-8 text-center transition-colors duration-300 hover:border-graphite gap-6 flex-col sm:flex-row card-animate">
      <MdConstruction className="text-5xl text-space" />
      <div className="text-center sm:text-left">
        <h3 className="text-2xl font-bold text-steel">More Bikes Coming Soon</h3>
        <p className="mt-1 text-space">We are always expanding our fleet with new models.</p>
      </div>
    </div>
  );
}

export default ComingSoonCard;
