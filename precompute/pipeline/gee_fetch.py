"""
Fetch cloud-masked annual composites for a bounding box from Google Earth Engine.
Usage (authenticate once first: earthengine authenticate):
  python gee_fetch.py --aoi "77.63,12.91,77.71,12.96" --start 2015 --end 2024 --out ./frames/bellandur
"""
import argparse, os, ee

def cloud_mask_s2(image):
    scl = image.select("SCL")
    mask = scl.neq(3).And(scl.neq(7)).And(scl.neq(8)).And(scl.neq(9)).And(scl.neq(10))
    return image.updateMask(mask)

def annual_composite(aoi, year, collection="COPERNICUS/S2_SR_HARMONIZED"):
    start = f"{year}-11-01"  # dry season start
    end   = f"{year+1}-03-31"
    col = (
        ee.ImageCollection(collection)
        .filterBounds(aoi)
        .filterDate(start, end)
        .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
        .map(cloud_mask_s2)
    )
    return col.median().clip(aoi)

def export_thumbnail(image, aoi, year, out_dir, vis_params):
    os.makedirs(out_dir, exist_ok=True)
    url = image.getThumbURL({**vis_params, "region": aoi, "dimensions": 1024, "format": "png"})
    import requests
    r = requests.get(url, timeout=60)
    r.raise_for_status()
    path = os.path.join(out_dir, f"{year}.png")
    with open(path, "wb") as f:
        f.write(r.content)
    print(f"Saved {path}")

def compute_ndvi(image):
    return image.normalizedDifference(["B8", "B4"]).rename("NDVI")

def compute_ndwi(image):
    return image.normalizedDifference(["B3", "B8"]).rename("NDWI")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--aoi", required=True, help="west,south,east,north")
    parser.add_argument("--start", type=int, required=True)
    parser.add_argument("--end", type=int, required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    ee.Initialize(project="YOUR_GEE_PROJECT_ID")
    coords = list(map(float, args.aoi.split(",")))
    aoi = ee.Geometry.BBox(*coords)

    vis = {"min": 0, "max": 3000, "bands": ["B4", "B3", "B2"]}
    for year in range(args.start, args.end + 1):
        img = annual_composite(aoi, year)
        export_thumbnail(img, aoi, year, args.out, vis)
