# middleware/check_access_token_cookie.py

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse


class AccessTokenCookieMiddleware(BaseHTTPMiddleware):
    """
    Middleware qui protège uniquement les routes /admin
    en vérifiant que les cookies access_token, refresh_token et user_id existent.
    """

    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        # 🔹 1. Ne protège QUE les routes /admin
        if not path.startswith("/admin"):
            return await call_next(request)

        # 🔹 2. Exceptions autorisées (routes publiques dans /admin)
        admin_public_routes = [
            "/admin/login/sigin/creation/add/password/postgresql/sync/interface/views",
        ]

        if path in admin_public_routes:
            return await call_next(request)

        # 🔹 3. Vérification des cookies
        access_token = request.cookies.get("access_token")
        refresh_token = request.cookies.get("refresh_token")
        user_id = request.cookies.get("user_id")

        if not access_token or not refresh_token or not user_id:
            return JSONResponse(
                {"detail": "Token ou user_id manquant (blacklist implicite)"},
                status_code=401
            )

        # 🔹 4. Vérification du type de user_id
        try:
            int(user_id)
        except ValueError:
            return JSONResponse(
                {"detail": "user_id invalide"},
                status_code=401
            )

        # ✅ Tous les cookies présents → continuer
        return await call_next(request)