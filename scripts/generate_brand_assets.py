"""
SmartClout — generator brandowanych plików Office
- pitch-smartclout.pptx  (2 slajdy: About + Portfolio)
- oferta-smartclout-szablon.xlsx  (szablon oferty z formułami)

Cyan Core palette:
  cyan       #06FFE0
  aqua       #00B8D4
  teal       #0C5C62
  ink        #040709
  frost      #F6F9FA
Font: Manrope (fallback: Segoe UI / Calibri)
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.oxml.ns import qn
from lxml import etree
from openpyxl import Workbook
from openpyxl.styles import (
    Font, PatternFill, Alignment, Border, Side, NamedStyle, Color
)
from openpyxl.utils import get_column_letter
from openpyxl.drawing.image import Image as XLImage
import os

OUT_DIR = "/app/frontend/public/downloads"
os.makedirs(OUT_DIR, exist_ok=True)

# --- Palette ---
CYAN  = RGBColor(0x06, 0xFF, 0xE0)
AQUA  = RGBColor(0x00, 0xB8, 0xD4)
TEAL  = RGBColor(0x0C, 0x5C, 0x62)
INK   = RGBColor(0x04, 0x07, 0x09)
FROST = RGBColor(0xF6, 0xF9, 0xFA)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
MUTED = RGBColor(0x7A, 0x99, 0x9E)

FONT_HEAD = "Manrope"
FONT_BODY = "Manrope"

# ================================================================
# PPTX helpers
# ================================================================
def add_rect(slide, x, y, w, h, fill, line=None):
    shp = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, h)
    shp.fill.solid(); shp.fill.fore_color.rgb = fill
    if line is None:
        shp.line.fill.background()
    else:
        shp.line.color.rgb = line
    shp.shadow.inherit = False
    return shp

def add_roundrect(slide, x, y, w, h, fill, radius_pct=6, line=None):
    shp = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
    shp.adjustments[0] = radius_pct / 100
    shp.fill.solid(); shp.fill.fore_color.rgb = fill
    if line is None:
        shp.line.fill.background()
    else:
        shp.line.color.rgb = line
    shp.shadow.inherit = False
    return shp

def add_text(slide, x, y, w, h, text, size=14, bold=False, color=WHITE,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, font=FONT_BODY,
             letter_spacing=None):
    tb = slide.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame
    tf.margin_left = tf.margin_right = 0
    tf.margin_top = tf.margin_bottom = 0
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    lines = text.split("\n") if isinstance(text, str) else [text]
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        run = p.add_run()
        run.text = line
        run.font.name = font
        run.font.size = Pt(size)
        run.font.bold = bold
        run.font.color.rgb = color
        if letter_spacing is not None:
            # spc = spacing in points/100, positive = wider tracking
            rPr = run._r.get_or_add_rPr()
            rPr.set('spc', str(int(letter_spacing)))
    return tb

def add_gradient_bar(slide, x, y, w, h):
    """Simple cyan → aqua horizontal bar approximated with two rectangles."""
    shp = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, h)
    fill = shp.fill
    fill.gradient_stops  # touch to init
    # python-pptx doesn't have easy gradient API — use OXML
    sp = shp.fill._xPr.find(qn('p:spPr')) if False else shp.line._xLn.getparent()
    # Simpler: use two rects overlapping
    shp.fill.solid(); shp.fill.fore_color.rgb = CYAN
    shp.line.fill.background()
    shp2 = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x + w // 2, y, w // 2, h)
    shp2.fill.solid(); shp2.fill.fore_color.rgb = AQUA
    shp2.line.fill.background()
    return shp

def set_slide_bg_dark(slide):
    """Fill entire slide with dark ink color."""
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = INK

def set_slide_bg_light(slide):
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = FROST

# ================================================================
# BUILD PRESENTATION (2 slajdy)
# ================================================================
def build_pitch():
    prs = Presentation()
    prs.slide_width  = Inches(13.333)  # 16:9
    prs.slide_height = Inches(7.5)
    SW, SH = prs.slide_width, prs.slide_height

    blank = prs.slide_layouts[6]

    # ---------- SLIDE 1: About / Wprowadzenie ----------
    s1 = prs.slides.add_slide(blank)
    set_slide_bg_dark(s1)

    # Ambient decorative circles
    circ1 = s1.shapes.add_shape(MSO_SHAPE.OVAL, Inches(-2), Inches(-2), Inches(6), Inches(6))
    circ1.fill.solid(); circ1.fill.fore_color.rgb = RGBColor(0x06, 0x1F, 0x22)
    circ1.line.fill.background()

    circ2 = s1.shapes.add_shape(MSO_SHAPE.OVAL, Inches(10), Inches(4), Inches(5), Inches(5))
    circ2.fill.solid(); circ2.fill.fore_color.rgb = RGBColor(0x03, 0x24, 0x2A)
    circ2.line.fill.background()

    # Left column — cyan hairline
    add_rect(s1, Inches(0.7), Inches(0.85), Inches(0.35), Emu(9525), AQUA)  # small hairline
    add_text(s1, Inches(1.15), Inches(0.75), Inches(6), Inches(0.35),
             "SMART CLOUT · TWÓJ PARTNER IT",
             size=10, bold=True, color=RGBColor(0x7C, 0xC4, 0xC0),
             letter_spacing=200)

    # Big title
    add_text(s1, Inches(0.7), Inches(1.1), Inches(9), Inches(2.0),
             "Nowoczesna infrastruktura IT",
             size=44, bold=True, color=WHITE, font=FONT_HEAD)
    add_text(s1, Inches(0.7), Inches(2.2), Inches(9), Inches(1.0),
             "dla wymagających klientów.",
             size=44, bold=True, color=CYAN, font=FONT_HEAD)

    # Subtitle
    add_text(s1, Inches(0.7), Inches(3.35), Inches(8.5), Inches(1.5),
             "Projektujemy, wdrażamy i utrzymujemy infrastrukturę serwerową, "
             "sieciową i pamięci masowych klasy enterprise. Autoryzowany partner "
             "NetApp, Fortinet, baramundi i innych czołowych vendorów.",
             size=15, color=RGBColor(0xC7, 0xD8, 0xDB), font=FONT_BODY)

    # Metric tiles (4 mini-cards)
    metrics = [
        ("12+", "lat na rynku IT"),
        ("100+", "wdrożeń klasy enterprise"),
        ("24/7", "wsparcie techniczne"),
        ("PL", "polski zespół inżynierów"),
    ]
    tile_w = Inches(2.5); tile_h = Inches(1.35)
    tile_y = Inches(5.15); gap = Inches(0.25)
    tile_x = Inches(0.7)
    for value, label in metrics:
        card = add_roundrect(s1, tile_x, tile_y, tile_w, tile_h,
                             RGBColor(0x0B, 0x14, 0x17), radius_pct=8,
                             line=RGBColor(0x1A, 0x33, 0x38))
        add_text(s1, tile_x + Inches(0.20), tile_y + Inches(0.15),
                 tile_w - Inches(0.4), Inches(0.55),
                 value, size=26, bold=True, color=CYAN, font=FONT_HEAD)
        add_text(s1, tile_x + Inches(0.20), tile_y + Inches(0.78),
                 tile_w - Inches(0.4), Inches(0.45),
                 label, size=10, color=RGBColor(0x9F, 0xB5, 0xB8),
                 letter_spacing=100)
        tile_x += tile_w + gap

    # Right side — logo placeholder
    logo_x = Inches(10.5); logo_y = Inches(0.75)
    add_roundrect(s1, logo_x, logo_y, Inches(2.2), Inches(0.65),
                  RGBColor(0x06, 0x1F, 0x22), radius_pct=30,
                  line=AQUA)
    add_text(s1, logo_x, logo_y, Inches(2.2), Inches(0.65),
             "SMART  CLOUT", size=13, bold=True, color=CYAN,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE,
             letter_spacing=300)

    # Footer band
    add_rect(s1, 0, SH - Inches(0.35), SW, Inches(0.35), RGBColor(0x02, 0x0B, 0x0D))
    add_text(s1, Inches(0.7), SH - Inches(0.33), Inches(12), Inches(0.3),
             "smartclout.pl   ·   +48 533 956 934   ·   Turek, PL   ·   KRS 0000952777",
             size=9, color=RGBColor(0x6B, 0x87, 0x8B), letter_spacing=100)

    # ---------- SLIDE 2: Portfolio / Kompetencje ----------
    s2 = prs.slides.add_slide(blank)
    set_slide_bg_light(s2)

    # Cyan hairline label
    add_rect(s2, Inches(0.7), Inches(0.75), Inches(0.4), Emu(9525), AQUA)
    add_text(s2, Inches(1.2), Inches(0.65), Inches(7), Inches(0.35),
             "PORTFOLIO KOMPETENCJI",
             size=10, bold=True, color=TEAL, letter_spacing=200)

    # Title
    add_text(s2, Inches(0.7), Inches(0.95), Inches(11), Inches(1.2),
             "Cztery filary naszej oferty.",
             size=36, bold=True, color=TEAL, font=FONT_HEAD)

    # 4 category cards (2x2 grid)
    cards = [
        ("SPRZĘT IT",        "Serwery · macierze NetApp · przełączniki · UPS · biblioteki LTO",
         "Rack-mount HW, projekty green-field i modernizacja DC"),
        ("BEZPIECZEŃSTWO",   "NGFW · DLP · IDM · UEM/MDM · SIEM · backup immutable",
         "Fortinet, Palo Alto, baramundi, Veeam — kompletny stack"),
        ("OPROGRAMOWANIE",   "Licencje · bazy danych · virtualizacja · modern workspace",
         "Microsoft, VMware, Broadcom — audyt i optymalizacja licencji"),
        ("CHMURA & DATACENTER", "Hybrid cloud · DR · konsolidacja · migracje · outsourcing",
         "Azure, AWS, on-prem — projektowanie i utrzymanie"),
    ]
    card_w = Inches(5.75); card_h = Inches(2.55)
    positions = [
        (Inches(0.7), Inches(2.3)),
        (Inches(6.85), Inches(2.3)),
        (Inches(0.7), Inches(5.0)),
        (Inches(6.85), Inches(5.0)),
    ]
    for (title, desc, sub), (cx, cy) in zip(cards, positions):
        # Card background
        add_roundrect(s2, cx, cy, card_w, card_h, WHITE, radius_pct=6,
                      line=RGBColor(0xD5, 0xE2, 0xE4))
        # Top gradient bar (cyan)
        add_rect(s2, cx, cy, card_w, Inches(0.08), CYAN)
        add_rect(s2, cx + card_w // 2, cy, card_w // 2, Inches(0.08), AQUA)
        # Category label
        add_text(s2, cx + Inches(0.35), cy + Inches(0.28),
                 card_w - Inches(0.7), Inches(0.35),
                 title, size=11, bold=True, color=AQUA, letter_spacing=250)
        # Description
        add_text(s2, cx + Inches(0.35), cy + Inches(0.75),
                 card_w - Inches(0.7), Inches(0.9),
                 desc, size=15, bold=True, color=TEAL, font=FONT_HEAD)
        # Sub-text
        add_text(s2, cx + Inches(0.35), cy + Inches(1.65),
                 card_w - Inches(0.7), Inches(0.7),
                 sub, size=11, color=RGBColor(0x4A, 0x7A, 0x80))

    # Footer band
    add_rect(s2, 0, SH - Inches(0.35), SW, Inches(0.35), TEAL)
    add_text(s2, Inches(0.7), SH - Inches(0.33), Inches(12), Inches(0.3),
             "SmartClout Sp. z o.o.   ·   NIP 5842813752   ·   REGON 521229601   ·   smartclout.pl",
             size=9, color=FROST, letter_spacing=100)

    out = os.path.join(OUT_DIR, "pitch-smartclout.pptx")
    prs.save(out)
    return out


# ================================================================
# BUILD OFFER TEMPLATE (XLSX)
# ================================================================
def build_offer():
    wb = Workbook()
    ws = wb.active
    ws.title = "Oferta"
    ws.sheet_view.showGridLines = False

    # Column widths
    widths = {"A": 3, "B": 40, "C": 12, "D": 10, "E": 14, "F": 10, "G": 16, "H": 3}
    for col, w in widths.items():
        ws.column_dimensions[col].width = w

    thin  = Side(style="thin",  color="D5E2E4")
    thick = Side(style="medium", color="0C5C62")

    F_CYAN  = "FF06FFE0"
    F_AQUA  = "FF00B8D4"
    F_TEAL  = "FF0C5C62"
    F_INK   = "FF040709"
    F_FROST = "FFF6F9FA"
    F_WHITE = "FFFFFFFF"
    F_MUTED = "FF7A999E"
    F_LINE  = "FFD5E2E4"

    # -------- HEADER BAND (dark ink) --------
    for r in range(1, 6):
        ws.row_dimensions[r].height = 12
    ws.row_dimensions[2].height = 42
    ws.row_dimensions[3].height = 30

    for row in range(1, 6):
        for col in "ABCDEFGH":
            ws[f"{col}{row}"].fill = PatternFill("solid", fgColor=F_INK)

    # Logo mark
    ws["B2"] = "SMART  CLOUT"
    ws["B2"].font = Font(name="Segoe UI", size=20, bold=True, color=F_CYAN)
    ws["B2"].alignment = Alignment(horizontal="left", vertical="center")

    ws["B3"] = "TWÓJ PARTNER IT · NETAPP · CYBERBEZPIECZEŃSTWO"
    ws["B3"].font = Font(name="Segoe UI", size=8, bold=True, color="FF7CC4C0")
    ws["B3"].alignment = Alignment(horizontal="left", vertical="center")

    # Right-side offer meta
    ws["F2"] = "OFERTA HANDLOWA"
    ws["F2"].font = Font(name="Segoe UI", size=10, bold=True, color=F_CYAN)
    ws["F2"].alignment = Alignment(horizontal="right", vertical="center")
    ws.merge_cells("F2:G2")

    ws["F3"] = "Nr:  OF/2026/000"
    ws["F3"].font = Font(name="Segoe UI", size=9, color=F_WHITE)
    ws["F3"].alignment = Alignment(horizontal="right", vertical="center")
    ws.merge_cells("F3:G3")

    # -------- CYAN GRADIENT BAND --------
    ws.row_dimensions[6].height = 6
    for col in "ABCD":
        ws[f"{col}6"].fill = PatternFill("solid", fgColor=F_CYAN)
    for col in "EFGH":
        ws[f"{col}6"].fill = PatternFill("solid", fgColor=F_AQUA)

    # -------- CLIENT + DATE INFO --------
    ws.row_dimensions[8].height = 20
    ws["B8"] = "KLIENT"
    ws["B8"].font = Font(name="Segoe UI", size=9, bold=True, color=F_TEAL)
    ws["F8"] = "DATA / WAŻNA DO"
    ws["F8"].font = Font(name="Segoe UI", size=9, bold=True, color=F_TEAL)

    ws["B9"] = "[Nazwa firmy klienta Sp. z o.o.]"
    ws["B9"].font = Font(name="Segoe UI", size=12, bold=True, color=F_TEAL)
    ws["B10"] = "[Adres · NIP · Osoba kontaktowa · e-mail · tel.]"
    ws["B10"].font = Font(name="Segoe UI", size=10, color=F_MUTED)
    ws["B11"] = "[Odbiorca oferty: Imię i Nazwisko, stanowisko]"
    ws["B11"].font = Font(name="Segoe UI", size=10, color=F_MUTED)

    ws["F9"] = "Data oferty: [DD.MM.2026]"
    ws["F9"].font = Font(name="Segoe UI", size=10, color=F_TEAL)
    ws["F9"].alignment = Alignment(horizontal="right")
    ws["F10"] = "Ważna do: [DD.MM.2026]"
    ws["F10"].font = Font(name="Segoe UI", size=10, color=F_TEAL)
    ws["F10"].alignment = Alignment(horizontal="right")
    ws["F11"] = "Warunki: 30 dni netto"
    ws["F11"].font = Font(name="Segoe UI", size=10, color=F_MUTED)
    ws["F11"].alignment = Alignment(horizontal="right")

    # -------- SCOPE BLOCK --------
    ws.row_dimensions[13].height = 20
    ws["B13"] = "PRZEDMIOT OFERTY"
    ws["B13"].font = Font(name="Segoe UI", size=9, bold=True, color=F_AQUA)
    ws.merge_cells("B14:G14")
    ws["B14"] = "[Krótki opis zakresu — np. Dostawa i wdrożenie macierzy NetApp AFF A70 wraz z 3-letnim wsparciem NBD, migracją danych z aktualnej macierzy i dokumentacją powykonawczą.]"
    ws["B14"].alignment = Alignment(wrap_text=True, vertical="top")
    ws["B14"].font = Font(name="Segoe UI", size=10, color=F_TEAL)
    ws.row_dimensions[14].height = 42

    # -------- ITEMS TABLE HEADER --------
    HEADER_ROW = 17
    headers = ["Lp.", "Nazwa / opis pozycji", "Kod / SKU", "Ilość", "Cena netto",
               "Rabat %", "Wartość netto"]
    for idx, h in enumerate(headers):
        cell = ws.cell(row=HEADER_ROW, column=idx + 2, value=h)
        cell.font = Font(name="Segoe UI", size=10, bold=True, color=F_WHITE)
        cell.fill = PatternFill("solid", fgColor=F_TEAL)
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = Border(left=thin, right=thin, top=thick, bottom=thick)
    ws.row_dimensions[HEADER_ROW].height = 26

    # -------- ITEMS ROWS (10 pozycji z formułami) --------
    START = HEADER_ROW + 1
    ROWS  = 10
    for i in range(ROWS):
        r = START + i
        ws.row_dimensions[r].height = 22
        # Alternate row fill
        row_fill = F_WHITE if i % 2 == 0 else F_FROST
        for col_idx in range(2, 9):
            c = ws.cell(row=r, column=col_idx)
            c.fill = PatternFill("solid", fgColor=row_fill)
            c.border = Border(left=thin, right=thin, top=thin, bottom=thin)
            c.font = Font(name="Segoe UI", size=10, color=F_TEAL)
        # Lp
        ws.cell(row=r, column=2, value=i + 1).alignment = Alignment(horizontal="center", vertical="center")
        # Empty placeholders
        ws.cell(row=r, column=3, value="").alignment = Alignment(wrap_text=True, vertical="center")
        ws.cell(row=r, column=4, value="").alignment = Alignment(horizontal="center", vertical="center")
        ws.cell(row=r, column=5, value="").alignment = Alignment(horizontal="center", vertical="center")
        # Cena netto
        pn = ws.cell(row=r, column=6, value="")
        pn.number_format = '#,##0.00" zł"'
        pn.alignment = Alignment(horizontal="right", vertical="center")
        # Rabat
        rb = ws.cell(row=r, column=7, value=0)
        rb.number_format = '0%'
        rb.alignment = Alignment(horizontal="center", vertical="center")
        # Wartość netto = ilość * cena * (1 - rabat)
        wn = ws.cell(row=r, column=8,
                     value=f"=IFERROR(E{r}*F{r}*(1-G{r}),0)")
        wn.number_format = '#,##0.00" zł"'
        wn.font = Font(name="Segoe UI", size=10, bold=True, color=F_TEAL)
        wn.alignment = Alignment(horizontal="right", vertical="center")

    # Example first row (guidance)
    ws.cell(row=START, column=3, value="[Macierz NetApp AFF A70, konfiguracja 2×controller, 24× 15.36 TB NVMe]")
    ws.cell(row=START, column=4, value="AFF-A70-24-NVME")
    ws.cell(row=START, column=5, value=1)
    ws.cell(row=START, column=6, value=250000)
    ws.cell(row=START, column=7, value=0.10)
    ws.cell(row=START, column=3).font = Font(name="Segoe UI", size=10, italic=True, color=F_MUTED)

    # -------- TOTALS --------
    END = START + ROWS - 1
    SUM_ROW = END + 2
    for col in "BCDEF":
        ws[f"{col}{SUM_ROW}"].fill = PatternFill("solid", fgColor=F_FROST)
    ws.cell(row=SUM_ROW, column=6, value="Suma netto").font = Font(name="Segoe UI", size=11, bold=True, color=F_TEAL)
    ws.cell(row=SUM_ROW, column=6).alignment = Alignment(horizontal="right", vertical="center")
    ws.merge_cells(start_row=SUM_ROW, start_column=6, end_row=SUM_ROW, end_column=7)
    sn = ws.cell(row=SUM_ROW, column=8, value=f"=SUM(H{START}:H{END})")
    sn.number_format = '#,##0.00" zł"'
    sn.font = Font(name="Segoe UI", size=11, bold=True, color=F_TEAL)
    sn.alignment = Alignment(horizontal="right", vertical="center")
    sn.fill = PatternFill("solid", fgColor=F_FROST)
    ws.row_dimensions[SUM_ROW].height = 22

    VAT_ROW = SUM_ROW + 1
    ws.cell(row=VAT_ROW, column=6, value="VAT 23%").font = Font(name="Segoe UI", size=10, color=F_TEAL)
    ws.cell(row=VAT_ROW, column=6).alignment = Alignment(horizontal="right", vertical="center")
    ws.merge_cells(start_row=VAT_ROW, start_column=6, end_row=VAT_ROW, end_column=7)
    vat = ws.cell(row=VAT_ROW, column=8, value=f"=H{SUM_ROW}*0.23")
    vat.number_format = '#,##0.00" zł"'
    vat.font = Font(name="Segoe UI", size=10, color=F_TEAL)
    vat.alignment = Alignment(horizontal="right", vertical="center")

    TOT_ROW = VAT_ROW + 1
    for col in "BCDEFGH":
        ws[f"{col}{TOT_ROW}"].fill = PatternFill("solid", fgColor=F_TEAL)
    ws.cell(row=TOT_ROW, column=6, value="RAZEM BRUTTO").font = Font(name="Segoe UI", size=13, bold=True, color=F_CYAN)
    ws.cell(row=TOT_ROW, column=6).alignment = Alignment(horizontal="right", vertical="center")
    ws.merge_cells(start_row=TOT_ROW, start_column=6, end_row=TOT_ROW, end_column=7)
    tot = ws.cell(row=TOT_ROW, column=8, value=f"=H{SUM_ROW}+H{VAT_ROW}")
    tot.number_format = '#,##0.00" zł"'
    tot.font = Font(name="Segoe UI", size=14, bold=True, color=F_CYAN)
    tot.alignment = Alignment(horizontal="right", vertical="center")
    ws.row_dimensions[TOT_ROW].height = 30

    # -------- TERMS --------
    TERMS_ROW = TOT_ROW + 3
    ws.cell(row=TERMS_ROW, column=2, value="WARUNKI HANDLOWE").font = Font(name="Segoe UI", size=9, bold=True, color=F_AQUA)
    terms = [
        "· Termin realizacji: 4–6 tygodni od potwierdzenia zamówienia",
        "· Płatność: przelew 30 dni od daty wystawienia faktury",
        "· Gwarancja: zgodnie z warunkami producenta, min. 3 lata NBD on-site",
        "· Wdrożenie i szkolenie: w cenie oferty, na zamówienie klienta",
        "· Ceny nie zawierają podatku VAT · oferta ważna 30 dni",
    ]
    for i, t in enumerate(terms):
        r = TERMS_ROW + 1 + i
        ws.cell(row=r, column=2, value=t).font = Font(name="Segoe UI", size=10, color=F_TEAL)
        ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=8)

    # -------- SIGNATURE --------
    SIG_ROW = TERMS_ROW + len(terms) + 3
    ws.cell(row=SIG_ROW, column=2, value="Oferent:").font = Font(name="Segoe UI", size=9, color=F_MUTED)
    ws.cell(row=SIG_ROW + 1, column=2, value="[Imię Nazwisko, stanowisko]").font = Font(name="Segoe UI", size=10, bold=True, color=F_TEAL)
    ws.cell(row=SIG_ROW + 2, column=2, value="tel. +48 533 956 934 · biuro@smartclout.pl").font = Font(name="Segoe UI", size=9, color=F_MUTED)

    ws.cell(row=SIG_ROW, column=6, value="Akceptacja klienta:").font = Font(name="Segoe UI", size=9, color=F_MUTED)
    ws.cell(row=SIG_ROW, column=6).alignment = Alignment(horizontal="right")
    ws.merge_cells(start_row=SIG_ROW, start_column=6, end_row=SIG_ROW, end_column=8)
    ws.cell(row=SIG_ROW + 2, column=6, value="_________________________________").font = Font(name="Segoe UI", size=10, color=F_TEAL)
    ws.cell(row=SIG_ROW + 2, column=6).alignment = Alignment(horizontal="right")
    ws.merge_cells(start_row=SIG_ROW + 2, start_column=6, end_row=SIG_ROW + 2, end_column=8)
    ws.cell(row=SIG_ROW + 3, column=6, value="podpis i pieczątka").font = Font(name="Segoe UI", size=8, color=F_MUTED)
    ws.cell(row=SIG_ROW + 3, column=6).alignment = Alignment(horizontal="right")
    ws.merge_cells(start_row=SIG_ROW + 3, start_column=6, end_row=SIG_ROW + 3, end_column=8)

    # -------- FOOTER --------
    FOOT_ROW = SIG_ROW + 6
    for col in "ABCDEFGH":
        ws[f"{col}{FOOT_ROW}"].fill = PatternFill("solid", fgColor=F_INK)
    ws.row_dimensions[FOOT_ROW].height = 24
    ws.cell(row=FOOT_ROW, column=2, value="SmartClout Sp. z o.o.  ·  NIP 5842813752  ·  REGON 521229601  ·  KRS 0000952777  ·  ul. Leona Lubomira Kruszyńskiego 19, 62-700 Turek").font = Font(name="Segoe UI", size=8, color="FF9FB5B8")
    ws.merge_cells(start_row=FOOT_ROW, start_column=2, end_row=FOOT_ROW, end_column=8)
    ws.cell(row=FOOT_ROW, column=2).alignment = Alignment(vertical="center")

    # Page setup — landscape A4 print
    ws.page_setup.orientation = ws.ORIENTATION_PORTRAIT
    ws.page_setup.paperSize = ws.PAPERSIZE_A4
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 1
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.print_options.horizontalCentered = True
    ws.page_margins.left = 0.4
    ws.page_margins.right = 0.4
    ws.page_margins.top = 0.4
    ws.page_margins.bottom = 0.4

    out = os.path.join(OUT_DIR, "oferta-smartclout-szablon.xlsx")
    wb.save(out)
    return out


if __name__ == "__main__":
    p1 = build_pitch()
    p2 = build_offer()
    print("Generated:")
    print(f"  PPTX  → {p1}")
    print(f"  XLSX  → {p2}")
