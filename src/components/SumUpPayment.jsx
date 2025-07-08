const inputStyles = "w-full bg-phantom border border-graphite rounded-md p-2 text-cloud focus:ring-cloud focus:border-cloud";

function SumUpPayment() {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="card-number" className="block text-sm font-medium text-space">Card Number</label>
        <div className="mt-1">
          <input 
            type="text" 
            id="card-number" 
            placeholder="•••• •••• •••• ••••" 
            className={inputStyles} 
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiry-date" className="block text-sm font-medium text-space">Expiry Date</label>
          <input 
            type="text" 
            id="expiry-date" 
            placeholder="MM / YY" 
            className={inputStyles}
          />
        </div>
        <div>
          <label htmlFor="cvc" className="block text-sm font-medium text-space">CVC</label>
          <input 
            type="text" 
            id="cvc" 
            placeholder="•••" 
            className={inputStyles} 
          />
        </div>
      </div>
    </div>
  );
}

export default SumUpPayment;