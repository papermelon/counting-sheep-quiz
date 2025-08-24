-- STOP-BANG Quiz Implementation
-- 8 yes/no questions for OSA risk assessment

-- Insert the STOP-BANG quiz
INSERT INTO quizzes (slug, title, description, max_score)
VALUES ('stopbang', 'STOP-BANG', 'OSA risk screener', 8)
ON CONFLICT (slug) DO NOTHING;

-- Insert the 8 STOP-BANG questions
INSERT INTO quiz_questions (quiz_slug, question_number, question_text, question_type, options) VALUES
('stopbang', 1, 'Do you SNORE loudly (louder than talking or loud enough to be heard through closed doors)?', 'radio', 
 '[{"value": 0, "label": "No"}, {"value": 1, "label": "Yes"}]'),

('stopbang', 2, 'Do you often feel TIRED, fatigued, or sleepy during daytime?', 'radio',
 '[{"value": 0, "label": "No"}, {"value": 1, "label": "Yes"}]'),

('stopbang', 3, 'Has anyone OBSERVED you stop breathing during your sleep?', 'radio',
 '[{"value": 0, "label": "No"}, {"value": 1, "label": "Yes"}]'),

('stopbang', 4, 'Do you have or are you being treated for high blood PRESSURE?', 'radio',
 '[{"value": 0, "label": "No"}, {"value": 1, "label": "Yes"}]'),

('stopbang', 5, 'Is your BMI more than 35 kg/m²? (Or do you have a large neck circumference?)', 'radio',
 '[{"value": 0, "label": "No"}, {"value": 1, "label": "Yes"}]'),

('stopbang', 6, 'Are you over 50 years old?', 'radio',
 '[{"value": 0, "label": "No"}, {"value": 1, "label": "Yes"}]'),

('stopbang', 7, 'Is your neck circumference greater than 16 inches (40cm)?', 'radio',
 '[{"value": 0, "label": "No"}, {"value": 1, "label": "Yes"}]'),

('stopbang', 8, 'Are you male?', 'radio',
 '[{"value": 0, "label": "No"}, {"value": 1, "label": "Yes"}]')

ON CONFLICT (quiz_slug, question_number) DO NOTHING;

-- Insert recommendation rules for STOP-BANG risk bands
INSERT INTO recommendation_rules (quiz_slug, min_score, max_score, tips) VALUES
('stopbang', 0, 2, ARRAY[
  'Low risk for sleep apnea.',
  'Continue healthy sleep habits and monitor symptoms.',
  'Maintain regular sleep schedule and good sleep hygiene.',
  'If symptoms develop, consider reassessment.'
]),

('stopbang', 3, 4, ARRAY[
  'Intermediate risk for sleep apnea.',
  'Consider keeping a sleep diary to track symptoms.',
  'Discuss with a healthcare provider if symptoms persist.',
  'Monitor for worsening snoring or daytime fatigue.',
  'Consider lifestyle modifications like weight management.'
]),

('stopbang', 5, 8, ARRAY[
  'High risk for sleep apnea.',
  'Strongly consider professional sleep assessment.',
  'Discuss with your doctor about sleep study options.',
  'Sleep apnea treatment can significantly improve quality of life.',
  'Don''t delay - untreated sleep apnea has serious health consequences.'
])

ON CONFLICT (quiz_slug, min_score, max_score) DO NOTHING;
