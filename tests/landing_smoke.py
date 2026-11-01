"""Check the editorial landing page, motion preferences and signup navigation."""
import os
from playwright.sync_api import sync_playwright, expect
BASE=os.environ.get('VELA_BASE_URL','http://127.0.0.1:8766').rstrip('/')
with sync_playwright() as p:
 launch={'args':['--no-sandbox']}
 if os.environ.get('CHROMIUM_PATH'):launch['executable_path']=os.environ['CHROMIUM_PATH']
 elif os.name!='nt':launch['executable_path']='/usr/bin/chromium'
 b=p.chromium.launch(**launch)
 page=b.new_page(viewport={'width':1440,'height':1000});errors=[];failed=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('response',lambda r:failed.append((r.url,r.status)) if r.status>=400 else None)
 page.goto(BASE);page.get_by_role('heading',name='Good spaces. Beautiful living.').wait_for()
 assert page.locator('.site-preview-banner,.studio-preview-section').count()==0
 assert page.locator('a[href*="demo="]').count()==0
 assert page.locator('.testimonial-card,.sample-tag').count()==0
 assert page.locator('#journal .blog-card').count()==3
 assert page.locator('#journal a[href="/blog"]').count()==1
 assert page.locator('.editorial-hero-copy a').get_attribute('href')=='/signup'
 assert page.locator('.editorial-hero-copy svg').count()==1
 # Scrolling drives image movement and reveals offscreen content.
 page.wait_for_function('document.querySelector(".hero-photograph img").style.getPropertyValue("--parallax-y")!==""')
 hero=page.locator('.hero-photograph img');before=hero.evaluate('(el)=>getComputedStyle(el).transform')
 page.evaluate('scrollTo(0,500)')
 page.wait_for_function('(before)=>getComputedStyle(document.querySelector(".hero-photograph img")).transform!==before',arg=before,timeout=5000)
 after=hero.evaluate('(el)=>getComputedStyle(el).transform');assert before!=after,(before,after)
 for section in ['#inspiration','#possibilities','.material-story','#process','#journal','.landing-closing']:
  page.locator(section).scroll_into_view_if_needed();page.wait_for_timeout(950)
  for el in page.locator(section+' [data-reveal]').all():
   el.scroll_into_view_if_needed()
   expect(el).to_have_css('opacity','1',timeout=3000)
 page.locator('#inspiration').scroll_into_view_if_needed()
 page.wait_for_function('Array.from(document.querySelectorAll("#inspiration img")).every(img=>img.complete&&img.naturalWidth>0)')
 for width in [1440,1024,768,390,360]:
  page.set_viewport_size({'width':width,'height':900});page.evaluate('scrollTo(0,0)');page.wait_for_timeout(100)
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
  assert page.locator('.site-header .lux-button').is_visible()
 page.emulate_media(reduced_motion='reduce');page.wait_for_timeout(100)
 assert page.locator('.reveal-pending').count()==0
 assert hero.evaluate('(el)=>getComputedStyle(el).transform')=='none'
 assert page.locator('h1').evaluate('(el)=>getComputedStyle(el).animationName')=='none'
 page.locator('.editorial-hero-copy a').click();page.wait_for_url('**/signup');assert page.locator('#auth-title').inner_text()=='Create an account'
 assert not errors,errors
 assert not failed,failed
 # Content remains usable when animation JavaScript is unavailable.
 fallback=b.new_context(java_script_enabled=False);plain=fallback.new_page();plain.goto(BASE)
 assert plain.locator('h1').is_visible();assert plain.locator('.reveal-pending').count()==0
 assert plain.locator('#journal .blog-card').count()==3
 b.close()
print('PASS landing: signup links, local images, planning guides, scroll/parallax motion, reduced-motion and no-JS fallback, responsive widths; no page errors.')
