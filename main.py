import os
from xml.dom import minidom


def open_svg(
    path: str = os.path.join("assets", "update-image-test-python.svg")
) -> minidom.Document | None:
    try:
        return minidom.parse(path)
    except:
        return None


def main():
    svg = open_svg()

    if not svg:
        print("Failed to load SVG image...")
        return


if __name__ == "__main__":
    main()
