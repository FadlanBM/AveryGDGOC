import { Injectable, NotFoundException } from '@nestjs/common';
import { HelperService } from 'src/common/helper/helper.service';
import { QueryService } from 'src/common/sequilize/query.service';
import { SequelizeService } from 'src/common/sequilize/sequilize.service';
import { Pagination } from 'src/interface/common.interface';
import {
  MenuRequest,
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

  async createMenu(menu: RepositoryMenuInput): Promise<MenuResponse> {
    try {
      const { query: insertQuery, values: replacements } =
        this.generateQuery.InsertQueryGetId('public.menu', {
          name: menu.name,
          category: menu.category,
          calories: menu.calories,
          price: menu.price,
          ingredients: menu.ingredients.join('|'),
          description: menu.description,
        });

      const result: any = await this.sequelizeService.insert(insertQuery, {
        replacements,
      });

      const insertedId =
        Array.isArray(result) &&
        result.length > 0 &&
        Array.isArray(result[0]) &&
        result[0].length > 0
          ? result[0][0].id
          : null;

      if (!insertedId) {
        throw new Error('Failed to get inserted menu ID');
      }

      return {
        id: insertedId,
        name: menu.name,
        category: menu.category,
        calories: menu.calories,
        price: menu.price,
        ingredients: menu.ingredients,
        description: menu.description,
      };
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
          't.created_at',
          't.updated_at',
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
      throw new NotFoundException(`Menu with id ${id} not found`);
    }

    return {
      ...menu,
      price: Number(menu.price),
      calories: Number(menu.calories),
      ingredients:
        menu.ingredients && typeof menu.ingredients === 'string'
          ? menu.ingredients.split('|')
          : menu.ingredients || [],
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
          't.created_at',
          't.updated_at',
        ],
        where: { 't.deleted_at': null },
      });

    const result = await this.sequelizeService.select(selectQuery, {
      replacements,
    });

    // Handle null or undefined result
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return [];
    }

    const menus = Array.isArray(result) ? result : [result];

    return menus
      .filter((menu) => menu !== null && menu !== undefined)
      .map((menu: any) => ({
        ...menu,
        price: Number(menu.price),
        calories: Number(menu.calories),
        ingredients:
          menu.ingredients && typeof menu.ingredients === 'string'
            ? menu.ingredients.split('|')
            : menu.ingredients || [],
      })) as MenuResponse[];
  }

  async updateMenuByID(
    menu: RepositoryMenuInputUpdate,
    id: string,
  ): Promise<MenuResponse> {
    try {
      const { query: updateQuery, values: replacements } =
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
          { id, deleted_at: null },
        );

      await this.sequelizeService.update(updateQuery, {
        replacements,
      });

      // Fetch dan return data yang sudah diupdate
      const updatedMenu = await this.getMenuBYID(id);
      return updatedMenu;
    } catch (error) {
      throw new Error(error.parent?.message || 'Failed to update menu');
    }
  }

  async getMenuByCategory(
    category?: string,
    name?: string,
    min_price?: number,
    max_price?: number,
    max_cal?: number,
    page: number = 1,
    per_page: number = 10,
    sortColumn?: string,
    sort?: 'asc' | 'desc',
  ): Promise<{
    data: MenuResponse[];
    pagination: Pagination;
  }> {
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
          't.created_at',
          't.updated_at',
        ],
        where: whereConditions,
      });

    let finalQuery = selectQuery;
    let finalReplacements = [...replacements];

    if (min_price !== undefined && max_price !== undefined) {
      // Both min and max price provided - use BETWEEN
      if (finalQuery.includes('WHERE')) {
        finalQuery += ` AND t.price BETWEEN ? AND ?`;
      } else {
        finalQuery += ` WHERE t.price BETWEEN ? AND ?`;
      }
      finalReplacements.push(min_price, max_price);
    } else if (min_price !== undefined) {
      // Only min price provided - use >=
      if (finalQuery.includes('WHERE')) {
        finalQuery += ` AND t.price >= ?`;
      } else {
        finalQuery += ` WHERE t.price >= ?`;
      }
      finalReplacements.push(min_price);
    } else if (max_price !== undefined) {
      // Only max price provided - use <=
      if (finalQuery.includes('WHERE')) {
        finalQuery += ` AND t.price <= ?`;
      } else {
        finalQuery += ` WHERE t.price <= ?`;
      }
      finalReplacements.push(max_price);
    }

    if (max_cal) {
      if (finalQuery.includes('WHERE')) {
        finalQuery += ` AND t.calories <= ?`;
      } else {
        finalQuery += ` WHERE t.calories <= ?`;
      }
      finalReplacements.push(max_cal);
    }

    // Add name filter using LIKE for partial matching
    if (name) {
      if (finalQuery.includes('WHERE')) {
        finalQuery += ` AND LOWER(t.name) LIKE LOWER(?)`;
      } else {
        finalQuery += ` WHERE LOWER(t.name) LIKE LOWER(?)`;
      }
      finalReplacements.push(`%${name}%`);
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

    // Add sorting with column validation
    if (sortColumn && sort && (sort === 'asc' || sort === 'desc')) {
      // Whitelist allowed columns to prevent SQL injection
      const allowedColumns = ['name', 'category', 'calories', 'price'];
      if (allowedColumns.includes(sortColumn)) {
        finalQuery += ` ORDER BY t.${sortColumn} ${sort.toUpperCase()}`;
      }
    }

    // Add pagination
    const offset = (page - 1) * per_page;
    finalQuery += ` LIMIT ? OFFSET ?`;
    finalReplacements.push(per_page, offset);

    const result = await this.sequelizeService.select(finalQuery, {
      replacements: finalReplacements,
    });

    // Handle null or undefined result
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return {
        data: [],
        pagination: {
          total: 0,
          page: 0,
          per_page: 0,
          total_pages: 0,
          next_page: null,
        },
      };
    }

    const menus = Array.isArray(result) ? result : [result];

    const data = menus
      .filter((menu) => menu !== null && menu !== undefined)
      .map((menu: any) => ({
        ...menu,
        price: Number(menu.price),
        calories: Number(menu.calories),
        ingredients:
          menu.ingredients && typeof menu.ingredients === 'string'
            ? menu.ingredients.split('|')
            : menu.ingredients || [],
      })) as MenuResponse[];

    const totalPages = Math.ceil(Number(total) / per_page);
    const pagination = {
      total: Number(total),
      page,
      per_page,
      total_pages: totalPages,
      next_page: page < totalPages ? page + 1 : null,
    };

    return { data, pagination };
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

  async getCountCategory(): Promise<object> {
    const query = `
      SELECT
        t.category,
        COUNT(*) as count
      FROM public.menu t
      WHERE t.deleted_at IS NULL
      GROUP BY t.category
      ORDER BY t.category ASC
    `;

    try {
      const result: any = await this.sequelizeService.select(query, {
        replacements: [],
      });

      if (!result || (Array.isArray(result) && result.length === 0)) {
        return {};
      }

      const categoryCounts: { [key: string]: number } = {};

      if (Array.isArray(result)) {
        result.forEach((item: { category: string; count: string | number }) => {
          categoryCounts[item.category] = parseInt(String(item.count));
        });
      } else {
        categoryCounts[result.category] = parseInt(String(result.count));
      }

      return categoryCounts;
    } catch (error: any) {
      throw new Error(
        error?.message ||
          error?.parent?.message ||
          'Failed to get category counts',
      );
    }
  }

  async getDataByID(limit_category: number): Promise<object> {
    const query = `
      SELECT
        t.id,
        t.name,
        t.category,
        t.calories,
        t.price,
        t.ingredients,
        t.description,
        t.created_at,
        t.updated_at
      FROM public.menu t
      WHERE t.deleted_at IS NULL
      ORDER BY t.category ASC, t.name ASC
    `;

    try {
      const result: any = await this.sequelizeService.select(query, {
        replacements: [],
      });

      if (!result || (Array.isArray(result) && result.length === 0)) {
        return {};
      }

      const menusByCategory: { [key: string]: any[] } = {};
      const menus = Array.isArray(result) ? result : [result];

      menus.forEach((menu: any) => {
        const category = menu.category;

        // Create array for category if it doesn't exist
        if (!menusByCategory[category]) {
          menusByCategory[category] = [];
        }

        // Check if category limit is reached
        if (menusByCategory[category].length >= limit_category) {
          return; // Skip this menu if limit is reached for this category
        }

        // Transform menu data to MenuResponse format
        const menuData = {
          id: menu.id,
          name: menu.name,
          category: menu.category,
          calories: Number(menu.calories),
          price: Number(menu.price),
          ingredients:
            menu.ingredients && typeof menu.ingredients === 'string'
              ? menu.ingredients.split('|')
              : menu.ingredients || [],
          description: menu.description,
          created_at: menu.created_at,
          updated_at: menu.updated_at,
        };

        // Add menu to its category array
        menusByCategory[category].push(menuData);
      });

      return menusByCategory;
    } catch (error: any) {
      throw new Error(
        error?.message ||
          error?.parent?.message ||
          'Failed to get menus by category',
      );
    }
  }
}
