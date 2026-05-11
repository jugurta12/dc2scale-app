import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 9, padding: 50, color: "#111", backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  logo: { width: 100, height: 35 },
  refBox: { fontSize: 7, color: "#666", textAlign: "right" },
  title: { fontSize: 14, fontFamily: "Helvetica-Bold", textAlign: "center", marginTop: 10, marginBottom: 4 },
  subtitle: { fontSize: 8, color: "#444", textAlign: "center", marginBottom: 20, fontStyle: "italic" },
  
  // Table des Parties
  table: { borderWidth: 1, borderColor: "#000", marginBottom: 15 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#000" },
  tableRowLast: { flexDirection: "row" },
  tableLabel: { width: "20%", backgroundColor: "#eee", padding: 6, fontSize: 8, fontFamily: "Helvetica-Bold", borderRightWidth: 1, borderColor: "#000" },
  tableValue: { width: "80%", padding: 6, fontSize: 8, lineHeight: 1.4 },
  
  // Contenu Textuel
  sectionTitle: { fontFamily: "Helvetica-Bold", fontSize: 9, marginTop: 12, marginBottom: 5, textDecoration: "underline" },
  body: { lineHeight: 1.4, marginBottom: 8, textAlign: "justify", fontSize: 8.5 },
  listItem: { flexDirection: "row", marginBottom: 4, paddingLeft: 10 },
  bullet: { width: 25, fontSize: 8.5 },
  listText: { flex: 1, fontSize: 8.5, textAlign: "justify", lineHeight: 1.4 },
  
  bold: { fontFamily: "Helvetica-Bold" },
  whereas: { fontSize: 8.5, marginBottom: 10, marginTop: 5, lineHeight: 1.4 },

  // Signatures
  signatureSection: { marginTop: 25, break: "avoid" },
  signatureTitleHeader: { fontFamily: "Helvetica-Bold", fontSize: 9, marginBottom: 15 },
  signatureGrid: { flexDirection: "row", justifyContent: "space-between" },
  signatureBox: { width: "45%" },
  signatureLine: { borderBottomWidth: 1, borderColor: "#000", marginTop: 30, marginBottom: 5 },
  signatureSubText: { fontSize: 7, color: "#444" },
  
  footer: { position: "absolute", bottom: 20, left: 50, right: 50, borderTopWidth: 0.5, borderColor: "#ccc", paddingTop: 5, flexDirection: "row", justifyContent: "space-between", fontSize: 7, color: "#999" },
})

export interface NdaData {
  partnerName: string
  partnerRegNumber: string
  partnerAddress: string
  effectiveDate: string
  reference: string
}

export function NdaPDF({ data }: { data: NdaData }) {
  const currentDate = new Date(data.effectiveDate).toLocaleDateString("en-GB")

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Page 1: Header & Introduction */}
        <View style={styles.header}>
          <Image style={styles.logo} src="/assets/Datacenters.png" />
          <View style={styles.refBox}>
            <Text>Reference: {data.reference}</Text>
            <Text>Date: {currentDate}</Text>
          </View>
        </View>

        <Text style={styles.title}>Non-Disclosure Agreement</Text>
        <Text style={styles.subtitle}>This Non-Disclosure Agreement (“Agreement”) is made effective from the date of last signature.</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Between</Text>
            <Text style={styles.tableValue}>
              <Text style={styles.bold}>{data.partnerName}</Text> (Reg. No: {data.partnerRegNumber || "__________"}) (the “Partner”) whose registered office address is {data.partnerAddress}
            </Text>
          </View>
          <View style={styles.tableRowLast}>
            <Text style={styles.tableLabel}>And</Text>
            <Text style={styles.tableValue}>
              <Text style={styles.bold}>DC2SCALE</Text> A company registered in France, No. 882 411 291 R.C.S. Paris, registered office at 128 rue de la Boétie, 75008 Paris, France.
            </Text>
          </View>
        </View>

        <Text style={styles.whereas}>
          WHEREAS, in order to facilitate a possible transaction between the Parties, certain Confidential Information may be disclosed or made available by DC2SCALE or the Partner (collectively, the “Parties”).
        </Text>

        <Text style={styles.sectionTitle}>1. CONFIDENTIAL INFORMATION</Text>
        <Text style={styles.body}>
           The Parties hereby agree that Confidential Information includes items and materials disclosed by or to the Parties or their “Affiliates”. {"\n\n"}

            The Confidential Information can appear in many forms including, but not limited to, proposals, business plans, digital or written presentations, 
            financial statements, legal documents, corporate information and documents, tax statements, trade secrets, marketing materials, customers list, 
            suppliers information, maps, blueprints, company’s reports, technical information, codes, handwritten notes, drawings, company’s e-mails, 
            on display screens or in computer memory storage devices and media. Confidential Information includes also in specifics, without limitation, 
            the following relating to either the Parties or their Affiliates: {"\n\n"}
        </Text>
        {[
          ["(a)", "pricing and other financial terms, including, without limitation, quotes, charges and fees;"],
          ["(b)", "network routes, mapping, topologies, network architecture plans and design information (including, without limitation, splice points, fibre counts, rights of way), information related to current or planned colocation facilities, data centres or premises wherein a Party has or plans to have a physical presence;"],
          ["(c)", "the identities and other related information of commercial partners (including peering partners), joint venturers, agents, subcontractors, vendors, customers or clients;"],
          ["(d)", "information or data related to systems, equipment, operations, policies, procedures or techniques; and"],
          ["(e)", "information or data related to trade secrets, know-how, inventions, internal controls, computer or data processing programs, source code, algorithms, routines, subroutines or methodologies of a Party, its Affiliates, customers, subcontractors or vendors. "],
        ].map(([bullet, text], i) => (
          <View key={i} style={styles.listItem}>
            <Text style={styles.bullet}>{bullet}</Text>
            <Text style={styles.listText}>{text}</Text>
          </View>
        ))}
        <Text style={styles.body}>
             All of those referred to as (“Confidential Information”).
        </Text>

        <Text style={styles.sectionTitle}>2. CONFIDENTIALITY</Text>
        <Text style={styles.body}>
         Except as specifically permitted by the terms of this Agreement, and in consideration of the disclosure of the Confidential Information, each Party agrees to keep confidential any Confidential Information furnished to each other for a period of three (3) years from the date of disclosure, whether or not such date is before the effective date of this Agreement. The Receiving Party shall:
        </Text>

        {[
          ["(a)", "not without the Disclosing Party’s written consent disclose or permit the disclosure of the Confidential Information disclosed to it provided that the Receiving Party provided that, subject to clause 6, it may disclose the Confidential Information to those employees and officers of the Receiving Party who have a need to know the Confidential Information in order to fulfil the purpose for which the Confidential Information was disclosed;"],
          ["(b)", "treat the Confidential Information as a trade secret and sole property of the Disclosing Party;"],
          ["(c)", "take all necessary and proper security precautions (and at least as great as those it takes to safeguard its own confidential information) to safeguard every part of the Confidential Information to prevent it from being disclosed or otherwise made available to any third party except as permitted by this Agreement;"],
          ["(d)", "only make such records or embodiments of Confidential Information (“Records”) as are strictly necessary for the purposes set out in this Agreement and clearly mark all Records as confidential; and"],
          ["(e)", "upon the written request of the Disclosing Party, the Receiving Party shall promptly return the original and all copies of all Confidential Information or any part thereof and all Records to the Disclosing Party or certify to the Disclosing Party that the Confidential Information and all Records have been destroyed."],
          ["(f)", "The Receiving Party acknowledges that as a result of the use or disclosure of proprietary information in a manner inconsistent with this Agreement will cause irreparable harm to the Disclosing Party, the Disclosing Party will have the right to fair and injunctive relief to prevent the unauthorized use or disclosure, and damage caused by such unauthorized use or disclosure."],
        ].map(([bullet, text], i) => (
          <View key={i} style={styles.listItem}>
            <Text style={styles.bullet}>{bullet}</Text>
            <Text style={styles.listText}>{text}</Text>
          </View>
        ))}
        


        <Text style={styles.sectionTitle}>3. TERM</Text>
        <Text style={styles.body}>
         The Agreement shall expire either three (3) years from the date hereof, or upon the termination of the evaluation or pursuit of the Agreement between the Parties; however, the Receiving Party’s obligations with respect to the Confidential Information shall survive for three (3) years following the date of such termination of this Agreement (the “Term”).
        </Text>

        <Text style={styles.sectionTitle}>4. CONDITIONS</Text>
        <Text style={styles.body}>
          {"\n\n"}Confidential Information shall not include any information:
        </Text>
        {[
          ["(a)", "which is generally available to the public through no wrongful act of the Receiving Party;"],
          ["(b)", "which the Receiving Party can prove was known to the Receiving Party or already lawfully in its possession and not subject to this Agreement or any other obligations of confidentiality;"],
          ["(c)", "which is received from a third party without restriction and without breach of this Agreement or any other obligations of confidentiality;"],
          ["(d)", "which is independently developed by the Receiving Party without using any Confidential Information of the other Party and demonstrated by its contemporaneous business records; or"],
          ["(e)", "because of its nature is not capable of protection as confidential information even if it remains secret."],
        ].map(([bullet, text], i) => (
          <View key={i} style={styles.listItem}>
            <Text style={styles.bullet}>{bullet}</Text>
            <Text style={styles.listText}>{text}</Text>
          </View>
        ))}




        <Text style={styles.sectionTitle}>5. COMPELLED DISCLOSURE</Text>
        <Text style={styles.body}>
          A Receiving Party may disclose Confidential Information in a legal proceeding or pursuant to a binding order of a court or any government body, agency or regulatory body provided that the Receiving Party uses all reasonable endeavours (i) to provide the Disclosing Party with notice and copy of such order prior to any such disclosure to enable the Disclosing Party, and, at the Disclosing Party’s request, to reasonably assist the Disclosing Party, to challenge such order and/or obtain protective relief therefrom, (ii) to furnish only that portion of the Confidential Information that it is legally obliged to disclose and (iii) to consult with the Disclosing Party with a view to agreeing the timing and content of such disclosure.
        </Text>

        <Text style={styles.sectionTitle}>10. RETURN OR DESTRUCTION</Text>
        <Text style={styles.body}>
          Upon termination, each Receiving Party shall destroy or return all Confidential Information and certify such destruction in writing.
        </Text>

        <Text style={styles.sectionTitle}>20. GOVERNING LAW AND JURISDICTION</Text>
        <Text style={styles.body}>
          This Agreement shall be governed by and construed in accordance with the laws of France.
        </Text>

        {/* Signature Page - Force break to keep together if needed */}
        <View style={styles.signatureSection}>
          <Text style={styles.signatureTitleHeader}>IN WITNESS WHEREOF, the Parties hereto have caused this Agreement to be duly executed.</Text>
          
          <View style={styles.signatureGrid}>
            {/* DC2SCALE */}
            <View style={styles.signatureBox}>
              <Text style={styles.bold}>DC2SCALE</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureSubText}>Olivier MIS, Chief Executive Officer</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureSubText}>Gautier MARSOT LEMAIRE, Managing Director</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureSubText}>Date</Text>
            </View>

            {/* PARTNER */}
            <View style={styles.signatureBox}>
              <Text style={styles.bold}>{data.partnerName.toUpperCase()}</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureSubText}>Print Name and Title</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureSubText}>Signature</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureSubText}>Date</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>DC2SCALE NDA 2024</Text>
          <Text>Confidential</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}