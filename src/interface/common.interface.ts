import { HttpStatus } from '@nestjs/common';

export class ResponseData<T> {
  status?: boolean;
  message: string;
  metadata?: Metadata;
  data?: T;
  timestamp?: string;
}

interface Metadata {
  currentPage: number;
  nextPage: number;
  size: number;
  countPage: number;
  countFiltered: number;
  countData: number;
}

export interface Count {
  count: number;
}

export interface Page {
  page?: number;
  perPage?: number;
}

export interface Result<T> {
  totalCount: number;
  CountFiltered: number;
  data: T;
}
