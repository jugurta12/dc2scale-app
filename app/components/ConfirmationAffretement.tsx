import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 8,
    padding: 30,
    color: "#000",
    backgroundColor: "#fff",
  },
  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "column",
    gap: 4,
  },
  headerRight: {
    fontSize: 8,
    textAlign: "right",
    color: "#333",
  },
  logoText: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#1a6b3a",
  },
  fmTo: {
    flexDirection: "row",
    gap: 4,
    marginTop: 6,
  },
  fmToLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    width: 20,
  },
  fmToValue: {
    fontSize: 9,
  },
  // TITRE
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginBottom: 12,
    marginTop: 4,
  },
  // TABLEAU PRINCIPAL
  mainTable: {
    border: "1pt solid #000",
    marginBottom: 0,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1pt solid #000",
  },
  tableRowLast: {
    flexDirection: "row",
  },
  // Cellules du tableau principal
  cellLegal: {
    width: "38%",
    borderRight: "1pt solid #000",
    padding: 5,
    fontSize: 6.5,
    lineHeight: 1.4,
  },
  cellMiddle: {
    width: "38%",
    borderRight: "1pt solid #000",
    padding: 5,
  },
  cellRight: {
    width: "24%",
    padding: 5,
  },
  cellHeader: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    marginBottom: 4,
  },
  cellValue: {
    fontSize: 8,
    marginBottom: 2,
  },
  cellValueBold: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    marginBottom: 2,
  },
  // TABLEAU DÉTAIL EXPÉDITION
  detailTable: {
    border: "1pt solid #000",
    borderTop: "0pt",
    marginBottom: 0,
  },
  detailHeader: {
    backgroundColor: "#f0f0f0",
    padding: 4,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    borderBottom: "1pt solid #000",
  },
  detailRow: {
    flexDirection: "row",
    borderBottom: "1pt solid #000",
  },
  detailCellDesc: {
    flex: 1,
    padding: 4,
    borderRight: "1pt solid #000",
    fontSize: 8,
  },
  detailCellPoids: {
    width: 60,
    padding: 4,
    borderRight: "1pt solid #000",
    fontSize: 8,
  },
  detailCellDim: {
    width: 60,
    padding: 4,
    fontSize: 8,
  },
  // TABLEAU PRIX
  prixTable: {
    border: "1pt solid #000",
    borderTop: "0pt",
    marginBottom: 8,
  },
  prixHeader: {
    backgroundColor: "#f0f0f0",
    padding: 4,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    borderBottom: "1pt solid #000",
  },
  prixRow: {
    flexDirection: "row",
  },
  prixCellLabel: {
    flex: 1,
    padding: 4,
    borderRight: "1pt solid #000",
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
  },
  prixCellValeur: {
    width: 60,
    padding: 4,
    borderRight: "1pt solid #000",
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    textAlign: "right",
  },
  prixCellDevise: {
    width: 40,
    padding: 4,
    borderRight: "1pt solid #000",
    fontSize: 8,
    textAlign: "center",
  },
  prixCellTva: {
    width: 30,
    padding: 4,
    fontSize: 8,
    textAlign: "center",
  },
  // FOOTER
  footer: {
    marginTop: 4,
    fontSize: 6.5,
    color: "#333",
    lineHeight: 1.5,
  },
  footerBold: {
    fontFamily: "Helvetica-Bold",
  },
  divider: {
    borderBottom: "1pt solid #ccc",
    marginVertical: 8,
  },
})

interface AffretementData {
  reference: string
  // FM / TO
  fmNom: string
  fmAdresse: string
  toNom: string
  // Expéditeur
  expediteurNom: string
  expediteurContact: string
  dateEnlevement: string
  // Destinataire
  destinataireNom: string
  destinataireContact: string
  dateLivraison: string
  // Détail
  descriptionTransport: string
  poids: string
  dimensions: string
  // Prix
  tarification: string
}

const MENTIONS_LEGALES = `Les instructions de ce document doivent être suivies dans le strict respect de la réglementation sociale (Temps de conduite et de repos) et de la réglementation routière (limitation de vitesse). L'acceptation de ce contrat de transport implique l'engagement des moyens nécessaires à sa bonne exécution. En cas de litige, seul le tribunal situé le plus près de notre siège social sera compétent.

Conformément à la loi n° 96-603 du 5/07/96 article 23/1 le prix mentionné est accepté sans réserve par le transporteur qui reconnaît implicitement que ce prix lui permet de couvrir l'intégralité des charges, y compris une éventuelle surtaxe pour le gazole. Le transporteur certifie avoir souscrit une assurance tant en responsabilité civile et professionnelle que contractuelle, et être inscrit au registre des transporteurs.

Dans le cas où les instructions inscrites dans le présent contrat ne correspondent pas à celles chargées effectivement, le transporteur doit immédiatement informer de cette variation, par tous moyens à sa convenance, l'OT.

En cas d'arrêt du véhicule, ce dernier devra impérativement stationner dans un lieu sous surveillance et sécurisé, votre responsabilité étant directement engagée.`

export function ConfirmationAffretementPDF({ data }: { data: AffretementData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logoText}>CIRCULAR{"\n"}DATACENTER</Text>
            <View style={{ marginTop: 10 }}>
              <View style={styles.fmTo}>
                <Text style={styles.fmToLabel}>FM :</Text>
                <Text style={styles.fmToValue}>{data.fmNom}</Text>
              </View>
              <View style={styles.fmTo}>
                <Text style={styles.fmToLabel}>TO :</Text>
                <Text style={styles.fmToValue}>{data.toNom}</Text>
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.headerRight}>{data.fmAdresse}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* TITRE */}
        <Text style={styles.title}>Confirmation d'affrètement N° {data.reference}</Text>

        {/* TABLEAU PRINCIPAL */}
        <View style={styles.mainTable}>

          {/* Ligne 1 headers */}
          <View style={styles.tableRow}>
            <View style={styles.cellLegal}>
              <Text style={styles.cellHeader}>Réaffrètement interdit</Text>
            </View>
            <View style={styles.cellMiddle}>
              <Text style={styles.cellHeader}>Expéditeur / Shipper / Ladestelle</Text>
            </View>
            <View style={styles.cellRight}>
              <Text style={styles.cellHeader}>Enlèvement le :</Text>
            </View>
          </View>

          {/* Ligne 2 — mentions légales + expéditeur + date enlèvement */}
          <View style={styles.tableRow}>
            <View style={styles.cellLegal}>
              <Text>{MENTIONS_LEGALES}</Text>
            </View>
            <View style={styles.cellMiddle}>
              <Text style={styles.cellValueBold}>{data.expediteurNom}</Text>
              <Text style={{ fontSize: 6.5, marginTop: 60, color: "#333" }}>{data.expediteurContact}</Text>
            </View>
            <View style={styles.cellRight}>
              <Text style={styles.cellValue}>{data.dateEnlevement}</Text>
            </View>
          </View>

          {/* Ligne 3 — headers destinataire */}
          <View style={styles.tableRow}>
            <View style={[styles.cellLegal, { borderRight: "0pt" }]} />
            <View style={styles.cellMiddle}>
              <Text style={styles.cellHeader}>Destinataire / Consignee / Empfänger</Text>
            </View>
            <View style={styles.cellRight}>
              <Text style={styles.cellHeader}>Livraison le :</Text>
            </View>
          </View>

          {/* Ligne 4 — destinataire + date livraison */}
          <View style={styles.tableRowLast}>
            <View style={[styles.cellLegal, { borderRight: "0pt" }]} />
            <View style={styles.cellMiddle}>
              <Text style={styles.cellValueBold}>{data.destinataireNom}</Text>
              <Text style={{ fontSize: 6.5, marginTop: 20, color: "#333" }}>{data.destinataireContact}</Text>
            </View>
            <View style={styles.cellRight}>
              <Text style={styles.cellValue}>{data.dateLivraison}</Text>
            </View>
          </View>

        </View>

        {/* TABLEAU DÉTAIL EXPÉDITION */}
        <View style={styles.detailTable}>
          <Text style={styles.detailHeader}>
            Détail expédition – Detail of Shipment – Sendung
          </Text>
          <View style={styles.detailRow}>
            <View style={styles.detailCellDesc}>
              <Text>{data.descriptionTransport || "—"}</Text>
            </View>
            <View style={styles.detailCellPoids}>
              <Text>{data.poids || "—"}</Text>
            </View>
            <View style={styles.detailCellDim}>
              <Text>{data.dimensions || "—"}</Text>
            </View>
          </View>
        </View>

        {/* TABLEAU PRIX */}
        <View style={styles.prixTable}>
          <Text style={styles.prixHeader}>
            Prix de gré à gré incluant l'indexation gazole – price agreed
          </Text>
          <View style={styles.prixRow}>
            <View style={styles.prixCellLabel}>
              <Text>PRIX PAR TRAJET</Text>
            </View>
            <View style={styles.prixCellValeur}>
              <Text>{data.tarification ? `${data.tarification}€` : "—"}</Text>
            </View>
            <View style={styles.prixCellDevise}>
              <Text>EUR</Text>
            </View>
            <View style={styles.prixCellTva}>
              <Text>HT</Text>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text>
            <Text style={styles.footerBold}>ATTENTION : </Text>
            Toute facture non accompagnée des preuves de livraison (bon ou cmr émargés...) ne pourra vous être réglée.
          </Text>
          <Text>Facture à transmettre par email à l'adresse : facturation@dc2scale.fr</Text>
          <Text>Règlement : VIREMENT A 45 J FDM. Merci de nous faire parvenir votre RIB</Text>
        </View>

      </Page>
    </Document>
  )
}