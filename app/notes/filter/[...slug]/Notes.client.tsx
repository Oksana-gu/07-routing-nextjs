'use client';
import { useState, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';

import { keepPreviousData } from '@tanstack/react-query';

import { fetchNotes, FetchNotesResponse } from '@/lib/api';

import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm'

import css from './Notes.client.module.css';

interface NotesClientProps {
  page: number;
  search: string;
  tag: string;
}

export default function NotesClient({
  page: initialPage,
  search: initialSearch,
  tag: initialTag,
}: NotesClientProps) {
  const [page, setPage] = useState<number>(initialPage);
  const [search, setSearch] = useState<string>(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(initialSearch);
  const tag = initialTag;
  const [isModalOpen, setIsModalOpen] =
  useState(false);


  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);

      setPage(1);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);


    useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow =
        'hidden';
    } else {
      document.body.style.overflow =
        'auto';
    }

    return () => {
      document.body.style.overflow =
        'auto';
    };
  }, [isModalOpen]);

  const {
    data,
    isLoading,
    error,
  } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', page, debouncedSearch, tag],

    queryFn: () =>
      fetchNotes({
        page,
        search: debouncedSearch,
        tag,
      }),
    placeholderData: keepPreviousData,
    
    refetchOnMount: false,
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (error) {
    return <p>Something went wrong.</p>;
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={setSearch}
        />

        <button
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {data && (
        <NoteList notes={data.notes} />
      )}

      {data && data.totalPages > 1 && (
        <Pagination
          forcePage={page}
          pageCount={data.totalPages}
          onPageChange={setPage}
        />
      )}

       {isModalOpen && (
        <Modal
          onClose={() =>
            setIsModalOpen(false)
          }
        >
          <NoteForm
            onClose={() =>
              setIsModalOpen(false)
            }
          />
        </Modal>
      )}
    </div>
  );
}