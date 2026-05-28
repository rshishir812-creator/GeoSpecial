"""
Compute per-year NDVI, NDWI, built-up metrics for a curated area and write JSON.
Output: metrics/<area_slug>/<theme>.json
"""
import argparse, json, os, ee

def cloud_mask_s2(image):
    scl = image.select("SCL")
    mask = scl.neq(3).And(scl.neq(7)).And(scl.neq(8)).And(scl.neq(9)).And(scl.neq(10))
    return image.updateMask(mask)

def annual_composite(aoi, year):
    col = (
        ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
        .filterBounds(aoi)
        .filterDate(f"{year}-11-01", f"{year+1}-03-31")
        .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 30))
        .map(cloud_mask_s2)
    )
    size = col.size().getInfo()
    if size == 0:
        # Relax cloud threshold for sparse years
        col = (
            ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
            .filterBounds(aoi)
            .filterDate(f"{year}-10-01", f"{year+1}-04-30")
            .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 60))
            .map(cloud_mask_s2)
        )
        size = col.size().getInfo()
    return col.median().clip(aoi) if size > 0 else None

def mean_ndvi(image, aoi):
    ndvi = image.normalizedDifference(["B8", "B4"])
    val = ndvi.reduceRegion(ee.Reducer.mean(), aoi, 30).get("nd").getInfo()
    return val

def water_area_km2(image, aoi):
    ndwi = image.normalizedDifference(["B3", "B8"])
    water = ndwi.gt(0.1)
    area = water.multiply(ee.Image.pixelArea()).reduceRegion(ee.Reducer.sum(), aoi, 30)
    return (area.get("nd").getInfo() or 0) / 1e6

def built_pct(image, aoi):
    ndbi = image.normalizedDifference(["B11", "B8"])
    built = ndbi.gt(0)
    total = ee.Image(1).reduceRegion(ee.Reducer.count(), aoi, 30).get("constant").getInfo()
    built_count = built.reduceRegion(ee.Reducer.sum(), aoi, 30).get("nd").getInfo() or 0
    return round((built_count / max(total, 1)) * 100, 1) if total else None

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--slug", required=True)
    parser.add_argument("--aoi", required=True, help="west,south,east,north")
    parser.add_argument("--start", type=int, default=2016)
    parser.add_argument("--end", type=int, default=2024)
    parser.add_argument("--out", default="./output")
    args = parser.parse_args()

    ee.Initialize(project="postureai-495116")
    coords = list(map(float, args.aoi.split(",")))
    aoi = ee.Geometry.BBox(*coords)

    results = []
    for year in range(args.start, args.end + 1):
        print(f"Processing {year}...", end=" ", flush=True)
        img = annual_composite(aoi, year)
        if img is None:
            print("SKIPPED (no scenes)")
            continue
        row = {
            "year": year,
            "ndvi": round(mean_ndvi(img, aoi) or 0, 4),
            "water_area_km2": round(water_area_km2(img, aoi), 3),
            "built_pct": built_pct(img, aoi),
        }
        results.append(row)
        print(row)

    out_dir = os.path.join(args.out, args.slug)
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, "metrics.json")
    with open(path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\nSaved -> {path}")
