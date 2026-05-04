"use server"
import { prisma } from "@/lib/prisma"

export async function createFullDocument(formData: any) {
  try {
    // 1. Sauvegarder l'Expéditeur (Upsert = Crée si n'existe pas, sinon met à jour)
    const expediteur = await prisma.expediteur.upsert({
      where: { nom: formData.expediteurNom },
      update: { adresse: formData.expediteurAdresse },
      create: {
        nom: formData.expediteurNom,
        adresse: formData.expediteurAdresse,
        transport: "Routier", 
        raison: "Standard",
        contact: "Non spécifié"
      },
    })

    // 2. Sauvegarder le Destinataire
    const destinataire = await prisma.destinataire.upsert({
      where: { nom: formData.destinataireNom },
      update: { informations: formData.destinataireAdresse },
      create: {
        nom: formData.destinataireNom,
        informations: formData.destinataireAdresse,
        raison: "Livraison"
      },
    })

    // 3. (Optionnel pour l'instant) Créer le document dans l'historique
    // On le fera quand ton PDF sera prêt !

    return { success: true, expediteur, destinataire }
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error)
    return { success: false }
  }
}

export async function getContacts() {
  const expediteurs = await prisma.expediteur.findMany({ select: { nom: true, adresse: true, raison: true, contact: true, transport: true } })
  const destinataires = await prisma.destinataire.findMany({ select: { nom: true, adresse: true, raison: true } })
  
  return { expediteurs, destinataires }
}