declare global {
    interface Window {
        config: { SERVER_URL: string };
    }
}

window.config = {
    SERVER_URL: import.meta.env.VITE_SERVER || '${VITE_SERVER}',
};

export {};
