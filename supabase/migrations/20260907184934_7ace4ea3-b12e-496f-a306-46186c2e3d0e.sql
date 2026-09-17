CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  published_at date NOT NULL DEFAULT current_date,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author text NOT NULL,
  role text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.verses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL,
  text text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.leaders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.shirt_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  size text NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  whatsapp text NOT NULL,
  status text NOT NULL DEFAULT 'novo',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.news, public.experiences, public.gallery, public.testimonials, public.verses, public.leaders, public.site_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.news, public.experiences, public.gallery, public.testimonials, public.verses, public.leaders, public.site_content TO authenticated;
GRANT INSERT ON public.shirt_orders TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.shirt_orders TO authenticated;
GRANT ALL ON public.news, public.experiences, public.gallery, public.testimonials, public.verses, public.leaders, public.site_content, public.shirt_orders TO service_role;

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shirt_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read news" ON public.news FOR SELECT USING (true);
CREATE POLICY "admin write news" ON public.news FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "public read experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "admin write experiences" ON public.experiences FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "public read gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "admin write gallery" ON public.gallery FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "public read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "admin write testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "public read verses" ON public.verses FOR SELECT USING (true);
CREATE POLICY "admin write verses" ON public.verses FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "public read leaders" ON public.leaders FOR SELECT USING (true);
CREATE POLICY "admin write leaders" ON public.leaders FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "public read site_content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "admin write site_content" ON public.site_content FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "anyone can order" ON public.shirt_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "admin reads orders" ON public.shirt_orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin updates orders" ON public.shirt_orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin deletes orders" ON public.shirt_orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER t_news BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t_experiences BEFORE UPDATE ON public.experiences FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t_gallery BEFORE UPDATE ON public.gallery FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t_testimonials BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t_verses BEFORE UPDATE ON public.verses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t_leaders BEFORE UPDATE ON public.leaders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_content (key, value) VALUES
 ('about_title','Quem somos e o que fazemos'),
 ('about_text','Somos os Peregrinos da Fé, um grupo católico de Ibiporã (PR) que caminha unido pelo Caminho Jesus das Santas Chagas. Nossa missão é rezar, servir e acolher, percorrendo capelas, pontes e trilhas que ligam nossa gente à misericórdia de Deus.'),
 ('about_long','A caminhada nasceu do desejo de um pequeno grupo de fiéis de viver a fé com os pés no chão. A cada edição, dezenas de peregrinos partem da Paróquia São Rafael rumo ao Pico do Guarani, passando pelas Capelas São Sebastião e São Bento, pela Chácara Guarani e pela ponte do Rio Ribeirão Jacutinga.

Ao longo do ano promovemos encontros de oração, formação, ações sociais e mutirões de acolhida a novos peregrinos. Tudo o que fazemos é sustentado pela oração e pela generosidade de quem caminha conosco.'),
 ('shirt_subtitle','Camiseta oficial do 4º Caminho Jesus das Santas Chagas — tecido leve, estampa em alta definição, frente e verso.'),
 ('shirt_price','35'),
 ('shirt_old_price','40'),
 ('form_url','https://docs.google.com/forms/d/1MmgzjRj9tsQbe935TAxGMCVzhKFohE1cN5MhFcSOHZk/viewform'),
 ('order_email','estevaofrancisco867@gmail.com');

INSERT INTO public.news (title, summary, body, image_url, published_at, sort_order) VALUES
 ('4º Caminho Jesus das Santas Chagas reúne peregrinos em Ibiporã','Centenas de fiéis percorreram os 18 km entre a Paróquia São Rafael e o Pico do Guarani em clima de oração.','A quarta edição do Caminho Jesus das Santas Chagas reuniu peregrinos de várias cidades da região. A saída aconteceu ainda de madrugada, na Paróquia São Rafael, com bênção e envio.

Ao longo do percurso houve paradas de oração na Capela São Bento, na Chácara Guarani e na ponte do Rio Ribeirão Jacutinga. No alto do Pico do Guarani, a celebração da Santa Missa encerrou a jornada.

A organização agradece a todos os voluntários que cuidaram da água, do apoio médico e da sinalização da trilha.','https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80','2026-08-24',1),
 ('Mutirão de oração prepara a próxima peregrinação','Grupos se encontram semanalmente para rezar o terço e organizar a caminhada.','Todas as quintas-feiras, peregrinos se reúnem na comunidade para rezar o terço e planejar os detalhes da próxima edição do Caminho.

Os encontros são abertos a todos, inclusive a quem nunca peregrinou. Além da oração, são definidos os pontos de apoio, o transporte e a acolhida dos romeiros que chegam de fora.','https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1200&q=80','2026-07-15',2),
 ('Capela São Sebastião recebe nova sinalização da trilha','Placas e fitas foram instaladas por voluntários para orientar os caminhantes.','Um grupo de voluntários dedicou o fim de semana à sinalização do trecho entre a Capela São Sebastião e a Capela São Bento.

Foram instaladas placas com setas, fitas refletivas e pontos de hidratação. A intenção é tornar o percurso mais seguro, principalmente para quem caminha antes do amanhecer.','https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80','2026-06-02',3);

INSERT INTO public.experiences (title, description, image_url, sort_order) VALUES
 ('A subida ao Pico do Guarani','O silêncio da última subida, quando cada passo vira oração e a cruz aparece entre as árvores.','https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',1),
 ('Amanhecer na ponte do Jacutinga','O grupo atravessa a ponte cantando, com o rio refletindo as primeiras luzes do dia.','https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',2),
 ('Acolhida na Chácara Guarani','Café, pão e abraço: o ponto de apoio onde o cansaço vira alegria compartilhada.','https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=1200&q=80',3);

INSERT INTO public.gallery (title, image_url, sort_order) VALUES
 ('Trilha ao amanhecer','https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80',1),
 ('Cruz no alto do pico','https://images.unsplash.com/photo-1508361001413-7a9dca21d08a?auto=format&fit=crop&w=1000&q=80',2),
 ('Capela do caminho','https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1000&q=80',3),
 ('Estrada de terra','https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1000&q=80',4),
 ('Rio Ribeirão Jacutinga','https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1000&q=80',5),
 ('Fim da caminhada','https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1000&q=80',6);

INSERT INTO public.testimonials (author, role, message, sort_order) VALUES
 ('Maria Aparecida','Peregrina desde a 1ª edição','Caminhar com esse grupo curou feridas que eu carregava há anos. Por suas Chagas fomos curados.',1),
 ('João Batista','Voluntário do apoio','Servir água aos irmãos no meio da trilha me ensinou mais sobre o Evangelho do que muitos livros.',2),
 ('Cleusa Ribeiro','Peregrina','Subi o Pico do Guarani chorando e desci em paz. Foi o dia mais bonito da minha vida de fé.',3),
 ('Antônio Carlos','Peregrino','Achei que não daria conta dos 18 km. O grupo não me deixou parar. Ninguém caminha sozinho aqui.',4),
 ('Luciana Prado','Coordenadora de oração','Cada capela do caminho tem uma intenção. Rezamos pelas famílias, pelos doentes e pelos que já partiram.',5),
 ('Pedro Henrique','Jovem peregrino','Fui pela primeira vez com 16 anos, achando que era só uma trilha. Voltei querendo servir.',6);

INSERT INTO public.verses (reference, text, sort_order) VALUES
 ('Isaías 53,5','Ele foi ferido por causa das nossas transgressões e por suas chagas fomos curados.',1),
 ('Salmo 121,1-2','Levanto os meus olhos para os montes: de onde me virá o socorro? O meu socorro vem do Senhor.',2),
 ('Mateus 11,28','Vinde a mim todos vós que estais cansados e sobrecarregados, e eu vos aliviarei.',3),
 ('João 14,6','Eu sou o caminho, a verdade e a vida. Ninguém vai ao Pai senão por mim.',4),
 ('1 Pedro 2,24','Pelas suas chagas fostes curados.',5),
 ('Provérbios 3,5-6','Confia no Senhor de todo o teu coração e ele endireitará as tuas veredas.',6);

INSERT INTO public.leaders (name, role, bio, image_url, sort_order) VALUES
 ('Pe. Rafael Moretti','Assistente espiritual','Acompanha a peregrinação desde a primeira edição e celebra a Missa no alto do Pico do Guarani.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',1),
 ('Estêvão Francisco','Coordenador geral','Organiza o percurso, a segurança e a comunicação do grupo dos Peregrinos da Fé.','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',2),
 ('Marta Oliveira','Coordenadora de acolhida','Cuida da recepção dos romeiros, das inscrições e dos pontos de apoio ao longo da trilha.','https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',3),
 ('Sérgio Duarte','Coordenador de logística','Responsável pelo transporte, pela água e pelo apoio médico durante toda a caminhada.','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',4);