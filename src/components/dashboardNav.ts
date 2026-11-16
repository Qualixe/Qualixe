/**
 * Dashboard navigation — single source for the sidebar and the Ctrl+K search.
 * Grouped the way the business works: overview → website → work → content → shop → leads → admin.
 */
export interface DashNavItem {
  href: string;
  label: string;
  icon: string;
  /** Short description used by the command search */
  description: string;
}

export interface DashNavGroup {
  title: string;
  items: DashNavItem[];
}

export const DASH_NAV: DashNavGroup[] = [
  {
    title: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: 'bi-grid-1x2', description: 'Overview & key numbers' },
      { href: '/dashboard/analytics', label: 'Analytics', icon: 'bi-graph-up-arrow', description: 'Traffic, visitors & sources' },
    ],
  },
  {
    title: 'Website',
    items: [
      { href: '/dashboard/home', label: 'Home Page', icon: 'bi-house', description: 'Edit home page sections' },
      { href: '/dashboard/services/shopify', label: 'Shopify Page', icon: 'bi-bag-heart', description: 'Edit the Shopify service page' },
      { href: '/dashboard/services/digital-marketing', label: 'Marketing Page', icon: 'bi-megaphone', description: 'Edit the marketing service page' },
      { href: '/dashboard/team', label: 'Team', icon: 'bi-person-badge', description: 'Team members' },
    ],
  },
  {
    title: 'Work',
    items: [
      { href: '/dashboard/portfolio', label: 'Portfolio', icon: 'bi-briefcase', description: 'Shopify & e-commerce projects' },
      { href: '/dashboard/laravel-projects', label: 'Laravel Projects', icon: 'bi-code-square', description: 'Laravel case studies' },
      { href: '/dashboard/clients', label: 'Clients', icon: 'bi-people', description: 'Client logos & details' },
      { href: '/dashboard/brands', label: 'Brands', icon: 'bi-award', description: 'Brand partners' },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/dashboard/blog', label: 'Blog Posts', icon: 'bi-journal-text', description: 'Write & manage articles' },
      { href: '/dashboard/blog/comments', label: 'Comments', icon: 'bi-chat-dots', description: 'Moderate blog comments' },
      { href: '/dashboard/media', label: 'Media Library', icon: 'bi-images', description: 'Uploaded images' },
    ],
  },
  {
    title: 'Shop',
    items: [
      { href: '/dashboard/themes', label: 'Shopify Themes', icon: 'bi-palette', description: 'Theme listings' },
      { href: '/dashboard/products', label: 'HTML Templates', icon: 'bi-box-seam', description: 'Template products' },
      { href: '/dashboard/orders', label: 'Orders', icon: 'bi-receipt', description: 'Sales & downloads' },
      { href: '/dashboard/files', label: 'Files', icon: 'bi-file-zip', description: 'Product download files' },
    ],
  },
  {
    title: 'Leads',
    items: [
      { href: '/dashboard/live-chat', label: 'Live Chat', icon: 'bi-chat-dots', description: 'Reply to website visitors in real time' },
      { href: '/dashboard/contacts', label: 'Messages', icon: 'bi-envelope', description: 'Contact form enquiries' },
    ],
  },
  {
    title: 'Admin',
    items: [
      { href: '/dashboard/users', label: 'Users', icon: 'bi-person-gear', description: 'Admin users & roles' },
      { href: '/dashboard/settings', label: 'Settings', icon: 'bi-gear', description: 'Site & account settings' },
    ],
  },
];

export const DASH_NAV_ITEMS = DASH_NAV.flatMap((g) => g.items);

/** The nav item that best matches the current path (longest href wins) */
export function activeNavHref(pathname: string): string | undefined {
  return DASH_NAV_ITEMS
    .filter((i) => pathname === i.href || (i.href !== '/dashboard' && pathname.startsWith(i.href + '/')))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

export function navGroupFor(href?: string) {
  return DASH_NAV.find((g) => g.items.some((i) => i.href === href));
}
