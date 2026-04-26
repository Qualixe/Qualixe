'use client';

import { useEffect, useState } from 'react';
import PageBanner from '@/components/PageBanner';
import { teamAPI, TeamMember } from '../../../../lib/api/team';
import './team.css';

function SkeletonCard() {
  return (
    <div className="team-skeleton">
      <div className="team-skeleton__photo" />
      <div className="team-skeleton__body">
        <div className="team-skeleton__line team-skeleton__line--name" />
        <div className="team-skeleton__line team-skeleton__line--role" />
      </div>
    </div>
  );
}

/** Pick the best social link to show as the badge icon */
function getBadgeLink(member: TeamMember): { href: string; icon: string; cls: string } | null {
  if (member.linkedin_url)
    return { href: member.linkedin_url, icon: 'bi-linkedin', cls: 'team-card__badge--linkedin' };
  if (member.twitter_url)
    return { href: member.twitter_url, icon: 'bi-twitter-x', cls: 'team-card__badge--twitter' };
  if (member.email)
    return { href: `mailto:${member.email}`, icon: 'bi-envelope', cls: 'team-card__badge--email' };
  return null;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teamAPI
      .getAll()
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="team-page">
      <PageBanner heading="Our Team" />

      <section className="team-section">
        <div className="container">
          <span className="team-section__label">our member</span>
          <h2 className="team-section__title">Our Amazing Team</h2>

          <div className="team-grid">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : members.length === 0 ? (
              <div className="team-empty">
                <i className="bi bi-people" />
                <p>Team profiles coming soon.</p>
              </div>
            ) : (
              members.map((member) => {
                const badge = getBadgeLink(member);
                return (
                  <div key={member.id} className="team-card">
                    {/* Portrait photo */}
                    <div className="team-card__photo-wrap">
                      <div className="team-card__photo-inner">
                        {member.image_url ? (
                          <img
                            src={member.image_url}
                            alt={member.name}
                            className="team-card__photo"
                          />
                        ) : (
                          <div className="team-card__photo-placeholder">
                            <i className="bi bi-person" />
                          </div>
                        )}
                      </div>

                      {/* Social badge overlapping bottom of photo */}
                      {badge && (
                        <a
                          href={badge.href}
                          target={badge.href.startsWith('mailto') ? undefined : '_blank'}
                          rel="noopener noreferrer"
                          className={`team-card__badge ${badge.cls}`}
                          aria-label={`${member.name} social link`}
                        >
                          <i className={`bi ${badge.icon}`} />
                        </a>
                      )}
                    </div>

                    {/* Name & role */}
                    <div className="team-card__body">
                      <h3 className="team-card__name">{member.name}</h3>
                      <p className="team-card__role">{member.role}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
