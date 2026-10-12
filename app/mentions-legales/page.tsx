import { DottedLink } from "@/components/motion/dotted-link";
import { LegalSection } from "@/components/page/legal-section";
import { PageHeader } from "@/components/page/page-header";
import { SITE, pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Mentions légales",
  description: "Mentions légales du site Yonko Tech Consulting : éditeur, hébergement, propriété intellectuelle et crédits.",
  path: "/mentions-legales",
});

// Mentions légales. Les identifiants de l'entreprise et l'hébergeur sont à compléter avant la mise en ligne.
export default function LegalNoticePage() {
  return (
    <div>
      <PageHeader eyebrow="Informations légales" title="Mentions légales" lead={<p>Dernière mise à jour : octobre 2026.</p>} />

      <div className="container max-w-3xl space-y-14 pb-24 pt-8 md:pb-32">
        <LegalSection title="Éditeur du site">
          <p>
            {SITE.name}, [à remplacer : forme juridique], dont le siège est situé à {SITE.address.addressLocality},
            Madagascar.
          </p>
          <p>NIF : [à remplacer] · STAT : [à remplacer] · RCS : [à remplacer]</p>
          <p>
            Contact :{" "}
            <DottedLink href={`mailto:${SITE.email}`} className="text-silver-light">
              {SITE.email}
            </DottedLink>
          </p>
          <p>Directeur de la publication : [à remplacer : nom et qualité].</p>
        </LegalSection>

        <LegalSection title="Hébergement">
          <p>[à remplacer : nom, adresse et contact de l&apos;hébergeur, connus à la mise en ligne].</p>
        </LegalSection>

        <LegalSection title="Propriété intellectuelle">
          <p>
            Les textes, visuels, vidéos, logos et éléments graphiques de ce site sont la propriété de {SITE.name}, sauf
            mention contraire. Toute reproduction, totale ou partielle, sans autorisation écrite préalable est
            interdite.
          </p>
          <p>
            Les cas d&apos;usage présentés décrivent des situations types : ils ne désignent pas des clients nommés.
          </p>
        </LegalSection>

        <LegalSection title="Responsabilité">
          <p>
            Les informations publiées sur ce site sont fournies à titre indicatif et peuvent évoluer. {SITE.name} ne
            saurait être tenue responsable du contenu des sites tiers vers lesquels des liens peuvent renvoyer.
          </p>
        </LegalSection>

        <LegalSection title="Données personnelles">
          <p>
            Le traitement des informations envoyées par le formulaire de contact est décrit dans la{" "}
            <DottedLink href="/confidentialite" className="text-silver-light">
              politique de confidentialité
            </DottedLink>
            .
          </p>
        </LegalSection>

        <LegalSection title="Crédits">
          <p>Polices Instrument Serif et Inter Tight, distribuées sous licence SIL Open Font License.</p>
        </LegalSection>
      </div>
    </div>
  );
}
