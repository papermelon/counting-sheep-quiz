-- Insert PSQI quiz
insert into quizzes (slug, title, description, max_score)
values ('psqi', 'Pittsburgh Sleep Quality Index', 'Sleep quality over the past month', 21)
on conflict (slug) do nothing;

-- Insert PSQI questions (19 questions total covering 7 components)
insert into quiz_questions (quiz_slug, question_number, question_text, question_type, options) values
-- Component 1: Subjective Sleep Quality (Question 6)
('psqi', 1, 'During the past month, how would you rate your sleep quality overall?', 'radio', 
 array['Very good', 'Fairly good', 'Fairly bad', 'Very bad']),

-- Component 2: Sleep Latency (Questions 2 & 5a)
('psqi', 2, 'During the past month, how long (in minutes) has it usually taken you to fall asleep each night?', 'select',
 array['≤ 15 minutes', '16-30 minutes', '31-60 minutes', '> 60 minutes']),

('psqi', 3, 'During the past month, how often have you had trouble sleeping because you cannot get to sleep within 30 minutes?', 'radio',
 array['Not during the past month', 'Less than once a week', 'Once or twice a week', 'Three or more times a week']),

-- Component 3: Sleep Duration (Question 4)
('psqi', 4, 'During the past month, how many hours of actual sleep did you get at night? (This may be different than the number of hours you spent in bed.)', 'select',
 array['> 7 hours', '6-7 hours', '5-6 hours', '< 5 hours']),

-- Component 4: Habitual Sleep Efficiency (Questions 1, 3, 4)
('psqi', 5, 'During the past month, when have you usually gone to bed at night?', 'text',
 array['Enter usual bedtime (e.g., 10:30 PM)']),

('psqi', 6, 'During the past month, when have you usually gotten up in the morning?', 'text',
 array['Enter usual wake time (e.g., 7:00 AM)']),

-- Component 5: Sleep Disturbances (Questions 5b-5j)
('psqi', 7, 'During the past month, how often have you had trouble sleeping because you wake up in the middle of the night or early morning?', 'radio',
 array['Not during the past month', 'Less than once a week', 'Once or twice a week', 'Three or more times a week']),

('psqi', 8, 'During the past month, how often have you had trouble sleeping because you have to get up to use the bathroom?', 'radio',
 array['Not during the past month', 'Less than once a week', 'Once or twice a week', 'Three or more times a week']),

('psqi', 9, 'During the past month, how often have you had trouble sleeping because you cannot breathe comfortably?', 'radio',
 array['Not during the past month', 'Less than once a week', 'Once or twice a week', 'Three or more times a week']),

('psqi', 10, 'During the past month, how often have you had trouble sleeping because you cough or snore loudly?', 'radio',
 array['Not during the past month', 'Less than once a week', 'Once or twice a week', 'Three or more times a week']),

('psqi', 11, 'During the past month, how often have you had trouble sleeping because you feel too cold?', 'radio',
 array['Not during the past month', 'Less than once a week', 'Once or twice a week', 'Three or more times a week']),

('psqi', 12, 'During the past month, how often have you had trouble sleeping because you feel too hot?', 'radio',
 array['Not during the past month', 'Less than once a week', 'Once or twice a week', 'Three or more times a week']),

('psqi', 13, 'During the past month, how often have you had trouble sleeping because you had bad dreams?', 'radio',
 array['Not during the past month', 'Less than once a week', 'Once or twice a week', 'Three or more times a week']),

('psqi', 14, 'During the past month, how often have you had trouble sleeping because you have pain?', 'radio',
 array['Not during the past month', 'Less than once a week', 'Once or twice a week', 'Three or more times a week']),

('psqi', 15, 'During the past month, how often have you had trouble sleeping because of other reason(s)?', 'radio',
 array['Not during the past month', 'Less than once a week', 'Once or twice a week', 'Three or more times a week']),

-- Component 6: Use of Sleeping Medication (Question 7)
('psqi', 16, 'During the past month, how often have you taken medicine to help you sleep (prescribed or "over the counter")?', 'radio',
 array['Not during the past month', 'Less than once a week', 'Once or twice a week', 'Three or more times a week']),

-- Component 7: Daytime Dysfunction (Questions 8 & 9)
('psqi', 17, 'During the past month, how often have you had trouble staying awake while driving, eating meals, or engaging in social activity?', 'radio',
 array['Not during the past month', 'Less than once a week', 'Once or twice a week', 'Three or more times a week']),

('psqi', 18, 'During the past month, how much of a problem has it been for you to keep up enthusiasm to get things done?', 'radio',
 array['No problem at all', 'Only a very slight problem', 'Somewhat of a problem', 'A very big problem']),

('psqi', 19, 'Do you have a bed partner or room mate?', 'radio',
 array['No bed partner or room mate', 'Partner/room mate in other room', 'Partner in same room, but not same bed', 'Partner in same bed']);

-- Insert recommendation rules for PSQI
insert into recommendation_rules (quiz_slug, min_score, max_score, tips) values
('psqi', 0, 5, array[
  'Good sleep quality! You''re maintaining healthy sleep patterns.',
  'Continue your current sleep routine and environment.',
  'Keep consistent bedtime and wake times.',
  'Maintain good sleep hygiene practices.'
]),
('psqi', 6, 21, array[
  'Poor sleep quality detected. Consider improving your sleep habits.',
  'Try establishing a regular wake time, even on weekends.',
  'Limit screen time and caffeine in the evening.',
  'Create a relaxing bedtime routine.',
  'Consider consulting a healthcare provider if problems persist.',
  'Practice relaxation techniques before bed.'
]);
