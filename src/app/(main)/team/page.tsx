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
        <div className="team-skeleton__line team-skeleton__line--bio1" />
        <div className="team-skeleton__line team-skeleton__line--bio2" />
      </div>
    </div>
  );
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
      <PageBanner heading="Meet Our Team" />

      <section className="team-section">
        <div className="container">
          <div className="text-center mb-5">
            <p className="sub-heading" style={{ color: 'var(--theme-color)' }}>The People Behind Qualixe</p>
            <h2 className="heading">Talented minds, one shared goal</h2>
          </div>

          {loading ? (
            <div className="team-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : members.length === 0 ? (
            <div className="team-empty">
              <i className="bi bi-people" />
              <p>Our team profiles are coming soon.</p>
            </div>
          ) : (
            <div className="team-grid">
              {members.map((member) => (
                <div key={member.id} className="team-card">
                  {/* Photo */}
                  <div className="team-card__photo-wrap">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="team-card__photo"
                      />
                    ) : (
                      <div className="team-card__photo-placeholder">
                        <i className="bi bi-person-circle" />
                      </div>
                    )}

                    {/* Social overlay */}
                    {(member.linkedin_url || member.twitter_url || member.email) && (
                      <div className="team-card__overlay">
                        {member.linkedin_url && (
                          <a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="team-card__social-link"
                            aria-label={`${member.name} LinkedIn`}
                          >
                            <i className="bi bi-linkedin" />
                          </a>
                        )}
                        {member.twitter_url && (
                          <a
                            href={member.twitter_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="team-card__social-link"
                            aria-label={`${member.name} Twitter`}
                          >
                            <i className="bi bi-twitter-x" />
                          </a>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="team-card__social-link"
                            aria-label={`Email ${member.name}`}
                          >
                            <i className="bi bi-envelope" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="team-card__body">
                    <h3 className="team-card__name">{member.name}</h3>
                    <p className="team-card__role">{member.role}</p>
                    {member.bio && <p className="team-card__bio">{member.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
