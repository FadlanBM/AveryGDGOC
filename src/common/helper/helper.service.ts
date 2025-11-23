import { Injectable } from '@nestjs/common';
import moment from 'moment-timezone';

interface MetaDataResponse {
  currentPage: number;
  nextPage: number | null;
  size: number;
  countPage: number;
  countFiltered: number;
  countData: number;
}

@Injectable()
export class HelperService {
  private readonly timezone = 'Asia/Jakarta';
  private readonly dateFormat = 'YYYY-MM-DD HH:mm:ss';

  metaData(
    countData: number,
    currentPage: number,
    size: number,
    countFiltered: number,
  ): MetaDataResponse {
    const countPage = Math.ceil(countData / size);
    const nextPage = currentPage < countPage ? currentPage + 1 : null;

    return {
      currentPage,
      nextPage,
      size,
      countPage,
      countFiltered: Number(countFiltered),
      countData: Number(countData),
    };
  }

  now(): string {
    return moment().tz(this.timezone).format(this.dateFormat);
  }

  formatDate(date: Date | string, format?: string): string {
    return moment(date)
      .tz(this.timezone)
      .format(format || this.dateFormat);
  }

  isValidDate(date: string): boolean {
    return moment(date, this.dateFormat, true).isValid();
  }

  addDays(date: Date | string, days: number): string {
    return moment(date)
      .tz(this.timezone)
      .add(days, 'days')
      .format(this.dateFormat);
  }

  subtractDays(date: Date | string, days: number): string {
    return moment(date)
      .tz(this.timezone)
      .subtract(days, 'days')
      .format(this.dateFormat);
  }
}
