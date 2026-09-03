export type Project = { slug: string; name: string; type: string; location: string; client: string; status: string; description: string; detail: string; accent: string; scope: string[] }

export const company = {
  name: 'NEGO Construction Limited',
  address: '2, Gbolahun Lawal Street, Off Ashabi Cole, Lateef Jakande Road, CBD Ikeja, Lagos',
  phones: ['0805 523 5816', '0807 415 1014'],
  email: 'info@negoconstruction.com',
  intro: 'NEGO Construction is an indigenous company incorporated to carry out the business of engineering construction. Over time, we have gradually but steadily grown to become known for our specialised services across infrastructure, residential and commercial development.',
  story: 'The training background of our management team places us in an advantageous position to handle various forms of projects — as project managers or contractors. Our commitment to excellence in construction quality, safety performance, employee satisfaction and social responsibility has enabled us to become a trusted and sought-after engineering, procurement, construction, operations and project management company.',
  social: 'NEGO is committed to social responsibility, providing suitable training, employment and growth opportunities to Nigerians at all levels. We believe that what we build should benefit not just our clients, but the communities in which we work.',
  vision: 'To keep pace with the evolving construction landscape and, in partnership with our clients, never fail to deliver personalised services, superior craftsmanship and enduring value to every project we undertake.',
  mission: [
    'To offer innovative and cost-effective solutions to our clients in conception, engineering, design, construction and long-term maintenance.',
    'To be the foremost indigenous firm with a reputation for integrity, short construction schedules and a motivated workforce which is continuously trained.',
    'To be committed to the observance of all health, safety and environmental requirements in accordance with international practice.',
  ],
}

export const strengths = [
  'Over the years, NEGO has carried out a diverse range of projects — commercial buildings, industrial buildings, office complexes, roads, social and recreational facilities, town settlements, housing projects, educational buildings, stadia and more.',
  'We have the experience and expertise to undertake construction projects of scale and technical complexity. Our portfolio of completed and ongoing projects is as impressive as it is diverse.',
  'NEGO has delivered projects providing value-added engineering, construction and service skills to clients for whom quality of execution, efficiency and reliability are critical.',
  'NEGO always has the highest concern for safety. This is evidenced by securing some of the best records for safety in our operations.',
  'NEGO is committed to social responsibility, providing suitable training, employment and growth opportunities to Nigerians at all levels.',
]

export const qualityStandards = ['Built in accordance with contract specifications and drawings', 'In compliance with building regulations', 'In compliance with statutory requirements', 'In conformity with industry best standards', 'In compliance with planning conditions where applicable', 'Completed to the satisfaction of the design team and clients']

export const safetyCommitments = ['Establish an occupational Health and Safety management system to eliminate or minimize risks to employees and third parties who may be exposed to occupational risks associated with NEGO Construction activities.', 'Implement, maintain and continually improve the occupational Health and Safety management system.', 'Ensure conformance with its stated Occupational Health and Safety policy.', 'Demonstrate such conformance to other interested parties.', 'Provide employees with information, training and supervision needed to work safely and efficiently and develop safety awareness among employees and subcontractors.', 'Define all individuals\' responsibilities for Health and Safety obligations.']

export const projects: Project[] = [
  { slug: 'lily-park', name: 'Lily Park', type: 'Residential development', location: 'Abijo GRA, Lagos, Nigeria', client: 'Joint venture with LSDPC', status: 'Ongoing', description: 'An estate where wellness, peace and community come together — reshaping estate life in Lagos.', detail: 'Lily Park is an estate developed and constructed by NEGO Construction Limited in Abijo GRA. Using NEGO\'s years of expertise, we have created a living experience that reshapes the usual conventions of estate life. The main goal isn\'t just living — it\'s wellness and a peaceful lifestyle that nurtures and allows for growth. Access is easy from the coastal road, less than 20 minutes from Victoria Island.', accent: 'LP', scope: ['Residential estate development', 'Master planning', 'Infrastructure', 'Quality and safety management'] },
  { slug: 'alpha-court', name: 'Alpha Court', type: 'Residential development', location: 'Forthright Estate, Punch Place, Magboro, Ogun', client: 'Green Earth Property Development', status: 'Completed', description: 'Construction of 72 luxury flats — modern residential living in Ogun State.', detail: 'Alpha Court represents NEGO Construction\'s expertise in large-scale residential development. Working with Green Earth Property Development, we delivered 72 luxury flats at Forthright Estate in Magboro. The project showcases our ability to manage complex residential construction while maintaining quality standards and meeting delivery timelines for multi-unit housing developments.', accent: 'AC', scope: ['Residential construction', 'Multi-unit housing', '72 luxury flats', 'Quality management', 'Project coordination'] },
  { slug: 'imo-hills-farm', name: 'Imo Hills Farm Project', type: 'Agricultural facility', location: 'Ilesha, Osun State, Nigeria', client: 'Imo Hills Farm Ltd.', status: 'Completed', description: 'Agricultural facility construction supporting farming operations in Osun State.', detail: 'The Imo Hills Farm Project in Ilesha, Osun State demonstrates NEGO\'s versatility beyond traditional infrastructure. Delivered for Imo Hills Farm Ltd., this project required specialized construction considerations for agricultural operations. NEGO coordinated all aspects of the build to ensure the facility met the unique requirements of modern farming operations while maintaining durability and functionality.', accent: 'IH', scope: ['Agricultural construction', 'Farm infrastructure', 'Specialized facilities', 'Project delivery'] },
  { slug: 'abacha-road', name: 'Abacha Road', type: 'Road construction', location: 'Rivers State, Nigeria', client: 'Deux Project / Rivers State Government', status: 'Completed', description: 'Design and construction of Abacha Road with drains and kerbs — reliable infrastructure connecting communities.', detail: 'The Abacha Road project involved the complete design and construction of the road including drainage systems and kerbing. Delivered in partnership with Deux Project and the Rivers State Government, the project demonstrates NEGO\'s ability to coordinate civil works in an active community environment while keeping quality, access and delivery requirements in view.', accent: 'AR', scope: ['Road construction', 'Drainage infrastructure', 'Kerbing', 'Civil works', 'Site management'] },
  { slug: 'eku-baptist-hospital', name: 'Eku Baptist Hospital', type: 'Healthcare facility', location: 'Eku, Delta State, Nigeria', client: 'Deux Project', status: 'Completed', description: 'A modern healthcare facility built to serve the community with quality medical infrastructure.', detail: 'The Eku Baptist Hospital project showcases NEGO Construction\'s capability in delivering healthcare infrastructure. Working with Deux Project, we provided end-to-end construction services to create a facility designed to meet the medical needs of the Eku community with attention to functionality, durability and accessibility.', accent: 'EH', scope: ['Healthcare construction', 'Medical infrastructure', 'Project coordination', 'Quality management'] },
  { slug: 'comprehensive-healthcare-centre', name: 'Comprehensive Healthcare Centre', type: 'Healthcare facility', location: 'Onna LGA, Akwa-Ibom, Nigeria', client: 'Akwa-Ibom State Government', status: 'Completed', description: 'A comprehensive healthcare facility delivering essential medical services to the Onna community.', detail: 'This comprehensive healthcare centre in Onna LGA was delivered for the Akwa-Ibom State Government. The project required careful coordination of medical infrastructure standards, construction quality and timely delivery to ensure the facility could begin serving the community as planned. NEGO managed all aspects from design implementation through final handover.', accent: 'HC', scope: ['Healthcare construction', 'Government project delivery', 'Infrastructure coordination', 'Quality and safety management'] },
]

// Complete portfolio of all NEGO projects
export const allProjects = [
  { name: '500 Seater Auditorium Complex', client: 'Beulah Baptist Church', type: 'Religious facility' },
  { name: 'Church Complex Construction', client: 'Beulah Baptist Church, Ile-Ife', type: 'Religious facility' },
  { name: 'Construction of 2 Detached Houses', client: 'Private client', type: 'Residential' },
  { name: 'Construction of Terraced Houses', client: 'Private client', type: 'Residential' },
  { name: 'Factory Complex', client: 'Soulmate Industries Ltd.', type: 'Industrial' },
  { name: 'MCC Amuwo-Odofin General Hospital', client: 'Deux Projects / Lagos State Government', type: 'Healthcare' },
  { name: 'Rehabilitation of Buildings at Eku Baptist Hospital', client: 'Deux Projects', type: 'Healthcare' },
  { name: 'Mechatronic and Robotic Engineering Centre', client: 'Deux Projects / Lagos State Government', type: 'Educational' },
  { name: 'Construction of Otta Road', client: 'Deux Projects / Lagos State Government', type: 'Infrastructure' },
  { name: 'Renovation of Teslim Balogun Stadium', client: 'Lagos State Government (Under-17 World Cup)', type: 'Sports facility' },
  { name: 'EarthBasket Farms Limited', client: 'EarthBasket Farms Limited', type: 'Agricultural' },
  { name: 'Mother and Child Care Centre', client: 'Delta State Government', type: 'Healthcare' },
  { name: 'Construction of Shopping Complex', client: 'Soulmate Industries Ltd.', type: 'Commercial' },
  { name: 'LASUCOM Hostel (Medical Students)', client: 'Deux Projects / Lagos State Government', type: 'Educational' },
  { name: 'General Hospital Lagos', client: 'Lagos State Government', type: 'Healthcare' },
  { name: 'National Atomic Energy Complex (N.A.E.C)', client: 'Taraba State Government', type: 'Government facility' },
  { name: 'Abacha Road', client: 'Deux Projects / Rivers State Government', type: 'Infrastructure' },
  { name: 'Warri - Ororekpe Bridge', client: 'Delta State Government', type: 'Infrastructure' },
  { name: 'Desopadee Project', client: 'Delta State Government', type: 'Infrastructure' },
  { name: 'Nigerian Army Welfare Insurance Scheme', client: 'Nigerian Army', type: 'Government facility' },
  { name: 'Asset and Resource Management (A.R.M)', client: 'A.R.M', type: 'Commercial' },
  { name: 'The Polytechnic Ibadan', client: 'The Polytechnic Ibadan', type: 'Educational' },
  { name: 'Alpha Court - 72 Luxury Flats', client: 'Green Earth Property Development', type: 'Residential' },
  { name: 'Lily Park Estate', client: 'Joint venture with LSDPC', type: 'Residential' },
  { name: 'Imo Hills Farm Project', client: 'Imo Hills Farm Ltd.', type: 'Agricultural' },
  { name: 'Comprehensive Healthcare Centre', client: 'Akwa-Ibom State Government', type: 'Healthcare' },
]

export const services = [
  { title: 'Engineering construction', text: 'We deliver civil and building works with the technical judgement required to turn drawings, specifications and site conditions into safe, buildable outcomes.', detail: 'Our construction approach brings together site management, technical coordination, supervision, materials planning and quality control from early works through handover.' },
  { title: 'Infrastructure & roads', text: 'Reliable roads and public infrastructure that improve access, movement and the everyday experience of the communities they serve.', detail: 'Our infrastructure work covers road construction, rehabilitation and associated civil works, with careful attention to sequencing, durability and live-site coordination.' },
  { title: 'Procurement', text: 'A disciplined procurement process that aligns materials, specialist partners and resources with the project programme.', detail: 'We coordinate sourcing and delivery to support cost control, reduce avoidable delays and maintain the quality standards agreed with clients and design teams.' },
  { title: 'Project management', text: 'One accountable team guiding scope, programme, quality, safety, communication and commercial priorities.', detail: 'We support clients and project partners with practical oversight across conception, design, construction, operations and long-term maintenance.' },
]

export const testimonials = [
  { quote: 'I have had the privilege of working with Nego Construction for over two decades on many projects. I can testify to their unwavering commitment to excellence. Their exceptional craftsmanship, technical expertise, and integrity are evident in every project they deliver. They never compromise on quality materials or workmanship, consistently exceeding expectations. Nego Construction is a name synonymous with quality, reliability, and lasting value.', name: 'Arc. Eromosele Anetor, FNIA', role: 'Architect & Project Manager, Anetorplus Limited' },
  { quote: 'I have partnered with NEGO over the years as a real estate agent and on this project. I value their professionalism, competence, reliability and structured approach. The team communicates clearly, responds promptly, and keeps me informed at every stage of the process and development. They manage timelines well, address issues efficiently, and provide practical solutions whenever needed. Their technical expertise, attention to detail, and transparent way of working makes the experience straightforward and stress free.', name: 'Mothis', role: 'Real Estate Agent' },
  { quote: 'Reliable, responsive and committed to quality from the first conversation through delivery.', name: 'Development partner', role: 'Residential project' },
]

export const team = [
  {
    name: 'Adebanjo Adedeji',
    role: 'Founder & Managing Director',
    credentials: 'B.Sc. Civil Engineering',
    photo: '',
    bio: 'I have had the privilege of leading and managing Nego Construction Limited for the past 25 years. What began as a vision has grown into a thriving company, built from the ground up alongside an exceptional team of dedicated employees and strengthened by the trust and support of the clients, partners, and friends we have gained along the way. I founded Nego Construction with a clear purpose: to create a company that improves lives through quality construction while providing meaningful opportunities for the people who make our work possible. We have always believed that every project is more than just a building — it is an opportunity to deliver lasting value, build strong relationships, and contribute to the growth of our communities.',
  },
  {
    name: 'Kofoworola Adedeji',
    role: 'Director',
    credentials: '',
    photo: '',
    bio: 'Serving as a Director of Nego Construction Limited has been one of the greatest privileges of my professional journey. For the past 25 years, I have had the opportunity to help guide the growth of a company that was built on hard work, integrity, and a commitment to excellence. At Nego Construction Limited, we believe that our responsibility extends beyond constructing buildings. We are committed to creating value for our clients, providing opportunities for our employees, and delivering projects that stand as a testament to quality, innovation, and reliability.',
  },
  {
    name: 'Oyinshi Theresa',
    role: 'Accountant',
    credentials: '',
    photo: '/teams/Theresa.jpg',
    bio: 'As the Accountant at Nego Construction Limited, I have been responsible for overseeing the company\'s financial operations for the past two years. My role involves managing financial records, preparing budgets and reports, monitoring project expenditures, and ensuring compliance with financial regulations and industry standards. By maintaining sound financial practices, I support informed decision-making and contribute to the company\'s continued growth and stability.',
  },
  {
    name: 'Peter Akpan',
    role: 'Lead Project Engineer',
    credentials: '',
    photo: '/teams/peter-2.jpg',
    bio: 'As a Project Engineer at Nego Construction Limited, I help ensure that every project is executed efficiently, safely, and to the highest standards. My responsibilities include project planning, coordinating engineering activities, monitoring construction progress, ensuring compliance with technical specifications, and supporting the timely completion of projects within budget. I remain dedicated to innovation, teamwork, and delivering engineering solutions that exceed client expectations.',
  },
  {
    name: 'Robert Edouk',
    role: 'Inventory Manager',
    credentials: '',
    photo: '/teams/Robert.jpg',
    bio: 'As the Inventory Manager at Nego Construction Limited, I am responsible for ensuring that materials, equipment, and supplies are efficiently managed to support the successful delivery of every project. My role includes overseeing stock levels, coordinating procurement, monitoring the movement of materials, and ensuring that resources are available when and where they are needed. By implementing organised inventory systems and maintaining accurate records, I contribute to minimising waste, optimising costs, and improving project efficiency.',
  },
]
