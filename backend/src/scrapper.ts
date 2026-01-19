import puppeteer, { Browser, Page } from "puppeteer";
import * as cheerio from "cheerio";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";


// Global crash recovery
process.on("unhandledRejection", (err) => console.error("  Unhandled:", err));
process.on("uncaughtException", (err) => console.error(" Fatal:", err));

interface EngineOptions {
    recycleAfter?: number;
    enableSmartJS?: boolean;
    timeout?: number;
    retries?: number;
    [key: string]: any;
}

interface ScrapedData {
    website: string;
    scrapedAt: string;
    logo: string;
    name: string;
    description: string;
    businessType: string;
    keywords: string;
    email: string;
    phone: string;
    pages: {
        pricing: string;
        about: string;
        contact: string;
        blog: string;
        careers: string;
        docs: string;
    };
    socials: {
        twitter: string;
        linkedin: string;
        facebook: string;
        instagram: string;
        youtube: string;
        github: string;
    };
    technologies: string[];
    seo: {
        title: string;
        metaDescription: string;
        h1Count: number;
        hasOgTags: boolean;
        hasTwitterCard: boolean;
        imageCount: number;
        linkCount: number;
    };
    performance: {
        jsHeap: number;
        nodes: number;
        documents: number;
    };
    confidence: number;
    leadScore?: number;
    priority?: string;
    error?: string;
}

interface ScrapeMultipleOptions {
    batchSize?: number;
    delay?: number;
    screenshotHighPriority?: boolean;
}

export class WebsiteIntelligenceEngine {
    private browser: Browser | null = null;
    private jobs = 0;
    private activePages = 0;
    private maxPages = 6;
    private options: Required<EngineOptions>;

    constructor(options: EngineOptions = {}) {
        this.options = {
            recycleAfter: options.recycleAfter || 25,
            enableSmartJS: options.enableSmartJS !== false,
            timeout: options.timeout || 35000,
            retries: options.retries || 2,
            ...options,
        };
    }

    async initialize(): Promise<void> {
        this.browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-accelerated-2d-canvas",
                "--no-first-run",
                "--no-zygote",
                "--disable-gpu",
            ],
        });
    }

    private async resetInterception(page: Page): Promise<void> {
        await page.setRequestInterception(false);
        page.removeAllListeners("request");
        await page.setRequestInterception(true);
        page.on("request", (req) => {
            const block = [
                "doubleclick",
                "googletagmanager",
                "facebook",
                "hotjar",
                "google-analytics",
                "analytics.js",
                "fbevents.js",
            ];
            if (block.some((b) => req.url().includes(b))) {
                req.abort();
            } else {
                req.continue();
            }
        });
    }

    private async withJS<T>(page: Page & { _jsEnabled?: boolean }, fn: () => Promise<T>): Promise<T> {
        const prev = page._jsEnabled ?? false;
        try {
            await page.setJavaScriptEnabled(true);
            page._jsEnabled = true;
            return await fn();
        } finally {
            if (!prev) {
                await page.setJavaScriptEnabled(false);
                page._jsEnabled = false;
            }
        }
    }

    async scrape(url: string): Promise<ScrapedData> {
        if (!this.browser) await this.initialize();

        // Browser recycling - prevents Chrome memory bloat
        this.jobs++;
        if (this.jobs % this.options.recycleAfter === 0) {
            console.log(" Hard recycling browser...");
            // Close all orphan pages before browser restart
            const pages = await this.browser!.pages();
            await Promise.all(pages.map((p) => p.close().catch(() => { })));
            await this.close();
            await this.initialize();
        }

        // Wait for available page slot
        while (this.activePages >= this.maxPages) {
            await new Promise((r) => setTimeout(r, 300));
        }

        const page = (await this.browser!.newPage()) as Page & { _jsEnabled?: boolean };
        this.activePages++;
        page.on("close", () => this.activePages--);

        // Anti-fingerprinting - prevents Cloudflare detection
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, "webdriver", { get: () => false });
            (globalThis as any).chrome = { runtime: {} };
            Object.defineProperty(navigator, "languages", { get: () => ["en-US", "en"] });
            Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3] });
        });

        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );
        await page.setViewport({ width: 1920, height: 1080 });

        // DNS / TLS hang protection
        page.setDefaultNavigationTimeout(this.options.timeout);
        page.setDefaultTimeout(this.options.timeout);

        // Disable JS - extraction is DOM-based, reduces crash rate massively
        await page.setJavaScriptEnabled(false);
        page._jsEnabled = false;

        // Setup request interception once
        await this.resetInterception(page);

        console.log(`🔍 Scraping ${url}`);

        try {
            // Auto-retry on navigation failure
            let success = false;
            for (let i = 0; i < this.options.retries && !success; i++) {
                try {
                    await Promise.race([
                        page.goto(url, { waitUntil: "domcontentloaded" }),
                        new Promise((_, reject) =>
                            setTimeout(() => reject(new Error("Navigation timeout")), this.options.timeout)
                        ),
                    ]);
                    success = true;
                } catch (e) {
                    if (i === this.options.retries - 1) throw e;
                    console.log(`🔄 Retry ${i + 1}/${this.options.retries} for ${url}...`);
                }
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));

            let html = await page.content();
            let $ = cheerio.load(html);

            // Check for bot challenge pages (updated Cloudflare detection)
            const isBotChallenge =
                html.includes("cf-chl-bypass") ||
                html.includes("challenge-platform") ||
                html.includes("cf-turnstile") ||
                html.includes("cf-browser-verification") ||
                html.includes("Just a moment") ||
                html.includes("Checking your browser") ||
                html.includes("DDoS protection");

            if (isBotChallenge) {
                console.log(`🛡️  Bot challenge detected, enabling JS...`);
                await this.withJS(page, async () => {
                    await this.resetInterception(page);
                    await page.reload({ waitUntil: "domcontentloaded" });
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    html = await page.content();
                    $ = cheerio.load(html);
                });
            }

            // Detect if SPA and reload with JS if needed
            const isSPA = this.detectSPA(html, $);

            if (isSPA && this.options.enableSmartJS && !isBotChallenge) {
                console.log(` SPA detected, enabling JS...`);
                await this.withJS(page, async () => {
                    await this.resetInterception(page);
                    await page.reload({ waitUntil: "domcontentloaded" });
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    html = await page.content();
                    $ = cheerio.load(html);
                });
            }

            const metrics = await page.metrics();

            const data: ScrapedData = {
                website: url,
                scrapedAt: new Date().toISOString(),
                logo: this.getLogo($, url),
                name: this.getName($),
                description: this.getDescription($),
                businessType: this.detectBusinessType($, html),
                keywords: this.getKeywords($),
                email: this.findEmail($, html),
                phone: this.findPhone($),
                pages: {
                    pricing: this.findPage($, url, "pricing"),
                    about: this.findPage($, url, "about"),
                    contact: this.findPage($, url, "contact"),
                    blog: this.findPage($, url, "blog"),
                    careers: this.findPage($, url, "career"),
                    docs: this.findPage($, url, "docs"),
                },
                socials: this.extractSocials($),
                technologies: this.detectTechnologies($, html),
                seo: this.getSEOData($),
                performance: {
                    jsHeap: metrics.JSHeapUsedSize ?? 0,
                    nodes: metrics.Nodes ?? 0,
                    documents: metrics.Documents ?? 0,
                },

                confidence: this.calculateConfidence($, html),
            };

            // Calculate lead score
            const enrichedData = this.calculateLeadScore(data);

            await page.close();
            return enrichedData;
        } catch (error) {
            await page.close();
            throw error;
        }
    }

    private detectSPA(html: string, $: cheerio.CheerioAPI): boolean {
        // Real SPA signals - strict detection
        const spaIndicators = [
            html.includes("NEXT_DATA"),
            html.includes("_next/static"),
            html.includes("NUXT"),
            html.includes("_nuxt/"),
            html.includes("ng-version"),
        ];

        // Check for empty body with Next.js scripts (true SPA pattern)
        const bodyText = $("body").text().trim();
        const hasEmptyBody = bodyText.length < 100;
        const hasNextScripts = $('script[src*="_next"]').length > 0;
        const hasNuxtScripts = $('script[src*="_nuxt"]').length > 0;

        if (hasEmptyBody && (hasNextScripts || hasNuxtScripts)) {
            spaIndicators.push(true);
        }

        // Require at least 2 strong signals
        return spaIndicators.filter(Boolean).length >= 2;
    }

    private getLogo($: cheerio.CheerioAPI, base: string): string {
        let src =
            $("img[src*='logo'], img[alt*='logo'], .logo img, [class*='logo'] img")
                .first()
                .attr("src") || "";

        // Try og:image as fallback
        if (!src) {
            src = $("meta[property='og:image']").attr("content") || "";
        }

        if (src && !src.startsWith("http")) {
            try {
                src = new URL(src, base).href;
            } catch (e) {
                src = "";
            }
        }
        return src;
    }

    private getName($: cheerio.CheerioAPI): string {
        return (
            $("meta[property='og:site_name']").attr("content") ||
            $("meta[name='application-name']").attr("content") ||
            $("title").text().split("|")[0]?.split("-")[0]?.trim() || 'company'
        );
    }

    private getDescription($: cheerio.CheerioAPI): string {
        return (
            $("meta[name='description']").attr("content") ||
            $("meta[property='og:description']").attr("content") ||
            ""
        );
    }

    private getKeywords($: cheerio.CheerioAPI): string {
        return $("meta[name='keywords']").attr("content") || "";
    }

    private getSEOData($: cheerio.CheerioAPI) {
        return {
            title: $("title").text(),
            metaDescription: $("meta[name='description']").attr("content") || "",
            h1Count: $("h1").length,
            hasOgTags: $("meta[property^='og:']").length > 0,
            hasTwitterCard: $("meta[name^='twitter:']").length > 0,
            imageCount: $("img").length,
            linkCount: $("a").length,
        };
    }

    private findPage($: cheerio.CheerioAPI, base: string, keyword: string): string {
        const link = $(`a[href*='${keyword}']`).first().attr("href");
        if (!link) return "";
        try {
            if (link.startsWith("http")) return link;
            if (link.startsWith("/")) return new URL(link, base).href;
            return "";
        } catch (e) {
            return "";
        }
    }

    private findEmail($: cheerio.CheerioAPI, html: string): string {
        const mails = new Set<string>();
        const emailQuality = new Map<string, string>();

        // Blocklist for spam/legal emails
        const emailBlocklist = [
            "privacy@",
            "legal@",
            "abuse@",
            "noreply@",
            "no-reply@",
            "donotreply@",
            "postmaster@",
            "webmaster@",
            "copyright@",
        ];

        // Check mailto links first (highest quality)
        $("a[href^='mailto:']").each((_, el) => {
            const href = $(el).attr("href");
            if (!href) return; // ⬅️ guard clause

            const email = href
                ?.replace(/^mailto:/i, "")
                ?.split("?")[0]
                ?.trim()
                ?.toLowerCase();

            if (!email) return;

            if (!emailBlocklist.some(blocked => email.startsWith(blocked))) {
                mails.add(email);
                emailQuality.set(email, "high");
            }
        });


        // Check contact section (excluding footer)
        const contactSection = $(
            "section:contains('Contact'), div:contains('Contact'), #contact, .contact"
        )
            .not("footer")
            .text();
        const contactRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
        const contactMatches = contactSection.match(contactRegex) || [];

        contactMatches.forEach((email) => {
            const lowerEmail = email.toLowerCase();
            if (!emailBlocklist.some((blocked) => lowerEmail.startsWith(blocked))) {
                if (!emailQuality.has(lowerEmail)) {
                    emailQuality.set(lowerEmail, "medium");
                }
                mails.add(lowerEmail);
            }
        });

        // Scan body text (lowest priority)
        const bodyText = $("body").not("footer").text();
        const bodyRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
        const bodyMatches = bodyText.match(bodyRegex) || [];

        bodyMatches.forEach((email) => {
            const lowerEmail = email.toLowerCase();
            if (
                !emailQuality.has(lowerEmail) &&
                !emailBlocklist.some((blocked) => lowerEmail.startsWith(blocked))
            ) {
                emailQuality.set(lowerEmail, "low");
                mails.add(lowerEmail);
            }
        });

        // Filter out fake/placeholder emails
        const validEmails = [...mails].filter((email) => {
            const lower = email.toLowerCase();
            const blocklist = [
                "example.com",
                "domain.com",
                "email.com",
                "test.com",
                "your@",
                "name@",
                "user@",
                "info@example",
                "support@example",
                "contact@example",
                "hello@example",
                "admin@example",
            ];
            return !blocklist.some((blocked) => lower.includes(blocked));
        });

        // Return highest quality email found
        const highQuality = validEmails.find((e) => emailQuality.get(e) === "high");
        const mediumQuality = validEmails.find((e) => emailQuality.get(e) === "medium");

        return highQuality || mediumQuality || validEmails[0] || "";
    }

    private findPhone($: cheerio.CheerioAPI): string {
        const text = $("body").text();

        // Improved phone pattern - avoids IDs and dates
        const pattern = /\+?\d{1,3}[\s.-]?\d{2,4}?[\s.-]\d{3,4}[\s.-]\d{4}/g;

        const match = text.match(pattern);
        if (match && match[0]) {
            return match[0].replace(/\s+/g, " ").trim();
        }

        return "";
    }

    private extractSocials($: cheerio.CheerioAPI) {
        const socials = {
            twitter: "",
            linkedin: "",
            facebook: "",
            instagram: "",
            youtube: "",
            github: "",
        };

        $("a").each((_, el) => {
            const href = $(el).attr("href") || "";
            if ((href.includes("twitter.com") || href.includes("x.com")) && !socials.twitter)
                socials.twitter = href;
            if (href.includes("linkedin.com") && !socials.linkedin) socials.linkedin = href;
            if (href.includes("facebook.com") && !socials.facebook) socials.facebook = href;
            if (href.includes("instagram.com") && !socials.instagram) socials.instagram = href;
            if (href.includes("youtube.com") && !socials.youtube) socials.youtube = href;
            if (href.includes("github.com") && !socials.github) socials.github = href;
        });

        return socials;
    }

    private detectTechnologies($: cheerio.CheerioAPI, html: string): string[] {
        const tech: string[] = [];

        // Framework detection
        if (html.includes("__NEXT_DATA__") || html.includes("_next/static")) tech.push("Next.js");

        if (html.includes("data-reactroot") || html.includes("data-react") || html.includes("__REACT"))
            tech.push("React");

        if (html.includes("__NUXT__") || html.includes("_nuxt/")) tech.push("Nuxt.js");

        if (html.includes("ng-version") || $("[ng-version]").length > 0) tech.push("Angular");

        // CMS detection
        if (
            html.includes("wp-content") ||
            html.includes("wp-json") ||
            $('meta[name="generator"]').attr("content")?.includes("WordPress")
        )
            tech.push("WordPress");

        if (html.includes("shopify") || html.includes("cdn.shopify.com")) tech.push("Shopify");

        if (html.includes("wix.com") || html.includes("parastorage.com")) tech.push("Wix");

        if (html.includes("squarespace")) tech.push("Squarespace");

        // Hosting/Platform
        if ($('meta[name="vercel-deployment-id"]').length > 0 || html.includes("_vercel"))
            tech.push("Vercel");

        if (html.includes("netlify") || $('meta[name="netlify"]').length > 0) tech.push("Netlify");

        // Analytics (if not blocked)
        if (html.includes("google-analytics") || html.includes("gtag"))
            tech.push("Google Analytics");

        if (html.includes("plausible")) tech.push("Plausible");

        return [...new Set(tech)];
    }

    private detectBusinessType($: cheerio.CheerioAPI, html: string): string {
        const text = $("body").text().toLowerCase();
        const title = $("title").text().toLowerCase();
        const description = $("meta[name='description']").attr("content")?.toLowerCase() || "";
        const fullText = `${text} ${title} ${description}`;

        // Weighted scoring system
        type BusinessType =
            | "Developer Platform"
            | "B2B SaaS"
            | "Consumer SaaS"
            | "E-Commerce"
            | "Service Business"
            | "EdTech"
            | "Agency"
            | "Media/Blog";

        const scores: Record<BusinessType, number> = {
            "Developer Platform": 0,
            "B2B SaaS": 0,
            "Consumer SaaS": 0,
            "E-Commerce": 0,
            "Service Business": 0,
            "EdTech": 0,
            "Agency": 0,
            "Media/Blog": 0,
        };

        // Developer Platform signals (improved detection)
        if (
            (fullText.includes("api") &&
                (fullText.includes("docs") || fullText.includes("documentation"))) ||
            this.findPage($, "", "docs")
        ) {
            scores["Developer Platform"] += 40;
        }
        if (fullText.includes("sdk") || fullText.includes("developer"))
            scores["Developer Platform"] += 20;

        // B2B SaaS signals
        if (fullText.includes("enterprise") || fullText.includes("teams")) scores["B2B SaaS"] += 30;
        if (fullText.includes("sso") || fullText.includes("compliance")) scores["B2B SaaS"] += 25;
        if (fullText.includes("dashboard") && fullText.includes("analytics"))
            scores["B2B SaaS"] += 20;

        // Consumer SaaS signals
        if (fullText.includes("free trial") && !fullText.includes("enterprise"))
            scores["Consumer SaaS"] += 25;
        if (fullText.includes("sign up") && fullText.includes("month"))
            scores["Consumer SaaS"] += 20;

        // E-Commerce signals
        if (fullText.includes("add to cart") || fullText.includes("shop now"))
            scores["E-Commerce"] += 50;
        if (fullText.includes("checkout") || fullText.includes("free shipping"))
            scores["E-Commerce"] += 30;
        if ($('[class*="product"]').length > 5) scores["E-Commerce"] += 20;

        // Service Business signals
        if (
            fullText.includes("book appointment") ||
            fullText.includes("schedule consultation")
        )
            scores["Service Business"] += 40;
        if (fullText.includes("contact us") && fullText.includes("quote"))
            scores["Service Business"] += 20;

        // EdTech signals
        if (fullText.includes("courses") || fullText.includes("students")) scores["EdTech"] += 35;
        if (fullText.includes("learn") && fullText.includes("certification")) scores["EdTech"] += 25;

        // Agency signals (require pricing or contact page to avoid blog false positives)
        if (
            fullText.includes("portfolio") &&
            fullText.includes("clients") &&
            (this.findPage($, "", "pricing") || this.findPage($, "", "contact"))
        ) {
            scores["Agency"] += 35;
        }
        if (fullText.includes("case studies") || fullText.includes("our work"))
            scores["Agency"] += 25;

        // Media/Blog signals
        if ($("article").length > 3) scores["Media/Blog"] += 40;
        if (fullText.includes("subscribe") && fullText.includes("newsletter"))
            scores["Media/Blog"] += 20;

        // Return highest scoring category
        const businessTypes = Object.keys(scores) as BusinessType[];

        const type = businessTypes.reduce((a, b) =>
            scores[a] > scores[b] ? a : b
        );

        return scores[type] > 20 ? type : "General Business";

    }

    private calculateConfidence($: cheerio.CheerioAPI, html: string): number {
        let confidence = 0;
        const maxConfidence = 100;

        // Check for real H1
        const h1 = $("h1").first().text().trim();
        if (h1 && h1.length > 10 && h1.length < 100) confidence += 15;

        // Check content quality
        const bodyText = $("body").text().trim();
        if (bodyText.length > 2000) confidence += 20;
        if (bodyText.length > 5000) confidence += 10;

        // Check for pricing page
        if (this.findPage($, "", "pricing")) confidence += 15;

        // Check for bot challenge
        const isBotChallenge =
            html.includes("cf-browser-verification") || html.includes("Just a moment");
        if (isBotChallenge) confidence -= 30;

        // Check for real navigation
        if ($("nav").length > 0 || $("header a").length > 3) confidence += 10;

        // Check for contact info
        if ($("a[href^='mailto:']").length > 0) confidence += 10;
        if ($("a[href^='tel:']").length > 0) confidence += 5;

        // Check SEO quality
        if ($("meta[name='description']").attr("content")) confidence += 10;
        if ($("meta[property^='og:']").length > 0) confidence += 5;

        return Math.min(confidence, maxConfidence);
    }

    private calculateLeadScore(data: ScrapedData): ScrapedData {
        let score = 0;

        // Email quality scoring
        if (data.email) {
            // Check if email looks like contact page email
            if (
                data.email.includes("contact") ||
                data.email.includes("info") ||
                data.email.includes("hello") ||
                data.email.includes("sales")
            ) {
                score += 30; // Real contact email
            } else if (data.email.includes("support") || data.email.includes("admin")) {
                score += 15; // Footer/support email
            } else {
                score += 10; // Generic email
            }
        }

        if (data.phone) score += 15;

        // Business signals - pricing page only counts with good confidence
        if (data.pages.pricing && data.confidence > 60) score += 20;
        if (data.businessType === "B2B SaaS") score += 25;
        if (data.businessType === "Developer Platform") score += 20;
        if (data.businessType === "E-Commerce") score += 15;

        // Social presence
        if (data.socials.linkedin) score += 10;
        if (data.socials.twitter) score += 5;
        if (data.socials.github) score += 5;

        // Performance (good performance = serious business)
        if (data.performance.jsHeap < 30000000) score += 10;

        // SEO quality
        if (data.seo.hasOgTags) score += 5;
        if (data.seo.metaDescription) score += 5;

        // Confidence penalty
        if (data.confidence < 50) score -= 20;
        if (data.confidence < 30) score -= 30;

        // Determine priority
        let priority = "Low";
        if (score >= 70) priority = "High";
        else if (score >= 40) priority = "Medium";

        return {
            ...data,
            leadScore: Math.max(0, Math.min(score, 100)),
            priority,
        };
    }

    async scrapeMultiple(
        urls: string[],
        options: ScrapeMultipleOptions = {}
    ): Promise<ScrapedData[]> {
        const results: ScrapedData[] = [];
        const batchSize = options.batchSize || 1;
        const delay = options.delay || 2000;
        const screenshotHighPriority = options.screenshotHighPriority || false;

        for (let i = 0; i < urls.length; i += batchSize) {
            const batch = urls.slice(i, i + batchSize);

            const batchResults = await Promise.allSettled(batch.map((url) => this.scrape(url)));

            for (let j = 0; j < batchResults.length; j++) {
                const result: any = batchResults[j];
                if (result.status === "fulfilled") {
                    const data = result.value;

                    // Auto-screenshot high priority leads
                    if (screenshotHighPriority && data.leadScore && data.leadScore >= 70) {
                        try {
                            // Ensure leads directory exists
                            await fs.mkdir("leads", { recursive: true });

                            const domain = new URL(data.website).hostname.replace("www.", "");
                            await this.takeScreenshot(data.website, `leads/${domain}.png`);
                        } catch (e: any) {
                            console.error(`Screenshot failed for ${data.website}: ${e.message}`);
                        }
                    }

                    results.push(data);
                    console.log(
                        `[${i + j + 1}/${urls.length}] ${batch[j]} | Score: ${data.leadScore} | Confidence: ${data.confidence}%`
                    );
                } else {
                    console.error(
                        `❌ [${i + j + 1}/${urls.length}] ${batch[j]}: ${result.reason.message}`
                    );
                    results.push({
                        website: batch[j],
                        error: result.reason.message,
                        scrapedAt: new Date().toISOString(),
                    } as ScrapedData);
                }
            }

            if (i + batchSize < urls.length) {
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }

        return results;
    }

    // Export by niche
    async exportByNiche(
        results: ScrapedData[],
        outputDir = "./exports"
    ): Promise<Record<string, ScrapedData[]>> {
        // Ensure output directory exists
        await fs.mkdir(outputDir, { recursive: true });

        const niches: Record<string, ScrapedData[]> = {};

        results.forEach((result) => {
            if (result.error) return;

            const type = result.businessType.toLowerCase().replace(/\s+/g, "_");
            if (!niches[type]) niches[type] = [];
            niches[type].push(result);
        });

        for (const [niche, data] of Object.entries(niches)) {
            const filename = `${outputDir}/${niche}_leads.csv`;
            await this.saveCSV(data, filename);
            console.log(` Exported ${data.length} ${niche} leads`);
        }

        return niches;
    }

    async takeScreenshot(url: string, filename = "screenshot.png"): Promise<void> {
        if (!this.browser) await this.initialize();

        // Wait for available page slot
        while (this.activePages >= this.maxPages) {
            await new Promise((r) => setTimeout(r, 300));
        }

        const page = await this.browser!.newPage();
        this.activePages++;
        page.on("close", () => this.activePages--);

        await page.setViewport({ width: 1920, height: 1080 });

        try {
            await Promise.race([
                page.goto(url, { waitUntil: "domcontentloaded" }),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 30000)),
            ]);
            await page.screenshot({ path: filename, fullPage: true });
            console.log(` Screenshot saved: ${filename}`);
        } finally {
            await page.close();
        }
    }

    async save(data: ScrapedData | ScrapedData[], file = "output.json"): Promise<void> {
        await fs.writeFile(file, JSON.stringify(data, null, 2));
        console.log(`Saved to ${file}`);
    }

    async saveCSV(dataArray: ScrapedData[], filename = "output.csv"): Promise<void> {
        if (!dataArray || dataArray.length === 0) return;

        const headers = [
            "Website",
            "Name",
            "Business Type",
            "Lead Score",
            "Priority",
            "Confidence",
            "Email",
            "Phone",
            "Twitter",
            "LinkedIn",
            "Technologies",
        ];

        const rows = dataArray.map((d) => [
            d.website || "",
            d.name || "",
            d.businessType || "",
            d.leadScore || 0,
            d.priority || "",
            d.confidence || 0,
            d.email || "",
            d.phone || "",
            d.socials?.twitter || "",
            d.socials?.linkedin || "",
            d.technologies?.join(", ") || "",
        ]);

        const csv = [headers, ...rows]
            .map((row) =>
                row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
            )
            .join("\n");

        await fs.writeFile(filename, csv);
        console.log(`📊 CSV saved: ${filename}`);
    }

    async close(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}

// Example usage
async function main() {
    const engine = new WebsiteIntelligenceEngine({
        enableSmartJS: true,
        recycleAfter: 25,
        timeout: 35000,
    });

    try {
        // Single website with full intelligence
        console.log("\n🎯 === Single Website Analysis ===");
        const profile = await engine.scrape("https://stripe.com");
        console.log(` Lead Score: ${profile.leadScore} | Priority: ${profile.priority} `);
        await engine.save(profile, "stripe_intelligence.json");

        // Batch processing multiple sites
        console.log("\n🎯 === Batch Intelligence Gathering ===");
        const urls = [
            "https://github.com",
            "https://vercel.com",
            "https://openai.com",
            "https://anthropic.com",
        ];

        const results = await engine.scrapeMultiple(urls, {
            batchSize: 2,
            delay: 3000,
            screenshotHighPriority: true, // Auto-screenshot leads with score >= 70
        });

        // Filter by confidence and priority
        const highConfidence = results.filter((r) => r.confidence >= 70);
        const highPriority = results.filter((r) => r.priority === "High");

        console.log(`\n Found ${highPriority.length} high-priority leads`);
        console.log(` ${highConfidence.length} high-confidence profiles`);

        // Export by business niche
        await engine.exportByNiche(results, "./exports");

        await engine.save(results, "intelligence_report.json");
        await engine.saveCSV(highPriority, "high_priority_leads.csv");

        console.log("\n Intelligence gathering complete!");
    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await engine.close();
    }
}

// Run if this is the main module
const isDirectRun =
  process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main(); // OR quickTest()
}

export default WebsiteIntelligenceEngine;