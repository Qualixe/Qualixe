import { GA4_MEASUREMENT_ID, GOOGLE_ADS_ID, META_PIXEL_ID } from '../landing.config';

// Rendered first thing by the landing layout. Inline (not next/script) so the
// fbq/gtag stubs exist before hydration and events fired on mount are queued.
export default function TrackingScripts() {
  const gtagIds = [GA4_MEASUREMENT_ID, GOOGLE_ADS_ID].filter(Boolean);

  return (
    <>
      {/* Meta Pixel — PageView on every page */}
      {META_PIXEL_ID && (
        <script
          id="meta-pixel"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init',${JSON.stringify(META_PIXEL_ID)});fbq('track','PageView');`,
          }}
        />
      )}

      {/* Google tag — GA4 page_view on every page, plus Google Ads */}
      {gtagIds.length > 0 && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${gtagIds[0]}`} />
          <script
            id="google-tag"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());${gtagIds.map((id) => `gtag('config',${JSON.stringify(id)});`).join('')}`,
            }}
          />
        </>
      )}
    </>
  );
}
