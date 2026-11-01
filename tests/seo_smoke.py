"""Check production discovery, article/FAQ agreement and public navigation."""
import os,json,xml.etree.ElementTree as ET
from playwright.sync_api import sync_playwright
BASE=os.environ.get('VELA_BASE_URL','http://127.0.0.1:8766').rstrip('/')
SITE='https://velastudio.space'
PUBLIC=['/','/about','/features','/how-it-works','/templates','/pricing','/faq','/blog','/contact','/terms','/privacy','/cookies']
def graphs(page):
 result=[]
 for raw in page.locator('script[type="application/ld+json"]').all_text_contents():
  data=json.loads(raw);result.extend(data.get('@graph',[data]))
 return result
with sync_playwright() as p:
 launch={'args':['--no-sandbox']}
 if os.environ.get('CHROMIUM_PATH'):launch['executable_path']=os.environ['CHROMIUM_PATH']
 elif os.name!='nt':launch['executable_path']='/usr/bin/chromium'
 b=p.chromium.launch(**launch);page=b.new_page(viewport={'width':390,'height':844});errors=[]
 page.on('pageerror',lambda error:errors.append(str(error)))
 sitemap=page.request.get(BASE+'/sitemap.xml');assert sitemap.ok
 urls=[n.text for n in ET.fromstring(sitemap.text()).iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
 articles=[url.removeprefix(SITE) for url in urls if '/blog/' in url]
 assert len(articles)==6 and len(set(urls))==18
 assert set(urls)=={SITE+('' if path=='/' else path) for path in PUBLIC+articles}
 for route in PUBLIC+articles:
  response=page.goto(BASE+route);assert response.status==200,(route,response.status)
  assert page.locator('h1').count()==1,route
  assert page.locator('link[rel="canonical"]').get_attribute('href').rstrip('/')==(SITE+route).rstrip('/'),route
  assert page.locator('meta[name="description"]').get_attribute('content'),route
  assert page.locator('meta[property="og:url"]').get_attribute('content').rstrip('/')==(SITE+route).rstrip('/'),route
  assert page.locator('meta[name="google-adsense-account"]').get_attribute('content')=='ca-pub-6693217545827146'
  for href in PUBLIC:assert page.locator(f'.public-links a[href="{href}"]').count()==1,(route,href)
  for width in [360,390,768,1440]:
   page.set_viewport_size({'width':width,'height':844})
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(route,width)
  schema=graphs(page);organization=next(x for x in schema if x['@type']=='Organization')
  assert organization['email']=='contact@velastudio.space'
  if route in ['/','/faq']:
   faq=next(x for x in schema if x['@type']=='FAQPage')
   details=page.locator('#faq details').all();assert len(faq['mainEntity'])==len(details)==(8 if route=='/' else 16)
   for item,detail in zip(faq['mainEntity'],details):
    assert detail.locator('summary').inner_text()==item['name']
    assert detail.locator('p').text_content()==item['acceptedAnswer']['text']
   page.locator('#faq summary').first.click();assert page.locator('#faq p').first.is_visible()
  if route in articles:
   article=next(x for x in schema if x['@type']=='BlogPosting')
   assert article['headline']==page.locator('h1').inner_text()
   assert article['datePublished'].startswith(page.locator('.article-byline time').first.get_attribute('datetime'))
   assert article['mainEntityOfPage']['@id']==SITE+route+'#page'
   breadcrumb=next(x for x in schema if x['@type']=='BreadcrumbList')
   assert [item['position'] for item in breadcrumb['itemListElement']]==[1,2,3]
  assert page.locator('script[src*="adsbygoogle.js"]').count()==0
 for route in ['/login','/signup','/reset-password','/projects','/start','/studio']:
  page.goto(BASE+route);values=page.locator('meta[name="robots"]').evaluate_all('(nodes)=>nodes.map(n=>n.content)')
  assert values and all('noindex' in value for value in values),route
 assert page.goto(BASE+'/blog/a-guide-that-does-not-exist').status==404
 assert 'noindex' in page.locator('meta[name="robots"]').first.get_attribute('content')
 robots=page.request.get(BASE+'/robots.txt');assert robots.ok and SITE+'/sitemap.xml' in robots.text()
 assert '/studio' not in robots.text() # allow crawling so noindex can be read
 ads=page.request.get(BASE+'/ads.txt');assert ads.ok and ads.text().strip()=='google.com, pub-6693217545827146, DIRECT, f08c47fec0942fa0'
 llms=page.request.get(BASE+'/llms.txt');assert llms.ok and SITE+'/blog/' in llms.text()
 feed=page.request.get(BASE+'/feed.xml');assert feed.ok and len(ET.fromstring(feed.text()).findall('./channel/item'))==6
 assert page.request.get(BASE+'/features',headers={'Host':'vela-dgen.vercel.app'},max_redirects=0).status==308
 assert not errors,errors
 b.close()
print('PASS 18 public pages, canonical/social metadata, navigation, mobile widths, article/FAQ schema, sitemap, feeds, ads.txt, old-host redirect, private noindex and 404')
