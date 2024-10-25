import { getSystemInitData } from '@/web/common/system/api';
import { delay } from '@fastgpt/global/common/system/utils';
import type { FastGPTFeConfigsType } from '@fastgpt/global/common/system/types/index.d';

import { useSystemStore } from './useSystemStore';

export const clientInitData = async (
  retry = 3
): Promise<{
  feConfigs: FastGPTFeConfigsType;
}> => {
  try {
    const res = {
      "feConfigs": {
          "lafEnv": "https://laf.dev",
          "show_emptyChat": true,
          "show_git": true,
          "docUrl": "https://doc.fastgpt.in",
          "openAPIDocUrl": "https://doc.fastgpt.in/docs/development/openapi",
          "systemTitle": "FastGPT",
          "concatMd": "项目开源地址: [FastGPT GitHub](https://github.com/labring/FastGPT)\n交流群: ![](https://oss.laf.run/htr4n1-images/fastgpt-qr-code.jpg)",
          "limit": {
              "exportDatasetLimitMinutes": 0,
              "websiteSyncLimitMinuted": 0
          },
          "scripts": [],
          "favicon": "/favicon.ico",
          "uploadFileMaxSize": 500,
          "isPlus": false
      },
      "llmModels": [
          {
              "model": "gpt-4-tutbo",
              "name": "gpt-4-tutbo",
              "avatar": "/imgs/model/openai.svg",
              "maxContext": 125000,
              "maxResponse": 16000,
              "quoteMaxToken": 120000,
              "maxTemperature": 1.2,
              "charsPointsPrice": 0,
              "censor": false,
              "vision": true,
              "datasetProcess": true,
              "usedInClassify": true,
              "usedInExtractFields": true,
              "usedInToolCall": true,
              "usedInQueryExtension": true,
              "toolChoice": true,
              "functionCall": false,
              "customCQPrompt": "",
              "customExtractPrompt": "",
              "defaultSystemChatPrompt": "",
              "defaultConfig": {},
              "fieldMap": {}
          },
          {
              "model": "gpt-4o",
              "name": "gpt-4o",
              "avatar": "/imgs/model/openai.svg",
              "maxContext": 125000,
              "maxResponse": 4000,
              "quoteMaxToken": 120000,
              "maxTemperature": 1.2,
              "charsPointsPrice": 0,
              "censor": false,
              "vision": true,
              "datasetProcess": true,
              "usedInClassify": true,
              "usedInExtractFields": true,
              "usedInToolCall": true,
              "usedInQueryExtension": true,
              "toolChoice": true,
              "functionCall": false,
              "customCQPrompt": "",
              "customExtractPrompt": "",
              "defaultSystemChatPrompt": "",
              "defaultConfig": {},
              "fieldMap": {}
          },
          {
              "model": "gpt-3.5-turbo",
              "name": "gpt-3.5-turbo",
              "avatar": "/imgs/model/openai.svg",
              "maxContext": 125000,
              "maxResponse": 65000,
              "quoteMaxToken": 120000,
              "maxTemperature": 1.2,
              "charsPointsPrice": 0,
              "censor": false,
              "vision": false,
              "datasetProcess": true,
              "usedInClassify": true,
              "usedInExtractFields": true,
              "usedInToolCall": true,
              "usedInQueryExtension": true,
              "toolChoice": false,
              "functionCall": false,
              "customCQPrompt": "",
              "customExtractPrompt": "",
              "defaultSystemChatPrompt": "",
              "defaultConfig": {
                  "temperature": 1,
                  "stream": false
              },
              "fieldMap": {
                  "max_tokens": "max_completion_tokens"
              }
          }
      ],
      "vectorModels": [
          {
              "model": "text-embedding-ada-002",
              "name": "Embedding-2",
              "avatar": "/imgs/model/openai.svg",
              "charsPointsPrice": 0,
              "defaultToken": 700,
              "maxToken": 3000,
              "weight": 100,
              "defaultConfig": {},
              "dbConfig": {},
              "queryConfig": {}
          },
          {
              "model": "text-embedding-3-large",
              "name": "text-embedding-3-large",
              "avatar": "/imgs/model/openai.svg",
              "charsPointsPrice": 0,
              "defaultToken": 512,
              "maxToken": 3000,
              "weight": 100,
              "defaultConfig": {
                  "dimensions": 1024
              }
          },
          {
              "model": "text-embedding-3-small",
              "name": "text-embedding-3-small",
              "avatar": "/imgs/model/openai.svg",
              "charsPointsPrice": 0,
              "defaultToken": 512,
              "maxToken": 3000,
              "weight": 100
          }
      ],
      "reRankModels": [],
      "whisperModel": {
          "model": "whisper-1",
          "name": "Whisper1",
          "charsPointsPrice": 0
      },
      "audioSpeechModels": [
          {
              "model": "tts-1",
              "name": "OpenAI TTS1",
              "charsPointsPrice": 0,
              "voices": [
                  {
                      "label": "Alloy",
                      "value": "alloy",
                      "bufferId": "openai-Alloy"
                  },
                  {
                      "label": "Echo",
                      "value": "echo",
                      "bufferId": "openai-Echo"
                  },
                  {
                      "label": "Fable",
                      "value": "fable",
                      "bufferId": "openai-Fable"
                  },
                  {
                      "label": "Onyx",
                      "value": "onyx",
                      "bufferId": "openai-Onyx"
                  },
                  {
                      "label": "Nova",
                      "value": "nova",
                      "bufferId": "openai-Nova"
                  },
                  {
                      "label": "Shimmer",
                      "value": "shimmer",
                      "bufferId": "openai-Shimmer"
                  }
              ]
          }
      ],
      "systemVersion": "4.8.5"
    }

    useSystemStore.getState().initStaticData(res);

    return {
      feConfigs: res.feConfigs || {}
    };
  } catch (error) {
    if (retry > 0) {
      await delay(500);
      return clientInitData(retry - 1);
    }
    return Promise.reject(error);
  }
};
