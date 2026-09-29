import 'i18next';

// Define the structure of our translation resources
declare module 'i18next' {
  interface InitOptions {
    showSupportNotice?: boolean;
  }

  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof import('../../public/locales/fi/common.json');
      validation: typeof import('../../public/locales/fi/validation.json');
      forms: typeof import('../../public/locales/fi/forms.json');
      pages: typeof import('../../public/locales/fi/pages.json');
      report: typeof import('../../public/locales/fi/report.json');
      navigation: typeof import('../../public/locales/fi/navigation.json');
    };
  }
}
