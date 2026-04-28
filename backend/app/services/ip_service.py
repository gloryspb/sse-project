from fastapi import Request


def extract_public_ip(request: Request) -> dict[str, str | None]:
    forwarded_for = request.headers.get("x-forwarded-for")
    real_ip = request.headers.get("x-real-ip")

    ip = None
    if forwarded_for:
        ip = forwarded_for.split(",")[0].strip()
    elif real_ip:
        ip = real_ip.strip()
    elif request.client:
        ip = request.client.host

    return {
        "ip": ip or "unknown",
        "forwarded_for": forwarded_for,
        "real_ip": real_ip,
    }
