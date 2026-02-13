export interface exportTypes {
    isEmail?: boolean,
    businesstype?: type,
    minLeadScore?: number,
    from?: Date,
    to?: Date,
    today?: Date
}
export enum type {
    "Developer Platform",
    "General Business",
    "B2B SaaS",
    "Consumer SaaS",
    "E-Commerce",
    "Service Business",
    "EdTech",
    "Agency",
    "Media/Blog",
}