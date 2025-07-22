import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface AxiosClientOptions {
    proxy?: {
        host: string;
        port: number;
        protocol?: string;
        auth?: { username: string; password: string };
    };
    delayMinMs?: number;
    delayMaxMs?: number;
}

export class AxiosClient {
    private client: AxiosInstance;
    private readonly delayMin: number;
    private readonly delayMax: number;
    private readonly userAgents: string[];
    private uaIndex = 0;

    constructor(opts: AxiosClientOptions = {}) {
        this.delayMin = opts.delayMinMs ?? 300;
        this.delayMax = opts.delayMaxMs ?? 800;

        this.userAgents = this.shuffle([
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.2420.81',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:124.0) Gecko/20100101 Firefox/124.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15'
        ]);

        this.client = axios.create({
            proxy: opts.proxy,
            timeout: 15000,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
            }
        });
    }

    private shuffle(arr: string[]): string[] {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    private nextUA(): string {
        const ua = this.userAgents[this.uaIndex];
        this.uaIndex = (this.uaIndex + 1) % this.userAgents.length;
        return ua;
    }

    private buildHeaders(): Record<string, string> {
        const ua = this.nextUA();
        return {
            'User-Agent': ua,
            'Sec-CH-UA': ua.includes('Firefox')
                ? '"Firefox";v="124", "Not)A;Brand";v="24", "Mozilla";v="5"'
                : '"Chromium";v="123", "Not)A;Brand";v="24", "Google Chrome";v="123"',
            'Sec-CH-UA-Mobile': '?0',
            'Sec-CH-UA-Platform': ua.includes('Mac OS X') ? '"macOS"' : '"Windows"'
        };
    }

    private async delay() {
        const ms = this.delayMin + Math.random() * (this.delayMax - this.delayMin);
        return new Promise(r => setTimeout(r, ms));
    }

    public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        await this.delay();
        const headers = this.buildHeaders();
        const resp = await this.client.get<T>(url, { ...config });
        return resp.data;
    }

    public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        await this.delay();
        const headers = this.buildHeaders();
        const resp = await this.client.post<T>(url, data, { ...config, headers: { ...config?.headers, ...headers } });
        return resp.data;
    }
}
