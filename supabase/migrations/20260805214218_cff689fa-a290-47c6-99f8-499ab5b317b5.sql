-- 1. Enum for Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. User Roles Table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Profiles Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    phone_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 4. Messages Table
CREATE TABLE public.messages (
    id SERIAL PRIMARY KEY,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    source TEXT,
    tag VARCHAR(50),
    scheduled_hour TIME,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

GRANT SELECT ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view messages" ON public.messages
    FOR SELECT TO authenticated USING (true);

-- 5. Quizzes Table
CREATE TABLE public.quizzes (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category VARCHAR(50),
    difficulty INTEGER DEFAULT 1,
    questions JSONB, -- [{question, options[], correct_index}]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

GRANT SELECT ON public.quizzes TO authenticated;
GRANT ALL ON public.quizzes TO service_role;

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view quizzes" ON public.quizzes
    FOR SELECT TO authenticated USING (true);

-- 6. Quiz Results Table
CREATE TABLE public.quiz_results (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    quiz_id INTEGER REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
    score INTEGER, -- /100
    date_taken TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_spent INTEGER -- in seconds
);

GRANT SELECT, INSERT ON public.quiz_results TO authenticated;
GRANT ALL ON public.quiz_results TO service_role;

ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quiz results" ON public.quiz_results
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz results" ON public.quiz_results
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 7. Daily Schedule Table
CREATE TABLE public.daily_schedule (
    id INTEGER PRIMARY KEY DEFAULT 1,
    last_message_date DATE,
    message_index INTEGER DEFAULT 0,
    next_message_time TIME
);

GRANT SELECT, UPDATE ON public.daily_schedule TO authenticated;
GRANT ALL ON public.daily_schedule TO service_role;

ALTER TABLE public.daily_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view daily schedule" ON public.daily_schedule
    FOR SELECT TO authenticated USING (true);

-- 8. Learning Stats Table
CREATE TABLE public.learning_stats (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    messages_received INTEGER DEFAULT 0,
    quiz_taken INTEGER DEFAULT 0,
    avg_score INTEGER DEFAULT 0,
    tags_covered TEXT[],
    UNIQUE(user_id, date)
);

GRANT SELECT, INSERT, UPDATE ON public.learning_stats TO authenticated;
GRANT ALL ON public.learning_stats TO service_role;

ALTER TABLE public.learning_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own learning stats" ON public.learning_stats
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 9. Security Definer Function for Role Check
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 10. Admin Policies
CREATE POLICY "Admins can manage messages" ON public.messages
    FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage quizzes" ON public.quizzes
    FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 11. Initial Data Insertion
INSERT INTO public.messages (subject, content, source, tag, scheduled_hour) VALUES
('CDI - Contrat à Durée Indéterminée', 'Le CDI est la forme normale du contrat de travail en France. Il n''a pas de date de fin. Il peut être rompu par : démission, licenciement, rupture conventionnelle ou départ à la retraite. Article L1221-1 du Code du travail.', 'https://legifrance.gouv.fr/Code_du_travail/Article_L1221-1', 'Droit du travail', '07:00:00'),
('CDD - Contrat à Durée Déterminée', 'Le CDD est un contrat temporaire. Durée maximale : 18 mois (24 mois dans certains cas). Motifs autorisés : remplacement d''un salarié, accroissement temporaire d''activité, emploi saisonnier. Article L1241-1 du Code du travail.', 'https://legifrance.gouv.fr/Code_du_travail/Article_L1241-1', 'Droit du travail', '09:45:00'),
('Période d''essai', 'Durée légale : 2 mois pour les ouvriers/employés, 3 mois pour les agents de maîtrise/techniciens, 4 mois pour les cadres. Renouvellement possible une fois, avec accord du salarié. Article L1221-19 du Code du travail.', 'https://legifrance.gouv.fr/Code_du_travail/Article_L1221-19', 'Droit du travail', '12:30:00'),
('Licenciement : motifs et procédure', 'Motifs valables : faute (grave, lourde), inaptitude, motif économique. Procédure : convocation à entretien préalable, lettre de licenciement, respect du préavis. Article L1234-1 du Code du travail.', 'https://legifrance.gouv.fr/Code_du_travail/Article_L1234-1', 'Droit du travail', '15:15:00'),
('Rupture conventionnelle', 'Accord entre employeur et salarié pour rompre un CDI. Indemnité légale = minimum 1/5ème de mois par année d''ancienneté. Délai de rétractation : 15 jours. Article L1237-11 du Code du travail.', 'https://legifrance.gouv.fr/Code_du_travail/Article_L1237-11', 'Droit du travail', '18:00:00'),
('Salaire minimum (Smic)', 'Smic horaire brut 2025 : 11,65€ (estimation). Smic mensuel brut : 1 766,92€ (35h). Revalorisation annuelle. Article L3231-2 du Code du travail.', 'https://legifrance.gouv.fr/Code_du_travail/Article_L3231-2', 'Droit du travail', '07:00:00'),
('Durée du travail', 'Durée légale : 35h/semaine. Heures supplémentaires : 25% de majoration (8 premières), 50% (suivantes). Contingent annuel : 220h. Article L3121-27 du Code du travail.', 'https://legifrance.gouv.fr/Code_du_travail/Article_L3121-27', 'Droit du travail', '09:45:00'),
('Congés payés', 'Droit à 2,5 jours ouvrables par mois (30 jours/an). Acquisition du 1er juin au 31 mai. 10% de majoration pour fractionnement. Article L3141-3 du Code du travail.', 'https://legifrance.gouv.fr/Code_du_travail/Article_L3141-3', 'Droit du travail', '12:30:00'),
('Régions françaises : Île-de-France', 'Capitale : Paris (2,1M d''habitants). 12 millions d''habitants (19% du pays). 1er bassin d''emploi (5,5M d''emplois). PIB : 725 milliards € (25% du PIB français). Aéroports : CDG + Orly.', 'https://insee.fr/', 'Géographie', '15:15:00'),
('Culture : la gastronomie française', 'La France compte 196 restaurants étoilés Michelin (2ème au monde). 45 fromages AOP. 9 millions de touristes par an visitent les caves à vin. La baguette est inscrite au patrimoine immatériel de l''UNESCO.', 'https://culture.gouv.fr/', 'Culture', '18:00:00');

INSERT INTO public.quizzes (title, category, difficulty, questions) VALUES
('Bases du Droit du Travail', 'Droit du travail', 1, '[
  {"question": "En France, la durée légale du travail est de :", "options": ["35h", "37h", "39h", "40h"], "correct_index": 0},
  {"question": "La durée maximale d''un CDD (hors cas particuliers) est de :", "options": ["12 mois", "18 mois", "24 mois", "36 mois"], "correct_index": 1},
  {"question": "L''âge légal de départ à la retraite en 2025 est de :", "options": ["62 ans", "63 ans", "64 ans", "65 ans"], "correct_index": 2}
]'),
('Géographie de la France', 'Géographie', 1, '[
  {"question": "Quelle est la plus grande région française en superficie ?", "options": ["Auvergne-Rhône-Alpes", "Nouvelle-Aquitaine", "Occitanie", "Grand Est"], "correct_index": 1},
  {"question": "Quelle région abrite le plus de sites UNESCO ?", "options": ["Occitanie", "Île-de-France", "Bretagne", "Normandie"], "correct_index": 1}
]');
