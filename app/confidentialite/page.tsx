import { DottedLink } from "@/components/motion/dotted-link";
import { LegalSection } from "@/components/page/legal-section";
import { PageHeader } from "@/components/page/page-header";
import { SITE, emailHref, pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Politique de confidentialité",
  description:
    "Quelles données le site Yonko Tech Consulting collecte, pourquoi, combien de temps elles sont conservées et comment exercer vos droits.",
  path: "/confidentialite",
});

// Politique de confidentialité : décrit le fonctionnement réel du site (formulaire transmis par webhook, aucun
// cookie de suivi, mémorisation locale de l'intro du hero). À mettre à jour si un outil d'audience est ajouté.
export default function PrivacyPage() {
  const mail = (
    <DottedLink href={emailHref() ?? "/contact"} className="text-silver-light">
      {SITE.email || "le formulaire de contact"}
    </DottedLink>
  );

  return (
    <div>
      <PageHeader
        eyebrow="Informations légales"
        title="Politique de confidentialité"
        lead={<p>Ce que nous collectons, pourquoi, et vos droits. Dernière mise à jour : octobre 2026.</p>}
      />

      <div className="container max-w-3xl space-y-14 pb-24 pt-8 md:pb-32">
        <LegalSection title="Responsable du traitement">
          <p>
            {SITE.name}, {SITE.address.addressLocality}, Madagascar. Contact : {mail}.
          </p>
        </LegalSection>

        <LegalSection title="Données collectées">
          <p>
            Uniquement les informations que vous saisissez dans le formulaire de contact : nom, société (facultative),
            adresse e-mail, sujet et message. Le site ne demande la création d&apos;aucun compte.
          </p>
        </LegalSection>

        <LegalSection title="Pourquoi">
          <p>
            Pour répondre à votre demande et, si vous le souhaitez, assurer le suivi de votre projet. Ces données ne
            sont ni vendues, ni louées, ni utilisées pour de la prospection sans votre accord.
          </p>
        </LegalSection>

        <LegalSection title="Destinataires">
          <p>
            Les demandes sont réservées à {SITE.name}. Elles transitent par un service d&apos;automatisation et une
            messagerie électronique [À COMPLÉTER : nom du service d&apos;automatisation et de la messagerie], qui agissent pour
            notre compte.
          </p>
        </LegalSection>

        <LegalSection title="Protection contre les robots">
          <p>
            Le formulaire peut être protégé par Cloudflare Turnstile, qui vérifie qu&apos;il est envoyé par une personne.
            Ce service analyse des signaux techniques du navigateur au moment de l&apos;envoi, ne sert pas à la
            publicité et ne dépose pas de cookie de suivi (voir la politique de confidentialité de Cloudflare).
          </p>
        </LegalSection>

        <LegalSection title="Durée de conservation">
          <p>
            Le temps nécessaire au traitement de votre demande et au suivi de la relation, puis trois ans au plus après
            notre dernier échange.
          </p>
        </LegalSection>

        <LegalSection title="Cookies et mesure d'audience">
          <p>
            Le site n&apos;utilise aucun cookie publicitaire ni outil de mesure d&apos;audience. Il mémorise seulement,
            dans votre navigateur et le temps de la session, que l&apos;animation d&apos;introduction a déjà été vue,
            pour ne pas la rejouer. Cette information ne vous identifie pas.
          </p>
        </LegalSection>

        <LegalSection title="Sécurité">
          <p>
            Les échanges avec le site sont chiffrés (HTTPS) et l&apos;accès aux demandes reçues est limité aux
            personnes qui les traitent.
          </p>
        </LegalSection>

        <LegalSection title="Vos droits">
          <p>
            Vous pouvez demander l&apos;accès à vos données, leur rectification ou leur suppression, et vous opposer à
            leur utilisation, en nous écrivant via {mail}. Nous répondons sous 24h, et traitons la demande dans les meilleurs
            délais.
          </p>
          <p>
            Ces droits s&apos;exercent dans le cadre de la loi malgache n° 2014-038 sur la protection des données à
            caractère personnel et, pour les personnes situées dans l&apos;Union européenne, du RGPD.
          </p>
        </LegalSection>
      </div>
    </div>
  );
}
