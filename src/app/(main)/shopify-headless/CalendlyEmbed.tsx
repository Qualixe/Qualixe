'use client';

import { InlineWidget } from 'react-calendly';

export default function CalendlyEmbed() {
  return (
    <InlineWidget
      url="https://calendly.com/qualixe-info/30min"
      styles={{ height: '650px', width: '100%' }}
    />
  );
}
