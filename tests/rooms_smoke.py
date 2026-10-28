import os, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=os.environ.get('VELA_BASE_URL','http://127.0.0.1:8784')
with sync_playwright() as p, tempfile.TemporaryDirectory() as tmp:
 b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':1440,'height':1000});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE+'/start?demo=1');assert 'whole room you are creating' in page.locator('.home-dimensions-note').inner_text()
 page.get_by_label('Width centimetres').fill('800');page.get_by_label('Depth centimetres').fill('600');page.get_by_role('button',name='Open the studio').click();page.wait_for_function('Boolean(window.Vela)')
 def add(name,x,y):
  page.locator('#add-room').click();page.locator('#new-room-name').fill(name);page.locator('#new-room-x').fill(str(x));page.locator('#new-room-y').fill(str(y));page.get_by_role('button',name='Create room',exact=True).click();page.locator('#studio-dialog').wait_for(state='hidden')
 def colour(selector,value):
  page.locator(selector).fill(value);page.locator(selector).dispatch_event('change')
 add('Office',50,50);assert page.evaluate('Vela.getLayout().items.length')==4
 add('Bedroom',250,50);assert page.evaluate('Vela.getLayout().items.length')==7
 spaces=page.evaluate('Vela.getLayout().room.spaces');shared=spaces[0]['walls'][1]['id'];assert spaces[1]['walls'][3]['id']==shared and spaces[1]['walls'][3]['side']=='b'
 page.locator('.room-tools details').evaluate('(el)=>el.open=true')
 page.locator('#paint-room').select_option(spaces[0]['id']);colour('#room-paint','#bb8877');page.locator('#apply-room-paint').click()
 page.locator('#paint-room').select_option(spaces[1]['id']);colour('#room-paint','#778899');page.locator('#apply-room-paint').click()
 def faces():return page.evaluate('(id)=>Vela.getLayout().items.find(o=>o.id===id).faceColors',shared)
 assert faces()=={'a':'#bb8877','b':'#778899'},faces()
 page.locator('#undo').click();assert faces()=={'a':'#bb8877'}
 page.locator('#redo').click();assert faces()=={'a':'#bb8877','b':'#778899'}
 page.get_by_role('button',name='Focus',exact=True).click();page.wait_for_timeout(200)
 page.locator(f'.furniture[data-id="{shared}"]').click();page.locator('#item-back-color').wait_for(state='visible')
 colour('#item-color','#112233');colour('#item-back-color','#445566');assert faces()=={'a':'#112233','b':'#445566'}
 assert page.locator(f'.furniture[data-id="{shared}"] rect[fill="#112233"]').count()==1
 assert page.locator(f'.furniture[data-id="{shared}"] rect[fill="#445566"]').count()==1
 page.locator('#view-mode').click();assert page.evaluate('Vela.getView()')=='3d';page.screenshot(path='/tmp/vela-room-faces-3d.png');page.locator('#plan-mode').click()
 with page.expect_download() as download:page.locator('#save-file').click()
 path=Path(tmp)/'rooms.json';download.value.save_as(path);page.locator('#file-input').set_input_files(str(path));page.wait_for_timeout(200)
 assert len(page.evaluate('Vela.getLayout().room.spaces'))==2;assert faces()=={'a':'#112233','b':'#445566'}
 page.reload();page.wait_for_function('Boolean(window.Vela)');assert faces()=={'a':'#112233','b':'#445566'}
 page.locator('#add-room').click();page.locator('#new-room-x').fill('750');page.get_by_role('button',name='Create room',exact=True).click();assert 'inside' in page.locator('#new-room-error').inner_text();page.locator('#close-dialog').click()
 page.locator('.room-tools details').evaluate('(el)=>el.open=true');page.locator('#paint-room').select_option('home');colour('#room-paint','#aabbcc');page.locator('#apply-room-paint').click()
 assert page.evaluate('Vela.getLayout().items.every(o=>o.color==="#aabbcc"&&Object.keys(o.faceColors).length===0)')
 assert page.evaluate('Vela.getLayout().room.wallColor')=='#aabbcc'
 page.locator('#undo').click();assert faces()=={'a':'#112233','b':'#445566'}
 page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 assert not errors,errors;b.close()
print('PASS named rooms, shared wall faces, room-only painting, whole-layout painting, invalid bounds, undo/redo, save/import, 3D and mobile width')
