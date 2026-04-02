import { PackageCard } from "@/components/composed/package-card";
import { ServiceCard } from "@/components/composed/service-card";

const weeklyPackages = [
  {
    id: "6-hours",
    hours: 6,
    price: 250,
    description: "Perfect for small projects",
  },
  {
    id: "8-hours",
    hours: 8,
    price: 320,
    description: "Ideal for growing needs",
  },
  {
    id: "12-hours",
    hours: 12,
    price: 840,
    description: "Best for ongoing work",
  },
  {
    id: "16-hours",
    hours: 16,
    price: 1080,
    description: "Maximum productivity",
  },
];

const oneTimeServices = [
  {
    id: "consultation",
    title: "1-Hour Consultation",
    price: 75,
    description:
      "Expert guidance on your project, strategy, or design challenges.",
  },
  {
    id: "6-hour-package",
    title: "6-Hour Package",
    price: 500,
    description: "Focused work session for quick turnaround projects.",
  },
  {
    id: "full-application",
    title: "Full Application Build",
    price: 5000,
    description:
      "Canva Application with Admin Dashboard and Stripe integration. Complete solution delivered turnkey.",
    delivery: "1 Month Delivery",
    featured: true,
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen px-6 py-24 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <section className="mb-32">
          <header className="mb-16 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Weekly Packages
            </p>
            <h1 className="text-balance text-4xl font-light tracking-tight md:text-5xl">
              Ongoing Support
            </h1>
            <p className="mx-auto mt-6 max-w-md text-pretty text-muted-foreground">
              Flexible weekly packages designed to fit your workflow. No
              commitments, cancel anytime.
            </p>
          </header>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {weeklyPackages.map((pkg) => (
              <PackageCard key={pkg.id} hours={pkg.hours} price={pkg.price} description={pkg.description} />
            ))}
          </div>
        </section>

        <section>
          <header className="mb-16 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              One-Time Services
            </p>
            <h2 className="text-balance text-4xl font-light tracking-tight md:text-5xl">
              Project-Based Work
            </h2>
            <p className="mx-auto mt-6 max-w-md text-pretty text-muted-foreground">
              Single purchases for consultations, focused sessions, or complete
              project builds.
            </p>
          </header>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {oneTimeServices.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                price={service.price}
                description={service.description}
                delivery={service.delivery}
                emphasis={service.featured ? "featured" : "default"}
              />
            ))}
          </div>
        </section>

        <footer className="mt-32 text-center">
          <p className="text-sm text-muted-foreground">
            Need a custom package?{" "}
            <a
              href="/contact"
              className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
            >
              Get in touch
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
