import { Card, SectionTitle } from '@/components/ui';
import { Info, Target, Users, FlaskConical, Code2, AlertTriangle, Rocket } from 'lucide-react';

export function AboutProject() {
  return (
    <div className="space-y-6 animate-fade-in">
      <SectionTitle
        title="About Project"
        subtitle="Technologies for Sustainable Events"
        icon={<Info className="w-5 h-5" />}
      />

      {/* Hero card */}
      <Card className="p-6 bg-gradient-to-br from-forest-800 to-forest-900 border-emerald2-600/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald2-600/20 text-emerald2-400 flex items-center justify-center">
            <span className="text-xl font-bold">E</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">EcoEvent</h3>
            <p className="text-sm text-emerald2-300">Technologies for Sustainable Events</p>
          </div>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          A digital tool to help event organizers record sustainability information, understand resource usage, and adopt environmentally responsible practices. This is an academic project prototype developed as a third-year B.Sc. Computer Science Community Engagement Project (CEP).
        </p>
      </Card>

      {/* Purpose */}
      <Card className="p-5">
        <h3 className="text-base font-semibold text-white mb-2">Purpose</h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          To explore how digital technology can support sustainable event planning and monitoring. The application allows organizers to track waste generation, energy consumption, water use, and resource consumption at institutional, cultural, or social events, and provides visual analytics to support environmentally responsible decision-making.
        </p>
      </Card>

      {/* Objectives */}
      <Card className="p-5">
        <SectionTitle title="Project Objectives" icon={<Target className="w-5 h-5" />} />
        <ul className="space-y-2.5">
          {[
            'Understand community sustainability challenges related to event organization.',
            'Record event waste and resource consumption data in a structured, digital format.',
            'Support responsible event planning through a green event checklist and guidance.',
            'Present sustainability data visually using charts and summary reports.',
            'Promote environmental awareness among students, organizers, and attendees.',
          ].map((obj, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
              <div className="w-6 h-6 rounded-lg bg-emerald2-600/15 text-emerald2-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                {i + 1}
              </div>
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Problem statement */}
      <Card className="p-5">
        <h3 className="text-base font-semibold text-white mb-2">Problem Statement</h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          Community events such as college festivals, seminars, and cultural programmes generate significant amounts of waste and consume substantial resources, including electricity and water. Many event organizers lack a simple, structured tool to record and analyze this data. Without visibility into resource consumption and waste generation patterns, it is difficult to identify areas for improvement or to plan more sustainable events. This project addresses that gap by providing a digital platform for recording and visualizing event sustainability data.
        </p>
      </Card>

      {/* Target beneficiaries */}
      <Card className="p-5">
        <SectionTitle title="Target Beneficiaries" icon={<Users className="w-5 h-5" />} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'College and university event organizers',
            'Cultural festival coordinators',
            'Seminar and workshop facilitators',
            'Community gathering planners',
            'Student sustainability committees',
            'Environmental awareness groups',
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-forest-900/30 text-sm text-gray-300">
              <div className="w-2 h-2 rounded-full bg-emerald2-500 flex-shrink-0" />
              {b}
            </div>
          ))}
        </div>
      </Card>

      {/* Methodology */}
      <Card className="p-5">
        <SectionTitle title="Methodology" icon={<FlaskConical className="w-5 h-5" />} />
        <div className="space-y-3 text-sm text-gray-300">
          <p><strong className="text-gray-200">1. Problem Identification:</strong> Studied sustainability challenges at community events, focusing on waste generation, energy consumption, and water use.</p>
          <p><strong className="text-gray-200">2. Requirements Analysis:</strong> Identified the key data points event organizers need to record and the metrics that support sustainability awareness.</p>
          <p><strong className="text-gray-200">3. Design and Development:</strong> Built a web-based application using React, TypeScript, and Tailwind CSS, with charts for data visualization and localStorage for persistence.</p>
          <p><strong className="text-gray-200">4. Demonstration:</strong> Populated the application with clearly-labelled demo data to demonstrate functionality during the CEP presentation.</p>
          <p><strong className="text-gray-200">5. Evaluation:</strong> Assessed the tool against the project objectives to confirm it supports recording, visualizing, and promoting sustainable event practices.</p>
        </div>
        <p className="text-xs text-amber-300 mt-4 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
          Note: This project does not fabricate field visits, survey responses, photographs, research results, or environmental impact figures. The demo data is clearly labelled and is intended only for functionality demonstration.
        </p>
      </Card>

      {/* Technology stack */}
      <Card className="p-5">
        <SectionTitle title="Technology Stack" icon={<Code2 className="w-5 h-5" />} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'React', desc: 'UI library for building component-based interfaces' },
            { name: 'TypeScript', desc: 'Type-safe JavaScript for reliable code' },
            { name: 'Vite', desc: 'Fast development build tool' },
            { name: 'Tailwind CSS', desc: 'Utility-first CSS framework' },
            { name: 'Recharts', desc: 'Charting library for data visualization' },
            { name: 'Lucide React', desc: 'Icon library' },
            { name: 'localStorage', desc: 'Browser-based data persistence' },
            { name: 'CSV Export', desc: 'Report download functionality' },
          ].map((tech, i) => (
            <div key={i} className="px-4 py-3 rounded-lg bg-forest-900/30 border border-forest-600/30">
              <p className="text-sm font-semibold text-emerald2-300">{tech.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{tech.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Limitations */}
      <Card className="p-5">
        <SectionTitle title="Limitations" icon={<AlertTriangle className="w-5 h-5" />} />
        <ul className="space-y-2.5">
          {[
            'Data is stored locally in the browser (localStorage) and is not synced across devices or users.',
            'Resource consumption values (electricity, water) are manually entered, not collected through IoT sensors.',
            'The application is a prototype and has not been deployed in a large-scale real-world event.',
            'No authentication or multi-user collaboration features are included in this version.',
            'Waste and resource figures depend on the accuracy of manual data entry by the organizer.',
            'The demo data is illustrative only and does not represent actual event measurements.',
          ].map((lim, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{lim}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Future scope */}
      <Card className="p-5">
        <SectionTitle title="Future Scope" icon={<Rocket className="w-5 h-5" />} />
        <ul className="space-y-2.5">
          {[
            'Cloud-based data storage to enable multi-device access and collaboration.',
            'User authentication and role-based access for event teams.',
            'Integration with IoT sensors for automated electricity and water monitoring.',
            'AI-powered recommendations based on historical event data.',
            'Comparison analytics across multiple events to identify sustainability trends.',
            'PDF report generation with branded templates for institutional sharing.',
            'Mobile app version for on-site data entry during events.',
          ].map((future, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
              <Rocket className="w-4 h-4 text-emerald2-400 flex-shrink-0 mt-0.5" />
              <span>{future}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <p className="text-xs text-gray-500 text-center">
          This project is an academic prototype developed for a university Community Engagement Project (CEP) presentation. It does not claim to have reduced waste or saved energy in real-world events.
        </p>
      </Card>
    </div>
  );
}
