import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PropFirmCard from "./PropFirmCard";
import { useBudgetFirms, useTopRatedFirmsBySection } from "../hooks/useSectionFirms";
import { PropFirm } from "@/types/supabase";

interface SectionFirmDisplayProps {
  section: 'budget' | 'topRated';
  title: string;
  subtitle: string;
 maxItems?: number;
}

const SectionFirmDisplay = ({ section, title, subtitle, maxItems = 5 }: SectionFirmDisplayProps) => {
  const { propFirms: budgetFirms, loading: budgetLoading } = useBudgetFirms();
  const { propFirms: topRatedFirms, loading: topRatedLoading } = useTopRatedFirmsBySection();
  
  const isLoading = section === 'budget' ? budgetLoading : topRatedLoading;
  const firms = section === 'budget' ? budgetFirms : topRatedFirms;
  
  // Limit the number of firms displayed
  const displayFirms = firms.slice(0, maxItems);

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
            <p className="text-xl text-gray-300">{subtitle}</p>
          </div>
          <div className="text-center py-8">
            <div className="text-white">Loading {title.toLowerCase()}...</div>
          </div>
        </div>
      </section>
    );
  }

  if (displayFirms.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-xl text-gray-300">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {displayFirms.map((firm, index) => (
            <PropFirmCard 
              key={firm.id} 
              firm={firm} 
              index={index}
            />
          ))}
        </div>

        {displayFirms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No {title.toLowerCase()} available at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SectionFirmDisplay;
