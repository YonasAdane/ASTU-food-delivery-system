export type Driver = {
  _id: string;
  phone: string;
  email?: string;
};

export type Order = {
  _id: string;
  total: number;
  status: string;
  driverId?: Driver | string;
};

export type RestaurantMeResponse = {
  restaurant: {
    _id: string;
    name: string;
  };
};
