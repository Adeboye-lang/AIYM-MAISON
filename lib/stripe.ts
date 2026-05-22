// Thin wrapper — import Stripe lazily so build doesn't fail before npm install
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _stripe: any = null;

export function getStripe() {
  if (!_stripe) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Stripe = require("stripe");
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-01-27.acacia",
    });
  }
  return _stripe;
}
