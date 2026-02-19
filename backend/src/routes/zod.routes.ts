import z from "zod";
export const exportSchema = z.object({

  isEmail: z.coerce.boolean().optional(),

  businessType: z.enum([
    "Developer Platform",
    "General Business",
    "B2B SaaS",
    "Consumer SaaS",
    "E-Commerce",
    "Service Business",
    "EdTech",
    "Agency",
    "Media/Blog",
  ]).optional(),

  minLeadScore: z.coerce.number().optional(),

  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),

  today: z.coerce.boolean().optional(),
  lastSevenDays: z.coerce.boolean().optional(),

});
export const scrapeSchema = z.object({
  urls: z.array(z.string().url()).min(1).max(100),
});

