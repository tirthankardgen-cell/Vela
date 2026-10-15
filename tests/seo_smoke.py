import os,json,xml.etree.ElementTree as ET
from playwright.sync_api import sync_playwright
BASE=os.environ.get('VELA_BASE_URL','http://127.0.0.1:8766').rstrip('/')
SITE='https://vela-dgen.vercel.app'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':390,'height':844})
 for route in ['/','/about','/terms','/privacy']:
  response=page.goto(BASE+route);assert response.status==200
  assert page.locator('h1').count()==1
  assert page.locator('link[rel="canonical"]').get_attribute('href').rstrip('/')==(SITE+route).rstrip('/')
  assert page.locator('meta[name="description"]').get_attribute('content')
  for href in ['/about','/terms','/privacy','/#faq']:assert page.locator(f'.public-links a[href="{href}"]').count()==1
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),route
 page.goto(BASE);schema=json.loads(page.locator('script[type="application/ld+json"]').inner_text());faq=next(x for x in schema['@graph'] if x['@type']=='FAQPage')
 assert len(faq['mainEntity'])==page.locator('#faq details').count()==8
 for item,detail in zip(faq['mainEntity'],page.locator('#faq details').all()):
  assert detail.locator('summary').inner_text()==item['name'];assert detail.locator('p').text_content()==item['acceptedAnswer']['text']
 page.locator('#faq summary').first.click();assert page.locator('#faq p').first.is_visible()
 xml=page.request.get(BASE+'/sitemap.xml');assert xml.ok
 urls=[n.text for n in ET.fromstring(xml.text()).iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')];assert set(urls)=={SITE,SITE+'/about',SITE+'/terms',SITE+'/privacy'}
 robots=page.request.get(BASE+'/robots.txt');assert robots.ok and SITE+'/sitemap.xml' in robots.text()
 for route in ['/login','/signup','/projects','/start','/studio']:
  page.goto(BASE+route);values=page.locator('meta[name="robots"]').evaluate_all('(nodes)=>nodes.map(n=>n.content)');assert values and all('noindex' in v for v in values)
 b.close()
print('PASS public links, canonical metadata, visible/schema FAQ agreement, mobile policy pages, sitemap, robots and private-route noindex')
