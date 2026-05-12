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

    let expediteurId: string | null = null
    let destinataireId: string | null = null
    let clientId: string | null = null

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
    } else {
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
  const clients = await prisma.client.findMany({ select: { nom: true, adresse: true, numeroImmatriculation: true } })
  return { expediteurs, destinataires, clients }
}

export async function getRecentDocuments() {
  return await prisma.document.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
}