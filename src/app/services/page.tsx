import { PackageCard } from "@/components/composed/package-card";
import { ServiceCard } from "@/components/composed/service-card";
import { getServices } from "@/features/services/actions/get-services";

export default async function ServicesPage() {
  const result = await getServices();

  if (!result.ok) {
    return (
      <main className="min-h-screen px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-muted-foreground">
            Unable to load services. Please try again later.
          </p>
        </div>
      </main>
    );
  }

  const { weeklyPackages, oneTimeServices } = result.value;

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
              For clients who like to delegate weekly workloads. I offer ongoing collaboration through scoped hour packages, where we have a weekly meeting to align on weekly and monthly goals.
            </p>
          </header>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {weeklyPackages.map((pkg) => (
              <PackageCard
                key={pkg.priceId}
                hours={pkg.hours}
                price={pkg.price}
                description={pkg.description}
                emphasis={pkg.featured ? "popular" : "default"}
                contactHref={`/contact?service=${pkg.priceId}`}
              />
            ))}
          </div>
        </section>

        <section className="hidden">
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
                key={service.productId}
                title={service.title}
                price={service.price}
                description={service.description}
                delivery={service.delivery}
                emphasis={service.featured ? "featured" : "default"}
                contactHref={`/contact?service=${service.priceId}`}
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
