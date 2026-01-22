import { PropertyData } from './property';

export interface FavoriteData {
    _id: string;
    userId: string;
    propertyId: string;
    property?: PropertyData;
    createdAt: string;
}




