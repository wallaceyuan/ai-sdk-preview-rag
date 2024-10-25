import { DELETE, GET, POST } from '@/web/common/api/request';
import type { createHttpPluginBody } from '@/pages/api/core/app/httpPlugin/create';
import type { UpdateHttpPluginBody } from '@/pages/api/core/app/httpPlugin/update';
import type {
  FlowNodeTemplateType,
  NodeTemplateListItemType
} from '@fastgpt/global/core/workflow/type/node';
import { getMyApps } from '../api';
import type { ListAppBody } from '@/pages/api/core/app/list';
import { FlowNodeTypeEnum } from '@fastgpt/global/core/workflow/node/constant';
import { FlowNodeTemplateTypeEnum } from '@fastgpt/global/core/workflow/constants';
import type { GetPreviewNodeQuery } from '@/pages/api/core/app/plugin/getPreviewNode';
import { AppTypeEnum } from '@fastgpt/global/core/app/constants';
import { ParentIdType, ParentTreePathItemType } from '@fastgpt/global/common/parentFolder/type';
import { GetSystemPluginTemplatesBody } from '@/pages/api/core/app/plugin/getSystemPluginTemplates';

const ddd = [{
  "_id": "6711ee5aae46e9c3e3f61ef9",
  "tmbId": "6711e80e6a345036775bf970",
  "avatar": "/imgs/app/avatar/workflow.svg",
  "type": "advanced",
  "name": "123",
  "intro": "",
  "updateTime": "2024-10-18T05:12:58.833Z",
  "permission": {
    "value": 4294967295,
    "isOwner": true,
    "hasManagePer": true,
    "hasWritePer": true,
    "hasReadPer": true
  },
  "defaultPermission": 0
}]         

/* ============ team plugin ============== */
export const getTeamPlugTemplates = (data?: ListAppBody) =>
  // getMyApps(data).then((res) =>
    ddd.map<NodeTemplateListItemType>((app) => ({
      id: app._id,
      pluginId: app._id,
      isFolder: app.type === AppTypeEnum.folder || app.type === AppTypeEnum.httpPlugin,
      templateType: FlowNodeTemplateTypeEnum.teamApp,
      flowNodeType: FlowNodeTypeEnum.pluginModule,
      avatar: app.avatar,
      name: app.name,
      intro: app.intro,
      showStatus: false,
      version: app.pluginData?.nodeVersion || '481',
      isTool: true
    }))
  // );

/* ============ system plugin ============== */
export const getSystemPlugTemplates = (data: GetSystemPluginTemplatesBody) =>
  POST<NodeTemplateListItemType[]>('/core/app/plugin/getSystemPluginTemplates', data);

export const getSystemPluginPaths = (parentId: ParentIdType) => {
  if (!parentId) return Promise.resolve<ParentTreePathItemType[]>([]);
  return GET<ParentTreePathItemType[]>('/core/app/plugin/path', { parentId });
};

export const getPreviewPluginNode = (data: GetPreviewNodeQuery) =>
  GET<FlowNodeTemplateType>('/core/app/plugin/getPreviewNode', data);

/* ============ http plugin ============== */
export const postCreateHttpPlugin = (data: createHttpPluginBody) =>
  POST('/core/app/httpPlugin/create', data);

export const putUpdateHttpPlugin = (body: UpdateHttpPluginBody) =>
  POST('/core/app/httpPlugin/update', body);

export const getApiSchemaByUrl = (url: string) =>
  POST<Object>(
    '/core/app/httpPlugin/getApiSchemaByUrl',
    { url },
    {
      timeout: 30000
    }
  );
