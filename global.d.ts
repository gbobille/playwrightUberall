declare global {
    interface Fixtures {
        step: (name: string, body: () => Promise<void>) => Promise<void>;
    }
}