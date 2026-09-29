import { useEffect, useImperativeHandle, forwardRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useOrganizationStore } from "@/store/organizationStore";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import economic_areas from "@/data/economic_areas.json";
import {
  organizationInfoFormSchema,
  type OrganizationInfoFormData,
} from "@/schemas/organizationSchema";

export interface OrganizationInfoFormRef {
  resetForm: (data: Partial<OrganizationInfoFormData>) => void;
}

const OrganizationInfoForm = forwardRef<OrganizationInfoFormRef, {}>(
  (_props, ref) => {
    const { t } = useTranslation('forms');
    const organization = useOrganizationStore(
      useShallow((state) => state.organization),
    );
    const setOrganization = useOrganizationStore(
      useShallow((state) => state.setOrganization),
    );

    const form = useForm({
      resolver: zodResolver(organizationInfoFormSchema),
      mode: "onBlur" as const,
      defaultValues: {
        name: organization.name || "",
        business_id: organization.business_id || "",
        economic_area: organization.economic_area || "",
        description: organization.description || "",
        impact: organization.impact || "",
      },
    });

    // One-way sync: Form → Store only (no circular dependency)
    const watchedValues = form.watch();

    useEffect(() => {
      setOrganization(watchedValues);
    }, [watchedValues, setOrganization]);

    // Expose reset function to parent components
    useImperativeHandle(ref, () => ({
      resetForm: (data: Partial<OrganizationInfoFormData>) => {
        const currentValues = form.getValues();
        form.reset({
          name: data.name ?? currentValues.name ?? "",
          business_id: data.business_id ?? currentValues.business_id ?? "",
          economic_area:
            data.economic_area ?? currentValues.economic_area ?? "",
          description: data.description ?? currentValues.description ?? "",
          impact: data.impact ?? currentValues.impact ?? "",
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('organization_name_label')}</FormLabel>
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

              <FormField
                control={form.control}
                name="business_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('business_id_label')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t('business_id_placeholder')}
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
                name="economic_area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('economic_area_label')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-gray-20 focus:ring-turkoosi">
                          <SelectValue placeholder={t('economic_area_placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {economic_areas.codes.map((code) => (
                          <SelectItem key={code.key} value={code.value}>
                            {code.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('activity_description_label')}</FormLabel>
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
              name="impact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('societal_impact_label')}
                  </FormLabel>
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
  },
);

OrganizationInfoForm.displayName = "OrganizationInfoForm";

export default OrganizationInfoForm;
