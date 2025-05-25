import UserDetails from "./userDetails";
import UserRights from "./userRights";
import EmailNotifications from "./emailNotification";

export default class User {
    userDetails: UserDetails
    userRights: UserRights
    emailNotifications: EmailNotifications

    constructor(userDetails: UserDetails, userRights: UserRights, emailNotifications: EmailNotifications) {
        this.userDetails = userDetails
        this.userRights = userRights
        this.emailNotifications = emailNotifications
    }
}