-- Seed recommendations for each assessment type

-- Epworth Sleepiness Scale recommendations
INSERT INTO public.recommendations (assessment_type, score_range_min, score_range_max, title, description, severity_level) VALUES
('epworth', 0, 7, 'Normal Daytime Sleepiness', 'Your score suggests normal levels of daytime sleepiness. You appear to be getting adequate sleep and maintaining good alertness during the day.', 'low'),
('epworth', 8, 9, 'Mild Excessive Daytime Sleepiness', 'Your score indicates mild excessive daytime sleepiness. Consider evaluating your sleep habits and schedule. If symptoms persist, consult a healthcare provider.', 'moderate'),
('epworth', 10, 15, 'Moderate Excessive Daytime Sleepiness', 'Your score suggests moderate excessive daytime sleepiness. This may indicate a sleep disorder. We recommend consulting with a sleep specialist for further evaluation.', 'high'),
('epworth', 16, 24, 'Severe Excessive Daytime Sleepiness', 'Your score indicates severe excessive daytime sleepiness. This strongly suggests a sleep disorder that requires immediate medical attention. Please consult a healthcare provider promptly.', 'severe');

-- STOP-BANG recommendations
INSERT INTO public.recommendations (assessment_type, score_range_min, score_range_max, title, description, severity_level) VALUES
('stop_bang', 0, 2, 'Low Risk for Sleep Apnea', 'Your score suggests a low risk for obstructive sleep apnea. Continue maintaining healthy sleep habits and monitor any changes in sleep quality.', 'low'),
('stop_bang', 3, 4, 'Intermediate Risk for Sleep Apnea', 'Your score indicates an intermediate risk for obstructive sleep apnea. Consider discussing your sleep patterns with a healthcare provider, especially if you experience symptoms like loud snoring or daytime fatigue.', 'moderate'),
('stop_bang', 5, 8, 'High Risk for Sleep Apnea', 'Your score suggests a high risk for obstructive sleep apnea. We strongly recommend consulting with a sleep specialist for comprehensive evaluation and possible sleep study.', 'high');

-- PSQI recommendations
INSERT INTO public.recommendations (assessment_type, score_range_min, score_range_max, title, description, severity_level) VALUES
('psqi', 0, 5, 'Good Sleep Quality', 'Your score indicates good overall sleep quality. You appear to have healthy sleep patterns and adequate rest. Continue your current sleep habits.', 'low'),
('psqi', 6, 10, 'Moderate Sleep Quality Issues', 'Your score suggests some sleep quality concerns. Consider reviewing your sleep hygiene practices, bedroom environment, and daily routines that may affect sleep.', 'moderate'),
('psqi', 11, 21, 'Poor Sleep Quality', 'Your score indicates significant sleep quality issues. We recommend consulting with a healthcare provider or sleep specialist to address these concerns and improve your sleep health.', 'high');

-- Combined assessment recommendations
INSERT INTO public.recommendations (assessment_type, score_range_min, score_range_max, title, description, severity_level) VALUES
('combined', 0, 0, 'Comprehensive Sleep Health Assessment', 'Based on your combined assessment results, we recommend focusing on the areas where you scored highest. Consider implementing good sleep hygiene practices and monitoring your progress.', 'low');
