import { ApiProperty } from '@nestjs/swagger';
import * as config from 'config';

const successPointsRewards = config.get('successPointsRewards');

export class SuccessPointsDto  {
   @ApiProperty()
       successPoints: number;

   @ApiProperty({ description: 'Total points needed for a free month' })
       freeMonth: number;
   
   @ApiProperty({ description: 'Total points needed for the chef role' })
       chefRole: number;

   constructor(points: number){
       this.successPoints = points;
       this.freeMonth = successPointsRewards.freeMonth;
       this.chefRole = successPointsRewards.chefRole;
   }
}
