// Démarrage du serveur Next.js : migrations de la base, puis purge quotidienne des données arrivées au terme de
// leur durée de conservation. Sans DATABASE_URL, rien ne se passe (le site fonctionne sans base).
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || !process.env.DATABASE_URL) return;
  const { runMigrations, purgeExpiredData } = await import("./lib/db/maintenance");
  try {
    await runMigrations();
    console.info("[db] Migrations à jour.");
  } catch (error) {
    // Sans base à jour, le questionnaire renverrait des erreurs : on l'indique clairement dans les journaux.
    console.error("[db] Échec des migrations :", error);
    return;
  }
  const purge = () => purgeExpiredData().catch((error) => console.error("[db] Échec de la purge :", error));
  void purge();
  setInterval(purge, 24 * 60 * 60 * 1000).unref();
}
