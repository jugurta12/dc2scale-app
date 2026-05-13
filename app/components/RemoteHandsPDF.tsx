import { Document, Page, Text, View, StyleSheet, Image, Svg, Line, Circle} from "@react-pdf/renderer"

const teal = "#10b981"
const dark = "#111827"
const gray = "#6b7280"

const styles = StyleSheet.create({
  
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: dark, backgroundColor: "#fff" },

  // HEADER
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
   logo: { width: 150, height: 35 },
  headerRight: { alignItems: "flex-end" },
  headerTitle: { fontSize: 18, fontFamily: "Helvetica-Bold", color: teal },
  headerSubtitle: { fontSize: 8, color: gray, letterSpacing: 1, marginTop: 2 },

  // WHAT IS
  sectionTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", color: dark, marginBottom: 6 },
  accentBar: { width: 3, backgroundColor: teal, marginRight: 8, borderRadius: 2 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  bodyText: { fontSize: 9, color: gray, lineHeight: 1.6, textAlign: "justify", marginBottom: 6 },
  bold: { fontFamily: "Helvetica-Bold" },

  // TWO COLUMNS
  twoCol: { flexDirection: "row", gap: 16, marginTop: 16, marginBottom: 16 },

  // SLA BOX
  slaBox: { flex: 1, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 6, padding: 12 },
  slaHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  slaIcon: { fontSize: 10, color: teal, marginRight: 6 },
  slaTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: teal },
  slaRow: { marginBottom: 8 },
  slaBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, fontSize: 8, fontFamily: "Helvetica-Bold", color: "#fff", alignSelf: "flex-start", marginBottom: 2 },
  slaHO: { backgroundColor: teal },
  slaHNO: { backgroundColor: "#ef4444" },
  slaText: { fontSize: 8, color: gray, lineHeight: 1.5 },

  // TIERS BOX
  tiersBox: { flex: 1, padding: 12 },
  tiersTitle: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  tierItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  tierDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: teal, marginRight: 8, marginTop: 2 },
  tierLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: dark },
  tierDesc: { fontSize: 8, color: gray, lineHeight: 1.4 },

  // PRICING TABLE
  pricingTitle: { flexDirection: "row", alignItems: "center", marginBottom: 10, marginTop: 8 },
  table: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 4 },
  tableHeaderRow: { flexDirection: "row", backgroundColor: "#1f2937" },
  tableHeaderCell: { padding: 8, fontSize: 8 },
  tableHeaderMain: { flex: 2, borderRightWidth: 1, borderRightColor: "#374151" },
  tableHeaderRate: { flex: 1, borderRightWidth: 1, borderRightColor: "#374151", alignItems: "center" },
  tableHeaderRateLast: { flex: 1, alignItems: "center" },
  tableHeaderText: { color: "#fff", fontFamily: "Helvetica-Bold", fontSize: 8 },
  tableHeaderSub: { color: teal, fontSize: 7, marginTop: 1 },
  tableRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#e5e7eb" },
  tableCellMain: { flex: 2, padding: 8, borderRightWidth: 1, borderRightColor: "#e5e7eb" },
  tableCellRate: { flex: 1, padding: 8, borderRightWidth: 1, borderRightColor: "#e5e7eb", alignItems: "center", justifyContent: "center" },
  tableCellRateLast: { flex: 1, padding: 8, alignItems: "center", justifyContent: "center" },
  tierName: { fontSize: 9, fontFamily: "Helvetica-Bold", color: teal, marginBottom: 2 },
  tierNameDesc: { fontSize: 8, color: gray },
  rateText: { fontSize: 10, fontFamily: "Helvetica-Bold", color: dark },
  rateUnit: { fontSize: 7, color: gray },
})

export function RemoteHandsPDF({ data }: any) {
  const tiers = [
    {
      name: "Hands and Eyes (Basic)",
      desc: "Rack and stack, simple cabling",
      ho: data.level1HO ?? 55,
      hno: data.level1HNO ?? 240,
    },
    {
      name: "Hands and Eyes (Advanced)",
      desc: "Changing CPU, PCI cards, adding drives, etc.",
      ho: data.level2HO ?? 90,
      hno: data.level2HNO ?? 300,
    },
    {
      name: "Hands and Eyes (Expert)",
      desc: "Any request requiring an engineer's intervention",
      ho: data.level3HO ?? 150,
      hno: data.level3HNO ?? 350,
    },
  ]

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* HEADER */}
        <View style={styles.header}>
          <Image style={styles.logo} src="/assets/Datacenters.png" />
          <View style={styles.headerRight}>
            <Text style={styles.headerTitle}>Remote Hands</Text>
            <Text style={styles.headerSubtitle}>SERVICE & PRICING SHEET</Text>
          </View>
        </View>

        {/* WHAT IS */}
        <View style={styles.sectionTitleRow}>
          <View style={styles.accentBar} />
          <Text style={styles.sectionTitle}>What is "Hands & Eyes"?</Text>
        </View>
        <Text style={styles.bodyText}>
          It is a professional service provided by DC2SCALE. This service allows you to request the intervention of an on-site technician at any time to troubleshoot a production incident, install new drives, or simply plug in a cable.
        </Text>
        <Text style={styles.bodyText}>
          You can easily create a new ticket by selecting the{" "}
          <Text style={styles.bold}>"Hands & Eyes Global"</Text> department. This is highly recommended as our certified technicians will automatically determine and select the appropriate support level among the three available tiers for your request.
        </Text>

        {/* TWO COLUMNS: SLA + TIERS */}
        <View style={styles.twoCol}>

          {/* SLA BOX */}
          <View style={styles.slaBox}>
            <View style={styles.slaHeader}>
              <Svg width="14" height="14" viewBox="0 0 24 24" style={{ marginRight: 5 }}>
                <Line x1="10" x2="14" y1="2" y2="2" stroke="#2ecc71" strokeWidth={2} />
                <Line x1="12" x2="15" y1="14" y2="11" stroke="#2ecc71" strokeWidth={2} />
                <Circle cx="12" cy="14" r="8" stroke="#2ecc71" strokeWidth={2} />
              </Svg>
              <Text style={styles.slaTitle}>Service Level Agreement</Text>
            </View>
            <View style={styles.slaRow}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9 }}>HO</Text>
                <Text style={{ fontSize: 8, color: gray }}>(Business Hours)</Text>
                <View style={[styles.slaBadge, styles.slaHO]}><Text>1H SLA</Text></View>
              </View>
              <Text style={styles.slaText}>Monday - Friday{"\n"}08:00 AM - 06:00 PM</Text>
            </View>

            <View style={styles.slaRow}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9 }}>HNO</Text>
                <Text style={{ fontSize: 8, color: gray }}>(Non-Business Hours)</Text>
                <View style={[styles.slaBadge, styles.slaHNO]}><Text>2H SLA</Text></View>
              </View>
              <Text style={styles.slaText}>Monday - Friday: 06:00 PM - 07:59 AM{"\n"}Weekends & Public Holidays</Text>
            </View>
          </View>

          {/* TIERS BOX */}
          <View style={styles.tiersBox}>
            <View style={styles.tiersTitle}>
              <Text style={styles.slaTitle}>Support Tiers</Text>
            </View>

            <View style={styles.tierItem}>
              <View style={styles.tierDot} />
              <View>
                <Text style={styles.tierLabel}>Level 1 (Basic)</Text>
                <Text style={styles.tierDesc}>Rack and stack, standard cabling.</Text>
              </View>
            </View>

            <View style={styles.tierItem}>
              <View style={styles.tierDot} />
              <View>
                <Text style={styles.tierLabel}>Level 2 (Advanced)</Text>
                <Text style={styles.tierDesc}>Component replacement (CPU, PCI cards), adding memory or drives.</Text>
              </View>
            </View>

            <View style={styles.tierItem}>
              <View style={styles.tierDot} />
              <View>
                <Text style={styles.tierLabel}>Level 3 (Expert)</Text>
                <Text style={styles.tierDesc}>Any complex request requiring a specialized engineer's intervention.</Text>
              </View>
            </View>
          </View>
        </View>

        {/* PRICING TABLE */}
        <View style={styles.pricingTitle}>
          <View style={styles.accentBar} />
          <Text style={styles.sectionTitle}>Pricing Table</Text>
        </View>

        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeaderRow}>
            <View style={[styles.tableHeaderCell, styles.tableHeaderMain]}>
              <Text style={styles.tableHeaderText}>Tier / Support Level</Text>
            </View>
            <View style={[styles.tableHeaderCell, styles.tableHeaderRate]}>
              <Text style={styles.tableHeaderText}>HO Rate</Text>
              <Text style={{ color: gray, fontSize: 7 }}>(Business Hours)</Text>
              <Text style={styles.tableHeaderSub}>15 MIN MINIMUM</Text>
            </View>
            <View style={[styles.tableHeaderCell, styles.tableHeaderRateLast]}>
              <Text style={styles.tableHeaderText}>HNO Rate</Text>
              <Text style={{ color: gray, fontSize: 7 }}>(Non-Business Hours)</Text>
              <Text style={styles.tableHeaderSub}>1H MINIMUM</Text>
            </View>
          </View>

          {/* Rows */}
          {tiers.map((tier, i) => (
            <View key={i} style={styles.tableRow}>
              <View style={styles.tableCellMain}>
                <Text style={styles.tierName}>{tier.name}</Text>
                <Text style={styles.tierNameDesc}>{tier.desc}</Text>
              </View>
              <View style={styles.tableCellRate}>
                <Text style={styles.rateText}>€ {tier.ho} / hr</Text>
              </View>
              <View style={styles.tableCellRateLast}>
                <Text style={styles.rateText}> € {tier.hno} / hr</Text>
              </View>
            </View>
          ))}
        </View>

      </Page>
    </Document>
  )
}