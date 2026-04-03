interface WeeklyPackage {
  priceId: string;
  hours: number;
  price: number;
  interval: string;
  description: string;
  featured: boolean;
}

interface OneTimeService {
  productId: string;
  priceId: string;
  title: string;
  price: number;
  description: string;
  delivery?: string;
  featured: boolean;
}

interface ServicesData {
  weeklyPackages: WeeklyPackage[];
  oneTimeServices: OneTimeService[];
}

interface ServicesError {
  code: string;
  message: string;
}

export type { WeeklyPackage, OneTimeService, ServicesData, ServicesError };
