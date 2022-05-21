import { License } from '../../auth/license.entity';
import HyperKeyData from '../../auth/models/hyper-key-data.model';
import { User } from '../../user/entities/user.entity';

export function fakeHyperKeyData(): HyperKeyData{
    return new HyperKeyData(
        'Timo#1234',
        'd1sc0rd1d',
        'IMG.PNG',
        'e@mail.com',
        'pl4n',
        'HUTS-ABCD-1234-EFGH',
        'l1c3nc3id'
    );
}

export function fakeUser(): User{
    return new User(
        'Timo#d1sc0rd1d',
        'Timo#1234',
        'IMG.PNG'
    );
}

export function fakeLicenseWithUser(): License{
    return new License(
        'l1c3nc3id',
        'pl4n',
        'HUTS-ABCD-1234-EFGH',
        new Date(),
        '168.1.2.3',
        fakeUser()
    );
}