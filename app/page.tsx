'use client';

import HeroLoginLanding from '@/components/HeroLoginLanding';

export default function HomePage() {
  return (
    <div style={{ minHeight: "calc(100vh - 4rem)", background: "#f8fafc", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <HeroLoginLanding />
    </div>
  );
}
