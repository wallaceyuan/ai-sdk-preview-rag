import type { NextApiRequest, NextApiResponse } from 'next';
import { sseErrRes } from '@fastgpt/service/common/response';
import { SseResponseEventEnum } from '@fastgpt/global/core/workflow/runtime/constants';
import { responseWrite } from '@fastgpt/service/common/response';
import { pushChatUsage } from '@/service/support/wallet/usage/push';
import { UsageSourceEnum } from '@fastgpt/global/support/wallet/usage/constants';
import type { UserChatItemValueItemType } from '@fastgpt/global/core/chat/type';
import { authApp } from '@fastgpt/service/support/permission/app/auth';
import { dispatchWorkFlow } from '@fastgpt/service/core/workflow/dispatch';
import { authCert } from '@fastgpt/service/support/permission/auth/common';
import { getUserChatInfoAndAuthTeamPoints } from '@/service/support/permission/auth/team';
import { RuntimeEdgeItemType } from '@fastgpt/global/core/workflow/type/edge';
import { RuntimeNodeItemType } from '@fastgpt/global/core/workflow/runtime/type';
import { removeEmptyUserInput } from '@fastgpt/global/core/chat/utils';
import { ReadPermissionVal } from '@fastgpt/global/support/permission/constant';
import { AppTypeEnum } from '@fastgpt/global/core/app/constants';
import {
  removePluginInputVariables,
  updatePluginInputByVariables
} from '@fastgpt/global/core/workflow/utils';
import { NextAPIStream } from '@/service/middleware/entry';
import { GPTMessages2Chats } from '@fastgpt/global/core/chat/adapt';
import { ChatCompletionMessageParam } from '@fastgpt/global/core/ai/type';
import { AppChatConfigType } from '@fastgpt/global/core/app/type';
import { NextRequest, NextResponse } from 'next/server'

export type Props = {
  messages: ChatCompletionMessageParam[];
  nodes: RuntimeNodeItemType[];
  edges: RuntimeEdgeItemType[];
  variables: Record<string, any>;
  appId: string;
  appName: string;
  chatConfig: AppChatConfigType;
};

function createYourReadableStream() {
  let controller: ReadableStreamDefaultController | null = null;

  // 用来写入数据的队列
  const queue: Uint8Array[] = [];
  let isClosed = false; // 标志流是否已关闭

  // 自定义事件机制
  const eventListeners: Record<string, ((...args: any[]) => void)[]> = {
    close: [],
    error: [],
    drain: []
  };

  // 定义 ReadableStream
  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl;

      // 将队列中的数据写入到流中
      while (queue.length > 0) {
        const chunk = queue.shift();
        if (chunk) {
          ctrl.enqueue(chunk);
        }
      }

      if (isClosed) {
        ctrl.close();
      }
    },
    cancel(reason) {
      console.log('Stream canceled:', reason);
      isClosed = true;
      triggerEvent('close'); // 触发关闭事件
    },
  });

  // 模拟 res 对象
  const res = {
    write(chunk: string | Uint8Array) {
      const encodedChunk = typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk;

      if (isClosed) {
        throw new Error("Cannot write to a closed stream.");
      }

      if (controller) {
        controller.enqueue(encodedChunk);
      } else {
        queue.push(encodedChunk); // 如果流还未初始化，将数据放入队列
      }

      return encodedChunk;
    },
    end() {
      if (!isClosed) {
        isClosed = true;
        if (controller) {
          controller.close();
        }
        triggerEvent('close'); // 触发关闭事件
      }
    },
    get closed() {
      return isClosed; // 提供 closed 属性，返回流状态
    },
    on(event: 'close' | 'error' | 'drain', callback: (...args: any[]) => void) {
      if (!eventListeners[event]) {
        throw new Error(`Unsupported event: ${event}`);
      }
      eventListeners[event].push(callback);
    },
    triggerError(err: Error) {
      triggerEvent('error', err); // 触发错误事件
      this.end();
    },
  };

  // 触发事件的工具函数
  function triggerEvent(event: string, ...args: any[]) {
    if (eventListeners[event]) {
      for (const listener of eventListeners[event]) {
        listener(...args);
      }
    }
  }

  return { stream, res };
}

// 模拟流式输出的 GET 路由

// export async function GET(req: NextRequest) {
//   const { stream, res } = createYourReadableStream();

//   // // 模拟异步写入数据
//   setTimeout(() => res.write('<p>Chunk 1</p>'), 100);
//   setTimeout(() => res.write('<p>Chunk 2</p>'), 200);
//   setTimeout(() => {
//     res.write('<p>Chunk 3</p>');
//     res.end();
//     console.log("Stream closed:", res.closed); // 输出流是否关闭
//   }, 300);

//   // 返回流作为响应
//   return new NextResponse(stream, {
//     headers: { 'Content-Type': 'text/html; charset=utf-8' },
//   });
// }

export async function GET(req:NextRequest) {

  // const aaa = new Promise(async(resolve, reject) => {
  //   let answer = '';

  //   const abortSignal = new AbortController();
  
  //   fetchEventSource('https://api.medtest.younggem.cn/v1/gpt/chat/completions', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsImlwIjoiIiwibmlja25hbWUiOiLoooHlnIYiLCJvcmdhbml6YXRpb25JZCI6MSwidHMiOjE3MzM3OTgyNTEsInVzZXJBZ2VudCI6IiIsInVzZXJuYW1lIjoiMTM2NzE4Nzk3MjMifQ.RYg5MlZa5gBB8FT1E_rmrInsyaf_wi9hM5T8AgmoE1E'
  //     },     
  //     body: JSON.stringify({"chatSession":"777","chatSessionId":"RuPEcYVhYuK-ySqIEiSyh","messages":[{"role":"user","content":"111"}]}),
  //     signal: abortSignal.signal,
  //     onmessage({ event, data }) {
  //       console.log('event, data event, data event, data event, data event, data ', event, data )
  //       if (data === '[DONE]') {
  //         return;
  //       }
  //       const jsonData = JSON.parse(data);
  //       answer += jsonData?.choices[0]?.delta?.content
  //     },
  //     async onopen(res) {
  //       console.log('res', res)
  //     },
  //     onclose() {
  //       console.log('oncloseonclose')
  //       resolve({
  //         formatResponse: {},
  //         rawResponse: answer,
  //       })
  //     },
  //     onerror(err) {
  //       console.log('onerroronerror', err)
  //       reject(err)
  //     },
  //   });
  // })

  // const result = await aaa;


  // // const result = await fetchStreamData({
  // //   url: 'https://api.medtest.younggem.cn/v1/gpt/chat/completions',
  // //   method: 'POST',
  // //   headers: {
  // //     authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsImlwIjoiIiwibmlja25hbWUiOiLoooHlnIYiLCJvcmdhbml6YXRpb25JZCI6MSwidHMiOjE3MzM3OTgyNTEsInVzZXJBZ2VudCI6IiIsInVzZXJuYW1lIjoiMTM2NzE4Nzk3MjMifQ.RYg5MlZa5gBB8FT1E_rmrInsyaf_wi9hM5T8AgmoE1E'
  // //   },
  // //   params: {},
  // //   body: {"chatSession":"777","chatSessionId":"RuPEcYVhYuK-ySqIEiSyh","messages":[{"role":"user","content":"111"}]}
  // // })

  // return NextResponse.json({
  //   body: result
  // });
}


async function handler(req: NextRequest): Promise<any> {

  const { stream, res } = createYourReadableStream();

  // res.on('close', () => {
  //   res.end();
  // });
  // res.on('error', () => {
  //   console.log('error: ', 'request error');
  //   res.end();
  // });

  let {
    nodes = [],
    edges = [],
    messages = [],
    variables = {},
    appName,
    appId,
    chatConfig
  } = await req.json() as Props;
  try {
    // [histories, user]
    const chatMessages = GPTMessages2Chats(messages);

    console.log('messages,', messages, 'chatMessages', chatMessages);
    const userInput = chatMessages.pop()?.value as UserChatItemValueItemType[] | undefined;

    /* user auth */
    const [{ app }] = await Promise.all([
      authApp({ req, authToken: true, appId, per: ReadPermissionVal }),
      // authCert({
      //   req,
      //   authToken: true
      // })
    ]);

    const teamId = '6711e80e6a345036775bf96e'
    const tmbId = '6711e80e6a345036775bf970'
    const isPlugin = app.type === AppTypeEnum.plugin;

    if (!Array.isArray(nodes)) {
      throw new Error('Nodes is not array');
    }
    if (!Array.isArray(edges)) {
      throw new Error('Edges is not array');
    }

    // console.log('isPluginisPluginisPluginisPlugin', isPlugin);
    // Plugin need to replace inputs
    if (isPlugin) {
      nodes = updatePluginInputByVariables(nodes, variables);
      variables = removePluginInputVariables(variables, nodes);
    } else {
      if (!userInput) {
        throw new Error('Params Error');
      }
    }

    // auth balance
    // const { user } = await getUserChatInfoAndAuthTeamPoints(tmbId);

    const user = {
      _id: "6711e80e6a345036775bf968",
      timezone: 'Asia/Shanghai'
    }
    console.log('useruseruseruser', user);

    /* start process */
    const { flowResponses, flowUsages } = await dispatchWorkFlow({
      res,
      authorization: req.headers.get('authorization'),
      requestOrigin: req.headers.get('origin') as any,
      mode: 'test',
      teamId,
      tmbId,
      user,
      app,
      runtimeNodes: nodes,
      runtimeEdges: edges,
      variables,
      query: removeEmptyUserInput(userInput),
      chatConfig,
      histories: chatMessages,
      stream: true,
      detail: true,
      maxRunTimes: 200
    });

    console.log('----------------------------------');
    console.log('flowResponses: ', flowResponses);

    responseWrite({
      res,
      event: SseResponseEventEnum.answer,
      data: '[DONE]'
    });

    responseWrite({
      res,
      event: SseResponseEventEnum.flowResponses,
      data: JSON.stringify(flowResponses)
    });

    res.end();

    pushChatUsage({
      appName,
      appId,
      teamId,
      tmbId,
      source: UsageSourceEnum.fastgpt,
      flowUsages
    });

    return stream

  } catch (err: any) {
    // res.status(500);
    sseErrRes(res, err);
    NextResponse.json({
      body: {
        code: 500,
        error: err,
        url: req.url
      }
    });
    res.end();
  }
}

async function handler2(){
  const { stream, res } = createYourReadableStream();

  // // 模拟异步写入数据
  setTimeout(() => res.write('<p>Chunk 1</p>'), 100);
  setTimeout(() => res.write('<p>Chunk 2</p>'), 200);
  setTimeout(() => {
    res.write('<p>Chunk 3</p>');
    res.end();
    console.log("Stream closed:", res.closed); // 输出流是否关闭
  }, 300);

  // 返回流作为响应
  return new NextResponse(stream, {
    headers: { 'Content-Type': 'text/event-stream;charset=utf-8' },
  });
}


export async function POST(req: NextRequest) {
  return NextAPIStream(handler)(req)
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    },
    responseLimit: '20mb'
  }
};

