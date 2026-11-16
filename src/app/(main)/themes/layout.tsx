// The page is a client component, so its metadata lives in ./metadata.ts
// and is exported from this server layout.
export { metadata } from './metadata';

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
