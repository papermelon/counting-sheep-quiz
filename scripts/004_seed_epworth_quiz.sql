-- Seed Epworth Sleepiness Scale quiz
INSERT INTO quizzes (slug, title, description, max_score)
VALUES ('epworth', 'Epworth Sleepiness Scale', 'Daytime sleepiness screener', 24)
ON CONFLICT (slug) DO NOTHING;

-- Create recommendation rules table if not exists
CREATE TABLE IF NOT EXISTS recommendation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_slug TEXT NOT NULL,
  min_score INT NOT NULL,
  max_score INT NOT NULL,
  tips TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert ESS recommendation rules
INSERT INTO recommendation_rules (quiz_slug, min_score, max_score, tips) VALUES
('epworth', 0, 10, ARRAY['Your score suggests typical sleepiness. Keep a consistent sleep schedule.', 'Maintain good sleep hygiene practices.', 'Aim for 7-9 hours of sleep per night.']),
('epworth', 11, 12, ARRAY['Mild excessive sleepiness detected.', 'Consider limiting late caffeine intake.', 'Establish a consistent wind-down routine before bed.', 'Monitor your sleep patterns for improvements.']),
('epworth', 13, 15, ARRAY['Moderate sleepiness detected.', 'Evaluate your sleep duration and quality.', 'Consider talking to a healthcare provider if sleepiness persists.', 'Avoid driving when feeling drowsy.']),
('epworth', 16, 24, ARRAY['Severe sleepiness detected.', 'Strongly consider seeking professional medical evaluation.', 'Avoid drowsy driving - this is a safety concern.', 'Discuss sleep disorders screening with your doctor.']);

-- Insert the 8 ESS questions
INSERT INTO quiz_questions (quiz_slug, question_number, question_text, question_type, options) VALUES
('epworth', 1, 'How likely are you to doze off or fall asleep while sitting and reading?', 'single_choice', 
 '[{"value": 0, "label": "Would never doze"}, {"value": 1, "label": "Slight chance of dozing"}, {"value": 2, "label": "Moderate chance of dozing"}, {"value": 3, "label": "High chance of dozing"}]'),

('epworth', 2, 'How likely are you to doze off or fall asleep while watching TV?', 'single_choice',
 '[{"value": 0, "label": "Would never doze"}, {"value": 1, "label": "Slight chance of dozing"}, {"value": 2, "label": "Moderate chance of dozing"}, {"value": 3, "label": "High chance of dozing"}]'),

('epworth', 3, 'How likely are you to doze off or fall asleep while sitting inactive in a public place (e.g., theater or meeting)?', 'single_choice',
 '[{"value": 0, "label": "Would never doze"}, {"value": 1, "label": "Slight chance of dozing"}, {"value": 2, "label": "Moderate chance of dozing"}, {"value": 3, "label": "High chance of dozing"}]'),

('epworth', 4, 'How likely are you to doze off or fall asleep as a passenger in a car for an hour without a break?', 'single_choice',
 '[{"value": 0, "label": "Would never doze"}, {"value": 1, "label": "Slight chance of dozing"}, {"value": 2, "label": "Moderate chance of dozing"}, {"value": 3, "label": "High chance of dozing"}]'),

('epworth', 5, 'How likely are you to doze off or fall asleep while lying down to rest in the afternoon when circumstances permit?', 'single_choice',
 '[{"value": 0, "label": "Would never doze"}, {"value": 1, "label": "Slight chance of dozing"}, {"value": 2, "label": "Moderate chance of dozing"}, {"value": 3, "label": "High chance of dozing"}]'),

('epworth', 6, 'How likely are you to doze off or fall asleep while sitting and talking to someone?', 'single_choice',
 '[{"value": 0, "label": "Would never doze"}, {"value": 1, "label": "Slight chance of dozing"}, {"value": 2, "label": "Moderate chance of dozing"}, {"value": 3, "label": "High chance of dozing"}]'),

('epworth', 7, 'How likely are you to doze off or fall asleep while sitting quietly after a lunch without alcohol?', 'single_choice',
 '[{"value": 0, "label": "Would never doze"}, {"value": 1, "label": "Slight chance of dozing"}, {"value": 2, "label": "Moderate chance of dozing"}, {"value": 3, "label": "High chance of dozing"}]'),

('epworth', 8, 'How likely are you to doze off or fall asleep in a car while stopped for a few minutes in traffic?', 'single_choice',
 '[{"value": 0, "label": "Would never doze"}, {"value": 1, "label": "Slight chance of dozing"}, {"value": 2, "label": "Moderate chance of dozing"}, {"value": 3, "label": "High chance of dozing"}]');
