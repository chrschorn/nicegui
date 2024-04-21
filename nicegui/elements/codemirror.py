from pathlib import Path
from typing import Any, Callable, List, Optional

from nicegui.elements.mixins.value_element import ValueElement


class CodeMirror(ValueElement, component='codemirror.js'):
    VALUE_PROP = 'value'
    LOOPBACK = True

    def __init__(
        self,
        value: str = '',
        *,
        on_change: Optional[Callable[..., Any]] = None,
        language: str = 'Python',
        theme: str = 'basicDark',
        line_wrapping: bool = False,
        min_height: str = '200px',
        max_height: str = '',
        fixed_height: str = ''
    ) -> None:
        super().__init__(value=value, on_value_change=on_change)
        self.add_resource(Path(__file__).parent / 'lib' / 'codemirror')

        self._props['language'] = language
        self._props['theme'] = theme
        self._props['lineWrapping'] = line_wrapping
        self._props['minHeight'] = min_height
        self._props['maxHeight'] = max_height
        self._props['fixedHeight'] = fixed_height
        self.classes('w-full')

    @property
    def theme(self) -> str:
        """The current theme of the editor."""
        return self._props['theme']

    def set_theme(self, theme: str) -> None:
        """Set the theme of the editor."""
        self._props['theme'] = theme
        self.update()

    @property
    def language(self) -> str:
        """The current language of the editor."""
        return self._props['language']

    def set_language(self, language: str) -> None:
        """Set the language of the editor."""
        self._props['language'] = language
        self.update()

    async def supported_languages(self) -> List[str]:
        await self.client.connected()
        values = await self.run_method('get_languages')
        return sorted(values)

    async def supported_themes(self) -> List[str]:
        await self.client.connected()
        values = await self.run_method('get_themes')
        return sorted(values)
