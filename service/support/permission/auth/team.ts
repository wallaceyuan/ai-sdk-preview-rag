import { UserErrEnum } from '@fastgpt/global/common/error/code/user';
import { TeamMemberWithUserSchema } from '@fastgpt/global/support/user/team/type';
import { MongoTeamMember } from '@fastgpt/service/support/user/team/teamMemberSchema';
import { checkTeamAIPoints } from '@fastgpt/service/support/permission/teamLimit';
import { GET } from '@fastgpt/service/common/api/plusRequest';
import {
  AuthTeamTagTokenProps,
  AuthTokenFromTeamDomainResponse
} from '@fastgpt/global/support/user/team/tag';

export async function getUserChatInfoAndAuthTeamPoints(tmbId: string) {
  // const tmb = (await MongoTeamMember.findById(tmbId, 'teamId userId').populate(
  //   'userId',
  //   'timezone openaiAccount'
  // )) as TeamMemberWithUserSchema;
  // console.log('tmbtmbtmbtmbtmbtmbtmbtmb',tmb);
  const tmb = {
    _id: "6711e80e6a345036775bf970",
    teamId: "6711e80e6a345036775bf96e",
    userId: {
      _id: "6711e80e6a345036775bf968",
      timezone: 'Asia/Shanghai'
    }
  }
  if (!tmb) return Promise.reject(UserErrEnum.unAuthUser);

  await checkTeamAIPoints(tmb.teamId);

  return {
    user: tmb.userId
  };
}

export function authTeamTagToken(data: AuthTeamTagTokenProps) {
  return GET<AuthTokenFromTeamDomainResponse['data']>('/support/user/team/tag/authTeamToken', data);
}
export async function authTeamSpaceToken({
  teamId,
  teamToken
}: {
  teamId: string;
  teamToken: string;
}) {
  // get outLink and app
  const data = await authTeamTagToken({ teamId, teamToken });
  const uid = data.uid;

  return {
    uid
  };
}
