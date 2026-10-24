import { useEffect, useRef } from "react";

// Razorpay hosted payment button. Loads Razorpay's official script into a form, exactly like the embed code.
export const RAZORPAY_BUTTON_ID = "pl_Tr44Lp1XeUFd4z";
export const RAZORPAY_LINK = "https://razorpay.me/@sdmtechnology";

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
  return <div ref={box} className="min-h-[48px]" />;
};

export default RazorpayButton;
