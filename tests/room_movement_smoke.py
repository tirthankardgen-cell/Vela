import os,math,json,tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=os.environ.get('VELA_BASE_URL','http://127.0.0.1:8785')
with sync_playwright() as p,tempfile.TemporaryDirectory() as tmp:
 b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']);page=b.new_page(viewport={'width':1440,'height':1000});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE+'/start?demo=1');page.get_by_label('Width centimetres').fill('800');page.get_by_label('Depth centimetres').fill('600');page.get_by_role('button',name='Open the studio').click();page.wait_for_function('Boolean(window.Vela)')
 for name,x in [('Office',50),('Bedroom',250)]:
  page.locator('#add-room').click();page.locator('#new-room-name').fill(name);page.locator('#new-room-x').fill(str(x));page.locator('#new-room-y').fill('50');page.get_by_role('button',name='Create room',exact=True).click();page.locator('#studio-dialog').wait_for(state='hidden')
 layout=page.evaluate('Vela.getLayout()');office,bedroom=layout['room']['spaces'];shared=office['walls'][1]['id']
 # A door on the shared wall must remain with the neighbour and travel with the detached room.
 layout['items'].append({'id':'test-shared-door','kind':'door','label':'Shared door','x':2.5,'y':1.5,'w':.8,'d':.12,'h':2.1,'e':0,'rotation':90,'color':'#987455','wall':5,'wallId':shared,'offset':1})
 fixture=Path(tmp)/'fixture.json';fixture.write_text(json.dumps(layout));page.locator('#file-input').set_input_files(str(fixture));page.wait_for_timeout(250)
 page.locator('.room-tools details').evaluate('(el)=>el.open=true');page.locator('#paint-room').select_option(office['id']);page.locator('#room-floor-paint').fill('#ab7654');page.locator('#apply-room-floor').click()
 assert page.locator(f'path[data-space="{office["id"]}"]').get_attribute('fill')=='#ab7654'
 assert page.locator(f'path[data-space="{bedroom["id"]}"]').get_attribute('fill')!='#ab7654'
 box=page.locator('#studio-objects').bounding_box();assert math.isclose(1000-box['y']-box['height'],16,abs_tol=.1)
 page.get_by_role('button',name='Focus',exact=True).click();page.wait_for_timeout(200)
 def screen(x,y):return page.evaluate('''([x,y])=>{const svg=document.getElementById('plan'),p=svg.createSVGPoint();p.x=x;p.y=y;const q=p.matrixTransform(svg.getScreenCTM());return {x:q.x,y:q.y}}''',[x,y])
 def gesture(x,y,dx,dy,button='left',cancel=False):
  start=screen(x,y);end=screen(x+dx,y+dy);page.mouse.move(start['x'],start['y']);page.mouse.down(button=button);page.mouse.move(end['x'],end['y'],steps=8)
  if cancel:page.keyboard.press('Escape')
  page.mouse.up(button=button);page.wait_for_timeout(150)
 before=page.evaluate('Vela.getLayout()');original_box=page.locator('#plan').get_attribute('viewBox');cursor=screen(1,1);page.mouse.move(cursor['x'],cursor['y']);page.mouse.wheel(0,-200);page.wait_for_timeout(200)
 zoomed=screen(1,1);assert abs(zoomed['x']-cursor['x'])<1 and abs(zoomed['y']-cursor['y'])<1,(cursor,zoomed)
 assert page.locator('#plan').get_attribute('viewBox')!=original_box
 gesture(1,1,.4,.3,button='right');assert page.evaluate('Vela.getLayout()')==before
 page.locator('#fit').click();page.wait_for_timeout(150)
 gesture(1,1,0,3)
 moved=page.evaluate('Vela.getLayout()');new_office=moved['room']['spaces'][0];new_shared=new_office['walls'][1]['id'];assert new_shared!=shared
 assert moved['room']['spaces'][1]==before['room']['spaces'][1]
 for ref in before['room']['spaces'][1]['walls']:
  old=next(o for o in before['items'] if o['id']==ref['id']);now=next(o for o in moved['items'] if o['id']==ref['id']);assert old==now
 for oldref,newref in zip(office['walls'],new_office['walls']):
  old=next(o for o in before['items'] if o['id']==oldref['id']);now=next(o for o in moved['items'] if o['id']==newref['id']);assert math.isclose(old['x'],now['x']) and math.isclose(old['y']+3,now['y'])
 doors=[o for o in moved['items'] if o['kind']=='door'];assert len(doors)==2
 assert next(o for o in doors if o['wallId']==shared)['y']==1.5
 assert next(o for o in doors if o['wallId']==new_shared)['y']==4.5
 assert page.locator(f'path[data-space="{office["id"]}"]').get_attribute('fill')=='#ab7654'
 page.locator('#space-form').wait_for(state='visible');page.locator('#space-floor-color').fill('#5476ab');page.locator('#space-floor-color').dispatch_event('change')
 page.locator('#undo').click();page.locator('#undo').click();assert page.evaluate('Vela.getLayout()')==before
 page.locator('#redo').click();assert page.evaluate('Vela.getLayout()')==moved
 page.get_by_role('button',name='Focus',exact=True).click();page.wait_for_timeout(150)
 gesture(1,4,1,0,cancel=True);assert page.evaluate('Vela.getLayout()')==moved
 # Freely move the room outside the original outline and include it in Fit.
 gesture(1,4,-3,0);outside=page.evaluate('Vela.getLayout()');assert min(o['x'] for o in outside['items'])<0
 page.locator('#fit').click();page.locator('#view-mode').click();assert page.evaluate('Vela.getView()')=='3d';page.locator('#show-walls').uncheck();page.wait_for_timeout(200);page.screenshot(path='/tmp/vela-moving-room-3d.png');page.locator('#show-walls').check();page.locator('#plan-mode').click()
 with page.expect_download() as dl:page.locator('#save-file').click()
 path=Path(tmp)/'moved.json';dl.value.save_as(path);page.locator('#file-input').set_input_files(str(path));page.wait_for_timeout(150)
 assert page.evaluate('Vela.getLayout().room.spaces[0].floorColor')=='#ab7654'
 assert page.evaluate('Vela.getLayout().room.spaces[0].walls')==outside['room']['spaces'][0]['walls']
 page.reload();page.wait_for_function('Boolean(window.Vela)');assert page.evaluate('Vela.getLayout().room.spaces[0].floorColor')=='#ab7654'
 page.screenshot(path='/tmp/vela-moving-room-2d.png')
 page.get_by_role('button',name='Focus',exact=True).click();page.wait_for_timeout(150)
 prior=page.evaluate('Vela.getLayout()');gesture(7,3,.5,.5);whole=page.evaluate('Vela.getLayout()')
 assert whole['room']['vertices'][0]==[.5,.5]
 for old,new in zip(prior['items'],whole['items']):assert math.isclose(old['x']+.5,new['x']) and math.isclose(old['y']+.5,new['y'])
 assert not errors,errors;b.close()
print('PASS panel spacing, cursor zoom, right-drag pan, room floor colours, shared-wall separation, attached openings, free room movement, cancellation, undo/redo, persistence and 3D')
