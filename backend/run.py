import sys
import os

base_dir = os.path.dirname(os.path.abspath(__file__))
vendor_dir = os.path.join(base_dir, "vendor")

if os.path.exists(vendor_dir) and vendor_dir not in sys.path:
    sys.path.insert(0, vendor_dir)
if base_dir not in sys.path:
    sys.path.insert(0, base_dir)

import uvicorn

if __name__ == "__main__":
    port_str = os.environ.get("X_ZOHO_CATALYST_LISTEN_PORT") or os.environ.get("PORT") or "8000"
    try:
        port = int(port_str)
    except ValueError:
        port = 8000
    print(f"Starting uvicorn on port {port}...", flush=True)
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
