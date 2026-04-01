# cron_db_api_key.py
"""
Script cron pour gérer les clés API :
1. Désactive les clés expirées
2. Supprime les clés inactives
3. Crée ou régénère les clés API pour les utilisateurs concernés
"""

from app.postgreSql.synchrone.request.request_create_api_key_db import (
    check_and_create_api_keys,
    turn_is_active_false,
    refresh_inactive_api_keys,
    delete_api_key
)
from app.postgreSql.synchrone.connexion_db.Postgre_sync_web import postgre_sync_connect_to_db

def main():
    # 🔹 Connexion à la base PostgreSQL
    conn = postgre_sync_connect_to_db()
    cur = conn.cursor()
    print("db ouvert")
    try:
        #  Crée ou régénère les clés API pour les utilisateurs sans clé
        check_and_create_api_keys(cur, conn)
        print("Crée ou régénère les clés API pour les utilisateurs sans clé")
        # 🔹  Désactive les clés API expirées
        turn_is_active_false(cur, conn)
        print("Désactive les clés API expirées")
        # 🔹  Régénère les clés API pour les utilisateurs dont is_active = FALSE
        refresh_inactive_api_keys(cur, conn)
        print("Régénère les clés API pour les utilisateurs dont is_active = FALSE")
        # 🔹  Supprime toutes les clés API inactives
        delete_api_key(cur, conn)
        print("supprime les clés api invalide")


    except Exception as e:
        print("Erreur lors de l'exécution du cron :", e)
    finally:
        cur.close()
        conn.close()
        print("Cron terminé avec succès.")

if __name__ == "__main__":
    main()