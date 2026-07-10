"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import { useRouter } from "next/navigation";
import css from "./NotePreview.module.css";
type Props = {
  id: string;
};

export default function NotePreviewClient({ id }: Props) {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <Modal onClose={() => router.back()}>
        <p>Loading...</p>
      </Modal>
    );
  }

  if (isError || !data) {
    return (
      <Modal onClose={() => router.back()}>
        <p>Note not found.</p>
      </Modal>
    );
  }

  return (
      <Modal onClose={() => router.back()}>
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{data.title}</h2>
          <p>{data.tag}</p>
        </div>

        <p>{data.content}</p>

        <p>{new Date(data.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  </Modal>
  );
}