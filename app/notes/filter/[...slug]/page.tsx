import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from '@tanstack/react-query';

import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';

export default async function NotesPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const tag = slug[0] !== 'all' ? slug[0] : undefined;
  const page = 1;
  const search = '';

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', page, search, tag],
    queryFn: () =>
      fetchNotes({
        page,
        search,
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        page={page}
        search={search}
        tag={tag ?? ''}
      />
    </HydrationBoundary>
  );
}