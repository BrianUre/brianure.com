import { PackageCard } from "@/components/composed/package-card";
import { ServiceCard } from "@/components/composed/service-card";
import { getServices } from "@/features/services/actions/get-services";
import { getServicesContent } from "@/features/services/actions/get-services-content";

export default async function ServicesPage() {
  const [result, content] = await Promise.all([
    getServices(),
    getServicesContent(),
  ]);

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

  const { weeklyPackages } = result.value;
  const { weeklySection, milestoneSection } = content;

  return (
    <main className="min-h-screen px-6 py-24 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <section className="mb-32">
          <header className="mb-16 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {weeklySection.caption}
            </p>
            <h1 className="text-balance text-4xl font-light tracking-tight md:text-5xl">
              {weeklySection.title}
            </h1>
            <p className="mx-auto mt-6 max-w-md text-pretty text-muted-foreground">
              {weeklySection.description}
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

        <section className="mb-32">
          <header className="mb-16 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {milestoneSection.caption}
            </p>
            <h2 className="text-balance text-4xl font-light tracking-tight md:text-5xl">
              {milestoneSection.title}
            </h2>
            <p className="mx-auto mt-6 max-w-md text-pretty text-muted-foreground">
              {milestoneSection.description}
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-3">
            <ServiceCard
              title={milestoneSection.item.title}
              description={milestoneSection.item.description}
              actionLabel="Get a quote"
              contactHref="/contact?service=project-planning"
              className="lg:col-span-3"
            />
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
