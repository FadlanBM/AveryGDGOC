import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { MenuRepository } from './menu.repository';
import { ValidationService } from 'src/common/validation.service';
import { MenuValidation } from './menu.validation';
import z, { ZodError } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import {
  MenuResponse,
  PaginatedMenuResponse,
} from 'src/interface/menu.interface';

type MenuRequest = z.infer<typeof MenuValidation.CREATE_MENU>;
type MenuUpdateRequest = z.infer<typeof MenuValidation.UPDATE_MENU>;

@Injectable()
export class MenuService {
  private readonly logger = new Logger(MenuService.name);

  constructor(
    private readonly validationService: ValidationService,
    private readonly menuRepository: MenuRepository,
  ) {}

  async CreateMenu(menuRequest: MenuRequest): Promise<MenuRequest> {
    try {
      const validatedMenu =
        this.validationService.validateWithZodError<MenuRequest>(
          MenuValidation.CREATE_MENU,
          menuRequest,
        );

      const id = this.generateMenuId();

      const response = await this.menuRepository.createMenu({
        uuid: id,
        ...validatedMenu,
      });

      return response;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          status: false,
          message: 'Validasi input tidak terpenuhi',
          errors: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      throw new BadRequestException({
        status: false,
        message: 'Gagal membuat menu',
        errors: Array.isArray(error.message) ? error.message : [error.message],
      });
    }
  }

  async GetAllMenu(): Promise<MenuResponse[]> {
    try {
      const menus = await this.menuRepository.getMenu();
      return menus;
    } catch (error) {
      throw new BadRequestException({
        status: false,
        message: 'Gagal mengambil daftar menu',
        errors: Array.isArray(error.message) ? error.message : [error.message],
      });
    }
  }

  async GetBYIdMenu(id: string): Promise<MenuResponse> {
    try {
      const menu = await this.menuRepository.getMenuBYID(id);
      return menu;
    } catch (error) {
      throw new BadRequestException({
        status: false,
        message: 'Gagal mengambil menu',
        errors: Array.isArray(error.message) ? error.message : [error.message],
      });
    }
  }

  async UpdateByIDMenu(menuRequest: MenuUpdateRequest, id: string) {
    try {
      const validatedMenu =
        this.validationService.validateWithZodError<MenuUpdateRequest>(
          MenuValidation.UPDATE_MENU,
          menuRequest,
        );

      await this.menuRepository.updateMenuByID(validatedMenu, id);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          status: false,
          message: 'Validasi input tidak terpenuhi',
          errors: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      throw new BadRequestException({
        status: false,
        message: 'Gagal membuat menu',
        errors: Array.isArray(error.message) ? error.message : [error.message],
      });
    }
  }

  async DeleteByIDMenu(id: string) {
    try {
      await this.menuRepository.deleteMenuByID(id);
    } catch (error) {
      throw new BadRequestException({
        status: false,
        message: 'Gagal menghapus menu',
        errors: Array.isArray(error.message) ? error.message : [error.message],
      });
    }
  }

  async GetMenuByCategory(
    category?: string,
    name?: string,
    min_price?: number,
    max_price?: number,
    max_cal?: number,
    page?: number,
    per_page?: number,
    sortColumn?: string,
    sort?: 'asc' | 'desc',
  ): Promise<PaginatedMenuResponse> {
    try {
      const result = await this.menuRepository.getMenuByCategory(
        category,
        name,
        min_price,
        max_price,
        max_cal,
        page,
        per_page,
        sortColumn,
        sort,
      );
      return result;
    } catch (error) {
      throw new BadRequestException({
        status: false,
        message: 'Gagal mengambil menu berdasarkan filter',
        errors: Array.isArray(error.message) ? error.message : [error.message],
      });
    }
  }

  generateMenuId(): string {
    return uuidv4();
  }
}
