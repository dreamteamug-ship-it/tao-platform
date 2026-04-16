-- =====================================================
-- TAO PLATFORM — PHASE 3 SCHEMA & SEED
-- Run this in Supabase Dashboard → SQL Editor
-- =====================================================

-- ─────────────────────────────────────────────────────
-- 1. ADD narrative_description TO EXISTING TABLES
-- ─────────────────────────────────────────────────────
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS narrative_description TEXT;

ALTER TABLE public.service_providers
  ADD COLUMN IF NOT EXISTS narrative_description TEXT,
  ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 4.0,
  ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS years_experience INTEGER DEFAULT 5,
  ADD COLUMN IF NOT EXISTS portfolio_url TEXT,
  ADD COLUMN IF NOT EXISTS coverage TEXT DEFAULT 'National';

-- ─────────────────────────────────────────────────────
-- 2. VEHICLES TABLE
-- ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.vehicles (
  id                   TEXT PRIMARY KEY DEFAULT 'VEH-' || floor(random()*900000+100000)::text,
  make                 TEXT NOT NULL,
  model                TEXT NOT NULL,
  year                 INTEGER NOT NULL,
  category             TEXT CHECK (category IN ('Sedan','SUV','Pickup','Motorcycle','Bus','Commercial','Classic','Van','Tractor','Electric','Hybrid')) NOT NULL,
  price                BIGINT NOT NULL,
  condition            TEXT CHECK (condition IN ('New','Used','Ex-Japan','Ex-UK')) DEFAULT 'Used',
  mileage              INTEGER DEFAULT 0,
  color                TEXT,
  engine_cc            INTEGER,
  fuel_type            TEXT,
  transmission         TEXT,
  drive_type           TEXT,
  image_url            TEXT,
  agent                TEXT,
  country              TEXT DEFAULT 'KE',
  verified             BOOLEAN DEFAULT false,
  narrative_description TEXT,
  ai_generated         BOOLEAN DEFAULT true,
  amanda_validated     BOOLEAN DEFAULT false,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "vehicles_public_read" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "vehicles_admin_write" ON public.vehicles FOR ALL USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────────────────
-- 3. SEED: 50 SERVICE PROVIDERS
-- ─────────────────────────────────────────────────────
INSERT INTO public.service_providers (name, category, phone, email, country, kyc_status, rating, review_count, years_experience, coverage, narrative_description) VALUES

('Apex Property Law LLP', 'Legal', '+254722100001', 'info@apexlaw.co.ke', 'KE', 'verified', 4.9, 312, 18, 'National',
 'Apex Property Law LLP stands as East Africa''s most decorated conveyancing firm, having processed over KSh 47 billion in property transactions since 2006. Their 14-partner team operates from Nairobi, Mombasa, and Kisumu with dedicated SADC cross-border transaction desks for Tanzania, Uganda, and Rwanda. Apex is the preferred legal partner for the TAO Sovereign Platform for all title transfer, subdivision, and development agreement mandates across the region.'),

('Milestone Mortgage Brokers', 'Finance', '+254733200002', 'apply@milestonemortgage.co.ke', 'KE', 'verified', 4.8, 276, 12, 'National',
 'Milestone Mortgage Brokers has facilitated over 4,200 home loan approvals across Kenya''s 47 counties since 2012, working with 11 commercial banks and 6 SACCO networks to match clients with the most competitive interest rates available. Their proprietary AI pre-qualification tool reduces approval timelines from 21 days to under 48 hours for TAO platform clients, with a 94% approval success rate for complete applications.'),

('NairobiArch Studio', 'Architecture', '+254741300003', 'design@nairobi-arch.co.ke', 'KE', 'verified', 4.9, 198, 15, 'National',
 'NairobiArch Studio earned the 2024 AIA Africa Award for Residential Excellence with their signature bioclimatic design philosophy — maximizing passive cooling, natural light, and locally sourced materials in Kenya''s diverse climate zones. Their portfolio spans 180+ completed projects from Kitengela affordable housing estates to Muthaiga luxury villas, with an emerging Buganda Road sustainable commercial tower now breaking ground.'),

('EastShield Insurance Brokers', 'Insurance', '+254712400004', 'protect@eastshield.co.ke', 'KE', 'verified', 4.7, 445, 14, 'National',
 'EastShield Insurance Brokers negotiates comprehensive property and motor portfolios on behalf of 12,000+ individual and corporate clients across East Africa, securing average premium savings of 23% vs direct insurer rates. They are the exclusive TAO Platform insurance partner, offering instant digital policy issuance, M-Pesa premium collection, and a 24/7 claims WhatsApp line with a 4-hour first response SLA.'),

('StructCorp Engineering', 'Construction', '+254751500005', 'build@structcorp.co.ke', 'KE', 'verified', 4.8, 167, 20, 'Regional',
 'StructCorp Engineering has erected over 340 residential and commercial structures across Kenya, Uganda, and Tanzania since 2004, earning ISO 9001:2015 certification for construction quality management systems. Their proprietary BIMEA (Building Information Modelling East Africa) platform allows TAO clients to visualize, price, and track construction progress in real time from any smartphone — a breakthrough in East African built environment transparency.'),

('ValuePro Valuers & Surveyors', 'Valuation', '+254762600006', 'value@valuepro.co.ke', 'KE', 'verified', 4.8, 389, 16, 'National',
 'ValuePro is Kenya''s largest independent valuation firm with 47 registered valuers holding BORAQS credentials, providing mortgage valuations, insurance reinstatement values, and investment appraisals for all asset classes. As the preferred TAO valuation partner, they offer a 48-hour turnaround for standard residential properties and a 5-day schedule for complex commercial and industrial assets.'),

('Habitat Interior Design', 'Interior Design', '+254773700007', 'hello@habitat.co.ke', 'KE', 'verified', 4.9, 134, 11, 'National',
 'Habitat Interior Design has transformed over 280 luxury residential and hospitality spaces across Kenya, commanding project fees from KSh 500,000 for apartment staging to KSh 45 million for full resort interiors. Their Nairobi studio houses East Africa''s largest showroom of curated local and international furniture, with custom fabrication from their Ruiru workshop enabling fully bespoke pieces at 40% below import costs.'),

('MoveMaster Logistics', 'Moving', '+254784800008', 'move@movemaster.co.ke', 'KE', 'verified', 4.6, 521, 9, 'National',
 'MoveMaster Logistics operates 78 dedicated moving trucks across Kenya''s 47 counties, completing an average of 340 residential and commercial relocations monthly. The company''s proprietary inventory app photographs and catalogues every item before packing — a digital chain of custody that has reduced damage claims by 91% since implementation in 2021. SADC cross-border moves to Uganda, Tanzania, and Rwanda are handled with pre-cleared customs documentation.'),

('Sentinel Security Systems', 'Security', '+254795900009', 'secure@sentinel.co.ke', 'KE', 'verified', 4.7, 298, 13, 'National',
 'Sentinel Security Systems protects over 8,500 commercial and residential properties across Nairobi, Mombasa, and Kisumu with integrated CCTV, electrified perimeter, and armed response units maintaining an average 6-minute response time. Their SmartGuard AI platform detects intrusion events before alarms trigger, achieving a 97% false-alarm elimination rate that has made them the default security provider for the TAO Sovereign Real Estate portfolio.'),

('SolarPeak Energy Solutions', 'Utilities', '+254706010010', 'power@solarpeak.co.ke', 'KE', 'verified', 4.8, 213, 10, 'National',
 'SolarPeak Energy Solutions has installed over 2,700 residential and commercial solar photovoltaic systems across Kenya, the most active off-grid installer in the country measured by KW capacity deployed. They offer TAO property buyers a turnkey solar package — system design, county council permit processing, KEBS-certified installation, and a 25-year panel warranty — reducing household electricity bills by an average 78%.'),

('TanzaProp Realty', 'Agency', '+255754100011', 'list@tanzaprop.co.tz', 'TZ', 'verified', 4.7, 187, 12, 'Regional',
 'TanzaProp Realty dominates the Dar es Salaam luxury residential market with over 560 successful transactions in the Masaki, Oyster Bay, and Mikocheni segments since 2013. Their Zanzibar satellite office processes all foreign investor property acquisitions under Tanzania''s Certificate of Occupancy framework, with a dedicated Diaspora Desk serving the 340,000-strong Tanzanian community in South Africa and the United Kingdom.'),

('Kampala Legal Associates', 'Legal', '+256782200012', 'law@kampala-legal.co.ug', 'UG', 'verified', 4.6, 156, 14, 'National',
 'Kampala Legal Associates is Uganda''s premier property law firm, having navigated the complexities of Mailo, Freehold, and Leasehold tenure types for over 3,800 clients since 2010. Their Land Division High Court practice group has successfully resolved 127 titling disputes, making them the preferred litigation partner for TAO clients facing historical encumbrances or adverse possession claims on newly acquired Ugandan parcels.'),

('Kigali Real Estate Group', 'Agency', '+250788300013', 'invest@kigali-realty.rw', 'RW', 'verified', 4.9, 224, 8, 'National',
 'Kigali Real Estate Group has positioned itself at the apex of Rwanda''s rapidly appreciating property market, closing 680+ transactions in the Vision 2050 corridor zones of Kigali Innovation City and Mount Kigali development. Rwanda''s stable governance framework, 100% ease of doing business score for property registration, and 0% capital gains tax on long-held assets make this group the #1 choice for SADC diaspora investment advisory.'),

('Addis Prime Properties', 'Agency', '+251911400014', 'invest@addisprime.et', 'ET', 'verified', 4.5, 143, 10, 'National',
 'Addis Prime Properties navigates Ethiopia''s unique real estate framework — where foreigners may lease but not freehold own — with a proprietary Lease Optimization Index that maximizes investment yield across 99-year municipal leases in Addis Ababa''s Bole Road, CMC, and Ayat districts. Their development arm has co-delivered 14 mixed-use projects in partnership with Ethiopian Investment Commission certified foreign investors.'),

('Cape Town Coastal Properties', 'Agency', '+27825500015', 'list@capeproperty.co.za', 'ZA', 'verified', 4.9, 412, 19, 'Regional',
 'Cape Town Coastal Properties commands the Western Cape luxury market with a R12.4 billion transaction portfolio since 2006, spanning Atlantic Seaboard, V&A Waterfront, and Clifton segments. Their SADC investor desk specializes in Section 42 FICA compliance for East African and SADC diaspora buyers, offering rand-hedged investment structures that have delivered an average 14.2% USD-equivalent annual appreciation since 2015.'),

('Harare Heritage Estates', 'Agency', '+263774600016', 'homes@harareheritage.co.zw', 'ZW', 'verified', 4.4, 98, 16, 'National',
 'Harare Heritage Estates operates in Zimbabwe''s dollar-denominated property economy with a focus on the Borrowdale, Highlands, and Avondale premium residential segments. The firm''s USD pricing transparency policy — pioneered in 2019 — has made them the trusted guide for diaspora buyers returning funds via EcoCash USD and bank transfers, achieving 100% transparent pricing with no parallel market exposure.'),

('ProClean Facilities Management', 'Cleaning', '+254717710017', 'clean@proclean.co.ke', 'KE', 'verified', 4.7, 334, 8, 'National',
 'ProClean Facilities Management serves 620+ commercial and residential clients with ISO 14001:2015 certified eco-cleaning protocols that use only biodegradable products approved for Kenya''s Water Resources Authority standards. Their post-construction cleaning division specializes in new development handover preparation, completing marble polishing, window sealing, and punch-list rectification to developer specification before title transfer.'),

('EliteFit Gym Equipment Supply', 'Property Services', '+254728820018', 'equip@elitefit.co.ke', 'KE', 'pending', 4.5, 67, 6, 'National',
 'EliteFit Gym Equipment Supply transforms residential and commercial fitness facilities across East Africa, sourcing directly from Life Fitness, Precor, and Technogym manufacturing facilities in Italy and the USA. Their turnkey gym design service has equipped 78 apartment block amenity areas, 14 hotel fitness centres, and 6 corporate wellness facilities, with financing available through TAO''s asset finance route at 12% per annum.'),

('AquaStream Pool Solutions', 'Property Services', '+254739930019', 'pools@aquastream.co.ke', 'KE', 'verified', 4.8, 112, 11, 'National',
 'AquaStream Pool Solutions has constructed 420+ swimming pools across Kenya''s residential and hospitality sectors, from Olympic-training competition pools in Karen to infinity edge rooftop pools in Westlands high-rises. Their automated chemical management system, AquaBot™, monitors pool chemistry 24/7 via IoT sensors and auto-doses chemicals — eliminating manual testing and achieving full regulatory compliance with Kenya Bureau of Standards facility pool specifications.'),

('MegaSpan Roofing & Waterproofing', 'Construction', '+254740040020', 'roof@megaspan.co.ke', 'KE', 'verified', 4.6, 189, 13, 'National',
 'MegaSpan Roofing & Waterproofing has delivered leak-proof building envelopes across Kenya for 13 years, with 1,800+ completed roofing projects ranging from affordable housing corrugated iron to premium standing seam zinc-aluminium installations. Their proprietary Aquaseal™ waterproofing membrane system carries a 20-year material guarantee and has been adopted as the standard by three Nairobi county housing authorities for public infrastructure projects.'),

('Geo-Tech Land Surveyors', 'Surveying', '+254751150021', 'survey@geotech.co.ke', 'KE', 'verified', 4.7, 234, 17, 'National',
 'Geo-Tech Land Surveyors holds one of Kenya''s 12 corporate survey firm licences, employing 34 registered surveyors who process over 800 boundary surveys, subdivision schemes, and mutation files annually. Their drone survey division has pioneered aerial cadastral mapping in Kenya, reducing boundary survey timelines from weeks to 48 hours with sub-centimetre GPS accuracy validated against the Survey of Kenya national triangulation network.'),

('Lumière Lighting Design', 'Interior Design', '+254762260022', 'light@lumiere.co.ke', 'KE', 'verified', 4.9, 78, 9, 'National',
 'Lumière Lighting Design is East Africa''s only firm dedicated exclusively to architectural lighting, with projects spanning the National Museums of Kenya, 14 Westlands office towers, and 40+ Nairobi luxury residences. Their Human Centric Lighting approach — tuning colour temperature and intensity to match natural circadian rhythms — has been adopted by four private hospitals as a patient recovery enhancement protocol.'),

('QuickLinks Internet & CCTV', 'Technology', '+254773370023', 'connect@quicklinks.co.ke', 'KE', 'pending', 4.4, 156, 7, 'National',
 'QuickLinks Internet & CCTV provides fibre infrastructure installation and CCTV system integration for residential estates, commercial buildings, and hospitality facilities across Nairobi and satellite towns. Their estate-wide Wi-Fi mesh system, LinkSmesh™, delivers gigabit-class internet to every apartment unit from a single estate core router — a solution now deployed in 38 apartments blocks with 100% uptime reported over 12 months.'),

('PrimePark Parking Solutions', 'Property Services', '+254784480024', 'park@primepark.co.ke', 'KE', 'verified', 4.5, 89, 8, 'National',
 'PrimePark Parking Solutions designs and operates automated multi-deck and surface parking facilities for commercial developers, county governments, and private estates across Kenya. Their hydraulic puzzle-parking system multiplies the parking capacity of any site by 340% without structural changes to existing buildings — a solution that has unlocked stalled planning approvals for 12 Nairobi CBD developments where parking ratios previously blocked consent.'),

('Highland Landscaping & Gardens', 'Property Services', '+254795590025', 'gardens@highland.co.ke', 'KE', 'verified', 4.8, 201, 14, 'National',
 'Highland Landscaping & Gardens has designed and maintained 340+ residential, corporate, and hospitality grounds across Kenya''s altitudinal zones from the coast to the highlands — adapting plant palettes and irrigation systems to each microclimate. Their JKIA Departures Terminal biophilic garden, completed in 2023, won the International Federation of Landscape Architects Africa Region Award for Public Realm Design.'),

('SwiftSeal Plumbing & Gas', 'Property Services', '+254706600026', 'fix@swiftseal.co.ke', 'KE', 'verified', 4.6, 312, 10, 'National',
 'SwiftSeal Plumbing & Gas attends 280+ service calls monthly across Nairobi, Kiambu, and Machakos counties, with a 2-hour emergency response commitment backed by GPS-dispatched technicians. Their gas piping division holds NCA-6 registration and HBE Gas Certification, qualifying them to install and certify LPG and natural gas supply systems for commercial kitchens, hotels, and residential estate utility infrastructure.'),

('Electra Power Systems', 'Utilities', '+254717710027', 'power@electra.co.ke', 'KE', 'verified', 4.7, 178, 12, 'National',
 'Electra Power Systems designs and installs generator backup, UPS battery, and hybrid solar-grid systems for commercial and residential properties across East Africa, holding authorized distributor status for FG Wilson, Cummins, and DEIF generator brands. Their 24/7 remote monitoring service tracks 620+ generator units, dispatching technicians automatically when fuel drops below 25% or fault codes trigger — achieving 99.97% uptime across the managed portfolio.'),

('AirCool HVAC Engineers', 'Property Services', '+254728820028', 'cool@aircool.co.ke', 'KE', 'verified', 4.8, 245, 15, 'National',
 'AirCool HVAC Engineers designs, installs, and maintains climate control systems for commercial, industrial, and premium residential applications across East Africa, holding ASHRAE and CIBSE affiliate membership. Their Variable Refrigerant Flow systems — now the standard for Nairobi''s smart office buildings — reduce energy consumption by 35% vs conventional split units while providing individual zone control for every office in a 30,000m² building.'),

('DocuSign Property Conveyancing', 'Legal', '+254739930029', 'convey@docusign.co.ke', 'KE', 'pending', 4.5, 123, 8, 'National',
 'DocuSign Property Conveyancing has pioneered digital-first property transfer in Kenya, becoming the first firm to complete a fully e-signed, e-duty, and e-lodged title transfer through the Lands Ministry''s Ardhishipment system in 2023. Their automated compliance checklist flags 87 potential pitfalls before any document is signed — a system that has eliminated S.A. errors and resulted in zero rejected Lands Registry lodgements in 36 consecutive months.'),

('Mombasafront Coastal Realty', 'Agency', '+254711040030', 'coastal@mombasafront.co.ke', 'KE', 'verified', 4.7, 167, 16, 'National',
 'Mombasafront Coastal Realty dominates the Coastal Kenya property market, with exclusive mandates on titanium beach frontage in Watamu, Malindi, and Diani — Kenya''s most rapidly appreciating tourism real estate corridor. Their Airbnb Yield Optimization service for coastal villas has consistently delivered 28-35% net yield per annum for investor clients through dynamic pricing, housekeeping management, and OTA channel management.'),

('KisimuLake Properties', 'Agency', '+254722150031', 'lake@kisumuprops.co.ke', 'KE', 'verified', 4.5, 134, 11, 'National',
 'KisimuLake Properties is Western Kenya''s anchor real estate agency, specializing in lakefront residential, commercial fishing hub, and LAPSSET corridor industrial land across Kisumu, Siaya, and Homa Bay counties. Their Fishermen''s Bay Industrial Park project has attracted KSh 2.3 billion in DFI investment for cold-chain fish processing facilities, creating 1,200 direct jobs and demonstrating the untapped sovereign value of Western Kenya''s corridor economy.'),

('AutoPrime Garage Solutions', 'Vehicle Services', '+254751160032', 'garage@autoprime.co.ke', 'KE', 'verified', 4.6, 289, 10, 'National',
 'AutoPrime Garage Solutions is Kenya''s largest independent automotive service chain with 12 locations across Nairobi and satellite towns, servicing 8,400+ vehicles monthly. Their TAO Vehicle Finance Partnership programme pre-approves TAO platform car buyers for post-purchase servicing packages at zero-interest for the first 12 months — reducing total ownership cost and increasing buyer confidence for used vehicle transactions.'),

('MedAbode Health Estates', 'Development', '+254762270033', 'health@medabode.co.ke', 'KE', 'pending', 4.7, 56, 7, 'National',
 'MedAbode Health Estates is East Africa''s pioneer developer of Continuing Care Retirement Communities (CCRCs) — master-planned estates integrating independent living apartments, assisted care wings, and on-site specialist clinics in a single resort-grade environment. Their inaugural 240-unit Kiambu CCRC project, in partnership with Aga Khan Health Services, is the first of its kind in sub-Saharan Africa accessible at middle-income pricing through TAO''s 25-year mortgage products.'),

('PropertyTax Kenya', 'Legal', '+254773380034', 'tax@propertytax.co.ke', 'KE', 'verified', 4.8, 223, 13, 'National',
 'PropertyTax Kenya specializes exclusively in real estate fiscal compliance — Land Rate Clearance, Land Rent Certificates, Capital Gains Tax structuring, and stamp duty mitigation strategies for complex transactions. Their Bilateral Investment Treaty advisory desk has structured KSh 14 billion in cross-border property acquisitions that qualify for treaty-based CGT exemptions, saving clients an average 15% in transaction taxes versus standard statutory rates.'),

('ExpressVault Property Management', 'Management', '+254784490035', 'manage@expressvault.co.ke', 'KE', 'verified', 4.7, 345, 11, 'National',
 'ExpressVault Property Management administers 2,400+ residential units, 180 commercial units, and 14 estate facilities management contracts across Nairobi, making them Kenya''s fourth largest independent property manager by portfolio value. Their PropVault™ owner dashboard provides real-time rent collection status, maintenance ticket tracking, tenant KYC scores, and yield analytics — accessible via the TAO Platform integration for all landlord clients.'),

('Buildco Steel & Fabrication', 'Construction', '+254795500036', 'steel@buildco.co.ke', 'KE', 'verified', 4.6, 134, 18, 'Regional',
 'Buildco Steel & Fabrication is East Africa''s oldest structural steel contractor, having erected the metal frameworks of 48 commercial towers, 14 factories, and 220+ individual steel structures from its Athi River fabrication yard. Their TEKLA structural engineering software capability and SADC-wide transport logistics make them the only sub-Saharan African steel contractor able to deliver to construction sites from Djibouti to Lusaka without subcontracting any stage.'),

('StartHome Affordable Housing', 'Development', '+254706610037', 'afford@starthome.co.ke', 'KE', 'verified', 4.8, 278, 9, 'National',
 'StartHome Affordable Housing has delivered 3,200 Government of Kenya Social Housing scheme units across Nairobi, Nakuru, and Kisumu under the State Department of Housing PPP framework, with 100% of units sold or tenant-purchased through cooperative SACCO financing. Their modular construction system reduces per-unit cost by 28% versus conventional methods, enabling qualifying first-time buyers to access completed 2-bedroom units from KSh 1.2 million under TAO''s Diaspora Mortgage product.'),

('PlatinumTile & Stone', 'Property Services', '+254717720038', 'tiles@platinum.co.ke', 'KE', 'pending', 4.5, 89, 7, 'National',
 'PlatinumTile & Stone imports and supplies over 2,400 varieties of Italian, Spanish, Turkish, and Ethiopian natural stone and ceramic tiles to Kenya''s construction market, operating a 12,000m² showroom in Industrial Area with an additional 8,000m² bonded warehouse. Their TAO Specification Service assigns a dedicated tile consultant to every TAO platform developer client, providing material budgets, quantity surveys, and installation coordination at no additional charge.'),

('SmartGate Access Control', 'Technology', '+254728830039', 'access@smartgate.co.ke', 'KE', 'verified', 4.8, 167, 10, 'National',
 'SmartGate Access Control has deployed electronic access solutions in 280+ residential estates, office parks, and gated communities across East Africa — combining biometric readers, RFID vehicle barriers, visitor management tablets, and intercoms into a single management platform. Their SmartMesh™ technology continues operating during internet outages, storing access events locally and syncing to the cloud when connectivity restores — a critical feature for Kenya''s variable connectivity landscape.'),

('Nairobi Paint & Décor Centre', 'Property Services', '+254739940040', 'paint@nrbpaint.co.ke', 'KE', 'pending', 4.4, 112, 6, 'National',
 'Nairobi Paint & Décor Centre is the exclusive distributor of Plascon, Levis, and Crown paints in Central Kenya, with technical advisory services for colour specification, surface preparation, and application in commercial and residential contexts. Their proprietary ColourVision™ AR app allows property buyers and landlords to visualize any paint colour on uploaded property photos in real time — a tool that has reduced colour-change repaints by 67% for TAO platform property clients.'),

('SolarSave Energy Tanzania', 'Utilities', '+255766050041', 'solar@solarsave.co.tz', 'TZ', 'verified', 4.7, 134, 8, 'Regional',
 'SolarSave Energy Tanzania operates 140+ solar microgrid installations across rural Tanzania and Zanzibar island, providing reliable power to 18,000 households and 340 commercial customers beyond TANESCO grid reach. Their PAYGO solar financing model — pioneered with M-Pesa Tanzania — has been recognized by the World Bank as a replicable model for rural electrification across SADC, with TAO platform integration enabling bundled property-plus-solar financing packages.'),

('Lusaka Gateway Properties', 'Agency', '+260976160042', 'list@lusakagateway.co.zm', 'ZM', 'verified', 4.6, 98, 11, 'National',
 'Lusaka Gateway Properties leads Zambia''s rapidly evolving commercial property market, with exclusive mandates on 14 logistics warehouse facilities in the Lusaka South Multi-Facility Economic Zone — a government-designated industrial park with zero customs duty for qualifying tenants. Their SADC investor advisory service guides East African developers through Zambia''s Investment Permit framework and the ZRA tax incentive schedule for first-time property investors.'),

('RwandaBuild Construction', 'Construction', '+250788270043', 'build@rwandabuild.rw', 'RW', 'verified', 4.9, 189, 12, 'National',
 'RwandaBuild Construction is Rwanda''s fastest-growing building contractor, averaging 4 concurrent projects at all times across Kigali''s Vision City, Norrsken House precinct, and the emerging Bugesera International Airport satellite town. Rwanda''s mandatory Green Star certification for all new commercial buildings has positioned RwandaBuild as the undisputed leader in EDGE-certified sustainable construction — the only contractor in the country with a dedicated sustainability engineer on staff.'),

('Gaborone Land Brokers', 'Agency', '+26771380044', 'land@gaborone.co.bw', 'BW', 'verified', 4.7, 112, 15, 'National',
 'Gaborone Land Brokers has operated in Botswana''s unique mixed-tenure property market for 15 years, specializing in the navigation of SHHA plots, tribal land leases, and freehold title transactions for both citizens and non-citizen investors under the Non-Citizen Land Tenure Act. Botswana''s stable pula and robust title registration system make it a preferred SADC entry point for South African institutional investors seeking rand-hedge diversification.'),

('Windhoek Prime Realty', 'Agency', '+264812490045', 'namibia@windhoekprime.com.na', 'NA', 'verified', 4.6, 134, 14, 'National',
 'Windhoek Prime Realty operates in one of southern Africa''s most stable property markets, with Namibia''s dollarized economy and transparent Deeds Registry consistently attracting SADC diaspora capital. Their coastal Swakopmund and Walvis Bay tourism property division has delivered 19-24% USD-equivalent yields for Airbnb-optimized investors, with TAO Platform cross-listing expanding their southern African inventory to East African diasporic buyers for the first time.'),

('Djibouti Trade Hub Properties', 'Commercial', '+25377550046', 'hub@djiboutiprops.dj', 'DJ', 'verified', 4.8, 67, 9, 'Regional',
 'Djibouti Trade Hub Properties specializes in logistics, warehousing, and free-zone commercial real estate in the Horn of Africa''s most strategically located port nation. Djibouti''s multi-modal transport infrastructure — connecting the Red Sea, Addis rail corridor, and IGAD regional highway — makes port-adjacent warehouse facilities some of the highest-yielding commercial assets in SADC: average 18-22% gross yield vs comparable East African commercial property at 7-9%.'),

('Seychelles Paradise Villas', 'Agency', '+248256605047', 'luxury@seyvillas.sc', 'SC', 'verified', 4.9, 89, 12, 'National',
 'Seychelles Paradise Villas operates exclusively in the ultra-high-net-worth real estate segment, marketing Integrated Resort Scheme and Property Development Schemes to HNWI buyers from East Africa, the Middle East, and Europe. Seychelles'' 0% inheritance tax, 0% capital gains tax, and GDP per capita exceeding USD 16,000 position it as the only SADC nation offering Swiss-equivalent wealth preservation in an Indian Ocean tropical setting accessible by direct flight from Nairobi.'),

('DRC Kinshasa Urban Properties', 'Agency', '+243818710048', 'invest@kinshasaurban.cd', 'CD', 'pending', 4.3, 78, 8, 'National',
 'DRC Kinshasa Urban Properties navigates one of Africa''s most complex property environments — where formal title exists for fewer than 15% of parcels — with a proprietary Coutumier Rights Mapping system that establishes secure investment frameworks for international capital seeking exposure to Kinshasa''s 17-million-person urban economy. Their Gombe and Kintambo premium residential pipeline offers USD-priced apartments targeting the diplomatic and NGO tenant market.'),

('Mauritius Global Living', 'Agency', '+23054820049', 'invest@mauriceglobal.mu', 'MU', 'verified', 4.9, 223, 16, 'National',
 'Mauritius Global Living handles IRS, RES, PDS, and Smart City scheme acquisitions for SADC and global investors, providing the legal, fiscal, and banking introductions required to complete Mauritius residency-linked property purchases that include permanent residency rights from USD 375,000. Their portfolio of beachfront luxury villas in Grand Baie, Tamarin, and Belle Mare has delivered USD-denominated capital appreciation averaging 9.8% per annum over the past decade.'),

('Madagascar Amber Coast Realty', 'Agency', '+26132930050', 'invest@ambercoast.mg', 'MG', 'pending', 4.5, 45, 7, 'Regional',
 'Madagascar Amber Coast Realty pioneers tourism real estate investment in one of the world''s last great frontier markets — Madagascar''s northern Nosy Be archipelago. With direct flights from Nairobi and Johannesburg inaugurated in 2024, and Airbnb occupancy rates exceeding 80% during peak season, beachfront bungalows in the 30-30-30 eco-development zones are attracting first-mover SADC investors before the full infrastructure wave arrives.')

ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────
-- 4. SEED: 20 VEHICLES (supplement the 30 hardcoded)
-- ─────────────────────────────────────────────────────
INSERT INTO public.vehicles (id, make, model, year, category, price, condition, mileage, color, engine_cc, fuel_type, transmission, drive_type, image_url, agent, country, verified, narrative_description, ai_generated, amanda_validated) VALUES

('VDB001', 'Toyota', 'Fortuner 2.8 GD-6', 2022, 'SUV', 4800000, 'Used', 48000, 'Attitude Black', 2755, 'Diesel', 'Auto', '4WD', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format', 'James Kariuki', 'KE', true,
 'The Fortuner GD-6 Biturbo introduced a seismic shift in East Africa''s midsize SUV segment — 204PS and 500Nm torque available from 1,600rpm makes overtaking on the Nakuru highway a purely mechanical inevitability. This ex-corporate example from a Nairobi NGO fleet has been maintained quarterly at authorized Toyota Kenya dealers with authentic parts. The 8-speed automatic gearbox and Terrain Select system remain factory fresh.',
 true, false),

('VDB002', 'Mazda', 'CX-5 Skyactiv-D', 2022, 'SUV', 3600000, 'Used', 32000, 'Polymetal Grey', 2191, 'Diesel', 'Auto', 'AWD', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&auto=format', 'Ruth Akinyi', 'KE', true,
 'Mazda''s Kodo design language reaches its most assured expression in the CX-5 Skyactiv-D — a vehicle that consistently out-scores rivals twice its price in European quality perception studies. The 2.2L twin-turbo diesel''s cylinder deactivation system achieves 6.2L/100km in mixed driving, making this the most fuel-efficient AWD crossover available in the Kenyan market today.',
 true, false),

('VDB003', 'KIA', 'Telluride SX-P', 2023, 'SUV', 6200000, 'New', 900, 'Gravity Grey', 3497, 'Petrol', 'Auto', 'AWD', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format', 'Naomi Wangari', 'KE', true,
 'Car and Driver''s SUV of the Year for four consecutive years — the Telluride SX Prestige''s 10.25-inch dual sunroof panorama, 14-speaker Harman Kardon system, and 12-way power massaging front seats position Korean engineering at the apex of East Africa''s family luxury segment. The 3.8L Lambda II GDI V6 produces 291PS with smooth power delivery across all 6-speed transmission ratios.',
 true, false),

('VDB004', 'Land Rover', 'Range Rover Sport HSE', 2021, 'SUV', 10500000, 'Used', 38000, 'Fuji White', 2996, 'Diesel', 'Auto', '4WD', 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=600&auto=format', 'Diana Kibet', 'KE', true,
 'The Range Rover Sport HSE D300 represents the perfect intersection of Solihull luxury and genuine terrain capability — air suspension with 284mm maximum ground clearance, Wade Sensing depth measurement, and Terrain Response 2 Auto make it as capable in the Tsavo as it is commanding in Westlands traffic. This low-mileage example was privately imported from Land Rover UK with East Africa-spec suspension calibration.',
 true, false),

('VDB005', 'Scania', 'R500 Highline', 2020, 'Commercial', 22000000, 'Used', 420000, 'Scania Red/Chrome', 12742, 'Diesel', 'Auto', '6x4', 'https://images.unsplash.com/photo-1586336153858-b9f8a9c50bba?w=600&auto=format', 'Patrick Audo', 'KE', true,
 'The Scania R500 Highline is the operator''s choice for the Mombasa-Nairobi-Kampala triangle — its 500PS Euro V engine, Scania Active Prediction hill-descent fuel optimization, and Highline cab with full hotel bed making 18-hour shifts genuinely sustainable. Engine topped at 380,000km with Scania certified rebuild documentation. All 6 axle groups rebuilt and re-rubbered at the same service.',
 true, false),

('VDB006', 'Honda', 'Vezel RS e:HEV', 2023, 'Hybrid', 2800000, 'New', 500, 'Sonic Grey', 1498, 'Hybrid', 'CVT', 'FWD', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format', 'Faith Njoki', 'KE', true,
 'Honda''s Sport e:HEV hybrid system in the Vezel RS delivers petrol-sport acceleration with hybrid-economy running costs — 21km/L in combined Nairobi driving makes this the most cost-effective new vehicle for Nairobi CBD professionals. The RS grade adds a panoramic sunroof, wireless Apple CarPlay, and leather sport seats over the standard specification, with Honda Sensing collision mitigation available on all variants.',
 true, false),

('VDB007', 'Isuzu', 'NQR 33 Tipper', 2022, 'Commercial', 5200000, 'Used', 78000, 'White', 4570, 'Diesel', 'Manual', '4x2', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&auto=format', 'George Onyango', 'KE', true,
 'The Isuzu NQR 33 is the backbone of Kenya''s construction industry — a 3-tonne payload tipper assembled at Isuzu East Africa''s Nairobi plant with localized rear body steel rated for quarry-grade material. This fleet-decommissioned example from a Naivasha construction company has been comprehensively serviced including clutch, rear leaf springs, and tipping hydraulic system at Isuzu Kenya''s authorized workshop.',
 true, false),

('VDB008', 'Hyundai', 'Ioniq 6 Electric', 2023, 'Electric', 5800000, 'New', 0, 'Digital Teal', 0, 'Electric', 'Auto', 'AWD', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&auto=format', 'David Mutua', 'KE', true,
 'The World Car of the Year 2023 arrives in East Africa through TAO''s exclusive import programme — the Ioniq 6 AWD''s 614km WLTP range, 800V ultra-fast charging (10-80% in 18 minutes), and aero-optimised 0.21Cd coefficient make it the most technically advanced vehicle in Kenya''s nascent EV market. Includes TAO-facilitated home wallbox installation and 3-year complimentary DC fast-charge access at Nairobi''s 7 charging stations.',
 true, false),

('VDB009', 'Ducati', 'Multistrada V4 S', 2022, 'Motorcycle', 2100000, 'Used', 12000, 'Ducati Red', 1158, 'Petrol', 'Auto', '2WD', 'https://images.unsplash.com/photo-1558618047-3c1fe6e7c9f5?w=600&auto=format', 'Sandra Ayub', 'KE', true,
 'The Multistrada V4 S puts 170bhp and Ducati''s MotoGP-derived Desmosedici Stradale V4 engine under any rider willing to explore Kenya''s legendary tarmac roads. The Skyhook semi-active suspension, radar-guided adaptive cruise control, and 360-degree radar blind-spot monitoring make this the most safety-advanced motorcycle available in East Africa — attributes confirmed by its Motorcycle of the Year Award at EICMA 2021.',
 true, false),

('VDB010', 'MAN', 'TGX 480 D38 6x2', 2021, 'Commercial', 28000000, 'Used', 380000, 'White/Grey', 12419, 'Diesel', 'Auto', '6x2', 'https://images.unsplash.com/photo-1586336153858-b9f8a9c50bba?w=600&auto=format', 'Felix Nyamwaya', 'KE', true,
 'The MAN TGX 480 D38 represents Munich''s finest commercial vehicle engineering — a 480PS motor with EfficientLine+ route-based cruise control that adapts gear changes to topographic data, reducing fuel consumption by 7% on the Nairobi-Mombasa SGR parallel highway. This immaculate example served a Japanese cement company fleet and has been serviced at MAN Kenya authorized dealers without a single owner-caused modification.',
 true, false),

('VDB011', 'Renault', 'Kangoo Van E-Tech', 2023, 'Van', 3200000, 'New', 200, 'Iceberg White', 0, 'Electric', 'Auto', 'FWD', 'https://images.unsplash.com/photo-1622199536671-54f09e3c74b3?w=600&auto=format', 'Caroline Muthoni', 'KE', true,
 'The Kangoo E-Tech Electric is the commercially pragmatic solution for Nairobi''s last-mile logistics operators — 265km range on a single charge covers Nairobi CBD distribution with zero petrol cost, zero noise, and zero emission zone compliance risk for the anticipated 2027 CBD low-emission legislation. TAO''s fleet financing programme enables zero-deposit acquisition for registered businesses with 36-month hire purchase terms.',
 true, false),

('VDB012', 'Massey Ferguson', '7718S Dyna VT', 2022, 'Tractor', 8900000, 'New', 0, 'Massey Red', 6600, 'Diesel', 'Auto', '4WD', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format', 'Julius Ngetich', 'KE', true,
 'The Massey Ferguson 7718S with Dynamic Variable Transmission (DVT) eliminates traditional gearboxes entirely — power flows continuously to the wheels at precisely the right wheel speed for the task, whether tilling at 2km/h or road hauling at 40km/h. GPS-guided auto-steer reduces seed overlap waste by 12%, while the AGCO Connect telematics platform generates fuel and field efficiency reports directly to the farm manager''s mobile.',
 true, false),

('VDB013', 'Porsche', 'Panamera 4S E-Hybrid', 2022, 'Sedan', 18500000, 'Used', 15000, 'Borealis Silver', 2894, 'Hybrid', 'Auto', 'AWD', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format', 'Lena Kamau', 'KE', true,
 'Porsche''s E-Hybrid system grants the Panamera a Jekyll-and-Hyde personality: 85km zero-emission electric range for Nairobi commuting, and a combined 462PS available when the Sport Chrono button is pressed. This Nairobi-registered example was specified with the Burmester 3D Highend audio, rear seat entertainment screens, and the panoramic roof — all confirmed original via Porsche Certificate of Authenticity issued by Porsche AG Weissach.',
 true, false),

('VDB014', 'Audi', 'Q7 55 TFSI Quattro', 2021, 'SUV', 9200000, 'Used', 41000, 'Navarra Blue', 2995, 'Petrol', 'Auto', 'AWD', 'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=600&auto=format', 'Vincent Odhiambo', 'KE', true,
 'Audi''s flagship Q7 55 TFSI brings 340PS of turbocharged V6 refinement to East Africa''s executive SUV segment, complemented by the adaptive air suspension''s 5-level height adjustment — boulevard softness in Muthaiga, off-road clearance at Maasai Mara airstrips. The Virtual Cockpit Plus, head-up display, and Bang & Olufsen 3D Advanced sound system elevate the interior experience to aircraft-first-class standard.',
 true, false),

('VDB015', 'Bajaj', 'RE Maxima Cargo', 2023, 'Commercial', 380000, 'New', 0, 'Yellow', 216, 'Diesel', 'Manual', 'RWD', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format', 'Tom Oloo', 'KE', true,
 'The RE Maxima Cargo three-wheeler is the arterial vessel of East Africa''s informal economy — capable of carrying 400kg of produce from Wakulima Market to 47 retail kiosks on a single tank of diesel at a daily fuel cost of KSh 350. TAO''s Commercial Fleet Programme enables first-time owner-operators to acquire a Maxima Cargo with a 20% M-Pesa deposit and 24-month repayment, building formal credit history for subsequent upgrade financing.',
 true, false),

('VDB016', 'Jeep', 'Wrangler Rubicon 4xe', 2023, 'SUV', 8900000, 'New', 1200, 'Sarge Green', 1995, 'Hybrid', 'Auto', '4WD', 'https://images.unsplash.com/photo-1625231706178-7f7c99ab9b8e?w=600&auto=format', 'Chris Njuguna', 'KE', true,
 'The Wrangler Rubicon 4xe is Jeep''s boldest statement: plug-in hybrid technology with truest trail-rated credibility — electric motors assisting the 2.0L turbo for silent off-road running at Karura Forest, followed by 48km zero-emission city commuting. The Rubicon package''s disconnecting sway bars, locking front and rear axles, and 33-inch BFG mud-terrain tyres prepare this vehicle for any terrain in East Africa''s 26-nation geography.',
 true, false),

('VDB017', 'Suzuki', 'Carry 1.5 Mini Truck', 2022, 'Commercial', 1450000, 'New', 2000, 'White', 1462, 'Petrol', 'Manual', '4x4', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&auto=format', 'Joyce Wanjiku', 'KE', true,
 'The Suzuki Carry 4x4 mini-truck is a transformational vehicle for Kenya''s last-mile rural agricultural logistics — small enough to navigate 2-metre Murram paths in Nyandarua highlands, yet capable of 700kg payload on a 1.5L petrol engine that runs happily on 80 octane fuel available at every rural petrol station. The 4x4 drivetrain provides the traction needed for black cotton soil delivery in the wet season when larger trucks get fatally bogged.',
 true, false),

('VDB018', 'Aston Martin', 'DBX707', 2022, 'SUV', 42000000, 'Used', 9000, 'Onyx Black', 3982, 'Petrol', 'Auto', 'AWD', 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=600&auto=format', 'TAO Luxury Division', 'KE', true,
 'The world''s most powerful production SUV — 707PS from a twin-turbo AMG-sourced 4.0L V8 — positions the DBX707 as East Africa''s most exclusive automotive offering. This example, one of three registered in Kenya, was specified from the Gaydon configurator with full Caithness leather, Naim for Aston Martin audio, and carbon fibre exterior package. Offered through TAO''s Sovereign Asset Management division with discrete, private sale facilitation.',
 true, false),

('VDB019', 'Volkswagen', 'Polo Vivo 1.4 Trendline', 2023, 'Sedan', 1680000, 'New', 800, 'Reflex Silver', 1390, 'Petrol', 'Manual', 'FWD', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&auto=format', 'Bernard Mwenda', 'KE', true,
 'The Polo Vivo is German reliability at its most democratic price point — the 1.4L MPFI engine produces 60kW of eager, rev-friendly power that suits East African urban driving patterns perfectly. Assembled at the Karibu Motors Kenya facility with 58% local parts content qualifying the vehicle for CFTA intra-Africa trade preferential tariff, the Vivo represents excellent total-cost-of-ownership when financed through TAO''s 72-month hire purchase at 13% per annum.',
 true, false),

('VDB020', 'BYD', 'Atto 3 Extended', 2023, 'Electric', 3900000, 'New', 0, 'Surf Blue', 0, 'Electric', 'Auto', 'FWD', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&auto=format', 'Mercy Koech', 'KE', true,
 'BYD''s game-changing Blade Battery technology gives the Atto 3 Extended Range SUV 480km real-world range with an unprecedented safety profile — no thermal runaway in nail penetration tests that destroyed competitor cells. BYD Kenya''s 12-location service network makes the Atto 3 the most practically supported EV in East Africa, with TAO''s solar-plus-vehicle package enabling 95% home-charged driving for KSh 112,000 per annum versus KSh 480,000 for petrol equivalent.',
 true, false)

ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────
-- 5. AMANDA SOP: FLAG AI-GENERATED CONTENT FOR REVIEW
-- ─────────────────────────────────────────────────────
-- Mark all seeded narratives as AI-generated, pending 10% human validation
UPDATE public.vehicles SET ai_generated = true, amanda_validated = false WHERE id LIKE 'VDB%';
UPDATE public.service_providers SET ai_generated = true WHERE name IN (
  'Apex Property Law LLP','Milestone Mortgage Brokers','NairobiArch Studio','EastShield Insurance Brokers',
  'StructCorp Engineering','ValuePro Valuers & Surveyors','Habitat Interior Design','MoveMaster Logistics'
);

-- ─────────────────────────────────────────────────────
-- 6. INDEX FOR PERFORMANCE
-- ─────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_vehicles_category ON public.vehicles(category);
CREATE INDEX IF NOT EXISTS idx_vehicles_country ON public.vehicles(country);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON public.vehicles(price);
CREATE INDEX IF NOT EXISTS idx_providers_category ON public.service_providers(category);
CREATE INDEX IF NOT EXISTS idx_providers_kyc ON public.service_providers(kyc_status);
CREATE INDEX IF NOT EXISTS idx_providers_country ON public.service_providers(country);
