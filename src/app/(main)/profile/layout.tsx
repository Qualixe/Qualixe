import type { Metadata } from 'next';
import { metadata as base } from './metadata';

// Private account page — keep it out of search results
export const metadata: Metadata = {
  ...base,
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
