default_run_options[:pty] = true
ssh_options[:forward_agent] = true

set :application, "windchime-stats"
set :branch, "master"
set :scm, :git
set :git_shallow_clone, 1
set :scm_user, "ubuntu"
set :use_sudo, false
set :repository, "git://github.com/ferblape/#{application}.git"
set :keep_releases, 5
set :normalize_asset_timestamps, false
set :appserver, "109.74.192.91"
set :user, "ubuntu"
set :port, "2222"
set :deploy_to, "/home/ubuntu/www/#{application}"

role :app, appserver
role :web, appserver
role :db,  appserver, :primary => true

after "deploy:update_code", :symlinks, :install_dependencies

desc "Symlink folders"
task :symlinks, :roles => [:app] do
  run "ln -s #{shared_path}/pids #{release_path}/;"
end

desc "Runs `npm install` command"
task :install_dependencies, :roles => [:app] do
  run "cd #{release_path}; npm install"
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