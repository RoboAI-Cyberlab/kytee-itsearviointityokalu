import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/store/appStore";
import { useAssessmentStore } from "@/store/assessmentStore";
import { useTranslation } from "react-i18next";

import {
  BookOpen,
  Building2,
  Circle,
  CircleCheckBig,
  Download,
  ExternalLink,
  PieChart,
  Trash,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  name: string;
  button_label?: string;
  to: string;
  icon: LucideIcon;
};

/**
 * Returns the navigation items for the app.
 * @returns The navigation items for the app.
 */
export const useNavigation = () => {
  const { t } = useTranslation('navigation');

  const model = useAppStore((state) => state.model);
  const domainCompletionStatus = useAssessmentStore(
    useShallow((state) => state.domainCompletionStatus),
  );

  const domains = model || [];

  const introPages = [
    {
      name: t('intro'),
      to: "/intro",
      icon: BookOpen,
    },
    {
      name: t('organization'),
      button_label: t('organization_info'),
      to: "/organization",
      icon: Building2,
    },
    {
      name: t('assessment_models'),
      button_label: t('choose_model'),
      to: "/models",
      icon: ClipboardList,
    },
  ];

  const resultPages = [
    {
      name: t('results'),
      button_label: t('show_results'),
      to: "/report",
      icon: PieChart,
    },
    {
      name: t('save_assessment'),
      to: "/export",
      icon: Download,
    },
    {
      name: t('delete_answers'),
      to: "/delete",
      icon: Trash,
    },
  ];

  const infoPages = [
    {
      name: t('info'),
      to: "#",
      icon: ExternalLink,
      isActive: false,
      items: [
        {
          name: t('about_service'),
          to: "https://www.roboai.fi/tutkimus-ja-tuotekehitys/projektit/kytee/itsearviointityokalu",
          external: true,
        },
        {
          name: t('kytee_project'),
          to: "https://www.roboai.fi/tutkimus-ja-tuotekehitys/projektit/kytee/",
          external: true,
        },
        {
          name: t('privacy'),
          to: "https://www.roboai.fi/tutkimus-ja-tuotekehitys/projektit/kytee/itsearviointityokalu/tietosuoja",
          external: true,
        },
        {
          name: t('accessibility'),
          to: "https://www.roboai.fi/tutkimus-ja-tuotekehitys/projektit/kytee/itsearviointityokalu/saavutettavuus",
          external: true,
        },
        {
          name: t('license'),
          to: "https://www.roboai.fi/tutkimus-ja-tuotekehitys/projektit/kytee/itsearviointityokalu/lisenssiehdot",
          external: true,
        },
      ],
    },
  ];

  const domainPages = domains.map((domain) => ({
    name: domain.short,
    to: `/${domain.id.toLowerCase()}`,
    icon: domainCompletionStatus[domain.id] ? CircleCheckBig : Circle,
  }));

  return {
    introPages,
    domainPages,
    resultPages,
    infoPages,
  };
};
