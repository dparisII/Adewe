-- Seed data for 10 sections and 15 units per language
-- Run this after the main schema is created

-- First, ensure languages exist
INSERT INTO languages (code, name, native_name, flag, is_active) VALUES
  ('english', 'English', 'English', '🇬🇧', true),
  ('amharic', 'Amharic', 'አማርኛ', '🇪🇹', true),
  ('tigrinya', 'Tigrinya', 'ትግርኛ', '🇪🇷', true),
  ('oromo', 'Afaan Oromo', 'Afaan Oromoo', '🇪🇹', true),
  ('somali', 'Somali', 'Soomaali', '🇸🇴', true)
ON CONFLICT (code) DO NOTHING;

-- Create sections for each language (10 sections each)
-- Section themes: Basics, Greetings, Family, Food, Numbers, Colors, Animals, Travel, Work, Culture

-- Function to create sections and units for a language
DO $$
DECLARE
  lang RECORD;
  section_id UUID;
  unit_id UUID;
  section_names TEXT[] := ARRAY[
    'Basics', 'Greetings', 'Family', 'Food & Drinks', 'Numbers',
    'Colors & Shapes', 'Animals', 'Travel', 'Work & School', 'Culture'
  ];
  section_descriptions TEXT[] := ARRAY[
    'Learn the fundamentals of the language',
    'Common greetings and introductions',
    'Family members and relationships',
    'Food, drinks, and dining',
    'Numbers and counting',
    'Colors, shapes, and descriptions',
    'Animals and nature',
    'Travel and directions',
    'Work, school, and daily life',
    'Culture, traditions, and customs'
  ];
  unit_names TEXT[][] := ARRAY[
    -- Basics units
    ARRAY['Hello World', 'Basic Phrases', 'Simple Words', 'Pronunciation', 'Writing Basics',
          'Common Expressions', 'Yes and No', 'Please and Thanks', 'Questions', 'Answers',
          'Basic Verbs', 'Basic Nouns', 'Adjectives', 'Adverbs', 'Review'],
    -- Greetings units
    ARRAY['Morning Greetings', 'Evening Greetings', 'Formal Hello', 'Casual Hello', 'Goodbye',
          'How Are You', 'Nice to Meet You', 'Introductions', 'Names', 'Titles',
          'Polite Forms', 'Informal Forms', 'Phone Greetings', 'Letter Greetings', 'Review'],
    -- Family units
    ARRAY['Parents', 'Siblings', 'Grandparents', 'Extended Family', 'In-Laws',
          'Children', 'Cousins', 'Family Events', 'Relationships', 'Home Life',
          'Family Activities', 'Generations', 'Family Tree', 'Traditions', 'Review'],
    -- Food units
    ARRAY['Fruits', 'Vegetables', 'Meat & Fish', 'Grains', 'Dairy',
          'Beverages', 'Breakfast', 'Lunch', 'Dinner', 'Snacks',
          'Cooking', 'Restaurant', 'Traditional Food', 'Recipes', 'Review'],
    -- Numbers units
    ARRAY['1 to 10', '11 to 20', '21 to 100', 'Hundreds', 'Thousands',
          'Ordinals', 'Fractions', 'Math Terms', 'Time', 'Dates',
          'Money', 'Measurements', 'Phone Numbers', 'Addresses', 'Review'],
    -- Colors units
    ARRAY['Primary Colors', 'Secondary Colors', 'Shades', 'Patterns', 'Shapes',
          'Sizes', 'Textures', 'Descriptions', 'Comparisons', 'Art Terms',
          'Nature Colors', 'Fashion Colors', 'Home Decor', 'Emotions', 'Review'],
    -- Animals units
    ARRAY['Pets', 'Farm Animals', 'Wild Animals', 'Birds', 'Fish',
          'Insects', 'Reptiles', 'Mammals', 'Animal Sounds', 'Habitats',
          'Endangered Species', 'Animal Actions', 'Zoo', 'Safari', 'Review'],
    -- Travel units
    ARRAY['Transportation', 'Airport', 'Hotel', 'Directions', 'Maps',
          'Landmarks', 'Tourism', 'Booking', 'Luggage', 'Customs',
          'Currency', 'Emergency', 'Local Transport', 'Sightseeing', 'Review'],
    -- Work units
    ARRAY['Professions', 'Office', 'Meetings', 'Email', 'Phone Calls',
          'School Subjects', 'Classroom', 'Homework', 'Exams', 'Graduation',
          'Job Interview', 'Salary', 'Colleagues', 'Projects', 'Review'],
    -- Culture units
    ARRAY['Holidays', 'Festivals', 'Music', 'Dance', 'Art',
          'Literature', 'History', 'Religion', 'Sports', 'Games',
          'Clothing', 'Ceremonies', 'Customs', 'Etiquette', 'Review']
  ];
  i INT;
  j INT;
BEGIN
  FOR lang IN SELECT id, code FROM languages WHERE is_active = true LOOP
    -- Create 10 sections for each language
    FOR i IN 1..10 LOOP
      INSERT INTO sections (language_id, name, description, order_index, is_published)
      VALUES (lang.id, section_names[i], section_descriptions[i], i, true)
      RETURNING id INTO section_id;
      
      -- Create 15 units for each section
      FOR j IN 1..15 LOOP
        INSERT INTO units (section_id, language_id, title, description, order_index, is_published)
        VALUES (
          section_id,
          lang.id,
          unit_names[i][j],
          'Learn about ' || lower(unit_names[i][j]),
          j,
          true
        );
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- Create sample lessons for each unit (5 lessons per unit)
DO $$
DECLARE
  unit RECORD;
  lesson_types TEXT[] := ARRAY['vocabulary', 'grammar', 'listening', 'speaking', 'practice'];
BEGIN
  FOR unit IN SELECT id, title FROM units LOOP
    FOR i IN 1..5 LOOP
      INSERT INTO lessons (unit_id, title, description, order_index, xp_reward, is_published)
      VALUES (
        unit.id,
        lesson_types[i] || ' - ' || unit.title,
        'Practice ' || lesson_types[i] || ' skills',
        i,
        10,
        true
      );
    END LOOP;
  END LOOP;
END $$;

-- Verify the data
SELECT 
  l.name as language,
  COUNT(DISTINCT s.id) as sections,
  COUNT(DISTINCT u.id) as units
FROM languages l
LEFT JOIN sections s ON s.language_id = l.id
LEFT JOIN units u ON u.language_id = l.id
GROUP BY l.name
ORDER BY l.name;
