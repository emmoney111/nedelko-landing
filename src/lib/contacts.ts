import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { ContactsData } from '../pages/Home';

type ContactRow = {
  id: string;
  org_name: string;
  addr_pyatigorsk: string;
  addr_minvody: string;
  phone1: string;
  phone2: string;
  email: string;
  hours: string;
  whatsapp: string;
  telegram: string;
  max: string;
  updated_at: string;
};

export function useContacts() {
  const [data, setData] = useState<ContactsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: row, error: fetchError } = await supabase
      .from('contacts')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error('Ошибка загрузки contacts:', fetchError);
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    if (!row) {
      setData(null);
      setLoading(false);
      return;
    }

    const contact = row as ContactRow;

    setData({
      orgName: contact.org_name,
      addrPyatigorsk: contact.addr_pyatigorsk,
      addrMinvody: contact.addr_minvody,
      phone1: contact.phone1,
      phone2: contact.phone2,
      email: contact.email,
      hours: contact.hours,
      whatsapp: contact.whatsapp,
      telegram: contact.telegram,
      max: contact.max,
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    loading,
    error,
    reload: load,
  };
}

export async function updateContacts(data: ContactsData) {
  const { data: existing, error: findError } = await supabase
    .from('contacts')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (findError) {
    throw findError;
  }

  const payload = {
    org_name: data.orgName,
    addr_pyatigorsk: data.addrPyatigorsk,
    addr_minvody: data.addrMinvody,
    phone1: data.phone1,
    phone2: data.phone2,
    email: data.email,
    hours: data.hours,
    whatsapp: data.whatsapp,
    telegram: data.telegram,
    max: data.max,
    updated_at: new Date().toISOString(),
  };

  if (existing?.id) {
    const { error } = await supabase
      .from('contacts')
      .update(payload)
      .eq('id', existing.id);

    if (error) {
      throw error;
    }
  } else {
    const { error } = await supabase
      .from('contacts')
      .insert(payload);

    if (error) {
      throw error;
    }
  }
}
