"use server";

import { stripe } from "@/lib/stripe";
import { ok, err } from "@/types/result";
import type { Result } from "@/types/result";
import type {
  WeeklyPackage,
  OneTimeService,
  ServicesData,
  ServicesError,
} from "../types/service";

const WEEKLY_PRICES = [
  {
    id: process.env.STRIPE_PRICE_8H!,
    hours: 8,
    description: "Ideal for growing needs",
    featured: true,
  },
  {
    id: process.env.STRIPE_PRICE_12H!,
    hours: 12,
    description: "Best for ongoing work",
    featured: false,
  },
  {
    id: process.env.STRIPE_PRICE_16H!,
    hours: 16,
    description: "Maximum productivity",
    featured: false,
  },
];

const ONE_TIME_PRODUCTS = [
  {
    id: process.env.STRIPE_PRODUCT_CONSULTATION!,
    title: "1-Hour Consultation",
    description:
      "Expert guidance on your project, strategy, or design challenges.",
    featured: true,
  },
  {
    id: process.env.STRIPE_PRODUCT_6H_SESSION!,
    title: "6-Hour Package",
    description: "Focused work session for quick turnaround projects.",
    featured: false,
  },
  {
    id: process.env.STRIPE_PRODUCT_CANVA_APP!,
    title: "Full Application Build",
    description:
      "Canva Application with Admin Dashboard and Stripe integration. Complete solution delivered turnkey.",
    delivery: "1 Month Delivery",
    featured: false,
  },
];

async function getServices(): Promise<Result<ServicesData, ServicesError>> {
  try {
    const [weeklyPrices, productPrices] = await Promise.all([
      Promise.all(
        WEEKLY_PRICES.map((wp) => stripe.prices.retrieve(wp.id, { expand: ["product"] }))
      ),
      Promise.all(
        ONE_TIME_PRODUCTS.map((p) =>
          stripe.prices.list({ product: p.id, active: true, limit: 1 })
        )
      ),
    ]);

    const weeklyPackages: WeeklyPackage[] = weeklyPrices.map((price, i) => ({
      priceId: price.id,
      hours: WEEKLY_PRICES[i].hours,
      price: (price.unit_amount ?? 0) / 100,
      interval: price.recurring?.interval ?? "week",
      description: WEEKLY_PRICES[i].description,
      featured: WEEKLY_PRICES[i].featured,
    }));

    const oneTimeServices: OneTimeService[] = productPrices.map(
      (priceList, i) => {
        const price = priceList.data[0];
        return {
          productId: ONE_TIME_PRODUCTS[i].id,
          priceId: price?.id ?? "",
          title: ONE_TIME_PRODUCTS[i].title,
          price: price ? (price.unit_amount ?? 0) / 100 : 0,
          description: ONE_TIME_PRODUCTS[i].description,
          delivery: ONE_TIME_PRODUCTS[i].delivery,
          featured: ONE_TIME_PRODUCTS[i].featured,
        };
      }
    );

    return ok({ weeklyPackages, oneTimeServices });
  } catch (e) {
    console.error("[getServices] Stripe fetch failed:", e);
    return err({
      code: "STRIPE_FETCH_FAILED",
      message:
        e instanceof Error ? e.message : "Failed to fetch service pricing",
    });
  }
}

export { getServices };
