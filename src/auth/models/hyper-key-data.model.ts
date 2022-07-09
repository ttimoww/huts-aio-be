export default class HyperKeyData{
    discordTag: string;
    discordId: string;
    discordImage: string;
    email: string;
    planId: string;
    plan: string;
    key: string;
    licenseId: string;

    constructor(discordTag: string, discordId: string, discordImage: string, email: string, planId: string, plan: string, key: string, licenseId:string) {
        this.discordTag = discordTag;
        this.discordId = discordId;
        this.discordImage = discordImage;
        this.email = email;
        this.planId = planId;
        this.plan = plan;
        this.key = key;
        this.licenseId = licenseId;
    }
}