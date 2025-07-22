import puppeteer, {Browser} from 'puppeteer-core';

export interface PuppeteerClientOptions {
    delayMinMs?: number;
    delayMaxMs?: number;
    executablePath?: string;
}

export class PuppeteerClient {
    private readonly delayMin: number;
    private readonly delayMax: number;
    private readonly userAgents: string[];
    private uaIndex = 0;
    private browser?: Browser;

    constructor(private opts: PuppeteerClientOptions = {}) {
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
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async ensureBrowser(): Promise<Browser> {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: true,
                executablePath: this.opts.executablePath ?? '/opt/homebrew/bin/chromium',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        }
        return this.browser;
    }

    public async get(url: string): Promise<string> {
        await this.delay();
        const browser = await this.ensureBrowser();
        const page = await browser.newPage();

        const ua = this.nextUA();
        await page.setUserAgent(ua);
        await page.setViewport({ width: 1280, height: 800 });

        // Charger la page et attendre que le réseau soit inactif
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        const content = await page.content();
        await page.close();
        return content;
    }

    public async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = undefined;
        }
    }
}