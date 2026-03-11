import React, { useState, useEffect, useCallback, useRef } from 'react';
import SEO from '../components/SEO';
import { Calculator, RotateCcw, Share2, TrendingUp, Fuel, PoundSterling, Clock, Percent, CheckCircle, Circle } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../components/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

const splitText = (text: string, className: string = '') => {
  return text.split(' ').map((word, index) => (
    <span key={index} className="inline-block overflow-hidden pb-4 -mb-4 mr-[0.25em]">
      <span className={`inline-block word-reveal ${className}`}>{word}</span>
    </span>
  ));
};

interface CalculatorInputs {
  annualMileage: number;
  baselineMPG: number;
  mpgDropPercent: number;
  fuelPrice: number;
  numberOfVehicles: number;
  includeLabour: boolean;
  autoAdjustClog: boolean;
  userLockedClog: boolean;
}

interface ConfirmationState {
  vehicleType: boolean;
  serviceArea: boolean;
  annualMileage: boolean;
  baselineMPG: boolean;
  mpgDrop: boolean;
  fuelPrice: boolean;
  numberOfVehicles: boolean;
  labourCosts: boolean;
  cleaningCost: number;
}

interface ServicePricing {
  cleaningCost: number;
  labourCost: number;
}

type VehicleType = 'car' | 'van' | 'hgv' | 'plant';

interface VehicleTypeConfig {
  label: string;
  defaults: CalculatorInputs;
  displayText: string;
  pricing: {
    inside30Miles: ServicePricing;
    outside30Miles: ServicePricing;
  };
}

const FuelSavingsCalculator = () => {
  const container = useRef(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>('van');
  const [isInside30Miles, setIsInside30Miles] = useState(true);

  useGSAP(() => {
    gsap.fromTo('.word-reveal',
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1, stagger: 0.05, ease: 'power4.out', delay: 0.1 }
    );

    gsap.utils.toArray('.reveal-container').forEach((container: any) => {
      const items = container.querySelectorAll('.reveal-item');
      gsap.fromTo(items,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
          }
        }
      );
    });
  }, { scope: container });

  const [confirmationState, setConfirmationState] = useState<ConfirmationState>({
    vehicleType: false,
    serviceArea: false,
    annualMileage: false,
    baselineMPG: false,
    mpgDrop: false,
    fuelPrice: false,
    numberOfVehicles: false,
    labourCosts: false,
    cleaningCost: 0,
  });

  const [showResults, setShowResults] = useState(false);

  const vehicleTypeConfigs: Record<VehicleType, VehicleTypeConfig> = {
    car: {
      label: 'Cars',
      defaults: {
        annualMileage: 20000,
        baselineMPG: 45,
        mpgDropPercent: 3,
        fuelPrice: 1.42,
        numberOfVehicles: 10,
        includeLabour: false,
        autoAdjustClog: false,
        userLockedClog: false,
      },
      displayText: '👉 Overall UK diesel car average: ~45 MPG',
      pricing: {
        inside30Miles: { cleaningCost: 210, labourCost: 200 },
        outside30Miles: { cleaningCost: 230, labourCost: 200 },
      }
    },
    van: {
      label: 'Vans',
      defaults: {
        annualMileage: 22000,
        baselineMPG: 30,
        mpgDropPercent: 3,
        fuelPrice: 1.42,
        numberOfVehicles: 10,
        includeLabour: false,
        autoAdjustClog: false,
        userLockedClog: false,
      },
      displayText: '👉 Fleets average for mixed van fleets: ~28–32 MPG loaded',
      pricing: {
        inside30Miles: { cleaningCost: 210, labourCost: 250 },
        outside30Miles: { cleaningCost: 230, labourCost: 250 },
      }
    },
    hgv: {
      label: 'HGVs',
      defaults: {
        annualMileage: 80000,
        baselineMPG: 8,
        mpgDropPercent: 3,
        fuelPrice: 1.42,
        numberOfVehicles: 10,
        includeLabour: false,
        autoAdjustClog: false,
        userLockedClog: false,
      },
      displayText: '👉 UK fleet average for large HGVs: ~8 MPG',
      pricing: {
        inside30Miles: { cleaningCost: 320, labourCost: 600 },
        outside30Miles: { cleaningCost: 320, labourCost: 600 },
      }
    },
    plant: {
      label: 'Plant',
      defaults: {
        annualMileage: 10000,
        baselineMPG: 4.5,
        mpgDropPercent: 3,
        fuelPrice: 1.42,
        numberOfVehicles: 10,
        includeLabour: false,
        autoAdjustClog: false,
        userLockedClog: false,
      },
      displayText: '👉 A safe "average baseline" for mixed plant fleets: ~4–5 MPG equivalent',
      pricing: {
        inside30Miles: { cleaningCost: 320, labourCost: 700 },
        outside30Miles: { cleaningCost: 320, labourCost: 700 },
      }
    }
  };

  const [inputs, setInputs] = useState<CalculatorInputs>({
    ...vehicleTypeConfigs[selectedVehicleType].defaults
  });

  const [results, setResults] = useState({
    healthyFuelCostPerVehicle: 0,
    cloggedFuelCostPerVehicle: 0,
    extraFuelCostPerVehicle: 0,
    totalServiceCostPerVehicle: 0,
    netSavingsPerVehicle: 0,
    paybackMonths: 0,
    totalFleetHealthyFuelCost: 0,
    totalFleetCloggedFuelCost: 0,
    totalFleetExtraFuelCost: 0,
    totalFleetServiceCost: 0,
    totalFleetNetSavings: 0,
    fleetDiscount: 0,
  });

  // Update URL with current inputs
  const updateURL = useCallback((currentInputs: CalculatorInputs) => {
    const params = new URLSearchParams();
    params.set('type', selectedVehicleType);
    params.set('inside', isInside30Miles.toString());
    params.set('mileage', currentInputs.annualMileage.toString());
    params.set('mpg', currentInputs.baselineMPG.toString());
    params.set('drop', currentInputs.mpgDropPercent.toString());
    params.set('price', currentInputs.fuelPrice.toString());
    params.set('vehicles', currentInputs.numberOfVehicles.toString());
    params.set('labour', currentInputs.includeLabour.toString());

    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newURL);
  }, [selectedVehicleType, isInside30Miles]);

  // Calculate results
  const calculateResults = useCallback(() => {
    const currentInputs = inputs;
    const { annualMileage, baselineMPG, mpgDropPercent, fuelPrice, numberOfVehicles, includeLabour } = currentInputs;

    // Validation
    if (baselineMPG <= 0 || fuelPrice <= 0 || numberOfVehicles <= 0) {
      setResults({
        healthyFuelCostPerVehicle: 0,
        cloggedFuelCostPerVehicle: 0,
        extraFuelCostPerVehicle: 0,
        totalServiceCostPerVehicle: 0,
        netSavingsPerVehicle: 0,
        paybackMonths: 0,
        totalFleetHealthyFuelCost: 0,
        totalFleetCloggedFuelCost: 0,
        totalFleetExtraFuelCost: 0,
        totalFleetServiceCost: 0,
        totalFleetNetSavings: 0,
        fleetDiscount: 0,
      });
      return;
    }

    // Calculate reduced MPG
    const reducedMPG = baselineMPG * (1 - mpgDropPercent / 100);

    // Calculate gallons used per year (UK gallons)
    const healthyGallonsPerYear = annualMileage / baselineMPG;
    const cloggedGallonsPerYear = annualMileage / reducedMPG;

    // Calculate fuel costs (UK gallons = 4.546 litres)
    const healthyLitresPerYear = healthyGallonsPerYear * 4.546;
    const cloggedLitresPerYear = cloggedGallonsPerYear * 4.546;

    const healthyFuelCostPerVehicle = healthyLitresPerYear * fuelPrice;
    const cloggedFuelCostPerVehicle = cloggedLitresPerYear * fuelPrice;
    const extraFuelCostPerVehicle = cloggedFuelCostPerVehicle - healthyFuelCostPerVehicle;

    // Get service pricing
    const pricing = isInside30Miles
      ? vehicleTypeConfigs[selectedVehicleType].pricing.inside30Miles
      : vehicleTypeConfigs[selectedVehicleType].pricing.outside30Miles;

    const totalServiceCostPerVehicle = pricing.cleaningCost + (includeLabour ? pricing.labourCost : 0);

    // Calculate fleet discount (10% for 10+ vehicles)
    const fleetDiscount = numberOfVehicles >= 10 ? 0.1 : 0;
    const discountedServiceCostPerVehicle = totalServiceCostPerVehicle * (1 - fleetDiscount);

    // Calculate net savings and payback
    const netSavingsPerVehicle = Math.max(0, extraFuelCostPerVehicle - discountedServiceCostPerVehicle);
    const paybackMonths = extraFuelCostPerVehicle > 0 ? (discountedServiceCostPerVehicle / extraFuelCostPerVehicle) * 12 : 0;

    // Fleet totals
    const totalFleetHealthyFuelCost = healthyFuelCostPerVehicle * numberOfVehicles;
    const totalFleetCloggedFuelCost = cloggedFuelCostPerVehicle * numberOfVehicles;
    const totalFleetExtraFuelCost = extraFuelCostPerVehicle * numberOfVehicles;
    const totalFleetServiceCost = discountedServiceCostPerVehicle * numberOfVehicles;
    const totalFleetNetSavings = netSavingsPerVehicle * numberOfVehicles;

    setResults({
      healthyFuelCostPerVehicle: Math.max(0, healthyFuelCostPerVehicle),
      cloggedFuelCostPerVehicle: Math.max(0, cloggedFuelCostPerVehicle),
      extraFuelCostPerVehicle: Math.max(0, extraFuelCostPerVehicle),
      totalServiceCostPerVehicle: discountedServiceCostPerVehicle,
      netSavingsPerVehicle: netSavingsPerVehicle,
      paybackMonths: Math.max(0, paybackMonths),
      totalFleetHealthyFuelCost,
      totalFleetCloggedFuelCost,
      totalFleetExtraFuelCost,
      totalFleetServiceCost,
      totalFleetNetSavings,
      fleetDiscount,
    });

    setShowResults(true);
    updateURL(inputs);
  }, [inputs, selectedVehicleType, isInside30Miles]);

  // Load inputs from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vehicleType = (params.get('type') as VehicleType) || 'van';
    const inside = params.get('inside') !== 'false';

    setSelectedVehicleType(vehicleType);
    setIsInside30Miles(inside);

    const urlInputs = {
      annualMileage: Math.min(100000, Math.max(1000, parseInt(params.get('mileage') || vehicleTypeConfigs[vehicleType].defaults.annualMileage.toString()))),
      baselineMPG: Math.min(50, Math.max(1, parseFloat(params.get('mpg') || vehicleTypeConfigs[vehicleType].defaults.baselineMPG.toString()))),
      mpgDropPercent: Math.min(30, Math.max(1, parseFloat(params.get('drop') || vehicleTypeConfigs[vehicleType].defaults.mpgDropPercent.toString()))),
      fuelPrice: Math.min(5, Math.max(0.5, parseFloat(params.get('price') || vehicleTypeConfigs[vehicleType].defaults.fuelPrice.toString()))),
      numberOfVehicles: Math.min(100, Math.max(1, parseInt(params.get('vehicles') || vehicleTypeConfigs[vehicleType].defaults.numberOfVehicles.toString()))),
      includeLabour: params.get('labour') === 'true',
      autoAdjustClog: false,
      userLockedClog: false,
    };

    setInputs(urlInputs);
  }, []);

  // Handle input changes
  const handleInputChange = (field: keyof CalculatorInputs, value: number | boolean) => {
    const newInputs = { ...inputs, [field]: value };
    setInputs(newInputs);
  };

  // Handle service area change
  const handleServiceAreaChange = (inside: boolean) => {
    setIsInside30Miles(inside);
  };

  // Reset to defaults
  const resetToDefaults = () => {
    const defaultInputs = {
      ...vehicleTypeConfigs[selectedVehicleType].defaults,
      userLockedClog: false, // Reset user lock when resetting
    };
    setInputs(defaultInputs);
    setShowResults(false);
  };

  // Handle vehicle type change
  const handleVehicleTypeChange = (vehicleType: VehicleType) => {
    setSelectedVehicleType(vehicleType);
    const newInputs = {
      ...vehicleTypeConfigs[vehicleType].defaults,
      autoAdjustClog: false,
      userLockedClog: false,
    };
    setInputs(newInputs);
  };

  // Share URL
  const shareCalculation = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div ref={container} className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO title="Fuel Savings Calculator | DPF Performance" description="Calculate how much a clean DPF can save you in improved MPG and performance." path="/calculator" />

      {/* Background ambient light */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 reveal-container">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
            {splitText('DPF Fuel Savings', 'text-white')}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
              <span className="inline-block word-reveal text-[#FF7A00] ml-3">Calculator.</span>
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mb-8 rounded-full"></div>
          <div className="max-w-4xl mx-auto reveal-item">
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-medium">
              Calculate the real financial impact of clogged DPF filters on your fleet.
              See exactly how much you could save with regular professional cleaning.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 reveal-container">
          {/* Calculator Inputs */}
          <div className="relative p-8 md:p-10 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item shadow-xl shadow-black overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-8 relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center tracking-tight">
                <Calculator size={28} className="mr-4 text-[#FF7A00]" />
                Fleet Parameters
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={shareCalculation}
                  className="btn-secondary text-white hover:text-white px-3 py-2 rounded-lg text-sm"
                  title="Share calculation"
                >
                  <Share2 size={16} />
                </button>
                <button
                  onClick={resetToDefaults}
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all px-3 py-3 rounded-xl text-sm"
                  title="Reset to defaults"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Annual Mileage */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Annual Mileage per Vehicle: {inputs.annualMileage.toLocaleString()} miles
                </label>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={inputs.annualMileage}
                  onChange={(e) => handleInputChange('annualMileage', parseInt(e.target.value))}
                  className="w-full h-2 bg-[#1A1D22] rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-white/60 text-sm mt-1">
                  <span>1,000</span>
                  <span>100,000</span>
                </div>
              </div>

              {/* Number of Vehicles */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Number of Vehicles in Fleet: {inputs.numberOfVehicles}
                  {inputs.numberOfVehicles >= 10 && (
                    <span className="text-[#FF7A00] text-sm ml-2">(10% fleet discount applies!)</span>
                  )}
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={inputs.numberOfVehicles}
                  onChange={(e) => handleInputChange('numberOfVehicles', parseInt(e.target.value))}
                  className="w-full h-2 bg-[#1A1D22] rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-white/60 text-sm mt-1">
                  <span>1</span>
                  <span>100</span>
                </div>
              </div>

              {/* Vehicle Type Selector */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Vehicle Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  {Object.entries(vehicleTypeConfigs).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => handleVehicleTypeChange(key as VehicleType)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedVehicleType === key
                        ? 'bg-[#FF7A00] text-white'
                        : 'bg-[#1A1D22] text-white/80 hover:bg-[#FF7A00]/20'
                        }`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
                <p className="text-[#FF7A00] text-sm font-medium">
                  {vehicleTypeConfigs[selectedVehicleType].displayText}
                </p>
              </div>

              {/* Service Area Toggle */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Service Area
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleServiceAreaChange(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isInside30Miles
                      ? 'bg-[#FF7A00] text-white'
                      : 'bg-[#1A1D22] text-white/80 hover:bg-[#FF7A00]/20'
                      }`}
                  >
                    Within 30 miles of Totnes
                  </button>
                  <button
                    onClick={() => handleServiceAreaChange(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!isInside30Miles
                      ? 'bg-[#FF7A00] text-white'
                      : 'bg-[#1A1D22] text-white/80 hover:bg-[#FF7A00]/20'
                      }`}
                  >
                    Outside 30 miles
                  </button>
                </div>
              </div>

              {/* Baseline MPG */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Baseline (UK): {inputs.baselineMPG} MPG
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="0.5"
                  value={inputs.baselineMPG}
                  onChange={(e) => handleInputChange('baselineMPG', parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#1A1D22] rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-white/60 text-sm mt-1">
                  <span>1 mpg</span>
                  <span>50 mpg</span>
                </div>
              </div>

              {/* MPG Drop Percent */}
              <div>
                <label className="block text-white font-medium mb-3">
                  MPG Drop from Clogged DPF: {inputs.mpgDropPercent}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={inputs.mpgDropPercent}
                  onChange={(e) => handleInputChange('mpgDropPercent', parseInt(e.target.value))}
                  className="w-full h-2 bg-[#1A1D22] rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-white/60 text-sm mt-1">
                  <span>1%</span>
                  <span>30%</span>
                </div>
              </div>

              {/* Fuel Price */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Fuel Price per Litre
                </label>
                <div className="relative">
                  <PoundSterling size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                  <input
                    type="number"
                    min="0.5"
                    max="5"
                    step="0.01"
                    value={inputs.fuelPrice}
                    onChange={(e) => handleInputChange('fuelPrice', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1A1D22] border border-[#1A1D22] focus:border-[#FF7A00] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 transition-all"
                    placeholder="1.42"
                  />
                </div>
              </div>

              {/* Include Labour Toggle */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Include Labour Costs
                </label>
                <div className="gradient-card rounded-xl p-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={inputs.includeLabour}
                        onChange={(e) => handleInputChange('includeLabour', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-300 ${inputs.includeLabour
                        ? 'bg-[#FF7A00] border-[#FF7A00]'
                        : 'bg-[#1A1D22] border-[#1A1D22] hover:border-[#FF7A00]/50'
                        }`}>
                        {inputs.includeLabour && (
                          <svg className="w-4 h-4 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-white font-medium">
                      Include labour costs for removal/refit
                    </span>
                  </label>
                </div>
                <p className="text-white/60 text-sm mt-2">
                  Optional: Add estimated labour costs for DPF removal and refitting
                </p>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="mt-10 pt-8 border-t border-white/10 relative z-10">
              <button
                onClick={calculateResults}
                className="w-full bg-[#FF7A00] hover:bg-[#FF9500] text-black px-6 py-5 rounded-xl font-bold text-lg flex items-center justify-center transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)]"
              >
                <Calculator size={24} className="mr-3" />
                Calculate Savings
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-8 reveal-item">
            {!showResults && (
              <div className="relative p-8 md:p-10 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 flex items-center justify-center min-h-[400px] shadow-xl shadow-black overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-50 pointer-events-none"></div>
                <div className="text-center relative z-10 p-8 rounded-3xl bg-white/5 border border-white/5">
                  <div className="w-20 h-20 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mx-auto mb-6">
                    <Calculator size={36} className="text-[#FF7A00]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Ready to Calculate</h3>
                  <p className="text-white/60 text-lg font-medium">
                    Set your parameters and click <br />"Calculate Savings" to see your results
                  </p>
                </div>
              </div>
            )}

            {/* Per Vehicle Results */}
            {showResults && <div className="relative p-8 rounded-[2rem] bg-[#1A1D22] border border-white/5 shadow-xl shadow-black group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center tracking-tight relative z-10">
                <TrendingUp size={24} className="mr-3 text-[#FF7A00]" />
                Per Vehicle Analysis
              </h3>

              <div className="space-y-5 relative z-10">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-white/60 font-medium">Healthy DPF fuel cost/year:</span>
                  <span className="text-white font-bold">{formatCurrency(results.healthyFuelCostPerVehicle)}</span>
                </div>

                <div className="flex justify-between items-center text-lg">
                  <span className="text-white/60 font-medium">Clogged DPF fuel cost/year:</span>
                  <span className="text-red-400 font-bold">{formatCurrency(results.cloggedFuelCostPerVehicle)}</span>
                </div>

                <div className="flex justify-between items-center border-t border-white/10 pt-4 text-lg">
                  <span className="text-white font-bold">Extra fuel cost/year:</span>
                  <span className="text-red-400 font-bold">{formatCurrency(results.extraFuelCostPerVehicle)}</span>
                </div>

                <div className="flex justify-between items-center text-lg">
                  <span className="text-white/60 font-medium">DPF cleaning cost:</span>
                  <span className="text-white font-bold">{formatCurrency(results.totalServiceCostPerVehicle)}</span>
                </div>

                <div className="flex justify-between items-center border-t border-white/10 pt-4 text-xl">
                  <span className="text-white font-bold">Net savings/year:</span>
                  <span className={`font-black ${results.netSavingsPerVehicle > 0 ? 'text-[#00FF57]' : 'text-red-400'}`}>
                    {formatCurrency(results.netSavingsPerVehicle)}
                  </span>
                </div>
              </div>
            </div>}

            {/* Payback Period */}
            {showResults && <div className="relative p-8 rounded-[2rem] bg-[#1A1D22] border border-white/5 shadow-xl shadow-black group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center tracking-tight relative z-10">
                <Clock size={24} className="mr-3 text-[#FF7A00]" />
                Payback Period
              </h3>

              <div className="text-center relative z-10">
                <div className="text-4xl md:text-5xl font-black text-[#FF7A00] mb-3 drop-shadow-[0_0_15px_rgba(255,122,0,0.5)]">
                  {results.paybackMonths < 12 ? `${results.paybackMonths.toFixed(1)} months` : `${(results.paybackMonths / 12).toFixed(1)} years`}
                </div>
                <p className="text-white/60 text-lg font-medium">
                  Time to recover cleaning investment through fuel savings
                </p>
              </div>
            </div>}

            {/* Fleet Totals */}
            {showResults && <div className="relative p-8 rounded-[2rem] bg-[#1A1D22] border-2 border-[#FF7A00]/30 shadow-xl shadow-black group hover:border-[#FF7A00]/50 transition-all duration-500 overflow-hidden shadow-[0_0_30px_rgba(255,122,0,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/10 to-transparent pointer-events-none"></div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center tracking-tight relative z-10">
                <Fuel size={24} className="mr-3 text-[#FF7A00]" />
                Fleet Totals ({inputs.numberOfVehicles} vehicles)
                {results.fleetDiscount > 0 && (
                  <span className="text-[#FF7A00] text-sm font-bold ml-3 bg-[#FF7A00]/10 px-3 py-1 rounded-full border border-[#FF7A00]/30">
                    10% DISCOUNT
                  </span>
                )}
              </h3>

              <div className="space-y-5 relative z-10">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-white/60 font-medium">Total extra fuel cost/year:</span>
                  <span className="text-red-400 font-bold">{formatCurrency(results.totalFleetExtraFuelCost)}</span>
                </div>

                <div className="flex justify-between items-center text-lg">
                  <span className="text-white/60 font-medium">Total cleaning cost:</span>
                  <span className="text-white font-bold">{formatCurrency(results.totalFleetServiceCost)}</span>
                </div>

                <div className="flex justify-between items-center border-t border-white/10 pt-4">
                  <span className="text-white font-bold text-xl">Total net savings/year:</span>
                  <span className={`font-black text-3xl ${results.totalFleetNetSavings > 0 ? 'text-[#00FF57]' : 'text-red-400'}`}>
                    {formatCurrency(results.totalFleetNetSavings)}
                  </span>
                </div>
              </div>
            </div>}

            {/* Money in Your Pocket */}
            {showResults && <div className="relative p-8 rounded-[2rem] bg-[#1A1D22] border-2 border-[#00FF57]/30 shadow-xl shadow-black overflow-hidden shadow-[0_0_40px_rgba(0,255,87,0.15)] group hover:border-[#00FF57]/50 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FF57]/10 to-transparent pointer-events-none"></div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center tracking-tight relative z-10">
                <PoundSterling size={28} className="mr-3 text-[#00FF57]" />
                Money That Stays in Your Pocket
              </h3>

              <div className="text-center relative z-10">
                <div className="text-5xl md:text-6xl font-black text-[#00FF57] mb-4 drop-shadow-[0_0_20px_rgba(0,255,87,0.6)]">
                  {formatCurrency(results.totalFleetNetSavings)}
                </div>
                <p className="text-white/90 font-bold text-xl mb-2">
                  Annual net benefit after DPF cleaning
                </p>
                <p className="text-white/60 text-lg font-medium">
                  This is real money back in your business every year
                </p>
              </div>
            </div>}
          </div>
        </div>

        {/* Bottom Information */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 reveal-container">
          <div className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black">
            <h3 className="text-2xl font-bold text-white mb-8 tracking-tight relative z-10">How This Calculator Works</h3>
            <ul className="space-y-4 text-white/60 text-lg font-medium relative z-10">
              <li className="flex items-start">
                <div className="w-2.5 h-2.5 bg-[#FF7A00] rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(255,122,0,0.8)]"></div>
                <span>Compares fuel costs between healthy and clogged DPF filters</span>
              </li>
              <li className="flex items-start">
                <div className="w-2.5 h-2.5 bg-[#FF7A00] rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(255,122,0,0.8)]"></div>
                <span>Uses UK gallons (4.546 litres) for accurate calculations</span>
              </li>
              <li className="flex items-start">
                <div className="w-2.5 h-2.5 bg-[#FF7A00] rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(255,122,0,0.8)]"></div>
                <span>Includes 10% fleet discount for 10+ vehicles</span>
              </li>
              <li className="flex items-start">
                <div className="w-2.5 h-2.5 bg-[#FF7A00] rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(255,122,0,0.8)]"></div>
                <span>Shows net savings after cleaning costs</span>
              </li>
            </ul>
          </div>

          <div className="relative p-10 md:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black flex flex-col justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">Ready to Start Saving?</h3>
              <p className="text-white/60 text-lg font-medium mb-10 leading-relaxed">
                Professional DPF cleaning pays for itself through improved fuel efficiency.
                Contact us to discuss your fleet's specific requirements.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-4 mt-auto">
              <MagneticButton className="block w-full sm:w-auto">
                <a
                  href="tel:08000430609"
                  className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center text-lg"
                >
                  0800 043 0609
                </a>
              </MagneticButton>
              <MagneticButton className="block w-full sm:w-auto">
                <a
                  href="mailto:info@autocleanse.co.uk"
                  className="w-full bg-[#FF7A00] hover:bg-[#FF9500] text-black px-6 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] flex items-center justify-center text-lg"
                >
                  Get Fleet Quote
                </a>
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #FF7A00;
          cursor: pointer;
          border: 2px solid #FF7A00;
          box-shadow: 0 0 0 1px #1A1D22;
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #FF7A00;
          cursor: pointer;
          border: 2px solid #FF7A00;
          box-shadow: 0 0 0 1px #1A1D22;
        }

        .slider::-webkit-slider-track {
          background: #1A1D22;
          height: 8px;
          border-radius: 4px;
        }

        .slider::-moz-range-track {
          background: #1A1D22;
          height: 8px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default FuelSavingsCalculator;