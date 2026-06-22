"""
Drive Fooocus 2.5 via raw HTTP POST to /run/predict — no gradio_client.
We bypass Gradio's strict client serialization by talking JSON directly.

Strategy:
  1. POST to /run/predict with fn_index=67 + 153 args as JSON
  2. Fooocus's get_task pops first arg (currentTask), enqueues AsyncTask
  3. Worker processes, saves PNG to outputs/YYYY-MM-DD/
  4. We poll the outputs folder for a new file
  5. Copy to D:/visual-rhyme-website/public/images/<filename>

No assertion errors, no file-upload edge cases. Pure JSON in/out.
"""

import sys
import io
import os
import math
import time
import json
import shutil
import secrets
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", line_buffering=True)
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", line_buffering=True)

import requests

FOOOCUS_BASE = "http://127.0.0.1:7865"
OUTPUT_DIR = Path(r"D:/visual-rhyme-website/public/images")
FOOOCUS_OUTPUTS = Path(r"D:/Fooocus_win64_2-5-0/Fooocus/outputs")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def aspect_label(w: int, h: int) -> str:
    g = math.gcd(w, h)
    return f'{w}×{h} <span style="color: grey;"> ∣ {w // g}:{h // g}</span>'


STYLES = ["Fooocus V2", "Fooocus Enhance", "Fooocus Sharp", "Fooocus Photograph"]

NEGATIVE = (
    "blurry, low quality, low resolution, watermark, signature, text overlay, "
    "ugly, deformed, oversaturated, cartoon, anime, illustration, render artifact, "
    "fake, stock photo, harsh shadows, plastic skin, distorted faces, "
    "extra limbs, missing fingers"
)


JOBS = [
    ("product-leynna-sapphire.jpg",
     "Premium product photograph of a massive 163-inch wall-mounted MicroLED display in a luxury penthouse living room overlooking a city skyline at golden hour, the screen displaying a serene mountain lake landscape in crisp HDR detail, sleek minimalist Italian furniture, polished walnut floors, warm sunset light streaming through floor-to-ceiling glass, soft volumetric shadows, ultra-realistic interior architectural photography, magazine cover quality, shot on medium format with a 50mm prime, shallow depth of field",
     1152, 896, "Speed"),

    ("app-stadium.jpg",
     "Wide cinematic photograph of a packed cricket stadium at night, a massive 360-degree LED ring board surrounding the field showing brand sponsorships in saturated colors, stadium lights creating dramatic god rays through slight mist, fans cheering in stands, LED light glow lighting up closest rows in warm purple-violet, shot from a low elevated angle, hyperrealistic sports photography, 8k, cinematic colour grade",
     1344, 768, "Speed"),

    ("showcase-ambient.jpg",
     "Ultra-wide abstract photograph of a hypnotic field of glowing purple and violet LED pixels merging into a liquid nebula pattern, shot from an angle that emphasises the sub-pixel grid up close, with bokeh-blurred lights fading into the distance, shimmering depth, sense of infinite resolution, abstract macro photography, atmospheric, dreamy, deep blacks and electric purples, cinematic, 8k",
     1536, 640, "Speed"),

    ("product-leynna-cosmo.jpg",
     "Cinematic interior photograph of an ultra-modern corporate boardroom with a wall-spanning MicroLED display showing crisp data visualization dashboards, twelve executives seated at a polished oak conference table, dramatic purple ambient lighting from concealed LED strips along the ceiling, floor-to-ceiling glass walls revealing a financial district skyline at twilight, photorealistic architectural photography, quiet authority and precision, muted purple-and-amber color grade",
     1152, 896, "Speed"),

    ("product-reyansh-outdoor.jpg",
     "Hyperreal photograph of a massive outdoor LED billboard mounted on the facade of a downtown commercial tower at dusk, the billboard displaying a vibrant brand campaign in saturated colours, light rain on the street below, neon reflections in puddles, motion-blurred passersby, atmospheric mist, low cinematic angle, urban India blended with Tokyo street neon, ultra-sharp on the LED surface, 8k photography",
     1152, 896, "Speed"),

    ("product-reyansh-indoor.jpg",
     "Architectural photograph of a flagship retail store with a curved wall-spanning MiniLED display showing fashion runway footage in vibrant color, polished concrete floors, customers in soft motion blur browsing premium products, warm white ambient retail lighting balanced against the cool violet glow of the LED wall, premium hospitality, depth of field on the display, architectural digest style, ultra-realistic, 8k",
     1152, 896, "Speed"),

    ("app-boardroom.jpg",
     "Photograph of a sleek executive boardroom with a large MicroLED wall displaying detailed financial dashboards and live video conference participants, leather chairs around a long polished black table, soft amber pendant lighting overhead, deep purple ambient light from indirect LED strips along the floor, view of city skyline through floor-to-ceiling windows at blue hour, high-stakes decision-making, architectural photography, shallow depth of field, premium corporate",
     1344, 768, "Speed"),

    ("app-luxury.jpg",
     "Architectural photograph of a sprawling modern Indian villa living room with a 163-inch wall-mounted MicroLED screen displaying a tranquil aerial shot of the Himalayas, marble flooring, sculptural designer furniture, gold and bronze accents, evening light through tall arched windows, indoor plants in brass planters, cinematic calm, Architectural Digest India style, ultra-realistic, soft depth of field, premium opulence",
     1344, 768, "Speed"),

    ("app-dooh.jpg",
     "Photograph of a busy modern airport terminal with several large MiniLED advertising displays mounted in the concourse showing premium brand campaigns, travellers walking past in motion blur, ambient sunlight streaming through angled glass ceiling, polished terrazzo floors reflecting the digital signage colors, organised motion, architectural photography, midday, ultra-realistic, 8k, cinematic",
     1344, 768, "Speed"),

    ("app-controlroom.jpg",
     "Photograph of a sophisticated dark control room with a massive multi-display LED video wall showing real-time data dashboards, world maps, and live camera feeds, several operators in headsets seated at curved consoles, dramatic dim blue and purple ambient lighting, monitor glow on their faces, mission control aesthetic, wide shot showing scale, ultra-realistic, cinematic, 24/7 vigilance, 8k",
     1344, 768, "Speed"),

    ("app-museum.jpg",
     "Architectural photograph of an immersive museum gallery with curved wall-spanning MicroLED displays surrounding the visitor, showing artistic visual installations in vibrant colors and abstract motion, silhouetted visitors in awe, polished concrete floors, near-black walls, theatrical ambient lighting from concealed sources, contemplative wonder, teamLab Planets Tokyo style, ultra-realistic, deep cinematic colors",
     1344, 768, "Speed"),

    ("about-visual.jpg",
     "Documentary photograph of a precision LED panel assembly bench in a clean white laboratory, gloved hands of an engineer using a microscope to inspect a sapphire-substrate MicroLED chip, soft daylight from a north-facing window, tools and calibration spectrophotometer in background, craftsmanship and engineering rigour, shallow depth of field on the chip, warm but cool-toned lighting, ultra-realistic editorial photography",
     896, 1152, "Speed"),

    ("contact-bg.jpg",
     "Wide architectural photograph of the exterior of a modern glass-and-steel office building in Ahmedabad at dusk, warm interior lights glowing from within, soft violet LED accent strip illuminating the entrance, urban Indian context, twilight sky with soft purple and orange gradient, shot from across the street, ultra-realistic, cinematic, accessibility and quiet confidence",
     1344, 768, "Speed"),

    ("footer-ambient.jpg",
     "Ultra-wide minimalist photograph of a deep matte black surface scattered with tiny pinpoints of soft violet and purple LED light, like a quiet starfield, shallow depth of field, soft atmospheric haze, ambient mood, abstract, premium tech aesthetic, cinematic 8k, suitable as a subtle textured background",
     1536, 640, "Speed"),
]


def build_data(prompt: str, width: int, height: int, perf: str) -> list:
    """Build the 153-element data array as raw JSON values."""
    data = []
    # [0] currentTask State (None for fresh task)
    data.append(None)
    # [1] generate_image_grid
    data.append(False)
    # [2..12]
    data += [
        prompt, NEGATIVE, STYLES, perf, aspect_label(width, height),
        1, "png", "-1", False, 2, 4,
    ]
    # [13..15] base_model, refiner_model, refiner_switch
    data += ["juggernautXL_v8Rundiffusion.safetensors", "None", 0.5]
    # [16..30] 5 lora_ctrls × 3
    for _ in range(5):
        data += [False, "None", 1.0]
    # [31..32] input_image_checkbox, current_tab
    data += [False, "uov"]
    # [33..34] uov_method, uov_input_image
    data += ["Disabled", None]
    # [35..38] outpaint_selections, inpaint_input_image, inpaint_additional_prompt, inpaint_mask_image
    data += [[], None, "", None]
    # [39..42] disable_preview, disable_intermediate_results, disable_seed_increment, black_out_nsfw
    data += [True, True, False, False]
    # [43..47] ADM scalers + adaptive_cfg + clip_skip
    data += [1.5, 0.8, 0.3, 7.0, 2]
    # [48..50] sampler, scheduler, vae
    data += ["dpmpp_2m_sde_gpu", "karras", "Default (model)"]
    # [51..55] overwrite_step .. overwrite_vary_strength
    data += [-1, -1, -1, -1, -1]
    # [56..58] overwrite_upscale_strength + 2 mixing
    data += [-1, False, False]
    # [59..62] debug_cn, skip_cn, canny_low, canny_high
    data += [False, False, 64, 128]
    # [63..64] refiner_swap_method, controlnet_softness
    data += ["joint", 0.25]
    # [65..69] freeu (enabled, b1, b2, s1, s2)
    data += [False, 1.01, 1.02, 0.99, 0.95]
    # [70..77] inpaint_ctrls (8 items)
    data += [False, False, "v2.6", 1.0, 0.618, False, False, 0]
    # [78] save_final_enhanced_image_only
    data += [False]
    # [79..80] save_metadata, metadata_scheme
    data += [True, "fooocus"]
    # [81..96] 4 IP slots × (image, stop_at, weight, type)
    for _ in range(4):
        data += [None, 0.5, 0.6, "ImagePrompt"]
    # [97..100] debug_dino, dino_erode, debug_enhance_masks, enhance_input_image
    data += [False, 0, False, None]
    # [101..104] enhance_checkbox, enhance_uov_method, enhance_uov_processing_order, enhance_uov_prompt_type
    data += [False, "Disabled", "Before First Enhancement", "Original Prompts"]
    # [105..152] 3 enhance groups × 16 items each
    for _ in range(3):
        data += [
            False, "", "", "",
            "sam", "full", "vit_b",
            0.25, 0.3, 0,
            False, "v2.6", 1.0, 0.618, 0, False,
        ]
    assert len(data) == 153, f"data length {len(data)} != 153"
    return data


def latest_output_file():
    if not FOOOCUS_OUTPUTS.exists():
        return None
    files = []
    for date_dir in FOOOCUS_OUTPUTS.iterdir():
        if date_dir.is_dir():
            for f in date_dir.iterdir():
                if f.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp"):
                    files.append(f)
    return max(files, key=lambda p: p.stat().st_mtime) if files else None


def wait_new_file(baseline_mtime: float, timeout_s: int) -> Path:
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        latest = latest_output_file()
        if latest and latest.stat().st_mtime > baseline_mtime:
            # let writer finish
            time.sleep(1.5)
            return latest
        time.sleep(2.0)
    return None


def post_predict(data: list, fn_index: int = 67) -> dict:
    payload = {
        "data": data,
        "fn_index": fn_index,
        "session_hash": secrets.token_hex(8),
    }
    r = requests.post(
        f"{FOOOCUS_BASE}/run/predict",
        json=payload,
        timeout=(10, 600),  # 10s connect, 10min read
    )
    r.raise_for_status()
    return r.json()


def generate_one(filename: str, prompt: str, w: int, h: int, perf: str) -> Path:
    print(f"\n[gen] {filename}  ({w}x{h}, {perf})")
    baseline = latest_output_file()
    baseline_mtime = baseline.stat().st_mtime if baseline else 0.0
    data = build_data(prompt, w, h, perf)
    t0 = time.time()
    try:
        resp = post_predict(data)
        print(f"[gen] {filename}: POST ok ({time.time()-t0:.1f}s) keys={list(resp.keys())[:5]}")
    except Exception as e:
        print(f"[gen] {filename}: POST raised {e!r} (worker may still process)")

    new_file = wait_new_file(baseline_mtime, timeout_s=180)
    if not new_file:
        print(f"[gen] {filename}: TIMEOUT — no new file in 180s")
        return None
    dt = time.time() - t0
    print(f"[gen] {filename}: worker produced {new_file.name} in {dt:.1f}s")
    dst = OUTPUT_DIR / filename
    shutil.copy2(new_file, dst)
    print(f"[gen] {filename}: SAVED ({dst.stat().st_size//1024}KB)")
    return dst


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "one"
    pending = [j for j in JOBS if not (OUTPUT_DIR / j[0]).exists()]
    print(f"[start] {len(pending)} pending of {len(JOBS)} total")
    todo = pending[:1] if mode == "one" else pending
    saved = []
    for filename, prompt, w, h, perf in todo:
        try:
            out = generate_one(filename, prompt, w, h, perf)
            if out:
                saved.append(filename)
        except Exception as e:
            print(f"[err] {filename}: {e!r}")
    print(f"\n[done] {len(saved)}/{len(todo)} saved")


if __name__ == "__main__":
    main()
