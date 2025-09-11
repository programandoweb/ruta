<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Storage;

class ImagesRouteProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register any application services.
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->app['router']->aliasMiddleware('image.path', \App\Http\Middleware\ImagePathMiddleware::class);
    }
}

namespace App\Http\Middleware;

use Closure;

class ImagePathMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $path = $request->input('image_path');

        if ($path && !filter_var($path, FILTER_VALIDATE_URL)) {
            $fullPath = public_path($path);

            if (file_exists($fullPath)) {
                $request->merge(['image_path' => url($path)]);
            }
        }

        return $next($request);
    }
}
