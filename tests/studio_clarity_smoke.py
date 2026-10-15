import os,math
from playwright.sync_api import sync_playwright
BASE=os.environ.get('VELA_BASE_URL','http://127.0.0.1:8766').rstrip('/')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':1366,'height':680});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE+'/start?demo=1');page.get_by_label('Width centimetres').fill('400.05')
 for _ in range(4):page.get_by_role('button',name='Feet & inches',exact=True).click();page.get_by_role('button',name='Centimetres',exact=True).click()
 assert math.isclose(float(page.get_by_label('Width centimetres').input_value()),400.05,abs_tol=1e-6)
 page.get_by_role('button',name='Open the studio').click();page.wait_for_function('Boolean(window.Vela)')
 assert not page.locator('#studio-properties').is_visible()
 assert math.isclose(page.evaluate('Vela.getLayout().room.vertices[1][0]'),4.0005,abs_tol=1e-8)
 page.locator('[data-group="Beds"]').click();page.locator('[data-kind="bed-single"]').click();page.wait_for_timeout(250)
 assert page.locator('#studio-properties').is_visible()
 assert '1.4″' in page.locator('#item-width-equivalent').inner_text()
 page.locator('#item-width').fill('95.25');page.locator('#item-width').press('Tab');assert math.isclose(page.evaluate('Vela.getLayout().items.at(-1).w'),.9525)
 assert page.locator('#item-width').input_value()=='95.25'
 assert '1.5″' in page.locator('#item-width-equivalent').inner_text()
 # SVG uses the same scale on both axes; changing the viewport never changes the model.
 before=page.evaluate('Vela.getLayout()')
 for width,height in [(1366,680),(1024,768),(390,844)]:
  page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(250)
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  for selector in ['.app-header','.studio-nav','.panel-dock','.view-switch','.canvas-tools']:
   box=page.locator(selector).bounding_box();assert box['x']>=-1 and box['x']+box['width']<=width+1,(width,selector,box)
  matrix=page.locator('#plan').evaluate('(svg)=>{const m=svg.getScreenCTM();return {x:m.a,y:m.d}}');assert math.isclose(matrix['x'],matrix['y'],rel_tol=1e-9)
  labels=page.locator('.wall-dimension').evaluate_all('(nodes)=>nodes.map(n=>parseFloat(n.getAttribute("font-size"))*Math.hypot(n.getScreenCTM().a,n.getScreenCTM().b))');assert all(abs(v-11)<.01 for v in labels)
  assert page.evaluate('Vela.getLayout()')==before
  page.screenshot(path=f'/tmp/vela-clean-studio-{width}.png')
 assert not errors,errors;b.close()
print('PASS clear workspace, responsive controls, uniform plan scale, readable labels, exact decimal inputs and repeated unit conversion')
