export enum Language {
  PYTHON = 'python',
  CPP = 'c++',
  JAVASCRIPT = 'javascript',
}

export const LanguageVersions: Record<Language, string> = {
  [Language.PYTHON]: '3.10.0',
  [Language.CPP]: '10.2.0',
  [Language.JAVASCRIPT]: '18.15.0',
};
