import { Channel, Choice, Param, ParamType,  } from '@discord-nestjs/core';
import { Store } from 'src/lib/enums/store.enum';

export class ReleaseGuideCommandDto {

    @Choice(Store)
    @Param({ description: 'Store', required: true, type: ParamType.STRING })
        store: Store;
    
    @Channel([0])
    @Param({ description: 'Channel', required: true })
        channel: string;

    @Param({ description: 'Item name', required: true })
        name: string;

    @Param({ description: 'Item image Url', required: true })
        image: string;

    @Param({ description: 'Drop Time', required: true })
        time: string;

    @Param({ description: 'Early info like URL & PID' })
        earlyinfo: string;

    @Param({ description: 'Extra notes' })
        notes: string;
}