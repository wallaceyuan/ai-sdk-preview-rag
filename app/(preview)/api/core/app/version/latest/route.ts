import type { ApiRequestProps, ApiResponseType } from '@fastgpt/service/type/next';
import { NextAPI } from '@/service/middleware/entry';
import { authApp } from '@fastgpt/service/support/permission/app/auth';
import { WritePermissionVal } from '@fastgpt/global/support/permission/constant';
import { getAppLatestVersion } from '@fastgpt/service/core/app/controller';
import { AppChatConfigType } from '@fastgpt/global/core/app/type';
import { StoreEdgeItemType } from '@fastgpt/global/core/workflow/type/edge';
import { StoreNodeItemType } from '@fastgpt/global/core/workflow/type/node';
import { NextRequest } from 'next/server'

export type getLatestVersionQuery = {
  appId: string;
};

export type getLatestVersionBody = {};

export type getLatestVersionResponse = {
  nodes: StoreNodeItemType[];
  edges: StoreEdgeItemType[];
  chatConfig: AppChatConfigType;
};

async function handler(
  req: NextRequest,
): Promise<getLatestVersionResponse> {

  const searchParams = req.nextUrl.searchParams
  const appId = searchParams.get('appId')

  const { app } = await authApp({
    req,
    authToken: true,
    appId: appId,
    per: WritePermissionVal
  });

  return getAppLatestVersion(appId as string, app);
}


export async function GET(req: NextRequest) {
  return NextAPI(handler)(req)
}