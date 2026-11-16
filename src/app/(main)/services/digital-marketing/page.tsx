import { getDigitalMarketingPage } from '../../../../../lib/api/digital-marketing-service';
import ServicePageView from '../ServicePageView';
import { SERVICES, buildServiceMetadata, buildServiceJsonLd } from '../serviceConfig';
import { FALLBACK } from './fallback';

// Content is edited in the dashboard; re-render at most once a minute
export const revalidate = 60;

const cfg = SERVICES['digital-marketing'];

export const metadata = buildServiceMetadata(cfg);

export default async function DigitalMarketingPage() {
  const data = await getDigitalMarketingPage().catch(() => null);
  const page = data ?? FALLBACK;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildServiceJsonLd(cfg, page)) }}
      />
      <ServicePageView cfg={cfg} page={page} />
    </>
  );
}
