
export interface Order {
	_id: string;
	customerId: {
		email: string;
		phone: string;
		name: string;
	};
	restaurantId: {
		name: string;
		email: string;
		phone: string;
	};
	driverId?: {
		email: string;
		phone: string;
		name: string;
	};
	items: Array<{
		name: string;
		price: number;
		quantity: number;
	}>;
	total: number;
	status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'picked' | 'en_route' | 'delivered' | 'canceled';
	deliveryLocation: {
		type: string;
		coordinates: [number, number];
	};
	paymentMethod: 'cash' | 'mobile_banking' | 'card';
	rating?: number;
	feedback?: string;
	deleted: boolean;
	createdAt: string;
	updatedAt: string;
}