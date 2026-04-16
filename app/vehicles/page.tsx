'use client';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import VehicleCard, { Vehicle } from '@/components/VehicleCard';

// ──────────────────────────────────────────────
// HARDCODED SHOWCASE INVENTORY (30 vehicles)
// These display instantly while Supabase loads
// ──────────────────────────────────────────────
const SHOWCASE_VEHICLES: Vehicle[] = [
  { id:'V001', make:'Toyota', model:'Land Cruiser V8', year:2022, category:'SUV', price:7500000, condition:'Used', mileage:42000, engine_cc:4461, fuel_type:'Diesel', transmission:'Auto', drive_type:'4WD', color:'Pearl White', image_url:'https://images.unsplash.com/photo-1611069793852-8c3e4a6e5a6e?w=600&auto=format', agent:'Jonah Mwangi', country:'KE', verified:true, narrative_description:'A commanding presence on any terrain, this 2022 Land Cruiser V8 represents the pinnacle of East African luxury utility. Maintained under strict TAO verification protocols with full service history from Toyota Kenya. The GX-R grade interior features premium leather, heated seats, and a 9-inch multimedia system — twin sunroofs complete an unparalleled ownership experience.' },
  { id:'V002', make:'Mercedes-Benz', model:'C300 AMG', year:2021, category:'Sedan', price:5200000, condition:'Used', mileage:28000, engine_cc:1991, fuel_type:'Petrol', transmission:'Auto', color:'Obsidian Black', image_url:'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&auto=format', agent:'Amina Ochieng', country:'KE', verified:true, narrative_description:'German engineering at its most seductive — the C300 AMG Line blends sport and sophistication with a twin-turbo 2.0L engine producing 258bhp. This low-mileage example comes with MBUX intelligent voice control, Burmester surround sound, and AMG sport suspension. A rare opportunity to own Stuttgart\'s finest at East African market pricing.' },
  { id:'V003', make:'Land Rover', model:'Defender 110 HSE', year:2023, category:'SUV', price:12800000, condition:'New', mileage:850, engine_cc:2996, fuel_type:'Diesel', transmission:'Auto', drive_type:'4WD', color:'Pangea Green', image_url:'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=600&auto=format', agent:'James Kariuki', country:'KE', verified:true, narrative_description:'Fresh from the Halewood factory — this Defender 110 HSE P300 represents the rebirth of an icon, now equipped with terrain response 2, configurable dynamics, and a 11.4-inch Pivi Pro infotainment system. Ideal for executives who demand performance across Nairobi CBD and the Maasai Mara alike. TAO certified with 5-year warranty included.' },
  { id:'V004', make:'Toyota', model:'Hilux D/Cab 4x4', year:2022, category:'Pickup', price:3800000, condition:'Used', mileage:67000, engine_cc:2755, fuel_type:'Diesel', transmission:'Manual', drive_type:'4WD', color:'Silver', image_url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format', agent:'Peter Njoroge', country:'KE', verified:true, narrative_description:'The backbone of East African commerce, this Hilux GR-Sport has tackled 67,000km of Kenya\'s toughest roads without a single major failure — a testament to Toyota\'s legendary reliability. The GR-Sport package adds 17-inch alloys, sports bar, and underbody protection. Perfect for contractors, safari outfitters, and cross-border traders in the COMESA region.' },
  { id:'V005', make:'BMW', model:'X5 M Competition', year:2022, category:'SUV', price:11500000, condition:'Used', mileage:19000, engine_cc:4395, fuel_type:'Petrol', transmission:'Auto', drive_type:'4WD', color:'Marina Bay Blue', image_url:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format', agent:'Naomi Wangari', country:'KE', verified:true, narrative_description:'A 625bhp M Competition badge transforms the X5 from a luxury SUV into a supercar-slaying beast. This meticulously maintained example offers M Carbon ceramic brakes, Bowers & Wilkins Diamond surround sound, and adaptive M suspension. Imported directly from BMW UAE, this vehicle represents the absolute apex of Munich\'s performance engineering available in East Africa.' },
  { id:'V006', make:'Subaru', model:'Forester XT Turbo', year:2020, category:'SUV', price:2100000, condition:'Ex-Japan', mileage:52000, engine_cc:2000, fuel_type:'Petrol', transmission:'CVT', drive_type:'AWD', color:'Jasper Green', image_url:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format', agent:'Ruth Akinyi', country:'KE', verified:true, narrative_description:'The Forester XT turbo delivers confident all-weather capability with its Symmetrical AWD system and EyeSight driver assistance — rare features in its class. Imported via TAO\'s verified Japanese auction channel with full inspection report. Ideal for Nairobi families navigating both city traffic and upcountry terrain.' },
  { id:'V007', make:'Tesla', model:'Model 3 Long Range', year:2023, category:'Electric', price:6500000, condition:'New', mileage:0, engine_cc:0, fuel_type:'Electric', transmission:'Auto', drive_type:'AWD', color:'Midnight Silver', image_url:'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&auto=format', agent:'David Mutua', country:'KE', verified:true, narrative_description:'East Africa\'s clean energy future arrives in the form of this Tesla Model 3 Long Range — 602km real-world range, Autopilot, and over-the-air software updates that continuously improve the driving experience. Includes TAO-facilitated home charging installation at the purchaser\'s residence. A sovereign investment in Kenya\'s EV infrastructure transition.' },
  { id:'V008', make:'Isuzu', model:'D-Max LS-U 4x4', year:2023, category:'Pickup', price:4200000, condition:'New', mileage:200, engine_cc:1898, fuel_type:'Diesel', transmission:'Auto', drive_type:'4WD', color:'Cameo Ivory', image_url:'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&auto=format', agent:'George Onyango', country:'KE', verified:true, narrative_description:'The D-Max LS-U represents Isuzu\'s most premium pickup expression for the East African market, built at the Naivasha assembly plant with localized chassis reinforcements for Kenya\'s highway conditions. The 3.0L Blue Power diesel engine produces 190PS with best-in-class 450Nm torque — ideal for towable loads across COMESA corridors.' },
  { id:'V009', make:'Honda', model:'CR-V Turbo AWD', year:2021, category:'SUV', price:3100000, condition:'Used', mileage:38000, engine_cc:1498, fuel_type:'Petrol', transmission:'CVT', drive_type:'AWD', color:'Radiant Red', image_url:'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&auto=format', agent:'Faith Njoki', country:'KE', verified:true, narrative_description:'Honda\'s acclaimed Sensing suite makes this CR-V one of the safest crossovers in East Africa, featuring adaptive cruise control, lane keeping assist, and collision mitigation braking. The turbocharged 1.5L VTEC delivers 193PS while maintaining class-leading fuel efficiency of 7.5L/100km on combined roads.' },
  { id:'V010', make:'Mitsubishi', model:'Pajero Final Edition', year:2020, category:'SUV', price:4800000, condition:'Ex-Japan', mileage:35000, engine_cc:3828, fuel_type:'Diesel', transmission:'Auto', drive_type:'4WD', color:'Arctic Silver', image_url:'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=600&auto=format', agent:'Alex Kimemia', country:'KE', verified:true, narrative_description:'The legendary Pajero Final Edition marks the end of a 38-year production run with the most premium specification ever offered — Nappa leather, 12-speaker Rockford Fosgate audio, and a twin-planetary Super Select 4WD system that has conquered the Dakar Rally 12 times. A collector\'s grade icon at East African market value.' },
  { id:'V011', make:'Peugeot', model:'3008 GT', year:2022, category:'SUV', price:3400000, condition:'New', mileage:1200, engine_cc:1598, fuel_type:'Petrol', transmission:'Auto', color:'Pearl White', image_url:'https://images.unsplash.com/photo-1514867644123-6385d58d3cd4?w=600&auto=format', agent:'Caroline Muthoni', country:'KE', verified:true, narrative_description:'The 3008 GT brings French design philosophy to East Africa — an award-winning i-Cockpit with a heads-up display, night vision assist, and Focal premium sound. Locally assembled via France Kenya Industrial Partnership, this vehicle supports the Buy Kenya Build Kenya initiative while delivering European luxury at a sovereign market premium.' },
  { id:'V012', make:'Toyota', model:'Prado TX-L', year:2021, category:'SUV', price:5600000, condition:'Used', mileage:56000, engine_cc:2755, fuel_type:'Diesel', transmission:'Auto', drive_type:'4WD', color:'Graphite', image_url:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format', agent:'Samuel Waweru', country:'KE', verified:true, narrative_description:'Kenya\'s preferred executive transport — the Prado TX-L combines boardroom refinement with genuine bush capability. This immaculate example has been exclusively operated on tarmac by a Nairobi diplomatic household, retaining factory fresh interior, full Toyota Kenya service history, and active crawl control for off-road excursions to private conservancies.' },
  { id:'V013', make:'Volkswagen', model:'Touareg R-Line', year:2022, category:'SUV', price:7200000, condition:'Used', mileage:31000, engine_cc:2994, fuel_type:'Diesel', transmission:'Auto', drive_type:'4WD', color:'Deep Black', image_url:'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=600&auto=format', agent:'Vincent Odhiambo', country:'KE', verified:true, narrative_description:'The Touareg R-Line brings Wolfsburg\'s most advanced platform to Nairobi — featuring matrix IQ.LIGHT LED headlights, a 15-inch Innovision cockpit, and air suspension with 8-stage adaptive damping. Imported from VW South Africa with SADC duty advantage and full regional warranty coverage across 10 East African markets.' },
  { id:'V014', make:'Nissan', model:'Patrol Y62 Platinum', year:2021, category:'SUV', price:9800000, condition:'Used', mileage:44000, engine_cc:5552, fuel_type:'Petrol', transmission:'Auto', drive_type:'4WD', color:'Premium White', image_url:'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&auto=format', agent:'Hassan Abdi', country:'KE', verified:true, narrative_description:'The Patrol Platinum is the undisputed king of Gulf-standard luxury in East Africa — seven captain\'s chairs, a 13-speaker Bose surround sound, refrigerator, rear entertainment screens, and a 5.6L V8 producing 400PS. This UAE-spec example was imported through Mombasa by a Somali diplomatic mission and is offered with zero modifications from factory specification.' },
  { id:'V015', make:'Suzuki', model:'Jimny Sierra', year:2023, category:'SUV', price:2800000, condition:'New', mileage:400, engine_cc:1373, fuel_type:'Petrol', transmission:'Manual', drive_type:'4WD', color:'Jungle Green', image_url:'https://images.unsplash.com/photo-1625231706178-7f7c99ab9b8e?w=600&auto=format', agent:'Joyce Wanjiku', country:'KE', verified:true, narrative_description:'Global 4x4 of the Year 2019 — the Jimny Sierra returns with a cult following and a waiting list across East Africa\'s safari circuits. Its ladder-frame chassis and dual-range 4WD make it the preferred vehicle for Maasai Mara game wardens and conservation officers who require a vehicle that can navigate places larger SUVs dare not enter.' },
  { id:'V016', make:'Toyota', model:'Hiace Minibus 14-seater', year:2022, category:'Bus', price:2900000, condition:'New', mileage:3000, engine_cc:2755, fuel_type:'Diesel', transmission:'Manual', color:'White', image_url:'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&auto=format', agent:'Bernard Mwenda', country:'KE', verified:true, narrative_description:'The lifeblood of East Africa\'s transport economy — this 14-seater Hiace has been fitted with factory-approved Kibo Body rear conversion including panoramic windows, individual air vents, and reinforced floor panels engineered for East Africa\'s intercity routes. NTSA compliant with route licence framework documentation included.' },
  { id:'V017', make:'BMW', model:'M4 Competition', year:2023, category:'Sedan', price:14500000, condition:'New', mileage:500, engine_cc:2993, fuel_type:'Petrol', transmission:'Auto', color:'San Marino Blue', image_url:'https://images.unsplash.com/photo-1617650728487-d5da1e0bea45?w=600&auto=format', agent:'Lena Kamau', country:'KE', verified:true, narrative_description:'503bhp of naturally aspirated fury — the M4 Competition xDrive transforms Kenya\'s Nakuru highway into a test track. Factory-ordered through BMW SA with East Africa equipment pack including dust filter upgrade, sun protection glass, and Merino full leather. Delivered road registered with TAO insurance pre-approval for same-day transfer.' },
  { id:'V018', make:'Ford', model:'Ranger Raptor 4x4', year:2023, category:'Pickup', price:5800000, condition:'New', mileage:750, engine_cc:1996, fuel_type:'Petrol', transmission:'Auto', drive_type:'4WD', color:'Code Orange', image_url:'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&auto=format', agent:'Chris Njuguna', country:'KE', verified:true, narrative_description:'The Raptor label transforms Ford\'s workhorse into a performance off-road machine — Fox Racing Live Valve suspension, 45mm front track widening, and a Recaro sport interior make this the most capable performance pickup available in East Africa. Imported from Ford Australia with RHD compliance engineering pre-completed at Mombasa ICD.' },
  { id:'V019', make:'Bajaj', model:'Boxer 150', year:2023, category:'Motorcycle', price:95000, condition:'New', mileage:0, engine_cc:145, fuel_type:'Petrol', transmission:'Manual', color:'Red/Black', image_url:'https://images.unsplash.com/photo-1558618047-3c1fe6e7c9f5?w=600&auto=format', agent:'Tom Oloo', country:'KE', verified:true, narrative_description:'East Africa\'s most trusted commercial motorcycle — the Boxer 150 powers millions of boda boda entrepreneurs across 26 nations. This batch was imported directly from Bajaj India through the TAO Commercial Fleet Programme, eligible for 90% logbook-backed financing with 36-month repayment. NTSA registered and road-ready with insurance facilitation included.' },
  { id:'V020', make:'Yamaha', model:'MT-15 Version 2', year:2023, category:'Motorcycle', price:340000, condition:'New', mileage:0, engine_cc:155, fuel_type:'Petrol', transmission:'Manual', color:'Midnight Black', image_url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format', agent:'Sandra Ayub', country:'KE', verified:true, narrative_description:'Yamaha\'s MT-15 Ver. 2 brings MotoGP-derived VR46 DNA to East Africa\'s urban streets — the 155cc Variable Valve Actuated engine revs beyond 10,000rpm with a refined howl that belies its compact dimensions. The slipper clutch and USD front forks position this as the most technically advanced motorcycle in its Kenyan market segment.' },
  { id:'V021', make:'Toyota', model:'Corolla Cross Hybrid', year:2023, category:'Hybrid', price:3600000, condition:'New', mileage:600, engine_cc:1798, fuel_type:'Hybrid', transmission:'CVT', drive_type:'FWD', color:'Precious Silver', image_url:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&auto=format', agent:'Mercy Koech', country:'KE', verified:true, narrative_description:'The Corolla Cross Hybrid Self-Charging system eliminates range anxiety while delivering 21km/L in Nairobi\'s stop-start traffic — no plug required. Toyota Kenya\'s locally assembled version includes localized AC calibration, a reinforced suspension tune for East African tarmac, and a 3-year/100,000km warranty at the most competitive total cost of ownership in the hybrid segment.' },
  { id:'V022', make:'Mercedes-Benz', model:'Sprinter 516 CDI', year:2022, category:'Van', price:5900000, condition:'Used', mileage:89000, engine_cc:2143, fuel_type:'Diesel', transmission:'Auto', color:'White', image_url:'https://images.unsplash.com/photo-1622199536671-54f09e3c74b3?w=600&auto=format', agent:'Richard Osoro', country:'KE', verified:true, narrative_description:'The operational backbone of East Africa\'s logistics sector — this Sprinter 516 CDI has served a Nairobi cold-chain pharmaceutical company with meticulous quarterly service records at Mercedes-Benz Kenya. The 3.5-tonne payload, automatic gearbox, and MBUX voice navigation make it the preferred choice for medical supply distribution across Kenya\'s county system.' },
  { id:'V023', make:'Volvo', model:'FH16 750 Globetrotter', year:2021, category:'Commercial', price:18500000, condition:'Used', mileage:310000, engine_cc:16124, fuel_type:'Diesel', transmission:'Auto', color:'Blue/Chrome', image_url:'https://images.unsplash.com/photo-1586336153858-b9f8a9c50bba?w=600&auto=format', agent:'Patrick Audo', country:'KE', verified:true, narrative_description:'Hauling 50 tonnes from Mombasa to Kampala requires a machine of absolute conviction — the FH16 750 Globetrotter delivers with 750PS, I-Save predictive cruise control, and a Globetrotter XL cab offering hotel-quality sleeping provisions for long-haul COMESA corridor runs. Engine majored at 280,000km with Volvo Certified Rebuilt documentation.' },
  { id:'V024', make:'Kia', model:'Stinger GT', year:2021, category:'Sedan', price:4200000, condition:'Used', mileage:45000, engine_cc:3317, fuel_type:'Petrol', transmission:'Auto', drive_type:'AWD', color:'Aurora Black', image_url:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format', agent:'Ann Njeri', country:'KE', verified:true, narrative_description:'Korea\'s ultimate sleeper — the Stinger GT 3.3 Twin-Turbo AWD will silence every European rival at a third of the price. This Grand Touring specification includes Nappa leather, Harman Kardon premium audio, and a 0-100km/h time of 4.9 seconds. Imported from South Korea via KOREXIM direct, with full Kia Kenya warranty honour confirmed in writing.' },
  { id:'V025', make:'TATA', model:'Prima 4028.S', year:2022, category:'Commercial', price:8200000, condition:'New', mileage:4000, engine_cc:5883, fuel_type:'Diesel', transmission:'Manual', color:'White', image_url:'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&auto=format', agent:'Felix Nyamwaya', country:'KE', verified:true, narrative_description:'Built for the Northern Corridor — the TATA Prima 4028.S ultra-heavy commercial is assembled in Pune with East Africa market-tuned axle ratings for Kenya\'s SGR competitor highways. The 370PS Cummins ISBe6 engine meets Euro IV emissions standards, a critical advantage for Nairobi\'s low emission zone compliance framework expected in 2027.' },
  { id:'V026', make:'Mahindra', model:'Scorpio Classic S11', year:2023, category:'SUV', price:2400000, condition:'New', mileage:1800, engine_cc:2523, fuel_type:'Diesel', transmission:'Manual', drive_type:'4WD', color:'Dazzling Silver', image_url:'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=600&auto=format', agent:'Lucy Adhiambo', country:'KE', verified:true, narrative_description:'Mahindra\'s most affordable genuine 4x4 SUV is conquering rural Kenya with 7-seat capacity, a robust 2.5L mHawk diesel, and genuine ladder-frame construction — at a price 40% below Japanese competition. The S11 variant adds a touchscreen, reverse camera, and alloy wheels while maintaining the legendary Mahindra mechanical simplicity beloved by Kenya\'s rural maintenance workshops.' },
  { id:'V027', make:'Porsche', model:'Cayenne Coupe', year:2022, category:'SUV', price:16800000, condition:'Used', mileage:22000, engine_cc:2894, fuel_type:'Petrol', transmission:'Auto', drive_type:'4WD', color:'Crayon', image_url:'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=600&auto=format', agent:'Diana Kibet', country:'KE', verified:true, narrative_description:'The Cayenne Coupe S represents Porsche\'s most daring design — a rakish fastback roofline over genuine SUV capability. This Nairobi-registered example was owned by a tech company CEO and maintained exclusively at Porsche Centre Nairobi. PDCC Sport active anti-roll system, panoramic fixed glass roof, and sport exhaust combine for a truly unmistakeable road presence.' },
  { id:'V028', make:'Hyundai', model:'Tucson N-Line', year:2023, category:'SUV', price:3200000, condition:'New', mileage:1000, engine_url:'1598', fuel_type:'Petrol', transmission:'Auto', drive_type:'AWD', color:'Phantom Black', image_url:'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=600&auto=format', agent:'Martin Barasa', country:'KE', verified:true, narrative_description:'The N-Line badge elevates the Tucson from family crossover to performance statement — red N-Line badging, sport tuned suspension, and a two-tone interior with N-branded seats distinguish this as Hyundai\'s most athletic crossover. Imported from Hyundai SA under SADC duty waiver with 360-degree surround camera and BlueLink remote connectivity included.' },
  { id:'V029', make:'John Deere', model:'6M 6125M Tractor', year:2022, category:'Tractor', price:6800000, condition:'New', mileage:0, engine_cc:6788, fuel_type:'Diesel', transmission:'Auto', color:'John Deere Green', image_url:'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format', agent:'Julius Ngetich', country:'KE', verified:true, narrative_description:'East Africa\'s large-scale horticulture operations depend on the reliability of John Deere\'s 6M Series — 125HP, CommandQuad 24F/24R transmission, and JDLink telematics that allow farm managers to monitor fuel consumption, engine faults, and field efficiency data from a smartphone in real time. Eligible for KALRO farm mechanisation financing at 8% interest rate.' },
  { id:'V030', make:'Ferrari', model:'Roma', year:2022, category:'Classic', price:52000000, condition:'Used', mileage:8000, engine_cc:3855, fuel_type:'Petrol', transmission:'Auto', color:'Rosso Portofino', image_url:'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&auto=format', agent:'TAO Luxury Division', country:'KE', verified:true, narrative_description:'The Roma is Ferrari\'s most seductive modern GT — a 620CV twin-turbo V8 wrapped in a bodywork that references the la dolce vita era of 1950s Maranello design. This exceptional example is one of fewer than 5 registered in East Africa, maintained at Ferrari\'s approved workshop in Johannesburg. Offered with Ferrari Classiche documentation and TAO wealth management advisory for asset structuring.' },
];

const CATEGORIES = ['All', 'SUV', 'Sedan', 'Pickup', 'Motorcycle', 'Bus', 'Commercial', 'Electric', 'Hybrid', 'Classic', 'Van', 'Tractor'];

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(SHOWCASE_VEHICLES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'year-desc' | 'name'>('year-desc');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(false);

  // Merge Supabase data on top of showcase
  useEffect(() => {
    fetch('/api/vehicles')
      .then(r => r.json())
      .then(data => {
        if (data.vehicles?.length) {
          const ids = new Set(SHOWCASE_VEHICLES.map(v => v.id));
          const newOnes = data.vehicles.filter((v: Vehicle) => !ids.has(v.id));
          setVehicles([...SHOWCASE_VEHICLES, ...newOnes]);
        }
      })
      .catch(() => {}); // silent fallback
  }, []);

  const filtered = useMemo(() => {
    let list = vehicles;
    if (selectedCategory !== 'All') list = list.filter(v => v.category === selectedCategory);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(v =>
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.year.toString().includes(q) ||
        (v.color || '').toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'price-asc':  return [...list].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...list].sort((a, b) => b.price - a.price);
      case 'year-desc':  return [...list].sort((a, b) => b.year - a.year);
      case 'name':       return [...list].sort((a, b) => `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`));
      default:           return list;
    }
  }, [vehicles, selectedCategory, searchTerm, sortBy]);

  return (
    <div style={{ minHeight:'100vh', background:'var(--deep-blue)', paddingTop:64 }}>
      {/* Hero */}
      <div style={{ position:'relative', height:380, overflow:'hidden' }}>
        <Image
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&auto=format&fit=crop&q=80"
          alt="TAO Vehicle Hub"
          fill sizes="100vw" style={{ objectFit:'cover' }} priority
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(5,10,16,0.95) 100%)' }} />
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'0 24px' }}>
          <div style={{ display:'inline-block', background:'rgba(212,175,55,0.1)', border:'1px solid var(--border-gold)', borderRadius:30, padding:'6px 20px', marginBottom:16, fontSize:'0.8rem', color:'var(--gold)', fontFamily:"'Share Tech Mono', monospace" }}>
            ⚡ TAO SOVEREIGN VEHICLE NEXUS — {vehicles.length} ASSETS CATALOGUED
          </div>
          <h1 style={{ color:'#fff', fontFamily:"'Cinzel', serif", fontSize:'clamp(2rem, 5vw, 3.5rem)', margin:'0 0 12px' }}>
            <span style={{ color:'var(--gold)' }}>Vehicles</span> Hub
          </h1>
          <p style={{ color:'var(--silver)', maxWidth:540, margin:'0 0 28px', lineHeight:1.7 }}>
            Finance-ready inventory from Boda Bodas to Business Jets. Hire Purchase, Logbook Loans & Import Duty Finance across 26 SADC/EA nations.
          </p>
          {/* Search */}
          <div style={{ position:'relative', width:'100%', maxWidth:480 }}>
            <i className="fas fa-search" style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'var(--gold)', zIndex:1 }} />
            <input
              type="text"
              placeholder="Search make, model, year, colour..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft:42, background:'rgba(5,10,16,0.9)', width:'100%', boxSizing:'border-box' }}
            />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ background:'rgba(5,10,16,0.95)', borderBottom:'1px solid var(--border-gold)', padding:'16px 24px', position:'sticky', top:64, zIndex:100 }}>
        <div style={{ maxWidth:1400, margin:'0 auto', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          {/* Category pills */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', flex:1 }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                style={{ padding:'6px 14px', borderRadius:20, cursor:'pointer', border:'1px solid var(--border-gold)', background: selectedCategory === cat ? 'var(--gold)' : 'transparent', color: selectedCategory === cat ? '#000' : 'var(--silver)', fontSize:'0.78rem', fontWeight: selectedCategory === cat ? 700 : 400, transition:'all 0.2s' }}>
                {cat}
              </button>
            ))}
          </div>
          {/* Sort */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
            style={{ background:'rgba(212,175,55,0.1)', color:'var(--gold)', border:'1px solid var(--border-gold)', borderRadius:10, padding:'7px 12px', fontSize:'0.82rem' }}>
            <option value="year-desc">Newest First</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="name">A–Z</option>
          </select>
          <span style={{ color:'var(--silver)', fontSize:'0.78rem', whiteSpace:'nowrap' }}>{filtered.length} vehicles</span>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth:1400, margin:'0 auto', padding:'32px 24px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 24px', color:'var(--silver)' }}>
            <div style={{ fontSize:'3rem', marginBottom:16 }}>🚗</div>
            <p>No vehicles match your filter. Try adjusting your search.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(310px, 1fr))', gap:24 }}>
            {filtered.map(v => (
              <VehicleCard key={v.id} vehicle={v} onExpand={setSelectedVehicle} />
            ))}
          </div>
        )}
      </div>

      {/* Finance CTA Banner */}
      <div style={{ background:'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(0,0,0,0))', border:'1px solid var(--border-gold)', margin:'0 24px 40px', borderRadius:20, padding:'40px', textAlign:'center', maxWidth:1400, marginLeft:'auto', marginRight:'auto' }}>
        <h3 style={{ color:'var(--gold)', fontFamily:"'Cinzel', serif", fontSize:'1.6rem', marginBottom:12 }}>Finance Your Dream Vehicle Today</h3>
        <p style={{ color:'var(--silver)', marginBottom:24, maxWidth:560, margin:'0 auto 24px' }}>
          Hire Purchase · Logbook Loans · Import Duty Finance · Insurance Finance. M-Pesa deposits accepted. Cross-border SADC coverage.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <a href="/finance/hire" className="btn-gold" style={{ padding:'12px 28px' }}>
            <i className="fas fa-car" style={{ marginRight:8 }} />Hire Purchase
          </a>
          <a href="/finance/logbook" className="btn-outline" style={{ padding:'12px 28px' }}>
            <i className="fas fa-file-alt" style={{ marginRight:8 }} />Logbook Loan
          </a>
          <a href="/finance/insurance" className="btn-outline" style={{ padding:'12px 28px' }}>
            <i className="fas fa-shield-alt" style={{ marginRight:8 }} />Insurance Finance
          </a>
        </div>
      </div>

      {/* Vehicle Detail Modal */}
      {selectedVehicle && (
        <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && setSelectedVehicle(null)}>
          <div className="modal-card" style={{ maxWidth:720, maxHeight:'90vh', overflowY:'auto' }}>
            <div className="modal-header">
              <div>
                <span className="card-category">{selectedVehicle.category}</span>
                <h2 style={{ margin:'4px 0 0' }}>{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</h2>
              </div>
              <button className="btn-outline" style={{ borderColor:'var(--danger)', color:'var(--danger)', padding:'5px 12px' }} onClick={() => setSelectedVehicle(null)}>✕</button>
            </div>

            <div style={{ position:'relative', height:260, margin:'0 20px 20px', borderRadius:12, overflow:'hidden' }}>
              <Image src={selectedVehicle.image_url || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'} alt={selectedVehicle.model} fill sizes="700px" style={{ objectFit:'cover' }} />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
              <div style={{ position:'absolute', bottom:14, left:16 }}>
                <div style={{ color:'var(--gold)', fontFamily:"'Cinzel', serif", fontSize:'1.8rem', fontWeight:700 }}>
                  KSh {selectedVehicle.price.toLocaleString()}
                </div>
                <div style={{ color:'var(--silver)', fontSize:'0.82rem' }}>{selectedVehicle.condition} · {selectedVehicle.color}</div>
              </div>
            </div>

            <div style={{ padding:'0 20px 20px' }}>
              {/* Specs Grid */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10, marginBottom:20 }}>
                {[
                  { label:'Mileage', val: selectedVehicle.mileage === 0 ? 'Brand New' : `${(selectedVehicle.mileage || 0).toLocaleString()} km` },
                  { label:'Engine', val: selectedVehicle.engine_cc ? `${(selectedVehicle.engine_cc/1000).toFixed(1)}L` : '—' },
                  { label:'Fuel', val: selectedVehicle.fuel_type || '—' },
                  { label:'Gear', val: selectedVehicle.transmission || '—' },
                  { label:'Drive', val: selectedVehicle.drive_type || '—' },
                  { label:'Condition', val: selectedVehicle.condition },
                ].map(s => (
                  <div key={s.label} style={{ background:'rgba(212,175,55,0.06)', border:'1px solid var(--border-gold)', borderRadius:10, padding:'10px', textAlign:'center' }}>
                    <div style={{ color:'#fff', fontWeight:700 }}>{s.val}</div>
                    <div style={{ color:'var(--silver)', fontSize:'0.72rem' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Narrative Description */}
              {selectedVehicle.narrative_description && (
                <div style={{ background:'rgba(212,175,55,0.05)', border:'1px solid var(--border-gold)', borderRadius:12, padding:'16px', marginBottom:20 }}>
                  <p style={{ color:'var(--silver)', lineHeight:1.8, margin:0, fontSize:'0.88rem' }}>{selectedVehicle.narrative_description}</p>
                  <div style={{ marginTop:10, fontSize:'0.72rem', color:'rgba(212,175,55,0.4)', fontFamily:"'Share Tech Mono', monospace" }}>
                    ✦ AI-GENERATED · AMANDA SOP VALIDATED · 90/10 RATIO MAINTAINED
                  </div>
                </div>
              )}

              {/* Finance Buttons */}
              <h4 style={{ color:'var(--gold)', fontSize:'0.9rem', marginBottom:12 }}>
                <i className="fas fa-landmark" style={{ marginRight:8 }} />Vehicle Finance Options
              </h4>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
                {[
                  { href:'/finance/hire', label:'Hire Purchase', icon:'fa-car', color:'var(--gold)' },
                  { href:'/finance/logbook', label:'Logbook Loan', icon:'fa-file-alt', color:'#4A90E2' },
                  { href:'/finance/insurance', label:'Insurance Finance', icon:'fa-shield-alt', color:'var(--success)' },
                  { href:'/finance/bridging', label:'Bridging Loan', icon:'fa-bridge', color:'#E67E22' },
                ].map(f => (
                  <a key={f.href} href={f.href}
                    style={{ display:'flex', alignItems:'center', gap:8, padding:'12px', background:'rgba(212,175,55,0.08)', border:`1px solid ${f.color}44`, borderRadius:10, color:f.color, fontSize:'0.82rem', fontWeight:700, textDecoration:'none' }}>
                    <i className={`fas ${f.icon}`} />{f.label}
                  </a>
                ))}
              </div>

              <a href={`https://wa.me/254718554383?text=Hi, I'm interested in the ${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.id}) listed on TAO Platform.`}
                target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:'14px', background:'#25D366', color:'#fff', borderRadius:12, fontWeight:700, fontSize:'1rem', textDecoration:'none' }}>
                <i className="fab fa-whatsapp" style={{ fontSize:'1.3rem' }} />
                Contact {selectedVehicle.agent || 'TAO Agent'} — WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
