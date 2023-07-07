from pathlib import Path
from typing import Tuple

from nicegui import ui
from nicegui.dependencies import register_vue_component
from nicegui.element import Element

component = register_vue_component(Path('leaflet.js'), base_path=Path(__file__).parent)


class leaflet(Element):

    def __init__(self) -> None:
        super().__init__(component.tag)
        self.use_component(component)
        ui.add_head_html('<link href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" rel="stylesheet"/>')
        ui.add_head_html('<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"></script>')

    def set_location(self, location: Tuple[float, float]) -> None:
        self.run_method('set_location', location[0], location[1])
