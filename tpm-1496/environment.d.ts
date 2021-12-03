declare global {
    namespace NodeJS {
      interface ProcessEnv {
        FLAGGED_WORD_LIST: string;
        NODE_ENV: 'development' | 'production';
        TOPIC_ARN: string
      }
    }
  }
export {}