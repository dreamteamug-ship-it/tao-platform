'use client';
import { useState, useEffect, useMemo } from 'react';
import { addDays, format, startOfMonth, endOfMonth, startOfWeek, isSameMonth, isSameDay, isWithinInterval, isBefore, parseISO } from 'date-fns';
import { calculateBookingPrice } from '@/lib/pricingCalculator';
import { COUNTRY_TAX_CONFIG } from '@/lib/pricingCalculator';

interface BookingCalendarProps {
  propertyId: string;
  baseRate: number;      // per night in KES
  onBooked?: (data: any) => void;
}

interface BookedRange { start_date: string; end_date: string; }

export default function BookingCalendar({ propertyId, baseRate, onBooked }: BookingCalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [country, setCountry] = useState('KE');
  const [guestForm, setGuestForm] = useState({ guest_name: '', guest_email: '', guest_phone: '' });
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Fetch booked dates from API (with fallback)
  useEffect(() => {
    fetch(`/api/bookings?property_id=${propertyId}`)
      .then(r => r.json())
      .then(d => setBookedRanges(d.dates || []))
      .catch(() => {});
  }, [propertyId]);

  const isBooked = (date: Date) =>
    bookedRanges.some(r => isWithinInterval(date, { start: parseISO(r.start_date), end: parseISO(r.end_date) }));

  const isInSelection = (date: Date) => {
    if (!startDate) return false;
    const end = endDate || hoveredDate;
    if (!end) return isSameDay(date, startDate);
    const [s, e] = startDate <= end ? [startDate, end] : [end, startDate];
    return isWithinInterval(date, { start: s, end: e });
  };

  const handleDateClick = (date: Date) => {
    if (isBefore(date, today) || isBooked(date)) return;
    if (!startDate || (startDate && endDate)) { setStartDate(date); setEndDate(null); }
    else {
      if (isBefore(date, startDate)) { setStartDate(date); }
      else if (isSameDay(date, startDate)) { setStartDate(null); }
      else { setEndDate(date); setShowForm(true); }
    }
  };

  const nights = startDate && endDate
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const pricing = useMemo(() => {
    if (!startDate || !endDate || nights < 1) return null;
    return calculateBookingPrice({
      baseRate,
      nights,
      cleaningFee: Math.floor(baseRate * 0.1),
      serviceFee: Math.floor(baseRate * nights * 0.03),
      country,
    });
  }, [baseRate, nights, country, startDate, endDate]);

  const handleBook = async () => {
    if (!guestForm.guest_name || !startDate || !endDate) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: propertyId,
          ...guestForm,
          start_date: format(startDate, 'yyyy-MM-dd'),
          end_date: format(endDate, 'yyyy-MM-dd'),
          base_rate: baseRate, country,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setBookingResult(data);
      setStartDate(null); setEndDate(null); setShowForm(false);
      onBooked?.(data);
    } catch (err: any) {
      alert(err.message || 'Booking failed. Please try again.');
    }
    setSubmitting(false);
  };

  // Build calendar grid
  const calStart = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
  const calEnd = addDays(endOfMonth(currentMonth), 6);
  const days: Date[] = [];
  let d = calStart;
  while (d <= calEnd) { days.push(d); d = addDays(d, 1); }

  const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div style={{ background: 'var(--charcoal)', border: '1px solid var(--border-gold)', borderRadius: 16, overflow: 'hidden' }}>
      {/* Calendar Header */}
      <div style={{ padding: '20px 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-gold)' }}>
        <button onClick={() => setCurrentMonth(m => addDays(startOfMonth(m), -1))} style={{ background: 'none', border: '1px solid var(--border-gold)', color: 'var(--gold)', width: 34, height: 34, borderRadius: 8, cursor: 'pointer', fontSize: '1rem' }}>‹</button>
        <h3 style={{ margin: 0, color: 'var(--gold)', fontSize: '1rem' }}>{format(currentMonth, 'MMMM yyyy')}</h3>
        <button onClick={() => setCurrentMonth(m => addDays(endOfMonth(m), 1))} style={{ background: 'none', border: '1px solid var(--border-gold)', color: 'var(--gold)', width: 34, height: 34, borderRadius: 8, cursor: 'pointer', fontSize: '1rem' }}>›</button>
      </div>

      {/* Day labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '8px 12px 0' }}>
        {DAY_LABELS.map(l => (
          <div key={l} style={{ textAlign: 'center', color: 'var(--silver)', fontSize: '0.72rem', padding: '4px 0', fontWeight: 600 }}>{l}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, padding: '4px 12px 12px' }}>
        {days.map((day, i) => {
          const past = isBefore(day, today);
          const booked = isBooked(day);
          const selected = isInSelection(day);
          const isStart = startDate && isSameDay(day, startDate);
          const isEnd = endDate && isSameDay(day, endDate);
          const otherMonth = !isSameMonth(day, currentMonth);

          return (
            <div key={i}
              onClick={() => handleDateClick(day)}
              onMouseEnter={() => setHoveredDate(day)}
              onMouseLeave={() => setHoveredDate(null)}
              style={{
                aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 8, cursor: past || booked ? 'not-allowed' : 'pointer',
                fontSize: '0.82rem', fontWeight: isStart || isEnd ? 700 : 400,
                background: booked ? 'rgba(220,50,50,0.15)' : selected ? 'rgba(212,175,55,0.25)' : 'transparent',
                color: booked ? 'rgba(220,50,50,0.6)' : past ? '#2a3a4a' : otherMonth ? '#2a3a4a' : isStart || isEnd ? 'var(--gold)' : selected ? '#fff' : 'var(--silver)',
                border: isStart || isEnd ? '2px solid var(--gold)' : '1px solid transparent',
                transition: 'all 0.15s',
                textDecoration: booked ? 'line-through' : 'none',
                position: 'relative',
              }}
            >
              {format(day, 'd')}
              {booked && <div style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: 'var(--danger)' }} />}
            </div>
          );
        })}
      </div>

      {/* Country selector */}
      <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: 'var(--silver)', fontSize: '0.78rem' }}>Tax Region:</span>
        <select value={country} onChange={e => setCountry(e.target.value)} style={{ background: 'var(--deep-blue)', color: 'var(--gold)', border: '1px solid var(--border-gold)', borderRadius: 6, padding: '4px 8px', fontSize: '0.78rem' }}>
          {Object.entries(COUNTRY_TAX_CONFIG).map(([code, cfg]) => (
            <option key={code} value={code}>{cfg.flag ? cfg.flag + ' ' : ''}{cfg.name} ({(cfg.vat * 100).toFixed(0)}% VAT)</option>
          ))}
        </select>
      </div>

      {/* Pricing summary */}
      {pricing && startDate && endDate && (
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-gold)', background: 'rgba(212,175,55,0.05)' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.78rem' }}>
            {pricing.breakdown.map((line, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--silver)', marginBottom: 4 }}>
                <span>{line.split(':')[0]}</span>
                <span style={{ color: 'var(--gold)' }}>{line.split(':')[1]}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-gold)', fontWeight: 700 }}>
            <span style={{ color: '#fff', fontSize: '1rem' }}>TOTAL ({nights} nights)</span>
            <span style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>
              {pricing.currency} {pricing.total.toLocaleString()}
            </span>
          </div>
          {pricing.discountPct > 0 && (
            <div style={{ marginTop: 6, color: 'var(--success)', fontSize: '0.8rem', textAlign: 'center' }}>
              🎉 {pricing.discountPct * 100}% {nights >= 28 ? 'Monthly' : 'Weekly'} discount applied — saving {pricing.currency} {pricing.discountAmount.toLocaleString()}!
            </div>
          )}
          <button className="btn-gold" style={{ width: '100%', marginTop: 14, padding: 12 }} onClick={() => setShowForm(true)}>
            <i className="fas fa-calendar-check" style={{ marginRight: 8 }} />Book Now — {pricing.currency} {pricing.total.toLocaleString()}
          </button>
        </div>
      )}

      {/* Guest form */}
      {showForm && !bookingResult && (
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-gold)', background: 'rgba(0,0,0,0.4)' }}>
          <h4 style={{ marginBottom: 12, fontSize: '0.9rem', color: 'var(--gold)' }}>
            <i className="fas fa-user" style={{ marginRight: 8 }} />Guest Details
          </h4>
          <input type="text" placeholder="Your Full Name *" value={guestForm.guest_name} onChange={e => setGuestForm(f => ({ ...f, guest_name: e.target.value }))} style={{ marginBottom: 8 }} />
          <input type="email" placeholder="Email Address" value={guestForm.guest_email} onChange={e => setGuestForm(f => ({ ...f, guest_email: e.target.value }))} style={{ marginBottom: 8 }} />
          <input type="tel" placeholder="Phone Number" value={guestForm.guest_phone} onChange={e => setGuestForm(f => ({ ...f, guest_phone: e.target.value }))} style={{ marginBottom: 12 }} />
          <button className="btn-gold" style={{ width: '100%', padding: 12 }} onClick={handleBook} disabled={submitting}>
            {submitting ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Processing...</> : <><i className="fas fa-lock" style={{ marginRight: 8 }} />Confirm Booking</>}
          </button>
        </div>
      )}

      {/* Success state */}
      {bookingResult && (
        <div className="receipt-box" style={{ margin: 12, borderRadius: 10 }}>
          <div style={{ marginBottom: 8, fontWeight: 700 }}>✅ Booking Confirmed!</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--silver)' }}>
            {format(startDate || today, 'dd MMM')} → {format(endDate || today, 'dd MMM yyyy')} · {nights} nights
          </div>
        </div>
      )}
    </div>
  );
}
