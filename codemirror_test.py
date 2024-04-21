from nicegui import background_tasks, ui


@ui.page('/')
async def _page():
    with ui.row():
        lang = ui.select([], label='Language').classes('w-64')
        theme = ui.select([], label='Theme').classes('w-64')

    cm = ui.codemirror('class Foo:\n\tpass', max_height='400px', line_wrapping=True)
    cm.on_value_change(lambda: print(cm.value))

    lang.on_value_change(lambda: cm.set_language(lang.value))
    theme.on_value_change(lambda: cm.set_theme(theme.value))

    async def setup_values():
        lang.options = await cm.supported_languages()
        lang.value = cm.language
        lang.update()

        theme.options = await cm.supported_themes()
        theme.update()
        theme.value = cm.theme

    background_tasks.create(setup_values())

ui.run(dark=True)
