# blockCacheHtml.py

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import HTMLResponse, RedirectResponse
from fastapi import HTTPException, status
from app.postgreSql.protection_secure.token_JWT.verify_access_token import verify_access_token

class NoCacheHTMLMiddleware(BaseHTTPMiddleware):
    """
    Middleware FastAPI pour interdire le cache des pages HTML.
    Ajoute automatiquement les headers Cache-Control, Pragma et Expires.
    """

    async def dispatch(self, request, call_next):
        

        response = await call_next(request)
        # 🔹 Appliquer seulement aux réponses HTML
        if isinstance(response, HTMLResponse):
            response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"

        return response
