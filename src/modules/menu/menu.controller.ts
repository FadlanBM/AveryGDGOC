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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiInvalidInputResponse,
  ApiSuccessResponse,
  ApiNotFoundResponse,
} from 'src/swagger.response';

@ApiTags('Menu')
@Controller('api/menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Post('/')
  @ApiOperation({
    summary: 'Create new menu',
    description:
      'Create a new menu item with name, category, calories, price, ingredients, and description',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'name',
        'category',
        'calories',
        'price',
        'ingredients',
        'description',
      ],
      properties: {
        name: {
          type: 'string',
          example: 'Nasi Goreng Special',
          description: 'Menu name',
        },
        category: {
          type: 'string',
          example: 'Main Course',
          description: 'Menu category',
        },
        calories: {
          type: 'number',
          example: 450,
          description: 'Calories content',
        },
        price: {
          type: 'number',
          example: 25000,
          description: 'Menu price in IDR',
        },
        ingredients: {
          type: 'array',
          items: { type: 'string' },
          example: ['nasi', 'telur', 'ayam', 'bawang merah', 'kecap'],
          description: 'List of ingredients',
        },
        description: {
          type: 'string',
          example: 'Nasi goreng dengan bumbu spesial dan topping ayam',
          description: 'Menu description',
        },
      },
    },
  })
  @ApiSuccessResponse()
  @ApiInvalidInputResponse()
  async registerMenu(
    @Body() request: MenuRequest,
  ): Promise<ResponseData<MenuResponse>> {
    try {
      const data = await this.menuService.CreateMenu(request);
      return {
        message: 'Pembuatan menu berhasil',
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('/search')
  @ApiOperation({
    summary: 'Search menu by name',
    description: 'Search menu items by name with pagination support',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search query for menu name',
    example: 'nasi',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'per_page',
    required: false,
    description: 'Items per page (default: 10)',
    example: 10,
  })
  @ApiSuccessResponse()
  @ApiInvalidInputResponse()
  async getMenuByName(
    @Query('q') name?: string,
    @Query('page') page?: string,
    @Query('per_page') per_page?: string,
  ): Promise<ResponseData<MenuResponse[]>> {
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
        message: 'Data menu berdasarkan filter berhasil diambil',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get menu by ID',
    description: 'Retrieve a single menu item by its unique ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Menu UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiSuccessResponse()
  @ApiInvalidInputResponse()
  @ApiNotFoundResponse()
  async getMenuById(
    @Param('id') id: string,
  ): Promise<ResponseData<MenuResponse>> {
    try {
      const response = await this.menuService.GetBYIdMenu(id);
      return {
        message: 'Data menu berhasil diambil',
        data: response,
      };
    } catch (error) {
      throw error;
    }
  }

  @Put('/:id')
  @ApiOperation({
    summary: 'Update menu by ID',
    description: 'Update an existing menu item. All fields are optional.',
  })
  @ApiParam({
    name: 'id',
    description: 'Menu UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Nasi Goreng Special Updated',
          description: 'Menu name (optional)',
        },
        category: {
          type: 'string',
          example: 'Main Course',
          description: 'Menu category (optional)',
        },
        calories: {
          type: 'number',
          example: 500,
          description: 'Calories content (optional)',
        },
        price: {
          type: 'number',
          example: 30000,
          description: 'Menu price in IDR (optional)',
        },
        ingredients: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'nasi',
            'telur',
            'ayam',
            'bawang merah',
            'kecap',
            'saus tiram',
          ],
          description: 'List of ingredients (optional)',
        },
        description: {
          type: 'string',
          example:
            'Nasi goreng dengan bumbu spesial, topping ayam dan saus tiram',
          description: 'Menu description (optional)',
        },
      },
    },
  })
  @ApiSuccessResponse()
  @ApiInvalidInputResponse()
  async updateMenuById(
    @Param('id') id: string,
    @Body() request: RepositoryMenuInputUpdate,
  ): Promise<ResponseData<MenuResponse>> {
    try {
      const data = await this.menuService.UpdateByIDMenu(request, id);
      return {
        message: 'Pembaruan menu berhasil',
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete menu by ID',
    description: 'Soft delete a menu item (sets deleted_at timestamp)',
  })
  @ApiParam({
    name: 'id',
    description: 'Menu UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiSuccessResponse()
  @ApiInvalidInputResponse()
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
  @ApiOperation({
    summary: 'Get menus with filters',
    description:
      'Retrieve menu items with optional filters for category, name, price range, calories, pagination, and sorting',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by category',
    example: 'Main Course',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search by menu name',
    example: 'nasi',
  })
  @ApiQuery({
    name: 'min_price',
    required: false,
    description: 'Minimum price filter',
    example: 10000,
  })
  @ApiQuery({
    name: 'max_price',
    required: false,
    description: 'Maximum price filter',
    example: 50000,
  })
  @ApiQuery({
    name: 'max_cal',
    required: false,
    description: 'Maximum calories filter',
    example: 500,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'per_page',
    required: false,
    description: 'Items per page (default: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: 'Sort by column and direction (format: column:direction)',
    example: 'price:asc',
    schema: {
      type: 'string',
      enum: [
        'price:asc',
        'price:desc',
        'name:asc',
        'name:desc',
        'calories:asc',
        'calories:desc',
        'category:asc',
        'category:desc',
      ],
    },
  })
  @ApiSuccessResponse()
  @ApiInvalidInputResponse()
  async getMenuByCategory(
    @Query('category') category?: string,
    @Query('q') name?: string,
    @Query('min_price') min_price?: string,
    @Query('max_price') max_price?: string,
    @Query('max_cal') max_cal?: string,
    @Query('page') page?: string,
    @Query('per_page') per_page?: string,
    @Query('sort') sort?: string,
  ): Promise<ResponseData<MenuResponse[]>> {
    try {
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
        message: 'Data menu berdasarkan filter berhasil diambil',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }
}
