'use client';

import css from './NoteForm.module.css';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api/clientApi';
import { ChangeEvent, useState } from 'react';
const noteTag = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];
import { useRouter } from 'next/navigation';

import { useNoteStore } from '@/lib/store/noteStore';

export default function NoteForm() {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const draft = useNoteStore(s => s.draft);
  const setDraft = useNoteStore(s => s.setDraft);
  const clearDraft = useNoteStore(s => s.clearDraft);

  const handleAction = (formData: FormData) => {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const tag = formData.get('tag') as string;

    if (!title || !content) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    mutate({ title, content, tag });
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ['createNote'],
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.back();
    },
    onError: error => {
      setErrorMessage('Error during creation:' + error.message);
    },
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDraft({ [name]: value });
  };
  return (
    <form action={handleAction} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={draft.title}
          onChange={handleChange}
          className={css.input}
        />
        {errorMessage && <span className={css.error}>{errorMessage}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          value={draft.content}
          onChange={handleChange}
          className={css.textarea}
        />
        {errorMessage && <span className={css.error}>{errorMessage}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          value={draft.tag}
          onChange={handleChange}
          className={css.select}
        >
          {noteTag.map(tag => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        {errorMessage && <span className={css.error}>{errorMessage}</span>}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          {isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}
