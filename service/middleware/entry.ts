import { connectToDatabase } from '../mongo';
import { NextEntry, NextEntryStream } from '@fastgpt/service/common/middle/entry';

export const NextAPI = NextEntry({
  beforeCallback: [connectToDatabase()]
});


export const NextAPIStream = NextEntryStream({
  beforeCallback: [connectToDatabase()]
});

