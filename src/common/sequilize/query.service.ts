import { Injectable } from '@nestjs/common';

interface JoinClause {
  table: string;
  alias: string;
  on: string; // join condition, e.g., "main_table.id = join_table.main_id"
}

interface joinTableName {
  table: string;
  alias: string;
}

interface SelectQuery {
  tableName: joinTableName | string;
  where?: Record<string, any>;
  columns?: string[];
  limit?: number;
  offset?: number;
  order?: { field: string; direction: 'ASC' | 'DESC' }[];
  leftJoins?: JoinClause[];
}

@Injectable()
export class QueryService {
  SelectQuery({
    tableName,
    where = {},
    columns = ['*'],
    limit,
    offset,
    order,
    leftJoins = [],
  }: SelectQuery): { query: string; values: any[] } {
    const values: any[] = [];

    let query: string;
    if (typeof tableName === 'string') {
      query = `SELECT ${columns.join(', ')} FROM ${tableName}`;
    } else {
      query = `SELECT ${columns.join(', ')} FROM ${tableName.table} ${tableName.alias}`;
    }

    if (leftJoins && leftJoins.length > 0) {
      const joinClauses = leftJoins
        .map((join) => `LEFT JOIN ${join.table} ${join.alias} ON ${join.on}`)
        .join(' ');
      query += ` ${joinClauses}`;
    }

    if (Object.keys(where).length > 0) {
      const conditions = Object.entries(where)
        .map(([key, value]) => {
          if (value === null) {
            return `${key} IS NULL`;
          } else {
            values.push(value);
            return `${key} = ?`;
          }
        })
        .join(' AND ');

      query += ` WHERE ${conditions}`;
    }

    if (order && order.length > 0) {
      const orderBy = order.map((o) => `${o.field} ${o.direction}`).join(', ');

      query += ` ORDER BY ${orderBy}`;
    }

    if (limit !== undefined && offset !== undefined) {
      query += ` LIMIT ? OFFSET ?`;
      values.push(limit, offset);
    }

    return { query, values };
  }

  CountQuery({
    tableName,
    where = {},
    columns = ['*'],
    limit,
    offset,
    order,
    leftJoins = [],
  }: SelectQuery): { query: string; values: any[] } {
    let query: string;
    const values: any[] = [];

    if (typeof tableName === 'string') {
      query = `SELECT COUNT(${columns}) as count FROM ${tableName}`;
    } else {
      query = `SELECT COUNT(${columns}) as count FROM ${tableName.table} ${tableName.alias}`;
    }

    if (leftJoins && leftJoins.length > 0) {
      const joinClauses = leftJoins
        .map((join) => `LEFT JOIN ${join.table} ${join.alias} ON ${join.on}`)
        .join(' ');
      query += ` ${joinClauses}`;
    }

    if (Object.keys(where).length > 0) {
      const conditions = Object.entries(where)
        .map(([key, value]) => {
          if (value === null) {
            return `${key} IS NULL`;
          } else {
            values.push(value);
            return `${key} = ?`;
          }
        })
        .join(' AND ');

      query += ` WHERE ${conditions}`;
    }

    if (order && order.length > 0) {
      const orderBy = order.map((o) => `${o.field} ${o.direction}`).join(', ');

      query += ` ORDER BY ${orderBy}`;
    }

    if (limit !== undefined && offset !== undefined) {
      query += ` LIMIT ? OFFSET ?`;
      values.push(limit, offset);
    }

    return { query, values };
  }

  InsertQuery(tableName: string, data: object) {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data)
      .map(() => '?')
      .join(', ');
    const values = Object.values(data);

    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;

    return { query, values };
  }

  UpdateQuery(tableName: string, data: object, where: object) {
    const setClause = Object.entries(data)
      .map(([key, value]) => `${key} = ?`)
      .join(', ');

    const conditions = Object.entries(where)
      .map(([key, value]) => `${key} = ?`)
      .join(' AND ');

    const values = [...Object.values(data), ...Object.values(where)];
    const query = `UPDATE ${tableName} SET ${setClause} WHERE ${conditions}`;

    return { query, values };
  }

  DeleteQuery(tableName: string, where: object) {
    const conditions = Object.entries(where)
      .map(([key, value]) => `${key} = ?`)
      .join(' AND ');

    const values = Object.values(where);
    const query = `DELETE FROM ${tableName} WHERE ${conditions}`;

    return { query, values };
  }

  InsertQueryGetId(tableName: string, data: object) {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data)
      .map(() => '?')
      .join(', ');
    const values = Object.values(data);

    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING id`;

    return { query, values };
  }
}
