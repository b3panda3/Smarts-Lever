'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useAppStore, type UserProfile } from '@/store/useAppStore';

/**
 * Keeps the Zustand store in sync with the NextAuth session.
 *
 * Handles the return trip from Google OAuth: the user comes back to `/`
 * with a valid session cookie, and we hydrate the profile from
 * `/api/auth/me`, then route them to the onboarding or dashboard view.
 */
export default function SessionSync({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const setUser = useAppStore((s) => s.setUser);
  const setView = useAppStore((s) => s.setView);
  const syncing = useRef(false);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.email) return;
    if (syncing.current) return;

    const { user: storeUser } = useAppStore.getState();
    // Only sync when the store has no user yet (fresh page load / OAuth return)
    // so we never clobber an in-progress signup or onboarding flow.
    if (storeUser && storeUser.email === session.user.email) return;

    syncing.current = true;

    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) return;
        const data = await res.json();
        if (!data?.user) return;

        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          image: data.user.image,
          userType: data.user.userType || 'individual',
          organization: data.user.organization,
          ageGroup: data.user.ageGroup,
          city: data.user.city,
          state: data.user.state,
          country: data.user.country,
          language: data.user.language,
          educationLevel: data.user.educationLevel,
          onboardingComplete: data.user.onboardingComplete,
        };
        setUser(profile);
        setView(profile.onboardingComplete ? 'dashboard' : 'onboarding');
      } catch {
        // Network/DB error: stay on the current view.
      } finally {
        syncing.current = false;
      }
    })();
  }, [status, session, setUser, setView]);

  return <>{children}</>;
}
