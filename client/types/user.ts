export interface User {
    _id:          string;
    email:        string;
    phone:        string;
    role:         string;
    status:       string;
    isVerified:   boolean;
    deleted:      boolean;
    createdAt:    Date;
    updatedAt:    Date;
    refreshToken: string;
}