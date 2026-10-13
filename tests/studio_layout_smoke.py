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
 assert not page.locator('#room-preset').is_visible()
 page.get_by_text('Replace with a template',exact=True).click();page.locator('#room-preset').select_option('blank');assert page.evaluate('Vela.getLayout().items.length')==0
 page.locator('[data-category="structure"]').click();page.locator('[data-kind="wall"]').click();assert page.locator('#item-form').is_visible()
 page.get_by_text('Project notes',exact=True).click();page.locator('#notes').fill('Keep this design');page.locator('#notes').press('Tab')
 page.locator('#view-mode').click();assert page.locator('#export-image svg').count()==1;assert page.locator('#export-label').inner_text()=='View PNG'
 page.locator('#plan-mode').click();assert page.locator('#export-label').inner_text()=='Plan SVG'
 for width in [1440,1024,820,780,390,360]:
  page.set_viewport_size({'width':width,'height':900});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
  for id in ['open-file','save-file','projects-button','present-button']:assert page.locator('#'+id).is_visible(),(width,id)
 page.get_by_role('link',name='Objects',exact=True).click();assert page.locator('#studio-objects').evaluate('(el)=>el.getBoundingClientRect().top')<100
 page.get_by_role('link',name='New space',exact=True).click();page.wait_for_url('**/start?demo=1')
 assert page.get_by_role('button',name='An empty room').is_visible()
 assert page.get_by_role('button',name='Upload a floor plan').is_visible()
 assert page.evaluate('JSON.parse(localStorage.getItem("vela-projects-v1")).some(p=>p.layout.notes==="Keep this design")')
 assert not errors,errors
 b.close()
print('PASS studio layout: four-colour Google simulation, template disclosure, editable wall, persistent export icons, mobile menus, and New space preserving the previous design.')
