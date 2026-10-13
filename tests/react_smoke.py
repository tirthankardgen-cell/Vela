"""Validate React lifecycle integration and deployable brand resources."""
import os
from playwright.sync_api import sync_playwright
BASE_URL=os.environ.get('VELA_BASE_URL','http://127.0.0.1:8766').rstrip('/')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=browser.new_page(viewport={'width':1440,'height':1000})
 errors=[];console_errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('console',lambda m:console_errors.append(m.text) if m.type=='error' else None)
 page.goto(BASE_URL+'/studio?demo=1');page.wait_for_function('Boolean(window.Vela)')
 assert page.locator('#root .workspace').count()==1
 assert page.locator('.vela-brand img').evaluate('(img)=>img.complete && img.naturalWidth>0')
 initial=page.evaluate('Vela.getLayout().items.length')
 page.locator('[data-kind="chair"]').click()
 assert page.evaluate('Vela.getLayout().items.length')==initial+1
 page.locator('#stage').click(position={'x':700,'y':140})
 # Select the added object through the model's stable ID, then send one key event.
 item_id=page.evaluate('Vela.getLayout().items.at(-1).id')
 page.locator(f'[data-id="{item_id}"]').click(force=True)
 before=page.evaluate('Vela.getLayout().items.at(-1).rotation')
 page.keyboard.press('r')
 assert page.evaluate('Vela.getLayout().items.at(-1).rotation')==(before+90)%360
 page.locator('#project-details').click()
 page.locator('[name="name"]').fill('React project')
 page.locator('#project-form button[type="submit"]').click()
 assert 'React project' in page.locator('#project-details').inner_text()
 page.locator('#present-button').click()
 assert page.locator('.board-logo img').evaluate('(img)=>img.complete && img.naturalWidth>0')
 page.emulate_media(media='print')
 assert page.locator('.design-board').is_visible()
 assert not page.locator('.app-header').is_visible()
 page.emulate_media(media='screen')
 for path,kind in [('/favicon.ico','image/'),('/apple-touch-icon.png','image/png'),('/brand/vela-social.png','image/png'),('/site.webmanifest','application/')]:
  response=page.request.get(BASE_URL+path)
  assert response.ok,(path,response.status)
  assert kind in response.headers['content-type'],(path,response.headers)
 assert page.locator('meta[property="og:image"]').get_attribute('content').endswith('/brand/vela-social.png')
 assert page.locator('meta[name="twitter:card"]').get_attribute('content')=='summary_large_image'
 assert not errors,errors
 assert not console_errors,console_errors
 browser.close()
print('PASS React: single event handling, reactive project header, branded presentation, print visibility, public icons and sharing metadata; no console errors.')
