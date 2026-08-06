from PIL import Image, ImageDraw, ImageFont
import os

def create_logo(filename, text, colors, shape_type):
    # Professional size
    width, height = 800, 800
    img = Image.new('RGBA', (width, height), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw background shape
    if shape_type == "circle":
        draw.ellipse([100, 100, 700, 700], fill=colors[0])
        draw.ellipse([150, 150, 650, 650], fill=colors[1])
    elif shape_type == "square":
        draw.rounded_rectangle([100, 100, 700, 700], radius=150, fill=colors[0])
        draw.rounded_rectangle([150, 150, 650, 650], radius=120, fill=colors[1])
    elif shape_type == "diamond":
        draw.polygon([(400, 100), (700, 400), (400, 700), (100, 400)], fill=colors[0])
        draw.polygon([(400, 150), (650, 400), (400, 650), (150, 400)], fill=colors[1])
    
    # Add a stylized "V" or icon element
    draw.line([300, 300, 400, 500, 500, 300], fill="white", width=40)
    
    # Save the logo
    if not os.path.exists('public/logos'):
        os.makedirs('public/logos')
    img.save(f'public/logos/{filename}')

# Color palettes (Green nuances)
palettes = [
    ("#22c55e", "#166534"), # Emerald
    ("#4ade80", "#15803d"), # Light Green
    ("#10b981", "#064e3b"), # Teal Green
    ("#84cc16", "#3f6212"), # Lime
    ("#059669", "#065f46"), # Deep Green
    ("#34d399", "#064e3b")  # Seafoam
]

shapes = ["circle", "square", "diamond", "circle", "square", "diamond"]

for i in range(6):
    create_logo(f"vortex_logo_{i+1}.png", "VORTEX DIGITAL", palettes[i], shapes[i])

