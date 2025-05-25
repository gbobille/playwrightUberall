export async function decodeAndFilterUrl(url: string, queryParam: string): Promise<string[]> {
    // Decode the URL
    const decodedUrl = decodeURIComponent(url);

    // Extract the query parameters
    const queryParams = new URLSearchParams(decodedUrl.split('?')[1]);

    // Get the 'address' parameter and split it by commas
    const address = queryParams.get(queryParam);
    if (address) {
        return address.split(',').map(value => value.trim());
    }
    return [];
}