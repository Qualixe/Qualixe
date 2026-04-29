-- =====================================================
-- Shopify Development Service Page Content
-- Run in Supabase SQL Editor
-- =====================================================

CREATE TABLE IF NOT EXISTS shopify_service_page (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL UNIQUE, -- 'hero' | 'services' | 'process' | 'why_us' | 'faq' | 'cta'
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE shopify_service_page ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Anyone can view shopify service page" ON shopify_service_page
  FOR SELECT USING (true);

-- Only authenticated can write
CREATE POLICY "Authenticated users can insert" ON shopify_service_page
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update" ON shopify_service_page
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete" ON shopify_service_page
  FOR DELETE USING (auth.role() = 'authenticated');

-- Auto-update updated_at
CREATE TRIGGER update_shopify_service_page_updated_at
  BEFORE UPDATE ON shopify_service_page
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Seed default content ──────────────────────────────────

INSERT INTO shopify_service_page (section, content) VALUES

('hero', '{
  "badge": "Shopify Development",
  "heading": "Shopify Custom Theme Development Services for High-Converting Stores",
  "subheading": "Whether you''re launching a new online store or upgrading your existing one, Qualixe delivers Shopify custom theme development tailored to your needs. Our themes are designed around your brand, audience, and goals—combining creative design with high performance to turn visitors into customers.",
  "cta_text": "Get a Free Quote",
  "cta_url": "/contact"
}'::jsonb),

('services', '{
  "heading": "Our Shopify Theme Development Services",
  "subheading": "Everything you need to launch, grow, and scale your online store.",
  "items": [
    {"icon": "bi-shop", "title": "Shopify Theme Design", "desc": "Even though Shopify offers a wide range of themes, every successful business has its own unique identity—something that cannot be fully expressed through a ready-made template. That''s where custom Shopify theme development becomes essential. At Qualixe, our experienced team creates fully customized Shopify stores tailored specifically to your brand."},
    {"icon": "bi-palette2", "title": "Theme Customization", "desc": "Already have a theme? We give it a personality. From layout tweaks to full redesigns, we customize your existing Shopify theme to match your brand perfectly."},
    {"icon": "bi-puzzle", "title": "App & Integration Setup", "desc": "We integrate the right Shopify apps and third-party tools — payment gateways, inventory systems, CRMs, and more — to streamline your operations."},
    {"icon": "bi-speedometer2", "title": "Performance Optimization", "desc": "Slow stores lose sales. We optimize your store''s speed, Core Web Vitals, and mobile experience so customers stay and buy."},
    {"icon": "bi-search", "title": "E-Commerce SEO", "desc": "We set up your store with SEO best practices — structured data, meta tags, clean URLs, and fast load times — so you rank higher and get found."},
    {"icon": "bi-headset", "title": "Ongoing Support & Maintenance", "desc": "After launch, we''re still here. We offer ongoing support, updates, and feature additions so your store keeps growing."}
  ]
}'::jsonb),

('process', '{
  "heading": "Our Development Process",
  "subheading": "A clear, transparent process so you always know what''s happening and what''s next.",
  "items": [
    {"title": "Discovery & Planning", "desc": "We start by understanding your business, target audience, and goals. Then we map out the project scope, timeline, and deliverables."},
    {"title": "Design & Prototyping", "desc": "Our designers create wireframes and mockups for your approval before any code is written. You see exactly what you''re getting."},
    {"title": "Development", "desc": "Our Shopify developers build your store with clean, scalable code — responsive, fast, and built to convert."},
    {"title": "Testing & QA", "desc": "We test across devices, browsers, and screen sizes. Every feature, form, and checkout flow is verified before launch."},
    {"title": "Launch", "desc": "We deploy your store and handle the go-live process. Your store is live, fast, and ready to sell."},
    {"title": "Post-Launch Support", "desc": "We monitor performance, fix any issues, and help you grow with new features and optimizations."}
  ]
}'::jsonb),

('why_us', '{
  "heading": "Why Choose Qualixe?",
  "subheading": "We don''t just build stores — we build businesses.",
  "items": [
    {"icon": "bi-award", "title": "Shopify Experts", "desc": "We specialize exclusively in Shopify — no generalists here. Every project benefits from deep platform expertise."},
    {"icon": "bi-lightning-charge", "title": "Fast Turnaround", "desc": "We work efficiently without cutting corners. Most stores are delivered within 4–8 weeks."},
    {"icon": "bi-person-check", "title": "Dedicated Project Manager", "desc": "You get a single point of contact who keeps you updated at every stage."},
    {"icon": "bi-phone", "title": "Mobile-First Approach", "desc": "Over 70% of e-commerce traffic is mobile. We design and build for mobile first, always."},
    {"icon": "bi-graph-up-arrow", "title": "Conversion Focused", "desc": "Every design decision is made with one goal: turning visitors into paying customers."},
    {"icon": "bi-shield-check", "title": "Transparent Pricing", "desc": "No hidden fees. You know exactly what you''re paying for before we start."}
  ]
}'::jsonb),

('faq', '{
  "heading": "Frequently Asked Questions",
  "subheading": "Everything you need to know about our e-commerce development services.",
  "items": [
    {"q": "How long does it take to build a Shopify store?", "a": "A standard custom Shopify store typically takes 4–8 weeks depending on complexity. We''ll give you a clear timeline after the discovery call."},
    {"q": "Do I need a Shopify subscription?", "a": "Yes, you''ll need a Shopify plan (starting at $39/month). We''ll help you choose the right plan for your business."},
    {"q": "Can you migrate my existing store to Shopify?", "a": "Absolutely. We handle migrations from WooCommerce, Magento, BigCommerce, and other platforms — including products, customers, and order history."},
    {"q": "Will my store be mobile-friendly?", "a": "Yes. Every store we build is fully responsive and tested across all major devices and screen sizes."},
    {"q": "Do you offer support after launch?", "a": "Yes. We offer monthly maintenance packages and on-demand support so your store stays healthy and up to date."}
  ]
}'::jsonb),

('cta', '{
  "heading": "Ready to Build Your Dream Store?",
  "subheading": "Let''s talk about your project. We''ll get back to you within 24 hours.",
  "btn_text": "Start Your Project",
  "btn_url": "/contact"
}'::jsonb)

ON CONFLICT (section) DO NOTHING;
