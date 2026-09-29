import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Navigation() {
  const { t } = useTranslation('navigation');

  return (
    <nav className="z-10 mb-1 bg-white shadow-sm print:hidden">
      <div className="mx-auto px-4">
        <div className="flex h-20 justify-between">
          <div className="flex flex-1 justify-between gap-x-10">
            <div className="flex flex-shrink-0 items-center">
              <a href="/" className="group flex items-center space-x-2">
                <div className="relative">
                  <ShieldCheck
                    aria-hidden="true"
                    className="h-12 w-12 text-turkoosi transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="font-title flex flex-col font-bold tracking-wide text-slate-900">
                  <span className="text-2xl">{t('app_title')}</span>
                  <span className="text-xs font-medium sm:text-sm">
                    {t('app_subtitle')}
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
