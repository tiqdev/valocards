import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { CARD_SIZE } from "@/components/card/player-card";
import { Studio } from "@/components/studio/studio";
import { cardImagePath } from "@/lib/card/config";
import { getCatalog } from "@/lib/server/catalog";
import {
  getInitialCardConfig,
  type SearchParams,
} from "@/lib/server/initial-config";
import { catalogQueryKey } from "@/queries/catalog";
import { CardStoreProvider } from "@/stores/card-store";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

// Paylaşılan bir kart linki açıldığında sosyal medya önizlemesi kartın kendisi olur.
export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  if (!params.card) return {};

  const config = await getInitialCardConfig(params);
  const size = CARD_SIZE[config.layout];
  const image = {
    url: cardImagePath(config),
    width: size.width * 2,
    height: size.height * 2,
    alt: `${config.name} — ValoCards`,
  };

  return {
    title: `${config.name} | ValoCards`,
    openGraph: { images: image },
    twitter: { images: image },
  };
}

export default async function Home({ searchParams }: PageProps) {
  const config = await getInitialCardConfig(await searchParams);

  // Katalog sunucuda hazırlanır; sayfa boş açılıp sonradan dolmaz.
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: catalogQueryKey(config.lang),
    queryFn: () => getCatalog(config.lang),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CardStoreProvider initialConfig={config}>
        <Studio />
      </CardStoreProvider>
    </HydrationBoundary>
  );
}
