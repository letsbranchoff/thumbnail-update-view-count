import os
from pathlib import Path
from xml.dom import minidom


def open_svg(
    path: str = os.path.join("assets", "update-image-test-python.svg")
) -> minidom.Document | None:
    try:
        return minidom.parse(path)
    except:
        return None


def update_text_in_svg(svg: minidom.Document, value: str) -> None:
    svg.getElementsByTagName("tspan")[0].firstChild.nodeValue = value


def save_svg(svg: minidom.Document, path: str = os.path.join("output")):
    Path(path).mkdir(exist_ok=True)
    with open(os.path.join(path, "updated.svg"), "w") as f:
        f.write(svg.toxml())


def main():
    svg = open_svg()

    if not svg:
        print("Failed to load SVG image...")
        return

    update_text_in_svg(svg=svg, value="Test")

    save_svg(svg=svg)

    print("Updated SVG.")


if __name__ == "__main__":
    main()
