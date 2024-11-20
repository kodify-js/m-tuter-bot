import puppeteer from 'puppeteer';

// Launch the browser and open a new blank page
export const browser = await puppeteer.launch({ headless: true });
