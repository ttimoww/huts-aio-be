import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Store } from './../lib/enums/store.enum';
import { User } from './../user/entities/user.entity';

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


    constructor(store: Store, name: string, size: string, image: string, price: string, user: User) {
        this.store = store;
        this.productName = name;
        this.productSize = size;
        this.productImage = image;
        this.productPrice = price;
        this.user = user;
    }
}