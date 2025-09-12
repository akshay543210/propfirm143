import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropFirm } from '@/types/supabase';

export const useSectionFirms = (section: string) => {
  const [propFirms, setPropFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSectionFirms = useCallback(async () => {
    try {
      console.log(`useSectionFirms: Starting to fetch ${section} prop firms...`);
      setLoading(true);
      const { data, error } = await supabase
        .from('prop_firms')
        .select(`
          id,
          name,
          slug,
          category_id,
          price,
          original_price,
          coupon_code,
          review_score,
          trust_rating,
          description,
          features,
          logo_url,
          profit_split,
          payout_rate,
          funding_amount,
          user_review_count,
          pros,
          cons,
          affiliate_url,
          brand,
          platform,
          max_funding,
          evaluation_model,
          starting_fee,
          regulation,
          show_on_homepage,
          sections,
          created_at,
          updated_at
        `)
        .contains('sections', [section])
        .order('created_at', { ascending: false });

      if (error) {
        console.error(`useSectionFirms: Database error for ${section}:`, error);
        throw error;
      }
      console.log(`useSectionFirms: Successfully fetched`, data?.length || 0, `${section} prop firms`);
      setPropFirms(data || []);
      setError(null);
    } catch (err) {
      console.error(`useSectionFirms: Fetch error for ${section}:`, err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [section]);

  useEffect(() => {
    fetchSectionFirms();
  }, [fetchSectionFirms]);

  return { propFirms, loading, error, refetch: fetchSectionFirms };
};

export const useBudgetFirms = () => {
  return useSectionFirms('budget');
};

export const useTopRatedFirmsBySection = () => {
  return useSectionFirms('topRated');
};

export const useAllFirms = () => {
  const [propFirms, setPropFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllFirms = useCallback(async () => {
    try {
      console.log('useAllFirms: Starting to fetch all prop firms...');
      setLoading(true);
      const { data, error } = await supabase
        .from('prop_firms')
        .select(`
          id,
          name,
          slug,
          category_id,
          price,
          original_price,
          coupon_code,
          review_score,
          trust_rating,
          description,
          features,
          logo_url,
          profit_split,
          payout_rate,
          funding_amount,
          user_review_count,
          pros,
          cons,
          affiliate_url,
          brand,
          platform,
          max_funding,
          evaluation_model,
          starting_fee,
          regulation,
          show_on_homepage,
          sections,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useAllFirms: Database error:', error);
        throw error;
      }
      console.log('useAllFirms: Successfully fetched', data?.length || 0, 'all prop firms');
      setPropFirms(data || []);
      setError(null);
    } catch (err) {
      console.error('useAllFirms: Fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllFirms();
  }, [fetchAllFirms]);

  return { propFirms, loading, error, refetch: fetchAllFirms };
};
