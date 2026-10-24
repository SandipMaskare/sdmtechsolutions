
export const RAZORPAY_LINK = "https://rzp.io/rzp/IHuF5oMm";

const RazorpayButton = () => {
  return (
    <div className="space-y-2">
      <a
        href={RAZORPAY_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Pay Now on Razorpay
      </a>
    </div>
  );
};

export default RazorpayButton;
