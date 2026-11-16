import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronRight } from 'lucide-react';
import { laravelProjectsAPI, type LaravelProject } from '../../../../../lib/api/laravel-projects';
import { BrowserFrame } from '../LaravelShowcase';
import ProjectGallery from './ProjectGallery';
import '../laravel-projects.css';

export const revalidate = 60;

const BASE = 'https://www.qualixe.com/laravel-projects';

async function getProject(slug: string): Promise<LaravelProject | null> {
  try {
    return await laravelProjectsAPI.getBySlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return { title: 'Project not found | Qualixe' };

  const title = `${p.title} – Laravel Case Study | Qualixe`;
  const description =
    p.short_description || `How Qualixe built ${p.title} with Laravel${p.client_name ? ` for ${p.client_name}` : ''}.`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE}/${p.slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE}/${p.slug}`,
      type: 'article',
      images: p.cover_image ? [{ url: p.cover_image, alt: p.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: p.cover_image ? [p.cover_image] : undefined,
    },
  };
}

function Paragraphs({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <>
      {text.split(/\n\s*\n/).map((para, i) => (
        <p key={i}>{para.trim()}</p>
      ))}
    </>
  );
}

export default async function LaravelProjectPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  let others: LaravelProject[] = [];
  try {
    const all = await laravelProjectsAPI.getPublished();
    const sameCat = all.filter((p) => p.id !== project.id && p.category && p.category === project.category);
    const rest = all.filter((p) => p.id !== project.id && !sameCat.includes(p));
    others = [...sameCat, ...rest].slice(0, 3);
  } catch {
    others = [];
  }

  const info = [
    { label: 'Client', value: project.client_name },
    { label: 'Industry', value: project.industry },
    { label: 'Category', value: project.category },
    { label: 'Year', value: project.year },
    { label: 'Timeline', value: project.duration },
  ].filter((i) => i.value);

  const hasStory = project.challenge || project.solution;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.short_description,
    image: project.cover_image,
    url: `${BASE}/${project.slug}`,
    creator: { '@type': 'Organization', name: 'Qualixe', url: 'https://www.qualixe.com' },
    keywords: project.tech_stack?.join(', '),
  };

  return (
    <main className="lp-page lp-detail">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Header ───────────────────────────────────── */}
      <section className="lp-detail__hero">
        <div className="lp-hero__bg" aria-hidden="true" />
        <div className="container">
          <nav className="lp-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <Link href="/laravel-projects">Laravel Projects</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span aria-current="page">{project.title}</span>
          </nav>

          <div className="lp-detail__head">
            <div>
              <div className="lp-meta">
                {project.category && <span>{project.category}</span>}
                {project.year && <span>{project.year}</span>}
              </div>
              <h1 className="lp-detail__title">{project.title}</h1>
              {project.short_description && <p className="lp-detail__lead">{project.short_description}</p>}
            </div>
            <div className="lp-detail__actions">
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn--primary">
                  Visit live site <ArrowUpRight size={16} />
                </a>
              )}
              <Link href="/contact" className="lp-btn lp-btn--ghost">
                Start a similar project
              </Link>
            </div>
          </div>

          <div className="lp-detail__cover">
            <BrowserFrame image={project.cover_image} alt={`${project.title} screenshot`} url={project.live_url} eager />
          </div>
        </div>
      </section>

      {/* ── Results band ─────────────────────────────── */}
      {project.results && project.results.length > 0 && (
        <section className="lp-results">
          <div className="container">
            <dl className="lp-results__grid">
              {project.results.map((r, i) => (
                <div key={i} className="lp-results__item">
                  <dt>{r.label}</dt>
                  <dd>{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* ── Body ─────────────────────────────────────── */}
      <section className="lp-section">
        <div className="container">
          <div className="lp-detail__layout">
            <div className="lp-detail__content">
              {project.description && (
                <div className="lp-prose">
                  <h2>Overview</h2>
                  <Paragraphs text={project.description} />
                </div>
              )}

              {hasStory && (
                <div className="lp-story">
                  {project.challenge && (
                    <div className="lp-story__card">
                      <span className="lp-story__icon lp-story__icon--challenge"><i className="bi bi-flag" /></span>
                      <h3>The challenge</h3>
                      <Paragraphs text={project.challenge} />
                    </div>
                  )}
                  {project.solution && (
                    <div className="lp-story__card">
                      <span className="lp-story__icon lp-story__icon--solution"><i className="bi bi-lightbulb" /></span>
                      <h3>Our solution</h3>
                      <Paragraphs text={project.solution} />
                    </div>
                  )}
                </div>
              )}

              {project.features && project.features.length > 0 && (
                <div className="lp-prose">
                  <h2>Key features</h2>
                  <ul className="lp-features">
                    {project.features.map((f, i) => (
                      <li key={i}>
                        <span className="lp-features__check"><Check size={14} /></span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <aside className="lp-detail__aside">
              <div className="lp-aside-card">
                {info.length > 0 && (
                  <>
                    <h2 className="lp-aside-card__title">Project info</h2>
                    <dl className="lp-info">
                      {info.map((i) => (
                        <div key={i.label}>
                          <dt>{i.label}</dt>
                          <dd>{i.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </>
                )}

                {project.tech_stack && project.tech_stack.length > 0 && (
                  <>
                    <h2 className="lp-aside-card__title">Tech stack</h2>
                    <ul className="lp-chips lp-chips--lg">
                      {project.tech_stack.map((t) => <li key={t} className="lp-chip">{t}</li>)}
                    </ul>
                  </>
                )}

                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="lp-aside-card__link">
                    <i className="bi bi-globe2" aria-hidden="true" />
                    <span>{project.live_url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
              </div>
            </aside>
          </div>

          {project.gallery && project.gallery.length > 0 && (
            <div className="lp-gallery-wrap">
              <h2 className="lp-section-title">Screens</h2>
              <ProjectGallery images={project.gallery} title={project.title} />
            </div>
          )}
        </div>
      </section>

      {/* ── More projects ────────────────────────────── */}
      {others.length > 0 && (
        <section className="lp-section lp-section--alt">
          <div className="container">
            <div className="lp-section-head">
              <h2 className="lp-section-title">More Laravel projects</h2>
              <Link href="/laravel-projects" className="lp-link">
                View all <ArrowRight size={15} />
              </Link>
            </div>
            <div className="lp-grid">
              {others.map((p) => (
                <article key={p.id} className="lp-card">
                  <Link href={`/laravel-projects/${p.slug}`} className="lp-card__media" tabIndex={-1} aria-hidden="true">
                    <BrowserFrame image={p.cover_image} alt="" url={p.live_url} />
                    <span className="lp-card__overlay">View case study <ArrowUpRight size={16} /></span>
                  </Link>
                  <div className="lp-card__body">
                    <div className="lp-meta">
                      {p.category && <span>{p.category}</span>}
                      {p.year && <span>{p.year}</span>}
                    </div>
                    <h3 className="lp-card__title">
                      <Link href={`/laravel-projects/${p.slug}`}>{p.title}</Link>
                    </h3>
                    {p.short_description && <p className="lp-card__desc">{p.short_description}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="lp-back-bar">
        <div className="container">
          <Link href="/laravel-projects" className="lp-link">
            <ArrowLeft size={16} /> Back to all projects
          </Link>
        </div>
      </div>
    </main>
  );
}
