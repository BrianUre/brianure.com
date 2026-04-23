"use server";

import { sanityClient } from "@/lib/sanity/client";
import { SERVICES_PAGE_QUERY } from "@/lib/sanity/queries";

interface ServicesPageContent {
  weeklySection: {
    caption: string;
    title: string;
    description: string;
  };
  milestoneSection: {
    caption: string;
    title: string;
    description: string;
    item: {
      title: string;
      description: string;
    };
  };
}

const FALLBACK: ServicesPageContent = {
  weeklySection: {
    caption: "Weekly Packages",
    title: "Ongoing Support",
    description:
      "For clients who like to delegate weekly workloads. I offer ongoing collaboration through scoped hour packages, where we have a weekly meeting to align on weekly and monthly goals.",
  },
  milestoneSection: {
    caption: "Milestone based",
    title: "Project Planning.",
    description: "For clients who value budget predictability and defined goals.",
    item: {
      title: "Application Development Plan",
      description:
        "I will analyze your project after a briefing call and plan its development, delivering a clear set of milestones with deadlines and prices.",
    },
  },
};

async function getServicesContent(): Promise<ServicesPageContent> {
  try {
    const data = await sanityClient.fetch<ServicesPageContent | null>(
      SERVICES_PAGE_QUERY
    );
    return data ?? FALLBACK;
  } catch {
    return FALLBACK;
  }
}

export { getServicesContent };
