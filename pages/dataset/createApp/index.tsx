import { defaultAppTemplates } from '@/web/core/app/templates'
import { workflowTemplates } from '@/web/core/app/templates'
import { Button } from 'antd';


const mockData = {
  "_id": "674967558b40c209de39587a",
  "parentId": null,
  "teamId": "6711e80e6a345036775bf96e",
  "tmbId": "6711e80e6a345036775bf970",
  "name": "http",
  "type": "advanced",
  "version": "v2",
  "avatar": "/imgs/app/avatar/workflow.svg",
  "intro": "",
  "teamTags": [],
  "modules": [
    {
      "nodeId": "userGuide",
      "name": "系统配置",
      "intro": "可以配置应用的系统参数",
      "avatar": "core/workflow/template/systemConfig",
      "flowNodeType": "userGuide",
      "position": {
        "x": -85.22924550312273,
        "y": -519.1406501861675
      },
      "version": "481",
      "inputs": [
        {
          "key": "welcomeText",
          "renderTypeList": [
            "hidden"
          ],
          "valueType": "string",
          "label": "core.app.Welcome Text",
          "value": ""
        },
        {
          "key": "variables",
          "renderTypeList": [
            "hidden"
          ],
          "valueType": "any",
          "label": "core.app.Chat Variable",
          "value": []
        },
        {
          "key": "questionGuide",
          "valueType": "boolean",
          "renderTypeList": [
            "hidden"
          ],
          "label": "core.app.Question Guide",
          "value": false
        },
        {
          "key": "tts",
          "renderTypeList": [
            "hidden"
          ],
          "valueType": "any",
          "label": "",
          "value": {
            "type": "web"
          }
        },
        {
          "key": "whisper",
          "renderTypeList": [
            "hidden"
          ],
          "valueType": "any",
          "label": "",
          "value": {
            "open": false,
            "autoSend": false,
            "autoTTSResponse": false
          }
        },
        {
          "key": "scheduleTrigger",
          "renderTypeList": [
            "hidden"
          ],
          "valueType": "any",
          "label": "",
          "value": null
        }
      ],
      "outputs": []
    },
    {
      "nodeId": "448745",
      "name": "流程开始",
      "intro": "",
      "avatar": "core/workflow/template/workflowStart",
      "flowNodeType": "workflowStart",
      "position": {
        "x": 312.4269006796242,
        "y": -436.4176957581167
      },
      "version": "481",
      "inputs": [
        {
          "key": "userChatInput",
          "renderTypeList": [
            "reference",
            "textarea"
          ],
          "valueType": "string",
          "label": "用户问题",
          "required": true,
          "toolDescription": "用户问题"
        }
      ],
      "outputs": [
        {
          "id": "userChatInput",
          "key": "userChatInput",
          "label": "common:core.module.input.label.user question",
          "type": "static",
          "valueType": "string"
        }
      ]
    },
    {
      "nodeId": "lUEOfOtTQCCT",
      "name": "HTTP 请求",
      "intro": "可以发出一个 HTTP 请求，实现更为复杂的操作（联网搜索、数据库查询等）",
      "avatar": "core/workflow/template/httpRequest",
      "flowNodeType": "httpRequest468",
      "showStatus": true,
      "position": {
        "x": 632.9242298013008,
        "y": -503.57650536588943
      },
      "version": "481",
      "inputs": [
        {
          "key": "system_addInputParam",
          "renderTypeList": [
            "addInputParam"
          ],
          "valueType": "dynamic",
          "label": "",
          "required": false,
          "description": "core.module.input.description.HTTP Dynamic Input",
          "customInputConfig": {
            "selectValueTypeList": [
              "string",
              "number",
              "boolean",
              "object",
              "arrayString",
              "arrayNumber",
              "arrayBoolean",
              "arrayObject",
              "any",
              "chatHistory",
              "datasetQuote",
              "dynamic",
              "selectApp",
              "selectDataset"
            ],
            "showDescription": false,
            "showDefaultValue": true
          }
        },
        {
          "key": "system_httpMethod",
          "renderTypeList": [
            "custom"
          ],
          "valueType": "string",
          "label": "",
          "value": "POST",
          "required": true
        },
        {
          "key": "system_httpReqUrl",
          "renderTypeList": [
            "hidden"
          ],
          "valueType": "string",
          "label": "",
          "description": "core.module.input.description.Http Request Url",
          "placeholder": "https://api.ai.com/getInventory",
          "required": false
        },
        {
          "key": "system_httpHeader",
          "renderTypeList": [
            "custom"
          ],
          "valueType": "any",
          "value": [],
          "label": "",
          "description": "core.module.input.description.Http Request Header",
          "placeholder": "core.module.input.description.Http Request Header",
          "required": false
        },
        {
          "key": "system_httpParams",
          "renderTypeList": [
            "hidden"
          ],
          "valueType": "any",
          "value": [],
          "label": "",
          "required": false
        },
        {
          "key": "system_httpJsonBody",
          "renderTypeList": [
            "hidden"
          ],
          "valueType": "any",
          "value": "",
          "label": "",
          "required": false
        }
      ],
      "outputs": [
        {
          "id": "system_addOutputParam",
          "key": "system_addOutputParam",
          "type": "dynamic",
          "valueType": "dynamic",
          "label": "",
          "customFieldConfig": {
            "selectValueTypeList": [
              "string",
              "number",
              "boolean",
              "object",
              "arrayString",
              "arrayNumber",
              "arrayBoolean",
              "arrayObject",
              "any",
              "chatHistory",
              "datasetQuote",
              "dynamic",
              "selectApp",
              "selectDataset"
            ],
            "showDescription": false,
            "showDefaultValue": false
          }
        },
        {
          "id": "error",
          "key": "error",
          "label": "请求错误",
          "description": "HTTP请求错误信息，成功时返回空",
          "valueType": "object",
          "type": "static"
        },
        {
          "id": "httpRawResponse",
          "key": "httpRawResponse",
          "label": "原始响应",
          "required": true,
          "description": "HTTP请求的原始响应。只能接受字符串或JSON类型响应数据。",
          "valueType": "any",
          "type": "static"
        }
      ]
    },
    {
      "nodeId": "tuCX993417kt",
      "name": "文本拼接",
      "intro": "可对固定或传入的文本进行加工后输出，非字符串类型数据最终会转成字符串类型。",
      "avatar": "core/workflow/template/textConcat",
      "flowNodeType": "textEditor",
      "position": {
        "x": 1195.6485304426074,
        "y": -303.47730013520686
      },
      "version": "486",
      "inputs": [
        {
          "key": "system_addInputParam",
          "renderTypeList": [
            "addInputParam"
          ],
          "valueType": "dynamic",
          "label": "",
          "required": false,
          "description": "可以引用其他节点的输出，作为文本拼接的变量，通过 {{字段名}} 来引用变量",
          "customInputConfig": {
            "selectValueTypeList": [
              "string",
              "number",
              "boolean",
              "object",
              "arrayString",
              "arrayNumber",
              "arrayBoolean",
              "arrayObject",
              "any",
              "chatHistory",
              "datasetQuote",
              "dynamic",
              "selectApp",
              "selectDataset"
            ],
            "showDescription": false,
            "showDefaultValue": false
          }
        },
        {
          "key": "system_textareaInput",
          "renderTypeList": [
            "textarea"
          ],
          "valueType": "string",
          "required": true,
          "label": "拼接文本",
          "placeholder": "可通过 {{字段名}} 来引用变量",
          "value": "****** \n\n最终翻译结果如下: \n\n```\n{{result}}\n```"
        }
      ],
      "outputs": [
        {
          "id": "system_text",
          "key": "system_text",
          "label": "拼接结果",
          "type": "static",
          "valueType": "string"
        }
      ]
    },
    {
      "nodeId": "mwEY9pVxPUpj",
      "name": "HTTP 请求#2",
      "intro": "可以发出一个 HTTP 请求，实现更为复杂的操作（联网搜索、数据库查询等）",
      "avatar": "core/workflow/template/httpRequest",
      "flowNodeType": "httpRequest468",
      "showStatus": true,
      "position": {
        "x": 1772.9520500095898,
        "y": -475.4513333685644
      },
      "version": "481",
      "inputs": [
        {
          "key": "system_addInputParam",
          "renderTypeList": [
            "addInputParam"
          ],
          "valueType": "dynamic",
          "label": "",
          "required": false,
          "description": "core.module.input.description.HTTP Dynamic Input",
          "customInputConfig": {
            "selectValueTypeList": [
              "string",
              "number",
              "boolean",
              "object",
              "arrayString",
              "arrayNumber",
              "arrayBoolean",
              "arrayObject",
              "any",
              "chatHistory",
              "datasetQuote",
              "dynamic",
              "selectApp",
              "selectDataset"
            ],
            "showDescription": false,
            "showDefaultValue": true
          }
        },
        {
          "key": "system_httpMethod",
          "renderTypeList": [
            "custom"
          ],
          "valueType": "string",
          "label": "",
          "value": "POST",
          "required": true
        },
        {
          "key": "system_httpReqUrl",
          "renderTypeList": [
            "hidden"
          ],
          "valueType": "string",
          "label": "",
          "description": "core.module.input.description.Http Request Url",
          "placeholder": "https://api.ai.com/getInventory",
          "required": false
        },
        {
          "key": "system_httpHeader",
          "renderTypeList": [
            "custom"
          ],
          "valueType": "any",
          "value": [],
          "label": "",
          "description": "core.module.input.description.Http Request Header",
          "placeholder": "core.module.input.description.Http Request Header",
          "required": false
        },
        {
          "key": "system_httpParams",
          "renderTypeList": [
            "hidden"
          ],
          "valueType": "any",
          "value": [],
          "label": "",
          "required": false
        },
        {
          "key": "system_httpJsonBody",
          "renderTypeList": [
            "hidden"
          ],
          "valueType": "any",
          "value": "",
          "label": "",
          "required": false
        }
      ],
      "outputs": [
        {
          "id": "error",
          "key": "error",
          "label": "请求错误",
          "description": "HTTP请求错误信息，成功时返回空",
          "valueType": "object",
          "type": "static"
        },
        {
          "id": "httpRawResponse",
          "key": "httpRawResponse",
          "label": "原始响应",
          "required": true,
          "description": "HTTP请求的原始响应。只能接受字符串或JSON类型响应数据。",
          "valueType": "any",
          "type": "static"
        },
        {
          "id": "system_addOutputParam",
          "key": "system_addOutputParam",
          "type": "dynamic",
          "valueType": "dynamic",
          "label": "",
          "customFieldConfig": {
            "selectValueTypeList": [
              "string",
              "number",
              "boolean",
              "object",
              "arrayString",
              "arrayNumber",
              "arrayBoolean",
              "arrayObject",
              "any",
              "chatHistory",
              "datasetQuote",
              "dynamic",
              "selectApp",
              "selectDataset"
            ],
            "showDescription": false,
            "showDefaultValue": false
          }
        }
      ]
    }
  ],
  "edges": [
    {
      "source": "448745",
      "target": "lUEOfOtTQCCT",
      "sourceHandle": "448745-source-right",
      "targetHandle": "lUEOfOtTQCCT-target-left"
    },
    {
      "source": "lUEOfOtTQCCT",
      "target": "tuCX993417kt",
      "sourceHandle": "lUEOfOtTQCCT-source-right",
      "targetHandle": "tuCX993417kt-target-left"
    },
    {
      "source": "tuCX993417kt",
      "target": "mwEY9pVxPUpj",
      "sourceHandle": "tuCX993417kt-source-right",
      "targetHandle": "mwEY9pVxPUpj-target-left"
    }
  ],
  "defaultPermission": 0,
  "inheritPermission": true,
  "updateTime": "2024-11-29T07:03:49.602Z",
  "__v": 0,
  "chatConfig": {
    "variables": [],
    "scheduledTriggerConfig": {
      "cronString": "",
      "timezone": "Asia/Shanghai",
      "defaultPrompt": ""
    },
    "_id": "67496d6a8b40c209de396684"
  },
  "permission": {
    "value": 4294967295,
    "isOwner": true,
    "hasManagePer": true,
    "hasWritePer": true,
    "hasReadPer": true
  }
}
const App = () => {

  const createApp = () => {
    // const template = workflowTemplates[1]

    const template = mockData;

    fetch('/api/app/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: template.avatar,
        name: "http",
        modules: template.modules,
        edges: template.edges,
        type: template.type,
        teamId: '6711e80e6a345036775bf96e',
        tmbId: '6711e80e6a345036775bf970'
      })
    }).then(response => {
      // form.resetFields()
      // response.json()
      // refresh()
    })
  }

  const fetchStream = async() =>{
    const response = await fetch('/api/core/chat/chatTest');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
  
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      console.log(decoder.decode(value)); // 打印接收到的消息
    }
  }

  const getStream = () => {
    fetchStream();
  }
  
  return(
    <>
      <Button onClick={createApp}>创建应用</Button>
      <Button onClick={getStream}>请求stream</Button>
    </>
  )
}

export default App;