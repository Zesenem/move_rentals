const inputStyles = "w-full bg-phantom border border-graphite rounded-md p-2 text-cloud focus:ring-cloud focus:border-cloud";

function MbWayPayment() {
  return (
    <div>
      <p className="text-center text-sm text-space mb-4">
        You will receive a notification in the MB WAY app to approve this payment.
      </p>
      <div>
        <label htmlFor="phone-number" className="block text-sm font-medium text-space">Phone Number</label>
        <div className="mt-1">
          <input 
            type="tel" 
            id="phone-number" 
            placeholder="+351 ••• ••• •••" 
            className={inputStyles} 
          />
        </div>
      </div>
    </div>
  );
}

export default MbWayPayment;