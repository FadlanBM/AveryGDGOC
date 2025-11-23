import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import {
  MenuRequest,
  MenuResponse,
  PaginatedMenuResponse,
  RepositoryMenuInputUpdate,
} from 'src/interface/menu.interface';
import { ResponseData } from 'src/interface/common.interface';

@Controller('api/menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Post('/')
  async registerMenu(
    @Body() request: MenuRequest,
  ): Promise<ResponseData<object>> {
    try {
      await this.menuService.CreateMenu(request);
      return {
        status: true,
        message: 'Pembuatan menu berhasil',
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('/search')
  async getMenuByName(
    @Query('q') name?: string,
    @Query('page') page?: string,
    @Query('per_page') per_page?: string,
  ): Promise<ResponseData<PaginatedMenuResponse>> {
    try {
      const result = await this.menuService.GetMenuByCategory(
        undefined, // category
        name, // name
        undefined, // min_price
        undefined, // max_price
        undefined, // max_cal
        page ? Number(page) : undefined, // page
        per_page ? Number(per_page) : undefined, // per_page
        undefined, // sortColumn
        undefined, // sort
      );
      return {
        status: true,
        message: 'Data menu berdasarkan filter berhasil diambil',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('/:id')
  async getMenuById(
    @Param('id') id: string,
  ): Promise<ResponseData<MenuResponse>> {
    try {
      const response = await this.menuService.GetBYIdMenu(id);
      return {
        status: true,
        message: 'Data menu berhasil diambil',
        data: response,
      };
    } catch (error) {
      throw error;
    }
  }

  @Put('/:id')
  async updateMenuById(
    @Param('id') id: string,
    @Body() request: RepositoryMenuInputUpdate,
  ): Promise<ResponseData<object>> {
    try {
      await this.menuService.UpdateByIDMenu(request, id);
      return {
        status: true,
        message: 'Pembaruan menu berhasil',
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete('/:id')
  async deleteMenuById(@Param('id') id: string): Promise<ResponseData<object>> {
    try {
      await this.menuService.DeleteByIDMenu(id);
      return {
        status: true,
        message: 'Penghapusan menu berhasil',
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('/')
  async getMenuByCategory(
    @Query('category') category?: string,
    @Query('q') name?: string,
    @Query('min_price') min_price?: string,
    @Query('max_price') max_price?: string,
    @Query('max_cal') max_cal?: string,
    @Query('page') page?: string,
    @Query('per_page') per_page?: string,
    @Query('sort') sort?: string,
  ): Promise<ResponseData<PaginatedMenuResponse>> {
    try {
      // Parse sort parameter in format "column:direction" (e.g., "price:asc")
      const parts = sort?.split(':');

      const sortColumn = parts?.[0];
      const sortDirection = parts?.[1];

      const validSort =
        parts &&
        parts.length === 2 &&
        (sortDirection === 'asc' || sortDirection === 'desc')
          ? (sortDirection as 'asc' | 'desc')
          : undefined;

      const result = await this.menuService.GetMenuByCategory(
        category,
        name,
        min_price ? Number(min_price) : undefined,
        max_price ? Number(max_price) : undefined,
        max_cal ? Number(max_cal) : undefined,
        page ? Number(page) : undefined,
        per_page ? Number(per_page) : undefined,
        sortColumn,
        validSort,
      );
      return {
        status: true,
        message: 'Data menu berdasarkan filter berhasil diambil',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }
}
