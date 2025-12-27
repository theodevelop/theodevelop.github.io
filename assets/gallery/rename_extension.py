import os

# 📁 Chemin du dossier à traiter
DOSSIER = "./"

extensions_a_renommer = (".jpeg", ".png")

for nom_fichier in os.listdir(DOSSIER):
    ancien_chemin = os.path.join(DOSSIER, nom_fichier)

    if os.path.isfile(ancien_chemin) and nom_fichier.lower().endswith(extensions_a_renommer):
        nom_sans_ext, _ = os.path.splitext(nom_fichier)
        nouveau_nom = nom_sans_ext + ".jpg"
        nouveau_chemin = os.path.join(DOSSIER, nouveau_nom)

        # Évite d’écraser un fichier existant
        if not os.path.exists(nouveau_chemin):
            os.rename(ancien_chemin, nouveau_chemin)
            print(f"✔ {nom_fichier} → {nouveau_nom}")
        else:
            print(f"⚠ {nouveau_nom} existe déjà, ignoré")
