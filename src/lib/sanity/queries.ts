export const SERVICES_PAGE_QUERY = `
  *[_type == "servicesPage"][0] {
    weeklySection,
    milestoneSection
  }
`;
