import React, { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Kontakt from "@/components/sections/Kontakt";
import { DollarSign, HardDrive, TrendingUp, AlertTriangle, Clock, Zap } from "lucide-react";

/* ==========================================================================
   /kalkulatory — 6 interaktywnych kalkulatorów
   ========================================================================== */

const fmtPLN  = (v) => new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(Math.max(0, v));
const fmtNum  = (v, d = 0) => new Intl.NumberFormat("pl-PL", { maximumFractionDigits: d }).format(v);
const fmtTB   = (v) => `${fmtNum(v, 1)} TB`;

const Field = ({ label, unit, value, onChange, min = 0, max = 100000, step = 1, hint }) => (
  <label className="calc-field">
    <span className="calc-field__label">{label}{unit && <em>({unit})</em>}</span>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min} max={max} step={step}
      className="calc-field__input"
    />
    {hint && <small className="calc-field__hint">{hint}</small>}
  </label>
);

const Select = ({ label, value, onChange, options }) => (
  <label className="calc-field">
    <span className="calc-field__label">{label}</span>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="calc-field__input">
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </label>
);

const Card = ({ n, icon, title, subtitle, children, result, note }) => (
  <section
    className="calc-card"
    data-testid={`calculator-${n}`}
  >
    <header className="calc-card__head">
      <span className="calc-card__num">{String(n).padStart(2, "0")}</span>
      <div className="calc-card__icon">{icon}</div>
      <div>
        <h2 className="calc-card__title">{title}</h2>
        <p className="calc-card__sub">{subtitle}</p>
      </div>
    </header>
    <div className="calc-card__body">
      <div className="calc-card__inputs">{children}</div>
      <div className="calc-card__output" data-testid={`calculator-${n}-output`}>
        {result}
        {note && <p className="calc-card__note">{note}</p>}
      </div>
    </div>
  </section>
);

/* ---------- 1) TCO ---------- */
const TcoCalc = () => {
  const [servers, setServers] = useState(10);
  const [cost, setCost] = useState(45000);        // PLN / serwer
  const [years, setYears] = useState(5);
  const [maint, setMaint] = useState(18);         // % rocznie
  const [energy, setEnergy] = useState(1.2);      // kW / serwer
  const [kwh, setKwh] = useState(0.85);           // PLN / kWh
  const [personnel, setPersonnel] = useState(8000); // PLN / msc

  const r = useMemo(() => {
    const capex = servers * cost;
    const maintPerYear = capex * (maint / 100);
    const energyPerYear = servers * energy * 24 * 365 * kwh;
    const personnelPerYear = personnel * 12;
    const opexTotal = (maintPerYear + energyPerYear + personnelPerYear) * years;
    const total = capex + opexTotal;
    return { capex, opexTotal, total, perYear: total / years };
  }, [servers, cost, years, maint, energy, kwh, personnel]);

  return (
    <Card
      n={1}
      icon={<DollarSign size={22} />}
      title="TCO — Total Cost of Ownership"
      subtitle="Realny koszt posiadania infrastruktury on-prem: CAPEX + OPEX (utrzymanie, energia, personel)"
      result={
        <>
          <span className="calc-out__label">Łączny 5-letni TCO</span>
          <strong className="calc-out__big">{fmtPLN(r.total)}</strong>
          <div className="calc-out__row"><span>CAPEX (sprzęt)</span><em>{fmtPLN(r.capex)}</em></div>
          <div className="calc-out__row"><span>OPEX (razem)</span><em>{fmtPLN(r.opexTotal)}</em></div>
          <div className="calc-out__row"><span>Średnio / rok</span><em>{fmtPLN(r.perYear)}</em></div>
        </>
      }
      note="Wynik uwzględnia sprzęt, wsparcie serwisowe, koszty energii przy założonym PUE 1.0 oraz koszty operacyjne personelu."
    >
      <Field label="Liczba serwerów"      value={servers}   onChange={setServers} min={1} max={1000} />
      <Field label="Koszt / serwer"       unit="PLN" value={cost} onChange={setCost} min={1000} step={500} />
      <Field label="Horyzont"             unit="lat" value={years} onChange={setYears} min={1} max={10} />
      <Field label="Utrzymanie / rok"     unit="%" value={maint} onChange={setMaint} min={0} max={100} />
      <Field label="Pobór / serwer"       unit="kW" value={energy} onChange={setEnergy} min={0.1} max={5} step={0.1} />
      <Field label="Cena energii"         unit="PLN/kWh" value={kwh} onChange={setKwh} min={0.1} step={0.05} />
      <Field label="Koszt personelu / msc" unit="PLN" value={personnel} onChange={setPersonnel} min={0} step={500} />
    </Card>
  );
};

/* ---------- 2) Pojemność użytkowa (RAID) ---------- */
const RaidCalc = () => {
  const [disks, setDisks] = useState(8);
  const [size, setSize] = useState(4);       // TB / dysk
  const [level, setLevel] = useState("6");

  const r = useMemo(() => {
    const total = disks * size;
    let usable = 0, fault = 0, iops = "-", minDisks = 2, warn = "";
    switch (level) {
      case "0":  usable = total; fault = 0; iops = "100%"; minDisks = 2; break;
      case "1":  usable = total / 2; fault = 1; iops = "50%"; minDisks = 2; break;
      case "5":  usable = disks >= 3 ? total - size : 0; fault = 1; iops = "70%"; minDisks = 3; break;
      case "6":  usable = disks >= 4 ? total - 2 * size : 0; fault = 2; iops = "60%"; minDisks = 4; break;
      case "10": usable = total / 2; fault = Math.floor(disks / 2); iops = "80%"; minDisks = 4; break;
      // NetApp RAID-DP (ONTAP): podwójna parzystość na WAFL — analogia do RAID 6
      // ale zoptymalizowana pod losowy zapis; typowo 3-28 dysków w RAID-grupie.
      case "dp": usable = disks >= 3 ? total - 2 * size : 0; fault = 2; iops = "75%"; minDisks = 3; break;
      // NetApp DDP (E-Series Dynamic Disk Pools): rozproszone strefy 8+2,
      // ~2 dyski poświęcone na parzystość + ok. 10% pojemności rezerwowanej
      // na odbudowę (preservation capacity). Min. 11 dysków.
      case "ddp": {
        if (disks >= 11) {
          const parityOverhead = 2 * size;                    // 2 dyski na parzystość
          const preservation = (total - parityOverhead) * 0.10; // ~10% rezerwacji
          usable = total - parityOverhead - preservation;
        } else {
          usable = 0;
        }
        fault = 2; iops = "80%"; minDisks = 11; break;
      }
      default: break;
    }
    if (disks < minDisks) warn = `Wybrany poziom wymaga min. ${minDisks} dysków`;
    const eff = total > 0 ? (usable / total) * 100 : 0;
    return { total, usable, fault, iops, eff, minDisks, warn };
  }, [disks, size, level]);

  return (
    <Card
      n={2}
      icon={<HardDrive size={22} />}
      title="Pojemność użytkowa (RAID)"
      subtitle="Dobierz konfigurację dysków i macierzy — zobacz realną pojemność i tolerancję awarii"
      result={
        <>
          <span className="calc-out__label">Pojemność użytkowa</span>
          <strong className="calc-out__big">{fmtTB(r.usable)}</strong>
          <div className="calc-out__row"><span>Pojemność brutto</span><em>{fmtTB(r.total)}</em></div>
          <div className="calc-out__row"><span>Wydajność (efektywność)</span><em>{fmtNum(r.eff, 0)}%</em></div>
          <div className="calc-out__row"><span>Tolerancja awarii</span><em>{r.fault} dysk{r.fault === 1 ? "" : "ów"}</em></div>
          <div className="calc-out__row"><span>Wydajność IOPS (rel.)</span><em>{r.iops}</em></div>
          {r.warn && <div className="calc-out__warn" data-testid="raid-warn">⚠ {r.warn}</div>}
        </>
      }
      note="RAID-DP (ONTAP) = podwójna parzystość na WAFL, min. 3 dyski. DDP (E-Series) = rozproszone strefy 8+2 z ~10% rezerwacją na odbudowę, min. 11 dysków. Realna pojemność po formatowaniu jest zwykle o 5-10% mniejsza."
    >
      <Field  label="Liczba dysków"        value={disks} onChange={setDisks} min={2} max={64} />
      <Field  label="Pojemność / dysk"     unit="TB" value={size} onChange={setSize} min={0.5} step={0.5} max={30} />
      <Select label="Poziom RAID"          value={level} onChange={setLevel} options={[
        { value: "0",   label: "RAID 0 (striping)" },
        { value: "1",   label: "RAID 1 (mirror)" },
        { value: "5",   label: "RAID 5 (single parity)" },
        { value: "6",   label: "RAID 6 (double parity)" },
        { value: "10",  label: "RAID 10 (mirror + stripe)" },
        { value: "dp",  label: "RAID-DP · NetApp ONTAP" },
        { value: "ddp", label: "RAID DDP · NetApp E-Series (min. 11)" },
      ]} />
    </Card>
  );
};

/* ---------- 3) Zajętość dysków w czasie ---------- */
const GrowthCalc = () => {
  const [current, setCurrent] = useState(60);  // TB
  const [capacity, setCapacity] = useState(100); // TB
  const [growth, setGrowth] = useState(8);       // % / msc

  const r = useMemo(() => {
    const g = growth / 100;
    let m = current, months = 0, arr = [];
    for (let i = 0; i <= 60; i++) {
      arr.push({ month: i, size: Math.min(m, capacity) });
      if (m >= capacity && months === 0) months = i;
      m = m * (1 + g);
      if (i > 60) break;
    }
    if (months === 0 && m < capacity) months = -1; // never full within 60 msc
    const fullDate = new Date();
    if (months > 0) fullDate.setMonth(fullDate.getMonth() + months);
    const pct = (current / capacity) * 100;
    return { months, fullDate, pct, arr };
  }, [current, capacity, growth]);

  // Prosty SVG sparkline (60 miesięcy)
  const chartW = 320, chartH = 90;
  const maxSize = Math.max(capacity, r.arr[r.arr.length - 1]?.size || capacity);
  const pathD = r.arr.map((p, i) => {
    const x = (i / 60) * chartW;
    const y = chartH - (p.size / maxSize) * chartH;
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  const capY = chartH - (capacity / maxSize) * chartH;

  return (
    <Card
      n={3}
      icon={<TrendingUp size={22} />}
      title="Zajętość dysków w czasie"
      subtitle="Prognoza kiedy Twój storage się zapełni na podstawie miesięcznego tempa wzrostu"
      result={
        <>
          <span className="calc-out__label">Kiedy 100% pojemności</span>
          <strong className="calc-out__big">
            {r.months < 0 ? "> 60 msc" : r.months === 0 ? "TERAZ" : `${r.months} msc`}
          </strong>
          <div className="calc-out__row"><span>Aktualne wykorzystanie</span><em>{fmtNum(r.pct, 1)}%</em></div>
          {r.months > 0 && (
            <div className="calc-out__row"><span>Data pełnego zapełnienia</span>
              <em>{r.fullDate.toLocaleDateString("pl-PL", { month: "short", year: "numeric" })}</em>
            </div>
          )}
          <svg className="calc-chart" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none">
            <line x1="0" y1={capY} x2={chartW} y2={capY} stroke="#F87171" strokeDasharray="4 4" strokeWidth="1" />
            <path d={pathD} fill="none" stroke="#06FFE0" strokeWidth="2" />
            <text x="4" y={capY - 4} fill="#F87171" fontSize="10">100% ({capacity} TB)</text>
          </svg>
        </>
      }
      note="Wykres pokazuje projekcję zajętości przy stałym tempie wzrostu. Realny wzrost bywa cykliczny."
    >
      <Field label="Aktualna zajętość" unit="TB" value={current} onChange={setCurrent} min={0} max={10000} />
      <Field label="Pojemność całkowita" unit="TB" value={capacity} onChange={setCapacity} min={1} max={10000} />
      <Field label="Miesięczny wzrost" unit="%" value={growth} onChange={setGrowth} min={0} max={50} step={0.5} />
    </Card>
  );
};

/* ---------- 4) Koszt awarii ---------- */
const IncidentCalc = () => {
  const [employees, setEmployees] = useState(250);
  const [hourCost, setHourCost] = useState(120);   // PLN / h / pracownik (wliczając narzuty)
  const [affected, setAffected] = useState(70);    // % pracowników dotkniętych
  const [recovery, setRecovery] = useState(8);     // h przywrócenia
  const [dataLoss, setDataLoss] = useState(120000); // PLN — koszt odtworzenia danych/kar
  const [reputation, setReputation] = useState(15); // %

  const r = useMemo(() => {
    const idleLoss = employees * (affected / 100) * hourCost * recovery;
    const reputationLoss = idleLoss * (reputation / 100);
    const total = idleLoss + dataLoss + reputationLoss;
    return { idleLoss, dataLoss, reputationLoss, total };
  }, [employees, hourCost, affected, recovery, dataLoss, reputation]);

  return (
    <Card
      n={4}
      icon={<AlertTriangle size={22} />}
      title="Koszt awarii / incydentu"
      subtitle="Realny koszt poważnego incydentu: przestój produktywności + odtworzenie danych + strata reputacji"
      result={
        <>
          <span className="calc-out__label">Szacowany koszt incydentu</span>
          <strong className="calc-out__big calc-out__big--warn">{fmtPLN(r.total)}</strong>
          <div className="calc-out__row"><span>Strata produktywności</span><em>{fmtPLN(r.idleLoss)}</em></div>
          <div className="calc-out__row"><span>Odtworzenie danych / kary</span><em>{fmtPLN(r.dataLoss)}</em></div>
          <div className="calc-out__row"><span>Strata reputacji</span><em>{fmtPLN(r.reputationLoss)}</em></div>
        </>
      }
      note="Model liniowy dla pojedynczego incydentu. Dla ransomware/kar RODO wynik bywa 5-10× wyższy."
    >
      <Field label="Liczba pracowników" value={employees} onChange={setEmployees} min={1} max={100000} />
      <Field label="Koszt / pracownik / h" unit="PLN" value={hourCost} onChange={setHourCost} min={10} step={5} />
      <Field label="% dotkniętych" unit="%" value={affected} onChange={setAffected} min={0} max={100} />
      <Field label="Czas odzyskiwania" unit="h" value={recovery} onChange={setRecovery} min={1} max={720} />
      <Field label="Koszt odtworzenia" unit="PLN" value={dataLoss} onChange={setDataLoss} min={0} step={1000} />
      <Field label="Utrata reputacji" unit="% straty" value={reputation} onChange={setReputation} min={0} max={200} />
    </Card>
  );
};

/* ---------- 5) Koszt przestoju IT ---------- */
const DowntimeCalc = () => {
  const [revenue, setRevenue] = useState(20000000); // roczny PLN
  const [dependency, setDependency] = useState(70); // % zależność od IT
  const [hours, setHours] = useState(4);
  const [sla, setSla] = useState(99.9);

  const r = useMemo(() => {
    const hourly = revenue / (365 * 24) * (dependency / 100);
    const totalLoss = hourly * hours;
    const yearlyDowntimeH = (100 - sla) / 100 * 365 * 24;
    const yearlyLoss = hourly * yearlyDowntimeH;
    return { hourly, totalLoss, yearlyDowntimeH, yearlyLoss };
  }, [revenue, dependency, hours, sla]);

  return (
    <Card
      n={5}
      icon={<Clock size={22} />}
      title="Koszt przestoju IT"
      subtitle="Ile kosztuje jedna godzina niedostępności krytycznych systemów w Twojej firmie"
      result={
        <>
          <span className="calc-out__label">Strata / godzina przestoju</span>
          <strong className="calc-out__big">{fmtPLN(r.hourly)}</strong>
          <div className="calc-out__row"><span>Strata z bieżącej awarii ({hours}h)</span><em>{fmtPLN(r.totalLoss)}</em></div>
          <div className="calc-out__row"><span>Dopuszczalny downtime / rok</span><em>{fmtNum(r.yearlyDowntimeH, 1)}h</em></div>
          <div className="calc-out__row"><span>Roczna strata przy SLA {sla}%</span><em>{fmtPLN(r.yearlyLoss)}</em></div>
        </>
      }
      note="Model oparty na proporcjonalnym udziale IT w przychodach. Dla e-commerce / trading dependency zwykle > 90%."
    >
      <Field label="Przychód roczny" unit="PLN" value={revenue} onChange={setRevenue} min={0} step={100000} />
      <Field label="Zależność od IT" unit="%" value={dependency} onChange={setDependency} min={0} max={100} />
      <Field label="Czas awarii" unit="h" value={hours} onChange={setHours} min={0.1} step={0.5} max={720} />
      <Field label="Poziom SLA" unit="%" value={sla} onChange={setSla} min={80} max={100} step={0.01} />
    </Card>
  );
};

/* ---------- 6) Zużycie energii serwerowni ---------- */
const PowerCalc = () => {
  const [servers, setServers] = useState(20);
  const [power, setPower] = useState(450);   // W / serwer
  const [pue, setPue] = useState(1.6);
  const [kwh, setKwh] = useState(0.85);
  const [co2, setCo2] = useState(0.75);      // kg CO2 / kWh (Polska mix)

  const r = useMemo(() => {
    const kwPerServer = power / 1000;
    const yearlyKWhIT = servers * kwPerServer * 24 * 365;
    const totalKWh = yearlyKWhIT * pue;
    const yearlyCost = totalKWh * kwh;
    const monthlyCost = yearlyCost / 12;
    const co2Kg = totalKWh * co2;
    return { totalKWh, yearlyCost, monthlyCost, co2Kg };
  }, [servers, power, pue, kwh, co2]);

  return (
    <Card
      n={6}
      icon={<Zap size={22} />}
      title="Zużycie energii serwerowni"
      subtitle="Roczny koszt zasilania i chłodzenia + ślad węglowy Twojej infrastruktury"
      result={
        <>
          <span className="calc-out__label">Roczny koszt energii</span>
          <strong className="calc-out__big">{fmtPLN(r.yearlyCost)}</strong>
          <div className="calc-out__row"><span>Miesięcznie</span><em>{fmtPLN(r.monthlyCost)}</em></div>
          <div className="calc-out__row"><span>Zużycie kWh / rok</span><em>{fmtNum(r.totalKWh, 0)} kWh</em></div>
          <div className="calc-out__row"><span>Emisja CO₂ / rok</span><em>{fmtNum(r.co2Kg / 1000, 2)} t</em></div>
        </>
      }
      note="PUE (Power Usage Effectiveness) — nowoczesne DC osiągają 1.2-1.3, starsze serwerownie 1.8-2.5. Emisja liczona dla polskiego miksu energetycznego."
    >
      <Field label="Liczba serwerów" value={servers} onChange={setServers} min={1} max={10000} />
      <Field label="Śr. pobór / serwer" unit="W" value={power} onChange={setPower} min={50} step={10} />
      <Field label="PUE" value={pue} onChange={setPue} min={1} max={3} step={0.1} />
      <Field label="Cena energii" unit="PLN/kWh" value={kwh} onChange={setKwh} min={0.1} step={0.05} />
      <Field label="CO₂ / kWh" unit="kg" value={co2} onChange={setCo2} min={0.05} max={2} step={0.05} />
    </Card>
  );
};

const KalkulatoryPage = () => (
  <main data-testid="kalkulatory-main" className="sc-app calc-page">
    <Navbar />
    <section className="calc-hero">
      <div className="calc-hero__inner">
        <span className="calc-hero__tag">Kalkulatory · Narzędzia</span>
        <h1 className="calc-hero__title">Policz zanim <span className="calc-hero__accent">zdecydujesz</span></h1>
        <p className="calc-hero__sub">
          6 interaktywnych kalkulatorów które pomogą Ci wycenić TCO, dobrać macierz,
          oszacować koszty przestoju i realne wydatki na energię serwerowni.
        </p>
      </div>
    </section>

    <div className="calc-list">
      <TcoCalc />
      <RaidCalc />
      <GrowthCalc />
      <IncidentCalc />
      <DowntimeCalc />
      <PowerCalc />
    </div>

    <Kontakt />
  </main>
);

export default KalkulatoryPage;
