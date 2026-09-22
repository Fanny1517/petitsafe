import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { COULEURS } from "@/lib/constants";
import { TYPES_STRUCTURE } from "@/lib/constants";
import { PandaIcon } from "./panda-icon";
import { LIBELLES_AXES, type DossierQuinquennalData, type AxeQualite } from "@/types/qualite";

const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1e293b",
  },
  coverPage: {
    padding: 40,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Helvetica",
  },
  coverBadge: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#4338ca",
    backgroundColor: "#eef2ff",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 20,
    textTransform: "uppercase",
  },
  coverTitle: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 1.2,
  },
  coverSubtitle: {
    fontSize: 12,
    color: "#475569",
    textAlign: "center",
    marginBottom: 35,
    maxWidth: 450,
  },
  coverCard: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 16,
    width: "80%",
    marginBottom: 30,
  },
  coverInfoLine: {
    fontSize: 10,
    color: "#334155",
    marginBottom: 4,
    textAlign: "center",
  },
  coverFooter: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#94a3b8",
    borderTopWidth: 0.5,
    borderTopColor: "#cbd5e1",
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingBottom: 6,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 8,
    color: "#64748b",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 35,
    right: 35,
    textAlign: "center",
    fontSize: 8,
    color: "#94a3b8",
    borderTopWidth: 0.5,
    borderTopColor: "#e2e8f0",
    paddingTop: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: "#4f46e5",
  },
  kpiRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    padding: 8,
    alignItems: "center",
  },
  kpiValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  kpiLabel: {
    fontSize: 7.5,
    color: "#64748b",
    marginTop: 2,
    textAlign: "center",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  th: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#334155",
    textTransform: "uppercase",
  },
  td: {
    fontSize: 7.5,
    color: "#334155",
  },
  badgeConforme: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 4,
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
  },
  badgePartiel: {
    backgroundColor: "#fef9c3",
    color: "#854d0e",
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 4,
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
  },
  badgeAmeliorer: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 4,
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
  },
  badgeNonEvalue: {
    backgroundColor: "#f1f5f9",
    color: "#64748b",
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 4,
    fontSize: 6.5,
  },
  signatureBox: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    padding: 10,
    height: 75,
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
  },
});

export function PdfDossierQuinquennal({ data }: { data: DossierQuinquennalData }) {
  const typeLabel = TYPES_STRUCTURE[data.structure.type as keyof typeof TYPES_STRUCTURE] ?? data.structure.type;

  return (
    <Document>
      {/* PAGE 1 : COUVERTURE OFFICIELLE */}
      <Page size="A4" style={styles.coverPage}>
        <PandaIcon size={80} />
        <View style={{ marginTop: 25, alignItems: "center" }}>
          <Text style={styles.coverBadge}>Arrêté du 29 août 2024 • Référentiel National Qualité 2025</Text>
          <Text style={styles.coverTitle}>DOSSIER QUINQUENNAL{"\n"}D'ÉVALUATION DE LA QUALITÉ</Text>
          <Text style={styles.coverSubtitle}>
            Consolidation officielle pour la Haute Autorité de Santé (HAS), les services de la PMI et les financeurs
          </Text>
        </View>

        <View style={styles.coverCard}>
          <Text style={{ ...styles.coverInfoLine, fontFamily: "Helvetica-Bold", fontSize: 12 }}>
            {data.structure.nom}
          </Text>
          <Text style={styles.coverInfoLine}>{typeLabel}</Text>
          {data.structure.adresse && (
            <Text style={styles.coverInfoLine}>
              {data.structure.adresse}, {data.structure.code_postal} {data.structure.ville}
            </Text>
          )}
          {data.structure.numero_agrement && (
            <Text style={{ ...styles.coverInfoLine, fontFamily: "Helvetica-Bold", color: "#4338ca", marginTop: 4 }}>
              Numéro d'agrément PMI : {data.structure.numero_agrement}
            </Text>
          )}
          <Text style={{ ...styles.coverInfoLine, marginTop: 10, fontSize: 9, color: "#64748b" }}>
            Période du cycle : {data.periodeCycle}
          </Text>
          <Text style={{ ...styles.coverInfoLine, fontSize: 9, color: "#64748b" }}>
            Date de compilation : {data.dateGeneration}
          </Text>
        </View>

        <Text style={styles.coverFooter}>
          RZPan'Da • Logiciel de conformité et traçabilité pour crèches • Conforme au Référentiel National Qualité 2025
        </Text>
      </Page>

      {/* PAGE 2 : SYNTHÈSE MANAGÉRIALE ET PREUVES TERRAIN */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dossier quinquennal • {data.structure.nom}</Text>
          <Text style={styles.headerTitle}>1. Synthèse globale</Text>
        </View>

        <Text style={styles.sectionTitle}>1. Synthèse exécutive et degré de préparation</Text>

        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={{ ...styles.kpiValue, color: "#4338ca" }}>{data.completude.tauxGlobal}%</Text>
            <Text style={styles.kpiLabel}>Complétude globale</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={{ ...styles.kpiValue, color: "#059669" }}>
              {data.statsAutoEval?.scoreGlobal ?? 0}%
            </Text>
            <Text style={styles.kpiLabel}>Maturité RNQ</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={{ ...styles.kpiValue, color: "#0284c7" }}>
              {data.completude.totalReponsesFamilles}
            </Text>
            <Text style={styles.kpiLabel}>Avis familles</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={{ ...styles.kpiValue, color: "#d97706" }}>
              {data.completude.actionsPAQCount}
            </Text>
            <Text style={styles.kpiLabel}>Actions PAQ</Text>
          </View>
        </View>

        {/* Bilan par axe ministériel */}
        <Text style={{ ...styles.sectionTitle, fontSize: 11, marginTop: 12 }}>
          Résultats consolidés par axe du Référentiel National Qualité 2025
        </Text>
        <View style={{ marginBottom: 14 }}>
          {data.statsAutoEval &&
            (["ACCUEIL_SECURITE", "DEVELOPPEMENT_EVEIL", "RELATION_FAMILLES", "PILOTAGE_RISQUES"] as const).map((axe) => {
              const ax = data.statsAutoEval!.parAxe[axe];
              if (!ax) return null;
              return (
                <View
                  key={axe}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 5,
                    borderBottomWidth: 0.5,
                    borderBottomColor: "#e2e8f0",
                  }}
                >
                  <View style={{ width: "60%" }}>
                    <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#1e293b" }}>
                      {ax.label}
                    </Text>
                    <Text style={{ fontSize: 7, color: "#64748b" }}>
                      {ax.evaluesCount} / {ax.totalCriteres} critères formalisés
                    </Text>
                  </View>
                  <View style={{ width: "20%", alignItems: "center" }}>
                    <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "#4338ca" }}>
                      {ax.scoreMoyen}%
                    </Text>
                  </View>
                  <View style={{ width: "20%", alignItems: "flex-end" }}>
                    <Text style={{ fontSize: 7, color: "#059669" }}>
                      {ax.repartition.CONFORME + ax.repartition.EXEMPLAIRE} conformes
                    </Text>
                  </View>
                </View>
              );
            })}
        </View>

        {/* Intégrité des preuves terrain */}
        <Text style={{ ...styles.sectionTitle, fontSize: 11, marginTop: 10 }}>
          Traçabilité et preuves opérationnelles terrain
        </Text>
        <View style={{ backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 6, padding: 8 }}>
          <Text style={{ fontSize: 8, color: "#334155", marginBottom: 3 }}>
            • Contrôles sanitaires (HACCP) : {data.preuvesTerrain.temperaturesHaccp.totalSemaine} relevés biquotidiens archivés ({data.preuvesTerrain.temperaturesHaccp.anomaliesSemaine} anomalie(s)).
          </Text>
          <Text style={{ fontSize: 8, color: "#334155", marginBottom: 3 }}>
            • Plan de bionettoyage : {data.preuvesTerrain.nettoyage.validationsSemaine} interventions et désinfections tracées.
          </Text>
          <Text style={{ fontSize: 8, color: "#334155", marginBottom: 3 }}>
            • Protocoles médicaux : {data.preuvesTerrain.medicamentsEtPai.paisActifs} PAI en vigueur, {data.preuvesTerrain.medicamentsEtPai.administrationsSemaine} prise(s) médicamenteuse(s) cosignée(s).
          </Text>
          <Text style={{ fontSize: 8, color: "#334155" }}>
            • Ratios d'encadrement : {data.preuvesTerrain.presences.presentsAujourdhui} enfants pointés en continu sur les registres dématérialisés.
          </Text>
        </View>

        <Text style={styles.footer} fixed>
          Page 2 • RZPan'Da : Dossier quinquennal d'évaluation • {data.dateGeneration}
        </Text>
      </Page>

      {/* PAGE 3 ET 4 : TABLEAU DÉTAILLÉ DE L'AUTO-ÉVALUATION */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dossier quinquennal • {data.structure.nom}</Text>
          <Text style={styles.headerTitle}>2. Auto-évaluation des 20 critères (1/2)</Text>
        </View>

        <Text style={styles.sectionTitle}>2. Grille d'auto-évaluation continue (critères 1 à 10)</Text>

        <View style={styles.tableHeader}>
          <Text style={{ ...styles.th, width: "12%" }}>Réf</Text>
          <Text style={{ ...styles.th, width: "40%" }}>Intitulé du critère</Text>
          <Text style={{ ...styles.th, width: "20%" }}>Conformité</Text>
          <Text style={{ ...styles.th, width: "28%" }}>Constats et pistes</Text>
        </View>

        {data.criteresAvecEval.slice(0, 10).map((c) => {
          const st = c.evaluation?.statut ?? "NON_EVALUE";
          return (
            <View key={c.id} style={styles.tableRow}>
              <View style={{ width: "12%" }}>
                <Text style={{ ...styles.td, fontFamily: "Helvetica-Bold", color: "#4338ca" }}>{c.code}</Text>
              </View>
              <View style={{ width: "40%", paddingRight: 4 }}>
                <Text style={{ ...styles.td, fontFamily: "Helvetica-Bold" }}>{c.titre}</Text>
              </View>
              <View style={{ width: "20%" }}>
                <Text
                  style={
                    st === "CONFORME" || st === "EXEMPLAIRE"
                      ? styles.badgeConforme
                      : st === "PARTIELLEMENT_CONFORME"
                      ? styles.badgePartiel
                      : st === "A_AMELIORER"
                      ? styles.badgeAmeliorer
                      : styles.badgeNonEvalue
                  }
                >
                  {st === "CONFORME" || st === "EXEMPLAIRE"
                    ? "Conforme"
                    : st === "PARTIELLEMENT_CONFORME"
                    ? "Partiel"
                    : st === "A_AMELIORER"
                    ? "À améliorer"
                    : "Non évalué"}
                </Text>
              </View>
              <View style={{ width: "28%" }}>
                <Text style={{ ...styles.td, fontSize: 7, color: "#64748b" }}>
                  {c.evaluation?.observations || c.evaluation?.pistes_amelioration || "Aucun constat consigné"}
                </Text>
              </View>
            </View>
          );
        })}

        <Text style={styles.footer} fixed>
          Page 3 • RZPan'Da : Dossier quinquennal d'évaluation • {data.dateGeneration}
        </Text>
      </Page>

      {/* PAGE 4 : SUITE AUTO-ÉVALUATION (CRITÈRES 11 À 20) */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dossier quinquennal • {data.structure.nom}</Text>
          <Text style={styles.headerTitle}>2. Auto-évaluation des 20 critères (2/2)</Text>
        </View>

        <Text style={styles.sectionTitle}>2. Grille d'auto-évaluation continue (critères 11 à 20)</Text>

        <View style={styles.tableHeader}>
          <Text style={{ ...styles.th, width: "12%" }}>Réf</Text>
          <Text style={{ ...styles.th, width: "40%" }}>Intitulé du critère</Text>
          <Text style={{ ...styles.th, width: "20%" }}>Conformité</Text>
          <Text style={{ ...styles.th, width: "28%" }}>Constats et pistes</Text>
        </View>

        {data.criteresAvecEval.slice(10, 20).map((c) => {
          const st = c.evaluation?.statut ?? "NON_EVALUE";
          return (
            <View key={c.id} style={styles.tableRow}>
              <View style={{ width: "12%" }}>
                <Text style={{ ...styles.td, fontFamily: "Helvetica-Bold", color: "#4338ca" }}>{c.code}</Text>
              </View>
              <View style={{ width: "40%", paddingRight: 4 }}>
                <Text style={{ ...styles.td, fontFamily: "Helvetica-Bold" }}>{c.titre}</Text>
              </View>
              <View style={{ width: "20%" }}>
                <Text
                  style={
                    st === "CONFORME" || st === "EXEMPLAIRE"
                      ? styles.badgeConforme
                      : st === "PARTIELLEMENT_CONFORME"
                      ? styles.badgePartiel
                      : st === "A_AMELIORER"
                      ? styles.badgeAmeliorer
                      : styles.badgeNonEvalue
                  }
                >
                  {st === "CONFORME" || st === "EXEMPLAIRE"
                    ? "Conforme"
                    : st === "PARTIELLEMENT_CONFORME"
                    ? "Partiel"
                    : st === "A_AMELIORER"
                    ? "À améliorer"
                    : "Non évalué"}
                </Text>
              </View>
              <View style={{ width: "28%" }}>
                <Text style={{ ...styles.td, fontSize: 7, color: "#64748b" }}>
                  {c.evaluation?.observations || c.evaluation?.pistes_amelioration || "Aucun constat consigné"}
                </Text>
              </View>
            </View>
          );
        })}

        <Text style={styles.footer} fixed>
          Page 4 • RZPan'Da : Dossier quinquennal d'évaluation • {data.dateGeneration}
        </Text>
      </Page>

      {/* PAGE 5 : ENQUÊTES ET PLAN D'ACTION QUALITÉ (PAQ) */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dossier quinquennal • {data.structure.nom}</Text>
          <Text style={styles.headerTitle}>3. Usagers et plan d'amélioration</Text>
        </View>

        {/* Section Enquêtes */}
        <Text style={styles.sectionTitle}>3. Écoute usagers et baromètre familles</Text>
        {data.enquetesSynthese.length > 0 ? (
          <View style={{ marginBottom: 14 }}>
            {data.enquetesSynthese.map((enq) => (
              <View key={enq.id} style={{ backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 6, padding: 8, marginBottom: 8 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1e293b" }}>{enq.titre}</Text>
                  <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#059669" }}>
                    Satisfaction : {enq.tauxSatisfaction}% ({enq.totalReponses} avis)
                  </Text>
                </View>
                {enq.topVerbatims.length > 0 && (
                  <View style={{ marginTop: 4 }}>
                    <Text style={{ fontSize: 7, color: "#475569", fontStyle: "italic" }}>
                      Extraits verbatims : "{enq.topVerbatims[0]}"
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ fontSize: 8, color: "#64748b", fontStyle: "italic", marginBottom: 12 }}>
            Aucune enquête formalisée enregistrée sur ce cycle.
          </Text>
        )}

        {/* Section Plan d'Action Qualité */}
        <Text style={styles.sectionTitle}>4. Plan d'action qualité (PAQ)</Text>
        <View style={styles.tableHeader}>
          <Text style={{ ...styles.th, width: "35%" }}>Action</Text>
          <Text style={{ ...styles.th, width: "20%" }}>Responsable</Text>
          <Text style={{ ...styles.th, width: "15%" }}>Priorité</Text>
          <Text style={{ ...styles.th, width: "15%" }}>Statut</Text>
          <Text style={{ ...styles.th, width: "15%" }}>Impact</Text>
        </View>

        {data.actionsPAQ.length > 0 ? (
          data.actionsPAQ.slice(0, 7).map((act) => (
            <View key={act.id} style={styles.tableRow}>
              <View style={{ width: "35%", paddingRight: 4 }}>
                <Text style={{ ...styles.td, fontFamily: "Helvetica-Bold" }}>{act.titre}</Text>
                {act.critere && (
                  <Text style={{ fontSize: 6.5, color: "#4338ca" }}>Critère {act.critere.code}</Text>
                )}
              </View>
              <View style={{ width: "20%" }}>
                <Text style={styles.td}>{act.responsable || "Non assigné"}</Text>
              </View>
              <View style={{ width: "15%" }}>
                <Text style={styles.td}>{act.priorite}</Text>
              </View>
              <View style={{ width: "15%" }}>
                <Text style={styles.td}>{act.statut === "TERMINE" ? "Clôturé" : act.statut === "EN_COURS" ? "En cours" : "À faire"}</Text>
              </View>
              <View style={{ width: "15%" }}>
                <Text style={{ ...styles.td, fontSize: 6.5, color: "#059669" }}>
                  {act.resultat_attendu ? "Validé" : "-"}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={{ fontSize: 8, color: "#64748b", fontStyle: "italic", padding: 6 }}>
            Aucune action actuellement consignée au PAQ.
          </Text>
        )}

        {/* Visas et signatures */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ ...styles.sectionTitle, fontSize: 10, borderBottomColor: "#cbd5e1" }}>
            Visas officiels et transmission réglementaire
          </Text>
          <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
            <View style={{ ...styles.signatureBox, flex: 1 }}>
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#334155" }}>
                Visa de la direction d'établissement
              </Text>
              <Text style={{ fontSize: 7, color: "#94a3b8" }}>Date et signature :</Text>
            </View>
            <View style={{ ...styles.signatureBox, flex: 1 }}>
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#334155" }}>
                Visa du référent santé et accueil inclusif
              </Text>
              <Text style={{ fontSize: 7, color: "#94a3b8" }}>Date et signature :</Text>
            </View>
            <View style={{ ...styles.signatureBox, flex: 1 }}>
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#334155" }}>
                Organisme évaluateur externe (HAS / PMI)
              </Text>
              <Text style={{ fontSize: 7, color: "#94a3b8" }}>Date et cachet :</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer} fixed>
          Page 5 • RZPan'Da : Dossier quinquennal d'évaluation • {data.dateGeneration}
        </Text>
      </Page>
    </Document>
  );
}
