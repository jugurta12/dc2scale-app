import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"

const teal = "#10b981"
const dark = "#111827"
const gray = "#6b7280"

const styles = StyleSheet.create({
    bold: { fontFamily: "Helvetica-Bold" },
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 9, color: dark },
  
  // HEADER
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  logo: { width: 120, height: 40 },
  headerInfo: { textAlign: "right" },
  title: { fontSize: 20, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  refText: { fontSize: 10, color: gray },

  // ADRESSES
  addresses: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  addressBox: { width: "45%" },
  addressTitle: { fontSize: 8, color: gray, textTransform: "uppercase", marginBottom: 4, borderBottomWidth: 1, borderBottomColor: "#eee", pb: 2 },
  companyName: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 2 },

  // TABLE STYLES
  table: { marginTop: 10, marginBottom: 20 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f9fafb", borderBottomWidth: 1, borderBottomColor: "#e5e7eb", paddingVertical: 6 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#f3f4f6", paddingVertical: 8, alignItems: 'flex-start' },
  colDesc: { flex: 3, paddingLeft: 4 },
  colQty: { flex: 0.5, textAlign: "center" },
  colPrice: { flex: 1, textAlign: "right" },
  colTva: { flex: 0.5, textAlign: "center" },
  colTotal: { flex: 1, textAlign: "right", paddingRight: 4 },
  
  sectionLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: teal, marginTop: 15, marginBottom: 5, textTransform: "uppercase" },
  itemTitle: { fontFamily: "Helvetica-Bold", marginBottom: 2 },
  itemDetails: { fontSize: 8, color: gray, lineHeight: 1.4 },

  // TOTALS & PAYMENT
  footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 30 },
  paymentBox: { width: "60%", backgroundColor: "#f9fafb", padding: 10, borderRadius: 4 },
  summaryBox: { width: "35%" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4, paddingVertical: 2 },
  totalRow: { borderTopWidth: 1, borderTopColor: teal, marginTop: 4, pt: 6 },
  
  ibanText: { fontSize: 8, marginTop: 4, color: "#374151" },
  legalText: { fontSize: 7, color: gray, marginTop: 40, textAlign: "center", lineHeight: 1.4 }
})


export function QuotePDF({ data }: any) {
  // Calculs totaux
  const mrcHT = data.mrcItems.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice), 0);
  const nrcHT = data.nrcItems.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice), 0);
  const currentTvaRate = data.mrcItems[0]?.tvaRate || 20;
  const totalHT = mrcHT + nrcHT;
  const totalTVA = totalHT * (currentTvaRate / 100);
  const totalTTC = totalHT + totalTVA;

  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.colDesc, { fontFamily: "Helvetica-Bold" }]}>Produits</Text>
      <Text style={[styles.colQty, { fontFamily: "Helvetica-Bold" }]}>Qté</Text>
      <Text style={[styles.colPrice, { fontFamily: "Helvetica-Bold" }]}>Prix u. HT</Text>
      <Text style={[styles.colTva, { fontFamily: "Helvetica-Bold" }]}>TVA</Text>
      <Text style={[styles.colTotal, { fontFamily: "Helvetica-Bold" }]}>Total HT</Text>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Image style={styles.logo} src="/assets/Datacenters.png" />
          <View style={styles.headerInfo}>
            <Text style={styles.title}>Devis</Text>
            <Text style={styles.refText}>N° {data.reference}</Text>
            <Text style={styles.refText}>Date: {new Date().toLocaleDateString('fr-FR')}</Text>
          </View>
        </View>

        {/* ADRESSES */}
        <View style={styles.addresses}>
          <View style={styles.addressBox}>
            <Text style={styles.addressTitle}>Émetteur</Text>
            <Text style={styles.companyName}>DC2SCALE</Text>
            <Text>128 Rue La Boétie</Text>
            <Text>75008 Paris - France</Text>
            <Text>admin@dc2scale.fr</Text>
          </View>
          <View style={styles.addressBox}>
            <Text style={styles.addressTitle}>Client</Text>
            <Text style={styles.companyName}>{data.client.nom}</Text>
            <Text>{data.client.adresse}</Text>
            <Text>{data.client.mail}</Text>
            <Text>{data.client.tva ? `N° TVA: ${data.client.tva}` : ""}</Text>
          </View>
        </View>

        {/* SECTION MRC */}
        {data.mrcItems.length > 0 && (
          <View style={styles.table}>
            <Text style={styles.sectionLabel}>Récurrent mensuel (MRC)</Text>
            <TableHeader />
            {data.mrcItems.map((item: any, i: number) => (
              <View key={i} style={styles.tableRow}>
                <View style={styles.colDesc}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemDetails}>{item.description}</Text>
                </View>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colPrice}>{parseFloat(item.unitPrice).toFixed(2)} €</Text>
                <Text style={styles.colTva}>{currentTvaRate}%</Text>
                <Text style={styles.colTotal}>{(item.quantity * item.unitPrice).toFixed(2)} €</Text>
              </View>
            ))}
          </View>
        )}

        {/* SECTION NRC */}
        {data.nrcItems.length > 0 && (
          <View style={styles.table}>
            <Text style={styles.sectionLabel}>Frais non récurrent (NRC)</Text>
            <TableHeader />
            {data.nrcItems.map((item: any, i: number) => (
              <View key={i} style={styles.tableRow}>
                <View style={styles.colDesc}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemDetails}>{item.description}</Text>
                </View>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colPrice}>{parseFloat(item.unitPrice).toFixed(2)} €</Text>
                <Text style={styles.colTva}>{item.tvaRate}%</Text>
                <Text style={styles.colTotal}>{(item.quantity * item.unitPrice).toFixed(2)} €</Text>
              </View>
            ))}
          </View>
        )}

        {/* FOOTER: PAIEMENT + RÉCAP */}
        <View style={styles.footer}>
          <View style={styles.paymentBox}>
            <Text style={[styles.itemTitle, { color: teal, marginBottom: 5 }]}>Informations de paiement</Text>
            <Text style={{ fontSize: 8 }}>Établissement: {data.client.banque}</Text>
            <Text style={styles.ibanText}>IBAN: {data.client.iban}</Text>
            <Text style={styles.ibanText}>BIC: {data.client.bic}</Text>
          </View>
          
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text>Total HT</Text>
              <Text style={styles.bold}>{totalHT.toFixed(2)} €</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Total TVA (20%)</Text>
              <Text style={styles.bold}>{totalTVA.toFixed(2)} €</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={{ fontFamily: "Helvetica-Bold", color: teal }}>Total TTC</Text>
              <Text style={{ fontFamily: "Helvetica-Bold", color: teal, fontSize: 12 }}>{totalTTC.toFixed(2)} €</Text>
            </View>
          </View>
        </View>

        <Text style={styles.legalText}>
          DC2SCALE SAS - SIREN 882 411 291 - TVA FR95882411291{"\n"}
          Pénalités de retard: 3x le taux légal + 40€ d'indemnité forfaitaire.
        </Text>
      </Page>
    </Document>
  );
}