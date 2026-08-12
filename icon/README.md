# App Icon

Station-sign ("駅名標") motif: a "?" where the dot is a glowing current-location pin — the moment "ここは何駅だろう？" resolves.

- `AppIcon.svg` — source, 1024×1024, full-bleed (no rounded corners; iOS applies its own mask)
- `AppIcon-1024.png` — rendered PNG for the App Store icon slot

## Palette
| Element | Color |
|---|---|
| Background | `#F7F4EC` (ivory) |
| Top/bottom bands | `#0E9A97` → `#14B8A6` gradient (original teal, not a real rail line color) |
| "?" stroke | `#1C2A40` (charcoal navy) |
| Location pin dot | `#FFD08A` → `#F59421` radial gradient, amber glow |

Regenerate the PNG after editing the SVG:
```
python3 -c "import cairosvg; cairosvg.svg2png(url='AppIcon.svg', write_to='AppIcon-1024.png', output_width=1024, output_height=1024)"
```
