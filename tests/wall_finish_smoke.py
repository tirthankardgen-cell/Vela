import os,json,tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=os.environ.get('VELA_BASE_URL','http://127.0.0.1:8766').rstrip('/')
with sync_playwright() as p, tempfile.TemporaryDirectory() as tmp:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']);page=b.new_page(viewport={'width':1440,'height':1000});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE+'/start?demo=1');assert 'whole room you are creating' in page.locator('.home-dimensions-note').inner_text()
 assert 'cm' in page.locator('.dimension-equivalent').first.inner_text() and '′' in page.locator('.dimension-equivalent').first.inner_text()
 page.get_by_role('button',name='Open the studio').click();page.wait_for_function('Boolean(window.Vela)');assert page.evaluate('Vela.getLayout().items.length')==0
 page.get_by_role('button',name='Focus',exact=True).click();page.wait_for_timeout(200)
 def select_wall(index):
  page.wait_for_timeout(200)
  point=page.evaluate('''i=>{const vertices=Vela.getLayout().room.vertices,a=vertices[i],b=vertices[(i+1)%vertices.length],svg=document.getElementById('plan'),p=svg.createSVGPoint();p.x=(a[0]+b[0])/2;p.y=(a[1]+b[1])/2;const q=p.matrixTransform(svg.getScreenCTM());return {x:q.x,y:q.y}}''',index)
  page.mouse.click(point['x'],point['y'])
  page.locator('#outer-wall-form').wait_for(state='visible')
 select_wall(0);page.locator('#outer-wall-form').wait_for(state='visible');assert page.locator('#outer-wall-form').is_visible()
 page.locator('#outer-wall-color').fill('#bc8972');page.locator('#outer-wall-color').dispatch_event('change')
 assert page.evaluate('Vela.getLayout().room.edgeFaceColors[0].a')=='#bc8972'
 assert 'cm' in page.locator('#outer-wall-measurements').inner_text() and '′' in page.locator('#outer-wall-measurements').inner_text()
 select_wall(1);page.locator('#outer-wall-color').fill('#939b80');page.locator('#outer-wall-color').dispatch_event('change')
 assert page.evaluate('Object.keys(Vela.getLayout().room.edgeFaceColors).length')==2
 page.locator('#undo').click();assert page.evaluate('Vela.getLayout().room.edgeFaceColors[1]?.a') is None
 page.locator('#redo').click();assert page.evaluate('Vela.getLayout().room.edgeFaceColors[1]?.a')=='#939b80'
 page.get_by_role('button',name='Library',exact=True).click();page.locator('[data-category="structure"]').click();page.locator('[data-group="Walls"]').click();page.locator('[data-kind="wall"]').click()
 assert not page.locator('#item-height').is_visible();assert not page.locator('#item-cost').is_visible()
 page.locator('#item-color').fill('#806044');page.locator('#item-color').dispatch_event('change');assert page.evaluate('Vela.getLayout().items.at(-1).faceColors.a')=='#806044'
 assert 'm' in page.locator('#item-width-equivalent').inner_text()
 with page.expect_download() as d:page.locator('#save-file').click()
 file=Path(tmp)/'walls.json';d.value.save_as(file)
 page.locator('#file-input').set_input_files(str(file));page.wait_for_timeout(100)
 assert page.evaluate('Vela.getLayout().room.edgeFaceColors[0].a')=='#bc8972'
 page.locator('#view-mode').click();assert page.evaluate('Vela.getView()')=='3d'
 page.locator('#plan-mode').click();page.reload();page.wait_for_function('Boolean(window.Vela)');assert page.evaluate('Vela.getLayout().room.edgeFaceColors[1]?.a')=='#939b80'
 assert not errors,errors;b.close()
print('PASS whole-home setup, dual units, outer/internal wall colours, undo/redo, simple inspector, saved/imported colours and 3D')
