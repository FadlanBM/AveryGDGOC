import { Injectable } from '@nestjs/common';
import { HelperService } from 'src/common/helper/helper.service';
import { QueryService } from 'src/common/sequilize/query.service';
import { SequelizeService } from 'src/common/sequilize/sequilize.service';
import {
  MenuResponse,
  PaginatedMenuResponse,
  RepositoryMenuInput,
  RepositoryMenuInputUpdate,
} from 'src/interface/menu.interface';

@Injectable()
export class MenuRepository {
  constructor(
    private readonly sequelizeService: SequelizeService,
    private readonly generateQuery: QueryService,
    private readonly helperService: HelperService,
  ) {}

  async createMenu(menu: RepositoryMenuInput) {
    try {
      const { query: selectQuery, values: replacements } =
        this.generateQuery.InsertQuery('public.menu', {
          id: menu.uuid,
          name: menu.name,
          category: menu.category,
          calories: menu.calories,
          price: menu.price,
          ingredients: menu.ingredients.join('|'),
          description: menu.description,
        });

      await this.sequelizeService.select(selectQuery, {
        replacements,
      });
    } catch (error) {
      throw new Error(error.parent?.message || 'Failed to create menu');
    }
  }

  async getMenuBYID(id: string): Promise<MenuResponse> {
    const { query: selectQuery, values: replacements } =
      this.generateQuery.SelectQuery({
        tableName: { table: 'public.menu', alias: 't' },
        columns: [
          't.id',
          't.name',
          't.category',
          't.calories',
          't.price',
          't.ingredients',
          't.description',
        ],
        where: { id, 't.deleted_at': null },
        limit: 1,
      });

    const result = await this.sequelizeService.select(selectQuery, {
      replacements,
    });

    // Handle both array and single object results
    const menu: any = Array.isArray(result) ? result[0] : result;

    if (!menu) {
      throw new Error(`Menu with id ${id} not found`);
    }

    // Transform ingredients string to array
    return {
      ...menu,
      ingredients:
        typeof menu.ingredients === 'string'
          ? menu.ingredients.split('|')
          : menu.ingredients,
    } as MenuResponse;
  }

  async getMenu(): Promise<MenuResponse[]> {
    const { query: selectQuery, values: replacements } =
      this.generateQuery.SelectQuery({
        tableName: { table: 'public.menu', alias: 't' },
        columns: [
          't.id',
          't.name',
          't.category',
          't.calories',
          't.price',
          't.ingredients',
          't.description',
        ],
        where: { 't.deleted_at': null },
      });

    const result = await this.sequelizeService.select(selectQuery, {
      replacements,
    });

    const menus = Array.isArray(result) ? result : [result];

    return menus.map((menu: any) => ({
      ...menu,
      ingredients:
        typeof menu.ingredients === 'string'
          ? menu.ingredients.split('|')
          : menu.ingredients,
    })) as MenuResponse[];
  }

  async updateMenuByID(menu: RepositoryMenuInputUpdate, id: string) {
    try {
      const { query: selectQuery, values: replacements } =
        this.generateQuery.UpdateQuery(
          'public.menu',
          {
            name: menu.name,
            category: menu.category,
            calories: menu.calories,
            price: menu.price,
            ingredients: menu.ingredients?.join('|'),
            description: menu.description,
          },
          { id, 't.deleted_at': null },
        );

      await this.sequelizeService.update(selectQuery, {
        replacements,
      });
    } catch (error) {
      throw new Error(error.parent?.message || 'Failed to create menu');
    }
  }

  async getMenuByCategory(
    category?: string,
    min_price?: number,
    max_price?: number,
    max_cal?: number,
    page: number = 1,
    per_page: number = 10,
    sort?: 'asc' | 'desc',
  ): Promise<PaginatedMenuResponse> {
    console.log(sort);

    const whereConditions: any = { 't.deleted_at': null };

    if (category) {
      whereConditions.category = category;
    }

    const { query: selectQuery, values: replacements } =
      this.generateQuery.SelectQuery({
        tableName: { table: 'public.menu', alias: 't' },
        columns: [
          't.id',
          't.name',
          't.category',
          't.calories',
          't.price',
          't.ingredients',
          't.description',
        ],
        where: whereConditions,
      });

    let finalQuery = selectQuery;
    let finalReplacements = [...replacements];

    if (min_price !== undefined && max_price !== undefined) {
      if (finalQuery.includes('WHERE')) {
        finalQuery += ` AND t.price BETWEEN ? AND ?`;
      } else {
        finalQuery += ` WHERE t.price BETWEEN ? AND ?`;
      }
      finalReplacements.push(min_price, max_price);
    }

    if (max_cal) {
      if (finalQuery.includes('WHERE')) {
        finalQuery += ` AND t.calories <= ?`;
      } else {
        finalQuery += ` WHERE t.calories <= ?`;
      }
      finalReplacements.push(max_cal);
    }

    // Get total count before applying pagination and sorting
    const countQuery = finalQuery.replace(
      /SELECT .+ FROM/,
      'SELECT COUNT(*) as total FROM',
    );
    const countResult: any = await this.sequelizeService.select(countQuery, {
      replacements: finalReplacements,
    });
    const total = Array.isArray(countResult)
      ? countResult[0].total
      : countResult.total;

    // Add sorting
    if (sort && (sort === 'asc' || sort === 'desc')) {
      finalQuery += ` ORDER BY t.price ${sort.toUpperCase()}`;
    }

    // Add pagination
    const offset = (page - 1) * per_page;
    finalQuery += ` LIMIT ? OFFSET ?`;
    finalReplacements.push(per_page, offset);

    const result = await this.sequelizeService.select(finalQuery, {
      replacements: finalReplacements,
    });

    const menus = Array.isArray(result) ? result : [result];

    const data = menus.map((menu: any) => ({
      ...menu,
      ingredients:
        typeof menu.ingredients === 'string'
          ? menu.ingredients.split('|')
          : menu.ingredients,
    })) as MenuResponse[];

    return {
      data,
      total: Number(total),
      page,
      per_page,
      total_pages: Math.ceil(Number(total) / per_page),
    };
  }

  async deleteMenuByID(id: string) {
    try {
      const { query: selectQuery, values: replacements } =
        this.generateQuery.UpdateQuery(
          'public.menu',
          { deleted_at: this.helperService.now() },
          { id },
        );

      await this.sequelizeService.update(selectQuery, {
        replacements,
      });
    } catch (error) {
      throw new Error(error.parent?.message || 'Failed to create menu');
    }
  }
}
