from fastapi import FastAPI, Depends
from app.postgreSql.connexion_db.db_PostgreSql_web import connect_to_db

#----------------post---------------------------------
from app.postgreSql.method_curd.post import create_schema
from app.postgreSql.method_curd.post import post_create_table
from app.postgreSql.method_curd.post import post_rename_table
from app.postgreSql.method_curd.post import post_add_columns
from app.postgreSql.method_curd.post import post_add_row

#-----------------get----------------------------------
from app.postgreSql.method_curd.get import get_list_schema_table
from app.postgreSql.method_curd.get import get_table_column_row

#-----------------put--------------------------------------
from app.postgreSql.method_curd.put import put_rename_columns

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
app.include_router(create_schema.router)
app.include_router(post_create_table.router)
app.include_router(post_rename_table.router)
app.include_router(post_add_columns.router)
app.include_router(post_add_row.router)


#--------------------get---------------------------------------------------
app.include_router(get_list_schema_table.router)
app.include_router(get_table_column_row.router)

#------------------put------------------------------------------------
app.include_router(put_rename_columns.router)

#-----------------------------interface graphique-----------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# static
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")

# routes
app.include_router(views_router)



#---------------------page d'accueil principal--------------
@app.get("/")
def read_root(db = Depends(connect_to_db)):
    cursor = db.cursor()
    cursor.execute("SELECT 1")
    result = cursor.fetchone()[0]
    
    cursor.close()
    db.close()

    return {
        "message": "Connexion réussie avec psycopg2",
        "result": result
    }
