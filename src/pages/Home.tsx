export default function Home() {
  useReveal();
  const { status: pricesStatus, data: prices, error: pricesError } = usePrices();
  const [contacts] = useLocalStorage<ContactsData>('admin_contacts', DEFAULT_CONTACTS);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Header contacts={contacts} />
      <main>
        <Hero contacts={contacts} />
        <PricesAndMaterials
          prices={prices ?? []}
          loading={pricesStatus === 'loading'}
          error={pricesError}
        />
        <Advantages />
        <Contacts contacts={contacts} />
        <CTA contacts={contacts} />
      </main>
      <Footer contacts={contacts} />
    </div>
  );
}
