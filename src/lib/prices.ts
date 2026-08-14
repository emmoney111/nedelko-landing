import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { PriceWithSubs, PriceSubItemRow } from './types';

type PricesState =
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: PriceWithSubs[]; error: null }
  | { status: 'error'; data: null; error: string };

export function usePrices() {
  const [state, setState] = useState<PricesState>({ status: 'loading', data: null, error: null });

  const fetchPrices = useCallback(async () => {
    setState({ status: 'loading', data: null, error: null });

    const { data: rows, error } = await supabase
      .from('prices')
      .select('id, name, price, unit, sort_order')
      .order('sort_order', { ascending: true });

    if (error) {
      setState({ status: 'error', data: null, error: error.message });
      return;
    }

    const { data: subs, error: subError } = await supabase
      .from('price_sub_items')
      .select('id, price_id, name, price, sort_order')
      .order('sort_order', { ascending: true });

    if (subError) {
      setState({ status: 'error', data: null, error: subError.message });
      return;
    }

    const subMap = new Map<string, PriceSubItemRow[]>();
    for (const s of subs ?? []) {
      const arr = subMap.get(s.price_id) ?? [];
      arr.push(s);
      subMap.set(s.price_id, arr);
    }

    const combined: PriceWithSubs[] = (rows ?? []).map((r) => ({
      ...r,
      subItems: subMap.get(r.id) ?? [],
    }));

    setState({ status: 'success', data: combined, error: null });
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  return { ...state, refetch: fetchPrices };
}

// ---- Mutations ----

export async function createPrice(name: string, price: string, unit: string, sortOrder: number) {
  const { data, error } = await supabase
    .from('prices')
    .insert({ name, price, unit, sort_order: sortOrder })
    .select('id, name, price, unit, sort_order')
    .single();
  if (error) throw error;
  return data;
}

export async function updatePrice(id: string, patch: { name?: string; price?: string; unit?: string }) {
  const { error } = await supabase.from('prices').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deletePrice(id: string) {
  const { error } = await supabase.from('prices').delete().eq('id', id);
  if (error) throw error;
}

export async function createSubItem(priceId: string, name: string, price: string, sortOrder: number) {
  const { data, error } = await supabase
    .from('price_sub_items')
    .insert({ price_id: priceId, name, price, sort_order: sortOrder })
    .select('id, price_id, name, price, sort_order')
    .single();
  if (error) throw error;
  return data;
}

export async function updateSubItem(id: string, patch: { name?: string; price?: string }) {
  const { error } = await supabase.from('price_sub_items').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteSubItem(id: string) {
  const { error } = await supabase.from('price_sub_items').delete().eq('id', id);
  if (error) throw error;
}
