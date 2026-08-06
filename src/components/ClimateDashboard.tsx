import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, Globe, Compass, RefreshCw, BarChart2, ShieldAlert, CheckCircle2, TrendingUp, Info } from "lucide-react";
import { ClimateHazardPoint, Language } from "../types";
import { translations } from "../translations";

// Predefined climate hotspot data points
const hotspotData: ClimateHazardPoint[] = [
  {
    id: "fr-drought",
    name: "Bordeaux & Champagne, France",
    lat: 46.5,
    lng: 1.5,
    region: "Western Europe",
    hazardType: "drought",
    riskLevel: "high",
    cropImpact: "Accelerated grape ripening, severe soil moisture deficits, and reduction in standard yields under persistent summer water stress.",
    cropImpactFr: "Maturation accélérée du raisin, déficits hydriques sévères du sol, et baisse des rendements sous stress hydrique estival persistant.",
    insuranceImpact: "Higher frequency of crop insurance claims, parametric triggering events, and increased asset impairment in regional wine-growing portfolios.",
    insuranceImpactFr: "Fréquence accrue des sinistres d'assurance récolte, déclenchements d'indices paramétriques, et dépréciation des actifs viticoles.",
    adaptationStrategy: "Adopting drought-resilient cover crops, implementing targeted micro-irrigation systems, and shifting planting layouts to cooler northern slopes.",
    adaptationStrategyFr: "Adoption de couverts végétaux résilients, déploiement d'une micro-irrigation ciblée, et décalage des parcelles vers les versants nord.",
    currentIndex: 42,
    projected2030: 58,
    projected2050: 78,
  },
  {
    id: "fr-flood",
    name: "Loire River Basin, France",
    lat: 47.3,
    lng: 0.8,
    region: "Western Europe",
    hazardType: "flood",
    riskLevel: "medium",
    cropImpact: "Temporary crop inundation, soil compaction, washouts of valuable river-terrace topsoil, and delays in spring field operations.",
    cropImpactFr: "Inondation temporaire des cultures, compactage du sol, lessivage des terres fertiles et retards importants dans les semis printaniers.",
    insuranceImpact: "Significant property damage claims, infrastructure business interruptions, and commercial asset exposure along flooding corridors.",
    insuranceImpactFr: "Sinistres majeurs sur les biens immobiliers, interruptions d'activité industrielle et forte exposition des actifs en couloir de crue.",
    adaptationStrategy: "Restoring upstream alluvial floodplains, raising critical storage facilities above 200-year levels, and implementing natural swales.",
    adaptationStrategyFr: "Restauration des plaines alluviales amont, surélévation des entrepôts hors crues bicentennales et aménagement de noues paysagères.",
    currentIndex: 35,
    projected2030: 48,
    projected2050: 64,
  },
  {
    id: "vn-sea-level",
    name: "Mekong Delta, Vietnam",
    lat: 10.2,
    lng: 105.8,
    region: "Southeast Asia",
    hazardType: "sea_level",
    riskLevel: "extreme",
    cropImpact: "Severe salinity intrusion up to 60km inland, spoiling freshwater aquifers and destroying traditional paddy rice cultivation environments.",
    cropImpactFr: "Intrusion saline sévère jusqu'à 60 km à l'intérieur des terres, gâtant la nappe phréatique et anéantissant la riziculture traditionnelle.",
    insuranceImpact: "Systemic risk profile, potential uninsurability of coastal agricultural assets, and major physical risk exposures to corporate infrastructure investments.",
    insuranceImpactFr: "Profil de risque systémique, risque d'inassurabilité des terres côtières, et exposition physique majeure des infrastructures d'investisseurs.",
    adaptationStrategy: "Converting paddies to brackish aquaculture (rice-shrimp farming cycles), deploying salinity-resilient rice cultivars, and constructing tide-gates.",
    adaptationStrategyFr: "Conversion en aquaculture saumâtre (cycles riz-crevette), déploiement de cultivars de riz tolérant le sel et vannes anti-marée.",
    currentIndex: 65,
    projected2030: 82,
    projected2050: 96,
  },
  {
    id: "ke-drought",
    name: "Rift Valley, Kenya",
    lat: -0.5,
    lng: 36.0,
    region: "East Africa",
    hazardType: "drought",
    riskLevel: "extreme",
    cropImpact: "Total collapse of rainfed maize, critical loss of pasture biomass for livestock feed, and soil erosion during subsequent torrential rains.",
    cropImpactFr: "Effondrement des rendements du maïs pluvial, perte critique de biomasse pastorale pour le bétail, et érosion accélérée lors des moussons tardives.",
    insuranceImpact: "Extreme trigger correlation, high regional micro-finance defaults, and surging parametric livestock mortality policy payouts.",
    insuranceImpactFr: "Corrélation extrême des sinistres, défauts de micro-crédits agricoles locaux, et flambée des indemnités d'assurance bétail indexée.",
    adaptationStrategy: "Transitioning to drought-tolerant sorghum, building regional sand-dams for rainwater collection, and setting up pastoral warning systems.",
    adaptationStrategyFr: "Transition vers le sorgho tolérant à la sécheresse, construction de barrages de sable pour collecter les eaux, et alertes pastorales.",
    currentIndex: 55,
    projected2030: 70,
    projected2050: 88,
  },
  {
    id: "de-heat",
    name: "Rhine Valley, Germany",
    lat: 50.0,
    lng: 8.0,
    region: "Western Europe",
    hazardType: "heatwave",
    riskLevel: "medium",
    cropImpact: "Severe physiological tree strain, decreased yield density of specialty crops, and loss of soil organic matter under thermal conditions.",
    cropImpactFr: "Stress physiologique sévère des arbres fruitiers, diminution de la densité des cultures de spécialité, et dégradation de l'humus du sol.",
    insuranceImpact: "Lower transport-river water levels restricting supply chain barges, leading to substantial commercial business interruption payouts.",
    insuranceImpactFr: "Baisse historique des cours d'eau pénalisant le transport fluvial de marchandises, entraînant de lourdes pertes d'exploitation.",
    adaptationStrategy: "Establishing agroforestry canopies, diversifying riparian buffer zones, and introducing high-efficiency solar-shading structures.",
    adaptationStrategyFr: "Implantation d'arbres agroforestiers protecteurs, diversification des bandes riveraines et installation de dômes d'ombrage solaire.",
    currentIndex: 30,
    projected2030: 45,
    projected2050: 62,
  },
  {
    id: "in-heat",
    name: "Rajasthan & Punjab, India",
    lat: 26.5,
    lng: 74.0,
    region: "South Asia",
    hazardType: "heatwave",
    riskLevel: "extreme",
    cropImpact: "Unprecedented spring thermal shocks burning wheat crops at flowering stage, leading to double-digit yield reduction and water-table collapse.",
    cropImpactFr: "Chocs thermiques printaniers sans précédent brûlant le blé en fleur, entraînant une chute des rendements et l'épuisement de la nappe phréatique.",
    insuranceImpact: "High loss rates on crop yield programs, systemic sovereign food reserve risk, and heat-induced labor safety liabilities.",
    insuranceImpactFr: "Taux de sinistralité record sur les récoltes de blé, risque souverain sur les stocks alimentaires et responsabilité liée à la santé au travail.",
    adaptationStrategy: "Implementing laser land-leveling, direct seeding of rice to conserve groundwater, and deploying wheat varieties breeding-resistant to heat shocks.",
    adaptationStrategyFr: "Nivellement au laser des terres, semis direct du riz pour préserver l'eau, et sélection de variétés de blé tolérantes à l'échaudage.",
    currentIndex: 70,
    projected2030: 85,
    projected2050: 98,
  },
  {
    id: "be-flood",
    name: "Flanders Coast, Belgium",
    lat: 51.2,
    lng: 3.2,
    region: "Western Europe",
    hazardType: "sea_level",
    riskLevel: "high",
    cropImpact: "Silt sedimentation in coastal lowlands, saline water pollution of arable horticultural fields, and drainage network lockouts.",
    cropImpactFr: "Dépôts de sédiments marins dans les polders bas, salinisation des terres maraîchères côtières et engorgement des réseaux de drainage.",
    insuranceImpact: "Substantial capital exposure in coastal property portfolios, escalating structural reinsurance prices, and asset value adjustments.",
    insuranceImpactFr: "Exposition financière colossale des portefeuilles immobiliers côtiers, hausse du coût de la réassurance et décote des actifs de polders.",
    adaptationStrategy: "Constructing managed coastal retreat zones, establishing sandy dune barriers, and deploying smart sub-surface pumping infrastructure.",
    adaptationStrategyFr: "Aménagement de zones de recul côtier maîtrisé, renforcement des barrières de dunes et déploiement de pompes intelligentes de sous-sol.",
    currentIndex: 45,
    projected2030: 60,
    projected2050: 80,
  }
];

interface ClimateDashboardProps {
  language: Language;
}

export default function ClimateDashboard({ language }: ClimateDashboardProps) {
  const [selectedSector, setSelectedSector] = useState<"agriculture" | "insurance" | "infrastructure">("agriculture");
  const [selectedHazard, setSelectedHazard] = useState<"all" | "drought" | "flood" | "heatwave" | "sea_level">("all");
  const [selectedYear, setSelectedYear] = useState<"current" | "2030" | "2050">("current");
  const [activePoint, setActivePoint] = useState<ClimateHazardPoint | null>(hotspotData[0]);

  const t = translations[language];

  // Map hazardous point filtering
  const filteredPoints = hotspotData.filter(point => {
    if (selectedHazard !== "all" && point.hazardType !== selectedHazard) return false;
    return true;
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-500 border-green-200 text-green-700";
      case "medium": return "bg-yellow-500 border-yellow-200 text-yellow-800";
      case "high": return "bg-orange-500 border-orange-200 text-orange-900";
      case "extreme": return "bg-red-600 border-red-200 text-red-950";
      default: return "bg-blue-500 border-blue-200";
    }
  };

  const getHazardLabel = (type: string) => {
    switch (type) {
      case "drought": return language === "fr" ? "Sécheresse" : "Drought";
      case "flood": return language === "fr" ? "Inondation" : "Flood";
      case "heatwave": return language === "fr" ? "Canicule" : "Heatwave";
      case "sea_level": return language === "fr" ? "Niveau de la mer" : "Sea Level Rise";
      default: return type;
    }
  };

  // Calculated average statistics
  const averageIndex = Math.round(
    filteredPoints.reduce((acc, p) => {
      if (selectedYear === "current") return acc + p.currentIndex;
      if (selectedYear === "2030") return acc + p.projected2030;
      return acc + p.projected2050;
    }, 0) / (filteredPoints.length || 1)
  );

  return (
    <div id="climate-map-dashboard-container" className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm overflow-hidden">
      {/* Dashboard Header */}
      <div className="border-b border-slate-200 pb-5 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="w-6 h-6 text-blue-800" />
          <h2 className="text-2xl font-bold text-slate-950 font-sans tracking-tight">{t.dashboard.title}</h2>
        </div>
        <p className="text-slate-600 text-sm max-w-4xl">{t.dashboard.sub}</p>
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Sector selection */}
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{t.dashboard.sector}</label>
          <div className="grid grid-cols-3 gap-2">
            {(["agriculture", "insurance", "infrastructure"] as const).map(sect => (
              <button
                key={sect}
                id={`sector-tab-${sect}`}
                onClick={() => setSelectedSector(sect)}
                className={`py-2 px-1 text-xs font-medium rounded-lg border transition-all text-center ${
                  selectedSector === sect
                    ? "bg-blue-800 border-blue-800 text-white shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {sect === "agriculture" && (language === "fr" ? "Agri" : "Agri")}
                {sect === "insurance" && (language === "fr" ? "Assur." : "Insur.")}
                {sect === "infrastructure" && (language === "fr" ? "Infrastr." : "Infra")}
              </button>
            ))}
          </div>
        </div>

        {/* Hazard filter overlay */}
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{t.dashboard.hazard}</label>
          <div className="grid grid-cols-5 gap-1.5">
            {["all", "drought", "flood", "heatwave", "sea_level"].map(hz => (
              <button
                key={hz}
                id={`hazard-btn-${hz}`}
                onClick={() => setSelectedHazard(hz as any)}
                className={`py-2 px-1 text-[10px] font-semibold rounded-lg border transition-all text-center ${
                  selectedHazard === hz
                    ? "bg-emerald-800 border-emerald-800 text-white shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {hz === "all" && (language === "fr" ? "Tous" : "All")}
                {hz === "drought" && (language === "fr" ? "Séch." : "Dry")}
                {hz === "flood" && (language === "fr" ? "Inond." : "Flood")}
                {hz === "heatwave" && (language === "fr" ? "Canic." : "Heat")}
                {hz === "sea_level" && (language === "fr" ? "Mer" : "Sea")}
              </button>
            ))}
          </div>
        </div>

        {/* Year forecast timeline */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{t.dashboard.forecastYear}</label>
          <div className="grid grid-cols-3 gap-2">
            {(["current", "2030", "2050"] as const).map(yr => (
              <button
                key={yr}
                id={`year-btn-${yr}`}
                onClick={() => setSelectedYear(yr)}
                className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all text-center uppercase tracking-wide ${
                  selectedYear === yr
                    ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {yr === "current" ? (language === "fr" ? "Actuel" : "Current") : yr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Analytics Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Interactive Styled Continent SVG Map */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-4 border border-slate-800 relative shadow-inner overflow-hidden flex flex-col min-h-[420px] justify-between">
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2 z-10">
            <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-200">{t.dashboard.mapTitle}</span>
          </div>

          {/* SVG Map Layout */}
          <div className="w-full h-full flex items-center justify-center relative mt-6">
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-full opacity-90 max-h-[380px]"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ocean Grid Lines */}
              <g stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" fill="none">
                <line x1="0" y1="100" x2="1000" y2="100" />
                <line x1="0" y1="200" x2="1000" y2="200" />
                <line x1="0" y1="300" x2="1000" y2="300" />
                <line x1="0" y1="400" x2="1000" y2="400" />
                <line x1="200" y1="0" x2="200" y2="500" />
                <line x1="400" y1="0" x2="400" y2="500" />
                <line x1="600" y1="0" x2="600" y2="500" />
                <line x1="800" y1="0" x2="800" y2="500" />
              </g>

              {/* Equator */}
              <line x1="0" y1="250" x2="1000" y2="250" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" />
              <text x="10" y="245" fill="#475569" className="text-[10px] font-mono">EQUATOR</text>

              {/* SIMULATED STYLIZED WORLD LAND MASS OUTLINE (Europe, Africa, Middle East, Asia) */}
              <g fill="#1e293b" stroke="#334155" strokeWidth="1.5">
                {/* Europe */}
                <path d="M 50 150 Q 80 120 150 110 T 250 100 T 320 140 T 350 200 T 300 230 T 200 210 Z" />
                {/* Africa */}
                <path d="M 120 220 Q 200 230 250 270 T 240 380 T 280 470 T 240 480 T 160 380 T 110 300 Z" />
                {/* Middle East */}
                <path d="M 280 200 Q 340 210 380 230 T 390 290 T 330 280 Z" />
                {/* Madagascar */}
                <path d="M 300 410 Q 320 420 310 460 Z" />
                {/* Asia Mainland */}
                <path d="M 350 150 Q 550 120 700 130 T 850 180 T 800 320 T 650 350 T 450 300 Z" />
                {/* Southeast Asia Islands / Indonesia / India / Vietnam */}
                <path d="M 480 300 Q 510 350 490 380 Z" /> {/* India */}
                <path d="M 620 290 Q 640 330 630 350 Z" /> {/* Vietnam */}
                <path d="M 680 380 Q 730 400 780 410 T 880 400 Z" /> {/* Indonesia */}
              </g>

              {/* Interactive Pulsing Hotspot Markers */}
              {filteredPoints.map((point) => {
                // Approximate coordinate mapping to fit our stylized SVG canvas coordinates
                // Standard lat: -90 to 90, lng: -180 to 180. Map is centered on prime meridian.
                // Center at x=250, y=250 approx.
                // We map them customly to align beautifully with drawn continents!
                let mapX = 250;
                let mapY = 250;

                if (point.id.includes("fr-")) {
                  mapX = 140 + (point.lng * 2);
                  mapY = 130 - (point.lat * 0.8);
                } else if (point.id.includes("de-")) {
                  mapX = 175;
                  mapY = 120;
                } else if (point.id.includes("be-")) {
                  mapX = 160;
                  mapY = 115;
                } else if (point.id.includes("vn-")) {
                  mapX = 660;
                  mapY = 270;
                } else if (point.id.includes("ke-")) {
                  mapX = 280;
                  mapY = 320;
                } else if (point.id.includes("in-")) {
                  mapX = 490;
                  mapY = 210;
                }

                const isActive = activePoint?.id === point.id;
                const riskLevel = point.riskLevel;

                let markerColor = "#22c55e"; // low (green)
                if (riskLevel === "medium") markerColor = "#eab308"; // yellow
                if (riskLevel === "high") markerColor = "#f97316"; // orange
                if (riskLevel === "extreme") markerColor = "#dc2626"; // red

                return (
                  <g
                    key={point.id}
                    className="cursor-pointer group"
                    onClick={() => setActivePoint(point)}
                  >
                    {/* Ring Pulse animation for active point */}
                    {isActive && (
                      <circle
                        cx={mapX}
                        cy={mapY}
                        r="24"
                        fill="none"
                        stroke={markerColor}
                        strokeWidth="1"
                        className="animate-ping opacity-35"
                      />
                    )}
                    
                    {/* Outer glowing border */}
                    <circle
                      cx={mapX}
                      cy={mapY}
                      r={isActive ? "14" : "10"}
                      fill="none"
                      stroke={markerColor}
                      strokeWidth={isActive ? "2.5" : "1"}
                      className="transition-all duration-300"
                    />

                    {/* Central Marker */}
                    <circle
                      cx={mapX}
                      cy={mapY}
                      r={isActive ? "7" : "5"}
                      fill={markerColor}
                      className="transition-all duration-300 group-hover:r-7"
                    />

                    {/* Tooltip Overlay */}
                    <text
                      x={mapX}
                      y={mapY - 18}
                      fill="#e2e8f0"
                      textAnchor="middle"
                      className="text-[9px] font-mono font-medium tracking-tight bg-slate-950/90 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    >
                      {point.name.split(",")[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Metrics Overlay */}
          <div className="grid grid-cols-2 gap-4 bg-slate-950/70 backdrop-blur-md p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="bg-blue-950/80 p-2 rounded-lg border border-blue-800">
                <Compass className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">{t.dashboard.activePoints}</p>
                <p className="text-sm font-bold font-mono text-slate-100">{filteredPoints.length} Hotspots</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-emerald-950/80 p-2 rounded-lg border border-emerald-800">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">{t.dashboard.avgRisk}</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold font-mono text-slate-100">{averageIndex}%</p>
                  <span className={`w-2 h-2 rounded-full ${
                    averageIndex > 75 ? "bg-red-500 animate-pulse" : averageIndex > 50 ? "bg-orange-500" : "bg-yellow-500"
                  }`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hotspot details side-panel */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full min-h-[420px]">
          <AnimatePresence mode="wait">
            {activePoint ? (
              <motion.div
                key={activePoint.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex-1 flex flex-col justify-between"
              >
                <div>
                  {/* Hotspot Meta Info */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className="text-[10px] font-semibold text-blue-800 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                        {activePoint.region}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1 font-sans">{activePoint.name}</h3>
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md border ${getRiskColor(activePoint.riskLevel)}`}>
                      {language === "fr" ? "Alerte : " : "Risk: "}{activePoint.riskLevel}
                    </span>
                  </div>

                  {/* Indicator details */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 mb-4">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                      {t.dashboard.indicators[activePoint.hazardType]}
                    </p>
                    
                    {/* Horizontal Forecast Bar Comparisons */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                          <span>{t.dashboard.current}</span>
                          <span className="font-mono">{activePoint.currentIndex}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-slate-700 h-full rounded-full transition-all duration-500" style={{ width: `${activePoint.currentIndex}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                          <span>2030 Outlook</span>
                          <span className="font-mono text-orange-600 font-bold">{activePoint.projected2030}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: `${activePoint.projected2030}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                          <span>2050 Outlook</span>
                          <span className="font-mono text-red-600 font-bold">{activePoint.projected2050}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-red-600 h-full rounded-full transition-all duration-500" style={{ width: `${activePoint.projected2050}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sector specific vulnerability profile */}
                  <div className="mb-4">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1.5">
                      <ShieldAlert className="w-4 h-4 text-orange-500" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{t.dashboard.impact}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed bg-orange-50/50 p-3 rounded-lg border border-orange-100/50">
                      {selectedSector === "agriculture" && (language === "fr" ? activePoint.cropImpactFr : activePoint.cropImpact)}
                      {selectedSector === "insurance" && (language === "fr" ? activePoint.insuranceImpactFr : activePoint.insuranceImpact)}
                      {selectedSector === "infrastructure" && (language === "fr" ? `${activePoint.cropImpactFr} ${activePoint.insuranceImpactFr}` : `${activePoint.cropImpact} ${activePoint.insuranceImpact}`)}
                    </p>
                  </div>

                  {/* Sector specific recommended adaptation strategy */}
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{t.dashboard.adaptation}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/50 font-sans">
                      {language === "fr" ? activePoint.adaptationStrategyFr : activePoint.adaptationStrategy}
                    </p>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 mt-4 border-t border-slate-100 pt-3 flex items-center gap-1.5 font-mono">
                  <Info className="w-3.5 h-3.5" />
                  <span>Interactive overlay type: {getHazardLabel(activePoint.hazardType)}</span>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center flex-1 flex flex-col justify-center items-center">
                <Globe className="w-12 h-12 text-slate-300 mb-3 stroke-1" />
                <p className="text-slate-500 text-sm max-w-xs">{t.dashboard.clickMarker}</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
