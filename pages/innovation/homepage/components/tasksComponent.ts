import { Locator, Page } from 'playwright'

export class TasksComponent {
    readonly page: Page
    
    // Main task section elements
    readonly tasksSection: Locator
    readonly tasksSectionTitle: Locator
    readonly tasksListContainer: Locator
    
    // Task categories
    readonly profileCompletenessCategory: Locator
    readonly listingHealthCategory: Locator
    
    // Task items
    readonly taskItems: Locator
    readonly highPriorityTasks: Locator
    readonly loadMoreTasksButton: Locator
    
    // Task actions
    readonly snoozeTaskButton: Locator
    
    constructor(page: Page) {
        this.page = page
        
        // Main task section elements
        this.tasksSection = page.locator('div:has(> h1:contains("Key Tasks"))')
        this.tasksSectionTitle = page.locator('h1:contains("Key Tasks")')
        this.tasksListContainer = page.locator('main:near(h1:contains("Key Tasks"))')
        
        // Task categories
        this.profileCompletenessCategory = page.locator('div[role="button"]:has-text("Profile Completeness")')
        this.listingHealthCategory = page.locator('div[role="button"]:has-text("Listing Health")')
        
        // Task items
        this.taskItems = page.locator('li[class*="task-list-item"]')
        this.highPriorityTasks = page.locator('li[class*="task-list-item"][class*="HIGH"]')
        this.loadMoreTasksButton = page.getByRole('button', { name: 'Load More Tasks' })
        
        // Task actions
        this.snoozeTaskButton = page.locator('button:has([alt="snooze"])')
    }
    
    /**
     * Checks if the tasks section is visible on the page
     */
    async isTasksSectionVisible(): Promise<boolean> {
        return await this.tasksSection.isVisible()
    }
    
    /**
     * Gets the count of high priority tasks
     */
    async getHighPriorityTasksCount(): Promise<number> {
        await this.highPriorityTasks.first().waitFor({ state: 'visible' })
        return await this.highPriorityTasks.count()
    }
    
    /**
     * Clicks on the Profile Completeness category to expand it
     */
    async expandProfileCompletenessCategory(): Promise<void> {
        await this.profileCompletenessCategory.click()
    }
    
    /**
     * Clicks on the Listing Health category to expand it
     */
    async expandListingHealthCategory(): Promise<void> {
        await this.listingHealthCategory.click()
    }
    
    /**
     * Clicks on a specific task by index
     * @param index The index of the task to click on (0-based)
     */
    async clickOnTask(index: number): Promise<void> {
        const tasks = this.taskItems
        await tasks.nth(index).click()
    }
    
    /**
     * Clicks the Load More Tasks button if it exists
     * @returns true if button was clicked, false if not visible
     */
    async loadMoreTasks(): Promise<boolean> {
        if (await this.loadMoreTasksButton.isVisible()) {
            await this.loadMoreTasksButton.click()
            return true
        }
        return false
    }
    
    /**
     * Gets the text content of a task at a specific index
     * @param index The index of the task to get text from (0-based)
     */
    async getTaskText(index: number): Promise<string> {
        const task = this.taskItems.nth(index)
        return await task.textContent() || ''
    }
}