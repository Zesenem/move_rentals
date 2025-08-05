import { MdConstruction } from "react-icons/md";

function ComingSoonCard() {
  return (
    <div
      className="
        group card-animate mx-auto flex w-full max-w-[76rem] flex-col items-center 
        justify-center gap-6 rounded-lg border-2 border-dashed border-graphite/60 
        bg-arsenic p-8 text-center transition-colors duration-300 hover:border-graphite 
        sm:flex-row
      "
    >
      <MdConstruction
        className="
          text-5xl text-space transition-transform duration-300 
          group-hover:rotate-[-5deg] group-hover:scale-110
        "
      />
      <div className="text-center sm:text-left">
        <h3 className="text-2xl font-bold text-steel">More Bikes On The Way</h3>
        <p className="mt-1 text-space">
          We're always expanding our fleet. Check back soon for new models!
        </p>
      </div>
    </div>
  );
}

export default ComingSoonCard;
