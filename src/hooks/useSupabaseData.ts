import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropFirm, Review } from '@/types/supabase';

export const usePropFirms = () => {
  const [propFirms, setPropFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPropFirms = useCallback(async () => {
    try {
      console.log('usePropFirms: Starting to fetch prop firms...');
      setLoading(true);
      const { data, error } = await supabase
        .from('prop_firms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('usePropFirms: Database error:', error);
        throw error;
      }
      console.log('usePropFirms: Successfully fetched', data?.length || 0, 'prop firms');
      setPropFirms(data || []);
      setError(null);
    } catch (err) {
      console.error('usePropFirms: Fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPropFirms();
  }, [fetchPropFirms]);

  return { propFirms, loading, error, refetch: fetchPropFirms };
};

export const useHomepagePropFirms = () => {
  const [propFirms, setPropFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomepagePropFirms = useCallback(async () => {
    try {
      console.log('useHomepagePropFirms: Starting to fetch homepage prop firms...');
      setLoading(true);
      const { data, error } = await supabase
        .from('prop_firms')
        .select('*')
        .eq('show_on_homepage', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useHomepagePropFirms: Database error:', error);
        throw error;
      }
      console.log('useHomepagePropFirms: Successfully fetched', data?.length || 0, 'homepage prop firms');
      setPropFirms(data || []);
      setError(null);
    } catch (err) {
      console.error('useHomepagePropFirms: Fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomepagePropFirms();

    // Set up real-time subscription
    const channel = supabase
      .channel('homepage-prop-firms-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'prop_firms',
          filter: 'show_on_homepage=eq.true'
        },
        () => {
          console.log('Real-time update detected, refetching homepage prop firms...');
          fetchHomepagePropFirms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchHomepagePropFirms]);

  return { propFirms, loading, error, refetch: fetchHomepagePropFirms };
};

export const useTopRatedFirms = () => {
  const [propFirms, setPropFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopRatedFirms = useCallback(async () => {
    try {
      console.log('useTopRatedFirms: Starting to fetch top rated firms...');
      setLoading(true);
      const { data, error } = await supabase
        .from('prop_firms')
        .select('*')
        .order('review_score', { ascending: false })
        .limit(10);

      if (error) {
        console.error('useTopRatedFirms: Database error:', error);
        throw error;
      }
      console.log('useTopRatedFirms: Successfully fetched', data?.length || 0, 'top rated firms');
      setPropFirms(data || []);
      setError(null);
    } catch (err) {
      console.error('useTopRatedFirms: Fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopRatedFirms();
  }, [fetchTopRatedFirms]);

  return { propFirms, loading, error, refetch: fetchTopRatedFirms };
};

export const useReviews = (firmId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        let query = supabase
          .from('reviews')
          .select(`
            *,
            prop_firms:firm_id (
              id,
              name,
              slug
            )
          `)
          .order('created_at', { ascending: false });

        if (firmId) {
          query = query.eq('firm_id', firmId);
        }

        const { data, error } = await query;

        if (error) throw error;
        setReviews(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [firmId]);

  return { reviews, loading, error };
};