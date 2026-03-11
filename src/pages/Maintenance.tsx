import { useRef } from 'react';
import SEO from '../components/SEO';
import { Calendar, DollarSign, Fuel, AlertTriangle, Truck, Settings, CheckCircle, Clock } from 'lucide-react';
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

const Maintenance = () => {
  const keyPoints = [
    {
      icon: DollarSign,
      title: 'Prevention is Always Cheaper',
      description: 'Most DPF failures happen due to excessive soot and ash buildup, both avoidable with scheduled cleaning. Waiting too long means you risk full replacement.',
    },
    {
      icon: Settings,
      title: 'Cleaning Keeps Performance High',
      description: 'A clogged DPF reduces power, MPG, and throttle response. An annual clean keeps your system breathing freely.',
    },
    {
      icon: Fuel,
      title: 'Reduce Fuel Consumption',
      description: 'Engines with partially blocked filters burn more fuel to compensate. A clean DPF can restore 3–10% fuel efficiency instantly.',
    },
    {
      icon: AlertTriangle,
      title: 'Avoid Dashboard Warnings & Forced Limp Mode',
      description: 'Waiting for a warning light or limp mode can leave you stranded. Proactive cleaning keeps you ahead of faults.',
    },
    {
      icon: Calendar,
      title: 'Ideal Timing: Pre-MOT or Pre-Winter',
      description: 'Combine your DPF service with your MOT, or prep for winter when soot build-up is highest due to shorter journeys.',
    },
    {
      icon: Truck,
      title: 'Fleets Rely on Predictability',
      description: 'We support fleet managers with scheduled preventative cleans, keeping vehicles in rotation, not off the road.',
    },
    {
      icon: CheckCircle,
      title: 'Make It Part of Your Annual Service Plan',
      description: 'Book once per year. Save on breakdowns, emergency diagnostics, and keep your emissions compliant.',
    },
  ];

  const benefits = [
    {
      icon: Clock,
      title: 'Scheduled Maintenance',
      description: 'Plan ahead with annual cleaning',
      stat: '100%',
      statLabel: 'Uptime maintained',
    },
    {
      icon: DollarSign,
      title: 'Cost Savings',
      description: 'Prevent expensive replacements',
      stat: '70%',
      statLabel: 'Less than replacement',
    },
    {
      icon: Fuel,
      title: 'Fuel Efficiency',
      description: 'Restore optimal performance',
      stat: '3-10%',
      statLabel: 'Efficiency improvement',
    },
  ];

  const container = useRef(null);

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

  return (
    <div ref={container} className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO title="DPF Maintenance Guide | Annual Cleaning" description="Expert advice on keeping your Diesel Particulate Filter healthy and avoiding costly replacements." path="/maintenance" />

      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 reveal-container">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
            {splitText('Why Annual DPF', 'text-white')}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em]">
              <span className="inline-block word-reveal text-[#FF7A00] ml-3">Maintenance</span>
            </span>
            {splitText('Matters', 'text-white')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mb-8 rounded-full"></div>
          <div className="max-w-4xl mx-auto reveal-item">
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-medium">
              Treat DPF cleaning like an MOT or oil change. Preventative maintenance saves money,
              improves performance, and reduces emergency downtime.
            </p>
          </div>
        </div>

        {/* Callout Section */}
        <div className="mb-20 reveal-container">
          <div className="relative p-10 md:p-14 rounded-[3rem] bg-[#1A1D22] border-2 border-[#FF7A00]/20 text-center reveal-item group hover:border-[#FF7A00]/40 transition-all duration-500 overflow-hidden shadow-[0_0_30px_rgba(255,122,0,0.1)]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center justify-center tracking-tight">
                <span className="text-4xl mr-4">🛠️</span> Don't wait for warning lights
              </h2>
              <p className="text-xl md:text-2xl text-white/70 mb-8 leading-relaxed font-medium">
                <span className="text-[#FF7A00] font-bold">Prevention is always cheaper.</span> Annual DPF cleaning
                prevents costly breakdowns, maintains fuel efficiency, and keeps your vehicles running smoothly year-round.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-xl font-bold">
                <span className="text-[#FF7A00] bg-[#FF7A00]/10 px-4 py-2 rounded-xl">Scheduled.</span>
                <span className="text-[#FF7A00] bg-[#FF7A00]/10 px-4 py-2 rounded-xl">Predictable.</span>
                <span className="text-[#FF7A00] bg-[#FF7A00]/10 px-4 py-2 rounded-xl">Cost-effective.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 reveal-container">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="relative p-8 md:p-10 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 text-center reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <div className="w-20 h-20 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                <benefit.icon size={36} className="text-[#FF7A00] group-hover:text-white transition-colors duration-500" />
              </div>
              <div className="text-5xl font-black text-[#FF7A00] mb-2 drop-shadow-[0_0_15px_rgba(255,122,0,0.4)]">{benefit.stat}</div>
              <p className="text-white/50 text-base font-medium uppercase tracking-wider mb-6">{benefit.statLabel}</p>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-[#FF7A00] transition-colors">{benefit.title}</h3>
              <p className="text-white/60 text-lg leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Key Points Grid */}
        <div className="mb-24 reveal-container">
          <div className="text-center mb-12 reveal-item">
            <h2 className="text-4xl md:text-5xl font-black text-white px-4">
              Key Facts & <span className="text-[#FF7A00] font-mono">Talking Points</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyPoints.map((point, index) => (
              <div
                key={index}
                className="relative p-8 rounded-[2rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-lg shadow-black"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="w-14 h-14 rounded-xl bg-[#FF7A00]/10 text-[#FF7A00] group-hover:text-white group-hover:bg-[#FF7A00] border border-[#FF7A00]/30 flex items-center justify-center mb-6 transition-all duration-500 shadow-[0_0_15px_rgba(255,122,0,0.15)]">
                  <point.icon size={26} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight group-hover:text-[#FF7A00] transition-colors">{point.title}</h3>
                <p className="text-white/60 text-base font-medium leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Service Plans Section */}
        <div className="mb-24 reveal-container">
          <div className="text-center mb-12 reveal-item">
            <h2 className="text-4xl md:text-5xl font-black text-white px-4">
              Annual Service <span className="text-[#FF7A00] font-mono">Plans</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Individual Service */}
            <div className="relative p-10 lg:p-12 rounded-[2.5rem] bg-[#1A1D22] border border-white/5 reveal-item group hover:border-[#FF7A00]/20 transition-all duration-500 overflow-hidden shadow-xl shadow-black flex flex-col h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <div className="text-center mb-8 relative z-10 flex-grow">
                <div className="w-20 h-20 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-[#FF7A00]/20 transition-all duration-500 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                  <Settings size={36} className="text-[#FF7A00] group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">Individual Vehicles</h3>
                <p className="text-white/60 text-lg font-medium">Perfect for single vehicle owners</p>
              </div>

              <ul className="space-y-4 mb-10 relative z-10">
                <li className="flex items-start text-white/70 text-lg font-medium">
                  <div className="w-2.5 h-2.5 bg-[#FF7A00] rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(255,122,0,0.8)]"></div>
                  <span>Annual reminder service</span>
                </li>
                <li className="flex items-start text-white/70 text-lg font-medium">
                  <div className="w-2.5 h-2.5 bg-[#FF7A00] rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(255,122,0,0.8)]"></div>
                  <span>Pre-MOT cleaning available</span>
                </li>
                <li className="flex items-start text-white/70 text-lg font-medium">
                  <div className="w-2.5 h-2.5 bg-[#FF7A00] rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(255,122,0,0.8)]"></div>
                  <span>Same-day return guarantee</span>
                </li>
              </ul>

              <div className="text-center relative z-10 mt-auto">
                <MagneticButton className="block">
                  <a
                    href="tel:08000430609"
                    className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center text-lg"
                  >
                    Ask about yearly plans
                  </a>
                </MagneticButton>
              </div>
            </div>

            {/* Fleet Service */}
            <div className="relative p-10 lg:p-12 rounded-[2.5rem] bg-[#1A1D22] border-2 border-[#FF7A00]/20 reveal-item group hover:border-[#FF7A00]/40 transition-all duration-500 overflow-hidden shadow-xl shadow-black shadow-[0_0_30px_rgba(255,122,0,0.1)] flex flex-col h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/10 to-transparent pointer-events-none"></div>

              <div className="text-center mb-8 relative z-10 flex-grow">
                <div className="w-20 h-20 rounded-2xl bg-[#FF7A00] text-black border border-[#FF7A00]/30 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500 shadow-[0_0_30px_rgba(255,122,0,0.4)]">
                  <Truck size={36} />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">Fleet Maintenance</h3>
                <p className="text-[#FF7A00] text-lg font-bold">Discounted bundles for trade</p>
              </div>

              <ul className="space-y-4 mb-10 relative z-10">
                <li className="flex items-start text-white/70 text-lg font-medium">
                  <div className="w-2.5 h-2.5 bg-[#FF7A00] rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(255,122,0,0.8)]"></div>
                  <span>Scheduled maintenance programs</span>
                </li>
                <li className="flex items-start text-white/70 text-lg font-medium">
                  <div className="w-2.5 h-2.5 bg-[#FF7A00] rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(255,122,0,0.8)]"></div>
                  <span>Volume discounts available</span>
                </li>
                <li className="flex items-start text-white/70 text-lg font-medium">
                  <div className="w-2.5 h-2.5 bg-[#FF7A00] rounded-full mr-4 mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(255,122,0,0.8)]"></div>
                  <span>Predictable maintenance costs</span>
                </li>
              </ul>

              <div className="text-center relative z-10 mt-auto">
                <MagneticButton className="block">
                  <a
                    href="mailto:info@autocleanse.co.uk"
                    className="w-full bg-[#FF7A00] hover:bg-[#FF9500] text-black px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] flex items-center justify-center text-lg"
                  >
                    Get discounted fleet bundles
                  </a>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <section className="text-center mt-20 reveal-container">
          <div className="reveal-item relative p-12 md:p-16 rounded-[3rem] bg-[#1A1D22] border border-white/5 shadow-2xl shadow-black overflow-hidden group hover:border-[#FF7A00]/20 transition-all duration-700 max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,122,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

            <h3 className="relative z-10 text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
              Ready to join our <span className="text-[#FF7A00]">regular service list?</span>
            </h3>
            <p className="relative z-10 text-white/60 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
              Get reminders and discounts for annual DPF maintenance. Keep your vehicles running efficiently year-round.
            </p>

            <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center">
              <MagneticButton className="block">
                <a
                  href="tel:08000430609"
                  className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center text-lg"
                >
                  0800 043 0609
                </a>
              </MagneticButton>
              <MagneticButton className="block">
                <a
                  href="mailto:info@autocleanse.co.uk"
                  className="w-full sm:w-auto bg-[#FF7A00] hover:bg-[#FF9500] text-black px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] flex items-center justify-center text-lg"
                >
                  Join regular service list
                </a>
              </MagneticButton>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Maintenance;