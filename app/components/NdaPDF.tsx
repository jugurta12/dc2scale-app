import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 9, padding: 50, color: "#111", backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  logo: { width: 140, height: 35 },
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

  // Nouveaux Styles Signatures (Match capture d'écran)
  signaturePage: {
    marginTop: 20,
    break: 'before', // Force le saut de page
  },
  signatureMainTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    marginBottom: 30,
  },
  partyTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#10b981", // Vert DC2SCALE
    marginBottom: 15,
    textTransform: "uppercase"
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  signatureCol: {
    width: "48%",
  },
  labelSmall: {
    fontSize: 7,
    color: "#444",
    marginBottom: 10,
  },
  nameBold: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    marginBottom: 2,
  },
  fullLine: {
    borderBottomWidth: 1,
    borderColor: "#000",
    width: "100%",
    marginTop: 2,
    marginBottom: 15,
  },
  
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
              <Text style={styles.bold}>{data.partnerName}</Text> Reg. No: {data.partnerRegNumber || "__________"} (the “Partner”) whose registered office address is {data.partnerAddress}
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
            {"\n"}
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
         {"\n"}Except as specifically permitted by the terms of this Agreement, and in consideration of the disclosure of the Confidential Information, each Party agrees to keep confidential any Confidential Information furnished to each other for a period of three (3) years from the date of disclosure, whether or not such date is before the effective date of this Agreement. The Receiving Party shall:
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
         {"\n"}The Agreement shall expire either three (3) years from the date hereof, or upon the termination of the evaluation or pursuit of the Agreement between the Parties; however, the Receiving Party’s obligations with respect to the Confidential Information shall survive for three (3) years following the date of such termination of this Agreement (the “Term”).
        </Text>

        <Text style={styles.sectionTitle}>4. CONDITIONS</Text>
        <Text style={styles.body}>
          {"\n"}Confidential Information shall not include any information:
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
        <Text style={styles.body}>{"\n"}
          A Receiving Party may disclose Confidential Information in a legal proceeding or pursuant to a binding order of a court or any government body,
           agency or regulatory body provided that the Receiving Party uses all reasonable endeavours (i) to provide the Disclosing Party with notice and
            copy of such order prior to any such disclosure to enable the Disclosing Party, and, at the Disclosing Party’s request, to reasonably assist the Disclosing Party,
             to challenge such order and/or obtain protective relief therefrom, (ii) to furnish only that portion of the Confidential Information that it is 
             legally obliged to disclose and (iii) to consult with the Disclosing Party with a view to agreeing the timing and content of such disclosure.
        </Text>

        <Text style={styles.sectionTitle}>6. LIMITATIONS.</Text>
        <Text style={styles.body}>{"\n"}
           The Receiving Party shall have obtained from such employees and officers binding obligations of confidence no less onerous than those set out in this Agreement.
           The Receiving Party undertakes to enforce such undertakings and to be responsible for breaches of the undertakings by such persons.
        </Text>

        <Text style={styles.sectionTitle}>7. USE.  </Text>
        <Text style={styles.body}>{"\n"}
          Confidential Information exchanged between the Parties is considered loaned for use solely in connection with considering, evaluating and negotiating 
          the contemplated Agreement and use other than for such purpose shall be considered to be a breach of this Agreement.
        </Text>

        <Text style={styles.sectionTitle}>8. ACKNOWLEDGEMENTS.  </Text>
        <Text style={styles.body}>
            {"\n"}
        </Text>
        {[
          ["(a)", "Except in the case of fraud, no representation, warranty or undertaking (express or implied) is made with respect to the accuracy, completeness, reasonableness or otherwise in respect of the use of the Confidential Information supplied by the other Party."],
          ["(b)", "This Agreement shall not be construed as granting or conferring any rights, by licence or otherwise, in any Confidential Information disclosed hereunder."],
          ["(c)", "Each Party is solely responsible for making its own decisions in relation to the Confidential Information and any other documentation or data supplied by or on behalf of the other Party."],
        ].map(([bullet, text], i) => (
          <View key={i} style={styles.listItem}>
            <Text style={styles.bullet}>{bullet}</Text>
            <Text style={styles.listText}>{text}</Text>
          </View>
        ))}

         <Text style={styles.sectionTitle}>9. 	OBLIGATIONS. </Text>
        <Text style={styles.body}>{"\n"}
           Any disclosure of Confidential Information made by a Party under this Agreement shall not obligate either of the Parties to provide any additional
            Confidential Information. In addition, neither the disclosure of Confidential Information nor any other fact or circumstance in connection with this
             Agreement will in any way obligate either Party to proceed further with or enter into the contemplated transaction or any other or further agreement with the other Party.
        </Text>

        <Text style={styles.sectionTitle}>10. 	RETURN OR DESTRUCTION OF CONFIDENTIAL INFORMATION.  </Text>
        <Text style={styles.body}>{"\n"}
           If this Agreement is terminated, each Receiving Party shall (a) destroy all Confidential Information of the Disclosing Party prepared or generated by the Receiving Party without
            retaining a copy of any such material; (b) promptly deliver to the Disclosing Party all other Confidential Information of the Disclosing Party, 
            together with all copies thereof, in the possession, custody or control of the Receiving Party or, alternatively, with the written consent of a Party contact (whichever represents the Disclosing Party)
             destroy all such Confidential Information; and (c) certify all such destruction in writing to the Disclosing Party, provided, however, that the Receiving Party may retain a list that contains general
              descriptions of the information it has returned or destroyed to facilitate the resolution of any controversies after the Disclosing Party's Confidential Information is returned.
        </Text>

        <Text style={styles.sectionTitle}>11. 	WAIVER.  </Text>
        <Text style={styles.body}>{"\n"}
           The rights of the Disclosing Party under this Agreement are in addition to and not exclusive of rights under the general law and may be waived only in writing and specifically. Delay in exercising or non-exercise of any right under this Agreement is not a waiver of that or any other right, partial exercise of any right under this Agreement shall not preclude any further or other exercise of that right or any other right under this Agreement and waiver of a breach of any term of this Agreement shall not operate as a waiver of breach of any other term or any subsequent breach of that term.
        </Text>

        <Text style={styles.sectionTitle}>12.	PUBLIC ANNOUNCEMENTS.  </Text>
        <Text style={styles.body}>{"\n"}
        No public announcement or disclosure may be made by either Party concerning this Agreement, nor any possible transactions between 
        the Parties or any related discussions without the prior written approval of the other Party.
        </Text>

        <Text style={styles.sectionTitle}>13. 	ENTIRE AGREEMENT. </Text>
        <Text style={styles.body}>{"\n"}
       This Agreement constitutes the entire agreement between the Parties with respect to Confidential Information and supersedes any and all prior or contemporaneous oral or written representations relating thereto. No agent, employee, or representative of either Party has any authority to bind such Party to any affirmation, representation or warranty and, unless such is specifically included within this Agreement, it shall not be enforceable by the other Party hereto. Nothing in this paragraph shall operate to limit or exclude any liability for fraud on the part of either Party. This Agreement shall not be construed in favour or against any Party, but shall be construed equally as to both Parties.
        </Text>

        <Text style={styles.sectionTitle}>14. 	NOTICES.  </Text>
        <Text style={styles.body}>{"\n"}
        Any notices required by this Agreement shall be in writing and shall be given in hand or sent by first class mail or by courier service or by facsimile
         transmission which confirms receipt of such transmission, to the applicable address or fax number noted above or as may be notified to the other Party in accordance with this clause.
        </Text>

        <Text style={styles.sectionTitle}>15. 	SEVERABILITY.  </Text>
        <Text style={styles.body}>{"\n"}
        If any provision of this Agreement is or becomes illegal, invalid or unenforceable in any jurisdiction, that shall not affectthe legality,
         validity or enforceability in that jurisdiction of any other provision of this Agreement. 
        </Text>

        <Text style={styles.sectionTitle}>16. 	NON-ASSIGNMENT OF RIGHTS. </Text>
        <Text style={styles.body}>{"\n"}
        Neither party hereto shall assign in whole or in part its rights or obligations under this Agreement without the express written consent of the other Party.
         This Agreement shall be binding upon and shall inure to the benefit of each of the Party’s successors and permitted assigns.
        </Text>

        <Text style={styles.sectionTitle}>17. 	PROPERTY OF DISCLOSING PARTY. </Text>
        <Text style={styles.body}>{"\n"}
        All Confidential Information, unless otherwise specified in writing, shall remain the sole and exclusive property of the Disclosing Party and shall be used by the Receiving Party only for the purpose intended herein, except as may be required by applicable law or legal process. 
        {"\n\n"}The Receiving Party shall not disclose, reproduce, or disseminate such Confidential Information to anyone, except to those employees and consultants (including employees and consultants of its parent, subsidiaries and affiliates) on a need-to-know basis for purposes of this Agreement.
        {"\n\n"}If the Receiving Party is requested by a government entity or other third party to disclose any Confidential Information, it will promptly notify the Disclosing Party to allow the latter to seek a protective order or take other appropriate action, at the sole cost and expense of the Disclosing Party.  The Receiving Party will also cooperate in the Disclosing Party's efforts to obtain a protective order or other reasonable assurance that confidential treatment will be afforded the Confidential Information.  If in the absence of a protective order the Receiving Party is compelled as a matter of law to disclose the Confidential Information based upon the written opinion of the Receiving Party’s counsel, the Receiving Party may disclose to the government entity or other third party compelling the disclosure only the part of the Confidential Information as required by law to be disclosed. 
        </Text>

        <Text style={styles.sectionTitle}>18. 	RIGHTS OF THIRD PARTIES.  </Text>
        <Text style={styles.body}>{"\n"}
        The terms of this Agreement or any of them may be varied, amended or modified or this Agreement may be suspended, cancelled or terminated by agreement 
        in writing between the Parties or this Agreement may be rescinded (in each case), without the consent of any such third party.
        </Text>

        <Text style={styles.sectionTitle}>19. 	BREACH OF CONFIDENTIALITY.  </Text>
        <Text style={styles.body}>{"\n"}
        Each Party acknowledges that a breach of this Agreement will result in irreparable harm to the Party whose Confidential Information has been disclosed and that Party will be entitled to a temporary, preliminary and permanent injunction or a protection order for any actual or threatened with the provisions of this Agreement. Each Party accepts and consents to the introduction of an injunction or protection order by any competent court upon presentation by the Party whose Confidential Information has been disclosed that its Confidential Information is used or disclosed contrary to the terms of this Agreement. The foregoing provisions are in addition to, and not limited to, remedies against specific performance, direct and indirect damages and any other remedy provided by law, in equity or otherwise, that the Parties may incur  in the event of a violation. No arbitration provision will apply to a temporary restraining order, preliminary injunction or other interim remedy to prohibit a violation or threat of violation of the provisions of this Agreement.
        </Text>

        <Text style={styles.sectionTitle}> 20. 	GOVERNING LAW AND JURISDICTION.  </Text>
        <Text style={styles.body}>{"\n"}
            This Agreement shall be governed by and construed in accordance with the laws of France.
        </Text>
















        {/* Signature Page - Force break to keep together if needed */}
        {/* SECTION SIGNATURE - NOUVELLE PAGE AUTOMATIQUE */}
<View break style={styles.signaturePage}>
  <Text style={styles.signatureMainTitle}>
    IN WITNESS WHEREOF, the Parties hereto have caused this Agreement to be duly executed as of the date below. [cite: 89]
  </Text>

  {/* BLOC DC2SCALE */}
  <Text style={styles.partyTitle}>DC2SCALE </Text>
  <Text style={styles.labelSmall}>Authorised signature:{"\n\n"}</Text>

  <View style={styles.signatureRow}>
    <View style={styles.signatureCol}>
      <Text style={styles.labelSmall}>Print name and title {"\n"}</Text>
      <Text style={styles.nameBold}>Olivier MIS, Chief Executive Officer {"\n"}</Text>
    </View>
    <View style={styles.signatureCol}>
      <Text style={styles.labelSmall}>Print name and title {"\n"}</Text>
      <Text style={styles.nameBold}>Gautier MARSOT LEMAIRE, Managing Director </Text>
    </View>
  </View>
  
  <View style={styles.fullLine} />
  
  <View style={styles.signatureRow}>
    <Text style={styles.labelSmall}>Signature {"\n"}</Text>
    <Text style={[styles.labelSmall, { marginRight: "40%" }]}>Signature {"\n"}</Text>
  </View>
  
  <View style={styles.fullLine} />
  
  <View style={styles.signatureRow}>
    <Text style={styles.labelSmall}>Date {"\n"}</Text>
    <Text style={[styles.labelSmall, { marginRight: "43%" }]}>Date {"\n"}</Text>
  </View>
  
  <View style={styles.fullLine} />

  {/* BLOC PARTNER */}
  <View style={{ marginTop: 40 }}>
   <Text style={styles.partyTitle}>
      {data.partnerName.toUpperCase()}
    </Text>
    <Text style={styles.labelSmall}>Authorised signature:{"\n\n"}</Text>

    <View style={styles.signatureRow}>
      <View style={styles.signatureCol}>
        <Text style={styles.labelSmall}>Print name and title {"\n"}</Text>
      </View>
      <View style={styles.signatureCol}>
        <Text style={styles.labelSmall}>Print name and title {"\n"}</Text>
      </View>
    </View>
    
    <View style={styles.fullLine} />
    
    <View style={styles.signatureRow}>
      <Text style={styles.labelSmall}>Signature {"\n"}</Text>
      <Text style={[styles.labelSmall, { marginRight: "40%" }]}>Signature {"\n"}</Text>
    </View>
    
    <View style={styles.fullLine} />
    
    <View style={styles.signatureRow}>
      <Text style={styles.labelSmall}>Date {"\n"}</Text>
      <Text style={[styles.labelSmall, { marginRight: "43%" }]}>Date {"\n"}</Text>
    </View>
    
    <View style={styles.fullLine} />
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