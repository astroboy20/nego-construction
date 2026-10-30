/**
 * Seed the Supabase knowledge_base table with content from site-data.
 * Run once after setting up your database:
 *   node scripts/seed-knowledge-base.mjs
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load .env manually (no dotenv dep needed)
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, '..', '.env')
const envContent = readFileSync(envPath, 'utf8')
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const idx = trimmed.indexOf('=')
  if (idx === -1) continue
  const key = trimmed.slice(0, idx).trim()
  const val = trimmed.slice(idx + 1).trim()
  process.env[key] ??= val
}

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌  Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ── Knowledge base entries derived from site-data ────────────────────────────

const entries = [
  // ── ABOUT ──────────────────────────────────────────────────────────────────
  {
    title: 'About NEGO Construction Limited',
    category: 'about',
    content: `NEGO Construction Limited is an indigenous Nigerian engineering construction company incorporated to carry out the business of engineering construction. Over time, we have gradually but steadily grown to become known for specialised services across infrastructure, residential and commercial development.

Address: 2, Gbolahun Lawal Street, Off Ashabi Cole, Lateef Jakande Road, CBD Ikeja, Lagos
Phone: 0805 523 5816 / 0807 415 1014
Email: info@negoconstruction.com

The training background of our management team places us in an advantageous position to handle various forms of projects — as project managers or contractors. Our commitment to excellence in construction quality, safety performance, employee satisfaction and social responsibility has enabled us to become a trusted and sought-after engineering, procurement, construction, operations and project management company.`,
  },
  {
    title: 'NEGO Vision and Mission',
    category: 'about',
    content: `Vision: To keep pace with the evolving construction landscape and, in partnership with our clients, never fail to deliver personalised services, superior craftsmanship and enduring value to every project we undertake.

Mission:
- To offer innovative and cost-effective solutions to our clients in conception, engineering, design, construction and long-term maintenance.
- To be the foremost indigenous firm with a reputation for integrity, short construction schedules and a motivated workforce which is continuously trained.
- To be committed to the observance of all health, safety and environmental requirements in accordance with international practice.`,
  },
  {
    title: 'NEGO Key Strengths and Track Record',
    category: 'about',
    content: `NEGO Construction has carried out a diverse range of projects — commercial buildings, industrial buildings, office complexes, roads, social and recreational facilities, town settlements, housing projects, educational buildings, stadia and more.

We have the experience and expertise to undertake construction projects of scale and technical complexity. Our portfolio of completed and ongoing projects is as impressive as it is diverse.

NEGO has delivered projects providing value-added engineering, construction and service skills to clients for whom quality of execution, efficiency and reliability are critical.

NEGO always has the highest concern for safety, evidenced by securing some of the best records for safety in our operations.

NEGO is committed to social responsibility, providing suitable training, employment and growth opportunities to Nigerians at all levels.`,
  },
  {
    title: 'Quality Standards',
    category: 'about',
    content: `All NEGO Construction projects are delivered:
- Built in accordance with contract specifications and drawings
- In compliance with building regulations
- In compliance with statutory requirements
- In conformity with industry best standards
- In compliance with planning conditions where applicable
- Completed to the satisfaction of the design team and clients`,
  },
  {
    title: 'Health, Safety and Environmental Commitments',
    category: 'about',
    content: `NEGO Construction is committed to:
- Establishing an occupational Health and Safety management system to eliminate or minimise risks to employees and third parties.
- Implementing, maintaining and continually improving the occupational Health and Safety management system.
- Providing employees with information, training and supervision needed to work safely and efficiently.
- Developing safety awareness among employees and subcontractors.
- Defining all individuals' responsibilities for Health and Safety obligations.`,
  },
  {
    title: 'NEGO Leadership Team',
    category: 'about',
    content: `Adebanjo Adedeji — Founder & Managing Director (B.Sc. Civil Engineering)
Has led NEGO Construction Limited for over 25 years. Founded NEGO with a clear purpose: to create a company that improves lives through quality construction while providing meaningful opportunities. Every project is more than just a building — it is an opportunity to deliver lasting value, build strong relationships, and contribute to community growth.

Kofoworola Adedeji — Director
Has served as a Director for 25 years, helping guide the company's growth. Believes NEGO's responsibility extends beyond constructing buildings — creating value for clients, providing opportunities for employees, and delivering quality, innovative and reliable projects.

Oyinshi Theresa — Accountant
Manages financial operations including records, budgets, project expenditures and compliance with financial regulations.

Peter Akpan — Lead Project Engineer
Responsible for project planning, coordinating engineering activities, monitoring construction progress, and ensuring compliance with technical specifications.

Robert Edouk — Inventory Manager
Oversees stock levels, procurement coordination, movement of materials, and resource availability across projects.`,
  },

  // ── SERVICES ───────────────────────────────────────────────────────────────
  {
    title: 'Services: Engineering Construction',
    category: 'services',
    content: `NEGO delivers civil and building works with the technical judgement required to turn drawings, specifications and site conditions into safe, buildable outcomes.

Our construction approach brings together site management, technical coordination, supervision, materials planning and quality control from early works through handover.`,
  },
  {
    title: 'Services: Infrastructure and Roads',
    category: 'services',
    content: `NEGO provides reliable roads and public infrastructure that improve access, movement and the everyday experience of the communities they serve.

Our infrastructure work covers road construction, rehabilitation and associated civil works, with careful attention to sequencing, durability and live-site coordination.`,
  },
  {
    title: 'Services: Procurement',
    category: 'services',
    content: `NEGO offers a disciplined procurement process that aligns materials, specialist partners and resources with the project programme.

We coordinate sourcing and delivery to support cost control, reduce avoidable delays and maintain the quality standards agreed with clients and design teams.`,
  },
  {
    title: 'Services: Project Management',
    category: 'services',
    content: `NEGO provides one accountable team guiding scope, programme, quality, safety, communication and commercial priorities.

We support clients and project partners with practical oversight across conception, design, construction, operations and long-term maintenance.`,
  },

  // ── PROJECTS ───────────────────────────────────────────────────────────────
  {
    title: 'Project: Lily Park Estate',
    category: 'projects',
    content: `Name: Lily Park
Type: Residential development
Location: Abijo GRA, Lagos, Nigeria
Client: Joint venture with LSDPC (Lagos State Development and Property Corporation)
Status: Ongoing

Lily Park is an estate developed and constructed by NEGO Construction Limited in Abijo GRA. Using NEGO's years of expertise, we have created a living experience that reshapes the usual conventions of estate life. The main goal isn't just living — it's wellness and a peaceful lifestyle that nurtures and allows for growth. Access is easy from the coastal road, less than 20 minutes from Victoria Island.

Scope: Residential estate development, master planning, infrastructure, quality and safety management.`,
  },
  {
    title: 'Project: Alpha Court — 72 Luxury Flats',
    category: 'projects',
    content: `Name: Alpha Court
Type: Residential development
Location: Forthright Estate, Punch Place, Magboro, Ogun State
Client: Green Earth Property Development
Status: Completed

Alpha Court represents NEGO Construction's expertise in large-scale residential development. Working with Green Earth Property Development, we delivered 72 luxury flats at Forthright Estate in Magboro. The project showcases our ability to manage complex residential construction while maintaining quality standards and meeting delivery timelines for multi-unit housing developments.

Scope: Residential construction, multi-unit housing, 72 luxury flats, quality management, project coordination.`,
  },
  {
    title: 'Project: Imo Hills Farm Project',
    category: 'projects',
    content: `Name: Imo Hills Farm Project
Type: Agricultural facility
Location: Ilesha, Osun State, Nigeria
Client: Imo Hills Farm Ltd.
Status: Completed

The Imo Hills Farm Project demonstrates NEGO's versatility beyond traditional infrastructure. Delivered for Imo Hills Farm Ltd., this project required specialised construction considerations for agricultural operations. NEGO coordinated all aspects of the build to ensure the facility met the unique requirements of modern farming operations while maintaining durability and functionality.

Scope: Agricultural construction, farm infrastructure, specialised facilities, project delivery.`,
  },
  {
    title: 'Project: Abacha Road, Rivers State',
    category: 'projects',
    content: `Name: Abacha Road
Type: Road construction
Location: Rivers State, Nigeria
Client: Deux Project / Rivers State Government
Status: Completed

The Abacha Road project involved the complete design and construction of the road including drainage systems and kerbing. Delivered in partnership with Deux Project and the Rivers State Government, the project demonstrates NEGO's ability to coordinate civil works in an active community environment while keeping quality, access and delivery requirements in view.

Scope: Road construction, drainage infrastructure, kerbing, civil works, site management.`,
  },
  {
    title: 'Project: Eku Baptist Hospital',
    category: 'projects',
    content: `Name: Eku Baptist Hospital
Type: Healthcare facility
Location: Eku, Delta State, Nigeria
Client: Deux Project
Status: Completed

The Eku Baptist Hospital project showcases NEGO Construction's capability in delivering healthcare infrastructure. Working with Deux Project, we provided end-to-end construction services to create a facility designed to meet the medical needs of the Eku community with attention to functionality, durability and accessibility.

Scope: Healthcare construction, medical infrastructure, project coordination, quality management.`,
  },
  {
    title: 'Project: Comprehensive Healthcare Centre, Akwa-Ibom',
    category: 'projects',
    content: `Name: Comprehensive Healthcare Centre
Type: Healthcare facility
Location: Onna LGA, Akwa-Ibom State, Nigeria
Client: Akwa-Ibom State Government
Status: Completed

This comprehensive healthcare centre in Onna LGA was delivered for the Akwa-Ibom State Government. The project required careful coordination of medical infrastructure standards, construction quality and timely delivery to ensure the facility could begin serving the community as planned. NEGO managed all aspects from design implementation through final handover.

Scope: Healthcare construction, government project delivery, infrastructure coordination, quality and safety management.`,
  },
  {
    title: 'Full Project Portfolio',
    category: 'projects',
    content: `NEGO Construction's complete portfolio includes:

Residential: 2 Detached Houses (private), Terraced Houses (private), Alpha Court 72 Luxury Flats (Green Earth Property Development), Lily Park Estate (joint venture with LSDPC)

Healthcare: MCC Amuwo-Odofin General Hospital (Deux Projects / Lagos State Government), Rehabilitation of Buildings at Eku Baptist Hospital (Deux Projects), Comprehensive Healthcare Centre (Akwa-Ibom State Government), Mother and Child Care Centre (Delta State Government), General Hospital Lagos (Lagos State Government)

Educational: Mechatronic and Robotic Engineering Centre (Deux Projects / Lagos State Government), LASUCOM Hostel for Medical Students (Deux Projects / Lagos State Government), The Polytechnic Ibadan

Infrastructure/Roads: Construction of Otta Road (Deux Projects / Lagos State Government), Abacha Road (Deux Projects / Rivers State Government), Warri–Ororekpe Bridge (Delta State Government), Desopadee Project (Delta State Government)

Industrial/Commercial: Factory Complex (Soulmate Industries Ltd.), Construction of Shopping Complex (Soulmate Industries Ltd.), Asset and Resource Management – A.R.M

Religious: 500 Seater Auditorium Complex (Beulah Baptist Church), Church Complex Construction (Beulah Baptist Church, Ile-Ife)

Sports: Renovation of Teslim Balogun Stadium (Lagos State Government, Under-17 World Cup)

Agricultural: EarthBasket Farms Limited, Imo Hills Farm Project (Imo Hills Farm Ltd.)

Government: National Atomic Energy Complex N.A.E.C (Taraba State Government), Nigerian Army Welfare Insurance Scheme (Nigerian Army)`,
  },

  // ── CONTACT ────────────────────────────────────────────────────────────────
  {
    title: 'Contact NEGO Construction',
    category: 'contact',
    content: `To get in touch with NEGO Construction Limited:

Address: 2, Gbolahun Lawal Street, Off Ashabi Cole, Lateef Jakande Road, CBD Ikeja, Lagos, Nigeria
Phone: 0805 523 5816 or 0807 415 1014
Email: info@negoconstruction.com
Website contact page: /contact

For project enquiries, partnership proposals or general questions, visit the contact page or reach out directly by phone or email.`,
  },

  // ── FAQ ────────────────────────────────────────────────────────────────────
  {
    title: 'FAQ: What types of projects does NEGO handle?',
    category: 'faq',
    content: `NEGO Construction handles a wide range of project types:
- Residential developments (estates, luxury flats, private homes)
- Healthcare facilities (hospitals, clinics, healthcare centres)
- Road and infrastructure construction (roads, bridges, drainage)
- Educational buildings (hostels, engineering centres)
- Commercial and industrial buildings (factories, shopping complexes)
- Religious facilities (auditoriums, church complexes)
- Agricultural facilities (farm infrastructure)
- Government facilities and institutions
- Sports facilities (stadium renovation)

NEGO can act as main contractor or project manager depending on the client's needs.`,
  },
  {
    title: 'FAQ: Where does NEGO operate?',
    category: 'faq',
    content: `NEGO Construction Limited is headquartered in Ikeja, Lagos, Nigeria, but operates across the country. Past and ongoing projects have been delivered in Lagos, Ogun, Rivers State, Delta State, Akwa-Ibom, Osun State, Taraba State, and other locations across Nigeria.`,
  },
  {
    title: 'FAQ: Client testimonials and reputation',
    category: 'faq',
    content: `What clients say about NEGO Construction:

"I have had the privilege of working with Nego Construction for over two decades on many projects. I can testify to their unwavering commitment to excellence. Their exceptional craftsmanship, technical expertise, and integrity are evident in every project they deliver. They never compromise on quality materials or workmanship, consistently exceeding expectations. Nego Construction is a name synonymous with quality, reliability, and lasting value." — Arc. Eromosele Anetor, FNIA, Architect & Project Manager, Anetorplus Limited

"I have partnered with NEGO over the years as a real estate agent. I value their professionalism, competence, reliability and structured approach. The team communicates clearly, responds promptly, and keeps me informed at every stage of the process. They manage timelines well, address issues efficiently, and provide practical solutions whenever needed." — Mothis, Real Estate Agent

"Reliable, responsive and committed to quality from the first conversation through delivery." — Development partner`,
  },
]

// ── Insert ────────────────────────────────────────────────────────────────────

async function seed() {
  console.log(`Seeding ${entries.length} knowledge base entries…\n`)

  let inserted = 0
  let skipped = 0

  for (const entry of entries) {
    // Check if an entry with this exact title already exists
    const { data: existing } = await supabase
      .from('knowledge_base')
      .select('id')
      .eq('title', entry.title)
      .maybeSingle()

    if (existing) {
      console.log(`  ⏭  Skipped (already exists): ${entry.title}`)
      skipped++
      continue
    }

    const { error } = await supabase.from('knowledge_base').insert({
      title: entry.title,
      content: entry.content,
      category: entry.category,
      is_published: true,
    })

    if (error) {
      console.error(`  ❌  Failed: ${entry.title}`)
      console.error(`      ${error.message}`)
    } else {
      console.log(`  ✅  Inserted: ${entry.title}`)
      inserted++
    }
  }

  console.log(`\nDone — ${inserted} inserted, ${skipped} skipped.`)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
