export interface State {
    id: string;
    name: string;
    stateCode: string;
}

export interface City {
    cityId: string;
    name: string;
    countyId: string;
}

export interface Zip {
    code: string;
    zipId: string;
}

export interface PropertyType {
    propertyTypeId: string;
    name: string;
}

export interface User {
    email: string;
    token: string;
    refreshToken: string;
    id: string;
    phoneVerified: boolean;
    role: Role;
    spDetail: SPDetail | undefined;
    firstName: string;
    lastName: string;
}

export interface Role {
    id: string;
    role: string;
}

export interface ServiceRequest {
    activityStatus: string | undefined;
    createdAt: string;
    serviceTypeId: string;
    details: string;
    propertyName: string;
    timelineId: string;
    detail: string;
    startDate: string;
    endDate: string;
    proposals: Proposal[] | undefined;
    status: string;
    proposalCount: number | undefined;
    property: Property;
    id: string;   
    timeline: Timeline;
    serviceType: ServiceType;
}

export interface PropertyJSON {
    countyId: string | undefined;
    cityId: string | undefined;
    stateId: string;
    zipcodeId: string | undefined;
    userId: string | undefined;
    propertyTypeId: string;
    ownerId: string | undefined;
    name: string;
    streetAddress: string;
    rent: string;
    isPrimary: boolean;
    canTenantInitiate: boolean;
    status: string;
    registrationFee: number;
}

export interface Property {
    id: string;
    name: string;
    streetAddress: string;
}

export interface ServiceProviderDetail {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    company: string;
    distanceCovered: string;
    perHourRate: number;
    isPublic: string;

}

export interface TenantProperty {
    id: string;
    name: string;
    streetAddress: string;
    owner: string;
}

export interface GeneralServiceType {
    count: number;
    id: string;
    serviceType: string;
}

export interface SpecificServiceType {
    id: string;
    parentId: string;
    serviceType: string;
}

export interface Timeline {
    id: string;
    title: string;
}

export interface PropertyDetail {
    name: string;
    cityName: string;
    countyName: string;
    stateName: string;
    propertyType: string;
    isPrimary: boolean;
    isTenantActive: boolean;
    streetAddress: string;
    zipcode: string;
    rent: number;
}

export interface Timeline {
    id: string;
    title: string;
}

export interface ServiceType {
    id: string;
    serviceType: string | null;
    parent: {
      id: string;
      serviceType: string;
    }
}

export interface Proposal {
  id: string;
  serviceRequestId: string;
  initiatorId: string;
  serviceProviderId: string;
  serviceProvider: ServiceProvider;
  quotePrice: number | undefined;
  quoteType: string;
  estimatedHours: number | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  detail: string | undefined;
  status: string;
}

export interface ServiceRequestSP {
    createdAt: string;
    id: string;
    status: string;
    timeline: {
      title: string;
    }
    initiator: {
      firstName: string;
      lastName: string;
      id: string;
    }
    property: {
      id: string;
      name: string;
      streetAddress: string
    };
    serviceRequest: {
      detail: string;
    }
    serviceType: {
      id: string;
      serviceType: string;
    }
}

export interface ServiceOffering {
    service: SpecificServiceType | undefined;
    timeline: Timeline | undefined;
    detail: string | undefined;
}

export interface DashboardServiceParent {
    serviceType: string;
    childs: DashboardServiceChild[];
}

export interface DashboardServiceChild {
    serviceType: string;
}

export interface ServiceProviderWrapper {
    serviceProvider: ServiceProvider
}

export interface ServiceProvider {
    email: string,
    id: string,
    firstName: string,
    lastName: string,
    phone: string,
    spDetail: SPDetail
}

export interface SPDetail {
    address: string,
    cityId: string,
    company: string,
    countyId: string,
    distanceCovered: number,
    id: string,
    isAppliedForPublic: boolean,
    isBGChecked: boolean,
    isPublic: boolean,
    latitude: number,
    longitude: number,
    perHourRate: number,
    stateId: string,
    userId: string,
    zipcodeId: string
}

export interface RequestDetails {
    createdAt: string,
    detail: string,
    id: string,
    isTicket: boolean,
    property: Property,
    proposalCount: number,
    serviceType: ServiceType,
    status: string,
    timeline: Timeline,
    proposals: Proposal[] | undefined,
}

export interface TenantinPropertyDetail {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}

export interface TenantinPropertyDetail {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}

export interface Job {
    activityStatus: string;
    id: string;
    initiator: User;
    property: Property;
    proposal: Proposal;
    serviceType: ServiceType;
    status: string;
    timeline: Timeline;
}

export interface ChecksResult {
    checkName: string;
    result: string;
    status: string;
    statusLabel: string;
}

export interface TenantBGResult {
    id: string;
    tenantId: string;
    checksResult: ChecksResult[];
    isSuccess: boolean;
}

export type FormControlElement = HTMLInputElement | HTMLTextAreaElement;
