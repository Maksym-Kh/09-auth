import { fetchNotes } from '@/lib/api/clientApi';
import NotesClient from './Notes.client';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0];
  const displayTitle = tag === 'all' ? 'All Notes' : `${tag} Notes`;
  return {
    title: displayTitle,
    description: `Notes: ${tag}`,
    openGraph: {
      title: displayTitle,
      description: `Category: ${tag}`,
      url: `https://08-zustand-kohl-zeta.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'Category image',
        },
      ],
    },
  };
}

export default async function FilteredNotesPage({ params }: Props) {
  const queryClient = new QueryClient();
  const resolvedParams = await params;
  const tag = resolvedParams.slug[0];

  await queryClient.prefetchQuery({
    queryKey: ['notes', 'filter', tag, 1, ''],
    queryFn: () =>
      fetchNotes({
        tag: tag === 'all' ? undefined : tag,
        page: 1,
        perPage: 12,
      }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tagValue={tag} />
    </HydrationBoundary>
  );
}
