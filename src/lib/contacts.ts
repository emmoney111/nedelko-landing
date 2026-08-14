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

function rowToContacts(row: ContactRow): ContactsData {
  return {
    orgName: row.org_name,
    addrPyatigorsk: row.addr_pyatigorsk,
    addrMinvody: row.addr_minvody,
    phone1: row.phone1,
    phone2: row.phone2,
    email: row.email,
    hours: row.hours,
    whatsapp: row.whatsapp,
    telegram: row.telegram,
    max: row.max,
  };
}

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

    setData(rowToContacts(row as ContactRow));
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

export async function updateContacts(contacts: ContactsData) {
  const { data: existing, error: findError } = await supabase
    .from('contacts')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (findError) {
    throw findError;
  }

  const payload = {
    org_name: contacts.orgName,
    addr_pyatigorsk: contacts.addrPyatigorsk,
    addr_minvody: contacts.addrMinvody,
    phone1: contacts.phone1,
    phone2: contacts.phone2,
    email: contacts.email,
    hours: contacts.hours,
    whatsapp: contacts.whatsapp,
    telegram: contacts.telegram,
    max: contacts.max,
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
