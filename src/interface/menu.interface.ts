export class RepositoryMenuInput {
  uuid: string;
  name: string;
  category: string;
  calories: number;
  price: number;
  ingredients: string[];
  description: string;
}

export class FilterMenu {
  menu?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  page?: string[];
  per_page?: string;
  sort?: string;
}

export class RepositoryMenuInputUpdate {
  name?: string;
  category?: string;
  calories?: number;
  price?: number;
  ingredients?: string[];
  description?: string;
}

export class MenuRequest {
  name: string;
  category: string;
  calories: number;
  price: number;
  ingredients: string[];
  description: string;
}

export class MenuResponse {
  id: string;
  name: string;
  category: string;
  calories: number;
  price: number;
  ingredients: string | string[];
  description: string;
}

export class PaginatedMenuResponse {
  data: MenuResponse[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
