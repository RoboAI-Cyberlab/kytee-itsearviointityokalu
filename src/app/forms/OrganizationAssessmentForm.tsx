import { useEffect, useImperativeHandle, forwardRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useOrganizationStore } from "@/store/organizationStore";
import {
  organizationFormSchema,
  type OrganizationFormData,
} from "@/schemas/organizationSchema";

export interface OrganizationAssessmentFormRef {
  resetForm: (data: Partial<OrganizationFormData>) => void;
}

const OrganizationAssessmentForm = forwardRef<
  OrganizationAssessmentFormRef,
  {}
>((_props, ref) => {
  const { t } = useTranslation('forms');
  const organization = useOrganizationStore(
    useShallow((state) => state.organization),
  );
  const setOrganization = useOrganizationStore(
    useShallow((state) => state.setOrganization),
  );

  const form = useForm({
    resolver: zodResolver(organizationFormSchema),
    mode: "onBlur" as const,
    defaultValues: {
      respondent: organization.respondent || "",
      respondent_email: organization.respondent_email || "",
      respondent_phone: organization.respondent_phone || "",

      participants: organization.participants || "",
      dates: organization.dates || "",
      notes: organization.notes || "",
    },
  });

  // One-way sync: Form → Store only (no circular dependency)
  const watchedValues = form.watch();

  useEffect(() => {
    setOrganization(watchedValues);
  }, [watchedValues, setOrganization]);

  // Expose reset function to parent components
  useImperativeHandle(ref, () => ({
    resetForm: (data: Partial<OrganizationFormData>) => {
      form.reset({
        respondent: data.respondent || "",
        respondent_email: data.respondent_email || "",
        respondent_phone: data.respondent_phone || "",
        participants: data.participants || "",
        dates: data.dates || "",
        notes: data.notes || "",
      });
    },
  }));

  const onSubmit = (_data: any) => {};

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="respondent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('respondent_label')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-gray-20 focus-visible:ring-turkoosi"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="respondent_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('respondent_email_label')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      className="bg-gray-20 focus-visible:ring-turkoosi"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="respondent_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('respondent_phone_label')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      className="bg-gray-20 focus-visible:ring-turkoosi"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="participants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('participants_label')}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={2}
                    className="bg-gray-20 focus-visible:ring-turkoosi"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dates"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('assessment_dates_label')}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={2}
                    className="bg-gray-20 focus-visible:ring-turkoosi"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('notes_label')}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={2}
                    className="bg-gray-20 focus-visible:ring-turkoosi"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
});

OrganizationAssessmentForm.displayName = "OrganizationAssessmentForm";

export default OrganizationAssessmentForm;
