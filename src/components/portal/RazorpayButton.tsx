import { useEffect, useRef } from "react";

// Razorpay hosted payment button. Loads Razorpay's official script into a form, exactly like the embed code.
export const RAZORPAY_BUTTON_ID = "plink_TrgZ0e1nsuRIzN";
export const RAZORPAY_LINK = "https://rzp.io/rzp/IHuF5oMm";

const RazorpayButton = ({ buttonId = RAZORPAY_BUTTON_ID }: { buttonId?: string }) => {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    el.innerHTML = "";
    const form = document.createElement("form");
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/payment-button.js";
    s.async = true;
    s.setAttribute("data-payment_button_id", buttonId);
    form.appendChild(s);
    el.appendChild(form);
    return () => { el.innerHTML = ""; };
  }, [buttonId]);
  return (
    <div className="space-y-2">
      <a href={RAZORPAY_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90">
        Pay now on Razorpay
      </a>
      <div ref={box} className="min-h-[8px]" />
    </div>
  );
};

export default RazorpayButton;
