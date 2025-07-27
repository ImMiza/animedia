import puppeteer, {Browser, Page} from 'puppeteer-core';

export interface PuppeteerClientOptions {
    delayMinMs?: number;
    delayMaxMs?: number;
    executablePath?: string;
}

export class PuppeteerClient {
    private browser?: Browser;
    private page?: Page;
    private pageCount = 0;

    private readonly delayMin: number;
    private readonly delayMax: number;
    private readonly userAgents: string[];
    private uaIndex = 0;

    constructor(private opts: PuppeteerClientOptions = {}) {
        this.delayMin = opts.delayMinMs ?? 1000;
        this.delayMax = opts.delayMaxMs ?? 1500;
        this.userAgents = this.shuffle([
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...Chrome/123',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...Firefox/124',
            // … autres UA
        ]);
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

    private async delay() {
        const ms = this.delayMin + Math.random() * (this.delayMax - this.delayMin);
        return new Promise(res => setTimeout(res, ms));
    }

    private async ensureBrowser(): Promise<Browser> {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: true,
                executablePath: this.opts.executablePath ?? '/opt/homebrew/bin/chromium',
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                userDataDir: undefined
            });
        }
        return this.browser;
    }

    private async initPage(): Promise<Page> {
        const browser = await this.ensureBrowser();

        if (!this.page) {
            this.page = await browser.newPage();
            await this.page.setRequestInterception(true);
            this.page.on('request', req => {
                const type = req.resourceType();
                if (['image', 'stylesheet', 'font'].includes(type)) {
                    req.abort();
                } else {
                    req.continue();
                }
            });
        }

        // reset page every 200 scrapes to avoid fuites mémoire
        if (++this.pageCount > 200) {
            await this.page.close();
            this.page = await browser.newPage();
            this.pageCount = 1;
            await this.page.setRequestInterception(true);
            this.page.on('request', req => {
                const type = req.resourceType();
                if (['image', 'stylesheet', 'font'].includes(type)) {
                    req.abort();
                } else {
                    req.continue();
                }
            });
        }

        return this.page;
    }

    public async get(url: string): Promise<string> {
        await this.delay();
        const page = await this.initPage();

        await page.setUserAgent(this.nextUA());
        await page.setViewport({ width: 1280, height: 800 });

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        return await page.content();
    }

    public async close(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = undefined;
            this.page = undefined;
            this.pageCount = 0;
        }
    }
}