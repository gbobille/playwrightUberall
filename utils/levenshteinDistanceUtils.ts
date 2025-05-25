export default class LevenshteinUtils {

    // This method calculates the distance between two strings and calculates similarities and returns a percentage
    static levenshteinDistance(a: string, b: string): number {
        const matrix = Array.from({length: a.length + 1}, () => Array(b.length + 1).fill(0))

        for (let i = 0; i <= a.length; i++) {
            matrix[i][0] = i
        }

        for (let j = 0; j <= b.length; j++) {
            matrix[0][j] = j
        }

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1, // deletion
                    matrix[i][j - 1] + 1, // insertion
                    matrix[i - 1][j - 1] + cost // substitution
                )
            }
        }

        return matrix[a.length][b.length];
    }

    static similarityPercentage(a: string, b: string): number {
        const distance = this.levenshteinDistance(a, b)
        const maxLength = Math.max(a.length, b.length)
        return ((maxLength - distance) / maxLength) * 100
    }

    /** This method checks if two strings are similar based on a threshold
     * reaching the threshold means the strings are similar and the check succeeds
     */

    static checkSimilarity(a: string, b: string, threshold = 85): boolean {
        const similarity = this.similarityPercentage(a, b)
        return similarity >= threshold
    }
}
