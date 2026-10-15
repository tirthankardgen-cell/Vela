"""Exercise resize gestures, grouped variants and persistence through the real studio."""
import os, math
from playwright.sync_api import sync_playwright
BASE=os.environ.get('VELA_BASE_URL','http://127.0.0.1:8766').rstrip('/')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':1440,'height':1000});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE+'/studio?demo=1');page.wait_for_function('Boolean(window.Vela)')
 page.get_by_text('Replace with a template',exact=True).click();page.locator('#room-preset').select_option('blank')
 page.locator('#catalogue-search').fill('table');assert page.locator('#catalogue [data-kind^="table"]').count()==6
 page.locator('[data-kind="table-round"]').click();o=page.evaluate('Vela.getLayout().items.at(-1)');id=o['id']
 assert o['variant']=='table-round' and o['w']==.8
 assert page.locator(f'.furniture[data-id="{id}"] ellipse').count()==1
 assert page.locator('[data-resize]').count()==8
 page.get_by_role('button',name='Focus',exact=True).click()
 def state():return page.evaluate('Vela.getLayout().items.at(-1)')
 def gesture(handle,dx,dy,cancel=False):
  box=page.locator(f'[data-resize="{handle}"]').bounding_box();x=box['x']+box['width']/2;y=box['y']+box['height']/2
  page.mouse.move(x,y);page.mouse.down();page.mouse.move(x+dx,y+dy,steps=6)
  if cancel:page.keyboard.press('Escape')
  page.mouse.up()
 gesture('se',50,35);resized=state();assert resized['w']>o['w'] and resized['d']>o['d']
 assert math.isclose(resized['x']-resized['w']/2,o['x']-o['w']/2)
 assert math.isclose(resized['y']-resized['d']/2,o['y']-o['d']/2)
 page.locator('#undo').click();assert state()==o
 page.locator('#redo').click();assert state()==resized
 page.locator(f'.furniture[data-id="{id}"]').click();page.keyboard.press('r');rotated=state();assert rotated['rotation']==90
 page.get_by_role('button',name='Focus',exact=True).click();gesture('e',0,45);after=state();assert after['w']>rotated['w'] and after['d']==rotated['d']
 assert math.isclose(after['x'],rotated['x'])
 gesture('nw',25,25,cancel=True);assert state()==after
 with page.expect_download() as download:page.locator('#export-image').click()
 assert 'selection-handles' not in open(download.value.path()).read()
 page.get_by_role('button',name='Library',exact=True).click();page.locator('#catalogue-search').fill('ceiling fan');page.locator('[data-kind="fan"]').click();fan=state()
 page.get_by_role('button',name='Focus',exact=True).click();gesture('s',0,40);assert state()['d']>fan['d']
 transform=page.locator(f'.furniture[data-id="{fan["id"]}"] > g').get_attribute('transform');assert transform.startswith('scale(1 ') and transform!='scale(1 1)'
 page.get_by_role('button',name='Library',exact=True).click();page.locator('#catalogue-search').fill('door')
 assert page.locator('#catalogue [data-kind^="door"]').count()==4
 page.locator('[data-kind="door-double"]').click();double=state();assert double['variant']=='door-double'
 page.locator('[data-kind="door-sliding"]').click();door=state();assert door['variant']=='door-sliding'
 assert page.locator('[data-resize]').count()==2
 page.get_by_role('button',name='Focus',exact=True).click();gesture('e',35,0)
 door_after=state();assert door_after['d']==door['d'] and door_after['wall']==door['wall']
 assert door_after['w']!=door['w']
 assert page.evaluate('Vela.validate(Vela.getLayout()).items.at(-1).variant')=='door-sliding'
 page.locator('#view-mode').click();page.wait_for_timeout(600);assert page.evaluate('Vela.getView()')=='3d'
 page.locator('#plan-mode').click();page.reload();page.wait_for_function('Boolean(window.Vela)');assert state()['variant']=='door-sliding'
 assert page.evaluate('Vela.getLayout().items[0].w')==after['w']
 page.get_by_role('button',name='Library',exact=True).click() if not page.locator('#studio-objects').is_visible() else None
 page.locator('[data-category="structure"]').click();assert page.locator('[data-kind]').count()==0;page.locator('[data-group="Doors"]').click();assert page.locator('[data-kind="door-double"]').is_visible()
 page.locator('#catalogue-search').fill('double hinged');assert page.locator('[data-kind="door-double"]').is_visible()
 page.locator('#catalogue-search').fill('desk');page.locator('.catalogue-filters').evaluate('(el)=>el.open=true');page.locator('#catalogue-room').select_option('office');assert page.locator('[data-kind="table-desk"]').is_visible()
 page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 assert not errors,errors
 b.close()
print('PASS studio: corner/edge/rotated resize, opposite anchors, undo/redo, Escape cancellation, clean SVG export, grouped variants, search/room filters, wall openings, 3D, saved variants and mobile width')
