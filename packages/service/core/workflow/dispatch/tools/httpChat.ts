import type { ModuleDispatchProps } from '@fastgpt/global/core/workflow/runtime/type';
import {
  NodeInputKeyEnum,
  NodeOutputKeyEnum,
  WorkflowIOValueTypeEnum
} from '@fastgpt/global/core/workflow/constants';

import {
  DispatchNodeResponseKeyEnum,
  SseResponseEventEnum
} from '@fastgpt/global/core/workflow/runtime/constants';
import axios from 'axios';
import { formatHttpError, valueTypeFormat } from '../utils';
import { SERVICE_LOCAL_HOST } from '../../../../common/system/tools';
import { addLog } from '../../../../common/system/log';
import { DispatchNodeResultType } from '@fastgpt/global/core/workflow/runtime/type';
import { getErrText } from '@fastgpt/global/common/error/utils';
import { responseWrite } from '../../../../common/response';
import { textAdaptGptResponse } from '@fastgpt/global/core/workflow/runtime/utils';
import { getSystemPluginCb } from '../../../../../plugins/register';

import type { NextApiResponse } from 'next';
import type {
  StreamChatType
} from '@fastgpt/global/core/ai/type.d';
import { responseWriteController } from '../../../../common/response';


type PropsArrType = {
  key: string;
  type: string;
  value: string;
};
type HttpRequestProps = ModuleDispatchProps<{
  [NodeInputKeyEnum.abandon_httpUrl]: string;
  [NodeInputKeyEnum.httpMethod]: string;
  [NodeInputKeyEnum.httpReqUrl]: string;
  [NodeInputKeyEnum.httpHeaders]: PropsArrType[];
  [NodeInputKeyEnum.httpParams]: PropsArrType[];
  [NodeInputKeyEnum.httpJsonBody]: string;
  [NodeInputKeyEnum.addInputParam]: Record<string, any>;
  [key: string]: any;
}>;
type HttpResponse = DispatchNodeResultType<{
  [NodeOutputKeyEnum.error]?: object;
  [key: string]: any;
}>;

const UNDEFINED_SIGN = 'UNDEFINED_SIGN';


export const dispatchHttpChatRequest = async (props: HttpRequestProps): Promise<HttpResponse> => {
  let {
    res,
    detail,
    app: { _id: appId },
    chatId,
    stream,
    responseChatItemId,
    variables,
    node: { outputs },
    histories,
    authorization,
    params: {
      system_httpMethod: httpMethod = 'POST',
      system_httpReqUrl: httpReqUrl,
      system_httpHeader: httpHeader,
      system_httpParams: httpParams = [],
      system_httpJsonBody: httpJsonBody,
      [NodeInputKeyEnum.addInputParam]: dynamicInput,
      ...body
    }
  } = props;

  if (!httpReqUrl) {
    return Promise.reject('Http url is empty');
  }

  const systemVariables = {
    appId,
    chatId,
    responseChatItemId,
    histories: histories?.slice(-10) || []
  };

  const concatVariables = {
    ...variables,
    ...body,
    // ...dynamicInput,
    ...systemVariables,
    authorization
  };

  const allVariables = {
    [NodeInputKeyEnum.addInputParam]: concatVariables,
    ...concatVariables
  };

  httpReqUrl = replaceVariable(httpReqUrl, allVariables);

  // parse header
  const headers = await (() => {
    try {
      if (!httpHeader || httpHeader.length === 0) return {};
      // array
      return httpHeader.reduce((acc: Record<string, string>, item) => {
        const key = replaceVariable(item.key, allVariables);
        const value = replaceVariable(item.value, allVariables);
        acc[key] = valueTypeFormat(value, WorkflowIOValueTypeEnum.string);
        return acc;
      }, {});
    } catch (error) {
      return Promise.reject('Header 为非法 JSON 格式');
    }
  })();
  const params = httpParams.reduce((acc: Record<string, string>, item) => {
    const key = replaceVariable(item.key, allVariables);
    const value = replaceVariable(item.value, allVariables);
    acc[key] = valueTypeFormat(value, WorkflowIOValueTypeEnum.string);
    return acc;
  }, {});


  const requestBody = await (() => {
    if (!httpJsonBody) return {};
    try {
      httpJsonBody = replaceVariable(httpJsonBody, allVariables);
      const jsonParse = JSON.parse(httpJsonBody);
      const removeSignJson = removeUndefinedSign(jsonParse);
      return removeSignJson;
    } catch (error) {
      console.log(error);
      return Promise.reject(`Invalid JSON body: ${httpJsonBody}`);
    }
  })();

  try {
    const { formatResponse, rawResponse } = await (async () => {
      const systemPluginCb = await getSystemPluginCb();
      if (systemPluginCb[httpReqUrl]) {
        const pluginResult = await systemPluginCb[httpReqUrl](requestBody);
        return {
          formatResponse: pluginResult,
          rawResponse: pluginResult
        };
      }
      return await fetchStreamData({
        method: httpMethod,
        url: httpReqUrl,
        headers,
        body: requestBody,
        params,
        res,
        detail
      });
    })();

    // format output value type
    const results: Record<string, any> = {};
    for (const key in formatResponse) {
      const output = outputs.find((item) => item.key === key);
      if (!output) continue;
      results[key] = valueTypeFormat(formatResponse[key], output.valueType);
    }

    if (stream && typeof formatResponse[NodeOutputKeyEnum.answerText] === 'string') {
      responseWrite({
        res,
        event: detail ? SseResponseEventEnum.fastAnswer : undefined,
        data: textAdaptGptResponse({
          text: formatResponse[NodeOutputKeyEnum.answerText]
        })
      });
    }

    return {
      [DispatchNodeResponseKeyEnum.nodeResponse]: {
        totalPoints: 0,
        params: Object.keys(params).length > 0 ? params : undefined,
        body: Object.keys(requestBody).length > 0 ? requestBody : undefined,
        headers: Object.keys(headers).length > 0 ? headers : undefined,
        httpResult: rawResponse
      },
      [DispatchNodeResponseKeyEnum.toolResponses]:
        Object.keys(results).length > 0 ? results : rawResponse,
      [NodeOutputKeyEnum.httpRawResponse]: rawResponse,
      ...results
    };
  } catch (error) {
    addLog.error('Http request error', error);

    return {
      [NodeOutputKeyEnum.error]: formatHttpError(error),
      [DispatchNodeResponseKeyEnum.nodeResponse]: {
        params: Object.keys(params).length > 0 ? params : undefined,
        body: Object.keys(requestBody).length > 0 ? requestBody : undefined,
        headers: Object.keys(headers).length > 0 ? headers : undefined,
        httpResult: { error: formatHttpError(error) }
      },
      [NodeOutputKeyEnum.httpRawResponse]: getErrText(error)
    };
  }
};

async function fetchStreamData({
  res,
  method,
  url,
  headers,
  body,
  params,
  detail
}: {
  res: NextApiResponse;
  method: string;
  url: string;
  headers: Record<string, any>;
  body: Record<string, any>;
  params: Record<string, any>;
  detail: boolean;
}) {

 return new Promise(async(resolve, reject) => {

    let answerText = '';

    // 使用 axios 发起请求并获取响应
    const response = await axios({
      method: method,
      url: url,
      headers,
      data: body,
      params: params,
      responseType: 'stream' // 确保响应是流的形式
    });

    const stream = response.data;

    const write = responseWriteController({
      res,
      readStream: stream
    });

    console.log('params?.show ', params?.show , typeof params?.show )
    
    stream.on('data', (chunk) => {
      try {
        // if (res.closed) {
        //   stream.controller?.abort();
        //   return;
        // }
        if(chunk === ''  || chunk === 'data: [DONE]'){
          return;
        }
        const str = chunk.toString('utf8');
        console.log('strstrstrstrstrstrstr', str)
        const jsonData = JSON.parse(str.replace('data: ', '').trim());
        if (jsonData.choices && jsonData.choices.length > 0) {
          const content = jsonData.choices[0].delta.content;
          if (content) {
            answerText += content
            responseWrite({
              write,
              event: params?.show === 'true' ? SseResponseEventEnum.answer : undefined,
              data: textAdaptGptResponse({
                text: content
              })
            });
          }
        }
      } catch (error) {
        console.error('Failed to parse chunk:', chunk );
      }
    });
  
    // 通过监听 'end' 事件来处理流结束的情况
    stream.on('end', () => {
      console.log('Stream ended');
      
      resolve({
        formatResponse: answerText,
        rawResponse: answerText
      })
    });
  
    // 处理可能的错误
    stream.on('error', (err) => {
      console.error("Stream error:", err);
      reject('stream error')
    });
 })
}


function replaceVariable(text: string, obj: Record<string, any>) {
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      text = text.replace(new RegExp(`{{(${key})}}`, 'g'), UNDEFINED_SIGN);
    } else {
      const replacement = JSON.stringify(value);
      const unquotedReplacement =
        replacement.startsWith('"') && replacement.endsWith('"')
          ? replacement.slice(1, -1)
          : replacement;
      text = text.replace(new RegExp(`{{(${key})}}`, 'g'), unquotedReplacement);
    }
  }
  return text || '';
}
function removeUndefinedSign(obj: Record<string, any>) {
  for (const key in obj) {
    if (obj[key] === UNDEFINED_SIGN) {
      obj[key] = undefined;
    } else if (Array.isArray(obj[key])) {
      obj[key] = obj[key].map((item: any) => {
        if (item === UNDEFINED_SIGN) {
          return undefined;
        } else if (typeof item === 'object') {
          removeUndefinedSign(item);
        }
        return item;
      });
    } else if (typeof obj[key] === 'object') {
      removeUndefinedSign(obj[key]);
    }
  }
  return obj;
}
