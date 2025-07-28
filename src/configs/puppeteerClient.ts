import puppeteer, {Browser, Page} from 'puppeteer-core';

export interface PuppeteerClientOptions {
    delayMinMs?: number;
    delayMaxMs?: number;
    executablePath?: string;
}

export abstract class PuppeteerClient {
    private static browser?: Browser;
    private static page?: Page;

    private static delayMin: number;
    private static delayMax: number;
    private static userAgents: string[];
    private static uaIndex = 0;

    static async init(opts: PuppeteerClientOptions = {}): Promise<void> {
        this.delayMin = opts.delayMinMs ?? 1000;
        this.delayMax = opts.delayMaxMs ?? 1500;
        this.userAgents = this.shuffle([
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/37.0.2062.94 Chrome/37.0.2062.94 Safari/537.36",
            "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/600.8.9 (KHTML, like Gecko) Version/8.0.8 Safari/600.8.9",
        ]);

        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: true,
                executablePath: opts.executablePath ?? '/opt/homebrew/bin/chromium',
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                userDataDir: undefined
            });

            this.page = await this.browser.newPage();
        }
    }

    private static async delay() {
        const ms = this.delayMin + Math.random() * (this.delayMax - this.delayMin);
        return new Promise(res => setTimeout(res, ms));
    }

    private static nextUA(): string {
        const ua = this.userAgents[this.uaIndex];
        this.uaIndex = (this.uaIndex + 1) % this.userAgents.length;
        return ua;
    }

    private static shuffle(arr: string[]): string[] {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    static isAlreadyInit(): boolean {
        return !!this.browser;
    }

    static async get(url: string): Promise<string> {
        await this.delay();

        if (!this.page) {
            throw new Error("The puppeteer browser doesn't initialized");
        }

        await this.page.setUserAgent(this.nextUA());
        await this.page.setViewport({ width: 1280, height: 800 });

        await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        return await this.page.content();
    }

    public static async close(): Promise<void> {
        if (this.page && !this.page.isClosed()) {
            await this.page.close();
            this.page = undefined;
        }
        if (this.browser && this.browser.connected) {
            await this.browser.close();
            this.browser = undefined;
        }
    }
}