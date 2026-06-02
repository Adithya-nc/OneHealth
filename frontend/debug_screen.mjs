import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.stack || error.message));

  console.log("Navigating to http://localhost:5175/ ...");
  await page.goto('http://localhost:5175/', { waitUntil: 'networkidle2' });
  
  await page.screenshot({ path: 'landing_crash.png' });
  
  await page.evaluate(() => {
    localStorage.setItem('onehealth-auth', JSON.stringify({
      state: { user: { id: 1, name: 'Priya' }, role: 'patient', isAuthenticated: true },
      version: 0
    }));
  });

  console.log("Navigating to http://localhost:5175/dashboard ...");
  await page.goto('http://localhost:5175/dashboard', { waitUntil: 'networkidle2' });
  
  await new Promise(r => setTimeout(r, 2000));
  
  await page.screenshot({ path: 'dashboard_crash.png' });
  
  const content = await page.content();
  if (content.length < 500) {
     console.log("SCREEN IS BLANK. HTML:", content);
  } else {
     console.log("SCREEN IS NOT BLANK. Length:", content.length);
  }
  
  await browser.close();
})();
