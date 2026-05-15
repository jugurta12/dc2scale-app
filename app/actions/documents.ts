"use server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createFullDocument(formData: any) {
  try {
    const session = await getServerSession(authOptions)
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email || "" }
    })

    if (!user) return { success: false, reference: "", error: "Utilisateur introuvable" }

    const typeLower = (formData.docType || "").toLowerCase();
    
    const isNda = typeLower.includes("nda") || typeLower.includes("confidentialité");
    const isQuote = typeLower.includes("proposition") || typeLower.includes("devis");

    let expediteurId: string | null = null
    let destinataireId: string | null = null
    let clientId: string | null = null

    // --- LOGIQUE DEVIS (PROPOSITION DE COLOCATION) ---
    if (isQuote) {
      // 1. SAUVEGARDE DU CLIENT D'ABORD (C'est cette partie qui manquait)
      if (formData.client?.nom) {
        const clientSaved = await prisma.client.upsert({
          where: { nom: formData.client.nom },
          update: {
          adresse: formData.client.adresse || "",
          mail: formData.client.mail || "",      // Ajouté
          telephone: formData.client.tel || "",  // Ajouté
          tva: formData.client.tva || "",
          },
          create: {
            nom: formData.client.nom,
            adresse: formData.client.adresse || "",
            mail: formData.client.mail || "",
            telephone: formData.client.tel || "",
            tva: formData.client.tva || "",
          },
        })
        clientId = clientSaved.id // Récupération de l'ID pour lier au document
      }

      // 2. Calculs financiers automatiques
      const mrcItems = formData.mrcItems || [];
      const nrcItems = formData.nrcItems || [];
      const allItems = [...mrcItems, ...nrcItems];
      
      let totalHT = 0;
      let totalTVA = 0;

      allItems.forEach((item: any) => {
        const lineHT = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
        const lineTVA = lineHT * ((parseFloat(item.tvaRate) || 20) / 100);
        totalHT += lineHT;
        totalTVA += lineTVA;
      });

      const totalTTC = totalHT + totalTVA;

      // 3. Création du document
      const newQuote = await prisma.document.create({
        data: {
          type: "Proposition de Colocation",
          reference: `PROP-${Date.now()}`,
          authorId: user.id,
          clientId: clientId, // Liaison au client sauvegardé
          data: {
            client: formData.client,
            emetteur: {
              nom: "DC2SCALE",
              adresse: "128 Rue La Boétie, 75008 Paris",
              mail: "admin@dc2scale.fr",
              telephone: "01 84 20 72 17",
              siren: "882.411.291",
              tva: "FR95882411291"
            },
            paiement: {
              banque: "Société Générale",
              iban: "FR76 3000 3022 6500 0200 0708 441",
              bic: "SOGEFRPP"
            },
            totals: { totalHT, totalTVA, totalTTC }
          },
          items: {
            create: allItems.map((item: any) => ({
              description: item.name,
              details: item.description,
              quantity: parseFloat(item.quantity),
              unitPrice: parseFloat(item.unitPrice),
              tvaRate: parseFloat(item.tvaRate) || 20,
              isRecurring: item.isRecurring 
            }))
          }
        }
      });

      return { success: true, reference: newQuote.reference, documentId: newQuote.id };
    }

    // --- LOGIQUE NDA ---
    if (isNda) {
      const partenaire = await prisma.client.upsert({
        where: { nom: formData.partnerName },
        update: {
          adresse: formData.partnerAddress,
          numeroImmatriculation: formData.partnerRegNumber || null,
        },
        create: {
          nom: formData.partnerName,
          adresse: formData.partnerAddress,
          numeroImmatriculation: formData.partnerRegNumber || null,
        },
      })
      clientId = partenaire.id
    } 
    // --- LOGIQUE AFFRÈTEMENT ---
    else {
      const expediteur = await prisma.expediteur.upsert({
        where: { nom: formData.expediteurNom },
        update: { adresse: formData.expediteurAdresse },
        create: {
          nom: formData.expediteurNom,
          adresse: formData.expediteurAdresse,
          transport: formData.expediteurTransport || "Routier",
        },
      })
      const destinataire = await prisma.destinataire.upsert({
        where: { nom: formData.destinataireNom },
        update: { adresse: formData.destinataireAdresse },
        create: {
          nom: formData.destinataireNom,
          adresse: formData.destinataireAdresse,
        },
      })
      expediteurId = expediteur.id
      destinataireId = destinataire.id
    }

    const newDocument = await prisma.document.create({
      data: {
        type: formData.docType || "Confirmation d'Affrètement",
        reference: `REF-${Date.now()}`,
        authorId: user.id,
        expediteurId,
        destinataireId,
        clientId,
        data: isNda ? {
          partnerName: formData.partnerName,
          partnerRegNumber: formData.partnerRegNumber,
          partnerAddress: formData.partnerAddress,
          purpose: formData.purpose,
          effectiveDate: formData.effectiveDate,
        } : {
          dateEnlevement: formData.dateEnlevement,
          dateLivraison: formData.dateLivraison,
          descriptionTransport: formData.descriptionTransport,
          tarification: formData.tarification,
        },
      }
    })

    return { success: true, reference: newDocument.reference, documentId: newDocument.id }
  } catch (error) {
    console.error("Erreur:", error)
    return { success: false, error: String(error) }
  }
}

export async function getContacts() {
  const expediteurs = await prisma.expediteur.findMany({ select: { nom: true, adresse: true, raison: true, contact: true, transport: true } })
  const destinataires = await prisma.destinataire.findMany({ select: { nom: true, adresse: true, raison: true } })
  const clients = await prisma.client.findMany({ select: { nom: true, adresse: true, numeroImmatriculation: true, mail: true, telephone: true, tva: true } })
  return { expediteurs, destinataires, clients }
}

export async function getRecentDocuments() {
  return await prisma.document.findMany({ 
    orderBy: { createdAt: "desc" }, 
    take: 5,
    include: { items: true } // Inclut les produits pour les devis récents
  })
}