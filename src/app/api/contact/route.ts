import { NextResponse } from "next/server";
import * as z from "zod";

const contactSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    topic: z.string().min(1),
    orderNumber: z.string().optional(),
    message: z.string().min(10),
  })
  .superRefine((data, ctx) => {
    if (data.topic === "order" && !data.orderNumber?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Order number is required for order support.",
        path: ["orderNumber"],
      });
    }
  });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid request data.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const ticketId = `AURA-${Date.now().toString(36).toUpperCase()}`;

  return NextResponse.json({
    success: true,
    data: {
      ticketId,
    },
  });
}
