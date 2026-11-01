"""Exercise preview accounts, measured rooms, persistence, and local plan uploads."""
import os, math, re
from playwright.sync_api import sync_playwright
BASE=os.environ.get('VELA_BASE_URL','http://127.0.0.1:8766').rstrip('/')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1000});errors=[];backend=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('request',lambda r:backend.append(r.url) if any(s in r.url for s in ['googleapis.com','firebaseio.com','firebasestorage']) else None)
 page.goto(BASE)
 assert page.locator('link[rel="canonical"]').get_attribute('href').rstrip('/')=='https://velastudio.space'
 assert page.locator('meta[property="og:image"]').get_attribute('content')=='https://velastudio.space/brand/vela-social.png'
 page.goto(BASE+'/signup')
 page.get_by_label('Your name').fill('Alex Designer');page.get_by_label('Email address').fill('alex@example.com');page.get_by_label('Password',exact=True).fill('NeverStored123!')
 page.get_by_role('button',name='Create your account').click();page.wait_for_url('**/start')
 page.get_by_role('button',name='Feet & inches',exact=True).click()
 for label,value in [('Width feet','12'),('Width inches','6'),('Depth feet','15'),('Depth inches','0'),('Ceiling height feet','9'),('Ceiling height inches','0')]:page.get_by_role('spinbutton',name=label,exact=True).fill(value)
 page.get_by_label('Name your space').fill('Garden suite');page.get_by_label('Project currency').select_option('EUR')
 page.get_by_role('button',name='Open the studio').click();page.wait_for_function('Boolean(window.Vela)')
 state=page.evaluate('Vela.getLayout()')
 assert state['items']==[] and state['project']['currency']=='EUR'
 assert math.isclose(state['room']['vertices'][2][0],3.81) and math.isclose(state['room']['vertices'][2][1],4.572)
 page.locator('[data-group="Chairs"]').click();page.locator('[data-kind="chair"]').click();page.locator('#projects-button').click();page.wait_for_url('**/projects')
 page.get_by_role('heading',name='Garden suite').wait_for()
 assert 'NeverStored123!' not in page.evaluate('JSON.stringify(localStorage)+JSON.stringify(sessionStorage)')
 page.get_by_role('button',name='Sign out').click();page.wait_for_url('**/login')
 page.goto(BASE+'/login');page.get_by_label('Email address').fill('alex@example.com');page.get_by_label('Password',exact=True).fill('any-demo-password');page.get_by_role('button',name=re.compile(r'^Sign in')).click();page.wait_for_url('**/projects')
 page.get_by_role('heading',name='Garden suite').click();page.wait_for_function('Boolean(window.Vela)');assert len(page.evaluate('Vela.getLayout().items'))==1
 # Make a locally generated floor-plan fixture in PNG and PDF formats.
 fixture=b.new_page(viewport={'width':600,'height':500});fixture.set_content('<html><body style="margin:40px"><div style="border:8px solid #333;width:400px;height:300px">Measured plan</div></body></html>')
 png=fixture.screenshot();pdf=fixture.pdf();fixture.close()
 page.goto(BASE+'/start?demo=1');page.get_by_role('button',name='Upload a floor plan').click()
 page.locator('input[type=file]').set_input_files({'name':'floor.png','mimeType':'image/png','buffer':png});page.get_by_alt_text('Your uploaded floor plan preview').wait_for()
 page.get_by_role('button',name='Open the studio').click();page.wait_for_function('Boolean(window.Vela)');assert page.locator('#floorplan-reference').count()==1
 page.goto(BASE+'/start?demo=1');page.get_by_role('button',name='Upload a floor plan').click()
 page.locator('input[type=file]').set_input_files({'name':'plan.pdf','mimeType':'application/pdf','buffer':pdf});page.get_by_alt_text('Your uploaded floor plan preview').wait_for(timeout=20000)
 page.get_by_role('button',name='Open the studio').click();page.wait_for_function('Boolean(window.Vela)');assert page.evaluate('Vela.getLayout().room.reference.data.startsWith("data:image/jpeg")')
 for path in ['/','/signup','/start?demo=1']:
  page.set_viewport_size({'width':390,'height':844});page.goto(BASE+path);page.wait_for_timeout(250)
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),path
 assert not errors,errors
 assert not backend,backend
 b.close()
print('PASS onboarding: simulated signup/login, no stored password or backend requests, feet/inches conversion, currency, project persistence, PNG/PDF uploads, mobile pages, production metadata.')
