"""Exercise all flat templates through setup, replacement, exports and 3D."""
import json
import os
import tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = os.environ.get('VELA_BASE_URL', 'http://127.0.0.1:8766').rstrip('/')
ARTIFACTS = Path(__file__).resolve().parents[1] / 'output' / 'playwright'
ARTIFACTS.mkdir(parents=True, exist_ok=True)
OPTIONS = {
    1: ['1bhk-city', '1bhk-balcony'],
    2: ['2bhk-family', '2bhk-balcony'],
    3: ['3bhk-connected', '3bhk-suite'],
    4: ['4bhk-residence', '4bhk-grand'],
}
with sync_playwright() as p, tempfile.TemporaryDirectory() as temp:
    browser = p.chromium.launch(
        executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'),
        args=['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    page = browser.new_page(viewport={'width':1440,'height':1000}, accept_downloads=True)
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(BASE + '/start?demo=1')
    page.get_by_role('button', name='A furnished flat', exact=False).click()
    for bhk, ids in OPTIONS.items():
        page.get_by_role('button', name=f'{bhk}BHK 2 layouts', exact=True).click()
        assert page.locator('[data-flat-template]').count() == 2
        for id in ids:
            page.locator(f'[data-flat-template="{id}"]').click()
            assert page.locator('[data-preview-template]').get_attribute('data-preview-template') == id
            assert page.locator('.flat-template-room-schedule tbody tr').count() >= bhk + 4
            assert page.locator('svg.is-detailed text tspan').count() >= bhk + 4
    page.locator('[data-flat-template="4bhk-grand"]').click()
    page.locator('.flat-template-browser').screenshot(path=str(ARTIFACTS / 'flat-templates-desktop.png'))
    page.get_by_role('button', name='Feet & inches', exact=True).click()
    assert '≈' in page.locator('.flat-template-room-schedule tbody td').first.inner_text()
    for width in [390, 360]:
        page.set_viewport_size({'width':width,'height':844})
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    page.locator('.flat-template-browser').screenshot(path=str(ARTIFACTS / 'flat-templates-mobile.png'))
    page.set_viewport_size({'width':1440,'height':1000})
    page.get_by_label('Name your space').fill('Aster family flat')
    page.get_by_label('Project currency').select_option('INR')
    page.get_by_role('button', name='Open the studio').click()
    page.wait_for_function('Boolean(window.Vela)')
    state = lambda: page.evaluate('Vela.getLayout()')
    layout = state()
    assert sum(o['kind']=='bed' for o in layout['items']) == 4
    assert layout['project']['name'] == 'Aster family flat'
    assert layout['project']['currency'] == 'INR' and layout['project']['units'] == 'ft-in'
    assert all(s.get('labelPosition') and s.get('type') for s in layout['room']['spaces'])
    assert {'counter','sink','hob','fridge','washer','basin','toilet','shower'} <= {o['kind'] for o in layout['items']}
    project_id = layout['project']['id']
    page.get_by_role('button', name='Focus', exact=True).click()
    page.screenshot(path=str(ARTIFACTS / 'flat-4bhk-plan.png'))
    page.get_by_role('button', name='Library', exact=True).click()
    # Previewing a template must not mutate the current project.
    page.locator('#open-flat-templates').click()
    before = state()
    dialog = page.locator('#flat-template-dialog')
    for bhk in [1, 2, 3, 4]:
        dialog.get_by_role('button', name=f'{bhk}BHK 2 layouts', exact=True).click()
    assert state() == before
    page.keyboard.press('Escape')
    assert not dialog.is_visible()
    # Apply every template with the existing project identity and check 3D.
    for bhk, ids in OPTIONS.items():
        for id in ids:
            page.locator('#open-flat-templates').click()
            dialog.get_by_role('button', name=f'{bhk}BHK 2 layouts', exact=True).click()
            dialog.locator(f'[data-flat-template="{id}"]').click()
            dialog.get_by_role('button', name=f'Use this {bhk}BHK layout').click()
            assert not dialog.is_visible()
            current = state()
            assert sum(o['kind']=='bed' for o in current['items']) == bhk
            assert current['project']['id'] == project_id
            assert current['project']['name'] == 'Aster family flat'
            page.evaluate('Vela.validate(Vela.getLayout())')
            page.locator('#view-mode').click()
            assert page.evaluate('Vela.getView()') == '3d'
            page.locator('#plan-mode').click()
    assert page.locator('#room-preset option[value="flat"], #room-preset option[value="l1"], #room-preset option[value="b2"]').count() == 0
    page.locator('#undo').click()
    assert 'Family Residence' in state()['room']['name']
    page.locator('#redo').click()
    assert 'Grand Residence' in state()['room']['name']
    with page.expect_download() as saved:
        page.locator('#save-file').click()
    exported = Path(temp) / 'flat.json'
    saved.value.save_as(exported)
    with page.expect_download() as svg:
        page.locator('#export-image').click()
    plan = Path(temp) / 'flat.svg'
    svg.value.save_as(plan)
    assert 'Bedroom 4' in plan.read_text(encoding='utf-8') and '<tspan' in plan.read_text(encoding='utf-8')
    assert 'selection-handles' not in plan.read_text(encoding='utf-8')
    page.reload()
    page.wait_for_function('Boolean(window.Vela)')
    assert sum(o['kind']=='bed' for o in state()['items']) == 4
    assert all(s.get('type') and s.get('labelPosition') for s in state()['room']['spaces'])
    page.locator('#file-input').set_input_files(str(exported))
    page.wait_for_function('Vela.getLayout().items.some(o=>o.kind==="toilet")')
    assert state()['project']['id'] == project_id
    page.locator('#view-mode').click()
    page.locator('#show-walls').uncheck()
    with page.expect_download() as png:
        page.locator('#export-image').click()
    png.value.save_as(str(ARTIFACTS / 'flat-4bhk-3d.png'))
    assert (ARTIFACTS / 'flat-4bhk-3d.png').stat().st_size > 10000
    page.locator('#plan-mode').click()
    page.set_viewport_size({'width':390,'height':844})
    page.get_by_role('button', name='Library', exact=True).click() if not page.locator('#studio-objects').is_visible() else None
    page.locator('#open-flat-templates').click()
    assert dialog.is_visible()
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    dialog.get_by_role('button', name='1BHK 2 layouts', exact=True).click()
    dialog.get_by_role('button', name='Use this 1BHK layout').click()
    assert sum(o['kind']=='bed' for o in state()['items']) == 1
    assert not errors, errors
    browser.close()

print('PASS flat templates: eight layouts, clear dimensions, metric/imperial previews, setup, project identity, preview/apply, undo/redo, all layouts in 3D, JSON/SVG/PNG exports, persistence and mobile dialog.')
