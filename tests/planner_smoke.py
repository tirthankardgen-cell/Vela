import os
BASE_URL = os.environ.get("VELA_BASE_URL", "http://127.0.0.1:8766").rstrip("/")
"""Run against a local HTTP server: python -m http.server 8765."""
import json, os, tempfile, math
import xml.etree.ElementTree as ET
from pathlib import Path
from playwright.sync_api import sync_playwright
with sync_playwright() as p, tempfile.TemporaryDirectory() as tmp:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    context=browser.new_context(viewport={'width':1440,'height':1000},accept_downloads=True)
    page=context.new_page(); errors=[]; external=[]
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.on('request',lambda r: external.append(r.url) if r.url.startswith('http') and not r.url.startswith(BASE_URL + '/') else None)
    page.goto(BASE_URL + '/studio?demo=1');page.wait_for_function('Boolean(window.Vela)')
    layout=lambda: page.evaluate('Roomnote.getLayout()')
    assert sum(r.get('type')=='bedroom' for r in layout()['room']['spaces'])==2
    page.locator('#catalogue-clear').click()
    if not page.locator('#room-preset').is_visible(): page.get_by_text('Replace with a template',exact=True).click()
    page.locator('#room-preset').select_option('1bhk-city')
    original=layout(); base_count=len(original['items']); assert sum(o['kind']=='bed' for o in original['items'])==1
    # All further interactions must work without a network connection.
    context.set_offline(True)
    page.locator('[data-group="Chairs"]').click();page.locator('[data-kind="chair"]').click(); assert len(layout()['items'])==base_count+1
    chair=layout()['items'][-1]; cid=chair['id']
    page.locator('#item-width').fill('85');page.locator('#item-width').press('Tab')
    assert layout()['items'][-1]['w']==.85
    page.locator('#rotate-item').click(); assert layout()['items'][-1]['rotation']==90
    box=page.locator(f'[data-id="{cid}"]').bounding_box()
    page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);page.mouse.down();page.mouse.move(box['x']+box['width']/2+60,box['y']+box['height']/2+40,steps=5);page.mouse.up()
    moved=layout()['items'][-1]; assert moved['x']!=chair['x']
    page.locator('#duplicate-item').click();assert len(layout()['items'])==base_count+2
    page.locator('#delete-item').click();assert len(layout()['items'])==base_count+1
    page.locator('#undo').click();assert len(layout()['items'])==base_count+2
    page.locator('#redo').click();assert len(layout()['items'])==base_count+1
    page.locator('#catalogue-clear').click();page.locator('[data-category="structure"]').click();page.locator('[data-group="Windows"]').click();page.locator('[data-kind="window"]').click()
    assert layout()['items'][-1]['kind']=='window' and 'wall' in layout()['items'][-1]
    with page.expect_download() as d: page.locator('#save-file').click()
    saved=Path(tmp)/'layout.json';d.value.save_as(saved); data=json.loads(saved.read_text());assert len(data['items'])==base_count+2
    with page.expect_download() as d: page.locator('#export-image').click()
    d.value.save_as(Path(tmp)/'plan.svg');assert '<svg' in (Path(tmp)/'plan.svg').read_text()
    exported_box=list(map(float,ET.parse(Path(tmp)/'plan.svg').getroot().attrib['viewBox'].split()))
    xs=[v[0] for v in layout()['room']['vertices']];ys=[v[1] for v in layout()['room']['vertices']]
    assert math.isclose(exported_box[2],max(xs)-min(xs)+1.4) and math.isclose(exported_box[3],max(ys)-min(ys)+1.4)
    page.locator('#catalogue-clear').click()
    if not page.locator('#room-preset').is_visible(): page.get_by_text('Replace with a template',exact=True).click()
    page.locator('#room-preset').select_option('4bhk-grand');assert sum(o['kind']=='bed' for o in layout()['items'])==4
    page.locator('#file-input').set_input_files(str(saved));page.wait_for_timeout(250);assert len(layout()['items'])==base_count+2
    invalid=Path(tmp)/'bad.json';invalid.write_text('{"format":"bad"}')
    page.locator('#file-input').set_input_files(str(invalid));page.wait_for_timeout(250);assert len(layout()['items'])==base_count+2
    before=layout()['items'];page.locator('#view-mode').click();page.wait_for_timeout(700);assert page.evaluate('Roomnote.getView()')=='3d'
    for direction in ['entry','tv','top']:
        page.locator(f'[data-camera="{direction}"]').click();assert layout()['items']==before
    page.locator('#show-walls').uncheck()
    with page.expect_download() as d: page.locator('#export-image').click()
    d.value.save_as(Path(tmp)/'view.png');assert (Path(tmp)/'view.png').stat().st_size>10000
    page.screenshot(path='/tmp/roomnote-3d-tested.png')
    page.locator('#plan-mode').click();page.screenshot(path='/tmp/roomnote-plan-tested.png')
    context.set_offline(False);page.reload();page.wait_for_function('Boolean(window.Vela)');assert len(layout()['items'])==base_count+2
    page.set_viewport_size({'width':390,'height':844});page.screenshot(path='/tmp/roomnote-mobile.png',full_page=True)
    assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth')
    assert not errors,errors
    assert not external,external
    browser.close()
    print('PASS: editing, dragging, window placement, undo/redo, JSON save/import, invalid import, offline 3D, fixed layout across cameras, SVG/PNG export, draft reload, mobile width; no JS errors or external requests.')
