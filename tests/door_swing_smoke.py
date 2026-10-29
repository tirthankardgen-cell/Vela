import os,tempfile,json
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=os.environ.get('VELA_BASE_URL','http://127.0.0.1:8788')
with sync_playwright() as p,tempfile.TemporaryDirectory() as tmp:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']);page=b.new_page(viewport={'width':1440,'height':1000});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE+'/start?demo=1');page.get_by_role('button',name='Open the studio').click();page.wait_for_function('Boolean(window.Vela)')
 page.locator('[data-category="structure"]').click();page.locator('[data-group="Doors"]').click()
 page.locator('[data-type="Exterior doors"]').click();assert page.locator('#catalogue [data-kind]').count()==1
 page.locator('[data-kind="door-exterior"]').click();page.locator('#door-controls').wait_for(state='visible')
 def last():return page.evaluate('Vela.getLayout().items.at(-1)')
 original=last();id=original['id']
 def transform():return page.locator(f'.furniture[data-id="{id}"] .door-swing-shape').get_attribute('transform')
 assert transform()=='scale(1 1)'
 page.locator('#door-hinge').click();assert transform()=='scale(-1 1)'
 page.locator('#door-swing').select_option('b');assert transform()=='scale(-1 -1)'
 assert all(last()[k]==original[k] for k in ['x','y','w','wall','offset'])
 page.locator('#undo').click();assert transform()=='scale(-1 1)'
 page.locator('#redo').click();assert transform()=='scale(-1 -1)'
 page.locator(f'.furniture[data-id="{id}"] .door-swing-shape rect').click();page.locator('#door-hinge').click();assert transform()=='scale(1 -1)'
 page.locator('#duplicate-item').click();assert last()['hinge']=='left' and last()['swing']=='b'
 page.locator('#view-mode').click();assert page.evaluate('Vela.getView()')=='3d';page.screenshot(path='/tmp/vela-door-swing-3d.png');page.locator('#plan-mode').click()
 with page.expect_download() as dl:page.locator('#save-file').click()
 path=Path(tmp)/'doors.json';dl.value.save_as(path);page.locator('#file-input').set_input_files(str(path));page.wait_for_timeout(150)
 assert last()['swing']=='b';page.reload();page.wait_for_function('Boolean(window.Vela)');assert last()['hinge']=='left' and last()['swing']=='b'
 page.locator('#catalogue-search').fill('outside door');assert page.locator('[data-kind="door-exterior"]').is_visible()
 page.locator('#catalogue-search').fill('interior room door');page.locator('[data-kind="door-interior"]').click();assert last()['variant']=='door-interior'
 page.locator('#catalogue-search').fill('double hinged');page.locator('[data-kind="door-double"]').click();assert not page.locator('#door-hinge').is_visible();page.locator('#door-swing').select_option('b');assert last()['swing']=='b'
 page.locator('#catalogue-search').fill('sliding door');page.locator('[data-kind="door-sliding"]').click();assert not page.locator('#door-controls').is_visible()
 page.locator('#catalogue-search').fill('open passage');page.locator('[data-kind="door-open"]').click();assert not page.locator('#door-controls').is_visible()
 # Unrecognised import settings are discarded; legacy doors keep their default swing.
 assert page.evaluate("(()=>{const raw=Vela.getLayout();raw.items[0].hinge='invalid';raw.items[0].swing='invalid';const o=Vela.validate(raw).items[0];return !o.hinge&&!o.swing})()")
 assert not errors,errors;b.close()
print('PASS exterior/interior door options, hinge/swing plan updates, unchanged opening, undo/redo, duplication, 3D, import/reload and sliding-door controls')
