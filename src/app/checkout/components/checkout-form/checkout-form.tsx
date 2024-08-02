//@ts-nocheck
'use client'
import React from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

export default function CheckoutForm({clientSecret}:{clientSecret:string}) {
  const stripe = useStripe();
  const elements = useElements();


  const [message, setMessage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:3000/success",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <form id="payment-form" onSubmit={handleSubmit} class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <div class="mb-6">
            <PaymentElement 
                id="payment-element" 
                options={paymentElementOptions} 
                class="w-full border border-gray-300 rounded-lg p-4"
            />
        </div>
        <button 
            disabled={isLoading || !stripe || !elements} 
            id="submit" 
            class={`w-full bg-blue-600 text-white py-3 rounded-lg transition-transform transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            <span id="button-text" class="flex items-center justify-center">
                {isLoading ? (
                    <div className="spinner border-t-4 border-white border-solid rounded-full w-5 h-5 animate-spin" id="spinner"></div>
                ) : (
                    "Pay now"
                )}
            </span>
        </button>
    </form>
</div>

  );
}