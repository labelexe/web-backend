import { Required } from "@tsed/common";


/**
 * Group Permissions Object
 */
export class groupPermissions {
    @Required()
    getWall: 1|0;
    @Required()
    postWall: 1|0;
    @Required()
    getShout: 1|0;
    @Required()
    postShout: 1|0;
    @Required()
    manage: 1|0;
}


/**
 * Info about a group
 */
export class groupDetails {
    @Required()
    groupId: number;
    @Required()
    groupName: string;
    @Required()
    groupDescription: string;
    @Required()
    groupOwnerUserId: number;
    @Required()
    groupIconCatalogId: number;
    @Required()
    groupMemberCount: number;
    @Required()
    groupStatus: groupStatus;
}

/**
 * Response from a Catalog Name from it's id
 */
export class MultiGetNames {
    /**
     * The Group's ID
     */
    @Required()
    groupId: number;
    /**
     * The Group's name
     */
    @Required()
    catalogName: string;
}
/**
 * Group Roleset Info
 */
export class roleInfo {
    /**
     * The ID
     */
    @Required()
    roleSetId: number;
    /**
     * The Name of the Role
     */
    @Required()
    name: string;
    /**
     * Short Description provided by a group admin
     */
    @Required()
    description: string;
    /**
     * The ID of the Group that owns this role
     */
    @Required()
    groupId: number;
    /**
     * The Role's Rank Value (0-255)
     */
    @Required()
    rank: number;
    /**
     * Permissions in the Group
     */
    @Required()
    permissions: groupPermissions;
}
/**
 * Group Funds Object
 */
export interface GroupFunds {
    Primary: number;
    Secondary: number;
}

export interface groupMember {
    userId: number;
    roleSetId: number;
}

export interface groupShout {
    userId: number;
    shout: string;
    date: object;
}

export interface wall {
    wallPostId: number;
    groupId: number;
    userId: number;
    wallPost: string;
    date: object;
}

/**
 * Is a group locked (aka banned)?
 */
export enum groupStatus {
    locked = 1,
    ok = 0,
}