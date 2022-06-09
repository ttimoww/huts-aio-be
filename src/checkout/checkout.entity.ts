import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Store } from './../lib/enums/store.enum';
import { User } from './../user/entities/user.entity';
import { CheckoutDto } from './checkout.dto';

@Entity()
export class Checkout{
    @PrimaryGeneratedColumn()
        checkoutId: number;
    
    @Column({ type: 'enum', enum: Store })
        store: Store;
    
    @Column()
        productName: string;
    
    @Column()
        productSize: string;

    @Column()
        productImage: string;

    @Column()
        productPrice: string;
    
    @ManyToOne(() => User, user => user.checkouts)
        user: User;

    constructor(dto: CheckoutDto, user: User) {
        if (dto === undefined || user === undefined) return;

        this.store = dto.store;
        this.productName = dto.productName;
        this.productSize = dto.productSize;
        this.productImage = dto.productImage;
        this.productPrice = dto.productPrice;
        this.user = user;
    }
}