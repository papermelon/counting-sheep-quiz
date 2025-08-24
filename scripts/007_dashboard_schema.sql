-- Create materialized view for latest scores per user per quiz
create materialized view if not exists user_latest_scores as
select distinct on (user_id, quiz_id)
  user_id, quiz_id, score, interpretation, created_at
from quiz_submissions
where user_id is not null
order by user_id, quiz_id, created_at desc;

-- Create index for performance
create index if not exists idx_user_latest_scores_user_id on user_latest_scores(user_id);

-- RLS not applicable to materialized views; read via secured RPC
create or replace function get_my_latest_scores()
returns setof quiz_submissions
language sql security definer
as $$
  select * from quiz_submissions
  where user_id = auth.uid()
  and id in (
    select id from (
      select id, row_number() over (partition by quiz_id order by created_at desc) rn
      from quiz_submissions where user_id = auth.uid()
    ) t where rn = 1
  );
$$;

-- Function to get historical scores for trends
create or replace function get_my_quiz_history(quiz_slug_param text default null)
returns setof quiz_submissions
language sql security definer
as $$
  select qs.* from quiz_submissions qs
  join quizzes q on qs.quiz_id = q.id
  where qs.user_id = auth.uid()
  and (quiz_slug_param is null or q.slug = quiz_slug_param)
  order by qs.created_at desc
  limit 50;
$$;

-- Refresh the materialized view (should be done periodically)
refresh materialized view user_latest_scores;
