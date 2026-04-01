from fastapi import FastAPI, Depends, Response, Request
#--------------------automatisation de tache-------------------------------
from apscheduler.schedulers.background import BackgroundScheduler
from app.postgreSql.cron_job import cron_db_api_key
#----------------post---------------------------------
from app.postgreSql.synchrone.method_crud.post import postgre_sync_post_create_schema
from app.postgreSql.synchrone.method_crud.post import post_create_table_postgre_sync
from app.postgreSql.synchrone.method_crud.post import post_rename_table_postgre_sync
from app.postgreSql.synchrone.method_crud.post import post_add_columns_postgre_sync
from app.postgreSql.synchrone.method_crud.post import post_add_row_postgre_sync

#-----------------get----------------------------------
from app.postgreSql.synchrone.method_crud.get import postgre_sync_get_schema_table
from app.postgreSql.synchrone.method_crud.get import get_table_column_row_postgre_sync
from app.postgreSql.synchrone.method_crud.get import get_global_bonjour

#-----------------put--------------------------------------
from app.postgreSql.synchrone.method_crud.put import put_rename_columns_postgre_sync
from app.postgreSql.synchrone.method_crud.put import put_modify_value_row_postgre_sync
from app.postgreSql.synchrone.method_crud.put import put_rename_schema_postgre_sync
#----------delete-----------------------------------------
from app.postgreSql.synchrone.method_crud.delete import delete_table_postgre_sync
from app.postgreSql.synchrone.method_crud.delete import delete_columns_postgre_sync
from app.postgreSql.synchrone.method_crud.delete import delete_row_id_postgre_sync
#---------------------views--------------------------------------
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.responses import FileResponse
from app.postgreSql.views.method_crud import views_method_crud
from app.postgreSql.views.login_signin_signup import views_login_signin_signup
from app.postgreSql.views.profile import views_profile_postgre

#-----------------login-----------------------------------
from app.postgreSql.synchrone.action_login_signin_signup import init_db_postgre_sync_login
from app.postgreSql.synchrone.action_login_signin_signup import create_log_postgre_sync
from app.postgreSql.synchrone.action_login_signin_signup import action_verif_log_postgre_sync
#------------------logout--------------------------------------
from app.postgreSql.synchrone.action_log_out import create_db_access_token_postgre
from app.postgreSql.synchrone.action_log_out import action_log_out
#------------------protection--------------------------------------
#middleware
from fastapi.middleware.cors import CORSMiddleware
from app.postgreSql.protection_secure.middleware.middlewareBlacklistLogout import AccessTokenCookieMiddleware
#block cache html 
from app.postgreSql.protection_secure.middleware.blockCacheHtml import NoCacheHTMLMiddleware
#refresh token
from app.postgreSql.protection_secure.refresh_token import endpoint_refresh_token
#api key
from app.postgreSql.protection_secure.api_key import action_create_db_key_api
from app.postgreSql.protection_secure.api_key import action_create_api_key

app = FastAPI()



#-----------------------post--------------------------------------------
app.include_router(postgre_sync_post_create_schema.router)
app.include_router(post_create_table_postgre_sync.router)
app.include_router(post_rename_table_postgre_sync.router)
app.include_router(post_add_columns_postgre_sync.router)
app.include_router(post_add_row_postgre_sync.router)


#--------------------get---------------------------------------------------
app.include_router(postgre_sync_get_schema_table.router)
app.include_router(get_table_column_row_postgre_sync.router)
app.include_router(get_global_bonjour.router)

#------------------put------------------------------------------------
app.include_router(put_rename_columns_postgre_sync.router)
app.include_router(put_modify_value_row_postgre_sync.router)
app.include_router(put_rename_schema_postgre_sync.router)
#-----------------delete-----------------------------
app.include_router(delete_table_postgre_sync.router)
app.include_router(delete_columns_postgre_sync.router)
app.include_router(delete_row_id_postgre_sync.router)

#-----------------------------interface graphique et fichier statics-----------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# routes
app.include_router(views_method_crud.router)
app.include_router(views_login_signin_signup.router)
app.include_router(views_profile_postgre.router)
# static
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")

#------------------------login , sign in, log out------------------------------
app.include_router(create_log_postgre_sync.router)
app.include_router(init_db_postgre_sync_login.router)
app.include_router(action_verif_log_postgre_sync.router)
app.include_router(action_log_out.router)

# 🔹 Exécution automatique au démarrage
@app.on_event("startup")
def startup():
    init_db_postgre_sync_login.init_db_if_not_exist()
    

# 🔹 Exécution automatique au démarrage
@app.on_event("startup")
def startup():
    create_db_access_token_postgre.endpoint_table_accesstoken_if_not_exist()

@app.on_event("startup")
def startup():
    action_create_db_key_api.endpoint_create_db_key_api_if_not_exist()

#------------------------------- protection -------------------------
#refresh token
app.include_router(endpoint_refresh_token.router)
# ⚡ Middleware CORS pour autoriser le front
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # remplacer par ton front si besoin, ex: ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(NoCacheHTMLMiddleware)
app.add_middleware(AccessTokenCookieMiddleware)
#api key
app.include_router(action_create_db_key_api.router)
@app.on_event("startup")
def startup():
    print("🚀 Initialisation DB access token...")
    result = action_create_db_key_api.endpoint_create_db_key_api_if_not_exist()
    print(result)
app.include_router(action_create_api_key.router)



@app.on_event("startup")
async def clear_http_only_cookies():
    """
    Supprime tous les cookies HTTP-only sensibles
    (access_token, refresh_token, user_id) au démarrage du serveur.
    """
    # Création d'une réponse temporaire pour effacer les cookies
    response = Response()
    
    # Liste des cookies sensibles
    cookies_to_clear = ["access_token", "refresh_token", "user_id"]
    
    for cookie_name in cookies_to_clear:
        response.delete_cookie(cookie_name, path="/", httponly=True)
    
    # Optionnel : log pour confirmation
    print(f"Cookies HTTP-only supprimés : {', '.join(cookies_to_clear)}")



@app.middleware("http")
async def clear_admin_cookies(request: Request, call_next):
    response = await call_next(request)
    
    # Vérifie si l'URL commence par /admin
    if request.url.path.startswith("/admin"):
        cookies_to_clear = ["access_token", "refresh_token", "user_id"]
        for cookie_name in cookies_to_clear:
            response.delete_cookie(cookie_name, path="/admin", httponly=True)
        print(f"Cookies supprimés pour /admin : {', '.join(cookies_to_clear)}")
    
    return response
#--------------------automatisation de tache-------------------------------

# 🔹 Scheduler en arrière-plan
scheduler = BackgroundScheduler()


@app.on_event("startup")
def start_scheduler():
    scheduler.add_job(cron_db_api_key.main, 'interval', minutes=3)
    scheduler.start()
    print("Scheduler démarré, cron_db_api_key s'exécutera toutes les 3 minutes")


