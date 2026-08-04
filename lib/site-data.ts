export type Project = { slug: string; name: string; type: string; location: string; client: string; status: string; description: string; accent: string }

export const projects: Project[] = [
  { slug: 'lily-park', name: 'Lily Park', type: 'Residential development', location: 'Lagos, Nigeria', client: 'Private development partner', status: 'Ongoing', description: 'A considered residential development shaped around practical delivery, careful coordination and lasting value.', accent: 'LP' },
  { slug: 'abacha-road', name: 'Abacha Road', type: 'Road construction', location: 'Rivers State, Nigeria', client: 'Deux Project / Rivers State Government', status: 'Completed', description: 'Road infrastructure delivered with a focus on reliable movement, resilient construction and community impact.', accent: 'AR' },
  { slug: 'common-user-road', name: 'Common User Road', type: 'Infrastructure rehabilitation', location: 'Warri, Delta State', client: 'Nigerian Ports Authority', status: 'Completed', description: 'Rehabilitation works that connect people, operations and opportunity through dependable infrastructure.', accent: 'CU' },
  { slug: 'commercial-complex', name: 'Commercial Complex', type: 'Commercial construction', location: 'Lagos, Nigeria', client: 'Confidential client', status: 'Completed', description: 'End-to-end project management for a commercial environment built for performance and longevity.', accent: 'CC' },
]

export const services = [
  { title: 'Construction', text: 'From enabling works to final finishes, we build with discipline, clarity and pride.' },
  { title: 'Engineering', text: 'Practical engineering thinking that turns complex requirements into buildable outcomes.' },
  { title: 'Procurement', text: 'Transparent coordination of materials, partners and resources for confident delivery.' },
  { title: 'Project management', text: 'One accountable team guiding scope, programme, quality, safety and communication.' },
]

export const testimonials = [
  { quote: 'NEGO brought a rare mix of technical confidence and practical communication to the project. We always knew what was happening next.', name: 'Project partner', role: 'Commercial development' },
  { quote: 'The team understood that a successful build is measured by more than the handover. They cared about the people and the long-term result.', name: 'Client representative', role: 'Infrastructure programme' },
  { quote: 'Reliable, responsive and committed to quality from the first conversation through delivery.', name: 'Development partner', role: 'Residential project' },
]

export const team = [
  { name: 'Engr. Banjo Adedeji', role: 'Managing Director', bio: 'A civil engineering leader with extensive experience across road construction and high-rise building management.' },
  { name: 'Arc. Ajibade Adedayo Adeyemo', role: 'Senior Projects Manager', bio: 'An architect and site management specialist with a deep understanding of complex construction delivery.' },
  { name: 'Engr. David Adedoyin', role: 'Project Manager', bio: 'A mechanical engineering professional with broad construction and site management experience.' },
]
