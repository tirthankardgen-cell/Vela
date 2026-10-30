"""Library navigation, isolated pages, transitions, keyboard focus and heaters."""
import os
from playwright.sync_api import sync_playwright
BASE=os.environ.get('VELA_BASE_URL','http://127.0.0.1:8766').rstrip('/')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':1440,'height':1000});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE+'/studio?demo=1');page.wait_for_function('Boolean(window.Vela)');before=page.evaluate('Vela.getLayout()')
 assert page.locator('#catalogue details').count()==0 and page.locator('#catalogue [data-kind]').count()==0
 assert page.locator('#studio-objects .catalogue-item-card').count()==0
 assert not page.locator('#catalogue-type-filters').is_visible()
 assert page.locator('#catalogue-room').is_visible()
 page.screenshot(path='/tmp/vela-library-overview.png')
 page.locator('[data-group="Sofas"]').click();assert page.locator('.library-tabs').is_visible()
 page.locator('[data-type="Loveseat"]').click();assert page.locator('#catalogue [data-kind]').count()==1
 assert page.locator('#catalogue [data-kind="sofa-loveseat"]').is_visible()
 page.locator('[data-type="Sectional"]').click();assert page.locator('#catalogue [data-kind="lsofa"]').is_visible()
 page.locator('[data-type="All"]').click();assert page.locator('#catalogue [data-kind]').count()==4
 page.screenshot(path='/tmp/vela-library-opened.png')
 page.locator('#catalogue-back').click();page.locator('[data-category="all"]').click();assert page.locator('#catalogue [data-group]').count()>7
 page.locator('[data-category="furniture"]').click();assert page.evaluate('Vela.getLayout()')==before
 page.locator('[data-group="Tables"]').focus();page.keyboard.press('Enter')
 assert page.locator('#catalogue-title').inner_text()=='Tables'
 assert page.locator('#catalogue [data-kind]').count()==6 and page.locator('#catalogue [data-group]').count()==0
 assert page.locator('.library-tabs').is_visible()
 assert page.locator('#catalogue').evaluate('(el)=>el.getAnimations().length')==1
 page.locator('#catalogue-back').click();assert page.locator('[data-group="Tables"]').evaluate('(el)=>el===document.activeElement')
 page.locator('[data-category="electronics"]').click();assert page.locator('[data-category="climate"]').count()==0
 assert page.locator('#catalogue [data-group]').count()==4;assert page.locator('[data-group="Kitchen appliances"]').is_visible();assert page.locator('[data-group="Laundry"]').is_visible()
 page.locator('[data-group="Climate control"]').click();assert page.locator('#catalogue [data-group]').count()==3
 page.locator('[data-group="Heaters"]').click();assert page.locator('#catalogue [data-kind]').count()==3
 assert page.evaluate('Vela.getLayout()')==before
 page.locator('[data-kind="heater-panel"]').click();heater=page.evaluate('Vela.getLayout().items.at(-1)');assert heater['kind']=='heater' and heater['e']==.15
 assert page.locator('[data-resize]').count()==8
 page.locator('#catalogue-back').click();assert page.locator('#catalogue-title').inner_text()=='Climate control'
 page.locator('#catalogue-back').click();assert page.locator('[data-group="TV & media"]').is_visible()
 page.emulate_media(reduced_motion='reduce');page.locator('[data-group="Climate control"]').click()
 assert page.locator('#catalogue').evaluate('(el)=>el.getAnimations().length')==0
 page.locator('#catalogue-search').fill('sliding door');assert page.locator('[data-kind="door-sliding"]').count()==1
 page.locator('#catalogue-back').click();assert page.locator('#catalogue-title').inner_text()=='Climate control'
 page.locator('#catalogue-clear').click();page.set_viewport_size({'width':390,'height':844});page.locator('#studio-objects').wait_for(state='hidden')
 page.get_by_role('button',name='Library',exact=True).click();page.locator('#studio-objects').wait_for(state='visible')
 page.locator('[data-group="Climate control"]').click();page.locator('[data-group="Fans"]').click()
 assert page.locator('#catalogue-back').is_visible() and page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.screenshot(path='/tmp/vela-library-mobile.png')
 page.reload();page.wait_for_function('Boolean(window.Vela)');assert page.evaluate('Vela.getLayout().items.at(-1).variant')=='heater-panel'
 assert not errors,errors
 b.close()
print('PASS icon pages, nested climate categories, isolated options, back/focus, slide and reduced motion, search, heater save/reload and mobile')
