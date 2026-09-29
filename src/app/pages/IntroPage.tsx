import { Link } from "@tanstack/react-router";
import { CircleCheckBig, GitCompareArrowsIcon } from "lucide-react";
import { PageLayout } from "../components/PageLayout";
import PaginationBlock from "@/app/components/blocks/PaginationBlock";
import { ExternalLink } from "@/app/components/utils/ExternalLink";
import { useTranslation } from "react-i18next";
/**
 * Intro page component
 * @returns Intro page component
 */
export default function IntroPage() {
  const { t } = useTranslation('pages');

  return (
    <PageLayout showRightPanel={false}>
      <div className="flex max-w-5xl flex-col gap-4" id="main-content">
        <div className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-semibold">
            {t('intro_welcome_title')}
          </h1>

          <h2 className="text-lg font-semibold">
            {t('intro_data_processing_title')}
          </h2>

          <div className="rounded-md border border-turkoosi/20 bg-turkoosi/10 p-4">
            <div className="flex">
              <div className="shrink-0">
                <CircleCheckBig className="h-9 w-9 text-[#375e5a]" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-[#375e5a]">
                  <p>
                    <span className="font-bold">{t('intro_assessment_tool_label')} </span>
                    {t('intro_assessment_tool_text')}{" "}
                    <Link
                      className="cursor-pointer font-semibold hover:underline"
                      to="/delete"
                      preload="intent"
                    >
                      {t('intro_delete_link')}
                    </Link>{" "}
                    {t('intro_browser_history_text')}{" "}
                    <span className="font-semibold">
                      {t('intro_device_warning')}
                    </span>{" "}
                    {t('intro_privacy_text')}{" "}
                    <ExternalLink
                      className="text-[#375e5a]"
                      href="https://www.roboai.fi/tutkimus-ja-tuotekehitys/projektit/kytee/itsearviointityokalu/tietosuoja"
                    >
                      {t('intro_privacy_link')}
                    </ExternalLink>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold">
              {t('intro_about_title')}
            </h2>

            <p className="mb-4 text-sm">
              {t('intro_about_text')}{" "}
              <ExternalLink href="https://www.kyberturvallisuuskeskus.fi/fi">
                {t('intro_about_ncsc')}
              </ExternalLink>{" "}
              {t('intro_about_text2')}{" "}
              <ExternalLink href="https://www.kyberturvallisuuskeskus.fi/fi/palvelumme/tilannekuva-ja-verkostojohtaminen/kybermittari">
                {t('intro_about_cybermeter')}
              </ExternalLink>
              {t('intro_about_text3')}
            </p>

            <p className="text-sm">
              {t('intro_about_sections_text')}
            </p>

            <p className="mt-4 text-sm">
              {t('intro_mapping_disclaimer_first')}{" "}
              <GitCompareArrowsIcon className="mx-0.5 inline h-4 w-4 align-text-bottom" />
              {" "}{t('intro_mapping_disclaimer_text')}
            </p>

            <h3 className="pb-2 pt-4 text-lg font-semibold">{t('intro_how_to_use_title')}</h3>

            <ol className="list-inside list-decimal space-y-2 pl-4 text-sm">
              <li>{t('intro_how_step1')}</li>
              <li>{t('intro_how_step2')}</li>
              <li>{t('intro_how_step3')}</li>
              <li>{t('intro_how_step4')}</li>
              <li>{t('intro_how_step5')}</li>
              <li>{t('intro_how_step6')}</li>
              <li>{t('intro_how_step7')}</li>
            </ol>

            <h3 className="pb-2 pt-4 text-lg font-semibold">
              {t('intro_after_title')}
            </h3>

            <ol className="list-inside list-decimal space-y-2 pl-4 text-sm">
              <li>{t('intro_after_step1')}</li>
              <li>{t('intro_after_step2')}</li>
            </ol>

          </div>
        </div>

        <PaginationBlock />
      </div>
    </PageLayout>
  );
}
