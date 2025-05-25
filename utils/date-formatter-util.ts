import { format } from 'date-fns'

/**
 * Formats the current date to a string in the specified format.
 *
 * @param {string} format - The format in which to output the date string. 
 *                          Example formats from date-fns:
 *                          - 'yyyy-MM-dd' (e.g., 2023-10-05)
 *                          - 'MM/dd/yyyy' (e.g., 10/05/2023)
 *                          - 'dd-MM-yyyy' (e.g., 05-10-2023)
 *                          - 'EEEE, MMMM do, yyyy' (e.g., Thursday, October 5th, 2023)
 *                          - 'HH:mm:ss' (e.g., 14:30:00)
 *                          - 'hh:mm a' (e.g., 02:30 PM)
 *                          - 'yyyy-MM-dd HH:mm:ss' (e.g., 2023-10-05 14:30:00)
 * @returns {string} The formatted date string.
 */
export async function formatCurrentDateToString(dateFormat: string): Promise<string> {
    const currentDateTime = format(new Date(), dateFormat)
    return currentDateTime.toString()
}
    