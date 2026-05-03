'use client';

import { useState, useEffect } from 'react';
import PageBanner from '@/components/PageBanner';
import './themes.css';
import { themesAPI, Theme } from '../../../../lib/api/themes';
import ContactForm from '@/components/ContactForm';

const ThemesPage = () => {
  const [selectedTheme, setSelectedTheme] = useState<any>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [contactTheme, setContactTheme] = useState<string | null>(null);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const data = await themesAPI.getAll();
      console.log('Fetched themes:', data); // Debug log
      const activeThemes = data?.filter((t: Theme) => t.status === 'active') || [];
      setThemes(activeThemes);
      
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(activeThemes.map((t: Theme) => t.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to load themes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredThemes = selectedCategory === 'All' 
    ? themes 
    : themes.filter(t => t.category === selectedCategory);

  const openModal = (theme: any) => {
    setSelectedTheme(theme);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedTheme(null);
    document.body.style.overflow = 'auto';
  };

  const openContact = (themeName: string) => {
    setSelectedTheme(null);
    setContactTheme(themeName);
    document.body.style.overflow = 'hidden';
  };

  const closeContact = () => {
    setContactTheme(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <>
        <PageBanner heading="Our Themes" />
        <section className="themes-section">
          <div className="container">
            <div style={{ textAlign: 'center', padding: '50px' }}>Loading themes...</div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageBanner heading="Our Themes" />
      
      <section className="themes-section">
        <div className="container">
          <div className="themes-filter">
            <div className="filter-header">
              <h2 className="filter-title">Browse Themes</h2>
              <p className="filter-subtitle">Discover the perfect theme for your business</p>
            </div>
            <div className="filter-categories">
              {categories.map((category, index) => (
                <button 
                  key={index} 
                  className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="themes-grid">
            {filteredThemes.length > 0 ? (
              filteredThemes.map((theme) => (
                <div key={theme.id} className="theme-card">
                  <div className="theme-image-wrapper" style={{ cursor: 'pointer' }} onClick={() => openModal(theme)}>
                    <img src={theme.image_url} alt={theme.name} className="theme-image" />
                    <span className="theme-category-badge">{theme.category}</span>
                  </div>
                  
                  <div className="theme-content">
                    <div className="theme-header">
                      <div className="d-flex align-items-center gap-2">
                        <h3 className="theme-name mb-0">{theme.name}</h3>
                        <button
                          className="theme-eye-btn"
                          onClick={() => openModal(theme)}
                          title="Preview"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      </div>
                      {/* <div className="theme-rating">
                        <i className="bi bi-star-fill"></i>
                        <span>{theme.rating}</span>
                        <span className="theme-reviews">({theme.reviews_count})</span>
                      </div> */}
                    </div>
                    
                    <p className="theme-description">{theme.description}</p>
                    
                    <div className="theme-features">
                      {theme.features?.map((feature, index) => (
                        <span key={index} className="theme-feature-tag">
                          <i className="bi bi-check-circle-fill"></i> {feature}
                        </span>
                      ))}
                    </div>
                    
                    <div className="theme-footer">
                      <div className="theme-price">
                        <span className="price-label">Starting at</span>
                        <span className="price-value">${theme.price}</span>
                      </div>
                      <button className="theme-buy-btn" onClick={() => openModal(theme)}>
                        View Details <i className="bi bi-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '50px', width: '100%' }}>
                <h3>No themes found</h3>
                <p>Please add themes from the dashboard to display them here.</p>
              </div>
            )}
          </div>

          <div className="themes-cta">
            <div className="cta-content">
              <h2 className="cta-title">Need a Custom Theme?</h2>
              <p className="cta-description">
                Our team can create a unique, tailor-made theme specifically designed for your brand and business needs.
              </p>
              <button className="cta-button">
                Get Custom Quote <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {selectedTheme && (
        <div className="theme-modal" onClick={closeModal}>
          <div className="theme-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <i className="bi bi-x-lg"></i>
            </button>
            <div className="modal-header">
              <h2>{selectedTheme.name}</h2>
              <span className="modal-category">{selectedTheme.category}</span>
            </div>
            <div className="modal-image-container">
              <img src={selectedTheme.image_url} alt={selectedTheme.name} className="modal-image" />
            </div>
            <div className="modal-footer">
              <button 
                className="modal-btn modal-btn-primary" 
                onClick={() => selectedTheme.demo_url ? window.open(selectedTheme.demo_url, '_blank') : null}
                disabled={!selectedTheme.demo_url}
                style={{ opacity: selectedTheme.demo_url ? 1 : 0.5, cursor: selectedTheme.demo_url ? 'pointer' : 'not-allowed' }}
              >
                View Full Demo <i className="bi bi-arrow-right"></i>
              </button>
              <button 
                className="modal-btn modal-btn-secondary" 
                onClick={() => openContact(selectedTheme.name)}
              >
                Contact to Purchase
              </button>
            </div>
          </div>
        </div>
      )}
      {contactTheme && (
        <div className="theme-modal" onClick={closeContact}>
          <div className="theme-modal-content theme-modal-contact" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeContact}>
              <i className="bi bi-x-lg"></i>
            </button>
            <div className="modal-header">
              <h2>Contact to Purchase</h2>
              <span className="modal-category">{contactTheme}</span>
            </div>
            <div className="modal-contact-body">
              <ContactForm defaultTheme={contactTheme} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ThemesPage;
