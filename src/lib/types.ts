export interface Profile {
  id: string;
  user_id: string;
  nom: string;
  prenom: string;
  niveau: string | null;
  created_at: string;
}

export interface Professeur {
  id: string;
  nom: string;
  prenom: string;
  matiere: string;
  bio: string | null;
  photo_url: string | null;
  created_at: string;
}

export interface Seance {
  id: string;
  eleve_id: string;
  professeur_id: string;
  date_heure: string;
  statut: 'en_attente' | 'confirmee' | 'annulee' | 'terminee';
  notes: string | null;
  devoir_url: string | null;
  devoir_nom: string | null;
  created_at: string;
  professeurs?: Professeur;
}

export const MATIERES_COLORS: Record<string, string> = {
  'Algorithmique et Structures de Données': '#3b82f6',
  'Réseaux et Télécommunications':          '#8b5cf6',
  'Génie Logiciel':                         '#f59e0b',
  'Intelligence Artificielle':              '#ec4899',
};

export const STATUT_FR: Record<string, string> = {
  en_attente: 'En attente',
  confirmee:  'Confirmée',
  annulee:    'Annulée',
  terminee:   'Terminée',
};
