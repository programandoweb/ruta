<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class MakeRepository extends Command
{
    protected $signature = 'make:repository {name}';
    protected $description = 'Create a new repository class';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $name = $this->argument('name');
        $repositoryPath = app_path("Repositories/{$name}Repository.php");

        if (File::exists($repositoryPath)) {
            $this->error("Repository {$name} already exists!");
            return;
        }

        File::ensureDirectoryExists(app_path('Repositories'));

        $stub = File::get(resource_path('stubs/repository.stub'));

        $stub = str_replace('{{repositoryName}}', $name, $stub);

        File::put($repositoryPath, $stub);

        $this->info("Repository {$name} created successfully.");
    }
}
