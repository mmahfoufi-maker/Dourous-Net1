-- ================================================================
--  DOUROUS-NET — Schéma Supabase Final (conforme au rapport)
--  Tables A (profiles/élèves), B (professeurs), C (séances)
-- ================================================================

-- ── TABLE B : Professeurs (ressources consultables) ─────────────
CREATE TABLE professeurs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom         TEXT NOT NULL,
  prenom      TEXT NOT NULL,
  matiere     TEXT NOT NULL,
  bio         TEXT,
  photo_url   TEXT,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Données réelles inspirées des enseignants algériens
INSERT INTO professeurs (nom, prenom, matiere, bio) VALUES
  ('Boukhalfa', 'Karim',  'Algorithmique et Structures de Données',
   'Maître de conférences, spécialisé en complexité algorithmique et optimisation. Auteur de plusieurs publications sur les algorithmes de tri.'),
  ('Hamidi',    'Samira', 'Réseaux et Télécommunications',
   'Docteure en réseaux, experte en architecture TCP/IP et sécurité réseau. Responsable du laboratoire réseaux de l''ESI.'),
  ('Meziane',   'Yacine', 'Génie Logiciel',
   'Enseignant-chercheur spécialisé en UML, design patterns et méthodes Agile. Formateur certifié Scrum Master.'),
  ('Aïssat',   'Nadia',  'Intelligence Artificielle',
   'Docteure en IA, recherches en machine learning et traitement du langage naturel. Co-auteure de travaux sur les LLMs en darija.');


-- ── TABLE A : Profils des élèves (liée à Supabase Auth) ─────────
CREATE TABLE profiles (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nom         TEXT NOT NULL,
  prenom      TEXT NOT NULL,
  niveau      TEXT,  -- ex: "Licence 2", "Master 1"
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Trigger : crée le profil automatiquement à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nom, prenom, niveau)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nom',    'Élève'),
    COALESCE(NEW.raw_user_meta_data->>'prenom', ''),
    COALESCE(NEW.raw_user_meta_data->>'niveau', 'Licence 2')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ── TABLE C : Séances (jointure élève + professeur) ─────────────
CREATE TABLE seances (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  eleve_id        UUID REFERENCES profiles(id)     ON DELETE CASCADE NOT NULL,
  professeur_id   UUID REFERENCES professeurs(id)  ON DELETE CASCADE NOT NULL,
  date_heure      TIMESTAMP WITH TIME ZONE NOT NULL,
  statut          TEXT DEFAULT 'en_attente'
                  CHECK (statut IN ('en_attente', 'confirmee', 'annulee', 'terminee')),
  notes           TEXT,
  devoir_url      TEXT,    -- lien vers le fichier dans Storage
  devoir_nom      TEXT,    -- nom original du fichier
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_seances_eleve     ON seances(eleve_id);
CREATE INDEX idx_seances_prof      ON seances(professeur_id);
CREATE INDEX idx_seances_statut    ON seances(statut);
CREATE INDEX idx_seances_date      ON seances(date_heure DESC);


-- ── STORAGE : Bucket devoirs ────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'devoirs', 'devoirs', FALSE,
  20971520,  -- 20 MB
  ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);


-- ================================================================
--  ROW LEVEL SECURITY (RLS) — CRITÈRE ÉLIMINATOIRE ✅
-- ================================================================

ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE professeurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE seances     ENABLE ROW LEVEL SECURITY;

-- ── Profiles ────────────────────────────────────────────────────
CREATE POLICY "Voir son propre profil"
  ON profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Modifier son propre profil"
  ON profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Créer son profil"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ── Professeurs (lecture publique pour tout utilisateur connecté) ─
CREATE POLICY "Lecture publique des professeurs"
  ON professeurs FOR SELECT TO authenticated USING (true);

-- ── Séances (isolation stricte par élève) ───────────────────────
CREATE POLICY "Voir ses propres seances"
  ON seances FOR SELECT
  USING (eleve_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Creer sa propre seance"
  ON seances FOR INSERT
  WITH CHECK (eleve_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Modifier ses propres seances"
  ON seances FOR UPDATE
  USING (eleve_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Supprimer ses propres seances"
  ON seances FOR DELETE
  USING (eleve_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- ── Storage RLS ─────────────────────────────────────────────────
CREATE POLICY "Upload de devoirs"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'devoirs');

CREATE POLICY "Lecture des devoirs"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'devoirs');

CREATE POLICY "Suppression de ses devoirs"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'devoirs' AND owner = auth.uid());
