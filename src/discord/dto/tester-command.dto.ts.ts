import { Param, ParamType } from '@discord-nestjs/core';

export class TesterCommandDto {
  @Param({ description: 'Version', required: true, type: ParamType.USER })
      user: string;
}