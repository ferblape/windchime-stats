default_run_options[:pty] = true

set :application, 'windchime-stats'
set :branch, "master"
set :scm, :git
set :git_shallow_clone, 1
set :scm_user, 'ubuntu'
set :use_sudo, false
set :repository, "git://github.com/ferblape/windchime-stats.git"
ssh_options[:forward_agent] = true
set :keep_releases, 5

set :appserver, '109.74.192.91'

role :app, appserver
role :web, appserver
role :db,  appserver, :primary => true

set :user,  'ubuntu'
set :port, "2222"

set(:deploy_to){
  "/home/ubuntu/www/windchime-stats"
}

after "deploy:update_code", :symlinks

task :symlinks, :roles => [:app] do
  run <<-CMD
    cp #{release_path}/config.example.json #{release_path}/config.json;
    ln -s #{shared_path}pids #{release_path}/;
  CMD
end

namespace :deploy do
  task :start, :roles => :app, :except => { :no_release => true } do
    run "#{current_path}/bin/windchime-stats.sh start"
    run "#{current_path}/bin/windchime-stats-realtime.sh start"
  end
  task :stop, :roles => :app, :except => { :no_release => true } do
    run "#{current_path}/bin/windchime-stats.sh stop"
    run "#{current_path}/bin/windchime-stats-realtime.sh stop"
  end
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "#{current_path}/bin/windchime-stats.sh restart"
    run "#{current_path}/bin/windchime-stats-realtime.sh restart"
  end
end