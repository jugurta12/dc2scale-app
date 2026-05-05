"use server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createFullDocument(formData: any) {
  try {
    // Récupérer le user connecté
    const session = await getServerSession(authOptions)
    console.log("SESSION:", JSON.stringify(session))

    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email || "" }
    })
    console.log("USER TROUVÉ:", JSON.stringify(user))

    if (!user) {
      return { success: false, reference: "", error: "Utilisateur introuvable" }
    }

    // 1. Expéditeur
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
        contact: formData.expediteurContact || "Non spécifié"
      },
    })

    // 2. Destinataire
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
        raison: formData.destinataireRaison || "Livraison"
      },
    })

    // 3. Document
    const newDocument = await prisma.document.create({
      data: {
        type: formData.docType || "Confirmation d'Affrètement",
        reference: `REF-${Date.now()}`,
        expediteurId: expediteur.id,
        destinataireId: destinataire.id,
        data: {
          dateEnlevement: formData.dateEnlevement,
          dateLivraison: formData.dateLivraison,
          descriptionTransport: formData.descriptionTransport,
          poids: formData.poids,
          dimensions: formData.dimensions,
          tarification: formData.tarification,
          numeroCommande: formData.numeroCommande,
        },
        authorId: user.id,
      }
    })

    return { 
      success: true, 
      reference: newDocument.reference,
      documentId: newDocument.id,
      expediteur: expediteur.nom,
      destinataire: destinataire.nom 
    }

  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error)
    return { success: false, reference: "" }
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