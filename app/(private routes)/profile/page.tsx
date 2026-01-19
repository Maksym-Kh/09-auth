import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';
import css from './ProfilePage.module.css';
import { getMe } from '@/lib/api/serverApi';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'User profile page',
  openGraph: {
    title: 'Profile | NoteHub',
    description: 'View and manage your personal information on NoteHub.',
    url: '/profile',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub',
      },
    ],
  },
};

export default async function Profile() {
  try {
    const user = await getMe();

    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <div className={css.header}>
            <h1 className={css.formTitle}>Profile Page</h1>
            <Link href="/profile/edit" className={css.editProfileButton}>
              Edit Profile
            </Link>
          </div>
          <div className={css.avatarWrapper}>
            <Image
              src={user.avatar}
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          </div>
          <div className={css.profileInfo}>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    redirect('/sign-in');
  }
}
