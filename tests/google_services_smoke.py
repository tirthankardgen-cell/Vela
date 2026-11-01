"""Run against a build with AdSense enabled and GA4 G-TEST123. Google requests are mocked."""
import os,json
from playwright.sync_api import sync_playwright
BASE=os.environ.get('VELA_BASE_URL','http://127.0.0.1:8767').rstrip('/')
KEY='vela-cookie-preferences-v1'
with sync_playwright() as p:
 launch={'args':['--no-sandbox']}
 if os.environ.get('CHROMIUM_PATH'):launch['executable_path']=os.environ['CHROMIUM_PATH']
 elif os.name!='nt':launch['executable_path']='/usr/bin/chromium'
 b=p.chromium.launch(**launch)
 def context():
  ctx=b.new_context(viewport={'width':390,'height':844})
  ctx.set_default_navigation_timeout(int(os.environ.get('VELA_NAVIGATION_TIMEOUT_MS','30000')))
  ctx.route('https://pagead2.googlesyndication.com/**',lambda route:route.fulfill(status=200,content_type='application/javascript',body='window.adsTestLoaded=true;'))
  ctx.route('https://www.googletagmanager.com/**',lambda route:route.fulfill(status=200,content_type='application/javascript',body='window.gaTestLoaded=true;'))
  return ctx
 ctx=context();page=ctx.new_page();page.goto(BASE)
 page.get_by_role('heading',name='Your privacy choices').wait_for()
 assert page.locator('script[src*="googlesyndication"],script[src*="googletagmanager"]').count()==0
 page.get_by_role('button',name='Necessary only',exact=True).click();page.reload()
 page.get_by_role('button',name='Privacy choices',exact=True).wait_for(state='visible')
 assert page.locator('script[src*="googlesyndication"],script[src*="googletagmanager"]').count()==0
 page.get_by_role('button',name='Privacy choices',exact=True).click()
 page.get_by_role('checkbox',name='Visit analytics',exact=True).check()
 page.get_by_role('button',name='Save choices',exact=True).click()
 page.wait_for_function('window.gaTestLoaded===true')
 assert page.locator('script[src*="adsbygoogle.js"]').count()==0
 page.goto(BASE+'/blog?email=private@example.com')
 page.wait_for_function("window.dataLayer?.some(entry=>entry[0]==='event'&&entry[1]==='page_view')")
 events=json.loads(page.evaluate('JSON.stringify(window.dataLayer.map(entry=>Array.from(entry)))'))
 assert 'private@example.com' not in json.dumps(events)
 assert all(entry[2]['page_location']=='https://velastudio.space/blog' for entry in events if entry[0]=='event')
 page.get_by_role('button',name='Privacy choices',exact=True).click()
 with page.expect_navigation():page.get_by_role('button',name='Necessary only',exact=True).click()
 assert page.locator('script[src*="googletagmanager"]').count()==0
 ctx.close()
 ctx=context();page=ctx.new_page();page.goto(BASE)
 page.get_by_role('button',name='Customise',exact=True).click()
 page.get_by_role('checkbox',name='Advertising',exact=True).check()
 page.get_by_role('button',name='Save choices',exact=True).click()
 page.wait_for_function('window.adsTestLoaded===true')
 assert page.locator('script[src*="adsbygoogle.js"]').get_attribute('src').endswith('client=ca-pub-6693217545827146')
 assert page.locator('script[src*="googletagmanager"]').count()==0
 assert page.goto(BASE+'/blog/a-guide-that-does-not-exist').status==404
 page.wait_for_load_state('networkidle')
 assert page.locator('script[src*="adsbygoogle.js"],.cookie-panel,.cookie-settings').count()==0
 assert page.evaluate('window.adsTestLoaded===undefined')
 page.goto(BASE);page.wait_for_function('window.adsTestLoaded===true')
 page.locator('.editorial-hero-copy a').click();page.wait_for_url('**/signup')
 assert page.locator('script[src*="adsbygoogle.js"],.cookie-panel,.cookie-settings').count()==0
 assert page.evaluate('window.adsTestLoaded===undefined')
 page.goto(BASE+'/faq');page.wait_for_function('window.adsTestLoaded===true')
 other=ctx.new_page();other.goto(BASE+'/contact');other.get_by_role('button',name='Privacy choices',exact=True).click()
 with page.expect_navigation():other.get_by_role('button',name='Necessary only',exact=True).click()
 assert page.locator('script[src*="adsbygoogle.js"]').count()==0
 ctx.close()
 ctx=context();ctx.add_init_script(f"localStorage.setItem('{KEY}',JSON.stringify({{analytics:true,advertising:true,savedAt:Date.now()}}))")
 page=ctx.new_page()
 for path in ['/login','/signup','/start','/studio','/projects']:
  page.goto(BASE+path);assert page.locator('script[src*="adsbygoogle.js"],script[src*="googletagmanager"],.cookie-panel').count()==0
 ctx.close();b.close()
print('PASS optional tag consent, persistence, analytics-only, ads-only, query privacy, withdrawal, cross-tab withdrawal and clean account/workspace navigation')
