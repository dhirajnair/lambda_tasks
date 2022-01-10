declare global {
    namespace NodeJS {
      interface ProcessEnv {
        CONTESTANT_LIST: string;
        VOTING_TIME_WINDOW: string;
        VOTING_TABLE: string;
        VOTING_RESULT_TABLE: string;
        ACCESS_KEY: string;
        NODE_ENV: 'development' | 'production'
      }
    }
  }
export {}