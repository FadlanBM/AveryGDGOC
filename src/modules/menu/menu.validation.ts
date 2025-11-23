import { z } from 'zod';

export class MenuValidation {
  static readonly CREATE_MENU = z
    .object({
      name: z
        .string()
        .min(1, { message: 'nama menu wajib diisi' })
        .max(100, { message: 'nama menu maksimal 100 karakter' }),
      category: z.string().min(1, { message: 'kategori wajib diisi' }),
      calories: z
        .number({ message: 'input calories harus berupa angka' })
        .min(0, { message: 'kalori tidak boleh negatif' })
        .max(9999, { message: 'kalori maksimal 9999' }),
      price: z
        .number()
        .min(0, { message: 'harga tidak boleh negatif' })
        .max(999999999, { message: 'harga terlalu besar' }),
      ingredients: z
        .array(z.string())
        .min(1, { message: 'minimal harus ada 1 ingredient' })
        .max(20, { message: 'maksimal 20 ingredients' }),
      description: z
        .string()
        .min(1, { message: 'deskripsi wajib diisi' })
        .max(500, { message: 'deskripsi maksimal 500 karakter' }),
    })
    .refine(
      (data) => {
        return Object.values(data).every(
          (val) => val !== undefined && val !== null && val !== '',
        );
      },
      {
        message: 'Semua field wajib diisi',
        path: ['_form'],
      },
    );

  static readonly UPDATE_MENU = z.object({
    name: z
      .string()
      .min(1, { message: 'nama menu wajib diisi' })
      .max(100, { message: 'nama menu maksimal 100 karakter' })
      .refine((val) => val.trim().length > 0, {
        message: 'nama menu tidak boleh hanya spasi',
      })
      .optional(),

    category: z.string().min(1, { message: 'kategori wajib diisi' }).optional(),
    calories: z
      .number({ message: 'input calories harus berupa angka' })
      .min(0, { message: 'kalori tidak boleh negatif' })
      .max(9999, { message: 'kalori maksimal 9999' })
      .optional(),

    price: z
      .number()
      .min(0, { message: 'harga tidak boleh negatif' })
      .max(999999999, { message: 'harga terlalu besar' })
      .optional(),

    ingredients: z
      .array(z.string())
      .min(1, { message: 'minimal harus ada 1 ingredient' })
      .max(20, { message: 'maksimal 20 ingredients' })
      .optional(),

    description: z
      .string()
      .min(1, { message: 'deskripsi wajib diisi' })
      .max(500, { message: 'deskripsi maksimal 500 karakter' })
      .refine((val) => val.trim().length > 0, {
        message: 'deskripsi tidak boleh hanya spasi',
      })
      .optional(),
  });
}
