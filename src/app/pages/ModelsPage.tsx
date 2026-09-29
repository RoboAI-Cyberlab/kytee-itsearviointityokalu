import { useTranslation, Trans } from "react-i18next";
import { PageLayout } from "../components/PageLayout";
import PaginationBlock from "@/app/components/blocks/PaginationBlock";
import ModelSelectorBlock from "@/app/components/blocks/ModelSelectorBlock";
import { ExternalLink } from "@/app/components/utils/ExternalLink";

export default function ModelsPage() {
  const { t, i18n } = useTranslation('pages');

  return (
    <PageLayout showRightPanel={false}>
      <div className="flex max-w-5xl flex-col gap-4" id="main-content">
        <div className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-semibold">{t('models_title')}</h1>
          <p className="text-sm">
            <Trans
              i18nKey="models_description"
              ns="pages"
              key={i18n.language}
              components={{
                ncscLink: <ExternalLink href="https://www.kyberturvallisuuskeskus.fi/fi"><></></ExternalLink>,
                cybermeterLink: <ExternalLink href="https://www.kyberturvallisuuskeskus.fi/fi/palvelumme/tilannekuva-ja-verkostojohtaminen/kybermittari"><></></ExternalLink>,
              }}
            />
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">{t('models_select_title')}</h2>

          <p className="mb-4 text-sm">
            {t('models_select_description')}
          </p>

          <ModelSelectorBlock />
        </div>

        <PaginationBlock />
      </div>
    </PageLayout>
  );
}
