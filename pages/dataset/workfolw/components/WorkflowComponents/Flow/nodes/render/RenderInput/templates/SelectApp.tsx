import React, { useMemo } from 'react';
import type { RenderInputProps } from '../type';
import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { SelectAppItemType } from '@fastgpt/global/core/workflow/template/system/runApp/type';
import Avatar from '@fastgpt/web/components/common/Avatar';
import SelectAppModal from '../../../../SelectAppModal';
import { useTranslation } from 'next-i18next';
import { useContextSelector } from 'use-context-selector';
import { WorkflowContext } from '@/pages/app/detail/components/WorkflowComponents/context';
import { useRequest2 } from '@fastgpt/web/hooks/useRequest';
import { getAppDetailById } from '@/web/core/app/api';

const SelectAppRender = ({ item, nodeId }: RenderInputProps) => {
  const { t } = useTranslation();
  const filterAppIds = useContextSelector(WorkflowContext, (ctx) => ctx.filterAppIds);
  const onChangeNode = useContextSelector(WorkflowContext, (v) => v.onChangeNode);

  const {
    isOpen: isOpenSelectApp,
    onOpen: onOpenSelectApp,
    onClose: onCloseSelectApp
  } = useDisclosure();

  const value = item.value as SelectAppItemType | undefined;
  const { data: appDetail, loading } = useRequest2(
    () => {
      if (value?.id)         return Promise.resolve({
        "_id": "6711ee5aae46e9c3e3f61ef9",
        "parentId": null,
        "teamId": "6711e80e6a345036775bf96e",
        "tmbId": "6711e80e6a345036775bf970",
        "name": "123",
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
            "avatar": "/imgs/workflow/userGuide.png",
            "flowNodeType": "userGuide",
            "position": {
              "x": 531.2422736065552,
              "y": -486.7611729549753
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
            "avatar": "/imgs/workflow/userChatInput.svg",
            "flowNodeType": "workflowStart",
            "position": {
              "x": 558.4082376415505,
              "y": 123.72387429194112
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
                "label": "core.module.input.label.user question",
                "valueType": "string",
                "type": "static"
              }
            ]
          },
          {
            "nodeId": "loOvhld2ZTKa",
            "name": "第一轮翻译",
            "intro": "AI 大模型对话",
            "avatar": "/imgs/workflow/AI.png",
            "flowNodeType": "chatNode",
            "showStatus": true,
            "position": {
              "x": 1748.8252410306534,
              "y": -245.08260685989214
            },
            "version": "481",
            "inputs": [
              {
                "key": "model",
                "renderTypeList": [
                  "settingLLMModel",
                  "reference"
                ],
                "label": "core.module.input.label.aiModel",
                "valueType": "string",
                "value": "gpt-4o"
              },
              {
                "key": "temperature",
                "renderTypeList": [
                  "hidden"
                ],
                "label": "",
                "value": 0,
                "valueType": "number",
                "min": 0,
                "max": 10,
                "step": 1
              },
              {
                "key": "maxToken",
                "renderTypeList": [
                  "hidden"
                ],
                "label": "",
                "value": 2000,
                "valueType": "number",
                "min": 100,
                "max": 4000,
                "step": 50
              },
              {
                "key": "isResponseAnswerText",
                "renderTypeList": [
                  "hidden"
                ],
                "label": "",
                "value": true,
                "valueType": "boolean"
              },
              {
                "key": "quoteTemplate",
                "renderTypeList": [
                  "hidden"
                ],
                "label": "",
                "valueType": "string"
              },
              {
                "key": "quotePrompt",
                "renderTypeList": [
                  "hidden"
                ],
                "label": "",
                "valueType": "string"
              },
              {
                "key": "systemPrompt",
                "renderTypeList": [
                  "textarea",
                  "reference"
                ],
                "max": 3000,
                "valueType": "string",
                "label": "core.ai.Prompt",
                "description": "core.app.tip.chatNodeSystemPromptTip",
                "placeholder": "core.app.tip.chatNodeSystemPromptTip",
                "value": "# Role: 资深英汉翻译专家\n\n## Background:\n你是一位经验丰富的英汉翻译专家,精通英汉互译,尤其擅长将英文文章译成流畅易懂的现代汉语。你曾多次带领团队完成大型翻译项目,译文广受好评。\n\n## Attention:\n- 翻译过程中要始终坚持\"信、达、雅\"的原则,但\"达\"尤为重要\n- 译文要符合现代汉语的表达习惯,通俗易懂,连贯流畅 \n- 避免使用过于文绉绉的表达和晦涩难懂的典故引用\n\n## Profile:  \n- Author: 米开朗基杨 \n- Version: 0.2\n- Language: 中文\n- Description: 你是一位资深英汉翻译专家,精通英汉互译。你擅长将英文文章译成地道流畅的现代汉语,表达准确易懂,符合当代中文语言习惯。\n\n## Constraints:\n- 必须严格遵循四轮翻译流程:直译、意译、校审、定稿  \n- 译文要忠实原文,准确无误,不能遗漏或曲解原意\n- 译文应以现代白话文为主,避免过多使用文言文和古典诗词\n- 每一轮翻译前后必须添加【思考】和【翻译】标记\n- 最终译文使用Markdown的代码块呈现\n\n## Goals:\n- 通过四轮翻译流程,将英文原文译成高质量的现代汉语译文  \n- 译文要准确传达原文意思,语言表达力求浅显易懂,朗朗上口\n- 适度使用一些熟语俗语、流行网络用语等,增强译文的亲和力\n- 在直译的基础上,提供至少2个不同风格的意译版本供选择\n\n## Skills:\n- 精通英汉双语,具有扎实的语言功底和丰富的翻译经验\n- 擅长将英语表达习惯转换为地道自然的现代汉语\n- 对当代中文语言的发展变化有敏锐洞察,善于把握语言流行趋势\n\n## Workflow:\n1. 第一轮直译:逐字逐句忠实原文,不遗漏任何信息\n2. 第二轮意译:在直译的基础上用通俗流畅的现代汉语意译原文,至少提供2个不同风格的版本\n3. 第三轮校审:仔细审视译文,消除偏差和欠缺,使译文更加地道易懂 \n4. 第四轮定稿:择优选取,反复修改润色,最终定稿出一个简洁畅达、符合大众阅读习惯的译文\n\n## OutputFormat: \n- 每一轮翻译前用【思考】说明该轮要点\n- 每一轮翻译后用【翻译】呈现译文\n- 在\\`\\`\\`代码块中展示最终定稿译文\n\n## Suggestions:\n- 直译时力求忠实原文,但不要过于拘泥逐字逐句\n- 意译时在准确表达原意的基础上,用最朴实无华的现代汉语来表达 \n- 校审环节重点关注译文是否符合当代汉语表达习惯,是否通俗易懂\n- 定稿时适度采用一些熟语谚语、网络流行语等,使译文更接地气\n- 善于利用中文的灵活性,用不同的表述方式展现同一内容,提高译文的可读性\n\n## Initialization\n作为一名资深英汉翻译专家,你必须严格遵循翻译流程的各项要求。首先请向用户问好,介绍你将带领团队完成翻译任务,力求将英文原文译成通俗易懂的现代汉语。然后简要说明四轮翻译流程,请用户提供英文原文,开始进行翻译工作。"
              },
              {
                "key": "history",
                "renderTypeList": [
                  "numberInput",
                  "reference"
                ],
                "valueType": "chatHistory",
                "label": "core.module.input.label.chat history",
                "description": "最多携带多少轮对话记录",
                "required": true,
                "min": 0,
                "max": 30,
                "value": 6
              },
              {
                "key": "userChatInput",
                "renderTypeList": [
                  "reference",
                  "textarea"
                ],
                "valueType": "string",
                "label": "用户问题",
                "required": true,
                "toolDescription": "用户问题",
                "value": [
                  "k2QsBOBmH9Xu",
                  "text"
                ]
              },
              {
                "key": "quoteQA",
                "renderTypeList": [
                  "settingDatasetQuotePrompt"
                ],
                "label": "",
                "debugLabel": "知识库引用",
                "description": "",
                "valueType": "datasetQuote"
              }
            ],
            "outputs": [
              {
                "id": "history",
                "key": "history",
                "label": "core.module.output.label.New context",
                "description": "core.module.output.description.New context",
                "valueType": "chatHistory",
                "type": "static",
                "required": true
              },
              {
                "id": "answerText",
                "key": "answerText",
                "label": "core.module.output.label.Ai response content",
                "description": "core.module.output.description.Ai response content",
                "valueType": "string",
                "type": "static",
                "required": true
              }
            ]
          },
          {
            "nodeId": "k2QsBOBmH9Xu",
            "name": "原文声明",
            "intro": "可对固定或传入的文本进行加工后输出，非字符串类型数据最终会转成字符串类型。",
            "avatar": "/imgs/workflow/textEditor.svg",
            "flowNodeType": "pluginModule",
            "showStatus": false,
            "position": {
              "x": 1000.9259923224292,
              "y": 3.3737410194846404
            },
            "version": "481",
            "inputs": [
              {
                "key": "system_addInputParam",
                "valueType": "dynamic",
                "label": "动态外部数据",
                "renderTypeList": [
                  "addInputParam"
                ],
                "required": false,
                "description": "",
                "canEdit": false,
                "value": "",
                "editField": {
                  "key": true
                },
                "dynamicParamDefaultValue": {
                  "inputType": "reference",
                  "valueType": "string",
                  "required": true
                }
              },
              {
                "key": "q",
                "valueType": "string",
                "label": "q",
                "renderTypeList": [
                  "reference"
                ],
                "required": true,
                "description": "",
                "canEdit": true,
                "editField": {
                  "key": true
                },
                "value": [
                  "448745",
                  "userChatInput"
                ]
              },
              {
                "key": "文本",
                "valueType": "string",
                "label": "文本",
                "renderTypeList": [
                  "textarea"
                ],
                "required": true,
                "description": "",
                "canEdit": false,
                "value": "原文:\n\"\"\"\n{{q}}\n\"\"\"",
                "editField": {
                  "key": true
                },
                "maxLength": "",
                "dynamicParamDefaultValue": {
                  "inputType": "reference",
                  "valueType": "string",
                  "required": true
                }
              }
            ],
            "outputs": [
              {
                "id": "text",
                "type": "static",
                "key": "text",
                "valueType": "string",
                "label": "text",
                "description": ""
              }
            ],
            "pluginId": "community-textEditor"
          },
          {
            "nodeId": "w0oBbQ3YJHye",
            "name": "代码运行",
            "intro": "执行一段简单的脚本代码，通常用于进行复杂的数据处理。",
            "avatar": "/imgs/workflow/code.svg",
            "flowNodeType": "code",
            "showStatus": true,
            "position": {
              "x": 2522.61682940854,
              "y": -79.74569750380468
            },
            "version": "482",
            "inputs": [
              {
                "key": "system_addInputParam",
                "renderTypeList": [
                  "addInputParam"
                ],
                "valueType": "dynamic",
                "label": "",
                "required": false,
                "description": "这些变量会作为代码的运行的输入参数",
                "editField": {
                  "key": true,
                  "valueType": true
                }
              },
              {
                "key": "data1",
                "valueType": "string",
                "label": "data1",
                "renderTypeList": [
                  "reference"
                ],
                "description": "",
                "canEdit": true,
                "editField": {
                  "key": true,
                  "valueType": true
                },
                "value": [
                  "loOvhld2ZTKa",
                  "answerText"
                ]
              },
              {
                "key": "codeType",
                "renderTypeList": [
                  "hidden"
                ],
                "label": "",
                "value": "js"
              },
              {
                "key": "code",
                "renderTypeList": [
                  "custom"
                ],
                "label": "",
                "value": "function main({data1}){\n    const result = data1.split(\"```\").filter(item => !!item.trim())\n\n    if(result[result.length-1]) {\n        return {\n            result: result[result.length-1]\n        }\n    }\n\n    return {\n        result: '未截取到翻译内容'\n    }\n}"
              }
            ],
            "outputs": [
              {
                "id": "system_addOutputParam",
                "key": "system_addOutputParam",
                "type": "dynamic",
                "valueType": "dynamic",
                "label": "",
                "editField": {
                  "key": true,
                  "valueType": true
                },
                "description": "将代码中 return 的对象作为输出，传递给后续的节点"
              },
              {
                "id": "system_rawResponse",
                "key": "system_rawResponse",
                "label": "完整响应数据",
                "valueType": "object",
                "type": "static"
              },
              {
                "id": "error",
                "key": "error",
                "label": "运行错误",
                "description": "代码运行错误信息，成功时返回空",
                "valueType": "object",
                "type": "static"
              },
              {
                "id": "qLUQfhG0ILRX",
                "type": "dynamic",
                "key": "result",
                "valueType": "string",
                "label": "result"
              }
            ]
          },
          {
            "nodeId": "foO69L5FOmDQ",
            "name": "指定回复",
            "intro": "该模块可以直接回复一段指定的内容。常用于引导、提示。非字符串内容传入时，会转成字符串进行输出。",
            "avatar": "/imgs/workflow/reply.png",
            "flowNodeType": "answerNode",
            "position": {
              "x": 3798.4479531204515,
              "y": 116.03040242110023
            },
            "version": "481",
            "inputs": [
              {
                "key": "text",
                "renderTypeList": [
                  "textarea",
                  "reference"
                ],
                "valueType": "any",
                "required": true,
                "label": "core.module.input.label.Response content",
                "description": "core.module.input.description.Response content",
                "placeholder": "core.module.input.description.Response content",
                "selectedTypeIndex": 1,
                "value": [
                  "v9ijHqeA2NY2",
                  "text"
                ]
              }
            ],
            "outputs": []
          },
          {
            "nodeId": "v9ijHqeA2NY2",
            "name": "合并输出结果",
            "intro": "可对固定或传入的文本进行加工后输出，非字符串类型数据最终会转成字符串类型。",
            "avatar": "/imgs/workflow/textEditor.svg",
            "flowNodeType": "pluginModule",
            "showStatus": false,
            "position": {
              "x": 3083.567683275386,
              "y": 60.05513835086097
            },
            "version": "481",
            "inputs": [
              {
                "key": "system_addInputParam",
                "valueType": "dynamic",
                "label": "动态外部数据",
                "renderTypeList": [
                  "addInputParam"
                ],
                "required": false,
                "description": "",
                "canEdit": false,
                "value": "",
                "editField": {
                  "key": true
                },
                "dynamicParamDefaultValue": {
                  "inputType": "reference",
                  "valueType": "string",
                  "required": true
                }
              },
              {
                "key": "result",
                "valueType": "string",
                "label": "result",
                "renderTypeList": [
                  "reference"
                ],
                "required": true,
                "description": "",
                "canEdit": true,
                "editField": {
                  "key": true
                },
                "value": [
                  "w0oBbQ3YJHye",
                  "qLUQfhG0ILRX"
                ]
              },
              {
                "key": "文本",
                "valueType": "string",
                "label": "文本",
                "renderTypeList": [
                  "textarea"
                ],
                "required": true,
                "description": "",
                "canEdit": false,
                "value": "------\n\n最终翻译结果如下: \n\n```\n{{result}}\n```",
                "editField": {
                  "key": true
                },
                "maxLength": "",
                "dynamicParamDefaultValue": {
                  "inputType": "reference",
                  "valueType": "string",
                  "required": true
                }
              }
            ],
            "outputs": [
              {
                "id": "text",
                "type": "static",
                "key": "text",
                "valueType": "string",
                "label": "text",
                "description": ""
              }
            ],
            "pluginId": "community-textEditor"
          }
        ],
        "edges": [
          {
            "source": "448745",
            "target": "k2QsBOBmH9Xu",
            "sourceHandle": "448745-source-right",
            "targetHandle": "k2QsBOBmH9Xu-target-left"
          },
          {
            "source": "k2QsBOBmH9Xu",
            "target": "loOvhld2ZTKa",
            "sourceHandle": "k2QsBOBmH9Xu-source-right",
            "targetHandle": "loOvhld2ZTKa-target-left"
          },
          {
            "source": "loOvhld2ZTKa",
            "target": "w0oBbQ3YJHye",
            "sourceHandle": "loOvhld2ZTKa-source-right",
            "targetHandle": "w0oBbQ3YJHye-target-left"
          },
          {
            "source": "w0oBbQ3YJHye",
            "target": "v9ijHqeA2NY2",
            "sourceHandle": "w0oBbQ3YJHye-source-right",
            "targetHandle": "v9ijHqeA2NY2-target-left"
          },
          {
            "source": "v9ijHqeA2NY2",
            "target": "foO69L5FOmDQ",
            "sourceHandle": "v9ijHqeA2NY2-source-right",
            "targetHandle": "foO69L5FOmDQ-target-left"
          }
        ],
        "defaultPermission": 0,
        "updateTime": "2024-10-18T05:12:58.833Z",
        "__v": 0,
        "chatConfig": {
          "variables": [],
          "scheduledTriggerConfig": {
            "cronString": "",
            "timezone": "Asia/Shanghai",
            "defaultPrompt": ""
          },
          "_id": "6711ee5fae46e9c3e3f61f17"
        },
        "permission": {
          "value": 4294967295,
          "isOwner": true,
          "hasManagePer": true,
          "hasWritePer": true,
          "hasReadPer": true
        }
      })
        // return getAppDetailById(value.id);
      return Promise.resolve(null);
    },
    {
      manual: false,
      refreshDeps: [value?.id],
      errorToast: 'Error',
      onError() {
        onChangeNode({
          nodeId,
          type: 'updateInput',
          key: 'app',
          value: {
            ...item,
            value: undefined
          }
        });
      }
    }
  );

  const Render = useMemo(() => {
    return (
      <>
        <Box onClick={onOpenSelectApp}>
          {!value ? (
            <Button variant={'whiteFlow'} w={'100%'}>
              {t('common:core.module.Select app')}
            </Button>
          ) : (
            <Button
              isLoading={loading}
              w={'100%'}
              justifyContent={loading ? 'center' : 'flex-start'}
              variant={'whiteFlow'}
              leftIcon={<Avatar src={appDetail?.avatar} w={6} />}
            >
              {appDetail?.name}
            </Button>
          )}
        </Box>

        {isOpenSelectApp && (
          <SelectAppModal
            value={item.value}
            filterAppIds={filterAppIds}
            onClose={onCloseSelectApp}
            onSuccess={(e) => {
              onChangeNode({
                nodeId,
                type: 'updateInput',
                key: 'app',
                value: {
                  ...item,
                  value: e
                }
              });
            }}
          />
        )}
      </>
    );
  }, [
    appDetail?.avatar,
    appDetail?.name,
    filterAppIds,
    isOpenSelectApp,
    item,
    loading,
    nodeId,
    onChangeNode,
    onCloseSelectApp,
    onOpenSelectApp,
    t,
    value
  ]);

  return Render;
};

export default React.memo(SelectAppRender);
