export type TItem = {
  id: string;
  label: string;
  image_url: string;
  description: string;
};

export type TSubItem = {
  id: string;
  label: string;
  total_qte: number;
  available_qte: number;
  price: number;
  image_url?: string;
};
