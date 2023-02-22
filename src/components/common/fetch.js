const fetchWithTimeoutAndHandling = async (url, timeout = 8000, options = {}) => {
    try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        console.log(url)
        const response = await fetch(url, {
            ...options,
            timeout: timeout,
            signal: controller.signal
        });
        clearTimeout(id);
        const result = await response.json();
        return result;
    } catch {
        console.error('Fetch Timeout from', url);
    }
}

export default fetchWithTimeoutAndHandling