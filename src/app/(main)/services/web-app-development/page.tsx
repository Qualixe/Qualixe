import ServicePageView from '../ServicePageView';
import { SERVICES, buildServiceMetadata, buildServiceJsonLd } from '../serviceConfig';
import { CONTENT } from './content';

const cfg = SERVICES['web-app-development'];

export const metadata = buildServiceMetadata(cfg);

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildServiceJsonLd(cfg, CONTENT)) }}
      />
      <ServicePageView cfg={cfg} page={CONTENT} />
    </>
  );
}
