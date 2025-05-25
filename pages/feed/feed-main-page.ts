import { Locator, Page } from '@playwright/test'
import { FilterDropdownComponent } from './components/filter-dropdown-component'
import { SavedFiltersDropdownComponent } from './components/saved-fitlers-dropdown-component'
import { FeedViewComponent } from './components/feed-view-component'

export class FeedMainPage {
    static   readonly url                 : string = '/en/app/uberall/crossfeed'
    readonly page                         : Page
    readonly allPostsNumber               : Locator
    readonly pendingApprovalButton        : Locator
    readonly searchInputBox               : Locator
    readonly exportButton                 : Locator
    readonly allPostsNumberTab            : Locator
    readonly bulkReplyButton              : Locator
    readonly bulkResolveButton            : Locator
    readonly noResultsMessage             : Locator
    readonly openFilterDropdownButton     : Locator
    readonly savedFiltersDropdownComponent: SavedFiltersDropdownComponent
    readonly filterDropdownComponent      : FilterDropdownComponent
    readonly feedViewComponent            : FeedViewComponent

    constructor(page: Page){
        this.page                          = page
        this.allPostsNumber                = page.getByTestId('crossfeed-all-post-number')
        this.allPostsNumberTab             = page.getByTestId('crossfeed-all-post-number-tab')
        this.pendingApprovalButton         = page.getByTestId('crossfeed-pending-approval-posts-tab')
        this.searchInputBox                = page.getByTestId('crossfeed-search-box')
        this.exportButton                  = page.getByTestId('export-crossfeed-btn')
        this.bulkReplyButton               = page.locator('#bulk-reply-btn')
        this.bulkResolveButton             = page.getByRole('button', { name: 'Resolve' })
        this.noResultsMessage              = page.locator('mf-message').getByText('No results were found. Check your filters.')
        this.openFilterDropdownButton      = page.getByTestId('crossfeed-filters_open-filters')
        this.savedFiltersDropdownComponent = new SavedFiltersDropdownComponent(page)
        this.filterDropdownComponent       = new FilterDropdownComponent(page)
        this.feedViewComponent             = new FeedViewComponent(page)
    }

    async goto() {
        await this.page.goto(FeedMainPage.url, { waitUntil: 'domcontentloaded' })
    }
}
