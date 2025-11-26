import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MenuRepository } from './menu.repository';
import { ValidationService } from 'src/common/validation.service';
import { MenuValidation } from './menu.validation';
import z, { ZodError } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import {
  MenuResponse,
  PaginatedMenuResponse,
} from 'src/interface/menu.interface';
import { Pagination } from 'src/interface/common.interface';
import { GeminiService } from 'src/common/gemini/gemini.service';

type MenuRequest = z.infer<typeof MenuValidation.CREATE_MENU>;
type MenuUpdateRequest = z.infer<typeof MenuValidation.UPDATE_MENU>;

@Injectable()
export class MenuService {
  private readonly logger = new Logger(MenuService.name);

  constructor(
    private readonly validationService: ValidationService,
    private readonly menuRepository: MenuRepository,
    private geminiService: GeminiService,
  ) {}

  async CreateMenu(menuRequest: MenuRequest): Promise<MenuResponse> {
    try {
      const validatedMenu =
        this.validationService.validateWithZodError<MenuRequest>(
          MenuValidation.CREATE_MENU,
          menuRequest,
        );
      const description = await this.geminiService.generateMenuDescription(
        validatedMenu.name,
        validatedMenu.category,
        validatedMenu.ingredients,
        validatedMenu.calories,
      );

      validatedMenu.description = description;

      const response = await this.menuRepository.createMenu(validatedMenu);

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

  async getRecommendationMenu(preferences: {
    maxCalories?: number;
    category?: string;
    dietaryRestrictions?: string[];
    mood?: string;
  }): Promise<{
    recommendations: any[];
    reasoning: string;
  }> {
    try {
      const menus = await this.menuRepository.getMenu();
      const result = await this.geminiService.getMenuRecommendations(
        menus,
        preferences,
      );
      return result;
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

      if (!menu || Object.keys(menu).length === 0) {
        throw new NotFoundException({
          message: 'Menu tidak ditemukan dengan filter yang diberikan',
        });
      }
      return menu;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          status: false,
          message: 'Gagal mengambil menu',
          errors: Array.isArray(error.message)
            ? error.message
            : [error.message],
        });
      }
      throw new BadRequestException({
        status: false,
        message: 'Gagal mengambil menu',
        errors: Array.isArray(error.message) ? error.message : [error.message],
      });
    }
  }

  async UpdateByIDMenu(
    menuRequest: MenuUpdateRequest,
    id: string,
  ): Promise<MenuResponse> {
    try {
      const validatedMenu =
        this.validationService.validateWithZodError<MenuUpdateRequest>(
          MenuValidation.UPDATE_MENU,
          menuRequest,
        );

      const response = await this.menuRepository.updateMenuByID(
        validatedMenu,
        id,
      );
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
        message: 'Gagal mengupdate menu',
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

  async GetCountCategory(): Promise<object> {
    try {
      const result = await this.menuRepository.getCountCategory();

      if (!result || Object.keys(result).length === 0) {
        throw new NotFoundException({
          message: 'Category tidak ditemukan dengan filter yang diberikan',
        });
      }

      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException({
        message: 'Gagal mengambil Category berdasarkan filter',
        errors: Array.isArray(error.message) ? error.message : [error.message],
      });
    }
  }

  async getDataByCategory(per_category: number): Promise<object> {
    try {
      const result = await this.menuRepository.getDataByID(per_category);

      if (!result || Object.keys(result).length === 0) {
        throw new NotFoundException({
          message: 'Category tidak ditemukan dengan filter yang diberikan',
        });
      }

      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException({
        message: 'Gagal mengambil Category berdasarkan filter',
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
  ): Promise<{
    data: MenuResponse[];
    pagination: Pagination;
  }> {
    try {
      const response = await this.menuRepository.getMenuByCategory(
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

      if (!response.data || response.data.length === 0) {
        throw new NotFoundException({
          message: 'Menu tidak ditemukan dengan filter yang diberikan',
        });
      }

      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException({
        message: 'Gagal mengambil menu berdasarkan filter',
        errors: Array.isArray(error.message) ? error.message : [error.message],
      });
    }
  }

  generateMenuId(): string {
    return uuidv4();
  }
}
