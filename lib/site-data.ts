export type Project = { slug: string; name: string; type: string; location: string; client: string; status: string; description: string; detail: string; accent: string; scope: string[] }

export const company = {
  name: 'NEGO Construction Limited',
  address: '2, Gbolahun Lawal Street, Off Ashabi Cole, Lateef Jakande Road, CBD Ikeja, Lagos',
  phones: ['0909 110 0558', '0703 656 4734'],
  intro: 'NEGO Construction is an indigenous company incorporated to carry out the business of engineering construction. Over time, we have steadily grown to become known for our specialized services across infrastructure, residential and commercial development.',
  story: 'The training background of our management team places the company in an advantageous position to handle various forms of projects as project managers or contractors. Our endeavour towards excellence in construction quality, safety performance, employee satisfaction and social responsibility has enabled us to become a trusted and sought-after engineering, procurement, construction, operations and project management company.',
  vision: 'To keep pace with the evolving construction landscape and, in partnership with our clients, never fail to deliver personalized services, superior craftsmanship and enduring value to every project that we undertake.',
  mission: ['To offer innovative and cost-effective solutions to our clients in conception, engineering, design, construction and long-term maintenance.', 'To be the foremost indigenous firm with a reputation for integrity, short construction schedules and a motivated workforce which is continuously trained.', 'To be committed to the observance of all health, safety and environmental requirements in accordance with international practice.'],
}

export const strengths = [
  'NEGO has carried out various projects which include commercial buildings, industrial buildings, office complexes, roads, social and recreational buildings, town settlement, housing projects, educational building, stadium and more.',
  'NEGO has the experience and expertise to undertake construction projects of scale and technical complexity. Its portfolio of completed and on-going projects is impressive as it is diverse.',
  'NEGO has delivered projects, providing value-added engineering, construction and service skills to customers for whom the quality of execution, efficiency and reliability are critical.',
  'NEGO always has the highest concern for safety and this is evidenced by securing some of the best records for safety in its operations.',
  'NEGO is committed to social responsibilities and is providing suitable training, employment and growth opportunities to Nigerians at all levels.',
]

export const qualityStandards = ['Built in accordance with contract specifications and drawings', 'In compliance with building regulations', 'In compliance with statutory requirements', 'In conformity with industry best standards', 'In compliance with planning conditions where applicable', 'Completed to the satisfaction of the design team and clients']
export const safetyCommitments = ['Establish an occupational Health and Safety management system to eliminate or minimize risks to employees and third parties who may be exposed to occupational risks associated with NEGO Construction activities.', 'Implement, maintain and continually improve the occupational Health and Safety management system.', 'Ensure conformance with its stated Occupational Health and Safety policy.', 'Demonstrate such conformance to other interested parties.', 'Provide employees with information, training and supervision needed to work safely and efficiently and develop safety awareness among employees and subcontractors.', 'Define all individuals’ responsibilities for Health and Safety obligations.']

export const projects: Project[] = [
  { slug: 'lily-park', name: 'Lily Park', type: 'Residential development', location: 'Lagos, Nigeria', client: 'Private development partner', status: 'Ongoing', description: 'A considered residential development shaped around practical delivery, careful coordination and lasting value.', detail: 'Lily Park is a new residential address created around the everyday experience of its future residents. NEGO is coordinating the project with a focus on build quality, programme discipline and a clear path from concept to completion.', accent: 'LP', scope: ['Residential construction', 'Project coordination', 'Quality and safety management'] },
  { slug: 'abacha-road', name: 'Abacha Road', type: 'Road construction', location: 'Rivers State, Nigeria', client: 'Deux Project / Rivers State Government', status: 'Completed', description: 'Road infrastructure delivered with a focus on reliable movement, resilient construction and community impact.', detail: 'The Abacha Road project demonstrates NEGO’s ability to coordinate civil works in an active community environment while keeping quality, access and delivery requirements in view.', accent: 'AR', scope: ['Road construction', 'Civil works', 'Site management'] },
  { slug: 'common-user-road', name: 'Rehabilitation of Common User Road', type: 'Road construction', location: 'Warri, Delta State, Nigeria', client: 'Nigerian Ports Authority', status: 'Completed', description: 'Rehabilitation works that connect people, operations and opportunity through dependable infrastructure.', detail: 'This rehabilitation project improved access and movement around a key operational environment. The work called for durable construction, practical sequencing and close attention to the needs of users during delivery.', accent: 'CU', scope: ['Infrastructure rehabilitation', 'Access roads', 'Construction management'] },
  { slug: 'commercial-complex', name: 'Commercial Complex', type: 'Commercial construction', location: 'Lagos, Nigeria', client: 'Confidential client', status: 'Completed', description: 'End-to-end project management for a commercial environment built for performance and longevity.', detail: 'From early coordination through final handover, the commercial complex was delivered as an integrated build with a strong focus on functionality, quality and long-term value.', accent: 'CC', scope: ['Commercial building', 'Procurement', 'Project management'] },
]

export const services = [
  { title: 'Engineering construction', text: 'We deliver civil and building works with the technical judgement required to turn drawings, specifications and site conditions into safe, buildable outcomes.', detail: 'Our construction approach brings together site management, technical coordination, supervision, materials planning and quality control from early works through handover.' },
  { title: 'Infrastructure & roads', text: 'Reliable roads and public infrastructure that improve access, movement and the everyday experience of the communities they serve.', detail: 'Our infrastructure work covers road construction, rehabilitation and associated civil works, with careful attention to sequencing, durability and live-site coordination.' },
  { title: 'Procurement', text: 'A disciplined procurement process that aligns materials, specialist partners and resources with the project programme.', detail: 'We coordinate sourcing and delivery to support cost control, reduce avoidable delays and maintain the quality standards agreed with clients and design teams.' },
  { title: 'Project management', text: 'One accountable team guiding scope, programme, quality, safety, communication and commercial priorities.', detail: 'We support clients and project partners with practical oversight across conception, design, construction, operations and long-term maintenance.' },
]

export const testimonials = [
  { quote: 'NEGO brought a rare mix of technical confidence and practical communication to the project. We always knew what was happening next.', name: 'Project partner', role: 'Commercial development' },
  { quote: 'The team understood that a successful build is measured by more than the handover. They cared about the people and the long-term result.', name: 'Client representative', role: 'Infrastructure programme' },
  { quote: 'Reliable, responsive and committed to quality from the first conversation through delivery.', name: 'Development partner', role: 'Residential project' },
]

export const team = [
  { name: 'Engr. Banjo Adedeji', role: 'Managing Director', credentials: 'B.Sc. Civil Engineering', bio: 'He has diverse 24 years experience in road construction and high-rise building management. Having worked briefly with S.N.C Lawalin, he brings his wide experience to bear on all projects.' },
  { name: 'Arc. Ajibade Adedayo Adeyemo', role: 'Senior Projects Manager', credentials: 'B.Sc., M.Sc. Architecture, ARCON', bio: 'He has over 25 years experience in construction and site management, with vast experience as a consultant engineer.' },
  { name: 'Engr. David Adedoyin', role: 'Project Manager', credentials: 'B.Sc. Mechanical Engineering, MNSE, Registered Member (COREN)', bio: 'He has over 19 years experience in construction and site management, with vast experience as a consultant engineer.' },
  { name: 'Mr. Abisola Somorin', role: 'Head of Quantity Surveying', credentials: 'B.Sc. Quantity Surveying, MBA, R.I.C.S, P.M.P, RQS, MNIQS', bio: 'He has 14 years construction experience and contract management, and is a good tracker of projects from conception to completion.' },
  { name: 'Eng. Salawu Wakeel Taiwo', role: 'Site Engineer', credentials: 'B.Sc. MBA Engineering, COREN', bio: 'He has over 19 years experience in construction and site management, as well as extensive experience as a consultant builder.' },
]
