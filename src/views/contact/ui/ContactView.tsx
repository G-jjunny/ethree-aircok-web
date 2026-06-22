import { ContactHeroSection } from './ContactHeroSection'
import { ContactFormSection } from './ContactFormSection'
import { ContactMapSection } from './ContactMapSection'
import { ContactInfoSection } from './ContactInfoSection'

export function ContactView() {
  return (
    <main>
      <ContactHeroSection />
      <ContactFormSection />
      <ContactMapSection />
      <ContactInfoSection />
    </main>
  )
}
