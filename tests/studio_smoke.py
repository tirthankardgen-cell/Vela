"""Functional Vela studio regression test; run with npm run dev in another terminal."""
import csv
import io
import json
import os
import tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE_URL = os.environ.get('VELA_BASE_URL', 'http://127.0.0.1:8766').rstrip('/')
with sync_playwright() as p, tempfile.TemporaryDirectory() as temp:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'), args=['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    context = browser.new_context(viewport={'width':1440,'height':1000}, accept_downloads=True)
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(BASE_URL+'/studio?demo=1');page.wait_for_function('Boolean(window.Vela)')
    state = lambda: page.evaluate('Vela.getLayout()')
    assert page.title() == 'Design studio · Vela'
    page.locator('#project-details').click()
    page.locator('[name="name"]').fill('Test residence <Studio>')
    page.locator('[name="client"]').fill('A & B')
    page.locator('[name="designer"]').fill('North Studio')
    page.locator('[name="currency"]').select_option('USD')
    page.locator('[name="budget"]').fill('1000')
    page.locator('#project-form button[type="submit"]').click()
    project_id = state()['project']['id']
    page.locator('#room-preset').select_option('blank')
    assert state()['project']['id'] == project_id
    assert state()['project']['name'] == 'Test residence <Studio>'
    page.locator('#catalogue-search').fill('armchair')
    assert page.locator('#catalogue button').count() == 1
    page.locator('[data-kind="chair"]').click()
    page.locator('#item-cost').fill('250.50')
    page.locator('#item-cost').press('Tab')
    page.locator('#item-supplier').fill('=Test supplier')
    page.locator('#item-supplier').press('Tab')
    assert state()['items'][0]['cost'] == 250.5
    page.locator('#materials-button').click()
    page.locator('#material-target').select_option('item')
    page.locator('[data-palette="3"]').click()
    assert state()['items'][0]['color'] == '#939b80'
    page.locator('#material-target').select_option('room')
    page.locator('[data-palette="1"]').click()
    assert state()['room']['floorColor'] == '#d2b897'
    page.locator('#close-dialog').click()
    page.locator('#undo').click()
    assert state()['room'].get('floorColor') != '#d2b897'
    page.locator('#redo').click()
    assert state()['room']['floorColor'] == '#d2b897'
    with page.expect_download() as info:
        page.locator('#save-file').click()
    exported = Path(temp)/'project.json'
    info.value.save_as(exported)
    saved = json.loads(exported.read_text())
    assert saved['project']['client'] == 'A & B'
    assert saved['items'][0]['supplier'] == '=Test supplier'
    page.locator('#schedule-button').click()
    assert '$250.50' in page.locator('#dialog-content').inner_text()
    assert '$749.50' in page.locator('#dialog-content').inner_text()
    with page.expect_download() as info:
        page.locator('#export-csv').click()
    schedule = Path(temp)/'schedule.csv'
    info.value.save_as(schedule)
    rows = list(csv.reader(io.StringIO(schedule.read_text(encoding='utf-8-sig'))))
    assert rows[1][1] == "'=Test supplier"
    assert rows[1][-1] == '250.5'
    page.locator('#close-dialog').click()
    page.locator('#room-preset').select_option('flat')
    page.locator('#file-input').set_input_files(str(exported))
    page.wait_for_function('Vela.getLayout().items.length === 1')
    assert state()['project']['id'] == project_id
    assert state()['room']['floorColor'] == '#d2b897'
    assert state()['items'][0]['cost'] == 250.5
    page.reload()
    page.wait_for_function('Boolean(window.Vela)')
    assert state()['project']['name'] == 'Test residence <Studio>'
    assert state()['items'][0]['cost'] == 250.5
    page.locator('#projects-button').click()
    assert page.locator('.project-card').count() == 1
    page.locator('#duplicate-project').click()
    assert page.locator('.project-card').count() == 2
    assert state()['project']['id'] != project_id
    page.locator(f'[data-load="{project_id}"]').click()
    assert state()['project']['id'] == project_id
    page.locator('#projects-button').click()
    page.locator('#new-project').click()
    assert state()['items'] == []
    assert state()['project']['name'] == 'Untitled project'
    page.locator('#close-dialog').click()
    page.locator('#undo').click()
    assert state()['project']['id'] == project_id
    assert len(state()['items']) == 1
    page.locator('#present-button').click()
    assert page.locator('.board-title h1').inner_text() == 'Test residence <Studio>'
    assert page.locator('.board-plan svg').count() == 1
    assert 'A & B' in page.locator('.board-title').inner_text()
    with page.expect_download() as info:
        page.locator('#download-board').click()
    board = Path(temp)/'board.html'
    info.value.save_as(board)
    assert '&lt;Studio&gt;' in board.read_text()
    assert '<script' not in board.read_text().lower()
    page.pdf(path='/tmp/vela-presentation-tested.pdf', print_background=True)
    assert Path('/tmp/vela-presentation-tested.pdf').stat().st_size > 10000
    page.locator('#return-studio').click()
    page.locator('#catalogue-search').fill('no-such-piece')
    assert page.locator('#catalogue-empty').is_visible()
    page.locator('#catalogue-search').fill('')
    context.set_offline(True)
    page.locator('#view-mode').click()
    assert page.evaluate('Vela.getView()') == '3d'
    page.locator('#plan-mode').click()
    for width in [320,390,768,1024]:
        page.set_viewport_size({'width':width,'height':900})
        assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), width
    page.set_viewport_size({'width':390,'height':844})
    page.screenshot(path='/tmp/vela-mobile-tested.png',full_page=True)
    assert not errors, errors
    browser.close()
print('PASS Vela studio: metadata, template identity, search, cost and supplier, finishes, undo/redo, JSON round-trip, autosave, project library, CSV safety, client board, PDF generation, offline 3D, and responsive layouts.')
