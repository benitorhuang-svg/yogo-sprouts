import { z } from 'zod';

export const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(1, '姓名為必填'),
    phone: z.string().min(1, '電話為必填'),
    contact: z.string().min(1, '聯絡方式為必填'),
    address: z.string().min(1, '地址為必填'),
  }),
  cart: z.record(z.string(), z.number().positive()),
  couponCode: z.string().optional().nullable(),
  preferred_delivery_date: z.string().optional().nullable(),
});

export const couponQuerySchema = z.object({
  code: z.string().min(1, '請提供優惠碼'),
});

export const paymentCreateSchema = z.object({
  orderId: z.string().min(1, '請提供 orderId'),
  amount: z.number().positive('amount 必須為正數'),
});
