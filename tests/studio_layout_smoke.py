"""Validate the compact workspace, navigation and simulated Google button."""
import os
from playwright.sync_api import sync_playwright
BASE=os.environ.get('VELA_BASE_URL','http://127.0.0.1:8766').rstrip('/')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':1440,'height':1000});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE+'/login')
 google=page.get_by_role('button',name='Try Google sign-in (preview)')
 assert set(google.locator('svg path').evaluate_all('(paths)=>paths.map(p=>p.getAttribute("fill"))'))=={'#4285F4','#34A853','#FBBC05','#EA4335'}
 google.click();page.wait_for_url('**/projects');assert 'Preview Designer' in page.locator('.projects-account').inner_text()
 page.goto(BASE+'/studio?demo=1');page.wait_for_function('Boolean(window.Vela)')
 stage=page.locator('#stage').bounding_box();assert stage=={'x':0,'y':0,'width':1440,'height':1000},stage
 original=page.evaluate('Vela.getLayout()')
 page.locator('[data-category="electronics"]').click();page.locator('[data-group="Climate control"]').click();page.locator('[data-group="Air conditioning"]').click();assert page.locator('#catalogue [data-kind="ac"]').count()==1;assert page.locator('#catalogue [data-kind="wall"]').count()==0
 page.locator('#catalogue-search').fill('couch');assert page.locator('#catalogue button').count()>=2
 page.locator('#catalogue-search').fill('closet');assert page.locator('#catalogue [data-kind="wardrobe"]').count()==1
 page.locator('.catalogue-filters').evaluate('(el)=>el.open=true');page.locator('#catalogue-room').select_option('kitchen');assert page.locator('#catalogue-empty').is_visible()
 page.locator('#catalogue-clear').click();page.locator('[data-category="electronics"]').click();page.locator('[data-group="TV & media"]').click();assert page.locator('#catalogue [data-kind="tv"]').count()==1
 page.locator('#catalogue-clear').click();page.locator('[data-category="decor"]').click();page.locator('[data-group="Rugs"]').click();assert page.locator('#catalogue [data-kind="rug"]').count()==1
 assert page.evaluate('Vela.getLayout()')==original
 page.get_by_role('button',name='Focus',exact=True).click();assert not page.locator('#studio-objects').is_visible();assert not page.locator('#studio-properties').is_visible();assert page.locator('#stage').bounding_box()==stage
 page.get_by_role('button',name='Library',exact=True).click()
 page.locator('#catalogue-clear').click();page.locator('[data-category="furniture"]').click()
 assert not page.locator('#room-preset').is_visible()
 page.get_by_text('Replace with a template',exact=True).click();page.locator('#room-preset').select_option('blank');assert page.evaluate('Vela.getLayout().items.length')==0
 page.locator('[data-category="structure"]').click();page.locator('[data-group="Walls"]').click();page.locator('[data-kind="wall"]').click();page.locator('#item-form').wait_for(state='visible')
 page.get_by_text('Project notes',exact=True).click();page.locator('#notes').fill('Keep this design');page.locator('#notes').press('Tab')
 page.locator('#view-mode').click();assert page.locator('#export-image svg').count()==1;assert page.locator('#export-label').inner_text()=='View PNG'
 page.locator('#plan-mode').click();assert page.locator('#export-label').inner_text()=='Plan SVG'
 for width in [1440,1024,820,780,390,360]:
  page.set_viewport_size({'width':width,'height':900});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
  for id in ['open-file','save-file','projects-button','present-button']:assert page.locator('#'+id).is_visible(),(width,id)
 if not page.locator('#studio-objects').is_visible(): page.get_by_role('button',name='Library',exact=True).click()
 assert page.locator('#studio-objects').is_visible()
 page.get_by_role('link',name='New space',exact=True).click();page.wait_for_url('**/start?demo=1')
 assert page.get_by_role('button',name='An empty home').is_visible()
 assert page.get_by_role('button',name='Upload a floor plan').is_visible()
 assert page.evaluate('JSON.parse(localStorage.getItem("vela-projects-v1")).some(p=>p.layout.notes==="Keep this design")')
 assert not errors,errors
 b.close()
print('PASS studio layout: fullscreen canvas, dismissible overlays, category/room filters, global aliases, unchanged geometry, four-colour Google simulation, template disclosure, editable wall, persistent export icons, mobile menus, and New space preserving the previous design.')
