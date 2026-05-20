import {
  getServicePrices,
  type ServicePrice,
} from "@/actions/google_sheet";
import { PricesList } from "./prices-list";

export const dynamic = "force-dynamic";

const groupByCategory = (services: ServicePrice[]) => {
  const order: string[] = [];
  const groups = new Map<string, ServicePrice[]>();

  for (const service of services) {
    const key = service.category || "Egyéb";
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key)!.push(service);
  }

  return order.map((category) => ({
    category,
    services: groups.get(category)!,
  }));
};

export default async function PricesPage() {
  let groups: ReturnType<typeof groupByCategory> = [];
  let loadError = false;

  try {
    const services = await getServicePrices();
    groups = groupByCategory(services);
  } catch (error: unknown) {
    loadError = true;
    console.error("[prices] failed to load Sheet2:", (error as Error).message);
  }

  return <PricesList groups={groups} loadError={loadError} />;
}
