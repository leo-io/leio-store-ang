export class OrderHistory {

    constructor(public id: number,
        public orderTrackingNumber: string,
        public totalQuantity: number,
        public totalPrice: number,
        public dateCreated: Date

    ) { 
        
    }

}


