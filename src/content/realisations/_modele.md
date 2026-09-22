---
# MODÈLE DE RÉALISATION (ignoré par le site grâce au « _ » initial)
# 1. Copier ce fichier dans ce dossier et le renommer sans le « _ » initial,
#    par exemple 2026-10-tableau-amboise.md : le nom du fichier sert d'identifiant.
# 2. Placer les photos dans src/assets/realisations/ (JPG ou PNG, 1600 px de large idéalement).
# 3. Remplir les champs ci-dessous, puis vérifier avec `npm run build`.
titre: Remplacement d'un tableau électrique
ville: Amboise
date: 2026-10-01 # format AAAA-MM-JJ
service: tableau-electrique # nom d'un fichier de src/content/services/, sans « .md »
couverture: # photo principale, affichée sur les cartes
  src: ../../assets/realisations/amboise-tableau-apres.jpg # chemin relatif à ce fichier
  alt: Nouveau tableau électrique avec ses circuits repérés # description de la photo
photos: # facultatif : photos supplémentaires, dans l'ordre d'affichage
  - src: ../../assets/realisations/amboise-tableau-avant.jpg
    alt: Ancien tableau à fusibles avant les travaux
exemple: false # true uniquement pour un chantier fictif de démonstration
---
