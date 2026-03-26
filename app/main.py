from fastapi import FastAPI, Depends
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
#-----------------login-----------------------------------
from app.postgreSql.synchrone.action_login_signin_signup import init_db_postgre_sync_login
from app.postgreSql.synchrone.action_login_signin_signup import create_log_postgre_sync

#------------------protection--------------------------------------
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ⚡ Middleware CORS pour autoriser le front
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # remplacer par ton front si besoin, ex: ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# static
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")

#------------------------login , sign in------------------------------
app.include_router(create_log_postgre_sync.router)
app.include_router(init_db_postgre_sync_login.router)

# 🔹 Exécution automatique au démarrage
@app.on_event("startup")
def startup():
    print("🚀 Initialisation DB login...")
    result = init_db_postgre_sync_login.init_db_if_not_exist()
    print(result)