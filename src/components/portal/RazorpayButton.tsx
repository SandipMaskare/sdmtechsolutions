
import { useEffect, useRef } from "react";

// Razorpay payment configuration
export const RAZORPAY_BUTTON_ID = "pl_Tr44Lp1XeUFd4z";
export const RAZORPAY_LINK = "https://rzp.io/rzp/IHuF5oMm";

const RazorpayButton = ({
  buttonId = RAZORPAY_BUTTON_ID,
}: {
  buttonId?: string;
}) => {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;

    el.innerHTML = "";

    const form = document.createElement("form");
    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/payment-button.js";
    script.async = true;
    script.setAttribute("data-payment_button_id", buttonId);

    form.appendChild(script);
    el.appendChild(form);

    return () => {
      el.innerHTML = "";
    };
  }, [buttonId]);

  return (
    <div className="space-y-3">
      {/* Direct payment link */}
      <a
        href={RAZORPAY_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Pay Now on Razorpay
      </a>

      {/* Razorpay hosted payment button */}
      <div ref={box} className="min-h-[8px]" />
    </div>
  );
};

export default RazorpayButton;
