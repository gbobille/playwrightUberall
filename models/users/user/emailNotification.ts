
export default class EmailNotifications {
    digestEmail: boolean
    emailNotification: boolean
    pendingApprovals: boolean


    constructor(digestEmail: boolean , emailNotification: boolean , pendingApprovals: boolean) {
        this.digestEmail = digestEmail
        this.emailNotification = emailNotification
        this.pendingApprovals = pendingApprovals
    }
}
