import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Truck,
  Zap,
  Plane,
  RefreshCw,
  Sliders,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  IndianRupee,
  Info,
  X,
  Sparkles,
  Layers,
  Package,
  Download,
  Shuffle,
  AlertCircle,
  PlusCircle,
  CheckCircle,
  TrendingUp,
  MapPin,
  Building2,
  ChevronRight,
  ShieldCheck,
  Loader2,
  Sun,
  Moon,
  Monitor,
  Box,
  Ruler,
  ArrowRight
} from 'lucide-react';

// Central Hub Coordinates: Delhi NCR
const DELHI_COORDS = { lat: 28.6139, lon: 77.2090 };

// Haversine Distance Formula with 1.25x Indian Road Winding Factor
function calculateRoadDistanceKm(lat1, lon1, lat2 = DELHI_COORDS.lat, lon2 = DELHI_COORDS.lon) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineKm = R * c;
  return Math.max(50, Math.round(straightLineKm * 1.25)); // 1.25 Indian winding road factor
}

// Carrier Traits & Rates (Indian Logistics Metrics)
const CARRIERS = [
  {
    id: 'surface-eco',
    name: 'Surface Eco Trucking',
    shortName: 'Surface Eco',
    description: 'Economy ground transport via national highways',
    baseCostPerKg: 8, // ₹8/kg
    costPerKm: 1.5, // ₹1.5/km
    speed: 35, // 35 km/h
    baseDelayProb: 0.20, // 20% delay risk
    maxCapacity: 20, // 20 slots
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    barColor: 'bg-emerald-600',
    icon: Truck
  },
  {
    id: 'express-road',
    name: 'Express Road Shipping',
    shortName: 'Express Road',
    description: 'High-speed interstate express delivery vans',
    baseCostPerKg: 18, // ₹18/kg
    costPerKm: 3.2, // ₹3.2/km
    speed: 65, // 65 km/h
    baseDelayProb: 0.08, // 8% delay risk
    maxCapacity: 10, // 10 slots
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    barColor: 'bg-blue-600',
    icon: Zap
  },
  {
    id: 'air-priority',
    name: 'Air Priority Express',
    shortName: 'Air Priority',
    description: 'Next-flight-out domestic air delivery',
    baseCostPerKg: 50, // ₹50/kg
    costPerKm: 6.5, // ₹6.5/km
    speed: 450, // 450 km/h
    baseDelayProb: 0.02, // 2% delay risk
    maxCapacity: 6, // 6 slots
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
    barColor: 'bg-indigo-600',
    icon: Plane
  }
];

// Sample Cities for quick initial generation
const SAMPLE_CITIES = [
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lon: 72.8777 },
  { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lon: 77.5946 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lon: 78.4867 },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lon: 72.5714 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lon: 73.8567 },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873 },
  { name: 'Chandigarh', state: 'Punjab', lat: 30.7333, lon: 76.7794 },
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lon: 76.2673 },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462 },
  { name: 'Surat', state: 'Gujarat', lat: 21.1702, lon: 72.8311 }
];

const SLA_DEADLINES = [6, 12, 24, 48];

// Format currency in INR
const formatINR = (val) => `₹${Math.round(val).toLocaleString('en-IN')}`;

// Helper to generate dynamic shipments
const generateSampleShipments = (count = 25, startIndex = 101) => {
  const list = [];
  for (let i = 0; i < count; i++) {
    const cityObj = SAMPLE_CITIES[Math.floor(Math.random() * SAMPLE_CITIES.length)];
    const distanceKm = calculateRoadDistanceKm(cityObj.lat, cityObj.lon);
    const weightKg = parseFloat((Math.random() * 24.5 + 0.5).toFixed(1));
    const targetHours = SLA_DEADLINES[Math.floor(Math.random() * SLA_DEADLINES.length)];
    const orderValue = Math.floor(Math.random() * 23500) + 1500;

    const hasDimensions = Math.random() > 0.5;
    let lengthCm = null;
    let widthCm = null;
    let heightCm = null;
    let volumetricWeightKg = null;
    let billableWeightKg = weightKg;

    if (hasDimensions) {
      lengthCm = Math.floor(Math.random() * 50) + 20;
      widthCm = Math.floor(Math.random() * 40) + 20;
      heightCm = Math.floor(Math.random() * 40) + 15;
      volumetricWeightKg = parseFloat(((lengthCm * widthCm * heightCm) / 5000).toFixed(1));
      billableWeightKg = Math.max(weightKg, volumetricWeightKg);
    }

    list.push({
      id: `ORD-IN-${startIndex + i}`,
      city: `${cityObj.name}, ${cityObj.state}`,
      cityNameOnly: cityObj.name,
      distanceKm,
      weightKg,
      lengthCm,
      widthCm,
      heightCm,
      volumetricWeightKg,
      billableWeightKg,
      targetHours,
      orderValue,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }
  return list;
};

export default function App() {
  // Theme Switcher State: 'light' | 'dark' | 'system'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('shipoptima-theme') || 'system';
  });

  // Apply Theme Effect
  useEffect(() => {
    localStorage.setItem('shipoptima-theme', theme);
    const root = document.documentElement;

    const applyTheme = (isDark) => {
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'dark') {
      applyTheme(true);
    } else if (theme === 'light') {
      applyTheme(false);
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(systemDark);

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  // Shipments state with localStorage persistence
  const [shipments, setShipments] = useState(() => {
    const saved = localStorage.getItem('shipoptima-shipments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved shipments', e);
      }
    }
    return generateSampleShipments(25, 101);
  });

  const [nextIndex, setNextIndex] = useState(() => {
    const savedIdx = localStorage.getItem('shipoptima-next-index');
    return savedIdx ? parseInt(savedIdx, 10) : 126;
  });

  useEffect(() => {
    localStorage.setItem('shipoptima-shipments', JSON.stringify(shipments));
    localStorage.setItem('shipoptima-next-index', nextIndex.toString());
  }, [shipments, nextIndex]);

  // Controls State
  const [strategy, setStrategy] = useState(() => localStorage.getItem('shipoptima-strategy') || 'balanced');
  const [penaltyPerHour, setPenaltyPerHour] = useState(() => {
    const saved = localStorage.getItem('shipoptima-penalty');
    return saved ? Number(saved) : 500;
  });
  const [weatherCondition, setWeatherCondition] = useState(() => {
    const saved = localStorage.getItem('shipoptima-weather');
    return saved ? Number(saved) : 1.2;
  });

  useEffect(() => {
    localStorage.setItem('shipoptima-strategy', strategy);
    localStorage.setItem('shipoptima-penalty', penaltyPerHour.toString());
    localStorage.setItem('shipoptima-weather', weatherCondition.toString());
  }, [strategy, penaltyPerHour, weatherCondition]);

  // Engine Optimization Spinner Feedback
  const [isOptimizing, setIsOptimizing] = useState(false);

  const triggerEngineFeedback = () => {
    setIsOptimizing(true);
    setTimeout(() => setIsOptimizing(false), 300);
  };

  const handleStrategyChange = (newStrat) => {
    setStrategy(newStrat);
    triggerEngineFeedback();
  };

  const handlePenaltyChange = (val) => {
    setPenaltyPerHour(val);
    triggerEngineFeedback();
  };

  const handleWeatherChange = (val) => {
    setWeatherCondition(val);
    triggerEngineFeedback();
  };

  // Table Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [selectedShipment, setSelectedShipment] = useState(null);

  // Custom Shipment Modal & Autocomplete State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [citySearchInput, setCitySearchInput] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [geocodedResult, setGeocodedResult] = useState(null);
  const [geocodingError, setGeocodingError] = useState('');
  const [customWeightKg, setCustomWeightKg] = useState(10.0);
  
  // Volumetric Dimensions State
  const [hasCustomDimensions, setHasCustomDimensions] = useState(false);
  const [lengthCm, setLengthCm] = useState(40);
  const [widthCm, setWidthCm] = useState(30);
  const [heightCm, setHeightCm] = useState(30);

  const [customTargetHours, setCustomTargetHours] = useState(24);
  const [customOrderValue, setCustomOrderValue] = useState(2500);
  const [toastMessage, setToastMessage] = useState('');

  // Refs for debouncing and click outside detection
  const searchTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  // Click Outside Listener for Autocomplete Dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Nominatim API Fetch (300ms, limit 5 places)
  useEffect(() => {
    const query = citySearchInput.trim();

    if (query.length < 2) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      setIsGeocoding(false);
      return;
    }

    // If already locked from suggestion click, don't re-query
    if (geocodedResult && geocodedResult.shortName.toLowerCase() === query.toLowerCase()) {
      return;
    }

    setIsGeocoding(true);
    setGeocodingError('');

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&limit=5&q=${encodeURIComponent(
            query
          )}`
        );
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setSuggestions(data);
          setIsDropdownOpen(true);
          setGeocodingError('');
        } else {
          setSuggestions([]);
          setIsDropdownOpen(true);
          setGeocodingError('No matching locations found in India.');
        }
      } catch (err) {
        console.error('Geocoding API fetch error:', err);
        setSuggestions([]);
        setIsDropdownOpen(false);
        setGeocodingError('Unable to connect to location lookup. Check connection.');
      } finally {
        setIsGeocoding(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [citySearchInput, geocodedResult]);

  // Handle Suggestion Click
  const handleSelectSuggestion = (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    const calculatedKm = calculateRoadDistanceKm(lat, lon);
    const shortName = place.name || place.display_name.split(',')[0];

    setCitySearchInput(shortName);
    setGeocodedResult({
      displayName: place.display_name,
      shortName,
      lat,
      lon,
      calculatedKm
    });
    setSuggestions([]);
    setIsDropdownOpen(false);
    setGeocodingError('');
  };

  // Handle Clear Search Input
  const handleClearSearch = () => {
    setCitySearchInput('');
    setSuggestions([]);
    setGeocodedResult(null);
    setGeocodingError('');
    setIsDropdownOpen(false);
  };

  // Computed Volumetric & Billable Weight for Modal Form
  const customVolumetricWeightKg = useMemo(() => {
    if (!hasCustomDimensions) return null;
    return parseFloat(((Number(lengthCm) * Number(widthCm) * Number(heightCm)) / 5000).toFixed(1));
  }, [hasCustomDimensions, lengthCm, widthCm, heightCm]);

  const customBillableWeightKg = useMemo(() => {
    if (!hasCustomDimensions || !customVolumetricWeightKg) return Number(customWeightKg);
    return Math.max(Number(customWeightKg), customVolumetricWeightKg);
  }, [hasCustomDimensions, customWeightKg, customVolumetricWeightKg]);

  // Handle adding custom shipment
  const handleAddCustomShipment = () => {
    if (!geocodedResult) return;

    const newShipment = {
      id: `ORD-IN-SIM-${nextIndex}`,
      city: geocodedResult.displayName.split(',').slice(0, 2).join(','),
      cityNameOnly: geocodedResult.shortName,
      distanceKm: geocodedResult.calculatedKm,
      weightKg: Number(customWeightKg),
      lengthCm: hasCustomDimensions ? Number(lengthCm) : null,
      widthCm: hasCustomDimensions ? Number(widthCm) : null,
      heightCm: hasCustomDimensions ? Number(heightCm) : null,
      volumetricWeightKg: customVolumetricWeightKg,
      billableWeightKg: customBillableWeightKg,
      targetHours: Number(customTargetHours),
      orderValue: Number(customOrderValue),
      isCustom: true,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setShipments(prev => [newShipment, ...prev]);
    setNextIndex(prev => prev + 1);
    setIsModalOpen(false);
    setCitySearchInput('');
    setGeocodedResult(null);
    setHasCustomDimensions(false);
    triggerEngineFeedback();
    showToast('New custom shipment added to scheduled shipment list!');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleGenerate25 = () => {
    const newItems = generateSampleShipments(25, nextIndex);
    setShipments(prev => [...prev, ...newItems]);
    setNextIndex(prev => prev + 25);
    triggerEngineFeedback();
    showToast('Generated 25 new sample shipments from Delhi Hub!');
  };

  const handleReset = () => {
    const initial = generateSampleShipments(25, 101);
    setShipments(initial);
    setNextIndex(126);
    localStorage.removeItem('shipoptima-shipments');
    triggerEngineFeedback();
    showToast('Reset shipment list to initial 25 shipments.');
  };

  // Real-time Sandbox Calculation inside Custom Form Modal using Billable Weight
  const sandboxCalculations = useMemo(() => {
    if (!geocodedResult) return null;

    const distKm = geocodedResult.calculatedKm;
    const billableWt = customBillableWeightKg;
    const tgtHours = Number(customTargetHours) || 24;

    const options = CARRIERS.map(c => {
      const shippingCost = (c.baseCostPerKg * billableWt) + (c.costPerKm * distKm);
      const deliveryTimeHours = distKm / c.speed;
      const isLate = deliveryTimeHours > tgtHours;
      const hoursLate = isLate ? (deliveryTimeHours - tgtHours) : 0;
      const delayRisk = Math.min(1.0, c.baseDelayProb * weatherCondition);
      const penaltyRisk = isLate ? (hoursLate * penaltyPerHour) : (delayRisk * penaltyPerHour * 0.5);
      const totalExpense = shippingCost + penaltyRisk;

      return {
        carrierId: c.id,
        carrierName: c.name,
        shippingCost,
        deliveryTimeHours,
        isLate,
        hoursLate,
        delayRisk,
        penaltyRisk,
        totalExpense
      };
    });

    let bestChoice = [...options].sort((a, b) => a.totalExpense - b.totalExpense)[0];
    if (strategy === 'lowest_cost') {
      bestChoice = [...options].sort((a, b) => a.shippingCost - b.shippingCost)[0];
    } else if (strategy === 'strict_sla') {
      const onTime = options.filter(o => !o.isLate);
      if (onTime.length > 0) {
        bestChoice = onTime.sort((a, b) => a.delayRisk - b.delayRisk)[0];
      } else {
        bestChoice = [...options].sort((a, b) => a.hoursLate - b.hoursLate)[0];
      }
    }

    return { options, bestChoice };
  }, [geocodedResult, customBillableWeightKg, customTargetHours, strategy, penaltyPerHour, weatherCondition]);

  // Main Operations Engine with Volumetric Billable Weight Math
  const processedData = useMemo(() => {
    if (!shipments || shipments.length === 0) {
      return {
        processedShipments: [],
        kpis: {
          totalOrders: 0,
          totalWeight: 0,
          totalSpend: 0,
          baselineSpend: 0,
          moneySaved: 0,
          roiPercent: 0,
          lateAvoided: 0
        },
        capacityCounts: { 'surface-eco': 0, 'express-road': 0, 'air-priority': 0 }
      };
    }

    let totalSpend = 0;
    let baselineSpend = 0;
    let defaultTruckLateCount = 0;
    let optimizedLateCount = 0;
    let totalRerouted = 0;

    const capacityTracker = { 'surface-eco': 0, 'express-road': 0, 'air-priority': 0 };

    const processedShipments = shipments.map(order => {
      const billableWt = order.billableWeightKg || order.weightKg;

      const options = CARRIERS.map(c => {
        const shippingCost = (c.baseCostPerKg * billableWt) + (c.costPerKm * order.distanceKm);
        const deliveryTimeHours = order.distanceKm / c.speed;
        const isLate = deliveryTimeHours > order.targetHours;
        const hoursLate = isLate ? (deliveryTimeHours - order.targetHours) : 0;
        const delayRisk = Math.min(1.0, c.baseDelayProb * weatherCondition);
        const penaltyRisk = isLate ? (hoursLate * penaltyPerHour) : (delayRisk * penaltyPerHour * 0.5);
        const totalExpense = shippingCost + penaltyRisk;

        return {
          carrierId: c.id,
          carrierName: c.name,
          carrierShort: c.shortName,
          shippingCost,
          deliveryTimeHours,
          isLate,
          hoursLate,
          delayRisk,
          penaltyRisk,
          totalExpense
        };
      });

      const defaultSurface = options.find(o => o.carrierId === 'surface-eco');
      baselineSpend += defaultSurface.totalExpense;
      if (defaultSurface.isLate || defaultSurface.delayRisk > 0.35) {
        defaultTruckLateCount += 1;
      }

      let ranked = [...options].sort((a, b) => a.totalExpense - b.totalExpense);
      if (strategy === 'lowest_cost') {
        ranked = [...options].sort((a, b) => a.shippingCost - b.shippingCost);
      } else if (strategy === 'strict_sla') {
        const onTime = options.filter(o => !o.isLate);
        if (onTime.length > 0) {
          ranked = [...onTime].sort((a, b) => a.delayRisk - b.delayRisk);
        } else {
          ranked = [...options].sort((a, b) => a.hoursLate - b.hoursLate);
        }
      }

      const idealChoice = ranked[0];
      let chosenOpt = null;
      let isRerouted = false;

      for (const candidate of ranked) {
        const cDef = CARRIERS.find(c => c.id === candidate.carrierId);
        if (capacityTracker[candidate.carrierId] < cDef.maxCapacity) {
          chosenOpt = candidate;
          if (candidate.carrierId !== idealChoice.carrierId) {
            isRerouted = true;
            totalRerouted += 1;
          }
          break;
        }
      }

      if (!chosenOpt) {
        chosenOpt = ranked[0];
        isRerouted = true;
      }

      const assignedCarrierDef = CARRIERS.find(c => c.id === chosenOpt.carrierId);
      capacityTracker[chosenOpt.carrierId] += 1;

      totalSpend += chosenOpt.totalExpense;
      if (chosenOpt.isLate) {
        optimizedLateCount += 1;
      }

      let statusBadge = {
        label: 'On-Time',
        class: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
      };
      if (chosenOpt.isLate) {
        statusBadge = {
          label: `Late (+${chosenOpt.hoursLate.toFixed(1)}h)`,
          class: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
        };
      } else if (chosenOpt.delayRisk >= 0.25) {
        statusBadge = {
          label: 'Late Risk Warning',
          class: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
        };
      }

      let plainExplanation = '';
      if (chosenOpt.carrierId === 'air-priority') {
        if (defaultSurface.isLate) {
          plainExplanation = `Air Priority chosen because Surface Trucking would be ${defaultSurface.hoursLate.toFixed(1)} hours late, causing ${formatINR(defaultSurface.penaltyRisk)} in late risk penalty vs ${formatINR(chosenOpt.shippingCost)} Air fee.`;
        } else {
          plainExplanation = `Air Priority chosen for maximum delivery speed and zero late risk penalty.`;
        }
      } else if (chosenOpt.carrierId === 'express-road') {
        plainExplanation = `Express Road chosen as the optimal balance of delivery time (${chosenOpt.deliveryTimeHours.toFixed(1)} hrs) and delivery charges.`;
      } else {
        plainExplanation = `Surface Trucking chosen for lowest delivery charges while fully meeting the ${order.targetHours}-hour target delivery time.`;
      }

      return {
        ...order,
        options,
        assignedCarrier: assignedCarrierDef,
        assignedCalc: chosenOpt,
        statusBadge,
        isRerouted,
        plainExplanation,
        surfaceAlternative: defaultSurface
      };
    });

    const totalOrders = shipments.length;
    const totalWeight = shipments.reduce((sum, s) => sum + (s.billableWeightKg || s.weightKg), 0);
    const moneySaved = Math.max(0, baselineSpend - totalSpend);
    const roiPercent = totalSpend > 0 ? ((moneySaved / totalSpend) * 100).toFixed(1) : '0.0';
    const lateAvoided = Math.max(0, defaultTruckLateCount - optimizedLateCount);

    return {
      processedShipments,
      kpis: {
        totalOrders,
        totalWeight,
        totalSpend,
        baselineSpend,
        moneySaved,
        roiPercent,
        lateAvoided,
        totalRerouted
      },
      capacityCounts: capacityTracker
    };
  }, [shipments, strategy, penaltyPerHour, weatherCondition]);

  // Filtered shipments
  const filteredShipments = useMemo(() => {
    return processedData.processedShipments.filter(s => {
      const matchSearch = s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.city.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchRisk = true;
      if (riskFilter === 'LATE') matchRisk = s.assignedCalc.isLate;
      else if (riskFilter === 'REROUTED') matchRisk = s.isRerouted;
      else if (riskFilter === 'AIR') matchRisk = s.assignedCarrier.id === 'air-priority';

      return matchSearch && matchRisk;
    });
  }, [processedData.processedShipments, searchQuery, riskFilter]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Shipment ID',
      'Origin Hub',
      'Destination',
      'Distance (km)',
      'Actual Weight (kg)',
      'Billable Weight (kg)',
      'Order Value (₹)',
      'Target Delivery Time (hrs)',
      'Assigned Partner',
      'Delivery Charges (₹)',
      'Late Risk Penalty (₹)',
      'Total Estimated Cost (₹)',
      'Status'
    ];

    const rows = processedData.processedShipments.map(s => [
      s.id,
      '"Delhi NCR Hub"',
      `"${s.city}"`,
      s.distanceKm,
      s.weightKg,
      (s.billableWeightKg || s.weightKg),
      s.orderValue,
      s.targetHours,
      `"${s.assignedCarrier.name}"`,
      s.assignedCalc.shippingCost.toFixed(2),
      s.assignedCalc.penaltyRisk.toFixed(2),
      s.assignedCalc.totalExpense.toFixed(2),
      s.statusBadge.label
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ShipOptima_Shipment_List_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedItem = useMemo(() => {
    if (!selectedShipment) return null;
    return processedData.processedShipments.find(s => s.id === selectedShipment.id) || selectedShipment;
  }, [selectedShipment, processedData.processedShipments]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased pb-16 transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Bar - Clean Modern Enterprise Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Hub Badge */}
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">ShipOptima</h1>
                <span className="px-2 py-0.5 text-[11px] font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-md">
                  Delivery Cost Optimizer
                </span>
                {isOptimizing && (
                  <span className="flex items-center space-x-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-medium animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Optimizing...</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 inline" />
                <span>Central Hub: <strong>Delhi NCR</strong> (28.6139° N, 77.2090° E)</span>
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-1 md:pb-0">
            
            {/* Theme Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setTheme('light')}
                title="Light Mode"
                className={`px-2 py-1 rounded-md flex items-center space-x-1 transition-colors ${
                  theme === 'light'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Light</span>
              </button>

              <button
                onClick={() => setTheme('dark')}
                title="Dark Mode"
                className={`px-2 py-1 rounded-md flex items-center space-x-1 transition-colors ${
                  theme === 'dark'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dark</span>
              </button>

              <button
                onClick={() => setTheme('system')}
                title="System Preference Mode"
                className={`px-2 py-1 rounded-md flex items-center space-x-1 transition-colors ${
                  theme === 'system'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">System</span>
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm rounded-lg shadow-sm transition-all duration-150 active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Shipment</span>
            </button>

            <button
              onClick={handleGenerate25}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 shadow-2xs transition-colors shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">+ 25 Shipments</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 shadow-2xs transition-colors shrink-0"
              title="Download Shipment List as CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>

        </div>
      </header>

      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2.5 rounded-lg shadow-lg font-medium text-xs flex items-center space-x-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* Executive KPI Cards Summary */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Active Shipments */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs transition-colors">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Shipments</span>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{processedData.kpis.totalOrders}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">shipments</span>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2">
              Billable Weight: <strong className="text-slate-800 dark:text-slate-200">{processedData.kpis.totalWeight.toFixed(1)} kg</strong>
            </p>
          </div>

          {/* Card 2: Total Delivery Charges */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs transition-colors">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Delivery Charges</span>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatINR(processedData.kpis.totalSpend)}</span>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 flex items-center justify-between">
              <span>Unoptimized: <span className="line-through">{formatINR(processedData.kpis.baselineSpend)}</span></span>
            </p>
          </div>

          {/* Card 3: Net Money Saved */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs transition-colors">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Money Saved vs Default</span>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">+{formatINR(processedData.kpis.moneySaved)}</span>
              <span className="px-1.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded">
                +{processedData.kpis.roiPercent}% ROI
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2">
              Saved vs standard ground trucking
            </p>
          </div>

          {/* Card 4: Late Deliveries Avoided */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs transition-colors">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Late Deliveries Avoided</span>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{processedData.kpis.lateAvoided}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">deliveries saved</span>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 flex items-center justify-between">
              <span>Rerouted: <strong className="text-amber-600 dark:text-amber-400">{processedData.kpis.totalRerouted}</strong></span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Delivery Time Protected</span>
            </p>
          </div>

        </section>

        {/* Middle Main Content Grid */}
        <div className="lg:grid lg:grid-cols-12 gap-6">

          {/* Left Column (Controls & Capacity) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Business Decision Controls */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-5 transition-colors">
              
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Optimization Settings</h2>
              </div>

              {/* Delivery Priority */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Delivery Priority</label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handleStrategyChange('balanced')}
                    className={`p-3 rounded-lg border text-left text-xs transition-all ${
                      strategy === 'balanced'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-950 dark:bg-indigo-950/60 dark:border-indigo-500 dark:text-indigo-100 font-semibold shadow-2xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Balanced Total Cost</span>
                      {strategy === 'balanced' && <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-normal">Shipping Fee + Late Risk Penalty</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStrategyChange('strict_sla')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      strategy === 'strict_sla'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-950 dark:bg-indigo-950/60 dark:border-indigo-500 dark:text-indigo-100 font-semibold shadow-2xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Strict SLA Protection</span>
                      {strategy === 'strict_sla' && <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-normal">Prioritizes On-Time Arrival above cost</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStrategyChange('lowest_cost')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      strategy === 'lowest_cost'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-950 dark:bg-indigo-950/60 dark:border-indigo-500 dark:text-indigo-100 font-semibold shadow-2xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Lowest Shipping Fee</span>
                      {strategy === 'lowest_cost' && <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-normal">Minimizes shipping fees strictly</p>
                  </button>
                </div>
              </div>

              {/* Late Penalty Slider */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-xs">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Late Penalty per Hour</label>
                  <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">₹{penaltyPerHour}/hr</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="2000"
                  step="50"
                  value={penaltyPerHour}
                  onChange={(e) => handlePenaltyChange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span>₹150/hr (Standard)</span>
                  <span>₹2,000/hr (Strict Commercial SLA)</span>
                </div>
              </div>

              {/* Weather / Traffic Condition Slider */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-xs">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Monsoon & Traffic Risk</label>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">{weatherCondition.toFixed(1)}x Risk</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.1"
                  value={weatherCondition}
                  onChange={(e) => handleWeatherChange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span>1.0x (Normal Clear)</span>
                  <span>2.5x (Severe Monsoon Surge)</span>
                </div>
              </div>

            </div>

            {/* Fleet Capacity Status Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Fleet Capacity Limits</span>
                </h3>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  Live Slots
                </span>
              </div>

              <div className="space-y-3">
                {CARRIERS.map(c => {
                  const used = processedData.capacityCounts[c.id] || 0;
                  const pct = Math.min(100, Math.round((used / c.maxCapacity) * 100));
                  const isFull = used >= c.maxCapacity;

                  return (
                    <div key={c.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-800 dark:text-slate-200">{c.shortName}</span>
                        <span className={`font-mono ${isFull ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                          {used} / {c.maxCapacity} slots ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${isFull ? 'bg-rose-500' : c.barColor} transition-all duration-200`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </aside>

          {/* Right Column (Shipment List Table) */}
          <section className="lg:col-span-8 space-y-4">
            
            {/* Search & Filter Header */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by Order ID or City (e.g. Mumbai, ORD-IN-105)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex items-center space-x-1 text-xs">
                {['ALL', 'LATE', 'AIR', 'REROUTED'].map(f => (
                  <button
                    key={f}
                    onClick={() => setRiskFilter(f)}
                    className={`px-3 py-1.5 rounded-md font-medium text-xs transition-colors ${
                      riskFilter === f
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Shipment List Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs overflow-hidden transition-colors">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <th className="py-3 px-4">Order ID & Destination</th>
                      <th className="py-3 px-4">Distance & Weight</th>
                      <th className="py-3 px-4">Delivery SLA</th>
                      <th className="py-3 px-4">Assigned Partner</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Estimated Expense</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {filteredShipments.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-8 text-center text-slate-400 dark:text-slate-500">
                          No shipments in list match your current search or filter.
                        </td>
                      </tr>
                    ) : (
                      filteredShipments.map(order => {
                        const assigned = order.assignedCarrier;
                        const calc = order.assignedCalc;
                        const CarrierIcon = assigned.icon;

                        return (
                          <tr
                            key={order.id}
                            onClick={() => setSelectedShipment(order)}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                          >
                            {/* Order ID & Destination */}
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 font-mono transition-colors">
                                {order.id}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[160px]">
                                {order.city}
                              </div>
                            </td>

                            {/* Distance & Billable Weight */}
                            <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                              <div>{order.distanceKm} km</div>
                              <div className="text-[11px] text-slate-400 dark:text-slate-500">
                                {(order.billableWeightKg || order.weightKg)} kg billable
                              </div>
                            </td>

                            {/* Delivery SLA */}
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded text-[11px] font-mono">
                                <Clock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                                <span>{order.targetHours}h SLA</span>
                              </span>
                            </td>

                            {/* Assigned Partner Pill */}
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md border text-xs font-medium ${assigned.badgeBg}`}>
                                <CarrierIcon className="w-3.5 h-3.5" />
                                <span>{assigned.shortName}</span>
                              </span>
                            </td>

                            {/* Status Badge */}
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-medium ${order.statusBadge.class}`}>
                                {order.statusBadge.label}
                              </span>
                            </td>

                            {/* Total Estimated Expense */}
                            <td className="py-3 px-4 text-right font-mono">
                              <div className="font-bold text-slate-900 dark:text-slate-100">{formatINR(calc.totalExpense)}</div>
                              <div className="text-[10px] text-slate-400 dark:text-slate-500">Shipping Fee: {formatINR(calc.shippingCost)}</div>
                            </td>

                            {/* View Action Button */}
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedShipment(order);
                                }}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </section>

        </div>

      </main>

      {/* New Custom Shipment Modal with Autocomplete Suggestions Dropdown & Volumetric Weight */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150 my-6 transition-colors">
            
            {/* Modal Header */}
            <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Schedule Custom Shipment</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Autocomplete Geocoding & Volumetric Billing Engine</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-6 space-y-5">
              
              {/* Destination City Input with Autocomplete Suggestions Dropdown */}
              <div className="space-y-1.5 relative" ref={dropdownRef}>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Destination City / Town in India</span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-normal">Delhi Hub Origin</span>
                </label>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type city or town (e.g. Pune, Jaipur, Nagpur, Patna)..."
                    value={citySearchInput}
                    onChange={(e) => {
                      setCitySearchInput(e.target.value);
                      if (geocodedResult) setGeocodedResult(null);
                    }}
                    className="w-full pl-9 pr-10 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  
                  {isGeocoding && (
                    <Loader2 className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-600 dark:text-indigo-400 animate-spin" />
                  )}

                  {citySearchInput && !isGeocoding && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sleek Autocomplete Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl overflow-hidden max-h-56 overflow-y-auto animate-in fade-in duration-100">
                    {suggestions.length > 0 ? (
                      suggestions.map((item, idx) => {
                        const mainTitle = item.name || item.display_name.split(',')[0];
                        const subTitle = item.display_name.split(',').slice(1, 3).join(', ');

                        return (
                          <div
                            key={item.place_id || idx}
                            onClick={() => handleSelectSuggestion(item)}
                            className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer border-b border-slate-100 dark:border-slate-800/60 last:border-0 text-left transition-colors flex items-start space-x-2"
                          >
                            <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                            <div>
                              <div className="font-bold text-xs text-slate-800 dark:text-slate-100">
                                {mainTitle}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                {subTitle || item.display_name}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-3 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                        No matching locations found in India
                      </div>
                    )}
                  </div>
                )}

                {/* Confirmed Geocoding Badge */}
                {geocodedResult && (
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-900 dark:text-emerald-300 flex items-center space-x-2 animate-in fade-in duration-150">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold">{geocodedResult.shortName}</span>
                      <span className="text-emerald-700 dark:text-emerald-400 ml-1">({geocodedResult.displayName.split(',').slice(-2).join(',')})</span>
                      <div className="font-mono font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
                        📍 {geocodedResult.calculatedKm} km from Delhi Hub
                      </div>
                    </div>
                  </div>
                )}

                {/* Inline Error Alert */}
                {geocodingError && !isDropdownOpen && (
                  <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-800 dark:text-rose-300 flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>Location not found in India. Please check spelling.</span>
                  </div>
                )}
              </div>

              {/* Weight & Volumetric Dimensions */}
              <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Actual Weight</label>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{customWeightKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="35.0"
                    step="0.5"
                    value={customWeightKg}
                    onChange={(e) => setCustomWeightKg(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Add Dimensions Toggle */}
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                  <label htmlFor="dim-toggle" className="flex items-center space-x-2 cursor-pointer">
                    <Box className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-medium text-slate-800 dark:text-slate-200">Add Package Dimensions (Volumetric Weight)</span>
                  </label>
                  <input
                    id="dim-toggle"
                    type="checkbox"
                    checked={hasCustomDimensions}
                    onChange={(e) => setHasCustomDimensions(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                {/* Dimension Inputs */}
                {hasCustomDimensions && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2 animate-in fade-in duration-150">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold uppercase">Length (cm)</label>
                        <input
                          type="number"
                          min="1"
                          value={lengthCm}
                          onChange={(e) => setLengthCm(Number(e.target.value))}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-slate-100 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold uppercase">Width (cm)</label>
                        <input
                          type="number"
                          min="1"
                          value={widthCm}
                          onChange={(e) => setWidthCm(Number(e.target.value))}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-slate-100 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold uppercase">Height (cm)</label>
                        <input
                          type="number"
                          min="1"
                          value={heightCm}
                          onChange={(e) => setHeightCm(Number(e.target.value))}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-slate-100 font-mono"
                        />
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 pt-1 flex justify-between">
                      <span>Volumetric Weight: <strong>{customVolumetricWeightKg} kg</strong></span>
                      <span>Billable Weight: <strong className="text-indigo-600 dark:text-indigo-400">{customBillableWeightKg} kg</strong></span>
                    </div>
                  </div>
                )}
              </div>

              {/* SLA Target Hours */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Delivery Target SLA</label>
                <div className="grid grid-cols-4 gap-2">
                  {[6, 12, 24, 48].map(hrs => (
                    <button
                      key={hrs}
                      type="button"
                      onClick={() => setCustomTargetHours(hrs)}
                      className={`py-2 rounded-lg border text-xs font-mono font-bold transition-colors ${
                        customTargetHours === hrs
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {hrs} Hours
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-time Comparative Box */}
              {sandboxCalculations && (
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 space-y-2">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex justify-between">
                    <span>Carrier Comparison</span>
                    <span className="text-indigo-600 dark:text-indigo-400">Recommended: {sandboxCalculations.bestChoice.carrierName}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    {sandboxCalculations.options.map(opt => {
                      const isWinner = opt.carrierId === sandboxCalculations.bestChoice.carrierId;
                      return (
                        <div
                          key={opt.carrierId}
                          className={`p-2.5 rounded-lg border text-left ${
                            isWinner
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-950 dark:text-indigo-100 font-bold'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="text-[11px] font-sans text-slate-900 dark:text-slate-100">{opt.carrierName.split(' ')[0]}</div>
                          <div className="text-indigo-700 dark:text-indigo-300">{formatINR(opt.totalExpense)}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">{opt.deliveryTimeHours.toFixed(1)} hrs</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Plain English Formula in Modal */}
                  <div className="pt-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 text-center">
                    Total Cost = Delivery Fee + Late Risk Penalty
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 dark:bg-slate-950 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomShipment}
                disabled={!geocodedResult || isGeocoding}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
              >
                Add to Scheduled Dispatch
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Order Details Drawer with Route Corridor & Stacked Bar Breakdown */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-xs flex justify-end">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full h-full shadow-2xl overflow-y-auto p-6 space-y-6 animate-in slide-in-from-right duration-200 transition-colors">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">{selectedItem.id}</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Shipment Details & Decision Breakdown</h3>
              </div>
              <button onClick={() => setSelectedShipment(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual Route Corridor Element */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                <span>Visual Transport Corridor</span>
                <span>{selectedItem.distanceKm} km</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-slate-100">
                <div className="flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Delhi Hub</span>
                </div>
                <div className="flex-1 flex items-center justify-center mx-3 space-x-1 text-slate-400 font-mono text-[11px]">
                  <span>─────</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{selectedItem.cityNameOnly || selectedItem.city.split(',')[0]}</span>
                </div>
              </div>
            </div>

            {/* Optimal Carrier Rationale Box */}
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-xl space-y-2">
              <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Optimal Carrier Rationale</span>
              </div>
              <p className="text-xs text-indigo-950 dark:text-indigo-100 leading-relaxed font-medium">
                {selectedItem.plainExplanation}
              </p>
            </div>

            {/* Order Specification List including Volumetric & Billable Weight */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                <span className="text-slate-500 dark:text-slate-400 font-sans">Destination:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedItem.city}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                <span className="text-slate-500 dark:text-slate-400 font-sans">Weight Billing:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  Billable: {selectedItem.billableWeightKg || selectedItem.weightKg} kg
                  {selectedItem.volumetricWeightKg ? ` (Actual: ${selectedItem.weightKg}kg | Vol: ${selectedItem.volumetricWeightKg}kg)` : ` (Actual: ${selectedItem.weightKg}kg)`}
                </span>
              </div>
              {selectedItem.lengthCm && (
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                  <span className="text-slate-500 dark:text-slate-400 font-sans">Dimensions (L×W×H):</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {selectedItem.lengthCm} × {selectedItem.widthCm} × {selectedItem.heightCm} cm
                  </span>
                </div>
              )}
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                <span className="text-slate-500 dark:text-slate-400 font-sans">Order Value:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{formatINR(selectedItem.orderValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-sans">Target Delivery SLA:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedItem.targetHours} Hours Target</span>
              </div>
            </div>

            {/* Visual Stacked Bar Breakdown & Partner Comparison Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Partner Cost & Stacked Breakdown</h4>
              
              <div className="space-y-3 border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900">
                {selectedItem.options.map(opt => {
                  const isWinner = opt.carrierId === selectedItem.assignedCarrier.id;
                  const total = Math.max(1, opt.totalExpense);
                  const freightPct = Math.round((opt.shippingCost / total) * 100);
                  const penaltyPct = Math.round((opt.penaltyRisk / total) * 100);

                  return (
                    <div key={opt.carrierId} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-sans font-semibold text-slate-800 dark:text-slate-200">
                          {opt.carrierShort} {isWinner && <strong className="text-indigo-600 dark:text-indigo-400">(Selected)</strong>}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{formatINR(opt.totalExpense)}</span>
                      </div>

                      {/* Stacked Cost Bar */}
                      <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                        <div
                          className="h-full bg-indigo-600 transition-all duration-200"
                          style={{ width: `${freightPct}%` }}
                          title={`Base Fee: ${formatINR(opt.shippingCost)}`}
                        />
                        <div
                          className="h-full bg-rose-500 transition-all duration-200"
                          style={{ width: `${penaltyPct}%` }}
                          title={`Late Risk Penalty: ${formatINR(opt.penaltyRisk)}`}
                        />
                      </div>

                      <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span>
                          <span>Base Fee: {formatINR(opt.shippingCost)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                          <span>Late Risk: {formatINR(opt.penaltyRisk)}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Plain English Formula Breakdown */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">Cost Calculation Model</div>
              <div className="font-mono text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-center font-bold text-indigo-600 dark:text-indigo-400 pb-1 border-b border-slate-100 dark:border-slate-800">
                  Total Cost = Delivery Fee + Late Risk Penalty
                </div>
                <div className="pt-1">
                  • Delivery Fee: {formatINR(selectedItem.assignedCalc.shippingCost)}<br />
                  • Late Risk Penalty: {formatINR(selectedItem.assignedCalc.penaltyRisk)}<br />
                  • <strong>Total Estimated Cost: {formatINR(selectedItem.assignedCalc.totalExpense)}</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedShipment(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
