"""
Drives Fooocus 2.5 generate endpoint (fn_index=67) via gradio_client.
Built from D:/Fooocus_win64_2-5-0/Fooocus/webui.py ctrls registration.

Usage:
    python fooocus_drive.py one        # generate first image only (smoke test)
    python fooocus_drive.py all        # generate full website set
"""

import sys
import io
import os
import contextlib
import shutil
import math
import time
from pathlib import Path

# Force UTF-8 stdout (Windows console default is cp1252)
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", line_buffering=True)
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", line_buffering=True)

from gradio_client import Client
from gradio_client.client import Endpoint

# Patch serialize: drop arg-count assertion, skip None values in file uploads.
def _patched_serialize(self, *data):
    serializers = list(self.serializers)
    types = getattr(self, "input_component_types", []) or []
    data = list(data)
    if len(data) < len(serializers):
        data = data + [None] * (len(serializers) - len(data))
    elif len(data) > len(serializers):
        data = data[: len(serializers)]
    files = [
        f for f, t in zip(data, types)
        if t in ("file", "uploadbutton") and f is not None and f != ""
    ]
    if files:
        try:
            uploaded_files = self._upload(files)
            self._add_uploaded_files_to_data(uploaded_files, data)
        except Exception:
            pass
    return tuple(s.serialize(d) for s, d in zip(serializers, data))
Endpoint.serialize = _patched_serialize

FOOOCUS_URL = "http://127.0.0.1:7865/"
OUTPUT_DIR = Path(r"D:/visual-rhyme-website/public/images")
FOOOCUS_OUTPUTS = Path(r"D:/Fooocus_win64_2-5-0/Fooocus/outputs")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def latest_output_file() -> Path | None:
    """Newest .png/.jpg/.webp written by Fooocus across all date folders."""
    if not FOOOCUS_OUTPUTS.exists():
        return None
    candidates = []
    for date_dir in FOOOCUS_OUTPUTS.iterdir():
        if not date_dir.is_dir():
            continue
        for f in date_dir.glob("*.png"):
            candidates.append(f)
        for f in date_dir.glob("*.jpeg"):
            candidates.append(f)
        for f in date_dir.glob("*.jpg"):
            candidates.append(f)
        for f in date_dir.glob("*.webp"):
            candidates.append(f)
    if not candidates:
        return None
    return max(candidates, key=lambda p: p.stat().st_mtime)


def wait_for_new_output(baseline_mtime: float, timeout_s: int = 120) -> Path | None:
    """Poll outputs folder until a new file appears or timeout."""
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        latest = latest_output_file()
        if latest and latest.stat().st_mtime > baseline_mtime:
            # wait one more second for the file to finish writing
            time.sleep(1.0)
            return latest
        time.sleep(2.0)
    return None

# Aspect ratio labels Fooocus expects — built via the same add_ratio() formula
def aspect_label(w: int, h: int) -> str:
    g = math.gcd(w, h)
    return f'{w}×{h} <span style="color: grey;"> ∣ {w // g}:{h // g}</span>'

# Style list known good for Fooocus 2.5
STYLES = ["Fooocus V2", "Fooocus Photograph", "Fooocus Sharp"]

NEGATIVE = (
    "blurry, low quality, low resolution, watermark, signature, text overlay, "
    "ugly, deformed, oversaturated, cartoon, anime, illustration, render artifact, "
    "fake, stock photo, harsh shadows, plastic skin, distorted faces, "
    "extra limbs, missing fingers"
)

# Sequence: (filename, prompt, width, height, performance)
JOBS = [
    ("hero-essence.jpg",
     "Ultra-wide cinematic photograph of a colossal floor-to-ceiling MicroLED video wall installed inside a futuristic dark architectural atrium, the wall displaying a swirling deep purple and violet nebula-like abstract pattern with embers of lavender light, soft volumetric god rays from above, polished black marble floor reflecting the glow, atmospheric haze, anamorphic lens bokeh, hyperrealistic, 8k photography, depth of field, cinematic color grade",
     1344, 768, "Speed"),

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
     "Cinematic interior photograph of an ultra-modern corporate boardroom with a wall-spanning MicroLED display showing crisp data visualization dashboards, twelve executives seated at a polished oak conference table, dramatic purple ambient lighting from concealed LED strips along the ceiling, floor-to-ceiling glass walls revealing a financial district skyline at twilight, photorealistic architectural photography, sense of quiet authority and precision, muted purple-and-amber color grade",
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
     "Wide architectural photograph of the exterior of a modern glass-and-steel office building in Ahmedabad at dusk, warm interior lights glowing from within, soft violet LED accent strip illuminating the entrance, urban Indian context, twilight sky with soft purple and orange gradient, shot from across the street, ultra-realistic, cinematic, sense of accessibility and quiet confidence",
     1344, 768, "Speed"),

    ("footer-ambient.jpg",
     "Ultra-wide minimalist photograph of a deep matte black surface scattered with tiny pinpoints of soft violet and purple LED light, like a quiet starfield, shallow depth of field, soft atmospheric haze, ambient mood, abstract, premium tech aesthetic, cinematic 8k, suitable as a subtle textured background",
     1536, 640, "Speed"),
]


def build_args(prompt: str, negative: str, width: int, height: int, performance: str) -> list:
    """Build the 153-arg list for fn_index=67."""
    args = []
    # [0] generate_image_grid (state is auto-inserted by gradio_client.insert_state)
    args += [False]
    # [1..11] prompt, negative_prompt, style_selections, performance, aspect_ratios,
    #         image_number, output_format, image_seed, read_wildcards_in_order, sharpness, guidance_scale
    args += [
        prompt,
        negative,
        STYLES,
        performance,
        aspect_label(width, height),
        1,
        "png",
        "-1",
        False,
        2,
        4,
    ]
    # [13..15] base_model, refiner_model, refiner_switch
    args += ["juggernautXL_v8Rundiffusion.safetensors", "None", 0.5]
    # [16..30] lora_ctrls x5: (enable, lora_name, weight)
    for _ in range(5):
        args += [False, "None", 1.0]
    # [31..32] input_image_checkbox, current_tab (hidden Textbox)
    args += [False, "uov"]
    # [33..34] uov_method, uov_input_image
    args += ["Disabled", None]
    # [35..38] outpaint_selections, inpaint_input_image, inpaint_additional_prompt, inpaint_mask_image
    args += [[], None, "", None]
    # [39..42] disable_preview, disable_intermediate_results, disable_seed_increment, black_out_nsfw
    args += [True, True, False, False]
    # [43..47] adm_scaler_positive, adm_scaler_negative, adm_scaler_end, adaptive_cfg, clip_skip
    args += [1.5, 0.8, 0.3, 7.0, 2]
    # [48..50] sampler, scheduler, vae
    args += ["dpmpp_2m_sde_gpu", "karras", "Default (model)"]
    # [51..55] overwrite_step, overwrite_switch, overwrite_width, overwrite_height, overwrite_vary_strength
    args += [-1, -1, -1, -1, -1]
    # [56..58] overwrite_upscale_strength, mixing_image_prompt_and_vary_upscale, mixing_image_prompt_and_inpaint
    args += [-1, False, False]
    # [59..62] debugging_cn_preprocessor, skipping_cn_preprocessor, canny_low_threshold, canny_high_threshold
    args += [False, False, 64, 128]
    # [63..64] refiner_swap_method, controlnet_softness
    args += ["joint", 0.25]
    # [65..69] freeu_ctrls
    args += [False, 1.01, 1.02, 0.99, 0.95]
    # [70..77] inpaint_ctrls
    args += [False, False, "v2.6", 1.0, 0.618, False, False, 0]
    # [78] save_final_enhanced_image_only
    args += [False]
    # [79..80] save_metadata_to_images, metadata_scheme
    args += [True, "fooocus"]
    # [81..96] ip_ctrls x4: (image, stop_at, weight, type)
    for _ in range(4):
        args += [None, 0.5, 0.6, "ImagePrompt"]
    # [97..100] debugging_dino, dino_erode_or_dilate, debugging_enhance_masks, enhance_input_image
    args += [False, 0, False, None]
    # [101..104] enhance_checkbox, enhance_uov_method, enhance_uov_processing_order, enhance_uov_prompt_type
    args += [False, "Disabled", "Before First Enhancement", "Original Prompts"]
    # [105..152] enhance_ctrls x3: 16 params each
    for _ in range(3):
        args += [
            False,  # enable
            "",     # detection_prompt
            "",     # enhancement_positive_prompt
            "",     # enhancement_negative_prompt
            "sam",  # mask_generation_model
            "full", # cloth_category
            "vit_b",# sam_model
            0.25,   # text_threshold
            0.3,    # box_threshold
            0,      # maximum_number_of_detections
            False,  # disable_initial_latent_in_inpaint
            "v2.6", # inpaint_engine
            1.0,    # inpaint_denoising_strength
            0.618,  # inpaint_respective_field
            0,      # mask_erode_or_dilate
            False,  # invert_mask
        ]
    assert len(args) == 152, f"arg count is {len(args)} not 152"
    return args


def generate_one(client: Client, filename: str, prompt: str, width: int, height: int, perf: str):
    print(f"\n[gen] {filename}  ({width}x{height}, {perf})")
    args = build_args(prompt, NEGATIVE, width, height, perf)

    # Capture baseline mtime so we can detect newly written files
    baseline = latest_output_file()
    baseline_mtime = baseline.stat().st_mtime if baseline else 0.0

    t0 = time.time()
    # Single call: this triggers Fooocus's get_task → AsyncTask → worker.
    # The worker writes the PNG to outputs/YYYY-MM-DD/. We then collect from disk.
    try:
        client.predict(*args, fn_index=67)
    except Exception as e:
        # The chained gallery-return call sometimes errors but the worker still runs.
        print(f"[gen] {filename}: predict raised {e!r} (worker may still be running)")

    # Speed mode ~15-25s, Quality ~45-90s. Poll for new file.
    new_file = wait_for_new_output(baseline_mtime, timeout_s=180)
    if not new_file:
        print(f"[gen] {filename}: TIMEOUT — no new file appeared in 180s")
        return None
    dt = time.time() - t0
    print(f"[gen] {filename}: worker produced {new_file.name} in {dt:.1f}s")
    dst = OUTPUT_DIR / filename
    shutil.copy2(new_file, dst)
    size_kb = dst.stat().st_size / 1024
    print(f"[gen] {filename}: SAVED -> {dst}  ({size_kb:.0f} KB)")
    return dst


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "one"
    print(f"[fooocus] connecting to {FOOOCUS_URL} (mode={mode})")
    with contextlib.redirect_stdout(io.StringIO()):
        client = Client(FOOOCUS_URL, verbose=False)
    print("[fooocus] connected")
    targets = JOBS[:1] if mode == "one" else JOBS
    completed = []
    for filename, prompt, w, h, perf in targets:
        # skip if already exists (resume safety)
        if (OUTPUT_DIR / filename).exists():
            print(f"[skip] {filename} already exists")
            completed.append(filename)
            continue
        try:
            out = generate_one(client, filename, prompt, w, h, perf)
            if out:
                completed.append(filename)
        except Exception as e:
            print(f"[err]  {filename}: {e!r}")
    print(f"\n[done] {len(completed)}/{len(targets)} saved into {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
