// "use client";

import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create note",
  description: "Create a new note, add a title, text, and select a category.",
  openGraph: {
    title: "Create new note",
    description: "Page for creating a new note in NoteHub.",
    url: "https://08-zustand-kohl-zeta.vercel.app/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Create note",
      },
    ],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
