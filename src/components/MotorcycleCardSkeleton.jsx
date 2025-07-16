const MotorcycleCardSkeleton = () => {
  return (
    <div className="w-full max-w-sm animate-pulse">
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-graphite/50 bg-arsenic shadow-lg">
        <div className="aspect-video bg-graphite/50"></div>
        <div className="flex flex-grow flex-col p-5">
          <div className="min-h-[56px]">
            <div className="h-6 w-3/4 rounded bg-graphite/50"></div>
          </div>
          <div className="my-4 h-5 w-1/2 rounded bg-graphite/50"></div>
          <div className="mt-auto space-y-4 border-t border-graphite/30 pt-4">
            <div className="h-8 w-1/3 rounded bg-graphite/50"></div>
            <div className="flex items-center justify-between">
              <div className="h-6 w-1/4 rounded bg-graphite/50"></div>
              <div className="h-10 w-2/5 rounded-md bg-graphite/50"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotorcycleCardSkeleton;
