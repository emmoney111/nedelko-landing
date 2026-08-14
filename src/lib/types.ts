export interface PriceRow {
  id: string;
  name: string;
  price: string;
  unit: string;
  sort_order: number;
}

export interface PriceSubItemRow {
  id: string;
  price_id: string;
  name: string;
  price: string;
  sort_order: number;
}

export interface PriceWithSubs extends PriceRow {
  subItems: PriceSubItemRow[];
}
