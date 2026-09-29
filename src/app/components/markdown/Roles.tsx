import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Roles({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation('common');

  return (
    <aside className="mt-6 rounded-md border border-turkoosi/10 bg-turkoosi/5 p-4 [&>:first-child]:mt-0 [&_li]:leading-[1.4] [&_ul_li]:marker:!text-foreground">
      <div className="flex flex-row items-center gap-2">
        <Users className="h-6 w-6" />
        <h2 className="my-0 text-lg font-semibold">{t('participant_roles')}</h2>
      </div>
      {children}
    </aside>
  );
}
