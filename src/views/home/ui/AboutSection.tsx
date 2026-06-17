import { SITE } from '@/shared/config';

export function AboutSection() {
  return (
    <section className="bg-surface-light">
      <div className="max-w-[1200px] mx-auto px-5 py-9 text-center">
        <h2 className="text-heading-dark font-display text-3xl md:text-4xl font-semibold leading-tight tracking-tight mb-6">
          {SITE.aboutHeadline}
        </h2>
        <p className="text-body-dark text-base leading-relaxed max-w-2xl mx-auto">
          {SITE.description}
        </p>
      </div>
    </section>
  );
}
