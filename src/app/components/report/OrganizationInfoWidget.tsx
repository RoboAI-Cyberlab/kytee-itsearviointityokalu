import { Fragment } from "react";
import {
  Building2,
  Briefcase,
  User,
  FileText,
  Calendar,
  Users,
  NotebookPen,
  Factory,
  Mail,
  Smartphone,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useOrganizationStore } from "@/store/organizationStore";
import { useTranslation } from "react-i18next";

/**
 * OrganizationInfoWidget is a component that displays the organization information.
 * It is used to display the organization information in the report page.
 */
export default function OrganizationInfoWidget() {
  const { t } = useTranslation('report');
  const { organization } = useOrganizationStore();

  const isEmptyTable = Object.values(organization).every((value) => !value);
  if (isEmptyTable) return null;

  const organizationInfo = [
    { label: t('organization_name'), value: organization.name, icon: Building2 },
    { label: t('business_id'), value: organization.business_id, icon: Briefcase },
    {
      label: t('economic_area'),
      value: organization.economic_area,
      icon: Factory,
    },
    { label: t('respondent'), value: organization.respondent, icon: User },
    {
      label: t('respondent_email'),
      value: organization.respondent_email,
      icon: Mail,
    },
    {
      label: t('respondent_phone'),
      value: organization.respondent_phone,
      icon: Smartphone,
    },
    { label: t('participants'), value: organization.participants, icon: Users },
    {
      label: t('assessment_dates'),
      value: organization.dates,
      icon: Calendar,
    },
    {
      label: t('activity_description'),
      value: organization.description,
      icon: FileText,
    },
    {
      label: t('activity_impact'),
      value: organization.impact,
      icon: FileText,
    },
    { label: t('notes'), value: organization.notes, icon: NotebookPen },
  ];

  return (
    <div className="flex w-full flex-col gap-4 print:break-before-page">
      <div className="flex flex-col gap-2 px-2">
        <h2 className="text-xl font-semibold">{t('organization_info_title')}</h2>
      </div>

      <Card className="w-full border-none p-2 text-sm shadow-sm print:shadow-none">
        <CardContent className="p-0">
          <dl className="divide-y">
            {organizationInfo.map((row, i) => (
              <Fragment key={i}>
                {row.value && (
                  <div
                    key={row.label}
                    className="grid items-start gap-4 p-2 sm:grid-cols-3"
                  >
                    <dt className="flex items-center gap-2 font-medium">
                      <row.icon className="h-4 w-4" />
                      {row.label}
                    </dt>
                    <dd className="sm:col-span-2">{row.value || "-"}</dd>
                  </div>
                )}
              </Fragment>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
