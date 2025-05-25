export class FeedTestProperties {
    static readonly adminUsername: string                 = 'crossfeedAutomation@uberall.com'
    static readonly businessUsername: string              = 'crossfeedBusinessFilterUser@uberall.com'
    static readonly locationUsername: string              = 'crossfeedModeration@uberall.com'
    static readonly securityAdminUsername: string         = 'jonathan.shearen+1511Admin@uberall.com'
    static readonly secutriyBusinessUsername: string      = 'jonathan.shearen+1511BM@uberall.com'
    static readonly securityLocationUsername: string      = 'jonathan.shearen+1511LM@uberall.com'
    static readonly securityLocationGroupUsername: string = 'jonathan.shearen+1511LMG@uberall.com'
    static readonly businessID: string                    = '1583300'
      //TODO - Remove this suppression once the issue is fixed
      // @ts-expect-error: Suppress ts(2322) error
    static readonly crossfeedDefaultPassword: string = process.env.DEFAULT_FEED_PASSWORD
    static readonly facebookReview: string           = (process.env.ENVIRONMENT === 'production') ? 'v2_facebook_comment_3704613_1186679939':'v2_facebook_comment_3704613_2156673150'
}
