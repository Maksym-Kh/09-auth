'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import { useEffect, useState } from 'react';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useDebounce } from 'use-debounce';
import css from './page.module.css';
import Link from 'next/link';

interface Props {
  tagValue: string;
}

export default function NotesClient({ tagValue }: Props) {
  const [page, setPage] = useState(1);
  const limit = 12;
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);

  useEffect(() => {
    setPage(1);
  }, [tagValue, debouncedSearch]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['notes', 'filter', tagValue, page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        tag: tagValue,
        page,
        perPage: limit,
        query: debouncedSearch,
      }),
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  if (isLoading) return <p>Loading notes...</p>;
  if (error) return <p>Error loading notes.</p>;

  return (
    <div className={css.container}>
      <div className={css.search}>
        <div className={css.searchWrapper}>
          <SearchBox value={search} onChange={handleSearchChange} />
        </div>

        <div className={css.paginationBox}>
          {data?.totalPages && data.totalPages > 1 && (
            <Pagination
              totalPages={data.totalPages}
              page={page}
              onPageChange={p => setPage(p)}
            />
          )}
        </div>

        <Link href="/notes/action/create" className={css.createButton}>
          Create note +
        </Link>
      </div>

      {data?.notes && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p className={css.empty}>No notes found.</p>
      )}
    </div>
  );
}
