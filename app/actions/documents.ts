"use server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createFullDocument(formData: any) {
  try {
    const session = await getServerSession(authOptions)
    console.log("SESSION:", JSON.stringify(session))

    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email || "" }
    })
    console.log("USER TROUVÉ:", JSON.stringify(user))

    if (!user) {
      return { success: false, reference: "", error: "Utilisateur introuvable" }
    }

    const typeLower = (formData.docType || "").toLowerCase();
    const isNda = typeLower.includes("nda") || typeLower.includes("confidentialité");

    // On utilise null par défaut pour que Prisma accepte les champs optionnels
    let expediteurId: string | null = null
    let destinataireId: string | null = null
    let clientId: string | null = null

    if (isNda) {
      // Pour le NDA : on enregistre le partenaire comme client
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
    } else {
      // Pour les autres docs : expéditeur + destinataire
      const expediteur = await prisma.expediteur.upsert({
        where: { nom: formData.expediteurNom },
        update: {
          adresse: formData.expediteurAdresse,
          transport: formData.expediteurTransport || "Routier",
        },
        create: {
          nom: formData.expediteurNom,
          adresse: formData.expediteurAdresse,
          transport: formData.expediteurTransport || "Routier",
          raison: formData.expediteurRaison || "Standard",
          contact: formData.expediteurContact || "Non spécifié",
        },
      })

      const destinataire = await prisma.destinataire.upsert({
        where: { nom: formData.destinataireNom },
        update: {
          adresse: formData.destinataireAdresse,
          informations: formData.destinataireAdresse,
        },
        create: {
          nom: formData.destinataireNom,
          adresse: formData.destinataireAdresse,
          informations: formData.destinataireAdresse,
          raison: formData.destinataireRaison || "Livraison",
        },
      })

      expediteurId = expediteur.id
      destinataireId = destinataire.id
    }

    // On prépare l'objet data de manière propre
    const newDocument = await prisma.document.create({
      data: {
        type: formData.docType || "Confirmation d'Affrètement",
        reference: `REF-${Date.now()}`,
        authorId: user.id,
        // On passe les IDs s'ils existent, sinon Prisma ignore grâce au null/undefined bien géré
        expediteurId: expediteurId,
        destinataireId: destinataireId,
        clientId: clientId,
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
          poids: formData.poids,
          dimensions: formData.dimensions,
          tarification: formData.tarification,
          numeroCommande: formData.numeroCommande,
        },
      }
    })

    return {
      success: true,
      reference: newDocument.reference,
      documentId: newDocument.id,
      ...(isNda ? { partenaire: formData.partnerName } : {
        expediteur: formData.expediteurNom,
        destinataire: formData.destinataireNom,
      })
    }

  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error)
    // On renvoie l'erreur pour comprendre ce qui bloque dans la console
    return { success: false, reference: "", error: String(error) }
  }
}

export async function getContacts() {
  const expediteurs = await prisma.expediteur.findMany({
    select: { nom: true, adresse: true, raison: true, contact: true, transport: true }
  })
  const destinataires = await prisma.destinataire.findMany({
    select: { nom: true, adresse: true, raison: true }
  })
  return { expediteurs, destinataires }
}

export async function getRecentDocuments() {
  const documents = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { reference: true, type: true, createdAt: true }
  })
  return documents
}