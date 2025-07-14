const MotorcycleCardSkeleton = () => {
  return (
    <div className="w-full max-w-sm animate-pulse">
      <div className="bg-arsenic border border-graphite/50 rounded-lg shadow-lg flex flex-col overflow-hidden h-full">
        <div className="aspect-video bg-graphite/50"></div>
        <div className="p-5 flex flex-col flex-grow">
          <div className="h-6 bg-graphite/50 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-graphite/50 rounded w-1/2 mb-6"></div>
          <div className="mt-auto pt-4 border-t border-graphite/30 space-y-4">
            <div className="flex items-baseline">
              <div className="h-8 bg-graphite/50 rounded w-1/3"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-6 bg-graphite/50 rounded w-1/4"></div>
              <div className="h-10 bg-graphite/50 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotorcycleCardSkeleton;
