import { Param } from '@discord-nestjs/core';

export class UpdateCommandDto {
  @Param({ description: 'Version', required: true })
      version: string;

  @Param({ description: 'Download URL', required: true })
      url: string;

  @Param({ description: 'Webhook Notes' })
      notes: string;

  @Param({ description: 'Webhook Image' })
      image: string;

    @Param({ description: 'Changelog item one' })
        cl1?: string;

    @Param({ description: 'Changelog item two' })
        cl2?: string;

    @Param({ description: 'Changelog item three' })
        cl3?: string;

    @Param({ description: 'Changelog item four' })
        cl4?: string;

    @Param({ description: 'Changelog item five' })
        cl5?: string;

      @Param({ description: 'Changelog item six' })
          cl6?: string;

      @Param({ description: 'Changelog item seven' })
          cl7?: string;

      @Param({ description: 'Changelog item eight' })
          cl8?: string;
}