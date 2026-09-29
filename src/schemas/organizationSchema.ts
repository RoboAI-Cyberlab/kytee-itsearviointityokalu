import { z } from "zod/v4";
import i18n from "@/i18n";

export const organizationFormSchema = z.object({
  respondent: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
  respondent_email: z
    .email({
      message: i18n.t('validation:email_invalid'),
    })
    .optional()
    .transform((val) => val?.trim()),
  respondent_phone: z
    .string()
    .optional()
    .transform((val) => val?.trim())
    .refine((val) => !val || /^[\d\s]+$/.test(val), {
      message: i18n.t('validation:phone_invalid'),
    }),
  participants: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
  dates: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
  notes: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
});

export const organizationInfoFormSchema = z.object({
  name: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
  business_id: z
    .string()
    .optional()
    .transform((val) => val?.trim())
    .refine((val) => !val || /^\d{7}-\d$/.test(val), {
      message: i18n.t('validation:business_id_invalid'),
    }),
  economic_area: z.string().min(1, {
    message: i18n.t('validation:economic_area_required'),
  }),
  description: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
  impact: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
});

export type OrganizationFormData = z.infer<typeof organizationFormSchema>;
export type OrganizationInfoFormData = z.infer<
  typeof organizationInfoFormSchema
>;
