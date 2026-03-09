from fastapi import FastAPI, Depends
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db


#----------------post---------------------------------
from app.postgreSql.synchrone.method_crud.post import postgre_sync_post_create_schema
from app.postgreSql.synchrone.method_crud.post import post_create_table_postgre_sync
from app.postgreSql.synchrone.method_crud.post import post_rename_table_postgre_sync
from app.postgreSql.synchrone.method_crud.post import post_add_columns_postgre_sync
from app.postgreSql.synchrone.method_crud.post import post_add_row_postgre_sync

#-----------------get----------------------------------
from app.postgreSql.synchrone.method_crud.get import postgre_sync_get_schema_table
from app.postgreSql.synchrone.method_crud.get import get_table_column_row_postgre_sync

#-----------------put--------------------------------------
from app.postgreSql.synchrone.method_crud.put import put_rename_columns_postgre_sync
from app.postgreSql.synchrone.method_crud.put import put_modify_value_row_postgre_sync



#---------------------views--------------------------------------
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.responses import FileResponse
from app.views import router as views_router

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

#------------------put------------------------------------------------
app.include_router(put_rename_columns_postgre_sync.router)
app.include_router(put_modify_value_row_postgre_sync.router)
#---------------------page d'accueil principal--------------
@app.get("/")
def read_root(db = Depends(postgre_sync_connect_to_db)):
    cursor = db.cursor()
    cursor.execute("SELECT 1")
    result = cursor.fetchone()[0]
    
    cursor.close()
    db.close()

    return {
        "message": "Connexion réussie avec psycopg2",
        "result": result
    }
#-----------------------------interface graphique-----------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# routes
app.include_router(views_router)
# static
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")