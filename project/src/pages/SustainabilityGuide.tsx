import { Card, SectionTitle } from '@/components/ui';
import { Recycle, Utensils, Apple, Zap, Droplets, Mail, ClipboardList, BookOpen } from 'lucide-react';

interface GuideSection {
  title: string;
  icon: typeof Recycle;
  tips: string[];
}

const SECTIONS: GuideSection[] = [
  {
    title: 'Waste Prevention and Segregation',
    icon: Recycle,
    tips: [
      'Place clearly labeled bins for organic, recyclable, and general waste at strategic points.',
      'Use color-coded bins (green for organic, blue for recyclable, grey/black for general) for easy identification.',
      'Assign volunteers to guide attendees on correct bin usage during the event.',
      'Conduct a quick waste audit after the event to record the amount in each category.',
      'Minimize packaging on event supplies to reduce waste at the source.',
    ],
  },
  {
    title: 'Reusable Plates, Cups, and Bottles',
    icon: Utensils,
    tips: [
      'Encourage attendees to bring their own reusable bottles and cups.',
      'Rent or borrow reusable dishware instead of buying single-use items.',
      'If disposables are unavoidable, choose compostable or biodegradable options.',
      'Set up washing stations for reusable items at larger events.',
      'Provide water refill stations to reduce the need for bottled water.',
    ],
  },
  {
    title: 'Food Surplus Management',
    icon: Apple,
    tips: [
      'Estimate food quantities carefully based on expected attendance to avoid over-ordering.',
      'Partner with local shelters or food banks to donate untouched surplus food.',
      'Arrange composting for food scraps and leftovers that cannot be donated.',
      'Serve food in controlled portions to minimize plate waste.',
      'Track leftover food handling methods in the waste tracking section of this app.',
    ],
  },
  {
    title: 'Electricity Conservation',
    icon: Zap,
    tips: [
      'Use LED lighting instead of incandescent or halogen bulbs.',
      'Maximize natural daylight for daytime events by choosing well-lit venues.',
      'Turn off audio-visual equipment, lights, and fans when not in use.',
      'Use energy-efficient appliances and equipment with high star ratings.',
      'Record electricity consumption in the resource monitoring section to track usage.',
    ],
  },
  {
    title: 'Water Conservation',
    icon: Droplets,
    tips: [
      'Install water refill stations instead of distributing single-use bottles.',
      'Use water-efficient taps and fixtures at the venue.',
      'Check for and repair leaks before and during the event.',
      'Use signage to encourage attendees to use water mindfully.',
      'Record total water consumption in the resource monitoring section for analysis.',
    ],
  },
  {
    title: 'Digital Invitations and Reduced Paper Use',
    icon: Mail,
    tips: [
      'Send invitations digitally via email, messaging apps, or event platforms.',
      'Use digital banners and posters instead of printed ones where possible.',
      'Share event schedules and programs through QR codes or mobile-friendly pages.',
      'If printing is necessary, use recycled paper and print on both sides.',
      'Collect feedback through online forms instead of paper surveys.',
    ],
  },
  {
    title: 'Sustainable Event Planning',
    icon: ClipboardList,
    tips: [
      'Set sustainability goals before the event (e.g., recycle 40% of waste, reduce single-use plastics).',
      'Use the Green Event Checklist in this app to plan and track sustainability actions.',
      'Brief all volunteers and staff on sustainability practices before the event.',
      'Choose venues that are accessible by public transport to reduce carbon footprint.',
      'Share your sustainability results after the event to inspire others in your community.',
    ],
  },
];

export function SustainabilityGuide() {
  return (
    <div className="space-y-6 animate-fade-in">
      <SectionTitle
        title="Sustainability Guide"
        subtitle="Practical guidance for organizing environmentally responsible events"
        icon={<BookOpen className="w-5 h-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="p-5 hover:border-forest-500 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald2-600/15 text-emerald2-400 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white">{section.title}</h3>
              </div>
              <ul className="space-y-2.5">
                {section.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald2-500 flex-shrink-0 mt-2" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      <Card className="p-5">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-emerald2-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-400">
            These tips are designed for college festivals, seminars, cultural programmes, and community gatherings. Start with a few achievable actions and expand each time you organize an event. Small changes, when adopted consistently, contribute meaningfully to environmental sustainability.
          </p>
        </div>
      </Card>
    </div>
  );
}
