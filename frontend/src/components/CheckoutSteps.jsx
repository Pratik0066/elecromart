import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <nav className="flex justify-center items-center gap-4 mb-10 text-sm md:text-base">
      {/* Step 1: Sign In */}
      <div className="flex items-center gap-2">
        {step1 ? (
          <Link to="/login" className="font-black text-blue-600 border-b-2 border-blue-600">Sign In</Link>
        ) : (
          <span className="text-gray-300 cursor-not-allowed">Sign In</span>
        )}
      </div>

      <div className="h-0.5 w-8 bg-gray-200"></div>

      {/* Step 2: Shipping */}
      <div className="flex items-center gap-2">
        {step2 ? (
          <Link to="/shipping" className="font-black text-blue-600 border-b-2 border-blue-600">Shipping</Link>
        ) : (
          <span className="text-gray-300 cursor-not-allowed">Shipping</span>
        )}
      </div>

      <div className="h-0.5 w-8 bg-gray-200"></div>

      {/* Step 3: Payment */}
      <div className="flex items-center gap-2">
        {step3 ? (
          <Link to="/payment" className="font-black text-blue-600 border-b-2 border-blue-600">Payment</Link>
        ) : (
          <span className="text-gray-300 cursor-not-allowed">Payment</span>
        )}
      </div>

      <div className="h-0.5 w-8 bg-gray-200"></div>

      {/* Step 4: Place Order */}
      <div className="flex items-center gap-2">
        {step4 ? (
          <Link to="/placeorder" className="font-black text-blue-600 border-b-2 border-blue-600">Order</Link>
        ) : (
          <span className="text-gray-300 cursor-not-allowed">Order</span>
        )}
      </div>
    </nav>
  );
};

export default CheckoutSteps;